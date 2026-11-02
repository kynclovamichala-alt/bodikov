
/* ================= Bea: course "Přírodověda" ================= */
const MC=(q,ans,others,exp)=>()=>({svg:'',q,opts:shuffle([ans,...others]),ans,exp});
const YN=(q,yes,exp)=>()=>({svg:'',q,opts:['Ano','Ne'],ans:yes?'Ano':'Ne',exp});
const CL=(qf,groups,expf)=>()=>{const labels=Object.keys(groups),g=pick(labels),x=pick(groups[g]);return{svg:'',q:qf(x),opts:labels,ans:g,exp:expf(x,g)}};
const li=a=>`<ul class="lul">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;

/* --- pictures: mushrooms --- */
const HUB_PARTS={hrib:['klobouk','rourky','třeň','podhoubí'],much:['klobouk','lupeny','prsten','třeň','pochva','podhoubí']};
const PART_EXP={klobouk:'Klobouk je horní část plodnice.',rourky:'Rourky jsou na spodní straně klobouku hřibů.',lupeny:'Lupeny jsou tenké plátky na spodní straně klobouku, mají je třeba muchomůrky.',
  'třeň':'Třeň je „nožička“ houby, nese klobouk.',prsten:'Prsten je „sukýnka“ na třeni muchomůrek.',pochva:'Pochva je obal u spodku třeně muchomůrek, lidově „kalich smrti“.',podhoubí:'Podhoubí jsou šedobílá vlákna pod povrchem půdy nebo ve dřevě.'};
function hubSvg(kind,hi){
  const H='#FF5C93',f=(p,c)=>p===hi?H:c,sw=p=>p===hi?'stroke="#B0154F" stroke-width="3"':'stroke="#2B2350" stroke-width="2"';
  let s=`<rect x="0" y="152" width="320" height="48" fill="#C9A27E" opacity=".55"/>`;
  const mycel=`<g fill="none" stroke="${f('podhoubí','#A7A196')}" stroke-width="${hi==='podhoubí'?3.5:2}" stroke-linecap="round"><path d="M160 156 q-30 10 -60 6 q-20 -2 -34 12"/><path d="M160 156 q25 14 58 8 q22 -4 36 10"/><path d="M160 156 q-6 18 -26 30"/><path d="M160 156 q10 18 32 28"/><path d="M110 162 q-10 10 -4 24"/><path d="M215 166 q6 12 -2 22"/></g>`;
  if(kind==='hrib'){
    s+=mycel+`<path d="M140 92 Q128 140 134 156 L186 156 Q192 140 180 92 Z" fill="${f('třeň','#F1E9D8')}" ${sw('třeň')}/>`+
      `<path d="M88 92 Q160 98 232 92 Q160 112 88 92 Z" fill="${f('rourky','#E9D27A')}" ${sw('rourky')}/>`+
      `<path d="M86 92 Q100 22 160 20 Q220 22 234 92 Q160 84 86 92 Z" fill="${f('klobouk','#9A5B2E')}" ${sw('klobouk')}/>`;
  }else{
    s+=mycel+`<path d="M138 156 Q134 132 150 128 L170 128 Q186 132 182 156 Z" fill="${f('pochva','#F7F3EA')}" ${sw('pochva')}/>`+
      `<path d="M150 80 L147 130 L173 130 L170 80 Z" fill="${f('třeň','#F7F3EA')}" ${sw('třeň')}/>`+
      `<path d="M146 98 Q160 92 174 98 L182 112 Q160 104 138 112 Z" fill="${f('prsten','#FFFFFF')}" ${sw('prsten')}/>`+
      `<path d="M96 76 Q160 70 224 76 L218 86 Q160 80 102 86 Z" fill="${f('lupeny','#FFFDF6')}" ${sw('lupeny')}/>`+
      `<path d="M94 76 Q104 18 160 16 Q216 18 226 76 Q160 68 94 76 Z" fill="${f('klobouk','#E0402A')}" ${sw('klobouk')}/>`+
      (hi==='klobouk'?'':`<g fill="#fff"><circle cx="130" cy="44" r="5"/><circle cx="160" cy="32" r="6"/><circle cx="190" cy="46" r="5"/><circle cx="115" cy="62" r="4"/><circle cx="205" cy="62" r="4"/><circle cx="160" cy="56" r="4"/></g>`);
  }
  return s;
}
/* --- picture: photosynthesis --- */
function arrow(x1,y1,x2,y2,col,w){const a=Math.atan2(y2-y1,x2-x1),h=12+w;const p1=`${f1(x2-h*Math.cos(a-0.45))},${f1(y2-h*Math.sin(a-0.45))}`,p2=`${f1(x2-h*Math.cos(a+0.45))},${f1(y2-h*Math.sin(a+0.45))}`;
  return `<line x1="${x1}" y1="${y1}" x2="${f1(x2-Math.cos(a)*6)}" y2="${f1(y2-Math.sin(a)*6)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><polygon points="${x2},${y2} ${p1} ${p2}" fill="${col}"/>`}
