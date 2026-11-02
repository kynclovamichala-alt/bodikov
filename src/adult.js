/* ================= Jirka: emotions & calm ================= */
const EMOS=['vztek','úzkost','zklamání','smutek','strach','stud','vina','frustrace','úleva','žárlivost','vděčnost','osamělost','radost'];
const EMO_POOL=[
  {q:'Kolega si vzal zásluhy za tvou práci. Cítíš horko v obličeji a zatínáš pěsti.',ans:'vztek',exp:'Vztek hlásí, že někdo překročil tvou hranici nebo se děje nespravedlnost. Pomáhá ho pojmenovat a pak klidně říct, co potřebuješ.'},
  {q:'Zítra tě čeká důležitá schůzka. V noci nemůžeš usnout a v hlavě ti běží samé „co když“.',ans:'úzkost',exp:'Úzkost se týká budoucnosti a nejistoty. Tělo se chystá na nebezpečí, které zatím nenastalo. Pomáhá pomalé dýchání a vrátit pozornost do přítomnosti.'},
  {q:'Celý týden ses těšil na výlet a na poslední chvíli se zrušil.',ans:'zklamání',exp:'Zklamání přichází, když se nesplní naše očekávání. Je v pořádku ho přiznat a pak hledat náhradní plán.'},
  {q:'Dozvěděl ses, že zemřel tvůj kamarád z dětství. Nemáš chuť nic dělat.',ans:'smutek',exp:'Smutek patří ke ztrátě. Zpomaluje nás, abychom ji zpracovali. Pomáhá o tom mluvit a dopřát si čas.'},
  {q:'Těsně před autem ti vběhne na silnici srnka. Buší ti srdce a ruce se třesou.',ans:'strach',exp:'Strach reaguje na skutečné nebezpečí tady a teď. Tělo se v mžiku připraví utéct nebo bojovat.'},
  {q:'Před ostatními jsi řekl něco hloupého a nejradši by ses propadl.',ans:'stud',exp:'Stud se bojí, že nás ostatní odmítnou. Pomáhá si připomenout, že chybu udělá každý, a nebrat ji jako soud nad sebou.'},
  {q:'Nechtěně jsi někomu ublížil a pořád se ti to vrací.',ans:'vina',exp:'Vina nás vede k nápravě. Nejlíp ji uleví omluva a snaha to napravit.'},
  {q:'Skládáš skříň potřetí a díly pořád nesedí.',ans:'frustrace',exp:'Frustrace přichází, když nám něco opakovaně brání v cíli. Pomůže krátká pauza a zkusit to jinak.'},
  {q:'Výsledky vyšetření dopadly dobře a ty konečně vydechneš.',ans:'úleva',exp:'Úleva přichází po napětí, když hrozba pomine. Tělo se uvolní a dech se zpomalí.'},
  {q:'Partnerka se dlouho a vesele baví s někým jiným a tobě je to nepříjemné.',ans:'žárlivost',exp:'Žárlivost se bojí, že o někoho blízkého přijdeme. Pomáhá mluvit o svých pocitech klidně a bez obviňování.'},
  {q:'Kamarád ti nečekaně pomohl se stěhováním a nic za to nechtěl.',ans:'vděčnost',exp:'Vděčnost posiluje vztahy. Stojí za to ji dát najevo, třeba jen poděkováním.'},
  {q:'Celý víkend jsi doma sám a chybí ti lidi kolem.',ans:'osamělost',exp:'Osamělost říká, že potřebujeme blízkost. Pomůže ozvat se někomu, i krátkou zprávou.'},
  {q:'Dokončil jsi projekt, na kterém jsi dlouho dřel, a všechno funguje.',ans:'radost',exp:'Radost nás odměňuje za to, co se povedlo. Stojí za to se u ní na chvilku zastavit a užít si ji.'},
  {q:'Zatínáš čelist a ramena máš skoro u uší. Co to nejspíš znamená?',opts:['stres','nuda','radost','únava'],ans:'stres',exp:'Stres se často usadí v čelisti, ramenou a žaludku. Když si toho všimneš včas, můžeš vědomě povolit svaly a zpomalit dech.'},
  {q:'Co nejvíc pomůže v první vlně vzteku?',opts:['Zastavit se a pár pomalých nádechů','Hned to dotyčnému vyčíst','Bouchnout do stolu','Dělat, že nic není'],ans:'Zastavit se a pár pomalých nádechů',exp:'Vztek vrcholí rychle a pak opadá. Pár pomalých nádechů dá mozku čas, aby se zapojilo přemýšlení.'},
  {q:'Proč pomáhá emoci nahlas pojmenovat, třeba „jsem naštvaný“?',opts:['Emoce tím ztratí část síly','Je to jen zvyk','Nepomáhá to','Aby to slyšeli ostatní'],ans:'Emoce tím ztratí část síly',exp:'Když emoci pojmenuješ, zapojí se část mozku, která ji tlumí. Pojmenovaná emoce je slabší.'},
  {q:'Hádka se stupňuje a oba už křičíte. Co je nejlepší udělat?',opts:['Domluvit si pauzu a vrátit se k tomu později','Dotáhnout to hned do konce','Odejít a už to neřešit','Přidat na hlasitosti'],ans:'Domluvit si pauzu a vrátit se k tomu později',exp:'V silných emocích se špatně domlouvá. Pauza na 20–30 minut pomůže oběma zklidnit tělo. Důležité je se k tomu pak opravdu vrátit.'},
  {q:'Co znamená technika STOP?',opts:['Zastav se, nadechni, všimni si, pokračuj','Stůj, toč se, odejdi, padej','Spi, trénuj, odpočívej, plav','Nic, je to jen slovo'],ans:'Zastav se, nadechni, všimni si, pokračuj',exp:'STOP: zastav se, pomalu se nadechni, všimni si, co se v tobě děje, a pak pokračuj vědomě, ne automaticky.'}
];
function makeEmoRound(){return shuffle([...EMO_POOL]).slice(0,8).map(it=>({svg:'',q:it.q,ans:it.ans,exp:it.exp,
  opts:it.opts?shuffle([...it.opts]):shuffle([it.ans,...shuffle(EMOS.filter(e=>e!==it.ans)).slice(0,3)])}))}

