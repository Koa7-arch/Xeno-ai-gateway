/* XENO v0.9.3: categorized tools with human-readable results. */
(()=>{'use strict';
const $=id=>document.getElementById(id),view=$('toolsView');if(!view)return;
const grid=view.querySelector('.tools-grid'),intro=view.querySelector('.x-category-grid');if(!grid||!intro)return;
const groups={
 'Organization':['date_difference','date_offset','split_expense'],
 'Work & Field':['work_shift_hours','fuel_trip_estimate','convert_units'],
 'Engineering':['circle_geometry','triangle_geometry','pythagorean_hypotenuse','density_calculator','momentum_calculator','potential_energy','electrical_energy','force_newton','torque_newton_meter','pressure_pascal','mechanical_power','kinetic_energy','ohms_law','statistics_summary','pace_calculator','time_duration','reading_time'],
 'Finance':['simple_interest','discount_price','break_even_units','calculate','estimate_overtime_pay','savings_projection','percentage_change','loan_payment','goal_timeline','compound_growth','budget_summary','split_expense'],
 'Learning':['grade_average','study_schedule','weighted_average','percentile_calculator','text_statistics','percentage_change','convert_units'],
 'Projects':['date_difference','date_offset','percentage_change'],
 'Health & Fitness':['body_mass_index','percentage_change','date_difference'],
 'Creative':['text_statistics'],
 'Integrations':[]
};
const examples={"circle_geometry":{"radius":2},"triangle_geometry":{"base":10,"height":4},"pythagorean_hypotenuse":{"a":3,"b":4},"density_calculator":{"mass_kg":10,"volume_m3":2},"momentum_calculator":{"mass_kg":2,"velocity_m_s":3},"potential_energy":{"mass_kg":2,"height_m":5},"electrical_energy":{"power_watts":1000,"hours":2},"simple_interest":{"principal":1000,"annual_rate_percent":5,"years":2},"discount_price":{"price":100,"discount_percent":20,"tax_percent":5},"break_even_units":{"fixed_costs":1000,"unit_price":20,"unit_variable_cost":10},"weighted_average":{"values":[80,90],"weights":[1,3]},"percentile_calculator":{"values":[1,2,3,4,5],"percentile":50},"grade_average":{"earned_points":45,"possible_points":50},"study_schedule":{"total_minutes":120,"sessions":4},"body_mass_index":{"weight_kg":72,"height_m":1.8},force_newton:{mass_kg:10,acceleration_m_s2:9.81},torque_newton_meter:{force_newtons:100,lever_arm_m:0.5},pressure_pascal:{force_newtons:1000,area_m2:0.5},mechanical_power:{torque_nm:100,rpm:1800},kinetic_energy:{mass_kg:10,velocity_m_s:5},ohms_law:{voltage:12,current:2},statistics_summary:{values:[1,2,3,4,5]},pace_calculator:{distance_km:5,minutes:30},time_duration:{total_minutes:135.5},reading_time:{text:'XENO can estimate reading time.',words_per_minute:200},calculate:{operation:'add',a:2,b:3},convert_units:{value:100,from:'mi',to:'km'},date_difference:{start:'2026-11-15',end:'2026-12-15'},estimate_overtime_pay:{hours:60,hourly_rate:15,overtime_threshold:40,overtime_multiplier:1.5},savings_projection:{starting_balance:3000,contribution_per_period:500,periods:12},percentage_change:{original:100,new_value:125},loan_payment:{principal:10000,annual_rate_percent:6,months:36},goal_timeline:{current_balance:3000,target_balance:10000,contribution_per_period:500},compound_growth:{principal:3000,annual_rate_percent:4,periods_per_year:12,years:2,deposit_per_period:200},budget_summary:{income:3000,fixed_costs:500,variable_costs:800,planned_savings:1000},fuel_trip_estimate:{miles:300,mpg:20,price_per_gallon:3},work_shift_hours:{start:'05:30',end:'17:30',break_minutes:30},date_offset:{date:'2026-11-15',days:30},split_expense:{subtotal:100,tip_percent:15,people:4},text_statistics:{text:'XENO is ready. Tool suite online.'}};
const names={force_newton:'Force Newton',torque_newton_meter:'Torque Newton Meter',pressure_pascal:'Pressure Pascal',mechanical_power:'Mechanical Power',kinetic_energy:'Kinetic Energy',ohms_law:'Ohms Law',statistics_summary:'Statistics Summary',pace_calculator:'Pace Calculator',time_duration:'Time Duration',reading_time:'Reading Time',calculate:'Calculator',convert_units:'Unit Conversion',date_difference:'Date Difference',estimate_overtime_pay:'Overtime Pay',savings_projection:'Savings Projection',percentage_change:'Percentage Change',loan_payment:'Loan Payment',goal_timeline:'Savings Goal Timeline',compound_growth:'Compound Growth',budget_summary:'Budget Summary',fuel_trip_estimate:'Fuel Trip Estimate',work_shift_hours:'Work Shift Hours',date_offset:'Date Offset',split_expense:'Split Expense',text_statistics:'Text Statistics'};
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
#toolsView .x-v091-tool output[hidden]{display:none}
#toolsView .x-v093-headline{display:block;font-size:1.25rem;line-height:1.4;color:#f6eaff;margin-bottom:8px}
#toolsView .x-v093-line{margin:6px 0;font-size:.92rem;color:#e5d7f2;line-height:1.5}
#toolsView .x-v093-technical{margin-top:16px;padding-top:12px;border-top:1px solid #4b355f}
#toolsView .x-v093-technical summary{font-size:.8rem;color:#bba4d0}
#toolsView .x-v093-technical pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.76rem;max-height:260px;overflow:auto}`;document.head.append(css);
let catalog=null;
function openCategory(category){
  intro.hidden=true;panel.hidden=false;heading.textContent=category;contents.replaceChildren();
  const ids=groups[category]||[];
  if(category==='Integrations')status.textContent='No external integrations connected. Nothing is authorized to act on external accounts.';
  else if(!catalog)status.textContent='Tool catalog unavailable. Check that the v0.9 backend is deployed.';
  else {let count=0;for(const id of ids){const tool=catalog.find(t=>t.name===id&&t.direct);if(tool){contents.append(build(id,tool.description));count++}}
    status.textContent=count?`${count} available tools. Select one to open its form.`:'No executable tools returned for this category.';
    if(category==='Organization'){
      const note=document.createElement('p');note.textContent='Tasks and approvals are managed locally. AI proposals require your review.';contents.prepend(note);
      const actions=document.createElement('div');actions.className='x-v101-actions';
      const openTask=document.createElement('button');openTask.type='button';openTask.textContent='Open task manager';
      openTask.addEventListener('click',()=>{const legacy=document.getElementById('toolTask');if(!legacy)return;grid.hidden=false;legacy.hidden=false;legacy.scrollIntoView({block:'center'});legacy.querySelector('input,button')?.focus()});
      const openApprovals=document.createElement('button');openApprovals.type='button';openApprovals.textContent='Review approvals';openApprovals.className='secondary';
      openApprovals.addEventListener('click',()=>{const legacy=document.getElementById('toolTask');if(!legacy)return;grid.hidden=false;legacy.hidden=false;legacy.scrollIntoView({block:'center'});legacy.querySelector('button')?.focus()});
      actions.append(openTask,openApprovals);contents.prepend(actions)
    }
  }
  panel.scrollIntoView({block:'start',behavior:'instant'});
}
for(const button of intro.querySelectorAll('[data-category]'))button.addEventListener('click',()=>openCategory(button.dataset.category));
back.addEventListener('click',()=>{panel.hidden=true;intro.hidden=false;intro.scrollIntoView({block:'start',behavior:'instant'})});
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const number=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:6}).format(n);
const fmt=(n,unit='')=>number(n)+(unit?' '+unit:'');
const readable=(name,r,args)=>{
  const lines=[];let headline='Result';
  switch(name){
    case 'calculate':headline=fmt(r.value,r.unit||'');lines.push('Calculation: '+r.expression);break;
    case 'convert_units':headline=fmt(r.value,r.to);lines.push(`${fmt(r.input,r.from)} equals ${headline}.`);break;
    case 'date_difference':headline=fmt(r.absoluteDays,'days');lines.push(`From ${r.start} to ${r.end}: ${fmt(r.days,'days')} (signed).`);break;
    case 'estimate_overtime_pay':headline=money(r.grossPay);lines.push(`Regular: ${fmt(r.regularHours,'hours')} — ${money(r.regularPay)}`,`Overtime: ${fmt(r.overtimeHours,'hours')} — ${money(r.overtimePay)}`);break;
    case 'savings_projection':headline=money(r.projectedBalance);lines.push(`Starting balance: ${money(r.startingBalance)}`,`Added over ${fmt(r.periods,'periods')}: ${money(r.totalContributions)}`);break;
    case 'percentage_change':headline=fmt(r.percentageChange,'%');lines.push(`Change: ${fmt(r.difference)} (from ${fmt(r.original)} to ${fmt(r.newValue)})`);break;
    case 'loan_payment':headline=money(r.monthlyPayment)+' per month';lines.push(`Total repayment: ${money(r.totalRepaid)}`,`Total interest: ${money(r.totalInterest)}`);break;
    case 'goal_timeline':headline=fmt(r.periods,'contribution periods');lines.push(`Remaining to save: ${money(r.remaining)}`,`Balance after reaching goal: ${money(r.projectedBalance)}`);break;
    case 'compound_growth':headline=money(r.projectedBalance);lines.push(`Total new deposits: ${money(r.totalDeposits)}`,`Estimated growth: ${money(r.estimatedGrowth)}`,`Contribution periods: ${fmt(r.periods)}`);break;
    case 'budget_summary':headline=money(r.remaining)+' remaining';lines.push(`Total spending and planned savings: ${money(r.totalOutflows)}`,`Planned savings rate: ${r.savingsRatePercent===null?'Not applicable':fmt(r.savingsRatePercent,'%')}`);break;
    case 'fuel_trip_estimate':headline=money(r.estimatedFuelCost);lines.push(`Estimated fuel used: ${fmt(r.gallons,'gallons')}`);break;
    case 'work_shift_hours':headline=fmt(r.paidHours,'paid hours');lines.push(`Total shift: ${fmt(r.shiftHours,'hours')}`,r.overnight?'This shift crosses midnight.':'This shift ends on the same day.');break;
    case 'date_offset':headline=r.date;lines.push(`${args.days>=0?'Added':'Subtracted'} ${fmt(Math.abs(r.days),'days')} ${args.days>=0?'to':'from'} ${args.date}.`);break;
    case 'split_expense':headline=money(r.perPerson)+' per person';lines.push(`Total bill: ${money(r.total)}`,`Tip: ${money(r.tip)}`);break;
    case 'text_statistics':headline=fmt(r.words,'words');lines.push(`${fmt(r.characters,'characters')} · ${fmt(r.lines,'lines')}`);break;
    default:headline='Completed';for(const [key,value] of Object.entries(r))if(typeof value!=='object')lines.push(`${key}: ${value}`);
  }
  if(r.disclaimer)lines.push(r.disclaimer);
  if(r.assumptions)lines.push(typeof r.assumptions==='string'?r.assumptions:Object.entries(r.assumptions).map(([k,v])=>`${k.replaceAll('_',' ')}: ${v}`).join(' · '));
  return {headline,lines};
};
function showResult(output,name,result,args){
  const {headline,lines}=readable(name,result,args);
  output.replaceChildren();
  const title=document.createElement('strong');title.className='x-v093-headline';title.textContent=headline;output.append(title);
  for(const line of lines){const p=document.createElement('p');p.className='x-v093-line';p.textContent=line;output.append(p)}
  const details=document.createElement('details');details.className='x-v093-technical';const summary=document.createElement('summary');summary.textContent='Technical details';const pre=document.createElement('pre');pre.textContent=JSON.stringify(result,null,2);details.append(summary,pre);output.append(details);
}
function build(name,description){const outer=document.createElement('details');outer.className='x-v091-tool';outer.dataset.tool=name;const summary=document.createElement('summary');summary.textContent=names[name]||name.replaceAll('_',' ');const desc=document.createElement('p');desc.textContent=description;const form=document.createElement('form');const args=examples[name]||{};
for(const [key,value] of Object.entries(args)){const label=document.createElement('label');label.textContent=key.replaceAll('_',' ');let input;if(typeof value==='string'&&value.length>80){input=document.createElement('textarea');input.rows=3}else{input=document.createElement('input');input.type=typeof value==='number'?'number':'text';if(typeof value==='number')input.step='any';}input.name=key;input.value=String(value);input.required=true;label.append(input);form.append(label)}
const btn=document.createElement('button');btn.type='submit';btn.textContent='Run tool';const output=document.createElement('output');output.hidden=true;output.setAttribute('aria-live','polite');form.append(btn,output);outer.append(summary,desc,form);
form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const params={};for(const [key,value] of new FormData(form)){const v=args[key];params[key]=typeof v==='number'?Number(value):String(value)};btn.disabled=true;output.hidden=false;output.textContent='Running…';try{const r=await fetch('/tools/run',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({tool:name,args:params})});const data=await r.json();if(!r.ok||data.result?.error)throw Error(data.error||data.result?.error||'Tool execution failed');showResult(output,name,data.result,params)}catch(err){output.textContent='Error: '+err.message}finally{btn.disabled=false}});return outer;}
fetch('/tools/catalog',{credentials:'same-origin',cache:'no-store'})
  .then(r=>{if(!r.ok)throw Error('Catalog HTTP '+r.status);return r.json()})
  .then(data=>{catalog=Array.isArray(data.tools)?data.tools:[];if(!panel.hidden)openCategory(heading.textContent)})
  .catch(err=>{catalog=null;status.textContent='Could not load tools: '+err.message});
})();