const FOTO={svetlo:[250,40,190,72],co2:[40,70,118,92],voda:[95,192,152,170],kyslik:[196,112,284,140]};
function fotoSvg(hi){
  let s=`<circle cx="285" cy="26" r="24" fill="#FFC22E"/><rect x="0" y="152" width="320" height="48" fill="#C9A27E" opacity=".55"/>`+
   `<g stroke="#8B5A3C" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M160 152 v26"/><path d="M160 162 l-16 14"/><path d="M160 168 l18 14"/><path d="M160 158 l-24 6"/></g>`+
   `<path d="M160 152 V48" stroke="#2E8B57" stroke-width="5"/><ellipse cx="128" cy="100" rx="34" ry="12" transform="rotate(-25 128 100)" fill="#4CAF50"/><ellipse cx="192" cy="112" rx="34" ry="12" transform="rotate(25 192 112)" fill="#4CAF50"/>`+
   `<ellipse cx="132" cy="134" rx="26" ry="9" transform="rotate(-15 132 134)" fill="#5DBB63"/><circle cx="160" cy="42" r="14" fill="#FFD84D" stroke="#E0A800" stroke-width="2"/>`;
  for(const k in FOTO){const[a,b,c,d]=FOTO[k],out=k==='kyslik';s+=arrow(a,b,c,d,k===hi?'#FF5C93':out?'#E57373':'#64B5F6',k===hi?6:3)}
  const[a,b]=FOTO[hi];s+=`<text x="${a+(hi==='kyslik'?12:0)}" y="${b-10}" text-anchor="middle" style="fill:#FF5C93">?</text>`;
  return s;
}
const FOTO_NAME={svetlo:'světlo ze slunce',co2:'oxid uhličitý',voda:'voda',kyslik:'kyslík'};
const FOTO_EXP={svetlo:'Rostlina přijímá světlo ze slunce, bez něj fotosyntéza neprobíhá.',co2:'Listy přijímají ze vzduchu oxid uhličitý.',voda:'Kořeny přijímají z půdy vodu (s živinami).',kyslik:'Při fotosyntéze vzniká kyslík, který rostlina uvolňuje do ovzduší.'};