const SELF_TEST=[
  'Když se naštvu, dokážu se zastavit dřív, než něco řeknu.',
  'Umím pojmenovat, co přesně cítím.',
  'Když mám špatný den, vím, co mi pomůže.',
  'Silné emoce u mě docela rychle odezní.',
  'Dokážu říct, co potřebuju, bez křiku.',
  'Všimnu si, kde v těle cítím stres.',
  'Po hádce se dokážu vrátit a usmířit.',
  'Když něco nevyjde, nevzdám to hned.'];
const LIKERT=['Skoro nikdy','Spíš ne','Někdy','Často','Skoro vždy'];
function vSelfTest(){
  if(L.i>=SELF_TEST.length){const sc=L.ans.reduce((a,b)=>a+b,0),max=SELF_TEST.length*5;
    const band=sc<20?{t:'Emoce tě často převálcují',d:'Silné pocity tě umí rychle strhnout. To se dá trénovat. Začni technikou STOP a krabicovým dýcháním, ideálně každý den chvilku, i když jsi v klidu.'}
      :sc<31?{t:'Většinou to zvládáš',d:'Emoce máš docela pod kontrolou, ale v náročných chvílích ujedeš. Zkus si všímat prvních signálů v těle, třeba sevřené čelisti, a zastavit se včas.'}
      :{t:'Emoce máš v hrsti',d:'Umíš své pocity poznat i zvládnout. Pokračuj a ukaž to ostatním svým příkladem.'};
    const weak=L.ans.map((v,i)=>[v,i]).filter(x=>x[0]<=2).map(x=>SELF_TEST[x[1]]);
    return `${topbar('Výsledek testu')}<div class="card sec center"><div class="bignum">${sc}<span style="font-size:1.6rem"> / ${max}</span></div><h2>${band.t}</h2><p>${band.d}</p></div>
      ${weak.length?`<div class="card sec"><h3>Na čem můžeš zapracovat</h3>${weak.map(w=>`<p>• ${esc(w)}</p>`).join('')}</div>`:''}
      <p class="note">Tohle je jen orientační test pro radost a sebepoznání, ne odborné vyšetření.</p>
      <button class="btn big" data-act="selfDone" style="align-self:center">Hotovo ⭐</button>`;}
  return `${topbar('Test: jak zvládám emoce')}${progressDots()}<p class="qtext">${esc(SELF_TEST[L.i])}</p>
    <div class="steps">${LIKERT.map((l,i)=>`<button class="step" data-act="likert" data-v="${i+1}"><span class="box">${i+1}</span><span>${l}</span></button>`).join('')}</div>`;
}
function vCalm(){
  return `${topbar('Jak se uklidnit')}
  <button class="lcard" data-act="startBreath"><span class="ic" style="background:var(--jirka-soft)">🌬️</span><span class="t"><h2>Krabicové dýchání</h2><span class="muted">Nádech 4 · zádrž 4 · výdech 4 · zádrž 4. Asi 1,5 minuty.</span></span></button>
  <button class="lcard" data-act="startGround"><span class="ic" style="background:var(--mint-soft)">🖐️</span><span class="t"><h2>Uzemnění 5-4-3-2-1</h2><span class="muted">Když tě zaplaví úzkost nebo vztek.</span></span></button>
  <article class="card lesson"><h3>Technika STOP</h3>
    <p><b>S</b>top: zastav se, nic neříkej a nic nedělej.</p><p><b>T</b>: nadechni se pomalu nosem, vydechni pusou.</p><p><b>O</b>: všimni si, co cítíš v těle a jak se ta emoce jmenuje.</p><p><b>P</b>: pokračuj, ale vědomě. Co teď opravdu potřebuješ?</p></article>
  <article class="card lesson"><h3>Rychlá první pomoc</h3>
    <p>• Opláchni si obličej studenou vodou.</p><p>• Vyjdi na pět minut ven a projdi se.</p><p>• Řekni nahlas, co cítíš: „Jsem naštvaný, protože…“</p><p>• Pevně zatni pěsti na 5 vteřin a pak je povol. Dvakrát zopakuj.</p></article>`;
}
const BREATH=[['Nádech',1.25],['Zádrž',1.25],['Výdech',.75],['Zádrž',.75]],BREATH_CYCLES=6;
function vBreath(){
  return `${topbar('Krabicové dýchání')}${progressDots()}
  <div style="height:260px;display:grid;place-items:center"><div id="breathball" style="width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,var(--kid));transition:transform 4s linear;transform:scale(.75);box-shadow:0 10px 40px rgba(47,125,246,.35)"></div></div>
  <p class="qtext" id="breathtxt">Připrav se…</p><p class="muted center" id="breathsub">Sedni si pohodlně a sleduj kouli.</p>`;
}
let breathT=null;
function runBreath(){
  clearInterval(breathT);let tick=0;const total=BREATH_CYCLES*16;
  const step=()=>{if(V.name!=='breath'||!L){clearInterval(breathT);return}
    const ph=Math.floor(tick/4)%4,sec=tick%4+1,cyc=Math.floor(tick/16);
    if(tick>=total){clearInterval(breathT);L.i=L.total;capAward('learn',S.settings.learnCap,3,'Klid: krabicové dýchání','Skvěle zklidněno!','',()=>{L=null;back()});return}
    if(L.i!==cyc){L.i=cyc;const p=$('.progress');if(p)p.outerHTML=progressDots()}
    const ball=$('#breathball'),txt=$('#breathtxt'),sub=$('#breathsub');
    if(sec===1&&ball)ball.style.transform=`scale(${BREATH[ph][1]})`;
    if(txt)txt.textContent=`${BREATH[ph][0]} ${sec}`;if(sub)sub.textContent=`Kolo ${cyc+1} ze ${BREATH_CYCLES}`;
    tick++;};
  setTimeout(()=>{step();breathT=setInterval(step,1000)},1200);
}
const GROUND=[['👀',5,'věcí, které vidíš'],['✋',4,'věci, kterých se můžeš dotknout'],['👂',3,'zvuky, které slyšíš'],['👃',2,'vůně, které cítíš'],['👅',1,'chuť, kterou máš v puse']];
function vGround(){
  const g=GROUND[L.i];if(!g)return '';
  return `${topbar('Uzemnění 5-4-3-2-1')}${progressDots()}
  <div class="card sec center"><div style="font-size:4rem">${g[0]}</div><div class="bignum">${g[1]}</div><h2>Najdi ${g[1]} ${g[2]}</h2><p class="muted">V duchu nebo nahlas je pojmenuj. Nespěchej.</p>
  <div class="row" style="justify-content:center">${Array.from({length:g[1]},(_,i)=>`<button class="numbtn ${L.c>i?'ok':''}" data-act="groundTap" style="width:56px">${i+1}</button>`).join('')}</div></div>`;
}

