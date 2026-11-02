(()=>{
/* ================= configuration ================= */
const FIREBASE_CONFIG=/*FIREBASE_CONFIG*/null;
const APP_VERSION='/*APP_VERSION*/dev';
const SYNC=!!FIREBASE_CONFIG;

/* ================= helpers ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const dstr=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const today=()=>dstr(new Date());
const yesterday=()=>{const d=new Date();d.setDate(d.getDate()-1);return dstr(d)};
const weekStart=()=>{const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));return dstr(d)};
const daysLeftInWeek=()=>{const g=new Date().getDay();return g===0?0:7-g};
const uid=()=>Math.random().toString(36).slice(2,9);
const plural=(n,a,b,c)=>n===1?a:(n>=2&&n<=4?b:c);
const pick=a=>a[Math.random()*a.length|0];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const KIDS=['lea','bea','jirka'];

/* ================= device (this phone only) ================= */
const LKEY='bodikov-v2',V1KEY='bodikov-v1',DKEY='bodikov-device';
let DEV={};try{DEV=JSON.parse(ls.get(DKEY)||'{}')}catch(e){}
if(!DEV.id)DEV.id=uid()+uid();
const hm=/rodina=([a-z0-9]{12,40})/i.exec(location.hash||'');
if(hm){DEV.family=hm[1].toLowerCase();try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}
const saveDev=()=>ls.set(DKEY,JSON.stringify(DEV));saveDev();
const role=()=>SYNC?(DEV.family&&DEV.role)||null:'shared';
const isKidRole=r=>['lea','bea','jirka'].includes(r);

/* ================= shared state ================= */
function defaults(){const d=today(),t=Date.now();return{
  v:2,
  settings:{pin:'1234',gameCap:20,learnCap:15,
    prices:{lea:{mirror4:20,rainbow:15,glitter:25,kaleido:40,mandala6:20,mandala8:35,pack_space:25,pack_animals:25,game_tetris:40,game_cars:40,game_build:40},
            bea:{mirror4:40,rainbow:30,glitter:50,kaleido:80,mandala6:40,mandala8:70,pack_space:50,pack_animals:50,game_tetris:40,game_cars:40,game_build:40},
            jirka:{tetris_neon:30,cars_night:30,build_gold:30}},
    morning:{enabled:true,start:'06:30',end:'08:09',bonus:5,auto:false,kids:{lea:true,bea:true,jirka:false},items:[
      {id:'eat',title:'Najíst se',icon:'🥣',points:5},{id:'dress',title:'Obléct se',icon:'👕',points:5},
      {id:'teeth',title:'Vyčistit zuby',icon:'🪥',points:5},{id:'hair',title:'Učesat se',icon:'💇‍♀️',points:5}]},
    team:{name:'Rodinný filmový večer',icon:'🍿',target:150,since:d}},
  kids:{
    lea:{name:'Lea',voc:'Leo',avatar:'🦄',little:true,unlocked:{},streak:{count:0,last:''},mbonus:'',weekTarget:40},
    bea:{name:'Bea',voc:'Beo',avatar:'🦊',little:false,unlocked:{},streak:{count:0,last:''},mbonus:'',weekTarget:80},
    jirka:{name:'Jirka',voc:'Jirko',avatar:'🐻',little:false,adult:true,unlocked:{},streak:{count:0,last:''},mbonus:'',weekTarget:60}},
  tasks:{
    't-socks':{id:'t-socks',kid:'lea',title:'Uklidit ponožky',icon:'🧦',points:10,repeat:'once',status:'open',minutes:5,steps:[],ts:t},
    't-bed':{id:'t-bed',kid:'bea',title:'Ustlat postel',icon:'🛏️',points:5,repeat:'daily',status:'open',minutes:5,steps:[],ts:t+1},
    't-room':{id:'t-room',kid:'bea',title:'Uklidit pokoj',icon:'🧹',points:20,repeat:'once',status:'open',minutes:15,ts:t+2,
      steps:[{t:'Hračky do krabice',d:false},{t:'Oblečení do skříně',d:false},{t:'Knížky do poličky',d:false}]}},
  log:{
    'w-lea':{id:'w-lea',d,ts:t,kid:'lea',pts:10,type:'bonus',text:'Uvítací dárek'},
    'w-bea':{id:'w-bea',d,ts:t,kid:'bea',pts:10,type:'bonus',text:'Uvítací dárek'}}
}}
function normalize(o){
  const D=defaults();if(!o||typeof o!=='object')o=D;
  o.v=2;o.settings=Object.assign({},D.settings,o.settings||{});const st=o.settings;
  st.prices=st.prices||{};KIDS.forEach(k=>{st.prices[k]=Object.assign({},D.settings.prices[k],st.prices[k]||{});ITEMS.forEach(i=>{if(forOf(i).includes(k)&&st.prices[k][i.id]==null)st.prices[k][i.id]=i.price||40})});
  if(st.stickerPrice==null)st.stickerPrice=15;
  st.morning=Object.assign({},D.settings.morning,st.morning||{});st.morning.kids=Object.assign({},D.settings.morning.kids,st.morning.kids||{});
  if(!Array.isArray(st.morning.items))st.morning.items=Object.values(st.morning.items||{});
  if(!st.morning.items.length)st.morning.items=D.settings.morning.items;
  st.team=Object.assign({},D.settings.team,st.team||{});
  o.kids=o.kids||{};KIDS.forEach(k=>{o.kids[k]=Object.assign({},D.kids[k],o.kids[k]||{});o.kids[k].unlocked=o.kids[k].unlocked||{};o.kids[k].streak=Object.assign({count:0,last:''},o.kids[k].streak||{})});
  o.tasks=o.tasks||{};Object.values(o.tasks).forEach(t=>{t.steps=Array.isArray(t.steps)?t.steps:Object.values(t.steps||{})});
  o.log=o.log||{};o.rewards=o.rewards||{};o.claims=o.claims||{};
  return o;
}
function fromV1(o){
  const n=defaults();
  n.settings.pin=o.pin||'1234';n.settings.gameCap=o.gameCap??20;if(o.prices)n.settings.prices=o.prices;if(o.morning)n.settings.morning=o.morning;if(o.team)n.settings.team=o.team;
  n.tasks={};(o.tasks||[]).forEach((t,i)=>{if(!t.morning)n.tasks[t.id]={...t,ts:Date.now()+i}});
  n.log={};(o.log||[]).slice().reverse().forEach((l,i)=>{const id='v1-'+i;n.log[id]={...l,id,ts:(Date.parse(l.d)||Date.now())+i}});
  KIDS.forEach(k=>{const ok=o.kids&&o.kids[k];if(!ok)return;const nk=n.kids[k];
    nk.unlocked={};(ok.unlocked||[]).forEach(x=>nk.unlocked[x]=true);nk.streak=ok.streak||nk.streak;nk.mbonus=ok.mbonus||'';nk.weekTarget=ok.weekTarget||nk.weekTarget;
    const sum=Object.values(n.log).filter(l=>l.kid===k).reduce((a,l)=>a+l.pts,0);
    if(typeof ok.points==='number'&&ok.points!==sum){const id='v1-adj-'+k;n.log[id]={id,d:today(),ts:Date.now(),kid:k,pts:ok.points-sum,type:'bonus',text:'Převod hvězdiček'}}});
  return n;
}
let S;
function loadLocal(){
  let o=null;try{const r=ls.get(LKEY);if(r)o=JSON.parse(r)}catch(e){}
  if(!o){try{const r=ls.get(V1KEY);if(r)o=fromV1(JSON.parse(r))}catch(e){}}
  S=normalize(o);
}
const saveLocal=()=>ls.set(LKEY,JSON.stringify(S));

/* ---- writes: local first, then the shared database ---- */
let pending={},flushT=null;
function setLocal(path,val){const ps=path.split('/');let o=S;for(let i=0;i<ps.length-1;i++){if(o[ps[i]]==null||typeof o[ps[i]]!=='object')o[ps[i]]={};o=o[ps[i]]}const last=ps[ps.length-1];if(val==null)delete o[last];else o[last]=clone(val)}
const getLocal=path=>path.split('/').reduce((o,p)=>o==null?undefined:o[p],S);
function put(path,val){
  setLocal(path,val);
  Object.keys(pending).forEach(p=>{if(p.startsWith(path+'/'))delete pending[p]});
  const anc=Object.keys(pending).find(p=>path.startsWith(p+'/'));
  if(anc)pending[anc]=clone(getLocal(anc))??null;else pending[path]=val==null?null:clone(val);
  if(!flushT)flushT=setTimeout(flush,0);
}
function flush(){flushT=null;saveLocal();const u=pending;pending={};if(DB&&Object.keys(u).length)DB.update(u).catch(e=>{console.error(e);toast('Uložení se nepovedlo. Zkusím to znovu.')})}
function addLog(kid,pts,type,text,self=false){const ts=Date.now();const id=ts.toString(36)+uid();put(`log/${id}`,{id,d:today(),ts,kid,pts,type,text,dev:DEV.id,self})}

/* ---- derived values ---- */
const kidOf=id=>S.kids[id];
const logs=()=>Object.values(S.log).sort((a,b)=>b.ts-a.ts);
const pointsOf=kid=>Object.values(S.log).reduce((a,l)=>l.kid===kid?a+(+l.pts||0):a,0);
const has=(kid,item)=>!!kidOf(kid).unlocked[item];
const taskList=()=>Object.values(S.tasks).sort((a,b)=>(b.morning?1:0)-(a.morning?1:0)||(a.mo??0)-(b.mo??0)||(a.ts||0)-(b.ts||0));
const streakOf=k=>(k.streak.last===today()||k.streak.last===yesterday())?k.streak.count:0;
const pendingPts=kid=>taskList().filter(t=>t.kid===kid&&t.status==='pending').reduce((a,t)=>a+t.points+(t.fast?2:0),0);
const sumLog=f=>Object.values(S.log).filter(f).reduce((a,l)=>a+(+l.pts||0),0);
const weekPts=kid=>{const ws=weekStart();return sumLog(l=>l.kid===kid&&l.d>=ws&&(l.type==='task'||l.type==='streak'))};
const teamPts=()=>sumLog(l=>l.d>=S.settings.team.since&&(l.type==='task'||l.type==='streak'));
const learnCapOf=kid=>{const v=kidOf(kid)&&kidOf(kid).learnCap;return typeof v==='number'?v:S.settings.learnCap};
const pendingCount=()=>pendingClaims().length+taskList().filter(t=>t.status==='pending').length;

/* ---- morning window ---- */
const toMin=s=>{const[a,b]=String(s||'0:0').split(':').map(Number);return a*60+(b||0)};
const nowMin=()=>{const d=new Date();return d.getHours()*60+d.getMinutes()};
function mWin(){const m=S.settings.morning;if(!m.enabled)return 'off';const n=nowMin();return n<toMin(m.start)?'before':n<toMin(m.end)?'in':'after'}
const minsLeft=()=>Math.max(1,toMin(S.settings.morning.end)-nowMin());

/* ---- daily upkeep, idempotent so every phone can run it ---- */
function maintenance(){
  const td=today();
  if(!S.settings.migBea50&&(firstSnap||!SYNC||!DEV.family)){put('kids/bea/learnCap',50);put('settings/migBea50',true)}
  if(!S.settings.rewardsInit&&(firstSnap||!SYNC||!DEV.family)){DEFAULT_REWARDS.forEach(r=>put(`rewards/${r.id}`,r));put('settings/rewardsInit',true)}
  Object.values(S.tasks).forEach(t=>{if(t.repeat==='daily'&&t.status==='done'&&t.doneDate!==td)
    put(`tasks/${t.id}`,{...t,status:'open',fast:false,timerEnd:null,steps:(t.steps||[]).map(s=>({...s,d:false}))})});
  const m=S.settings.morning;
  KIDS.forEach(kid=>m.items.forEach((it,i)=>{const id=`m-${it.id}-${kid}`,t=S.tasks[id];
    if(!m.enabled||m.kids[kid]===false){if(t&&t.status!=='pending')put(`tasks/${id}`,null);return}
    if(!t)put(`tasks/${id}`,{id,kid,morning:true,mo:i,repeat:'daily',status:'open',minutes:0,steps:[],title:it.title,icon:it.icon,points:it.points,ts:0});
    else if(t.title!==it.title||t.icon!==it.icon||t.points!==it.points||t.mo!==i)put(`tasks/${id}`,{...t,title:it.title,icon:it.icon,points:it.points,mo:i});
  }));
}

/* ================= sync ================= */
let DB=null,syncState=SYNC?'connecting':'local',firstSnap=false;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function startSync(){
  if(!SYNC||!DEV.family||DB)return;
  try{
    const v='10.12.2',b=`https://www.gstatic.com/firebasejs/${v}/`;
    if(!window.firebase){await loadScript(b+'firebase-app-compat.js');await loadScript(b+'firebase-auth-compat.js');await loadScript(b+'firebase-database-compat.js')}
    if(!firebase.apps.length)firebase.initializeApp(FIREBASE_CONFIG);
    await firebase.auth().signInAnonymously();
    firebase.database().ref('.info/connected').on('value',s=>{syncState=s.val()?'online':'offline';updSync()});
    DB=firebase.database().ref('families/'+DEV.family+'/state');
    DB.on('value',snap=>{
      const val=snap.val();
      if(!val){DB.set(clone(S));return}
      S=normalize(val);saveLocal();firstSnap=true;maintenance();softRender();
    },e=>{console.error(e);syncState='error';updSync()});
  }catch(e){console.error(e);syncState='error';updSync()}
}
function updSync(){document.querySelectorAll('.sync').forEach(el=>{el.className='sync '+syncState;el.lastChild.textContent=syncLabel()})}
const syncLabel=()=>({local:'Jen v tomto zařízení',connecting:'Připojuji…',online:'Propojeno',offline:'Bez internetu, uloží se později',error:'Chyba připojení'})[syncState];
const syncBadge=()=>`<span class="sync ${syncState}"><i></i>${esc(syncLabel())}</span>`;

/* ---- automatic app updates ---- */
let updateReady=false;
async function checkUpdate(){
  if(!SYNC||APP_VERSION==='dev')return;
  try{const r=await fetch('version.json?t='+Date.now(),{cache:'no-store'});const j=await r.json();if(j.v&&j.v!==APP_VERSION){updateReady=true;maybeReload()}}catch(e){}
}
function maybeReload(){if(updateReady&&['home','picker','parent','setup'].includes(V.name)&&!document.querySelector('.ov'))location.reload()}

/* ================= catalog ================= */
const ITEMS=[
  {id:'mirror4',icon:'✳️',name:'Malování na 4 strany',desc:'Obrázek se zrcadlí do všech rohů.'},
  {id:'rainbow',icon:'🌈',name:'Duhový štětec',desc:'Každá čára hraje všemi barvami.'},
  {id:'glitter',icon:'✨',name:'Třpytivý štětec',desc:'Kolem čáry jiskří třpytky.'},
  {id:'kaleido',icon:'❄️',name:'Kaleidoskop',desc:'12 zrcadel, kreslíš sněhové vločky.',needs:'mirror4'},
  {id:'mandala6',icon:'🌸',name:'Mandala na 6 stran',desc:'Mandala jako květina se šesti lístky.'},
  {id:'mandala8',icon:'🌼',name:'Mandala na 8 stran',desc:'Nejbohatší mandala s osmi stranami.',needs:'mandala6'},
  {id:'pack_space',icon:'🚀',name:'Vybarvovánky: Vesmír',desc:'Raketa a planeta s prstýnkem.'},
  {id:'pack_animals',icon:'🐱',name:'Vybarvovánky: Zvířátka',desc:'Kočička a motýlek.'},
  {id:'game_tetris',icon:'🧱',name:'Hra: Tetris',desc:'Skládej kostky do řad.'},
  {id:'game_cars',icon:'🏎️',name:'Hra: Autíčka',desc:'Uhýbej autům na silnici.'},
  {id:'game_build',icon:'🏗️',name:'Hra: Stavitel',desc:'Postav co nejvyšší věž.'},
  {id:'pet',for:['lea','bea','jirka'],price:100,icon:'🥚',name:'Mazlíček',desc:'Vlastní zvířátko, které roste s tvými úkoly.'},
  {id:'game_pexeso',for:['lea','bea'],price:40,icon:'🃏',name:'Hra: Pexeso',desc:'Najdi dvojice obrázků.'},
  {id:'pexeso_big',for:['lea','bea'],price:25,icon:'🎴',name:'Pexeso: 20 kartiček',desc:'Velké pexeso pro odborníky.',needs:'game_pexeso'},
  {id:'game_puzzle',for:['lea','bea'],price:40,icon:'🧩',name:'Hra: Puzzle',desc:'Slož obrázek nebo vlastní fotku.'},
  {id:'puzzle_big',for:['lea','bea'],price:25,icon:'🖼️',name:'Puzzle: 16 a 25 dílků',desc:'Větší a těžší puzzle.',needs:'game_puzzle'},
  {id:'game_bubbles',for:['lea','bea'],price:30,icon:'🫧',name:'Hra: Bublinky a ohňostroj',desc:'Praskej bubliny a pouštěj ohňostroj.'},
  {id:'game_music',for:['lea','bea'],price:30,icon:'🎵',name:'Hra: Hudební zvířátka',desc:'Zvířátka hrají tóny, zahraj písničku.'},
  {id:'game_pixel',for:['bea'],price:40,icon:'🟥',name:'Hra: Pixel art',desc:'Malování po čtverečcích podle předlohy.'},
  {id:'pixel_pack2',for:['bea'],price:25,icon:'🐱',name:'Pixel art: další předlohy',desc:'Kočka, raketa, kytka a duha.',needs:'game_pixel'},
  {id:'game_diff',for:['lea','bea'],price:40,icon:'🔍',name:'Hra: Hledej rozdíly',desc:'Najdi 5 rozdílů mezi obrázky.'},
  {id:'game_maze',for:['lea','bea'],price:40,icon:'🌀',name:'Hra: Bludiště',desc:'Doveď myšku k sýru.'},
  {id:'game_hangman',for:['bea'],price:40,icon:'🎈',name:'Hra: Šibenice s balónky',desc:'Uhodni vyjmenované slovo.'},
  {id:'game_duel',for:['bea','jirka'],price:40,icon:'⚔️',name:'Hra: Souboj v násobilce',desc:'Dva hráči na jednom telefonu.'},
  {id:'game_snake',for:['jirka','bea'],price:40,icon:'🐍',name:'Hra: Had',desc:'Sbírej jablka a nenaraz.'},
  {id:'game_breakout',for:['jirka','bea'],price:40,icon:'🧱',name:'Hra: Rozbíječ cihel',desc:'Míčkem rozbij všechny cihly.'},
  {id:'game_parking',for:['jirka','bea'],price:40,icon:'🅿️',name:'Hra: Parkování',desc:'Zaparkuj auto bez nárazu.'},
  {id:'game_2048',for:['jirka','bea'],price:40,icon:'🔢',name:'Hra: 2048',desc:'Spojuj stejná čísla.'},
  {id:'cars_snow',for:['jirka'],price:25,icon:'❄️',name:'Autíčka: zasněžená silnice',desc:'Jízda zimní krajinou.'},
  {id:'cars_desert',for:['jirka'],price:25,icon:'🏜️',name:'Autíčka: poušť',desc:'Jízda pouští.'},
  {id:'cars_race',for:['jirka'],price:30,icon:'🏁',name:'Autíčka: závodní auto',desc:'Červené závodní auto s pruhem.'},
  {id:'tetris_neon',aud:'adult',icon:'🟪',name:'Tetris: neonové kostky',desc:'Svítící kostky na tmavém pozadí.'},
  {id:'cars_night',aud:'adult',icon:'🌃',name:'Autíčka: noční jízda',desc:'Závodíš v noci se světly.'},
  {id:'build_gold',aud:'adult',icon:'🏆',name:'Stavitel: zlaté bloky',desc:'Stavíš ze zlata.'}
];
const forOf=i=>i.for||(i.aud==='adult'?['jirka']:['lea','bea']);
const itemsFor=kid=>ITEMS.filter(i=>forOf(i).includes(kid));
const itemById=id=>ITEMS.find(i=>i.id===id);
const TASK_ICONS=['🧦','🧸','🪥','🛏️','🧹','🍽️','📚','✏️','🎒','👕','🗑️','🌱','🐶','🛁','🧺','🥦','🎹','🚲','💤','🦷','🧥','👟','🥛','⭐'];

/* ================= icons & mascot ================= */
const ICON={back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>'};
function starPts(cx,cy,R,r=R*.45){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r:R;p.push((cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1))}return p.join(' ')}
function bodik(w=120,mood='happy'){
  const mouth=mood==='wow'?'<ellipse cx="76" cy="86" rx="7" ry="8" fill="var(--ink)"/>':'<path d="M65 82 q11 11 22 0" fill="none" stroke="var(--ink)" stroke-width="4.5" stroke-linecap="round"/>';
  return `<svg class="bodik" width="${w}" height="${Math.round(w*.82)}" viewBox="0 0 150 123" aria-hidden="true"><g class="cloud">
  <path d="M35 108 a28 28 0 0 1 2 -55 a34 34 0 0 1 62 -12 a26 26 0 0 1 32 26 a22 22 0 0 1 -6 41 z" fill="#fff" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="60" cy="72" r="6.5" fill="var(--ink)"/><circle cx="92" cy="72" r="6.5" fill="var(--ink)"/>
  <circle cx="62.5" cy="69.5" r="2.2" fill="#fff"/><circle cx="94.5" cy="69.5" r="2.2" fill="#fff"/>
  <ellipse cx="46" cy="86" rx="8" ry="5" fill="#FF5C93" opacity=".45"/><ellipse cx="106" cy="86" rx="8" ry="5" fill="#FF5C93" opacity=".45"/>
  ${mouth}
  <polygon points="${starPts(118,22,16)}" fill="var(--sun)" stroke="var(--ink)" stroke-width="4" stroke-linejoin="round"/></g></svg>`;
}

/*PICS*/

/* ================= feedback ================= */
let AC;
function chime(kind='win'){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const n=AC.currentTime;
  const notes=kind==='pop'?[880]:kind==='tick'?[660,990]:kind==='no'?[330,262]:[523,659,784,1047];
  notes.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;const t=n+i*.09;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.36)})}catch(e){}}
