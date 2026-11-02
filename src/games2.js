
/* ================= games registry ================= */
const GAMES=[
  {v:'mirror',ic:'🦋',bg:'var(--bea-soft)',name:'Zrcadlové malování',d:'Kresli a obrázek se zrcadlí.',pill:'+2 ⭐ za obrázek',for:['lea','bea']},
  {v:'mandala',ic:'🌸',bg:'var(--mint-soft)',name:'Mandala',d:'Kreslíš a kreslí se to do 4 stran.',pill:'+2 ⭐ za obrázek',for:['lea','bea']},
  {v:'colorPick',ic:'🖍️',bg:'var(--lea-soft)',name:'Vybarvovánky',d:'Ťukni na místo a vybarví se.',pill:'+2 ⭐ za obrázek',for:['lea','bea']},
  {v:'pexeso',item:'game_pexeso',ic:'🃏',name:'Pexeso',d:'Najdi dvojice obrázků.',pill:'+2 ⭐ za hru',for:['lea','bea']},
  {v:'puzzle',item:'game_puzzle',ic:'🧩',name:'Puzzle',d:'Slož obrázek nebo vlastní fotku.',pill:'+2 ⭐ za obrázek',for:['lea','bea']},
  {v:'bubbles',item:'game_bubbles',ic:'🫧',name:'Bublinky a ohňostroj',d:'Praskej bubliny a pouštěj ohňostroj.',pill:'+2 ⭐ za 30 ťuknutí',for:['lea','bea']},
  {v:'music',item:'game_music',ic:'🎵',name:'Hudební zvířátka',d:'Zvířátka hrají, zahraj písničku.',pill:'+2 ⭐ za písničku',for:['lea','bea']},
  {v:'maze',item:'game_maze',ic:'🌀',name:'Bludiště',d:'Doveď myšku k sýru.',pill:'+2 ⭐ za bludiště',for:['lea','bea']},
  {v:'diff',item:'game_diff',ic:'🔍',name:'Hledej rozdíly',d:'Najdi rozdíly mezi obrázky.',pill:'+2 ⭐ za obrázek',for:['lea','bea']},
  {v:'pixel',item:'game_pixel',ic:'🟥',name:'Pixel art',d:'Malování po čtverečcích podle předlohy.',pill:'+2 ⭐ za obrázek',for:['bea']},
  {v:'hangman',item:'game_hangman',ic:'🎈',name:'Šibenice s balónky',d:'Uhodni vyjmenované slovo.',pill:'+2 ⭐ za slovo',for:['bea']},
  {v:'duel',item:'game_duel',ic:'⚔️',name:'Souboj v násobilce',d:'Dva hráči na jednom telefonu.',pill:'+2 ⭐ za souboj',for:['bea','jirka']},
  {v:'tetris',item:'game_tetris',free:['jirka'],ic:'🧱',name:'Tetris',d:'Skládej řady, ať nic nepřeteče.',pill:'+2 ⭐ od 3 řad',for:['lea','bea','jirka']},
  {v:'cars',item:'game_cars',free:['jirka'],ic:'🏎️',name:'Autíčka',d:'Uhýbej autům na silnici.',pill:'+2 ⭐ od 500 m',for:['lea','bea','jirka']},
  {v:'build',item:'game_build',free:['jirka'],ic:'🏗️',name:'Stavitel',d:'Postav co nejvyšší věž.',pill:'+2 ⭐ od 8 pater',for:['lea','bea','jirka']},
  {v:'snake',item:'game_snake',ic:'🐍',name:'Had',d:'Sbírej jablka a nenaraz.',pill:'+2 ⭐ od 10 jablek',for:['jirka','bea']},
  {v:'breakout',item:'game_breakout',ic:'🏓',name:'Rozbíječ cihel',d:'Míčkem rozbij cihly.',pill:'+2 ⭐ od 20 cihel',for:['jirka','bea']},
  {v:'parking',item:'game_parking',ic:'🅿️',name:'Parkování',d:'Zaparkuj auto bez nárazu.',pill:'+2 ⭐ za level',for:['jirka','bea']},
  {v:'g2048',item:'game_2048',ic:'🔢',name:'2048',d:'Spojuj stejná čísla.',pill:'+2 ⭐ od 256',for:['jirka','bea']}];
const canPlay=(k,g)=>!g.item||(g.free||[]).includes(k)||has(k,g.item);
function vGames2(){const id=V.kid,mine=GAMES.filter(g=>g.for.includes(id)),play=mine.filter(g=>canPlay(id,g)),lock=mine.filter(g=>!canPlay(id,g));
  const ups=itemsFor(id).filter(i=>has(id,i.id)&&i.id!=='pet'&&!i.id.startsWith('game_'));const pts=pointsOf(id);
  const card=g=>`<button class="gcard" data-act="go" data-to="${g.v}"><span class="ic" style="background:${g.bg||'var(--sun-soft)'}">${g.ic}</span><span class="t"><h2>${esc(g.name)}</h2><span class="muted sub">${esc(g.d)}</span><span class="pill">${g.pill}</span></span></button>`;
  return `${topbar('Hry')}${play.map(card).join('')}
   ${ups.length?`<h2 class="shoph">✨ Tvoje vylepšení</h2><div class="chips">${ups.map(i=>`<button class="chip" data-act="openItem" data-item="${i.id}">${i.icon} ${esc(i.name)}</button>`).join('')}</div>`:''}
   ${lock.length?`<h2 class="shoph">🔒 Další hry k odemčení</h2>${lock.map(g=>{const pr=S.settings.prices[id][g.item];return `<button class="gcard" data-act="lockedItem" data-item="${g.item}" style="opacity:.88"><span class="ic" style="background:var(--line)">${g.ic}</span><span class="t"><h2>${esc(g.name)}</h2><span class="muted sub">${esc(g.d)}</span><span class="pill">${pts>=pr?`✨ Odemkni za ${pr} ⭐`:`🔒 ${pr} ⭐`}</span></span></button>`}).join('')}`:''}
   <p class="note">Za hry je denně nejvýš ${S.settings.gameCap} ⭐. Nejvíc hvězdiček je za úkoly.</p>`}
MAP.games=vGames2;

/* ---- shared helpers ---- */
let X={};
const award=(pts,text,title='Výborně!')=>capAward('game',S.settings.gameCap,pts,text,title,'Výborně!');
function tone(f,d=.28,type='triangle',vol=.17){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const n=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(vol,n+.02);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g).connect(AC.destination);o.start(n);o.stop(n+d+.05)}catch(e){}}
function sizeChips(act,opts,cur,lockItem){return `<div class="chips">${opts.map(([v,l,needs])=>{const lk=needs&&!has(V.kid,needs);return `<button class="chip ${String(cur)===String(v)?'on':''} ${lk?'lock':''}" data-act="${lk?'lockedItem':act}" data-v="${v}" data-item="${needs||''}">${lk?'🔒 ':''}${l}</button>`}).join('')}</div>`}
function overlayIn(sel,html){const o=$(sel);if(!o)return;o.innerHTML=html;o.hidden=false}
function swipeOn(el,cb){let sx,sy;el.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});el.addEventListener('pointerup',e=>{if(sx==null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;cb(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))});el.style.touchAction='none'}
const arrowPad=act=>`<div class="apad"><span></span><button class="ctl" data-act="${act}" data-d="U" aria-label="Nahoru">▲</button><span></span><button class="ctl" data-act="${act}" data-d="L" aria-label="Doleva">◀</button><button class="ctl" data-act="${act}" data-d="D" aria-label="Dolů">▼</button><button class="ctl" data-act="${act}" data-d="R" aria-label="Doprava">▶</button></div>`;
const KEYDIR={ArrowUp:'U',ArrowDown:'D',ArrowLeft:'L',ArrowRight:'R'};

