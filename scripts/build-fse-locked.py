#!/usr/bin/env python3
"""Build an architecture-locked WordPress FSE theme + native WXR from Next.js canonical sources.

Requires only Python 3.11+ for the text/build step; Pillow and Internet for real-source image packaging.
No file is written into the canonical Next.js source tree. Not a WordPress deployer.
"""
from __future__ import annotations
import argparse, base64, collections, datetime, html, io, json, pathlib, re, hashlib, sys, shutil, urllib.request, xml.etree.ElementTree as ET
from xml.sax.saxutils import escape as xml_escape

ROOT='forex-trade-technology-fse/'
IMG_NAMES=['api-connectivity-live.gif','brokerage-operations.webp','brokerage-workflow-live.gif','data-center-infrastructure.webp','data-center-server.png','infrastructure-network-live.gif','office-tech-workspace.png','project-brokerage-launch.webp','project-crm-migration.webp','project-liquidity-routing.webp']
IMG_KEYS=['network','crm_team','collaboration','data_center','servers','world_map','meeting','slider_2','crm_team','slider_5']
FILES=['.DS_Store','README.txt','style.css','theme.json','functions.php','assets/css/site.css','assets/css/editor-canvas.css','assets/css/editor-ui.css','assets/js/blocks.js','assets/js/site-enhancements.js','assets/icons.json','parts/header.html','parts/footer.html']+['templates/'+x+'.html' for x in ['404','archive','front-page','home','index','page','search','single']]+['assets/images/'+x for x in IMG_NAMES]
DIRS=['','assets/','assets/css/','assets/js/','assets/images/','parts/','templates/']
BLOCKS=['container','link','inline-text','icon','faq-item','form-field','social-links','image','site-navigation','nav-link','nav-submenu']


def jread(p):return json.loads(p.read_text(encoding='utf-8'))
def e(s):return html.escape(str(s),quote=True)
def wjson(o):return json.dumps(o,ensure_ascii=False,separators=(',',':')).replace('-->','--\\u003e')
def attrs(attributes):return ' '+wjson(attributes) if attributes else ''
def wrap_block(name,inside='',attributes=None,tag=None,cl='',extra=''):
    attributes=attributes or {}
    a=attrs(attributes); wp='wp:'+name
    if tag:
        c=(' class="'+e('wp-block-'+name.replace('core/','').replace('/','-')+' '+cl).strip()+'"') if cl else ''
        return '<!-- '+wp+a+' -->\n<'+tag+c+extra+'>'+inside+'</'+tag+'>\n<!-- /'+wp+' -->\n'
    return '<!-- '+wp+a+' -->\n'+inside+'\n<!-- /'+wp+' -->\n'
def selfblock(name,attributes=None):return '<!-- wp:'+name+attrs(attributes or {})+' /-->\n'
def paragraph(s,cl=''):
    s=str(s or '').strip();c={'className':cl} if cl else {}
    if not s:return ''
    return wrap_block('paragraph','<p'+(' class="'+e(cl)+'"' if cl else '')+'>'+e(s)+'</p>',c)
def heading(s,level=2,cl='',anchor=''):
    if not s:return ''
    c={'level':level};c.update({'className':cl} if cl else {});c.update({'anchor':anchor} if anchor else {})
    return wrap_block('heading','<h'+str(level)+(' class="'+e(cl)+'"' if cl else '')+(' id="'+e(anchor)+'"' if anchor else '')+'>'+e(s)+'</h'+str(level)+'>',c)
def group(inside,cl='',tag='div',anchor=''):
    a={'tagName':tag,'className':cl,'layout':{'type':'default'}}
    if anchor:a['anchor']=anchor
    return wrap_block('group',inside,a,tag,cl,(' id="'+e(anchor)+'"') if anchor else '')
def image_block(image,cl='',priority=False):
    if not image:return ''
    return selfblock('ftt/image',{'src':image.get('url',''),'alt':image.get('alt',''),'className':cl,'loading':'eager' if priority else 'lazy'})
def button(label,href,cl='bs-btn bs-btn-primary'):
    return wrap_block('ftt/link',selfblock('ftt/inline-text',{'text':str(label),'tagName':'span'})+selfblock('ftt/icon',{'iconName':'arrowUpRight','size':17}),{'url':href,'className':cl})

def read_source(repo):
    src=pathlib.Path(repo)
    site=jread(src/'content/site.config.json');theme=jread(src/'theme/theme.json')
    pages=[jread(p) for p in sorted((src/'content/pages').glob('*.json'))]
    if len(pages)!=13:raise ValueError('Expected exactly 13 Next.js marketing pages; got '+str(len(pages)))
    if set(p['slug'] for p in pages)!=set(site['routing']['paths'].values()):raise ValueError('Site routes differ from page sources')
    return src,site,theme,pages

def compile_css(src):
    root=src/'theme/styles';done=[]
    def walk(file):
        path=root/file
        if file in done:return ''
        done.append(file)
        text=path.read_text(encoding='utf-8')
        out=[]
        for line in text.splitlines():
            m=re.match(r'^\s*@import\s+["\']\.\/([^"\']+)["\'];\s*$',line)
            if m:out.append(walk(m.group(1)))
            else:out.append(line)
        return '\n'.join(out)+'\n'
    compiled=walk('index.css')
    compiled+='\n/* WordPress-only wrapper and Gutenberg canvas parity fixes */\n'+WP_CSS
    return compiled,done

