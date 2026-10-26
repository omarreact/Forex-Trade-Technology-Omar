/** Serializable Gutenberg attributes owned by content, never the page React component. */
export type ContactFormField={label:string;placeholder:string;options?:string[]};
export type ContactFormCopy={
 eyebrow:string;headingBefore:string;headingEmphasis:string;
 intro:string;publicNotice:string;previewNotice:string;previewLinkText:string;
 fields:{name:ContactFormField;email:ContactFormField;company:ContactFormField;country:ContactFormField;
 contact:ContactFormField;interest:ContactFormField & {options:string[]};stage:ContactFormField & {options:string[]};message:ContactFormField};
 footer:string;previewFooter:string;submit:string;submitting:string;
};
export type ContactFormAttributes={copy:ContactFormCopy;email?:string};
