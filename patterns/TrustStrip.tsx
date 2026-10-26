import {TrustCarousel} from '@/blocks/trust-carousel';
import type {SectionData} from '@/content/schema/page';
export function TrustStrip({section}:{section:SectionData}){
 const items=(section.items||[]).filter((item):item is string=>typeof item==='string');
 return <TrustCarousel items={items}/>;
}
