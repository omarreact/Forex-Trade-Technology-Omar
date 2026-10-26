import type {SectionData} from '@/content/schema/page';
export type TradingStackFlowVisual={connections:Array<{label:string;sub:string;icon:string}>;subtitleFallback:string;kicker:string;status:string;ariaLabel:string;caption:string};
/** Future Gutenberg block attributes; all visual copy supplied by parent. */
export type TradingStackFlowAttributes={section:SectionData;visual:TradingStackFlowVisual};
