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
    // Accessible decorative fallback: icon glyph can later be switched for inline SVG.
    $glyph=['check'=>'✓','link'=>'↗','server'=>'▣','layers'=>'▤','shield'=>'◇','support'=>'?','users'=>'♙','settings'=>'⚙','database'=>'▤','globe'=>'◎','payments'=>'▣','message'=>'✉','arrowUpRight'=>'↗','chevronDown'=>'⌄','menu'=>'☰','x'=>'×'];
    return '<span class="ftt-glyph" aria-hidden="true">' . esc_html($glyph[$name]??'✦') . '</span>';
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