/* ================= Jirka: games ================= */
let GM=null;
function stopGame(){if(GM){GM.alive=false;cancelAnimationFrame(GM.raf);GM=null}}
function gameShell(title,ctrls){return `${topbar(title)}<div class="row" style="justify-content:space-between"><span class="pill" id="gscore">0</span><span class="muted" id="ghint"></span></div>
  <div class="gamewrap" id="gwrap"><canvas id="gcv"></canvas><div class="gover" id="gover" hidden></div></div>${ctrls}`}
function setupCanvas(w,h){const cv=$('#gcv'),dpr=Math.min(2,devicePixelRatio||1);cv.width=w*dpr;cv.height=h*dpr;cv.style.width=w+'px';cv.style.height=h+'px';$('#gwrap').style.width=w+'px';const x=cv.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);return{cv,x}}
function gameOver(kind,score,label,pts){
  const o=$('#gover');if(!o)return;
  o.innerHTML=`<h2>Konec hry</h2><p class="cstars" style="font-size:2.2rem">${label}</p><div class="row" style="justify-content:center"><button class="btn" data-act="gameAgain">Znovu</button></div>`;o.hidden=false;
  if(pts>0)capAward('game',S.settings.gameCap,pts,{tetris:'Tetris',cars:'Autíčka',build:'Stavitel'}[kind],'Dobrá hra!','');
  else toast({tetris:'Hvězdičky jsou od 3 řad. Zkus to znovu!',cars:'Hvězdičky jsou od 500 m. Zkus to znovu!',build:'Hvězdičky jsou od 8 pater. Zkus to znovu!'}[kind]);
}
const gameW=()=>Math.min($('#app').clientWidth-32,420);

