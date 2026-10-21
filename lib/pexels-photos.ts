/**
 * Licensed, REAL photographs from Pexels. No generated images, downloads,
 * local copies, API keys or proxying. Each ID and subject was checked against
 * its public Pexels photo page; never imply the subjects endorse this company.
 * See https://www.pexels.com/license/
 */
export type EditorialPhoto = Readonly<{
  src: string;
  page: string;
  alt: string;
  credit: string;
}>;

function p(id: number, slug: string, alt: string, credit: string): EditorialPhoto {
  return {
    src: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`,
    page: `https://www.pexels.com/photo/${slug}-${id}/`,
    alt,
    credit,
  };
}

export const pexels = {
  mt5: p(5833758, 'man-working-on-a-computer-with-three-monitors', 'Professional monitoring market charts on three trading monitors', 'AlphaTradeZone'),
  screens: p(5833747, 'graphs-and-charts-on-the-monitors', 'Multiple market analysis monitors in a trading workspace', 'AlphaTradeZone'),
  desk: p(5833752, 'person-typing-on-a-keyboard-with-charts-on-the-monitors', 'Trading workstation displaying financial graphs', 'AlphaTradeZone'),
  analyst: p(5831253, 'trader-looking-at-charts-in-the-monitors', 'Analyst watching financial trading displays', 'AlphaTradeZone'),
  trader: p(5831259, 'a-man-using-a-computer-with-multiple-displays', 'Financial professional at a multi-monitor workstation', 'AlphaTradeZone'),
  pointing: p(5833757, 'pointing-on-a-graph-in-a-monitor', 'Market analytics graph discussed on a computer display', 'AlphaTradeZone'),
  tradeTeam: p(5831343, 'men-analyzing-the-line-graph-on-the-monitor-of-a-computer', 'Two market professionals reviewing charts on several screens', 'AlphaTradeZone'),
  markets: p(8353775, 'stock-market-data-display-on-computer-monitor', 'Business professional studying financial data on monitor', 'Kampus Production'),
  tradingOffice: p(8204311, 'computer-monitor-with-stock-exchange-figures-in-an-office', 'Team working in an office with financial monitors', 'Kampus Production'),
  crm: p(7691740, 'man-talking-on-phone-and-working', 'Business operator reviewing charts and calling a colleague', 'Yan Krukau'),
  laptopMarket: p(7691661, 'person-using-smartphone-and-laptop', 'Laptop and mobile device showing financial market analysis', 'Yan Krukau'),
  phoneCharts: p(6772077, 'person-using-smartphone-and-laptop', 'Mobile and laptop screens displaying market information', 'Alesia Kozik'),
  phoneTrading: p(7567228, 'a-person-holding-a-smartphone', 'Phone displaying stock data beside a market analysis laptop', 'Tima Miroshnichenko'),
  mobileForex: p(28504953, 'stock-market-analysis-on-mobile-and-laptop', 'Trading app being used alongside a laptop', 'StockRadars Co.'),
  phoneMarket: p(6802042, 'photo-of-person-holding-smartphone', 'Mobile device and computer displaying market data', 'Hanna Pad'),
  banking: p(6802048, 'marketing-businessman-person-hands', 'Person viewing a finance chart on laptop and phone', 'Hanna Pad'),
  financialDesk: p(6801649, 'marketing-person-laptop-technology', 'Laptop and financial documents laid out on a desk', 'Hanna Pad'),
  modernServers: p(37730212, 'data-center-server-racks-with-active-equipment', 'Modern server racks powering digital infrastructure', 'panumas nikhomkhai'),
  dataCenter: p(4508751, 'server-racks-on-data-center', 'Long aisle of racks in a professional data center', 'Brett Sayles'),
  serverCables: p(5480781, 'server-racks-on-data-center', 'Server rack cabinets with organized networking cables', 'Brett Sayles'),
  serverRows: p(5408005, 'server-racks-on-data-center', 'Network racks in a working data center', 'Brett Sayles'),
  blackServers: p(5203849, 'black-server-racks', 'Close-up of network server cabinets in data center', 'Brett Sayles'),
  network: p(6466141, 'network-servers-on-an-enclosure', 'Networking hardware and patch cables inside server rack', 'Sergei Starostin'),
  team: p(3183186, 'photo-of-people-having-meeting', 'Business technology team collaborating around a meeting table', 'fauxels'),
  meeting: p(5716018, 'a-group-of-people-working-together-looking-at-a-laptop', 'Colleagues reviewing a project together on a laptop', 'Artem Podrez'),
  colleagues: p(4339794, 'colleagues-looking-on-laptop-together', 'Office colleagues discussing technical work at laptop', 'Edmond Dantès'),
  strategy: p(6285079, 'men-in-an-office-discussing-graphs-on-a-laptop', 'Business analysts discussing charts and planning', 'Gustavo Fring'),
  metricsMeeting: p(7857566, 'laptop-and-papers-of-employees-during-a-meeting', 'Team meeting with financial documents and laptop', 'Kampus Production'),
  businessMeeting: p(7693683, 'using-laptop-in-a-business-meeting', 'Business planning meeting featuring laptop analytics', 'Yan Krukau'),
  meetingBoard: p(5324934, 'bald-woman-explaining-charts-to-colleagues', 'Manager presenting charts at a team meeting', 'Anna Shvets'),
  codeLaptop: p(5926382, 'crop-faceless-developer-working-on-software-code-on-laptop', 'Software developer typing code on a laptop', 'Sora Shimazaki'),
  codeOffice: p(4078343, 'person-using-black-dell-laptop-computer', 'Programmer working on a laptop in an office', 'Mario Amé'),
  codeMonitor: p(3888149, 'opened-program-for-working-online-on-laptop', 'Programming software displayed on a laptop in modern office', 'Rodrigo Santos'),
  developer: p(6424588, 'computer-program-on-the-monitor', 'Code displayed on screen during software development', 'Nemuel Sereti'),
  devTeam: p(12899153, 'back-view-of-people-working-in-a-team-on-a-code', 'Developers reviewing programming work together', 'Mizuno K'),
  paymentLaptop: p(29205862, 'online-shopping-with-credit-card-and-laptop', 'Bank card being used next to laptop for a digital payment', 'Sadi Hockmuller'),
  paymentCard: p(5926243, 'credit-card-in-wallet-and-laptop-on-desk', 'Online payment card beside laptop', 'Sora Shimazaki'),
  terminal: p(4393427, 'close-up-of-paying-with-card', 'Card payment being processed at a contactless terminal', 'Norma Mortenson'),
  phonePayment: p(7561698, 'hand-with-cellphone-over-payment-terminal', 'Smartphone being used for a contactless payment', 'SHVETS production'),
  support: p(8867267, 'call-center-agent-working', 'Customer support team working on computers', 'Yan Krukau'),
  supportTeam: p(5453841, 'people-working-in-the-office', 'Customer care representatives working at their desks', 'Tima Miroshnichenko'),
  supportDesk: p(7709245, 'side-view-of-a-woman-working-on-her-laptop', 'Customer service professional using a headset and laptop', 'MART PRODUCTION'),
  supportLead: p(7709291, 'woman-with-black-headset-and-mouthpiece-sitting-in-front-of-laptop', 'Support consultant handling an inquiry on laptop', 'MART PRODUCTION'),
} as const;

