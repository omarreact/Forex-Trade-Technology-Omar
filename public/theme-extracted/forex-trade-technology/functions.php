<?php
/**
 * Forex Trade Technology theme bootstrap.
 * Full Site Editing: no PHP page templates and no external dependencies.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function ftt_setup_theme() {
    add_theme_support( 'editor-styles' );
    add_editor_style( 'style.css' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    load_theme_textdomain( 'forex-trade-technology', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'ftt_setup_theme' );

function ftt_enqueue_assets() {
    wp_enqueue_style( 'ftt-roadmap-styles', get_stylesheet_uri(), array(), wp_get_theme()->get( 'Version' ) );
    wp_enqueue_script( 'ftt-inline-nav', get_template_directory_uri() . '/assets/js/inline-menu.js', array(), wp_get_theme()->get( 'Version' ), array( 'in_footer' => true, 'strategy' => 'defer' ) );
    wp_add_inline_script( 'ftt-inline-nav', 'window.fttSiteHome=' . wp_json_encode( home_url( '/' ) ) . ';', 'before' );
}
add_action( 'wp_enqueue_scripts', 'ftt_enqueue_assets' );

/** Accessible form, identical styling and field order to the supplied HTML. */
function ftt_contact_form_shortcode() {
    $path = get_template_directory() . '/assets/html/contact-form.html';
    if ( ! is_readable( $path ) ) { return '<p>Contact form is temporarily unavailable.</p>'; }
    $markup = file_get_contents( $path ); // Shipped with the theme; not user-controlled.
    if ( false === $markup ) { return ''; }
    $open = '<form class="bs-contact-form" method="post" novalidate>';
    $actual = '<form class="bs-contact-form" method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
    $actual .= '<input type="hidden" name="action" value="ftt_send_roadmap_enquiry">';
    $actual .= wp_nonce_field( 'ftt_send_roadmap_enquiry', 'ftt_nonce', true, false );
    $markup = str_replace( $open, $actual, $markup );
    $state = isset( $_GET['ftt_form_status'] ) ? sanitize_key( wp_unslash( $_GET['ftt_form_status'] ) ) : '';
    $messages = array(
        'sent' => __( 'Thank you. Your enquiry has been sent.', 'forex-trade-technology' ),
        'error' => __( 'Unable to send. Please check the fields and try again.', 'forex-trade-technology' ),
        'mail_error' => __( 'Your enquiry could not be sent because mail delivery failed. Please try again later.', 'forex-trade-technology' ),
        'wait' => __( 'Please wait a moment before sending another enquiry.', 'forex-trade-technology' ),
    );
    if ( isset( $messages[$state] ) ) {
        $message = '<p class="bs-form-status' . ( 'sent' === $state ? '' : ' bs-error' ) . '" role="status" aria-live="polite">' . esc_html( $messages[$state] ) . '</p>';
        $markup = str_replace( '<p class="bs-form-status" role="status" aria-live="polite"></p>', $message, $markup );
    }
    return $markup;
}
add_shortcode( 'ftt_roadmap_contact_form', 'ftt_contact_form_shortcode' );
add_filter( 'render_block_core/shortcode', function( $content, $block ) {
    return false !== strpos( $block['innerHTML'], '[ftt_roadmap_contact_form]' ) ? ftt_contact_form_shortcode() : $content;
}, 10, 2 );

function ftt_redirect_after_contact( $status ) {
    $url = add_query_arg( 'ftt_form_status', sanitize_key( $status ), home_url( '/contact/' ) );
    wp_safe_redirect( $url . '#contact-form', 303 );
    exit;
}

