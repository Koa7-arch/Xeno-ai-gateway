// XENO Mobile v0.6 — bounded deterministic tools and approval-only action proposals.
// No eval, arbitrary URLs, shell commands, or external side effects.
export const TOOL_SCHEMAS = [
  {type:'function', function:{name:'calculate',description:'Perform precise basic arithmetic using two numbers. Use for pay and other numeric calculations; no tax assumptions.',parameters:{type:'object',additionalProperties:false,properties:{operation:{type:'string',enum:['add','subtract','multiply','divide','percentage']},a:{type:'number'},b:{type:'number'}},required:['operation','a','b']}}},
  {type:'function', function:{name:'convert_units',description:'Convert one value between supported units (length, mass, volume, pressure, and temperature).',parameters:{type:'object',additionalProperties:false,properties:{value:{type:'number'},from:{type:'string',enum:['mi','km','ft','m','in','cm','lb','kg','gal','L','psi','kPa','F','C']},to:{type:'string',enum:['mi','km','ft','m','in','cm','lb','kg','gal','L','psi','kPa','F','C']}},required:['value','from','to']}}},
  {type:'function', function:{name:'date_difference',description:'Compute the number of days between two calendar dates in YYYY-MM-DD format (timezone-independent).',parameters:{type:'object',additionalProperties:false,properties:{start:{type:'string'},end:{type:'string'}},required:['start','end']}}},
  {type:'function', function:{name:'propose_task',description:'Prepare a proposed task for user review. Does NOT create or save a task; user must explicitly approve it.',parameters:{type:'object',additionalProperties:false,properties:{title:{type:'string'},notes:{type:'string'}},required:['title']}}}
];
const finite = value => typeof value==='number' && Number.isFinite(value) && Math.abs(value)<=1e12;
const round = n => Number(n.toPrecision(12));
function failure(message){ return {error: message}; }
export function runTool(name,args){
  if(!args || typeof args!=='object' || Array.isArray(args)) return failure('Invalid tool arguments');
  if(name==='calculate'){
    const {operation,a,b}=args;
    if(!finite(a)||!finite(b)||!['add','subtract','multiply','divide','percentage'].includes(operation))return failure('Invalid calculation');
    if((operation==='divide'||operation==='percentage')&&b===0)return failure('Division by zero');
    const value=({add:()=>a+b,subtract:()=>a-b,multiply:()=>a*b,divide:()=>a/b,percentage:()=>a/b*100})[operation]();
    if(!Number.isFinite(value)||Math.abs(value)>1e15)return failure('Result outside supported range');
    return {value:round(value),unit:operation==='percentage'?'%':null,expression:`${a} ${({add:'+',subtract:'−',multiply:'×',divide:'÷',percentage:'÷'})[operation]} ${b}${operation==='percentage'?' × 100':''}`};
  }
  if(name==='convert_units'){
    const {value,from,to}=args;
    if(!finite(value))return failure('Invalid value');
    const units={mi:['length',1609.344],km:['length',1000],ft:['length',.3048],m:['length',1],in:['length',.0254],cm:['length',.01],lb:['mass',.45359237],kg:['mass',1],gal:['volume',3.785411784],L:['volume',1],psi:['pressure',6.894757293168],kPa:['pressure',1],F:['temp',0],C:['temp',0]};
    if(!Object.hasOwn(units,from)||!Object.hasOwn(units,to)||units[from][0]!==units[to][0])return failure('Unsupported conversion');
    let result;
    if(from===to)result=value;
    else if(units[from][0]==='temp')result=from==='F'?(value-32)*5/9:value*9/5+32;
    else result=value*units[from][1]/units[to][1];
    if(!Number.isFinite(result)||Math.abs(result)>1e15)return failure('Result outside supported range');
    return {value:round(result),from,to,input:value};
  }
  if(name==='date_difference'){
    const parse=s=>{
      if(typeof s!=='string'||!/^(\d{4})-(\d{2})-(\d{2})$/.test(s))return null;
      const [y,m,d]=s.split('-').map(Number);const time=Date.UTC(y,m-1,d);const dt=new Date(time);
      return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d?time:null;
    };
    const a=parse(args.start),b=parse(args.end);
    if(a===null||b===null)return failure('Use valid dates in YYYY-MM-DD format');
    const days=Math.round((b-a)/86400000);
    if(Math.abs(days)>365000)return failure('Date range too large');
    return {days,absoluteDays:Math.abs(days),start:args.start,end:args.end};
  }
  if(name==='propose_task'){
    if(typeof args.title!=='string'||!args.title.trim()||args.title.length>120|| (args.notes!==undefined&&(typeof args.notes!=='string'||args.notes.length>500)))return failure('Invalid task proposal');
    return {proposal:{id:crypto.randomUUID(),type:'create_task',title:args.title.trim(),notes:(args.notes||'').trim(),status:'pending'},message:'Proposal prepared only. Task was NOT saved and requires user approval in the Tools workspace.'};
  }
  return failure('Unknown or disallowed tool');
}

export function validateToolRequest(method,request,url){
  if(method!=='POST')return {error:'Method not allowed',status:405};
  if(request.headers.get('Origin')!==url.origin)return {error:'Origin not allowed',status:403};
  if(!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json'))return {error:'Expected JSON',status:415};
  return null;
}

// Only these deterministic tools may be called directly from the workspace.
export const DIRECT_TOOLS = new Set(['calculate','convert_units','date_difference']);