function say(t){try{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='cs-CZ';u.rate=.92;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){}}
const sayKid=t=>{if(V.kid&&kidOf(V.kid).little)say(t)};
function confetti(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const c=document.createElement('canvas');c.className='fx';document.body.appendChild(c);
  const W=c.width=innerWidth,H=c.height=innerHeight,x=c.getContext('2d');
  const cols=['#FF5C93','#6F5BFF','#FFC22E','#1FBF92','#4FB6FF'];
  const P=Array.from({length:110},()=>({x:W/2,y:H*.42,vx:(Math.random()-.5)*14,vy:-Math.random()*13-4,s:7+Math.random()*7,c:cols[Math.random()*5|0],r:Math.random()*6,vr:(Math.random()-.5)*.3,star:Math.random()<.35}));
  let t=0;(function f(){x.clearRect(0,0,W,H);P.forEach(p=>{p.vy+=.35;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;
    if(p.star){x.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?p.s*.25:p.s*.6;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.fill()}else x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);x.restore()});
    if(++t<120)requestAnimationFrame(f);else c.remove()})();
}
let toastT;
function toast(msg){document.querySelectorAll('.toast').forEach(e=>e.remove());const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);clearTimeout(toastT);toastT=setTimeout(()=>t.remove(),2600)}
function celebrate({title,stars,sub,speak,mood='happy',btn='Jupí!',onClose}){
  const o=document.createElement('div');o.className='ov';
  o.innerHTML=`<div class="ovbox" role="dialog" aria-modal="true">${bodik(130,mood)}<h2>${esc(title)}</h2>${stars?`<div class="cstars">+${stars} ⭐</div>`:''}${sub?`<p class="muted">${esc(sub)}</p>`:''}<button class="btn big" data-close>${esc(btn)}</button></div>`;
  document.body.appendChild(o);o.querySelector('[data-close]').focus();
  o.addEventListener('click',e=>{if(e.target.closest('[data-close]')||e.target===o){o.remove();if(onClose)onClose();maybeReload()}});
  confetti();chime();if(speak)sayKid(speak);
}
function refreshJar(){const j=$('.jar span');if(j&&V.kid){j.textContent=pointsOf(V.kid);const p=j.parentElement;p.classList.remove('bump');void p.offsetWidth;p.classList.add('bump')}}

/* ================= navigation ================= */
function rootView(){const r=role();if(!r)return{name:'setup'};if(isKidRole(r))return{name:'home',kid:r};if(r==='parent')return{name:'parent'};return{name:'picker'}}
let V=rootView();const stack=[];let tick=null;
function go(name,extra={}){stack.push(V);V={...V,...extra,name};render();scrollTo(0,0)}
function back(){V=stack.pop()||rootView();render();maybeReload()}
function setKidTheme(id){const r=document.documentElement.style;r.setProperty('--kid',`var(--${id||'lea'})`);r.setProperty('--kid-soft',`var(--${id||'lea'}-soft)`)}
function topbar(title,showJar=true,showBack=true){const k=V.kid&&kidOf(V.kid);
  return `<header class="top">${showBack?`<button class="round" data-act="back" aria-label="Zpět">${ICON.back}</button>`:`<span class="round" aria-hidden="true" style="font-size:1.6rem">${k?k.avatar:'⭐'}</span>`}<h1>${esc(title)}</h1>${showJar&&k?`<div class="jar" aria-label="Hvězdičky">⭐ <span>${pointsOf(V.kid)}</span></div>`:''}</header>`}

/* ================= screens: setup ================= */
function vSetup(){
  if(!DEV.family)return `<div class="hello">${bodik(130)}<p class="bubble">Vítejte v Bodíkově!</p></div>
    <div class="card setup"><h2>Jste rodič a zakládáte aplikaci?</h2><p class="muted">Vytvoří se vaše rodina. Holčičí telefony pak propojíte odkazem.</p><button class="btn big" data-act="newFamily">Založit rodinu</button></div>
    <div class="card setup"><h2>Máte odkaz od rodičů?</h2><p class="muted">Otevřete na tomhle telefonu odkaz, který vám rodič poslal. Nebo sem vložte kód rodiny.</p>
      <input id="famcode" placeholder="Kód rodiny" autocomplete="off" autocapitalize="off"><button class="btn ghost" data-act="joinFamily">Připojit</button></div>`;
  return `<div class="hello">${bodik(130)}<p class="bubble">Komu patří tenhle telefon?</p></div>
    <div class="rolegrid">
      <button class="rolebtn" data-act="setRole" data-r="lea"><span class="ic">${kidOf('lea').avatar}</span>${esc(kidOf('lea').name)}</button>
      <button class="rolebtn" data-act="setRole" data-r="bea"><span class="ic">${kidOf('bea').avatar}</span>${esc(kidOf('bea').name)}</button>
      <button class="rolebtn" data-act="setRole" data-r="jirka"><span class="ic">${kidOf('jirka').avatar}</span>${esc(kidOf('jirka').name)}</button>
      <button class="rolebtn" data-act="setRole" data-r="parent"><span class="ic">🔒</span>Rodiče</button>
      <button class="rolebtn" data-act="setRole" data-r="shared"><span class="ic">👨‍👩‍👧‍👧</span>Společný</button>
    </div><p class="note center">Osobní telefon otevře rovnou vlastní hvězdičky a úkoly. Dá se to později změnit v rodičovské části.</p>`;
}

