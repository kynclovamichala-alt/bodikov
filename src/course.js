
/* ================= Bea: course "Přímky a úsečky" ================= */
const LN='↔',RY='↦',fmtN=n=>String(Math.round(n*10)/10).replace('.',',');
const uniq=a=>[...new Set(a)];
function optsOf(ans,wrong,n=4){const o=uniq([ans,...wrong.filter(w=>w!==ans)]).slice(0,n);return shuffle(o)}
/* drawing helpers: horizontal line y=100, ticks for points */
const Y0=100;
const hl=(x1,x2,y=Y0,cls='g-line')=>`<line class="${cls}" x1="${f1(x1)}" y1="${y}" x2="${f1(x2)}" y2="${y}"/>`;
const tk=(x,lab,y=Y0,up=false)=>`<line class="g-tick" x1="${f1(x)}" y1="${y-9}" x2="${f1(x)}" y2="${y+9}"/><text x="${f1(x)}" y="${up?y-20:y+32}" text-anchor="middle">${lab}</text>`;
function drawKind(kind,A,B,xa,xb){ // kind: seg | line | rayL (start at left point) | rayR (start at right point)
  let s='';
  if(kind==='seg')s=hl(xa,xb);
  if(kind==='line')s=hl(10,310);
  if(kind==='rayL')s=hl(xa,310);
  if(kind==='rayR')s=hl(10,xb);
  return s+tk(xa,A)+tk(xb,B);
}
const twoPts=()=>{const [A,B]=letters(2);const xa=ri(55,110),xb=ri(200,265);return{A,B,xa,xb}};