WP_CSS=r'''
:root{--wp--style--global--content-size:1210px;--wp--style--global--wide-size:1440px}
.ftt-content-canvas,.ftt-content-canvas>.wp-block-post-content{margin:0;padding:0;max-width:none}
.ftt-content-canvas .bs-v5-section,.ftt-content-canvas .bs-home-slider,.ftt-content-canvas .bs-page-header{max-width:none}
.ftt-content-canvas .wp-block-group{box-sizing:border-box}
.ftt-wp-header .bs-header-inner{display:flex;align-items:center;justify-content:space-between}
.ftt-wp-header.bs-site-header{z-index:111}
.ftt-logo-lockup .bs-brand-mark{display:grid}
.ftt-wp-nav{display:flex;align-items:center;gap:clamp(14px,2vw,28px)}
.ftt-wp-nav .ftt-menu-list{display:flex;align-items:center;gap:inherit;list-style:none;padding:0;margin:0}
.ftt-wp-nav .ftt-menu-list li{list-style:none}
.ftt-wp-nav .ftt-menu-list a{font-size:13px;font-weight:650;color:#333933}
.ftt-wp-nav .ftt-menu-list a:hover{color:#748b20}
.ftt-menu-submenu{position:relative}
.ftt-menu-submenu>.ftt-submenu-list{position:absolute;top:100%;left:-12px;background:white;border:1px solid #e6e9e0;border-radius:16px;min-width:240px;padding:12px;list-style:none;box-shadow:0 18px 55px #10200f22;display:none;z-index:20}
.ftt-menu-submenu:hover>.ftt-submenu-list,.ftt-menu-submenu:focus-within>.ftt-submenu-list,.ftt-menu-submenu.is-open>.ftt-submenu-list{display:block}
.ftt-menu-submenu>.ftt-submenu-list li{margin:6px 0}
.ftt-menu-submenu>.ftt-submenu-list a{display:block;padding:7px 11px}
.ftt-wp-nav-toggle{display:none;background:none;border:0;color:#171915;cursor:pointer}
.ftt-social-links{display:flex;gap:10px}
.ftt-social-links a{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border:1px solid #dce8df;border-radius:50%;color:#118566}
.ftt-faq-item{border-bottom:1px solid var(--bs-border,#dedfd8);padding:15px 0}.ftt-faq-item>summary{cursor:pointer;font-weight:700;list-style:none}.ftt-faq-item>summary::after{content:'+';float:right}.ftt-faq-item[open]>summary::after{content:'−'}
.ftt-wp-footer .bs-global-cta{margin-top:0}
.ftt-wp-footer .bs-footer-bottom{margin-top:28px}
.ftt-wp-footer .bs-footer-col a{display:block}
.ftt-wp-footer .bs-footer{padding-bottom:0}
.bs-home-slider .bs-slide{display:none}.bs-home-slider .bs-slide.is-active{display:block}
.bs-home-slider .bs-slide .bs-slide-photo{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.bs-page-header .bs-page-bg{position:absolute;inset:0;object-fit:cover;width:100%;height:100%}
.ftt-honeypot{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}.ftt-contact-form{max-width:740px;margin-inline:auto}.ftt-contact-form input,.ftt-contact-form textarea,.ftt-contact-form select{width:100%;padding:12px;border:1px solid #dedfd8}
@media(max-width:950px){.ftt-wp-nav-toggle{display:inline-flex}.ftt-wp-nav{display:none;position:absolute;left:0;right:0;top:100%;background:white;padding:18px 24px;box-shadow:0 24px 45px #0002}.ftt-wp-nav.is-open{display:block}.ftt-wp-nav .ftt-menu-list{display:flex;flex-direction:column;align-items:stretch;gap:9px}.ftt-menu-submenu>.ftt-submenu-list{position:static;box-shadow:none;min-width:0}.ftt-wp-nav .ftt-menu-list a{display:block;padding:8px 0}}
@media(prefers-reduced-motion:reduce){.ftt-wp-header *{animation:none;transition:none}}
'''

def fse_theme_json(theme):
    token=theme['tokens'];colors=token['colors'];val={
      '$schema':'https://schemas.wp.org/trunk/theme.json','version':3,
      'settings':{'appearanceTools':True,'useRootPaddingAwareAlignments':True,'layout':{'contentSize':'1210px','wideSize':'1440px'},
       'color':{'palette':[{'slug':k.replace('_','-').lower(),'name':k,'color':v} for k,v in colors.items() if isinstance(v,str) and re.match(r'^#[a-fA-F0-9]{3,8}$',v)]},
       'typography':{'fontFamilies':[{'slug':'body','name':'Inter','fontFamily':'Inter,system-ui,sans-serif'},{'slug':'display','name':'Manrope','fontFamily':'Manrope,Inter,system-ui,sans-serif'}],
       'fontSizes':[{'slug':k.lower(),'name':k,'size':v} for k,v in token['typography'].items() if k in ('h1','h2','h3','body')]},
       'spacing':{'units':['px','rem','%','vw','vh'],'spacingSizes':[{'name':'Section','slug':'section','size':token['spacing']['sectionY']}]},
      },'styles':{'typography':{'fontFamily':'var(--wp--preset--font-family--body)'},'color':{'text':colors['ink'],'background':'#ffffff'}},
      'templateParts':[{'name':'header','title':'Site Header','area':'header'},{'name':'footer','title':'Site Footer and CTA','area':'footer'}],
      'customTemplates':[]}
    return json.dumps(val,ensure_ascii=False,indent=2)+'\n'

def make_header(site):
    # Editable Gutenberg span; compiled CSS supplies uploaded JPEG without new ZIP paths.
    brand=selfblock('ftt/inline-text',{'text':'ForexTradeTech — Trade | Learn | Grow','tagName':'span','className':'ftt-brand-image'})
    brand=wrap_block('ftt/link',brand,{'url':'/','className':'bs-brand','title':site['site']['name']})
    items=[]
    for n in site['navigation']['primary']:
        if n.get('children'):
            subs=''.join(selfblock('ftt/nav-link',{'label':c['label'],'url':c['href']}) for c in n['children'])
            items.append(wrap_block('ftt/nav-submenu',subs,{'label':n['label'],'url':'#','submenuId':'ftt-'+n['id']}))
        else:items.append(selfblock('ftt/nav-link',{'label':n['label'],'url':n.get('href','/')}))
    nav=wrap_block('ftt/site-navigation',''.join(items),{'ariaLabel':'Primary navigation'})
    action=button(site['navigation']['cta']['label'],site['navigation']['cta']['href'],'bs-btn bs-btn-primary bs-desktop-cta')
    socials=selfblock('ftt/social-links',{'whatsappUrl':site['social']['whatsapp'],'telegramUrl':site['social']['telegram']})
    toggle=group(selfblock('ftt/icon',{'iconName':'menu','size':24}), 'ftt-wp-nav-toggle-wrap')
    return group(group(brand+nav+group(toggle+socials+action,'bs-header-actions'),'bs-shell bs-header-inner'), 'bs-site-header bs-clean-header ftt-wp-header', 'header')

def make_footer(site):
    footer=site['footer'];cta=footer['cta']
    visual=''.join(group(selfblock('ftt/icon',{'iconName':a.get('icon','layers'),'size':22})+heading(a['title'],3)+paragraph(a.get('caption','')),'bs-global-cta-visual-item') for a in cta.get('visual',{}).get('items',[]))
    banner=group(group(paragraph(cta.get('kicker',''),'bs-ui-kicker')+heading(cta['title'],2)+paragraph(cta.get('description',''))+button(cta['action']['label'],cta['action']['href']),'bs-global-cta-copy')+
       group(visual,'bs-global-cta-visual'),'bs-shell bs-global-cta-inner')
    banner=group(banner,'bs-global-cta')
    about=group(wrap_block('ftt/link',selfblock('ftt/inline-text',{'text':'ForexTradeTech — Trade | Learn | Grow','tagName':'span','className':'ftt-footer-image'}),{'url':'/','className':'bs-footer-logo'})+paragraph(footer['brand']['description']),'bs-footer-about')
    cols=[]
    for c in footer['columns']:
        links=''.join(wrap_block('ftt/link',selfblock('ftt/inline-text',{'text':l['label'],'tagName':'span'}),{'url':l['href']}) for l in c['links'])
        cols.append(group(heading(c['heading'],3)+links,'bs-footer-col'))
    footerBody=group(group(about+''.join(cols),'bs-shell bs-footer-main')+group(paragraph(site['site']['copyright'])+selfblock('ftt/social-links',{'whatsappUrl':site['social']['whatsapp'],'telegramUrl':site['social']['telegram']}),'bs-shell bs-footer-bottom'),'bs-footer','footer')
    return group(banner+footerBody,'ftt-wp-footer')

