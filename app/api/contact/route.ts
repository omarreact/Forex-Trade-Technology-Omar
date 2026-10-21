import {NextRequest,NextResponse} from 'next/server';

export const runtime='nodejs';
function read(form:FormData,key:string,max:number){
 const v=form.get(key);
 return typeof v==='string'?v.trim().slice(0,max):'';
}
export async function POST(request:NextRequest){
 const origin=request.headers.get('origin');
 if(origin && origin!==request.nextUrl.origin)return NextResponse.json({message:'Invalid form origin.'},{status:403});
 const type=request.headers.get('content-type')||'';
 if(!type.includes('multipart/form-data')&&!type.includes('application/x-www-form-urlencoded'))
  return NextResponse.json({message:'Invalid form encoding.'},{status:415});
 let form:FormData;
 try{form=await request.formData();}catch{return NextResponse.json({message:'Invalid submission.'},{status:400});}
 if(read(form,'website',100))return NextResponse.json({ok:true});
 const name=read(form,'name',100);
 const email=read(form,'email',150);
 const message=read(form,'message',4000);
 if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length<10)
  return NextResponse.json({message:'Please enter a valid name, business email, and message of at least 10 characters.'},{status:400});
 const apiKey=process.env.RESEND_API_KEY;
 const recipient=process.env.CONTACT_TO_EMAIL;
 const sender=process.env.CONTACT_FROM_EMAIL;
 if(!apiKey || !recipient || !sender)return NextResponse.json({message:'The consultation form is not configured yet. Please contact the team through an alternative channel.'},{status:503});
 const keys=['company','country','contact','interest','stage'] as const;
 const text=['New Forex Trade Technology consultation request','', 'Name: '+name,'Email: '+email,...keys.map(k=>k+': '+read(form,k,150)),'','Message:',message].join('\n');
 try{
  const response=await fetch('https://api.resend.com/emails',{
   method:'POST',
   headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
   body:JSON.stringify({from:sender,to:[recipient],reply_to:email,subject:'Forex Trade Technology — Consultation request',text}),
   cache:'no-store',signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw new Error('Email provider responded '+response.status);
  return NextResponse.json({ok:true,message:'Thank you. Your consultation request has been sent.'});
 }catch(error){console.error('[Contact] Delivery failed',error instanceof Error?error.message:'Unknown provider error');
  return NextResponse.json({message:'Your request could not be delivered. Please try again later.'},{status:502});
 }
}
