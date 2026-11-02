
/* ================= pet talking ================= */
const PET_SND={pes:['Haf haf!','Haf!','Hafík!'],kocka:['Mňau!','Mrrr, mňau!','Přede… vrrr'],zajic:['Ňuf ňuf!','Hop hop!'],drak:['Rrraaa!','Fffú!','Uáá, plamínek!'],jednorozec:['Íhaha!','Blik, blik!','Třpyt, třpyt!'],medved:['Brumm!','Brum brum!','Mrumm!']};
const PET_PITCH={pes:1.3,kocka:1.55,zajic:1.7,drak:.8,jednorozec:1.5,medved:.7};
const PET_LIKES={pes:'aportovat míček a dlouhé procházky',kocka:'vyhřívat se na sluníčku a klubíčka',zajic:'mrkvičku a skákání po louce',drak:'teplé kamínky a foukat bublinky',jednorozec:'duhu a třpytky',medved:'med a zimní spaní'};
const PET_JOKES=[
 ['Víš, proč má žirafa tak dlouhý krk?','Protože jí smrdí nohy! 😆'],
 ['Jak se jmenuje medvěd, který nemá zuby?','Gumový medvídek! 🐻'],
 ['Proč šla slepice přes silnici?','Aby se dostala na druhou stranu! 🐔'],
 ['Potkají se dvě mušky. Jedna říká: Půjdeme pěšky?','A druhá: Ne, počkáme na psa! 🐕'],
 ['Pepíček se ptá: Paní učitelko, může být někdo potrestán za něco, co neudělal?','Nemůže. Tak to je dobře, já jsem neudělal úkol! 😅'],
 ['Co dělá ryba, když jí je smutno?','Pláče, ale nikdo to nepozná, protože je ve vodě. 🐟'],
 ['Proč nosí sloni červené ponožky?','Aby se mohli schovat v jahodách! 🍓'],
 ['Co je to: malé, zelené a klepe na dveře?','Hrášek, co chce dovnitř! 🫛'],
 ['Víš, co řekla nula osmičce?','Pěkný pásek! 0️⃣8️⃣'],
 ['Jaké zvíře je nejlepší na matematiku?','Počítající pavouk, má osm nohou na počítání! 🕷️']];
const PET_RIDDLES=[
 ['Má to ručičky, ale nemá to ruce. Tiká to.','Hodiny ⏰'],['Bílé, studené a padá to z nebe.','Sníh ❄️'],['Má to zuby, ale nekouše to.','Hřeben 🪮'],
 ['Kulaté, červené a visí to na stromě.','Jablko 🍎'],['Má to klávesy, ale neodemkne to žádné dveře.','Klavír 🎹'],['Patří to tobě, ale ostatní to používají víc než ty.','Tvoje jméno 😊'],
 ['Čím víc z ní odebereš, tím je větší.','Díra 🕳️'],['Kolik nohou má pavouk?','Osm 🕷️'],['Na nebi svítí v noci a někdy je jako rohlíček.','Měsíc 🌙'],['Má to krk, ale nemá to hlavu.','Láhev 🍾']];
const PET_SONGS=[['Skákal pes přes oves,','přes zelenou louku,','šel za ním myslivec,','péro na klobouku.'],['Pec nám spadla, pec nám spadla,','kdopak nám ji postaví?','Starý pecař není doma','a mladý to neumí.']];
const CHAT={};let PETSAY={t:'',ts:0};
const fem=id=>!kidOf(id).adult;
const gw=(id,f,m)=>fem(id)?f:m;
const ukolu=n=>n===1?'úkol':n>=2&&n<=4?'úkoly':'úkolů';
const noEmoji=t=>t.replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}️‍⃣]/gu,'').replace(/\s+/g,' ').trim();
const petName=()=>{const p=petOf(V.kid);return p&&p.name||'mazlíček'};
function petVoice(t){const p=petOf(V.kid)||{};if(p.mute)return;try{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(noEmoji(t));u.lang='cs-CZ';u.pitch=PET_PITCH[p.type]||1.2;u.rate=kidOf(V.kid).little?.88:1;speechSynthesis.speak(u)}catch(e){}}
function chatOf(id){return CHAT[id]=CHAT[id]||[]}
function petSay(t,opt={}){const id=V.kid;t=t.replace(/\{voc\}/g,kidOf(id).voc||kidOf(id).name);PETSAY={t,ts:Date.now(),kid:id};
  const c=chatOf(id);c.push({w:'pet',t,x:opt.extra||''});if(c.length>30)c.splice(0,c.length-30);
  const b=$('.bubble2');if(b){b.textContent=t;b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}
  const lg=$('#chatlog');if(lg){lg.innerHTML=chatHtml(id);lg.scrollTop=lg.scrollHeight}
  if(!opt.silent)petVoice(opt.speak||t)}
