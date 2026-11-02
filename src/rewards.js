
/* ================= real-world rewards ================= */
const DEFAULT_REWARDS=[
  {id:'r-cteni',title:'Pohádka navíc před spaním',icon:'📖',price:20,for:'all'},
  {id:'r-nanuk',title:'Nanuk nebo zmrzlina',icon:'🍦',price:40,for:'all'},
  {id:'r-vecere',title:'Vybírám večeři',icon:'🍝',price:60,for:'all'},
  {id:'r-tablet',title:'30 minut tabletu navíc',icon:'📱',price:80,for:'all'},
  {id:'r-kino',title:'Výlet do kina',icon:'🎬',price:300,for:'all'}];
const REWARD_ICONS=['📖','🍦','🍝','📱','🎬','🍕','🎮','🛝','🏊','🎨','🧸','🍫','🎁','⭐','🚲','🎡','🦄','🛍️','🍿','🎤'];
const rewardsFor=kid=>Object.values(S.rewards||{}).filter(r=>r.for==='all'||r.for===kid).sort((a,b)=>a.price-b.price);
const pendingClaims=()=>Object.values(S.claims||{}).filter(c=>c.status==='pending').sort((a,b)=>a.ts-b.ts);
function claimsCard(){const pc=pendingClaims();if(!pc.length)return '';
  return `<div class="card sec"><h2>🎁 Odměny k předání</h2>${pc.map(c=>`<div class="prow ap"><span class="ic">${esc(c.icon)}</span><div class="t"><span class="kidtag ${c.kid}">${esc(kidOf(c.kid).name)}</span> <b>${esc(c.title)}</b><br><span class="muted">zaplaceno ${c.price} ⭐</span></div><div class="btns"><button class="mini no" data-act="claimRefund" data-id="${c.id}">Vrátit ⭐</button><button class="mini ok" data-act="claimDone" data-id="${c.id}">Předáno ✓</button></div></div>`).join('')}</div>`}
function parentRewards(){
  const list=Object.values(S.rewards||{}).sort((a,b)=>a.price-b.price);
  const done=Object.values(S.claims||{}).filter(c=>c.status==='done').sort((a,b)=>b.ts-a.ts).slice(0,10);
  return `<form class="card sec" id="rewardform"><h2>Nová odměna</h2>
    <label class="field"><span>Co dostanou</span><input id="rw-title" maxlength="40" placeholder="Např. Výlet na hřiště" required></label>
    <div class="field"><span>Obrázek</span><div class="icons" data-group="rwicon">${REWARD_ICONS.map((ic,i)=>`<button type="button" class="${i===0?'on':''}" data-v="${ic}">${ic}</button>`).join('')}</div></div>
    <label class="field"><span>Cena v hvězdičkách</span><input type="number" id="rw-price" min="1" value="50"></label>
    <div class="field"><span>Pro koho</span><div class="chips" data-group="rwfor">${[['all','Všechny'],['lea','Lea'],['bea','Bea'],['jirka','Jirka']].map(([v,l],i)=>`<button type="button" class="chip ${i===0?'on':''}" data-v="${v}">${l}</button>`).join('')}</div></div>
    <button class="btn big" type="submit">Přidat odměnu</button></form>
  <div class="card sec"><h2>Nabízené odměny</h2>${list.length?list.map(r=>`<div class="prow"><span class="ic">${esc(r.icon)}</span><div class="t"><b>${esc(r.title)}</b><br><span class="muted">${r.price} ⭐ · ${r.for==='all'?'všichni':esc(kidOf(r.for).name)}</span></div><button class="mini no" data-act="delReward" data-id="${r.id}">Smazat</button></div>`).join(''):'<p class="muted">Zatím žádné odměny.</p>'}</div>
  ${done.length?`<div class="card sec"><h2>Naposledy předáno</h2><div class="log">${done.map(c=>`<div><span class="kidtag ${c.kid}">${esc(kidOf(c.kid).name)}</span><span>${esc(c.icon)} ${esc(c.title)}</span><span class="p">${c.price} ⭐</span></div>`).join('')}</div></div>`:''}
  <p class="note">Tip: dražší odměny (kino, výlet) dávají dlouhodobý cíl, levné (pohádka, nanuk) radost hned. Kombinace obojího funguje u ADHD nejlíp.</p>`;
}
function rewardRow(r,kid){const pts=pointsOf(kid),mine=pendingClaims().filter(c=>c.kid===kid&&c.rid===r.id).length;
  return `<article class="item"><div class="head"><span class="ic">${esc(r.icon)}</span><div class="t"><h3>${esc(r.title)}</h3>${mine?`<span class="muted">⏳ Čeká, až ti ji rodiče dají${mine>1?` (${mine}×)`:''}</span>`:''}</div><span class="pill">${r.price} ⭐</span></div>
   ${pts>=r.price?`<button class="btn" data-act="buyReward" data-id="${r.id}">Chci to! (${r.price} ⭐)</button>`:`<div class="bar"><i style="width:${pts/r.price*100}%"></i></div><span class="muted">Chybí ještě ${r.price-pts} ⭐</span>`}</article>`}