export type PhotoKey = keyof typeof pexels;

/** Four DIFFERENT context-specific actual photographs for every service page. */
export const pagePhotoKeys: Record<string, readonly [PhotoKey, PhotoKey, PhotoKey, PhotoKey]> = {
  'brokerage-setup': ['team', 'strategy', 'tradeTeam', 'dataCenter'],
  'kyc-aml-integration': ['supportLead', 'codeLaptop', 'supportTeam', 'phoneCharts'],
  'how-it-works': ['meeting', 'strategy', 'devTeam', 'serverRows'],
  'forex-broker-hosting': ['dataCenter', 'network', 'serverCables', 'blackServers'],
  'forex-liquidity-connectivity': ['tradeTeam', 'screens', 'analyst', 'pointing'],
  'forex-turnkey-solution': ['team', 'tradingOffice', 'dataCenter', 'support'],
  'forex-white-label': ['mt5', 'colleagues', 'dataCenter', 'tradeTeam'],
  'mt4-grey-label': ['trader', 'desk', 'markets', 'strategy'],
  'mt4-white-label': ['screens', 'tradeTeam', 'trader', 'serverRows'],
  'mt5-grey-label': ['analyst', 'tradingOffice', 'screens', 'network'],
  'mt5-white-label': ['mt5', 'desk', 'tradingOffice', 'dataCenter'],
  'start-a-forex-brokerage': ['team', 'strategy', 'trader', 'serverRows'],
  'forex-broker-website': ['codeLaptop', 'codeOffice', 'colleagues', 'devTeam'],
  'forex-crm': ['crm', 'support', 'metricsMeeting', 'tradingOffice'],
  'forex-manager-api': ['codeMonitor', 'developer', 'screens', 'network'],
  'mobile-trading-app': ['mobileForex', 'phoneCharts', 'phoneTrading', 'phoneMarket'],
  'pamm-mam': ['financialDesk', 'strategy', 'markets', 'analyst'],
  'payment-gateway-integration': ['paymentLaptop', 'terminal', 'phonePayment', 'paymentCard'],
  'prop-firm-crm-api': ['trader', 'tradeTeam', 'codeLaptop', 'markets'],
  'web-trading-platform': ['desk', 'codeOffice', 'screens', 'phoneCharts'],
  'about-us': ['team', 'colleagues', 'metricsMeeting', 'businessMeeting'],
  'contact': ['supportLead', 'supportTeam', 'meeting', 'supportDesk'],
  'faq': ['support', 'supportDesk', 'strategy', 'colleagues'],
  'portfolio': ['tradingOffice', 'dataCenter', 'devTeam', 'team'],
  'technology': ['network', 'serverRows', 'developer', 'screens'],
};