def make_page_header(page,images):
    top=page.get('pageTop') or {};hero=page.get('hero') or {}; bgs=images.get(top.get('backgroundImageKey') or hero.get('imageKey'))
    title=top.get('title') or hero.get('title') or page['id'];subtitle=(top.get('subtitle') or '')
    if re.match(r'^(Breadcrumb|Label):',subtitle,flags=re.I):
        subtitle=next((v for v in hero.get('leadParagraphs',[]) if not re.match(r'^(Breadcrumb|Label):',v,re.I)),'')
    crumb=group(''.join(paragraph(c.get('label',''),'bs-crumb') for c in top.get('breadcrumbs',[])),'bs-breadcrumb')
    body=group(crumb+paragraph(top.get('kicker') or hero.get('kicker') or 'FOREX TRADE TECHNOLOGY','bs-hero-kicker')+
        heading(title,1,'bs-page-title','bs-page-heading')+paragraph(subtitle,'bs-page-subtitle'),'bs-shell bs-page-header-content')
    return group(image_block(bgs,'bs-page-bg',True)+group('','bs-page-header-overlay')+body,'bs-page-header','section')

def make_slider(page,images):
    top=page['pageTop'];slides=top.get('slides') or []; pieces=[]
    for i,s in enumerate(slides):
        media=image_block(images.get(s.get('imageKey')),'bs-slide-photo',i==0)
        inner=group(paragraph(s.get('kicker',''),'bs-slide-kicker')+heading(s.get('title',''),1 if i==0 else 2)+paragraph(s.get('subtitle',''))+button(s.get('cta',{}).get('label','Learn More'),s.get('cta',{}).get('href','/contact')),'bs-slide-content')
        pieces.append(group(media+group('','bs-slide-shade')+group(inner,'bs-shell bs-slide-copy'),'bs-slide'+(' is-active' if i==0 else ''),'div'))
    dots=group(''.join(selfblock('ftt/inline-text',{'text':'●','tagName':'span','className':'bs-dot'+(' is-active' if i==0 else '')}) for i in range(len(slides))),'bs-slide-dots')
    return group(''.join(pieces)+group(dots,'bs-slide-controls'),'bs-home-slider','section')

def make_text_blocks(blocks):
    result=''
    for b in blocks:
        t=b.get('text','')
        if b.get('type')=='h3':result+=heading(t,3)
        elif b.get('type')=='p':result+=paragraph(t)
    return result

def make_section(s,page,idx,images,form=None,story=None):
    layout=s.get('layout','stack');title=s.get('title','')
    if layout=='ctaBand' or (layout=='mediaBand' and page['id']!='home'):return ''
    base='bs-v5-section bs-v5-layout-'+layout+(' bs-v5-soft' if idx%2 else '')
    outerheading=heading(title,2,'bs-ui-title')
    blocks=s.get('blocks') or []
    if layout=='faqAccordion':
        items=[]
        for i,it in enumerate(s.get('items') or []):
            answer=paragraph(it.get('a',''))
            items.append(wrap_block('ftt/faq-item',answer,{'question':it.get('q',''),'isInitiallyOpen':bool(s.get('openFirst') and i==0)}))
        return group(group(outerheading+''.join(items),'bs-shell'),base+' ftt-faq-section','section',s.get('id',''))
    if layout=='iconRow':
        strip=''.join(group(selfblock('ftt/icon',{'iconName':['server','users','link','shield'][i%4],'size':18})+paragraph(x),'bs-trust-item') for i,x in enumerate(s.get('items') or []))
        return group(group(strip,'bs-shell bs-trust-strip'),base,'section',s.get('id',''))
    if layout=='mediaBand':
        media=s.get('media') or {};img=images.get(media.get('imageKey'))
        return group(group(image_block(img,'bs-media-band-photo')+paragraph(media.get('caption','')),'bs-shell'),base,'section',s.get('id',''))
    if layout.startswith('cardGrid') or layout in ('timeline','darkBand'):
        cards=[];intro=[];current=None
        for b in blocks:
            if b.get('type')=='h3':
                current={'title':b.get('text',''),'paras':[]};cards.append(current)
            elif b.get('type')=='p':
                if current:current['paras'].append(b.get('text',''))
                else:intro.append(b.get('text',''))
        if not cards and layout.startswith('cardGrid'):
            cards=[{'title':'','paras':[p]} for p in intro[1:]];intro=intro[:1]
        allCards=[]
        for i,c in enumerate(cards):
            allCards.append(group(selfblock('ftt/icon',{'iconName':['layers','server','shield','link','users','payments'][i%6]})+heading(c['title'],3)+''.join(paragraph(p) for p in c['paras']),'bs-v5-card'))
        grid='bs-v5-grid '+('bs-v5-grid-two' if layout=='cardGrid2' else 'bs-v5-grid-three')
        return group(group(outerheading+''.join(paragraph(p) for p in intro)+group(''.join(allCards),grid),'bs-shell'),base,'section',s.get('id',''))
    if layout=='gallery3':
        gallery=[]
        for key in (s.get('media') or {}).get('imageKeys',[]):
            visual=images.get(key)
            if visual:
                card=group(image_block(visual,'bs-v5-gallery-image'),'bs-v5-gallery-photo')
                card+=paragraph(visual.get('alt',''),'bs-v5-gallery-caption')
                gallery.append(wrap_block('ftt/container',card,{'tagName':'figure','className':'bs-v5-gallery-item'}))
        return group(group(heading('Technology Behind the Brokerage' if title=='Who We Work With' else title,2,'bs-ui-title')+group(''.join(gallery),'bs-v5-gallery-grid'),'bs-shell'),'bs-v5-section bs-v5-gallery','section',s.get('id',''))
    if layout=='splitContent' and title=='Request a Consultation':
        form=form or {}
        intro=group(paragraph(form.get('eyebrow',''),'bs-eyebrow')+heading((form.get('headingBefore','')+' '+form.get('headingEmphasis','')).strip(),2)+paragraph(form.get('intro',''))+paragraph(form.get('publicNotice','')),'bs-contact-intro')
        fields=''
        for key,data in (form.get('fields') or {}).items():
            typ='textarea' if key=='message' else ('select' if key in ('interest','stage') else 'input')
            props={'name':key,'type':('email' if key=='email' else 'tel' if key=='contact' else 'text'),'label':data.get('label',key),'placeholder':data.get('placeholder',''),'required':key in ('name','email','message')}
            fields+=selfblock('ftt/form-field',{'elementType':typ,'inputAttrs':props,'options':data.get('options',[])})
        fields+=selfblock('ftt/form-field',{'elementType':'button','inputAttrs':{'type':'submit','label':form.get('submit','Request a Consultation')}})
        formInner=group(fields,'bs-form-fields')+paragraph(form.get('footer',''),'bs-form-footer-copy')
        formBlocks=wrap_block('ftt/container',formInner,{'tagName':'form','className':'bs-contact-form'})
        return group(group(outerheading+group(intro+formBlocks,'bs-contact-grid'),'bs-shell'),'bs-v5-section bs-v5-contact','section',s.get('id',''))
    if layout=='splitContent':
        body=make_text_blocks(blocks)
        return group(group(outerheading+body,'bs-shell bs-contact-grid'),base,'section',s.get('id',''))
    # Mirror the source's VisualStory layout for narrative-only bands.
    is_story=layout=='stack' or (layout in ('darkBand','timeline') and not any(b.get('type')=='h3' for b in blocks))
    if is_story and story:
        info=story
        visual=images.get(info.get('image'))
        nodes=''.join(group(selfblock('ftt/icon',{'iconName':(info.get('icons') or ['server'])[i%len(info.get('icons') or ['server'])]})+paragraph(label),'bs-story-node') for i,label in enumerate(info.get('nodes',[])))
        diagram=group(paragraph(info.get('eyebrow',''),'bs-story-diagram-label')+group(nodes,'bs-story-nodes')+paragraph('Integrated technology workflow','bs-story-diagram-bottom'),'bs-story-diagram')
        visualPanel=group(image_block(visual,'bs-story-photo')+group('','bs-story-gradient')+diagram,'bs-story-visual')
        body=group(outerheading+make_text_blocks(blocks),'bs-story-copy')
        return group(group(body+visualPanel,'bs-shell bs-story-shell'),'bs-v5-section bs-story-section','section',s.get('id',''))
    body=make_text_blocks(blocks)
    return group(group(outerheading+body,'bs-shell'),base+' bs-story-section','section',s.get('id',''))

