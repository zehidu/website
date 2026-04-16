// ── AUTH ──
if(!localStorage.getItem('af_auth'))location.href='login.html';
function logout(){localStorage.removeItem('af_auth');location.href='login.html';}

// ── CHARTS ──
const CI={};
function mk(id,cfg){if(CI[id])CI[id].destroy();const c=document.getElementById(id);if(c)CI[id]=new Chart(c,cfg);}
function destroyAll(){Object.values(CI).forEach(c=>c.destroy());Object.keys(CI).forEach(k=>delete CI[k]);}
const GR={responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#6b7280',font:{size:10}}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#6b7280',font:{size:10}}}}};
const DR={responsive:true,plugins:{legend:{position:'right',labels:{color:'#9ca3af',font:{size:10},boxWidth:8,padding:10}}}};

// ── DATA DEFAULTS ──
const ONBOARD=['Contract signed','Credentials shared','Discovery call done','First automation built','Client review & approval','Go live','30-day check-in'];
const DL=[
  {id:1,name:'Marcus Rivera',email:'marcus@nexora.com',company:'Nexora Logistics',phone:'',size:'21–100',industry:'Logistics',value:1497,timeline:'Immediately',source:'Website form',status:'won',notes:'Full ops automation',date:'2025-03-10'},
  {id:2,name:'Sofia Lim',email:'sofia@vaultpay.io',company:'VaultPay',phone:'',size:'6–20',industry:'Fintech',value:997,timeline:'Immediately',source:'Referral',status:'won',notes:'Invoice automation',date:'2025-03-15'},
  {id:3,name:'Daniel Kim',email:'d.kim@coretek.com',company:'CoreTek',phone:'',size:'21–100',industry:'Tech',value:2497,timeline:'Immediately',source:'LinkedIn',status:'won',notes:'Enterprise project',date:'2025-03-22'},
  {id:4,name:'Ava Thompson',email:'ava@striplex.co',company:'Striplex',phone:'',size:'6–20',industry:'E-commerce',value:997,timeline:'1–3 months',source:'Website form',status:'proposal',notes:'Waiting on decision',date:'2025-04-01'},
  {id:5,name:'James Ortega',email:'james@orbisco.com',company:'Orbis Co.',phone:'',size:'1–5',industry:'Consulting',value:497,timeline:'3–6 months',source:'Cold outreach',status:'contacted',notes:'Intro call done',date:'2025-04-05'},
  {id:6,name:'Priya Nair',email:'priya@zenrift.io',company:'ZenRift',phone:'',size:'6–20',industry:'SaaS',value:997,timeline:'1–3 months',source:'Website form',status:'new',notes:'From contact form',date:'2025-04-12'},
  {id:7,name:'Riley Shaw',email:'riley@shaw.com',company:'Shaw Mkt.',phone:'',size:'6–20',industry:'Marketing',value:997,timeline:'1–3 months',source:'Referral',status:'qualified',notes:'Needs proposal',date:'2025-04-14'},
  {id:8,name:'Tom Blake',email:'tom@blake.com',company:'Blake Co.',phone:'',size:'1–5',industry:'Agency',value:497,timeline:'6+ months',source:'Event',status:'lost',notes:'Budget',date:'2025-04-08'},
];
const DC=[
  {id:1,company:'Nexora Logistics',contact:'Marcus Rivera',email:'marcus@nexora.com',phone:'',plan:'Pro',mrr:1497,status:'active',since:'2025-03-20',health:92,notes:'',onboarding:[true,true,true,true,true,true,true]},
  {id:2,company:'VaultPay',contact:'Sofia Lim',email:'sofia@vaultpay.io',phone:'',plan:'Growth',mrr:997,status:'active',since:'2025-03-28',health:85,notes:'',onboarding:[true,true,true,true,true,true,false]},
  {id:3,company:'CoreTek Solutions',contact:'Daniel Kim',email:'d.kim@coretek.com',phone:'',plan:'Enterprise',mrr:2497,status:'active',since:'2025-04-01',health:60,notes:'',onboarding:[true,true,true,true,false,false,false]},
  {id:4,company:'Striplex',contact:'Ava Thompson',email:'ava@striplex.co',phone:'',plan:'Starter',mrr:497,status:'inactive',since:'2025-02-10',health:28,notes:'',onboarding:[true,true,false,false,false,false,false]},
];
const DP=[
  {id:1,name:'CRM Lead Sync',client:'Nexora Logistics',type:'Sales & CRM',status:'live',deadline:'2025-03-30',notes:'',tasks:[{id:1,text:'Map lead fields',done:true},{id:2,text:'Slack integration',done:true},{id:3,text:'Testing',done:true},{id:4,text:'Go-live sign-off',done:true}]},
  {id:2,name:'Invoice Automation',client:'VaultPay',type:'Finance',status:'live',deadline:'2025-04-05',notes:'',tasks:[{id:1,text:'QuickBooks API',done:true},{id:2,text:'Invoice trigger',done:true},{id:3,text:'Email delivery',done:true}]},
  {id:3,name:'Full Ops Workflow',client:'CoreTek Solutions',type:'Sales & CRM',status:'progress',deadline:'2025-05-15',notes:'',tasks:[{id:1,text:'Process audit',done:true},{id:2,text:'CRM integration',done:true},{id:3,text:'HR system',done:false},{id:4,text:'Finance sync',done:false},{id:5,text:'QA testing',done:false}]},
  {id:4,name:'HR Onboarding Flow',client:'Nexora Logistics',type:'HR & Onboarding',status:'testing',deadline:'2025-04-30',notes:'',tasks:[{id:1,text:'HRIS credentials',done:true},{id:2,text:'Doc collection',done:true},{id:3,text:'E-signature',done:true},{id:4,text:'Manager alerts',done:false}]},
  {id:5,name:'Campaign Automation',client:'VaultPay',type:'Marketing',status:'planning',deadline:'2025-05-30',notes:'',tasks:[{id:1,text:'Audience segments',done:false},{id:2,text:'Email sequences',done:false},{id:3,text:'SMS triggers',done:false}]},
];
const DPR=[
  {id:1,num:'PROP-001',leadName:'Ava Thompson',company:'Striplex',svcs:[{name:'Sales & CRM Automation',price:497},{name:'Marketing Automation',price:497}],total:994,discount:0,status:'sent',notes:'Follow up Apr 20',createdAt:'2025-04-02',validUntil:'2025-04-30'},
  {id:2,num:'PROP-002',leadName:'Riley Shaw',company:'Shaw Mkt.',svcs:[{name:'Marketing Automation',price:497}],total:497,discount:0,status:'draft',notes:'',createdAt:'2025-04-14',validUntil:'2025-05-14'},
  {id:3,num:'PROP-003',leadName:'Marcus Rivera',company:'Nexora',svcs:[{name:'Sales & CRM',price:497},{name:'HR & Onboarding',price:497},{name:'Data & Reporting',price:497}],total:1491,discount:0,status:'accepted',notes:'Converted',createdAt:'2025-03-12',validUntil:'2025-03-31'},
];
const DSV=[
  {id:1,name:'Sales & CRM Automation',desc:'Lead routing, follow-ups, pipeline sync',price:497,type:'Sales & CRM',active:true},
  {id:2,name:'Invoicing & Finance',desc:'Auto invoices, reminders, accounting sync',price:497,type:'Finance',active:true},
  {id:3,name:'HR & Onboarding',desc:'Screening, checklists, e-signatures',price:497,type:'HR & Onboarding',active:true},
  {id:4,name:'Customer Support AI',desc:'AI chatbot, ticket routing, auto-replies',price:497,type:'Customer Support',active:true},
  {id:5,name:'Marketing Automation',desc:'Campaigns, segmentation, nurture flows',price:497,type:'Marketing',active:true},
  {id:6,name:'Data & Reporting',desc:'Dashboards, scheduled reports, alerts',price:497,type:'Data & Reporting',active:true},
  {id:7,name:'Full-Stack Automation',desc:'Complete business automation package',price:1497,type:'Custom',active:true},
];
const DI=[
  {id:1,num:'INV-001',client:'Nexora Logistics',amount:1497,status:'paid',due:'2025-04-01',notes:''},
  {id:2,num:'INV-002',client:'VaultPay',amount:997,status:'paid',due:'2025-04-05',notes:''},
  {id:3,num:'INV-003',client:'CoreTek Solutions',amount:2497,status:'pending',due:'2025-04-30',notes:''},
  {id:4,num:'INV-004',client:'Nexora Logistics',amount:1497,status:'pending',due:'2025-05-01',notes:''},
  {id:5,num:'INV-005',client:'Striplex',amount:497,status:'overdue',due:'2025-03-15',notes:''},
];

// ── STORAGE ──
const g=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d;}catch{return d;}};
const s=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const getLeads=()=>g('af_leads',DL), getClients=()=>g('af_clients',DC), getProjects=()=>g('af_projects',DP);
const getProposals=()=>g('af_proposals',DPR), getServices=()=>g('af_services',DSV), getInvoices=()=>g('af_invoices',DI);
const getEvents=()=>g('af_events',[]);