function kidSays(t){const c=chatOf(V.kid);c.push({w:'kid',t});const lg=$('#chatlog');if(lg){lg.innerHTML=chatHtml(V.kid);lg.scrollTop=lg.scrollHeight}}
function petBubble(q){return PETSAY.kid===V.kid&&Date.now()-PETSAY.ts<20000?PETSAY.t:petWish(q)}
const sound=()=>pick(PET_SND[(petOf(V.kid)||{}).type]||['Ahoj!']);
function openTasks(id){return taskList().filter(t=>t.kid===id&&t.status==='open')}
function doneToday(id){return Object.values(S.log||{}).filter(l=>l.kid===id&&l.type==='task'&&l.d===today()).length}
function petGreeting(){const id=V.kid,p=petOf(id),q={...petNow(p),xp:petXp(id,p)},h=new Date().getHours(),k=kidOf(id);
  const hi=h<10?`Dobré ráno, ${k.voc}!`:h>=18?`Dobrý večer, ${k.voc}!`:`Ahoj ${k.voc}!`;
  if(q.asleep)return 'Zzz… chrrr… (spinká, ťukni na Probudit)';
  if(stageOf(q.xp)===0)return `${hi} Ťuk ťuk, jsem ještě ve vajíčku. Splň úkol a já se vylíhnu!`;
  let need='';if(q.food<30)need='Mám hrozný hlad, dáš mi něco?';else if(q.clean<30)need='Jsem celý ulepený, vykoupeš mě?';else if(q.energy<25)need='Jsem moc unavený…';else if(q.joy<30)need='Stýskalo se mi! Pohraješ si se mnou?';
  const n=openTasks(id).length,d=doneToday(id),st=(k.streak||{}).count||0;
  let t=n?`Dneska máš ještě ${n} ${ukolu(n)}. Když je splníš, vyrostu!`:d?`Dneska už máš hotovo ${d} ${ukolu(d)}. Jsem na tebe pyšný!`:st>=2?`Už ${st} dní v řadě plníš úkoly. Paráda!`:pick(['Co budeme dneska dělat?','Popovídáš si se mnou?','Mám tě moc rád!']);
  return `${sound()} ${hi} ${need||t}`}
function petStatus(){const q=petNow(petOf(V.kid));if(q.asleep)return 'Mmm… spinkám… zzz';
  if(q.food<30)return 'Kručí mi v bříšku. Dáš mi papat?';if(q.clean<30)return 'Jsem celý ulepený, vykoupeš mě?';if(q.energy<25)return 'Jsem utahaný, chtěl bych spinkat.';if(q.joy<30)return 'Trošku se nudím. Pohraješ si se mnou?';
  return pick(['Mám se skvěle! A jak se máš ty?','Báječně, protože jsi tady! A ty?','Bříško plné, kožíšek čistý, je mi fajn. A tobě?'])}
const MOODS=[['happy','😀'],['ok','😐'],['sad','😢'],['angry','😡'],['tired','😴']];
function moodReply(m){const id=V.kid,ad=kidOf(id).adult;return {
  happy:pick(['To mám radost! Co se ti dneska povedlo?','Juchů! Tvoje radost je i moje radost!']),
  ok:'Takový obyčejný den, co? Pomazlíme se a hned bude líp.',
  sad:ad?`Je mi líto, že je ti smutno. Obejmu tě. Pomáhá o tom s někým mluvit nebo se jít projít.`:`Je mi líto, že jsi ${gw(id,'smutná','smutný')}. Obejmu tě 🤗. Pomůže to říct mamince. A já jsem tu s tebou.`,
  angry:'Zlobit se je normální. Zkusíme dračí dech? Nadechni se nosem… a pomalu vyfoukni pusou fúúú. A ještě dvakrát!',
  tired:'Taky bych si zdřímnul. Dobrý spánek dělá zázraky.'}[m]}