function ftt_handle_roadmap_enquiry() {
    if ( 'POST' !== ( $_SERVER['REQUEST_METHOD'] ?? '' ) || ! isset( $_POST['ftt_nonce'] ) ||
        ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['ftt_nonce'] ) ), 'ftt_send_roadmap_enquiry' ) ) {
        wp_die( esc_html__( 'Request verification failed. Refresh the page and try again.', 'forex-trade-technology' ), '', array( 'response' => 403 ) );
    }
    if ( ! empty( $_POST['website'] ) ) { ftt_redirect_after_contact( 'sent' ); } // Honeypot.

    $name = sanitize_text_field( wp_unslash( $_POST['name'] ?? '' ) );
    $email = sanitize_email( wp_unslash( $_POST['email'] ?? '' ) );
    $contact = sanitize_text_field( wp_unslash( $_POST['contact'] ?? '' ) );
    $company = sanitize_text_field( wp_unslash( $_POST['company'] ?? '' ) );
    $message = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );
    $country = sanitize_text_field( wp_unslash( $_POST['country'] ?? '' ) );
    $interest = sanitize_text_field( wp_unslash( $_POST['interest'] ?? '' ) );
    $stage = sanitize_text_field( wp_unslash( $_POST['stage'] ?? '' ) );
    if ( strlen( trim( $name ) ) < 2 || strlen( $name ) > 100 || ! is_email( $email ) || strlen( $email ) > 150 ||
         strlen( $contact ) > 100 || strlen( $company ) > 120 || strlen( $country ) > 100 || strlen( $interest ) > 100 || strlen( $stage ) > 100 || strlen( trim( $message ) ) < 10 || strlen( $message ) > 4000 ) {
        ftt_redirect_after_contact( 'error' );
    }
    $ip = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? '' ) );
    $key = 'ftt_enquiry_' . hash_hmac( 'sha256', $ip, wp_salt( 'auth' ) );
    if ( get_transient( $key ) ) { ftt_redirect_after_contact( 'wait' ); }
    set_transient( $key, 1, MINUTE_IN_SECONDS );

    $to = get_option( 'admin_email' );
    $subject = 'Forex Trade Technology — Brokerage Technology Enquiry';
    $body = "Name: {$name}\nBusiness Email: {$email}\nPhone / WhatsApp: {$contact}\nCompany: {$company}\nCountry: {$country}\nInterest: {$interest}\nBusiness Stage: {$stage}\n\nYour project:\n{$message}";
    $headers = array( 'Content-Type: text/plain; charset=UTF-8', 'Reply-To: ' . $email );
    $sent = wp_mail( $to, $subject, $body, $headers );
    if ( ! $sent ) { delete_transient( $key ); }
    ftt_redirect_after_contact( $sent ? 'sent' : 'mail_error' );
}
add_action( 'admin_post_ftt_send_roadmap_enquiry', 'ftt_handle_roadmap_enquiry' );
add_action( 'admin_post_nopriv_ftt_send_roadmap_enquiry', 'ftt_handle_roadmap_enquiry' );

/** Resolve bundled image URLs through WordPress; photos remain native Image blocks. */
function ftt_home_image_markup( $content, $block ) {
    if ( 'core/image' !== $block['blockName'] || false === strpos( $content, '/assets/images/' ) ) { return $content; }
    $base = get_template_directory_uri();
    $content = str_replace( 'FTT_THEME_URI', esc_url( $base ), $content );
    $critical = false !== strpos( $block['attrs']['className'] ?? '', 'ftt-critical' );
    $content = str_replace( '<img ', '<img width="1200" height="900" decoding="async" loading="' . ( $critical ? 'eager' : 'lazy' ) . '"' . ( $critical ? ' fetchpriority="high"' : '' ) . ' ', $content );
    if ( preg_match( '~src="([^"]+)-1200\.webp"~', $content, $m ) ) {
        $prefix = $m[1];
        $content = str_replace( ' width="1200"', ' srcset="' . esc_url( $prefix . '-640.webp' ) . ' 640w, ' . esc_url( $prefix . '-1200.webp' ) . ' 1200w" sizes="100vw" width="1200"', $content );
    }
    return $content;
}
add_filter( 'render_block', 'ftt_home_image_markup', 10, 2 );

