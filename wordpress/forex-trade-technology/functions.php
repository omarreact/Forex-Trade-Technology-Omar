<?php
/**
 * Forex Trade Technology FSE theme - isolated from Next.js.
 * All public content is escaped; API credentials belong in plugin options.
 */
defined('ABSPATH') || exit;
require_once __DIR__ . '/inc/render.php';
require_once __DIR__ . '/inc/import.php';
add_action('after_setup_theme', function () {
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_editor_style('assets/css/editor.css');
});
add_action('wp_enqueue_scripts', function () {
    $version = wp_get_theme()->get('Version');
    wp_enqueue_style('ftt-front', get_theme_file_uri('assets/css/front.css'), array(), $version);
    wp_enqueue_script('ftt-view', get_theme_file_uri('assets/js/view.js'), array(), $version, true);
});
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('ftt-editor', get_theme_file_uri('assets/js/editor.js'),
        array('wp-blocks','wp-element','wp-components','wp-block-editor','wp-server-side-render'), wp_get_theme()->get('Version'), true);
});
add_action('init', function () {
    $slugs = array('section','home-slider','trading-stack-flow','trust-carousel','audience-carousel','icon-card','contact-form');
    foreach ($slugs as $slug) {
        register_block_type(__DIR__ . '/blocks/' . $slug, array('render_callback'=>'ftt_render_block'));
    }
});