/* ================= PEXESO ================= */
const PEX_E=['🐶','🐱','🦊','🐸','🐵','🦁','🐷','🐰','🐻','🐼','🐨','🐯','🐮','🐔','🦄'];
function vPexeso(){const n=V.pexN||(kidOf(V.kid).little?6:12);V.pexN=n;
  return `${topbar('Pexeso')}${sizeChips('pexN',[[6,'6 kartiček'],[12,'12 kartiček'],[20,'20 kartiček','pexeso_big']],n)}<div class="row" style="justify-content:space-between"><span class="pill" id="pexinfo">Tahy: 0</span><button class="btn ghost" data-act="pexNew">Nová hra</button></div><div id="board" class="pexgrid c${n===6?3:n===12?4:5}"></div>`}
SETUP.pexeso=()=>{const n=V.pexN,e=shuffle([...PEX_E]).slice(0,n/2);X={g:'pexeso',cards:shuffle([...e,...e]).map(x=>({e:x,open:false,done:false})),first:null,lock:false,moves:0,n};drawPex()};
function drawPex(){const b=$('#board');if(!b)return;b.innerHTML=X.cards.map((c,i)=>`<button class="pcard2 ${c.open||c.done?'open':''} ${c.done?'done':''}" data-act="pexFlip" data-i="${i}">${c.open||c.done?c.e:''}</button>`).join('');$('#pexinfo').textContent=`Tahy: ${X.moves}`}
Object.assign(handlers,{pexN:b=>{V.pexN=+b.dataset.v;render()},pexNew:()=>render(),
  pexFlip:b=>{const c=X.cards[+b.dataset.i];if(X.lock||c.open||c.done)return;c.open=true;tone(660,.12);
    if(X.first===null){X.first=+b.dataset.i;drawPex();return}
    const f=X.cards[X.first];X.moves++;X.first=null;drawPex();
    if(f.e===c.e){f.done=c.done=true;f.open=c.open=false;setTimeout(()=>{chime('tick');drawPex();if(X.cards.every(x=>x.done)){sayKid('Výborně! Našla jsi všechny dvojice!');award(X.n===20?3:2,`Pexeso (${X.n})`,`Hotovo za ${X.moves} tahů!`)}},250)}
    else{X.lock=true;setTimeout(()=>{f.open=c.open=false;X.lock=false;drawPex()},850)}}});

/* ================= PUZZLE ================= */
const PUZ_PICS=[['🦄','#FFB3D9','#C9B6FF'],['🐶','#FFE29A','#FFB36B'],['🚀','#1B1F4B','#6F5BFF'],['🌈','#BDE8FF','#FFFFFF'],['🏰','#C9F2E1','#7CC576'],['🐠','#8FD3FF','#2F7DF6']];
function puzPic(i){const[e,a,b]=PUZ_PICS[i],c=document.createElement('canvas');c.width=c.height=300;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,300,300);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,300,300);
  x.globalAlpha=.35;for(let k=0;k<14;k++){x.fillStyle=['#fff','#FFD84D','#FF5C93'][k%3];x.beginPath();x.arc((k*67)%300,(k*113)%300,8+(k%4)*5,0,7);x.fill()}x.globalAlpha=1;
  x.font='190px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,150,165);x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=10;x.strokeRect(5,5,290,290);return c.toDataURL('image/png')}
function photoKey(){return 'bodikov-photo-'+V.kid}
function vPuzzle(){const n=V.puzN||(kidOf(V.kid).little?2:3);V.puzN=n;const pic=V.puzPic??0;let photo=null;try{photo=localStorage.getItem(photoKey())}catch(e){}
  return `${topbar('Puzzle')}${sizeChips('puzN',[[2,'4 dílky'],[3,'9 dílků'],[4,'16 dílků','puzzle_big'],[5,'25 dílků','puzzle_big']],n)}
   <div class="chips">${PUZ_PICS.map((p,i)=>`<button class="chip ${pic===i?'on':''}" data-act="puzPic" data-v="${i}">${p[0]}</button>`).join('')}${photo?`<button class="chip ${pic==='photo'?'on':''}" data-act="puzPic" data-v="photo">📷 Fotka</button>`:''}<label class="chip" for="puzfile">📷 ${photo?'Jiná':'Vlastní'} fotka</label><input type="file" id="puzfile" accept="image/*" hidden></div>
   <div class="row" style="justify-content:space-between"><span class="muted">Ťukni na dva dílky a prohodí se.</span><img id="puzprev" class="puzprev" alt="Předloha"></div><div id="board" class="puzboard"></div>`}
SETUP.puzzle=()=>{const n=V.puzN;let src=null;if(V.puzPic==='photo'){try{src=localStorage.getItem(photoKey())}catch(e){}}if(!src)src=puzPic(typeof V.puzPic==='number'?V.puzPic:0);
  let perm;do{perm=shuffle([...Array(n*n).keys()])}while(perm.every((v,i)=>v===i));X={g:'puzzle',n,src,perm,sel:null,done:false};$('#puzprev').src=src;drawPuz();
  const f=$('#puzfile');if(f)f.addEventListener('change',()=>{const file=f.files[0];if(!file)return;const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=c.height=360;const s=Math.min(img.width,img.height);c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,360,360);
    const url=c.toDataURL('image/jpeg',.82);try{localStorage.setItem(photoKey(),url)}catch(e){}V.puzPic='photo';X.src=url;try{if(!localStorage.getItem(photoKey()))toast('Fotka se nedá uložit, ale teď ji složit můžeš.')}catch(e){};render();if(!(()=>{try{return localStorage.getItem(photoKey())}catch(e){return null}})()){X.src=url;$('#puzprev').src=url;drawPuz()}};img.src=URL.createObjectURL(file)})};
function drawPuz(){const b=$('#board');if(!b)return;const n=X.n;b.style.gridTemplateColumns=`repeat(${n},1fr)`;
  b.innerHTML=X.perm.map((p,i)=>{const r=Math.floor(p/n),c=p%n;return `<button class="ptile ${X.sel===i?'sel':''} ${p===i?'ok':''}" data-act="puzTap" data-i="${i}" style="background-image:url(${X.src});background-size:${n*100}% ${n*100}%;background-position:${n>1?c/(n-1)*100:0}% ${n>1?r/(n-1)*100:0}%"></button>`}).join('')}
Object.assign(handlers,{puzN:b=>{V.puzN=+b.dataset.v;render()},puzPic:b=>{V.puzPic=b.dataset.v==='photo'?'photo':+b.dataset.v;render()},
  puzTap:b=>{if(X.done)return;const i=+b.dataset.i;if(X.sel===null){X.sel=i;tone(520,.1);drawPuz();return}
    if(X.sel!==i){[X.perm[X.sel],X.perm[i]]=[X.perm[i],X.perm[X.sel]];tone(700,.1)}X.sel=null;drawPuz();
    if(X.perm.every((v,k)=>v===k)){X.done=true;$('#board').classList.add('solved');sayKid('Hurá, obrázek je složený!');setTimeout(()=>award(X.n>=4?3:2,`Puzzle (${X.n*X.n} dílků)`,'Složeno!'),400)}}});

