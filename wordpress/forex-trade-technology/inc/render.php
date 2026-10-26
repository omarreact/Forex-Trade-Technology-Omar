<?php
declare(strict_types=1);
defined('ABSPATH') || exit;

/** Dynamic Gutenberg blocks: same PHP markup in the editor SSR preview and public page. */
function ftt_render_dynamic_block(array $attributes, string $content, WP_Block $block): string {
    $name = str_replace('forex-trade-technology/', '', $block->name);
    switch ($name) {
        case 'site-header': return ftt_header($attributes);
        case 'site-footer': return ftt_footer($attributes);
        case 'final-cta': return ftt_final_cta(!empty($attributes['home']),$attributes);
        case 'home-slider': return ftt_home_slider($attributes['slides']??[], $attributes);
        case 'page-hero': return ftt_page_hero($attributes['page']??[]);
        case 'guide': return ftt_guide((string)($attributes['pageId']??''));
        case 'document-notes': return ftt_document_notes($attributes['notes']??[]);
        case 'contact-form': return ftt_contact_form($attributes['copy']??ftt_data('form.config.json'));
        case 'trust-carousel': return ftt_trust_carousel($attributes['items']??[]);
        case 'trading-stack-flow': return ftt_stack_flow($attributes['section']??[], $attributes['visual']??ftt_data('visual-labels.json')['tradingStackFlow']);
        case 'audience-carousel': return ftt_audience_carousel($attributes['title']??'', $attributes['items']??[]);
        case 'icon-card': return ftt_card($attributes);
        case 'section': return ftt_section($attributes['section']??[], (string)($attributes['pageId']??''), (int)($attributes['index']??0), (string)($attributes['pageTitle']??''));
    }
    return '';
}
function ftt_h(string $text, int $level=2, string $class='', string $id=''): string {
    $level=max(1,min(6,$level));
    return '<h'.$level.($class?' class="'.esc_attr($class).'"':'').($id?' id="'.esc_attr($id).'"':'').'>'.esc_html($text).'</h'.$level.'>';
}
function ftt_heading(string $title='', string $kicker='FOREX TRADE TECHNOLOGY', string $subtitle='', string $class='bs-v5-section-heading',string $id=''): string {
    // The exact semantic classes used by Next blocks/shared/SectionHeading.tsx.
    if (!$title && !$subtitle && !$kicker) return '';
    return '<header class="bs-ui-heading '.esc_attr($class).'">'
    .($kicker?'<span class="bs-ui-kicker">'.esc_html($kicker).'</span>':'')
    .($title?ftt_h($title,2,'bs-ui-title',$id):'')
    .($subtitle?'<p class="bs-ui-lead">'.esc_html($subtitle).'</p>':'').'</header>';
}
function ftt_header(array $attributes=[]): string {
    $config=ftt_config();
    if(isset($attributes['navigation'])&&is_array($attributes['navigation']))$config['navigation']=$attributes['navigation'];
    $current=(string)parse_url((string)($_SERVER['REQUEST_URI']??'/'), PHP_URL_PATH);
    $html='<header class="bs-site-header bs-clean-header"><div class="bs-shell bs-header-inner">'
    .'<a href="'.esc_url(home_url('/')).'" class="bs-brand" aria-label="Forex Trade Technology — Home">'
    .'<span class="bs-brand-mark" aria-hidden="true">✳</span><span class="bs-logo-text">FOREX<span>TRADE</span><small>TECHNOLOGY</small></span></a>'
    .'<button type="button" class="bs-mobile-menu-toggle" aria-controls="bs-primary-nav" aria-label="Open navigation" aria-expanded="false">☰</button>'
    .'<nav id="bs-primary-nav" aria-label="Main navigation" class="bs-inline-nav">';
    foreach ($config['navigation']['primary']??[] as $nav) {
        $label=esc_html($nav['label']??'');
        if (!empty($nav['children'])) {
            $active=false;
            foreach($nav['children'] as $child)if(($child['href']??'')===$current){$active=true;break;}
            $html.='<div class="bs-nav-dropdown"><button type="button" class="bs-nav-link bs-menu-trigger'.($active?' active':'').'" aria-expanded="false" aria-haspopup="true" aria-controls="bs-solutions">'.$label.ftt_icon('chevronDown').'</button><div id="bs-solutions" class="bs-submenu" aria-hidden="true">';
            foreach($nav['children'] as $child) {
                $selected=($child['href']??'')===$current;
                $html.='<a tabindex="-1" class="'.($selected?'active':'').'"'.($selected?' aria-current="page"':'').' href="'.esc_url(ftt_url((string)$child['href'])).'">'.esc_html($child['label']??'').ftt_icon('arrowUpRight').'</a>';
            }
            $html.='</div></div>';
        } else {
            $url=ftt_url((string)($nav['href']??'/'));
            $isActive=($nav['href']??'')===$current;
            $html.='<a class="bs-nav-link'.($isActive?' active':'').'" href="'.esc_url($url).'"'.($isActive?' aria-current="page"':'').'>'.$label.'</a>';
        }
    }
    $cta=$config['navigation']['cta']??['label'=>'Contact Us','href'=>'/contact'];
    $html.='<a class="bs-btn bs-btn-primary bs-header-cta" href="'.esc_url(ftt_url($cta['href'])).'">'.esc_html($cta['label']).ftt_icon('arrowUpRight').'</a>';
    return $html.'</nav></div></header>';
}
function ftt_footer(array $attributes=[]): string {
    $config=ftt_config();
    if(isset($attributes['footer'])&&is_array($attributes['footer']))$config['footer']=$attributes['footer'];
    if(isset($attributes['copyright']))$config['site']['copyright']=$attributes['copyright'];$footer=$config['footer']??[];
    $html='<footer class="bs-footer"><div class="bs-shell bs-footer-main"><div class="bs-footer-about">'
    .'<a href="'.esc_url(home_url('/')).'" class="bs-footer-logo">Forex Trade <strong>Technology<span>.</span></strong></a>'
    .'<p>'.esc_html($footer['brand']['description']??'').'</p>';
    $email=$config['site']['email']??'';
    if ($email) $html.='<a class="bs-footer-email" href="mailto:'.esc_attr($email).'">'.esc_html($email).ftt_icon('arrowUpRight').'</a>';
    else $html.='<a class="bs-footer-email" href="'.esc_url(ftt_url('/contact')).'">Contact our team'.ftt_icon('arrowUpRight').'</a>';
    $html.='</div>';
    foreach ($footer['columns']??[] as $column) {
        $html.='<div class="bs-footer-col">'.ftt_h((string)$column['heading'],3);
        foreach ($column['links']??[] as $link)$html.='<a href="'.esc_url(ftt_url((string)$link['href'])).'">'.esc_html($link['label']).'</a>';
        $html.='</div>';
    }
    return $html.'</div><div class="bs-shell bs-footer-bottom"><span>'.esc_html($config['site']['copyright']??'').'</span>'
        .'<a href="'.esc_url(ftt_url('/contact')).'">Talk to our team '.ftt_icon('arrowUpRight').'</a></div></footer>';
}
function ftt_final_cta(bool $home=false,array $attributes=[]): string {
    $data=$attributes['copy']??ftt_config()['footer']['cta']??[];
    $cls='bs-cta-wrap bs-global-cta'.($home?' bs-global-cta-home':'');
    $html='<div class="bs-main bs-v4-dense bs-clean-page ftt-cta-style-scope"><section class="'.esc_attr($cls).'" aria-labelledby="bs-final-cta-title"><div class="bs-shell"><div class="bs-global-cta-panel">'
    .'<div class="bs-global-cta-content"><span class="bs-global-cta-eyebrow"><span class="bs-global-cta-pulse" aria-hidden="true"></span>'.esc_html($data['kicker']??'').'</span>'
    .ftt_h($data['title']??'',2,'','bs-final-cta-title')
    .'<p>'.esc_html($data['description']??'').'</p>'
    .'<a class="bs-global-cta-button" href="'.esc_url(ftt_url($data['action']['href']??'/contact')).'">'.esc_html($data['action']['label']??'Contact Us').ftt_icon('arrowUpRight').'</a></div>';
    if ($home) {
        $visual=$data['visual']??[];
        $html.='<div class="bs-global-cta-visual" aria-label="One connected brokerage technology stack"><div class="bs-global-cta-visual-header">'
           .'<span class="bs-global-cta-visual-tag">'.esc_html($visual['eyebrow']??'').'</span><span class="bs-global-cta-visual-live"><span aria-hidden="true"></span>'.esc_html($visual['status']??'').'</span></div>';
        foreach ($visual['items']??[] as $i=>$item) {
            if ($i) $html.='<div class="bs-global-cta-visual-connector" aria-hidden="true"></div>';
            $html.='<div class="bs-global-cta-visual-card"><span class="bs-global-cta-icon">'.ftt_icon($item['icon']??'check').'</span><div><strong>'.esc_html($item['title']??'').'</strong><span>'.esc_html($item['caption']??'').'</span></div>'.ftt_icon('check').'</div>';
        }
        $html.='</div>';
    } else $html.='<div class="bs-global-cta-decoration" aria-hidden="true"><span></span><span></span><span></span></div>';
    return $html.'</div></div></section></div>';
}
function ftt_home_slider(array $slides,array $attributes=[]):string{
    if (!$slides)return '';
    $interval=max(3000, (int)($attributes['intervalMs']??6000));
    $html='<section class="bs-home-slider" aria-label="Featured brokerage solutions" aria-roledescription="carousel" data-interval="'.esc_attr((string)$interval).'" data-autoplay="'.(!empty($attributes['autoplay'])?'true':'false').'">';
    foreach($slides as $i=>$slide){
        $image=ftt_image((string)($slide['imageKey']??''));
        $html.='<div role="group" aria-roledescription="slide" aria-label="Slide '.($i+1).' of '.count($slides).'" class="bs-slide'.($i===0?' is-active':'').'"'.($i>0?' aria-hidden="true" inert':'').'>';
        if($image)$html.='<img class="bs-slide-photo" src="'.esc_url($image['url']).'" alt="'.esc_attr($image['alt']??'').'" style="object-position:'.esc_attr($image['position']??'center').'">';
        $html.='<div class="bs-slide-shade"></div><div class="bs-shell bs-slide-copy"><div class="bs-slide-content">'
         .'<span class="bs-slide-kicker">'.esc_html($slide['kicker']??'FOREX TRADE TECHNOLOGY').'</span>'
         .ftt_h((string)($slide['title']??''),$i===0?1:2);
        if(!empty($slide['subtitle']))$html.='<p>'.esc_html($slide['subtitle']).'</p>';
        if(!empty($slide['cta']['href']))$html.='<a class="bs-btn bs-btn-primary" href="'.esc_url(ftt_url($slide['cta']['href'])).'">'.esc_html($slide['cta']['label']??'Learn more').ftt_icon('arrowUpRight').'</a>';
        $html.='</div></div></div>';
    }
    $html.='<div class="bs-slide-controls"><div class="bs-slide-dots" role="group" aria-label="Choose slide">';
    foreach($slides as $i=>$slide)$html.='<button type="button" aria-label="Go to slide '.($i+1).'" '.($i===0?'aria-current="true" class="is-active"':'').'></button>';
    return $html.'</div></div></section>';
}
function ftt_page_hero(array $page):string{
    $top=$page['pageTop']??[];$hero=$page['hero']??[];
    $img=ftt_image((string)($top['backgroundImageKey']??$hero['imageKey']??''));
    $subtitle=trim((string)($top['subtitle']??''));
    if(preg_match('/^(Breadcrumb|Label):/i',$subtitle)){
        $subtitle='';
        foreach($hero['leadParagraphs']??[] as $line){
            $candidate=trim((string)$line);
            if($candidate&&!preg_match('/^(Breadcrumb|Label):/i',$candidate)){$subtitle=$candidate;break;}
        }
        if(!$subtitle&&!preg_match('/^(Breadcrumb|Label):/i',(string)($hero['subtitle']??'')))$subtitle=(string)($hero['subtitle']??'');
    }
    $html='<section class="bs-page-header" aria-labelledby="bs-page-heading" data-view-transition="hero">';
    if($img)$html.='<img class="bs-page-bg" src="'.esc_url($img['url']).'" alt="'.esc_attr($img['alt']??'').'">';
    $html.='<div class="bs-page-header-overlay"></div><div class="bs-shell bs-page-header-content"><nav class="bs-breadcrumb" aria-label="Breadcrumb">';
    foreach($top['breadcrumbs']??[] as $i=>$crumb){
        $html.='<span class="bs-crumb">'.($i?'<span aria-hidden="true" class="bs-crumb-slash">/</span>':'');
        $html.=!empty($crumb['href'])?'<a href="'.esc_url(ftt_url($crumb['href'])).'">'.esc_html($crumb['label']).'</a>':'<span aria-current="page">'.esc_html($crumb['label']).'</span>';
        $html.='</span>';
    }
    $html.='</nav><div class="bs-ui-heading bs-page-heading"><span class="bs-ui-kicker bs-hero-kicker">'.esc_html($top['kicker']??'FOREX TRADE TECHNOLOGY').'</span>'
        .ftt_h((string)($top['title']??$hero['title']??''),1,'bs-ui-title bs-page-title','bs-page-heading')
        .($subtitle?'<p class="bs-ui-lead bs-page-subtitle">'.esc_html($subtitle).'</p>':'').'</div></div></section>';
    return $html;
}
function ftt_document_notes(array $notes):string {
    if(!$notes)return '';
    $html='<aside class="bs-notes"><div class="bs-shell"><details><summary>Additional information and risk disclosure</summary>';
    foreach($notes as $note)$html.='<p>'.esc_html((string)$note).'</p>';
    return $html.'</details></div></aside>';
}
function ftt_trust_carousel(array $items):string{
    if(!$items)return '';
    $html='<section class="bs-trust bs-trust-carousel" aria-label="Technology that connects"><div class="bs-trust-carousel-window" aria-live="off"><div class="bs-trust-carousel-track">';
    for($copy=0;$copy<6;$copy++){
        $html.='<div class="bs-trust-carousel-group"'.($copy?' aria-hidden="true"':'').'>';
        foreach($items as $item)$html.='<span class="bs-trust-carousel-item">'.ftt_icon('check').'<span>'.esc_html((string)$item).'</span></span>';
        $html.='</div>';
    }
    return $html.'</div></div></section>';
}
function ftt_card(array $a):string{
    $cls=trim('bs-icon-card bs-ui-card '.(string)($a['className']??''));
    $icon=ftt_icon((string)($a['icon']??'check'));
    $html='<article class="'.esc_attr($cls).'"><span class="bs-icon-card-watermark" aria-hidden="true">'.$icon.'</span><div class="bs-icon-card-header"><span class="bs-icon-card-badge" aria-hidden="true">'.$icon.'</span></div>';
    if(!empty($a['title']))$html.=ftt_h((string)$a['title'],3,'bs-ui-card-title');
    $html.='<div class="bs-icon-card-copy bs-ui-card-copy">';
    if(!empty($a['description']))$html.='<p>'.esc_html($a['description']).'</p>';
    foreach($a['paragraphs']??[] as $para)$html.='<p>'.esc_html((string)$para).'</p>';
    return $html.'</div></article>';
}
function ftt_audience_carousel(string $title,array $items):string{
    if(!$items)return '';
    $html='<section class="bs-v5-section bs-audience-carousel-section" aria-label="'.esc_attr($title).'"><div class="bs-shell">'
       .'<div class="bs-audience-carousel-heading">'.ftt_heading($title,'FOREX TRADE TECHNOLOGY','','bs-audience-title-block')
       .'<div class="bs-audience-controls"><button type="button" class="bs-audience-arrow" aria-label="Previous audience">‹</button><button type="button" class="bs-audience-arrow" aria-label="Next audience">›</button></div></div>'
       .'<div class="bs-audience-viewport"><div class="bs-audience-track" aria-hidden="true">';
    for($copy=0;$copy<3;$copy++)foreach($items as $item) $html.='<div class="bs-audience-slide">'.ftt_card(['className'=>'bs-audience-icon-card','icon'=>$item['icon']??'users','title'=>$item['title']??'','description'=>$item['description']??'']).'</div>';
    $html.='</div></div><div class="bs-audience-pagination" aria-label="Choose audience slide">';
    foreach($items as $i=>$item)$html.='<button type="button" class="bs-audience-dot'.($i===0?' is-active':'').'" aria-label="Show '.esc_attr($item['title']??'Audience').'"'.($i===0?' aria-current="true"':'').'></button>';
    $html.='</div><ul class="bs-audience-screen-reader-list">';
    foreach($items as $item)$html.='<li><strong>'.esc_html($item['title']??'').':</strong> '.esc_html($item['description']??'').'</li>';
    return $html.'</ul></div></section>';
}
function ftt_stack_flow(array $section,array $visual):string{
    $copy=array_values(array_map(fn($b)=>(string)$b['text'],array_filter($section['blocks']??[],fn($b)=>($b['type']??'')==='p')));
    $id=$section['id']??'trading-stack';
    $html='<section id="'.esc_attr($id).'" class="bs-stack-flow-section bs-v5-section" aria-labelledby="bs-stack-flow-heading"><div class="bs-shell">'
      .ftt_heading((string)($section['title']??''),'FOREX TRADE TECHNOLOGY',$copy[0]??($visual['subtitleFallback']??''),'','bs-stack-flow-heading');
    $html.='<div class="bs-stack-flow-panel"><div class="bs-stack-flow-panel-top"><span>'.esc_html($visual['kicker']??'').'</span><span class="bs-stack-flow-emphasis">'.ftt_icon('check').' '.esc_html($visual['status']??'').'</span></div>'
       .'<ol class="bs-stack-flow-steps" aria-label="'.esc_attr($visual['ariaLabel']??'Trading connections').'">';
    $steps=$visual['connections']??[];
    foreach($steps as $i=>$item){
        $html.='<li class="bs-stack-flow-item"><div class="bs-stack-flow-node"><span class="bs-stack-flow-node-icon">'.ftt_icon($item['icon']??'check').'</span>'
          .'<strong>'.esc_html($item['label']??'').'</strong><span>'.esc_html($item['sub']??'').'</span></div>';
        if($i<count($steps)-1)$html.='<span class="bs-stack-flow-arrow" aria-hidden="true">→</span>';
        $html.='</li>';
    }
    $html.='</ol><p class="bs-stack-flow-caption">'.esc_html($visual['caption']??'').'</p></div>';
    if(count($copy)>1){
        $html.='<div class="bs-stack-flow-explanation"><div class="bs-stack-flow-prose"><p>'.esc_html($copy[1]).'</p></div>';
        if(isset($copy[2]))$html.='<aside class="bs-stack-flow-conclusion">'.ftt_icon('shield').'<p>'.esc_html($copy[2]).'</p></aside>';
        $html.='</div>';
    }
    return $html.'</div></section>';
}