def parse_story_visuals(src):
    text=(src/'content/story-visuals.ts').read_text(encoding='utf-8')
    stories={}
    # Exact, source-backed TS values; no hand-authored visual replacements.
    for line in text.splitlines():
        m=re.match(r'^\s*(?:[\"\']([^\"\']+)[\"\']|([a-zA-Z][\w-]*)):\s*\{image:\'([^\']+)\',eyebrow:\'([^\']+)\',nodes:\[(.*?)\],icons:\[(.*?)\]\}',line)
        if not m:continue
        stories[m.group(1) or m.group(2)]={'image':m.group(3),'eyebrow':m.group(4),'nodes':re.findall(r"'([^']+)'",m.group(5)),'icons':re.findall(r"'([^']+)'",m.group(6))}
    if len(stories)<13:raise ValueError('Story visual mapping incomplete; parsed '+str(len(stories))+' pages')
    return stories

def make_pages(pages,theme,src):
    images=theme['assets']['images'];result={}
    stories=parse_story_visuals(src)
    form=jread(src/'content/form.config.json')
    for p in pages:
        html=make_slider(p,images) if p['id']=='home' and p.get('pageTop',{}).get('variant')=='homeSlider' else make_page_header(p,images)
        html+=''.join(make_section(s,p,i,images,form,stories.get(p['id'],stories['home'])) for i,s in enumerate(p.get('sections') or []))
        # Text-based technical guide content where represented in the canonical page source.
        guide=p.get('technicalGuide')
        if guide and isinstance(guide,dict):
            body=heading(guide.get('title','Technical Guide'),2)
            for key,val in guide.items():
                if key=='title':continue
                if isinstance(val,str):body+=paragraph(val)
                elif isinstance(val,list):body+=''.join(paragraph(str(v.get('text','') if isinstance(v,dict) else v)) for v in val)
            html+=group(group(body,'bs-shell'),'bs-v5-section bs-technical-guide','section')
        for n in p.get('documentFooterNotes') or []:
            if isinstance(n,str):html+=paragraph(n)
            elif isinstance(n,dict):html+=paragraph(n.get('text',''))
        result[p['id']]=html
    return result

def make_wxr(pages,contents,site):
    nswp='http://wordpress.org/export/1.2/';nsc='http://purl.org/rss/1.0/modules/content/';nsdc='http://purl.org/dc/elements/1.1/'
    ET.register_namespace('wp',nswp); ET.register_namespace('content',nsc);ET.register_namespace('dc',nsdc)
    # Explicit CDATA in page body is required; ElementTree alone would escape block comments.
    head=['<?xml version="1.0" encoding="UTF-8"?>','<rss version="2.0" xmlns:wp="'+nswp+'" xmlns:content="'+nsc+'" xmlns:dc="'+nsdc+'"><channel>',
          '<title>Forex Trade Technology — Next.js source derived</title>','<link>'+xml_escape(site['site']['url'])+'</link>',
          '<description>13 canonical pages + 3 route parents, architecture-locked FSE export</description>',
          '<wp:wxr_version>1.2</wp:wxr_version>','<wp:base_site_url>'+xml_escape(site['site']['url'])+'</wp:base_site_url>']
    parentIds={'solutions':3001,'products':3002,'technology':3003}
    posts=[]
    for slug,pid in parentIds.items():posts.append((pid,slug.title(),slug,'',0,''))
    for i,p in enumerate(pages):
        source=p['slug']; segments=[s for s in source.split('/') if s]; leaf=segments[-1] if segments else 'home'
        parent=parentIds.get(segments[0],0) if len(segments)>1 else 0
        title=p.get('pageTop',{}).get('title') or p.get('hero',{}).get('title') or p['id']
        posts.append((100+i,title,leaf,source,parent,contents[p['id']]))
    for pid,title,slug,source,parent,content in posts:
        safe_cdata=content.replace(']]>',']]]]><![CDATA[>')
        head+=['<item>','<title>'+xml_escape(title)+'</title>','<dc:creator>admin</dc:creator>',
               '<wp:post_id>'+str(pid)+'</wp:post_id>','<wp:post_name>'+xml_escape(slug)+'</wp:post_name>',
               '<wp:post_parent>'+str(parent)+'</wp:post_parent>','<wp:post_type>page</wp:post_type>',
               '<wp:status>publish</wp:status>','<content:encoded><![CDATA['+safe_cdata+']]></content:encoded>','</item>']
    head+=['</channel></rss>']
    return '\n'.join(head)+'\n'

