
/* ================= virtual pet (tamagotchi) ================= */
const PET_TYPES=[
  {id:'pes',name:'Pejsek',col:'#C98B52',belly:'#F3D9B8'},{id:'kocka',name:'Kočička',col:'#F39A4A',belly:'#FFE2C4'},
  {id:'zajic',name:'Zajíček',col:'#C9C2D8',belly:'#F4F0FA'},{id:'drak',name:'Dráček',col:'#4CBF7A',belly:'#CFF3DA'},
  {id:'jednorozec',name:'Jednorožec',col:'#F7D7EA',belly:'#FFFFFF'},{id:'medved',name:'Medvídek',col:'#9A6B45',belly:'#E3C9A8'}];
const PET_FOOD=[{id:'jablko',e:'🍎',name:'Jablko',cost:1,food:15,joy:0},{id:'mrkev',e:'🥕',name:'Mrkev',cost:1,food:15,joy:0},{id:'pizza',e:'🍕',name:'Pizza',cost:2,food:30,joy:5},{id:'dort',e:'🍰',name:'Dortík',cost:3,food:35,joy:15}];
const PET_WEAR=[
  {id:'masle',slot:'hat',e:'🎀',name:'Mašle',cost:10},{id:'ksiltovka',slot:'hat',e:'🧢',name:'Kšiltovka',cost:10},{id:'cylindr',slot:'hat',e:'🎩',name:'Cylindr',cost:15},{id:'korunka',slot:'hat',e:'👑',name:'Korunka',cost:25},{id:'kvetina',slot:'hat',e:'🌸',name:'Kytička',cost:8},
  {id:'bryle',slot:'glasses',e:'👓',name:'Brýle',cost:8},{id:'slunecni',slot:'glasses',e:'🕶️',name:'Sluneční brýle',cost:10},
  {id:'sala',slot:'neck',e:'🧣',name:'Šála',cost:12},{id:'medaile',slot:'neck',e:'🏅',name:'Medaile',cost:15},{id:'srdce',slot:'neck',e:'💖',name:'Srdíčko',cost:8}];
const PET_BG=[{id:'louka',name:'Louka',cost:0,css:'linear-gradient(#BFE6FF,#E8F7FF 55%,#9EDB8E 55%,#7CC576)'},{id:'pokoj',name:'Pokojíček',cost:15,css:'linear-gradient(#FFE3ED,#FFF1F6 60%,#D9B48F 60%,#C99B6F)'},
  {id:'vesmir',name:'Vesmír',cost:20,css:'radial-gradient(circle at 80% 20%,#FFD84D 0 18px,transparent 19px),radial-gradient(circle at 20% 30%,#fff 0 2px,transparent 3px),radial-gradient(circle at 60% 70%,#fff 0 2px,transparent 3px),linear-gradient(#1B1F4B,#3A2E7A)'},
  {id:'plaz',name:'Pláž',cost:20,css:'linear-gradient(#8FD3FF,#BDE8FF 50%,#3FA9E0 50%,#3FA9E0 62%,#F5D78E 62%)'},{id:'zamek',name:'Zámek',cost:30,css:'linear-gradient(#E8E4FF,#F6F3FF 60%,#B9B3D9 60%,#A39BCB)'}];
