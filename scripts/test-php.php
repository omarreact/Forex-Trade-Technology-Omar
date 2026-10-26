<?php
function esc_html($x){return htmlspecialchars((string)$x, ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function esc_attr($x){return esc_html($x);}function esc_url($x){return esc_html($x);}
function rest_url($x){return 'https://example.test/wp-json/'.ltrim($x,'/');}
function wp_create_nonce($x){return 'test-nonce';}
function current_user_can($x){return true;}
function add_action($event,$callback){return true;}
function get_page_by_path($x,$o=null,$t=null){return null;}
function get_post_meta(...$args){return false;}
function get_theme_file_path($x){return __DIR__.'/../wordpress/forex-trade-technology/'.$x;}
define('ABSPATH','/');define('OBJECT','OBJECT');
require __DIR__.'/../wordpress/forex-trade-technology/inc/import.php';
require __DIR__.'/../wordpress/forex-trade-technology/inc/render-interactive.php';
$report=ftt_xml_import(true,false,false);
if(count($report['created'])!==13||count($report['parents'])!==3)throw new RuntimeException('dry-run importer count invalid: '.json_encode($report));
$home=json_decode(file_get_contents(__DIR__.'/../wordpress/forex-trade-technology/data/pages/home.json'),true);
$hero=ftt_xml_render_interactive('forex-trade-technology/home-slider',['slides'=>$home['pageTop']['slides'],'autoplay'=>true]);
if(substr_count($hero,'class="bs-slide')<5||substr_count($hero,'class="bs-slide is-active"')!==1)throw new RuntimeException('Home slides invalid');
$trust=ftt_xml_render_interactive('forex-trade-technology/trust-carousel',['items'=>['MT4','Hosting']]);
if(substr_count($trust,'bs-trust-carousel-group')!==1)throw new RuntimeException('Trust group duplicates in editor');
$audience=ftt_xml_render_interactive('forex-trade-technology/audience-carousel',['items'=>[['title'=>'New Brokers','description'=>'A'],['title'=>'Existing Brokers','description'=>'B']]]);
if(substr_count($audience,'class="bs-audience-slide"')!==2)throw new RuntimeException('Audience slides duplicate');
$form=ftt_xml_render_interactive('forex-trade-technology/contact-form',['heading'=>'Test consultation']);
if(!str_contains($form,'name="email"')||!str_contains($form,'name="website"'))throw new RuntimeException('Contact inputs absent');
echo "PASS importer dry-run: 13 pages, 3 parents; 5 slides, one trust group, two audience cards, form fields\n";
