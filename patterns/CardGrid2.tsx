import type {SectionData} from '@/content/schema/page';
import {V5SectionContent} from './ContentSection';
/** Separate WP pattern contract; existing class names/DOM are preserved. */
export function CardGrid2({section,index,pageId}:{section:SectionData;index:number;pageId:string}){
 return <V5SectionContent section={section} index={index} pageId={pageId}/>;
}