// ── SCORING ──
function score(l){let s=0;if(l.size==='100+')s+=40;else if(l.size==='21–100')s+=30;else if(l.size==='6–20')s+=20;else if(l.size)s+=10;if(l.timeline==='Immediately')s+=35;else if(l.timeline==='1–3 months')s+=20;else if(l.timeline==='3–6 months')s+=10;else if(l.timeline)s+=5;if((l.value||0)>=1497)s+=25;else if((l.value||0)>=997)s+=15;else if((l.value||0)>0)s+=5;return Math.min(s,100);}
function scoreBadge(n){if(n>=70)return`<span style="color:#f87171" class="text-xs font-bold">🔥${n}</span>`;if(n>=40)return`<span style="color:#fbbf24" class="text-xs font-bold">☀${n}</span>`;return`<span style="color:#60a5fa" class="text-xs font-bold">❄${n}</span>`;}

// ── BADGES ──
const SL={new:'New',contacted:'Contacted',qualified:'Qualified',proposal:'Proposal',won:'Won',lost:'Lost',paid:'Paid',pending:'Pending',overdue:'Overdue',draft:'Draft',sent:'Sent',accepted:'Accepted',rejected:'Rejected',active:'Active',inactive:'Inactive',planning:'Planning',progress:'In Progress',testing:'Testing',live:'Live'};
const BC={new:'#1e3a5f',contacted:'#1a2e1a',qualified:'#2d1f6e',proposal:'#3a2200',won:'#1a3a2e',lost:'#2d1a1a',paid:'#1a3a2e',pending:'#2d2200',overdue:'#2d1a1a',draft:'#1f2937',sent:'#1e3a5f',accepted:'#1a3a2e',rejected:'#2d1a1a',active:'#1a3a2e',inactive:'#1f2937',planning:'#1e2a3a',progress:'#2d1f6e',testing:'#3a2200',live:'#1a3a2e'};
const TC={new:'#60a5fa',contacted:'#4ade80',qualified:'#a78bfa',proposal:'#fb923c',won:'#34d399',lost:'#f87171',paid:'#34d399',pending:'#fbbf24',overdue:'#f87171',draft:'#9ca3af',sent:'#60a5fa',accepted:'#34d399',rejected:'#f87171',active:'#34d399',inactive:'#9ca3af',planning:'#60a5fa',progress:'#a78bfa',testing:'#fbbf24',live:'#34d399'};
function badge(st){return`<span style="background:${BC[st]||'#1f2937'};color:${TC[st]||'#9ca3af'}" class="text-xs px-2.5 py-1 rounded-full font-semibold">${SL[st]||st}</span>`;}