const TOPICS=[
 {id:'primka',icon:'↔',name:'Přímka',
  lesson:()=>`<p><b>Přímka</b> je nekonečně dlouhá přímá čára. Nemá začátek ani konec, a proto <b>její délku nelze změřit</b>.</p>
   <div class="geo">${geoSvg(hl(10,310)+tk(110,'A')+tk(220,'B')+`<text class="it" x="295" y="82">p</text>`)}</div>
   <p>Přímky pojmenováváme <b>malými písmeny</b> (p, q, r…) nebo dvěma body, kterými prochází.</p><span class="zap">${LN}AB &nbsp;·&nbsp; přímka p</span>
   <p>Dvěma body vede jen jedna přímka.</p>`,
  gen:[
   ()=>{const{A,B,xa,xb}=twoPts();return{svg:drawKind('line',A,B,xa,xb),q:'Co je na obrázku?',opts:shuffle(['přímka','polopřímka','úsečka']),ans:'přímka',exp:`Čára pokračuje za oba body ${A} i ${B} až do nekonečna. Je to přímka ${LN}${A}${B}.`}},
   ()=>({svg:'',q:'Můžeme změřit délku přímky?',opts:shuffle(['Ne, je nekonečně dlouhá','Ano, pravítkem','Jen v milimetrech']),ans:'Ne, je nekonečně dlouhá',exp:'Přímka nemá začátek ani konec, takže délku nemá.'}),
   ()=>({svg:'',q:'Kolik krajních bodů má přímka?',opts:['0','1','2'],ans:'0',exp:'Přímka nemá žádný krajní bod, pokračuje na obě strany donekonečna.'}),
   ()=>{const[A,B]=letters(2);return{svg:'',q:`Jak zapíšeš přímku, která prochází body ${A} a ${B}?`,opts:shuffle([LN+A+B,RY+A+B,A+B,`|${A}${B}|`]),ans:LN+A+B,exp:`Přímku zapisujeme se šipkou na obě strany: ${LN}${A}${B}.`}},
   ()=>({svg:'',q:'Jakými písmeny pojmenováváme přímky?',opts:shuffle(['malými (p, q, r)','velkými (P, Q, R)','čísly (1, 2, 3)']),ans:'malými (p, q, r)',exp:'Přímky popisujeme malými písmeny, body velkými.'}),
   ()=>({svg:'',q:'Kolik přímek vede dvěma různými body?',opts:shuffle(['jedna','dvě','nekonečně mnoho']),ans:'jedna',exp:'Dvěma body můžeme vést jen jednu přímku.'})
  ]},
 {id:'polo',icon:'↦',name:'Polopřímka',
  lesson:()=>`<p><b>Polopřímka</b> je část přímky. Má vždy <b>počáteční bod</b> a na druhou stranu pokračuje bez konce.</p>
   <div class="geo">${geoSvg(hl(80,310)+tk(80,'A')+tk(210,'B'))}</div>
   <span class="zap">${RY}AB</span><p>Při zápisu píšeme <b>první počátek</b>. ${RY}AB začíná v A, ${RY}BA začíná v B. Jsou to dvě různé polopřímky!</p>`,
  gen:[
   ()=>{const{A,B,xa,xb}=twoPts(),left=Math.random()<.5,ans=left?RY+A+B:RY+B+A;return{svg:drawKind(left?'rayL':'rayR',A,B,xa,xb),q:'Jak zapíšeš tuto polopřímku?',opts:shuffle([RY+A+B,RY+B+A,LN+A+B,A+B]),ans,exp:`Polopřímka začíná v bodě ${left?A:B}, ten píšeme první: ${ans}.`}},
   ()=>{const{A,B,xa,xb}=twoPts(),left=Math.random()<.5;return{svg:drawKind(left?'rayL':'rayR',A,B,xa,xb),q:'Ve kterém bodě tato polopřímka začíná?',opts:[A,B],ans:left?A:B,exp:`Na straně bodu ${left?A:B} čára končí. Tam je počátek, za druhým bodem pokračuje dál.`}},
   ()=>({svg:'',q:'Kolik počátečních bodů má polopřímka?',opts:['0','1','2'],ans:'1',exp:'Polopřímka má právě jeden počáteční bod.'}),
   ()=>{const[A,B]=letters(2);return{svg:'',q:`Je ${RY}${A}${B} stejná polopřímka jako ${RY}${B}${A}?`,opts:['Ne, mají jiný počátek','Ano, je to totéž'],ans:'Ne, mají jiný počátek',exp:`${RY}${A}${B} začíná v ${A} a míří k ${B}. ${RY}${B}${A} začíná v ${B} a míří opačně.`}},
   ()=>({svg:'',q:'Polopřímka je…',opts:shuffle(['část přímky s jedním počátkem','část přímky se dvěma krajními body','čára bez začátku a konce']),ans:'část přímky s jedním počátkem',exp:'Polopřímka = část přímky, má vždy počáteční bod.'}),
   ()=>{const{A,B,xa,xb}=twoPts();return{svg:drawKind('rayL',A,B,xa,xb),q:'Co je na obrázku?',opts:shuffle(['polopřímka','přímka','úsečka']),ans:'polopřímka',exp:`Čára začíná v ${A} a za ${B} pokračuje dál. Je to polopřímka ${RY}${A}${B}.`}}
  ]},
 {id:'usecka',icon:'—',name:'Úsečka',
  lesson:()=>`<p><b>Úsečka</b> je část přímky, která má <b>dva krajní body</b>. Proto můžeme <b>změřit její délku</b>.</p>
   <div class="geo">${geoSvg(hl(70,250)+tk(70,'A')+tk(250,'B'))}</div>
   <p>Úsečku zapíšeme jen dvěma písmeny. Délku zapíšeme se svislými čárkami:</p><span class="zap">úsečka AB &nbsp;·&nbsp; |AB| = 11,4 cm</span>`,
  gen:[
   ()=>{const{A,B,xa,xb}=twoPts();return{svg:drawKind('seg',A,B,xa,xb),q:'Co je na obrázku?',opts:shuffle(['úsečka','polopřímka','přímka']),ans:'úsečka',exp:`Čára začíná v ${A} a končí v ${B}. Je to úsečka ${A}${B}.`}},
   ()=>({svg:'',q:'Kolik krajních bodů má úsečka?',opts:['0','1','2'],ans:'2',exp:'Úsečka má vždy dva krajní body.'}),
   ()=>({svg:'',q:'Co z toho můžeme změřit pravítkem?',opts:shuffle(['úsečku','přímku','polopřímku']),ans:'úsečku',exp:'Jen úsečka má začátek i konec, a tedy délku.'}),
   ()=>{const[A,B]=letters(2);return{svg:'',q:`Který zápis znamená DÉLKU úsečky ${A}${B}?`,opts:shuffle([`|${A}${B}|`,LN+A+B,RY+A+B,A+B]),ans:`|${A}${B}|`,exp:`Délku zapisujeme mezi svislé čárky: |${A}${B}| = … cm.`}},
   ()=>{const[A,B]=letters(2);return{svg:'',q:`Jak zapíšeš úsečku s krajními body ${A} a ${B}?`,opts:shuffle([A+B,RY+A+B,LN+A+B,`|${A}${B}|`]),ans:A+B,exp:`Úsečku zapíšeme jen písmeny krajních bodů: ${A}${B}.`}},
   ()=>({svg:'',q:'Úsečka je…',opts:shuffle(['část přímky se dvěma krajními body','nekonečná přímá čára','část přímky s jedním počátkem']),ans:'část přímky se dvěma krajními body',exp:'Úsečka = část přímky, vždy dva krajní body.'})
  ]},
 {id:'poznej',icon:'🔎',name:'Poznej a zapiš',
  lesson:()=>`<p>Podívej se, kde čára <b>končí</b>:</p>
   <p>• končí u obou bodů → <b>úsečka</b> AB</p><p>• končí u jednoho bodu → <b>polopřímka</b>, počátek píšeme první: ${RY}AB nebo ${RY}BA</p><p>• nekončí nikde → <b>přímka</b> ${LN}AB</p>
   <div class="geo">${geoSvg(hl(200,310,40)+tk(200,'E',40,true)+tk(280,'F',40,true)+hl(10,140,140)+tk(60,'G',140)+tk(140,'H',140))}</div>
   <p>Nahoře je ${RY}EF (začíná v E), dole ${RY}HG (začíná v H).</p>`,
  gen:[()=>{const{A,B,xa,xb}=twoPts(),kind=pick(['seg','line','rayL','rayR']);
    const ans={seg:A+B,line:LN+A+B,rayL:RY+A+B,rayR:RY+B+A}[kind];
    const exp={seg:`Čára končí u obou bodů, je to úsečka ${A}${B}.`,line:`Čára pokračuje za oba body, je to přímka ${LN}${A}${B}.`,rayL:`Čára končí jen u bodu ${A}, to je počátek: ${RY}${A}${B}.`,rayR:`Čára končí jen u bodu ${B}, to je počátek: ${RY}${B}${A}.`}[kind];
    return{svg:drawKind(kind,A,B,xa,xb),q:'Co je na obrázku? Vyber správný zápis.',opts:shuffle([A+B,LN+A+B,RY+A+B,RY+B+A]),ans,exp}}]},
 {id:'delka',icon:'📏',name:'Měření délky',
  lesson:()=>`<p>Úsečku měříme pravítkem. <b>Nulu</b> přiložíme ke krajnímu bodu a čteme, kde je druhý bod.</p>
   <div class="geo">${geoSvg(rulerSvg(0,62))}</div><span class="zap">|AB| = 62 mm = 6,2 cm</span>
   <p>Když úsečka nezačíná na nule, <b>odečteme</b>: konec − začátek.</p>`,
  gen:[()=>{const L=Math.random()<.4?ri(2,9)*10:ri(15,90),s=Math.random()<.6?0:ri(1,Math.floor((100-L)/10))*10,cm=L%10===0&&Math.random()<.6;
    const [A,B]=letters(2),ans=cm?`${L/10} cm`:`${L} mm`;
    const wrong=cm?[`${L/10+1} cm`,`${Math.max(1,L/10-1)} cm`,`${L} cm`,`${(s+L)/10} cm`]:[`${L+10} mm`,`${L-10>0?L-10:L+5} mm`,`${L} cm`,`${s+L} mm`];
    return{svg:rulerSvg(s,L,A,B),q:`Jak dlouhá je úsečka ${A}${B}? |${A}${B}| = ?`,opts:optsOf(ans,s?[wrong[3],...wrong.slice(0,3)]:wrong),ans,
     exp:s?`${A} je na ${fmtN(s/10)} cm, ${B} na ${fmtN((s+L)/10)} cm. Odečteme: ${s+L} mm − ${s} mm = ${L} mm${cm?` = ${L/10} cm`:''}.`:`Úsečka začíná na nule a končí na ${L} mm${L%10?` (${fmtN(L/10)} cm)`:` = ${L/10} cm`}.`}}]},
 {id:'jednotky',icon:'🔁',name:'Jednotky délky',
  lesson:()=>`<span class="zap">1 cm = 10 mm</span><span class="zap">1 dm = 10 cm = 100 mm</span>
   <p>Z cm na mm: <b>× 10</b> (3 cm = 30 mm). Z mm na cm: <b>: 10</b> (50 mm = 5 cm).</p><p>Desetinná čárka: 11,4 cm = 114 mm, 62 mm = 6,2 cm.</p>`,
  gen:[
   ()=>{const x=ri(2,15);return{svg:'',q:`${x} cm = ? mm`,opts:optsOf(`${x*10} mm`,[`${x*100} mm`,`${x} mm`,`${x*10+5} mm`]),ans:`${x*10} mm`,exp:`1 cm = 10 mm, takže ${x} · 10 = ${x*10} mm.`}},
   ()=>{const y=ri(2,15)*10;return{svg:'',q:`${y} mm = ? cm`,opts:optsOf(`${y/10} cm`,[`${y} cm`,`${y*10} cm`,`${y/10+1} cm`]),ans:`${y/10} cm`,exp:`10 mm = 1 cm, takže ${y} : 10 = ${y/10} cm.`}},
   ()=>{const z=ri(1,5),mm=Math.random()<.4;return mm?{svg:'',q:`${z} dm = ? mm`,opts:optsOf(`${z*100} mm`,[`${z*10} mm`,`${z*1000} mm`,`${z} mm`]),ans:`${z*100} mm`,exp:`1 dm = 100 mm, takže ${z} dm = ${z*100} mm.`}
     :{svg:'',q:`${z} dm = ? cm`,opts:optsOf(`${z*10} cm`,[`${z*100} cm`,`${z} cm`,`${z*10+5} cm`]),ans:`${z*10} cm`,exp:`1 dm = 10 cm, takže ${z} dm = ${z*10} cm.`}},
   ()=>{const a=ri(2,14),b=ri(1,9);return{svg:'',q:`${a},${b} cm = ? mm`,opts:optsOf(`${a*10+b} mm`,[`${a+b} mm`,`${a*100+b} mm`,`${a*10+b+10} mm`]),ans:`${a*10+b} mm`,exp:`${a} cm = ${a*10} mm a ještě ${b} mm, celkem ${a*10+b} mm.`}},
   ()=>{let m;do{m=ri(21,99)}while(m%10===0);return{svg:'',q:`${m} mm = ? cm`,opts:optsOf(`${fmtN(m/10)} cm`,[`${m} cm`,`${fmtN(m/100)} cm`,`${fmtN(m/10+1)} cm`]),ans:`${fmtN(m/10)} cm`,exp:`${m} mm = ${Math.floor(m/10)} cm a ${m%10} mm, tedy ${fmtN(m/10)} cm.`}},
   ()=>{const c=ri(3,9),d=pick([c*10,c*10-ri(1,4),c*10+ri(1,4)]),ans=d===c*10?'jsou stejně dlouhé':d<c*10?`${c} cm`:`${d} mm`;return{svg:'',q:`Co je delší: ${c} cm, nebo ${d} mm?`,opts:[`${c} cm`,`${d} mm`,'jsou stejně dlouhé'],ans,exp:`${c} cm = ${c*10} mm. Porovnáme ${c*10} mm a ${d} mm.`}}
  ]},
 {id:'shodne',icon:'≅',name:'Shodné úsečky',
  lesson:()=>`<p><b>Shodné úsečky</b> jsou úsečky, které mají <b>stejnou délku</b>.</p><span class="zap">AB ≅ CD</span>
   <div class="geo">${geoSvg(hl(40,160,60)+tk(40,'A',60,true)+tk(160,'B',60,true)+hl(150,270,150)+tk(150,'C',150)+tk(270,'D',150))}</div>
   <p>Pozor na jednotky: 5 cm a 50 mm je stejná délka, takže úsečky jsou shodné.</p>`,
  gen:[
   ()=>({svg:'',q:'Úsečky, které mají stejnou délku, jsou…',opts:shuffle(['shodné','kolmé','rovnoběžné','opačné']),ans:'shodné',exp:'Stejná délka = shodné úsečky.'}),
   ()=>{const[A,B,C,D]=letters(4);return{svg:'',q:`Jak zapíšeš, že úsečky ${A}${B} a ${C}${D} jsou shodné?`,opts:shuffle([`${A}${B} ≅ ${C}${D}`,`${A}${B} ∥ ${C}${D}`,`${A}${B} ⊥ ${C}${D}`,`${A}${B} ∈ ${C}${D}`]),ans:`${A}${B} ≅ ${C}${D}`,exp:'Shodnost zapisujeme značkou ≅.'}},
   ()=>{const x=ri(2,9),c=[[`CD (|CD| = ${x*10} mm)`,1],[`EF (|EF| = ${x} mm)`,0],[`GH (|GH| = ${x*10+5} mm)`,0],[`KL (|KL| = ${x+1} cm)`,0]];return{svg:'',q:`|AB| = ${x} cm. Která úsečka je s AB shodná?`,opts:shuffle(c.map(z=>z[0])),ans:c[0][0],exp:`${x} cm = ${x*10} mm, takže AB ≅ CD.`}},
   ()=>{const x=ri(2,9),same=Math.random()<.5,d=same?x*10:x*10+pick([-5,-3,3,5]);return{svg:'',q:`|AB| = ${x} cm, |CD| = ${d} mm. Jsou úsečky shodné?`,opts:[`Ano, AB ≅ CD`,'Ne, nejsou'],ans:same?'Ano, AB ≅ CD':'Ne, nejsou',exp:`${x} cm = ${x*10} mm${same?', délky jsou stejné.':`, ale CD má ${d} mm.`}`}}
  ]},
 {id:'lezi',icon:'∈',name:'Leží, neleží',
  lesson:()=>`<p>Značka <b>∈</b> znamená „leží na“, <b>∉</b> znamená „neleží na“.</p>
   <div class="geo">${geoSvg(hl(10,310,110,'g-faint')+hl(110,230,110)+tk(50,'A',110)+tk(110,'R',110)+tk(230,'S',110)+tk(285,'B',110)+gpt({x:170,y:50})+'<text x="186" y="40">C</text>')}</div>
   <p>Na úsečce RS leží jen body <b>mezi R a S</b>. Bod B leží na stejné přímce, ale mimo úsečku.</p><span class="zap">R ∈ RS &nbsp; B ∉ RS &nbsp; C ∉ RS</span>`,
  gen:[()=>{const xs={A:40,R:100,M:160,S:220,B:280},t={A:0,R:1,M:2,S:3,B:4};
    const obj=pick(['seg','seg','rayRS','raySR','line']),P=pick(['A','R','M','S','B','C','C']);
    const name={seg:'RS',rayRS:RY+'RS',raySR:RY+'SR',line:LN+'RS'}[obj];
    const on=P==='C'?false:obj==='seg'?t[P]>=1&&t[P]<=3:obj==='rayRS'?t[P]>=1:obj==='raySR'?t[P]<=3:true;
    const svg=hl(10,310)+Object.keys(xs).map(k=>tk(xs[k],k)).join('')+gpt({x:150,y:45})+'<text x="166" y="35">C</text>';
    const what={seg:'úsečce RS',rayRS:`polopřímce ${RY}RS`,raySR:`polopřímce ${RY}SR`,line:`přímce ${LN}RS`}[obj];
    let exp;if(P==='C')exp=`Bod C vůbec neleží na čáře, proto C ∉ ${name}.`;
    else if(on)exp=obj==='seg'?`Bod ${P} je mezi R a S (nebo je krajní), proto ${P} ∈ RS.`:obj==='line'?`Přímka vede přes všechny body na čáře, i přes ${P}.`:`Polopřímka ${name} začíná v ${name[1]} a míří přes ${name[2]} dál. Bod ${P} na ní leží.`;
    else exp=obj==='seg'?`Bod ${P} leží na přímce, ale mimo úsečku RS (není mezi R a S), proto ${P} ∉ RS.`:`Polopřímka ${name} začíná v ${name[1]} a míří k ${name[2]}. Bod ${P} je na druhé straně od počátku, proto ${P} ∉ ${name}.`;
    return{svg,q:`Leží bod ${P} na ${what}?`,opts:[`${P} ∈ ${name}`,`${P} ∉ ${name}`],ans:on?`${P} ∈ ${name}`:`${P} ∉ ${name}`,exp}}]},
 {id:'opacne',icon:'⇆',name:'Opačné polopřímky',
  lesson:()=>`<p><b>Opačné polopřímky</b> mají <b>společný počátek</b> a míří <b>na opačné strany</b>.</p>
   <div class="geo">${geoSvg(hl(10,160,70,'g-line op1')+hl(160,310,70,'g-line op2')+tk(50,'S',70)+tk(160,'R',70)+tk(270,'T',70)+hl(60,310,160)+tk(60,'B',160)+tk(170,'C',160)+tk(270,'A',160))}</div>
   <p>Nahoře: ${RY}RS a ${RY}RT jsou navzájem opačné.</p><p>Dole: ${RY}BA a ${RY}BC míří stejným směrem. Nejsou opačné, mají spoustu společných bodů.</p>`,
  gen:[
   ()=>{const ls=letters(3),pos=[60,160,260];const P=pick(ls),[Q,R]=ls.filter(x=>x!==P);const opp=ls.indexOf(P)===1;
    return{svg:hl(10,310)+ls.map((l,i)=>tk(pos[i],l)).join(''),q:`Jsou polopřímky ${RY}${P}${Q} a ${RY}${P}${R} opačné?`,opts:['Ano, jsou opačné','Ne, nejsou opačné'],ans:opp?'Ano, jsou opačné':'Ne, nejsou opačné',
     exp:opp?`Obě začínají v ${P} a míří na opačné strany.`:`Obě začínají v ${P}, ale míří stejným směrem. Mají spoustu společných bodů, opačné nejsou.`}},
   ()=>({svg:hl(60,60,0,'g-line')+`<line class="g-line" x1="60" y1="30" x2="60" y2="170"/><line class="g-line" x1="60" y1="170" x2="300" y2="170"/>`+`<line class="g-tick" x1="51" y1="70" x2="69" y2="70"/><text x="38" y="76">V</text><line class="g-tick" x1="220" y1="161" x2="220" y2="179"/><text x="220" y="196" text-anchor="middle">T</text><text x="40" y="190">A</text>`,
     q:`Jsou polopřímky ${RY}AV a ${RY}AT opačné?`,opts:['Ano, jsou opačné','Ne, nejsou opačné'],ans:'Ne, nejsou opačné',exp:'Mají společný počátek A, ale nemíří na opačné strany. Svírají pravý úhel.'}),
   ()=>({svg:'',q:'Opačné polopřímky mají…',opts:shuffle(['společný počátek a opačný směr','různé počátky','stejný směr']),ans:'společný počátek a opačný směr',exp:'Opačné polopřímky začínají ve stejném bodě a míří od sebe.'})
  ]},
 {id:'naprimce',icon:'📐',name:'Úsečky na přímce',
  lesson:()=>`<p>Když leží body na jedné přímce, délky úseček se <b>sčítají</b>.</p>
   <div class="geo">${geoSvg(hl(10,310)+tk(40,'F')+tk(130,'G')+tk(280,'H')+'<text x="85" y="78" text-anchor="middle" class="rn2">3 cm</text><text x="205" y="78" text-anchor="middle" class="rn2">5 cm</text>')}</div>
   <span class="zap">|FH| = |FG| + |GH| = 3 + 5 = 8 cm</span>
   <p>Kolik úseček určují body? 3 body → 3 úsečky, 4 body → 6, 5 bodů → 10.</p>`,
  gen:[
   ()=>{const[F,G,H]=letters(3),x=ri(2,7),y=ri(2,7),k=260/(x+y),xg=30+x*k;
    return{svg:hl(10,310)+tk(30,F)+tk(xg,G)+tk(290,H)+`<text x="${f1((30+xg)/2)}" y="78" text-anchor="middle" class="rn2">${x} cm</text><text x="${f1((xg+290)/2)}" y="78" text-anchor="middle" class="rn2">${y} cm</text>`,
     q:`|${F}${H}| = ?`,opts:optsOf(`${x+y} cm`,[`${Math.abs(x-y)||x+y+2} cm`,`${x+y+1} cm`,`${x*y} cm`]),ans:`${x+y} cm`,exp:`|${F}${H}| = |${F}${G}| + |${G}${H}| = ${x} + ${y} = ${x+y} cm.`}},
   ()=>{const[F,G,H]=letters(3),x=ri(2,6),y=ri(2,6),k=260/(x+y),xg=30+x*k;
    return{svg:hl(10,310)+tk(30,F)+tk(xg,G)+tk(290,H),q:`|${F}${H}| = ${x+y} cm a |${F}${G}| = ${x} cm. Kolik je |${G}${H}|?`,opts:optsOf(`${y} cm`,[`${x+y+x} cm`,`${y+1} cm`,`${x} cm`]),ans:`${y} cm`,exp:`|${G}${H}| = |${F}${H}| − |${F}${G}| = ${x+y} − ${x} = ${y} cm.`}},
   ()=>{const n=pick([3,4,5]),ls=letters(n).sort(),xs=ls.map((_,i)=>30+i*260/(n-1));const pairs=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)pairs.push(ls[i]+ls[j]);
    return{svg:hl(10,310)+ls.map((l,i)=>tk(xs[i],l)).join(''),q:`Kolik různých úseček určují body ${ls.join(', ')}?`,opts:['3','4','6','10'],ans:String(pairs.length),exp:`Úsečky: ${pairs.join(', ')}. Celkem ${pairs.length}.`}}
  ]},
 {id:'poloha',icon:'⊥',name:'Rovnoběžky a kolmice',
  lesson:()=>`<p><b>Rovnoběžky</b> se nikdy neprotnou: <b>a ∥ b</b>.</p><p><b>Různoběžky</b> se protnou v jednom bodě (průsečík): <b>a ∦ b</b>.</p>
   <p><b>Kolmé přímky</b> svírají <b>pravý úhel</b>: <b>a ⊥ b</b>. Rýsujeme je s trojúhelníkem s ryskou.</p>
   <div class="geo">${geoSvg(polohaSvg('kolme','a','b'))}</div>`,
  gen:[
   ()=>{const k=pick(['rovno','ruzno','kolme']),[p,q]=pick([['p','q'],['a','b'],['r','s'],['k','m']]);
    const L={rovno:`rovnoběžné (${p} ∥ ${q})`,ruzno:`různoběžné (${p} ∦ ${q})`,kolme:`kolmé (${p} ⊥ ${q})`};
    return{svg:polohaSvg(k,p,q),q:`Jaká je vzájemná poloha přímek ${p} a ${q}?`,opts:[L.rovno,L.ruzno,L.kolme],ans:L[k],
     exp:{rovno:'Přímky se nikdy neprotnou, jsou rovnoběžné.',ruzno:'Přímky se protínají, ale ne v pravém úhlu. Jsou různoběžné.',kolme:'Přímky se protínají v pravém úhlu (značka v rohu). Jsou kolmé.'}[k]}},
   ()=>{const it=pick([
     {q:'Kolmé přímky svírají…',o:['pravý úhel','žádný úhel','ostrý úhel'],a:'pravý úhel',e:'Kolmé přímky svírají pravý úhel (90°).'},
     {q:'Kolik společných bodů mají dvě rovnoběžky?',o:['žádný','jeden','dva'],a:'žádný',e:'Rovnoběžky se nikdy neprotnou.'},
     {q:'Co znamená zápis a ∦ b?',o:['a a b jsou různoběžné','a je kolmá na b','a a b jsou rovnoběžné'],a:'a a b jsou různoběžné',e:'Přeškrtnutá značka ∦ znamená „nejsou rovnoběžné“, tedy různoběžné.'},
     {q:'Co znamená zápis p ⊥ r?',o:['p je kolmá na r','p je rovnoběžná s r','bod p leží na r'],a:'p je kolmá na r',e:'Značka ⊥ znamená „je kolmá na“.'},
     {q:'Bod, ve kterém se protnou dvě různoběžky, je…',o:['průsečík','počátek','krajní bod'],a:'průsečík',e:'Společný bod dvou různoběžek je průsečík.'},
     {q:'Čím rýsujeme kolmici?',o:['trojúhelníkem s ryskou','kružítkem','úhloměrem'],a:'trojúhelníkem s ryskou',e:'Kolmici rýsujeme trojúhelníkem s ryskou.'}]);
     return{svg:'',q:it.q,opts:shuffle(it.o),ans:it.a,exp:it.e}},
   ()=>{const{svg,tr,fa}=statSvg();const ans=pick(tr);return{svg,q:'Který zápis platí?',opts:shuffle([ans,...shuffle(fa).slice(0,2)]),ans,exp:'a a b jsou rovnoběžky, c je protíná. Bod S je průsečík přímek b a c, na přímce a neleží.'}}
  ]}
];
function rulerSvg(s,L,A='A',B='B'){const x0=20,k=2.8,y=120;let r=`<rect x="${x0-8}" y="${y}" width="${100*k+16}" height="52" rx="6" fill="#FFF3C4" stroke="#2B2350" stroke-width="2"/>`;
  for(let m=0;m<=100;m++){const x=x0+m*k,h=m%10===0?18:m%5===0?11:6;r+=`<line x1="${f1(x)}" y1="${y}" x2="${f1(x)}" y2="${y+h}" stroke="#2B2350" stroke-width="${m%10===0?1.6:1}"/>`;if(m%10===0)r+=`<text class="rn" x="${f1(x)}" y="${y+36}" text-anchor="middle">${m/10}</text>`}
  const xa=x0+s*k,xb=x0+(s+L)*k;
  return r+`<line x1="${f1(xa)}" y1="80" x2="${f1(xa)}" y2="${y}" stroke="#6F5BFF" stroke-dasharray="3 3"/><line x1="${f1(xb)}" y1="80" x2="${f1(xb)}" y2="${y}" stroke="#6F5BFF" stroke-dasharray="3 3"/>`+
   `<line class="g-line" x1="${f1(xa)}" y1="80" x2="${f1(xb)}" y2="80"/>`+tk(xa,A,80,true)+tk(xb,B,80,true);}
