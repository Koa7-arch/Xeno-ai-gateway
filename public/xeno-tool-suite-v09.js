/* XENO v0.9.1: real categorized, form-driven AI tools. */
(()=>{'use strict';
const $=id=>document.getElementById(id),view=$('toolsView');if(!view)return;
const grid=view.querySelector('.tools-grid'),intro=view.querySelector('.x-category-grid');if(!grid||!intro)return;
const groups={
 'Organization':['date_difference','date_offset','split_expense'],
 'Work & Field':['work_shift_hours','fuel_trip_estimate','convert_units'],
 'Finance':['calculate','estimate_overtime_pay','savings_projection','percentage_change','loan_payment','goal_timeline','compound_growth','budget_summary','split_expense'],
 'Learning':['text_statistics','percentage_change','convert_units'],
 'Projects':['date_difference','date_offset','percentage_change'],
 'Health & Fitness':['date_difference','percentage_change'],
 'Creative':['text_statistics'],
 'Integrations':[]
};
const examples={calculate:{operation:'add',a:2,b:3},convert_units:{value:100,from:'mi',to:'km'},date_difference:{start:'2026-11-15',end:'2026-12-15'},estimate_overtime_pay:{hours:60,hourly_rate:15,overtime_threshold:40,overtime_multiplier:1.5},savings_projection:{starting_balance:3000,contribution_per_period:500,periods:12},percentage_change:{original:100,new_value:125},loan_payment:{principal:10000,annual_rate_percent:6,months:36},goal_timeline:{current_balance:3000,target_balance:10000,contribution_per_period:500},compound_growth:{principal:3000,annual_rate_percent:4,periods_per_year:12,years:2,deposit_per_period:200},budget_summary:{income:3000,fixed_costs:500,variable_costs:800,planned_savings:1000},fuel_trip_estimate:{miles:300,mpg:20,price_per_gallon:3},work_shift_hours:{start:'05:30',end:'17:30',break_minutes:30},date_offset:{date:'2026-11-15',days:30},split_expense:{subtotal:100,tip_percent:15,people:4},text_statistics:{text:'XENO is ready. Tool suite online.'}};
const names={calculate:'Calculator',convert_units:'Unit Conversion',date_difference:'Date Difference',estimate_overtime_pay:'Overtime Pay',savings_projection:'Savings Projection',percentage_change:'Percentage Change',loan_payment:'Loan Payment',goal_timeline:'Savings Goal Timeline',compound_growth:'Compound Growth',budget_summary:'Budget Summary',fuel_trip_estimate:'Fuel Trip Estimate',work_shift_hours:'Work Shift Hours',date_offset:'Date Offset',split_expense:'Split Expense',text_statistics:'Text Statistics'};
// One focused category page, displayed in place of the category tiles.
const panel=document.createElement('section');panel.id='xCategoryPanel';panel.hidden=true;
panel.setAttribute('aria-live','polite');
const back=document.createElement('button');back.type='button';back.className='secondary';back.textContent='← All categories';
const heading=document.createElement('h2');heading.textContent='Tools';
const status=document.createElement('p');status.className='x-v091-status';status.textContent='Loading tools…';
const contents=document.createElement('div');contents.className='x-v091-content';
panel.append(back,heading,status,contents);intro.parentNode.insertBefore(panel,intro);
// Hide legacy forms and the JSON tester: they remain in the DOM for compatibility.
grid.hidden=true;
const oldSuite=$('xenoToolSuiteV09');if(oldSuite)oldSuite.hidden=true;
const finance=$('xenoFinanceV07');if(finance)finance.hidden=true;
const css=document.createElement('style');css.textContent=`
#toolsView #xCategoryPanel[hidden],#toolsView .tools-grid[hidden],#toolsView .x-category-grid[hidden]{display:none!important}
#toolsView #xCategoryPanel{padding:12px 4px 32px}
#toolsView #xCategoryPanel h2{margin:16px 0;color:#f2e6ff}
#toolsView .x-v091-tool{border:1px solid #54396d;background:#21162d;border-radius:13px;padding:12px;margin:10px 0}
#toolsView .x-v091-tool summary{cursor:pointer;font-weight:650;padding:4px 0}
#toolsView .x-v091-tool p,#toolsView .x-v091-status{font-size:12px;color:#cbb2e4}
#toolsView .x-v091-tool label{display:block;font-size:12px;color:#d8c4eb;margin:10px 0}
#toolsView .x-v091-tool input,#toolsView .x-v091-tool textarea,#toolsView .x-v091-tool select{display:block;width:100%;min-width:0;margin-top:5px;background:#120d1d;color:#f5eaff;border:1px solid #684b81;border-radius:10px;padding:11px;font:inherit}
#toolsView .x-v091-tool output{display:block;white-space:pre-wrap;overflow-wrap:anywhere;margin-top:12px;padding:12px;border:1px solid #5b3d77;border-radius:10px;background:#150d20}
#toolsView .x-v091-tool output[hidden]{display:none}`;document.head.append(css);
let catalog=null;
function openCategory(category){
  intro.hidden=true;panel.hidden=false;heading.textContent=category;contents.replaceChildren();
  const ids=groups[category]||[];
  if(category==='Integrations')status.textContent='No external integrations connected. Nothing is authorized to act on external accounts.';
  else if(!catalog)status.textContent='Tool catalog unavailable. Check that the v0.9 backend is deployed.';
  else {let count=0;for(const id of ids){const tool=catalog.find(t=>t.name===id&&t.direct);if(tool){contents.append(build(id,tool.description));count++}}
    status.textContent=count?`${count} available tools. Select one to open its form.`:'No executable tools returned for this category.';
    if(category==='Organization'){const note=document.createElement('p');note.textContent='Task proposals require approval. Manage existing tasks through the organization interface.';contents.prepend(note)}
  }
  panel.scrollIntoView({block:'start',behavior:'instant'});
}
for(const button of intro.querySelectorAll('[data-category]'))button.addEventListener('click',()=>openCategory(button.dataset.category));
back.addEventListener('click',()=>{panel.hidden=true;intro.hidden=false;intro.scrollIntoView({block:'start',behavior:'instant'})});
const pretty=x=>JSON.stringify(x,null,2);
function build(name,description){const outer=document.createElement('details');outer.className='x-v091-tool';outer.dataset.tool=name;const summary=document.createElement('summary');summary.textContent=names[name]||name.replaceAll('_',' ');const desc=document.createElement('p');desc.textContent=description;const form=document.createElement('form');const args=examples[name]||{};
for(const [key,value] of Object.entries(args)){const label=document.createElement('label');label.textContent=key.replaceAll('_',' ');let input;if(typeof value==='string'&&value.length>80){input=document.createElement('textarea');input.rows=3}else{input=document.createElement('input');input.type=typeof value==='number'?'number':'text';if(typeof value==='number')input.step='any';}input.name=key;input.value=String(value);input.required=true;label.append(input);form.append(label)}
const btn=document.createElement('button');btn.type='submit';btn.textContent='Run tool';const output=document.createElement('output');output.hidden=true;output.setAttribute('aria-live','polite');form.append(btn,output);outer.append(summary,desc,form);
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const params={};for(const [key,value] of new FormData(form)){const v=args[key];params[key]=typeof v==='number'?Number(value):String(value)};btn.disabled=true;output.hidden=false;output.textContent='Running…';try{const r=await fetch('/tools/run',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool:name,args:params})});const data=await r.json();if(!r.ok||data.result?.error)throw Error(data.error||data.result?.error||'Tool execution failed');output.textContent=pretty(data.result)}catch(err){output.textContent='Error: '+err.message}finally{btn.disabled=false}});return outer;}
fetch('/tools/catalog',{credentials:'same-origin',cache:'no-store'})
  .then(r=>{if(!r.ok)throw Error('Catalog HTTP '+r.status);return r.json()})
  .then(data=>{catalog=Array.isArray(data.tools)?data.tools:[];if(!panel.hidden)openCategory(heading.textContent)})
  .catch(err=>{catalog=null;status.textContent='Could not load tools: '+err.message});
})();
