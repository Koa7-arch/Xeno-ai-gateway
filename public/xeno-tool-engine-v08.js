/* XENO v0.8 — read-only tool catalog and engine diagnostics. */
(()=>{'use strict';
const tools=document.getElementById('toolsView');if(!tools)return;
const host=document.createElement('section');host.className='tools-card tools-card-wide';host.id='xenoEngine08';
const title=document.createElement('h3');title.textContent='AI Tool Engine · v0.8';
const status=document.createElement('p');status.textContent='Checking available AI-callable tools…';
const list=document.createElement('div');list.setAttribute('aria-live','polite');
const refresh=document.createElement('button');refresh.type='button';refresh.className='secondary';refresh.textContent='Refresh tool catalog';
host.append(title,status,refresh,list);tools.querySelector('.tools-grid')?.prepend(host);
async function load(){refresh.disabled=true;try{const response=await fetch('/tools/catalog',{cache:'no-store',credentials:'same-origin'});if(!response.ok)throw Error('Catalog unavailable');const data=await response.json();status.textContent=`${data.tools.length} AI-callable tools · up to ${data.limits.maxCalls} calls per request · ${data.limits.maxRounds} rounds. No external integrations.`;list.replaceChildren();for(const tool of data.tools){const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=tool.name;const detail=document.createElement('small');detail.textContent=` — ${tool.approvalRequired?'Approval proposal only':tool.direct?'Available in Tools and AI chat':'AI chat only'}. ${tool.description}`;p.append(strong,detail);list.append(p)}}catch(e){status.textContent='Tool catalog could not be loaded. Confirm the v0.8 Worker is deployed.';list.replaceChildren()}finally{refresh.disabled=false}}
refresh.addEventListener('click',load);load();
})();