function polohaSvg(k,p,q){const c={x:160,y:100};
  if(k==='rovno'){const a=ri(-25,25)*Math.PI/180,d={x:Math.cos(a),y:Math.sin(a)},n={x:-d.y,y:d.x},c1={x:c.x+n.x*35,y:c.y+n.y*35},c2={x:c.x-n.x*35,y:c.y-n.y*35};
    const e1=toEdge(c1,d),e2=toEdge(c2,d);return gl(toEdge(c1,neg(d)),e1)+gl(toEdge(c2,neg(d)),e2)+`<text class="it" x="${f1(e1.x-14)}" y="${f1(e1.y-10)}">${p}</text><text class="it" x="${f1(e2.x-14)}" y="${f1(e2.y+22)}">${q}</text>`}
  const a1=ri(-20,20),a2=a1+(k==='kolme'?90:pick([1,-1])*ri(30,60));const d1={x:Math.cos(a1*Math.PI/180),y:Math.sin(a1*Math.PI/180)},d2={x:Math.cos(a2*Math.PI/180),y:Math.sin(a2*Math.PI/180)};
  const e1=toEdge(c,d1),e2=toEdge(c,d2);let s=gl(toEdge(c,neg(d1)),e1)+gl(toEdge(c,neg(d2)),e2)+`<text class="it" x="${f1(e1.x-16)}" y="${f1(e1.y-10)}">${p}</text><text class="it" x="${f1(e2.x+(e2.x>160?-18:8))}" y="${f1(e2.y+(e2.y>100?-6:20))}">${q}</text>`;
  if(k==='kolme'){const m=14;s+=`<polyline points="${f1(c.x+d1.x*m)},${f1(c.y+d1.y*m)} ${f1(c.x+d1.x*m+d2.x*m)},${f1(c.y+d1.y*m+d2.y*m)} ${f1(c.x+d2.x*m)},${f1(c.y+d2.y*m)}" fill="none" stroke="#FF5C93" stroke-width="3"/><circle cx="${f1(c.x+(d1.x+d2.x)*m/2)}" cy="${f1(c.y+(d1.y+d2.y)*m/2)}" r="2.5" fill="#FF5C93"/>`}
  return s;}
function statSvg(){const ang=ri(-35,-20)*Math.PI/180,d={x:Math.cos(ang),y:Math.sin(ang)};const pa={x:120,y:90},pb={x:170,y:130};
  const yc=150,tb=(yc-pb.y)/d.y,S={x:pb.x+d.x*tb,y:yc};
  const s=gl(toEdge(pa,neg(d)),toEdge(pa,d))+gl(toEdge(pb,neg(d)),toEdge(pb,d))+gl({x:10,y:yc},{x:310,y:yc})+gpt(S)+`<text x="${f1(S.x-4)}" y="${yc+28}" text-anchor="middle">S</text>`+
    `<text class="it" x="${f1(toEdge(pa,d).x-18)}" y="${f1(toEdge(pa,d).y+20)}">a</text><text class="it" x="${f1(toEdge(pb,d).x-6)}" y="${f1(toEdge(pb,d).y+30)}">b</text><text class="it" x="296" y="${yc-10}">c</text>`;
  return{svg:s,tr:['a ∥ b','c ∦ a','c ∦ b','S ∈ b','S ∈ c','S ∉ a'],fa:['a ∦ b','c ∥ a','S ∈ a','S ∉ c','a ⊥ b','c ∥ b']}}

