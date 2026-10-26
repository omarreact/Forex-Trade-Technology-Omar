type StoryVisual={image:string;eyebrow:string;nodes:[string,string,string];icons:[string,string,string]};
export const stories:Record<string,StoryVisual>={
 'brokerage-setup':{image:'meeting',eyebrow:'BROKERAGE LAUNCH',nodes:['Planning','Trading platform','Connected operations'],icons:['check','server','link']},
 'mt5-white-label':{image:'trading_desk',eyebrow:'YOUR BRANDED ENVIRONMENT',nodes:['Branded terminals','MT5 groups','Liquidity link'],icons:['layers','settings','link']},
 hosting:{image:'data_center',eyebrow:'TRADING INFRASTRUCTURE',nodes:['Trade servers','Active monitoring','Recovery planning'],icons:['server','shield','database']},
 liquidity:{image:'network',eyebrow:'EXECUTION CONNECTIVITY',nodes:['Trading platform','Bridge / FIX','Liquidity providers'],icons:['server','link','globe']},
 crm:{image:'crm_team',eyebrow:'CONNECTED CLIENT LIFECYCLE',nodes:['Onboarding','CRM & KYC','MT5 accounts'],icons:['users','shield','server']},
 'kyc-aml':{image:'identity',eyebrow:'VERIFICATION WORKFLOW',nodes:['Client documents','Verification','Review history'],icons:['users','shield','database']},
 payments:{image:'payments',eyebrow:'PAYMENT OPERATIONS',nodes:['Client portal','Provider status','Reconciliation'],icons:['users','link','database']},
 'prop-firm':{image:'prop_desk',eyebrow:'PROP TRADING OPERATIONS',nodes:['Challenges','Rule monitoring','Progression'],icons:['layers','shield','check']},
 'how-it-works':{image:'checklist',eyebrow:'DELIVERY PROCESS',nodes:['Consultation','Integration','Launch support'],icons:['users','settings','support']},
 about:{image:'collaboration',eyebrow:'HOW WE WORK',nodes:['Understand','Connect','Support'],icons:['users','link','support']},
 contact:{image:'contact_desk',eyebrow:'START A CONVERSATION',nodes:['Your enquiry','Technical review','Next steps'],icons:['message','server','check']},
 home:{image:'network',eyebrow:'CONNECTED TECHNOLOGY',nodes:['Platform','Operations','Liquidity'],icons:['server','layers','link']},
 faq:{image:'support',eyebrow:'BROKERAGE GUIDANCE',nodes:['Find answers','Review options','Talk to us'],icons:['message','check','support']}
};