function itemCard(i,id){const pts=pointsOf(id),own=has(id,i.id),price=S.settings.prices[id][i.id],blocked=i.needs&&!has(id,i.needs);let act;
  if(own)act=`<button class="btn mint" data-act="openItem" data-item="${i.id}">${i.id==='pet'?'Za mazlíčkem ▶':'Hrát ▶'}</button>`;
  else if(blocked)act=`<span class="state">🔒 Nejdřív odemkni: ${esc(itemById(i.needs).name)}</span>`;
  else if(pts>=price)act=`<button class="btn" data-act="buy" data-item="${i.id}">Odemknout za ${price} ⭐</button>`;
  else act=`<div class="bar"><i style="width:${pts/price*100}%"></i></div><span class="muted">Chybí ještě ${price-pts} ⭐</span>`;
  return `<article class="item ${own?'owned':''}" id="i-${i.id}"><div class="head"><span class="ic">${i.icon}</span><div class="t"><h3>${esc(i.name)}</h3><span class="muted sub">${esc(i.desc)}</span></div>${own?'':`<span class="pill">${price} ⭐</span>`}</div>${act}</article>`}
function vShop2(){const id=V.kid,items=itemsFor(id),rw=rewardsFor(id);
  const sec=(t,arr)=>arr.length?`<h2 class="shoph">${t}</h2>${arr.map(i=>itemCard(i,id)).join('')}`:'';
  const pet=items.filter(i=>i.id==='pet'),games=items.filter(i=>i.id.startsWith('game_')),ups=items.filter(i=>i.id!=='pet'&&!i.id.startsWith('game_'));
  const sortOwn=a=>a.sort((x,y)=>(has(id,x.id)?1:0)-(has(id,y.id)?1:0)||S.settings.prices[id][x.id]-S.settings.prices[id][y.id]);
  return `${topbar('Odměny')}
   ${rw.length?`<h2 class="shoph">🎁 Odměny od rodičů</h2>${rw.map(r=>rewardRow(r,id)).join('')}`:''}
   ${sec('🐣 Mazlíček',pet)}
   <h2 class="shoph">📒 Album samolepek</h2><button class="gcard" data-act="go" data-to="album"><span class="ic" style="background:var(--sun-soft)">🃏</span><span class="t"><h2>Balíček samolepek</h2><span class="muted sub">3 náhodné samolepky do alba</span><span class="pill">${S.settings.stickerPrice} ⭐</span></span></button>
   ${sec('🎮 Hry',sortOwn(games))}${sec('✨ Vylepšení',sortOwn(ups))}`;
}
MAP.shop=vShop2;

/* ================= sticker album ================= */
const SERIES=[
  {id:'zvirata',name:'Zvířátka',items:['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🦄']},
  {id:'more',name:'Moře',items:['🐳','🐬','🐟','🐠','🐡','🦈','🐙','🦀','🦞','🐚','🐢','🧜‍♀️']},
  {id:'vesmir',name:'Vesmír',items:['🚀','🛸','🌍','🌙','⭐','☄️','🪐','🛰️','🌞','🔭','👽','🌌']},
  {id:'sladke',name:'Sladkosti',items:['🍩','🍪','🎂','🍰','🧁','🍫','🍬','🍭','🍦','🍓','🍉','🍒']},
  {id:'auta',name:'Dopravní prostředky',items:['🚗','🚕','🚙','🏎️','🚓','🚑','🚒','🚜','🚌','🚂','✈️','🚁']},
  {id:'priroda',name:'Příroda',items:['🌻','🌷','🌵','🍄','🌳','🍁','🌈','⛄','🌊','🌋','🦋','🐞']}];
