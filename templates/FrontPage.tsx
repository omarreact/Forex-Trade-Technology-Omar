import type {PageData} from '@/content/schema/page';
import {HomeSlider} from '@/blocks/home-slider';
import {V5Guide} from '@/patterns/V5Guide';
import {DocumentNotes} from '@/patterns/DocumentNotes';
import {FinalCta} from '@/parts/FinalCta';
import {renderSections} from '@/lib/render-sections';
export function FrontPage({page}:{page:PageData}){
 const top=page.pageTop;
 return <main id="main-content" className="bs-main bs-v4-dense bs-v5 bs-clean-page">
  {top?.slides?.length?<HomeSlider slides={top.slides} intervalMs={top.intervalMs} autoplay={top.autoplay}/>:null}
  {renderSections(page)}
  <V5Guide page={page}/><DocumentNotes notes={page.documentFooterNotes}/><FinalCta home/>
 </main>;
}
