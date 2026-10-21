# Gutenberg component mapping

Scope: only migrate the client-approved winner, after review. Preserve the approved 13 pages and SEO from the existing source-verified manifest. Exclude all showroom UI.

| Current component | Core Gutenberg block pattern |
|---|---|
| SiteHeader with dropdowns | header template part and navigation / submenu blocks |
| SiteFooter | footer template part and group/navigation blocks |
| Hero photographic slides | core/cover; only use a small custom accessible slider block if full-slide motion requires it |
| Editorial lead with contents | core/group, headings and columns |
| Product and service cards | group, columns and reusable patterns |
| Workflow steps and feature rows | group, list and columns |
| FAQ | core/details |
| Contact | accessible form with a verified server-backed handler |
| Design toolbar, comparison, favorites, feedback | not exported to client theme |

Follow native theme.json conventions, keep links and alt text, maintain heading order, responsive layouts and reduced motion. Do not copy competitor assets.