const ALL_ST=SERIES.flatMap(s=>s.items.map((e,i)=>({id:`${s.id}_${i}`,e,s:s.id,rare:i>=10})));
const stOf=kid=>kidOf(kid).stickers||{};
const stCount=kid=>ALL_ST.filter(x=>(stOf(kid)[x.id]||0)>0).length;
const dupes=kid=>Object.values(stOf(kid)).reduce((a,n)=>a+Math.max(0,(n||0)-1),0);
function albumTile(id){const n=stCount(id);return `<button class="tile" data-act="go" data-to="album"><span class="ic">📒</span><span class="nm">Album</span><span class="sub muted">${n} / ${ALL_ST.length}</span></button>`}
function drawSticker(){const r=Math.random();const pool=r<.12?ALL_ST.filter(x=>x.rare):ALL_ST.filter(x=>!x.rare);return pick(pool)}
function giveStickers(kid,list){const st={...stOf(kid)};list.forEach(x=>st[x.id]=(st[x.id]||0)+1);put(`kids/${kid}/stickers`,st);
  const done=kidOf(kid).stickerDone||{};let bonus=[];
  SERIES.forEach(s=>{if(!done[s.id]&&s.items.every((_,i)=>(st[`${s.id}_${i}`]||0)>0)){put(`kids/${kid}/stickerDone/${s.id}`,true);addLog(kid,10,'bonus',`📒 Celá série: ${s.name}`,true);bonus.push(s.name)}});
  return bonus}
function showPack(list,bonus){const o=document.createElement('div');o.className='ov';
  o.innerHTML=`<div class="ovbox" role="dialog" aria-modal="true"><h2>Nové samolepky!</h2><div class="pack">${list.map((x,i)=>`<div class="pcard ${x.rare?'rare':''}" style="animation-delay:${i*.25}s"><span>${x.e}</span>${x.rare?'<b>vzácná</b>':''}</div>`).join('')}</div>
   ${bonus.length?`<p class="cstars" style="font-size:1.6rem">+${10*bonus.length} ⭐</p><p class="muted">Dokončila jsi sérii ${esc(bonus.join(', '))}!</p>`:''}<button class="btn big" data-close>Do alba</button></div>`;
  document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target.closest('[data-close]')||e.target===o){o.remove();render()}});confetti();chime();}