// ── NAV ──
const PT={overview:'Overview',pipeline:'Lead Pipeline',clients:'Clients',projects:'Projects',proposals:'Proposals',invoices:'Invoices',services:'Service Catalog',analytics:'Analytics',settings:'Settings'};
function nav(n){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('section-'+n).classList.add('active');
  const b=document.querySelector(`[data-s="${n}"]`);if(b)b.classList.add('active');
  document.getElementById('page-title').textContent=PT[n];
  destroyAll();
  const map={overview:renderOverview,pipeline:renderPipeline,clients:renderClients,projects:()=>renderProjects('all'),proposals:renderProposals,invoices:renderInvoices,services:renderServices,analytics:renderAnalytics};
  if(map[n])map[n]();
}

// ── MONTH HELPERS ──
function last6(){const m=[];for(let i=5;i>=0;i--){const d=new Date();d.setMonth(d.getMonth()-i);d.setDate(1);m.push(d);}return m;}
function mStr(d){return d.toLocaleDateString('en-US',{month:'short',year:'2-digit'});}

// ── OVERVIEW ──
function renderOverview(){
  const leads=getLeads(),clients=getClients(),projects=getProjects();
  const mo=new Date().toISOString().slice(0,7);
  const newL=leads.filter(l=>l.date&&l.date.startsWith(mo)).length;
  const active=clients.filter(c=>c.status==='active');
  const mrr=active.reduce((a,c)=>a+c.mrr,0);
  const conv=leads.length?Math.round(leads.filter(l=>l.status==='won').length/leads.length*100):0;
  document.getElementById('kpi-leads').textContent=newL;
  document.getElementById('kpi-clients').textContent=active.length;
  document.getElementById('kpi-mrr').textContent='$'+mrr.toLocaleString();
  document.getElementById('kpi-conv').textContent=conv+'%';
  const newCount=leads.filter(l=>l.status==='new').length;
  const pb=document.getElementById('pipe-badge');if(pb){pb.textContent=newCount;pb.classList.toggle('hidden',!newCount);}
  const nd=document.getElementById('notif-dot');if(nd)nd.classList.toggle('hidden',!newCount);
  // MRR chart
  const months=last6();
  setTimeout(()=>{
    mk('chart-mrr',{type:'line',data:{labels:months.map(mStr),datasets:[{data:months.map(m=>clients.filter(c=>c.status==='active'&&c.since&&new Date(c.since)<=m).reduce((a,c)=>a+c.mrr,0)),borderColor:'#6366f1',backgroundColor:'rgba(99,102,241,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#6366f1',pointRadius:3}]},options:{...GR}});
    const st=['new','contacted','qualified','proposal','won','lost'];
    mk('chart-pipe',{type:'doughnut',data:{labels:st.map(x=>SL[x]),datasets:[{data:st.map(x=>leads.filter(l=>l.status===x).length),backgroundColor:st.map(x=>BC[x]),borderColor:st.map(x=>TC[x]),borderWidth:2}]},options:{...DR}});
  },50);
  // Recent leads
  const recent=[...leads].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  document.getElementById('ov-leads').innerHTML=recent.map(l=>`<div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0"><div><div class="text-sm font-medium">${l.name}</div><div class="text-xs text-gray-500">${l.company||'—'}</div></div><div class="flex items-center gap-2">${scoreBadge(score(l))}${badge(l.status)}</div></div>`).join('');
  // Open tasks
  const tasks=[];projects.forEach(p=>p.tasks.filter(t=>!t.done).forEach(t=>tasks.push({t:t.text,p:p.name})));
  document.getElementById('ov-tasks').innerHTML=tasks.slice(0,5).map(x=>`<div class="flex gap-2 py-2 border-b border-white/5 last:border-0 text-sm"><span class="text-gray-600">○</span><span>${x.t} <span class="text-gray-600 text-xs">— ${x.p}</span></span></div>`).join('')||'<p class="text-gray-600 text-sm py-4 text-center">All tasks complete ✓</p>';
}