/* ================= BUBBLES & FIREWORKS ================= */
function vBubbles(){const m=V.bubMode||'bub';return `${topbar('Bublinky a ohňostroj')}${sizeChips('bubMode',[['bub','🫧 Bublinky'],['fw','🎆 Ohňostroj']],m)}<div class="row" style="justify-content:space-between"><span class="pill" id="gscore">0</span><span class="muted">${m==='bub'?'Ťukej na bubliny!':'Ťukni a vystřel raketu!'}</span></div><div class="gamewrap" id="gwrap"><canvas id="gcv"></canvas></div>`}
SETUP.bubbles=()=>{const W=gameW(),H=Math.max(320,Math.min(innerHeight-260,520)),{cv,x}=setupCanvas(W,H),mode=V.bubMode||'bub';
  const g={alive:true,kind:'bubbles',items:[],parts:[],rockets:[],n:0,awarded:false,last:0,spawn:0};
  const cols=['#FF5C93','#6F5BFF','#FFC22E','#1FBF92','#4FB6FF','#FF8A3D'];
  const burst=(px,py,big)=>{for(let i=0;i<(big?60:14);i++){const a=Math.random()*7,s=(big?150:80)*(.4+Math.random());g.parts.push({x:px,y:py,vx:Math.cos(a)*s,vy:Math.sin(a)*s,c:pick(cols),t:big?1.4:.6,r:big?3:2.5})}};
  const hit=()=>{g.n++;$('#gscore').textContent=g.n;if(g.n>=30&&!g.awarded){g.awarded=true;setTimeout(()=>award(2,mode==='bub'?'Bublinky':'Ohňostroj','Super!'),300)}};
  cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),px=(e.clientX-r.left)*W/r.width,py=(e.clientY-r.top)*H/r.height;
    if(mode==='bub'){for(let i=g.items.length-1;i>=0;i--){const b=g.items[i];if(Math.hypot(b.x-px,b.y-py)<b.r+8){g.items.splice(i,1);burst(b.x,b.y,false);tone(500+Math.random()*500,.15,'sine');hit();return}}}
    else{g.rockets.push({x:W/2+(Math.random()-.5)*60,y:H,tx:px,ty:py,c:pick(cols)});tone(300,.25,'sawtooth',.05)}});
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=Math.min(.05,(t-(g.last||t))/1000);g.last=t;
    const sky=x.createLinearGradient(0,0,0,H);sky.addColorStop(0,mode==='bub'?'#BDE8FF':'#0E1030');sky.addColorStop(1,mode==='bub'?'#F1EEFF':'#2A1F5C');x.fillStyle=sky;x.fillRect(0,0,W,H);
    if(mode==='bub'){g.spawn-=dt;if(g.spawn<=0&&g.items.length<14){g.items.push({x:20+Math.random()*(W-40),y:H+30,r:16+Math.random()*22,s:40+Math.random()*50,w:Math.random()*6,c:pick(cols)});g.spawn=.35}
      g.items.forEach(b=>{b.y-=b.s*dt;b.w+=dt*2;const bx=b.x+Math.sin(b.w)*8;b.dx=bx;x.beginPath();x.arc(bx,b.y,b.r,0,7);x.fillStyle=b.c+'33';x.fill();x.strokeStyle=b.c;x.lineWidth=2.5;x.stroke();x.beginPath();x.arc(bx-b.r*.35,b.y-b.r*.35,b.r*.22,0,7);x.fillStyle='rgba(255,255,255,.8)';x.fill();b.xx=bx});
      g.items.forEach(b=>b.x=b.x);g.items=g.items.filter(b=>b.y>-50)}
    else{g.rockets.forEach(r=>{const dx=r.tx-r.x,dy=r.ty-r.y,d=Math.hypot(dx,dy);if(d<12){r.dead=true;burst(r.tx,r.ty,true);tone(180+Math.random()*120,.5,'square',.06);hit();return}r.x+=dx/d*420*dt;r.y+=dy/d*420*dt;x.fillStyle=r.c;x.beginPath();x.arc(r.x,r.y,4,0,7);x.fill()});g.rockets=g.rockets.filter(r=>!r.dead)}
    g.parts.forEach(p=>{p.t-=dt;p.vy+=(mode==='bub'?0:60)*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;x.globalAlpha=Math.max(0,p.t);x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()});x.globalAlpha=1;g.parts=g.parts.filter(p=>p.t>0);
    g.raf=requestAnimationFrame(loop)};
  GM=g;g.raf=requestAnimationFrame(loop)};
handlers.bubMode=b=>{V.bubMode=b.dataset.v;render()};

/* ================= MUSIC ANIMALS ================= */
const MUS=[['🐶',262,'#FF5C5C'],['🐱',294,'#FF8A3D'],['🐰',330,'#FFC22E'],['🐸',349,'#1FBF92'],['🐵',392,'#4FB6FF'],['🦁',440,'#3D6BFF'],['🐷',494,'#8E6BFF'],['🐤',523,'#FF5C93']];
const SONGS={free:null,hvezda:{name:'Hvězdičko, blýskej se',n:[0,0,4,4,5,5,4,3,3,2,2,1,1,0]},oda:{name:'Óda na radost',n:[2,2,3,4,4,3,2,1,0,0,1,2,2,1,1]}};
function vMusic(){const s=V.song||'free';return `${topbar('Hudební zvířátka')}${sizeChips('song',[['free','🎹 Volně'],['hvezda','⭐ Hvězdičko'],['oda','🎶 Óda na radost']],s)}
  <p class="muted center" id="musinfo">${s==='free'?'Ťukej na zvířátka a hraj!':'Ťukni na zvířátko, které svítí.'}</p><div id="board" class="musgrid">${MUS.map((m,i)=>`<button class="musbtn" data-act="musTap" data-i="${i}" style="--c:${m[2]}">${m[0]}</button>`).join('')}</div>`}
SETUP.music=()=>{X={g:'music',song:SONGS[V.song||'free'],pos:0};musHi()};
function musHi(){document.querySelectorAll('.musbtn').forEach(b=>b.classList.remove('next'));if(!X.song)return;const nx=X.song.n[X.pos];const b=document.querySelector(`.musbtn[data-i="${nx}"]`);if(b)b.classList.add('next');$('#musinfo').textContent=`${X.song.name}: ${X.pos} / ${X.song.n.length}`}
Object.assign(handlers,{song:b=>{V.song=b.dataset.v;render()},
  musTap:b=>{const i=+b.dataset.i;tone(MUS[i][1],.5,'triangle',.22);b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop');
    if(!X.song)return;if(i===X.song.n[X.pos]){X.pos++;if(X.pos>=X.song.n.length){X.pos=0;musHi();setTimeout(()=>award(2,'Hudební zvířátka','Krásná písnička!'),500);return}}musHi()}});

/* ================= MAZE ================= */
const MAZE_N=[5,6,8,10,12,14];
function vMaze(){const lv=V.mazeLv??(kidOf(V.kid).little?0:2);V.mazeLv=lv;return `${topbar('Bludiště')}<div class="row" style="justify-content:space-between"><span class="pill">Level ${lv+1}</span><span class="muted">Doveď myšku k sýru</span></div><div class="gamewrap" id="gwrap" style="background:#fff"><canvas id="gcv"></canvas></div>${arrowPad('mazeMove')}`}
SETUP.maze=()=>{const n=MAZE_N[Math.min(V.mazeLv,MAZE_N.length-1)],W=Math.min(gameW(),360),{cv,x}=setupCanvas(W,W);
  const cells=[...Array(n*n)].map(()=>[1,1,1,1]),seen=new Set([0]),st=[0];
  while(st.length){const c=st[st.length-1],r=Math.floor(c/n),k=c%n,nb=[];if(r>0&&!seen.has(c-n))nb.push([c-n,0,2]);if(k<n-1&&!seen.has(c+1))nb.push([c+1,1,3]);if(r<n-1&&!seen.has(c+n))nb.push([c+n,2,0]);if(k>0&&!seen.has(c-1))nb.push([c-1,3,1]);
    if(!nb.length){st.pop();continue}const[nx,w1,w2]=pick(nb);cells[c][w1]=0;cells[nx][w2]=0;seen.add(nx);st.push(nx)}
  X={g:'maze',n,cells,p:0,x,W,done:false,trail:[0]};swipeOn(cv,d=>mazeMove(d));drawMaze()};
