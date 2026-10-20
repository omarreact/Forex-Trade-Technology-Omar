<?php
/**
 * Conservative first-activation content seeding. Only CREATE missing paths.
 * Existing posts, content, front-page settings, and editorial changes remain untouched.
 * Regenerate or update existing pages explicitly with the bundled WP-CLI importer.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function ftt_seed_source_pages_on_activation() {
    $path = get_template_directory() . '/assets/content/page-manifest.json';
    if ( ! is_readable( $path ) ) { return; }
    $rows = json_decode( file_get_contents( $path ), true );
    if ( ! is_array( $rows ) ) { return; }
    $created = 0;
    $home_id = 0;
    foreach ( $rows as $row ) {
        if ( empty( $row['route'] ) || empty( $row['file'] ) || empty( $row['title'] ) ) { continue; }
        $route = trim( $row['route'], '/' );
        if ( '' === $route ) { $route = 'home'; }
        $exists = get_page_by_path( $route, OBJECT, 'page' );
        if ( $exists ) {
            if ( '/' === $row['route'] ) { $home_id = $exists->ID; }
            continue;
        }
        $html_file = get_template_directory() . '/assets/content/pages/' . basename( $row['file'] );
        if ( ! is_readable( $html_file ) ) { continue; }
        $html = file_get_contents( $html_file );
        if ( is_string( $html ) ) { $html = str_replace( 'FTT_THEME_URI', esc_url( get_template_directory_uri() ), $html ); }
        if ( ! is_string( $html ) || false === strpos( $html, '<!-- wp:' ) ) { continue; }
        $slugs = explode( '/', $route );
        $parent_id = 0;
        foreach ( array_slice( $slugs, 0, -1 ) as $parent_slug ) {
            $parent_path = $parent_id ? get_page_uri( $parent_id ) . '/' . $parent_slug : $parent_slug;
            $parent = get_page_by_path( $parent_path, OBJECT, 'page' );
            if ( $parent ) { $parent_id = $parent->ID; continue; }
            $parent_id = wp_insert_post( array(
                'post_type' => 'page', 'post_status' => 'publish',
                'post_title' => ucwords( str_replace( '-', ' ', $parent_slug ) ),
                'post_name' => $parent_slug, 'post_parent' => $parent_id,
                'post_content' => '',
            ), true );
            if ( is_wp_error( $parent_id ) ) { $parent_id = 0; break; }
        }
        if ( count( $slugs ) > 1 && ! $parent_id ) { continue; }
        $id = wp_insert_post( wp_slash( array(
            'post_type' => 'page', 'post_status' => 'publish',
            'post_title' => $row['title'], 'post_name' => end( $slugs ),
            'post_parent' => $parent_id, 'post_content' => $html,
        ) ), true );
        if ( is_wp_error( $id ) ) { continue; }
        $created++;
        update_post_meta( $id, '_ftt_seo_title', sanitize_text_field( $row['seo_title'] ?? '' ) );
        update_post_meta( $id, '_ftt_meta_description', sanitize_text_field( $row['meta_description'] ?? '' ) );
        update_post_meta( $id, '_ftt_primary_keyword', sanitize_text_field( $row['primary_keyword'] ?? '' ) );
        update_post_meta( $id, '_ftt_source_document', esc_url_raw( $row['source_document_url'] ?? '' ) );
        if ( '/' === $row['route'] ) { $home_id = $id; }
        else { update_post_meta( $id, '_wp_page_template', 'page-forex-content' ); }
    }
    // Respect established sites: select generated homepage only where no static front page exists.
    if ( $home_id && ! absint( get_option( 'page_on_front' ) ) ) {
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $home_id );
    }
    update_option( 'ftt_last_activation_seed_count', $created, false );
    update_option( 'ftt_last_activation_seed_time', current_time( 'mysql' ), false );
}
add_action( 'after_switch_theme', 'ftt_seed_source_pages_on_activation' );

function ftt_activation_status_notice() {
    if ( ! current_user_can( 'manage_options' ) || ! get_option( 'ftt_last_activation_seed_time' ) ) { return; }
    $count = (int) get_option( 'ftt_last_activation_seed_count', 0 );
    echo '<div class="notice notice-info is-dismissible"><p>' . esc_html( sprintf(
        __( 'Forex Trade Technology: %d missing content pages were created on activation. Existing pages were preserved. The Forex CRM source is included. Review imported pages and configure contact form email delivery.', 'forex-trade-technology' ),
        $count
    ) ) . '</p></div>';
    delete_option( 'ftt_last_activation_seed_time' );
}
add_action( 'admin_notices', 'ftt_activation_status_notice' );


/** Allow administrators to seed missing pages after updating an already-active theme. */
function ftt_register_setup_submenu() {
    add_theme_page( __( 'FTT Site Setup', 'forex-trade-technology' ), __( 'FTT Site Setup', 'forex-trade-technology' ),
        'manage_options', 'ftt-site-setup', 'ftt_render_setup_page' );
}
add_action( 'admin_menu', 'ftt_register_setup_submenu' );
function ftt_render_setup_page() {
    if ( ! current_user_can( 'manage_options' ) ) { return; }
    $manifest = get_template_directory() . '/assets/content/page-manifest.json';
    $rows = is_readable( $manifest ) ? json_decode( file_get_contents( $manifest ), true ) : array();
    $missing = array();
    foreach ( (array) $rows as $row ) {
        $path = trim( $row['route'] ?? '', '/' );
        if ( ! get_page_by_path( $path ?: 'home', OBJECT, 'page' ) ) { $missing[] = $row['route']; }
    }
    echo '<div class="wrap"><h1>Forex Trade Technology — Site Setup</h1>';
    echo '<p>Source-backed content pages included: ' . esc_html( count( (array) $rows ) ) . '. Missing pages: ' . esc_html( count( $missing ) ) . '.</p>';
    echo '<p>Create Missing Pages preserves all existing edits and your homepage. To apply redesigned interior layouts to existing pages, use WP-CLI with --publish after making a backup (homepage skipped by default).</p>';
    echo '<p><strong>Forex CRM page:</strong> source-verified and included in this theme.</p>';
    if ( $missing ) {
        echo '<p>Missing routes: ' . esc_html( implode( ', ', $missing ) ) . '</p>';
        echo '<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">';
        wp_nonce_field( 'ftt_setup_missing_pages' );
        echo '<input type="hidden" name="action" value="ftt_setup_missing_pages">';
        submit_button( __( 'Create Missing Pages', 'forex-trade-technology' ) );
        echo '</form>';
    }
    echo '<p>To update existing imported pages from the original sources, use the bundled WP-CLI importer after a backup. It overwrites matching pages.</p>';
    echo '</div>';
}
function ftt_handle_setup_missing_pages() {
    if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'ftt_setup_missing_pages' ) ) {
        wp_die( esc_html__( 'Not authorized.', 'forex-trade-technology' ), '', array( 'response' => 403 ) );
    }
    ftt_seed_source_pages_on_activation();
    wp_safe_redirect( admin_url( 'themes.php?page=ftt-site-setup' ) );
    exit;
}
add_action( 'admin_post_ftt_setup_missing_pages', 'ftt_handle_setup_missing_pages' );