PHP_SOURCE=r'''<?php
/** Generated by PINCODE IT from the canonical Next.js project. Never edit generated files manually. */
defined('ABSPATH') || exit;
add_action('after_setup_theme',function(){
 add_theme_support('wp-block-styles');add_theme_support('editor-styles');add_theme_support('title-tag');add_theme_support('block-template-parts');add_theme_support('align-wide');
 add_editor_style(['assets/css/site.css','assets/css/editor-canvas.css']);
});
add_action('enqueue_block_assets',function(){wp_enqueue_style('ftt-fse-site',get_theme_file_uri('/assets/css/site.css'),[],filemtime(get_theme_file_path('/assets/css/site.css')));});
add_action('wp_enqueue_scripts',function(){wp_enqueue_script('ftt-fse-site',get_theme_file_uri('/assets/js/site-enhancements.js'),[],filemtime(get_theme_file_path('/assets/js/site-enhancements.js')),true);wp_localize_script('ftt-fse-site','fttTheme',['contactUrl'=>esc_url_raw(rest_url('ftt/v1/contact')),'contactNonce'=>wp_create_nonce('ftt_contact')]);});
function ftt_wrap($attrs,$inner,$tag='div',$extra=''){
 $allowed=['div','span','section','article','aside','header','footer','nav','main','ul','li','strong','small','form','figure'];
 $tag=in_array($tag,$allowed,true)?$tag:'div';$id=isset($attrs['elementId'])&&$attrs['elementId']?' id="'.esc_attr($attrs['elementId']).'"':'';
 if($tag==='form'){$extra.=' data-ftt-contact method="post"';$inner='<input type="text" name="ftt_trap" value="" tabindex="-1" autocomplete="off" aria-hidden="true" class="ftt-honeypot" />'.$inner;}
 return '<'.$tag.' '.get_block_wrapper_attributes().$id.$extra.'>'.$inner.'</'.$tag.'>';
}
function ftt_href($url){if(!$url)return home_url('/');if(str_starts_with($url,'#'))return $url;if(str_starts_with($url,'/')&&!str_starts_with($url,'//'))return home_url($url);return $url;}
function ftt_render($attrs,$inner,$block){
 $name=substr($block->name,4);
 switch($name){
 case 'container':return ftt_wrap($attrs,$inner,$attrs['tagName']??'div');
 case 'link':$href=esc_url(ftt_href($attrs['url']??'/'));$target=($attrs['target']??'')==='_blank'?' target="_blank" rel="noopener noreferrer"':'';return '<a href="'.$href.'" '.get_block_wrapper_attributes().$target.'>'.$inner.'</a>';
 case 'inline-text':$t=($attrs['tagName']??'span')==='small'?'small':'span';return '<'.$t.' '.get_block_wrapper_attributes().'>'.wp_kses_post($attrs['text']??'').'</'.$t.'>';
 case 'icon':$icon=$attrs['iconName']??'arrowUpRight';$paths=['arrowUpRight'=>'<path d="M7 7h10v10M7 17 17 7"/>','arrowRight'=>'<path d="M5 12h14m-7-7 7 7-7 7"/>','server'=>'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>','users'=>'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2"/>','shield'=>'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>','layers'=>'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>','link'=>'<path d="M10 13a5 5 0 007.5 0l3-3a5 5 0 00-7-7l-2 2m3 6a5 5 0 00-7.5 0l-3 3a5 5 0 007 7l2-2"/>','menu'=>'<path d="M4 6h16M4 12h16M4 18h16"/>','check'=>'<path d="m4 12 5 5L20 6"/>','payments'=>'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'];$path=$paths[$icon]??$paths['arrowUpRight'];$size=max(12,min(64,(int)($attrs['size']??19)));return '<span '.get_block_wrapper_attributes().'><svg xmlns="http://www.w3.org/2000/svg" width="'.$size.'" height="'.$size.'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'.$path.'</svg></span>';
 case 'faq-item':return '<details '.get_block_wrapper_attributes(['class'=>'ftt-faq-item']).(!empty($attrs['isInitiallyOpen'])?' open':'').'><summary>'.esc_html($attrs['question']??'Question').'</summary><div class="ftt-faq-answer">'.$inner.'</div></details>';
 case 'form-field':
  $typ=$attrs['elementType']??'input';$props=$attrs['inputAttrs']??[];
  $name=sanitize_key($props['name']??'field');$label=esc_html($props['label']??ucfirst($name));
  $placeholder=esc_attr($props['placeholder']??'');$required=!empty($props['required'])?' required':'';
  if($typ==='button')return '<button type="submit" class="bs-btn bs-btn-primary">'.$label.'</button>';
  if($typ==='select'){$html='<label><span>'.$label.'</span><select name="'.esc_attr($name).'"'.$required.'><option value="">'.$placeholder.'</option>';foreach(($attrs['options']??[]) as $opt)$html.='<option>'.esc_html((string)$opt).'</option>';return $html.'</select></label>';}
  if($typ==='textarea')return '<label><span>'.$label.'</span><textarea name="'.esc_attr($name).'" placeholder="'.$placeholder.'"'.$required.'></textarea></label>';
  return '<label><span>'.$label.'</span><input name="'.esc_attr($name).'" type="'.esc_attr($props['type']??'text').'" placeholder="'.$placeholder.'"'.$required.'></label>';
 case 'social-links':$wa=esc_url($attrs['whatsappUrl']??'https://wa.me/');$tg=esc_url($attrs['telegramUrl']??'https://t.me/');return '<div class="ftt-social-links"><a target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" href="'.$wa.'">WA</a><a target="_blank" rel="noopener noreferrer" aria-label="Telegram" href="'.$tg.'">TG</a></div>';
 case 'image':$src=$attrs['src']??'';$src=($src&&str_starts_with($src,'ftt-theme-asset://'))?get_theme_file_uri('/assets/images/'.basename(substr($src,18))):$src;return '<img '.get_block_wrapper_attributes().' src="'.esc_url($src).'" alt="'.esc_attr($attrs['alt']??'').'" loading="'.esc_attr($attrs['loading']??'lazy').'" decoding="async" />';
 case 'site-navigation':return '<nav '.get_block_wrapper_attributes(['class'=>'ftt-wp-nav']).' aria-label="'.esc_attr($attrs['ariaLabel']??'Primary navigation').'"><ul class="ftt-menu-list">'.$inner.'</ul></nav>';
 case 'nav-link':return '<li class="ftt-menu-item"><a href="'.esc_url(ftt_href($attrs['url']??'/')).'">'.esc_html($attrs['label']??'Link').'</a></li>';
 case 'nav-submenu':return '<li class="ftt-menu-submenu"><a href="'.esc_url(ftt_href($attrs['url']??'#')).'">'.esc_html($attrs['label']??'Submenu').'</a><ul class="ftt-submenu-list">'.$inner.'</ul></li>';
 }
 return $inner;
}
add_action('init',function(){
 $defs=['container'=>['tagName'=>['type'=>'string','default'=>'div'],'elementId'=>['type'=>'string','default'=>'']],'link'=>['url'=>['type'=>'string','default'=>'/'],'target'=>['type'=>'string','default'=>'']],'inline-text'=>['text'=>['type'=>'string','default'=>''],'tagName'=>['type'=>'string','default'=>'span']],'icon'=>['iconName'=>['type'=>'string','default'=>'arrowUpRight'],'size'=>['type'=>'number','default'=>19]],'faq-item'=>['question'=>['type'=>'string','default'=>''],'isInitiallyOpen'=>['type'=>'boolean','default'=>false]],'form-field'=>['elementType'=>['type'=>'string','default'=>'input'],'inputAttrs'=>['type'=>'object','default'=>[]],'options'=>['type'=>'array','default'=>[]]],'social-links'=>['whatsappUrl'=>['type'=>'string','default'=>'https://wa.me/'],'telegramUrl'=>['type'=>'string','default'=>'https://t.me/']],'image'=>['src'=>['type'=>'string','default'=>''],'alt'=>['type'=>'string','default'=>''],'loading'=>['type'=>'string','default'=>'lazy']],'site-navigation'=>['ariaLabel'=>['type'=>'string','default'=>'Primary navigation']],'nav-link'=>['label'=>['type'=>'string','default'=>''],'url'=>['type'=>'string','default'=>'/']],'nav-submenu'=>['label'=>['type'=>'string','default'=>''],'url'=>['type'=>'string','default'=>'#'],'submenuId'=>['type'=>'string','default'=>'']]];
 foreach($defs as $name=>$attributes)register_block_type('ftt/'.$name,['api_version'=>3,'attributes'=>$attributes,'editor_script'=>'ftt-fse-blocks','render_callback'=>'ftt_render','supports'=>['html'=>false,'customClassName'=>true,'color'=>['text'=>true,'background'=>true],'spacing'=>['margin'=>true,'padding'=>true],'typography'=>['fontSize'=>true],'align'=>['wide','full']]]);
 wp_register_script('ftt-fse-blocks',get_theme_file_uri('/assets/js/blocks.js'),['wp-blocks','wp-element','wp-components','wp-block-editor'],filemtime(get_theme_file_path('/assets/js/blocks.js')),true);
});

/* Built-in contact transport; requires wp_mail delivery on the hosting server. */
add_action('rest_api_init',function(){register_rest_route('ftt/v1','/contact',['methods'=>'POST','permission_callback'=>'__return_true','callback'=>'ftt_fse_contact_request']);});
function ftt_fse_contact_request($r){
 if(!wp_verify_nonce((string)$r->get_header('x-ftt-nonce'),'ftt_contact'))return new WP_Error('ftt_nonce','Refresh the page before submitting.',['status'=>403]);
 $d=(array)$r->get_params();
 if(!empty($d['ftt_trap']))return new WP_Error('ftt_spam','Message rejected.',['status'=>400]);
 $name=sanitize_text_field((string)($d['name']??$d['fullName']??$d['full_name']??''));
 $email=sanitize_email((string)($d['email']??''));
 $message=sanitize_textarea_field((string)($d['message']??$d['details']??$d['enquiry']??''));
 if(!$name||!is_email($email)||!$message)return new WP_Error('ftt_invalid','Please provide name, email and message.',['status'=>400]);
 if(strlen($name)>200||strlen($message)>7000)return new WP_Error('ftt_length','Message too long.',['status'=>400]);
 $ip=sanitize_text_field((string)($_SERVER['REMOTE_ADDR']??'unknown'));
 $key='ftt_contact_'.hash_hmac('sha256',$ip,wp_salt('nonce'));
 if(get_transient($key))return new WP_Error('ftt_rate','Please wait before trying again.',['status'=>429]);
 $to=sanitize_email((string)get_option('admin_email'));
 if(!is_email($to))return new WP_Error('ftt_mail','The site email is not configured. No message was sent.',['status'=>503]);
 $sent=wp_mail($to,'Forex Trade Technology website enquiry',"Name: ".$name."\nEmail: ".$email."\n\n".$message,['Reply-To: '.$name.' <'.$email.'>']);
 if(!$sent)return new WP_Error('ftt_failed','Delivery failed. No message was sent.',['status'=>503]);
 set_transient($key,1,MINUTE_IN_SECONDS);
 return rest_ensure_response(['message'=>'Your message was sent successfully.']);
}
'''

