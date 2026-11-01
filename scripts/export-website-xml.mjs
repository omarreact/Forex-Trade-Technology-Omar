#!/usr/bin/env node
/** Existing npm export:xml command now regenerates native WordPress WXR and locked source theme. */
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const python=process.env.PYTHON || (process.platform==='win32'?'python':'python3');
const call=spawnSync(python,[path.join(root,'scripts/build-fse-locked.py'),'--repo',root,'--theme-dir','wordpress/forex-trade-technology','--wxr-path','website.xml','--strict-assets'],{stdio:'inherit'});
if(call.error)throw call.error;
if(call.status!==0)process.exit(call.status||1);
