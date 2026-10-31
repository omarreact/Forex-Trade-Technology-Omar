<?php
/**
 * Forex Trade Technology — FSE theme. Independent of the Next.js runtime.
 * The contact transport lives in a separate plugin, never here.
 */
declare(strict_types=1);
defined('ABSPATH') || exit;
define('FTT_THEME_VERSION', '0.1.6');
require_once __DIR__ . '/inc/content.php';
require_once __DIR__ . '/inc/social.php';
require_once __DIR__ . '/inc/render.php';
require_once __DIR__ . '/inc/render-sections.php';
require_once __DIR__ . '/inc/form.php';
require_once __DIR__ . '/inc/import.php';

add_action('after_setup_theme', function (): void {
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');
});
/**
 * Shared front-end and Gutenberg iframe styles.
 * enqueue_block_editor_assets only styles the editor chrome; it does NOT
 * reliably place the original frontend CSS in the iframe content.
 * enqueue_block_assets reaches both front-end and the editor canvas (WP 6.3+).
 */
add_action('enqueue_block_assets', function (): void {
    wp_enqueue_style('ftt-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap', [], null);
    wp_enqueue_style('ftt-front', get_theme_file_uri('assets/css/front.css'), [], FTT_THEME_VERSION);
    wp_enqueue_style('ftt-parity', get_theme_file_uri('assets/css/wp-parity.css'), ['ftt-front'], FTT_THEME_VERSION);
    // Scoped native FSE preview styles: current header/footer layout remains unchanged.
    wp_enqueue_style('ftt-native-fse', get_theme_file_uri('assets/css/fse-native.css'), ['ftt-parity'], FTT_THEME_VERSION);
    if (is_admin()) {
        wp_enqueue_style('ftt-canvas', get_theme_file_uri('assets/css/editor.css'), ['ftt-parity'], FTT_THEME_VERSION);
    }
});
function ftt_enqueue_theme_assets(): void {
    wp_enqueue_script('ftt-front', get_theme_file_uri('assets/js/front.js'), [], FTT_THEME_VERSION, true);
    wp_localize_script('ftt-front', 'fttTheme', [
        'contactUrl' => esc_url_raw(rest_url('ftt/v1/contact')),
        'homeUrl' => esc_url_raw(home_url('/')),
    ]);
}
add_action('wp_enqueue_scripts', 'ftt_enqueue_theme_assets');
add_action('enqueue_block_editor_assets', function (): void {
    wp_enqueue_script(
        'ftt-block-editor',
        get_theme_file_uri('assets/js/editor.js'),
        ['wp-blocks','wp-element','wp-components','wp-block-editor','wp-server-side-render','wp-i18n'],
        FTT_THEME_VERSION,
        true
    );
    $public=ftt_config();
    wp_localize_script('ftt-block-editor','fttEditorConfig',[
        'navigation'=>$public['navigation']??[],
        'footer'=>$public['footer']??[],
        'copyright'=>$public['site']['copyright']??'',
        'images'=>ftt_data('source-theme.json')['assets']['images']??[]
    ]);
});
add_action('init', function (): void {
    foreach (glob(__DIR__ . '/blocks/*/block.json') ?: [] as $block) {
        register_block_type(dirname($block), ['render_callback' => 'ftt_render_dynamic_block']);
    }
});
add_filter('document_title_parts', function (array $parts): array {
    $postId = get_queried_object_id();
    if ($postId && ($seo = get_post_meta($postId, '_ftt_seo', true)) && !empty($seo['title'])) {
        $parts['title'] = sanitize_text_field($seo['title']);
    }
    return $parts;
});
add_action('wp_head', function (): void {
    if (!is_singular('page')) return;
    $seo = get_post_meta(get_queried_object_id(), '_ftt_seo', true);
    if (!is_array($seo)) return;
    if (!empty($seo['description'])) echo '<meta name="description" content="' . esc_attr($seo['description']) . '">' . "\n";
    // Canonical is derived from the installed WordPress site, never the Next.js source URL.
    echo '<link rel="canonical" href="' . esc_url(get_permalink()) . '">' . "\n";
}, 3);
