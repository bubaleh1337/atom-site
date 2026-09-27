const buckets = new Map();
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function clean(v,max=300){return String(v??'').trim().replace(/[\u0000-\u001F\u007F]/g,'').slice(0,max)}
function ipOf(req){return clean((req.headers['x-forwarded-for']||'').split(',')[0]||req.socket?.remoteAddress||'unknown',80)}
function limited(ip){const now=Date.now(),windowMs=15*60*1000,max=5;const arr=(buckets.get(ip)||[]).filter(t=>now-t<windowMs);if(arr.length>=max)return true;arr.push(now);buckets.set(ip,arr);return false}
async function saveSupabase(row){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error('Database is not configured');const r=await fetch(`${url.replace(/\/$/,'')}/rest/v1/atom_website_leads`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(row)});if(!r.ok)throw new Error(`DB ${r.status}`);return (await r.json())[0]}
async function sendTelegram(row,id){const token=process.env.TELEGRAM_BOT_TOKEN,chat=process.env.TELEGRAM_CHAT_ID;if(!token||!chat)return false;const text=`🆕 Новая заявка с atom.com.kz\n\n👤 ${row.name}\n📞 ${row.phone}\n🧰 ${row.service}\n💬 ${row.message||'—'}\n🌐 ${row.locale||'—'}\n🆔 ${id}`;const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text,disable_web_page_preview:true})});return r.ok}
async function sendEmail(row,id){const key=process.env.RESEND_API_KEY,from=process.env.LEADS_EMAIL_FROM,to=process.env.LEADS_EMAIL_TO||'Atom.pr@inbox.ru';if(!key||!from)return false;const html=`<h2>Новая заявка с atom.com.kz</h2><p><b>Имя:</b> ${esc(row.name)}</p><p><b>Телефон:</b> ${esc(row.phone)}</p><p><b>Услуга:</b> ${esc(row.service)}</p><p><b>Комментарий:</b> ${esc(row.message||'—')}</p><p><b>Язык:</b> ${esc(row.locale||'—')}</p><p><b>ID:</b> ${esc(id)}</p>`;const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`ATOM: новая заявка — ${row.service}`,html})});return r.ok}
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'})}
  const ip=ipOf(req);if(limited(ip))return res.status(429).json({error:'Too many requests'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
    if(clean(b.website,100))return res.status(200).json({ok:true});
    const started=Number(b.startedAt||0);if(started&&Date.now()-started<1200)return res.status(400).json({error:'Too fast'});
    const row={name:clean(b.name,80),phone:clean(b.phone,30),service:clean(b.service,120),message:clean(b.message,1200),locale:clean(b.locale,10),page_url:clean(b.pageUrl,1000),referrer:clean(b.referrer,1000),utm_source:clean(b.utm_source,200),utm_medium:clean(b.utm_medium,200),utm_campaign:clean(b.utm_campaign,200),utm_term:clean(b.utm_term,200),utm_content:clean(b.utm_content,200),consent:b.consent==='yes'};
    if(!row.name||!row.phone||!row.service||!row.consent)return res.status(400).json({error:'Missing required fields'});
    if(!/^[+0-9()\-\s]{7,30}$/.test(row.phone))return res.status(400).json({error:'Invalid phone'});
    const saved=await saveSupabase(row);const id=saved?.id||'—';
    const settled=await Promise.allSettled([sendTelegram(row,id),sendEmail(row,id)]);
    return res.status(200).json({ok:true,id,notifications:settled.map(x=>x.status==='fulfilled'&&x.value)});
  }catch(e){console.error('lead error',e);return res.status(500).json({error:'Server error'})}
}