// ── PIPELINE / KANBAN ──
let dragId=null;
function renderPipeline(){
  const leads=getLeads();
  ['new','contacted','qualified','proposal','won','lost'].forEach(st=>{
    const col=leads.filter(l=>l.status===st);
    const cnt=document.getElementById('cn-'+st); if(cnt)cnt.textContent=col.length;
    const cards=document.getElementById('cards-'+st); if(!cards)return;
    cards.innerHTML=col.map(l=>`<div class="kanban-card" draggable="true" ondragstart="dStart(event,${l.id})" ondragend="dEnd(event)" onclick="openLeadDetail(${l.id})">
      <div class="flex justify-between mb-1"><span class="font-semibold text-xs">${l.name}</span>${scoreBadge(score(l))}</div>
      <div class="text-xs text-gray-500 mb-1">${l.company||'—'}</div>
      ${l.value?`<div class="text-xs font-bold" style="color:#34d399">$${l.value.toLocaleString()}/mo</div>`:''}
      ${l.timeline?`<div class="text-xs text-gray-600">${l.timeline}</div>`:''}
    </div>`).join('');
  });
}
function dStart(e,id){dragId=id;setTimeout(()=>e.target.classList.add('dragging'),0);}
function dEnd(e){e.target.classList.remove('dragging');}
function colOver(e){e.preventDefault();e.currentTarget.classList.add('drag-over');}
function colLeave(e){e.currentTarget.classList.remove('drag-over');}
function colDrop(e,st){
  e.preventDefault();e.currentTarget.classList.remove('drag-over');
  if(dragId===null)return;
  const leads=getLeads(),l=leads.find(x=>x.id===dragId);
  if(l&&l.status!==st){l.status=st;s('af_leads',leads);renderPipeline();renderOverview();showToast('Moved to '+SL[st]);
    if(st==='won')setTimeout(()=>{if(confirm(`${l.name} won! Create client account?`))openCreateClient(l);},100);}
  dragId=null;
}
function openCreateClient(l){
  clearModal('m-client'); document.getElementById('m-client-title').textContent='Create Client';
  document.getElementById('c-company').value=l.company||'';document.getElementById('c-contact').value=l.name;
  document.getElementById('c-email').value=l.email;document.getElementById('c-mrr').value=l.value||497;
  openModal('m-client');
}
function openLeadDetail(id){
  const l=getLeads().find(x=>x.id===id);if(!l)return;
  document.getElementById('ld-name').textContent=l.name;
  document.getElementById('ld-body').innerHTML=`
    <div class="grid grid-cols-2 gap-3 text-sm mb-4">
      <div><div class="text-xs text-gray-500">Email</div><div>${l.email}</div></div>
      <div><div class="text-xs text-gray-500">Company</div><div>${l.company||'—'}</div></div>
      <div><div class="text-xs text-gray-500">Team Size</div><div>${l.size||'—'}</div></div>
      <div><div class="text-xs text-gray-500">Timeline</div><div>${l.timeline||'—'}</div></div>
      <div><div class="text-xs text-gray-500">Est. Value</div><div style="color:#34d399" class="font-bold">${l.value?'$'+l.value+'/mo':'—'}</div></div>
      <div><div class="text-xs text-gray-500">Source</div><div>${l.source||'—'}</div></div>
    </div>
    ${l.notes?`<div class="text-sm text-gray-300 bg-gray-800/40 rounded-xl p-3 mb-4">${l.notes}</div>`:''}
    <div class="flex gap-2 flex-wrap">
      <button onclick="editLead(${id})" class="text-xs bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-2 rounded-lg font-semibold">Edit</button>
      <button onclick="openCreateClient(getLeads().find(x=>x.id===${id}))" class="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold">Convert → Client</button>
      <button onclick="deleteLead(${id})" class="text-xs bg-red-900/50 text-red-300 px-3 py-2 rounded-lg font-semibold">Delete</button>
    </div>`;
  openModal('m-lead-detail');
}

// ── LEAD CRUD ──
function editLead(id){const l=getLeads().find(x=>x.id===id);if(!l)return;document.getElementById('l-id').value=id;document.getElementById('m-lead-title').textContent='Edit Lead';['name','email','company','phone','size','industry','timeline','source','status','notes'].forEach(f=>{const el=document.getElementById('l-'+f);if(el)el.value=l[f]||'';});document.getElementById('l-value').value=l.value||'';closeModal('m-lead-detail');openModal('m-lead');}
function saveLead(){
  const name=document.getElementById('l-name').value.trim(),email=document.getElementById('l-email').value.trim();
  if(!name||!email){alert('Name and email required.');return;}
  const leads=getLeads(),eid=parseInt(document.getElementById('l-id').value);
  const d={name,email,company:document.getElementById('l-company').value.trim(),phone:document.getElementById('l-phone').value.trim(),size:document.getElementById('l-size').value,industry:document.getElementById('l-industry').value.trim(),value:parseInt(document.getElementById('l-value').value)||0,timeline:document.getElementById('l-timeline').value,source:document.getElementById('l-source').value,status:document.getElementById('l-status').value,notes:document.getElementById('l-notes').value.trim(),date:new Date().toISOString().slice(0,10)};
  if(eid){const i=leads.findIndex(l=>l.id===eid);leads[i]={...leads[i],...d};}else{d.id=Date.now();leads.unshift(d);}
  s('af_leads',leads);closeModal('m-lead');renderPipeline();renderOverview();showToast('Lead saved');
}
function deleteLead(id){if(!confirm('Delete lead?'))return;s('af_leads',getLeads().filter(l=>l.id!==id));closeModal('m-lead-detail');renderPipeline();renderOverview();showToast('Deleted');}

