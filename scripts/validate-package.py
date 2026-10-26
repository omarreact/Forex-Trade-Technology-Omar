#!/usr/bin/env python3
"""Static release gates for canonical XML -> native WordPress distribution."""
import hashlib,json,pathlib,re,subprocess,xml.etree.ElementTree as ET,zipfile
root=pathlib.Path(__file__).resolve().parents[1];theme=root/'wordpress/forex-trade-technology';plugin=root/'wordpress/forex-trade-technology-contact';r=ET.parse(theme/'data/website.xml').getroot();pages=r.find('pages').findall('page');manifest=json.loads((theme/'data/manifest.json').read_text());errors=[]
def check(ok,msg):
 if not ok:errors.append(msg)
check(len(pages)==manifest['pageCount']==13,'13 page contract');check(sum(len(p.find("array[@name='sections']")) for p in pages)==manifest['sectionCount']==87,'section count');check(len(r.find('stylesheets'))==manifest['stylesheetCount']==17,'17 source CSS modules');check(hashlib.sha256((theme/'data/website.xml').read_bytes()).hexdigest()==manifest['xmlSha256'],'source XML SHA mismatch');check(len(list((theme/'patterns').glob('*.php')))>=11,'pattern catalogue incomplete');check(len(list((theme/'blocks').glob('*/block.json')))==5,'5 interactive blocks');check(len(list((theme/'data/pages').glob('*.html')))==13,'13 compiled native block pages');check(len(json.loads((theme/'data/design.json').read_text())['assets']['images'])==26,'26 image references');check(json.loads((theme/'theme.json').read_text())['version']==3,'WP theme schema v3')
for file in (theme/'data/pages').glob('*.html'):
 s=file.read_text();stack=[]
 for m in re.finditer(r'<!--\s*(/?)wp:([\w/\-]+)(.*?)-->',s,re.S):
  closing,name,other=m.group(1),m.group(2),m.group(3)
  if closing:
   if not stack or stack[-1]!=name:errors.append(f'{file.name}: closing {name}, stack {stack[-4:]}')
   else:stack.pop()
  elif not other.strip().endswith('/'):stack.append(name)
 if stack:errors.append(f'{file.name}: unclosed blocks {stack[-10:]}')
 check('<!-- wp:group ' in s or file.name=='home.html','Native core groups missing '+file.name)
 check('<!-- wp:forex-trade-technology/section' not in s,'PHP-only legacy section block in '+file.name)
 for deprecated in ('react','tsx','next/image'):
  check(deprecated not in s.lower(),'Legacy runtime in '+file.name)
faq=(theme/'data/pages/faq.html').read_text();check(faq.count('<!-- wp:details -->')==42,'FAQ item count');home=(theme/'data/pages/home.html').read_text();check('<!-- wp:forex-trade-technology/home-slider' in home,'home hero missing');check(home.count('bs-global-cta-panel')==0,'Closing CTA duplicated in home post content')
for part in ['header','footer','final-cta']:check((theme/f'parts/{part}.html').exists(),part+' template missing')
for tpl in ['front-page','page','index','404','page-faq','page-contact']:check((theme/f'templates/{tpl}.html').exists(),tpl+' template missing')
css=(theme/'assets/css/front.css').read_text();check('--bs-ink:#161816' in css,'raw CSS tokens missing');check('bs-home-slider' in css,'source slider CSS absent');check((plugin/'includes/rest-or-admin-post.php').exists(),'contact REST transport absent')
phps=list(root.glob('wordpress/**/*.php'))
for p in phps:
 r=subprocess.run(['php','-l',str(p)],text=True,capture_output=True)
 check(r.returncode==0,'PHP syntax '+str(p)+': '+r.stderr)
for p in [theme/'assets/js/editor.js',theme/'assets/js/view.js']:
 r=subprocess.run(['node','--check',str(p)],text=True,capture_output=True);check(r.returncode==0,'JS syntax '+str(p)+': '+r.stderr)
for secret in ['FTT_RESEND_API_KEY','FTT_CONTACT_MAIL_TRANSPORT']:
 check(secret in (plugin/'includes/rest-or-admin-post.php').read_text(),'missing server config '+secret)
 check(secret not in (theme/'functions.php').read_text(),'secret references leaked into theme: '+secret)
print('XML integrity:',len(pages),'pages,',manifest['sectionCount'],'sections,',manifest['faqCount'],'FAQs,',manifest['imageCount'],'images')
print('Gutenberg compiled pages:',len(list((theme/'data/pages').glob('*.html'))),'| patterns:',len(list((theme/'patterns').glob('*.php'))),'| interactive blocks:',len(list((theme/'blocks').glob('*/block.json'))))
print('PHP files:',len(phps),'| validation errors:',len(errors))
for e in errors[:30]:print('FAIL:',e)
if errors:raise SystemExit(1)
print('PASS: static WordPress distribution and Gutenberg block pairing checks')