function drawMaze(){const{x,W,n,cells}=X,s=W/n;x.fillStyle='#fff';x.fillRect(0,0,W,W);x.fillStyle='#E8E4FF';X.trail.forEach(c=>x.fillRect((c%n)*s+2,Math.floor(c/n)*s+2,s-4,s-4));
  x.strokeStyle='#2B2350';x.lineWidth=Math.max(2,s/10);x.lineCap='round';x.beginPath();
  cells.forEach((w,c)=>{const X0=(c%n)*s,Y0=Math.floor(c/n)*s;if(w[0]){x.moveTo(X0,Y0);x.lineTo(X0+s,Y0)}if(w[1]){x.moveTo(X0+s,Y0);x.lineTo(X0+s,Y0+s)}if(w[2]){x.moveTo(X0,Y0+s);x.lineTo(X0+s,Y0+s)}if(w[3]){x.moveTo(X0,Y0);x.lineTo(X0,Y0+s)}});x.stroke();
  x.font=`${s*.7}px serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('🧀',(n-.5)*s,(n-.5)*s);x.fillText('🐭',(X.p%n+.5)*s,(Math.floor(X.p/n)+.5)*s)}
function mazeMove(d){if(X.g!=='maze'||X.done)return;const{n,cells}=X,c=X.p,w={U:0,R:1,D:2,L:3}[d];if(cells[c][w]){tone(150,.08,'square',.05);return}
  X.p=c+{U:-n,D:n,L:-1,R:1}[d];X.trail.push(X.p);tone(600,.05);drawMaze();
  if(X.p===n*n-1){X.done=true;sayKid('Myška má sýr!');V.mazeLv=Math.min(V.mazeLv+1,MAZE_N.length-1);capAward('game',S.settings.gameCap,2,'Bludiště','Myška má sýr! 🧀','',()=>render())}}
handlers.mazeMove=b=>mazeMove(b.dataset.d);

/* ================= SPOT THE DIFFERENCE ================= */
const DIFF_TH=[{n:'Les',bg:'linear-gradient(#DFF6E4,#BFE8C6)',e:['🌲','🍄','🦊','🐿️','🌼','🐌','🦔','🌳','🐞','🦉','🐻','🌸']},{n:'Moře',bg:'linear-gradient(#CDEBFF,#7FC4F2)',e:['🐟','🐠','🐙','🦀','🐚','🐳','⚓','🐬','🦈','🐢','🪼','🐡']},{n:'Kuchyně',bg:'linear-gradient(#FFF3D6,#FFE0B8)',e:['🍎','🍌','🍞','🧀','🥕','🍇','🍪','🥛','🍳','🧁','🍓','🥐']}];
function vDiff(){return `${topbar('Hledej rozdíly')}<div class="row" style="justify-content:space-between"><span class="pill" id="diffinfo"></span><button class="btn ghost" data-act="diffNew">Jiný obrázek</button></div>
  <div class="diffpic" id="dA"></div><p class="muted center">Ťukni na rozdíl v dolním obrázku</p><div class="diffpic" id="dB"></div>`}
SETUP.diff=()=>{const th=pick(DIFF_TH),slots=shuffle([...Array(20).keys()]),cnt=kidOf(V.kid).little?3:5;
  const items=slots.slice(0,13).map(s=>({x:8+(s%5)*21+Math.random()*6,y:10+Math.floor(s/5)*22+Math.random()*6,e:pick(th.e),sz:28+Math.random()*14}));
  const B=items.map(o=>({...o})),diffs=[];shuffle([...items.keys()]).slice(0,cnt).forEach((k,j)=>{const t=j%3;
    if(t===0){let e;do{e=pick(th.e)}while(e===items[k].e);B[k].e=e}else if(t===1){B[k].gone=true}else{B[k].flip=true;if(B[k].e==='🍄'||B[k].e==='⚓'){let e;do{e=pick(th.e)}while(e===items[k].e);B[k].e=e;B[k].flip=false}}
    diffs.push({x:items[k].x,y:items[k].y,found:false})});
  X={g:'diff',th,A:items,B,diffs,miss:0,done:false};drawDiff()};
function drawDiff(){const pic=(arr,id)=>{const el=$('#'+id);el.style.background=X.th.bg;el.innerHTML=arr.filter(o=>!o.gone).map(o=>`<span class="dobj" style="left:${o.x}%;top:${o.y}%;font-size:${o.sz}px;${o.flip?'transform:translate(-50%,-50%) scaleX(-1)':''}">${o.e}</span>`).join('')+X.diffs.filter(d=>d.found).map(d=>`<span class="dmark" style="left:${d.x}%;top:${d.y}%"></span>`).join('')};
  pic(X.A,'dA');pic(X.B,'dB');$('#diffinfo').textContent=`Nalezeno ${X.diffs.filter(d=>d.found).length} z ${X.diffs.length}`;
  $('#dB').onclick=e=>{if(X.done)return;const r=e.currentTarget.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*100,py=(e.clientY-r.top)/r.height*100;
    const d=X.diffs.find(d=>!d.found&&Math.hypot((d.x-px)*r.width/100,(d.y-py)*r.height/100)<30);
    if(d){d.found=true;chime('tick');drawDiff();if(X.diffs.every(d=>d.found)){X.done=true;sayKid('Našla jsi všechny rozdíly!');award(2,'Hledej rozdíly','Všechny rozdíly nalezeny!')}}
    else{X.miss++;tone(180,.12,'square',.05);const m=document.createElement('span');m.className='dmiss';m.textContent='✖';m.style.left=px+'%';m.style.top=py+'%';e.currentTarget.appendChild(m);setTimeout(()=>m.remove(),600)}}}
handlers.diffNew=()=>render();

/* ================= PIXEL ART ================= */
const PX_COL={r:'#E0402A',o:'#FF8A3D',y:'#FFC22E',g:'#3DB36B',B:'#3D6BFF',v:'#8E6BFF',p:'#FF8FB1',k:'#2B2350',w:'#FFFFFF',a:'#9AA0B4',s:'#E9D9B8'};
const PX_T=[
  {id:'srdce',name:'Srdíčko',pack:1,g:['..........','.rrr..rrr.','rrrrrrrrrr','rrrrrrrrrr','rrrrrrrrrr','.rrrrrrrr.','..rrrrrr..','...rrrr...','....rr....','..........']},
  {id:'hvezda',name:'Hvězda',pack:1,g:['....yy....','....yy....','...yyyy...','yyyyyyyyyy','.yyyyyyyy.','..yyyyyy..','..yyyyyy..','.yyy..yyy.','.yy....yy.','..........']},
  {id:'houba',name:'Muchomůrka',pack:1,g:['...rrrr...','.rrwrrrrr.','rrrrrrwrrr','rwrrrrrrrr','rrrrwrrrwr','.wwwwwwww.','...ssss...','...ssss...','...ssss...','gggggggggg']},
  {id:'kocka',name:'Kočka',pack:2,g:['.o......o.','.oo....oo.','.oooooooo.','.okooooko.','.oooppooo.','.oooooooo.','..oooooo..','...oooo...','..........','..........']},
  {id:'raketa',name:'Raketa',pack:2,g:['....rr....','...rrrr...','...aaaa...','...aBBa...','...aBBa...','...aaaa...','..raaaar..','.rr.aa.rr.','....yy....','....oo....']},
  {id:'kytka',name:'Kytka',pack:2,g:['...pppp...','..pppppp..','.ppyyyypp.','.ppyyyypp.','..pppppp..','...pppp...','....gg....','.gg.gg....','..gggg....','....gg....']},
  {id:'duha',name:'Duha',pack:2,g:['..........','..rrrrrr..','.roooooor.','royyyyyyor','roy....yor','ro......or','r........r','ww......ww','www....www','..........']}];
function vPixel(){const free=V.pxFree,list=PX_T.filter(t=>t.pack===1||has(V.kid,'pixel_pack2')),t=PX_T.find(x=>x.id===V.pxT)||list[0];V.pxT=t.id;
  return `${topbar('Pixel art')}<div class="chips">${PX_T.map(x=>{const lk=x.pack===2&&!has(V.kid,'pixel_pack2');return `<button class="chip ${!free&&x.id===t.id?'on':''} ${lk?'lock':''}" data-act="${lk?'lockedItem':'pxPick'}" data-v="${x.id}" data-item="pixel_pack2">${lk?'🔒 ':''}${x.name}</button>`}).join('')}<button class="chip ${free?'on':''}" data-act="pxPick" data-v="__free">🎨 Volně</button></div>
   ${free?'':`<div class="row"><span class="muted">Předloha:</span><canvas id="pxprev" width="80" height="80" class="pxprev"></canvas><span class="pill" id="pxinfo">0 %</span></div>`}
   <div id="board" class="pxgrid"></div><div class="swatches" id="pxpal">${Object.entries(PX_COL).map(([k,c])=>`<button class="sw" data-act="pxCol" data-c="${k}" style="background:${c}" aria-label="Barva"></button>`).join('')}<button class="sw pxer" data-act="pxCol" data-c="." aria-label="Guma">🧽</button></div>`}
SETUP.pixel=()=>{const free=V.pxFree,t=PX_T.find(x=>x.id===V.pxT);X={g:'pixel',t:free?null:t,cells:Array(100).fill('.'),col:X.g==='pixel'&&X.col?X.col:(free?'r':t.g.join('').replace(/\./g,'')[0]),done:false,down:false};
  if(!free){const c=$('#pxprev').getContext('2d');t.g.forEach((row,r)=>[...row].forEach((ch,k)=>{c.fillStyle=ch==='.'?'#fff':PX_COL[ch];c.fillRect(k*8,r*8,8,8)}))}
  const b=$('#board');b.innerHTML=X.cells.map((_,i)=>`<i data-i="${i}"></i>`).join('');
  const paint=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);if(!el||el.parentElement!==b||el.dataset.i==null)return;const i=+el.dataset.i;if(X.cells[i]===X.col)return;X.cells[i]=X.col;el.style.background=X.col==='.'?'':PX_COL[X.col];pxCheck()};
  b.addEventListener('pointerdown',e=>{X.down=true;b.setPointerCapture(e.pointerId);paint(e)});b.addEventListener('pointermove',e=>{if(X.down)paint(e)});b.addEventListener('pointerup',()=>X.down=false);b.addEventListener('pointercancel',()=>X.down=false);
  pxSync()};
function pxSync(){document.querySelectorAll('[data-act="pxCol"]').forEach(b=>b.classList.toggle('on',b.dataset.c===X.col))}
function pxCheck(){if(!X.t)return;const tg=X.t.g.join('');let ok=0,need=0;for(let i=0;i<100;i++){if(tg[i]!=='.'){need++;if(X.cells[i]===tg[i])ok++}else if(X.cells[i]!=='.')ok-=1}
  const pct=Math.max(0,Math.round(ok/need*100));$('#pxinfo').textContent=`${pct} %`;
  if(!X.done&&X.cells.join('')===tg){X.done=true;sayKid('Obrázek je hotový!');award(2,`Pixel art: ${X.t.name}`,'Přesně podle předlohy!')}}
Object.assign(handlers,{pxPick:b=>{if(b.dataset.v==='__free')V.pxFree=true;else{V.pxFree=false;V.pxT=b.dataset.v}X.g='';render()},pxCol:b=>{X.col=b.dataset.c;pxSync()}});

/* ================= HANGMAN (balloons) with vyjmenovaná slova ================= */
const VYJ={B:['bydlit','obyvatel','byt','příbytek','nábytek','dobytek','obyčej','bystrý','bylina','kobyla','býk'],L:['slyšet','mlýn','blýskat','polykat','plynout','plýtvat','vzlykat','lysý','lýtko','lýko','lyže','pelyněk','plyš'],
  M:['my','mýt','myslit','mýlit','hmyz','myš','hlemýžď','mýtit','zamykat','smýkat','dmýchat','chmýří'],P:['pýcha','pytel','pysk','netopýr','slepýš','pyl','kopyto','klopýtat','třpytit','zpytovat','pykat','pýr'],
  S:['syn','sytý','sýr','syrový','sychravý','usychat','sýkora','sýček','sysel','syčet','sypat'],V:['vysoký','výt','výskat','zvykat','žvýkat','vydra','výr','vyžle','povyk','výheň'],Z:['brzy','jazyk','nazývat']};
const KBD='AÁBCČDĎEÉĚFGHIÍJKLMNŇOÓPRŘSŠTŤUÚŮVYÝZŽ'.split('');
function vHangman(){return `${topbar('Šibenice s balónky')}<div class="card sec center"><span class="muted" id="hmcat"></span><div id="hmword" class="hmword"></div><div id="hmball" class="hmball"></div></div><div id="board" class="kbd"></div><div id="hmend"></div>`}
SETUP.hangman=()=>{const cat=pick(Object.keys(VYJ)),w=pick(VYJ[cat]).toUpperCase();X={g:'hangman',cat,w,used:[],lives:7,done:false};drawHm()};
function drawHm(){const{w,used}=X;$('#hmcat').textContent=`Vyjmenované slovo po ${X.cat} · ${w.length} písmen`;
  $('#hmword').innerHTML=[...w].map(ch=>`<span>${used.includes(ch)||X.done?ch:''}</span>`).join('');
  $('#hmball').innerHTML=Array.from({length:7},(_,i)=>`<span class="${i<X.lives?'':'pop'}">${i<X.lives?'🎈':'💥'}</span>`).join('');
  $('#board').innerHTML=KBD.map(ch=>`<button class="key ${used.includes(ch)?(w.includes(ch)?'ok':'bad'):''}" data-act="hmKey" data-k="${ch}" ${used.includes(ch)||X.done?'disabled':''}>${ch}</button>`).join('');
  $('#hmend').innerHTML=X.done?`<div class="card sec center"><b>${X.win?'Uhodla jsi!':'Balónky došly.'} Slovo bylo: ${X.w}</b><button class="btn big" data-act="hmNext">Další slovo</button></div>`:''}
Object.assign(handlers,{hmKey:b=>{if(X.done)return;const ch=b.dataset.k;X.used.push(ch);
    if(X.w.includes(ch)){tone(700,.12);if([...X.w].every(c=>X.used.includes(c))){X.done=X.win=true;drawHm();award(2,'Šibenice: '+X.w.toLowerCase(),'Uhodnuto!');return}}
    else{X.lives--;tone(160,.2,'square',.06);if(X.lives<=0){X.done=true;X.win=false}}drawHm()},hmNext:()=>render()});

/* ================= DUEL (multiplication, 2 players, one phone) ================= */
function vDuel(){return `<div class="duel"><div class="dside top" id="dTop"></div><div class="dmid"><button class="round" data-act="back" aria-label="Zpět">${ICON.back}</button><b id="dScore">0 : 0</b><span class="muted">do 7</span></div><div class="dside" id="dBot"></div></div>`}
function duelQ(){const a=2+(Math.random()*9|0),b=2+(Math.random()*9|0),div=Math.random()<.35;const ans=div?a:a*b,q=div?`${a*b} : ${b}`:`${a} · ${b}`;
  const o=new Set([ans]);while(o.size<3){const d=div?ans+pick([-2,-1,1,2]):ans+pick([-b,b,-a,a,-1,1,10]);if(d>0)o.add(d)}return{q,ans,opts:shuffle([...o])}}
SETUP.duel=()=>{X={g:'duel',score:[0,0],lock:[false,false],q:duelQ(),busy:false,done:false};drawDuel()};
function drawDuel(){const nm=[kidOf(V.kid).name,'Soupeř'];['dBot','dTop'].forEach((id,p)=>{$('#'+id).innerHTML=`<span class="dname">${esc(nm[p])} · ${X.score[p]}</span><div class="dq">${X.q.q}</div><div class="dopts">${X.q.opts.map(o=>`<button class="opt" data-act="duelAns" data-p="${p}" data-o="${o}" ${X.lock[p]||X.busy||X.done?'disabled':''}>${o}</button>`).join('')}</div>`});$('#dScore').textContent=`${X.score[0]} : ${X.score[1]}`}
handlers.duelAns=b=>{if(X.busy||X.done)return;const p=+b.dataset.p;if(+b.dataset.o===X.q.ans){X.score[p]++;X.busy=true;tone(880,.15);drawDuel();b.classList.add('ok');
    if(X.score[p]>=7){X.done=true;setTimeout(()=>{award(2,'Souboj v násobilce',p===0?`Vyhrál/a jsi ${X.score[0]} : ${X.score[1]}!`:`Soupeř vyhrál ${X.score[1]} : ${X.score[0]}`);setTimeout(()=>{if(V.name==='duel')render()},50)},500);return}
    setTimeout(()=>{X.q=duelQ();X.lock=[false,false];X.busy=false;drawDuel()},700)}
  else{X.lock[p]=true;tone(160,.15,'square',.05);if(X.lock[0]&&X.lock[1]){X.busy=true;drawDuel();setTimeout(()=>{X.q=duelQ();X.lock=[false,false];X.busy=false;drawDuel()},700)}else drawDuel()}};

/* ================= SNAKE ================= */
function vSnake(){return gameShell('Had',arrowPad('snDir'))}
SETUP.snake=()=>{const N=16,W=Math.min(gameW(),360),s=W/N,{cv,x}=setupCanvas(W,W);
  const g={alive:true,kind:'snake',body:[[8,8],[7,8],[6,8]],dir:'R',next:'R',food:null,apples:0,acc:0,last:0,speed:.16};
  const place=()=>{let f;do{f=[Math.random()*N|0,Math.random()*N|0]}while(g.body.some(b=>b[0]===f[0]&&b[1]===f[1]));g.food=f};place();
  g.turn=d=>{g.go=true;const opp={U:'D',D:'U',L:'R',R:'L'};if(d!==opp[g.dir])g.next=d};
  const draw=()=>{x.fillStyle='#E8F7E4';x.fillRect(0,0,W,W);x.fillStyle='#D8EFD2';for(let i=0;i<N;i++)for(let j=0;j<N;j++)if((i+j)%2)x.fillRect(i*s,j*s,s,s);
    x.font=`${s*.9}px serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('🍎',(g.food[0]+.5)*s,(g.food[1]+.5)*s);
    g.body.forEach((b,i)=>{x.fillStyle=i?'#3DB36B':'#2E8B57';x.beginPath();x.roundRect(b[0]*s+1,b[1]*s+1,s-2,s-2,s/3);x.fill()});
    const h=g.body[0];x.fillStyle='#fff';x.beginPath();x.arc((h[0]+.5)*s,(h[1]+.35)*s,s/6,0,7);x.fill()};
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=Math.min(.1,(t-(g.last||t))/1000);g.last=t;if(g.go)g.acc+=dt;
    if(g.acc>=g.speed){g.acc=0;g.dir=g.next;const h=g.body[0],d={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]}[g.dir],nh=[h[0]+d[0],h[1]+d[1]];
      if(nh[0]<0||nh[1]<0||nh[0]>=N||nh[1]>=N||g.body.some(b=>b[0]===nh[0]&&b[1]===nh[1])){g.alive=false;tone(140,.3,'square',.07);draw();
        const a=g.apples;overlayIn('#gover',`<h2>Konec hry</h2><p class="cstars" style="font-size:2.2rem">${a} 🍎</p><button class="btn" data-act="gameAgain">Znovu</button>`);if(a>=10)award(a>=25?3:2,'Had','Dobrá hra!');else toast('Hvězdičky jsou od 10 jablek. Zkus to znovu!');return}
      g.body.unshift(nh);if(nh[0]===g.food[0]&&nh[1]===g.food[1]){g.apples++;tone(760,.08);place();g.speed=Math.max(.07,g.speed-.004);$('#gscore').textContent=`${g.apples} 🍎`}else g.body.pop()}
    draw();g.raf=requestAnimationFrame(loop)};
  GM=g;$('#gscore').textContent='0 🍎';$('#ghint').textContent='Začni šipkou nebo přejetím prstu';swipeOn(cv,d=>g.turn(d));draw();g.raf=requestAnimationFrame(loop)};
