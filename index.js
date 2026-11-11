// XENO Mobile v0.3 - single-origin Cloudflare Access protected PWA + Groq gateway.
// Required secrets: GROQ_API_KEY; required text vars: ACCESS_TEAM_DOMAIN, ACCESS_AUD.
// Cloudflare Access application MUST protect all Worker production and preview URLs.
const model = 'openai/gpt-oss-20b';
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}
});
function decode64url(s) {
  const base64 = s.replace(/-/g,'+').replace(/_/g,'/');
  return Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length/4)*4,'=')), c => c.charCodeAt(0));
}
async function verifyAccess(request, env) {
  const domain = (env.ACCESS_TEAM_DOMAIN || '').trim().replace(/^https?:\/\//,'').replace(/\/$/,'');
  const audience = (env.ACCESS_AUD || '').trim();
  if (!domain || !audience || !/^[-a-z0-9.]+\.cloudflareaccess\.com$/i.test(domain)) throw Error('Access not configured');
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  let header, payload;
  try { header=JSON.parse(new TextDecoder().decode(decode64url(parts[0]))); payload=JSON.parse(new TextDecoder().decode(decode64url(parts[1]))); }
  catch { return false; }
  const issuer = `https://${domain}`;
  const now = Math.floor(Date.now()/1000);
  if (header.alg !== 'RS256' || typeof header.kid !== 'string' || payload.iss !== issuer ||
      !Array.isArray(payload.aud) || !payload.aud.includes(audience) ||
      typeof payload.exp !== 'number' || payload.exp <= now ||
      typeof payload.nbf === 'number' && payload.nbf > now ||
      typeof payload.iat === 'number' && payload.iat > now + 60) return false;
  const keysResponse = await fetch(`${issuer}/cdn-cgi/access/certs`, {cf:{cacheTtl:300,cacheEverything:true}});
  if (!keysResponse.ok) throw Error('Access key retrieval failed');
  const keys = await keysResponse.json();
  const jwk = keys.keys?.find(k=>k.kid===header.kid && k.kty==='RSA' && k.alg==='RS256');
  if (!jwk) return false;
  const key = await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5',key,decode64url(parts[2]),new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
}
export default {
  async fetch(request,env) {
    const url = new URL(request.url);
    // Fail closed until the Access verifier is configured; no public assets or API.
    if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return json({error:'Access verification not configured'},503);
    let authorized;
    try { authorized = await verifyAccess(request,env); }
    catch { return json({error:'Access verification unavailable'},503); }
    if (!authorized) return json({error:'Unauthorized'},401);
    if (url.pathname==='/health' && request.method==='GET') return json({application:'XENO AI Gateway',status:'online',version:'0.3',providers:['groq']});
    if (url.pathname==='/chat') {
      if (request.method!=='POST') return json({error:'Method not allowed'},405);
      if (request.headers.get('Origin') !== url.origin) return json({error:'Origin not allowed'},403);
      if (!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json')) return json({error:'Expected JSON'},415);
      if (!env.GROQ_API_KEY) return json({error:'Groq not configured'},503);
      let body;
      try {const raw=await request.text();if(raw.length>24000)return json({error:'Request too large'},413);body=JSON.parse(raw);}catch{return json({error:'Invalid JSON'},400);}
      if (body.provider && body.provider!=='groq') return json({error:'Provider unavailable'},400);
      if (!Array.isArray(body.messages) || body.messages.length<1 || body.messages.length>20 || !body.messages.every(m=>m && ['user','assistant'].includes(m.role) && typeof m.content==='string' && m.content.length>0 && m.content.length<=4000)) return json({error:'Invalid messages'},400);
      try {
        const upstream=await fetch('https://api.groq.com/openai/v1/chat/completions',{
          method:'POST',headers:{Authorization:`Bearer ${env.GROQ_API_KEY}`,'Content-Type':'application/json'},
          body:JSON.stringify({model,messages:[{role:'system',content:'You are XENO, a helpful personal AI assistant. Be clear, accurate and practical.'},...body.messages],max_completion_tokens:1024})
        });
        if(!upstream.ok)return json({error:upstream.status===429?'AI rate limit reached':'AI provider unavailable'},upstream.status===429?429:502);
        const data=await upstream.json();const content=data.choices?.[0]?.message?.content;
        if(typeof content!=='string'||!content)return json({error:'Empty AI response'},502);
        return json({provider:'groq',reply:content});
      }catch{return json({error:'Gateway request failed'},502);}
    }
    if (request.method!=='GET' && request.method!=='HEAD') return json({error:'Method not allowed'},405);
    return env.ASSETS.fetch(request);
  }
};
