
/* ================= course engine (Bea) ================= */
const COURSES={
  geo:{id:'geo',name:'Přímky a úsečky',sub:'Geometrie, 4. třída',icon:'📐',topics:TOPICS,finalN:12,passFinal:10,color:'var(--bea-soft)'},
  prir:{id:'prir',name:'Přírodověda',sub:'Na písemku: příroda, houby, rostliny',icon:'🌿',topics:SCI_TOPICS,finalN:15,passFinal:12,color:'var(--mint-soft)',exam:true}
};
const coursesOf=kid=>kidOf(kid).adult||kidOf(kid).little?[]:Object.values(COURSES);
const cProg=(kid,cid)=>((kidOf(kid).courses||{})[cid])||{};
const tStars=(kid,cid,tid)=>Math.min(3,(cProg(kid,cid)[tid]||{}).s||0);
const courseTotal=cid=>COURSES[cid].topics.length*3;
const courseStars=(kid,cid)=>COURSES[cid].topics.reduce((a,t)=>a+tStars(kid,cid,t.id),0);
const coursePct=(kid,cid)=>Math.round(courseStars(kid,cid)/courseTotal(cid)*100);
const starStr=n=>`<span class="stars">${'⭐'.repeat(n)}${'<i>☆</i>'.repeat(3-n)}</span>`;
const topicOf=(cid,tid)=>COURSES[cid].topics.find(t=>t.id===tid);
function makeTopicRound(t,n){const out=[],seen=new Set();let tries=0;
  while(out.length<n&&tries<120){tries++;const q=pick(t.gen)();const key=q.q+'|'+q.ans+'|'+(q.svg||'').slice(0,60);if(seen.has(key)&&tries<100)continue;seen.add(key);out.push({...q,tried:[],topic:t.id})}
  return out}
function startCourse(cid,tid){const C=COURSES[cid];let qs,title;
  if(tid==='final'){const tops=C.topics;qs=shuffle(tops.flatMap(t=>makeTopicRound(t,1)));while(qs.length<C.finalN)qs.push(...makeTopicRound(pick(tops),1));qs=shuffle(qs).slice(0,C.finalN);title=COURSES[cid].exam?'Zkušební písemka':'Velký test'}
  else{const t=topicOf(cid,tid);qs=makeTopicRound(t,6);title=t.name}
  L={g:'course',cid,topic:tid,title,i:0,total:qs.length,first:0,qs};L.q=qs[0];go('courseQuiz');
}
function finishCourse(){
  const kid=V.kid||(stack.find(v=>v.kid)||{}).kid,cid=L.cid,id=L.topic,ok=L.first,tot=L.total,C=COURSES[cid];L=null;
  const base=`kids/${kid}/courses/${cid}`;
  if(id==='final'){const pass=ok>=C.passFinal,f=cProg(kid,cid).final||{};put(`${base}/final`,{best:Math.max(f.best||0,ok),passes:(f.passes||0)+(pass?1:0),last:today(),tries:(f.tries||0)+1});
    addLog(kid,0,'info',`${C.name}: ${COURSES[cid].exam?'písemka':'velký test'} ${ok}/${tot}`,true);
    if(pass)capAward('learn',S.settings.learnCap,5,`Učení: ${C.name}, závěrečný test`,`🏆 ${ok} z ${tot}! Výborně!`,'',()=>back());
    else celebrate({title:`${ok} z ${tot}`,sub:`Na pohár potřebuješ aspoň ${C.passFinal} správně napoprvé. Zopakuj si slabší témata a zkus to znovu!`,btn:'Dobře',onClose:()=>back()});
    return}
  const pass=ok>=tot-1,p=cProg(kid,cid)[id]||{},ns=Math.min(3,(p.s||0)+(pass?1:0));
  put(`${base}/${id}`,{s:ns,r:(p.r||0)+1,best:Math.max(p.best||0,ok),last:today()});
  const tn=topicOf(cid,id).name;
  if(pass)capAward('learn',S.settings.learnCap,ok===tot?4:3,`Učení: ${C.name} – ${tn}`,ns===3?'Téma zvládnuto! 🏆':`Hvězda za téma! (${ns} ze 3)`,'',()=>back());
  else celebrate({title:`${ok} z ${tot} napoprvé`,sub:'Na hvězdu za téma potřebuješ aspoň 5 z 6. Přečti si tahák a zkus to znovu!',btn:'Zkusím znovu',onClose:()=>back()});
}
function courseCard(kid,C){const pct=coursePct(kid,C.id),f=cProg(kid,C.id).final||{};
  return `<button class="lcard" data-act="openCourse" data-c="${C.id}"><span class="ic" style="background:${C.color}">${C.icon}</span><span class="t"><h2>${esc(C.name)}</h2><span class="muted">${esc(C.sub)}</span>
   <span class="bar" style="width:100%"><i style="width:${pct}%"></i></span><span class="pill">Prošla jsi ${pct} %${f.passes?' · 🏆':''}</span></span></button>`}
