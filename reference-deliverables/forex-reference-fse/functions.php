<?php
/** Load the theme's reference-matched global styles. */
add_action( 'wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'forex-reference-fse-theme',
        get_theme_file_uri( 'assets/css/theme.css' ),
        array(),
        wp_get_theme()->get( 'Version' )
    );
} );
