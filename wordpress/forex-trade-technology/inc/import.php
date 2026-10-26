<?php
/** Import compiled native Gutenberg markup generated directly from website.xml. */
declare(strict_types=1);
defined('ABSPATH') || exit;

function ftt_xml_manifest(): array {
    $m=json_decode((string)file_get_contents(__DIR__.'/../data/manifest.json'),true);
    return is_array($m)?$m:[];
}
function ftt_xml_import(bool $dry_run=true,bool $update_managed=false,bool $adopt_legacy=false): array {
    if(!current_user_can('manage_options'))return ['error'=>'Administrator permission required'];
    $manifest=ftt_xml_manifest();$xml=__DIR__.'/../data/website.xml';
    if(!file_exists($xml)||empty($manifest['xmlSha256'])||!hash_equals($manifest['xmlSha256'],hash_file('sha256',$xml))){
        return ['error'=>'XML/content mismatch. Rebuild pages from website.xml using scripts/build-xml.py before import.'];
    }
    if(count($manifest['routes']??[])!==13)return ['error'=>'Incomplete canonical XML route manifest'];
    $result=['created'=>[],'updated'=>[],'skipped'=>[],'parents'=>[],'errors'=>[]];
    $parents=[];
    foreach ($manifest['routes'] as $key=>$url){
        $segments=array_values(array_filter(explode('/', trim((string)$url,'/'))));
        if(count($segments)>1)$parents[$segments[0]]=true;
    }
    foreach(array_keys($parents) as $parent_slug){
        if(get_page_by_path($parent_slug,OBJECT,'page')) continue;
        $result['parents'][]=$parent_slug;
        if($dry_run)continue;
        $p=wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_name'=>$parent_slug,
          'post_title'=>ucwords(str_replace('-',' ',$parent_slug)),
          'post_content'=>'<!-- wp:paragraph --><p>Explore our technology solutions.</p><!-- /wp:paragraph -->'],true);
        if(is_wp_error($p))$result['errors'][]=$parent_slug.': '.$p->get_error_message();
        else update_post_meta($p,'_ftt_xml_route_parent',1);
    }
    foreach($manifest['routes'] as $source_id=>$path){
        $source_file=__DIR__.'/../data/pages/'.basename((string)$source_id).'.json';
        $content_file=__DIR__.'/../data/pages/'.basename((string)$source_id).'.html';
        if(!file_exists($source_file)||!file_exists($content_file)){$result['errors'][]='Missing XML-compiled page '.$source_id;continue;}
        $page=json_decode((string)file_get_contents($source_file),true);
        if(!is_array($page)||$page['slug']!==$path){$result['errors'][]='Page path mismatch '.$source_id;continue;}
        $parts=array_values(array_filter(explode('/',trim($path,'/'))));$leaf=$parts?array_pop($parts):'home';
        $parent=0;$parent_path='';
        foreach($parts as $part){$parent_path.=($parent_path?'/':'').$part;$found=get_page_by_path($parent_path,OBJECT,'page');if($found)$parent=(int)$found->ID;}
        $existing=get_page_by_path(ltrim($path,'/')?:'home',OBJECT,'page');
        if($existing&&!get_post_meta($existing->ID,'_ftt_xml_managed',true) && !($adopt_legacy && get_post_meta($existing->ID,'_ftt_import_managed',true))){
            $result['skipped'][]=$source_id.' (existing non-managed page)';continue;
        }
        if($existing&&!$update_managed && !($adopt_legacy && get_post_meta($existing->ID,'_ftt_import_managed',true))){$result['skipped'][]=$source_id.' (already imported; choose explicit update)';continue;}
        $record=['post_type'=>'page','post_status'=>'publish','post_name'=>$leaf,'post_parent'=>$parent,
            'post_title'=>$page['pageTop']['title']??$page['hero']['title']??ucwords($leaf),
            'post_content'=>(string)file_get_contents($content_file)];
        if($existing)$record['ID']=(int)$existing->ID;
        $result[$existing?'updated':'created'][]=$source_id;
        if($dry_run)continue;
        $post_id=wp_insert_post(wp_slash($record),true);
        if(is_wp_error($post_id)){$result['errors'][]=$source_id.': '.$post_id->get_error_message();continue;}
        update_post_meta($post_id,'_ftt_xml_managed',1);
        update_post_meta($post_id,'_ftt_xml_source_id',$source_id);
        update_post_meta($post_id,'_ftt_xml_seo',$page['seo']??[]);
        if(defined('RANK_MATH_VERSION')){
            update_post_meta($post_id,'rank_math_title',$page['seo']['title']??'');
            update_post_meta($post_id,'rank_math_description',$page['seo']['description']??'');
        } elseif(defined('WPSEO_VERSION')){
            update_post_meta($post_id,'_yoast_wpseo_title',$page['seo']['title']??'');
            update_post_meta($post_id,'_yoast_wpseo_metadesc',$page['seo']['description']??'');
        }
        if($source_id==='home'){update_option('show_on_front','page');update_option('page_on_front',$post_id);}
    }
    if(!$dry_run && !$result['errors'])flush_rewrite_rules();
    return $result;
}
add_action('admin_menu',static function ():void {
    add_management_page('Import from website.xml','Import Forex XML','manage_options','ftt-xml-import',static function ():void {
        if(!current_user_can('manage_options'))wp_die('Not allowed');
        echo '<div class="wrap"><h1>Import Forex Trade Technology from website.xml</h1>';
        echo '<p>13 pages, 87 sections and 42 FAQs compiled into editable native WordPress blocks. Dry-run first. Existing pages are never overwritten unless marked XML-managed and explicit update is selected. Back up the database before updates.</p>';
        $report=get_transient('ftt_xml_report_'.get_current_user_id());
        if($report){echo '<pre>'.esc_html(wp_json_encode($report,JSON_PRETTY_PRINT)).'</pre>';delete_transient('ftt_xml_report_'.get_current_user_id());}
        echo '<form method="post" action="'.esc_url(admin_url('admin-post.php')).'">';
        wp_nonce_field('ftt_xml_import');
        echo '<input type="hidden" name="action" value="ftt_xml_import">';
        echo '<p><label><input type="checkbox" name="dry_run" checked value="1"> Preview without writing (recommended)</label></p>';
        echo '<p><label><input type="checkbox" name="update_managed" value="1"> Update XML-managed pages (revisions preserved)</label></p>';
        echo '<p><label><input type="checkbox" name="adopt_legacy" value="1"> Explicitly migrate pages originally imported by the previous Forex theme (content replaced; use revisions/backup to recover edits)</label></p>'; 
        submit_button('Import XML pages');echo '</form></div>';
    });
});
add_action('admin_post_ftt_xml_import',static function ():void {
    if(!current_user_can('manage_options'))wp_die('Forbidden',403);
    check_admin_referer('ftt_xml_import');
    $result=ftt_xml_import(!empty($_POST['dry_run']),!empty($_POST['update_managed']),!empty($_POST['adopt_legacy']));
    set_transient('ftt_xml_report_'.get_current_user_id(),$result,120);
    wp_safe_redirect(admin_url('tools.php?page=ftt-xml-import'));exit;
});
if(defined('WP_CLI')&&WP_CLI){
    WP_CLI::add_command('ftt import',static function (array $args,array $assoc):void {
        $a=get_users(['role'=>'administrator','number'=>1]);if($a)wp_set_current_user($a[0]->ID);
        $result=ftt_xml_import(isset($assoc['dry-run']),isset($assoc['update-managed']),isset($assoc['adopt-legacy']));
        WP_CLI::log(wp_json_encode($result,JSON_PRETTY_PRINT));
        if(isset($result['error'])||!empty($result['errors']))WP_CLI::error('XML import incomplete');
        WP_CLI::success('XML import processed');
    });
}
