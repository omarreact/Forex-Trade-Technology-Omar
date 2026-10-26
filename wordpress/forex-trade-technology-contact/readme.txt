=== Forex Trade Technology Contact ===
Contributors: pincodeit
Tags: contact, email, resend
Requires at least: 6.6
Requires PHP: 8.1
Stable tag: 1.0.0
License: GPLv2 or later

Server-only contact form endpoint POST /wp-json/ftt/v1/contact.
Use wp-config.php or environment variables:
- FTT_CONTACT_TO_EMAIL = verified inbox
- FTT_CONTACT_FROM_EMAIL = verified sender, optional for wp_mail
- FTT_CONTACT_MAIL_TRANSPORT = wp_mail (default) or resend
- FTT_RESEND_API_KEY = required only for resend

Includes validation, Origin checks, nonce support, hidden honeypot and a hashed IP rate limit. Public form nonces are not a replacement for these anti-spam controls.
