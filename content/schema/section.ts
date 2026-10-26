/** Stable layout vocabulary shared by content validation and the render registry. */
export const sectionLayouts = ['iconRow','cardGrid2','cardGrid3','stack','mediaBand','timeline','splitContent','darkBand','gallery3','statsRow','faqAccordion','ctaBand'] as const;
export type SectionLayout=typeof sectionLayouts[number];
export type {SectionData,ContentBlock,MediaData,MediaLayout,FaqItem} from './page';
