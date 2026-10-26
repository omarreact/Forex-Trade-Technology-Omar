<?php
/** Explicit, repeatable import. Never runs on public theme activation. */
defined('ABSPATH') || exit;
function ftt_import_pages($dry_run=false) {
    if(!current_user_can('manage_options') && !(defined('WP_CLI')&&WP_CLI))return new WP_Error('ftt_forbidden','Administrators only');
    $directory=get_stylesheet_directory().'/source/content/pages/';
    $map=ftt_source('content/site.config.json');
    $routing=$map['routing']['paths']??array();
    $result=array('created'=>array(),'updated'=>array(),'skipped'=>array());
    $paths=array();
    foreach(glob($directory.'*.json') as $file) {
        $page=json_decode((string)file_get_contents($file),true);
        if(is_array($page)&&isset($page['slug'],$page['id']))$paths[]=$page;
    }
    usort($paths,function($a,$b){return substr_count($a['slug'],'/')<=>substr_count($b['slug'],'/');});
    foreach($paths as $source) {
        $target=trim((string)$source['slug'],'/');
        $segments=$target===''?array():explode('/',$target);
        $slug=$segments?array_pop($segments):'front-page';
        $parent=0;
        $parent_path='';
        foreach($segments as $segment){
            $parent_path.=($parent_path?'/':'').$segment;
            $existing=get_page_by_path($parent_path,OBJECT,'page');
            if(!$existing&&!$dry_run){
                $id=wp_insert_post(array('post_type'=>'page','post_status'=>'publish','post_name'=>$segment,'post_title'=>ucwords(str_replace('-',' ',$segment)),'post_parent'=>$parent));
                if(is_wp_error($id))return $id;
                $parent=(int)$id;
            }elseif($existing)$parent=(int)$existing->ID;
        }
        $existing=get_page_by_path($target ?: 'front-page',OBJECT,'page');
        $post_content='';
        $top=$source['pageTop']??array();
        if(($top['variant']??'')==='homeSlider'){
            $post_content.=serialize_block(array('blockName'=>'forex-trade-technology/home-slider','attrs'=>array('slides'=>$top['slides']??array(),'autoplay'=>$top['autoplay']??true,'intervalMs'=>$top['intervalMs']??6000),'innerBlocks'=>array(),'innerHTML'=>'','innerContent'=>array()));
        }else{
            $heading=$top['title']??$source['hero']['title']??'';
            $post_content.=serialize_block(array('blockName'=>'core/group','attrs'=>array('className'=>'ftt-hero','layout'=>array('type'=>'constrained')),'innerBlocks'=>array(
                array('blockName'=>'core/heading','attrs'=>array('level'=>1),'innerBlocks'=>array(),'innerHTML'=>'<h1>'.esc_html($heading).'</h1>','innerContent'=>array('<h1>'.esc_html($heading).'</h1>'))
            ),'innerHTML'=>'','innerContent'=>array(null)));
        }
        foreach((array)($source['sections']??array()) as $section){
            $layout=$section['layout']??'stack';
            if($layout==='ctaBand'||($layout==='mediaBand'&&$source['id']!=='home'))continue;
            $name='forex-trade-technology/section';$attrs=array('section'=>$section);
            if($source['id']==='home'&&($section['title']??'')==='How Your Trading Stack Connects'){$name='forex-trade-technology/trading-stack-flow';$attrs['visual']=array();}
            if($source['id']==='contact'&&$layout==='splitContent'&&($section['title']??'')==='Request a Consultation'){$name='forex-trade-technology/contact-form';$attrs=array();}
            if($layout==='iconRow'){$name='forex-trade-technology/trust-carousel';$attrs=array('items'=>$section['items']??array());}
            $post_content.=serialize_block(array('blockName'=>$name,'attrs'=>$attrs,'innerBlocks'=>array(),'innerHTML'=>'','innerContent'=>array()));
        }
        $post=array('post_type'=>'page','post_status'=>'publish','post_name'=>$slug,'post_title'=>$top['title']??$source['hero']['title']??ucwords($slug),'post_excerpt'=>$source['seo']['description']??'','post_content'=>$post_content,'post_parent'=>$parent);
        if($dry_run){$result['skipped'][]=$source['slug'];continue;}
        if($existing){$post['ID']=$existing->ID;$id=wp_update_post($post,true);$bucket='updated';}
        else {$id=wp_insert_post($post,true);$bucket='created';}
        if(is_wp_error($id))return $id;
        update_post_meta($id,'_ftt_page_id',sanitize_key($source['id']));
        update_post_meta($id,'_ftt_seo_title',sanitize_text_field($source['seo']['title']??''));
        update_post_meta($id,'_ftt_canonical_path',sanitize_text_field($source['seo']['canonicalPath']??''));
        $result[$bucket][]=$source['slug'];
        if($source['id']==='home'){
            update_option('show_on_front','page');
            update_option('page_on_front',$id);
        }
    }
    return $result;
}
if(defined('WP_CLI')&&WP_CLI){
    WP_CLI::add_command('ftt import',function($args,$assoc){
        $result=ftt_import_pages(isset($assoc['dry-run']));
        if(is_wp_error($result))WP_CLI::error($result->get_error_message());
        WP_CLI::success(wp_json_encode($result,JSON_PRETTY_PRINT));
    });
}
add_action('admin_menu',function(){
    add_management_page('Import Forex Trade Technology','Import FTT pages','manage_options','ftt-import',function(){
        if(!current_user_can('manage_options'))return;
        if(isset($_POST['ftt_import'])&&check_admin_referer('ftt_import')){
            $result=ftt_import_pages(false);
            echo '<div class="notice notice-info"><p>'.esc_html(is_wp_error($result)?$result->get_error_message():wp_json_encode($result)).'</p></div>';
        }
        echo '<div class="wrap"><h1>Import 13 Forex Trade Technology pages</h1><p>Creates or updates the pages from the bundled read-only JSON source. Back up existing pages before importing again.</p><form method="post">';
        wp_nonce_field('ftt_import');
        submit_button('Import / update pages','primary','ftt_import');
        echo '</form></div>';
    });
});