handlers.snDir=b=>{if(GM&&GM.kind==='snake')GM.turn(b.dataset.d)};

/* ================= BREAKOUT ================= */
function vBreakout(){return gameShell('Rozbíječ cihel','<p class="muted center">Táhni prstem pálku. Ťukni pro start.</p>')}
SETUP.breakout=()=>{const W=Math.min(gameW(),360),H=Math.max(380,Math.min(innerHeight-250,560)),{cv,x}=setupCanvas(W,H);
  const cols=7,rows=6,bw=(W-16)/cols,bh=16,pal=['#FF5C5C','#FF8A3D','#FFC22E','#1FBF92','#4FB6FF','#8E6BFF'];
  const g={alive:true,kind:'breakout',px:W/2,pw:W*.22,ball:null,stuck:true,lives:3,broken:0,level:1,last:0,bricks:[]};
  const build=()=>{g.bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)g.bricks.push({x:8+c*bw,y:40+r*(bh+6),c:pal[r]})};build();
  const reset=()=>{g.stuck=true;g.ball={x:g.px,y:H-46,vx:0,vy:0}};reset();
  const launch=()=>{if(!g.stuck)return;const sp=230+g.level*30;g.stuck=false;g.ball.vx=sp*.6*(Math.random()<.5?-1:1);g.ball.vy=-sp*.8};
  const pt=e=>{const r=cv.getBoundingClientRect();g.px=Math.max(g.pw/2,Math.min(W-g.pw/2,(e.clientX-r.left)*W/r.width))};
  cv.addEventListener('pointerdown',e=>{pt(e);launch()});cv.addEventListener('pointermove',e=>pt(e));
  g.key=d=>{if(d==='L')g.px=Math.max(g.pw/2,g.px-30);if(d==='R')g.px=Math.min(W-g.pw/2,g.px+30);if(d==='U')launch()};
  const end=()=>{g.alive=false;const n=g.broken;overlayIn('#gover',`<h2>Konec hry</h2><p class="cstars" style="font-size:2.2rem">${n} cihel</p><button class="btn" data-act="gameAgain">Znovu</button>`);if(n>=20)award(n>=40?3:2,'Rozbíječ cihel','Dobrá hra!');else toast('Hvězdičky jsou od 20 cihel. Zkus to znovu!')};
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=Math.min(.03,(t-(g.last||t))/1000);g.last=t;const b=g.ball,R=7;
    if(g.stuck){b.x=g.px;b.y=H-46}else{b.x+=b.vx*dt;b.y+=b.vy*dt;
      if(b.x<R){b.x=R;b.vx*=-1}if(b.x>W-R){b.x=W-R;b.vx*=-1}if(b.y<R){b.y=R;b.vy*=-1}
      if(b.vy>0&&b.y>H-38-R&&b.y<H-26&&Math.abs(b.x-g.px)<g.pw/2+R){const k=(b.x-g.px)/(g.pw/2),sp=Math.hypot(b.vx,b.vy);b.vx=sp*k*.8;b.vy=-Math.sqrt(Math.max(sp*sp-b.vx*b.vx,sp*sp*.2));tone(440,.06)}
      if(b.y>H+20){g.lives--;tone(150,.3,'square',.06);if(g.lives<=0){end();return}reset()}
      for(const br of g.bricks){if(!br.dead&&b.x>br.x-R&&b.x<br.x+bw-4+R&&b.y>br.y-R&&b.y<br.y+bh+R){br.dead=true;g.broken++;tone(600+Math.random()*300,.06);
        const ox=Math.min(Math.abs(b.x-br.x),Math.abs(b.x-(br.x+bw-4))),oy=Math.min(Math.abs(b.y-br.y),Math.abs(b.y-(br.y+bh)));if(ox<oy)b.vx*=-1;else b.vy*=-1;break}}
      if(g.bricks.every(br=>br.dead)){g.level++;build();reset();toast(`Level ${g.level}!`)}}
    x.fillStyle='#16193A';x.fillRect(0,0,W,H);g.bricks.forEach(br=>{if(br.dead)return;x.fillStyle=br.c;x.beginPath();x.roundRect(br.x,br.y,bw-4,bh,4);x.fill()});
    x.fillStyle='#fff';x.beginPath();x.roundRect(g.px-g.pw/2,H-34,g.pw,10,5);x.fill();x.beginPath();x.arc(b.x,b.y,R,0,7);x.fillStyle='#FFD84D';x.fill();
    x.fillStyle='#fff';x.font='14px sans-serif';x.textAlign='left';x.fillText('❤️'.repeat(g.lives),8,20);
    $('#gscore').textContent=`${g.broken} cihel`;g.raf=requestAnimationFrame(loop)};
  GM=g;$('#ghint').textContent=`Level ${g.level}`;g.raf=requestAnimationFrame(loop)};

