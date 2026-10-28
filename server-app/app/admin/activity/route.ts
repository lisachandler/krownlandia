import {env} from 'cloudflare:workers';
import {activityResponse} from '../../../activity-log.mjs';
import records from '../../../build-history.json';
export const dynamic='force-dynamic';
export function GET(request:Request){return activityResponse(request,env,records);}
