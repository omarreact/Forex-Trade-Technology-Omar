import type {SectionData} from '@/content/schema/page';
import {ContactForm} from '@/blocks/contact-form';
import formCopy from '@/content/form.config.json';
import {siteConfig} from '@/content';
/** Gutenberg contact block wrapper; API remains in Next.js, future WP plugin. */
export function ContactSection({section}:{section:SectionData}){
 return <section className="bs-v5-section bs-v5-contact" id={section.id}>
  <div className="bs-shell"><h2>{section.title}</h2><ContactForm copy={formCopy} email={siteConfig.site.email}/></div>
 </section>;
}