function praise(){const id=V.kid,d=doneToday(id);return d?`Dneska jsi ${gw(id,'splnila','splnil')} ${d} ${ukolu(d)}. Jsi ${gw(id,'šikulka','borec')}, {voc}!`:pick([`Jsi ${gw(id,'úžasná','úžasný')}, {voc}!`,'Věřím ti, dneska to zvládneš!',`Jsi ${gw(id,'moje nejlepší kamarádka','můj nejlepší kamarád')}!`])}
function tasksReply(){const l=openTasks(V.kid);if(!l.length)return doneToday(V.kid)?'Všechno máš hotové! Jsi hvězda! ⭐':'Zatím nemáš žádný úkol. Můžeš si se mnou hrát!';
  return `Ještě tě čeká: ${l.slice(0,3).map(t=>t.title).join(', ')}${l.length>3?' a další':''}. Dáme to spolu!`}
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
// lisp-tolerant matching: sibilants and r/ř/l collapse, words compared fuzzily
const lispN=s=>norm(s).replace(/ch/g,'h').replace(/[szct]/g,'s').replace(/v/g,'f').replace(/[rl]/g,'l').replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();
function lev(a,b){const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i]);for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function wordHit(words,stem){const st=lispN(stem);if(st.includes(' '))return words.join(' ').includes(st)||fuzzyPhrase(words,st.split(' '));
  return words.some(w=>w.startsWith(st)||(st.length>=5&&w.length>=st.length-1&&lev(w.slice(0,st.length),st)<=1)||(st.length>=6&&lev(w.slice(0,st.length),st)<=2))}
function fuzzyPhrase(words,ps){for(let i=0;i+ps.length<=words.length;i++){let bad=0;ps.forEach((p,k)=>{const w=words[i+k];if(!(w.startsWith(p)||lev(w.slice(0,Math.max(p.length,2)),p)<=(p.length>=4?1:0)))bad++});if(!bad)return true}return false}
const PET_RULES=[
  ['asleep'],
  [['vtip','fip','vtipek','sasmej','legrac','neco vtipneho'],()=>'joke'],
  [['hadank','hadej'],()=>'riddle'],
  [['sazpivej','zpivej','pisnick','pisen','pisnicku'],()=>'song'],
  [['ukol','co mam delat'],()=>tasksReply()],
  [['jak se mas','jak je ti','jak se citis'],()=>petStatus()],
  [['mam te rad','mam te moc','miluju','miluji','pusinku','pusa'],()=>pick(['Já tebe taky moc! 💖','A já tebe nejvíc na světě! Pusinka! 😘'])],
  [['hrat','hraj','hrajem','pojd si hrat','micek'],()=>'act:petPlay'],
  [['koupat','vykoupej','umyj','mydlo','vana'],()=>'act:petWash'],
  [['papat','najist','hlad','jidlo','jist','svacin'],()=>petNow(petOf(V.kid)).food<60?'act:food':'Já jsem najezený! Bříško plné. Ty máš hlad? Dej si svačinku!'],
  [['hajat','spinkat','spat','dobrou noc','hajinky'],()=>'act:petSleep'],
  [['pohlad','hlad me','mazl','obejmi','obejmout'],()=>'act:petPet'],
  [['smutn','brec','plac','je mi zle','boli'],()=>moodReply('sad')],
  [['slob','nastvan','vstek','stve me'],()=>moodReply('angry')],
  [['unaven','ospal'],()=>moodReply('tired')],
  [['nudim','nuda'],()=>pick(['Pojď, pohrajeme si s míčkem!','Řekni „vtip“ a já ti povím vtip!','Splníme spolu úkol? Pak budu větší!'])],
  [['jak se jmenujes','tve jmeno','jmenujes'],()=>`Jmenuju se ${petName()}! ${sound()}`],
  [['co mas rad','co te bavi','co rad'],()=>`Mám rád ${PET_LIKES[(petOf(V.kid)||{}).type]||'tebe'}. A nejvíc tebe!`],
  [['kolik mam','hvesd','bodu','body'],()=>`Máš ${pointsOf(V.kid)} ⭐. To je krása!`],
  [['dobre rano'],()=>'Dobré ráno! Nezapomeň na ranní misi! ☀️'],
  [['skolk','skola','ve skole'],()=>kidOf(V.kid).little?'Co jste dneska dělali ve školce? Kreslili jste?':'Co bylo dneska ve škole nejlepší?'],
  [['dekuj','diky'],()=>'Rádo se stalo! 💛'],
  [['ahoj','cau','nasdal','cus','sdlavim','hello'],()=>`${sound()} Ahoj {voc}!`],
  [['haf','mnau','bubu','kvak','buuu','iha'],()=>`${sound()} ${sound()} Hihi!`],
  [['pochval','jsem sikovn','jsem dobl'],()=>praise()]];