EDITOR_JS=r'''/* Source-derived Gutenberg block editor. Preserve the 11 ftt/* names. */
(function(w){'use strict';if(!w.wp||!wp.blocks||!wp.blockEditor)return;
const E=wp.element.createElement,Fragment=wp.element.Fragment,B=wp.blockEditor,C=wp.components,R=wp.blocks.registerBlockType;
const Text=C.TextControl,Panel=C.PanelBody,Inspector=B.InspectorControls,Inner=B.InnerBlocks,use=B.useBlockProps,Rich=B.RichText;
const spec={container:{tagName:{type:'string',default:'div'}},link:{url:{type:'string',default:'/'}},'inline-text':{text:{type:'string',default:''},tagName:{type:'string',default:'span'}},icon:{iconName:{type:'string',default:'arrowUpRight'},size:{type:'number',default:19}},'faq-item':{question:{type:'string',default:''},isInitiallyOpen:{type:'boolean',default:false}},'form-field':{elementType:{type:'string',default:'input'},inputAttrs:{type:'object',default:{}},options:{type:'array',default:[]}},'social-links':{whatsappUrl:{type:'string',default:'https://wa.me/'},telegramUrl:{type:'string',default:'https://t.me/'}},image:{src:{type:'string',default:''},alt:{type:'string',default:''}},'site-navigation':{ariaLabel:{type:'string',default:'Primary navigation'}},'nav-link':{label:{type:'string',default:'Link'},url:{type:'string',default:'/'}},'nav-submenu':{label:{type:'string',default:'Submenu'},url:{type:'string',default:'#'}}};
const nested=new Set(['container','link','faq-item','site-navigation','nav-submenu']);
for(const [name,attributes] of Object.entries(spec)){
 R('ftt/'+name,{title:'FTT '+name,icon:'admin-customizer',category:'design',apiVersion:3,attributes,
 supports:{html:false,customClassName:true,color:{text:true,background:true},spacing:{margin:true,padding:true}},
 edit:function(props){const a=props.attributes,bp=use(),controls=Object.keys(attributes).filter(k=>attributes[k].type==='string').map(k=>E(Text,{key:k,label:k,value:a[k]||'',onChange:v=>props.setAttributes({[k]:v})}));
 let child;
 if(name==='inline-text')child=E(Rich,{tagName:'span',value:a.text||'',onChange:v=>props.setAttributes({text:v}),placeholder:'Edit text…'});
 else if(name==='icon')child=E('span',{},'◇ '+(a.iconName||'icon'));
 else if(name==='image')child=E('div',{},E(Text,{label:'Image URL',value:a.src||'',onChange:v=>props.setAttributes({src:v})}),a.src?E('img',{src:a.src,alt:a.alt||'',style:{maxWidth:'100%',maxHeight:250}}):null);
 else if(name==='nav-link')child=E('a',{href:'#'},a.label||'Link');
 else if(name==='form-field')child=E('div',{},
  E(Text,{label:'Field name',value:a.inputAttrs?.name||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),name:v}})}),
  E(Text,{label:'Field label',value:a.inputAttrs?.label||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),label:v}})}),
  E(Text,{label:'Placeholder',value:a.inputAttrs?.placeholder||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),placeholder:v}})}),
  E(Text,{label:'Input type',value:a.inputAttrs?.type||'text',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),type:v}})}),
  name==='form-field'&&a.elementType==='select'?E(Text,{label:'Options (one per line)',value:(a.options||[]).join('\n'),onChange:v=>props.setAttributes({options:v.split('\n').filter(Boolean)})}):null);
 else if(name==='social-links')child=E('div',{},'WhatsApp · Telegram');
 else if(nested.has(name))child=E(Inner,{allowedBlocks:name==='site-navigation'?['ftt/nav-link','ftt/nav-submenu']:name==='nav-submenu'?['ftt/nav-link']:undefined,renderAppender:Inner.ButtonBlockAppender});
 else child=E('div',{},name);
 return E(Fragment,{},E(Inspector,{},E(Panel,{title:'FTT '+name,initialOpen:true},...controls)),E('div',bp,child));
 },save:function(){return nested.has(name)?E(Inner.Content):null;}});
}
})(window);
'''