/* ================= PARKING ================= */
const PK_LV=[
  {start:[172,400,0],spot:[150,40,46,70],obs:[[96,44,34,62],[214,44,34,62]]},
  {start:[90,400,0],spot:[262,50,46,70],obs:[[206,54,34,62],[20,54,34,62],[120,200,110,30]]},
  {start:[250,400,0],spot:[16,200,72,46],obs:[[16,130,62,34],[16,282,62,34],[150,90,30,90]]},
  {start:[200,420,0],spot:[268,170,50,90],obs:[[276,70,38,80],[276,282,38,80]]},
  {start:[290,410,0],spot:[30,30,46,70],obs:[[120,170,120,40],[92,34,34,62],[30,180,40,40]]}];
const PK_W=340,PK_H=460,PCW=26,PCL=46;
function vParking(){const lv=V.pkLv||0;return `${topbar('Parkování')}<div class="row" style="justify-content:space-between"><span class="pill" id="gscore">Level ${lv+1} / ${PK_LV.length}</span><span class="muted" id="ghint">Zaparkuj do žlutého místa</span></div>
  <div class="gamewrap" id="gwrap"><canvas id="gcv"></canvas><div class="gover" id="gover" hidden></div></div>
  <div class="pkpad"><button class="ctl" data-hold="L" aria-label="Zatočit doleva">⟲</button><button class="ctl" data-hold="R" aria-label="Zatočit doprava">⟳</button><button class="ctl gas" data-hold="F" aria-label="Plyn">▲</button><button class="ctl" data-hold="B" aria-label="Couvat">▼</button></div>`}
