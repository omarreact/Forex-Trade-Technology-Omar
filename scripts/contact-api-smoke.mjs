/**
 * Safe contract tests. Never supplies Resend credentials or sends email.
 * Run against a local CI server with no CONTACT and RESEND environment variables.
 */
const base=(process.env.CONTACT_SMOKE_URL || 'http://127.0.0.1:3000').replace(/\/$/,'');
const endpoint=base+'/api/contact';
const cases=[];
async function request(label,{method='POST',form,body,headers={},expected}){
 const opts={method,headers:{...headers}};
 if(form){opts.body=new FormData();for(const [key,value] of Object.entries(form))opts.body.set(key,value);}
 if(body!==undefined)opts.body=body;
 const resp=await fetch(endpoint,opts);
 const json=await resp.text();
 cases.push({label,status:resp.status,expected,ok:resp.status===expected,body:json.slice(0,200)});
 if(resp.status!==expected)throw Error(label+' expected '+expected+', got '+resp.status+': '+json.slice(0,200));
 console.log('PASS',label,resp.status);
}
await request('reject JSON body',{headers:{'Content-Type':'application/json'},body:'{}',expected:415});
await request('validate required fields',{form:{name:'',email:'nobody',message:'short'},expected:400});
await request('reject untrusted origin',{headers:{Origin:'https://untrusted.example'},form:{name:'QA',email:'qa@example.com',message:'Test message from CI smoke'},expected:403});
await request('spam honeypot is inert',{form:{website:'bot-filled',name:'QA',email:'qa@example.com',message:'Automated CI smoke test'},expected:200});
await request('valid form when email unconfigured',{form:{name:'QA Tester',email:'qa@example.com',message:'This is a synthetic local-only contact test; do not deliver.'},expected:503});
await request('approved cross-origin preflight',{method:'OPTIONS',headers:{Origin:'https://omarreact.github.io'},expected:204});
await request('reject untrusted preflight',{method:'OPTIONS',headers:{Origin:'https://untrusted.example'},expected:403});
console.log('Passed',cases.length,'safe API contract checks. Provider success (HTTP 200) needs a separate consented test with valid staging Resend configuration.');