function petAnswer(text,alts){const id=V.kid,list=[text,...(alts||[])].filter(Boolean);
  if(petNow(petOf(id)).asleep)return 'Zzz… chrrr… (spinká, nejdřív ho probuď)';
  for(const[stems,fn]of PET_RULES.slice(1))for(const t of list){const w=lispN(t).split(' ').filter(Boolean);if(stems.some(st=>wordHit(w,st)))return fn()}
  if(kidOf(id).little)return pick([`${sound()} Hihi, to je legrace!`,'Ty jsi ale šikulka, {voc}!','Já tě mám tak rád! 💖','Jů, to se mi líbí! Povídej ještě!',`${sound()} Povídej, povídej, já poslouchám!`,'To je krásné! Pojď si se mnou hrát!']);
  return pick([`${sound()} Aha! Povídej mi víc!`,'To je zajímavé! A co dál?','Opravdu? To bych chtěl vidět!','Hmm, a jak to bylo dál?'])}
function petRespond(r){if(typeof r==='string'&&r.startsWith('act:')){const a=r.slice(4);if(a==='food'){V.petTab='food';render();petSay('Mňam! Vyber mi, co si dám! 🍎');return}const b=document.createElement('button');handlers[a](b);if(a==='petPet')petAnim('jump');return}if(r==='joke'){const j=pick(PET_JOKES);petSay(j[0],{extra:`<button class="chip" data-act="petReveal" data-v="${esc(j[1])}">Nevím, řekni! 🤔</button>`});return}
  if(r==='riddle'){const j=pick(PET_RIDDLES);petSay('Hádanka: '+j[0],{extra:`<button class="chip" data-act="petReveal" data-v="${esc(j[1])}">Prozraď! 🤔</button>`});return}
  if(r==='song'){const s=pick(PET_SONGS);petSay('🎵 '+s.join(' '));return}
  petSay(r)}
function chatHtml(id){return chatOf(id).slice(-12).map(m=>`<div class="cmsg ${m.w}">${esc(m.t)}${m.x?`<div>${m.x}</div>`:''}</div>`).join('')}
let LISTEN=null;const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
function talkTab(){const id=V.kid,k=kidOf(id),p=petOf(id)||{};
  return `<div class="card sec chat"><div class="row" style="justify-content:space-between"><b>💬 Povídání s ${esc(p.name)}</b><button class="chip" data-act="petMute">${p.mute?'🔇 Ztlumeno':'🔊 Mluví'}</button></div>
   <div id="chatlog" class="chatlog">${chatHtml(id)||`<p class="muted center">Ťukni na otázku${SR?' nebo na mikrofon a mluv':''}.</p>`}</div>
   ${SR?`<button class="btn big mic" data-act="petListen">🎤 ${k.little?'Mluv na mě':'Řekni mu něco'}</button>`:''}
   ${!k.little?`<form id="talkform" class="row"><input id="talkin" maxlength="120" placeholder="Napiš mu…" autocomplete="off" style="flex:1"><button class="btn">Poslat</button></form>`:''}
   <div class="chips">${[['how','👋 Jak se máš?'],['joke','🤣 Vtip'],['riddle','❓ Hádanka'],['song','🎵 Zazpívej'],['tasks','📋 Co mám dělat?'],['praise','⭐ Pochval mě'],['likes','💛 Co máš rád?']].map(([v,l])=>`<button class="chip" data-act="petAsk" data-v="${v}">${l}</button>`).join('')}</div>
   <span class="muted">Jak se mám já:</span><div class="chips">${MOODS.map(([m,e])=>`<button class="chip moodc" data-act="petMood" data-v="${m}">${e}</button>`).join('')}</div>
   ${k.adult?`<button class="btn ghost" data-act="go" data-to="calm">🌬️ Cvičení na uklidnění</button>`:''}</div>`}
