const fmt = n => '€' + Math.round(n).toLocaleString('en-US');
const fmtK = n => '€' + (Math.round(n/100)*100).toLocaleString('en-US');

/* hero gauge — decorative; isolated so a failure here can never break the calculators */
(function(){try{
  const t1=627000,thr1=465000,t2=205000,thr2=250000,exp=64000;
  function setEnd(){
    document.getElementById('hg1s').textContent='135% of threshold — Local File mandatory';
    document.getElementById('hg2s').textContent='82% — file due on request; be ready in 30 days';
  }
  const prm = typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prm){
    hg1.style.width='100%';hg1v.textContent=fmt(t1);hg2.style.width='82%';hg2v.textContent=fmt(t2);
    hg3.style.width='100%';hgx.textContent=fmt(exp);setEnd();return;
  }
  setTimeout(()=>{
    const t0=performance.now(),dur=1400;
    (function frame(t){
      const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);
      hg1.style.width=Math.min(100,e*t1/thr1*100)+'%';hg1v.textContent=fmt(e*t1);
      hg2.style.width=e*t2/thr2*100+'%';hg2v.textContent=fmt(e*t2);
      hg3.style.width=e*100+'%';hgx.textContent=fmt(e*exp);
      if(p<1)requestAnimationFrame(frame);else setEnd();
    })(t0);
  },400);
}catch(e){/* decorative only */}})();

function radio(name){const el=document.querySelector(`input[name="${name}"]:checked`);return el?el.value:null;}
function checked(name){const el=document.querySelector(`input[name="${name}"]`);return el?el.checked:false;}

/* option pills — native inputs own the state; we only sync the visuals.
   Works for mouse, touch, keyboard (space/arrows) and programmatic changes alike. */
document.querySelectorAll('.opts').forEach(group=>{
  const sync=()=>group.querySelectorAll('.opt').forEach(o=>{
    o.classList.toggle('sel', o.querySelector('input').checked);
  });
  group.querySelectorAll('input').forEach(inp=>{
    inp.addEventListener('change',()=>{
      if(inp.type==='radio'){ // radios in the same name-group may live visually in this group
        document.querySelectorAll(`input[name="${inp.name}"]`).forEach(r=>{
          const o=r.closest('.opt'); if(o) o.classList.toggle('sel', r.checked);
        });
      }
      sync();
      if(inp.name==='parent'){
        document.getElementById('flipYearsRow').style.display=(radio('parent')==='us')?'grid':'none';
      }
    });
  });
  sync();
});