function vCourse(){const kid=V.kid,C=COURSES[V.course],cid=C.id,pct=coursePct(kid,cid),st=courseStars(kid,cid),f=cProg(kid,cid).final||{};
  const next=C.topics.find(t=>tStars(kid,cid,t.id)<3);const fin=COURSES[cid].exam?'Zkušební písemka':'Velký test';
  return `${topbar(C.name)}
  <div class="card sec"><div class="row" style="justify-content:space-between"><b>Prošla jsi ${pct} % látky</b><span class="pill">${st} / ${courseTotal(cid)} ⭐</span></div><div class="bar"><i style="width:${pct}%"></i></div>
   <span class="muted">Každé téma procvič 3× (vždy aspoň 5 z 6 správně) a získej 3 hvězdy. Pak zkus ${fin.toLowerCase()}.</span></div>
  ${next?`<button class="next" data-act="openTopic" data-c="${cid}" data-id="${next.id}"><span class="lbl">Pokračuj</span><span class="tk"><span class="ic">${next.icon}</span><span><h2>${esc(next.name)}</h2>${starStr(tStars(kid,cid,next.id))}</span></span><span class="go">Jdu na to!</span></button>`
   :`<div class="card center"><h2>🎉 Všechna témata zvládnutá!</h2><p class="muted">Teď ${fin.toLowerCase()}.</p></div>`}
  <div class="tlist">${C.topics.map((t,i)=>{const s=tStars(kid,cid,t.id);return `<button class="trow ${s===3?'done':''}" data-act="openTopic" data-c="${cid}" data-id="${t.id}"><span class="tn">${i+1}</span><span class="ti">${t.icon}</span><span class="tt">${esc(t.name)}</span>${starStr(s)}</button>`}).join('')}</div>
  <button class="lcard" data-act="startCourse" data-c="${cid}" data-id="final"><span class="ic" style="background:var(--sun-soft)">🏆</span><span class="t"><h2>${fin}</h2><span class="muted">${C.finalN} otázek ze všech témat. Pohár od ${C.passFinal} správně.</span><span class="pill">${f.tries?`Nejlepší: ${f.best}/${C.finalN} · pokusy: ${f.tries}${f.passes?` · 🏆 ${f.passes}×`:''}`:'Zatím nezkoušeno'}</span></span></button>`;
}
function vTopic(){const C=COURSES[V.course],t=topicOf(C.id,V.topic),kid=V.kid,s=tStars(kid,C.id,t.id),p=cProg(kid,C.id)[t.id]||{};
  return `${topbar(t.name)}
  <div class="card sec"><div class="row" style="justify-content:space-between"><b>Tvůj postup</b>${starStr(s)}</div>
   <span class="muted">${s>=3?'Téma máš zvládnuté! Můžeš si ho kdykoli zopakovat.':`Ještě ${3-s}× procvič na aspoň 5 z 6 správně napoprvé.`}${p.r?` Zkoušela jsi ${p.r}×.`:''}</span></div>
  <article class="card lesson"><h3>📒 Tahák</h3>${t.lesson()}</article>
  <button class="btn big" data-act="startCourse" data-c="${C.id}" data-id="${t.id}" style="align-self:center">Procvičit (6 otázek)</button>`;
}
function parentCourses(kid){const cs=coursesOf(kid);if(!cs.length)return '';
  return `<div class="card sec"><h2><span class="kidtag ${kid}">${esc(kidOf(kid).name)}</span> učení na testy</h2>${cs.map(C=>{const f=cProg(kid,C.id).final||{};
    return `<div class="sec" style="gap:6px"><div class="row" style="justify-content:space-between"><b>${C.icon} ${esc(C.name)}</b><span class="pill">${coursePct(kid,C.id)} %</span></div><div class="bar"><i style="width:${coursePct(kid,C.id)}%"></i></div>
     <div class="log">${C.topics.map(t=>{const p=cProg(kid,C.id)[t.id]||{};return `<div><span>${t.icon}</span><span>${esc(t.name)}${p.last?` <span class="muted">(${p.r}×, naposledy ${p.last.slice(8,10)}.${p.last.slice(5,7)}.)</span>`:''}</span><span class="p">${'⭐'.repeat(Math.min(3,p.s||0))||'–'}</span></div>`}).join('')}
     <div><span>🏆</span><span>${C.exam?'Zkušební písemka':'Velký test'}</span><span class="p">${f.tries?`${f.best}/${C.finalN}`:'–'}</span></div></div></div>`}).join('')}</div>`}
Object.assign(MAP,{course:vCourse,topic:vTopic,courseQuiz:vGeoQuiz});
Object.assign(handlers,{
  openCourse:b=>go('course',{course:b.dataset.c}),
  openTopic:b=>go('topic',{course:b.dataset.c,topic:b.dataset.id}),
  startCourse:b=>startCourse(b.dataset.c,b.dataset.id)
});