// ── CLIENTS ──
function renderClients(){
  const clients=getClients(),active=clients.filter(c=>c.status==='active');
  document.getElementById('cs-total').textContent=clients.length;
  document.getElementById('cs-active').textContent=active.length;
  document.getElementById('cs-mrr').textContent='$'+active.reduce((a,c)=>a+c.mrr,0).toLocaleString();
  document.getElementById('clients-tbody').innerHTML=clients.map(c=>{
    const ob=Array.isArray(c.onboarding)?c.onboarding:new Array(7).fill(false);
    const pct=Math.round(ob.filter(Boolean).length/ONBOARD.length*100);
    const hc=c.health>=80?'#34d399':c.health>=50?'#fbbf24':'#f87171';
    return `<tr class="hover:bg-white/2 transition-colors">
      <td class="px-5 py-3.5"><div class="font-medium text-sm">${c.company}</div><div class="text-xs text-gray-500">${c.contact}</div></td>
      <td class="px-5 py-3.5"><span class="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">${c.plan}</span></td>
      <td class="px-5 py-3.5 font-bold text-sm" style="color:#34d399">$${c.mrr.toLocaleString()}</td>
      <td class="px-5 py-3.5"><div class="flex items-center gap-2"><div style="width:56px;height:6px;background:#1f2937;border-radius:3px"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:3px"></div></div><span class="text-xs text-gray-500">${pct}%</span><button onclick="openOnboard(${c.id})" class="text-xs text-indigo-400 hover:text-indigo-300 ml-1">Manage</button></div></td>
      <td class="px-5 py-3.5 font-bold text-sm" style="color:${hc}">${c.health||0}%</td>
      <td class="px-5 py-3.5">${badge(c.status)}</td>
      <td class="px-5 py-3.5"><button onclick="editClient(${c.id})" class="text-gray-500 hover:text-indigo-400 mr-2 transition-colors text-xs">Edit</button><button onclick="deleteClient(${c.id})" class="text-gray-500 hover:text-red-400 transition-colors text-xs">Del</button></td></tr>`;
  }).join('');
}
function openOnboard(id){
  const c=getClients().find(x=>x.id===id);if(!c)return;
  const ob=Array.isArray(c.onboarding)?c.onboarding:new Array(7).fill(false);
  document.getElementById('ob-title').textContent=c.company+' — Onboarding';
  document.getElementById('ob-cid').value=id;
  document.getElementById('ob-steps').innerHTML=ONBOARD.map((st,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><input type="checkbox" ${ob[i]?'checked':''} style="accent-color:#6366f1;width:16px;height:16px" onchange="toggleOB(${id},${i},this.checked)" /><span style="font-size:0.875rem;color:${ob[i]?'#6b7280':'#d1d5db'};${ob[i]?'text-decoration:line-through':''}">${st}</span></div>`).join('');
  updateOBProgress(ob);openModal('m-onboard');
}
function toggleOB(cid,idx,val){const clients=getClients(),c=clients.find(x=>x.id===cid);if(!c)return;if(!Array.isArray(c.onboarding))c.onboarding=new Array(7).fill(false);c.onboarding[idx]=val;c.health=Math.round(c.onboarding.filter(Boolean).length/ONBOARD.length*100);s('af_clients',clients);updateOBProgress(c.onboarding);renderClients();}
function updateOBProgress(ob){const pct=Math.round(ob.filter(Boolean).length/ONBOARD.length*100);document.getElementById('ob-pct').textContent=pct+'%';document.getElementById('ob-bar').style.width=pct+'%';}
function editClient(id){const c=getClients().find(x=>x.id===id);if(!c)return;document.getElementById('c-id').value=id;document.getElementById('m-client-title').textContent='Edit Client';['company','contact','email','phone','plan','mrr','status','notes'].forEach(f=>{const el=document.getElementById('c-'+f);if(el)el.value=c[f]||'';});openModal('m-client');}
function saveClient(){
  const co=document.getElementById('c-company').value.trim(),cn=document.getElementById('c-contact').value.trim();
  if(!co||!cn){alert('Company and contact required.');return;}
  const clients=getClients(),eid=parseInt(document.getElementById('c-id').value);
  const d={company:co,contact:cn,email:document.getElementById('c-email').value.trim(),phone:document.getElementById('c-phone').value.trim(),plan:document.getElementById('c-plan').value,mrr:parseInt(document.getElementById('c-mrr').value)||0,status:document.getElementById('c-status').value,notes:document.getElementById('c-notes').value.trim(),since:new Date().toISOString().slice(0,10)};
  if(eid){const i=clients.findIndex(c=>c.id===eid);clients[i]={...clients[i],...d};}else{d.id=Date.now();d.health=0;d.onboarding=new Array(7).fill(false);clients.push(d);}
  s('af_clients',clients);closeModal('m-client');renderClients();renderOverview();showToast('Client saved');
}
function deleteClient(id){if(!confirm('Delete client?'))return;s('af_clients',getClients().filter(c=>c.id!==id));renderClients();renderOverview();showToast('Deleted');}

// ── PROJECTS ──
function renderProjects(f){
  const proj=getProjects().filter(p=>f==='all'||p.status===f);
  document.getElementById('projects-grid').innerHTML=proj.map(p=>{
    const done=p.tasks.filter(t=>t.done).length,tot=p.tasks.length,pct=tot?Math.round(done/tot*100):0;
    return `<div style="background:#111827;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px">
      <div style="display:flex;justify-content:space-between;align-items:start"><div><div style="font-weight:700;font-size:0.875rem">${p.name}</div><div style="font-size:0.75rem;color:#6b7280;margin-top:2px">${p.client}</div></div>${badge(p.status)}</div>
      <div style="font-size:0.75rem;color:#6b7280;background:rgba(255,255,255,0.04);padding:4px 12px;border-radius:8px;display:inline-block;align-self:flex-start">${p.type}</div>
      ${p.deadline?`<div style="font-size:0.75rem;color:#6b7280">Due: ${p.deadline}</div>`:''}
      <div><div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#6b7280;margin-bottom:4px"><span>Tasks ${done}/${tot}</span><span>${pct}%</span></div><div style="height:6px;background:#1f2937;border-radius:3px"><div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:3px"></div></div></div>
      <div style="display:flex;gap:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.05)">
        <button onclick="openTasks(${p.id})" style="font-size:0.75rem;background:rgba(99,102,241,0.15);color:#818cf8;padding:6px 12px;border-radius:8px;font-weight:600">Manage Tasks</button>
        <button onclick="deleteProject(${p.id})" style="font-size:0.75rem;color:#6b7280;margin-left:auto" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='#6b7280'">Delete</button>
      </div></div>`;
  }).join('')||'<div style="grid-column:span 3;text-align:center;color:#6b7280;padding:4rem">No projects</div>';
}
function openTasks(id){const p=getProjects().find(x=>x.id===id);if(!p)return;document.getElementById('task-title').textContent=p.name;document.getElementById('task-pid').value=id;renderTasks(p);openModal('m-tasks');}
function renderTasks(p){const done=p.tasks.filter(t=>t.done).length,pct=p.tasks.length?Math.round(done/p.tasks.length*100):0;document.getElementById('task-list').innerHTML=p.tasks.map(t=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><input type="checkbox" ${t.done?'checked':''} style="accent-color:#6366f1;width:15px;height:15px" onchange="toggleTask(${p.id},${t.id},this.checked)" /><span style="font-size:0.875rem;flex:1;color:${t.done?'#6b7280':'#e5e7eb'};${t.done?'text-decoration:line-through':''}">${t.text}</span><button onclick="removeTask(${p.id},${t.id})" style="color:#6b7280;font-size:0.75rem" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='#6b7280'">✕</button></div>`).join('');document.getElementById('task-pct').textContent=pct+'%';document.getElementById('task-bar').style.width=pct+'%';}
function toggleTask(pid,tid,val){const proj=getProjects(),p=proj.find(x=>x.id===pid),t=p&&p.tasks.find(x=>x.id===tid);if(t){t.done=val;s('af_projects',proj);renderTasks(p);renderProjects(document.querySelector('.tab-btn.active')?.dataset?.f||'all');}}
function removeTask(pid,tid){const proj=getProjects(),p=proj.find(x=>x.id===pid);if(!p)return;p.tasks=p.tasks.filter(t=>t.id!==tid);s('af_projects',proj);renderTasks(p);}
function addTask(){const inp=document.getElementById('task-new'),text=inp.value.trim();if(!text)return;const proj=getProjects(),pid=parseInt(document.getElementById('task-pid').value),p=proj.find(x=>x.id===pid);if(!p)return;p.tasks.push({id:Date.now(),text,done:false});s('af_projects',proj);renderTasks(p);inp.value='';}
function saveProject(){const name=document.getElementById('p-name').value.trim();if(!name){alert('Name required.');return;}const proj=getProjects();proj.push({id:Date.now(),name,client:document.getElementById('p-client').value.trim(),type:document.getElementById('p-type').value,status:document.getElementById('p-status').value,deadline:document.getElementById('p-deadline').value,notes:'',tasks:[]});s('af_projects',proj);closeModal('m-project');renderProjects('all');showToast('Project created');}
function deleteProject(id){if(!confirm('Delete?'))return;s('af_projects',getProjects().filter(p=>p.id!==id));renderProjects('all');showToast('Deleted');}

// ── PROPOSALS ──
let propSvcs=[];
function renderProposals(){
  const pr=getProposals(),sent=pr.filter(p=>p.status==='sent').length,acc=pr.filter(p=>p.status==='accepted').length;
  const total=pr.reduce((a,p)=>a+p.total,0);
  document.getElementById('pr-total').textContent='$'+total.toLocaleString();
  document.getElementById('pr-sent').textContent=sent;
  document.getElementById('pr-accepted').textContent=acc;
  document.getElementById('pr-rate').textContent=(sent+acc)?Math.round(acc/(sent+acc)*100)+'%':'—';
  document.getElementById('proposals-tbody').innerHTML=pr.map(p=>`<tr class="hover:bg-white/2 transition-colors">
    <td class="px-5 py-3.5 font-mono text-xs text-gray-400">${p.num}</td>
    <td class="px-5 py-3.5 text-sm"><div class="font-medium">${p.leadName}</div><div class="text-xs text-gray-500">${p.company}</div></td>
    <td class="px-5 py-3.5 text-xs text-gray-400">${(p.svcs||[]).map(s=>s.name).join(', ')}</td>
    <td class="px-5 py-3.5 font-bold text-sm" style="color:#34d399">$${p.total.toLocaleString()}/mo</td>
    <td class="px-5 py-3.5">${badge(p.status)}</td>
    <td class="px-5 py-3.5 text-xs text-gray-500">${p.createdAt}</td>
    <td class="px-5 py-3.5"><select onchange="updatePropStatus(${p.id},this.value)" class="text-xs bg-gray-800 text-gray-300 rounded-lg px-2 py-1 border-0 outline-none"><option value="draft" ${p.status==='draft'?'selected':''}>Draft</option><option value="sent" ${p.status==='sent'?'selected':''}>Sent</option><option value="accepted" ${p.status==='accepted'?'selected':''}>Accepted</option><option value="rejected" ${p.status==='rejected'?'selected':''}>Rejected</option></select></td></tr>`).join('');
}
function updatePropStatus(id,st){const pr=getProposals(),p=pr.find(x=>x.id===id);if(p){p.status=st;s('af_proposals',pr);renderProposals();showToast('Status updated');if(st==='accepted')showToast('Proposal accepted! Create client invoice.');}
}
function openPropModal(){
  propSvcs=[];
  document.getElementById('prop-name').value='';document.getElementById('prop-company').value='';
  document.getElementById('prop-discount').value=0;document.getElementById('prop-notes').value='';
  document.getElementById('prop-status').value='draft';
  const d=new Date();d.setDate(d.getDate()+30);document.getElementById('prop-valid').value=d.toISOString().slice(0,10);
  const svcs=getServices().filter(sv=>sv.active);
  document.getElementById('prop-svc-list').innerHTML=svcs.map(sv=>`<div onclick="togglePropSvc(${sv.id})" id="psvc-${sv.id}" style="cursor:pointer;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px;transition:all 0.15s"><div style="font-size:0.75rem;font-weight:600">${sv.name}</div><div style="font-size:0.75rem;color:#34d399;font-weight:700">$${sv.price}/mo</div></div>`).join('');
  calcProposalTotal();
  openModal('m-proposal');
}
function togglePropSvc(id){const sv=getServices().find(x=>x.id===id);if(!sv)return;const idx=propSvcs.findIndex(x=>x.id===id);const el=document.getElementById('psvc-'+id);if(idx>=0){propSvcs.splice(idx,1);if(el){el.style.borderColor='rgba(255,255,255,0.08)';el.style.background='';}}else{propSvcs.push(sv);if(el){el.style.borderColor='#6366f1';el.style.background='rgba(99,102,241,0.1)';}}calcProposalTotal();}
function calcProposalTotal(){const disc=parseInt(document.getElementById('prop-discount').value)||0;const sub=propSvcs.reduce((a,s)=>a+s.price,0);const total=Math.round(sub*(1-disc/100));document.getElementById('prop-total').textContent='$'+total.toLocaleString();document.getElementById('prop-selected').innerHTML=propSvcs.map(s=>`<div style="display:flex;justify-content:space-between;font-size:0.875rem;padding:4px 0"><span style="color:#d1d5db">${s.name}</span><span style="color:#34d399;font-weight:600">$${s.price}/mo</span></div>`).join('')||'<div style="font-size:0.75rem;color:#6b7280;padding:8px 0">No services selected</div>';}
function saveProposal(){const name=document.getElementById('prop-name').value.trim();if(!name){alert('Lead name required.');return;}const pr=getProposals();const disc=parseInt(document.getElementById('prop-discount').value)||0;const total=Math.round(propSvcs.reduce((a,s)=>a+s.price,0)*(1-disc/100));pr.unshift({id:Date.now(),num:'PROP-'+String(pr.length+1).padStart(3,'0'),leadName:name,company:document.getElementById('prop-company').value.trim(),svcs:propSvcs.map(s=>({name:s.name,price:s.price})),total,discount:disc,status:document.getElementById('prop-status').value,notes:document.getElementById('prop-notes').value.trim(),createdAt:new Date().toISOString().slice(0,10),validUntil:document.getElementById('prop-valid').value});s('af_proposals',pr);closeModal('m-proposal');renderProposals();showToast('Proposal created');}

// ── INVOICES ──
function renderInvoices(){
  const inv=getInvoices();
  document.getElementById('inv-total').textContent='$'+inv.reduce((a,i)=>a+i.amount,0).toLocaleString();
  document.getElementById('inv-paid').textContent='$'+inv.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0).toLocaleString();
  document.getElementById('inv-pending').textContent='$'+inv.filter(i=>i.status==='pending').reduce((a,i)=>a+i.amount,0).toLocaleString();
  document.getElementById('inv-overdue').textContent='$'+inv.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0).toLocaleString();
  document.getElementById('invoices-tbody').innerHTML=inv.map(i=>`<tr class="hover:bg-white/2 transition-colors">
    <td class="px-5 py-3.5 font-mono text-xs text-gray-400">${i.num}</td>
    <td class="px-5 py-3.5 text-sm">${i.client}</td>
    <td class="px-5 py-3.5 font-bold text-sm">$${i.amount.toLocaleString()}</td>
    <td class="px-5 py-3.5"><select onchange="updateInvStatus(${i.id},this.value)" style="font-size:0.75rem;background:#1f2937;color:#d1d5db;border-radius:8px;padding:4px 8px;border:0;outline:none"><option value="pending" ${i.status==='pending'?'selected':''}>Pending</option><option value="paid" ${i.status==='paid'?'selected':''}>Paid</option><option value="overdue" ${i.status==='overdue'?'selected':''}>Overdue</option></select></td>
    <td class="px-5 py-3.5 text-xs text-gray-500">${i.due}</td>
    <td class="px-5 py-3.5"><button onclick="deleteInv(${i.id})" style="font-size:0.75rem;color:#6b7280" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='#6b7280'">Delete</button></td></tr>`).join('');
}
function updateInvStatus(id,st){const inv=getInvoices(),i=inv.find(x=>x.id===id);if(i){i.status=st;s('af_invoices',inv);renderInvoices();showToast('Updated');}}
function deleteInv(id){if(!confirm('Delete?'))return;s('af_invoices',getInvoices().filter(i=>i.id!==id));renderInvoices();showToast('Deleted');}
function saveInvoice(){const cl=document.getElementById('i-client').value.trim(),amt=parseInt(document.getElementById('i-amount').value),due=document.getElementById('i-due').value;if(!cl||!amt||!due){alert('All fields required.');return;}const inv=getInvoices();inv.unshift({id:Date.now(),num:'INV-'+String(inv.length+1).padStart(3,'0'),client:cl,amount:amt,status:document.getElementById('i-status').value,due});s('af_invoices',inv);closeModal('m-invoice');renderInvoices();showToast('Invoice created');}

