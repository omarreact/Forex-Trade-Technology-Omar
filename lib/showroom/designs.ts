export const DESIGNS = [
  {id:'original',name:'Original',tag:'Existing forest-green identity',description:'Established look, preserved as the comparison baseline.',primary:'#17251a',accent:'#b4d184',surface:'#f6f8f2',ink:'#17251a',font:'Arial, Helvetica, sans-serif',radius:'16px',reference:'https://forextrade.pincodeit.com/'},
  {id:'match-trader',name:'Match-Trader',tag:'Bright product-led fintech',description:'Airy interface, framed photography and crisp cyan signals.',primary:'#072b3a',accent:'#04c3ce',surface:'#f0f9fa',ink:'#123744',font:'Arial, Helvetica, sans-serif',radius:'18px',reference:'https://match-trade.com/'},
  {id:'b2broker',name:'B2Broker',tag:'Institutional dark editorial',description:'Large white type, deep navy and premium gold details.',primary:'#080f20',accent:'#d9b887',surface:'#f0f2f6',ink:'#101c31',font:'Georgia, Times New Roman, serif',radius:'6px',reference:'https://b2broker.com/'},
  {id:'leverate',name:'Leverate',tag:'Expressive conversion studio',description:'Violet gradients, open whitespace and rounded software cards.',primary:'#311a70',accent:'#efb6ff',surface:'#f7f3ff',ink:'#281b53',font:'Arial, Helvetica, sans-serif',radius:'28px',reference:'https://leverate.com/'},
  {id:'soft-fx',name:'Soft-FX',tag:'Technical infrastructure',description:'Grid systems, precise typography and restrained technical teal.',primary:'#101f2d',accent:'#7ad9b3',surface:'#e9f0f1',ink:'#162936',font:'Arial, Helvetica, sans-serif',radius:'4px',reference:'https://www.soft-fx.com/'},
  {id:'uptrader',name:'UpTrader',tag:'Approachable brokerage software',description:'Warm off-white, soft orange and playful asymmetric cards.',primary:'#243c35',accent:'#ef9c53',surface:'#fffaf1',ink:'#183d34',font:'Arial, Helvetica, sans-serif',radius:'32px',reference:'https://uptrader.io/'}
] as const;

export type DesignId = typeof DESIGNS[number]['id'];
export function resolveDesign(value:string|null|undefined):DesignId {
  const found=DESIGNS.find((item)=>item.id===value);
  return found ? found.id : 'original';
}
export const SITE_PAGES=[
 {name:'Home',route:'/',group:'General'},
 {name:'Brokerage Setup',route:'/solutions/brokerage-setup/',group:'Solutions'},
 {name:'MT5 White Label',route:'/solutions/mt5-white-label/',group:'Solutions'},
 {name:'Forex Broker Hosting',route:'/solutions/forex-broker-hosting/',group:'Solutions'},
 {name:'Liquidity & Connectivity',route:'/solutions/forex-liquidity-connectivity/',group:'Solutions'},
 {name:'Forex CRM',route:'/products/forex-crm/',group:'Products'},
 {name:'KYC & AML Integration',route:'/technology/kyc-aml-integration/',group:'Technology'},
 {name:'Payment Gateway Integration',route:'/products/payment-gateway-integration/',group:'Products'},
 {name:'Prop Firm CRM & API',route:'/products/prop-firm-crm-api/',group:'Products'},
 {name:'How It Works',route:'/how-it-works/',group:'General'},
 {name:'About Us',route:'/about-us/',group:'General'},
 {name:'FAQs',route:'/faq/',group:'General'},
 {name:'Contact',route:'/contact/',group:'General'}
] as const;

export const DEVICES=[
 {id:'desktop',name:'Desktop',width:1440,height:900},
 {id:'laptop',name:'Laptop',width:1280,height:800},
 {id:'tablet',name:'Tablet',width:768,height:1024},
 {id:'mobile',name:'Mobile',width:390,height:844},
 {id:'small-mobile',name:'Small mobile',width:360,height:800}
] as const;
export function previewUrl(route:string,design:DesignId,embed=false):string {
  return route + (route.includes('?')?'&':'?') + 'design='+design+(embed?'&embed=1':'');
}
