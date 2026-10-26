<?php
defined('ABSPATH') || exit;
function ftt_source($relative) {
    $path = realpath(get_stylesheet_directory().'/source/'.$relative);
    $root = realpath(get_stylesheet_directory().'/source');
    if (!$path || !$root || strpos($path,$root.DIRECTORY_SEPARATOR)!==0) return array();
    $data=json_decode((string) file_get_contents($path),true);
    return is_array($data)?$data:array();
}
function ftt_e($value) {return esc_html(is_scalar($value)?(string)$value:'');}
function ftt_image($key) {
    $theme=ftt_source('theme/theme.json');
    return $theme['assets']['images'][$key] ?? null;
}
function ftt_buttons($buttons) {
    $out='';
    foreach ((array)$buttons as $button) if(is_array($button)&&!empty($button['href'])) {
        $out.='<a class="bs-btn bs-btn-primary" href="'.esc_url($button['href']).'">'.ftt_e($button['label']??'Explore').'</a> ';
    }
    return $out;
}
function ftt_prose($blocks) {
    $out='';
    foreach ((array)$blocks as $b) {
        if (!is_array($b)) continue;
        $tag=in_array($b['type']??'p',array('h2','h3','p'),true)?$b['type']:'p';
        $out.='<'.$tag.'>'.ftt_e($b['text']??'').'</'.$tag.'>';
    }
    return $out;
}
function ftt_render_section($s) {
    if(!is_array($s)) return '';
    $layout=$s['layout']??'stack';
    if($layout==='ctaBand'||$layout==='mediaBand'&&!is_front_page()) return '';
    $id=sanitize_html_class($s['id']??'section');
    $title=$s['title']??'';
    $dark=$layout==='darkBand';
    $out='<section id="'.esc_attr($id).'" class="ftt-section bs-v5-section ftt-layout-'.esc_attr(sanitize_html_class($layout)).($dark?' ftt-dark':'').'"><div class="ftt-section-inner">';
    if(!empty($s['kicker'])) $out.='<div class="ftt-kicker">'.ftt_e($s['kicker']).'</div>';
    if($title) $out.='<h2>'.ftt_e($title).'</h2>';
    if(!empty($s['subtitle'])) $out.='<p>'.ftt_e($s['subtitle']).'</p>';
    if($layout==='faqAccordion') {
        $out.='<div class="ftt-faq">';
        foreach((array)($s['items']??array()) as $i=>$item) if(is_array($item))
            $out.='<details'.($i===0&&!empty($s['openFirst'])?' open':'').'><summary>'.ftt_e($item['q']??'').'</summary><div>'.wp_kses_post($item['a']??'').'</div></details>';
        $out.='</div>';
    } elseif ($layout==='iconRow') {
        $out.='<div class="ftt-trust">';
        foreach((array)($s['items']??array()) as $item)$out.='<span>✓ '.ftt_e($item).'</span>';
        $out.='</div>';
    } elseif(in_array($layout,array('cardGrid2','cardGrid3','statsRow','timeline'),true)){
        $out.='<div class="ftt-cards">';
        $groups=array();
        foreach((array)($s['blocks']??array()) as $b){
            if(($b['type']??'')==='h3'||($b['type']??'')==='h2') $groups[]=array('heading'=>$b['text'],'copy'=>array());
            elseif(!$groups)$groups[]=array('heading'=>'','copy'=>array($b['text']??''));
            else $groups[count($groups)-1]['copy'][]=$b['text']??'';
        }
        foreach($groups as $item)$out.='<article class="ftt-card"><h3>'.ftt_e($item['heading']).'</h3><p>'.ftt_e(implode(' ',$item['copy'])).'</p></article>';
        $out.='</div>';
    } else {
        $out.='<div class="ftt-copy">'.ftt_prose($s['blocks']??array()).'</div>';
    }
    if(!empty($s['media']['imageKey'])){
        $img=ftt_image($s['media']['imageKey']);
        if($img)$out.='<figure class="ftt-media"><img loading="lazy" src="'.esc_url($img['url']).'" alt="'.esc_attr($img['alt']??'').'"></figure>';
    }
    if(!empty($s['cta']))$out.=ftt_buttons(array($s['cta']));
    if(!empty($s['ctas']))$out.=ftt_buttons($s['ctas']);
    return $out.'</div></section>';
}
function ftt_render_slider($a) {
    $slides=$a['slides']??array();
    $out='<section class="ftt-slider bs-home-slider" aria-roledescription="carousel" aria-label="Featured brokerage solutions" data-autoplay="'.(!empty($a['autoplay'])?'1':'0').'" data-interval="'.esc_attr((int)($a['intervalMs']??6000)).'">';
    foreach((array)$slides as $i=>$slide) {
        $image=ftt_image($slide['imageKey']??'');
        $style=$image?' style="background-image:linear-gradient(90deg,rgba(0,0,0,.85),rgba(0,0,0,.15)),url('.esc_url($image['url']).')"':'';
        $h=$i===0?'h1':'h2';
        $out.='<div class="ftt-slide bs-slide" role="group" aria-label="'.esc_attr(($i+1).' of '.count($slides)).'"'.($i?' hidden':'').$style.'><div class="bs-shell"><span class="ftt-kicker">'.ftt_e($slide['kicker']??'').'</span><'.$h.'>'.ftt_e($slide['title']??'').'</'.$h.'><p>'.ftt_e($slide['subtitle']??'').'</p>'.ftt_buttons(isset($slide['cta'])?array($slide['cta']):array()).'</div></div>';
    }
    $out.='<div class="ftt-slider-controls"><button type="button" data-slide-prev aria-label="Previous slide">‹</button><button type="button" data-slide-next aria-label="Next slide">›</button></div></section>';
    return $out;
}
function ftt_render_form($a) {
    $copy=ftt_source('content/form.config.json');
    $fields=$copy['fields']??array();
    $out='<div class="ftt-contact"><h2>'.ftt_e($copy['headingBefore']??'Contact us').' <em>'.ftt_e($copy['headingEmphasis']??'').'</em></h2><p>'.ftt_e($copy['intro']??'').'</p><form class="ftt-contact-form" method="post" action="'.esc_url(rest_url('ftt-contact/v1/send')).'">';
    $out.='<input type="hidden" name="ftt_nonce" value="'.esc_attr(wp_create_nonce('wp_rest')).'"><input name="website" tabindex="-1" style="position:absolute;left:-9999px" autocomplete="off" aria-hidden="true">';
    foreach(array('name','email','company','country','contact','interest','stage','message') as $name){
        $field=$fields[$name]??array();$label=$field['label']??ucfirst($name);$placeholder=$field['placeholder']??'';
        $out.='<label>'.ftt_e($label);
        if(isset($field['options'])){$out.='<select name="'.esc_attr($name).'"><option value="">'.ftt_e($placeholder).'</option>';foreach($field['options'] as $opt)$out.='<option>'.ftt_e($opt).'</option>';$out.='</select>';}
        elseif($name==='message')$out.='<textarea name="message" minlength="10" maxlength="4000" required placeholder="'.esc_attr($placeholder).'"></textarea>';
        else $out.='<input name="'.esc_attr($name).'" type="'.($name==='email'?'email':'text').'" placeholder="'.esc_attr($placeholder).'" '.(in_array($name,array('name','email'),true)?'required':'').'>';
        $out.='</label>';
    }
    $out.='<button type="submit">'.ftt_e($copy['submit']??'Send').'</button><p role="status" class="ftt-form-status"></p></form></div>';
    return $out;
}
function ftt_render_block($attrs,$content,$block) {
    $type=$block->name??'';
    if($type==='forex-trade-technology/section')return ftt_render_section($attrs['section']??array());
    if($type==='forex-trade-technology/home-slider')return ftt_render_slider($attrs);
    if($type==='forex-trade-technology/contact-form')return ftt_render_form($attrs);
    if($type==='forex-trade-technology/trust-carousel')
        return ftt_render_section(array('layout'=>'iconRow','id'=>'trust-strip','items'=>$attrs['items']??array()));
    if($type==='forex-trade-technology/icon-card')
        return '<article class="ftt-card"><h3>'.ftt_e($attrs['title']??'').'</h3><p>'.ftt_e($attrs['description']??'').'</p></article>';
    if($type==='forex-trade-technology/audience-carousel') {
        $out='<section class="ftt-section"><h2>'.ftt_e($attrs['title']??'').'</h2><div class="ftt-cards">';
        foreach((array)($attrs['items']??array()) as $item)$out.='<article class="ftt-card"><h3>'.ftt_e($item['title']??'').'</h3><p>'.ftt_e($item['description']??'').'</p></article>';
        return $out.'</div></section>';
    }
    if($type==='forex-trade-technology/trading-stack-flow')return ftt_render_section($attrs['section']??array());
    return $content;
}
