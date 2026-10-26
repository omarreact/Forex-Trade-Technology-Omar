/* Gutenberg custom blocks — core wp.element only, no Next/JSX. */
(function(w){'use strict';if(!w.wp?.blocks||!w.wp?.blockEditor)return;
 const wp=w.wp,h=wp.element.createElement,{TextControl,TextareaControl,ToggleControl,Button,PanelBody,SelectControl}=wp.components;
 const {InspectorControls,useBlockProps}=wp.blockEditor,SSR=wp.serverSideRender?.default||wp.serverSideRender;
 const assets=(w.fttXMLEditor?.images)||{},imageOptions=[{label:'Select theme image',value:''},...Object.entries(assets).map(([key,item])=>({value:key,label:key+' — '+(item.alt||'')?.slice(0,65)}))];
 const listUpdate=(props,key,index,patch)=>{const copy=[...(props.attributes[key]||[])];copy[index]={...copy[index],...patch};props.setAttributes({[key]:copy})};
 const icon=h.bind(null);
 function controls(props){const a=props.attributes,id=props.name.split('/')[1],out=[];
  const add=(tag,props2,child)=>out.push(h(tag,{key:'c'+out.length,...props2},child));
  const field=(label,key,type='text')=>add(type==='textarea'?TextareaControl:TextControl,{label,value:a[key]||'',onChange:v=>props.setAttributes({[key]:v})});
  if(id==='home-slider'){
   add(ToggleControl,{label:'Autoplay',checked:a.autoplay!==false,onChange:v=>props.setAttributes({autoplay:v})});
   add(TextControl,{label:'Interval (milliseconds)',type:'number',value:a.intervalMs||6000,onChange:v=>props.setAttributes({intervalMs:Math.max(3000,parseInt(v,10)||6000)})});
   (a.slides||[]).forEach((s,i)=>{
    add('h3',{},'Slide '+(i+1));
    for(const k of ['kicker','title','subtitle'])add(k==='subtitle'?TextareaControl:TextControl,{label:k,value:s[k]||'',onChange:v=>listUpdate(props,'slides',i,{[k]:v})});
    add(SelectControl,{label:'Background image',options:imageOptions,value:s.imageKey||'',onChange:v=>listUpdate(props,'slides',i,{imageKey:v})});
    for(const k of ['label','href'])add(TextControl,{label:'Button '+k,value:s.cta?.[k]||'',onChange:v=>listUpdate(props,'slides',i,{cta:{...s.cta,[k]:v}})});
    add(Button,{isDestructive:true,variant:'tertiary',onClick:()=>props.setAttributes({slides:a.slides.filter((_,j)=>j!==i)})},'Remove slide');
   });
   add(Button,{variant:'secondary',onClick:()=>props.setAttributes({slides:[...(a.slides||[]),{title:'New slide',subtitle:'Edit subtitle',kicker:'FOREX TRADE TECHNOLOGY',cta:{label:'Learn more',href:'/contact'},imageKey:''}]})},'Add slide');
  }
  if(id==='trust-carousel'){
   add(TextareaControl,{label:'Trust features — one line each',rows:10,value:(a.items||[]).join('\n'),onChange:v=>props.setAttributes({items:v.split('\n').map(x=>x.trim()).filter(Boolean)})});
   add(ToggleControl,{label:'Animate on frontend',checked:a.autoplay!==false,onChange:v=>props.setAttributes({autoplay:v})});
  }
  if(id==='audience-carousel'){
   field('Section heading','heading');(a.items||[]).forEach((s,i)=>{
    add('h3',{},'Audience '+(i+1));
    add(TextControl,{label:'Title',value:s.title||'',onChange:v=>listUpdate(props,'items',i,{title:v})});
    add(TextareaControl,{label:'Description',value:s.description||'',onChange:v=>listUpdate(props,'items',i,{description:v})});
    add(Button,{isDestructive:true,variant:'tertiary',onClick:()=>props.setAttributes({items:a.items.filter((_,j)=>j!==i)})},'Remove audience');
   });add(Button,{variant:'secondary',onClick:()=>props.setAttributes({items:[...(a.items||[]),{title:'New audience',description:'Add details',icon:'users'}]})},'Add audience');
  }
  if(id==='trading-stack-flow'){
   field('Heading','heading');
   (a.steps||[]).forEach((s,i)=>{
    add('h3',{},'Flow step '+(i+1));
    add(TextControl,{label:'Title',value:s.title||'',onChange:v=>listUpdate(props,'steps',i,{title:v})});
    add(TextareaControl,{label:'Description',value:s.description||'',onChange:v=>listUpdate(props,'steps',i,{description:v})});
    add(Button,{isDestructive:true,variant:'tertiary',onClick:()=>props.setAttributes({steps:a.steps.filter((_,j)=>j!==i)})},'Remove step');
   });add(Button,{variant:'secondary',onClick:()=>props.setAttributes({steps:[...(a.steps||[]),{title:'New step',description:'Describe this stage'}]})},'Add step');
  }
  if(id==='contact-form'){
   field('Form heading','heading');field('Introductory text','intro','textarea');field('Submit button','submitLabel');
   for(const [key,def] of Object.entries({name:'Name',email:'Business Email',company:'Company',country:'Country',contact:'Phone / WhatsApp',interest:'Interest',stage:'Stage',message:'Message'})){
    add(TextControl,{label:def+' field label',value:a.labels?.[key]||def,onChange:v=>props.setAttributes({labels:{...(a.labels||{}),[key]:v}})});
   }
  }
  return out;
 }
 const registry={
 'home-slider':{slides:{type:'array',default:[]},autoplay:{type:'boolean',default:true},intervalMs:{type:'number',default:6000}},
 'trust-carousel':{items:{type:'array',default:[]},autoplay:{type:'boolean',default:true}},
 'audience-carousel':{heading:{type:'string',default:'Who We Work With'},items:{type:'array',default:[]}},
 'trading-stack-flow':{heading:{type:'string',default:''},steps:{type:'array',default:[]},paragraphs:{type:'array',default:[]}},
 'contact-form':{heading:{type:'string',default:''},intro:{type:'string',default:''},labels:{type:'object',default:{}},submitLabel:{type:'string',default:'Request a Consultation'}}
 };
 Object.entries(registry).forEach(([slug,attributes])=>{
  const name='forex-trade-technology/'+slug;
  wp.blocks.registerBlockType(name,{apiVersion:3,title:slug.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' '),category:'forex-trade-technology',attributes,supports:{html:false,align:['wide','full']},edit(props){
   return h('div',useBlockProps({className:'ftt-xml-editor-block'}),
    h(InspectorControls,null,h(PanelBody,{title:'Edit '+slug.replaceAll('-',' '),initialOpen:true},...controls(props))),
    SSR?h(SSR,{block:name,attributes:props.attributes,httpMethod:'POST'}):h('p',null,'WordPress preview is temporarily unavailable.'));
  },save(){return null;}});
 });
})(window);