/* ================= screens: kids ================= */
function vPicker(){
  const pend=pendingCount(),tp=teamPts(),pct=Math.min(100,Math.round(tp/S.settings.team.target*100));
  return `<div class="hello">${bodik(140)}<p class="bubble">Ahoj! Kdo si jde hrát?</p></div>
  <div class="kids three">${KIDS.map(id=>{const k=kidOf(id);return `<button class="kidcard k-${id}" data-act="pick" data-id="${id}"><span class="ava">${k.avatar}</span><span class="nm">${esc(k.name)}</span><span class="pts">⭐ ${pointsOf(id)}</span></button>`}).join('')}</div>
  <div class="card teammini"><span class="ic">${esc(S.settings.team.icon)}</span><div class="t"><b>Společně na: ${esc(S.settings.team.name)}</b><div class="bar"><i style="width:${pct}%"></i></div><span class="muted">${tp} z ${S.settings.team.target} ⭐</span></div></div>
  <button class="parentbtn" data-act="parentLogin">${role()==='parent'?'Pro rodiče':'🔒 Pro rodiče'} ${pend?`<span class="badge">${pend}</span>`:''}</button>
  ${SYNC?`<div class="center">${syncBadge()}</div>`:''}`;
}
function vHome(){
  const k=kidOf(V.kid),id=V.kid,w=mWin(),isOwn=role()===id;
  const all=taskList().filter(t=>t.kid===id);
  const open=all.filter(t=>t.status==='open'&&(!t.morning||w==='in')),next=open[0];
  const ms=all.filter(t=>t.morning),mOpen=ms.filter(t=>t.status==='open');
  const pend=pendingPts(id),s=streakOf(k),pts=pointsOf(id);
  const locked=itemsFor(id).filter(i=>!has(id,i.id)&&(!i.needs||has(id,i.needs))).sort((a,b)=>S.settings.prices[id][a.id]-S.settings.prices[id][b.id]);
  const goal=locked[0],gp=goal?S.settings.prices[id][goal.id]:0;
  const wk=weekPts(id),wpct=Math.min(100,Math.round(wk/k.weekTarget*100));
  const lp=sumLog(l=>l.kid===id&&l.type==='learn'&&l.d===today());
  const mHero=w==='in'&&mOpen.length?`<button class="next sunny" data-act="goTasks"><span class="lbl">☀️ Ranní mise · zbývá <span data-mleft>${minsLeft()}</span> min</span><span class="mrow">${ms.map(t=>`<span class="mi ${t.status!=='open'?'ok':''}">${esc(t.icon)}</span>`).join('')}</span><span class="go">Jdu na to!</span></button>`:'';
  const mNote=w==='before'&&ms.length?`<div class="card mnote"><span class="sunic">☀️</span><div><b>Ranní mise začne v ${esc(S.settings.morning.start)}</b><br><span class="muted">Najíst se, obléct, zuby a učesat.</span></div></div>`:'';
  return `${topbar(`Ahoj, ${k.voc}!`,true,!isOwn)}${mNote}
  ${mHero||(next?`<button class="next" data-act="goTasks"><span class="lbl">Teď udělej</span><span class="tk"><span class="ic">${esc(next.icon)}</span><span><h2>${esc(next.title)}</h2><span class="pill" style="margin-top:6px">+${next.points} ⭐${next.minutes?` · ⏱️ ${next.minutes} min`:''}</span></span></span><span class="go">Jdu na to!</span></button>`
   :`<div class="card empty">${bodik(110)}<h2>Všechny úkoly hotové!</h2><p class="muted">Můžeš si jít hrát nebo se něco naučit.</p></div>`)}
  <div class="stats">
    <div class="stat"><span class="ic">🔥</span><div><b>${s} ${plural(s,'den','dny','dní')}</b><span>v řadě</span></div></div>
    <div class="stat"><span class="ic">⏳</span><div><b>+${pend} ⭐</b><span>čeká na potvrzení</span></div></div>
  </div>
  <div class="tiles">
    <button class="tile" data-act="goTasks"><span class="ic">✅</span><span class="nm">Úkoly</span>${open.length?`<span class="badge">${open.length}</span>`:''}</button>
    <button class="tile" data-act="go" data-to="games"><span class="ic">🎨</span><span class="nm">Hry</span></button>
    <button class="tile wide" data-act="go" data-to="learn"><span class="ic">${k.little?'🍎':k.adult?'🧘':'📐'}</span><span><span class="nm">Učení</span><br><span class="sub">${k.little?'Počítání do 5':k.adult?'Emoce a klid':'Testy, počítání'}${lp?` · dnes +${lp} ⭐`:''}</span></span></button>
    ${petTile(id)}
    <button class="tile" data-act="go" data-to="race"><span class="ic">🏁</span><span class="nm">Závod</span><span class="sub muted">${wpct} %</span></button>
    <button class="tile" data-act="go" data-to="shop"><span class="ic">🎁</span><span class="nm">Odměny</span></button>
    ${albumTile(id)}
  </div>
  ${goal?`<div class="card goal"><div class="row" style="justify-content:space-between"><b>${goal.icon} ${esc(goal.name)}</b><span class="pill">${Math.min(pts,gp)} / ${gp} ⭐</span></div><div class="bar"><i style="width:${Math.min(100,pts/gp*100)}%"></i></div><span class="muted sub">${pts>=gp?'Už si to můžeš odemknout!':`Chybí ještě ${gp-pts} ⭐`}</span></div>`:''}
  ${isOwn?`<button class="parentbtn kidfoot" data-act="parentLogin">🔒 Pro rodiče</button>`:''}`;
}
function vTasks(){
  const id=V.kid,list=taskList().filter(t=>t.kid===id&&!t.morning);
  const order={open:0,pending:1,done:2};list.sort((a,b)=>order[a.status]-order[b.status]);
  const ms=morningSection(id);
  if(!list.length&&!ms)return `${topbar('Úkoly')}<div class="card empty">${bodik(120)}<h2>Dnes tu nic není</h2><p class="muted">Rodiče ti brzy nějaký úkol přidají.</p></div>`;
  return `${topbar('Úkoly')}${ms}${list.map(taskCard).join('')}`;
}
function morningSection(kid){
  const ms=taskList().filter(t=>t.kid===kid&&t.morning);if(!ms.length)return '';
  const m=S.settings.morning,w=mWin(),done=ms.filter(t=>t.status!=='open').length;
  const head=w==='in'?`Do ${esc(m.end)} zbývá <b><span data-mleft>${minsLeft()}</span> min</b>`:w==='before'?`Začne v ${esc(m.start)}`:`Na dnes skončila. Zítra od ${esc(m.start)}!`;
  return `<section class="card morning"><div class="mhead"><span class="sunic">☀️</span><div><h2>Ranní mise</h2><span class="muted">${head}</span></div><span class="pill">${done}/${ms.length}</span></div>
    <div class="mgrid">${ms.map(t=>{const can=t.status==='open'&&w==='in',lock=t.status==='open'&&!can;
      return `<button class="mtile ${t.status} ${lock?'lock':''}" data-act="${can?'mdone':'speak'}" data-id="${t.id}" data-t="${esc(t.title)}"><span class="ic">${esc(t.icon)}</span><span class="nm">${esc(t.title)}</span><span class="st">${t.status==='done'?'✅ Hotovo':t.status==='pending'?'⏳ Čeká':lock?'🔒':`+${t.points} ⭐`}</span></button>`}).join('')}</div>
    ${w==='in'&&done<ms.length?`<p class="muted sub">Ťukni na úkol, až ho splníš. Když stihneš všechny do ${esc(m.end)}, dostaneš bonus +${m.bonus} ⭐!</p>`:''}</section>`;
}
function taskCard(t){
  const steps=t.steps||[],left=steps.filter(s=>!s.d).length;let body='';
  if(t.status==='open'){
    body+=steps.length?`<div class="steps">${steps.map((s,i)=>`<button class="step ${s.d?'on':''}" data-act="step" data-id="${t.id}" data-i="${i}"><span class="box">${s.d?'✓':''}</span><span>${esc(s.t)}</span></button>`).join('')}</div>`:'';
    body+=`<div class="actions">`;
    if(t.minutes&&!t.timerEnd)body+=`<button class="btn sun" data-act="timer" data-id="${t.id}">⏱️ Závod s časem (${t.minutes} min)</button>`;
    if(t.timerEnd)body+=`<div class="tmr" data-tmr="${t.id}"></div>`;
    body+=left?`<span class="state">Ještě ${left} ${plural(left,'krok','kroky','kroků')}</span>`:`<button class="btn big" data-act="done" data-id="${t.id}">Hotovo!</button>`;
    body+=`</div>`;
  }else if(t.status==='pending')body=`<span class="state">⏳ Čeká na potvrzení od rodičů${t.fast?' · ⚡ Rychlík +2':''}</span>`;
  else body=`<span class="state">✅ Splněno. Zítra znovu!</span>`;
  return `<article class="task ${t.status}" id="t-${t.id}"><div class="head"><button class="ic" data-act="speak" data-t="${esc(t.title)}" aria-label="Přečíst úkol">${esc(t.icon)}</button><h3>${esc(t.title)}</h3><span class="pill">+${t.points} ⭐</span></div>${body}</article>`;
}
const ITEM_GO={mirror4:['mirror',{mode:'4'}],kaleido:['mirror',{mode:'12'}],rainbow:['mirror',{rainbow:true}],glitter:['mirror',{glitter:true}],
  mandala6:['mandala',{mode:'m6'}],mandala8:['mandala',{mode:'m8'}],pack_space:['color',{pic:'rocket'}],pack_animals:['color',{pic:'cat'}],
  game_tetris:['tetris'],game_cars:['cars'],game_build:['build'],pet:['pet'],game_pexeso:['pexeso'],pexeso_big:['pexeso'],game_puzzle:['puzzle'],puzzle_big:['puzzle'],game_bubbles:['bubbles'],game_music:['music'],
  game_pixel:['pixel'],pixel_pack2:['pixel'],game_diff:['diff'],game_maze:['maze'],game_hangman:['hangman'],game_duel:['duel'],game_snake:['snake'],game_breakout:['breakout'],game_parking:['parking'],game_2048:['g2048'],cars_snow:['cars'],cars_desert:['cars'],cars_race:['cars'],tetris_neon:['tetris'],cars_night:['cars'],build_gold:['build']};
function openItem(id){const t=ITEM_GO[id];if(!t)return;const[view,o={}]=t;
  if(view==='mirror'||view==='mandala')M={...(M||{mode:'2',color:'#FF5C93',w:12,rainbow:false,glitter:false}),...(o.mode?{mode:o.mode}:{}),...(o.rainbow?{rainbow:true}:{}),...(o.glitter?{glitter:true}:{})};
  if(view==='color')go('color',{pic:o.pic});else go(view)}
function unlockedCards(){const id=V.kid,own=itemsFor(id).filter(i=>has(id,i.id));if(!own.length)return '';
  return `<h2 style="font-size:1.4rem">🎁 Tvoje odemčené</h2>${own.map(i=>`<button class="gcard" data-act="openItem" data-item="${i.id}"><span class="ic" style="background:var(--sun-soft)">${i.icon}</span><span class="t"><h2>${esc(i.name)}</h2><span class="muted sub">${esc(i.desc)}</span><span class="pill">Hrát ▶</span></span></button>`).join('')}`}
function lockedGameCards(){const id=V.kid;const l=['game_tetris','game_cars','game_build'].filter(g=>!has(id,g));if(!l.length)return '';
  return `<h2 style="font-size:1.4rem">🔒 Další hry k odemčení</h2>${l.map(g=>{const i=itemById(g),pr=S.settings.prices[id][g],pts=pointsOf(id);
    return `<button class="gcard" data-act="lockedItem" data-item="${g}" style="opacity:.85"><span class="ic" style="background:var(--line)">${i.icon}</span><span class="t"><h2>${esc(i.name.replace('Hra: ',''))}</h2><span class="muted sub">${esc(i.desc)}</span><span class="pill">${pts>=pr?`✨ Odemkni za ${pr} ⭐`:`🔒 ${pr} ⭐`}</span></span></button>`}).join('')}`}
