#!/usr/bin/env python3
import json,html,re
from pathlib import Path
p=Path(__file__).resolve().parents[1]/'wordpress/forex-trade-technology';d=json.loads((p/'data/design.json').read_text());s=json.loads((p/'data/site.json').read_text());
colors=d['tokens']['colors'];palette=[{'name':k.replace('Strong',' Strong'),'slug':re.sub(r'(?<!^)(?=[A-Z])','-',k).lower(),'color':v} for k,v in colors.items() if isinstance(v,str) and v.startswith('#')]
settings={'appearanceTools':True,'useRootPaddingAwareAlignments':True,'layout':{'contentSize':'1210px','wideSize':'1440px'},'color':{'palette':palette,'defaultPalette':False,'custom':False,'customGradient':False},'typography':{'fluid':True,'fontFamilies':[{'name':'Manrope — headings','slug':'display','fontFamily':'Manrope,Inter,system-ui,sans-serif'},{'name':'Inter — body','slug':'body','fontFamily':'Inter,system-ui,sans-serif'}],'fontSizes':[{'name':'Body','slug':'body','size':'16px'},{'name':'Small','slug':'small','size':'14px'},{'name':'H3','slug':'h3','size':'clamp(19px,2vw,24px)'},{'name':'H2','slug':'h2','size':'clamp(30px,3.7vw,46px)'},{'name':'Hero','slug':'hero','size':'clamp(36px,5.5vw,72px)'}]},'spacing':{'units':['px','rem','em','%','vw'],'spacingSizes':[{'name':x,'slug':x.lower(),'size':v} for x,v in [('XS','8px'),('S','16px'),('M','24px'),('L','40px'),('XL','64px'),('Section','clamp(48px,5.5vw,72px)')]]}}
theme={'$schema':'https://schemas.wp.org/trunk/theme.json','version':3,'settings':settings,'styles':{'color':{'background':'#fff','text':'#161816'},'typography':{'fontFamily':'var(--wp--preset--font-family--body)','lineHeight':'1.6'},'elements':{'heading':{'typography':{'fontFamily':'var(--wp--preset--font-family--display)','fontWeight':'700'}},'button':{'color':{'background':'#d8e9a2','text':'#161816'},'border':{'radius':'999px'}}}},'templateParts':[{'name':'header','title':'Site Header','area':'header'},{'name':'footer','title':'Site Footer','area':'footer'},{'name':'final-cta','title':'Global Final CTA','area':'uncategorized'}]}
(p/'theme.json').write_text(json.dumps(theme,indent=2)+'\n')
(p/'style.css').write_text('''/*
Theme Name: Forex Trade Technology — XML Native
Theme URI: https://forextrade.pincodeit.com/
Author: PINCODE IT
Description: WordPress-native FSE theme compiled from the canonical website.xml. Editable global template parts, 13 block pages, and lightweight interactive blocks.
Requires at least: 6.6
Requires PHP: 8.1
Version: 1.0.0-xml
Text Domain: forex-trade-technology
*/\n''')
def text(x):return html.escape(str(x or ''),quote=False)
def attr(x):return html.escape(str(x or ''),quote=True)
def prop(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def open_group(cls,tag='div'):return f'<!-- wp:group {prop({"tagName":tag,"className":cls,"layout":{"type":"constrained"}})} -->\n<{tag} class="wp-block-group {attr(cls)}">'
def close_group(tag='div'):return f'</{tag}>\n<!-- /wp:group -->'
def h(txt,n):return f'<!-- wp:heading {prop({"level":n})} -->\n<h{n} class="wp-block-heading">{text(txt)}</h{n}>\n<!-- /wp:heading -->'
def para(txt):return '<!-- wp:paragraph -->\n<p>'+text(txt)+'</p>\n<!-- /wp:paragraph -->'
def button(label,url):return '<!-- wp:buttons -->\n<div class="wp-block-buttons"><!-- wp:button '+prop({'className':'bs-btn-primary'})+' -->\n<div class="wp-block-button bs-btn-primary"><a class="wp-block-button__link wp-element-button" href="'+attr(url)+'">'+text(label)+'</a></div>\n<!-- /wp:button --></div>\n<!-- /wp:buttons -->'
def link(item):return '<!-- wp:navigation-link '+prop({'label':item['label'],'url':item['href'],'kind':'custom','isTopLevelLink':True})+' /-->'
nav=[]
for item in s['navigation']['primary']:
 if item.get('children'):
  nav.append('<!-- wp:navigation-submenu '+prop({'label':item['label'],'url':'/solutions/','kind':'custom'})+' -->\n'+'\n'.join(link(c) for c in item['children'])+'\n<!-- /wp:navigation-submenu -->')
 else:nav.append(link(item))
nav_markup='<!-- wp:navigation '+prop({'overlayMenu':'mobile','className':'bs-inline-nav','layout':{'type':'flex','justifyContent':'right'}})+' -->\n'+'\n'.join(nav)+'\n<!-- /wp:navigation -->'
header='\n'.join([open_group('bs-shell bs-header-inner'), '<!-- wp:site-title '+prop({'level':0,'className':'bs-brand'})+' /-->',nav_markup,button(s['navigation']['cta']['label'],s['navigation']['cta']['href']),close_group()]);(p/'parts/header.html').write_text(open_group('bs-site-header bs-clean-header','header')+'\n'+header+'\n'+close_group('header')+'\n')
cols=[]
col0=open_group('bs-footer-brand')+'\n'+h(s['footer']['brand']['name'],3)+'\n'+para(s['footer']['brand']['description'])+'\n'+close_group();cols.append(col0)
for col in s['footer']['columns']:
 links='\n'.join(para(f'<a href="{x["href"]}">{x["label"]}</a>') for x in col['links'])
 # Avoid escaped HTML anchor in paragraph; core/navigation-link as editable nav
 links='<!-- wp:navigation '+prop({'orientation':'vertical','overlayMenu':'never'})+' -->\n'+'\n'.join(link(x) for x in col['links'])+'\n<!-- /wp:navigation -->'
 cols.append(open_group('bs-footer-col')+'\n'+h(col['heading'],3)+'\n'+links+'\n'+close_group())
footer='\n'.join([open_group('bs-shell'),open_group('bs-footer-grid')+'\n'+'\n'.join(cols)+'\n'+close_group(),para(s['site']['copyright']),close_group()]);(p/'parts/footer.html').write_text(open_group('bs-footer','footer')+'\n'+footer+'\n'+close_group('footer')+'\n')
cta=s['footer']['cta']
ctavisual='\n'.join(open_group('bs-global-cta-visual-card')+'\n'+h(x['title'],3)+'\n'+para(x['caption'])+'\n'+close_group() for x in cta['visual']['items'])
cta_content=open_group('bs-global-cta-content')+'\n'+para(cta['kicker'])+'\n'+h(cta['title'],2)+'\n'+para(cta['description'])+'\n'+button(cta['action']['label'],cta['action']['href'])+'\n'+close_group()
cta_part=open_group('bs-global-cta bs-global-cta-home','section')+'\n'+open_group('bs-shell')+'\n'+open_group('bs-global-cta-panel')+'\n'+cta_content+'\n'+open_group('bs-global-cta-visual')+'\n'+ctavisual+'\n'+close_group()+'\n'+close_group()+'\n'+close_group()+'\n'+close_group('section')
(p/'parts/final-cta.html').write_text(cta_part+'\n')
headerpart='<!-- wp:template-part {"slug":"header","tagName":"div"} /-->'
footerpart='<!-- wp:template-part {"slug":"footer","tagName":"div"} /-->'
ctapart='<!-- wp:template-part {"slug":"final-cta","tagName":"aside"} /-->'
main='<!-- wp:group {"tagName":"main","className":"bs-main bs-v4-dense bs-v5 bs-clean-page","layout":{"type":"default"}} -->\n<main class="wp-block-group bs-main bs-v4-dense bs-v5 bs-clean-page"><!-- wp:post-content {"layout":{"type":"default"}} /--></main>\n<!-- /wp:group -->'
for name in ['page','front-page','index','page-faq','page-contact']:(p/'templates'/f'{name}.html').write_text(headerpart+'\n'+main+'\n'+ctapart+'\n'+footerpart+'\n')
(p/'templates/404.html').write_text(headerpart+'\n'+open_group('bs-shell','main')+'\n'+h('Page not found',1)+'\n'+para('The page you requested does not exist.')+'\n'+button('Return home','/')+'\n'+close_group('main')+'\n'+footerpart+'\n')
print('Generated theme.json and native template parts')
