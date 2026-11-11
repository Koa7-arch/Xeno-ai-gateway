// XENO Mobile v0.2 - Cloudflare Worker gateway
// Configure GROQ_API_KEY, XENO_ACCESS_TOKEN, and ALLOWED_ORIGIN in Cloudflare.
const providers = {
  groq: { endpoint: 'https://api.groq.com/openai/v1/chat/completions', model: 'openai/gpt-oss-20b' }
};
const reply = (data, status=200, headers={}) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json','cache-control':'no-store',...headers}});
export default {
 async fetch(request, env) {
  const url = new URL(request.url);
  if(url.pathname === '/health' && request.method === 'GET') return reply({application:'XENO AI Gateway',status:'online',version:'0.2',providers:['groq']});
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGIN;
  const cors = {'Access-Control-Allow-Origin':allowed || 'null','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'POST, OPTIONS',Vary:'Origin'};
  if(request.method === 'OPTIONS') return new Response(null,{status: allowed && origin === allowed ? 204 : 403, headers:allowed && origin === allowed ? cors : {}});
  if(url.pathname !== '/chat' || request.method !== 'POST') return reply({error:'Not found'},404,cors);
  if(!allowed || origin !== allowed) return reply({error:'Origin not allowed'},403,cors);
  if(!env.XENO_ACCESS_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.XENO_ACCESS_TOKEN}`) return reply({error:'Unauthorized'},401,cors);
  if(!env.GROQ_API_KEY) return reply({error:'Groq not configured'},503,cors);
  let body;
  try {const raw = await request.text(); if(raw.length > 24000) return reply({error:'Request too large'},413,cors); body=JSON.parse(raw);} catch {return reply({error:'Invalid JSON'},400,cors);}
  if(body.provider && body.provider !== 'groq') return reply({error:'Provider unavailable'},400,cors);
  if(!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 20 || !body.messages.every(m => m && ['user','assistant'].includes(m.role) && typeof m.content === 'string' && m.content.length > 0 && m.content.length <= 4000)) return reply({error:'Invalid messages'},400,cors);
  try {
   const upstream=await fetch(providers.groq.endpoint,{method:'POST',headers:{Authorization:`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:providers.groq.model,messages:[{role:'system',content:'You are XENO, a helpful personal AI assistant. Be clear, accurate and practical.'},...body.messages],max_completion_tokens:1024})});
   if(!upstream.ok) return reply({error:upstream.status===429?'AI rate limit reached':'AI provider unavailable'},upstream.status===429?429:502,cors);
   const data=await upstream.json(); const content=data.choices?.[0]?.message?.content;
   if(typeof content !== 'string' || !content) return reply({error:'Empty AI response'},502,cors);
   return reply({provider:'groq',reply:content},200,cors);
  } catch {return reply({error:'Gateway request failed'},502,cors);}
 }
};