function vGames(){
  if(kidOf(V.kid).adult)return `${topbar('Hry')}
  <button class="gcard" data-act="go" data-to="tetris"><span class="ic" style="background:var(--bea-soft)">🧱</span><span class="t"><h2>Tetris</h2><span class="muted">Skládej řady, ať nic nepřeteče.</span><span class="pill">+2 ⭐ od 3 řad</span></span></button>
  <button class="gcard" data-act="go" data-to="cars"><span class="ic" style="background:var(--jirka-soft)">🏎️</span><span class="t"><h2>Autíčka</h2><span class="muted">Uhýbej autům na silnici.</span><span class="pill">+2 ⭐ od 500 m</span></span></button>
  <button class="gcard" data-act="go" data-to="build"><span class="ic" style="background:var(--sun-soft)">🏗️</span><span class="t"><h2>Stavitel</h2><span class="muted">Postav co nejvyšší věž.</span><span class="pill">+2 ⭐ od 8 pater</span></span></button>
  ${unlockedCards()}<p class="note">Za hry je denně nejvýš ${S.settings.gameCap} ⭐. Nejvíc hvězdiček je za úkoly.</p>`;
  return `${topbar('Hry')}${unlockedCards()}
  <button class="gcard" data-act="go" data-to="mirror"><span class="ic" style="background:var(--bea-soft)">🦋</span><span class="t"><h2>Zrcadlové malování</h2><span class="muted sub">Kresli a obrázek se zrcadlí.</span><span class="pill">+2 ⭐ za obrázek</span></span></button>
  <button class="gcard" data-act="go" data-to="mandala"><span class="ic" style="background:var(--mint-soft)">🌸</span><span class="t"><h2>Mandala</h2><span class="muted sub">Kreslíš a kreslí se to do 4 stran.</span><span class="pill">+2 ⭐ za obrázek</span></span></button>
  <button class="gcard" data-act="go" data-to="colorPick"><span class="ic" style="background:var(--lea-soft)">🖍️</span><span class="t"><h2>Vybarvovánky</h2><span class="muted sub">Ťukni na místo a vybarví se.</span><span class="pill">+2 ⭐ za obrázek</span></span></button>
  ${lockedGameCards()}
  <p class="note">Za hry je denně nejvýš ${S.settings.gameCap} ⭐. Nejvíc hvězdiček je za úkoly.</p>`;
}
function vMirror(){
  const k=V.kid,mand=V.name==='mandala';
  const modes=mand?[['m4','4 strany',null],['m6','6 stran','mandala6'],['m8','8 stran','mandala8']]:[['2','2 strany',null],['4','4 strany','mirror4'],['12','Kaleidoskop','kaleido']];
  return `${topbar(mand?'Mandala':'Zrcadlové malování')}
  <div class="canvaswrap ${mand?'circ':''}" id="cvwrap"><canvas id="cv" aria-label="Plocha na malování"></canvas><svg id="guides" viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div>
  <div class="tools">
    <div class="chips">${modes.map(([m,l,it])=>{const lock=it&&!has(k,it);return `<button class="chip ${lock?'lock':''}" data-act="${lock?'lockedItem':'mode'}" data-m="${m}" data-item="${it||''}">${lock?'🔒 ':''}${l}</button>`}).join('')}</div>
    <div class="swatches">${COLORS.slice(0,10).map(c=>`<button class="sw" data-act="col" data-c="${c}" style="background:${c}" aria-label="Barva"></button>`).join('')}
      <button class="sw ${has(k,'rainbow')?'rb':''}" data-act="${has(k,'rainbow')?'rainbow':'lockedItem'}" data-item="rainbow" aria-label="Duhový štětec" style="${has(k,'rainbow')?'':'background:var(--line);display:grid;place-items:center'}">${has(k,'rainbow')?'':'🔒'}</button></div>
    <div class="row">${[6,12,22].map(w=>`<button class="size" data-act="size" data-w="${w}" aria-label="Velikost"><i style="width:${w*.9}px;height:${w*.9}px"></i></button>`).join('')}
      <button class="chip ${has(k,'glitter')?'':'lock'}" data-act="${has(k,'glitter')?'glitter':'lockedItem'}" data-item="glitter">${has(k,'glitter')?'':'🔒 '}✨ Třpytky</button></div>
    <div class="row"><button class="btn ghost" data-act="clear">Smazat</button><button class="btn big" data-act="mirrorDone">Hotovo! ⭐</button></div>
  </div>`;
}
function vColorPick(){
  const k=V.kid;
  return `${topbar('Vybarvovánky')}<div class="pics">${Object.keys(PICS).map(id=>{const p=PICS[id],lock=p.pack&&!has(k,p.pack);
    return `<button class="picbtn" data-act="${lock?'lockedItem':'pickPic'}" data-id="${id}" data-item="${p.pack||''}">${picSvg(id)}<span>${esc(p.name)}</span>${lock?`<span class="lockov"><b>🔒</b>${S.settings.prices[k][p.pack]} ⭐</span>`:''}</button>`}).join('')}</div>`;
}
function vColor(){
  return `${topbar(PICS[V.pic].name)}<div class="colorpic" id="colorpic">${picSvg(V.pic)}</div>
  <div class="swatches" style="justify-content:center">${COLORS.map(c=>`<button class="sw" data-act="fillcol" data-c="${c}" style="background:${c}" aria-label="Barva"></button>`).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn ghost" data-act="go" data-to="colorPick">Jiný obrázek</button><button class="btn big" data-act="colorDone">Hotovo! ⭐</button></div>`;
}
function vShop(){
  const id=V.kid,pts=pointsOf(id);
  return `${topbar('Odemknout')}<p class="muted sub">${kidOf(id).adult?'Za hvězdičky si odemkneš nové vzhledy her.':'Za hvězdičky si odemkneš lepší malování a nové obrázky.'}</p>${itemsFor(id).map(i=>{
    const own=has(id,i.id),price=S.settings.prices[id][i.id],blocked=i.needs&&!has(id,i.needs);let act;
    if(own)act=`<button class="btn mint" data-act="openItem" data-item="${i.id}">Hrát ▶</button>`;
    else if(blocked)act=`<span class="state">🔒 Nejdřív odemkni: ${esc(itemById(i.needs).name)}</span>`;
    else if(pts>=price)act=`<button class="btn" data-act="buy" data-item="${i.id}">Odemknout za ${price} ⭐</button>`;
    else act=`<div class="bar"><i style="width:${pts/price*100}%"></i></div><span class="muted">Chybí ještě ${price-pts} ⭐</span>`;
    return `<article class="item ${own?'owned':''}" id="i-${i.id}"><div class="head"><span class="ic">${i.icon}</span><div class="t"><h3>${esc(i.name)}</h3><span class="muted sub">${esc(i.desc)}</span></div>${own?'':`<span class="pill">${price} ⭐</span>`}</div>${act}</article>`}).join('')}`;
}
function vRace(){
  const lanes=KIDS.map(id=>{const k=kidOf(id),p=weekPts(id),pct=Math.min(100,Math.round(p/k.weekTarget*100));
    return `<div class="lane"><div class="nm"><span>${esc(k.name)} ${pct>=100?'<span class="trophy">🏆 V cíli!</span>':''}</span><span>${pct} %</span></div>
      <div class="track"><span class="flag">🏁</span><span class="runner" style="left:calc(28px + (100% - 76px) * ${pct/100});background:var(--${id})">${k.avatar}</span></div>
      <span class="muted">${p} z ${k.weekTarget} ⭐ za úkoly tento týden</span></div>`}).join('');
  const T=S.settings.team,tp=teamPts(),pct=Math.min(100,Math.round(tp/T.target*100)),d=daysLeftInWeek();
  return `${topbar('Hvězdný závod')}
  <div class="card sec">${lanes}<p class="note">Každý má svůj vlastní cíl, aby to bylo fér. Kdo bude v cíli první? Závod končí ${d===0?'dnes večer':`za ${d} ${plural(d,'den','dny','dní')}`}.</p></div>
  <div class="card teambig"><span class="ic">${esc(T.icon)}</span><h2>Společně na: ${esc(T.name)}</h2><div class="bar"><i style="width:${pct}%"></i></div><b>${tp} z ${T.target} ⭐</b><p class="muted">Každá hvězdička za úkol od kohokoli z vás se počítá do společné odměny.</p></div>`;
}

/* ================= learning ================= */
const FRUITS=[
  {e:'🍎',g:'n',f:['jablko','jablka','jablek']},{e:'🍐',g:'f',f:['hruška','hrušky','hrušek']},
  {e:'🍓',g:'f',f:['jahoda','jahody','jahod']},{e:'🍌',g:'m',f:['banán','banány','banánů']},
  {e:'🍊',g:'m',f:['pomeranč','pomeranče','pomerančů']},{e:'🍋',g:'m',f:['citron','citrony','citronů']},
  {e:'🍑',g:'f',f:['broskev','broskve','broskví']},{e:'🥝',g:'n',f:['kiwi','kiwi','kiwi']}];
const COUNTW=['jedna','dvě','tři','čtyři','pět'];
const numW=(n,g)=>n===1?{m:'jeden',f:'jedna',n:'jedno'}[g]:n===2?(g==='m'?'dva':'dvě'):COUNTW[n-1];
const fruitPhrase=(n,fr)=>`${numW(n,fr.g)} ${n===1?fr.f[0]:n<5?fr.f[1]:fr.f[2]}`;
let L=null;
const ROUND_LEA=5,ROUND_BEA=8;
function progressDots(){return `<div class="progress" aria-label="Postup">${Array.from({length:L.total},(_,i)=>`<i class="${i<L.i?'f':i===L.i?'c':''}"></i>`).join('')}</div>`}
function vLearn(){
  const k=kidOf(V.kid),lp=sumLog(l=>l.kid===V.kid&&l.type==='learn'&&l.d===today()),cap=learnCapOf(V.kid);
  const capNote=`<p class="note">Za každé dokončené kolo jsou hvězdičky, dnes máš ${lp} z ${cap} ⭐.</p>`;
  if(k.little)return `${topbar('Učení')}
    <button class="lcard" data-act="startLearn" data-g="learnCount"><span class="ic">🍎</span><span class="t"><h2>Kolik je tu?</h2><span class="muted sub">Spočítej ovoce.</span><span class="pill">+3 ⭐ za kolo</span></span></button>
    <button class="lcard" data-act="startLearn" data-g="learnFind"><span class="ic" style="background:var(--sun-soft)">🔢</span><span class="t"><h2>Najdi číslo</h2><span class="muted sub">Kde je tolik ovoce?</span><span class="pill">+3 ⭐ za kolo</span></span></button>${capNote}`;
  if(k.adult)return `${topbar('Učení')}
    <button class="lcard" data-act="startLearn" data-g="emoQuiz"><span class="ic" style="background:var(--lea-soft)">🎭</span><span class="t"><h2>Poznej emoci</h2><span class="muted">8 situací ze života</span><span class="pill">+3 ⭐, bez chyby +4 ⭐</span></span></button>
    <button class="lcard" data-act="go" data-to="calm"><span class="ic" style="background:var(--jirka-soft)">🌬️</span><span class="t"><h2>Jak se uklidnit</h2><span class="muted">Dýchání, uzemnění, STOP</span><span class="pill">+3 ⭐ za cvičení</span></span></button>
    <button class="lcard" data-act="startLearn" data-g="selfTest"><span class="ic" style="background:var(--sun-soft)">📝</span><span class="t"><h2>Test: jak zvládám emoce</h2><span class="muted">8 otázek o tobě</span><span class="pill">+3 ⭐</span></span></button>${capNote}`;
  return `${topbar('Učení')}
    <h2 style="font-size:1.3rem">📚 Na testy ve škole</h2>${coursesOf(V.kid).map(C=>courseCard(V.kid,C)).join('')}
    <h2 style="font-size:1.3rem">🧮 Počítání</h2>
    <button class="lcard" data-act="startLearn" data-g="divQuiz"><span class="ic" style="background:var(--sun-soft)">➗</span><span class="t"><h2>Dělení se zbytkem</h2><span class="muted">Třeba 15 : 4 = 3 zb. 3</span><span class="pill">+3 ⭐, bez chyby +4 ⭐</span></span></button>
    <button class="lcard" data-act="startLearn" data-g="brQuiz"><span class="ic" style="background:var(--bea-soft)">( )</span><span class="t"><h2>Počítání se závorkami</h2><span class="muted">Třeba (12 + 8) : 4</span><span class="pill">+3 ⭐, bez chyby +4 ⭐</span></span></button>
    <h2 style="font-size:1.3rem">✏️ Čeština</h2>
    <button class="lcard" data-act="startIy"><span class="ic" style="background:var(--mint-soft)">i/y</span><span class="t"><h2>Doplň i nebo y</h2><span class="muted">Vyjmenovaná slova po B, L, M, P, S, V, Z</span><span class="pill">+3 ⭐, bez chyby +4 ⭐</span></span></button>
    ${capNote}`;
}
function startLearn(g){
  if(g==='learnCount'){L={g,i:0,total:ROUND_LEA,first:0};L.q=newCountQ()}
  if(g==='learnFind'){L={g,i:0,total:ROUND_LEA,first:0};L.q=newFindQ()}
  if(g==='geoQuiz'){L={g,i:0,total:ROUND_BEA,first:0,qs:makeGeoRound()};L.q=L.qs[0];L.q.tried=[]}
  if(g==='emoQuiz'){L={g,i:0,total:8,first:0,qs:makeEmoRound()};L.q=L.qs[0];L.q.tried=[]}
  if(g==='divQuiz'){L={g,i:0,total:8,first:0};L.q=newDivQ()}
  if(g==='brQuiz'){L={g,i:0,total:8,first:0,qs:makeBrRound()};L.q=L.qs[0]}
  if(g==='selfTest'){L={g,i:0,total:SELF_TEST.length,first:0,ans:[]}}
  go(g);speakQ();
}
function speakQ(){if(!L||!L.q)return;if(L.g==='learnCount')sayKid(`Kolik je tu ${L.q.fr.f[2]}?`);if(L.g==='learnFind')sayKid(findQ(L.q))}
function newCountQ(){let n;do{n=1+(Math.random()*5|0)}while(L&&L.q&&L.q.n===n);return{fr:pick(FRUITS),n,marks:[],wrong:false,locked:false}}
function newFindQ(){let n;do{n=1+(Math.random()*5|0)}while(L&&L.q&&L.q.n===n);const others=shuffle([1,2,3,4,5].filter(x=>x!==n)).slice(0,2);return{fr:pick(FRUITS),n,groups:shuffle([n,...others]),wrong:false,locked:false,bad:[]}}
function vLearnCount(){const q=L.q;
  return `${topbar('Kolik je tu?')}${progressDots()}
  <div class="qrow"><p class="qtext">Kolik je tu ${esc(q.fr.f[2])}?</p><button class="round" data-act="speakQ" aria-label="Přečíst otázku">🔊</button></div>
  <div class="fruitbox">${Array.from({length:q.n},(_,i)=>`<button class="fruit ${q.marks[i]?'counted':''}" data-act="countFruit" data-i="${i}" aria-label="Ovoce">${q.fr.e}${q.marks[i]?`<span class="n">${q.marks[i]}</span>`:''}</button>`).join('')}</div>
  <p class="muted center">Ťukni na každé ovoce a počítej nahlas.</p>
  <div class="numbtns">${[1,2,3,4,5].map(n=>`<button class="numbtn" data-act="countAns" data-n="${n}">${n}<span class="dt">${'<i></i>'.repeat(n)}</span></button>`).join('')}</div>`;
}
const findQ=q=>`Kde ${q.n>=2&&q.n<=4?'jsou':'je'} ${fruitPhrase(q.n,q.fr)}?`;
function vLearnFind(){const q=L.q;
  return `${topbar('Najdi číslo')}${progressDots()}
  <div class="qrow"><div class="bignum">${q.n}</div><button class="round" data-act="speakQ" aria-label="Přečíst otázku">🔊</button></div>
  <p class="qtext">${esc(findQ(q))}</p>
  <div class="groups">${q.groups.map((g,i)=>`<button class="group ${q.bad.includes(i)?'bad':''}" data-act="findAns" data-i="${i}">${q.fr.e.repeat(g)}</button>`).join('')}</div>`;
}
function learnNext(){
  L.i++;
  if(L.i>=L.total){finishLearn();return}
  if(L.g==='learnCount')L.q=newCountQ();
  if(L.g==='learnFind')L.q=newFindQ();
  if(L.g==='geoQuiz'||L.g==='emoQuiz'||L.g==='iyQuiz'){L.q=L.qs[L.i];L.q.tried=[]}
  if(L.g==='divQuiz')L.q=newDivQ();
  if(L.g==='brQuiz'||L.g==='course')L.q=L.qs[L.i];
  render();speakQ();
}
function finishLearn(){
  if(L.g==='course'){finishCourse();return}
  const perfect=L.first===L.total;
  const quiz=['geoQuiz','emoQuiz','divQuiz','brQuiz','iyQuiz'].includes(L.g),pts=quiz?(perfect?4:3):3;
  const text={geoQuiz:'Učení: geometrie',emoQuiz:'Učení: emoce',divQuiz:'Učení: dělení se zbytkem',brQuiz:'Učení: závorky',iyQuiz:'Učení: vyjmenovaná slova'}[L.g]||'Učení: počítání';
  const title=perfect?'Bez jediné chyby!':'Kolo dokončeno!';
  const g=L.g;L=null;
  capAward('learn',S.settings.learnCap,pts,text,title,'Výborně! Jsi šikulka!',()=>{back()});
}
function countAuto(){const q=L.q;q.marks=[];q.locked=true;render();
  let i=0;const step=()=>{if(!L||L.q!==q)return;if(i<q.n){q.marks[i]=i+1;say(COUNTW[i]);i++;render();setTimeout(step,800)}else{q.locked=false;render()}};setTimeout(step,500)}