// ── SERVICES ──
function renderServices(){
  const svcs=getServices();
  document.getElementById('services-grid').innerHTML=svcs.map(sv=>`<div style="background:#111827;border:1px solid ${sv.active?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.03)'};border-radius:16px;padding:20px;opacity:${sv.active?1:0.5}">
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px"><h4 style="font-weight:700;font-size:0.875rem">${sv.name}</h4><span style="font-size:0.75rem;background:${sv.active?'#1a3a2e':'#1f2937'};color:${sv.active?'#34d399':'#9ca3af'};padding:3px 10px;border-radius:999px;font-weight:600">${sv.active?'Active':'Inactive'}</span></div>
    <div style="font-size:0.75rem;color:#6b7280;margin-bottom:12px">${sv.desc}</div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:1.25rem;font-weight:900;color:#34d399">$${sv.price}<span style="font-size:0.75rem;font-weight:400;color:#6b7280">/mo</span></span>
      <div style="display:flex;gap:8px">
        <button onclick="toggleSvc(${sv.id})" style="font-size:0.75rem;background:rgba(99,102,241,0.15);color:#818cf8;padding:4px 10px;border-radius:8px;font-weight:600">${sv.active?'Disable':'Enable'}</button>
        <button onclick="deleteSvc(${sv.id})" style="font-size:0.75rem;color:#6b7280" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='#6b7280'">Del</button>
      </div>
    </div></div>`).join('');
}
function toggleSvc(id){const svcs=getServices(),sv=svcs.find(x=>x.id===id);if(sv){sv.active=!sv.active;s('af_services',svcs);renderServices();showToast(sv.active?'Enabled':'Disabled');}}
function deleteSvc(id){if(!confirm('Delete service?'))return;s('af_services',getServices().filter(sv=>sv.id!==id));renderServices();showToast('Deleted');}
function saveService(){const name=document.getElementById('svc-name').value.trim();if(!name){alert('Name required.');return;}const svcs=getServices();const eid=parseInt(document.getElementById('svc-id').value);const d={name,desc:document.getElementById('svc-desc').value.trim(),price:parseInt(document.getElementById('svc-price').value)||497,type:document.getElementById('svc-type').value,active:document.getElementById('svc-active').value==='1'};if(eid){const i=svcs.findIndex(x=>x.id===eid);svcs[i]={...svcs[i],...d};}else{d.id=Date.now();svcs.push(d);}s('af_services',svcs);closeModal('m-service');renderServices();showToast('Service saved');}

