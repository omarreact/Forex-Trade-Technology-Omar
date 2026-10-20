<?php
/**
 * WordPress CLI only: import 23 verified Gutenberg content pages (22 Google Docs).
 * Usage: wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --dry-run
 *        wp eval-file wp-content/themes/forex-trade-technology/tools/import-pages.php -- --publish
 */
if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) { exit( 'WP-CLI only.' ); }
$flags = isset( $args ) && is_array( $args ) ? $args : array();
$publish = in_array( '--publish', $flags, true );
// Homepage is preserved unless explicitly opted in.
$include_home = in_array( '--include-home', $flags, true );
$manifest_file = dirname( __DIR__ ) . '/assets/content/page-manifest.json';
$rows = json_decode( file_get_contents( $manifest_file ), true );
if ( ! is_array( $rows ) ) { WP_CLI::error( 'Invalid manifest.' ); }
$seen = array();
foreach ( $rows as $row ) {
    if ( '/' === $row['route'] && ! $include_home ) { WP_CLI::log( 'SKIP (homepage preserved): /' ); continue; }
    $full = dirname( __DIR__ ) . '/assets/content/pages/' . basename( $row['file'] );
    $html = file_get_contents( $full );
    if ( is_string( $html ) ) { $html = str_replace( 'FTT_THEME_URI', esc_url( get_template_directory_uri() ), $html ); }
    if ( false === $html || false === strpos( $html, '<!-- wp:' ) ) { WP_CLI::error( 'Missing or invalid Gutenberg file: ' . $full ); }
    $route = trim( $row['route'], '/' );
    $names = $route ? explode( '/', $route ) : array( 'home' );
    $parent = 0;
    foreach ( array_slice( $names, 0, -1 ) as $parent_slug ) {
        $existing = get_page_by_path( $parent ? get_page_uri( $parent ) . '/' . $parent_slug : $parent_slug, OBJECT, 'page' );
        if ( $existing ) { $parent = $existing->ID; continue; }
        if ( ! $publish ) { WP_CLI::log( 'DRY RUN: create parent ' . $parent_slug ); $parent = 0; continue; }
        $parent = wp_insert_post( array( 'post_type'=>'page','post_status'=>'publish','post_title'=>ucwords( str_replace( '-', ' ', $parent_slug ) ),'post_name'=>$parent_slug,'post_parent'=>$parent ) );
        if ( is_wp_error( $parent ) ) { WP_CLI::error( $parent->get_error_message() ); }
    }
    $existing = get_page_by_path( $route ? $route : 'home', OBJECT, 'page' );
    $payload = array( 'post_type'=>'page', 'post_status'=>'publish', 'post_name'=>end( $names ), 'post_parent'=>$parent,
        'post_title'=>$row['title'], 'post_content'=>$html );
    if ( $existing ) { $payload['ID'] = $existing->ID; }
    if ( ! $publish ) { WP_CLI::log( 'DRY RUN: ' . ( $existing ? 'update ' : 'create ' ) . $row['route'] ); continue; }
    $post_id = wp_insert_post( wp_slash( $payload ), true );
    if ( is_wp_error( $post_id ) ) { WP_CLI::error( $post_id->get_error_message() ); }
    update_post_meta( $post_id, '_ftt_seo_title', sanitize_text_field( $row['seo_title'] ) );
    update_post_meta( $post_id, '_ftt_meta_description', sanitize_text_field( $row['meta_description'] ) );
    update_post_meta( $post_id, '_ftt_primary_keyword', sanitize_text_field( $row['primary_keyword'] ) );
    update_post_meta( $post_id, '_ftt_source_document', esc_url_raw( $row['source_document_url'] ) );
    if ( '/' !== $row['route'] ) { update_post_meta( $post_id, '_wp_page_template', 'page-forex-content' ); }
    if ( '/' === $row['route'] ) {
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $post_id );
    }
    WP_CLI::success( ( $existing ? 'Updated ' : 'Created ' ) . $row['route'] );
}
if ( ! $publish ) { WP_CLI::log( 'No changes made. Use --publish to commit the import.' ); }