/* --- Tetris --- */
const TET={I:[[1,1,1,1]],O:[[1,1],[1,1]],T:[[0,1,0],[1,1,1]],S:[[0,1,1],[1,1,0]],Z:[[1,1,0],[0,1,1]],J:[[1,0,0],[1,1,1]],L:[[0,0,1],[1,1,1]]};
const TCOL={I:'#4FB6FF',O:'#FFC22E',T:'#8E6BFF',S:'#1FBF92',Z:'#FF5C5C',J:'#3D6BFF',L:'#FF8A3D'};
function vTetris(){return gameShell('Tetris',`<div class="ctrls"><button class="ctl" data-act="tet" data-k="left" aria-label="Doleva">◀</button><button class="ctl" data-act="tet" data-k="rot" aria-label="Otočit">⟳</button><button class="ctl" data-act="tet" data-k="right" aria-label="Doprava">▶</button><button class="ctl" data-act="tet" data-k="drop" aria-label="Shodit">⤓</button></div>`)}
function setupTetris(){
  const cell=Math.floor(Math.min(gameW()/10,(innerHeight-300)/20,30)),W=cell*10,H=cell*20,{x}=setupCanvas(W,H);
  const neon=has(V.kid,'tetris_neon');
  const g={alive:true,kind:'tetris',grid:Array.from({length:20},()=>Array(10).fill(null)),lines:0,last:0,acc:0};
  const rnd=()=>{const k=pick(Object.keys(TET));return{k,m:TET[k].map(r=>[...r]),x:3,y:0}};
  g.cur=rnd();
  const fits=(m,px,py)=>m.every((r,i)=>r.every((v,j)=>!v||(px+j>=0&&px+j<10&&py+i<20&&(py+i<0||!g.grid[py+i][px+j]))));
  const lock=()=>{g.cur.m.forEach((r,i)=>r.forEach((v,j)=>{if(v&&g.cur.y+i>=0)g.grid[g.cur.y+i][g.cur.x+j]=g.cur.k}));
    let cl=0;for(let r=19;r>=0;r--){if(g.grid[r].every(Boolean)){g.grid.splice(r,1);g.grid.unshift(Array(10).fill(null));cl++;r++}}
    if(cl){g.lines+=cl;chime('pop');$('#gscore').textContent=`${g.lines} ${plural(g.lines,'řada','řady','řad')}`}
    g.cur=rnd();if(!fits(g.cur.m,g.cur.x,g.cur.y)){g.alive=false;gameOver('tetris',g.lines,`${g.lines} ${plural(g.lines,'řada','řady','řad')}`,g.lines>=10?3:g.lines>=3?2:0)}};
  g.move=k=>{if(!g.alive)return;const c=g.cur;
    if(k==='left'&&fits(c.m,c.x-1,c.y))c.x--;
    if(k==='right'&&fits(c.m,c.x+1,c.y))c.x++;
    if(k==='rot'){const r=c.m[0].map((_,j)=>c.m.map(row=>row[j]).reverse());for(const dx of[0,-1,1,-2,2])if(fits(r,c.x+dx,c.y)){c.m=r;c.x+=dx;break}}
    if(k==='down'){if(fits(c.m,c.x,c.y+1))c.y++;else lock()}
    if(k==='drop'){while(fits(c.m,c.x,c.y+1))c.y++;lock()}
    draw()};
  const block=(cx,cy,col)=>{if(neon){x.fillStyle=col;x.shadowColor=col;x.shadowBlur=10;x.fillRect(cx*cell+2,cy*cell+2,cell-4,cell-4);x.shadowBlur=0}
    else{x.fillStyle=col;x.fillRect(cx*cell+1,cy*cell+1,cell-2,cell-2);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(cx*cell+1,cy*cell+1,cell-2,4)}};
  const draw=()=>{x.fillStyle=neon?'#0d0b1e':'#1d2246';x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,.05)';for(let i=1;i<10;i++){x.beginPath();x.moveTo(i*cell,0);x.lineTo(i*cell,H);x.stroke()}
    g.grid.forEach((r,i)=>r.forEach((k,j)=>{if(k)block(j,i,TCOL[k])}));
    if(g.alive){let gy=g.cur.y;while(fits(g.cur.m,g.cur.x,gy+1))gy++;x.globalAlpha=.2;g.cur.m.forEach((r,i)=>r.forEach((v,j)=>{if(v)block(g.cur.x+j,gy+i,TCOL[g.cur.k])}));x.globalAlpha=1;
      g.cur.m.forEach((r,i)=>r.forEach((v,j)=>{if(v)block(g.cur.x+j,g.cur.y+i,TCOL[g.cur.k])}))}};
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=t-(g.last||t);g.last=t;g.acc+=dt;const sp=Math.max(120,700-g.lines*25);
    if(g.acc>sp){g.acc=0;g.move('down')}g.raf=requestAnimationFrame(loop)};
  GM=g;$('#gscore').textContent='0 řad';$('#ghint').textContent='Šipky na klávesnici fungují taky';draw();g.raf=requestAnimationFrame(loop);
}

