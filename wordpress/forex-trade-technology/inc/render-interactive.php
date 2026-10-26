<?php
/** Simple PHP-only HTML for interactive WordPress blocks. */
declare(strict_types=1);
defined('ABSPATH') || exit;
function ftt_xml_asset(string $key): array {
    static $imgs=null;
    if($imgs===null){$d=json_decode((string)file_get_contents(__DIR__.'/../data/design.json'),true);$imgs=$d['assets']['images']??[];}
    return is_array($imgs[$key]??null)?$imgs[$key]:[];
}
function ftt_xml_h($s):string{return esc_html(is_scalar($s)?(string)$s:'');}
function ftt_xml_buttons(array $cta):string {
    if(empty($cta['href']))return '';
    return '<a class="bs-btn bs-btn-primary wp-element-button" href="'.esc_url($cta['href']).'">'.ftt_xml_h($cta['label']??'Learn more').'</a>';
}
function ftt_xml_render_interactive(string $type,array $a):string {
    $name=str_replace('forex-trade-technology/','',$type);
    if($name==='home-slider'){
        $slides=array_slice((array)($a['slides']??[]),0,12);
        if(!$slides)return '';
        $out='<section class="bs-home-slider" aria-label="Featured brokerage solutions" aria-roledescription="carousel" data-autoplay="'.(!empty($a['autoplay'])?'1':'0').'" data-interval="'.esc_attr((int)($a['intervalMs']??6000)).'">';
        foreach($slides as $i=>$s){
            $img=ftt_xml_asset((string)($s['imageKey']??''));
            $tag=$i===0?'h1':'h2';
            $out.='<div class="bs-slide'.($i===0?' is-active':'').'" role="group" aria-label="Slide '.($i+1).' of '.count($slides).'" '.($i?'aria-hidden="true" inert':'').'>';
            if($img)$out.='<img class="bs-slide-photo" src="'.esc_url($img['url']).'" alt="'.esc_attr($img['alt']??'').'" style="object-position:'.esc_attr($img['position']??'center').'"'.($i?' loading="lazy"':' fetchpriority="high"'). '>';
            $out.='<div class="bs-slide-shade"></div><div class="bs-shell bs-slide-copy"><div class="bs-slide-content">'
              .'<span class="bs-slide-kicker">'.ftt_xml_h($s['kicker']??'FOREX TRADE TECHNOLOGY').'</span>'
              .'<'.$tag.'>'.ftt_xml_h($s['title']??'').'</'.$tag.'>'
              .'<p>'.ftt_xml_h($s['subtitle']??'').'</p>'.ftt_xml_buttons($s['cta']??[]).'</div></div></div>';
        }
        $out.='<div class="bs-slide-controls"><div class="bs-slide-dots" aria-label="Choose slide">';
        foreach($slides as $i=>$s)$out.='<button type="button" aria-label="Go to slide '.($i+1).'" '.($i===0?'class="is-active" aria-current="true"':'').'></button>';
        return $out.'</div></div></section>';
    }
    if($name==='trust-carousel'){
        $items=array_slice((array)($a['items']??[]),0,25);if(!$items)return '';
        $out='<section class="bs-trust bs-trust-carousel" aria-label="Technology that connects"><div class="bs-trust-carousel-window"><div class="bs-trust-carousel-track"><div class="bs-trust-carousel-group">';
        foreach($items as $item)$out.='<span class="bs-trust-carousel-item"><span aria-hidden="true">✓</span><span>'.ftt_xml_h($item).'</span></span>';
        return $out.'</div></div></div></section>';
    }
    if($name==='audience-carousel'){
        $items=array_slice((array)($a['items']??[]),0,15);if(!$items)return '';
        $out='<section class="bs-v5-section bs-audience-carousel-section"><div class="bs-shell"><div class="bs-audience-carousel-heading"><div><span class="bs-audience-kicker">FOREX TRADE TECHNOLOGY</span><h2>'.ftt_xml_h($a['heading']??'Who We Work With').'</h2></div><div class="bs-audience-controls"><button class="bs-audience-arrow" type="button" aria-label="Previous audience">‹</button><button class="bs-audience-arrow" type="button" aria-label="Next audience">›</button></div></div>';
        $out.='<div class="bs-audience-viewport"><div class="bs-audience-track">';
        foreach($items as $item)$out.='<div class="bs-audience-slide"><article class="bs-icon-card bs-audience-icon-card"><span class="bs-icon-card-badge" aria-hidden="true">✳</span><h3>'.ftt_xml_h($item['title']??'').'</h3><p>'.ftt_xml_h($item['description']??'').'</p></article></div>';
        $out.='</div></div><div class="bs-audience-pagination">';
        foreach($items as $i=>$v)$out.='<button type="button" class="bs-audience-dot'.($i===0?' is-active':'').'" aria-label="Show audience '.($i+1).'"'.($i===0?' aria-current="true"':'').'></button>';
        return $out.'</div></div></section>';
    }
    if($name==='trading-stack-flow'){
        $steps=array_slice((array)($a['steps']??[]),0,12);
        $out='<section class="bs-v5-section bs-stack-flow-section"><div class="bs-shell"><h2>'.ftt_xml_h($a['heading']??'How Your Trading Stack Connects').'</h2><div class="bs-stack-flow-panel"><ol class="bs-stack-flow-steps">';
        foreach($steps as $i=>$s){$out.='<li class="bs-stack-flow-item"><div class="bs-stack-flow-node"><strong>'.ftt_xml_h($s['title']??'').'</strong><span>'.ftt_xml_h($s['description']??'').'</span></div>';if($i<count($steps)-1)$out.='<span class="bs-stack-flow-arrow" aria-hidden="true">→</span>';$out.='</li>';}
        $out.='</ol></div>';
        foreach((array)($a['paragraphs']??[]) as $p)$out.='<p>'.ftt_xml_h($p).'</p>';
        return $out.'</div></section>';
    }
    if($name==='contact-form'){
        $form=json_decode((string)file_get_contents(__DIR__.'/../data/form.json'),true)?:[];
        $labels=$a['labels']??[];
        $out='<section class="bs-v5-section ftt-contact-section"><div class="bs-shell"><div class="bs-contact-grid"><div class="bs-contact-intro"><span class="bs-ui-kicker">REQUEST A CONSULTATION</span><h2>'.ftt_xml_h($a['heading']??'Let’s build something reliable.').'</h2><p>'.ftt_xml_h($a['intro']??'Tell us what your brokerage needs.').'</p></div>';
        $out.='<form class="bs-contact-form ftt-xml-contact" action="'.esc_url(rest_url('ftt/v1/contact')).'" method="post">';
        $out.='<input name="website" class="bs-honeypot" autocomplete="off" tabindex="-1" aria-hidden="true"><input type="hidden" name="nonce" value="'.esc_attr(wp_create_nonce('wp_rest')).'">';
        $out.='<div class="bs-form-fields">';
        foreach(['name','email','company','country','contact'] as $name){$f=$form['fields'][$name]??[];$label=$labels[$name]??$f['label']??ucfirst($name);$type=$name==='email'?'email':($name==='contact'?'tel':'text');$required=in_array($name,['name','email'],true)?' required':'';$out.='<label><span>'.ftt_xml_h($label).'</span><input type="'.$type.'" name="'.esc_attr($name).'" placeholder="'.esc_attr($f['placeholder']??'').'" maxlength="150"'.$required.'></label>';}
        foreach(['interest','stage'] as $name){$f=$form['fields'][$name]??[];$out.='<label><span>'.ftt_xml_h($labels[$name]??$f['label']??ucfirst($name)).'</span><select name="'.esc_attr($name).'"><option value="">'.ftt_xml_h($f['placeholder']??'Select').'</option>';foreach($f['options']??[] as $option)$out.='<option value="'.esc_attr($option).'">'.ftt_xml_h($option).'</option>';$out.='</select></label>';}
        $out.='<label class="wide"><span>'.ftt_xml_h($labels['message']??'Message *').'</span><textarea name="message" required minlength="10" maxlength="4000" rows="5"></textarea></label></div><button class="bs-btn bs-btn-primary" type="submit">'.ftt_xml_h($a['submitLabel']??'Request a Consultation').'</button><p class="bs-form-status" role="status" aria-live="polite"></p></form></div></div></section>';
        return $out;
    }
    return '';
}
