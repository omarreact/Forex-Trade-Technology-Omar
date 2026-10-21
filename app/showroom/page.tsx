'use client';
import {useEffect,useRef,useState} from 'react';
import type {CSSProperties} from 'react';
import {DESIGNS,DEVICES,SITE_PAGES,previewUrl,resolveDesign,type DesignId} from '@/lib/showroom/designs';

type DeviceId=typeof DEVICES[number]['id'];
type Note={id:string;design:DesignId;page:string;device:DeviceId;topic:string;comment:string;createdAt:string};
type Decision={design:DesignId;date:string};
const topics=['Overall design','Homepage','Navigation','Typography','Color palette','Images','Page layouts','Mobile responsiveness','Favorite component','Requested adjustment'];

function FramePreview({design,route,device}:{design:DesignId;route:string;device:typeof DEVICES[number]}){
  const box=useRef<HTMLDivElement>(null);
  const [available,setAvailable]=useState(600);
  useEffect(()=>{
    if(!box.current)return;
    const node=box.current;
    const observer=new ResizeObserver(()=>setAvailable(node.clientWidth));
    observer.observe(node);
    setAvailable(node.clientWidth);
    return ()=>observer.disconnect();
  },[]);
  const scale=Math.min(1,Math.max(.1,(available-4)/device.width));
  return <div ref={box} className="studio-frame" aria-label={design+' responsive website preview'}>
    <div style={{width:'100%',height:Math.ceil(device.height*scale),overflow:'hidden'}}>
      <iframe title={design+' — '+device.name+' preview'} loading="lazy" src={previewUrl(route,design,true)}
        width={device.width} height={device.height}
        style={{width:device.width,height:device.height,transform:'scale('+scale+')',transformOrigin:'top left'}}/>
    </div>
    <p className="studio-frame-meta">Rendered at {device.width} × {device.height}px · Visual scale {Math.round(scale*100)}%</p>
  </div>;
}
function download(name:string,text:string){
  const file=new Blob([text],{type:'text/markdown;charset=utf-8'});
  const url=URL.createObjectURL(file);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=name;anchor.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function markdownEscape(text:string){return text.replace(/\|/g,'\\|').replace(/\r/g,'').trim();}

export default function ShowroomStudioPage(){
  const [left,setLeft]=useState<DesignId>('match-trader');
  const [right,setRight]=useState<DesignId>('b2broker');
  const [route,setRoute]=useState<string>('/');
  const [deviceId,setDeviceId]=useState<DeviceId>('desktop');
  const [view,setView]=useState<'overview'|'compare'>('overview');
  const [favorites,setFavorites]=useState<DesignId[]>([]);
  const [notes,setNotes]=useState<Note[]>([]);
  const [decision,setDecision]=useState<Decision|null>(null);
  const [reviewDesign,setReviewDesign]=useState<DesignId>('match-trader');
  const [topic,setTopic]=useState(topics[0]);
  const [comment,setComment]=useState('');
  const [ready,setReady]=useState(false);
  const device=DEVICES.find(item=>item.id===deviceId)||DEVICES[0];
  useEffect(()=>{
    const search=new URLSearchParams(window.location.search);
    if(search.has('left'))setLeft(resolveDesign(search.get('left')));
    if(search.has('right'))setRight(resolveDesign(search.get('right')));
    if(SITE_PAGES.some(p=>p.route===search.get('page')))setRoute(search.get('page')||'/');
    if(DEVICES.some(d=>d.id===search.get('device')))setDeviceId(search.get('device') as DeviceId);
    if(search.get('view')==='compare')setView('compare');
    try{
      const fav=JSON.parse(localStorage.getItem('ftt-studio-favorites')||'[]');
      const entries=JSON.parse(localStorage.getItem('ftt-studio-feedback')||'[]');
      const saved=JSON.parse(localStorage.getItem('ftt-studio-decision')||'null');
      if(Array.isArray(fav))setFavorites(fav.filter((id:unknown)=>DESIGNS.some(d=>d.id===id)));
      if(Array.isArray(entries))setNotes(entries.filter((entry:Note)=>typeof entry?.comment==='string'));
      if(saved && DESIGNS.some(d=>d.id===saved.design))setDecision(saved);
    }catch{/* Browser storage may be inaccessible or corrupted */}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{
      localStorage.setItem('ftt-studio-favorites',JSON.stringify(favorites));
      localStorage.setItem('ftt-studio-feedback',JSON.stringify(notes));
      localStorage.setItem('ftt-studio-decision',JSON.stringify(decision));
    }catch{/* Private browsing may restrict storage */}
  },[ready,favorites,notes,decision]);
  function favorite(id:DesignId){setFavorites(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);}
  function addNote(){
    if(!comment.trim())return;
    setNotes(v=>[...v,{id:Date.now()+'-'+Math.random().toString(36).slice(2,7),design:reviewDesign,page:route,device:deviceId,topic,comment:comment.trim(),createdAt:new Date().toISOString()}]);
    setComment('');
  }
  function decide(id:DesignId){
    const name=DESIGNS.find(d=>d.id===id)?.name||id;
    if(!window.confirm('Confirm '+name+' as the preferred visual direction? This is not final production approval.'))return;
    setDecision({design:id,date:new Date().toISOString()});
  }
  function report(){
    const name=DESIGNS.find(x=>x.id===decision?.design)?.name||'Not selected';
    const lines=[
      '# Forex Trade Technology — Design Review Decision','',
      'Selection: '+name,
      'Selection date: '+(decision?.date||'Not confirmed'),
      'Favorite variations: '+(favorites.map(x=>DESIGNS.find(d=>d.id===x)?.name||x).join(', ')||'None'),
      'Reviewed page: '+route,
      'Selected device: '+device.name+' ('+device.width+'×'+device.height+')',
      'Comparison: '+left+' vs '+right,'',
      '## Client feedback','',
      ...(notes.length?notes.flatMap(n=>[
        '### '+markdownEscape(DESIGNS.find(d=>d.id===n.design)?.name||n.design)+' — '+markdownEscape(n.topic),
        '- Page: '+n.page,
        '- Viewport: '+n.device,
        '- Recorded: '+n.createdAt,
        '',
        markdownEscape(n.comment),''
      ]):['No comments recorded.','']),
      '## Outstanding release gates','',
      '- Browser-local drafts must be migrated into authenticated, server-side feedback storage before multi-device client review.',
      '- Capture and approve actual browser screenshots before calling any design pixel-validated.',
      '- Complete accessibility, visual regression, responsive and load testing for all 78 page/design combinations.',
      '- WordPress conversion begins only after the selected visual design is approved.'
    ];
    download('forex-design-decision.md',lines.join('\n'));
  }
  async function share(){
    const q=new URLSearchParams({left,right,page:route,device:deviceId,view:'compare'});
    const url=window.location.origin+'/showroom?'+q.toString();
    try{await navigator.clipboard.writeText(url);alert('Comparison link copied. Browser-local notes are not included.');}
    catch{window.prompt('Copy this comparison link:',url);}
  }
  const designsOptions=DESIGNS.map(d=><option key={d.id} value={d.id}>{d.name}</option>);
  return <main className="studio-page">
    <div className="studio-shell">
      <p className="studio-eyebrow">Forex Trade Technology / Client Review Workspace</p>
      <h1 className="studio-heading">Six directions. One brand.<br/>Your design decision.</h1>
      <p className="studio-intro">Explore the same 13 approved pages in six visual directions. Compare real rendered pages at different viewport widths, collect observations and record your preferred direction without changing the live Original design.</p>
      <p className="studio-note"><strong>Review draft:</strong> Favorites, comments and the selection are saved in this browser only. They are not shared with your team or protected by server-side client accounts. Export your Markdown report to retain a copy.</p>
      <div className="studio-actions" style={{marginTop:18}}>
        <button className={'studio-button'+(view==='overview'?' is-primary':'')} onClick={()=>setView('overview')}>Design overview</button>
        <button className={'studio-button'+(view==='compare'?' is-primary':'')} onClick={()=>setView('compare')}>Side-by-side comparison</button>
        <button className="studio-button" onClick={report}>Export decision (.md)</button>
      </div>
      {view==='overview' ? <>
        <h2 className="studio-section-title">Explore the six design directions</h2>
        <div className="studio-card-grid">{DESIGNS.map(d=>
          <article className="studio-design-card" key={d.id}>
            <div className="studio-card-visual" style={{'--visual-bg':d.primary,'--visual-fg':d.surface,'--visual-accent':d.accent,'--visual-radius':d.radius} as CSSProperties}>
              <strong>{d.name}</strong><span/>
            </div>
            <div className="studio-card-content"><h3>{d.tag}</h3><p>{d.description}</p>
              <div className="studio-actions">
                <a className="studio-button is-primary" href={previewUrl(route,d.id)}>Explore pages ↗</a>
                <button className={'studio-button'+(favorites.includes(d.id)?' is-selected':'')} aria-pressed={favorites.includes(d.id)} onClick={()=>favorite(d.id)}>{favorites.includes(d.id)?'★ Favorite':'☆ Favorite'}</button>
                <button className="studio-button" onClick={()=>{setLeft(d.id);setView('compare');}}>Compare</button>
                <button className="studio-button" onClick={()=>decide(d.id)}>Select design</button>
              </div>
            </div>
          </article>)}</div>
        <p className="studio-note">These swatches represent each design's implemented visual tokens; they are not screenshots. Use Explore or Compare for live page rendering.</p>
      </> : <>
        <h2 className="studio-section-title">Live page comparison</h2>
        <div className="studio-controls">
          <label>Page<select value={route} onChange={e=>setRoute(e.target.value)}>{SITE_PAGES.map(p=><option key={p.route} value={p.route}>{p.name}</option>)}</select></label>
          <label>Left design<select value={left} onChange={e=>setLeft(resolveDesign(e.target.value))}>{designsOptions}</select></label>
          <label>Right design<select value={right} onChange={e=>setRight(resolveDesign(e.target.value))}>{designsOptions}</select></label>
          <label>Preview viewport<select value={deviceId} onChange={e=>setDeviceId(e.target.value as DeviceId)}>{DEVICES.map(d=><option key={d.id} value={d.id}>{d.name} · {d.width}px</option>)}</select></label>
          <button className="studio-button" onClick={share}>Copy comparison link</button>
        </div>
        <div className="studio-layout">
          <section className="studio-panel"><div className="studio-panel-title"><b>{DESIGNS.find(d=>d.id===left)?.name}</b><a className="studio-button" target="_blank" rel="noopener noreferrer" href={previewUrl(route,left)}>Open full ↗</a></div><FramePreview design={left} route={route} device={device}/></section>
          <section className="studio-panel"><div className="studio-panel-title"><b>{DESIGNS.find(d=>d.id===right)?.name}</b><a className="studio-button" target="_blank" rel="noopener noreferrer" href={previewUrl(route,right)}>Open full ↗</a></div><FramePreview design={right} route={route} device={device}/></section>
        </div>
        <p className="studio-note">Each frame renders the actual responsive page at {device.width}px width, then scales the preview to fit the panel. Layouts can differ; scroll each frame independently.</p>
      </>}
      <div className="studio-review">
        <section className="studio-review-box">
          <h3>Client feedback</h3>
          <label className="studio-label">Design<select className="studio-field" value={reviewDesign} onChange={e=>setReviewDesign(resolveDesign(e.target.value))}>{designsOptions}</select></label>
          <label className="studio-label">What are you reviewing?<select className="studio-field" value={topic} onChange={e=>setTopic(e.target.value)}>{topics.map(t=><option key={t}>{t}</option>)}</select></label>
          <label className="studio-label">Your comment<textarea className="studio-textarea" placeholder="What works well? What would you change?" value={comment} onChange={e=>setComment(e.target.value)} /></label>
          <button className="studio-button is-primary" onClick={addNote} disabled={!comment.trim()}>Save browser-local feedback</button>
          <ul className="studio-feedback-list">{notes.slice().reverse().map(n=><li key={n.id}><strong>{DESIGNS.find(x=>x.id===n.design)?.name} · {n.topic}</strong><div>{n.comment}</div><small>{n.page} · {n.device} · {new Date(n.createdAt).toLocaleString()} <button className="studio-button" style={{marginLeft:8,padding:'3px 8px'}} onClick={()=>setNotes(a=>a.filter(x=>x.id!==n.id))}>Delete</button></small></li>)}</ul>
          {!notes.length&&<p className="studio-note">No feedback saved yet.</p>}
        </section>
        <section className="studio-review-box">
          <h3>Final visual direction</h3>
          {decision?<p className="studio-badge">✓ Preferred: {DESIGNS.find(d=>d.id===decision.design)?.name}</p>:<p className="studio-note">No design confirmed yet. Choose Select design on an overview card after exploring its pages.</p>}
          <p className="studio-note">This selection is a visual preference, not authorization to launch a production website or remove other concepts. You may change it before developer handoff.</p>
          <p className="studio-note">Favorite designs: {favorites.map(x=>DESIGNS.find(d=>d.id===x)?.name).join(', ')||'None'}</p>
          <div className="studio-actions">
            <button className="studio-button is-primary" onClick={report}>Download handoff report</button>
            {decision&&<button className="studio-button" onClick={()=>setDecision(null)}>Clear selection</button>}
          </div>
          <h4 style={{marginTop:30}}>Coverage checklist</h4>
          <p className="studio-note">13 approved content pages · 6 design styles · 78 preview combinations · {DEVICES.length} responsive viewport presets.</p>
          <p className="studio-note">Before external client release: authenticated data persistence, actual screenshots, cross-browser QA and access control remain to be validated.</p>
        </section>
      </div>
    </div>
  </main>;
}
