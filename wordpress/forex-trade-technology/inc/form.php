<?php
declare(strict_types=1);
defined('ABSPATH') || exit;
function ftt_contact_form(array $copy=[]):string{
    $copy=$copy?:ftt_data('form.config.json');$fields=$copy['fields']??[];
    $html='<section class="bs-v5-section bs-v5-layout-splitContent ftt-contact-section"><div class="bs-shell"><div class="bs-contact-grid">'
      .'<div class="bs-contact-intro"><span class="bs-eyebrow">'.esc_html($copy['eyebrow']??'REQUEST A CONSULTATION').'</span>'
      .'<h2>'.esc_html($copy['headingBefore']??"Let's build something").' <em>'.esc_html($copy['headingEmphasis']??'reliable.').'</em></h2>'
      .'<p>'.esc_html($copy['intro']??'').'</p><p>'.esc_html($copy['publicNotice']??'').'</p>'
      .'<div class="bs-contact-direct-links" aria-label="Direct messaging options">'
      .'<a href="'.esc_url(ftt_social_direct_url('whatsapp')).'" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +44 7988 028424">WhatsApp · +44 7988 028424 '.ftt_icon('arrowUpRight').'</a>'
      .'<a href="'.esc_url(ftt_social_direct_url('telegram')).'" target="_blank" rel="noopener noreferrer" aria-label="Telegram forexbrokertech">Telegram · @forexbrokertech '.ftt_icon('arrowUpRight').'</a>'
      .'</div></div>'
      .'<form class="bs-contact-form" data-ftt-contact method="post">'
      .'<input type="text" name="website" autocomplete="off" tabindex="-1" class="bs-honeypot" aria-hidden="true">'
      .'<div class="bs-form-fields">';
    $inputs=[
     ['name','name','text',true,2,100],
     ['email','email','email',true,0,150],
     ['company','organization','text',false,0,150],
     ['country','country-name','text',false,0,100],
     ['contact','tel','tel',false,0,100]
    ];
    foreach($inputs as [$name,$autocomplete,$type,$required,$min,$max]){
        $data=$fields[$name]??[];
        $html.='<label><span>'.esc_html($data['label']??ucfirst($name)).'</span><input autocomplete="'.esc_attr($autocomplete).'" type="'.esc_attr($type).'" name="'.esc_attr($name).'" placeholder="'.esc_attr($data['placeholder']??'').'"'.($required?' required':'').($min?' minlength="'.$min.'"':'').' maxlength="'.$max.'"></label>';
    }
    foreach(['interest','stage'] as $name){
        $data=$fields[$name]??[];
        $html.='<label'.($name==='stage'?' class="wide"':'').'><span>'.esc_html($data['label']??ucfirst($name)).'</span><select name="'.esc_attr($name).'"><option value="">'.esc_html($data['placeholder']??'Select').'</option>';
        foreach($data['options']??[] as $option)$html.='<option value="'.esc_attr($option).'">'.esc_html($option).'</option>';
        $html.='</select></label>';
    }
    $message=$fields['message']??[];
    $html.='<label class="wide"><span>'.esc_html($message['label']??'Message *').'</span><textarea name="message" required minlength="10" maxlength="4000" rows="6" placeholder="'.esc_attr($message['placeholder']??'').'"></textarea></label>'
      .'</div><div class="bs-form-footer"><span>'.esc_html($copy['footer']??'').'</span><button class="bs-btn bs-btn-primary" type="submit">'.esc_html($copy['submit']??'Request a Consultation').ftt_icon('arrowUpRight').'</button></div>'
      .'<p class="bs-form-status" role="status" aria-live="polite" hidden></p>'
      .'</form></div></div></section>';
    return $html;
}
