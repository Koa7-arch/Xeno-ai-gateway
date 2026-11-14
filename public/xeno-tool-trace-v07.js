/* XENO v0.7 phase 1: display backend-confirmed tool executions. */
(()=>{'use strict';
const KEY='xeno-tool-traces-v07';
const CHAT_KEY='xeno-mobile-chats-v04';
const area=document.getElementById('messages');
if(!area)return;
const originalFetch=window.fetch.bind(window);
const allowed=new Set(['calculate','convert_units','date_difference','propose_task']);
let latest=null;
function active(){try{const s=JSON.parse(localStorage.getItem(CHAT_KEY)||'null');return s?.activeId||null}catch{return null}}
function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
function render(){
  area.querySelectorAll('.x-trace').forEach(el=>el.remove());
  const chat=active();if(!chat)return;
  const all=read();const record=all[chat];
  if(!record||!Array.isArray(record.calls)||!record.calls.length)return;
  const bubbles=[...area.querySelectorAll('.bubble:not(.user)')];
  const last=bubbles[bubbles.length-1];if(!last)return;
  // The latest trace belongs only to the matching latest assistant reply.
  if(record.reply!==last.textContent)return;
  const panel=document.createElement('details');panel.className='x-trace';
  const summary=document.createElement('summary');summary.textContent=`Verified tool activity · ${record.calls.length} call${record.calls.length===1?'':'s'}`;
  panel.append(summary);
  for(const call of record.calls){const line=document.createElement('div');line.className='x-trace-line';
    const name=document.createElement('strong');name.textContent=call.tool;
    const status=document.createElement('span');status.textContent=call.success?'Executed':'Failed';status.className=call.success?'x-trace-ok':'x-trace-error';
    const detail=document.createElement('small');detail.textContent=call.description||'';
    line.append(name,status,detail);panel.append(line);
  }
  last.after(panel);
}
window.fetch=async function(resource,options){
  const response=await originalFetch(resource,options);
  let path='';try{path=new URL(typeof resource==='string'?resource:resource.url,location.href).pathname}catch{}
  if(path==='/chat'&&response.ok){
    try{const data=await response.clone().json();
      if(typeof data.reply==='string'){
        const chat=active();if(chat){const all=read();
          const calls=Array.isArray(data.toolActivity)?data.toolActivity.filter(c=>c&&allowed.has(c.tool)&&typeof c.success==='boolean').slice(0,3).map(c=>({tool:c.tool,success:c.success,description:String(c.description||'').slice(0,160)})):[];
          all[chat]={reply:data.reply,calls};
          const entries=Object.entries(all).slice(-100);localStorage.setItem(KEY,JSON.stringify(Object.fromEntries(entries)));
          latest=chat;
        }
      }
    }catch{} // Trace storage must never interrupt AI responses.
  }
  return response;
};
const observer=new MutationObserver(()=>{observer.disconnect();render();observer.observe(area,{childList:true});});
observer.observe(area,{childList:true});
window.addEventListener('storage',e=>{if(e.key===KEY||e.key===CHAT_KEY)render()});
render();
})();