/* --- Cars --- */
function vCars(){return gameShell('Autíčka',`<div class="ctrls two"><button class="ctl" data-act="car" data-k="-1" aria-label="Doleva">◀</button><button class="ctl" data-act="car" data-k="1" aria-label="Doprava">▶</button></div>`)}
function setupCars(){
  const W=Math.floor(Math.min(gameW(),360)),H=Math.floor(Math.max(320,Math.min(innerHeight-300,560))),{x}=setupCanvas(W,H);
  let thk=V.carTh||'day';const TH=CAR_TH[thk]&&(!CAR_TH[thk].item||has(V.kid,CAR_TH[thk].item))?CAR_TH[thk]:CAR_TH.day;const night=!!TH.dark,race=V.carCar==='race'&&has(V.kid,'cars_race'),lw=W/3,carW=lw*.55,carH=carW*1.7;
  const g={alive:true,kind:'cars',lane:1,px:lw*1.5,obs:[],dist:0,speed:race?270:220,spawn:0,last:0,dash:0};
  g.move=d=>{if(!g.alive)return;g.lane=Math.max(0,Math.min(2,g.lane+d));chime('pop')};
  const car=(cx,cy,col,me)=>{x.fillStyle=col;const r=8;x.beginPath();x.roundRect(cx-carW/2,cy-carH/2,carW,carH,r);x.fill();
    x.fillStyle='rgba(20,24,60,.75)';x.fillRect(cx-carW/2+5,cy-carH/2+(me?carH*.18:carH*.55),carW-10,carH*.22);
    x.fillStyle='#222';[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>x.fillRect(cx+a*carW/2-(a>0?0:4),cy+b*carH*.28-6,4,12));
    if(night&&me){x.fillStyle='rgba(255,240,170,.18)';x.beginPath();x.moveTo(cx-carW/2,cy-carH/2);x.lineTo(cx-carW,cy-carH*2.2);x.lineTo(cx+carW,cy-carH*2.2);x.lineTo(cx+carW/2,cy-carH/2);x.fill()}};
  const cols=['#FF5C5C','#FFC22E','#1FBF92','#8E6BFF','#FF8A3D','#4FB6FF'];
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=Math.min(.05,(t-(g.last||t))/1000);g.last=t;
    g.speed+=dt*6;g.dist+=g.speed*dt/10;g.dash=(g.dash+g.speed*dt)%40;g.px+=((g.lane+.5)*lw-g.px)*Math.min(1,dt*14);
    g.spawn-=dt;if(g.spawn<=0){const lanes=shuffle([0,1,2]);const n=Math.random()<.25&&g.dist>200?2:1;lanes.slice(0,n).forEach(l=>g.obs.push({l,y:-carH,c:pick(cols)}));g.spawn=Math.max(.45,1.3-g.dist/2500)}
    g.obs.forEach(o=>o.y+=g.speed*dt);g.obs=g.obs.filter(o=>o.y<H+carH);
    const py=H-carH*.9;
    for(const o of g.obs){const ox=(o.l+.5)*lw;if(Math.abs(ox-g.px)<carW*.85&&Math.abs(o.y-py)<carH*.9){g.alive=false;chime('no');const m=Math.floor(g.dist);gameOver('cars',m,`${m} m`,m>=1500?3:m>=500?2:0);break}}
    x.fillStyle=TH.road;x.fillRect(0,0,W,H);
    x.fillStyle=TH.side;x.fillRect(0,0,6,H);x.fillRect(W-6,0,6,H);
    x.fillStyle=TH.dash;for(let i=1;i<3;i++)for(let y=-40+g.dash;y<H;y+=40)x.fillRect(i*lw-2,y,4,20);
    g.obs.forEach(o=>car((o.l+.5)*lw,o.y,o.c,false));car(g.px,py,race?'#E0202A':'#2F7DF6',true);if(race){x.fillStyle='#fff';x.fillRect(g.px-3,py-carH/2,6,carH);x.fillStyle='#222';x.fillRect(g.px-carW/2-2,py+carH/2-5,carW+4,5)}
    if(night){x.fillStyle='rgba(0,0,20,.35)';x.fillRect(0,0,W,H*.35)}
    $('#gscore').textContent=`${Math.floor(g.dist)} m`;
    if(g.alive)g.raf=requestAnimationFrame(loop)};
  GM=g;$('#ghint').textContent='Ťukni na levou nebo pravou půlku';
  $('#gcv').addEventListener('pointerdown',e=>{const r=e.target.getBoundingClientRect();g.move(e.clientX-r.left<r.width/2?-1:1)});
  g.raf=requestAnimationFrame(loop);
}