const STAGES=[{min:0,name:'Vajíčko'},{min:5,name:'Mládě'},{min:60,name:'Malý kamarád'},{min:200,name:'Velký kamarád'},{min:500,name:'Šampion'}];
const petOf=kid=>kidOf(kid).pet||null;
const petXp=(kid,p)=>sumLog(l=>l.kid===kid&&(l.type==='task'||l.type==='streak')&&l.ts>=(p.born||0));
const stageOf=xp=>{let s=0;STAGES.forEach((x,i)=>{if(xp>=x.min)s=i});return s};
const clamp=v=>Math.max(0,Math.min(100,v));
function nightH(a,b){if(b-a>72*3600000)a=b-72*3600000;let n=0;for(let t=a;t<b;t+=900000){const hr=new Date(t).getHours();if(hr>=21||hr<7)n+=Math.min(900000,b-t)}return n/3600000}
function petNow(p){ // apply time decay without writing
  const now=Date.now(),h=Math.max(0,(now-(p.ts||now))/3600000),asleep=p.sleepUntil&&p.sleepUntil>(p.ts||0);
  let sleepH=asleep?Math.max(0,Math.min(now,p.sleepUntil)-(p.ts||now))/3600000:0;sleepH=Math.min(h,sleepH+nightH(p.ts||now,now)*(asleep?0:1));const awakeH=Math.max(0,h-sleepH);
  return{...p,food:clamp((p.food??80)-h*4),joy:clamp((p.joy??80)-awakeH*3),clean:clamp((p.clean??80)-h*2),energy:clamp((p.energy??80)-awakeH*2+sleepH*40),asleep:!!(p.sleepUntil&&p.sleepUntil>now),ts:now}}