function vAlbum(){const id=V.kid,st=stOf(id),pts=pointsOf(id),price=S.settings.stickerPrice,d=dupes(id);
  return `${topbar('Album samolepek')}
  <div class="card sec"><div class="row" style="justify-content:space-between"><b>Máš ${stCount(id)} z ${ALL_ST.length} samolepek</b><span class="pill">${Math.round(stCount(id)/ALL_ST.length*100)} %</span></div><div class="bar"><i style="width:${stCount(id)/ALL_ST.length*100}%"></i></div>
   <div class="row"><button class="btn" data-act="buyPack" ${pts<price?'disabled':''}>Koupit balíček (${price} ⭐)</button>${d>=3?`<button class="btn ghost" data-act="swapDupes">Vyměnit 3 dvojčata 🔄</button>`:''}</div>
   <span class="muted">Za každou celou sérii dostaneš bonus +10 ⭐. Zlaté samolepky jsou vzácné.${d?` Dvojčat máš ${d}.`:''}</span></div>
  ${SERIES.map(s=>{const got=s.items.filter((_,i)=>st[`${s.id}_${i}`]).length;return `<div class="card sec"><div class="row" style="justify-content:space-between"><h3>${esc(s.name)}</h3><span class="pill">${got}/${s.items.length}${got===s.items.length?' ✅':''}</span></div>
    <div class="stgrid">${s.items.map((e,i)=>{const n=st[`${s.id}_${i}`]||0;return `<div class="stc ${n?'':'miss'} ${i>=10?'rare':''}">${n?e:'?'}${n>1?`<i>${n}</i>`:''}</div>`}).join('')}</div></div>`}).join('')}`;
}
MAP.album=vAlbum;
Object.assign(handlers,{
  buyPack:()=>{const id=V.kid,price=S.settings.stickerPrice;if(pointsOf(id)<price)return;addLog(id,-price,'unlock','Balíček samolepek',true);const list=[drawSticker(),drawSticker(),drawSticker()];const bonus=giveStickers(id,list);showPack(list,bonus)},
  swapDupes:()=>{const id=V.kid,st={...stOf(id)};if(dupes(id)<3)return;let need=3;
    for(const k of Object.keys(st).sort((a,b)=>st[b]-st[a])){while(need&&st[k]>1){st[k]--;need--}}
    put(`kids/${id}/stickers`,st);const miss=ALL_ST.filter(x=>!(st[x.id]>0));const x=miss.length?pick(miss):drawSticker();const bonus=giveStickers(id,[x]);showPack([x],bonus)},
  buyReward:b=>{const id=V.kid,r=S.rewards[b.dataset.id];if(!r||pointsOf(id)<r.price)return;
    const o=document.createElement('div');o.className='ov';
    o.innerHTML=`<div class="ovbox" role="dialog" aria-modal="true"><span style="font-size:4rem">${esc(r.icon)}</span><h2>${esc(r.title)}</h2><p class="muted">Vyměnit za ${r.price} ⭐? Rodiče ti odměnu pak dají.</p><div class="row" style="justify-content:center"><button class="btn ghost" data-no>Ještě ne</button><button class="btn big" data-yes>Ano!</button></div></div>`;
    document.body.appendChild(o);
    o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-no]')){o.remove();return}
      if(e.target.closest('[data-yes]')){o.remove();if(pointsOf(id)<r.price)return;const cid='c'+Date.now().toString(36)+uid();
        addLog(id,-r.price,'reward',r.title,true);put(`claims/${cid}`,{id:cid,kid:id,rid:r.id,title:r.title,icon:r.icon,price:r.price,ts:Date.now(),status:'pending'});render();
        celebrate({title:'Odměna je tvoje!',sub:`${r.title}. Rodiče ji uvidí v aplikaci a dají ti ji.`,speak:'Hurá, odměna! Řekni rodičům.'})}})},
  claimDone:b=>{const c=S.claims[b.dataset.id];if(!c)return;put(`claims/${c.id}`,{...c,status:'done',doneTs:Date.now()});chime('tick');toast('Odměna předána');render()},
  claimRefund:b=>{const c=S.claims[b.dataset.id];if(!c)return;if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Opravdu vrátit?';return}
    addLog(c.kid,c.price,'bonus',`Vrácené hvězdičky: ${c.title}`);put(`claims/${c.id}`,{...c,status:'refunded'});toast(`${kidOf(c.kid).name} dostane ${c.price} ⭐ zpět`);render()},
  delReward:b=>{if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Opravdu?';return}put(`rewards/${b.dataset.id}`,null);render()}
});
document.addEventListener('submit',e=>{if(e.target.id!=='rewardform')return;e.preventDefault();
  const title=$('#rw-title').value.trim(),price=Math.max(1,parseInt($('#rw-price').value||'0',10));if(!title){toast('Napište, co dostanou');return}
  const icon=(document.querySelector('[data-group="rwicon"] .on')||{}).dataset?.v||'🎁',f=(document.querySelector('[data-group="rwfor"] .on')||{}).dataset?.v||'all';
  const id='r'+Date.now().toString(36)+uid();put(`rewards/${id}`,{id,title,icon,price,for:f});toast(`Odměna přidána: ${title}`);render()});

document.addEventListener('change',e=>{if(e.target.id!=='restorefile')return;const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=()=>{let d;try{d=JSON.parse(r.result)}catch(x){toast('Tohle není soubor se zálohou');return}
    if(!d||d.app!=='bodikov'||!d.state){toast('Tohle není záloha Bodíkova');return}
    if(!confirm(`Obnovit zálohu ze dne ${String(d.saved||'').slice(0,10)}? Současná data${SYNC?' na všech telefonech':''} se přepíšou.`))return;
    S=normalize(clone(d.state));saveLocal();if(DB)DB.set(clone(S));stack.length=0;V=rootView();render();toast('Záloha obnovena')};r.readAsText(f)});
