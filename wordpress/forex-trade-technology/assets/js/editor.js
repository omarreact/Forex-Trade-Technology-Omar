(function(wp){
 if(!wp||!wp.blocks||!wp.element||!wp.blockEditor)return;
 const el=wp.element.createElement;
 const TextControl=wp.components.TextControl,TextareaControl=wp.components.TextareaControl;
 const InspectorControls=wp.blockEditor.InspectorControls;
 const PanelBody=wp.components.PanelBody;
 const ServerSideRender=wp.serverSideRender;
 const types=['section','home-slider','trading-stack-flow','trust-carousel','audience-carousel','icon-card','contact-form'];
 function Edit(props){
  const a=props.attributes||{},type=props.name.split('/')[1];
  const update=(key,v)=>props.setAttributes({[key]:v});
  const field=type==='section'||type==='trading-stack-flow'?'section':type==='home-slider'?'slides':type==='audience-carousel'?'items':type==='trust-carousel'?'items':type==='contact-form'?'copy':'';
  const data=field?a[field]:null;
  const controls=[];
  if(type==='icon-card'){
   controls.push(el(TextControl,{label:'Card title',value:a.title||'',onChange:v=>update('title',v)}));
   controls.push(el(TextareaControl,{label:'Description',value:a.description||'',onChange:v=>update('description',v)}));
  }
  if(field){
   const obj=field==='section'?(data||{}):data||[];
   controls.push(el(TextareaControl,{label:'Block attributes · JSON',help:'Edit content fields and preserve valid JSON. Advanced settings; layout is defined by the Next.js migration map.',value:JSON.stringify(obj,null,2),rows:12,onChange:v=>{try{update(field,JSON.parse(v))}catch(e){/* Keep last valid value until JSON is complete */}}}));
  }
  const panel=el(InspectorControls,{},el(PanelBody,{title:'Forex Technology block',initialOpen:true},...controls));
  return el('div',wp.blockEditor.useBlockProps({className:'ftt-section-editor'}),panel,
   el('div',{className:'ftt-editor-badge'},'FOREX TRADE TECHNOLOGY · '+type),
   ServerSideRender?el(ServerSideRender,{block:props.name,attributes:a}):el('pre',{},JSON.stringify(a,null,2)));
 }
 types.forEach(type=>wp.blocks.registerBlockType('forex-trade-technology/'+type,{
  edit:Edit,
  save:()=>null
 }));
})(window.wp);
