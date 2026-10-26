import type {PageData,ContentBlock} from '@/content/schema/page';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
import {Icon} from '@/blocks/shared/Icon';
function V5EditableBlocks({blocks}:{blocks:ContentBlock[]}){
 return <div className="bs-v5-copy">{blocks.map((block,i)=>block.type==='h3'?<h3 key={i}>{block.text}</h3>:block.type==='h2'?<h3 key={i}>{block.text}</h3>:<p key={i}>{block.text}</p>)}</div>;
}
function getSupplementalContent(page:PageData){
 const used=new Map<string,number>();
 for(const sec of page.sections)for(const b of sec.blocks||[]){const key=b.type+'\u0000'+b.text;used.set(key,(used.get(key)||0)+1);}
 const result:Array<{title:string;blocks:ContentBlock[]}>=[];
 let active:{title:string;blocks:ContentBlock[]}={title:'Introduction and overview',blocks:[]};
 const push=()=>{if(active.blocks.length)result.push(active);};
 for(const b of page.fullBlocks||[]){
  // Source document outline labels belong in the actual header, not the visible guide.
  if(/^(?:breadcrumb|label):\s/i.test(b.text.trim()))continue;
  if(b.type==='h2'){push();active={title:b.text,blocks:[]};continue;}
  const key=b.type+'\u0000'+b.text,remaining=used.get(key)||0;
  if(remaining>0){used.set(key,remaining-1);continue;}
  active.blocks.push(b);
 }
 push();return result;
}
export function V5Guide({page}:{page:PageData}){
 const groups=getSupplementalContent(page);if(!groups.length)return null;
 return <section className="bs-v5-guide bs-v5-section" id="complete-technical-guide" aria-labelledby="complete-guide-title"><div className="bs-shell">
  <SectionHeading className="bs-v5-guide-head" kicker="IN-DEPTH TECHNICAL GUIDE" title="Further details and frequently asked questions" id="complete-guide-title" subtitle="Complete supporting explanations, implementation considerations and FAQs from our original service guide."/>
  <div className="bs-v5-guide-grid bs-clean-accordion">{groups.map((group,i)=><details key={i} className="bs-v5-guide-item" name="ftt-guide"><summary><span>{group.title}</span><Icon name="chevronDown" size={20}/></summary><V5EditableBlocks blocks={group.blocks}/></details>)}</div>
 </div></section>;
}
