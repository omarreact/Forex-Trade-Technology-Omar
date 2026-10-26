#!/usr/bin/env python3
"""Compile portable website.xml into native Gutenberg sections, patterns and CSS.
Never reads React/TSX/Next components. Only XML objects and CSS CDATA.
Usage: python3 scripts/build-xml.py [--xml path] [--theme path]
"""
import argparse,collections,hashlib,html,json,re,xml.etree.ElementTree as ET
from pathlib import Path

ap=argparse.ArgumentParser();ap.add_argument('--xml',default='wordpress/forex-trade-technology/data/website.xml');ap.add_argument('--theme',default='wordpress/forex-trade-technology');args=ap.parse_args()
xml=Path(args.xml);theme=Path(args.theme);root=ET.parse(xml).getroot()

def val(e):
 if e.tag=='value':
  s=e.text or ''; t=e.get('type','string');
  if t=='boolean':return s.strip().lower()=='true'
  if t=='number':
   try:return float(s) if '.' in s else int(s)
   except: return 0
  if t=='null':return None
  return s
 if e.tag=='array':return [val(c) for c in e]
 if e.tag=='object':return {c.get('name'):val(c) for c in e}
 return {c.tag:val(c) for c in e}
def obj(parent):return val(parent.find('object'))
site=obj(root.find('site-configuration'));design=obj(root.find('theme-configuration'));images=design.get('assets',{}).get('images',{})
for directory in ['data','data/pages','assets/css','assets/css/modules','patterns']: (theme/directory).mkdir(parents=True,exist_ok=True)
def write(path,data):p=theme/path;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(data,encoding='utf-8')
def dump(path,d):write(path,json.dumps(d,ensure_ascii=False,indent=2)+'\n')
dump('data/site.json',site);dump('data/design.json',design)

# CSS: preserve *exact* source order, not source JSX/React.
css=[]
for i,el in enumerate(root.find('stylesheets')):
 source=el.get('path','');content=el.text or ''
 path='assets/css/modules/'+str(i+1).zfill(2)+'-'+source.split('/')[-1];write(path,content+'\n')
 css.append('/* '+source+' */\n'+content)
write('assets/css/front.css','\n\n'.join(css)+'\n\n/* Native WordPress blocks: compatibility rules */\n@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap");\n')

# Gutenberg canonical serialization: all common sections use WordPress core blocks.
def esc(s):return html.escape(str(s or ''),quote=False)
def att(v):return html.escape(str(v or ''),quote=True)
def js(d):return json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('--','\\u002d\\u002d')
def block(name,inner,attrs=None,markup=None):
 a=' '+js(attrs) if attrs else ''
 if markup is None:return f'<!-- wp:{name}{a} -->\n{inner}\n<!-- /wp:{name} -->'
 return f'<!-- wp:{name}{a} -->\n{markup[0]}\n{inner}\n{markup[1]}\n<!-- /wp:{name} -->'
def dyn(name,attrs):return f'<!-- wp:forex-trade-technology/{name} {js(attrs)} /-->'
def group(body,cls='',tag='div',layout='constrained',id=''):
 a={'tagName':tag,'className':cls,'layout':{'type':layout}};
 if id:a['anchor']=id
 attrs='wp-block-group'+(' '+cls if cls else '')
 return block('group',body,a,(f'<{tag} class="{attrs}"'+(f' id="{att(id)}"' if id else '')+'>',f'</{tag}>'))
def head(text,level=2,cls=''):
 c=f' class="{att(cls)}"' if cls else ''
 attrs={'level':level};
 if cls:attrs['className']=cls
 return block('heading','',attrs,(f'<h{level}{c}>{esc(text)}</h{level}>','')).replace(f'</h{level}>\n\n<!-- /wp:heading -->',f'</h{level}>\n<!-- /wp:heading -->') if False else f'<!-- wp:heading {js(attrs)} -->\n<h{level}'+(f' class="{att("wp-block-heading "+cls)}"' if cls else ' class="wp-block-heading"')+f'>{esc(text)}</h{level}>\n<!-- /wp:heading -->'
def para(text,cls=''):
 attrs={'className':cls} if cls else None
 c=f' class="{att(cls)}"' if cls else ''
 return f'<!-- wp:paragraph'+(' '+js(attrs) if attrs else '')+f' -->\n<p{c}>{esc(text)}</p>\n<!-- /wp:paragraph -->'
def image(key,cls=''):
 o=images.get(key) or {};url=o.get('url','');alt=o.get('alt','')
 if not url:return ''
 attrs={'url':url,'alt':alt,'sizeSlug':'full','linkDestination':'none'}
 if cls:attrs['className']=cls
 klass='wp-block-image size-full'+(' '+cls if cls else '')
 return f'<!-- wp:image {js(attrs)} -->\n<figure class="{att(klass)}"><img src="{att(url)}" alt="{att(alt)}"/></figure>\n<!-- /wp:image -->'
