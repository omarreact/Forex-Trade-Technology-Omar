<?php
/**
 * Plugin Name: Forex Trade Technology Contact
 * Description: Server-only contact delivery for the XML-native WordPress theme, using Resend or wp_mail.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Text Domain: forex-trade-technology-contact
 */
declare(strict_types=1);
defined('ABSPATH') || exit;
require_once __DIR__.'/includes/rest-or-admin-post.php';