export function getPagePhotos(slug: string): EditorialPhoto[] {
  const keys = pagePhotoKeys[slug] || pagePhotoKeys.technology;
  return keys.map((key) => pexels[key]);
}


/**
 * Two additional context-specific choices per page.
 * The first of the six photographs is used as hero imagery; the other five
 * become a varied editorial gallery. Attribution records remain in code.
 */
const extraPhotoKeys: Record<string, readonly [PhotoKey, PhotoKey]> = {
  'brokerage-setup': ['codeOffice','markets'],
  'kyc-aml-integration': ['businessMeeting','metricsMeeting'],
  'how-it-works': ['codeLaptop','team'],
  'forex-broker-hosting': ['serverRows','modernServers'],
  'forex-liquidity-connectivity': ['tradingOffice','markets'],
  'forex-turnkey-solution': ['codeLaptop','tradeTeam'],
  'forex-white-label': ['phoneCharts','strategy'],
  'mt4-grey-label': ['tradingOffice','pointing'],
  'mt4-white-label': ['mt5','pointing'],
  'mt5-grey-label': ['desk','phoneTrading'],
  'mt5-white-label': ['trader','analyst'],
  'start-a-forex-brokerage': ['metricsMeeting','codeOffice'],
  'forex-broker-website': ['codeMonitor','meeting'],
  'forex-crm': ['supportTeam','businessMeeting'],
  'forex-manager-api': ['codeLaptop','devTeam'],
  'mobile-trading-app': ['banking','phonePayment'],
  'pamm-mam': ['screens','pointing'],
  'payment-gateway-integration': ['banking','phoneCharts'],
  'prop-firm-crm-api': ['screens','strategy'],
  'web-trading-platform': ['mt5','analyst'],
  'about-us': ['supportDesk','codeOffice'],
  'contact': ['businessMeeting','team'],
  'faq': ['meetingBoard','supportTeam'],
  'portfolio': ['codeOffice','metricsMeeting'],
  'technology': ['codeMonitor','devTeam'],
};

export function getExpandedPagePhotos(slug: string): EditorialPhoto[] {
  const originals = pagePhotoKeys[slug] || pagePhotoKeys.technology;
  const additions = extraPhotoKeys[slug] || extraPhotoKeys.technology;
  const uniqueKeys = [...new Set([...originals, ...additions])];
  return uniqueKeys.map(key => pexels[key]);
}