def buttons(label='Discuss Your Setup',href='/contact'):
 attrs={'url':href,'text':label}
 return '<!-- wp:buttons -->\n<div class="wp-block-buttons">\n'+f'<!-- wp:button {js(attrs)} -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="{att(href)}">{esc(label)}</a></div>\n<!-- /wp:button -->\n</div>\n<!-- /wp:buttons -->'
def detail(q,a):
 # WP core/details with editable summary and paragraph inside.
 return '<!-- wp:details -->\n<details class="wp-block-details"><summary>'+esc(q)+'</summary>\n'+para(a)+'\n</details>\n<!-- /wp:details -->'
def fields(blocks):
 leading=[];items=[];grouped=None
 for b in blocks or []:
  if b.get('type') in ('h2','h3'):
   grouped={'title':b.get('text',''),'copy':[]};items.append(grouped)
  elif b.get('type') in ('p','li'):
   if grouped is None:leading.append(b.get('text',''))
   else:grouped['copy'].append(b.get('text',''))
 return leading,items

def section(s,page_id,seq,home_title=''):
 layout=s.get('layout','stack');title=s.get('title','');id=s.get('id','ftt-section')
 if layout=='ctaBand' or (layout=='mediaBand' and page_id!='home'):return ''
 if layout=='iconRow':return dyn('trust-carousel',{'items':s.get('items',[]),'autoplay':True})
 if page_id=='home' and title=='How Your Trading Stack Connects':
  return dyn('trading-stack-flow',{'heading':title,'paragraphs':[b.get('text','') for b in s.get('blocks',[]) if b.get('type')=='p'],'steps':[{'title':a,'description':b} for a,b in [('Client portal','Account access'),('MT4/MT5','Trading platform'),('Bridge/FIX','Market routing'),('Liquidity','Execution'),('CRM & reporting','Business workflow')]]})
 if title=='Request a Consultation' and layout=='splitContent':return dyn('contact-form',{'config':'default'})
 if page_id=='home' and title=='Who We Work With' and layout=='stack':
  lead,cards=fields(s.get('blocks',[]));return dyn('audience-carousel',{'heading':title,'items':[{'title':c['title'],'description':' '.join(c['copy']),'icon':'users'} for c in cards]})
 if layout=='faqAccordion':
  inside=head(title or 'Frequently Asked Questions',2,'bs-ui-title')+'\n'+group('\n'.join(detail(x.get('q',''),x.get('a','')) for x in s.get('items',[])),'bs-faq-questions bs-clean-accordion')
  return group(group(inside,'bs-shell'), 'bs-section bs-dense-section bs-dense-faq-page bs-faq-polished', 'section',id=id)
 if layout=='mediaBand':
  bg=image(s.get('media',{}).get('imageKey',''),'ftt-band-image');inner=head(home_title or 'Forex Trade Technology',2,'bs-v5-media-title')
  return group(bg+'\n'+group(inner,'bs-shell bs-v5-media-caption'),'bs-v5-media bs-v5-media-title-band','section',id=id)
 if layout=='gallery3':
  pics=[image(k,'bs-v5-gallery-photo') for k in s.get('media',{}).get('imageKeys',[])];h='Technology Behind the Brokerage' if page_id=='home' else (title or 'Technology in Practice')
  return group(group(head(h,2)+'\n'+group('\n'.join(group(x,'ftt-gallery-item') for x in pics),'bs-v5-gallery-grid'),'bs-shell'),'bs-v5-section bs-v5-gallery','section',id=id)
 lead,cards=fields(s.get('blocks',[])); intro='\n'.join(para(x,'bs-ui-lead') for x in lead)
 if layout in ('cardGrid2','cardGrid3','timeline','darkBand') and cards:
  cardblocks=[]
  for item in cards:
   contents=head(item['title'],3,'bs-ui-card-title')+'\n'+'\n'.join(para(x) for x in item['copy'])
   cardblocks.append(group(contents,'bs-icon-card bs-ui-card bs-v5-card' + (' bs-dark-feature-card' if layout=='darkBand' else '')))
  cls={'cardGrid2':'bs-v5-grid bs-v5-grid-two','cardGrid3':'bs-v5-grid bs-v5-grid-three','timeline':'bs-v5-steps','darkBand':'bs-v5-dark-list'}[layout]
  inside=head(title,2,'bs-ui-title')+'\n'+intro+'\n'+group('\n'.join(cardblocks),cls)
 else:
  paragraphs='\n'.join(para(x) for x in lead)
  cardsmore='\n'.join(head(x['title'],3)+'\n'+'\n'.join(para(z) for z in x['copy']) for x in cards)
  # Story visual split uses native image + prose, not PHP wrapped HTML.
  imgkey=s.get('media',{}).get('imageKey','')
  parts=[group(head(title,2,'bs-ui-title')+'\n'+paragraphs+'\n'+cardsmore,'bs-story-copy')]
  if imgkey:parts.append(group(image(imgkey),'bs-story-visual'))
  inside=group('\n'.join(parts),'bs-story-shell')
 shell=group(inside,'bs-shell');suffix=' bs-v5-dark' if layout=='darkBand' else ''
 return group(shell,'bs-v5-section bs-v5-layout-'+layout+suffix,'section',id=id)

