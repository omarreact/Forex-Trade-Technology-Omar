import {getAllThemePages,getThemePageBySlug,type ThemePageMeta} from '@/lib/theme-pages';

/** Each variation uses the same verified thirteen Gutenberg content documents. */
export const VARIATION_IDS=['design-1','design-2','design-3','design-4','design-5','design-6'] as const;
export type VariationId=typeof VARIATION_IDS[number];
export function isVariation(value:string):value is VariationId{return VARIATION_IDS.includes(value as VariationId);}
export function variationPath(design:VariationId,route:string){return '/'+design+(route==='/'?'':route);}
export type ContentSection={id:string;heading:string;html:string;number:number};
export type VariationContent={meta:ThemePageMeta;title:string;eyebrow:string;description:string;lead:string;highlights:{title:string;description:string}[];sections:ContentSection[];home:boolean;};

const unescape=(value:string)=>value.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&apos;|&#39;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>');
function plain(input:string){return unescape(input.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());}
function firstTag(html:string,tag:string){return plain(html.match(new RegExp('<'+tag+'\\b[^>]*>([\\s\\S]*?)<\\/'+tag+'>','i'))?.[1]||'');}
function paragraphTexts(html:string){return [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(m=>plain(m[1])).filter(Boolean);}
function cleanMarkup(html:string){
  // Strip legacy design classes and inline presentation so each React variation owns its design.
  // Keep semantic content, linked sources, alt text, lists, tables, forms and native FAQ details.
  return html.replace(/<figure\\b[^>]*class=(["'])[^"']*\\bftt-doc-home-photo\\b[^"']*\\1[^>]*>[\\s\\S]*?<\\/figure>/gi,'')
    .replace(/<!--\\s*[\\s\\S]*?-->/g,'')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/\sclass=(["'])(.*?)\1/gi, (_match,_quote,classes:string)=>{
      if(/bs-honeypot/.test(classes))return ' data-v-honeypot="yes"';
      if(/ftt-content-grid|bs-steps-grid|bs-adv-grid|ftt-doc-card-grid|bs-card-grid/.test(classes))return ' data-v-grid="yes"';
      if(/ftt-content-card|bs-card|ftt-doc-card|bs-step-card/.test(classes))return ' data-v-card="yes"';
      if(/bs-contact-form/.test(classes))return ' class="bs-contact-form"';
      return '';
    })
    .replace(/\s(?:style|on\w+)=("[^"]*"|'[^']*')/gi,'')
    .replace(/<img\b/gi,'<img loading="lazy" decoding="async"')
    .replace(/href=("|')\/(?!\/)/g,'href=$1/__VARIANT__/');

}
/** Capture top-level source sections without losing text to nested sections. */
function sectionsOf(html:string){
  const result:string[]=[];
  const tags=/<\/?section\b[^>]*>/gi;
  let depth=0;
  let sectionStart=-1;
  let match:RegExpExecArray|null;
  while((match=tags.exec(html))!==null){
    if(/^<section\b/i.test(match[0])){
      if(depth===0)sectionStart=match.index;
      depth++;
    }else if(depth>0){
      depth--;
      if(depth===0&&sectionStart>=0){
        result.push(html.slice(sectionStart,tags.lastIndex));
        sectionStart=-1;
      }
    }
  }
  return result.length?result:[html];
}
export function resolveVariationPage(route:string,design:VariationId):VariationContent|null{
  const meta=getAllThemePages().find(p=>p.route.replace(/\/$/,'')===route.replace(/\/$/,''))||null;
  if(!meta)return null;
  const found=getThemePageBySlug(meta.slug);
  if(!found.html)return null;
  const sections=sectionsOf(found.html);
  const intro=sections[0]||'';
  const paragraphs=paragraphTexts(intro);
  const title=firstTag(intro,'h1')||meta.title;
  const eyebrow=paragraphs[0]?.length<80?paragraphs[0]:(meta.category==='general'?'FOREX TRADE TECHNOLOGY':meta.category.toUpperCase());
  const details=paragraphs.filter(p=>p!==eyebrow && p.length>45);
  const description=details[0]||meta.meta_description;
  const lead=details[1]||'';
  const highlights=[...intro.matchAll(/<h3\b[^>]*ftt-slide-title[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p\b[^>]*ftt-slide-summary[^>]*>([\s\S]*?)<\/p>/gi)]
   .map(item=>({title:plain(item[1]),description:plain(item[2])}));
  const more=sections.slice(1).map((section,i)=>{
    const id=section.match(/<section\b[^>]*\bid=["']([^"']+)["']/i)?.[1]||('chapter-'+(i+1));
    const heading=firstTag(section,'h2')||firstTag(section,'h3')||'Explore '+meta.title;
    const inner=section
      .replace(/^<section\b[^>]*>/i,'')
      .replace(/<\/section>\s*$/i,'')
      // The legacy left index/sidebar is duplicated by the new design's real heading.
      // Remove that index only; keep every approved paragraph/list/card.
      .replace(/<div\b[^>]*class=["'][^"']*ftt-rd-side(?:\s|["'])[^>]*>[\s\S]*?<\/div>/gi,'')
      .replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/i,'');
    return {id,heading,html:cleanMarkup(inner).replaceAll('/__VARIANT__/', '/'+design+'/'),number:i+1};
  });
  return {meta,title,eyebrow,description,lead,highlights,sections:more,home:meta.slug==='home'};
}
export function allVariationRoutes(){
  return VARIATION_IDS.flatMap(design=>getAllThemePages().map(page=>({design,segments:page.route.split('/').filter(Boolean)})));
}
export function allVariationPages(){return getAllThemePages();}