function ftt_home_has_seo_plugin() {
    return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' ) || defined( 'THE_SEO_FRAMEWORK_VERSION' );
}
function ftt_home_seo_title( $title ) {
    return is_front_page() && ! ftt_home_has_seo_plugin() ? 'Forex Broker Technology & Brokerage Solutions' : $title;
}
add_filter( 'pre_get_document_title', 'ftt_home_seo_title', 20 );
function ftt_home_metadata() {
    if ( ! is_front_page() ) { return; }
    $image = get_template_directory_uri() . '/assets/images/workstation-1200.webp';
    echo '<link rel="preload" as="image" href="' . esc_url( $image ) . '" imagesrcset="' . esc_url( get_template_directory_uri() . '/assets/images/workstation-640.webp' ) . ' 640w, ' . esc_url( $image ) . ' 1200w" imagesizes="100vw">' . "\n";
    if ( ftt_home_has_seo_plugin() ) { return; }
    $title = 'Forex Broker Technology & Brokerage Solutions';
    $description = 'Launch and scale your forex brokerage with MT5 and MT4 white label solutions, CRM, liquidity, hosting, APIs and complete brokerage technology.';
    $url = home_url( '/' );
    echo '<meta name="description" content="' . esc_attr( $description ) . '">' . "\n";
    if ( ! is_singular() ) { echo '<link rel="canonical" href="' . esc_url( $url ) . '">' . "\n"; }
    foreach ( array( 'og:type'=>'website', 'og:title'=>$title, 'og:description'=>$description, 'og:url'=>$url, 'og:image'=>$image, 'og:image:alt'=>'Financial analytics workstation', 'og:site_name'=>get_bloginfo('name') ) as $key=>$value ) {
        echo '<meta property="' . esc_attr( $key ) . '" content="' . esc_attr( $value ) . '">' . "\n";
    }
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
}
add_action( 'wp_head', 'ftt_home_metadata', 5 );

/** Safe additive setup. Runs only for an administrator, once per installation. */
function ftt_home_setup_content() {
    if ( ! current_user_can( 'manage_options' ) || get_option( 'ftt_home_setup_v3' ) ) { return; }
    if ( ! get_page_by_path( 'roadmap' ) ) {
        $id = wp_insert_post( array( 'post_type'=>'page', 'post_status'=>'publish', 'post_title'=>'Brokerage Roadmap', 'post_name'=>'roadmap', 'post_content'=>'' ), true );
        if ( is_wp_error( $id ) ) { return; }
        update_post_meta( $id, '_wp_page_template', 'page-roadmap' );
    }
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';
    foreach ( array( 'workstation'=>'Financial analytics workstation', 'analytics'=>'Business analytics laptop', 'datacenter'=>'Data center server infrastructure' ) as $name=>$alt ) {
        if ( get_option( 'ftt_media_' . $name ) ) { continue; }
        $source = get_template_directory() . '/assets/images/' . $name . '-1200.webp';
        if ( ! is_readable( $source ) ) { return; }
        $temp = wp_tempnam( $name . '.webp' );
        if ( ! copy( $source, $temp ) ) { return; }
        $id = media_handle_sideload( array( 'name'=>$name . '.webp', 'tmp_name'=>$temp ), 0, $alt );
        if ( is_wp_error( $id ) ) { @unlink( $temp ); return; }
        update_post_meta( $id, '_wp_attachment_image_alt', $alt );
        update_option( 'ftt_media_' . $name, $id, false );
    }
    update_option( 'ftt_home_setup_v3', 1, false );
}
add_action( 'init', 'ftt_home_setup_content', 30 );


function ftt_fallback_site_icon() {
    if ( ! has_site_icon() ) {
        echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( get_template_directory_uri() . '/assets/images/favicon.svg' ) . '">' . "\n";
    }
}
add_action( 'wp_head', 'ftt_fallback_site_icon', 2 );

function ftt_update_brand_title_once() { if ( current_user_can( 'manage_options' ) && ! get_option( 'ftt_brand_title_updated' ) ) { update_option( 'blogname', 'Forex Trade Technology' ); update_option( 'ftt_brand_title_updated', 1, false ); } }
add_action( 'init', 'ftt_update_brand_title_once', 5 );




