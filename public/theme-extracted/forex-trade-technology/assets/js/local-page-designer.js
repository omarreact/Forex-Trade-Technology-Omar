/*
 * Forex Trade Technology — free local design generator.
 * This is a rule-based offline layout engine, NOT a neural LLM.
 * No requests, accounts, keys, paid services, telemetry, or dependencies beyond WP.
 */
(function (wp) {
  'use strict';
  if (!wp || !wp.plugins || !wp.editPost || !wp.blocks || !wp.data || !wp.components || !wp.element) return;
  var el = wp.element.createElement;
  var useState = wp.element.useState;
  var B = wp.blocks.createBlock;
  var C = wp.components;
  var Sidebar = wp.editPost.PluginSidebar;
  var MenuItem = wp.editPost.PluginSidebarMoreMenuItem;
  if (!Sidebar) return;
  var OPTIONS = [
    { name: 'Editorial', info: 'Large introduction, airy sections, alternating backgrounds' },
    { name: 'Service Cards', info: 'Structured introduction with feature and service cards' },
    { name: 'Split Spotlight', info: 'Strong editorial introductions and responsive split sections' }
  ];
  function escapeHtml(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function block(name, attrs, children) { return B(name, attrs || {}, children || []); }
  function paragraph(text, cls) {
    return block('core/paragraph', { content: escapeHtml(text).replace(/\n/g, '<br>'), className: cls || 'bs-copy' });
  }
  function heading(text, level, cls) { return block('core/heading', { level: level, content: escapeHtml(text), className: cls || 'bs-section-title' }); }
  function group(cls, children, section) {
    return block('core/group', { className: cls, tagName: section ? 'section' : 'div', layout: { type: 'constrained' } }, children);
  }
  function readInput(input, title) {
    var raw = input.replace(/\r\n/g, '\n').trim();
    var chunks = raw.split(/\n\s*\n/g), tokens = [];
    chunks.forEach(function (chunk) {
      var lines = chunk.split('\n'), pending = [];
      function flush() { if (pending.length) { tokens.push({type:'p',text:pending.join('\n')}); pending=[]; } }
      lines.forEach(function (line) {
        var match = line.match(/^\s*(?:#{1,3}\s+|H([123])\s*:\s*)(.+?)\s*$/i);
        if (match) {
          flush();
          var mdMatch = line.match(/^\s*(#{1,3})\s+/);
          var lv = mdMatch ? mdMatch[1].length : Number(match[1]);
          tokens.push({type:'h'+lv,text:match[2].trim()});
        } else if (line.trim()) { pending.push(line); }
      });
      flush();
    });
    if (!tokens.length) return [];
    if (tokens[0].type !== 'h1') tokens.unshift({type:'h1',text:title || 'New Page'});
    return tokens;
  }
  function sectionsFromTokens(tokens) {
    var result=[], current=null, intro=[];
    tokens.forEach(function (t) {
      if (t.type === 'h1') { if (!result.length) intro.push(t); else { if (!current) current={label:'Additional Information',items:[]}; current.items.push(t); } }
      else if (t.type === 'h2') { if (current) result.push(current); current={label:t.text,items:[]}; }
      else if (current) current.items.push(t);
      else intro.push(t);
    });
    if (current) result.push(current);
    return {intro:intro,sections:result};
  }
  function contentBlocks(items, variant) {
    var output=[], index=0;
    while (index < items.length) {
      var item=items[index];
      if (item.type === 'h3' && variant !== 0) {
        var cards=[];
        while (index<items.length && items[index].type==='h3') {
          var x = items[index++], children=[heading(x.text,3,'bs-step-title')];
          while (index<items.length && items[index].type==='p') children.push(paragraph(items[index++].text));
          cards.push(group('ftt-ai-card bs-card',children));
        }
        if (cards.length>=2) output.push(group('ftt-ai-cards',cards));
        else output.push.apply(output,cards);
        continue;
      }
      if (item.type === 'h3') output.push(heading(item.text,3,'bs-step-title'));
      else if (item.type === 'h1') output.push(heading(item.text,2,'bs-section-title'));
      else output.push(paragraph(item.text));
      index++;
    }
    return output;
  }
  function design(tokens, variant) {
    var parsed=sectionsFromTokens(tokens);
    var intro=parsed.intro.map(function (t, i) {
      return t.type==='h1' ? heading(t.text,1,'bs-hero-title') : paragraph(t.text,i===1?'bs-hero-subtitle':'ftt-hero-description');
    });
    var result=[group('bs-hero ftt-content-hero ftt-ai-section', [group('bs-container',intro)],true)];
    parsed.sections.forEach(function (section,i) {
      var contents=contentBlocks(section.items,variant);
      var title=heading(section.label,2,'bs-section-title');
      var cls='ftt-ai-section ftt-content-section'+(i%2?' ftt-band':'');
      if (variant===2 && contents.length>1) {
        var half=Math.ceil(contents.length/2);
        result.push(group(cls,[group('bs-container',[title,group('ftt-ai-split',[group('ftt-ai-split-main',contents.slice(0,half)),group('ftt-ai-split-aside',contents.slice(half))])])],true));
      } else result.push(group(cls,[group('bs-container',[title].concat(contents))],true));
    });
    if (!parsed.sections.length) {
      // Description-only use creates structural empty placeholders — never invents business claims.
      result.push(group('ftt-ai-section ftt-content-section ftt-band',[group('bs-container',[
        heading('Add your first section heading',2),paragraph('Add section details here.')
      ])],true));
    }
    return wp.blocks.serialize(result);
  }
  function LocalPageDesigner() {
    var inputState=useState(''), input=inputState[0], setInput=inputState[1];
    var selection=useState(0), option=selection[0], setOption=selection[1];
    var statusState=useState(''), status=statusState[0], setStatus=statusState[1];
    var title=wp.data.select('core/editor').getEditedPostAttribute('title') || 'New Page';
    var canBuild=!!input.trim();
    function apply() {
      if (!canBuild) {setStatus('Enter a description or paste content first.');return;}
      var tokens=readInput(input,title), markup=design(tokens,option);
      if (!markup) {setStatus('Could not generate a layout from that text.');return;}
      var existing=wp.data.select('core/editor').getEditedPostContent() || '';
      if (existing.trim() && !window.confirm('This page already has content. Insert the new design after the existing content? Your original blocks will be preserved.')) return;
      wp.data.dispatch('core/editor').editPost({content:existing.trim()?existing+'\n'+markup:markup});
      setStatus('Layout inserted as editable Gutenberg blocks. Review it and click Save or Publish.');
    }
    return el(wp.element.Fragment,null,
      MenuItem?el(MenuItem,{target:'ftt-local-page-designer',icon:'layout'},'Local Page Designer'):null,
      el(Sidebar,{name:'ftt-local-page-designer',title:'Free Local Page Designer',icon:'layout'},
        el('div',{className:'ftt-designer-panel'},
          el('p',null,'Offline, rule-based layout generator. No API key or paid AI service.'),
          el(C.TextareaControl,{label:'Describe the page or paste the exact content',rows:10,value:input,onChange:setInput,help:'Supports H1:, H2:, H3: or Markdown headings. Pasted wording is not rewritten.'}),
          el('h3',null,'Choose one of three designs'),
          OPTIONS.map(function (v,i) {
            return el('label',{key:i,className:'ftt-designer-choice'+(option===i?' selected':'')},
              el('input',{type:'radio',name:'ftt-designer-variant',checked:option===i,onChange:function(){setOption(i);}}),
              el('span',null,el('strong',null,v.name),el('small',null,v.info)));
          }),
          el(C.Button,{variant:'primary',onClick:apply,disabled:!canBuild},'Insert editable layout'),
          el('p',{role:'status','aria-live':'polite'},status),
          el('p',{className:'ftt-designer-help'},'All generated sections are native WordPress groups, headings and paragraphs. No generated content is sent anywhere. Description-only pages contain clearly editable placeholder sections.')
        )
      )
    );
  }
  wp.plugins.registerPlugin('ftt-local-page-designer',{render:LocalPageDesigner,icon:'layout'});
}(window.wp));