def page_blocks(p):
 top=p['pageTop']; pageid=p['id'];contents=[]
 if pageid=='home':
  slides=top.get('slides',[])
  contents.append(dyn('home-slider',{'slides':slides,'autoplay':top.get('autoplay',True),'intervalMs':top.get('intervalMs',6000)}))
 else:
  kicker=top.get('kicker') or 'FOREX TRADE TECHNOLOGY';title=top.get('title') or p['hero'].get('title','');sub=top.get('subtitle','')
  inside=para(kicker,'bs-ui-kicker')+'\n'+head(title,1,'bs-ui-title bs-page-title')+'\n'+para(sub,'bs-page-subtitle')
  key=top.get('imageKey') or top.get('backgroundImageKey') or p['hero'].get('imageKey')
  pic=image(key,'bs-page-bg') if key else ''
  contents.append(group(pic+'\n'+group(inside,'bs-shell bs-page-header-content'),'bs-page-header ftt-interior-hero','section'))
 for i,s in enumerate(p['sections']):
  b=section(s,pageid,i,p['pageTop'].get('title') or p['hero'].get('title'))
  if b:contents.append(b)
 # Preserve unique source long-form content as an editable, native Details guide.
 seen=collections.Counter((x.get('type',''),x.get('text','')) for s in p['sections'] for x in s.get('blocks',[]))
 additional=[];active={'title':'Implementation details','blocks':[]}
 for b in p.get('fullBlocks',[]):
  if b.get('type')=='h2':
   if active['blocks']:additional.append(active)
   active={'title':b.get('text',''),'blocks':[]};continue
  key=(b.get('type',''),b.get('text',''))
  if seen[key]:seen[key]-=1;continue
  text=b.get('text','');
  if b.get('type')=='p' and text and not text.lower().startswith(('breadcrumb:','label:')):active['blocks'].append(text)
 if active['blocks']:additional.append(active)
 if additional:
  rows=[detail(x['title'],' '.join(x['blocks'])) for x in additional if x['blocks']]
  if rows:contents.append(group(group(head('Further details and frequently asked questions',2)+'\n'+group('\n'.join(rows),'bs-v5-guide-grid'),'bs-shell'),'bs-v5-guide bs-v5-section','section'))
 return '\n\n'.join(contents)+'\n'

pages=[];counts=collections.Counter()
for el in root.find('pages'):
 data={c.get('name'):val(c) for c in el};data.update(el.attrib);pages.append(data)
 name=data['id'];content=page_blocks(data);write('data/pages/'+name+'.html',content);dump('data/pages/'+name+'.json',data)
 for s in data['sections']:counts[s.get('layout','stack')]+=1
# Pattern instances come from canonical XML sections; rendered as native reusable blocks.
chosen={}
for p in pages:
 for i,s in enumerate(p['sections']):
  layout=s.get('layout','stack')
  if layout not in chosen and layout not in ('ctaBand',):
   chosen[layout]=(s,p['id'],i,p['pageTop'].get('title',''))
for layout,(s,id,i,title) in chosen.items():
 body=section(s,id,i,title)
 if not body:continue
 write('patterns/'+re.sub(r'(?<!^)(?=[A-Z])','-',layout).lower()+'.php',f'''<?php
/**
 * Title: {layout} — Forex Trade Technology
 * Slug: forex-trade-technology/{re.sub(r'(?<!^)(?=[A-Z])','-',layout).lower()}
 * Categories: forex-trade-technology
 * Inserter: yes
 */
?>
{body}
''')
# Canonical inventory / immutable build checksums.
manifest={'schemaVersion':1,'xmlSha256':hashlib.sha256(xml.read_bytes()).hexdigest(),'pageCount':len(pages),'sectionCount':sum(len(p['sections']) for p in pages),'faqCount':sum(len(s.get('items',[])) for p in pages for s in p['sections'] if s.get('layout')=='faqAccordion'),'stylesheetCount':len(css),'imageCount':len(images),'layoutCounts':dict(counts),'routes':{p['id']:p['slug'] for p in pages}}
dump('data/manifest.json',manifest)
print(json.dumps(manifest,indent=2))
