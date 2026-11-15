// XENO v0.8.0 — bounded multi-round tool execution. No arbitrary code or external actions.
export const TOOL_ENGINE_VERSION='0.9.0';
const MAX_ROUNDS=4, MAX_CALLS=8, MAX_PER_ROUND=3;
const MAX_ARGUMENT_BYTES=2000;
const MAX_RESULT_BYTES=3500;
const MAX_REPLY_CHARS=16000;
const safeString=x=>JSON.stringify(x).slice(0,MAX_RESULT_BYTES);
const err=(error,status=502)=>({error,status});
export async function executeAgentLoop({messages,model,apiKey,toolSchemas,runTool,fetchFn}){
  const allowed=new Set(toolSchemas.map(x=>x.function.name));
  const conversation=[...messages];
  const proposals=[],toolActivity=[];
  let total=0;
  const headers={Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'};
  for(let round=1;round<=MAX_ROUNDS;round++){
    const response=await fetchFn('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers,
      body:JSON.stringify({model,messages:conversation,max_completion_tokens:1024,
        ...(total<MAX_CALLS?{tools:toolSchemas,tool_choice:'auto'}:{})})
    });
    if(!response.ok) return err(response.status===429?'AI rate limit reached':'AI provider unavailable',response.status===429?429:502);
    const data=await response.json();
    const answer=data?.choices?.[0]?.message;
    if(!answer) return err('Empty AI response');
    const calls=answer.tool_calls;
    if(!Array.isArray(calls)||calls.length===0){
      if(typeof answer.content!=='string'||!answer.content.trim())return err('Empty AI response');
      const pending=proposals.length?'\n\nTask proposal pending — open Tools to review and approve it.':'';
      return {reply:answer.content.slice(0,MAX_REPLY_CHARS)+pending,proposals,toolActivity,
        execution:{version:TOOL_ENGINE_VERSION,rounds:round,toolCalls:total,completed:true,limitReached:false}};
    }
    if(calls.length>MAX_PER_ROUND||total+calls.length>MAX_CALLS)return err('Tool execution limit exceeded');
    // Never execute a partial or malformed batch.
    const parsed=[];
    const ids=new Set();
    for(const call of calls){
      if(call?.type!=='function'||typeof call.id!=='string'||!call.id||ids.has(call.id)||
        typeof call.function?.name!=='string'||!allowed.has(call.function.name)||
        typeof call.function.arguments!=='string'||call.function.arguments.length>MAX_ARGUMENT_BYTES)
        return err('Invalid or unauthorized AI tool request');
      ids.add(call.id);
      let args;try{args=JSON.parse(call.function.arguments)}catch{return err('Invalid AI tool arguments')}
      if(!args||typeof args!=='object'||Array.isArray(args))return err('Invalid AI tool arguments');
      parsed.push({id:call.id,name:call.function.name,args,raw:call.function.arguments});
    }
    conversation.push({role:'assistant',content:typeof answer.content==='string'?answer.content:null,
      tool_calls:parsed.map(c=>({id:c.id,type:'function',function:{name:c.name,arguments:c.raw}}))});
    for(const call of parsed){
      let result;
      try{result=runTool(call.name,call.args)}catch{result={error:'Tool execution failed'}}
      if(result?.proposal)proposals.push(result.proposal);
      toolActivity.push({tool:call.name,success:!result?.error,description:result?.error||result?.message||'Executed',round});
      conversation.push({role:'tool',tool_call_id:call.id,content:safeString(result)});
      total++;
    }
    // The final round must still permit a synthesis answer, not silently drop results.
    if(round===MAX_ROUNDS){
      const synthesis=await fetchFn('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',headers,body:JSON.stringify({model,messages:[...conversation,{role:'system',content:'Tool execution budget reached. Summarize the verified results. Do not call tools or claim incomplete actions succeeded.'}],max_completion_tokens:1024})
      });
      if(!synthesis.ok)return err(synthesis.status===429?'AI rate limit reached':'AI provider unavailable',synthesis.status===429?429:502);
      const final=(await synthesis.json())?.choices?.[0]?.message?.content;
      if(typeof final!=='string'||!final.trim())return err('Empty AI response');
      return {reply:final.slice(0,MAX_REPLY_CHARS)+(proposals.length?'\n\nTask proposal pending — open Tools to review and approve it.':''),proposals,toolActivity,
        execution:{version:TOOL_ENGINE_VERSION,rounds:round,toolCalls:total,completed:true,limitReached:true}};
    }
  }
  return err('Tool execution limit reached');
}
