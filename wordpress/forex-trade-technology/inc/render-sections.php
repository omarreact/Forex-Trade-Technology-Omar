<?php
declare(strict_types=1);
defined('ABSPATH') || exit;
function ftt_section(array $section,string $pageId,int $index,string $pageTitle=''):string{
    $layout=(string)($section['layout']??'stack');
    $title=(string)($section['title']??'');
    $id=(string)($section['id']??'');
    if ($layout==='ctaBand'||($layout==='mediaBand'&&$pageId!=='home'))return '';
    if ($pageId==='home'&&$title==='How Your Trading Stack Connects')
        return ftt_stack_flow($section, ftt_data('visual-labels.json')['tradingStackFlow']??[]);
    if(in_array($title,['Platform & Infrastructure Under One Roof','Why Brokers Work With Us'],true))
        return ftt_feature_flex($section,$title==='Why Brokers Work With Us');
    if($title==='Who We Work With'&&count(array_filter($section['blocks']??[],fn($b)=>($b['type']??'')==='h3')))
        return ftt_audience_carousel($title,ftt_groups_as_items($section['blocks']??[],['building','server','users','settings']));
    if($title==='Request a Consultation'&&$layout==='splitContent')return ftt_contact_form(ftt_data('form.config.json'));
    if($layout==='iconRow')return ftt_trust_carousel($section['items']??[]);
    if($layout==='faqAccordion')return ftt_faq($section);
    if($layout==='mediaBand')return ftt_media_band($section,$pageTitle?:'Forex Trade Technology');
    if($layout==='gallery3'){
        if($pageId==='home' && ($section['title']??'')==='Who We Work With'){
            $section['title']='Technology Behind the Brokerage';
        }
        return ftt_gallery($section);
    }
    $blocks=$section['blocks']??[];
    $groups=ftt_blocks_to_groups($blocks);
    $leads=[];$topics=[];
    foreach($groups as $g){if($g['heading'])$topics[]=$g;else $leads=array_merge($leads,$g['paragraphs']);}
    $dark=$layout==='darkBand';
    if($layout==='stack'||($dark&&!$topics)||($layout==='timeline'&&!$topics))
        return ftt_story($section,$pageId,$index,$dark);
    $soft=($index%2&&!$dark)?' bs-v5-soft':'';
    $html='<section id="'.esc_attr($id).'" class="bs-v5-section bs-v5-layout-'.esc_attr($layout).($dark?' bs-v5-dark':'').$soft.'" data-view-transition="'.esc_attr($section['viewTransition']??'section').'"><div class="bs-shell">';
    $html.=ftt_heading($title,'',$leads[0]??'','bs-v5-section-heading');
    if(count($leads)>1){
        $html.='<div class="bs-v5-intro">';
        foreach(array_slice($leads,1) as $p)$html.='<p>'.esc_html($p).'</p>';
        $html.='</div>';
    }
    if(in_array($layout,['cardGrid2','cardGrid3'],true)){
        if(!$topics&&count($leads)>1){$topics=array_map(fn($p)=>['heading'=>'','paragraphs'=>[$p]],$leads);}
        $html.='<div class="bs-v5-grid '.($layout==='cardGrid2'?'bs-v5-grid-two':'bs-v5-grid-three').'">';
        foreach($topics as $i=>$t)$html.=ftt_card(['className'=>'bs-v5-card','title'=>$t['heading'],'paragraphs'=>$t['paragraphs'],'icon'=>['layers','server','shield','link','users','payments'][$i%6]]);
        $html.='</div>';
    } elseif($layout==='timeline'){
        if(!$topics&&count($leads)>=2)$topics=array_map(fn($p,$i)=>['heading'=>'Step '.($i+1),'paragraphs'=>[$p]],$leads,array_keys($leads));
        $html.='<div class="bs-v5-steps">';
        foreach($topics as $i=>$t)$html.=ftt_card(['className'=>'bs-v5-card bs-step-card','title'=>$t['heading'],'paragraphs'=>$t['paragraphs'],'icon'=>['check','settings','server','link','shield'][$i%5]]);
        $html.='</div>';
    } elseif($dark){
        $html.='<div class="bs-v5-dark-list">';
        foreach($topics as $i=>$t)$html.=ftt_card(['className'=>'bs-v5-card bs-dark-feature-card','title'=>$t['heading'],'paragraphs'=>$t['paragraphs'],'icon'=>['server','layers','link','shield','support'][$i%5]]);
        $html.='</div>';
    }else{
        $html.='<div class="bs-v5-prose-list">';
        foreach($topics as $t){$html.='<article>'.ftt_h($t['heading'],3);foreach($t['paragraphs'] as $p)$html.='<p>'.esc_html($p).'</p>';$html.='</article>';}
        $html.='</div>';
    }
    return $html.'</div></section>';
}
function ftt_groups_as_items(array $blocks,array $icons):array{
    $out=[];
    foreach(ftt_blocks_to_groups($blocks) as $g){
        if(!$g['heading'])continue;
        $out[]=['title'=>$g['heading'],'description'=>implode(' ',$g['paragraphs']),'icon'=>$icons[count($out)%count($icons)]];
    }
    return $out;
}
function ftt_feature_flex(array $section,bool $dark=false):string{
    $topics=ftt_blocks_to_groups($section['blocks']??[]);
    $icons=$dark?['server','layers','link','shield','support']:['settings','server','database','link','users'];
    $items=ftt_groups_as_items($section['blocks']??[],$icons);
    $intro=[];
    foreach($topics as $t)if(!$t['heading'])$intro=array_merge($intro,$t['paragraphs']);
    $id=$section['id']??'feature-flex';
    $html='<section id="'.esc_attr($id).'" class="bs-v5-section bs-feature-flex-section bs-feature-flex-'.($dark?'benefits':'infrastructure').'" aria-labelledby="'.esc_attr($id).'-heading"><div class="bs-shell">';
    $html.=ftt_heading((string)($section['title']??''),'','','bs-feature-flex-heading',esc_attr($id).'-heading');
    if($intro){$html.='<div class="bs-feature-flex-intro">';foreach($intro as $p)$html.='<p>'.esc_html($p).'</p>';$html.='</div>';}
    $html.='<div class="bs-feature-flex-list">';
    foreach($items as $item)$html.=ftt_card(['className'=>'bs-feature-flex-card '.($dark?'bs-benefit-card':'bs-infrastructure-card'),...$item]);
    return $html.'</div></div></section>';
}
function ftt_story(array $section,string $pageId,int $index,bool $dark):string{
    $data=ftt_data('story-visuals.json');
    $visual=$data[$pageId]??$data['home']??[];
    $img=ftt_image((string)($section['media']['imageKey']??$visual['image']??''));
    $blocks=$section['blocks']??[];$leads=[];$topics=[];
    foreach($blocks as $b){
        if(($b['type']??'')==='h3'){$topics[]=['heading'=>$b['text'],'paragraphs'=>[]];continue;}
        if(($b['type']??'')==='p'){
            if($topics)$topics[count($topics)-1]['paragraphs'][]=$b['text'];
            else $leads[]=$b['text'];
        }
    }
    $reversed=$index%2===0;
    $cls='bs-v5-section bs-story-section '.($dark?'bs-story-dark':($index%2?'bs-story-tint':'bs-story-light')).($reversed?' bs-story-reverse':'');
    $id=$section['id']??'story';
    $html='<section id="'.esc_attr($id).'" class="'.$cls.'" aria-labelledby="'.esc_attr($id).'-title"><div class="bs-shell bs-story-shell"><div class="bs-story-copy">';
    $html.=ftt_heading((string)($section['title']??''),'','','bs-story-heading',$id.'-title');
    $html.='<div class="bs-story-prose">';
    foreach($leads as $p)if(!str_starts_with(trim((string)$p),'* '))$html.='<p>'.esc_html($p).'</p>';
    $html.='</div><ul class="bs-story-checklist">';
    foreach($leads as $p)if(str_starts_with(trim((string)$p),'* '))$html.='<li>'.ftt_icon('check').'<span>'.esc_html(ltrim(trim($p),'* ')).'</span></li>';
    $html.='</ul><div class="bs-story-details">';
    foreach($topics as $i=>$t){
        $icon=$visual['icons'][$i%3]??'check';
        $html.='<article><span class="bs-story-detail-icon">'.ftt_icon($icon).'</span><div>'.ftt_h((string)$t['heading'],3);
        foreach($t['paragraphs'] as $p)$html.='<p>'.esc_html($p).'</p>';
        $html.='</div></article>';
    }
    $html.='</div></div><div class="bs-story-visual">';
    if($img)$html.='<img src="'.esc_url($img['url']).'" alt="" class="bs-story-photo" loading="lazy">';
    $html.='<div class="bs-story-gradient" aria-hidden="true"></div><div class="bs-story-diagram"><span class="bs-story-diagram-label">'.esc_html($visual['eyebrow']??'').'</span><div class="bs-story-nodes">';
    foreach($visual['nodes']??[] as $i=>$label){
        $html.='<div class="bs-story-node"><span class="bs-story-node-icon">'.ftt_icon($visual['icons'][$i]??'check').'</span><span>'.esc_html($label).'</span></div>';
    }
    return $html.'</div><div class="bs-story-diagram-bottom"><span class="bs-story-live-dot"></span>Integrated technology workflow</div></div></div></div></section>';
}
function ftt_faq(array $section):string{
    $items=$section['items']??[];$id=$section['id']??'faq';
    $html='<section class="bs-section bs-dense-section bs-dense-faq-page bs-faq-polished" id="'.esc_attr($id).'" aria-labelledby="faq-questions-heading"><div class="bs-shell">'
      .'<header class="bs-ui-heading bs-dense-heading bs-faq-heading">'
      .'<span class="bs-ui-kicker">SUPPORT & GUIDANCE</span>'
      .ftt_h('Frequently Asked Questions',2,'bs-ui-title','faq-questions-heading')
      .'<p class="bs-faq-count"><strong>'.count($items).'</strong><span>questions answered</span></p></header>'
      .'<div class="bs-dense-accordion bs-clean-accordion bs-faq-questions">';
    foreach($items as $i=>$item){
        $html.='<details name="ftt-faq"'.(!empty($section['openFirst'])&&$i===0?' open':'').'><summary><span class="bs-faq-question">'.esc_html($item['q']??'').'</span>'.ftt_icon('chevronDown').'</summary>'
          .'<div class="bs-dense-answer bs-faq-answer"><p>'.esc_html($item['a']??'').'</p></div></details>';
    }
    return $html.'</div></div></section>';
}
function ftt_media_band(array $section,string $title):string{
    $img=ftt_image((string)($section['media']['imageKey']??''));
    if(!$img)return '';
    $words=preg_split('/\s+/',trim($title));$pivot=(int)max(1,ceil(count($words)*0.56));
    $first=implode(' ',array_slice($words,0,$pivot));$accent=implode(' ',array_slice($words,$pivot));
    $id=$section['id']??'media';
    return '<section id="'.esc_attr($id).'" class="bs-v5-media bs-v5-media-title-band" aria-labelledby="'.esc_attr($id).'-heading">'
      .'<img class="bs-v5-media-photo" src="'.esc_url($img['url']).'" alt="" loading="lazy"><div class="bs-v5-media-shade" aria-hidden="true"></div>'
      .'<div class="bs-shell bs-v5-media-caption"><div class="bs-v5-media-title-content"><span class="bs-v5-media-eyebrow">FOREX TRADE TECHNOLOGY</span>'
      .ftt_h($first.' '.$accent,2,'bs-v5-media-title',$id.'-heading').'</div></div></section>';
}
function ftt_gallery(array $section):string{
    $html='<section id="'.esc_attr($section['id']??'gallery').'" class="bs-v5-section bs-v5-gallery"><div class="bs-shell">'
      .ftt_heading((string)($section['title']??''),'TECHNOLOGY IN PRACTICE','','bs-v5-section-heading')
      .'<div class="bs-v5-gallery-grid">';
    foreach($section['media']['imageKeys']??[] as $key){
        $img=ftt_image($key);if(!$img)continue;
        $html.='<figure><div class="bs-v5-gallery-photo"><img loading="lazy" src="'.esc_url($img['url']).'" alt="'.esc_attr($img['alt']??'').'"></div><figcaption>'.esc_html($img['alt']??'').'</figcaption></figure>';
    }
    return $html.'</div></div></section>';
}
function ftt_guide(string $pageId):string{
    if($pageId==='')return '';
    $pages=glob(get_theme_file_path('data/pages/*.json'))?:[];
    $page=[];
    foreach($pages as $p){$doc=json_decode((string)file_get_contents($p),true);if(($doc['id']??'')===$pageId){$page=$doc;break;}}
    if(!$page)return '';
    $used=[];
    foreach($page['sections']??[] as $section)foreach($section['blocks']??[] as $b){
        $key=($b['type']??'').'|'.($b['text']??'');$used[$key]=($used[$key]??0)+1;
    }
    $groups=[];$active=['title'=>'Introduction and overview','blocks'=>[]];
    foreach($page['fullBlocks']??[] as $b){
        if(preg_match('/^(breadcrumb|label):\s/i',trim((string)($b['text']??''))))continue;
        if(($b['type']??'')==='h2'){
            if($active['blocks'])$groups[]=$active;
            $active=['title'=>$b['text'],'blocks'=>[]];continue;
        }
        $key=($b['type']??'').'|'.($b['text']??'');
        if(($used[$key]??0)>0){$used[$key]--;continue;}
        $active['blocks'][]=$b;
    }
    if($active['blocks'])$groups[]=$active;
    if(!$groups)return '';
    $html='<section class="bs-v5-guide bs-v5-section" id="complete-technical-guide" aria-labelledby="complete-guide-title"><div class="bs-shell">'
      .ftt_heading('Further details and frequently asked questions','IN-DEPTH TECHNICAL GUIDE','Complete supporting explanations, implementation considerations and FAQs from our original service guide.','bs-v5-guide-head','complete-guide-title')
      .'<div class="bs-v5-guide-grid bs-clean-accordion">';
    foreach($groups as $g){
        $html.='<details class="bs-v5-guide-item" name="ftt-guide"><summary><span>'.esc_html($g['title']).'</span>'.ftt_icon('chevronDown').'</summary><div class="bs-v5-copy">';
        foreach($g['blocks'] as $b)$html.=($b['type']??'')==='p'?'<p>'.esc_html($b['text']).'</p>':ftt_h((string)$b['text'],3);
        $html.='</div></details>';
    }
    return $html.'</div></div></section>';
}