/* ---- geometry (Bea, 4th grade) ---- */
const LET='ABCDEKLMNPRSTXY';
const letters=n=>shuffle([...LET]).slice(0,n);
const f1=v=>v.toFixed(1);
function toEdge(p,d){let t=1e9;const X0=10,X1=310,Y0=10,Y1=190;
  if(d.x>1e-6)t=Math.min(t,(X1-p.x)/d.x);if(d.x<-1e-6)t=Math.min(t,(X0-p.x)/d.x);
  if(d.y>1e-6)t=Math.min(t,(Y1-p.y)/d.y);if(d.y<-1e-6)t=Math.min(t,(Y0-p.y)/d.y);return{x:p.x+d.x*t,y:p.y+d.y*t}}
const neg=d=>({x:-d.x,y:-d.y});
const gl=(a,b,cls='g-line')=>`<line class="${cls}" x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}"/>`;
const gpt=p=>`<g class="g-pt"><line x1="${f1(p.x-6)}" y1="${f1(p.y-6)}" x2="${f1(p.x+6)}" y2="${f1(p.y+6)}"/><line x1="${f1(p.x-6)}" y1="${f1(p.y+6)}" x2="${f1(p.x+6)}" y2="${f1(p.y-6)}"/></g>`;
function lab(p,n,t,cls=''){let nx=n.x,ny=n.y;if(ny>0){nx=-nx;ny=-ny}return `<text ${cls?`class="${cls}"`:''} x="${f1(p.x+nx*20)}" y="${f1(p.y+ny*20)}" text-anchor="middle" dominant-baseline="middle">${t}</text>`}
const ptL=(p,n,t)=>gpt(p)+lab(p,n,t);
function randLine(len=55){const ang=(Math.random()*120-60)*Math.PI/180,d={x:Math.cos(ang),y:Math.sin(ang)},c={x:160+(Math.random()*40-20),y:105+(Math.random()*20-10)};
  return{a:{x:c.x-d.x*len,y:c.y-d.y*len},b:{x:c.x+d.x*len,y:c.y+d.y*len},d,n:{x:-d.y,y:d.x},c}}
const geoSvg=inner=>`<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Obrázek k otázce">${inner}</svg>`;
const LINE_OPTS=['bod','úsečka','polopřímka','přímka'];
const GQ={
  what(){const kind=pick(LINE_OPTS),[A,B]=letters(2),{a,b,d,n}=randLine();let s='',exp='';
    if(kind==='bod'){const p={x:130+Math.random()*60,y:90+Math.random()*30};s=ptL(p,{x:0,y:-1},A);exp=`Je to bod ${A}. Bod je jen místo, nemá délku. Značíme ho velkým tiskacím písmenem.`}
    if(kind==='úsečka'){s=gl(a,b)+ptL(a,n,A)+ptL(b,n,B);exp=`Je to úsečka ${A}${B}. Má dva krajní body, ${A} a ${B}, takže ji můžeme změřit pravítkem.`}
    if(kind==='polopřímka'){s=gl(a,toEdge(a,d))+ptL(a,n,A)+ptL(b,n,B);exp=`Je to polopřímka ${A}${B}. Začíná v bodě ${A} (počátek) a za bodem ${B} pokračuje dál bez konce.`}
    if(kind==='přímka'){s=gl(toEdge(a,neg(d)),toEdge(a,d))+ptL(a,n,A)+ptL(b,n,B);exp=`Je to přímka ${A}${B}. Nemá začátek ani konec, pokračuje na obě strany donekonečna.`}
    return{svg:s,q:'Co je na obrázku?',opts:LINE_OPTS,ans:kind,exp}},
  rayStart(){const [A,B]=letters(2),{a,b,d,n}=randLine();const s=gl(a,toEdge(a,d))+ptL(a,n,A)+ptL(b,n,B);
    if(Math.random()<.5)return{svg:s,q:'Ve kterém bodě začíná tahle polopřímka?',opts:shuffle([A,B]),ans:A,exp:`Polopřímka začíná v bodě ${A}. Tomu bodu se říká počátek.`};
    return{svg:s,q:'Jak se jmenuje tahle polopřímka?',opts:shuffle([`polopřímka ${A}${B}`,`polopřímka ${B}${A}`]),ans:`polopřímka ${A}${B}`,exp:`Polopřímka ${A}${B}: první píšeme počátek ${A}, potom bod ${B}, kterým prochází.`}},
  onLine(){const [A,B,C]=letters(3),{a,b,d,n}=randLine(65);const lineS=gl(toEdge(a,neg(d)),toEdge(a,d));const pl=toEdge(a,d);
    const sg=(Math.random()<.5?1:-1)*(38+Math.random()*12),off={x:(a.x+b.x)/2+n.x*sg,y:(a.y+b.y)/2+n.y*sg};
    const s=lineS+lab({x:pl.x-d.x*16,y:pl.y-d.y*16},n,'p','it')+ptL(a,n,A)+ptL(b,n,B)+gpt(off)+`<text x="${f1(off.x+14)}" y="${f1(off.y-12)}">${C}</text>`;
    return{svg:s,q:'Který bod NEleží na přímce p?',opts:shuffle([A,B,C]),ans:C,exp:`Bod ${C} na přímce p neleží, zapíšeme ${C} ∉ p. Body ${A} a ${B} na ní leží: ${A} ∈ p, ${B} ∈ p.`}},
  notation(){const [A]=letters(1),on=Math.random()<.5,{a,b,d,n}=randLine(65);const pl=toEdge(a,d);
    const p=on?{x:(a.x+b.x)/2,y:(a.y+b.y)/2}:{x:(a.x+b.x)/2+n.x*45,y:(a.y+b.y)/2+n.y*45};
    const s=gl(toEdge(a,neg(d)),toEdge(a,d))+lab({x:pl.x-d.x*16,y:pl.y-d.y*16},n,'p','it')+gpt(p)+`<text x="${f1(p.x+14)}" y="${f1(p.y-12)}">${A}</text>`;
    const ok=on?`${A} ∈ p`:`${A} ∉ p`;
    return{svg:s,q:`Jak zapíšeš, co vidíš u bodu ${A} a přímky p?`,opts:shuffle([`${A} ∈ p`,`${A} ∉ p`,`p ∈ ${A}`]),ans:ok,exp:on?`Bod ${A} leží na přímce p, zapíšeme ${A} ∈ p.`:`Bod ${A} na přímce p neleží, zapíšeme ${A} ∉ p (přeškrtnutá značka).`}},
  countSeg(){const shapes=[
      {n:3,pts:[{x:160,y:30},{x:265,y:170},{x:55,y:170}],closed:true},
      {n:4,pts:[{x:70,y:45},{x:250,y:40},{x:270,y:160},{x:55,y:165}],closed:true},
      {n:3,pts:[{x:40,y:150},{x:115,y:50},{x:200,y:150},{x:280,y:50}],closed:false},
      {n:2,pts:[{x:60,y:60},{x:160,y:160},{x:260,y:60}],closed:false}];
    const sh=pick(shapes),Ls=letters(sh.pts.length);let s='';const P=sh.pts,m=P.length;
    for(let i=0;i<(sh.closed?m:m-1);i++)s+=gl(P[i],P[(i+1)%m]);
    const cx=P.reduce((a,p)=>a+p.x,0)/m,cy=P.reduce((a,p)=>a+p.y,0)/m;
    P.forEach((p,i)=>{const v={x:p.x-cx,y:p.y-cy},l=Math.hypot(v.x,v.y)||1;s+=gpt(p)+`<text x="${f1(p.x+v.x/l*20)}" y="${f1(p.y+v.y/l*20)}" text-anchor="middle" dominant-baseline="middle">${Ls[i]}</text>`});
    const segs=[];for(let i=0;i<(sh.closed?m:m-1);i++)segs.push(Ls[i]+Ls[(i+1)%m]);
    return{svg:s,q:'Kolik úseček je na obrázku?',opts:['2','3','4','5'],ans:String(sh.n),exp:`Úsečky jsou ${segs.slice(0,-1).join(', ')} a ${segs.at(-1)}. Celkem ${sh.n}.`}},
  threePts(){const [A,B,C]=letters(3),{a,b,d,n}=randLine(80);const mid={x:(a.x+b.x)/2+d.x*(Math.random()*20-10),y:(a.y+b.y)/2+d.y*(Math.random()*20-10)};
    const s=gl(toEdge(a,neg(d)),toEdge(a,d),'g-faint')+ptL(a,n,A)+ptL(mid,n,B)+ptL(b,n,C);
    return{svg:s,q:`Kolik různých úseček určují body ${A}, ${B} a ${C}?`,opts:['2','3','4','6'],ans:'3',exp:`Úsečky ${A}${B}, ${B}${C} a ${A}${C}. Nezapomeň na tu dlouhou ${A}${C}!`}},
  longer(){const [A,B,C,D]=letters(4);const l1=90+Math.random()*80;let l2;do{l2=90+Math.random()*80}while(Math.abs(l2-l1)<28);
    const x1=40+Math.random()*(260-l1),x2=40+Math.random()*(260-l2);const a={x:x1,y:70},b={x:x1+l1,y:70},c={x:x2,y:145},e={x:x2+l2,y:145},n={x:0,y:-1};
    const s=gl(a,b)+ptL(a,n,A)+ptL(b,n,B)+gl(c,e)+ptL(c,n,C)+ptL(e,n,D);const ans=l1>l2?A+B:C+D;
    return{svg:s,q:'Která úsečka je delší?',opts:[A+B,C+D],ans,exp:`Delší je úsečka ${ans}. Úsečky můžeme porovnat, protože mají konec, a změřit pravítkem: |${A}${B}| a |${C}${D}|.`}},
  concept(){const items=[
      {q:'Která čára nemá žádný krajní bod?',ans:'přímka',exp:'Přímka nemá začátek ani konec.'},
      {q:'Která čára má jen jeden krajní bod, počátek?',ans:'polopřímka',exp:'Polopřímka má počátek, ale konec nemá.'},
      {q:'Kterou čáru můžeme změřit pravítkem?',ans:'úsečka',exp:'Úsečka má dva krajní body, proto má délku.'},
      {q:'Čím značíme bod?',opts:['velkým písmenem (A)','malým písmenem (a)','číslem (1)'],ans:'velkým písmenem (A)',exp:'Body značíme velkými tiskacími písmeny: A, B, C…'},
      {q:'Čím značíme přímku?',opts:['malým písmenem (p)','velkým písmenem (P)','číslem (1)'],ans:'malým písmenem (p)',exp:'Přímku značíme malým písmenem, třeba p, q. Nebo dvěma body, kterými prochází: přímka AB.'}];
    const it=pick(items);return{svg:'',q:it.q,opts:shuffle([...(it.opts||['úsečka','polopřímka','přímka'])]),ans:it.ans,exp:it.exp}},
  cross(){const [P]=letters(1);const c={x:160,y:100},a1=(20+Math.random()*30)*Math.PI/180,a2=-(20+Math.random()*40)*Math.PI/180;
    const d1={x:Math.cos(a1),y:Math.sin(a1)},d2={x:Math.cos(a2),y:Math.sin(a2)};
    const e1=toEdge(c,d1),e2=toEdge(c,d2);
    const s=gl(toEdge(c,neg(d1)),e1)+gl(toEdge(c,neg(d2)),e2)+lab({x:e1.x-d1.x*16,y:e1.y-d1.y*16},{x:-d1.y,y:d1.x},'p','it')+lab({x:e2.x-d2.x*16,y:e2.y-d2.y*16},{x:-d2.y,y:d2.x},'q','it')+gpt(c)+`<text x="${c.x}" y="${c.y-20}" text-anchor="middle">${P}</text>`;
    return{svg:s,q:`Přímky p a q se protínají v bodě ${P}. Jak se takový bod jmenuje?`,opts:shuffle(['průsečík','počátek','krajní bod','střed']),ans:'průsečík',exp:`Bod ${P} je průsečík přímek p a q. Leží na obou přímkách: ${P} ∈ p, ${P} ∈ q.`}}
};
function makeGeoRound(){const order=shuffle(['what','what','rayStart','onLine','notation','countSeg','threePts','longer','concept','cross']).slice(0,ROUND_BEA);return order.map(k=>GQ[k]())}
function vGeoQuiz(){const q=L.q,solved=q.tried.includes(q.ans);
  return `${topbar(L.title||(L.g==='emoQuiz'?'Poznej emoci':'Kvíz z geometrie'))}${progressDots()}
  ${q.svg?`<div class="geo">${geoSvg(q.svg)}</div>`:''}
  <p class="qtext">${esc(q.q)}</p>
  <div class="opts">${q.opts.map(o=>`<button class="opt ${q.tried.includes(o)?(o===q.ans?'ok':'bad'):''}" data-act="geoAns" data-o="${esc(o)}" ${solved?'disabled':''}>${esc(o)}</button>`).join('')}</div>
  ${solved?`<div class="explain">✅ ${esc(q.exp)}</div><button class="btn big" data-act="learnNext" style="align-self:center">${L.i+1<L.total?'Další otázka':'Hotovo!'}</button>`:q.tried.length?`<div class="explain">Skoro! Zkus jinou možnost.</div>`:''}`;
}
function vGeoLesson(){
  const n={x:0,y:-1},A={x:110,y:60},B={x:210,y:60};
  const card=(t,svg,txt,zap)=>`<article class="card lesson"><h3>${t}</h3><div class="geo">${geoSvg(svg)}</div><p>${txt}</p><span class="zap">${zap}</span></article>`;
  return `${topbar('Tahák: body a čáry')}
  ${card('Bod',gpt({x:160,y:100})+`<text x="160" y="76" text-anchor="middle">A</text>`,'Bod je jen místo. Nemá délku ani šířku. Kreslíme ho křížkem a značíme velkým tiskacím písmenem.','bod A')}
  ${card('Úsečka',gl({x:80,y:110},{x:240,y:110})+ptL({x:80,y:110},n,'A')+ptL({x:240,y:110},n,'B'),'Úsečka má dva krajní body. Začíná a končí, proto ji můžeme změřit pravítkem.','úsečka AB, |AB| = 4 cm')}
  ${card('Polopřímka',gl({x:80,y:110},{x:310,y:110})+ptL({x:80,y:110},n,'A')+ptL({x:180,y:110},n,'B'),'Polopřímka má jen jeden krajní bod, počátek. Na druhou stranu pokračuje bez konce. Počátek píšeme první.','polopřímka AB (začíná v A)')}
  ${card('Přímka',gl({x:10,y:110},{x:310,y:110})+ptL({x:110,y:110},n,'A')+ptL({x:210,y:110},n,'B')+`<text class="it" x="290" y="92">p</text>`,'Přímka nemá začátek ani konec. Značíme ji malým písmenem nebo dvěma body, kterými prochází.','přímka p, přímka AB')}
  ${card('Leží, neleží',gl({x:10,y:120},{x:310,y:120})+`<text class="it" x="290" y="102">p</text>`+ptL({x:110,y:120},n,'A')+gpt({x:210,y:60})+`<text x="226" y="48">B</text>`,'Bod A leží na přímce p. Bod B na přímce p neleží.','A ∈ p    B ∉ p')}
  ${card('Průsečík',gl({x:40,y:30},{x:280,y:170})+gl({x:40,y:170},{x:280,y:30})+gpt({x:160,y:100})+`<text x="160" y="78" text-anchor="middle">P</text>`,'Když se dvě přímky protnou, bod, kde se potkají, se jmenuje průsečík.','P je průsečík přímek p a q')}
  <button class="btn big" data-act="startLearn" data-g="geoQuiz" style="align-self:center">Spustit kvíz 📐</button>`;
}

