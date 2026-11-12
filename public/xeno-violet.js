/* XENO v0.6 violet UI. Preserves the existing chat/profile/tool handlers and storage keys. */
(()=>{'use strict';
const $=id=>document.getElementById(id);
const shell=document.querySelector('.shell');
const chat=$('chatView'),tools=$('toolsView'),convos=$('conversationsView'),profile=$('profileView'),dock=$('form');
if(!shell||!chat||!tools||!convos||!profile||!dock)return;
const HOME='xeno-mobile-violet-today-v1',TASKS='xeno-mobile-tasks-v06';
// Consistent inline SVG icons; no external fonts or requests.
const iconPaths={
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
 chat:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z"/>',
 tools:'<path d="M12 3a4 4 0 0 0 4 4l4-4a7 7 0 0 1-9 9l-7 7a2 2 0 0 1-3-3l7-7a7 7 0 0 1 9-9z" transform="translate(1 1) scale(.9)"/>',
 memory:'<path d="M12 18V5a3 3 0 0 0-5.7-1.3A4.5 4.5 0 0 0 3 11a4.5 4.5 0 0 0 3 7.8A3.5 3.5 0 0 0 12 18Zm0 0V5a3 3 0 0 1 5.7-1.3A4.5 4.5 0 0 1 21 11a4.5 4.5 0 0 1-3 7.8A3.5 3.5 0 0 1 12 18Z"/><path d="M8 8c-1.5 0-2 1-2 2m12-2c-1.5 0-2 1-2 2M8 15c1 0 2 1 2 2m6-2c-1 0-2 1-2 2"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 list:'<path d="M9 6h12M9 12h12M9 18h12M3 6l1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2"/>',
 calculator:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2"/>',
 briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 book:'<path d="M12 7c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V6c-3-1-6-1-9 1Zm0 0v14"/>',
 folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 music:'<path d="M9 18V5l12-2v13M9 18a3 2 0 1 1-6 0 3 2 0 0 1 6 0Zm12-2a3 2 0 1 1-6 0 3 2 0 0 1 6 0Z"/>',
 link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
function icon(name){return `<svg class="x-icon" viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.folder}</svg>`}
const icons={Home:'home',Chat:'chat',Tools:'tools',Memory:'memory'};
const nav=document.createElement('nav');nav.className='x-bottom';nav.setAttribute('aria-label','Main navigation');
nav.innerHTML='<div class="x-tabs">'+Object.entries(icons).map(([name,iconName])=>`<button type="button" class="x-tab" data-page="${name.toLowerCase()}"><span class="x-tab-icon" aria-hidden="true">${icon(iconName)}</span>${name}</button>`).join('')+'</div>';
document.body.append(nav);
const home=document.createElement('main');home.id='homeView';home.className='view x-page hidden';
home.innerHTML=`<div class="x-brand"><div class="x-mark" aria-hidden="true">X</div><div class="x-brand-name">XENO</div><div class="x-brand-small">MOBILE</div></div>
<section class="x-greeting"><strong id="xHello">Welcome back.</strong><p>Your command center is ready.</p></section>
<div class="x-section-head"><strong>Quick access</strong><span>v0.6.1</span></div><div class="x-shortcuts"><button class="x-shortcut" data-go="chat"><span class="x-glyph">${icon("chat")}</span><strong>Chat</strong></button><button class="x-shortcut" data-go="tools"><span class="x-glyph">${icon("tools")}</span><strong>Tools & Actions</strong></button><button class="x-shortcut" data-go="memory"><span class="x-glyph">${icon("memory")}</span><strong>Memory</strong></button><button class="x-shortcut" data-go="conversations"><span class="x-glyph">${icon("list")}</span><strong>Conversations</strong></button></div>
<div class="x-section-head"><strong>Today</strong><span id="xDate"></span></div><section class="x-card"><h3>Today's focus</h3><div id="xTodayTasks"></div><div class="x-progress"><div id="xProgress"></div></div><small id="xProgressLabel"></small></section>
<div class="x-section-head"><strong>System status</strong><span id="xSystemStatus">Checking…</span></div><section class="x-card"><div class="x-status-grid"><div><b>✓</b>Interface</div><div><b>✓</b>Local data</div><div><b id="xToolStatus">?</b>Gateway</div></div></section>`;
shell.insertBefore(home,chat);
const memory=document.createElement('main');memory.id='memoryView';memory.className='view x-page hidden';
memory.innerHTML=`<h2>Memory</h2><p class="x-subtitle">Your knowledge, context, and recall.</p><div class="x-memory-actions"><button id="xKnowledge" type="button">Knowledge</button><button type="button" disabled title="Not yet implemented">Recall · Soon</button><button type="button" disabled title="Not yet implemented">Review · Soon</button></div><p class="x-subtitle">Your existing personal profile is stored locally on this device. These categories are not a cloud knowledge database.</p><div id="xFolders"></div><section class="x-card"><h3>Memory status</h3><p class="x-subtitle">Profile Awareness controls what profile fields are shared with Groq. Conversation history remains on this device. Cloud knowledge synchronization and automated memory review are not yet available.</p><button class="secondary" id="xMemorySettings">Profile awareness settings</button></section>`;
shell.insertBefore(memory,chat);
const hero=document.createElement('div');hero.className='x-hero';hero.id='xChatHero';hero.innerHTML=`<div class="x-orb" aria-hidden="true"><span>X</span></div><h2>What's the plan?</h2><p>Plan, solve, build, or execute — I'm with you.</p><div class="x-suggestions"><button class="x-suggestion" data-prompt="Break down my next steps for today"><span>⚒</span>Break down my next steps</button><button class="x-suggestion" data-prompt="Help me plan this week's schedule"><span>▦</span>Plan this week's schedule</button><button class="x-suggestion" data-prompt="Help me study a technical topic"><span>▤</span>Help me study (CDL, work, or tech)</button><button class="x-suggestion" data-prompt="Help me review my progress and goals"><span>▥</span>Review my progress and goals</button></div>`;
chat.insertBefore(hero,$('messages'));
const categories=[['Organization','list','Schedules, tasks, and plans','task'],['Work & Field','briefcase','Equipment, CDL, technical support',null],['Finance','calculator','Calculations, budgets, paychecks','calc'],['Learning','book','Technical study and knowledge',null],['Projects','folder','XENO ecosystem and builds',null],['Health & Fitness','heart','Training and tracking',null],['Creative','music','Music, art, and writing',null],['Integrations','link','Connected apps and permissions',null]];
const folderNames=[['Personal Profile','Goals, values, habits, identity'],['Work & Technical','Oil field, CDL, equipment, systems'],['Projects','XENO, apps, automation, builds'],['Creative','Music, YouTube, art'],['Health & Fitness','Training and goals'],['Finance','Budgets and savings'],['Learning & Skills','CDL, CAD, drafting, software']];
const folderHost=$('xFolders');for(const [name,detail] of folderNames){const b=document.createElement('button');b.className='x-folder';b.type='button';b.innerHTML=`<span class="x-glyph">${icon("folder")}</span><span><strong>${name}</strong><small>${detail}</small></span><span class="x-chevron">›</span>`;b.addEventListener('click',()=>openProfile());folderHost.append(b)}
function readTasks(){try{const a=JSON.parse(localStorage.getItem(TASKS)||'[]');return Array.isArray(a)?a.filter(t=>t&&typeof t.title==='string'):[]}catch{return []}}
function renderToday(){const host=$('xTodayTasks');host.replaceChildren();const tasks=readTasks().slice(-5).reverse();if(!tasks.length){const p=document.createElement('p');p.className='x-subtitle';p.textContent='No tasks yet. Create one in Tools & Actions.';host.append(p)}for(const t of tasks){const label=document.createElement('label');label.className='x-check';const c=document.createElement('input');c.type='checkbox';c.checked=!!t.done;c.addEventListener('change',()=>{const all=readTasks();const found=all.find(x=>x.id===t.id);if(found){found.done=c.checked;try{localStorage.setItem(TASKS,JSON.stringify(all))}catch{c.checked=!c.checked;alert('Unable to save task.')}renderToday()}});const span=document.createElement('span');span.textContent=t.title;label.append(c,span);host.append(label)}const done=tasks.filter(t=>t.done).length;$('xProgress').style.width=(tasks.length?100*done/tasks.length:0)+'%';$('xProgressLabel').textContent=tasks.length?`${done} of ${tasks.length} shown tasks complete`:'Your tasks will appear here.'}
function updateHero(){
 const a=$('messages');
 const hasConversation=[...a.querySelectorAll('.bubble')].some(b=>!b.textContent.includes('XENO ready. Send a message to begin.'));
 hero.classList.toggle('hidden',hasConversation);
 chat.classList.toggle('x-active-chat',hasConversation);
}
const observer=new MutationObserver(updateHero);observer.observe($('messages'),{childList:true});
function syncNav(page){nav.querySelectorAll('[data-page]').forEach(b=>{if(b.dataset.page===page)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
function hideAll(){for(const el of [home,chat,tools,convos,profile,memory])el.classList.add('hidden');dock.classList.add('hidden');$('settings').classList.add('hidden')}
function showPage(page){if(page==='chat'){hideAll();chat.classList.remove('hidden');dock.classList.remove('hidden');updateHero()}else if(page==='home'){hideAll();home.classList.remove('hidden');renderToday()}else if(page==='memory'){hideAll();memory.classList.remove('hidden')}else if(page==='tools'){hideAll();tools.classList.remove('hidden')}else if(page==='conversations'){hideAll();convos.classList.remove('hidden');$('chatsButton').click();}else if(page==='profile'){openProfile();return}syncNav(page==='conversations'?'chat':page);window.scrollTo(0,0)}
function openProfile(){$('profileButton').click();if(!profile.classList.contains('hidden')){for(const el of [home,memory,tools])el.classList.add('hidden');syncNav('memory');window.scrollTo(0,0)}}
function toChat(){// Existing handler performs profile unsaved-change checks.
 $('backToChat').click();if(profile.classList.contains('hidden'))showPage('chat')}
for(const b of nav.querySelectorAll('[data-page]'))b.addEventListener('click',()=>{const page=b.dataset.page;if(!profile.classList.contains('hidden')){toChat();if(!profile.classList.contains('hidden'))return}if(page==='tools'){$('toolsButton').click();syncNav('tools');window.scrollTo(0,0)}else if(page==='chat'){if(!chat.classList.contains('hidden'))showPage('chat');else if(!convos.classList.contains('hidden')){const active=convos.querySelector('.chat-item.active .chat-open');if(active)active.click();showPage('chat')}else showPage('chat')}else showPage(page)});
for(const b of home.querySelectorAll('[data-go]'))b.addEventListener('click',()=>{const page=b.dataset.go;if(page==='tools'){$('toolsButton').click();syncNav('tools')}else showPage(page)});
$('xKnowledge').addEventListener('click',openProfile);$('xMemorySettings').addEventListener('click',()=>{$('settingsButton').click();window.scrollTo(0,0)});
for(const b of hero.querySelectorAll('[data-prompt]'))b.addEventListener('click',()=>{$('prompt').value=b.dataset.prompt;$('prompt').focus()});
// Existing navigation continues to own rendering and profile editing.
$('chatsButton').addEventListener('click',()=>{for(const el of [home,memory,tools])el.classList.add('hidden');syncNav('chat')});
$('profileButton').addEventListener('click',()=>{for(const el of [home,memory,tools])el.classList.add('hidden');syncNav('memory')});
$('backToChat').addEventListener('click',()=>{if(profile.classList.contains('hidden'))showPage('chat')});
$('newChatButton').addEventListener('click',()=>{if(!chat.classList.contains('hidden'))showPage('chat')});
$('toolsButton').addEventListener('click',()=>{for(const el of [home,memory])el.classList.add('hidden');syncNav('tools')});
$('toolsBack').addEventListener('click',()=>{setTimeout(()=>showPage('chat'),0)});
// Transform long tools list into focused, expandable groups; original forms and listeners stay in place.
const grid=tools.querySelector('.tools-grid');if(grid){const cards=[...grid.querySelectorAll(':scope > .tools-card')];const items=[['Organization','Tasks and approval requests',[3,4,5]],['Finance & calculations','Calculator and unit conversion',[0,1]],['Planning','Date difference',[2]]];for(const [name,desc,indexes] of items){const d=document.createElement('details');d.className='x-tool-category';d.innerHTML=`<summary>${name}</summary><p class="x-cat-desc">${desc}</p>`;for(const i of indexes)if(cards[i])d.append(cards[i]);grid.append(d)}const intro=document.createElement('div');intro.className='x-category-grid';for(const [name,glyph,detail,target] of categories){const b=document.createElement('button');b.className='x-category';b.type='button';b.innerHTML=`<span class="x-glyph">${icon(glyph)}</span><strong>${name}</strong><small>${detail}</small>${target?'':'<span class="x-coming">More tools planned</span>'}`;b.addEventListener('click',()=>{if(!target){alert('This category is planned. Existing tools remain available below.');return}const detailEl=grid.querySelectorAll('.x-tool-category')[target==='task'?0:1];detailEl.open=true;const destination=target==='task'?$('toolTask'):$('toolCalc');(destination||detailEl).scrollIntoView({behavior:'smooth',block:'start'})});intro.append(b)}grid.parentNode.insertBefore(intro,grid);const title=document.createElement('div');title.className='x-section-head';title.innerHTML='<strong>Available tools</strong><span>Tap a group to expand</span>';grid.parentNode.insertBefore(title,grid)}
const today=new Date();$('xDate').textContent=today.toLocaleDateString(undefined,{month:'short',day:'numeric'});const hour=today.getHours();$('xHello').textContent=`Good ${hour<12?'morning':hour<17?'afternoon':'evening'}.`;
// Status is truthful: online AI does not imply all tools are operational.
async function checkTools(){try{const r=await fetch('/health',{cache:'no-store'});$('xSystemStatus').textContent=r.ok?'Gateway responding':'Gateway unavailable';$('xToolStatus').textContent=r.ok?'✓':'?'}catch{$('xSystemStatus').textContent='Offline';$('xToolStatus').textContent='?'}}
window.addEventListener('storage',e=>{if(e.key===TASKS)renderToday()});
showPage('home');checkTools();
})();
