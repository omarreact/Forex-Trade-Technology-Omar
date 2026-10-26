<?php
/** Native WordPress FSE runtime. All site content is compiled from website.xml. */
declare(strict_types=1);
defined('ABSPATH') || exit;
define('FTT_XML_THEME_VERSION', '1.0.0-xml');
require_once __DIR__ . '/inc/import.php';
require_once __DIR__ . '/inc/render-interactive.php';

add_action('after_setup_theme', static function (): void {
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    add_editor_style('assets/css/editor.css');
});
add_action('init', static function (): void {
    register_block_pattern_category('forex-trade-technology', ['label'=>__('Forex Trade Technology','forex-trade-technology')]);
    foreach (['home-slider','trust-carousel','audience-carousel','trading-stack-flow','contact-form'] as $type) {
        register_block_type(__DIR__ . '/blocks/' . $type, [
            'render_callback'=>static function (array $attrs, string $content, WP_Block $block): string {
                return ftt_xml_render_interactive($block->name, $attrs);
            },
        ]);
    }
});

/** This hook reaches both the frontend and the block editor's iframe. */
add_action('enqueue_block_assets', static function (): void {
    wp_enqueue_style('ftt-xml-fonts','https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap',[],null);
    wp_enqueue_style('ftt-xml-front',get_theme_file_uri('assets/css/front.css'),[],FTT_XML_THEME_VERSION);
    wp_enqueue_style('ftt-xml-native',get_theme_file_uri('assets/css/native.css'),['ftt-xml-front'],FTT_XML_THEME_VERSION);
    if (is_admin()) wp_enqueue_style('ftt-xml-editor',get_theme_file_uri('assets/css/editor.css'),['ftt-xml-native'],FTT_XML_THEME_VERSION);
});
add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_script('ftt-xml-view',get_theme_file_uri('assets/js/view.js'),[],FTT_XML_THEME_VERSION,['in_footer'=>true,'strategy'=>'defer']);
    wp_localize_script('ftt-xml-view','fttXML', ['contactUrl'=>esc_url_raw(rest_url('ftt/v1/contact'))]);
});
add_action('enqueue_block_editor_assets', static function (): void {
    wp_enqueue_script('ftt-xml-editor-blocks',get_theme_file_uri('assets/js/editor.js'),[
        'wp-element','wp-blocks','wp-block-editor','wp-components','wp-server-side-render','wp-i18n'
    ],FTT_XML_THEME_VERSION,true);
});
add_filter('document_title_parts', static function (array $parts): array {
    $id=get_queried_object_id();$seo=$id?get_post_meta($id,'_ftt_xml_seo',true):[];
    if(is_array($seo)&&!empty($seo['title'])) $parts['title']=sanitize_text_field($seo['title']);
    return $parts;
});
add_action('wp_head', static function (): void {
    if(!is_page())return;
    $seo=get_post_meta(get_queried_object_id(),'_ftt_xml_seo',true);
    if(is_array($seo)&&!empty($seo['description'])) echo '<meta name="description" content="'.esc_attr($seo['description']).'">' . "\n";
},5);