const ASKS={how:['Jak se máš?',()=>petStatus()],joke:['Řekni mi vtip!','joke'],riddle:['Dej mi hádanku!','riddle'],song:['Zazpívej mi!','song'],tasks:['Co mám dneska dělat?',()=>tasksReply()],praise:['Pochval mě!',()=>praise()],likes:['Co máš rád?',()=>`Mám rád ${PET_LIKES[(petOf(V.kid)||{}).type]||'tebe'}. A nejvíc tebe! 💛`]};
SETUP.pet=()=>{const id=V.kid,p=petOf(id);if(!p||!p.type||!has(id,'pet'))return;
  if(!V._greet){V._greet=true;petSay(petGreeting())}
  const lg=$('#chatlog');if(lg)lg.scrollTop=lg.scrollHeight;
  const f=$('#talkform');if(f)f.addEventListener('submit',e=>{e.preventDefault();const i=$('#talkin'),t=i.value.trim();if(!t)return;i.value='';kidSays(t);setTimeout(()=>petRespond(petAnswer(t)),350)})};
/* wrap care actions with speech */
{const wrap=(name,lines)=>{const o=handlers[name];handlers[name]=b=>{const before=petOf(V.kid)&&petNow(petOf(V.kid));o(b);const after=petOf(V.kid)&&petNow(petOf(V.kid));const t=typeof lines==='function'?lines(b,before,after):pick(lines);if(t)setTimeout(()=>{if(PET_ANGRY>Date.now())return;petSay(t)},60)}};
  wrap('petPet',(b,bf)=>bf&&bf.asleep?null:pick([sound(),'To je příjemné!','Ještě, ještě!','Mám tě rád, {voc}!','Hihi, to lechtá!',sound()+' Mazlení je nejlepší!']));
  wrap('petPlay',(b,bf)=>!bf||bf.asleep||bf.energy<10?null:pick(['Juchů, chyť to!','To byla zábava!','Ještě jednou, ještě jednou!','Jsi nejlepší parťák na hraní!']));
  wrap('petWash',()=>pick(['Bublinky! Hihi!','Jsem čistý jako sníh!','Brr, to je voda!','Voním jako kytička!']));
  wrap('petSleep',(b,bf)=>bf&&bf.asleep?'Dobré ráno! Už jsem vyspaný! ☀️':pick(['Dobrou noc, {voc}…','Zívá… jdu spinkat. Zzz']));
  wrap('petFeed',(b,bf,af)=>bf&&af&&af.food>bf.food?{jablko:'Mňam, křupavé jablíčko!',mrkev:'Mrkvička! To je zdravé!',pizza:'Pizza! To je hostina!',dort:'Dort?! To je jak na narozeniny! 🎂'}[b.dataset.f]:null);
  wrap('petWear',()=>pick(['Sluší mi to?','Jsem krasavec, co?','Tohle mi moc sluší!']));
  wrap('petBuyWear',()=>'Juchů, nová věc! Děkuju!');wrap('petBuyBg',()=>'Nový domeček! To je nádhera!')}
Object.assign(handlers,{
  petAsk:b=>{const[q,r]=ASKS[b.dataset.v];kidSays(q);setTimeout(()=>petRespond(petNow(petOf(V.kid)).asleep?'Zzz… chrrr… (spinká)':typeof r==='function'?r():r),300)},
  petMood:b=>{const m=b.dataset.v;kidSays(MOODS.find(x=>x[0]===m)[1]);setTimeout(()=>petSay(moodReply(m)),300)},
  petReveal:b=>{b.remove();petSay(b.dataset.v)},
  petMute:()=>{const p=petOf(V.kid);put(`kids/${V.kid}/pet/mute`,!p.mute);try{speechSynthesis.cancel()}catch(e){}render()},
  petListen:b=>{if(!SR)return;if(LISTEN){try{LISTEN.stop()}catch(e){}return}try{speechSynthesis.cancel()}catch(e){}
    const r=new SR(),lbl=b.textContent;r.lang='cs-CZ';r.interimResults=true;r.continuous=false;r.maxAlternatives=5;LISTEN=r;
    b.classList.add('on');b.textContent='👂 Poslouchám… mluv!';let finalT='',alts=[],interim='',err='';
    r.onresult=e=>{interim='';for(let i=0;i<e.results.length;i++){const res=e.results[i];if(res.isFinal){finalT+=' '+res[0].transcript;for(let k=1;k<res.length;k++)alts.push(res[k].transcript)}else interim+=' '+res[0].transcript}
      b.textContent='👂 '+(finalT+interim).trim().slice(0,40)};
    r.onerror=e=>{err=e.error;if(e.error==='not-allowed'||e.error==='service-not-allowed')toast('Mikrofon není povolený. Povolte ho v nastavení prohlížeče pro tuto stránku.')};
    r.onend=()=>{LISTEN=null;b.classList.remove('on');b.textContent=lbl;const t=(finalT||interim).trim();
      if(t){kidSays(t);setTimeout(()=>petRespond(petAnswer(t,alts)),300);return}
      if(err==='not-allowed'||err==='service-not-allowed')return;
      petSay(kidOf(V.kid).little?pick(['Ťukni na mikrofon a řekni mi to ještě jednou, nahlas! 👂','Pšš… mluvíš moc potichu. Zkus to znovu!']):'Nic jsem neslyšel. Ťukni a mluv hned potom.')};
    try{r.start()}catch(e){LISTEN=null;b.classList.remove('on');b.textContent=lbl}}
});

