/* Source-derived Gutenberg block editor. Preserve the 11 ftt/* names. */
(function(w){'use strict';if(!w.wp||!wp.blocks||!wp.blockEditor)return;
const E=wp.element.createElement,Fragment=wp.element.Fragment,B=wp.blockEditor,C=wp.components,R=wp.blocks.registerBlockType;
const Text=C.TextControl,Panel=C.PanelBody,Inspector=B.InspectorControls,Inner=B.InnerBlocks,use=B.useBlockProps,Rich=B.RichText;
const spec={container:{tagName:{type:'string',default:'div'}},link:{url:{type:'string',default:'/'}},'inline-text':{text:{type:'string',default:''},tagName:{type:'string',default:'span'}},icon:{iconName:{type:'string',default:'arrowUpRight'},size:{type:'number',default:19}},'faq-item':{question:{type:'string',default:''},isInitiallyOpen:{type:'boolean',default:false}},'form-field':{elementType:{type:'string',default:'input'},inputAttrs:{type:'object',default:{}},options:{type:'array',default:[]}},'social-links':{whatsappUrl:{type:'string',default:'https://wa.me/'},telegramUrl:{type:'string',default:'https://t.me/'}},image:{src:{type:'string',default:''},alt:{type:'string',default:''}},'site-navigation':{ariaLabel:{type:'string',default:'Primary navigation'}},'nav-link':{label:{type:'string',default:'Link'},url:{type:'string',default:'/'}},'nav-submenu':{label:{type:'string',default:'Submenu'},url:{type:'string',default:'#'}}};
const nested=new Set(['container','link','faq-item','site-navigation','nav-submenu']);
for(const [name,attributes] of Object.entries(spec)){
 R('ftt/'+name,{title:'FTT '+name,icon:'admin-customizer',category:'design',apiVersion:3,attributes,
 supports:{html:false,customClassName:true,color:{text:true,background:true},spacing:{margin:true,padding:true}},
 edit:function(props){const a=props.attributes,bp=use(),controls=Object.keys(attributes).filter(k=>attributes[k].type==='string').map(k=>E(Text,{key:k,label:k,value:a[k]||'',onChange:v=>props.setAttributes({[k]:v})}));
 let child;
 if(name==='inline-text')child=E(Rich,{tagName:'span',value:a.text||'',onChange:v=>props.setAttributes({text:v}),placeholder:'Edit text…'});
 else if(name==='icon')child=E('span',{},'◇ '+(a.iconName||'icon'));
 else if(name==='image')child=E('div',{},E(Text,{label:'Image URL',value:a.src||'',onChange:v=>props.setAttributes({src:v})}),a.src?E('img',{src:a.src,alt:a.alt||'',style:{maxWidth:'100%',maxHeight:250}}):null);
 else if(name==='nav-link')child=E('a',{href:'#'},a.label||'Link');
 else if(name==='form-field')child=E('div',{},
  E(Text,{label:'Field name',value:a.inputAttrs?.name||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),name:v}})}),
  E(Text,{label:'Field label',value:a.inputAttrs?.label||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),label:v}})}),
  E(Text,{label:'Placeholder',value:a.inputAttrs?.placeholder||'',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),placeholder:v}})}),
  E(Text,{label:'Input type',value:a.inputAttrs?.type||'text',onChange:v=>props.setAttributes({inputAttrs:{...(a.inputAttrs||{}),type:v}})}),
  name==='form-field'&&a.elementType==='select'?E(Text,{label:'Options (one per line)',value:(a.options||[]).join('\n'),onChange:v=>props.setAttributes({options:v.split('\n').filter(Boolean)})}):null);
 else if(name==='social-links')child=E('div',{},'WhatsApp · Telegram');
 else if(nested.has(name))child=E(Inner,{allowedBlocks:name==='site-navigation'?['ftt/nav-link','ftt/nav-submenu']:name==='nav-submenu'?['ftt/nav-link']:undefined,renderAppender:Inner.ButtonBlockAppender});
 else child=E('div',{},name);
 return E(Fragment,{},E(Inspector,{},E(Panel,{title:'FTT '+name,initialOpen:true},...controls)),E('div',bp,child));
 },save:function(){return nested.has(name)?E(Inner.Content):null;}});
}
})(window);
