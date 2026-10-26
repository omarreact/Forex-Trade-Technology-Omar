<?php
/** Offline CSS/browser smoke preview, not a substitute for WordPress Site Editor. */
function esc_html($x){return htmlspecialchars((string)$x,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function esc_attr($x){return esc_html($x);}function esc_url($x){return esc_html($x);}
function rest_url($s){return '/wp-json/'.ltrim($s,'/');}function wp_create_nonce($s){return 'preview-only';}
define('ABSPATH','/');
require __DIR__.'/../wordpress/forex-trade-technology/inc/render-interactive.php';
$theme=dirname(__DIR__).'/wordpress/forex-trade-technology';$id=$argv[1]??'home';$editor=($argv[2]??'')==='editor';
$strip=function($contents)use($theme){
 $contents=preg_replace_callback('/<!-- wp:forex-trade-technology\/([\w-]+) (\{.*?\}) \/-->/',static function($m){
  $a=json_decode($m[2],true)?:[];
  return ftt_xml_render_interactive('forex-trade-technology/'.$m[1],$a);
 },$contents);
 return preg_replace('/<!--\s*\/?wp:[\s\S]*?-->/', '',$contents);
};
$body=$strip(file_get_contents($theme.'/parts/header.html'));
$body.='<main class="wp-block-group bs-main bs-v4-dense bs-v5 bs-clean-page"><div class="wp-block-post-content">'. $strip(file_get_contents($theme.'/data/pages/'.basename($id).'.html')).'</div></main>';
$body.=$strip(file_get_contents($theme.'/parts/final-cta.html'));
$body.=$strip(file_get_contents($theme.'/parts/footer.html'));
if($editor)$body='<div class="editor-styles-wrapper">'.$body.'</div>';
$root='../wordpress/forex-trade-technology/assets/css';
echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">';
echo '<link rel="stylesheet" href="'.$root.'/front.css"><link rel="stylesheet" href="'.$root.'/native.css">';
if($editor)echo '<link rel="stylesheet" href="'.$root.'/editor.css">';
echo '</head><body>'.$body.'<script src="'.$root.'/../js/view.js"></script>';
echo '<output id="preview-measure" style="display:none"></output>';
echo '<script>window.addEventListener("load",()=>{let z={width:innerWidth,scrollWidth:document.documentElement.scrollWidth,sections:document.querySelectorAll("main section").length,cta:document.querySelectorAll(".bs-global-cta-panel").length,slider:document.querySelectorAll(".bs-slide").length};document.getElementById("preview-measure").textContent=JSON.stringify(z)});</script>';
echo '</body></html>';