/* --- Builder (stack) --- */
function vBuild(){return gameShell('Stavitel',`<button class="btn big" data-act="buildDrop" style="align-self:center;width:100%">Pustit blok ⬇</button>`)}
function setupBuild(){
  const W=Math.floor(Math.min(gameW(),380)),H=Math.floor(Math.max(340,Math.min(innerHeight-280,580))),{x}=setupCanvas(W,H);
  const gold=has(V.kid,'build_gold'),bh=26,base={x:W*.2,w:W*.6};
  const g={alive:true,kind:'build',stack:[base],cur:{x:0,w:base.w,dir:1},speed:140,cam:0,last:0,parts:[]};
  const colAt=i=>gold?`hsl(${42+(i%3)*4},${85-(i%4)*5}%,${55+(i%5)*3}%)`:`hsl(${(i*24)%360},75%,62%)`;
  g.drop=()=>{if(!g.alive)return;const top=g.stack[g.stack.length-1],c=g.cur;
    const l=Math.max(c.x,top.x),r=Math.min(c.x+c.w,top.x+top.w),ov=r-l;
    if(ov<=2){g.alive=false;chime('no');const n=g.stack.length-1;gameOver('build',n,`${n} ${plural(n,'patro','patra','pater')}`,n>=15?3:n>=8?2:0);return}
    if(Math.abs(ov-top.w)<4&&Math.abs(c.x-top.x)<4){g.stack.push({x:top.x,w:top.w});chime('tick')}
    else{g.parts.push({x:c.x<l?c.x:r,w:c.w-ov,y:g.stack.length,vy:0,i:g.stack.length});g.stack.push({x:l,w:ov});chime('pop')}
    g.cur={x:g.stack.length%2?-g.stack.at(-1).w:W,w:g.stack.at(-1).w,dir:g.stack.length%2?1:-1};g.speed=Math.min(380,g.speed+8);
    $('#gscore').textContent=`${g.stack.length-1} ${plural(g.stack.length-1,'patro','patra','pater')}`};
  const yOf=i=>H-40-(i+1)*bh+g.cam;
  const loop=t=>{if(!g.alive||GM!==g){if(GM===g)draw();return}const dt=Math.min(.05,(t-(g.last||t))/1000);g.last=t;
    const c=g.cur;c.x+=c.dir*g.speed*dt;if(c.x+c.w>W+c.w*.2&&c.dir>0)c.dir=-1;if(c.x<-c.w*.2&&c.dir<0)c.dir=1;
    const want=Math.max(0,(g.stack.length-8)*bh);g.cam+=(want-g.cam)*Math.min(1,dt*5);
    g.parts.forEach(p=>{p.vy+=900*dt;p.y-=p.vy*dt/bh});g.parts=g.parts.filter(p=>yOf(p.y)<H+50);
    draw();g.raf=requestAnimationFrame(loop)};
  const draw=()=>{const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#8fd3ff');sky.addColorStop(1,'#e8f6ff');x.fillStyle=sky;x.fillRect(0,0,W,H);
    x.fillStyle='#7cc576';x.fillRect(0,H-40+g.cam,W,40);
    g.stack.forEach((b,i)=>{x.fillStyle=i?colAt(i):'#8a8fa8';x.fillRect(b.x,yOf(i),b.w,bh-2);x.fillStyle='rgba(255,255,255,.3)';x.fillRect(b.x,yOf(i),b.w,4)});
    g.parts.forEach(p=>{x.fillStyle=colAt(p.i);x.fillRect(p.x,yOf(p.y),p.w,bh-2)});
    if(g.alive){x.fillStyle=colAt(g.stack.length);x.fillRect(g.cur.x,yOf(g.stack.length),g.cur.w,bh-2)}};
  GM=g;$('#gscore').textContent='0 pater';$('#ghint').textContent='Ťukni, když je blok nad věží';
  $('#gcv').addEventListener('pointerdown',()=>g.drop());
  g.raf=requestAnimationFrame(loop);
}
document.addEventListener('keydown',e=>{if(!GM||!GM.alive)return;
  if(GM.kind==='tetris'){const k={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rot',ArrowDown:'down',' ':'drop'}[e.key];if(k){e.preventDefault();GM.move(k)}}
  if(GM.kind==='cars'){if(e.key==='ArrowLeft')GM.move(-1);if(e.key==='ArrowRight')GM.move(1)}
  if(GM.kind==='build'&&(e.key===' '||e.key==='Enter')){e.preventDefault();GM.drop()}});

Object.assign(MAP,{calm:vCalm,breath:vBreath,ground:vGround,selfTest:vSelfTest,emoQuiz:vGeoQuiz,tetris:vTetris,cars:vCars,build:vBuild});
Object.assign(handlers,{
  tet:b=>GM&&GM.move&&GM.move(b.dataset.k),
  car:b=>GM&&GM.move&&GM.move(+b.dataset.k),
  buildDrop:()=>GM&&GM.drop&&GM.drop(),
  gameAgain:()=>render(),
  likert:b=>{L.ans.push(+b.dataset.v);L.i++;chime('pop');render()},
  selfDone:()=>{L=null;capAward('learn',S.settings.learnCap,3,'Učení: test emocí','Díky za upřímnost!','',()=>back())},
  startBreath:()=>{L={g:'breath',i:0,total:BREATH_CYCLES,first:0};go('breath');runBreath()},
  startGround:()=>{L={g:'ground',i:0,total:GROUND.length,first:0,c:0};go('ground')},
  groundTap:()=>{L.c++;chime('pop');if(L.c>=GROUND[L.i][1]){L.i++;L.c=0;if(L.i>=GROUND.length){L=null;capAward('learn',S.settings.learnCap,3,'Klid: uzemnění 5-4-3-2-1','Jsi zpátky tady a teď.','',()=>back());return}}render()}
});

/* ================= Bea: division with remainder ================= */
function newDivQ(){let d,q,r,n;do{d=2+(Math.random()*8|0);q=1+(Math.random()*9|0);r=Math.random()<.15?0:1+(Math.random()*(d-1)|0);n=d*q+r}while(n>90||n<5||(L&&L.q&&L.q.n===n&&L.q.d===d));
  return{n,d,q,r,a:{q:'',r:''},field:'q',wrong:false,solved:false,help:false,msg:''}}
function vDivQuiz(){const q=L.q;
  const fld=(k,lab)=>`<button class="divin ${q.field===k?'on':''} ${q.solved?'ok':''}" data-act="divField" data-f="${k}" aria-label="${lab}">${esc(q.a[k])||'&nbsp;'}</button>`;
  const dots=q.help?`<div class="divhelp">${Array.from({length:q.q},(_,i)=>`<span class="grp">${'<i></i>'.repeat(q.d)}</span>`).join('')}${q.r?`<span class="grp rest">${'<i></i>'.repeat(q.r)}</span>`:''}</div><p class="muted center">${q.n} teček po skupinkách ${q.d}: ${q.q} ${plural(q.q,'celá skupinka','celé skupinky','celých skupinek')}${q.r?`, zbude ${q.r}`:', nic nezbude'}.</p>`:'';
  return `${topbar('Dělení se zbytkem')}${progressDots()}
  <div class="card sec center"><div class="divex">${q.n} : ${q.d} = ${fld('q','výsledek')} <span class="zb">zb.</span> ${fld('r','zbytek')}</div>
  ${q.msg?`<div class="explain">${q.msg}</div>`:''}${dots}</div>
  ${q.solved?`<button class="btn big" data-act="learnNext" style="align-self:center">${L.i+1<L.total?'Další příklad':'Hotovo!'}</button>`:`
  <div class="numpad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="ctl" data-act="divKey" data-k="${n}">${n}</button>`).join('')}<button class="ctl" data-act="divKey" data-k="del" aria-label="Smazat">⌫</button><button class="ctl" data-act="divKey" data-k="0">0</button><button class="ctl ok" data-act="divCheck">✓</button></div>
  <div class="row" style="justify-content:center"><button class="btn ghost" data-act="divHelp">💡 Nápověda</button></div>`}`;
}
function divCheck(){const q=L.q;if(q.a.q===''||q.a.r===''){q.msg='Vyplň výsledek i zbytek.';render();return}
  const aq=+q.a.q,ar=+q.a.r;
  if(aq===q.q&&ar===q.r){q.solved=true;if(!q.wrong&&!q.help)L.first++;chime('tick');q.msg=`✅ Správně! ${q.d} · ${q.q} = ${q.d*q.q}, a ${q.n} − ${q.d*q.q} = ${q.r}.`;render();return}
  q.wrong=true;chime('no');
  if(ar>=q.d)q.msg=`Zbytek musí být menší než ${q.d}. Když zbude ${ar}, vejde se tam ještě jedna skupinka.`;
  else if(aq*q.d+ar!==q.n)q.msg=`Zkouška: ${q.d} · ${aq} + ${ar} = ${q.d*aq+ar}, ale má vyjít ${q.n}. Zkus to znovu.`;
  else q.msg='Skoro! Zkus to znovu.';
  render();
}
document.addEventListener('keydown',e=>{if(V.name!=='divQuiz'||!L||L.q.solved)return;
  if(/^\d$/.test(e.key))handlers.divKey({dataset:{k:e.key}});else if(e.key==='Backspace')handlers.divKey({dataset:{k:'del'}});else if(e.key==='Enter')divCheck();else if(e.key==='Tab'){e.preventDefault();L.q.field=L.q.field==='q'?'r':'q';render()}});
Object.assign(MAP,{divQuiz:vDivQuiz});
Object.assign(handlers,{
  divField:b=>{L.q.field=b.dataset.f;render()},
  divKey:b=>{const q=L.q,k=b.dataset.k;if(q.solved)return;let v=q.a[q.field];
    if(k==='del')v=v.slice(0,-1);else if(v.length<2)v+=k;q.a[q.field]=v.replace(/^0(\d)/,'$1');
    if(q.field==='q'&&q.a.q.length>=String(q.q).length&&k!=='del'&&q.a.r==='')q.field='r';
    q.msg='';render()},
  divCheck:()=>divCheck(),
  divHelp:()=>{L.q.help=true;render()}
});

/* ================= Bea: brackets ================= */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const BR=[
  ()=>{const c=ri(2,9);let a,b;do{a=ri(1,9);b=ri(1,9)}while(a+b>10);const s=a+b;return{e:`(${a} + ${b}) · ${c}`,v:s*c,naive:a+b*c,steps:[`${a} + ${b} = ${s}`,`${s} · ${c} = ${s*c}`]}},
  ()=>{const c=ri(2,9),q=ri(2,10),s=c*q,a=ri(1,s-1),b=s-a;return{e:`(${a} + ${b}) : ${c}`,v:q,naive:b%c===0?a+b/c:null,steps:[`${a} + ${b} = ${s}`,`${s} : ${c} = ${q}`]}},
  ()=>{const a=ri(2,9);let b,c;do{b=ri(4,18);c=ri(1,b-1)}while(b-c>10);const d=b-c;return{e:`${a} · (${b} − ${c})`,v:a*d,naive:a*b-c,steps:[`${b} − ${c} = ${d}`,`${a} · ${d} = ${a*d}`]}},
  ()=>{const a=ri(25,70),b=ri(3,15),c=ri(2,Math.min(15,a-b-1));return{e:`${a} − (${b} + ${c})`,v:a-b-c,naive:a-b+c,steps:[`${b} + ${c} = ${b+c}`,`${a} − ${b+c} = ${a-b-c}`]}},
  ()=>{const a=ri(20,60),b=ri(6,19),c=ri(1,b-1);return{e:`${a} − (${b} − ${c})`,v:a-(b-c),naive:a-b-c>=0?a-b-c:null,steps:[`${b} − ${c} = ${b-c}`,`${a} − ${b-c} = ${a-(b-c)}`]}},
  ()=>{const c=ri(2,9);let a,b;do{a=ri(5,18);b=ri(1,a-1)}while(a-b>10);const d=a-b;return{e:`(${a} − ${b}) · ${c}`,v:d*c,naive:a-b*c>=0?a-b*c:null,steps:[`${a} − ${b} = ${d}`,`${d} · ${c} = ${d*c}`]}},
  ()=>{const a=ri(8,30),b=ri(8,30),c=ri(2,12),d=ri(2,Math.min(12,a+b-c-1));return{e:`(${a} + ${b}) − (${c} + ${d})`,v:a+b-c-d,naive:a+b-c+d,steps:[`${a} + ${b} = ${a+b}`,`${c} + ${d} = ${c+d}`,`${a+b} − ${c+d} = ${a+b-c-d}`]}},
  ()=>{const a=ri(2,9);let b,c;do{b=ri(1,9);c=ri(1,9)}while(b+c>10);const s=a*(b+c),d=ri(1,Math.min(20,s-1));return{e:`${a} · (${b} + ${c}) − ${d}`,v:s-d,naive:a*b+c-d>=0?a*b+c-d:null,steps:[`${b} + ${c} = ${b+c}`,`${a} · ${b+c} = ${s}`,`${s} − ${d} = ${s-d}`]}},
  ()=>{const c=ri(2,9),q=ri(2,9),d=c*q;let a=ri(2,6),b=ri(2,6);const p=a*b;return{e:`${a} · ${b} + (${d} : ${c})`,v:p+q,naive:null,steps:[`${d} : ${c} = ${q}`,`${a} · ${b} = ${p}`,`${p} + ${q} = ${p+q}`]}}
];
function makeBrRound(){return shuffle([...BR]).slice(0,8).map(f=>({...f(),a:'',wrong:false,solved:false,help:false,msg:''}))}
const brHtml=e=>esc(e).replace(/\([^)]*\)/g,m=>`<span class="brk">${m}</span>`);
function vBrQuiz(){const q=L.q;
  return `${topbar('Počítání se závorkami')}${progressDots()}
  <div class="card sec center"><div class="divex">${brHtml(q.e)} = <span class="divin on ${q.solved?'ok':''}">${esc(q.a)||'&nbsp;'}</span></div>
  ${q.help&&!q.solved?`<div class="explain">💡 1. krok: ${esc(q.steps[0])}</div>`:''}
  ${q.solved?`<div class="explain">✅ Správně!<br>${q.steps.map((s,i)=>`${i+1}. ${esc(s)}`).join('<br>')}</div>`:q.msg?`<div class="explain">${q.msg}</div>`:''}</div>
  ${q.solved?`<button class="btn big" data-act="learnNext" style="align-self:center">${L.i+1<L.total?'Další příklad':'Hotovo!'}</button>`:`
  <div class="numpad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button class="ctl" data-act="brKey" data-k="${n}">${n}</button>`).join('')}<button class="ctl" data-act="brKey" data-k="del" aria-label="Smazat">⌫</button><button class="ctl" data-act="brKey" data-k="0">0</button><button class="ctl ok" data-act="brCheck">✓</button></div>
  <div class="row" style="justify-content:center"><button class="btn ghost" data-act="brHelp">💡 Nápověda</button></div>`}
  <p class="note center">Pravidlo: nejdřív závorka, pak krát a děleno, nakonec plus a mínus.</p>`;
}
function brCheck(){const q=L.q;if(q.a===''){q.msg='Napiš výsledek.';render();return}const a=+q.a;
  if(a===q.v){q.solved=true;if(!q.wrong&&!q.help)L.first++;chime('tick');render();return}
  q.wrong=true;chime('no');
  q.msg=(q.naive!==null&&a===q.naive&&q.naive!==q.v)?'Pozor! Nejdřív se počítá to, co je v <b>závorce</b>.':'Ještě jednou. Začni tím, co je v závorce. 💡 Nápověda ti ukáže první krok.';
  q.a='';render();
}
document.addEventListener('keydown',e=>{if(V.name!=='brQuiz'||!L||L.q.solved)return;
  if(/^\d$/.test(e.key))handlers.brKey({dataset:{k:e.key}});else if(e.key==='Backspace')handlers.brKey({dataset:{k:'del'}});else if(e.key==='Enter')brCheck()});
Object.assign(MAP,{brQuiz:vBrQuiz});
Object.assign(handlers,{
  brKey:b=>{const q=L.q,k=b.dataset.k;if(q.solved)return;if(k==='del')q.a=q.a.slice(0,-1);else if(q.a.length<3)q.a=(q.a+k).replace(/^0(\d)/,'$1');q.msg='';render()},
  brCheck:()=>brCheck(),
  brHelp:()=>{L.q.help=true;render()}
});
