import type {SectionData,FaqItem} from '@/content/schema/page';
import {SectionHeading} from '@/blocks/shared/SectionHeading';
import {Icon} from '@/blocks/shared/Icon';
export function FaqAccordion({section}:{section:SectionData}){
 const items=(section.items||[]).filter((x):x is FaqItem=>typeof x!=='string'&&'q'in x);
 return <section className="bs-section bs-dense-section bs-dense-faq-page bs-faq-polished" id={section.id} aria-labelledby="faq-questions-heading"><div className="bs-shell">
  <SectionHeading className="bs-dense-heading bs-faq-heading" kicker="SUPPORT & GUIDANCE" title="Frequently Asked Questions" id="faq-questions-heading"><p className="bs-faq-count"><strong>{items.length}</strong><span>questions answered</span></p></SectionHeading>
  <div className="bs-dense-accordion bs-clean-accordion bs-faq-questions">{items.map((item,i)=><details key={i} name="ftt-faq"><summary><span className="bs-faq-question">{item.q}</span><Icon name="chevronDown" size={19}/></summary><div className="bs-dense-answer bs-faq-answer"><p>{item.a}</p></div></details>)}</div>
 </div></section>;
}

/** The layout key is authoritative in v5; section.type only describes source semantics. */