const petMood=p=>{const m=(p.food+p.joy+p.clean+p.energy)/4;return m>=60?'happy':m>=30?'ok':'sad'};
function petWish(p){if(p.asleep)return 'Zzz… spinkám';if(p.food<30)return 'Mám hlad!';if(p.clean<30)return 'Chci se vykoupat!';if(p.energy<25)return 'Jsem ospalý…';if(p.joy<30)return 'Pohraj si se mnou!';return pick(['Mám tě rád!','Jsem spokojený!','Hurá, jsi tu!','Splníme dneska úkol?'])}
function petSvg(p,size=200){
  const T=PET_TYPES.find(t=>t.id===p.type)||PET_TYPES[0],xp=p.xp||0,st=stageOf(xp);
  if(st===0)return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" class="petsvg"><ellipse cx="100" cy="180" rx="46" ry="8" fill="rgba(0,0,0,.12)"/><path d="M100 30 C140 30 158 100 158 128 C158 162 132 180 100 180 C68 180 42 162 42 128 C42 100 60 30 100 30Z" fill="#FFF8EE" stroke="#2B2350" stroke-width="4"/><circle cx="80" cy="90" r="10" fill="${T.col}"/><circle cx="122" cy="120" r="13" fill="${T.col}"/><circle cx="92" cy="146" r="8" fill="${T.col}"/>${xp>=2?'<path d="M70 70 l12 10 l8 -12 l10 12" fill="none" stroke="#2B2350" stroke-width="3"/>':''}</svg>`;
  const sc=[0,.78,.9,1,1.05][st],mood=petMood(p),sleep=p.asleep;
  const angry=!sleep&&(p.angry||(typeof PET_ANGRY!=='undefined'&&PET_ANGRY>Date.now()&&p.live));
  const eyes=sleep?'<path d="M76 104 q8 6 16 0 M108 104 q8 6 16 0" stroke="#2B2350" stroke-width="4" fill="none" stroke-linecap="round"/>':angry?'<path d="M70 84 l24 10 M130 84 l-24 10" stroke="#2B2350" stroke-width="6" stroke-linecap="round"/><circle cx="84" cy="104" r="7" fill="#2B2350"/><circle cx="116" cy="104" r="7" fill="#2B2350"/><circle cx="86" cy="101" r="2" fill="#fff"/><circle cx="118" cy="101" r="2" fill="#fff"/>':mood==='happy'?'<g class="blink"><ellipse cx="84" cy="102" rx="9" ry="11" fill="#2B2350"/><ellipse cx="116" cy="102" rx="9" ry="11" fill="#2B2350"/><circle cx="87" cy="97" r="4" fill="#fff"/><circle cx="119" cy="97" r="4" fill="#fff"/><circle cx="81" cy="106" r="2" fill="#fff"/><circle cx="113" cy="106" r="2" fill="#fff"/></g>':'<circle cx="84" cy="102" r="7" fill="#2B2350"/><circle cx="116" cy="102" r="7" fill="#2B2350"/><circle cx="86" cy="99" r="2.5" fill="#fff"/><circle cx="118" cy="99" r="2.5" fill="#fff"/>';
  const mouth=angry?'<path d="M86 126 l7 -6 l7 6 l7 -6 l7 6" stroke="#2B2350" stroke-width="4" fill="#fff" stroke-linejoin="round"/>':sleep?'<ellipse cx="100" cy="124" rx="5" ry="4" fill="#2B2350"/>':mood==='sad'?'<path d="M88 128 q12 -10 24 0" stroke="#2B2350" stroke-width="4" fill="none" stroke-linecap="round"/>':'<path d="M88 120 q12 14 24 0" stroke="#2B2350" stroke-width="4" fill="#FF8FB1" stroke-linecap="round"/>';
  const ears={pes:`<ellipse cx="58" cy="92" rx="16" ry="34" transform="rotate(20 58 92)" fill="${T.col}" filter="brightness(.8)"/><ellipse cx="142" cy="92" rx="16" ry="34" transform="rotate(-20 142 92)" fill="${T.col}" filter="brightness(.8)"/>`,
    kocka:`<polygon points="56,78 64,36 92,62" fill="${T.col}"/><polygon points="144,78 136,36 108,62" fill="${T.col}"/><polygon points="64,70 68,48 84,62" fill="#FFB3C7"/><polygon points="136,70 132,48 116,62" fill="#FFB3C7"/>`,
    zajic:`<ellipse cx="80" cy="34" rx="12" ry="36" fill="${T.col}"/><ellipse cx="120" cy="34" rx="12" ry="36" fill="${T.col}"/><ellipse cx="80" cy="36" rx="6" ry="26" fill="#FFC9D9"/><ellipse cx="120" cy="36" rx="6" ry="26" fill="#FFC9D9"/>`,
    drak:`<polygon points="70,58 78,34 88,56" fill="#2E9E5B"/><polygon points="92,52 100,26 108,52" fill="#2E9E5B"/><polygon points="112,56 122,34 130,58" fill="#2E9E5B"/>`,
    jednorozec:`<polygon points="100,18 92,58 108,58" fill="#FFD84D" stroke="#E0A800" stroke-width="2"/><path d="M60 70 q-14 20 -4 50" stroke="#C77DFF" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M66 64 q-8 22 0 46" stroke="#4FB6FF" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    medved:`<circle cx="62" cy="62" r="18" fill="${T.col}"/><circle cx="138" cy="62" r="18" fill="${T.col}"/><circle cx="62" cy="62" r="9" fill="${T.belly}"/><circle cx="138" cy="62" r="9" fill="${T.belly}"/>`}[T.id];
  const dirt=p.clean<35?'<g fill="#8B5A3C" opacity=".55"><circle cx="66" cy="140" r="6"/><circle cx="134" cy="150" r="5"/><circle cx="118" cy="80" r="4"/></g>':'';
  return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" class="petsvg ${sleep?'':'bob'}"><g transform="translate(100 110) scale(${sc}) translate(-100 -110)">
    <ellipse cx="100" cy="186" rx="52" ry="8" fill="rgba(0,0,0,.12)"/>${ears}
    <ellipse cx="100" cy="120" rx="62" ry="64" fill="${T.col}" stroke="#2B2350" stroke-width="4"/><ellipse cx="100" cy="146" rx="38" ry="32" fill="${T.belly}"/>
    <ellipse cx="66" cy="182" rx="16" ry="9" fill="${T.col}" stroke="#2B2350" stroke-width="3"/><ellipse cx="134" cy="182" rx="16" ry="9" fill="${T.col}" stroke="#2B2350" stroke-width="3"/>
    ${eyes}<ellipse cx="72" cy="118" rx="9" ry="6" fill="#FF8FB1" opacity=".6"/><ellipse cx="128" cy="118" rx="9" ry="6" fill="#FF8FB1" opacity=".6"/>${mouth}${dirt}
    ${T.id==='drak'?'<path d="M158 150 q24 0 30 -20 l-10 4" fill="none" stroke="#2E9E5B" stroke-width="10" stroke-linecap="round"/>':''}</g>
    ${sleep?'<text x="150" y="50" font-size="26" font-weight="900" fill="#6F5BFF">Z</text><text x="168" y="30" font-size="18" font-weight="900" fill="#6F5BFF">z</text>':''}</svg>`;
}
function petWearHtml(p,size){const w=p.wear||{},g=id=>(PET_WEAR.find(x=>x.id===id)||{}).e||'';const s=size/200,st=stageOf(p.xp||0);if(st===0)return '';
  return `${w.hat?`<span class="pw" style="top:${2*s}px;font-size:${52*s}px">${g(w.hat)}</span>`:''}${w.glasses?`<span class="pw" style="top:${72*s}px;font-size:${46*s}px">${g(w.glasses)}</span>`:''}${w.neck?`<span class="pw" style="top:${140*s}px;font-size:${38*s}px">${g(w.neck)}</span>`:''}`}
function petTile(id){if(!itemsFor(id).some(i=>i.id==='pet'))return '';
  const p=petOf(id);
  if(!has(id,'pet'))return `<button class="tile wide pettile lock" data-act="go" data-to="pet"><span class="ic">🥚</span><span><span class="nm">Mazlíček</span><br><span class="sub">Odemkni si ho za ${S.settings.prices[id].pet} ⭐</span></span></button>`;
  if(!p||!p.type)return `<button class="tile wide pettile" data-act="go" data-to="pet"><span class="ic">🥚</span><span><span class="nm">Mazlíček</span><br><span class="sub">Vyber si zvířátko!</span></span></button>`;
  const q={...petNow(p),xp:petXp(id,p)};
  return `<button class="tile wide pettile" data-act="go" data-to="pet"><span class="pmini">${petSvg(q,64)}</span><span><span class="nm">${esc(p.name)}</span><br><span class="sub">${esc(petWish(q))}</span></span></button>`}
function savePet(id,p){const{asleep,xp,...rest}=p;put(`kids/${id}/pet`,rest)}
function vPet(){const id=V.kid,pts=pointsOf(id);
  if(!has(id,'pet'))return `${topbar('Mazlíček')}<div class="card sec center">${petSvg({type:'pes',xp:0},160)}<h2>Vlastní mazlíček</h2><p>Vybereš si zvířátko, pojmenuješ ho a staráš se o něj: krmíš, mazlíš, koupeš a uspáváš. Roste, když plníš úkoly!</p>
    ${pts>=S.settings.prices[id].pet?`<button class="btn big" data-act="buy" data-item="pet">Odemknout za ${S.settings.prices[id].pet} ⭐</button>`:`<div class="bar"><i style="width:${pts/S.settings.prices[id].pet*100}%"></i></div><span class="muted">Máš ${pts} z ${S.settings.prices[id].pet} ⭐</span>`}</div>`;
  const p=petOf(id);
  if(!p||!p.type){const sel=V.petPick||'pes';return `${topbar('Nový mazlíček')}<p class="qtext">Vyber si zvířátko</p>
    <div class="petpick">${PET_TYPES.map(t=>`<button class="petopt ${sel===t.id?'on':''}" data-act="petPick" data-t="${t.id}">${petSvg({type:t.id,xp:10,food:90,joy:90,clean:90,energy:90},90)}<span>${t.name}</span></button>`).join('')}</div>
    <label class="field card"><span>Jak se bude jmenovat?</span><input id="petname" maxlength="14" placeholder="Např. Bobík" value="${esc(V.petName||'')}"></label>
    <button class="btn big" data-act="petCreate" style="align-self:center">Vylíhnout! 🥚</button>`}
  const q={...petNow(p),xp:petXp(id,p)},st=stageOf(q.xp),nxt=STAGES[st+1],tab=V.petTab||'care',bg=PET_BG.find(b=>b.id===(p.wear||{}).bg)||PET_BG[0];
  const bar=(ic,l,v)=>`<div class="pstat"><span>${ic}</span><div class="bar"><i style="width:${v}%;background:${v<30?'var(--flame)':v<60?'var(--sun)':'var(--mint)'}"></i></div><b>${Math.round(v)}</b><span class="sr">${l}</span></div>`;
  let body='';
  if(tab==='care')body=`<div class="pact">
     <button class="btn" data-act="petTab" data-t="food">🍽️ Nakrmit</button><button class="btn" data-act="petPlay">⚽ Hrát</button>
     <button class="btn" data-act="petWash">🛁 Umýt</button><button class="btn" data-act="petSleep">${q.asleep?'☀️ Probudit':'😴 Spát'}</button></div>
     <p class="muted center">Pohlaď ho: ťukni na mazlíčka.</p>`;
  if(tab==='food')body=`<div class="foodrow">${PET_FOOD.map(f=>`<button class="foodbtn" data-act="petFeed" data-f="${f.id}" ${pts<f.cost?'disabled':''}><span>${f.e}</span><b>${f.name}</b><i>${f.cost} ⭐</i></button>`).join('')}</div><button class="btn ghost" data-act="petTab" data-t="care">Zpět</button>`;
  if(tab==='wear'){const own=p.owned||{},w=p.wear||{};body=`${['hat','glasses','neck'].map(sl=>`<div class="wearrow">${PET_WEAR.filter(x=>x.slot===sl).map(x=>{const o=own[x.id],on=w[sl]===x.id;
      return `<button class="wearbtn ${on?'on':''}" data-act="${o?'petWear':'petBuyWear'}" data-w="${x.id}"><span>${x.e}</span><i>${on?'Nosí':o?'Obléct':`${x.cost} ⭐`}</i></button>`}).join('')}</div>`).join('')}
     <button class="btn ghost" data-act="petUnwear">Svléct vše</button>`}
  if(tab==='talk')body=talkTab();
  if(tab==='home'){const own=p.owned||{},w=p.wear||{};body=`<div class="bgrow">${PET_BG.map(b=>{const o=b.cost===0||own['bg_'+b.id],on=(w.bg||'louka')===b.id;
      return `<button class="bgbtn ${on?'on':''}" data-act="${o?'petBg':'petBuyBg'}" data-b="${b.id}" style="background:${b.css}"><i>${b.name}<br>${on?'✓':o?'Vybrat':`${b.cost} ⭐`}</i></button>`}).join('')}</div>`}
  return `${topbar(p.name)}
  <div class="petscene" style="background:${bg.css}"><div class="bubble2">${esc(petBubble(q))}</div><button class="petbody" data-act="petPet" aria-label="Pohladit">${petSvg({...q,live:true},200)}${petWearHtml(q,200)}</button></div>
  <div class="card sec">${bar('🍎','Sytost',q.food)}${bar('💛','Radost',q.joy)}${bar('🛁','Čistota',q.clean)}${bar('⚡','Energie',q.energy)}
   <div class="row" style="justify-content:space-between"><b>${STAGES[st].name}</b><span class="muted">${nxt?`do další úrovně ${nxt.min-q.xp} ⭐ z úkolů`:'nejvyšší úroveň!'}</span></div>
   <div class="bar"><i style="width:${nxt?Math.min(100,(q.xp-STAGES[st].min)/(nxt.min-STAGES[st].min)*100):100}%"></i></div><span class="note">${st===0?'Splň úkol a mazlíček se vylíhne!':'Roste z hvězdiček za splněné úkoly.'}</span></div>
  <nav class="ptabs"><button class="${tab==='care'||tab==='food'?'on':''}" data-act="petTab" data-t="care">Péče</button><button class="${tab==='wear'?'on':''}" data-act="petTab" data-t="wear">Šatník</button><button class="${tab==='home'?'on':''}" data-act="petTab" data-t="home">Domeček</button><button class="${tab==='talk'?'on':''}" data-act="petTab" data-t="talk">Povídání</button></nav>
  ${body}`;
}
function petFx(e){const s=$('.petscene');if(!s)return;const el=document.createElement('span');el.className='petfx';el.textContent=e;el.style.left=(40+Math.random()*20)+'%';s.appendChild(el);setTimeout(()=>el.remove(),1200)}
function petAct(fn,fx,snd='pop'){const id=V.kid,p=petNow(petOf(id));fn(p);savePet(id,p);chime(snd);render();if(fx)for(let i=0;i<3;i++)setTimeout(()=>petFx(fx),i*150)}
MAP.pet=vPet;
Object.assign(handlers,{
  petPick:b=>{V.petName=($('#petname')||{}).value||V.petName;V.petPick=b.dataset.t;render()},
  petCreate:()=>{const id=V.kid,name=($('#petname').value||'').trim()||PET_TYPES.find(t=>t.id===(V.petPick||'pes')).name;
    put(`kids/${id}/pet`,{type:V.petPick||'pes',name,born:Date.now(),ts:Date.now(),food:80,joy:90,clean:90,energy:90,owned:{},wear:{}});render();
    celebrate({title:`Ahoj, ${name}!`,sub:'Tvůj mazlíček je zatím vajíčko. Splň úkol a vylíhne se!',speak:`Ahoj ${name}!`})},
  petTab:b=>{V.petTab=b.dataset.t;render()},
  petPet:()=>{const p=petOf(V.kid);if(petNow(p).asleep){toast('Psst, spinká…');return}petAct(q=>{q.joy=clamp(q.joy+6)},'💖');},
  petPlay:()=>{const p=petNow(petOf(V.kid));if(p.asleep){toast('Nejdřív ho probuď');return}if(p.energy<10){toast('Je moc unavený, ať se vyspí');return}petAct(q=>{q.joy=clamp(q.joy+20);q.energy=clamp(q.energy-12);q.food=clamp(q.food-5)},'⚽')},
  petWash:()=>petAct(q=>{q.clean=100;q.joy=clamp(q.joy+5)},'🫧'),
  petSleep:()=>petAct(q=>{q.sleepUntil=q.asleep?0:Date.now()+90*60000},null,'tick'),
  petFeed:b=>{const id=V.kid,f=PET_FOOD.find(x=>x.id===b.dataset.f);if(pointsOf(id)<f.cost)return;if(petNow(petOf(id)).food>=98){toast('Už je plný!');return}
    addLog(id,-f.cost,'pet',`Mazlíček: ${f.name}`,true);petAct(q=>{q.food=clamp(q.food+f.food);q.joy=clamp(q.joy+f.joy);q.sleepUntil=0},f.e);refreshJar()},
  petBuyWear:b=>{const id=V.kid,x=PET_WEAR.find(w=>w.id===b.dataset.w);if(pointsOf(id)<x.cost){toast(`Chybí ti ${x.cost-pointsOf(id)} ⭐`);return}
    addLog(id,-x.cost,'pet',`Mazlíček: ${x.name}`,true);petAct(q=>{q.owned={...(q.owned||{}),[x.id]:true};q.wear={...(q.wear||{}),[x.slot]:x.id};q.joy=clamp(q.joy+10)},x.e,'win')},
  petWear:b=>{const x=PET_WEAR.find(w=>w.id===b.dataset.w);petAct(q=>{const w={...(q.wear||{})};w[x.slot]=w[x.slot]===x.id?null:x.id;q.wear=w},x.e)},
  petUnwear:()=>petAct(q=>{q.wear={bg:(q.wear||{}).bg||null}}),
  petBuyBg:b=>{const id=V.kid,x=PET_BG.find(w=>w.id===b.dataset.b);if(pointsOf(id)<x.cost){toast(`Chybí ti ${x.cost-pointsOf(id)} ⭐`);return}
    addLog(id,-x.cost,'pet',`Mazlíček: domeček ${x.name}`,true);petAct(q=>{q.owned={...(q.owned||{}),['bg_'+x.id]:true};q.wear={...(q.wear||{}),bg:x.id}},'🏠','win')},
  petBg:b=>petAct(q=>{q.wear={...(q.wear||{}),bg:b.dataset.b}})
});
