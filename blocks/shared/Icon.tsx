import { ArrowUpRight,ArrowRight,ArrowUp,Check,ChevronLeft,ChevronRight,ChevronDown,Layers3,Link2,Menu,X,MessageCircle,Server,Settings2,ShieldCheck,Users,Zap,Wallet,Building2,Globe2,Headphones,Shield,Database, type LucideProps } from 'lucide-react';
const icons:Record<string,React.ComponentType<LucideProps>>={
 arrowUpRight:ArrowUpRight,'arrow-up-right':ArrowUpRight,arrowUp:ArrowUp,'arrow-up':ArrowUp,arrowRight:ArrowRight,
 check:Check,'check-circle':Check,chevronDown:ChevronDown,chevronLeft:ChevronLeft,chevronRight:ChevronRight,layers:Layers3,link:Link2,menu:Menu,x:X,message:MessageCircle,server:Server,
 settings:Settings2,shield:ShieldCheck,'shield-check':ShieldCheck,users:Users,zap:Zap,payments:Wallet,building:Building2,
 globe:Globe2,support:Headphones,database:Database,security:Shield
};
export function Icon({name,className,size=19,...props}:LucideProps & {name?:string}){
 const Component=icons[name||'']||ArrowUpRight;
 return <Component aria-hidden="true" size={size} className={className} strokeWidth={1.9} {...props}/>;
}
