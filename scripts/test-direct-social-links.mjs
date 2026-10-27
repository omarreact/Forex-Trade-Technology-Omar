import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
const urls={whatsapp:'https://wa.me/447988028424',telegram:'https://t.me/forexbrokertech'};
for(const path of ['content/site.config.json','wordpress/forex-trade-technology/data/site.config.json']){
 const social=JSON.parse(read(path)).social;
 for(const [kind,expected] of Object.entries(urls))assert.equal(social[kind],expected, path+' '+kind);
}
for(const path of ['blocks/contact-form/ContactForm.tsx','wordpress/forex-trade-technology/inc/form.php']){
 const code=read(path);
 assert(code.includes('bs-contact-direct-links'),path+' missing contact shortcuts');
 assert(code.includes('WhatsApp · +44 7988 028424'),path+' missing WhatsApp label');
 assert(code.includes('Telegram · @forexbrokertech'),path+' missing Telegram label');
}
const social=read('wordpress/forex-trade-technology/inc/social.php');
assert(social.includes(urls.whatsapp)&&social.includes(urls.telegram),'WordPress social defaults mismatch');
for(const path of ['parts/SiteFooter.tsx','parts/SiteHeader.tsx'])assert(read(path).includes('SocialLinks'),'Next.js missing social icons: '+path);
console.log('PASS Direct Telegram and WhatsApp accounts in both frameworks, header/footer icons and contact shortcuts.');