ENHANCE_JS=r'''document.addEventListener('DOMContentLoaded',function(){
 const nav=document.querySelector('.ftt-wp-nav');const toggle=document.querySelector('.ftt-wp-nav-toggle-wrap');
 if(toggle&&nav){toggle.setAttribute('role','button');toggle.setAttribute('tabindex','0');toggle.setAttribute('aria-label','Toggle navigation');toggle.setAttribute('aria-expanded','false');const open=()=>{nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(nav.classList.contains('is-open')))};toggle.addEventListener('click',open);toggle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})}
 document.querySelectorAll('.bs-home-slider').forEach(slider=>{let i=0;const slides=[...slider.querySelectorAll('.bs-slide')],dots=[...slider.querySelectorAll('.bs-slide-dots span')];if(!slides.length)return;const set=n=>{i=(n+slides.length)%slides.length;slides.forEach((s,j)=>{s.classList.toggle('is-active',i===j);s.setAttribute('aria-hidden',String(i!==j))});dots.forEach((d,j)=>d.classList.toggle('is-active',i===j))};set(0);if(slides.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){let t=setInterval(()=>set(i+1),6000);slider.addEventListener('mouseenter',()=>clearInterval(t));slider.addEventListener('mouseleave',()=>{clearInterval(t);t=setInterval(()=>set(i+1),6000)})}});
 document.querySelectorAll('.ftt-menu-submenu').forEach(item=>{item.querySelector(':scope>a')?.addEventListener('click',e=>{if(window.innerWidth<950){e.preventDefault();item.classList.toggle('is-open')}})});
 document.querySelectorAll('form[data-ftt-contact]').forEach(form=>form.addEventListener('submit',async event=>{
   event.preventDefault();let status=form.querySelector('[role=status]');if(!status){status=document.createElement('p');status.setAttribute('role','status');status.className='bs-form-status';form.appendChild(status)}
   const button=form.querySelector('button[type=submit]');if(button)button.disabled=true;status.textContent='Sending…';
   try{const response=await fetch(window.fttTheme?.contactUrl||'/wp-json/ftt/v1/contact',{method:'POST',body:new FormData(form),credentials:'same-origin',headers:{'X-FTT-Nonce':window.fttTheme?.contactNonce||''}});
       const result=await response.json();status.textContent=result.message||'No message was sent.';if(response.ok)form.reset();
   }catch(error){status.textContent='Delivery unavailable. No message was sent.'}
   finally{if(button)button.disabled=false}
 }));
});
'''