function revealResults(id){if(window.innerWidth<900){document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'});}}
const FLOW_CAP=250000000; // €250M per flow — beyond this the self-serve engine is out of scope
function val(id){const v=Number(document.getElementById(id).value)||0;return Math.min(FLOW_CAP,Math.max(0,v));}
/* =====================================================================
   CONFIG — every regulatory & pricing constant lives here and only here.
   lastVerified: 2026-07. Review annually per the compliance policy;
   thresholds are EUR approximations of local-currency statutory values
   (PLN 2M / PLN 10M, HUF 150M, RO large-taxpayer bands).
   ===================================================================== */
const CONFIG={
  lastVerified:'2026-08',
  thresholds:{PL_serv:464000,PL_fin:2320000,HU:380000,RO_serv:250000,RO_int:200000,RO_loanInterestProxy:0.05,warn:0.7},
  exposure:{plAdjRate:0.10*0.25,plFiscal:8000,huPerRecord:12500,roAdjRate:0.08*0.25,czAudit:5000,czAuditMinFlows:500000,usFormPerYear:11500,noAgreement:10000},
  tp:{lfBase:{PL:5500,HU:5000,RO:5000},czDefense:4500,extraFlow:1800,benchFirst:1800,benchRepeat:720,setup:1500,starter:4000,starterLight:2200,pack5471:2200,flipReady:7000,multiCountry:0.92,roomDiscount:0.9,tierReviewed:1.0,anchorBand:[1.35,1.75]},
  dd:{base:{rf:5500,a:15000,b:32000},floor:{rf:5000,a:12000,b:28000},entStep:0.2,consol:1.15,instrStep:0.05,rush:1.3,tpModule:2500,anchorBand:[1.5,2.0],bundle:0.85}
};
let lastTP=null,lastDD=null;
/* a cached quote is only valid while its own inputs are untouched */
document.getElementById('tpform').addEventListener('input',()=>{lastTP=null;});
document.getElementById('tpform').addEventListener('change',()=>{lastTP=null;});
document.getElementById('ddform').addEventListener('input',()=>{lastDD=null;});
document.getElementById('ddform').addEventListener('change',()=>{lastDD=null;});
/* ===== TP ENGINE ===== */
const THR=CONFIG.thresholds;

document.getElementById('tpRun').addEventListener('click',()=>{try{
  const parent=radio('parent');
  const usParent=(parent==='us'), flipPlanned=(parent==='planned');
  const flipYears=usParent?Math.max(0,Number(document.getElementById('flipYears').value)||0):0;
  const cs={PL:checked('c_pl'),HU:checked('c_hu'),CZ:checked('c_cz'),RO:checked('c_ro')};
  const flows={dev:val('fDev'),mgmt:val('fMgmt'),loan:val('fLoan'),ip:val('fIp')};
  const totalFlows=flows.dev+flows.mgmt+flows.loan+flows.ip;
  const sizeFRaw=Number(radio('rev'))||1;const sizeF=sizeFRaw;
  const outOfScope = totalFlows>60000000 || (sizeFRaw>=1.6 && totalFlows>25000000);
  const hasAgree=checked('d_agree'),hasBench=checked('d_bench'),hasLF=checked('d_lf'),has5471=checked('d_5471'),hasRoom=checked('d_room');
  const urg=Number(radio('urgency'))||1;
  const smallPL=radio('smallco')==='1';

  const obligs=[]; const lf={PL:0,HU:0,RO:0}; let benchNeeded=0; let czDefense=false;
  function add(cat,txt,sev,tag){obligs.push({cat,txt,sev,tag});}
  function test(c,label,value,thr,kind){
    if(value<=0)return;
    const pct=value/thr;
    if(pct>=1){add('TP',`${c} · ${label} — ${fmt(value)} = ${Math.round(pct*100)}% of threshold`,'red',kind==='RO'?'TP file mandatory / on request':'Local File + benchmark mandatory');lf[c]++; benchNeeded++;}
    else if(pct>=THR.warn){add('TP',`${c} · ${label} — ${Math.round(pct*100)}% of threshold`,'amber','Approaching — plan documentation');}
    else{add('TP',`${c} · ${label} — ${Math.round(pct*100)}% of threshold`,'ok',"Arm's-length still required");}
  }
  if(cs.PL){test('PL','Dev services',flows.dev,THR.PL_serv);test('PL','Mgmt services',flows.mgmt,THR.PL_serv);test('PL','Loans',flows.loan,THR.PL_fin);test('PL','IP royalty',flows.ip,THR.PL_serv);}
  if(cs.HU){test('HU','Dev services',flows.dev,THR.HU);test('HU','Mgmt services',flows.mgmt,THR.HU);test('HU','Loans',flows.loan,THR.HU);test('HU','IP royalty',flows.ip,THR.HU);}
  if(cs.RO){add('TP','RO · 2026 documentation rules require taxpayer/transaction-specific verification','amber','Manual verification required'); test('RO','Dev services (indicative)',flows.dev,THR.RO_serv,'RO');test('RO','Mgmt services (indicative)',flows.mgmt,THR.RO_serv,'RO');test('RO','Loans (interest ≈5%, indicative)',flows.loan*THR.RO_loanInterestProxy,THR.RO_int,'RO');test('RO','IP royalty (indicative)',flows.ip,THR.RO_serv,'RO');}
  if(cs.CZ && totalFlows>0){czDefense=true;add('TP','CZ · No statutory Local File — but burden of proof shifts to you in audit','amber','Defense file recommended');}
  if(usParent&&!has5471)add('US filing',`Forms 5471/5472 — ${flipYears} year(s) unfiled`,'red','Fixed IRS penalty per form / year');
  if(flipPlanned)add('US filing','5471/5472 due with the first return after the flip','amber','Plan with the flip');
  if(totalFlows>0&&!hasAgree)add('Governance','No signed intercompany agreement behind live money flows','red','Fix first — days, not weeks');
  if(sizeF>=1.35&&(benchNeeded>0))add('TP','Group size suggests checking Master File triggers (PL: PLN 200M consolidated; HU: HUF 500M documented aggregate)','amber','Verify on the scoping call');
  if(obligs.length===0)add('TP','No active intercompany flows — obligations start with the first euro moved','ok','Set up before you flow');

  /* exposure */
  let exp=0;const parts=[];
  if(lf.PL>0&&!hasLF&&cs.PL){const v=(flows.dev>=THR.PL_serv?flows.dev:0)+(flows.mgmt>=THR.PL_serv?flows.mgmt:0)+(flows.ip>=THR.PL_serv?flows.ip:0)+(flows.loan>=THR.PL_fin?flows.loan:0);const a=v*CONFIG.exposure.plAdjRate;exp+=a;parts.push('PL adjustment risk '+fmtK(a));exp+=CONFIG.exposure.plFiscal;parts.push('PL fiscal-penal risk ~'+fmtK(CONFIG.exposure.plFiscal));}
  if(lf.HU>0&&!hasLF&&cs.HU){const p=lf.HU*CONFIG.exposure.huPerRecord;exp+=p;parts.push(`HU penalty ${lf.HU} record(s) ${fmtK(p)}`);}
  if(lf.RO>0&&!hasLF&&cs.RO){const a=(flows.dev+flows.mgmt+flows.ip)*CONFIG.exposure.roAdjRate;exp+=a;parts.push('RO assessment risk '+fmtK(a));}
  if(czDefense&&!hasLF&&totalFlows>CONFIG.exposure.czAuditMinFlows){exp+=CONFIG.exposure.czAudit;parts.push('CZ audit risk ~'+fmtK(CONFIG.exposure.czAudit));}
  if(usParent&&!has5471&&flipYears>0){const p=flipYears*CONFIG.exposure.usFormPerYear;exp+=p;parts.push(`US 5471/5472 penalties ${fmtK(p)}`);}
  if(totalFlows>0&&!hasAgree){exp+=CONFIG.exposure.noAgreement;parts.push('undocumented funding reclassification ~'+fmtK(CONFIG.exposure.noAgreement));}

  /* TP quote */
  const LFB=CONFIG.tp.lfBase;let sum=0;const items=[];let first=true;
  ['PL','HU','RO'].forEach(c=>{
    if(lf[c]>0&&cs[c]){let p=LFB[c]*sizeF+Math.max(0,lf[c]-1)*CONFIG.tp.extraFlow;if(!first)p*=CONFIG.tp.multiCountry;first=false;sum+=p;items.push({n:`${c} Local File (${lf[c]} flow${lf[c]>1?'s':''})`,p});}
  });
  if(czDefense&&!hasLF){let p=CONFIG.tp.czDefense*sizeF;if(!first)p*=CONFIG.tp.multiCountry;first=false;sum+=p;items.push({n:'CZ audit-defense file',p});}
  const benchExemptOnly = smallPL && lf.PL>0 && lf.HU===0 && lf.RO===0 && !czDefense;
  if((benchNeeded>0||czDefense)&&!hasBench&&!benchExemptOnly){const n=Math.max(1,benchNeeded);const b=CONFIG.tp.benchFirst+Math.max(0,n-1)*CONFIG.tp.benchRepeat;sum+=b;items.push({n:`Benchmark stud${n>1?'ies':'y'} (CEE library, de-duplicated)`,p:b});}
  if(benchExemptOnly){add('TP','PL micro/small enterprise — exempt from the compulsory comparability analysis. Local File still required; benchmark is not.','ok','You save the benchmark fee');items.push({n:'Benchmark — not required for your size (we left it out)',p:0});}
  if((benchNeeded>0||czDefense)&&!hasAgree&&!hasLF){sum+=CONFIG.tp.setup;items.push({n:'First-year setup (agreements, functional analysis)',p:CONFIG.tp.setup});}
  if(benchNeeded===0&&!czDefense&&totalFlows>0){const st=hasAgree?CONFIG.tp.starterLight:CONFIG.tp.starter;sum+=st;items.push({n:hasAgree?'TP policy + library benchmark (Starter-light)':'TP Starter — agreement + policy + markup',p:st});}
  if((usParent||flipPlanned)&&!has5471){sum+=CONFIG.tp.pack5471;items.push({n:'5471/5472 data pack (yr 1)',p:CONFIG.tp.pack5471});}
  if(flipPlanned){sum+=CONFIG.tp.flipReady;items.push({n:'Flip-Ready TP — IP path + day-1 agreements',p:CONFIG.tp.flipReady});}
  /* deadline computation from fiscal year end */
  const fy=new Date(document.getElementById('fyEnd').value||'2025-12-31');
  function eom(base,addMonths){const dt=new Date(base.getFullYear(),base.getMonth()+1+addMonths,0);return dt;}
  const dl=[];
  if(cs.PL&&lf.PL>0){dl.push(['PL Local File',eom(fy,10)]);dl.push(['PL TPR filing',eom(fy,11)]);}
  if(cs.HU&&lf.HU>0)dl.push(['HU Local File + CIT return data',new Date(fy.getFullYear()+1,4,31)]);
  if(cs.RO&&lf.RO>0)dl.push(['RO file — on request, 30–60 days','onrequest']);
  if((usParent||flipPlanned)&&!has5471)dl.push(['US return + Forms 5471/5472',new Date(fy.getFullYear()+1,3,15)]);
  const today=new Date();
  const dlHtml=dl.map(([n,d])=>{
    if(d==='onrequest')return `<div class="quote-line"><span class="n">${n}</span><span class="p" style="font-size:13px;color:#F5B564">be ready now</span></div>`;
    const days=Math.round((d-today)/86400000);
    const col=days<0?'#FF8A8F':days<60?'#F5B564':'#5FD79E';
    const txt=days<0?`${Math.abs(days)} days overdue`:`${days} days left`;
    return `<div class="quote-line"><span class="n">${n} · ${d.toISOString().slice(0,10)}</span><span class="p" style="font-size:13px;color:${col}">${txt}</span></div>`;
  }).join('');
  document.getElementById('dlOut').innerHTML = dl.length?dlHtml:'<p class="res-empty">No filing deadlines triggered by these inputs — arm\u2019s-length pricing still applies year-round.</p>';
  const mod=(hasRoom?CONFIG.tp.roomDiscount:1.0)*urg*CONFIG.tp.tierReviewed;
  const tpQ=sum*mod, aB=CONFIG.tp.anchorBand;

  /* render */
  document.getElementById('obligOut').innerHTML=obligs.map(o=>
    `<div class="oblig"><span class="pill cat">${o.cat}</span><span class="pill ${o.sev}">${o.tag}</span><span>${o.txt}</span></div>`).join('');
  document.getElementById('expOut').textContent = outOfScope ? 'Scoped manually' : (exp>0?fmtK(exp*0.8)+'–'+fmtK(exp*1.2):'€0 — for now');
  document.getElementById('expSub').textContent=exp>0?parts.join(' · '):'exposure starts accruing with your first undocumented flow';
  let q=items.map(i=>`<div class="quote-line"><span class="n">${i.n}</span><span class="p">${fmtK(i.p*mod)}</span></div>`).join('');
  if(items.length){q+=`<div class="quote-line"><span class="n"><b>Transfer pricing — total</b></span><span><span class="anchor">mid-tier typically ${fmtK(tpQ*aB[0])}–${fmtK(tpQ*aB[1])}</span> <span class="p">${fmtK(tpQ*0.95)}–${fmtK(tpQ*1.08)}</span></span></div>`;lastTP=tpQ;
    if(lastDD){q+=`<div class="quote-line"><span class="n"><b>+ the DD quote you just ran</b> — both products together, −15%</span><span class="p">${fmtK((tpQ+lastDD)*CONFIG.dd.bundle)}</span></div>`;}}
  else q='<p class="res-empty">No TP scope detected from your inputs.</p>';
  if(outOfScope){
    q='<p class="res-empty">Your transaction values are beyond what this self-serve estimator prices reliably — groups at this size need a scoped proposal rather than a calculator number. The obligations and deadlines above still apply; send them to us and you\u2019ll have a fixed fee within one working day.</p>';
  }
  document.getElementById('tpQuoteOut').innerHTML=q;
  document.getElementById('tpCta').style.display=items.length?'block':'none';
  document.getElementById('tpFn').style.display=items.length?'block':'none';

  const reco=document.getElementById('recoOut');let rT,rB;
  if(flipPlanned){rT='Recommended: Post-Flip Bundle — €13,500';rB='Your flip hasn\u2019t closed: this is the cheapest moment you will ever have to set the IP path, day-one agreements and US-side filings. The window narrows permanently after a priced round.';}
  else if(benchNeeded>0){rT='Recommended: Local File package + tracker';rB='At least one flow is over threshold — documentation is mandatory, and the exposure above is a multiple of the fee. The tracker keeps every other flow monitored so the next threshold doesn\u2019t surprise you.';}
  else if(czDefense){rT='Recommended: Czech defense file + tracker';rB='Czechia has no filing threshold, which cuts both ways: nothing is due until an audit, and everything is due the day one starts. A defense file turns the burden of proof back in your favour.';}
  else if(totalFlows>0){rT='Recommended: TP Starter — from €3,500';rB='You\u2019re under every threshold, but arm\u2019s-length pricing applies from the first euro. The Starter puts the agreement, policy and markup in place while it\u2019s cheap and calm.';}
  else{rT='Recommended: set up before the first transfer';rB='No flows yet means no exposure yet — the cheapest compliance is the kind designed before the money moves.';}
  /* benchmarking-method note per active flow */
  const METHODS=[];
  function pushM(cond,name,method,party,pli){ if(cond>0) METHODS.push([name,method,party,pli]); }
  pushM(flows.dev,'Development / R&D services','TNMM (cost-plus)','CEE subsidiary','Full-cost markup (typ. 5–10%)');
  pushM(flows.mgmt,'Management / admin services','Cost-plus (check low-value-add safe harbour)','Provider','Markup on costs (~5%)');
  pushM(flows.loan,'Intercompany loan','CUP — interest benchmark (PL safe harbour first)','Borrower / lender','Interest-rate spread');
  pushM(flows.ip,'IP royalty / license','CUT/CUP if available, else TNMM/residual','Licensee','Royalty % of revenue');
  const mc=document.getElementById('methodCard');
  if(METHODS.length){
    document.getElementById('methodOut').innerHTML=METHODS.map(m=>
      `<div class="quote-line"><span class="n"><b>${m[0]}</b><br><span style="color:#9FB2D2;font-size:12.5px">${m[1]} · tested party: ${m[2]} · ${m[3]}</span></span></div>`).join('');
    mc.style.display='block';
  } else { mc.style.display='none'; }
  reco.innerHTML=`<h4>${rT}</h4><p>${rB}</p>`;reco.style.display='block';
  revealResults('obligOut');
}catch(err){document.getElementById('tpQuoteOut').innerHTML='<p class="res-empty">Something went wrong computing this — please adjust the inputs, or just email us the numbers and we\u2019ll quote by hand.</p>';}
});

/* ===== DD ENGINE ===== */
document.getElementById('ddRun').addEventListener('click',()=>{try{
  const scope=radio('ddscope');
  const BASE=CONFIG.dd.base,FLOOR=CONFIG.dd.floor;
  const NAME={rf:'Red-Flag DD',a:'Financial DD (Series A)',b:'Full FDD (Series B)'};
  const ents=Math.max(1,Number(document.getElementById('ddEntities').value)||2);
  const revF=Number(radio('ddrev'))||1,acctF=Number(radio('ddacct'))||1,roomF=Number(radio('ddroom'))||1,modelF=Number(radio('ddmodel'))||1;
  const consol=checked('dd_consol'),rush=checked('dd_rush');
  const instr=Math.max(0,Number(document.getElementById('ddInstr').value)||0);
  const addTP=checked('dd_tp'),addTax=checked('dd_tax'),addStamp=checked('dd_stamp');

  const entF=1+CONFIG.dd.entStep*(ents-1), consolF=consol?CONFIG.dd.consol:1, instrF=1+CONFIG.dd.instrStep*instr, rushF=rush?CONFIG.dd.rush:1;
  let dd=BASE[scope]*entF*revF*acctF*roomF*modelF*consolF*instrF*rushF;
  dd=Math.max(dd,FLOOR[scope]);
  const aB=CONFIG.dd.anchorBand;
  const rows=[
    [`${NAME[scope]} — base`,fmtK(BASE[scope])],
    [`× entities (${ents})`,'×'+entF.toFixed(2)],
    ['× revenue band','×'+revF.toFixed(2)],
    ['× accounts quality','×'+acctF.toFixed(2)],
    ['× data room','×'+roomF.toFixed(2)],
    ['× revenue model','×'+modelF.toFixed(2)],
  ];
  if(consol)rows.push(['× consolidation rebuild','×1.15']);
  if(instr>0)rows.push([`× cap-table layers (${instr})`,'×'+instrF.toFixed(2)]);
  if(rush)rows.push(['× rush (<2 weeks)','×1.30']);
  let html=rows.map(r=>`<div class="quote-line"><span class="n">${r[0]}</span><span class="p" style="font-weight:400;color:#B9C9E4">${r[1]}</span></div>`).join('');
  html+=`<div class="quote-line"><span class="n"><b>${NAME[scope]} — our fee</b></span><span><span class="anchor">mid-tier typically ${fmtK(dd*aB[0])}–${fmtK(dd*aB[1])}</span> <span class="p">${fmtK(dd*0.95)}–${fmtK(dd*1.08)}</span></span></div>`;
  let extra=0;
  if(addTP){extra+=CONFIG.dd.tpModule;html+=`<div class="quote-line"><span class="n">+ TP deep-dive module</span><span class="p">${fmtK(CONFIG.dd.tpModule)}</span></div>`;}
  if(addTax){html+=`<div class="quote-line"><span class="n">+ Full tax DD (partner tax advisors, per country)</span><span class="p">€4,000–8,000</span></div>`;}
  if(addStamp){html+=`<div class="quote-line"><span class="n">+ Recognized-firm review</span><span class="p">${fmtK((dd+extra)*0.4)}–${fmtK((dd+extra)*0.7)}</span></div>`;}
  lastDD=dd+extra;
  if(lastTP){html+=`<div class="quote-line"><span class="n"><b>+ the TP quote you just ran</b> — both products together, −15%</span><span class="p">${fmtK((lastTP+lastDD)*CONFIG.dd.bundle)}</span></div>`;}
  document.getElementById('ddQuoteOut').innerHTML=html;
  document.getElementById('ddCta').style.display='block';
  document.getElementById('ddFn').style.display='block';
  const side=radio('ddside');
  document.getElementById('ddSideNote').innerHTML = side==='buy'
    ? '<b>Independence:</b> on buy-side engagements we do not concurrently act for the target. If we already prepare that company\u2019s transfer pricing, we disclose it before scoping and you decide — usually we step back from the DD and hand you our TP file instead, which is faster and cheaper for you anyway. <b>Who pays:</b> buy-side DD is invoiced to the fund as a fund expense.'
    : '<b>Sell-side readiness</b> is preparation, not assurance: we build and stress-test your data room against the checklists investors actually use, and fix what we find. It is invoiced to the company, and it is not a substitute for the investor\u2019s own diligence.';
  document.getElementById('ddNote').style.display='flex';
  revealResults('ddQuoteOut');
}catch(err){document.getElementById('ddQuoteOut').innerHTML='<p class="res-empty">Something went wrong computing this — please adjust the inputs, or email us the deal outline for a manual quote.</p>';}
});
