/* global wp */
/**
 * Direct Gutenberg block registrations for the FTT dynamic server-rendered blocks.
 * ServerSideRender uses the SAME PHP renderer as the frontend for editor parity.
 * Inspector controls edit serialized attributes; there are no hidden React JSON imports.
 */
(function(){
  'use strict';
  if (!window.wp || !wp.blocks || !wp.blockEditor || !wp.element) return;
  const h=wp.element.createElement;
  const {registerBlockType}=wp.blocks;
  const {useBlockProps,InspectorControls}=wp.blockEditor;
  const {PanelBody,TextControl,TextareaControl,ToggleControl,Button,Notice,SelectControl}=wp.components;
  const imageOptions=[{label:'Use default asset',value:''},...Object.entries(window.fttEditorConfig?.images||{}).map(([key,img])=>({value:key,label:key+' — '+(img.alt||'image')}))];
  const SSR=wp.serverSideRender && (wp.serverSideRender.default || wp.serverSideRender);
  const ns='forex-trade-technology/';
  const descriptions={
    'site-header':['Site Header',{navigation:{type:'object'}}],'site-footer':['Site Footer',{footer:{type:'object'},copyright:{type:'string'}}],
    'final-cta':['Final CTA',{home:{type:'boolean',default:false},copy:{type:'object'}}],
    'home-slider':['Home Slider',{slides:{type:'array',default:[]},intervalMs:{type:'number',default:6000},autoplay:{type:'boolean',default:true}}],
    'page-hero':['Interior Page Hero',{page:{type:'object',default:{}}}],
    'guide':['Technical Guide',{pageId:{type:'string',default:''}}],
    'document-notes':['Document Notes',{notes:{type:'array',default:[]}}],
    'contact-form':['Consultation Form',{copy:{type:'object',default:{}}}],
    'trust-carousel':['Trust Carousel',{items:{type:'array',default:[]}}],
    'trading-stack-flow':['Trading Stack Flow',{section:{type:'object',default:{}},visual:{type:'object',default:{}}}],
    'audience-carousel':['Audience Carousel',{title:{type:'string',default:''},items:{type:'array',default:[]}}],
    'icon-card':['Icon Card',{icon:{type:'string',default:'check'},title:{type:'string',default:''},description:{type:'string',default:''},paragraphs:{type:'array',default:[]},className:{type:'string',default:''}}],
    'section':['Content Section',{section:{type:'object',default:{}},pageId:{type:'string',default:''},index:{type:'number',default:0},pageTitle:{type:'string',default:''}}]
  };
  const update=(props,key,patch)=>{
    const next=JSON.parse(JSON.stringify(props.attributes[key]||{}));
    Object.assign(next,patch);
    props.setAttributes({[key]:next});
  };
  const editSection=(props)=>{
    const sec=props.attributes.section||{};
    return [
      h(TextControl,{key:'title',label:'Section heading',value:sec.title||'',onChange:v=>update(props,'section',{title:v})}),
      h(TextControl,{key:'subtitle',label:'Section subtitle',value:sec.subtitle||'',onChange:v=>update(props,'section',{subtitle:v})}),
      h(TextControl,{key:'kicker',label:'Section eyebrow',value:sec.kicker||'',onChange:v=>update(props,'section',{kicker:v})}),
      h(SelectControl,{key:'image',label:'Section image',value:sec.media?.imageKey||'',options:imageOptions,onChange:v=>update(props,'section',{media:{...(sec.media||{}),imageKey:v}})}),
      sec.layout==='gallery3'?h(TextareaControl,{key:'gallery',label:'Gallery image keys (one per line)',value:(sec.media?.imageKeys||[]).join('\n'),onChange:v=>update(props,'section',{media:{...(sec.media||{}),imageKeys:v.split('\n').map(x=>x.trim()).filter(Boolean)}})}):null,
      h(TextControl,{key:'id',label:'Stable section ID',value:sec.id||'',onChange:v=>update(props,'section',{id:v})}),
      h(TextControl,{key:'layout',label:'Layout key (contract v1)',value:sec.layout||'',help:'Keep an allowed layout from the render-map registry.',onChange:v=>update(props,'section',{layout:v})}),
      ...(sec.blocks||[]).map((b,i)=>h(TextareaControl,{key:'block-'+i,label:'Content '+(i+1)+' ('+b.type+')',value:b.text||'',rows:3,onChange:v=>{
        const blocks=[...(sec.blocks||[])];blocks[i]={...blocks[i],text:v};update(props,'section',{blocks});
      }})),
      ...(sec.items||[]).map((item,i)=>{
        if(typeof item==='string')return h(TextControl,{key:'item-'+i,label:'Trust item '+(i+1),value:item,onChange:v=>{
          const items=[...sec.items];items[i]=v;update(props,'section',{items});
        }});
        return h('div',{key:'faq-'+i,className:'ftt-editor-item'},
          h(TextControl,{label:'FAQ '+(i+1)+' question',value:item.q||'',onChange:v=>{
            const items=[...sec.items];items[i]={...items[i],q:v};update(props,'section',{items});
          }}),
          h(TextareaControl,{label:'FAQ '+(i+1)+' answer',value:item.a||'',onChange:v=>{
            const items=[...sec.items];items[i]={...items[i],a:v};update(props,'section',{items});
          }})
        );
      }),
      sec.layout==='faqAccordion'?h(Button,{key:'addfaq',variant:'secondary',onClick:()=>update(props,'section',{items:[...(sec.items||[]),{q:'New question',a:'Your answer'}]})},'Add FAQ'):null
    ];
  };
  const editSlider=(props)=>{
    const slides=props.attributes.slides||[];
    return [
      h(ToggleControl,{key:'auto',label:'Autoplay',checked:props.attributes.autoplay!==false,onChange:v=>props.setAttributes({autoplay:v})}),
      h(TextControl,{key:'interval',label:'Interval (milliseconds)',type:'number',value:String(props.attributes.intervalMs||6000),onChange:v=>props.setAttributes({intervalMs:Math.max(3000,Number(v)||6000)})}),
      ...slides.flatMap((slide,i)=>[
        h(TextControl,{key:'s-title-'+i,label:'Slide '+(i+1)+' title',value:slide.title||'',onChange:v=>{const list=[...slides];list[i]={...list[i],title:v};props.setAttributes({slides:list});}}),
        h(TextareaControl,{key:'s-desc-'+i,label:'Slide '+(i+1)+' subtitle',value:slide.subtitle||'',onChange:v=>{const list=[...slides];list[i]={...list[i],subtitle:v};props.setAttributes({slides:list});}}),
        h(SelectControl,{key:'s-image-'+i,label:'Slide image',value:slide.imageKey||'',options:imageOptions,onChange:v=>{const list=[...slides];list[i]={...list[i],imageKey:v};props.setAttributes({slides:list});}}),
        h(TextControl,{key:'s-kicker-'+i,label:'Slide '+(i+1)+' eyebrow',value:slide.kicker||'',onChange:v=>{const list=[...slides];list[i]={...list[i],kicker:v};props.setAttributes({slides:list});}}),
        h(TextControl,{key:'s-button-'+i,label:'Slide '+(i+1)+' button text',value:slide.cta?.label||'',onChange:v=>{const list=[...slides];list[i]={...list[i],cta:{...(list[i].cta||{}),label:v}};props.setAttributes({slides:list});}}),
        h(TextControl,{key:'s-cta-'+i,label:'CTA destination',value:slide.cta?.href||'',onChange:v=>{const list=[...slides];list[i]={...list[i],cta:{...(list[i].cta||{}),href:v}};props.setAttributes({slides:list});}})
      ])
    ];
  };
  const otherControls=(slug,props)=>{
    const a=props.attributes;
    if(slug==='section')return editSection(props);
    if(slug==='home-slider')return editSlider(props);
    if(slug==='page-hero')return [
      h(TextControl,{key:'hero-title',label:'Page heading',value:a.page?.pageTop?.title||'',onChange:v=>update(props,'page',{pageTop:{...(a.page?.pageTop||{}),title:v}})}),
      h(TextareaControl,{key:'hero-subtitle',label:'Subtitle',value:a.page?.pageTop?.subtitle||'',onChange:v=>update(props,'page',{pageTop:{...(a.page?.pageTop||{}),subtitle:v}})}),
      h(SelectControl,{key:'hero-image',label:'Header background image',value:a.page?.pageTop?.backgroundImageKey||'',options:imageOptions,onChange:v=>update(props,'page',{pageTop:{...(a.page?.pageTop||{}),backgroundImageKey:v}})})
    ];
    if(slug==='final-cta'){
      const copy=a.copy||window.fttEditorConfig?.footer?.cta||{};
      return [
        h(ToggleControl,{key:'home',label:'Home CTA with stack visual',checked:!!a.home,onChange:v=>props.setAttributes({home:v})}),
        ...['kicker','title','description'].map(key=>h(key==='description'?TextareaControl:TextControl,{key,label:'CTA '+key,value:copy[key]||'',onChange:v=>props.setAttributes({copy:{...copy,[key]:v}})})),
        ...['label','href'].map(key=>h(TextControl,{key:'action-'+key,label:'Button '+key,value:copy.action?.[key]||'',onChange:v=>props.setAttributes({copy:{...copy,action:{...(copy.action||{}),[key]:v}}})}))
      ];
    }
    if(slug==='site-header'){
      const navigation=a.navigation||window.fttEditorConfig?.navigation||{primary:[]};
      return (navigation.primary||[]).flatMap((item,i)=>[
        h(TextControl,{key:'nav-label-'+i,label:'Navigation '+(i+1)+' label',value:item.label||'',onChange:v=>{const primary=[...navigation.primary];primary[i]={...item,label:v};props.setAttributes({navigation:{...navigation,primary}});}}),
        ...((item.children||[]).flatMap((child,j)=>[
          h(TextControl,{key:'child-label-'+i+'-'+j,label:'Submenu '+(i+1)+'.'+(j+1)+' text',value:child.label||'',onChange:v=>{const primary=[...navigation.primary];const children=[...item.children];children[j]={...child,label:v};primary[i]={...item,children};props.setAttributes({navigation:{...navigation,primary}});}}),
          h(TextControl,{key:'child-link-'+i+'-'+j,label:'Submenu '+(i+1)+'.'+(j+1)+' href',value:child.href||'',onChange:v=>{const primary=[...navigation.primary];const children=[...item.children];children[j]={...child,href:v};primary[i]={...item,children};props.setAttributes({navigation:{...navigation,primary}});}})
        ])),
        !item.children?h(TextControl,{key:'nav-href-'+i,label:'Navigation href',value:item.href||'',onChange:v=>{const primary=[...navigation.primary];primary[i]={...item,href:v};props.setAttributes({navigation:{...navigation,primary}});}}):null
      ]);
    }
    if(slug==='site-footer'){
      const footer=a.footer||window.fttEditorConfig?.footer||{};
      return [
        h(TextareaControl,{key:'footer-desc',label:'Footer about text',value:footer.brand?.description||'',onChange:v=>props.setAttributes({footer:{...footer,brand:{...(footer.brand||{}),description:v}}})}),
        h(TextareaControl,{key:'copyright',label:'Copyright notice',value:a.copyright??window.fttEditorConfig?.copyright??'',onChange:v=>props.setAttributes({copyright:v})}),
        ...((footer.columns||[]).map((col,i)=>h(TextControl,{key:'column-'+i,label:'Footer column '+(i+1)+' title',value:col.heading||'',onChange:v=>{const columns=[...footer.columns];columns[i]={...col,heading:v};props.setAttributes({footer:{...footer,columns}});}})))
      ];
    }
    if(slug==='trust-carousel')return [
      h(TextareaControl,{key:'items',label:'Trust labels (one per line)',value:(a.items||[]).join('\n'),onChange:v=>props.setAttributes({items:v.split('\n').map(x=>x.trim()).filter(Boolean)})})
    ];
    if(slug==='contact-form')return [
      h(TextControl,{key:'eyebrow',label:'Kicker',value:a.copy?.eyebrow||'',onChange:v=>update(props,'copy',{eyebrow:v})}),
      h(TextControl,{key:'headingBefore',label:'Heading',value:a.copy?.headingBefore||'',onChange:v=>update(props,'copy',{headingBefore:v})}),
      h(TextControl,{key:'headingEmphasis',label:'Emphasized heading',value:a.copy?.headingEmphasis||'',onChange:v=>update(props,'copy',{headingEmphasis:v})}),
      h(TextareaControl,{key:'intro',label:'Introduction',value:a.copy?.intro||'',onChange:v=>update(props,'copy',{intro:v})}),
      h(TextareaControl,{key:'fields',label:'Form fields JSON',value:JSON.stringify(a.copy?.fields||{},null,2),onChange:v=>{try{update(props,'copy',{fields:JSON.parse(v)})}catch(e){}},help:'Advanced: Edit labels, placeholders, interest and stage options.'})
    ];
    if(slug==='audience-carousel')return [
      h(TextControl,{key:'title',label:'Carousel heading',value:a.title||'',onChange:v=>props.setAttributes({title:v})}),
      ...((a.items||[]).flatMap((item,i)=>[
        h(TextControl,{key:'item-title-'+i,label:'Audience '+(i+1)+' heading',value:item.title||'',onChange:v=>{const items=[...a.items];items[i]={...items[i],title:v};props.setAttributes({items});}}),
        h(TextareaControl,{key:'item-desc-'+i,label:'Audience '+(i+1)+' description',value:item.description||'',onChange:v=>{const items=[...a.items];items[i]={...items[i],description:v};props.setAttributes({items});}})
      ]))
    ];
    if(slug==='icon-card')return [
      ...['title','description','icon'].map(k=>h(TextControl,{key:k,label:k,value:a[k]||'',onChange:v=>props.setAttributes({[k]:v})}))
    ];
    if(slug==='guide')return [
      h(TextControl,{key:'pageId',label:'Source page ID',value:a.pageId||'',onChange:v=>props.setAttributes({pageId:v})}),
      h(Notice,{key:'guide-notice',status:'info',isDismissible:false},'The guide uses bundled source blocks for lossless content preservation. For section-level editing use the preceding content blocks.')
    ];
    if(slug==='trading-stack-flow')return [
      h(TextControl,{key:'stack-title',label:'Stack heading',value:a.section?.title||'',onChange:v=>update(props,'section',{title:v})}),
      h(TextareaControl,{key:'flow',label:'Connection labels (JSON array)',value:JSON.stringify(a.visual?.connections||[],null,2),onChange:v=>{try{update(props,'visual',{connections:JSON.parse(v)})}catch(e){}},help:'Keep label, sub and icon keys.'})
    ];
    if(slug==='document-notes')return [
      h(TextareaControl,{key:'notes',label:'Disclosure paragraphs (one per line)',value:(a.notes||[]).join('\n'),onChange:v=>props.setAttributes({notes:v.split('\n').filter(Boolean)})})
    ];
    return [h(Notice,{key:'parts',status:'info',isDismissible:false},'Shared chrome is rendered with the site-level content configuration. Place and rearrange this block within Appearance → Editor → Template Parts.')];
  };
  Object.entries(descriptions).forEach(([slug,meta])=>{
    const [title,attributes]=meta;
    registerBlockType(ns+slug,{
      apiVersion:3,title,category:'design',icon:'layout',attributes,supports:{html:false},
      edit:function(props){
        const controls=otherControls(slug,props);
        return h('div',useBlockProps({className:'ftt-block-editor-preview'}),
          h(InspectorControls,null,h(PanelBody,{title:title+' settings',initialOpen:true},...controls)),
          h('div',{className:'ftt-editor-preview-toolbar'},title+' — frontend-rendered preview'),
          SSR?h(SSR,{block:ns+slug,attributes:props.attributes,httpMethod:'POST'}):
            h('p',null,'Server-rendered preview requires the WordPress ServerSideRender component.')
        );
      },
      save:function(){return null;}
    });
  });
})();