const SCI_TOPICS=[
 {id:'lide',icon:'🌍',name:'Příroda a lidé',
  lesson:()=>`<p>Jsme obklopeni přírodou a <b>jsme na ní závislí</b>. Náš život závisí na <b>přírodních zdrojích</b>, např. na dostatku vody a potravy.</p>
   ${li(['Potřebujeme <b>vodu, potraviny, oblečení, nábytek a obydlí</b>.','K výživě využíváme <b>rostliny, živočichy i houby</b>.','Látky na oděvy jsou z <b>bavlny, vlny, lnu</b> nebo z umělých vláken (z <b>ropy</b>).','K topení a vaření: <b>uhlí, zemní plyn, dřevo</b>. Benzin a nafta se vyrábí z <b>ropy</b>.','Pravěcí lidé žili <b>sběrem a lovem</b>. První zemědělci <b>káceli lesy</b> a zakládali pole a pastviny.','Počasí umíme jen částečně předpovídat, <b>řídit ho nemůžeme</b>. Při suchu bývá nižší úroda.'])}
   <p>Kdo přírodu nechrání, škodí sám sobě. Přírodu bychom měli <b>dobře znát a chránit</b>.</p>`,
  gen:[
   MC('Na čem závisí náš život?','na přírodních zdrojích (voda, potrava)',['jen na obchodech','na počasí v televizi'],'Jsme na přírodě závislí, potřebujeme hlavně vodu a potravu.'),
   MC('Z čeho se vyrábějí látky na oděvy?','z bavlny, vlny, lnu nebo umělých vláken',['ze zemního plynu a uhlí','z písku a kamení'],'Oděvy jsou z bavlny, vlny, lnu nebo z umělých vláken.'),
   MC('Z čeho se vyrábí benzin a nafta?','z ropy',['ze dřeva','z bavlny'],'Benzin a nafta (pohonné hmoty) se vyrábí z ropy.'),
   MC('Z čeho se vyrábějí umělá vlákna?','z ropy',['z vlny','ze lnu'],'Umělá vlákna se vyrábějí z ropy.'),
   MC('Co používáme k topení a vaření?','uhlí, zemní plyn, dřevo',['bavlnu a len','písek a kámen'],'K topení a vaření slouží uhlí, zemní plyn a dřevo.'),
   MC('Jak se živili pravěcí lidé?','sběrem a lovem',['v obchodech','pěstováním v továrnách'],'Pravěcí lidé přírodu moc neovlivňovali, žili sběrem a lovem.'),
   MC('Jak měnili krajinu první zemědělci?','káceli lesy a zakládali pole a pastviny',['stavěli silnice','sázeli pralesy'],'První zemědělci odlesňovali krajinu a zakládali pole a pastviny.'),
   MC('Můžeme řídit počasí?','Ne, umíme ho jen částečně předpovídat',['Ano, kdykoli','Jen v létě'],'Počasí umíme částečně předpovídat, ale řídit ho nemůžeme.'),
   MC('Co se stane, když je dlouho sucho?','bývá nižší úroda',['úroda je vyšší','nic se nestane'],'Pěstování rostlin závisí na počasí. Při suchu je úroda nižší.'),
   MC('Proč musíme přírodu chránit?','jsme na ní závislí, kdo ji nechrání, škodí sám sobě',['protože je to zákon jen pro lesníky','nemusíme ji chránit'],'Jsme obklopeni přírodou a závislí na ní.'),
   MC('Proč se učíme poznávat houby, rostliny a živočichy?','abychom přírodě neškodili a chránili ji',['abychom je mohli všechny sníst','nemá to žádný důvod'],'Přírodu musíme dobře znát, abychom jí neubližovali.'),
   MC('Co z toho využíváme pro svou výživu?','rostliny, živočichy i houby',['jen kameny','jen vodu'],'Pro výživu využíváme rostliny, živočichy i houby.')]},
 {id:'ziva',icon:'🌱',name:'Živá a neživá příroda',
  lesson:()=>`<p>Přírodu dělíme na <b>živou</b> a <b>neživou</b>.</p>
   ${li(['<b>Živá:</b> houby, rostliny, živočichové (i mikroorganismy, které vidíme jen pod mikroskopem).','<b>Neživá:</b> vzduch, voda, teplo a světlo ze slunce, nerosty a horniny, půda.'])}
   <p>Obě složky jsou důležité a <b>propojené</b>. Živá příroda by bez neživé nemohla existovat.</p>
   <p>Živé organismy ovlivňují neživou přírodu: z odumřelých částí rostlin a živočichů vzniká <b>humus</b>, nejúrodnější část půdy.</p>
   <p>Vodní organismy využívají kyslík a oxid uhličitý, které jsou ve vodě.</p>`,
  gen:[
   CL(x=>`Patří „${x}“ do živé, nebo neživé přírody?`,{'živá příroda':['houby','rostliny','živočichové','pampeliška lékařská','kapr obecný','hřib smrkový','papoušek','mikroorganismy','strom'],'neživá příroda':['vzduch','voda','písek','skála','půda','teplo a světlo ze slunce','nerosty a horniny']},
     (x,g)=>g==='živá příroda'?`${x} je živý organismus.`:`${x} patří do neživé přírody.`),
   CL(x=>`Patří „${x}“ do živé, nebo neživé přírody?`,{'živá příroda':['kopretina','čmelák','muchomůrka','pes','lípa'],'neživá příroda':['kámen','horniny','sluneční světlo','oblaka (vzduch)','řeka (voda)']},(x,g)=>`${x}: ${g}.`),
   MC('Na jaké dvě části dělíme přírodu?','živou a neživou',['teplou a studenou','velkou a malou'],'Přírodu dělíme na živou a neživou.'),
   MC('Co tvoří živou přírodu?','houby, rostliny a živočichové',['vzduch, voda a půda','nerosty a horniny'],'Živou přírodu tvoří houby, rostliny a živočichové.'),
   MC('Co z toho NEpatří do neživé přírody?','houby',['vzduch','půda','voda'],'Houby jsou živé organismy.'),
   MC('Jak se jmenují organismy, které vidíme jen pod mikroskopem?','mikroorganismy',['nerosty','výtrusy'],'Mikroorganismy jsou živé, ale tak malé, že je vidíme jen mikroskopem.'),
   MC('Co je humus?','nejúrodnější část půdy z odumřelých rostlin a živočichů',['druh horniny','jedovatá houba'],'Humus vzniká z odumřelých částí těl rostlin a živočichů.'),
   YN('Může živá příroda existovat bez neživé?',false,'Živá příroda potřebuje vzduch, vodu, světlo a půdu. Obě složky jsou propojené.'),
   MC('Co potřebují rostliny k životu?','teplo a světlo ze slunce, vodu, vzduch a živiny z půdy',['jen tmu a sníh','jen písek'],'Rostliny potřebují slunce, vodu, vzduch a živiny z půdy.'),
   MC('Odkud berou kyslík vodní organismy?','z vody, ve které je obsažený',['nepotřebují kyslík','jen ze vzduchu nad hladinou'],'Vodní organismy využívají kyslík a oxid uhličitý obsažené ve vodě.')]},
 {id:'eko',icon:'🏞️',name:'Ekosystém',
  lesson:()=>`<p><b>Ekosystém</b> je soubor živých organismů propojených s neživou přírodou na <b>určitém území</b>.</p>
   ${li(['Rostliny potřebují <b>vodu, světlo, oxid uhličitý a živiny</b>.','Rostliny i živočichové potřebují <b>kyslík</b>.','Kyslík umějí vytvářet <b>jen zelené rostliny</b>.','Rostliny jsou <b>potravou</b> pro živočichy.','<b>Rozkladači</b> rozkládají zbytky odumřelých organismů.','Jednoduchý ekosystém je třeba <b>akvárium</b>.'])}
   <p><b>Suchozemské:</b> les, louka, pastvina, pole, zahrada, park.<br><b>Vodní:</b> jezero, rybník, řeka, potok.</p>
   <p>Většinu ekosystémů člověk ovlivňuje (pole, louka). Do zvláště chráněných území téměř nezasahuje, např. <b>Boubínský prales</b>.</p>`,
  gen:[
   CL(x=>`Je ${x} suchozemský, nebo vodní ekosystém?`,{suchozemský:['les','louka','pastvina','pole','zahrada','park'],vodní:['jezero','rybník','řeka','potok']},(x,g)=>`${x[0].toUpperCase()+x.slice(1)} je ${g} ekosystém.`),
   CL(x=>`Je ${x} suchozemský, nebo vodní ekosystém?`,{suchozemský:['les','pole','louka'],vodní:['rybník','řeka','potok']},(x,g)=>`${x}: ${g} ekosystém.`),
   MC('Co je ekosystém?','živé organismy propojené s neživou přírodou na určitém území',['jen skupina stromů','jen voda v rybníce'],'Ekosystém = živá + neživá příroda na určitém území.'),
   MC('Které organismy umějí vytvářet kyslík?','jen zelené rostliny',['houby','všichni živočichové'],'Kyslík mohou vytvářet pouze zelené rostliny.'),
   MC('Co potřebují rostliny ke svému životu?','vodu, světlo, oxid uhličitý a živiny',['jen kyslík a tmu','maso'],'Rostliny potřebují vodu, světlo, oxid uhličitý a další živiny.'),
   MC('Co potřebují k životu živočichové i rostliny?','kyslík',['jen oxid uhličitý','tmu'],'Živočichové i rostliny potřebují k životu kyslík.'),
   MC('Co dělají rozkladači?','rozkládají zbytky odumřelých organismů',['vyrábějí kyslík','loví ryby'],'Rozkladači rozkládají zbytky těl odumřelých organismů.'),
   MC('Co může být jednoduchý ekosystém?','akvárium',['kniha','prázdná sklenice'],'Akvárium je jednoduchý ekosystém: rostliny, ryby, voda, písek, světlo.'),
   MC('Do kterého ekosystému člověk téměř nezasahuje?','zvláště chráněné území, např. Boubínský prales',['pole','zahrada'],'Zvláště chráněná území člověk téměř neovlivňuje.'),
   MC('Čím jsou rostliny pro živočichy?','potravou, ze které získávají živiny',['nepřítelem','ničím'],'Rostliny slouží živočichům jako potrava.')]},
 {id:'deleni',icon:'🗂️',name:'Rozdělení organismů',
  lesson:()=>`<p>Živé organismy dělíme na <b>houby, rostliny a živočichy</b>.</p>
   ${li(['<b>Houby:</b> jedlé (hřib smrkový), nejedlé (hřib žlučník), jedovaté (muchomůrka zelená).','<b>Rostliny:</b> byliny (kopretina bílá) a dřeviny: keře (bez černý) a stromy (lípa srdčitá).','<b>Živočichové:</b> bezobratlí (čmelák zemní) a obratlovci: ryby (kapr obecný), obojživelníci (skokan zelený), plazi (zmije obecná), ptáci (kos černý), savci (pes domácí).'])}
   <p>Organismy mají <b>dvouslovný název</b>. První slovo označuje <b>rod</b> (hřib), celý název <b>druh</b> (hřib smrkový).</p>`,
  gen:[
   ()=>{const A=[['kapr obecný','ryby'],['skokan zelený','obojživelníci'],['zmije obecná','plazi'],['kos černý','ptáci'],['pes domácí','savci'],['čmelák zemní','bezobratlí']],G=['ryby','obojživelníci','plazi','ptáci','savci','bezobratlí'];const[x,g]=pick(A);
     return{svg:'',q:`Kam patří ${x}?`,opts:shuffle([g,...shuffle(G.filter(y=>y!==g)).slice(0,3)]),ans:g,exp:g==='bezobratlí'?`${x} je bezobratlý živočich.`:`${x} patří mezi obratlovce, do skupiny ${g}.`}},
   ()=>{const A=[['kopretina bílá','byliny'],['bez černý','keře'],['lípa srdčitá','stromy']];const[x,g]=pick(A);return{svg:'',q:`Kam patří ${x}?`,opts:['byliny','keře','stromy'],ans:g,exp:g==='byliny'?`${x} je bylina.`:`${x} patří mezi dřeviny, konkrétně ${g}.`}},
   ()=>{const A=[['hřib smrkový','houby'],['muchomůrka zelená','houby'],['kopretina bílá','rostliny'],['lípa srdčitá','rostliny'],['bez černý','rostliny'],['kos černý','živočichové'],['skokan zelený','živočichové'],['čmelák zemní','živočichové']];const[x,g]=pick(A);return{svg:'',q:`Do které skupiny organismů patří ${x}?`,opts:['houby','rostliny','živočichové'],ans:g,exp:`${x} patří mezi ${g}.`}},
   ()=>{const n=pick(['sedmikráska obecná','medvěd hnědý','muchomůrka červená','hřib smrkový','lípa srdčitá','kos černý','skokan zelený','kapr obecný','zmije obecná']),[a,b]=n.split(' ');
     return{svg:'',q:`Co označuje ROD v názvu „${n}“?`,opts:[a,b,n],ans:a,exp:`Rod je první slovo: ${a}. Celý název „${n}“ je druh.`}},
   MC('Na jaké tři skupiny dělíme živé organismy?','houby, rostliny, živočichy',['ryby, ptáky, savce','stromy, keře, byliny'],'Základní skupiny: houby, rostliny a živočichové.'),
   MC('Rostliny dělíme na…','byliny a dřeviny',['ryby a ptáky','jedlé a jedovaté'],'Rostliny jsou byliny a dřeviny.'),
   MC('Dřeviny dělíme na…','keře a stromy',['mechy a kapradiny','byliny a trávy'],'Dřeviny jsou keře a stromy.'),
   MC('Živočichy dělíme na…','bezobratlé a obratlovce',['jedlé a nejedlé','velké a malé'],'Živočichové: bezobratlí a obratlovci.'),
   MC('Co označuje celý dvouslovný název, např. hřib smrkový?','druh',['rod','skupinu'],'Celý název je druh, první slovo je rod.')]},
 {id:'houby',icon:'🍄',name:'Houby: společné znaky',
  lesson:()=>`<p>Houby tvoří <b>samostatnou skupinu</b> živých organismů. Liší se od rostlin i od živočichů.</p>
   ${li(['<b>Nemají zelené barvivo</b> (chlorofyl).','Vyživují se <b>rozkladem odumřelých těl</b> rostlin a živočichů nebo <b>přijímají živiny z kořenů rostlin</b>.','Rozmnožují se <b>výtrusy</b>.','<b>Nepohybují se</b> z místa na místo.','Nemají kořeny, listy ani květy.'])}
   <p>Na světě je asi <b>1,5 milionu</b> druhů hub, v Česku asi <b>10 000</b>. Na houby se chodí hlavně <b>koncem léta a na podzim</b>.</p>
   <p>Otrávit se můžeme <b>jedovatými i zkaženými</b> houbami. Otrava se může projevit <b>až dlouho po jídle</b>. Některé houby nemají plodnici, např. <b>kvasinky</b>.</p>`,
  gen:[
   MC('Houby jsou…','samostatná skupina živých organismů',['druh rostlin','druh živočichů'],'Houby nejsou rostliny ani živočichové, jsou samostatná skupina.'),
   YN('Obsahují houby zelené barvivo (chlorofyl)?',false,'Na rozdíl od rostlin houby chlorofyl nemají.'),
   MC('Jak se houby rozmnožují?','výtrusy',['semeny','cibulemi'],'Houby se rozmnožují výtrusy.'),
   MC('Jak se houby vyživují?','rozkladem odumřelých těl nebo živinami z kořenů rostlin',['fotosyntézou','lovem hmyzu'],'Houby rozkládají odumřelá těla rostlin a živočichů nebo berou živiny z kořenů rostlin.'),
   YN('Mohou se houby pohybovat z místa na místo?',false,'Na rozdíl od živočichů se houby nepohybují.'),
   MC('Co houby NEmají?','kořeny, listy a květy',['klobouk','třeň'],'Houby nemají kořeny, listy ani květy.'),
   MC('Kolik druhů hub roste v České republice?','asi 10 000',['asi 10','asi 1 milion'],'V Česku roste kolem deseti tisíc druhů hub.'),
   MC('Kolik druhů hub je asi na celém světě?','asi jeden a půl milionu',['asi sto','asi tisíc'],'Na světě je asi 1,5 milionu druhů hub.'),
   MC('Které houby nemají plodnici?','kvasinky',['hřiby','bedly'],'Kvasinky jsou houby bez plodnice.'),
   MC('Čím se můžeme otrávit?','jedovatými i zkaženými houbami',['jen syrovou bedlou','houbami se otrávit nedá'],'Otrava může být způsobena jedovatými i zkaženými houbami.'),
   MC('Projeví se otrava houbami vždy hned po jídle?','Ne, někdy až dlouho po jídle',['Ano, vždy hned'],'U některých jedovatých hub se otrava projeví až dlouho po jídle.'),
   MC('Kdy lidé nejčastěji chodí na houby?','koncem léta a na podzim',['v zimě','jen na jaře'],'Na houby se chodí hlavně koncem léta a na podzim.'),
   MC('Čím se houby liší od rostlin?','nemají zelené barvivo (chlorofyl)',['mají květy','rostou ze semen'],'Rostliny chlorofyl mají, houby ne.')]},
 {id:'stavba',icon:'🔍',name:'Stavba těla hub',
  lesson:()=>`<div class="geo">${geoSvg(hubSvg('hrib',''))}</div>
   <p><b>Plodnice</b> je nadzemní část houby: <b>klobouk</b> a <b>třeň</b>. <b>Podhoubí</b> jsou šedobílá vlákna pod povrchem půdy nebo ve dřevě. Plodnice vyrůstá jen za <b>příznivých podmínek</b>.</p>
   <p>Pod kloboukem mají houby <b>rourky</b> (hřib smrkový) nebo <b>lupeny</b> (muchomůrka).</p>
   <div class="geo">${geoSvg(hubSvg('much',''))}</div>
   <p>Muchomůrky mají na třeni <b>prsten</b> a dole <b>pochvu</b> (lidově „kalich smrti“).</p>`,
  gen:[
   ()=>{const kind=pick(['hrib','much','much']),parts=HUB_PARTS[kind],p=pick(parts),all=['klobouk','rourky','lupeny','třeň','prsten','pochva','podhoubí'];
     return{svg:hubSvg(kind,p),q:`${kind==='hrib'?'Hřib smrkový':'Muchomůrka červená'}: jak se jmenuje růžová část?`,opts:shuffle([p,...shuffle(all.filter(x=>x!==p)).slice(0,3)]),ans:p,exp:PART_EXP[p]}},
   ()=>{const kind=pick(['hrib','much']),p=pick(HUB_PARTS[kind]);return{svg:hubSvg(kind,p),q:'Jak se jmenuje růžově zvýrazněná část?',opts:shuffle([p,...shuffle(['klobouk','rourky','lupeny','třeň','prsten','pochva','podhoubí'].filter(x=>x!==p)).slice(0,3)]),ans:p,exp:PART_EXP[p]}},
   MC('Nadzemní část houby se jmenuje…','plodnice',['podhoubí','výtrus'],'Plodnice je to, co vidíme nad zemí.'),
   MC('Část houby pod povrchem půdy se jmenuje…','podhoubí',['plodnice','klobouk'],'Podhoubí jsou vlákna v půdě nebo ve dřevě.'),
   MC('Z jakých dvou částí se skládá plodnice?','klobouk a třeň',['kořen a list','prsten a pochva'],'Plodnice = klobouk + třeň.'),
   MC('Co mají houby na spodní straně klobouku?','rourky nebo lupeny',['listy','květy'],'Hřiby mají rourky, muchomůrky lupeny.'),
   MC('Co mají muchomůrky na třeni?','prsten a pochvu',['rourky','kořeny'],'Muchomůrky mají prsten a pochvu.'),
   MC('Jak se lidově říká pochvě muchomůrky?','kalich smrti',['čepička','sukýnka'],'Pochva = „kalich smrti“.'),
   MC('Jak vypadá podhoubí?','šedobílá vlákna pod zemí nebo ve dřevě',['zelené listy','červený klobouk'],'Podhoubí tvoří šedobílá vlákna.'),
   MC('Kdy vyrůstá plodnice z podhoubí?','jen za příznivých podmínek',['každý den','jen v zimě'],'Plodnice vyrůstá jen za příznivých podmínek.'),
   MC('Co má hřib smrkový pod kloboukem?','rourky',['lupeny','prsten'],'Hřib smrkový je rourkatá houba.'),
   MC('Co má muchomůrka červená pod kloboukem?','lupeny',['rourky','podhoubí'],'Muchomůrka je lupenitá houba.')]},
 {id:'sber',icon:'🧺',name:'Dělení a sběr hub',
  lesson:()=>`${li(['<b>Jedlé:</b> hřib smrkový, bedla vysoká, liška obecná.','<b>Nejedlé:</b> hřib žlučník („hořčák“, má narůžovělé ústí rourek a hořkou chuť).','<b>Jedovaté:</b> muchomůrka zelená (naše nejjedovatější), muchomůrka červená, hřib satan.'])}
   <p><b>Pravidla sběru:</b></p>${li(['Sbíráme jen houby, které <b>dobře známe</b>.','Necháme je <b>zkontrolovat dospělým</b>.','Dáváme je do <b>košíku nebo plátěné tašky</b>, nikdy ne do igelitové (zapaří se a zkazí).','<b>Podhoubí necháme</b> na místě a jemně zahrneme.','Houby, které nesbíráme, <b>neničíme</b>.'])}
   <p><b>Otrava houbami:</b> zavoláme záchranku <b>155</b> nebo toxikologické středisko, vyvoláme zvracení (jen když to doporučí lékař), podáme <b>aktivní uhlí</b> a lékaři vezmeme <b>zbytky hub</b> jako vzorek.</p>`,
  gen:[
   CL(x=>`Je ${x} houba jedlá, nejedlá, nebo jedovatá?`,{jedlá:['hřib smrkový','bedla vysoká','liška obecná'],nejedlá:['hřib žlučník'],jedovatá:['muchomůrka červená','muchomůrka zelená','hřib satan']},(x,g)=>`${x} je ${g}.`),
   CL(x=>`Je ${x} houba jedlá, nejedlá, nebo jedovatá?`,{jedlá:['hřib smrkový','liška obecná'],nejedlá:['hřib žlučník'],jedovatá:['muchomůrka zelená','hřib satan']},(x,g)=>`${x} je ${g}.`),
   MC('Která houba je naše nejjedovatější?','muchomůrka zelená',['bedla vysoká','liška obecná','hřib žlučník'],'Muchomůrka zelená je naše nejjedovatější houba.'),
   MC('Jak se lidově říká hřibu žlučníku?','hořčák',['satan','kozák'],'Žlučník má nahořklou chuť, proto „hořčák“.'),
   MC('Čím se hřib žlučník liší od hřibu smrkového?','má narůžovělé ústí rourek a hořkou chuť',['má červený klobouk s tečkami','má prsten a pochvu'],'Žlučník má narůžovělé ústí rourek a je hořký.'),
   MC('Do čeho dáváme nasbírané houby?','do košíku nebo plátěné tašky',['do igelitové tašky','do kapsy'],'Do košíku nebo plátěné tašky, nikdy do igelitu.'),
   MC('Proč nedáváme houby do igelitové tašky?','zapaří se a zkazí',['igelit je moc těžký','houby by utekly'],'V igelitu se houby zapaří a zkazí. Zkažené houby jsou nebezpečné.'),
   MC('Které houby sbíráme?','jen ty, které dobře známe',['všechny, které najdeme','jen ty největší'],'Sbíráme jen houby, které dobře známe.'),
   MC('Co uděláme s podhoubím?','necháme ho na místě a jemně zahrneme',['vytrhneme ho','odneseme domů'],'Podhoubí necháme v zemi, aby houby rostly dál.'),
   MC('Co uděláme s houbami, které nesbíráme?','necháme je být, neničíme je',['rozšlápneme je','vykopneme je'],'Houby, které nesbíráme, nekopeme ani neničíme.'),
   MC('Kdo má nasbírané houby zkontrolovat?','dospělý člověk',['kamarád ze třídy','nikdo'],'Houby necháme zkontrolovat dospělým.'),
   MC('Na jaké číslo zavoláme záchranku při otravě houbami?','155',['158','150'],'Záchranná služba má číslo 155 (158 je policie, 150 hasiči).'),
   MC('Co vezmeme při otravě houbami k lékaři?','zbytky hub jako vzorek',['fotku lesa','prázdný košík'],'Podle zbytků hub lékař rychleji určí jed a nasadí léčbu.'),
   MC('Co se podává, když se nedaří vyvolat zvracení?','tablety aktivního uhlí',['sladký čaj','čokoláda'],'Podáme víc tablet aktivního uhlí (např. Carbosorb).')]},
 {id:'rostliny',icon:'🌻',name:'Rostliny: společné znaky',
  lesson:()=>`<p>Rostliny jsou živé organismy, obsahují <b>zelené barvivo (chlorofyl)</b>. Společné znaky:</p>
   ${li(['<b>Výživa a vylučování:</b> přijímají vodu s živinami a oxid uhličitý, vylučují kyslík a vodu.','<b>Dýchání:</b> dýchají všemi částmi těla, přijímají kyslík a uvolňují oxid uhličitý.','<b>Reakce na změny prostředí:</b> při nedostatku vody usychají, na podzim listnatým stromům opadávají listy, některé na noc zavírají květy.','<b>Pohyb:</b> jen svými částmi (otevírají a zavírají květy).','<b>Růst a vývoj:</b> mění vzhled, zvětšují se, ze semene vyroste rostlina.','<b>Rozmnožování:</b> semeny, cibulemi nebo hlízami (brambory).'])}
   <p>Rostliny nám dávají semena, plody, hlízy a kořeny a jsou <b>zdrojem kyslíku</b>. Velký strom vyrobí za den kyslík pro <b>50 lidí</b>.</p>`,
  gen:[
   MC('Co obsahují všechny zelené rostliny?','zelené barvivo (chlorofyl)',['výtrusy hub','kosti'],'Rostliny mají chlorofyl, proto jsou zelené.'),
   MC('Co rostliny přijímají při výživě?','vodu s živinami a oxid uhličitý',['jen kyslík','maso'],'Při výživě přijímají vodu s živinami a oxid uhličitý.'),
   MC('Co rostliny vylučují?','kyslík a vodu',['oxid uhličitý a kosti','nic'],'Rostliny vylučují kyslík a vodu.'),
   MC('Čím rostliny dýchají?','všemi částmi svého těla',['jen kořeny','nedýchají'],'Rostliny dýchají celým tělem.'),
   MC('Co rostliny při DÝCHÁNÍ přijímají a co uvolňují?','přijímají kyslík, uvolňují oxid uhličitý',['přijímají oxid uhličitý, uvolňují kyslík','nedýchají'],'Při dýchání je to obráceně než při výživě: kyslík dovnitř, oxid uhličitý ven.'),
   MC('Jak rostliny reagují na nedostatek vody?','usychají',['rychleji rostou','víc kvetou'],'Bez vody rostliny usychají.'),
   MC('Co se děje s listnatými stromy na podzim?','opadávají jim listy',['kvetou','rostou jim šišky'],'Na podzim opadá většině listnatých stromů listí.'),
   MC('Jak se rostliny pohybují?','jen svými částmi, např. otevírají a zavírají květy',['chodí z místa na místo','vůbec ne'],'Rostliny se pohybují jen svými částmi.'),
   MC('Čím se mohou rostliny rozmnožovat?','semeny, cibulemi nebo hlízami',['vejci','jen výtrusy hub'],'Rostliny se rozmnožují semeny, cibulemi nebo hlízami.'),
   MC('Čím se rozmnožují brambory?','hlízami',['vejci','šiškami'],'Brambory jsou hlízy.'),
   MC('Co nám rostliny poskytují?','semena, plody, hlízy, kořeny a kyslík',['plast','železo'],'Rostliny nám dávají potravu a kyslík.'),
   MC('Pro kolik lidí vyrobí velký strom za den kyslík?','asi pro 50 lidí',['pro 1 člověka','pro 1000 lidí'],'Velký strom vyrobí za den kyslík pro 50 lidí.'),
   MC('Co NEpatří mezi společné znaky rostlin?','pohybují se z místa na místo',['dýchají','rozmnožují se','rostou a vyvíjejí se'],'Rostliny se pohybují jen svými částmi, z místa na místo ne.')]},
 {id:'foto',icon:'☀️',name:'Fotosyntéza',
  lesson:()=>`<div class="geo">${geoSvg(fotoSvg('svetlo').replace(/<text[^>]*>\?<\/text>/,''))}</div>
   <p><b>Fotosyntéza</b> je hlavní způsob výživy rostlin. Probíhá v <b>zelených částech</b> rostliny a potřebuje <b>světlo ze slunce</b>.</p>
   <p>🔵 Rostlina <b>přijímá</b>: světlo, <b>oxid uhličitý</b> (listy) a <b>vodu</b> (kořeny).</p><p>🔴 Při fotosyntéze <b>vzniká</b>: <b>kyslík</b> (uvolňuje se do ovzduší) a živiny (cukry) pro rostlinu.</p>`,
  gen:[
   ()=>{const k=pick(Object.keys(FOTO));return{svg:fotoSvg(k),q:'Co představuje růžová šipka?',opts:shuffle(Object.values(FOTO_NAME)),ans:FOTO_NAME[k],exp:FOTO_EXP[k]}},
   ()=>{const k=pick(Object.keys(FOTO));return{svg:fotoSvg(k),q:'Rostlina tohle přijímá, nebo to při fotosyntéze vzniká?',opts:['přijímá','vzniká'],ans:k==='kyslik'?'vzniká':'přijímá',exp:FOTO_EXP[k]}},
   MC('Co je fotosyntéza?','hlavní způsob výživy rostlin',['dýchání živočichů','rozmnožování hub'],'Fotosyntézou si rostliny vyrábějí živiny.'),
   MC('Co rostlina potřebuje k fotosyntéze?','světlo, vodu a oxid uhličitý',['tmu a kyslík','jen hlínu'],'K fotosyntéze je potřeba světlo, voda a oxid uhličitý.'),
   MC('Kde probíhá fotosyntéza?','v zelených částech rostliny',['v kořenech pod zemí','jen v květech v noci'],'Fotosyntéza probíhá v zelených částech, kde je chlorofyl.'),
   MC('Co se při fotosyntéze uvolňuje do ovzduší?','kyslík',['oxid uhličitý','kouř'],'Při fotosyntéze se do ovzduší uvolňuje kyslík.'),
   MC('Čím rostlina přijímá vodu?','kořeny z půdy',['květy','plody'],'Vodu s živinami přijímají kořeny.'),
   MC('Odkud bere rostlina energii pro fotosyntézu?','ze světla ze slunce',['z měsíce','z hlíny'],'Fotosyntéza potřebuje světlo (slunce).'),
   MC('Co při fotosyntéze vzniká?','kyslík a živiny (cukry)',['oxid uhličitý','výtrusy'],'Vzniká kyslík a živiny pro rostlinu.'),
   YN('Probíhá fotosyntéza v úplné tmě?',false,'Fotosyntéza potřebuje světlo.'),
   YN('Mohou houby dělat fotosyntézu?',false,'Houby nemají chlorofyl, fotosyntézu neumějí.')]},
 {id:'trideni',icon:'🌿',name:'Třídění rostlin',
  lesson:()=>`<p>Rostliny dělíme podle toho, jak se rozmnožují:</p>
   ${li(['<b>Výtrusné</b>: rozmnožují se výtrusy, nekvetou. Např. <b>kapradiny, mechy, přesličky</b>.','<b>Semenné</b>: rozmnožují se semeny, která jsou ukrytá v plodech. Patří sem <b>byliny</b> a <b>dřeviny</b> (keře a stromy).'])}`,
  gen:[
   CL(x=>`Je ${x} výtrusná, nebo semenná rostlina?`,{výtrusná:['kapradina','mech','přeslička'],semenná:['kopretina bílá','lípa srdčitá','bez černý','pampeliška','jabloň','tulipán']},(x,g)=>g==='výtrusná'?`${x} se rozmnožuje výtrusy, nekvete.`:`${x} se rozmnožuje semeny.`),
   CL(x=>`Je ${x} bylina, keř, nebo strom?`,{bylina:['kopretina bílá','pampeliška lékařská','tulipán','sedmikráska obecná'],keř:['bez černý','šípková růže','líska'],strom:['lípa srdčitá','dub','smrk','jabloň']},(x,g)=>g==='bylina'?`${x} je bylina.`:`${x} je dřevina, konkrétně ${g}.`),
   MC('Jak se rozmnožují výtrusné rostliny?','výtrusy',['semeny','hlízami'],'Výtrusné rostliny se rozmnožují výtrusy.'),
   MC('Které rostliny patří mezi výtrusné?','kapradiny, mechy, přesličky',['lípa, dub, smrk','tulipán, kopretina'],'Kapradiny, mechy a přesličky jsou výtrusné.'),
   YN('Kvetou výtrusné rostliny?',false,'Výtrusné rostliny nekvetou.'),
   MC('Kde jsou ukrytá semena semenných rostlin?','v plodech',['v kořenech','ve výtrusech'],'Semena jsou ukrytá v plodech.'),
   MC('Semenné rostliny dělíme na…','byliny a dřeviny',['mechy a kapradiny','houby a řasy'],'Semenné rostliny: byliny a dřeviny.'),
   MC('Dřeviny jsou…','keře a stromy',['mechy a přesličky','jen trávy'],'Dřeviny = keře a stromy.')]}
];