/* ================= parent ================= */
function vParent(){
  const st=S.settings,tab=V.ptab||'approve',pend=taskList().filter(t=>t.status==='pending'),isParentPhone=role()==='parent';
  const pc=pendingClaims().length;
  const tabs=[['approve','Schválit',pend.length+pc],['tasks','Úkoly'],['rewards','Odměny'],['points','Body'],['settings','Nastavení']];
  let body='';
  if(tab==='approve'){
    body=pend.length?`<div class="card sec">${pend.map(t=>`<div class="prow ap"><span class="ic">${esc(t.icon)}</span><div class="t"><span class="kidtag ${t.kid}">${esc(kidOf(t.kid).name)}</span> <b>${esc(t.title)}</b><br><span class="muted">+${t.points} ⭐${t.fast?' · ⚡ rychlík +2':''}</span></div><div class="btns"><button class="mini no" data-act="reject" data-id="${t.id}">Ještě ne</button><button class="mini ok" data-act="approve" data-id="${t.id}">Potvrdit ✓</button></div></div>`).join('')}</div>`
      :`<div class="card empty">${bodik(100)}<h2>Nic nečeká</h2><p class="muted">Když holky splní úkol, objeví se tady.</p></div>`;
    if(pend.length>1)body+=`<button class="btn mint" data-act="approveAll" style="align-self:flex-start">Potvrdit vše (${pend.length})</button>`;
    body=claimsCard()+body;
    body+=`<p class="note">Tip pro ADHD: potvrzujte co nejdřív. Čím kratší čekání na odměnu, tím víc to motivuje.</p>`;
  }
  if(tab==='tasks'){
    const mo=st.morning;
    body=`<div class="card sec"><h2>☀️ Ranní mise</h2>
      <p class="note">Objeví se holkám každý den automaticky. Splnit ji jde jen v nastaveném čase.</p>
      <label class="prow"><span class="t">Ranní mise zapnutá</span><input type="checkbox" id="m-en" ${mo.enabled?'checked':''} data-set="settings/morning/enabled"></label>
      <div class="prow"><span class="t">Pro koho</span>${KIDS.map(k=>`<label class="row" style="gap:6px"><input type="checkbox" id="m-k-${k}" ${mo.kids[k]!==false?'checked':''} data-set="settings/morning/kids/${k}">${esc(kidOf(k).name)}</label>`).join('')}</div>
      <label class="prow"><span class="t">Od</span><input type="time" id="m-start" value="${esc(mo.start)}" data-set="settings/morning/start"></label>
      <label class="prow"><span class="t">Do</span><input type="time" id="m-end" value="${esc(mo.end)}" data-set="settings/morning/end"></label>
      ${mo.items.map((it,i)=>`<label class="prow"><span class="ic">${esc(it.icon)}</span><span class="t">${esc(it.title)}</span><input type="number" id="m-p${i}" min="0" value="${it.points}" data-set="settings/morning/items/${i}/points"> ⭐</label>`).join('')}
      <label class="prow"><span class="t">Bonus za celou misi včas</span><input type="number" id="m-bonus" min="0" value="${mo.bonus}" data-set="settings/morning/bonus"> ⭐</label>
      <label class="prow"><span class="t">Potvrzovat automaticky<br><span class="muted">Hvězdičky hned, bez vašeho schválení</span></span><input type="checkbox" id="m-auto" ${mo.auto?'checked':''} data-set="settings/morning/auto"></label></div>
    <form class="card sec" id="taskform"><h2>Nový úkol</h2>
      <div class="field"><span>Pro koho</span><div class="chips" data-group="kid">${[['lea','Lea'],['bea','Bea'],['jirka','Jirka'],['both','Všichni']].map(([v,l],i)=>`<button type="button" class="chip ${i===0?'on':''}" data-v="${v}">${l}</button>`).join('')}</div></div>
      <label class="field"><span>Co má udělat</span><input id="f-title" maxlength="40" placeholder="Např. Uklidit si ponožky" required></label>
      <div class="field"><span>Obrázek (pro Leu, která ještě nečte)</span><div class="icons" data-group="icon">${TASK_ICONS.map((ic,i)=>`<button type="button" class="${i===0?'on':''}" data-v="${ic}">${ic}</button>`).join('')}</div></div>
      <div class="field"><span>Hvězdičky</span><div class="chips" data-group="pts">${[5,10,15,20,30].map(n=>`<button type="button" class="chip ${n===10?'on':''}" data-v="${n}">${n} ⭐</button>`).join('')}</div></div>
      <div class="field"><span>Jak často</span><div class="chips" data-group="rep"><button type="button" class="chip on" data-v="once">Jednou</button><button type="button" class="chip" data-v="daily">Každý den</button></div></div>
      <div class="field"><span>Závod s časem (rychlík dostane +2 ⭐)</span><div class="chips" data-group="min">${[[0,'Bez'],[3,'3 min'],[5,'5 min'],[10,'10 min'],[15,'15 min']].map(([v,l],i)=>`<button type="button" class="chip ${i===0?'on':''}" data-v="${v}">${l}</button>`).join('')}</div></div>
      <label class="field"><span>Malé kroky (každý na nový řádek, nepovinné)</span><textarea id="f-steps" rows="3" placeholder="Hračky do krabice&#10;Oblečení do skříně"></textarea></label>
      <button class="btn big" type="submit">Přidat úkol</button></form>`;
    body+=KIDS.map(id=>{const list=taskList().filter(t=>t.kid===id&&!t.morning);return `<div class="card sec"><h2><span class="kidtag ${id}">${esc(kidOf(id).name)}</span> úkoly</h2>${list.length?list.map(t=>`<div class="prow"><span class="ic">${esc(t.icon)}</span><div class="t"><b>${esc(t.title)}</b><br><span class="muted">${t.points} ⭐ · ${t.repeat==='daily'?'každý den':'jednou'}${t.minutes?` · ⏱️ ${t.minutes} min`:''}${t.steps&&t.steps.length?` · ${t.steps.length} kroky`:''} · ${({open:'čeká na splnění',pending:'ke schválení',done:'dnes hotovo'})[t.status]}</span></div><button class="mini no" data-act="delTask" data-id="${t.id}">Smazat</button></div>`).join(''):'<p class="muted">Zatím žádné úkoly.</p>'}</div>`}).join('');
  }
  if(tab==='points'){
    body=KIDS.map(id=>parentCourses(id)).join('')+KIDS.map(id=>{const k=kidOf(id);return `<div class="card sec"><h2><span class="kidtag ${id}">${esc(k.name)}</span> má ${pointsOf(id)} ⭐</h2>
      <div class="row"><input type="number" id="bonus-${id}" min="1" value="5" style="width:90px"><button class="mini ok" data-act="bonus" data-id="${id}" data-sign="1">+ Přidat</button><button class="mini no" data-act="bonus" data-id="${id}" data-sign="-1">− Odebrat</button></div>
      <label class="prow"><span class="t">Max. hvězdiček za učení denně</span><input type="number" id="lc-${id}" min="0" value="${learnCapOf(id)}" data-set="kids/${id}/learnCap"></label>
      <label class="prow"><span class="t">Týdenní cíl v závodě</span><input type="number" id="wt-${id}" min="5" value="${k.weekTarget}" data-set="kids/${id}/weekTarget"></label>
      ${itemsFor(id).map(i=>`<label class="prow"><span class="ic">${i.icon}</span><span class="t">${esc(i.name)}${has(id,i.id)?' ✅':''}</span><input type="number" id="pr-${id}-${i.id}" min="0" value="${st.prices[id][i.id]}" data-set="settings/prices/${id}/${i.id}"></label>`).join('')}</div>`}).join('');
    const tp=teamPts();
    body+=`<div class="card sec"><h2>Společná odměna</h2>
      <label class="field"><span>Na co všichni společně šetří</span><input id="tm-name" value="${esc(st.team.name)}" maxlength="40" data-set="settings/team/name"></label>
      <label class="field"><span>Obrázek</span><input id="tm-icon" value="${esc(st.team.icon)}" maxlength="4" data-set="settings/team/icon" style="width:90px"></label>
      <label class="prow"><span class="t">Cíl (hvězdičky z úkolů dohromady)</span><input type="number" id="tm-target" min="10" value="${st.team.target}" data-set="settings/team/target"></label>
      <p class="muted">Zatím mají ${tp} z ${st.team.target} ⭐.</p>
      <button class="btn ghost" data-act="teamReset">Odměna předána, začít znovu</button></div>
      <div class="card sec"><label class="prow"><span class="t">Max. hvězdiček za hry denně</span><input type="number" id="gcap" min="0" value="${st.gameCap}" data-set="settings/gameCap"></label>
</div>
      <div class="card sec"><h2>Historie</h2><div class="log">${logs().slice(0,30).map(l=>`<div><span class="kidtag ${l.kid}">${esc(kidOf(l.kid).name)}</span><span>${esc(l.text)}</span><span class="p">${l.pts>0?'+':''}${l.pts} ⭐</span></div>`).join('')}</div></div>`;
  }
  if(tab==='rewards')body=parentRewards();
  if(tab==='settings'){
    const link=`${location.origin}${location.pathname}#rodina=${DEV.family||''}`;
    body=(SYNC?`<div class="card sec"><h2>Propojení telefonů</h2>${syncBadge()}
      <p class="note">Pošlete tenhle odkaz do telefonů Ley, Bey a Jirky (třeba přes WhatsApp). Každý ho otevře jednou, vybere svoje jméno a od té doby se všechno přenáší samo. Odkaz nikomu jinému neposílejte.</p>
      <div class="codebox" id="famlink">${esc(link)}</div><button class="btn" data-act="copyLink">Kopírovat odkaz</button>
      <p class="muted">Tento telefon: <b>${esc({lea:'Lea',bea:'Bea',jirka:'Jirka',parent:'Rodiče',shared:'Společný'}[role()]||'')}</b></p><button class="btn ghost" data-act="changeRole">Změnit, komu telefon patří</button>
      <p class="note">Verze aplikace: ${esc(APP_VERSION)}. Nové verze se stahují samy.</p></div>`
      :`<div class="card sec"><h2>Kde jsou data</h2><p class="note">Tohle je náhled. Hvězdičky a úkoly jsou uložené jen v tomto zařízení. Verze pro tři propojené telefony běží na vaší vlastní adrese.</p></div>`)+
      `<div class="card sec"><h2>PIN pro rodiče</h2><p class="muted">Výchozí PIN je 1234. Změňte ho, ať se sem holky nedostanou.</p>
      <div class="row"><input id="newpin" inputmode="numeric" maxlength="4" placeholder="Nový PIN" style="width:140px"><button class="btn" data-act="setPin">Uložit PIN</button></div></div>
      <div class="card sec"><h2>Záloha dat</h2><p class="muted">Stáhne všechny hvězdičky, úkoly, mazlíčky, samolepky a pokroky v učení do jednoho souboru. Uložte si ho třeba na Google Disk.</p>
      <div class="row"><button class="btn" data-act="backupDl">⬇️ Stáhnout zálohu</button><label class="btn ghost" for="restorefile">⬆️ Obnovit ze zálohy</label><input type="file" id="restorefile" accept="application/json,.json" hidden></div></div>
      <div class="card sec"><h2>Začít od nuly</h2><p class="muted">Smaže všechny hvězdičky, úkoly a odemčené věci${SYNC?' na všech telefonech':''}.</p><button class="mini no" data-act="resetAll">Vymazat vše</button></div>`;
  }
  return `<div class="parent" style="display:flex;flex-direction:column;gap:16px">${topbar('Pro rodiče',false,!(isParentPhone&&!stack.length))}
    <nav class="ptabs">${tabs.map(([id,l,n])=>`<button class="${tab===id?'on':''}" data-act="ptab" data-t="${id}">${l}${n?` <span class="badge">${n}</span>`:''}</button>`).join('')}</nav>${body}
    ${isParentPhone&&!stack.length?`<button class="parentbtn" data-act="go" data-to="picker">👀 Podívat se jako holky</button>`:''}</div>`;
}
function pinPad(onOk){
  let code='';const o=document.createElement('div');o.className='ov';
  const draw=()=>{o.querySelector('.dots').innerHTML=[0,1,2,3].map(i=>`<i class="${i<code.length?'f':''}"></i>`).join('')};
  o.innerHTML=`<div class="ovbox" role="dialog" aria-modal="true" aria-label="PIN pro rodiče"><h2>Pro rodiče</h2><p class="muted">Zadejte PIN</p><div class="dots"></div>
    <div class="keypad">${[1,2,3,4,5,6,7,8,9,'✕',0,'⌫'].map(n=>`<button data-k="${n}">${n}</button>`).join('')}</div></div>`;
  document.body.appendChild(o);draw();
  o.addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(e.target===o){o.remove();return}if(!b)return;const k=b.dataset.k;
    if(k==='✕'){o.remove();return}if(k==='⌫'){code=code.slice(0,-1);draw();return}
    if(code.length<4){code+=k;draw()}
    if(code.length===4){if(code===S.settings.pin){o.remove();onOk()}
      else{const box=o.querySelector('.ovbox');box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake');code='';setTimeout(draw,300)}}});
}

/* ================= render ================= */
const SETUP={};
const MAP={setup:vSetup,picker:vPicker,home:vHome,tasks:vTasks,games:vGames,mirror:vMirror,mandala:vMirror,colorPick:vColorPick,color:vColor,shop:vShop,race:vRace,parent:vParent,
  learn:vLearn,learnCount:vLearnCount,learnFind:vLearnFind,geoQuiz:vGeoQuiz,geoLesson:vGeoLesson};
function render(){
  clearInterval(tick);tick=null;stopGame();
  if(['learnCount','learnFind','geoQuiz','emoQuiz','selfTest','breath','ground','divQuiz','brQuiz','courseQuiz','iyQuiz'].includes(V.name)&&!L)V=stack.pop()||rootView();
  const app=$('#app'),k=V.kid&&kidOf(V.kid);
  app.classList.toggle('little',!!(k&&k.little));
  setKidTheme(V.name==='parent'||V.name==='setup'?null:V.kid);
  app.innerHTML=(MAP[V.name]||vPicker)();
  if(V.name==='mirror'||V.name==='mandala')setupMirror();
  if(V.name==='color')setupColor();
  if(SETUP[V.name])SETUP[V.name]();
  if(V.name==='tetris')setupTetris();if(V.name==='cars')setupCars();if(V.name==='build')setupBuild();
  const win=mWin();
  if(V.name==='tasks'||V.name==='home')tick=setInterval(()=>{if(mWin()!==win){render();return}document.querySelectorAll('[data-mleft]').forEach(e=>e.textContent=minsLeft());updTimers()},1000);
  if(V.name==='tasks'){updTimers();if(V.focus){const el=$('#t-'+V.focus);V.focus=null;if(el)el.scrollIntoView({block:'center'})}}
  if(V.name==='shop'&&V.focusItem){const el=$('#i-'+V.focusItem);V.focusItem=null;if(el)el.scrollIntoView({block:'center'})}
  if(V.name==='home'&&k)checkUnseen(V.kid);
}
function softRender(){
  const ft=$('#f-title'),fs=$('#f-steps');
  const busy=['mirror','mandala','color','learnCount','learnFind','geoQuiz','divQuiz','brQuiz','courseQuiz','emoQuiz','selfTest','breath','ground','tetris','cars','build','pexeso','puzzle','bubbles','music','pixel','diff','maze','hangman','duel','snake','breakout','parking','g2048','iyQuiz'].includes(V.name)||(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))||(ft&&ft.value)||(fs&&fs.value);
  if(busy){const j=$('.jar span');if(j&&V.kid)j.textContent=pointsOf(V.kid);return}
  render();
}
function checkUnseen(kid){
  const key='bodikov-seen-'+kid,seen=+ls.get(key)||0,now=Date.now();
  if(!seen){ls.set(key,String(now));return}
  const fresh=Object.values(S.log).filter(l=>l.kid===kid&&l.ts>seen&&!l.self&&l.pts>0&&['task','streak','bonus'].includes(l.type));
  if(!fresh.length)return;
  ls.set(key,String(Math.max(...fresh.map(l=>l.ts))));
  const n=fresh.reduce((a,l)=>a+l.pts,0);
  setTimeout(()=>celebrate({title:'Rodiče potvrdili!',stars:n,sub:`Teď máš ${pointsOf(kid)} ⭐`,speak:`Super! Máš ${n} ${plural(n,'hvězdičku','hvězdičky','hvězdiček')} navíc!`}),250);
}
function updTimers(){
  document.querySelectorAll('[data-tmr]').forEach(el=>{const t=S.tasks[el.dataset.tmr];if(!t||!t.timerEnd)return;
    const left=Math.max(0,t.timerEnd-Date.now()),tot=t.minutes*60000,f=left/tot,C=2*Math.PI*18,m=Math.floor(left/60000),s=Math.floor(left%60000/1000);
    el.innerHTML=left>0?`<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="22" cy="22" r="18" fill="none" stroke="var(--kid)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-f)}"/></svg>${m}:${pad(s)}`
      :`<span class="state">Čas vypršel, ale dokončit to pořád můžeš!</span>`});
}

/* ================= actions ================= */
function capAward(type,cap,pts,text,title,speak,onClose){
  const k=V.kid||(stack.find(v=>v.kid)||{}).kid;if(type==='learn')cap=learnCapOf(k);
  const used=sumLog(l=>l.kid===k&&l.type===type&&l.d===today());
  const add=Math.max(0,Math.min(pts,cap-used));
  if(add>0){addLog(k,add,type,text,true);celebrate({title,stars:add,speak,onClose})}
  else celebrate({title,sub:type==='game'?'Za hry máš dnes hvězdiček dost. Další získáš za úkoly!':'Za učení máš dnes hvězdiček dost. Zítra zase!',speak,onClose});
  refreshJar();
}
function approve(id,{silent=false,self=false}={}){
  const t=S.tasks[id];if(!t||t.status!=='pending')return;const k=kidOf(t.kid),td=today();
  addLog(t.kid,t.points,'task',t.title,self);
  if(t.fast)addLog(t.kid,2,'task','⚡ Rychlík: '+t.title,self);
  if(k.streak.last!==td){const c=k.streak.last===yesterday()?k.streak.count+1:1;put(`kids/${t.kid}/streak`,{count:c,last:td});if(c%3===0)addLog(t.kid,5,'streak',`🔥 ${c} dní v řadě`,self)}
  if(t.repeat==='once')put(`tasks/${id}`,null);else put(`tasks/${id}`,{...t,status:'done',doneDate:td,fast:false,timerEnd:null});
  if(t.morning&&k.mbonus!==td){const ms=Object.values(S.tasks).filter(x=>x.kid===t.kid&&x.morning);
    if(ms.length&&ms.every(x=>x.status==='done'&&x.doneDate===td)){put(`kids/${t.kid}/mbonus`,td);addLog(t.kid,S.settings.morning.bonus,'task','☀️ Celá ranní mise',self)}}
  if(!silent){chime('tick');toast(`${k.name} dostane ${t.points} ⭐`);render()}
}
function parentEnter(){setKidTheme(null);go('parent',{kid:null,ptab:pendingCount()?'approve':'tasks'})}
const handlers={
  back,
  newFamily:()=>{DEV.family=(uid()+uid()+uid()).replace(/[^a-z0-9]/g,'').slice(0,20);DEV.role='parent';saveDev();startSync();V=rootView();stack.length=0;render();toast('Rodina založená. PIN je 1234, změňte ho v Nastavení.')},
  joinFamily:()=>{const v=($('#famcode').value||'').trim().toLowerCase().replace(/.*rodina=/,'');if(!/^[a-z0-9]{12,40}$/.test(v)){toast('Kód nesedí. Zkontrolujte ho.');return}DEV.family=v;saveDev();startSync();render()},
  setRole:b=>{const r=b.dataset.r;const ok=()=>{DEV.role=r;saveDev();stack.length=0;V=rootView();render()};if(r==='parent'||r==='shared')pinPad(ok);else ok()},
  changeRole:()=>{delete DEV.role;saveDev();stack.length=0;V=rootView();render()},
  copyLink:()=>{const t=$('#famlink').textContent;navigator.clipboard.writeText(t).then(()=>toast('Odkaz zkopírován'),()=>{const r=document.createRange();r.selectNodeContents($('#famlink'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Odkaz je označený, zkopírujte ho')})},
  pick:b=>{go('home',{kid:b.dataset.id});const k=kidOf(b.dataset.id);if(k.little)say(`Ahoj ${k.voc}!`);chime('pop')},
  go:b=>go(b.dataset.to),
  goTasks:()=>{const n=taskList().find(t=>t.kid===V.kid&&t.status==='open'&&!t.morning);go('tasks',{focus:n&&n.id})},
  parentLogin:()=>role()==='parent'?parentEnter():pinPad(parentEnter),
  speak:b=>say(b.dataset.t),
  step:b=>{const t=S.tasks[b.dataset.id];const steps=clone(t.steps);steps[+b.dataset.i].d=!steps[+b.dataset.i].d;put(`tasks/${t.id}/steps`,steps);chime(steps[+b.dataset.i].d?'pop':'tick');render()},
  timer:b=>{const t=S.tasks[b.dataset.id];put(`tasks/${t.id}/timerEnd`,Date.now()+t.minutes*60000);chime('pop');sayKid('Připravit, pozor, teď!');render()},
  done:b=>{const t=S.tasks[b.dataset.id];const fast=!!(t.timerEnd&&Date.now()<t.timerEnd);put(`tasks/${t.id}/fast`,fast);put(`tasks/${t.id}/timerEnd`,null);put(`tasks/${t.id}/status`,'pending');render();
    celebrate({title:fast?'Rychlík! ⚡':'Hotovo!',stars:t.points+(fast?2:0),sub:'Hvězdičky ti připíšou rodiče, až to uvidí. Ukaž jim to!',speak:'Hotovo! Super práce! Běž to ukázat mamince nebo tatínkovi.'})},
  mdone:b=>{const t=S.tasks[b.dataset.id];if(!t||mWin()!=='in'){toast('Ranní mise teď neběží');render();return}
    const before=pointsOf(t.kid);put(`tasks/${t.id}/status`,'pending');put(`tasks/${t.id}/fast`,false);let stars=t.points;
    if(S.settings.morning.auto){approve(t.id,{silent:true,self:true});stars=pointsOf(t.kid)-before}
    render();const ms=Object.values(S.tasks).filter(x=>x.kid===t.kid&&x.morning),n=ms.filter(x=>x.status!=='open').length;
    if(n===ms.length)celebrate({title:'Ranní mise splněná!',stars,sub:S.settings.morning.auto?`Teď máš ${pointsOf(t.kid)} ⭐`:'Ukaž rodičům, že máš všechno hotovo!',speak:'Ranní mise splněná! Jsi úžasná!'});
    else celebrate({title:'Hotovo!',stars,sub:`Ranní mise: ${n} ze ${ms.length}`,speak:`Hotovo! Ještě ${ms.length-n}.`,btn:'Další!'})},
  approveAll:()=>{const ids=taskList().filter(t=>t.status==='pending').map(t=>t.id);ids.forEach(id=>approve(id,{silent:true}));chime('tick');toast(`Potvrzeno ${ids.length} úkolů`);render()},
  lockedItem:b=>{const it=b.dataset.item;toast(`Odemkni si to za ${S.settings.prices[V.kid][it]} ⭐`);go('shop',{focusItem:it})},
  buy:b=>{const id=V.kid,it=itemById(b.dataset.item),price=S.settings.prices[id][it.id];
    const o=document.createElement('div');o.className='ov';
    o.innerHTML=`<div class="ovbox" role="dialog" aria-modal="true"><span style="font-size:4rem">${it.icon}</span><h2>${esc(it.name)}</h2><p class="muted">Odemknout za ${price} ⭐?</p><div class="row" style="justify-content:center"><button class="btn ghost" data-no>Ještě ne</button><button class="btn big" data-yes>Ano!</button></div></div>`;
    document.body.appendChild(o);
    o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-no]')){o.remove();return}
      if(e.target.closest('[data-yes]')){o.remove();if(pointsOf(id)<price||has(id,it.id))return;addLog(id,-price,'unlock',it.name,true);put(`kids/${id}/unlocked/${it.id}`,true);render();
        celebrate({title:'Odemčeno!',sub:it.name,speak:'Odemčeno! Jdi to vyzkoušet.',btn:'Vyzkoušet',onClose:()=>openItem(it.id)})}})},
  openItem:b=>openItem(b.dataset.item),
  // drawing
  mode:b=>{M.mode=b.dataset.m;syncMirrorUI();drawGuides()},
  col:b=>{M.color=b.dataset.c;M.rainbow=false;syncMirrorUI()},
  rainbow:()=>{M.rainbow=true;syncMirrorUI()},
  size:b=>{M.w=+b.dataset.w;syncMirrorUI()},
  glitter:()=>{M.glitter=!M.glitter;syncMirrorUI()},
  clear:b=>{if(b.dataset.armed){clearCanvas();M.ink=0;b.dataset.armed='';b.textContent='Smazat'}else{b.dataset.armed='1';b.textContent='Opravdu smazat?';setTimeout(()=>{if(b.isConnected){b.dataset.armed='';b.textContent='Smazat'}},3000)}},
  mirrorDone:()=>{if(M.ink<500){toast('Ještě trochu dokresli 🙂');return}M.ink=0;capAward('game',S.settings.gameCap,2,V.name==='mandala'?'Mandala':'Zrcadlové malování','Krásný obrázek!','Krásný obrázek!')},
  pickPic:b=>go('color',{pic:b.dataset.id}),
  fillcol:b=>{CF.color=b.dataset.c;syncColorUI()},
  colorDone:()=>{const rs=[...document.querySelectorAll('#colorpic [data-r]')];const filled=rs.filter(r=>r.style.fill&&!/^(rgb\(255, 255, 255\)|#ffffff)$/i.test(r.style.fill)).length;const need=Math.ceil(rs.length*.5);
    if(filled<need){toast(`Vybarvi ještě ${need-filled} ${plural(need-filled,'místo','místa','míst')} 🖍️`);return}
    if(CF.awarded){toast('Za tenhle obrázek už hvězdičky máš. Zkus jiný!');return}CF.awarded=true;capAward('game',S.settings.gameCap,2,'Vybarvovánka: '+PICS[V.pic].name,'Krásný obrázek!','Krásný obrázek!')},
  // learning
  startLearn:b=>startLearn(b.dataset.g),
  speakQ:()=>{if(L.g==='learnCount')say(`Kolik je tu ${L.q.fr.f[2]}?`);else say(findQ(L.q))},
  countFruit:b=>{const q=L.q;if(q.locked)return;const i=+b.dataset.i;if(q.marks[i])return;const n=q.marks.filter(Boolean).length+1;q.marks[i]=n;say(COUNTW[n-1]);chime('pop');render()},
  countAns:b=>{const q=L.q;if(q.locked)return;const n=+b.dataset.n;
    if(n===q.n){q.locked=true;b.classList.add('ok');chime('tick');say(`Správně! ${fruitPhrase(q.n,q.fr)}.`);if(!q.wrong)L.first++;setTimeout(learnNext,1500)}
    else{b.classList.add('bad');chime('no');q.wrong=true;say('Skoro! Spočítáme to spolu.');setTimeout(countAuto,900)}},
  findAns:b=>{const q=L.q;if(q.locked)return;const i=+b.dataset.i;
    if(q.groups[i]===q.n){q.locked=true;b.classList.add('ok');chime('tick');say(`Správně! ${fruitPhrase(q.n,q.fr)}.`);if(!q.wrong)L.first++;setTimeout(learnNext,1500)}
    else{q.wrong=true;q.bad.push(i);chime('no');say(`Tady je ${fruitPhrase(q.groups[i],q.fr)}. Zkus jiné.`);render()}},
  geoAns:b=>{const q=L.q,o=b.dataset.o;if(q.tried.includes(q.ans))return;q.tried.push(o);
    if(o===q.ans){if(q.tried.length===1)L.first++;chime('tick')}else chime('no');render()},
  learnNext:()=>learnNext(),
  // parent
  ptab:b=>{V.ptab=b.dataset.t;render()},
  approve:b=>approve(b.dataset.id),
  reject:b=>{const t=S.tasks[b.dataset.id];put(`tasks/${t.id}`,{...t,status:'open',fast:false,timerEnd:null,steps:(t.steps||[]).map(s=>({...s,d:false}))});toast('Úkol se vrátil k dokončení');render()},
  delTask:b=>{if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Opravdu?';return}put(`tasks/${b.dataset.id}`,null);render()},
  bonus:b=>{const id=b.dataset.id,n=Math.max(1,parseInt($('#bonus-'+id).value||'0',10)),sign=+b.dataset.sign,k=kidOf(id);
    const d=sign>0?n:-Math.min(n,pointsOf(id));if(!d)return;addLog(id,d,'bonus',sign>0?'Bonus od rodičů':'Odebráno rodiči');toast(`${k.name}: ${d>0?'+':''}${d} ⭐`);render()},
  teamReset:b=>{if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Opravdu začít znovu?';return}put('settings/team/since',today());toast('Nové kolo začíná');render()},
  setPin:()=>{const v=$('#newpin').value.trim();if(!/^\d{4}$/.test(v)){toast('PIN musí mít 4 číslice');return}put('settings/pin',v);toast('PIN uložen')},
  backupDl:()=>{const blob=new Blob([JSON.stringify({app:'bodikov',version:APP_VERSION,saved:new Date().toISOString(),family:DEV.family||null,state:S},null,1)],{type:'application/json'});
    const u=URL.createObjectURL(blob),el=document.createElement('a');el.href=u;el.download=`bodikov-zaloha-${today()}.json`;document.body.appendChild(el);el.click();el.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);toast('Záloha stažena')},
  resetAll:b=>{if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Opravdu vše smazat?';return}S=defaults();saveLocal();if(DB)DB.set(clone(S));maintenance();stack.length=0;V=rootView();render();toast('Vše vymazáno')}
};
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-group] [data-v]');
  if(g){g.parentElement.querySelectorAll('.on').forEach(x=>x.classList.remove('on'));g.classList.add('on');return}
  const b=e.target.closest('[data-act]');if(!b||b.closest('.ov'))return;
  const f=handlers[b.dataset.act];if(f)f(b);
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='taskform')return;e.preventDefault();
  const val=g=>{const el=document.querySelector(`[data-group="${g}"] .on`);return el?el.dataset.v:null};
  const title=$('#f-title').value.trim();if(!title){toast('Napište, co má udělat');return}
  const steps=$('#f-steps').value.split('\n').map(s=>s.trim()).filter(Boolean).slice(0,6).map(t=>({t,d:false}));
  const who=val('kid'),kids=who==='both'?KIDS:[who];
  kids.forEach((kid,i)=>{const id='t'+Date.now().toString(36)+uid();put(`tasks/${id}`,{id,kid,title,icon:val('icon'),points:+val('pts'),repeat:val('rep'),status:'open',minutes:+val('min'),steps:steps.map(s=>({...s})),ts:Date.now()+i})});
  toast(`Úkol přidán: ${title}`);render();
});
document.addEventListener('change',e=>{
  const el=e.target,p=el.dataset.set;if(!p)return;
  let v=el.type==='checkbox'?el.checked:el.type==='number'?Math.max(0,parseInt(el.value||'0',10)):el.value.trim();
  if(el.type==='number'&&/target$/i.test(p))v=Math.max(5,v);
  if(el.type==='time'&&!/^\d{2}:\d{2}$/.test(v))return;
  put(p,v);if(p.startsWith('settings/morning'))maintenance();toast('Uloženo');
});

/* ================= mirror & mandala painting ================= */
let M=null;
function setupMirror(){
  const wrap=$('#cvwrap'),cv=$('#cv');
  const appW=$('#app').clientWidth-32,size=Math.floor(Math.max(240,Math.min(appW,520,innerHeight-330)));
  wrap.style.width=wrap.style.height=size+'px';cv.style.width=cv.style.height=size+'px';
  const dpr=Math.min(2,devicePixelRatio||1);cv.width=size*dpr;cv.height=size*dpr;
  M={...(M||{mode:'2',color:'#FF5C93',w:12,rainbow:false,glitter:false}),cv,ctx:cv.getContext('2d'),size,dpr,hue:0,ink:0,last:null};
  const mand=V.name==='mandala',need={'4':'mirror4','12':'kaleido',m6:'mandala6',m8:'mandala8'};
  if(mand!==M.mode.startsWith('m')||(need[M.mode]&&!has(V.kid,need[M.mode])))M.mode=mand?'m4':'2';
  if(M.rainbow&&!has(V.kid,'rainbow'))M.rainbow=false;if(M.glitter&&!has(V.kid,'glitter'))M.glitter=false;
  clearCanvas();drawGuides();syncMirrorUI();
  const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*M.size/r.width,y:(e.clientY-r.top)*M.size/r.height}};
  cv.addEventListener('pointerdown',e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);M.last=pt(e);seg(M.last,{x:M.last.x+.1,y:M.last.y})});
  cv.addEventListener('pointermove',e=>{if(!M.last)return;const evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];for(const ev of evs){const p=pt(ev);seg(M.last,p);M.ink+=Math.hypot(p.x-M.last.x,p.y-M.last.y);M.last=p}});
  const up=()=>{M.last=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
}
const sym=()=>({'2':1,'4':2,'12':6,m4:4,m6:6,m8:8})[M.mode]||1;
function clearCanvas(){const{ctx,dpr,size}=M;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size)}
function drawGuides(){const R=sym();let s='';
  for(let k=0;k<R;k++){const a=(k*180/R+90)*Math.PI/180,dx=Math.cos(a)*75,dy=Math.sin(a)*75;s+=`<line x1="${50-dx}" y1="${50-dy}" x2="${50+dx}" y2="${50+dy}" stroke="#2B2350" stroke-opacity=".12" stroke-width=".6" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>`}
  if(M.mode.startsWith('m'))[14,28,42].forEach(r=>{s+=`<circle cx="50" cy="50" r="${r}" fill="none" stroke="#2B2350" stroke-opacity=".12" stroke-width=".6" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"/>`});
  $('#guides').innerHTML=s}
