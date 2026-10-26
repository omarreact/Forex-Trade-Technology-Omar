import {getPage} from '@/content';
import {pageMetadata} from '@/lib/seo';
import {FrontPage} from '@/templates';
const page=getPage('/')!;
export const metadata=pageMetadata(page);
export default function Home(){return <FrontPage page={page}/>;}
