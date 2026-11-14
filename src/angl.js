
/* ================= Bea: course "Angličtina – have / have got" ================= */
// subjects: en, 3rd person singular?, cz subject, cz verb index (0 já,1 ty,2 on/ona/ono,3 my,4 oni), pronoun for short answer, lowercase form inside a question
const ENS=[['I',0,'Já',0,'I','I'],['You',0,'Ty',1,'I','you'],['He',1,'On',2,'he','he'],['She',1,'Ona',2,'she','she'],['It',1,'Ono',2,'it','it'],['We',0,'My',3,'we','we'],['They',0,'Oni',4,'they','they'],
  ['Tom',1,'Tom',2,'he','Tom'],['Anna',1,'Anna',2,'she','Anna'],['My mum',1,'Moje máma',2,'she','your mum'],['My dad',1,'Můj táta',2,'he','your dad'],['The dog',1,'Pes',2,'it','the dog'],['Tom and Anna',0,'Tom a Anna',4,'they','Tom and Anna']];
const ENO=[['a dog','psa'],['a cat','kočku'],['a bike','kolo'],['a sister','sestru'],['a brother','bratra'],['blue eyes','modré oči'],['long hair','dlouhé vlasy'],['a new phone','nový telefon'],['two rabbits','dva králíky'],['a big house','velký dům'],['a red pencil','červenou pastelku'],['a cold','rýmu'],['a ball','míč'],['a computer','počítač']];
const CZ_MAM=['mám','máš','má','máme','mají'],CZ_NEMAM=['nemám','nemáš','nemá','nemáme','nemají'];
const enS=()=>pick(ENS),enO=()=>pick(ENO);
const hv=s=>s[1]?'has':'have';
const shortS=s=>s[0]+(s[1]?"'s":"'ve");
const qS=s=>s[5];                     // subject inside a question (lowercase pronoun)
const ansP=s=>s[4];                   // pronoun in a short answer
const ansV=s=>ansP(s)==='I'?0:(['he','she','it'].includes(ansP(s))?1:0);
const cap=t=>t[0].toUpperCase()+t.slice(1);
const Q=(q,ans,wrong,exp)=>({svg:'',q,opts:shuffle([ans,...[...new Set(wrong)].filter(w=>w!==ans).slice(0,2)]),ans,exp});
const ENP=ENS.slice(0,9);const enP=()=>pick(ENP);
const qL=s=>s[0]==='I'||/^(Tom|Anna)/.test(s[0])?s[0]:s[0].toLowerCase();
const fixOpts=o=>{if(!o.opts.includes(o.ans))o.opts[0]=o.ans;o.opts=shuffle([...new Set(o.opts)]);return o};
const R=f=>()=>fixOpts(f());
const EN_SAY=t=>`<button class="ensay" data-act="sayEn" data-t="${esc(t)}" aria-label="Přečíst anglicky">🔊</button>`;
const ftable=rows=>`<table class="ftable">${rows.map(r=>`<tr>${r.map((c,i)=>`<td>${i===1?`<b>${c}</b> ${EN_SAY(c.replace(/<[^>]+>/g,''))}`:c}</td>`).join('')}</tr>`).join('')}</table>`;
const mnem=(ic,t,x)=>`<div class="mnem"><span class="mi">${ic}</span><div><b>${t}</b><br>${x}</div></div>`;

