<?php
declare(strict_types=1);
defined('ABSPATH') || exit;
/** Bundled immutable source snapshots copied from Phase B, for repeatable imports. */
function ftt_data(string $name, $fallback = []){
    if (!preg_match('/^[a-z0-9_\/.-]+$/i', $name) || str_contains($name, '..')) return $fallback;
    $path = get_theme_file_path('data/' . $name);
    if (!is_file($path)) return $fallback;
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : $fallback;
}
function ftt_config(): array { return ftt_data('site.config.json'); }
function ftt_theme_assets(): array { $theme=ftt_data('source-theme.json');return $theme['assets']['images']??[]; }
function ftt_image(string $key): array { return ftt_theme_assets()[$key]??[]; }
function ftt_url(string $source): string {
    if ($source==='' || $source[0]!=='/' || str_starts_with($source,'//')) return $source;
    $path=explode('#',$source,2)[0];
    foreach (get_pages(['post_type'=>'page','meta_key'=>'_ftt_source_path','meta_value'=>$path]) as $page) {
        return get_permalink($page->ID) . (str_contains($source,'#') ? '#' . explode('#',$source,2)[1] : '');
    }
    return home_url($source);
}
function ftt_icon(string $name='check'): string {
    // Portable inline Lucide-style SVG, shipped with the theme; no icon CDN dependency.
    $shapes=[
      'check'=>'<path d="M20 6 9 17l-5-5"/>',
      'arrowUpRight'=>'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
      'arrowRight'=>'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      'arrowUp'=>'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
      'chevronDown'=>'<path d="m6 9 6 6 6-6"/>',
      'chevronLeft'=>'<path d="m15 18-6-6 6-6"/>',
      'chevronRight'=>'<path d="m9 18 6-6-6-6"/>',
      'menu'=>'<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
      'x'=>'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      'server'=>'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
      'layers'=>'<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
      'link'=>'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
      'shield'=>'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
      'security'=>'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
      'settings'=>'<path d="M12 3a9 9 0 1 0 0 18"/><path d="M12 7a5 5 0 1 0 0 10"/><path d="M16 8h6"/><path d="M16 12h6"/><path d="M16 16h6"/>',
      'users'=>'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      'database'=>'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
      'globe'=>'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2Z"/>',
      'payments'=>'<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
      'building'=>'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 21v-4h6v4M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01"/>',
      'support'=>'<path d="M3 14h2v6H3a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2ZM19 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v-6ZM3 14v-3a9 9 0 0 1 18 0v3"/><path d="M19 20a4 4 0 0 1-4 4h-3"/>',
      'message'=>'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',
      'zap'=>'<path d="m13 2-3 8H4l7 12 2-8h7L13 2Z"/>'
    ];
    $alias=['arrow-up-right'=>'arrowUpRight','arrow-up'=>'arrowUp','shield-check'=>'shield','check-circle'=>'check'];
    $name=$alias[$name]??$name;
    $paths=$shapes[$name]??$shapes['arrowUpRight'];
    $svg='<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'.$paths.'</svg>';
    return '<span class="ftt-glyph" aria-hidden="true">'.$svg.'</span>';
}
function ftt_blocks_to_groups(array $blocks): array {
    $groups=[['heading'=>'','paragraphs'=>[]]];
    foreach ($blocks as $b) {
        if (($b['type']??'')==='h3') {$groups[]=['heading'=>(string)($b['text']??''),'paragraphs'=>[]];continue;}
        if (($b['type']??'')==='p') $groups[count($groups)-1]['paragraphs'][]=(string)($b['text']??'');
    }
    return $groups;
}
function ftt_block_comment(string $block, array $attributes=[]): string {
    $json = $attributes ? ' ' . wp_json_encode($attributes, JSON_HEX_TAG | JSON_HEX_AMP) : '';
    return '<!-- wp:forex-trade-technology/' . $block . $json . ' /-->' . "\n";
}
