# Forex Trade Technology Contact Plugin

Install this plugin **separately from the block theme**. It creates `POST /wp-json/ftt/v1/contact` for the theme's public consultation form and website feedback. It uses server-side Resend calls and never exposes the API key to the browser.

Configure outside the web root via `wp-config.php` or your host secret manager:

```php
define('FTT_RESEND_API_KEY', getenv('FTT_RESEND_API_KEY'));
define('FTT_CONTACT_FROM_EMAIL', 'Forex Trade Technology <hello@your-verified-domain.example>');
define('FTT_CONTACT_TO_EMAIL', 'owner@example.com');
```

Replace example sender and recipient with real approved addresses. Sender domain must be verified in Resend. Do not commit secrets. Invalid fields return HTTP 400, invalid origin 403, unconfigured provider 503, provider errors 502, and too many valid submissions 429. The website field is a honeypot. Max 5 valid submissions/hour per hashed IP (in WP transients).

Do not test with a live recipient without permission. The repo's lint and structural tests do not prove successful mail delivery.