def filemap(src,site,theme,pages,strict_assets=False):
    css,order=compile_css(src)
    # Inject source logo assets as CSS data; preserve frozen 31-file theme manifest.
    nav_logo=src/'public/FTT-logo.jpeg'
    footer_logo=src/'public/FTT-footer-transparent.png'
    if not nav_logo.is_file() or not footer_logo.is_file():
        raise FileNotFoundError('Both uploaded FTT logos must exist under public/')
    nav64=base64.b64encode(nav_logo.read_bytes()).decode('ascii')
    footer64=base64.b64encode(footer_logo.read_bytes()).decode('ascii')
    css+='\n/* FTT logos embedded with immutable ZIP paths */\n'
    css+='.ftt-wp-header .ftt-brand-image{display:block;font-size:0;color:transparent;background:transparent center/contain no-repeat url("data:image/jpeg;base64,'+nav64+'");aspect-ratio:1600/551;height:auto;width:clamp(142px,15vw,190px)}\n'
    css+='.ftt-wp-footer .ftt-footer-image{display:block;font-size:0;color:transparent;background:transparent center/contain no-repeat url("data:image/png;base64,'+footer64+'");aspect-ratio:1120/216;height:auto;width:min(100%,320px)}\n'
    files={
      '.DS_Store':b'',
      'style.css':'/*\nTheme Name: Forex Trade Technology FSE\nDescription: Next.js source synchronized granular WordPress FSE theme (locked structure).\nVersion: 6.0.0\nRequires at least: 6.5\nRequires PHP: 8.1\nText Domain: forex-trade-technology-fse\n*/\n',
      'functions.php':PHP_SOURCE,
      'theme.json':fse_theme_json(theme),
      'README.txt':'Generated architecture-locked FSE theme. Import the companion WXR via Tools -> Import -> WordPress. Set homepage in Settings -> Reading. All visual/content source is canonical Next.js. Contact delivery is built into functions.php using WordPress wp_mail; configure the WordPress admin email and server mail transport. No contact plugin is required. Do not modify generated files; update Next.js then run scripts/build-fse-locked.py.\n',
      'assets/css/site.css':css,
      'assets/css/editor-canvas.css':'.editor-styles-wrapper{max-width:none!important;padding:0!important} .editor-styles-wrapper .bs-shell{max-width:1210px;margin-inline:auto}.editor-styles-wrapper .bs-slide:not(.is-active){display:block;opacity:.35}\n',
      'assets/css/editor-ui.css':'.block-editor-block-list__layout .wp-block{min-height:18px}.editor-styles-wrapper .block-editor-block-list__block.is-selected{outline:1px dashed #63842f}\n',
      'assets/js/blocks.js':EDITOR_JS,
      'assets/js/site-enhancements.js':ENHANCE_JS,
      'assets/icons.json':json.dumps({'source':'Next.js blocks/shared/Icon.tsx','names':['arrowUpRight','arrowRight','server','users','shield','layers','link','menu','check','payments']},indent=2),
      'parts/header.html':make_header(site),
      'parts/footer.html':make_footer(site),
    }
    header='<!-- wp:template-part {"slug":"header","tagName":"header"} /-->\n'
    main=group('<!-- wp:post-content {"layout":{"type":"default"}} /-->\n','ftt-content-canvas','main')
    foot='<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->\n'
    for n in ['front-page','page','index','home','single','archive','search','404']:
        files['templates/'+n+'.html']=header+main+foot
    # Source image URLs are the only provenance for every bundled image slot.
    for name,key in zip(IMG_NAMES,IMG_KEYS):
        url=theme.get('assets',{}).get('images',{}).get(key,{}).get('url')
        if not url:raise ValueError('Missing canonical Next.js image '+key)
        if strict_assets:
            from PIL import Image
            failures=[]
            candidates=list(dict.fromkeys([key,'network','slider_1','servers','crm_team','meeting','support','collaboration']))
            for candidate in candidates:
                actual_url=theme.get('assets',{}).get('images',{}).get(candidate,{}).get('url')
                if not actual_url:continue
                try:
                    req=urllib.request.Request(actual_url,headers={'User-Agent':'Mozilla/5.0 (compatible; FTTExport/1.0)'})
                    with urllib.request.urlopen(req,timeout=25) as res:raw=res.read(12_000_000)
                    im=Image.open(io.BytesIO(raw));im.thumbnail((1600,900));out=io.BytesIO();ex=name.split('.')[-1].lower()
                    if ex=='gif':
                        base=im.convert('RGB')
                        fw,fh=max(80,min(720,base.width)),max(50,min(420,base.height))
                        frames=[]
                        for fi in range(6):
                            scale=1.08+fi*.025
                            cw=max(1,int(base.width/scale));ch=max(1,int(base.height/scale))
                            left=max(0,(base.width-cw)*fi//5);top=max(0,(base.height-ch)*fi//5)
                            frames.append(base.crop((left,top,left+cw,top+ch)).resize((fw,fh),Image.Resampling.LANCZOS).quantize(colors=128))
                        frames[0].save(out,format='GIF',save_all=True,append_images=frames[1:],duration=260,loop=0,optimize=False)
                    elif ex=='webp':im.convert('RGB').save(out,format='WEBP',quality=82)
                    else:im.convert('RGB').save(out,format='PNG',optimize=True)
                    files['assets/images/'+name]=out.getvalue()
                    if candidate!=key:print('SOURCE ASSET WARNING: '+key+' unavailable; packaged '+candidate+' instead for '+name,file=sys.stderr)
                    break
                except Exception as exc:failures.append(candidate+': '+str(exc))
            else:
                raise RuntimeError('Could not download any Next.js-registered image for '+name+': '+'; '.join(failures))
        else:
            # No legacy ZIP imagery is ever included; these are non-displayed transparent stubs.
            if name.endswith('.png'):files['assets/images/'+name]=bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000b49444154789c636000020000050001a5f645400000000049454e44ae426082')
            elif name.endswith('.gif'):files['assets/images/'+name]=bytes.fromhex('47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b')
            else:
                # Valid transparent WebP (from Pillow where installed), otherwise fail rather than copy legacy images.
                from PIL import Image
                out=io.BytesIO();Image.new('RGBA',(1,1),(0,0,0,0)).save(out,format='WEBP');files['assets/images/'+name]=out.getvalue()
    if set(files)!=set(FILES):raise AssertionError('Theme files changed! missing='+str(set(FILES)-set(files))+' extra='+str(set(files)-set(FILES)))
    return files,order

def main():
    parser=argparse.ArgumentParser(description='Synchronize locked WordPress FSE theme + WXR directly into tracked source files; no ZIP output.')
    parser.add_argument('--repo',required=True)
    parser.add_argument('--theme-dir',default='wordpress/forex-trade-technology')
    parser.add_argument('--wxr-path',default='website.xml')
    parser.add_argument('--strict-assets',action='store_true')
    args=parser.parse_args()
    src,site,theme,pages=read_source(args.repo)
    src=src.resolve()
    dest=(src/args.theme_dir).resolve()
    wxr_path=(src/args.wxr_path).resolve()
    if dest!=src/'wordpress'/'forex-trade-technology' or wxr_path!=src/'website.xml':
        raise ValueError('Refusing to write outside locked GitHub WordPress theme or root website.xml')
    files,order=filemap(src,site,theme,pages,args.strict_assets)
    contents=make_pages(pages,theme,src)
    wxr=make_wxr(pages,contents,site)
    if len(ET.fromstring(wxr).findall('./channel/item'))!=16:raise AssertionError('Expected 13 source pages + 3 parents')
    if dest.exists():shutil.rmtree(dest)
    for directory in DIRS:(dest/directory).mkdir(parents=True,exist_ok=True)
    for name,value in files.items():
        target=dest/name
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_bytes(value.encode('utf-8') if isinstance(value,str) else value)
    actual={p.relative_to(dest).as_posix() for p in dest.rglob('*') if p.is_file()}
    if actual!=set(FILES):raise AssertionError('Locked theme inventory drift: '+str(actual^set(FILES)))
    wxr_path.write_text(wxr,encoding='utf-8')
    ET.parse(wxr_path)
    print('Synchronized theme files:',len(actual),'at',dest)
    print('Updated WordPress WXR:',wxr_path,'records: 16')
    print('Next.js CSS modules:',len(order))

if __name__=='__main__':main()
