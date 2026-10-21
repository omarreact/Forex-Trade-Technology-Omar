# Exact token to theme.json mapping

Use exactly one winner's design/<design-id>.tokens.json.
colors -> settings.color.palette: primary, accent, background, ink, border, surface.
typography.fontFamily -> settings.typography.fontFamilies; typography.headingSizes -> styles.elements.heading.
layout.contentMaxWidthPx -> settings.layout.contentSize or wideSize.
radiusPx and sectionSpacingPx -> styles.blocks and styles.spacing.
Test native Navigation, Group, Cover, Columns, Buttons and Details components at 1440, 1280, 768, 390 and 360 widths.
Do not transfer presentation toolbar, feedback or experimental design selector.
