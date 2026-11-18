// XENO Mobile v0.6 — bounded deterministic tools and approval-only action proposals.
// No eval, arbitrary URLs, shell commands, or external side effects.
export const TOOL_SCHEMAS = [
  {type:'function',function:{name:'force_newton',description:'Calculate force from mass and acceleration.',parameters:{type:'object',additionalProperties:false,properties:{mass_kg:{type:'number'},acceleration_m_s2:{type:'number'}},required:['mass_kg','acceleration_m_s2']}}},
  {type:'function',function:{name:'torque_newton_meter',description:'Calculate torque from perpendicular force and lever arm.',parameters:{type:'object',additionalProperties:false,properties:{force_newtons:{type:'number'},lever_arm_m:{type:'number'}},required:['force_newtons','lever_arm_m']}}},
  {type:'function',function:{name:'pressure_pascal',description:'Calculate pressure from force divided by area.',parameters:{type:'object',additionalProperties:false,properties:{force_newtons:{type:'number'},area_m2:{type:'number'}},required:['force_newtons','area_m2']}}},
  {type:'function',function:{name:'mechanical_power',description:'Calculate mechanical power from torque and rotational speed.',parameters:{type:'object',additionalProperties:false,properties:{torque_nm:{type:'number'},rpm:{type:'number'}},required:['torque_nm','rpm']}}},
  {type:'function',function:{name:'kinetic_energy',description:'Calculate kinetic energy from mass and velocity.',parameters:{type:'object',additionalProperties:false,properties:{mass_kg:{type:'number'},velocity_m_s:{type:'number'}},required:['mass_kg','velocity_m_s']}}},
  {type:'function',function:{name:'ohms_law',description:'Calculate voltage, current, resistance, and power from two known values (V and I).',parameters:{type:'object',additionalProperties:false,properties:{voltage:{type:'number'},current:{type:'number'}},required:['voltage','current']}}},
  {type:'function',function:{name:'statistics_summary',description:'Calculate mean, median, min, max, range and population standard deviation for a numeric dataset.',parameters:{type:'object',additionalProperties:false,properties:{values:{type:'array',items:{type:'number'},minItems:1,maxItems:200}},required:['values']}}},
  {type:'function',function:{name:'pace_calculator',description:'Calculate pace and speed for a distance and elapsed time.',parameters:{type:'object',additionalProperties:false,properties:{distance_km:{type:'number'},minutes:{type:'number'}},required:['distance_km','minutes']}}},
  {type:'function',function:{name:'time_duration',description:'Convert minutes to hours, minutes, and seconds.',parameters:{type:'object',additionalProperties:false,properties:{total_minutes:{type:'number'}},required:['total_minutes']}}},
  {type:'function',function:{name:'reading_time',description:'Estimate reading time based on word count and reading speed.',parameters:{type:'object',additionalProperties:false,properties:{text:{type:'string'},words_per_minute:{type:'number'}},required:['text','words_per_minute']}}},
  {type:'function', function:{name:'calculate',description:'Perform precise basic arithmetic using two numbers. Use for pay and other numeric calculations; no tax assumptions.',parameters:{type:'object',additionalProperties:false,properties:{operation:{type:'string',enum:['add','subtract','multiply','divide','percentage']},a:{type:'number'},b:{type:'number'}},required:['operation','a','b']}}},
  {type:'function', function:{name:'convert_units',description:'Convert one value between supported units (length, mass, volume, pressure, and temperature).',parameters:{type:'object',additionalProperties:false,properties:{value:{type:'number'},from:{type:'string',enum:['mi','km','ft','m','in','cm','lb','kg','gal','L','psi','kPa','F','C']},to:{type:'string',enum:['mi','km','ft','m','in','cm','lb','kg','gal','L','psi','kPa','F','C']}},required:['value','from','to']}}},
  {type:'function', function:{name:'date_difference',description:'Compute the number of days between two calendar dates in YYYY-MM-DD format (timezone-independent).',parameters:{type:'object',additionalProperties:false,properties:{start:{type:'string'},end:{type:'string'}},required:['start','end']}}},
  {type:'function', function:{name:'estimate_overtime_pay',description:'Estimate gross weekly wages with overtime after a configurable threshold. This is not a net-pay or tax estimate.',parameters:{type:'object',additionalProperties:false,properties:{hours:{type:'number'},hourly_rate:{type:'number'},overtime_threshold:{type:'number'},overtime_multiplier:{type:'number'}},required:['hours','hourly_rate']}}},
  {type:'function', function:{name:'savings_projection',description:'Estimate future savings using a starting balance and a fixed contribution per period; excludes interest, inflation and taxes.',parameters:{type:'object',additionalProperties:false,properties:{starting_balance:{type:'number'},contribution_per_period:{type:'number'},periods:{type:'number'}},required:['starting_balance','contribution_per_period','periods']}}},
  {type:'function', function:{name:'percentage_change',description:'Calculate absolute and percentage change from an original value to a new value.',parameters:{type:'object',additionalProperties:false,properties:{original:{type:'number'},new_value:{type:'number'}},required:['original','new_value']}}},
  {type:'function',function:{name:'loan_payment',description:'Calculate estimated fixed-rate monthly loan payment, total interest, and total repayment. No lending actions.',parameters:{type:'object',additionalProperties:false,properties:{principal:{type:'number'},annual_rate_percent:{type:'number'},months:{type:'integer'}},required:['principal','annual_rate_percent','months']}}},
  {type:'function',function:{name:'goal_timeline',description:'Calculate the number of contribution periods required to reach a savings target, ignoring interest.',parameters:{type:'object',additionalProperties:false,properties:{current_balance:{type:'number'},target_balance:{type:'number'},contribution_per_period:{type:'number'}},required:['current_balance','target_balance','contribution_per_period']}}},
  {type:'function',function:{name:'compound_growth',description:'Project compound growth with fixed end-of-period deposits, without taxes or fees.',parameters:{type:'object',additionalProperties:false,properties:{principal:{type:'number'},annual_rate_percent:{type:'number'},periods_per_year:{type:'integer'},years:{type:'number'},deposit_per_period:{type:'number'}},required:['principal','annual_rate_percent','periods_per_year','years','deposit_per_period']}}},
  {type:'function',function:{name:'budget_summary',description:'Summarize income, fixed costs, variable costs, savings and remaining balance for one period.',parameters:{type:'object',additionalProperties:false,properties:{income:{type:'number'},fixed_costs:{type:'number'},variable_costs:{type:'number'},planned_savings:{type:'number'}},required:['income','fixed_costs','variable_costs','planned_savings']}}},
  {type:'function',function:{name:'fuel_trip_estimate',description:'Estimate fuel consumption and fuel expense from miles, miles per gallon and price per gallon.',parameters:{type:'object',additionalProperties:false,properties:{miles:{type:'number'},mpg:{type:'number'},price_per_gallon:{type:'number'}},required:['miles','mpg','price_per_gallon']}}},
  {type:'function',function:{name:'work_shift_hours',description:'Calculate shift hours from 24-hour start/end clock times and unpaid break minutes. Overnight shifts supported.',parameters:{type:'object',additionalProperties:false,properties:{start:{type:'string'},end:{type:'string'},break_minutes:{type:'number'}},required:['start','end','break_minutes']}}},
  {type:'function',function:{name:'date_offset',description:'Add or subtract calendar days from a YYYY-MM-DD date.',parameters:{type:'object',additionalProperties:false,properties:{date:{type:'string'},days:{type:'integer'}},required:['date','days']}}},
  {type:'function',function:{name:'split_expense',description:'Split a bill equally, optionally including a percentage tip, across people.',parameters:{type:'object',additionalProperties:false,properties:{subtotal:{type:'number'},tip_percent:{type:'number'},people:{type:'integer'}},required:['subtotal','tip_percent','people']}}},
  {type:'function',function:{name:'text_statistics',description:'Count words, characters, and lines of user-supplied text. No document access.',parameters:{type:'object',additionalProperties:false,properties:{text:{type:'string'}},required:['text']}}},
  {type:'function', function:{name:'propose_task',description:'Prepare a proposed task for user review. Does NOT create or save a task; user must explicitly approve it.',parameters:{type:'object',additionalProperties:false,properties:{title:{type:'string'},notes:{type:'string'}},required:['title']}}}
];
const finite = value => typeof value==='number' && Number.isFinite(value) && Math.abs(value)<=1e12;
const round = n => Number(n.toPrecision(12));
function failure(message){ return {error: message}; }
export function runTool(name,args){
  if(!args || typeof args!=='object' || Array.isArray(args)) return failure('Invalid tool arguments');

  if(name==='force_newton'){
    const {mass_kg:m,acceleration_m_s2:a}=args;
    if(!finite(m)||m<0||!finite(a))return failure('Invalid mass or acceleration');
    return {forceNewtons:round(m*a),formula:'F = m × a'};
  }
  if(name==='torque_newton_meter'){
    const {force_newtons:f,lever_arm_m:l}=args;
    if(!finite(f)||!finite(l)||l<0)return failure('Invalid force or lever arm');
    return {torqueNm:round(f*l),formula:'τ = F × r (perpendicular force assumed)'};
  }
  if(name==='pressure_pascal'){
    const {force_newtons:f,area_m2:a}=args;
    if(!finite(f)||!finite(a)||a<=0)return failure('Area must be greater than zero');
    return {pressurePa:round(f/a),pressureKPa:round(f/a/1000),formula:'P = F / A'};
  }
  if(name==='mechanical_power'){
    const {torque_nm:t,rpm:r}=args;
    if(!finite(t)||!finite(r)||r<0)return failure('Invalid torque or RPM');
    const watts=t*r*2*Math.PI/60;
    return {powerWatts:round(watts),powerKW:round(watts/1000),formula:'P = τ × 2π × RPM / 60'};
  }
  if(name==='kinetic_energy'){
    const {mass_kg:m,velocity_m_s:v}=args;
    if(!finite(m)||m<0||!finite(v))return failure('Invalid mass or velocity');
    return {energyJoules:round(.5*m*v*v),formula:'KE = ½mv²'};
  }
  if(name==='ohms_law'){
    const {voltage:v,current:i}=args;
    if(!finite(v)||!finite(i))return failure('Invalid voltage or current');
    return {voltage:v,current:i,resistanceOhms:i===0?null:round(v/i),powerWatts:round(v*i),note:i===0?'Resistance undefined for zero current':undefined};
  }
  if(name==='statistics_summary'){
    const v=args.values;
    if(!Array.isArray(v)||v.length<1||v.length>200||!v.every(finite))return failure('Provide 1–200 finite numeric values');
    const sorted=[...v].sort((a,b)=>a-b),n=v.length,mean=v.reduce((a,b)=>a+b,0)/n;
    const variance=v.reduce((a,b)=>a+(b-mean)**2,0)/n;
    return {count:n,mean:round(mean),median:round(n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2),min:sorted[0],max:sorted[n-1],range:round(sorted[n-1]-sorted[0]),populationStdDev:round(Math.sqrt(variance))};
  }
  if(name==='pace_calculator'){
    const {distance_km:d,minutes:m}=args;
    if(!finite(d)||d<=0||!finite(m)||m<=0)return failure('Distance and duration must be positive');
    return {minutesPerKm:round(m/d),kmPerHour:round(d/(m/60))};
  }
  if(name==='time_duration'){
    const m=args.total_minutes;
    if(!finite(m)||m<0||m>1e7)return failure('Invalid duration');
    const sec=Math.round(m*60);
    return {hours:Math.floor(sec/3600),minutes:Math.floor(sec%3600/60),seconds:sec%60};
  }
  if(name==='reading_time'){
    const {text,words_per_minute:w}=args;
    if(typeof text!=='string'||text.length>10000||!finite(w)||w<=0||w>2000)return failure('Invalid text or reading speed');
    const words=text.trim()?text.trim().split(/\s+/u).length:0;
    return {words,estimatedMinutes:round(words/w),assumption:'Constant reading speed'};
  }

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
  if(name==='estimate_overtime_pay'){
    const {hours,hourly_rate}=args;
    const overtime_threshold=args.overtime_threshold===undefined?40:args.overtime_threshold;
    const overtime_multiplier=args.overtime_multiplier===undefined?1.5:args.overtime_multiplier;
    if(!finite(hours)||hours<0||hours>168||!finite(hourly_rate)||hourly_rate<0||hourly_rate>100000||!finite(overtime_threshold)||overtime_threshold<0||overtime_threshold>168||!finite(overtime_multiplier)||overtime_multiplier<1||overtime_multiplier>5)
      return failure('Invalid hours, rate, threshold, or multiplier');
    const regularHours=Math.min(hours,overtime_threshold);
    const overtimeHours=Math.max(0,hours-overtime_threshold);
    const regularPay=regularHours*hourly_rate;
    const overtimePay=overtimeHours*hourly_rate*overtime_multiplier;
    return {regularHours:round(regularHours),overtimeHours:round(overtimeHours),regularPay:round(regularPay),overtimePay:round(overtimePay),grossPay:round(regularPay+overtimePay),currency:'USD',assumptions:{overtime_threshold,overtime_multiplier},disclaimer:'Gross estimate only; no taxes, deductions, bonuses, or special overtime rules included.'};
  }
  if(name==='savings_projection'){
    const {starting_balance,contribution_per_period,periods}=args;
    if(!finite(starting_balance)||!finite(contribution_per_period)||!Number.isInteger(periods)||periods<0||periods>1200)
      return failure('Invalid savings projection inputs');
    const total=starting_balance+contribution_per_period*periods;
    if(!Number.isFinite(total)||Math.abs(total)>1e15)return failure('Result outside supported range');
    return {startingBalance:round(starting_balance),contributionPerPeriod:round(contribution_per_period),periods,totalContributions:round(contribution_per_period*periods),projectedBalance:round(total),assumptions:'Constant contributions per period; excludes interest, inflation, taxes, and unexpected expenses.'};
  }
  if(name==='percentage_change'){
    const {original,new_value}=args;
    if(!finite(original)||!finite(new_value))return failure('Invalid percentage change inputs');
    if(original===0)return failure('Percentage change is undefined when the original value is zero');
    const difference=new_value-original;
    const percent=difference/Math.abs(original)*100;
    if(!Number.isFinite(percent)||Math.abs(percent)>1e15)return failure('Result outside supported range');
    return {original,newValue:new_value,difference:round(difference),percentageChange:round(percent),basis:'absolute original value'};
  }

  if(name==='loan_payment'){
    const {principal,annual_rate_percent,months}=args;
    if(!finite(principal)||principal<0||principal>1e9||!finite(annual_rate_percent)||annual_rate_percent<0||annual_rate_percent>100||!Number.isInteger(months)||months<1||months>600)return failure('Invalid loan inputs');
    const r=annual_rate_percent/1200;
    const payment=r===0?principal/months:principal*r/(1-Math.pow(1+r,-months));
    return {monthlyPayment:round(payment),totalRepaid:round(payment*months),totalInterest:round(payment*months-principal),disclaimer:'Estimate only; excludes fees, insurance, and variable rates.'};
  }
  if(name==='goal_timeline'){
    const {current_balance,target_balance,contribution_per_period}=args;
    if(![current_balance,target_balance,contribution_per_period].every(finite)||contribution_per_period<=0)return failure('Invalid goal inputs');
    const periods=Math.max(0,Math.ceil((target_balance-current_balance)/contribution_per_period));
    if(periods>1000000)return failure('Goal timeline exceeds supported range');
    return {periods,remaining:round(Math.max(0,target_balance-current_balance)),projectedBalance:round(current_balance+periods*contribution_per_period),assumptions:'No interest or withdrawals. Period duration is defined by the user.'};
  }
  if(name==='compound_growth'){
    const {principal,annual_rate_percent,periods_per_year,years,deposit_per_period}=args;
    if(![principal,annual_rate_percent,years,deposit_per_period].every(finite)||principal<0||annual_rate_percent<0||annual_rate_percent>100||!Number.isInteger(periods_per_year)||periods_per_year<1||periods_per_year>365||years<0||years>100||deposit_per_period<0)return failure('Invalid compound growth inputs');
    const periods=years*periods_per_year;if(!Number.isInteger(periods)||periods>12000)return failure('Use a whole number of contribution periods (max 12000)');
    const rate=annual_rate_percent/100/periods_per_year;
    const factor=Math.pow(1+rate,periods);
    const total=principal*factor+(rate===0?deposit_per_period*periods:deposit_per_period*(factor-1)/rate);
    if(!Number.isFinite(total)||total>1e15)return failure('Result outside supported range');
    return {projectedBalance:round(total),totalDeposits:round(deposit_per_period*periods),estimatedGrowth:round(total-principal-deposit_per_period*periods),periods,disclaimer:'Hypothetical constant rate, end-of-period deposits, no taxes or fees.'};
  }
  if(name==='budget_summary'){
    const {income,fixed_costs,variable_costs,planned_savings}=args;
    if(![income,fixed_costs,variable_costs,planned_savings].every(finite)||[income,fixed_costs,variable_costs,planned_savings].some(v=>v<0))return failure('Invalid budget inputs');
    return {totalOutflows:round(fixed_costs+variable_costs+planned_savings),remaining:round(income-fixed_costs-variable_costs-planned_savings),savingsRatePercent:income===0?null:round(planned_savings/income*100),disclaimer:'All amounts must use the same time period and currency.'};
  }
  if(name==='fuel_trip_estimate'){
    const {miles,mpg,price_per_gallon}=args;
    if(![miles,mpg,price_per_gallon].every(finite)||miles<0||mpg<=0||price_per_gallon<0)return failure('Invalid trip inputs');
    const gallons=miles/mpg;return {gallons:round(gallons),estimatedFuelCost:round(gallons*price_per_gallon),disclaimer:'Does not account for idling, terrain, traffic, or changing fuel prices.'};
  }
  if(name==='work_shift_hours'){
    const parse=t=>{if(typeof t!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))return null;const [h,m]=t.split(':').map(Number);return h*60+m};
    const a=parse(args.start),b=parse(args.end),breakMinutes=args.break_minutes;
    if(a===null||b===null||!finite(breakMinutes)||breakMinutes<0||breakMinutes>1440)return failure('Invalid shift inputs');
    const minutes=(b-a+1440)%1440;if(minutes===0)return failure('Start and end times are identical; specify a nonzero shift');
    if(breakMinutes>minutes)return failure('Break exceeds shift duration');
    return {shiftHours:round(minutes/60),paidHours:round((minutes-breakMinutes)/60),overnight:b<a,disclaimer:'Clock-time calculation; does not handle daylight-saving transitions.'};
  }
  if(name==='date_offset'){
    const {date,days}=args;
    if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(days)||Math.abs(days)>365000)return failure('Invalid date offset inputs');
    const [y,m,d]=date.split('-').map(Number);const t=Date.UTC(y,m-1,d);const check=new Date(t);
    if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d)return failure('Invalid calendar date');
    const out=new Date(t+days*86400000);if(out.getUTCFullYear()<100||out.getUTCFullYear()>9999)return failure('Date outside supported range');
    return {date:out.toISOString().slice(0,10),days};
  }
  if(name==='split_expense'){
    const {subtotal,tip_percent,people}=args;
    if(!finite(subtotal)||subtotal<0||!finite(tip_percent)||tip_percent<0||tip_percent>100||!Number.isInteger(people)||people<1||people>10000)return failure('Invalid expense split inputs');
    const tip=subtotal*tip_percent/100;return {tip:round(tip),total:round(subtotal+tip),perPerson:round((subtotal+tip)/people),disclaimer:'Rounding may create a small difference when collected per person.'};
  }
  if(name==='text_statistics'){
    if(typeof args.text!=='string'||args.text.length>10000)return failure('Text must be at most 10000 characters');
    const trimmed=args.text.trim();return {characters:args.text.length,words:trimmed?trimmed.split(/\s+/u).length:0,lines:args.text?args.text.split(/\r\n|\r|\n/).length:0};
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
export const DIRECT_TOOLS = new Set(['force_newton','torque_newton_meter','pressure_pascal','mechanical_power','kinetic_energy','ohms_law','statistics_summary','pace_calculator','time_duration','reading_time','calculate','convert_units','date_difference','estimate_overtime_pay','savings_projection','percentage_change','loan_payment','goal_timeline','compound_growth','budget_summary','fuel_trip_estimate','work_shift_hours','date_offset','split_expense','text_statistics']);