SETUP.parking=()=>{const lv=PK_LV[V.pkLv||0],sc=Math.min(gameW(),360)/PK_W,W=PK_W*sc,H=PK_H*sc,{x}=setupCanvas(W,H);
  const g={alive:true,kind:'parking',cx:lv.start[0],cy:lv.start[1],h:lv.start[2],v:0,keys:{},last:0,inT:0,done:false};
  document.querySelectorAll('[data-hold]').forEach(b=>{const k=b.dataset.hold;const on=e=>{e.preventDefault();g.keys[k]=true;b.classList.add('on')},off=()=>{g.keys[k]=false;b.classList.remove('on')};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);b.style.touchAction='none'});
  g.kd=(k,v)=>{g.keys[k]=v};
  const corners=()=>{const s=Math.sin(g.h),c=Math.cos(g.h);return[[-PCW/2,-PCL/2],[PCW/2,-PCL/2],[PCW/2,PCL/2],[-PCW/2,PCL/2]].map(([a,b])=>[g.cx+a*c-b*s,g.cy+a*s+b*c])};
  const inR=(p,r,m=0)=>p[0]>=r[0]-m&&p[0]<=r[0]+r[2]+m&&p[1]>=r[1]-m&&p[1]<=r[1]+r[3]+m;
  const segHit=(r)=>{const cs=corners();if(cs.some(p=>inR(p,r)))return true;const rc=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0]+r[2],r[1]+r[3]],[r[0],r[1]+r[3]]];const s=Math.sin(-g.h),c=Math.cos(-g.h);return rc.some(([px,py])=>{const dx=px-g.cx,dy=py-g.cy,lx=dx*c-dy*s,ly=dx*s+dy*c;return Math.abs(lx)<PCW/2&&Math.abs(ly)<PCL/2})};
  const car=(cx,cy,h,col,w=PCW,l=PCL)=>{x.save();x.translate(cx,cy);x.rotate(h);x.fillStyle=col;x.beginPath();x.roundRect(-w/2,-l/2,w,l,6);x.fill();x.fillStyle='rgba(20,24,60,.7)';x.fillRect(-w/2+4,-l/2+8,w-8,l*.22);x.fillRect(-w/2+4,l/2-l*.24,w-8,l*.14);x.fillStyle='#FFE58A';x.fillRect(-w/2+3,-l/2,5,3);x.fillRect(w/2-8,-l/2,5,3);x.restore()};
  const loop=t=>{if(!g.alive||GM!==g)return;const dt=Math.min(.04,(t-(g.last||t))/1000);g.last=t;const k=g.keys;
    if(!g.done){const tgt=k.F?110:k.B?-70:0;g.v+=(tgt-g.v)*Math.min(1,dt*(tgt?2.2:3.5));const st=(k.L?-1:0)+(k.R?1:0);g.h+=st*g.v/PCL*0.9*dt;
      g.cx+=Math.sin(g.h)*g.v*dt;g.cy-=Math.cos(g.h)*g.v*dt;
      const cs=corners();if(cs.some(p=>p[0]<0||p[1]<0||p[0]>PK_W||p[1]>PK_H)||lv.obs.some(o=>segHit(o))){tone(120,.35,'sawtooth',.08);toast('Bum! Zkus to znovu.');g.cx=lv.start[0];g.cy=lv.start[1];g.h=lv.start[2];g.v=0}
      const sp=lv.spot,vert=sp[3]>sp[2],ang=((g.h%Math.PI)+Math.PI)%Math.PI,okA=vert?Math.min(ang,Math.PI-ang)<.22:Math.abs(ang-Math.PI/2)<.22;
      if(corners().every(p=>inR(p,sp,2))&&okA&&Math.abs(g.v)<12){g.inT+=dt;if(g.inT>.6){g.done=true;tone(880,.2);const n=(V.pkLv||0)+1;
        overlayIn('#gover',`<h2>Zaparkováno! 🅿️</h2><p class="muted" style="color:#fff">Level ${n}</p><button class="btn" data-act="pkNext">${n<PK_LV.length?'Další level':'Znovu od začátku'}</button>`);award(2,`Parkování: level ${n}`,'Perfektně zaparkováno!')}}else g.inT=0}
    x.save();x.scale(sc,sc);x.fillStyle='#5b6075';x.fillRect(0,0,PK_W,PK_H);x.strokeStyle='rgba(255,255,255,.25)';x.setLineDash([10,10]);x.beginPath();x.moveTo(PK_W/2,PK_H);x.lineTo(PK_W/2,PK_H*.55);x.stroke();x.setLineDash([]);
    const sp=lv.spot;x.fillStyle=g.inT>0?'rgba(31,191,146,.5)':'rgba(255,194,46,.25)';x.fillRect(sp[0],sp[1],sp[2],sp[3]);x.strokeStyle='#FFC22E';x.lineWidth=3;x.strokeRect(sp[0],sp[1],sp[2],sp[3]);x.fillStyle='#FFC22E';x.font='bold 18px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('P',sp[0]+sp[2]/2,sp[1]+sp[3]/2);
    lv.obs.forEach((o,i)=>{const w=o[2],h=o[3],isCar=Math.min(w,h)>=30&&Math.min(w,h)<=40&&Math.max(w,h)>=60&&Math.max(w,h)<=85;if(isCar)car(o[0]+w/2,o[1]+h/2,w>h?Math.PI/2:0,['#FF5C5C','#1FBF92','#8E6BFF','#FF8A3D'][i%4],Math.min(w,h),Math.max(w,h));else{x.fillStyle='#7CC576';x.beginPath();x.roundRect(o[0],o[1],w,h,8);x.fill();x.font='18px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🌳',o[0]+w/2,o[1]+h/2)}});
    car(g.cx,g.cy,g.h,'#2F7DF6');x.restore();g.raf=requestAnimationFrame(loop)};
  GM=g;g.raf=requestAnimationFrame(loop)};
