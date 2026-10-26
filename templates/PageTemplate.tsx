import type {PageData} from '@/content/schema/page';
import {PageHeader} from '@/patterns/PageHeader';
import {V5Guide} from '@/patterns/V5Guide';
import {DocumentNotes} from '@/patterns/DocumentNotes';
import {FinalCta} from '@/parts/FinalCta';
import {renderSections} from '@/lib/render-sections';
export function PageTemplate({page}:{page:PageData}){
 return <main id="main-content" className="bs-main bs-v4-dense bs-v5 bs-clean-page">
  <PageHeader page={page}/>{renderSections(page)}
  <V5Guide page={page}/><DocumentNotes notes={page.documentFooterNotes}/><FinalCta/>
 </main>;
}