/** Bundled content page enhancements and on-page SEO fields. */
add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page() && ! is_front_page() ) { return; }
    wp_enqueue_style( 'ftt-content-pages', get_template_directory_uri() . '/assets/css/content-pages.css', array( 'ftt-roadmap-styles' ), wp_get_theme()->get( 'Version' ) );
}, 20 );
add_action( 'after_setup_theme', function () { add_editor_style( 'assets/css/content-pages.css' ); }, 20 );
add_filter( 'pre_get_document_title', function ( $title ) {
    if ( ! is_singular( 'page' ) || ftt_home_has_seo_plugin() ) { return $title; }
    $value = get_post_meta( get_queried_object_id(), '_ftt_seo_title', true );
    return $value ? $value : $title;
}, 25 );
add_action( 'wp_head', function () {
    if ( ! is_singular( 'page' ) || ftt_home_has_seo_plugin() || is_front_page() ) { return; }
    $desc = get_post_meta( get_queried_object_id(), '_ftt_meta_description', true );
    if ( $desc ) { echo '<meta name="description" content="' . esc_attr( $desc ) . '">' . "\n"; }
}, 21 );

/** Optimized, opt-in experience layer. No site-wide animation library. */
function ftt_experience_assets() {
    if ( ! is_page() && ! is_front_page() ) { return; }
    $base = get_template_directory();
    wp_enqueue_style( 'ftt-experience', get_template_directory_uri() . '/assets/css/experience.css',
        array( 'ftt-content-pages' ), filemtime( $base . '/assets/css/experience.css' ) );
    if ( is_front_page() ) {
        wp_enqueue_script( 'ftt-hero-slider', get_template_directory_uri() . '/assets/js/hero-slider.js',
            array(), filemtime( $base . '/assets/js/hero-slider.js' ), array( 'in_footer' => true, 'strategy' => 'defer' ) );
    }
}
add_action( 'wp_enqueue_scripts', 'ftt_experience_assets', 25 );

/** Front-page only; applies to already-imported Gutenberg homepages without changing their content. */
function ftt_fullwidth_home_slider_styles() {
    if ( ! is_front_page() ) { return; }
    $file = get_template_directory() . '/assets/css/fullwidth-home-slider.css';
    if ( is_readable( $file ) ) {
        wp_enqueue_style( 'ftt-fullwidth-home-slider', get_template_directory_uri() . '/assets/css/fullwidth-home-slider.css',
            array( 'ftt-experience' ), filemtime( $file ) );
    }
}
add_action( 'wp_enqueue_scripts', 'ftt_fullwidth_home_slider_styles', 30 );
add_action( 'after_setup_theme', function() {
    add_editor_style( 'assets/css/fullwidth-home-slider.css' );
}, 30 );


function ftt_local_designer_editor_assets() {
    $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
    if ( ! $screen || 'page' !== $screen->post_type || ! current_user_can( 'edit_pages' ) ) { return; }
    $base = get_template_directory();
    wp_enqueue_script( 'ftt-local-designer', get_template_directory_uri() . '/assets/js/local-page-designer.js',
        array( 'wp-element','wp-components','wp-plugins','wp-edit-post','wp-data','wp-blocks' ),
        filemtime( $base . '/assets/js/local-page-designer.js' ), true );
    wp_enqueue_style( 'ftt-local-designer-editor', get_template_directory_uri() . '/assets/css/editor-designer.css',
        array(), filemtime( $base . '/assets/css/editor-designer.css' ) );
}
add_action( 'enqueue_block_editor_assets', 'ftt_local_designer_editor_assets' );
add_action( 'after_setup_theme', function () {
    add_editor_style( 'assets/css/experience.css' );
} );
require_once get_template_directory() . '/inc/activation-pages.php';

/** Interior layouts use a separate small stylesheet; homepage markup and styling are untouched. */
function ftt_interior_redesign_enqueue() {
    if ( ! is_singular( 'page' ) || is_front_page() ) { return; }
    if ( 'page-forex-content' !== get_post_meta( get_queried_object_id(), '_wp_page_template', true ) ) { return; }
    $file = get_template_directory() . '/assets/css/interior-redesign.css';
    if ( is_readable( $file ) ) {
        wp_enqueue_style( 'ftt-interior-redesign', get_template_directory_uri() . '/assets/css/interior-redesign.css', array( 'ftt-content-pages' ), filemtime( $file ) );
    }
}
add_action( 'wp_enqueue_scripts', 'ftt_interior_redesign_enqueue', 28 );
add_action( 'after_setup_theme', function () { add_editor_style( 'assets/css/interior-redesign.css' ); }, 28 );