// ── ANALYTICS ──
function renderAnalytics(){
  const clients=getClients(),leads=getLeads(),events=getEvents();
  const active=clients.filter(c=>c.status==='active');
  const mrr=active.reduce((a,c)=>a+c.mrr,0);
  document.getElementById('an-arr').textContent='$'+(mrr*12).toLocaleString();
  document.getElementById('an-deal').textContent=active.length?'$'+Math.round(mrr/active.length).toLocaleString():'—';
  document.getElementById('an-visits').textContent=events.filter(e=>e.type==='page_view').length||'—';
  document.getElementById('an-cta').textContent=events.filter(e=>e.type==='cta_click').length||'—';
  const months=last6();
  setTimeout(()=>{
    mk('an-mrr',{type:'line',data:{labels:months.map(mStr),datasets:[{data:months.map(m=>active.filter(c=>c.since&&new Date(c.since)<=m).reduce((a,c)=>a+c.mrr,0)),borderColor:'#6366f1',backgroundColor:'rgba(99,102,241,0.08)',fill:true,tension:0.4,pointBackgroundColor:'#6366f1',pointRadius:3}]},options:{...GR}});
    mk('an-leads',{type:'bar',data:{labels:months.map(mStr),datasets:[{data:months.map(m=>leads.filter(l=>l.date&&l.date.slice(0,7)===m.toISOString().slice(0,7)).length),backgroundColor:'rgba(99,102,241,0.6)',borderColor:'#6366f1',borderWidth:1,borderRadius:4}]},options:{...GR}});
    const st=['new','contacted','qualified','proposal','won','lost'];
    mk('an-funnel',{type:'doughnut',data:{labels:st.map(x=>SL[x]),datasets:[{data:st.map(x=>leads.filter(l=>l.status===x).length),backgroundColor:st.map(x=>BC[x]),borderColor:st.map(x=>TC[x]),borderWidth:2}]},options:{...DR}});
    const srcMap={};leads.forEach(l=>{const src=l.source||'Unknown';srcMap[src]=(srcMap[src]||0)+1;});
    const srcs=Object.keys(srcMap);
    mk('an-sources',{type:'doughnut',data:{labels:srcs,datasets:[{data:srcs.map(k=>srcMap[k]),backgroundColor:['#1e3a5f','#2d1f6e','#1a3a2e','#3a2200','#2d1a1a'],borderColor:['#60a5fa','#a78bfa','#34d399','#fb923c','#f87171'],borderWidth:2}]},options:{...DR}});
  },50);
}