function seg(a,b){
  const{ctx,dpr,size}=M,c=size/2,R=sym();
  const col=M.rainbow?`hsl(${(M.hue+=3)%360},90%,58%)`:M.color;
  const sparks=M.glitter?Array.from({length:2},()=>({dx:(Math.random()-.5)*M.w*3,dy:(Math.random()-.5)*M.w*3,r:1+Math.random()*2.5,c:['#FFD84D','#FF9AD5','#9FE7FF','#C9B6FF'][Math.random()*4|0]})):[];
  for(let k=0;k<R;k++)for(const m of[1,-1]){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.translate(c,c);ctx.rotate(k*2*Math.PI/R);ctx.scale(m,1);
    ctx.strokeStyle=col;ctx.lineWidth=M.w;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(a.x-c,a.y-c);ctx.lineTo(b.x-c,b.y-c);ctx.stroke();
    sparks.forEach(s=>{ctx.fillStyle=s.c;ctx.beginPath();ctx.arc(b.x-c+s.dx,b.y-c+s.dy,s.r,0,7);ctx.fill()});
  }
}
function syncMirrorUI(){
  document.querySelectorAll('[data-act="mode"]').forEach(b=>b.classList.toggle('on',b.dataset.m===M.mode));
  document.querySelectorAll('[data-act="col"]').forEach(b=>b.classList.toggle('on',!M.rainbow&&b.dataset.c===M.color));
  const rb=document.querySelector('[data-act="rainbow"]');if(rb)rb.classList.toggle('on',M.rainbow);
  document.querySelectorAll('[data-act="size"]').forEach(b=>b.classList.toggle('on',+b.dataset.w===M.w));
  const gl=document.querySelector('[data-act="glitter"]');if(gl)gl.classList.toggle('on',M.glitter);
}

/* ================= coloring ================= */
let CF={color:'#FF5C93',awarded:false};
function setupColor(){CF.awarded=false;syncColorUI();$('#colorpic').addEventListener('click',e=>{const r=e.target.closest('[data-r]');if(!r)return;r.style.fill=CF.color;chime('pop')})}
function syncColorUI(){document.querySelectorAll('[data-act="fillcol"]').forEach(b=>b.classList.toggle('on',b.dataset.c===CF.color))}

/*ADULT*/
/* ================= start ================= */
loadLocal();maintenance();V=rootView();render();
startSync();
if(SYNC){setInterval(checkUpdate,5*60000);setTimeout(checkUpdate,8000)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){maintenance();softRender();checkUpdate()}});
setInterval(()=>{const before=JSON.stringify(Object.values(S.tasks).map(t=>t.status));maintenance();if(JSON.stringify(Object.values(S.tasks).map(t=>t.status))!==before)softRender()},60000);
})();
