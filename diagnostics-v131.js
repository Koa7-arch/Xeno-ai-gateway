// XENO v1.3.1: deterministic, read-only diagnostics. No production data mutations.
export const DIAGNOSTICS_VERSION='1.3.1';
const fixtures={
 force_newton:[{mass_kg:10,acceleration_m_s2:9.81},'forceNewtons',98.1],
 torque_newton_meter:[{force_newtons:100,lever_arm_m:0.5},'torqueNm',50],
 pressure_pascal:[{force_newtons:1000,area_m2:0.5},'pressurePa',2000],
 mechanical_power:[{torque_nm:100,rpm:1800},'powerWatts',18849.5559215],
 kinetic_energy:[{mass_kg:10,velocity_m_s:5},'energyJoules',125],
 ohms_law:[{voltage:12,current:2},'resistanceOhms',6],
 statistics_summary:[{values:[1,2,3,4,5]},'mean',3],
 pace_calculator:[{distance_km:10,minutes:50},'minutesPerKm',5],
 time_duration:[{total_minutes:125},'hours',2],
 reading_time:[{text:'one two three four',words_per_minute:2},'estimatedMinutes',2],
 calculate:[{operation:'multiply',a:7,b:8},'value',56],
 convert_units:[{value:1,from:'mi',to:'km'},'value',1.609344],
 date_difference:[{start:'2026-01-01',end:'2026-01-11'},'days',10],
 estimate_overtime_pay:[{hours:60,hourly_rate:15,overtime_threshold:40,overtime_multiplier:1.5},'grossPay',1050],
 savings_projection:[{starting_balance:3000,contribution_per_period:500,periods:12},'projectedBalance',9000],
 percentage_change:[{original:100,new_value:125},'percentageChange',25],
 loan_payment:[{principal:1200,annual_rate_percent:0,months:12},'monthlyPayment',100],
 goal_timeline:[{current_balance:100,target_balance:500,contribution_per_period:100},'periods',4],
 compound_growth:[{principal:1000,annual_rate_percent:0,periods_per_year:12,years:1,deposit_per_period:100},'projectedBalance',2200],
 budget_summary:[{income:2000,fixed_costs:500,variable_costs:300,planned_savings:400},'remaining',800],
 fuel_trip_estimate:[{miles:300,mpg:30,price_per_gallon:3},'estimatedFuelCost',30],
 work_shift_hours:[{start:'08:00',end:'17:00',break_minutes:60},'paidHours',8],
 date_offset:[{date:'2026-01-01',days:9},'date','2026-01-10'],
 split_expense:[{subtotal:100,tip_percent:20,people:4},'perPerson',30],
 text_statistics:[{text:'hello world'},'words',2]
};
const round=v=>typeof v==='number'?Math.round(v*1e8)/1e8:v;
const result=(id,status,detail,expected,actual)=>({id,status,detail,...(expected!==undefined?{expected}:{}),...(actual!==undefined?{actual}:{})});
export async function runDiagnostics({mode,runTool,toolSchemas,engineVersion,providerConfigured}){
  const started=new Date().toISOString();
  const tests=[];
  const allNames=toolSchemas.map(t=>t.function.name);
  const names=mode==='quick'?['calculate','estimate_overtime_pay','force_newton','statistics_summary','date_difference']:Object.keys(fixtures);
  for(const name of names){
    const f=fixtures[name];
    if(!allNames.includes(name)){tests.push(result('tool:'+name,'fail','Tool missing from AI registry'));continue}
    if(!f){tests.push(result('tool:'+name,'skip','No fixture'));continue}
    try{
      const output=runTool(name,f[0]);const actual=output?.[f[1]];
      const pass=!output?.error && (typeof f[2]==='number' ? typeof actual==='number' && Math.abs(actual-f[2])<=Math.max(1e-7,Math.abs(f[2])*1e-8) : actual===f[2]);
      tests.push(result('tool:'+name,pass?'pass':'fail',output?.error|| (pass?'Expected output matched':'Unexpected output'),f[2],round(actual)));
    }catch(e){tests.push(result('tool:'+name,'fail','Execution threw: '+String(e?.message||e).slice(0,120)))}
  }
  if(mode!=='quick'){
    for(const name of allNames.filter(x=>x!=='propose_task'&&!fixtures[x]))tests.push(result('tool:'+name,'skip','Tool has no verified fixture'));
    try{
      const invalid=runTool('pressure_pascal',{force_newtons:10,area_m2:0});
      tests.push(result('validation:zero-area',invalid?.error?'pass':'fail','Invalid input must be rejected'));
    }catch{tests.push(result('validation:zero-area','fail','Invalid input caused an exception'))}
    try{
      const proposal=runTool('propose_task',{title:'DIAGNOSTIC TEST — NOT SAVED'});
      tests.push(result('approval:proposal-only',proposal?.proposal?'pass':'fail','Propose task must return a proposal, never save a task'));
    }catch{tests.push(result('approval:proposal-only','fail','Proposal tool failed'))}
    tests.push(result('agent:live-chat','skip','Live model response and typography require a separate opt-in integration test; not inferred from tool fixtures'));
    tests.push(result('integration:external','skip','External services are not connected by this diagnostics engine'));
    tests.push(result('automation:background','skip','Background scheduling cannot be verified by a request-only Worker'));
  }
  tests.push(result('provider:configuration',providerConfigured?'pass':'blocked',providerConfigured?'Groq API key configured; no live request made':'Groq API key missing'));
  tests.push(result('engine:registry',allNames.length>=26?'pass':'fail',`${allNames.length} AI tool definitions; engine ${engineVersion}`));
  const counts={pass:0,fail:0,skip:0,blocked:0};for(const t of tests)counts[t.status]++;
  return {application:'XENO',version:DIAGNOSTICS_VERSION,diagnosticsVersion:DIAGNOSTICS_VERSION,mode,started,finished:new Date().toISOString(),counts,tests,notes:['Read-only diagnostic fixtures; no real user data is modified.','A passing tool fixture does not prove the AI chat or mobile UI works.','Skipped and blocked checks are not counted as passes.','No credentials, personal memory, or tokens are included in this report.']};
}