// ── MODALS ──
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
function bdClose(e,id){if(e.target===document.getElementById(id))closeModal(id);}
function clearModal(id){document.getElementById(id).querySelectorAll('input,textarea,select').forEach(el=>{if(el.type==='checkbox')el.checked=false;else el.value='';});}

// ── SETTINGS ──
function saveSettings(){showToast('Profile saved');}
function chgPass(){const cur=document.getElementById('s-cur').value,nw=document.getElementById('s-new').value;if(cur!=='AutoFlow2025!'){alert('Current password incorrect.');return;}if(nw.length<8){alert('Min 8 characters.');return;}showToast('Password updated');document.getElementById('s-cur').value='';document.getElementById('s-new').value='';}
function clearAll(){if(!confirm('Clear all data?'))return;['af_leads','af_clients','af_projects','af_proposals','af_services','af_invoices','af_events'].forEach(k=>localStorage.removeItem(k));showToast('All data cleared');renderOverview();}

// ── TOAST ──
let toastTimer;
function showToast(msg,ok=true){clearTimeout(toastTimer);const t=document.getElementById('toast'),m=document.getElementById('toast-msg');m.textContent=msg;t.classList.add('show');toastTimer=setTimeout(()=>t.classList.remove('show'),2500);}

// ── PROJECT FILTER TABS ──
document.querySelectorAll('.tab-btn[data-f]').forEach(btn=>{btn.addEventListener('click',function(){document.querySelectorAll('.tab-btn[data-f]').forEach(b=>b.classList.remove('active'));this.classList.add('active');renderProjects(this.dataset.f);});});

// ── INIT ──
renderOverview();
