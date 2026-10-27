<?php
defined('ABSPATH') || exit;
function ftt_social_clean_url($value):string{
 $url=esc_url_raw(is_scalar($value)?trim((string)$value):'');
 if(!$url)return '';
 $p=wp_parse_url($url);
 if(!is_array($p)||($p['scheme']??'')!=='https')return '';
 return in_array(strtolower($p['host']??''),['wa.me','api.whatsapp.com','chat.whatsapp.com','www.whatsapp.com','whatsapp.com','t.me','telegram.me'],true)?$url:'';
}
function ftt_social_direct_url(string $kind):string{
 $default=$kind==='whatsapp'?'https://wa.me/447988028424':'https://t.me/forexbrokertech';
 return ftt_social_clean_url(get_option('ftt_'.$kind.'_url','')) ?: $default;
}
function ftt_social_icon(string $kind):string{
 if($kind==='whatsapp')return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.5Z"/><path d="M9 8.3c-.3-.6-.6-.7-.9-.6-.7.3-1.2 1-1.1 1.9.2 2 3.2 5.3 5.9 6.1.8.2 1.7-.3 2-1 .2-.4.1-.6-.3-.8l-1.8-.9c-.2-.1-.4 0-.6.2l-.7.8a7.9 7.9 0 0 1-3.2-3.1l.8-.9c.2-.2.2-.4.1-.6Z"/></svg>';
 return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.8 3.4-4 17a.8.8 0 0 1-1.2.4l-5.2-4-2.7 2.4.4-4 9.3-8.3-11.2 7-4.4-1.4a.8.8 0 0 1-.1-1.5L20.6 2.7a.9.9 0 0 1 1.2.7Z"/></svg>';
}
function ftt_social_links(string $location='header'):string{
 $home=home_url('/');
 $targets=['whatsapp'=>'https://api.whatsapp.com/send?text='.rawurlencode($home),'telegram'=>'https://t.me/share/url?url='.rawurlencode($home).'&text='.rawurlencode(get_bloginfo('name'))];
 $out='<div class="bs-social-links bs-social-links--'.esc_attr($location).'" aria-label="Social channels">';
 foreach(['whatsapp','telegram'] as $kind){
  $direct=ftt_social_direct_url($kind);
  $label=$direct?($kind==='whatsapp'?'Chat on WhatsApp':'Open Telegram'):'Share this site on '.ucfirst($kind);
  $out.='<a class="bs-social-link bs-social-link--'.esc_attr($kind).'" href="'.esc_url($direct?:$targets[$kind]).'" aria-label="'.esc_attr($label).'" title="'.esc_attr($label).'" target="_blank" rel="noopener noreferrer">'.ftt_social_icon($kind).'</a>';
 }
 return $out.'</div>';
}
add_action('admin_init',function():void{
 register_setting('ftt_social_settings','ftt_whatsapp_url',['type'=>'string','sanitize_callback'=>'ftt_social_clean_url','default'=>'']);
 register_setting('ftt_social_settings','ftt_telegram_url',['type'=>'string','sanitize_callback'=>'ftt_social_clean_url','default'=>'']);
});
add_action('admin_menu',function():void{
 add_theme_page('Social Links','Social Links','edit_theme_options','ftt-social-links',function():void{
  if(!current_user_can('edit_theme_options'))return;
  echo '<div class="wrap"><h1>Navbar & Footer Social Links</h1><p>Enter official WhatsApp and Telegram URLs. Blank values use the official Forex Trade Technology accounts.</p><form method="post" action="'.esc_url(admin_url('options.php')).'">';
  settings_fields('ftt_social_settings');
  foreach(['whatsapp'=>'WhatsApp','telegram'=>'Telegram'] as $kind=>$label){
   echo '<p><label for="ftt_'.$kind.'_url"><strong>'.esc_html($label).' URL</strong></label><br><input type="url" class="regular-text" id="ftt_'.$kind.'_url" name="ftt_'.$kind.'_url" value="'.esc_attr(get_option('ftt_'.$kind.'_url','')).'"></p>';
  }
  submit_button('Save social links');echo '</form></div>';
 });
});
