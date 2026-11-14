
/* ================= Lea: English words by ear (listen → pick a picture) ================= */
const EN_WORDS={
  zvirata:{ic:'🐶',w:[['🐶','dog','pes'],['🐱','cat','kočka'],['🐟','fish','ryba'],['🐦','bird','ptáček'],['🐴','horse','koník'],['🐮','cow','kravička'],['🐷','pig','prasátko'],['🦆','duck','kachnička'],['🐰','rabbit','zajíček'],['🐻','bear','medvěd'],['🐵','monkey','opička'],['🦁','lion','lev']]},
  jidlo:{ic:'🍎',w:[['🍎','apple','jablko'],['🍌','banana','banán'],['🥛','milk','mléko'],['🎂','cake','dort'],['🥚','egg','vajíčko'],['🍞','bread','chleba'],['🧀','cheese','sýr'],['🍓','strawberry','jahoda'],['🍦','ice cream','zmrzlina'],['🍕','pizza','pizza'],['💧','water','voda'],['🥕','carrot','mrkev']]},
  veci:{ic:'⚽',w:[['⚽','ball','míč'],['🚗','car','auto'],['🏠','house','domeček'],['📖','book','knížka'],['🧸','teddy bear','plyšový medvídek'],['👟','shoe','bota'],['🎩','hat','klobouk'],['☀️','sun','sluníčko'],['🌸','flower','kytička'],['🌳','tree','strom'],['⭐','star','hvězdička'],['🚲','bike','kolo']]},
  barvy:{ic:'🎨',w:[['🔴','red','červená'],['🔵','blue','modrá'],['🟡','yellow','žlutá'],['🟢','green','zelená'],['🟠','orange','oranžová'],['🟣','purple','fialová'],['⚫','black','černá'],['⚪','white','bílá'],['🩷','pink','růžová'],['🟤','brown','hnědá']]},
  cisla:{ic:'🔢',w:[['1️⃣','one','jedna'],['2️⃣','two','dvě'],['3️⃣','three','tři'],['4️⃣','four','čtyři'],['5️⃣','five','pět'],['6️⃣','six','šest'],['7️⃣','seven','sedm'],['8️⃣','eight','osm'],['9️⃣','nine','devět'],['🔟','ten','deset']]},
  telo:{ic:'👀',w:[['👀','eyes','oči'],['👃','nose','nos'],['👄','mouth','pusa'],['👂','ear','ucho'],['✋','hand','ruka'],['🦶','foot','noha'],['🦷','tooth','zub'],['💇','hair','vlasy']]}
};
const EN_CATS=[['vse','🌈'],...Object.entries(EN_WORDS).map(([k,v])=>[k,v.ic])];
function enPool(cat){return cat&&EN_WORDS[cat]?EN_WORDS[cat].w:Object.values(EN_WORDS).flatMap(c=>c.w)}
function makeEnRound(cat){const pool=enPool(cat),used=shuffle([...pool]).slice(0,ROUND_LEA);
  return used.map(w=>{const others=shuffle(pool.filter(x=>x[1]!==w[1])).slice(0,2);return{w,opts:shuffle([w,...others]),bad:[],wrong:false,locked:false}})}
function enSpeakQ(){if(!L||L.g!=='learnEn')return;const q=L.qs[L.i];if(q)sayEnText(q.w[1])}
function vLearnEn(){const q=L.qs[L.i];
  return `${topbar('Anglická slovíčka')}${progressDots()}
   <div class="chips encats">${EN_CATS.map(([k,ic])=>`<button class="chip ${L.cat===k||(!L.cat&&k==='vse')?'on':''}" data-act="enCat" data-v="${k}" aria-label="Skupina slovíček">${ic}</button>`).join('')}</div>
   <button class="enplay" data-act="enPlay" aria-label="Přehrát slovíčko">🔊</button>
   <p class="muted center">Poslouchej a ťukni na správný obrázek.</p>
   <div class="enopts">${q.opts.map((o,i)=>`<button class="enpic ${q.bad.includes(i)?'bad':''} ${q.locked&&o[1]===q.w[1]?'ok':''}" data-act="enAns" data-i="${i}" aria-label="Obrázek">${o[0]}</button>`).join('')}</div>`}
SETUP.learnEn=()=>{if(L&&L.g==='learnEn'&&!L.qs[L.i].said){L.qs[L.i].said=true;setTimeout(enSpeakQ,350)}};
MAP.learnEn=vLearnEn;
Object.assign(handlers,{
  startLeaEn:()=>{L={g:'learnEn',i:0,total:ROUND_LEA,first:0,cat:'vse',qs:makeEnRound()};go('learnEn')},
  enPlay:()=>enSpeakQ(),
  enCat:b=>{const c=b.dataset.v;L.cat=c;L.qs=makeEnRound(c==='vse'?null:c);L.i=0;L.first=0;render()},
  enAns:b=>{const q=L.qs[L.i];if(q.locked)return;clearTimeout(L.tmr);const o=q.opts[+b.dataset.i];
    if(o[1]===q.w[1]){q.locked=true;if(!q.wrong)L.first++;chime('tick');render();sayEnText(o[1]);setTimeout(()=>say(pick(['Správně!','Výborně!','Super!','Jo!'])+` To je ${o[2]}.`),1100);setTimeout(learnNext,2900)}
    else{q.wrong=true;q.bad.push(+b.dataset.i);chime('no');render();say(`To je ${o[2]}. Poslouchej znovu.`);L.tmr=setTimeout(enSpeakQ,1900)}}
});