const EN_TOPICS=[
 {id:'kladne',icon:'✅',name:'Have got – mám',
  lesson:()=>`<p><b>have got</b> = <b>mít</b> (vlastnit, mít rodinu, mít vzhled, mít nemoc). <b>got</b> se nepřekládá!</p>
   ${ftable([['já mám','I have got'],['ty máš','you have got'],['on má','he <u>has</u> got'],['ona má','she <u>has</u> got'],['ono má','it <u>has</u> got'],['my máme','we have got'],['vy máte','you have got'],['oni mají','they have got']])}
   ${mnem('🐍','Had syčí jen na tři: HE, SHE, IT','<b>has</b> končí na <b>s</b> jako had: ssss. Syčí jen na <b>on, ona, ono</b> (a taky na Toma, mámu, psa – na jednoho člověka nebo věc). Všichni ostatní mají <b>have</b>.')}
   ${mnem('👤','GOT je stín','<b>got</b> chodí za have/has jako stín, ale nic neznamená. <i>I have got a dog</i> = Mám psa.')}
   ${mnem('🎵','Básnička (říkej nahlas, tleskej)','I have got, you have got, <b>he has got, she has got, it has got</b>, we have got, they have got! 👏')}
   <p class="muted">Příklady: <i>I have got a cat.</i> ${EN_SAY('I have got a cat.')} <i>She has got blue eyes.</i> ${EN_SAY('She has got blue eyes.')}</p>`,
  gen:[
   R(()=>{const s=enS(),o=enO();return Q(`Doplň: ${s[0]} ___ got ${o[0]}.`,hv(s),['have','has'],`${s[0]} → ${hv(s)}. ${s[1]?'On/ona/ono (jedna osoba či věc) = has 🐍.':'Has je jen pro he, she, it.'}`)}),
   R(()=>{const s=enS(),o=enO();return Q(`Doplň: ${s[0]} ___ ${o[0]}.`,`${hv(s)} got`,[`${s[1]?'have':'has'} got`,'is got'],`${s[0]} ${hv(s)} got ${o[0]}.`)}),
   R(()=>{const s=enS(),o=enO();return Q(`Přelož: ${s[2]} ${CZ_MAM[s[3]]} ${o[1]}.`,`${s[0]} ${hv(s)} got ${o[0]}.`,[`${s[0]} ${s[1]?'have':'has'} got ${o[0]}.`,`${s[0]} is got ${o[0]}.`],`${s[2]} ${CZ_MAM[s[3]]} = ${s[0]} ${hv(s)} got.`)}),
   R(()=>{const o=enO(),he=pick(ENS.filter(s=>s[1])),no=shuffle(ENS.filter(s=>!s[1])).slice(0,2);return Q(`Kdo se hodí? ___ has got ${o[0]}.`,he[0],no.map(x=>x[0]),`Has patří k he, she, it – tedy ${he[0]}.`)}),
   R(()=>{const o=enO(),no=pick(ENS.filter(s=>!s[1])),he=shuffle(ENS.filter(s=>s[1])).slice(0,2);return Q(`Kdo se hodí? ___ have got ${o[0]}.`,no[0],he.map(x=>x[0]),`Have patří k I, you, we, they.`)}),
   ()=>Q('Kdy píšeme HAS?','u he, she, it (jeden člověk nebo věc)',['u I a you','u we a they'],'Had syčí jen na tři: he, she, it 🐍.'),
   ()=>Q('Jak přeložíš „got“ ve větě I have got a dog?','nepřekládá se',['dostal','jsem'],'Got je jen stín, have got = mít.'),
   ()=>Q('Co znamená „She has got long hair“?','Ona má dlouhé vlasy.',['Ona dostala dlouhé vlasy.','Ona nemá dlouhé vlasy.'],'has got = má.')]},
 {id:'zkratky',icon:'✂️',name:'Zkratky \'ve a \'s',
  lesson:()=>`<p>V mluvené angličtině se have/has zkracuje. Apostrof <b>'</b> je jako <b>gumička</b> ✂️, která schovala písmenka.</p>
   ${ftable([["I have got","I've got"],["you have got","you've got"],["he has got","he's got"],["she has got","she's got"],["it has got","it's got"],["we have got","we've got"],["they have got","they've got"]])}
   ${mnem('🐍','\'s = has (had zase syčí)','<b>he\'s got, she\'s got, it\'s got</b>. Pozor: <i>she\'s</i> může být i <i>she is</i>. Když je za tím <b>got</b>, je to vždycky <b>has</b>!')}
   ${mnem('✌️','\'ve = have','I\'ve, you\'ve, we\'ve, they\'ve – „ve“ jsou poslední dvě písmenka slova ha<b>ve</b>.')}`,
  gen:[
   R(()=>{const s=enP(),o=enO();return Q(`Zkrať: ${s[0]} ${hv(s)} got ${o[0]}.`,`${shortS(s)} got ${o[0]}.`,[`${s[0]}${s[1]?"'ve":"'s"} got ${o[0]}.`,`${s[0]}'got ${o[0]}.`],`${hv(s)} → ${s[1]?"'s":"'ve"}.`)}),
   R(()=>{const s=enP(),o=enO();return Q(`Rozepiš: ${shortS(s)} got ${o[0]}.`,`${s[0]} ${hv(s)} got ${o[0]}.`,[`${s[0]} ${s[1]?'is':'has'} got ${o[0]}.`,`${s[0]} ${s[1]?'have':'is'} got ${o[0]}.`],`${s[1]?"'s před got = has":"'ve = have"}.`)}),
   ()=>Q("Co znamená 's ve větě She's got a cat?",'has',['is','was'],"Když následuje got, 's = has."),
   ()=>Q("Co znamená 've ve větě We've got a dog?",'have',['are','very'],"'ve = have."),
   ()=>Q("Co znamená 's ve větě She's my sister?",'is',['has','got'],"Tady není got, takže 's = is (ona je moje sestra)."),
   R(()=>{const s=pick(ENS.filter(x=>x[0].split(' ').length===1)),pron=s[0];return Q(`Jak se správně zkrátí „${pron} ${hv(s)}“ (před got)?`,shortS(s),[pron+(s[1]?"'ve":"'s"),pron+"'h"],`${pron} ${hv(s)} → ${shortS(s)}.`)})]},
 {id:'zapor',icon:'🚫',name:'Zápor: haven\'t got / hasn\'t got',
  lesson:()=>`<p>Zápor: mezi have/has a got vložíme <b>not</b>. Zkráceně <b>haven't</b> / <b>hasn't</b>.</p>
   ${ftable([['já nemám',"I haven't got"],['ty nemáš',"you haven't got"],['on nemá',"he hasn't got"],['ona nemá',"she hasn't got"],['ono nemá',"it hasn't got"],['my nemáme',"we haven't got"],['oni nemají',"they haven't got"]])}
   ${mnem('🥪','Sendvič: have – NOT – got','Have je spodní chleba, <b>NOT je šunka</b> uprostřed, got horní chleba: <b>have + not + got</b> → haven\'t got. Šunka nikdy nespadne na konec!')}
   ${mnem('🐍','Had syčí i v záporu','he/she/it → <b>hasn\'t</b> got. Ostatní → haven\'t got.')}
   ${mnem('⛔','Nikdy „don\'t got“','<i>I don\'t got</i> je špatně. S got jde jen haven\'t / hasn\'t.')}
   <p class="muted"><i>I haven't got a sister.</i> ${EN_SAY("I haven't got a sister.")} <i>He hasn't got a bike.</i> ${EN_SAY("He hasn't got a bike.")}</p>`,
  gen:[
   R(()=>{const s=enS(),o=enO();return Q(`Zápor: ${s[0]} ___ got ${o[0]}.`,s[1]?"hasn't":"haven't",["haven't","hasn't","don't"],`${s[0]} → ${s[1]?"hasn't":"haven't"} got.`)}),
   R(()=>{const s=enS(),o=enO(),h=hv(s);return Q(`Udělej zápor: ${s[0]} ${h} got ${o[0]}.`,`${s[0]} ${h}n't got ${o[0]}.`,[`${s[0]} ${s[1]?'have':'has'}n't got ${o[0]}.`,`${s[0]} ${h} got not ${o[0]}.`,`${s[0]} don't got ${o[0]}.`].slice(0,2),'Sendvič: have/has + not + got 🥪.')}),
   R(()=>{const s=enS(),o=enO();return Q(`Přelož: ${s[2]} ${CZ_NEMAM[s[3]]} ${o[1]}.`,`${s[0]} ${hv(s)}n't got ${o[0]}.`,[`${s[0]} ${s[1]?'have':'has'}n't got ${o[0]}.`,`${s[0]} don't got ${o[0]}.`],`${s[2]} ${CZ_NEMAM[s[3]]} = ${s[0]} ${hv(s)}n't got.`)}),
   ()=>Q("Co je haven't celým slovem?",'have not',['has not','do not'],"haven't = have not."),
   ()=>Q("Co je hasn't celým slovem?",'has not',['have not','is not'],"hasn't = has not."),
   ()=>Q('Kam patří NOT ve větě s have got?','mezi have a got',['na konec věty','před have'],'Sendvič: have – NOT – got 🥪.'),
   R(()=>{const s=enS(),o=enO();return Q(`Co znamená: ${s[0]} ${hv(s)}n't got ${o[0]}.`,`${s[2]} ${CZ_NEMAM[s[3]]} ${o[1]}.`,[`${s[2]} ${CZ_MAM[s[3]]} ${o[1]}.`,`${s[2]} ${['chci','chceš','chce','chceme','chtějí'][s[3]]} ${o[1]}.`],`${hv(s)}n't got = ${CZ_NEMAM[s[3]]}.`)})]},
 {id:'otazky',icon:'❓',name:'Otázka: Have you got…?',
  lesson:()=>`<p>V otázce <b>have/has skočí dopředu</b> před osobu. <b>got</b> zůstane na svém místě.</p>
   ${ftable([['Mám…?','Have I got…?'],['Máš…?','Have you got…?'],['Má (on)…?','Has he got…?'],['Má (ona)…?','Has she got…?'],['Má (to)…?','Has it got…?'],['Máme…?','Have we got…?'],['Mají…?','Have they got…?']])}
   ${mnem('🐸','Žabka skáče dopředu','<i>You have got a dog.</i> → žabka <b>have</b> skočí dopředu → <b>Have you got a dog?</b> Got je líný a zůstane sedět.')}
   ${mnem('🐍','Has skáče taky','<i>She has got a cat.</i> → <b>Has she got a cat?</b>')}
   <p class="muted"><i>Have you got a pet?</i> ${EN_SAY('Have you got a pet?')} <i>Has Tom got a bike?</i> ${EN_SAY('Has Tom got a bike?')}</p>`,
  gen:[
   R(()=>{const s=enS(),o=enO();return Q(`Otázka: ___ ${qS(s)} got ${o[0]}?`,cap(hv(s)),['Have','Has','Do'],`${qS(s)} → ${cap(hv(s))}.`)}),
   R(()=>{const s=enS(),o=enO(),H=cap(hv(s));return Q(`Která otázka je správně?`,`${H} ${qS(s)} got ${o[0]}?`,[`${s[0]} ${hv(s)} got ${o[0]}?`,`${H} got ${qS(s)} ${o[0]}?`],'Have/has skočí dopředu, got zůstane za osobou 🐸.')}),
   R(()=>{const pairs=[['Máš','You','you',0],['Má Tom','Tom','Tom',1],['Má Anna','Anna','Anna',1],['Mají','They','they',0],['Má tvoje máma','your mum','your mum',1],['Má tvůj táta','your dad','your dad',1]],p=pick(pairs),o=enO(),H=p[3]?'Has':'Have';
     return Q(`Přelož: ${p[0]} ${o[1]}?`,`${H} ${p[2]} got ${o[0]}?`,[`${p[3]?'Have':'Has'} ${p[2]} got ${o[0]}?`,`Do ${p[2]} got ${o[0]}?`],`${p[0]}…? = ${H} ${p[2]} got…?`)}),
   R(()=>{const s=enS(),o=enO();return Q(`Udělej otázku: ${s[0]} ${hv(s)} got ${o[0]}.`,`${cap(hv(s))} ${qL(s)} got ${o[0]}?`,[`${s[0]} got ${hv(s)} ${o[0]}?`,`Do ${qL(s)} have got ${o[0]}?`],'Žabka have/has skočí dopředu 🐸.')}),
   ()=>Q('Co se v otázce stane s got?','zůstane za osobou',['skočí dopředu','zmizí'],'Got je líný a zůstane sedět 🐸.'),
   ()=>Q('Jak začíná otázka „Má Anna psa?“','Has Anna got…',['Have Anna got…','Does Anna got…'],'Anna = ona → Has.')]},
 {id:'odpovedi',icon:'💬',name:'Krátké odpovědi',
  lesson:()=>`<p>Na otázku Have/Has…got? odpovídáme krátce: <b>Yes, … have/has.</b> nebo <b>No, … haven't/hasn't.</b></p>
   ${ftable([['Have you got a dog?','Yes, I have. / No, I haven\'t.'],['Has she got a cat?','Yes, she has. / No, she hasn\'t.'],['Has Tom got a bike?','Yes, he has. / No, he hasn\'t.'],['Have they got a car?','Yes, they have. / No, they haven\'t.']])}
   ${mnem('🏠','Got zůstává doma','V krátké odpovědi <b>nikdy není got</b>. Správně: <i>Yes, I have.</i> Špatně: <i>Yes, I have got.</i>')}
   ${mnem('🔁','Ptáš se „you“ → odpovídám „I“','Have <b>you</b> got…? → Yes, <b>I</b> have. A pozor, jméno se mění na he/she: Has Tom got…? → Yes, <b>he</b> has.')}`,
  gen:[
   R(()=>{const s=pick(ENS.filter(x=>x[0]!=='I')),o=enO(),H=s[0]==='You'?'Have':cap(hv(s)),a=ansP(s),v=a==='I'||!['he','she','it'].includes(a)?'have':'has';
     return Q(`${H} ${qS(s)} got ${o[0]}? – Yes, ${a} ___.`,v,['have','has',`${v} got`],`Yes, ${a} ${v}. Got zůstává doma 🏠.`)}),
   R(()=>{const s=pick(ENS.filter(x=>x[0]!=='I')),o=enO(),H=s[0]==='You'?'Have':cap(hv(s)),a=ansP(s),v=a==='I'||!['he','she','it'].includes(a)?"haven't":"hasn't";
     return Q(`${H} ${qS(s)} got ${o[0]}? – No, ${a} ___.`,v,["haven't","hasn't",`${v} got`],`No, ${a} ${v}.`)}),
   R(()=>{const s=pick(ENS.filter(x=>x[0]!=='I')),o=enO(),H=s[0]==='You'?'Have':cap(hv(s)),a=ansP(s),v=a==='I'||!['he','she','it'].includes(a)?'have':'has';
     return Q(`Odpověz ano: ${H} ${qS(s)} got ${o[0]}?`,`Yes, ${a} ${v}.`,[`Yes, ${a} ${v} got.`,`Yes, ${a} ${v==='has'?'have':'has'}.`],'Got zůstává doma 🏠.')}),
   R(()=>{const n=pick([['Tom','he'],['Anna','she'],['your mum','she'],['your dad','he'],['the dog','it']]),o=enO();return Q(`Has ${n[0]} got ${o[0]}? – Yes, ___ has.`,n[1],['he','she','it'],`${n[0]} = ${n[1]}.`)}),
   ()=>Q('Have you got a sister? – Která odpověď je správně?','Yes, I have.',['Yes, you have.','Yes, I have got.'],'Ptají se „you“, odpovídám „I“. Bez got.'),
   ()=>Q('Je v krátké odpovědi got?','ne, nikdy',['ano, vždycky','jen u has'],'Got zůstává doma 🏠.')]},
 {id:'have',icon:'🍳',name:'Have bez got (do / does)',
  lesson:()=>`<p><b>have</b> se dá použít i bez got. Znamená totéž (mít). Zápor a otázku pak dělají pomocníci <b>do / does</b>.</p>
   ${ftable([['mám / má','I have / she has'],['nemám / nemá',"I don't have / she doesn't have"],['Máš? / Má?','Do you have? / Does she have?'],['Ano. / Ne.',"Yes, I do. / No, she doesn't."]])}
   ${mnem('🦘','S skáče na DOES','<i>She <b>has</b> a cat.</i> → otázka: <i><b>Does</b> she <b>have</b> a cat?</i> Písmenko s přeskočí na does a have zůstane holé. <b>S je jen jedno</b> – nikdy „does she has“.')}
   ${mnem('⚖️','Got nebo do – nikdy obojí','S got: have/has jde dopředu (Have you got?). Bez got: pomůže do/does (Do you have?).')}
   ${mnem('🍳','Bonus: jídlo a zážitky jen s have','<i>have breakfast</i> (snídat), <i>have lunch</i> (obědvat), <i>have fun</i> (bavit se) – tady got nikdy není.')}
   <p class="muted"><i>Do you have a pen?</i> ${EN_SAY('Do you have a pen?')} <i>He doesn't have a dog.</i> ${EN_SAY("He doesn't have a dog.")}</p>`,
  gen:[
   R(()=>{const s=enS(),o=enO();return Q(`Doplň (bez got): ${s[0]} ___ ${o[0]}.`,hv(s),['have','has','haves'],`${s[0]} ${hv(s)} ${o[0]}.`)}),
   R(()=>{const s=enS(),o=enO();return Q(`Zápor bez got: ${s[0]} ___ have ${o[0]}.`,s[1]?"doesn't":"don't",["don't","doesn't","hasn't"],`${s[0]} → ${s[1]?"doesn't":"don't"} have.`)}),
   R(()=>{const s=pick(ENS.filter(x=>x[1])),o=enO();return Q(`${s[0]} doesn't ___ ${o[0]}.`,'have',['have','has','haves'],'S už je na doesn\'t, have zůstane holé 🦘.')}),
   R(()=>{const s=enS(),o=enO();return Q(`Otázka bez got: ___ ${qS(s)} have ${o[0]}?`,s[1]&&s[0]!=='You'?'Does':'Do',['Do','Does','Has'],`${qS(s)} → ${s[1]?'Does':'Do'}.`)}),
   R(()=>{const s=pick(ENS.filter(x=>x[0]!=='I')),o=enO(),D=s[1]?'Does':'Do',a=ansP(s),v=['he','she','it'].includes(a)?'does':'do';return Q(`${D} ${qS(s)} have ${o[0]}? – Yes, ${a} ___.`,v,['do','does','have'],`Yes, ${a} ${v}.`)}),
   ()=>Q('Která věta je správně?','Does she have a dog?',['Does she has a dog?','Has she have a dog?'],'S je jen jedno – na does 🦘.'),
   ()=>Q('Jak řekneš „snídám“?','I have breakfast.',['I have got breakfast.','I has breakfast.'],'Jídlo jen s have, bez got.'),
   ()=>Q("Která věta je ŠPATNĚ?","Do you have got a dog?",["Have you got a dog?","Do you have a dog?"],'Got nebo do – nikdy obojí ⚖️.')]},
 {id:'smes',icon:'🏆',name:'Všechno dohromady',
  lesson:()=>`<p>Shrnutí všech pomůcek:</p>
   ${mnem('🐍','Had syčí na tři','he, she, it → has')}
   ${mnem('👤','Got je stín','nepřekládá se')}
   ${mnem('🥪','Sendvič','have – NOT – got → haven\'t got')}
   ${mnem('🐸','Žabka','v otázce have/has skočí dopředu')}
   ${mnem('🏠','Got zůstává doma','Yes, I have. No, she hasn\'t.')}
   ${mnem('🦘','S skáče na does','Does she have…?')}
   ${ftable([['+',"I've got / she's got"],['–',"I haven't got / she hasn't got"],['?','Have you got? / Has she got?'],['odpověď',"Yes, I have. / No, she hasn't."]])}`,
  gen:[
   R(()=>{const s=enP(),o=enO(),k=pick(['+','-']);return k==='+'?Q(`Přelož: ${s[2]} ${CZ_MAM[s[3]]} ${o[1]}.`,`${shortS(s)} got ${o[0]}.`,[`${s[0]}${s[1]?"'ve":"'s"} got ${o[0]}.`,`${s[0]} got ${o[0]}.`],`${s[2]} ${CZ_MAM[s[3]]} = ${shortS(s)} got.`):
     Q(`Přelož: ${s[2]} ${CZ_NEMAM[s[3]]} ${o[1]}.`,`${s[0]} ${hv(s)}n't got ${o[0]}.`,[`${s[0]} ${s[1]?'have':'has'}n't got ${o[0]}.`,`${s[0]} not got ${o[0]}.`],`${CZ_NEMAM[s[3]]} = ${hv(s)}n't got.`)}),
   R(()=>{const s=enS(),o=enO(),h=hv(s);const bad=pick([[`${s[0]} ${s[1]?'have':'has'} got ${o[0]}.`,'he/she/it → has, ostatní have 🐍'],[`${s[0]} ${h} got not ${o[0]}.`,'not patří doprostřed 🥪'],[`${s[0]} don't got ${o[0]}.`,'s got nikdy don\'t']]);
     return Q('Která věta je ŠPATNĚ?',bad[0],[`${s[0]} ${h} got ${o[0]}.`,`${s[0]} ${h}n't got ${o[0]}.`],`Chyba: ${bad[1]}.`)}),
   R(()=>{const s=pick(ENS.filter(x=>x[0]!=='I')),o=enO(),H=s[0]==='You'?'Have':cap(hv(s)),a=ansP(s),v=['he','she','it'].includes(a)?"hasn't":"haven't";return Q(`${H} ${qS(s)} got ${o[0]}? – No, …`,`No, ${a} ${v}.`,[`No, ${a} ${v} got.`,`No, ${a} don't.`],'Got zůstává doma 🏠.')}),
   R(()=>{const s=enS(),o=enO();return Q(`Doplň: ${s[0]} ___ got ${o[0]}.`,hv(s),['have','has','is'],`${s[0]} → ${hv(s)}.`)}),
   R(()=>{const s=enS(),o=enO();return Q(`Otázka: ___ ${qS(s)} got ${o[0]}?`,s[0]==='You'||!s[1]?'Have':'Has',['Have','Has','Does'],'Žabka have/has skočí dopředu 🐸.')}),
   R(()=>{const p=pick([['Have you','Máš'],['Has Tom','Má Tom'],['Has she','Má (ona)'],['Have they','Mají'],['Has your mum','Má tvoje máma'],['Have we','Máme']]),o=enO();return Q(`Co znamená: ${p[0]} got ${o[0]}?`,`${p[1]} ${o[1]}?`,[`${p[1].replace(/^M/,'Nem')} ${o[1]}?`,`Chce${p[1].includes('Máš')?'š':''} ${o[1]}?`],'have got = mít, v otázce have/has skočí dopředu 🐸.')})]}
];
COURSES.angl={id:'angl',name:'Angličtina: have got',sub:'I have got, has got, zápor, otázky + pomůcky',icon:'🇬🇧',topics:EN_TOPICS,finalN:15,passFinal:12,color:'var(--sun-soft)',exam:true};
function sayEnText(t){try{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';u.rate=.85;const v=speechSynthesis.getVoices().find(v=>/^en(-|_)GB/i.test(v.lang))||speechSynthesis.getVoices().find(v=>/^en/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
handlers.sayEn=b=>sayEnText(b.dataset.t);
