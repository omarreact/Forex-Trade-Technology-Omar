import {NextRequest,NextResponse} from 'next/server';
export const runtime='nodejs';

// Static GitHub Pages is an approved browser client for the production API.
// CORS is not authentication: server-side spam defenses must remain enabled.
const githubPagesOrigin='https://omarreact.github.io';
function corsHeaders(origin:string|null){
 return origin===githubPagesOrigin
  ? {'Access-Control-Allow-Origin':githubPagesOrigin,'Access-Control-Allow-Methods':'POST, OPTIONS',
     'Access-Control-Allow-Headers':'Content-Type, Accept','Access-Control-Max-Age':'600','Vary':'Origin'}
  : {'Vary':'Origin'};
}
export async function OPTIONS(req:NextRequest){
 const origin=req.headers.get('origin');
 return new NextResponse(null,{status:origin===githubPagesOrigin?204:403,headers:corsHeaders(origin)});
}
function read(form:FormData,key:string,max:number){const v=form.get(key);return typeof v==='string'?v.trim().slice(0,max):'';}
export async function POST(req:NextRequest){
 const origin=req.headers.get('origin');
 const headers=corsHeaders(origin);
 const json=(payload:Record<string,unknown>,status=200)=>NextResponse.json(payload,{status,headers});
 if(origin&&origin!==req.nextUrl.origin&&origin!==githubPagesOrigin)return json({message:'Invalid form origin.'},403);
 if(!req.headers.get('content-type')?.includes('multipart/form-data'))return json({message:'Invalid form encoding.'},415);
 let form:FormData;try{form=await req.formData()}catch{return json({message:'Invalid form submission.'},400)}
 if(read(form,'website',100))return json({ok:true,message:'Thank you.'});
 const isFeedback=read(form,'kind',40)==='website-feedback';
 const name=read(form,'name',100),email=read(form,'email',150),message=read(form,'message',4000);
 if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length<10)return json({message:'Enter your name, a valid email and a project description of at least 10 characters.'},400);
 const key=process.env.RESEND_API_KEY,to=process.env.CONTACT_TO_EMAIL,from=process.env.CONTACT_FROM_EMAIL;
 if(!key||!to||!from)return json({message:'Email delivery is not yet configured. No message was sent; please try again later.'},503);
 const other=isFeedback
  ? ['pageUrl','section','category'].map(k=>`${k}: ${read(form,k,k==='pageUrl'?500:150)}`)
  : ['company','country','contact','interest','stage'].map(k=>`${k}: ${read(form,k,150)}`);
 try{
  const rsp=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],reply_to:email,subject:isFeedback?'Website change request — Forex Trade Technology':'New Forex Trade Technology enquiry',text:[isFeedback?'New website change request':'New enquiry',`Name: ${name}`,`Email: ${email}`,...other,'',message].join('\n')}),cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!rsp.ok)throw new Error(`Resend HTTP ${rsp.status}`);
  return json({ok:true,message:isFeedback?'Your website feedback was accepted by the email provider.':'Your enquiry was accepted by the email provider.'});
 }catch(e){console.error('Contact delivery failed',e instanceof Error?e.message:'unknown');return json({message:'Email delivery failed. Please try again later.'},502)}
}
