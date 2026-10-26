export type ButtonData={label:string;href:string;variant?:string;icon?:string};
export type HeroData={kicker?:string;title:string;subtitle?:string;leadParagraphs?:string[];imageKey?:string;ctas?:ButtonData[];viewTransition?:string;useSlider?:boolean};
export type ContentBlock={type:'h2'|'h3'|'p';text:string;parentH2?:string|null;parentH3?:string|null};
export type FaqItem={q:string;a:string};
export type MediaLayout='splitLeft'|'splitRight'|'cardThumb'|'fullBleed'|'gridGallery'|'backgroundWash'|'mediaBand';
export type MediaData={imageKey?:string;imageKeys?:string[];layout:MediaLayout|'gallery3';caption?:string;height?:string;loading?:string;opacity?:number};
export type SlideData={imageKey:string;kicker?:string;title:string;subtitle?:string;cta?:ButtonData};
export type PageTopData={variant:'homeSlider'|'pageHeader';height?:string;fullWidth?:boolean;autoplay?:boolean;intervalMs?:number;viewTransition?:string;slides?:SlideData[];kicker?:string;title?:string;subtitle?:string;breadcrumbs?:Array<{label:string;href?:string}>;backgroundImageKey?:string;overlay?:string};
export type SectionData={
 id:string;type:'trustStrip'|'contentSection'|'ctaRow'|'darkCta'|'faqAccordion'|'mediaBand'|'contactForm'|'cardGrid'|'prose'|'gallery3';viewTransition?:string;
 title?:string;subtitle?:string;kicker?:string;blocks?:ContentBlock[];items?:Array<string|FaqItem>;ctas?:ButtonData[];cta?:ButtonData;
 columns?:number;paragraphs?:string[];imageKey?:string;openFirst?:boolean;media?:MediaData;layout?:string;density?:string;preferredRender?:string;theme?:string;
};
export type PageData={id:string;slug:string;seo:{title:string;description:string;canonicalPath?:string;primaryKeyword?:string;secondaryKeywords?:string};hero:HeroData;pageTop?:PageTopData;pageImages?:string[];sections:SectionData[];rawBlockCount?:number;wordCountApprox?:number;fullBlocks?:ContentBlock[];documentFooterNotes?:string[]};

