/* XENO Mobile v0.6 — additive Tools & Actions workspace. No third-party dependencies. */
(() => {
  'use strict';
  const CHATS_KEY='xeno-mobile-chats-v04';
  const TASKS_KEY='xeno-mobile-tasks-v06';
  const $=id=>document.getElementById(id);
  const nav=$('profileButton')?.parentElement;
  const shell=document.querySelector('.shell');
  if(!nav||!shell)return;
  const toolsButton=document.createElement('button');
  toolsButton.id='toolsButton';toolsButton.type='button';toolsButton.className='secondary';toolsButton.textContent='Tools';
  nav.insertBefore(toolsButton,$('profileButton'));
  const view=document.createElement('main');view.id='toolsView';view.className='view hidden';
  // Static, developer-owned markup only. User content is always inserted with textContent.
  view.innerHTML=`<div class="tools-head"><div><div class="tools-kicker">XENO / v0.6</div><h2>Tools &amp; Actions</h2><p>Useful operations. Controlled actions. Verified results.</p></div><button type="button" class="secondary" id="toolsBack">Back to chat</button></div>
    <div class="tools-grid">
      <section class="tools-card"><h3>⊞ Calculator</h3><p>Arithmetic with results calculated by the Worker.</p><form id="toolCalc"><label for="calcOp">Operation</label><select id="calcOp"><option value="add">Add</option><option value="subtract">Subtract</option><option value="multiply">Multiply</option><option value="divide">Divide</option><option value="percentage">A as % of B</option></select><div class="tools-pair"><div><label for="calcA">First number</label><input id="calcA" type="number" step="any" required value="65"></div><div><label for="calcB">Second number</label><input id="calcB" type="number" step="any" required value="15"></div></div><button type="submit">Calculate</button></form><output id="calcResult" class="tools-result" aria-live="polite" hidden></output></section>
      <section class="tools-card"><h3>⇄ Unit conversion</h3><p>Distance, mass, volume, pressure, or temperature.</p><form id="toolConvert"><label for="convertValue">Value</label><input id="convertValue" type="number" step="any" required value="100"><div class="tools-pair"><div><label for="convertFrom">From</label><select id="convertFrom"></select></div><div><label for="convertTo">To</label><select id="convertTo"></select></div></div><button type="submit">Convert</button></form><output id="convertResult" class="tools-result" aria-live="polite" hidden></output></section>
      <section class="tools-card"><h3>▦ Date difference</h3><p>Calendar-day difference between two dates.</p><form id="toolDates"><div class="tools-pair"><div><label for="dateStart">Start date</label><input id="dateStart" type="date" required></div><div><label for="dateEnd">End date</label><input id="dateEnd" type="date" required></div></div><button type="submit">Count days</button></form><output id="dateResult" class="tools-result" aria-live="polite" hidden></output></section>
      <section class="tools-card"><h3>▣ Task creation</h3><p>Tasks are stored locally on this device. No notifications or outside actions.</p><form id="toolTask"><label for="taskTitle">Task</label><input id="taskTitle" maxlength="120" placeholder="Review paycheck" required><label for="taskNotes">Notes (optional)</label><textarea id="taskNotes" maxlength="500" placeholder="Optional details"></textarea><button type="submit">Create task</button></form><output id="taskResult" class="tools-result" aria-live="polite" hidden></output></section>
      <section class="tools-card tools-card-wide"><h3>Pending action approvals <span id="proposalCount" class="tools-count" hidden>0</span></h3><p>AI-suggested tasks are proposals, never automatically saved. Review each one here.</p><div id="toolProposals"></div></section>
      <section class="tools-card tools-card-wide"><h3>My tasks</h3><div id="toolTaskList"></div></section>
    </div><p class="tools-footer">Protected by the existing XENO login. Utility requests use your authenticated Worker; tasks and approvals remain on this device. No additional subscriptions required.</p>`;
  shell.append(view);
  const link=document.createElement('link');link.rel='stylesheet';link.href='./tools-v06.css';document.head.append(link);
  const now=new Date();const today=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);$('dateStart').value=today;$('dateEnd').value=today;
  const groups={Length:['mi','km','ft','m','in','cm'],Mass:['lb','kg'],Volume:['gal','L'],Pressure:['psi','kPa'],Temperature:['F','C']};
  for(const select of [$('convertFrom'),$('convertTo')]){
    for(const [group,units] of Object.entries(groups)){
      const optgroup=document.createElement('optgroup');optgroup.label=group;
      for(const unit of units){const option=document.createElement('option');option.value=unit;option.textContent=unit;optgroup.append(option)}
      select.append(optgroup);
    }
  }
  $('convertFrom').value='mi';$('convertTo').value='km';
  function showTools(){
    // Preserve the existing unsaved-profile protection through its own navigation handler.
    if(!$('profileView').classList.contains('hidden')){
      $('backToChat').click();
      if(!$('profileView').classList.contains('hidden'))return;
    }
    for(const id of ['chatView','conversationsView','profileView'])$(id).classList.add('hidden');
    $('form').classList.add('hidden');$('settings').classList.add('hidden');view.classList.remove('hidden');
    renderAll();window.scrollTo(0,0);
  }
  function closeTools(){view.classList.add('hidden')}
  toolsButton.addEventListener('click',showTools);
  for(const id of ['chatsButton','profileButton','backToChat','newChatButton'])$(id)?.addEventListener('click',()=>{
    if(id==='chatsButton'||id==='profileButton'||id==='backToChat'||id==='newChatButton')closeTools();
  });
  $('toolsBack').addEventListener('click',()=>{$('chatsButton').click(); // restore existing conversation through native navigation
    // Conversations page is used only momentarily to restore the existing chat renderer.
    const active=(()=>{try{const s=JSON.parse(localStorage.getItem(CHATS_KEY)||'null');return s?.activeId}catch{return null}})();
    if(active){const buttons=[...document.querySelectorAll('#conversationList .chat-open')];const currentButton=buttons.find(b=>b.closest('.chat-item')?.classList.contains('active'));if(currentButton){currentButton.click();return}}
    // If no active row is present, leave the conversations list visible instead of creating an unwanted chat.
  });
  function readTasks(){try{const data=JSON.parse(localStorage.getItem(TASKS_KEY)||'[]');return Array.isArray(data)?data.filter(t=>t&&typeof t.id==='string'&&typeof t.title==='string').slice(0,1000):[]}catch{return []}}
  function writeTasks(tasks){try{localStorage.setItem(TASKS_KEY,JSON.stringify(tasks));return true}catch{alert('Local storage unavailable. Task was not saved.');return false}}
  function chatState(){try{const state=JSON.parse(localStorage.getItem(CHATS_KEY)||'null');return state?.version===4&&Array.isArray(state.chats)?state:null}catch{return null}}
  function saveChatState(state){try{localStorage.setItem(CHATS_KEY,JSON.stringify(state));return true}catch{alert('Unable to save the approval change.');return false}}
  function currentProposals(){const state=chatState();const items=[];for(const chat of state?.chats||[]){if(!Array.isArray(chat.proposals))continue;for(const proposal of chat.proposals){if(proposal?.type==='create_task'&&proposal.status==='pending'&&typeof proposal.title==='string'&&proposal.title.length<=120)items.push({chatId:chat.id,chatTitle:chat.title,proposal})}}return items}
  function setResult(id,message){const el=$(id);el.textContent=message;el.hidden=false}
  async function callTool(tool,args){const response=await fetch('/tools/run',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool,args})});const payload=await response.json();if(!response.ok||payload.result?.error)throw Error(payload.error||payload.result?.error||'Tool execution failed');return payload.result}
  $('toolCalc').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;try{const a=Number($('calcA').value),b=Number($('calcB').value);const r=await callTool('calculate',{operation:$('calcOp').value,a,b});setResult('calcResult',`${r.expression} = ${r.value}${r.unit||''}`)}catch(err){setResult('calcResult',`Error: ${err.message}`)}finally{button.disabled=false}});
  $('toolConvert').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;try{const r=await callTool('convert_units',{value:Number($('convertValue').value),from:$('convertFrom').value,to:$('convertTo').value});setResult('convertResult',`${r.input} ${r.from} = ${r.value} ${r.to}`)}catch(err){setResult('convertResult',`Error: ${err.message}`)}finally{button.disabled=false}});
  $('toolDates').addEventListener('submit',async e=>{e.preventDefault();const button=e.currentTarget.querySelector('button');button.disabled=true;try{const r=await callTool('date_difference',{start:$('dateStart').value,end:$('dateEnd').value});setResult('dateResult',`${r.days} calendar days (${r.absoluteDays} days apart)`)}catch(err){setResult('dateResult',`Error: ${err.message}`)}finally{button.disabled=false}});
  function addTask(title,notes,sourceProposalId){const tasks=readTasks();if(tasks.length>=1000){alert('Task limit reached. Remove an old task first.');return false}if(sourceProposalId&&tasks.some(t=>t.sourceProposalId===sourceProposalId))return true;const task={id:crypto.randomUUID(),title,notes,done:false,createdAt:new Date().toISOString(),sourceProposalId:sourceProposalId||null};return writeTasks([...tasks,task])}
  $('toolTask').addEventListener('submit',e=>{e.preventDefault();const title=$('taskTitle').value.trim(),notes=$('taskNotes').value.trim();if(!title||title.length>120||notes.length>500)return;if(!addTask(title,notes,null))return;e.currentTarget.reset();setResult('taskResult','Task created and saved on this device.');renderAll()});
  function btn(text,callback,secondary=true){const b=document.createElement('button');b.type='button';b.textContent=text;if(secondary)b.className='secondary';b.addEventListener('click',callback);return b}
  function renderTasks(){const host=$('toolTaskList');host.replaceChildren();const tasks=readTasks();if(!tasks.length){const p=document.createElement('div');p.className='tools-empty';p.textContent='No tasks yet.';host.append(p);return}
    for(const t of tasks.slice().reverse()){
      const row=document.createElement('div');row.className='tools-task'+(t.done?' tools-done':'');const title=document.createElement('strong');title.textContent=t.title;row.append(title);
      if(t.notes){const detail=document.createElement('small');detail.textContent=t.notes;row.append(detail)}
      const controls=document.createElement('div');controls.className='tools-controls';controls.append(btn(t.done?'Mark active':'Mark complete',()=>{const next=readTasks();const task=next.find(x=>x.id===t.id);if(!task)return;task.done=!task.done;if(writeTasks(next))renderAll()}),btn('Delete',()=>{if(!confirm(`Delete task "${t.title}"?`))return;const next=readTasks().filter(x=>x.id!==t.id);if(writeTasks(next))renderAll()}));row.append(controls);host.append(row);
    }
  }
  function markProposal(chatId,proposalId,status){return typeof window.xenoV06UpdateProposal==='function' && window.xenoV06UpdateProposal(chatId,proposalId,status)}
  function renderProposals(){const host=$('toolProposals');host.replaceChildren();const proposals=currentProposals();const count=$('proposalCount');count.hidden=!proposals.length;count.textContent=String(proposals.length);
    if(!proposals.length){const p=document.createElement('div');p.className='tools-empty';p.textContent='No pending AI action proposals.';host.append(p);return}
    for(const {chatId,chatTitle,proposal} of proposals){const item=document.createElement('div');item.className='tools-proposal';const title=document.createElement('strong');title.textContent=proposal.title;item.append(title);if(proposal.notes){const notes=document.createElement('small');notes.textContent=proposal.notes;item.append(notes)}const source=document.createElement('small');source.textContent=`From conversation: ${chatTitle||'Untitled'}`;item.append(source);const controls=document.createElement('div');controls.className='tools-controls';controls.append(btn('Approve & create',()=>{if(!confirm(`Create task "${proposal.title}" on this device?`))return;if(!addTask(proposal.title,proposal.notes||'',proposal.id))return;if(markProposal(chatId,proposal.id,'approved'))renderAll();else alert('Task was saved, but approval tracking could not be updated. Review your tasks before retrying.');},false),btn('Reject',()=>{if(markProposal(chatId,proposal.id,'rejected'))renderAll()}));item.append(controls);host.append(item)}
  }
  function renderAll(){renderTasks();renderProposals()}
  window.addEventListener('xeno:chat-updated',renderProposals);
  window.addEventListener('storage',e=>{if(e.key===CHATS_KEY||e.key===TASKS_KEY)renderAll()});
  renderAll();
})();
