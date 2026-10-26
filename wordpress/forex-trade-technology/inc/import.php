<?php
declare(strict_types=1);
defined('ABSPATH') || exit;
/**
 * Deliberately opt-in importer. Runs only from Appearance -> Import Forex Content
 * or "wp ftt import". Existing non-FTT pages are not overwritten.
 */
function ftt_import_source_pages(bool $dryRun = false):array {
    if (!current_user_can('edit_theme_options')) return ['error'=>'Administrator permission required'];
    $result=['created'=>[],'updated'=>[],'skipped'=>[],'parents'=>[],'errors'=>[]];
    $files=glob(get_theme_file_path('data/pages/*.json'))?:[];
    $pages=[];foreach($files as $file){$data=json_decode((string)file_get_contents($file),true);if(is_array($data)&&!empty($data['id']))$pages[$data['id']]=$data;}
    if(count($pages)!==13)return ['error'=>'Expected 13 content page documents, got '.count($pages)];
    foreach(['solutions','products','technology'] as $parentSlug){
        $existing=get_page_by_path($parentSlug, OBJECT, 'page');
        if (!$existing && !$dryRun){
            $id=wp_insert_post(['post_type'=>'page','post_title'=>ucfirst($parentSlug),'post_name'=>$parentSlug,'post_status'=>'publish','post_content'=>'<!-- wp:paragraph --><p>Explore Forex Trade Technology solutions.</p><!-- /wp:paragraph -->'],true);
            if(is_wp_error($id)){$result['errors'][]=$id->get_error_message();continue;}
            update_post_meta($id,'_ftt_route_parent',1);
            $result['parents'][]=$parentSlug;
        }
    }
    foreach($pages as $id=>$page){
        $sourcePath=$page['slug'];
        $segments=array_values(array_filter(explode('/',$sourcePath)));
        $leaf=$segments?$segments[count($segments)-1]:'home';
        $parent= count($segments)>1 ? get_page_by_path($segments[0], OBJECT, 'page') : null;
        $parentId=$parent?$parent->ID:0;
        $path=ltrim($sourcePath,'/');
        $existing=$sourcePath==='/' ? get_page_by_path('home',OBJECT,'page') : get_page_by_path($path,OBJECT,'page');
        if($existing&&!get_post_meta($existing->ID,'_ftt_import_managed',true)){
            $result['skipped'][]=$id.' (existing page not managed by FTT)';
            continue;
        }
        $blocks=[];
        $top=$page['pageTop']??[];
        $blocks[]=($id==='home'&&($top['variant']??'')==='homeSlider')
            ?ftt_block_comment('home-slider',['slides'=>$top['slides']??[], 'autoplay'=>!empty($top['autoplay']), 'intervalMs'=>$top['intervalMs']??6000])
            :ftt_block_comment('page-hero',['page'=>['hero'=>$page['hero']??[],'pageTop'=>$top]]);
        $idx=0;
        foreach($page['sections'] as $section){
            $layout=$section['layout']??'stack';$title=$section['title']??'';
            if($layout==='ctaBand'||($layout==='mediaBand'&&$id!=='home'))continue;
            if($layout==='iconRow')$blocks[]=ftt_block_comment('trust-carousel',['items'=>$section['items']??[]]);
            elseif($id==='home'&&$title==='How Your Trading Stack Connects')
                $blocks[]=ftt_block_comment('trading-stack-flow',['section'=>$section,'visual'=>ftt_data('visual-labels.json')['tradingStackFlow']??[]]);
            elseif($title==='Who We Work With'&&count(array_filter($section['blocks']??[],fn($b)=>($b['type']??'')==='h3')))
                $blocks[]=ftt_block_comment('audience-carousel',['title'=>$title,'items'=>ftt_groups_as_items($section['blocks']??[],['building','server','users','settings'])]);
            elseif($layout==='splitContent'&&$title==='Request a Consultation')
                $blocks[]=ftt_block_comment('contact-form',['copy'=>ftt_data('form.config.json')]);
            else $blocks[]=ftt_block_comment('section',['section'=>$section,'pageId'=>$id,'index'=>$idx,'pageTitle'=>$id==='home'?'Forex Trade Technology':($top['title']??$page['hero']['title']??'')]);
            $idx++;
        }
        $blocks[]=ftt_block_comment('guide',['pageId'=>$id]);
        if(!empty($page['documentFooterNotes']))$blocks[]=ftt_block_comment('document-notes',['notes'=>$page['documentFooterNotes']]);
        // Final CTA is in a shared template part; never duplicate JSON ctaBand here.
        $record=[
            'post_type'=>'page','post_status'=>'publish',
            'post_title'=>($top['title']??$page['hero']['title']??$id),
            'post_name'=>$leaf,'post_parent'=>$parentId,
            'post_content'=>implode("\n",$blocks),
        ];
        if($dryRun){$result[$existing?'updated':'created'][]=$id;continue;}
        if($existing)$record['ID']=$existing->ID;
        $postId=wp_insert_post(wp_slash($record),true);
        if(is_wp_error($postId)){$result['errors'][]=$id.': '.$postId->get_error_message();continue;}
        update_post_meta($postId,'_ftt_import_managed',1);
        update_post_meta($postId,'_ftt_source_id',$id);
        update_post_meta($postId,'_ftt_source_path',$sourcePath);
        update_post_meta($postId,'_ftt_seo',$page['seo']??[]);
        $result[$existing?'updated':'created'][]=$id;
        if($id==='home'){
            update_option('show_on_front','page');
            update_option('page_on_front',$postId);
        }
    }
    if(!$dryRun)flush_rewrite_rules();
    return $result;
}
add_action('admin_menu', function ():void{
    add_theme_page('Import Forex Content','Import Forex Content','edit_theme_options','ftt-import',function():void{
        if(!current_user_can('edit_theme_options'))wp_die('Not allowed');
        echo '<div class="wrap"><h1>Forex Trade Technology — content importer</h1>';
        echo '<p>Imports 13 content pages and creates route parents (/solutions, /products, /technology). It preserves manually authored pages and overwrites only pages previously marked as FTT-managed. Back up the WordPress database first.</p>';
        $result=get_transient('ftt_last_import_'.get_current_user_id());
        if($result){echo '<pre>'.esc_html((string)wp_json_encode($result,JSON_PRETTY_PRINT)).'</pre>';delete_transient('ftt_last_import_'.get_current_user_id());}
        echo '<form method="post" action="'.esc_url(admin_url('admin-post.php')).'"><input type="hidden" name="action" value="ftt_import_pages">';
        wp_nonce_field('ftt_import_pages');
        echo '<p><label><input name="dry_run" type="checkbox" value="1" checked> Preview changes only (dry run)</label></p>';
        submit_button('Run importer');
        echo '</form></div>';
    });
});
add_action('admin_post_ftt_import_pages',function():void {
    if(!current_user_can('edit_theme_options'))wp_die('Not allowed',403);
    check_admin_referer('ftt_import_pages');
    $result=ftt_import_source_pages(isset($_POST['dry_run']));
    set_transient('ftt_last_import_'.get_current_user_id(),$result,120);
    wp_safe_redirect(admin_url('themes.php?page=ftt-import'));exit;
});
if(defined('WP_CLI')&&WP_CLI){
    WP_CLI::add_command('ftt import', function(array $args,array $assoc):void{
        $admin=get_users(['role'=>'administrator','number'=>1]);
        if($admin)wp_set_current_user($admin[0]->ID);
        $result=ftt_import_source_pages(isset($assoc['dry-run']));
        WP_CLI::log(wp_json_encode($result,JSON_PRETTY_PRINT));
        if(!empty($result['error'])||!empty($result['errors']))WP_CLI::error('Import incomplete.');
        WP_CLI::success('Source import finished.');
    });
}