handlers.pkNext=()=>{V.pkLv=((V.pkLv||0)+1)%PK_LV.length;render()};
document.addEventListener('keydown',e=>{if(GM&&GM.kind==='parking'){const k={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'F',ArrowDown:'B'}[e.key];if(k){e.preventDefault();GM.kd(k,true)}}});
document.addEventListener('keyup',e=>{if(GM&&GM.kind==='parking'){const k={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'F',ArrowDown:'B'}[e.key];if(k)GM.kd(k,false)}});

/* ================= 2048 ================= */
function v2048(){return `${topbar('2048')}<div class="row" style="justify-content:space-between"><span class="pill" id="g2info">Nejvíc: 2</span><button class="btn ghost" data-act="g2new">Nová hra</button></div><div id="board" class="g2board"></div>${arrowPad('g2move')}`}
SETUP.g2048=()=>{X={g:'g2048',b:Array(16).fill(0),aw:{},over:false};g2add();g2add();drawG2();swipeOn($('#board'),d=>g2move(d))};
function g2add(){const e=X.b.map((v,i)=>v?-1:i).filter(i=>i>=0);if(!e.length)return;X.b[pick(e)]=Math.random()<.9?2:4}
function drawG2(){$('#board').innerHTML=X.b.map(v=>`<div class="g2t v${Math.min(v,4096)}">${v||''}</div>`).join('')+(X.over?'<div class="g2over">Konec hry<br><button class="btn" data-act="g2new">Znovu</button></div>':'');$('#g2info').textContent=`Nejvíc: ${Math.max(...X.b)}`}
function g2move(d){if(X.g!=='g2048'||X.over)return;const lines=[];for(let i=0;i<4;i++){const idx=[0,1,2,3].map(j=>d==='L'?i*4+j:d==='R'?i*4+3-j:d==='U'?j*4+i:(3-j)*4+i);lines.push(idx)}
  let moved=false;lines.forEach(idx=>{const vals=idx.map(k=>X.b[k]).filter(Boolean),out=[];for(let k=0;k<vals.length;k++){if(vals[k]===vals[k+1]){out.push(vals[k]*2);k++}else out.push(vals[k])}while(out.length<4)out.push(0);idx.forEach((k,j)=>{if(X.b[k]!==out[j])moved=true;X.b[k]=out[j]})});
  if(!moved)return;tone(500,.05);g2add();const mx=Math.max(...X.b);
  [[256,2],[512,3],[1024,3]].forEach(([v,p])=>{if(mx>=v&&!X.aw[v]){X.aw[v]=true;award(p,`2048: ${v}`,`Máš ${v}!`)}});
  const can=X.b.some(v=>!v)||X.b.some((v,i)=>(i%4<3&&v===X.b[i+1])||(i<12&&v===X.b[i+4]));if(!can)X.over=true;drawG2()}
Object.assign(handlers,{g2move:b=>g2move(b.dataset.d),g2new:()=>render()});
document.addEventListener('keydown',e=>{const d=KEYDIR[e.key];if(!d)return;if(V.name==='g2048'){e.preventDefault();g2move(d)}if(V.name==='maze'){e.preventDefault();mazeMove(d)}if(GM&&GM.kind==='snake'){e.preventDefault();GM.turn(d)}if(GM&&GM.kind==='breakout'){e.preventDefault();GM.key(d)}});

/* ================= cars: tracks & race car ================= */
const CAR_TH={day:{n:'Den',road:'#5b6075',side:'#6fcf7f',dash:'rgba(255,255,255,.85)'},night:{n:'Noc',item:'cars_night',road:'#15182b',side:'#2a7a4b',dash:'rgba(255,230,120,.7)',dark:true},
  snow:{n:'Sníh',item:'cars_snow',road:'#B9C4D2',side:'#FFFFFF',dash:'rgba(90,110,140,.8)'},desert:{n:'Poušť',item:'cars_desert',road:'#8D7A5C',side:'#E6C27A',dash:'rgba(255,240,200,.85)'}};
function vCars2(){const th=V.carTh||'day',cr=V.carCar||'blue';
  return gameShell('Autíčka',`<div class="ctrls two"><button class="ctl" data-act="car" data-k="-1" aria-label="Doleva">◀</button><button class="ctl" data-act="car" data-k="1" aria-label="Doprava">▶</button></div>
   ${itemsFor(V.kid).some(i=>i.id==='cars_night')||itemsFor(V.kid).some(i=>i.id==='cars_snow')?sizeChips('carTh',Object.entries(CAR_TH).filter(([k,t])=>!t.item||itemsFor(V.kid).some(i=>i.id===t.item)).map(([k,t])=>[k,t.n,t.item]),th):''}
   ${itemsFor(V.kid).some(i=>i.id==='cars_race')?sizeChips('carCar',[['blue','🚙 Modré'],['race','🏎️ Závodní','cars_race']],cr):''}`)}
MAP.cars=vCars2;
Object.assign(handlers,{carTh:b=>{V.carTh=b.dataset.v;render()},carCar:b=>{V.carCar=b.dataset.v;render()}});

/* ================= Bea: doplň i/y ================= */
const I_WORDS=['bílý','bitva','bič','mísa','milý','pila','pivo','lípa','liška','líný','síto','silnice','víla','vidle','zima','zítra','fík','mír','list','pírko','vítr','sirup','bitevní','sílit'];
function makeIyRound(){const out=[],ys=Object.entries(VYJ).flatMap(([c,ws])=>ws.map(w=>[c,w]));const used=new Set();
  while(out.length<10){const y=Math.random()<.6;let w,c;if(y){[c,w]=pick(ys)}else w=pick(I_WORDS);if(used.has(w))continue;used.add(w);
    const m=[...w].findIndex((ch,i)=>i>0&&'yýií'.includes(ch)&&'blmpsvzf'.includes(w[i-1]));if(m<0)continue;const ch=w[m],long='ýí'.includes(ch);
    out.push({svg:'',q:`Doplň: ${w.slice(0,m)}_${w.slice(m+1)}`,opts:long?['ý','í']:['y','i'],ans:ch,tried:[],exp:y?`„${w}“ je vyjmenované slovo po ${c}, proto ${ch}.`:`„${w}“ není vyjmenované slovo, proto píšeme ${ch}.`})}
  return out}
handlers.startIy=()=>{const qs=makeIyRound();L={g:'iyQuiz',title:'Vyjmenovaná slova',i:0,total:qs.length,first:0,qs};L.q=qs[0];go('iyQuiz')};
MAP.iyQuiz=vGeoQuiz;
Object.assign(MAP,{pexeso:vPexeso,puzzle:vPuzzle,bubbles:vBubbles,music:vMusic,maze:vMaze,diff:vDiff,pixel:vPixel,hangman:vHangman,duel:vDuel,snake:vSnake,breakout:vBreakout,parking:vParking,g2048:v2048});