/* ---- temperament: idle antics, tickle-rage, grumpy bear for adults ---- */
let PET_ANGRY=0,PET_IDLE=null,PET_TAPS=[];
const IDLE_SWEET=['Hihi!','Podívej, umím skákat!','Lalala…','Mám tě rád!','Co děláš?','Pojď si hrát!','Juchů!','Kdy půjdeme ven?','Splníme úkol?'];
const IDLE_GRUMPY=['Brum! Kdo mě tu ruší?','Já nespím, já jen přemýšlím.','Grrr! Dělám strašného medvěda. Bojíš se?','Kde je můj med?! 🍯','Jirko, nemáš náhodou nějaký úkol? Já to vidím!','Nesahej mi na čepici!','Hmpf. Dneska mám náladu na rošťárny.','Kdo snědl moji svačinu?! Grrr!','Ještě jednou mě ignoruješ a budu bručet celý den!','Tak co, šéfe, makáme, nebo ležíme?'];
const isGrumpy=()=>kidOf(V.kid).adult||(petOf(V.kid)||{}).type==='medved'&&!kidOf(V.kid).little;
function petAnim(c){const b=$('.petbody');if(!b)return;b.classList.remove('jump','wiggle','spin','shake');void b.offsetWidth;b.classList.add(c);b.addEventListener('animationend',()=>b.classList.remove(c),{once:true})}
function petIdleStart(){clearInterval(PET_IDLE);PET_IDLE=setInterval(()=>{if(V.name!=='pet'){clearInterval(PET_IDLE);return}
  const p=petOf(V.kid);if(!p||!p.type)return;const q=petNow(p);if(q.asleep||stageOf(petXp(V.kid,p))===0)return;if(Date.now()-PETSAY.ts<9000)return;
  const gr=isGrumpy();petAnim(pick(gr?['shake','jump','wiggle']:['jump','wiggle','spin']));
  if(gr&&Math.random()<.35){PET_ANGRY=Date.now()+2500;rePet();setTimeout(rePet,2600)}
  petSay(pick(gr?IDLE_GRUMPY:IDLE_SWEET),{silent:!gr||Math.random()<.5})},11000)}
function rePet(){const b=$('.petbody');if(!b||V.name!=='pet')return;const p=petOf(V.kid);if(!p)return;const q={...petNow(p),xp:petXp(V.kid,p),live:true};b.innerHTML=petSvg(q,200)+petWearHtml(q,200)}
{const o=SETUP.pet;SETUP.pet=()=>{o();if(petOf(V.kid)&&petOf(V.kid).type)petIdleStart()}}
{const o=handlers.petPet;handlers.petPet=b=>{const now=Date.now();if(PET_ANGRY>now){petAnim('shake');return}PET_TAPS=PET_TAPS.filter(t=>now-t<2500);PET_TAPS.push(now);
  if(PET_TAPS.length>=5&&!petNow(petOf(V.kid)).asleep){PET_TAPS=[];PET_ANGRY=now+3000;petAnim('shake');rePet();setTimeout(rePet,3100);
    petSay(isGrumpy()?pick(['GRRRR! Dost lechtání, nebo tě sním! …Dělám si legraci. 😄','Rrrr! Já jsem divoký medvěd! Nesahat!','Brum brum BRUM! Teď jsem fakt zuřivý! …No dobře, už ne.']):pick(['Grrr! Dost lechtání! Hihi!','Já se zlobím! …Ne, nezlobím. 😄','Uff, to už je moc!']));return}
  o(b);petAnim('jump')}}
