
/* ================= Bea: course "Vlastivěda – naše vlast" ================= */
const FLAG=`<rect x="60" y="34" width="200" height="133" fill="#fff" stroke="#2B2350" stroke-width="2"/><rect x="60" y="100.5" width="200" height="66.5" fill="#D7141A"/><polygon points="60,34 160,100.5 60,167" fill="#11457E"/><rect x="60" y="34" width="200" height="133" fill="none" stroke="#2B2350" stroke-width="2"/>`;
const FLAGQ=(q,ans,others,exp)=>()=>({svg:FLAG,q,opts:shuffle([ans,...others]),ans,exp});
const SVATKY=[['1. ledna','Den obnovy samostatného českého státu'],['8. května','Den vítězství'],['5. července','Den slovanských věrozvěstů Cyrila a Metoděje'],
  ['6. července','Den upálení mistra Jana Husa'],['28. září','Den české státnosti (svatý Václav)'],['28. října','Den vzniku samostatného československého státu'],['17. listopadu','Den boje za svobodu a demokracii']];
const svDate=()=>{const[d,n]=pick(SVATKY);return{svg:'',q:`Kdy slavíme: ${n}?`,opts:shuffle([d,...shuffle(SVATKY.filter(x=>x[0]!==d)).slice(0,2).map(x=>x[0])]),ans:d,exp:`${n} slavíme ${d}.`}};
const svName=()=>{const[d,n]=pick(SVATKY);return{svg:'',q:`Jaký státní svátek slavíme ${d}?`,opts:shuffle([n,...shuffle(SVATKY.filter(x=>x[0]!==d)).slice(0,2).map(x=>x[1])]),ans:n,exp:`${d}: ${n}.`}};
const VL_TOPICS=[
 {id:'stat',icon:'🗺️',name:'Stát a jeho členění',
  lesson:()=>`<p>Každý stát je dán třemi věcmi:</p>${li(['vymezeným <b>územím</b>','způsobem <b>vlády</b>','svými <b>obyvateli</b>, tedy lidmi, kteří v něm žijí'])}
   <p>Česká republika se dělí na <b>kraje</b> a kraje se dělí na <b>obce</b>.</p><p class="center"><b>Česká republika ➜ kraj ➜ obec</b></p>
   ${li(['Hlavní město je <b>Praha</b>.','Území tvoří <b>Čechy, Morava a Slezsko</b>.','Česká republika vznikla <b>1. ledna 1993</b>, když se rozdělilo Československo.'])}`,
  gen:[
   MC('Čím je dán každý stát?','územím, vládou a obyvateli',['jen hlavním městem','jen vlajkou a hymnou'],'Stát je dán vymezeným územím, způsobem vlády a obyvateli.'),
   MC('Na co se dělí Česká republika?','na kraje',['na státy','na ulice'],'ČR se dělí na kraje, kraje na obce.'),
   MC('Na co se dělí kraje?','na obce',['na státy','na republiky'],'Kraje se dělí na obce.'),
   MC('Doplň schéma: Česká republika ➜ ? ➜ obec','kraj',['stát','Evropa'],'Česká republika ➜ kraj ➜ obec.'),
   MC('Doplň schéma: Česká republika ➜ kraj ➜ ?','obec',['světadíl','republika'],'Nejmenší je obec.'),
   MC('Jaké je hlavní město České republiky?','Praha',['Brno','Ostrava'],'Hlavním městem je Praha.'),
   MC('Které tři země tvoří území ČR?','Čechy, Morava a Slezsko',['Čechy, Slovensko a Polsko','Praha, Brno a Ostrava'],'Území ČR tvoří Čechy, Morava a Slezsko.'),
   MC('Kdy vznikla Česká republika?','1. ledna 1993',['28. října 1918','1. května 2004'],'ČR vznikla 1. 1. 1993 rozdělením Československa.'),
   MC('Z jakého státu Česká republika vznikla?','z Československa',['z Rakouska','z Polska'],'1. 1. 1993 se Československo rozdělilo na Česko a Slovensko.'),
   MC('Který panovník získal v roce 1212 dědičný královský titul a potvrzení hranic?','Přemysl Otakar I.',['Karel IV.','Jan Hus'],'Zlatá bula sicilská (1212) potvrdila královský titul Přemyslu Otakarovi I.')]},
 {id:'demo',icon:'🏛️',name:'Demokratický stát',
  lesson:()=>`<p>Česká republika je <b>demokratický stát</b>. Všichni mají <b>stejná práva, ale i povinnosti</b>.</p>
   ${li(['Základní právo je <b>právo volit</b>. Volit může každý občan od <b>18 let</b>.','Občané svobodně volí <b>své zástupce</b>.','<b>Parlament</b> = <b>Poslanecká sněmovna</b> (poslanci) a <b>Senát</b> (senátoři). Projednává a přijímá <b>zákony</b>.','V čele státu stojí <b>prezident</b>, volí se na <b>5 let</b>. Teď je to <b>Petr Pavel</b>. Prvním českým prezidentem byl <b>Václav Havel</b>.','Chod státu řídí <b>vláda</b>, skládá se z <b>premiéra (předsedy vlády) a ministrů</b>.','Na dodržování zákonů dbá <b>policie</b>, porušení zákonů trestá <b>soud</b>.','Nejvyšší zákon ČR je <b>Ústava</b>.'])}`,
  gen:[
   MC('Jakým státem je Česká republika?','demokratickým',['královstvím','diktaturou'],'ČR je demokratický stát.'),
   MC('Co platí v demokratickém státě?','všichni mají stejná práva i povinnosti',['bohatí mají víc práv','děti nemají žádná práva'],'V demokracii mají všichni stejná práva i povinnosti.'),
   MC('Od kolika let může občan volit?','od 18 let',['od 15 let','od 21 let'],'Volit může každý občan starší 18 let.'),
   MC('Kdo stojí v čele státu?','prezident',['premiér','starosta'],'V čele státu stojí prezident.'),
   MC('Na kolik let se volí prezident?','na 5 let',['na 4 roky','na 10 let'],'Prezident se volí na 5 let.'),
   MC('Kdo je teď prezidentem ČR?','Petr Pavel',['Václav Havel','Karel IV.'],'Současným prezidentem je Petr Pavel.'),
   MC('Kdo byl první český prezident?','Václav Havel',['Petr Pavel','Tomáš Garrigue Masaryk'],'První prezident České republiky byl Václav Havel (Masaryk byl první prezident Československa).'),
   MC('Kdo řídí chod státu?','vláda',['soud','policie'],'Chod státu řídí vláda.'),
   MC('Z koho se skládá vláda?','z premiéra a ministrů',['z poslanců a senátorů','z prezidenta a soudců'],'Vládu tvoří premiér a ministři.'),
   MC('Jak se jinak říká předsedovi vlády?','premiér',['prezident','poslanec'],'Předseda vlády = premiér.'),
   MC('Ze kterých dvou částí je parlament?','Poslanecká sněmovna a Senát',['vláda a soud','prezident a policie'],'Parlament tvoří Poslanecká sněmovna a Senát.'),
   MC('Co parlament projednává a přijímá?','zákony',['tresty','vysvědčení'],'Parlament schvaluje zákony.'),
   MC('Jak se jmenuje člen parlamentu volený voliči ve sněmovně?','poslanec',['ministr','soudce'],'Ve Sněmovně zasedají poslanci, v Senátu senátoři.'),
   MC('Kdo trestá porušení zákonů?','soud',['parlament','vláda'],'Porušení zákonů trestá soud.'),
   MC('Kdo dbá na dodržování zákonů?','policie',['senát','prezident'],'Na dodržování zákonů dbá policie.'),
   MC('Jaký je nejvyšší zákon ČR?','Ústava',['školní řád','hymna'],'Nejvyšší zákon ČR je Ústava.'),
   MC('Co je parlament?','shromáždění poslanců a senátorů',['instituce řídící chod státu','nejvyšší zákon'],'Parlament je shromáždění zástupců zvolených občany.'),
   YN('Mohou občané svobodně volit své zástupce?',true,'Ano, v demokracii občané svobodně volí své zástupce.')]},
 {id:'symboly',icon:'🇨🇿',name:'Státní symboly',
  lesson:()=>`<div class="geo">${geoSvg(FLAG)}</div><p>Státních symbolů je <b>sedm</b>:</p>${li(['<b>velký státní znak</b>','<b>malý státní znak</b> (český lev)','<b>státní barvy</b> (trikolóra: bílá, červená, modrá)','<b>státní vlajka</b>','<b>vlajka prezidenta</b> (prezidentská standarta) s heslem <b>Pravda vítězí</b>','<b>státní pečeť</b>','<b>státní hymna</b> „Kde domov můj?“'])}
   <p>Hymnu napsal <b>Josef Kajetán Tyl</b> (text), hudbu složil <b>František Škroup</b>. Je z divadelní hry <b>Fidlovačka</b>.</p>
   <p>Ve <b>velkém znaku</b> jsou 4 pole: dvakrát <b>český lev</b>, <b>moravská orlice</b> (červenobílá šachovaná) a <b>slezská orlice</b> (černá na zlatém).</p>
   <p>Neoficiální symboly: <b>lípa</b> (národní strom) a <b>korunovační klenoty</b>.</p>`,
  gen:[
   MC('Kolik je státních symbolů ČR?','7',['3','10'],'Státních symbolů je sedm.'),
   MC('Jak se jmenuje česká hymna?','Kde domov můj?',['Skákal pes','Ach, synku, synku'],'Státní hymna je „Kde domov můj?“.'),
   MC('Kdo napsal text hymny?','Josef Kajetán Tyl',['František Škroup','Karel Hynek Mácha'],'Text napsal J. K. Tyl.'),
   MC('Kdo složil hudbu hymny?','František Škroup',['Josef Kajetán Tyl','Bedřich Smetana'],'Hudbu složil František Škroup.'),
   MC('Ze které divadelní hry je hymna?','Fidlovačka',['Babička','Prodaná nevěsta'],'Hymna zazněla poprvé ve hře Fidlovačka.'),
   MC('Jaké heslo je na vlajce prezidenta?','Pravda vítězí',['Ať žije král','Svoboda a mír'],'Na prezidentské standartě je heslo Pravda vítězí.'),
   MC('Jak se jinak říká vlajce prezidenta?','prezidentská standarta',['trikolóra','pečeť'],'Vlajka prezidenta = prezidentská standarta.'),
   MC('Co je trikolóra?','státní barvy: bílá, červená, modrá',['velký státní znak','hymna'],'Trikolóra jsou státní barvy.'),
   MC('Co je na malém státním znaku?','český lev',['moravská orlice','lípa'],'Malý státní znak je český dvouocasý lev.'),
   MC('Co je ve velkém státním znaku?','český lev, moravská a slezská orlice',['jen lípa','koruna a meč'],'Velký znak: 2× český lev, moravská orlice, slezská orlice.'),
   MC('Kolik polí má velký státní znak?','4',['2','6'],'Velký znak má 4 pole.'),
   MC('Jaký je národní strom?','lípa',['dub','smrk'],'Národní strom je lípa.'),
   CL(x=>`Je „${x}“ státní symbol?`,{'Ano, oficiální':['státní pečeť','státní vlajka','státní hymna','malý státní znak','státní barvy','vlajka prezidenta','velký státní znak'],'Ne, neoficiální':['lípa','korunovační klenoty']},(x,g)=>g.startsWith('Ano')?`${x} patří mezi 7 státních symbolů.`:`${x} je neoficiální symbol.`),
   FLAGQ('Jakou barvu má klín na české vlajce?','modrou',['červenou','bílou'],'Klín u žerdi je modrý.'),
   FLAGQ('Jaký pruh je na vlajce nahoře?','bílý',['červený','modrý'],'Nahoře bílý pruh, dole červený, u žerdi modrý klín.'),
   FLAGQ('Jaký pruh je na vlajce dole?','červený',['bílý','modrý'],'Dole je červený pruh.')]},
 {id:'obyv',icon:'👨‍👩‍👧',name:'Obyvatelé ČR',
  lesson:()=>`${li(['V ČR žije asi <b>10,7 milionu</b> obyvatel.','Obyvatelé jsou většinou <b>občany ČR</b>, tedy <b>příslušníky státu</b>.','Většinu tvoří <b>Češi a Moravané</b>.','<b>Národnostní menšiny</b>: Slováci, Romové, Ukrajinci, Poláci, Vietnamci. Liší se <b>jazykem, kulturou a tradicemi</b>.','Všichni občané mají <b>stejná práva a povinnosti</b> bez ohledu na národnost či barvu pleti.','Ubližování kvůli národnosti nebo rase je <b>rasismus</b>, je to <b>trestný čin</b>.','<b>Cizinci</b> jsou občané jiných států. Nejvíc jich je z <b>Ukrajiny</b>, pak ze Slovenska a Vietnamu. Jejich počet <b>roste</b>.','Úřední jazyk je <b>čeština</b>. V různých oblastech lidé mluví <b>nářečím</b>.','Úvod Ústavy se jmenuje <b>preambule</b>.'])}`,
  gen:[
   MC('Kolik obyvatel žije v ČR?','asi 10,7 milionu',['asi 1 milion','asi 50 milionů'],'V ČR žije asi 10,7 milionu obyvatel.'),
   MC('Jak se říká příslušníkům státu?','občané',['cizinci','turisté'],'Občané jsou příslušníci státu.'),
   MC('Kdo tvoří většinu obyvatel ČR?','Češi a Moravané',['Vietnamci','Poláci'],'Většinu tvoří Češi a Moravané.'),
   MC('Která skupina je národnostní menšina v ČR?','Slováci',['Češi','Moravané'],'Menšiny: Slováci, Romové, Ukrajinci, Poláci, Vietnamci.'),
   MC('Čím se menšiny odlišují?','jazykem, kulturou a tradicemi',['jen oblečením','výškou'],'Menšiny se liší jazykem, kulturou a tradicemi.'),
   MC('Mají příslušníci menšin stejná práva?','ano, stejná práva i povinnosti',['ne, menší práva','jen povinnosti'],'Všichni občané mají stejná práva a povinnosti.'),
   MC('Jak se jmenuje ubližování kvůli národnosti nebo rase?','rasismus',['demokracie','vlastenectví'],'Je to rasismus a jde o trestný čin.'),
   MC('Kdo je cizinec?','občan jiného státu',['člověk z jiného kraje','každý turista z Prahy'],'Cizinci jsou občané jiných států.'),
   MC('Odkud je nejvíc cizinců v ČR?','z Ukrajiny',['z Polska','z Ruska'],'Nejpočetnější skupina cizinců je z Ukrajiny.'),
   MC('Počet cizinců v ČR v posledních letech…','roste',['klesá','je stále stejný'],'Z grafu: 2011 asi 434 tisíc, 2019 asi 593 tisíc.'),
   MC('Jaký je úřední jazyk ČR?','čeština',['angličtina','slovenština'],'Úředním jazykem je čeština.'),
   MC('Jak se jmenuje úvod Ústavy?','preambule',['hymna','kapitola'],'Úvodu Ústavy se říká preambule.'),
   YN('Je rasismus trestný čin?',true,'Ano, rasismus je trestný čin.')]},
 {id:'svatky',icon:'📅',name:'Státní svátky',
  lesson:()=>`<p>Státní svátky si připomínáme <b>z úcty</b> k důležitým událostem. Jsou to <b>dny pracovního klidu</b>.</p>
   <div class="lul">${SVATKY.map(([d,n])=>`<div><b>${d}</b> – ${n}</div>`).join('')}</div>
   ${li(['863 – na Velkou Moravu přišli <b>Cyril a Metoděj</b>, šířili <b>křesťanství</b> ve slovanském jazyce (písmo hlaholice).','935 – 28. září zavražděn <b>kníže Václav</b>, patron české země.','1415 – 6. července upálen <b>Jan Hus</b> v Kostnici za kázání proti nešvarům církve.','1918 – 28. října vznik <b>Československa</b>, dříve patřilo k <b>Rakousku-Uhersku</b>.','1939 studenti protestovali proti <b>nacistům</b>, 1989 proti <b>komunistům</b> (17. listopadu).','8. 5. 1945 – konec 2. světové války v Evropě, spojenci porazili <b>nacistické Německo</b>.','1. 1. 1993 – vznik <b>České republiky</b>.'])}
   <p><b>Ostatní svátky:</b> Nový rok, Velký pátek, Velikonoční pondělí, 1. máj (Svátek práce), 24. 12. Štědrý den, 25. a 26. 12. vánoční svátky.</p>`,
  gen:[svDate,svDate,svName,svName,
   MC('Ve kterém roce přišli Cyril a Metoděj na Velkou Moravu?','863',['1415','1918'],'Cyril a Metoděj přišli v roce 863.'),
   MC('Jaké náboženství šířili Cyril a Metoděj?','křesťanství',['islám','pohanství'],'Šířili křesťanství ve slovanském jazyce.'),
   MC('Kdy byl upálen Jan Hus?','6. července 1415',['28. září 935','17. listopadu 1989'],'Jan Hus byl upálen v Kostnici v roce 1415.'),
   MC('Kdo byl zavražděn 28. září 935?','kníže Václav',['Jan Hus','Karel IV.'],'Svatý Václav je patron české země.'),
   MC('Kdy vzniklo Československo?','28. října 1918',['1. ledna 1993','8. května 1945'],'Samostatný československý stát vznikl 28. 10. 1918.'),
   MC('Ke kterému státu patřily naše země před rokem 1918?','k Rakousku-Uhersku',['k Polsku','ke Slovensku'],'Před 1918 jsme patřili k Rakousku-Uhersku.'),
   MC('Proti komu protestovali studenti 17. listopadu 1989?','proti komunistům',['proti nacistům','proti Rakousku'],'1989 – sametová revoluce proti komunistickému režimu (1939 proti nacistům).'),
   MC('Proti komu protestovali studenti 17. listopadu 1939?','proti nacistům',['proti komunistům','proti Habsburkům'],'Roku 1939 studenti protestovali proti nacistické okupaci.'),
   MC('Proč je 8. května Den vítězství?','v roce 1945 skončila 2. světová válka v Evropě',['vznikla ČR','přišli Cyril a Metoděj'],'Spojenci porazili nacistické Německo.'),
   MC('Co se stalo 1. ledna 1993?','vznikla Česká republika',['skončila válka','vzniklo Československo'],'Rozdělilo se Československo a vznikla ČR.'),
   CL(x=>`„${x}“ je…`,{'státní svátek':['Den vítězství','Den české státnosti','Den upálení mistra Jana Husa','Den boje za svobodu a demokracii'],'ostatní svátek':['Velký pátek','Štědrý den','Velikonoční pondělí','Svátek práce']},(x,g)=>`${x} je ${g}.`)]},
 {id:'kultura',icon:'🌳',name:'Kulturní dědictví a lidové tradice',
  lesson:()=>`<p><b>Kultura</b> zahrnuje vše, co lidé <b>vymysleli a vytvořili</b>, i to, jak se <b>chovali</b>. Co se dochovalo, je <b>vzácné dědictví</b>, máme ho opatrovat a předat potomkům.</p>
   <p>Na obrázku stromu jsou <b>kořeny</b> kulturní dědictví: zvyky a obyčeje, jazyk a nářečí, křesťanství, písně a tance, umění. Drží celou společnost.</p>
   ${li(['<b>Lidová tradice</b> = dochované zvyky a obyčeje předků. Liší se mezi <b>Čechami, Moravou a Slezskem</b> i jednotlivými oblastmi.','Typické jsou <b>lidové kroje, písně, tance a tradiční řemesla</b>.','Tradice uchovávají <b>folklorní soubory</b> a <b>skanzeny</b>.','<b>Nářečí</b> nepatří ke spisovné češtině.','Naběračka: v Čechách <b>sběračka</b>, na Moravě <b>šufánek</b>, ve Slezsku <b>velká lžíce (ležka)</b>.','Slované se u nás usadili v <b>6. století</b>, před nimi tu žili <b>Keltové a Germáni</b>.'])}`,
  gen:[
   MC('Co zahrnuje kultura?','vše, co lidé vymysleli a vytvořili, i jak se chovali',['jen obrazy v galerii','jen písně'],'Kultura je vše, co lidé vytvořili a jak se chovali.'),
   MC('Co máme dělat s kulturním dědictvím?','opatrovat ho a předat potomkům',['zapomenout ho','vyhodit ho'],'Dědictví máme chránit a předat dál.'),
   MC('Která část stromu na obrázku představuje kulturní dědictví?','kořeny',['listy','koruna'],'Kořeny: zvyky, jazyk, křesťanství, písně, umění. Drží celou společnost.'),
   MC('Co je lidová tradice?','dochované zvyky a obyčeje předků',['nové mobilní hry','zákony parlamentu'],'Lidová tradice = zvyky a obyčeje předků.'),
   MC('Co je typické pro lidovou tradici?','kroje, písně, tance a řemesla',['auta a počítače','zákony a soudy'],'Každá oblast má své kroje, písně, tance a řemesla.'),
   MC('Kde se můžeme podívat, jak žili naši předkové?','ve skanzenu',['v parlamentu','na nádraží'],'Skanzeny a folklorní soubory uchovávají tradice.'),
   MC('Patří nářečí ke spisovné češtině?','ne',['ano','jen v Praze'],'Nářečí nepatří ke spisovné češtině.'),
   MC('Jak se říká naběračce v Čechách?','sběračka',['šufánek','ležka'],'V Čechách sběračka, na Moravě šufánek, ve Slezsku velká ležka.'),
   MC('Jak se říká naběračce na Moravě?','šufánek',['sběračka','hrnek'],'Na Moravě šufánek.'),
   MC('Jak se říká naběračce ve Slezsku?','velká lžíce (ležka)',['šufánek','sběračka'],'Ve Slezsku velká ležka.'),
   MC('Kdo žil na našem území před Slovany?','Keltové a Germáni',['Římané a Řekové','Vikingové'],'Před Slovany tu žili Keltové a Germáni.'),
   MC('Kdy se u nás usadili Slované?','v 6. století',['v roce 1993','v době kamenné'],'Slované přišli v 6. století.')]},
 {id:'umeni',icon:'🎭',name:'Křesťanství, umění a památky',
  lesson:()=>`${li(['Součástí naší kultury je <b>křesťanství</b>, i když se k němu (ani jiné víře) většina obyvatel nehlásí.','Z křesťanství vycházejí naše <b>morální hodnoty</b>, ovlivnilo <b>lidové zvyky (svátky), umění a architekturu</b>.','<b>Kostel</b> patří křesťanům, <b>synagoga</b> židům, <b>mešita</b> muslimům (islám).'])}
   <p><b>Umění</b> nás obohacuje, zušlechťuje a přináší radost. Druhy umění:</p>${li(['<b>výtvarné</b>: malířství, sochařství, fotografie, architektura','<b>dramatické</b>: divadlo, film','<b>hudební</b>: hudba, zpěv','<b>taneční</b>: balet, tanec','<b>literární</b>: knihy, básně'])}
   <p><b>Kulturní památky</b> ukazují způsob života a tvorbu předků. Ty nejcennější prohlašuje <b>vláda</b> za <b>národní kulturní památky</b>, např. <b>korunovační klenoty, hrad Buchlov, zámek Červená Lhota</b>.</p><p>V muzeu a na hradě <b>na nic nesaháme</b>, mluvíme potichu a posloucháme průvodce.</p>`,
  gen:[
   MC('Jaké náboženství je součástí naší kultury?','křesťanství',['buddhismus','hinduismus'],'Naši kulturu ovlivnilo křesťanství.'),
   MC('Co z křesťanství vychází?','morální hodnoty, svátky, umění a architektura',['zákony o dopravě','mobilní telefony'],'Křesťanství ovlivnilo hodnoty, zvyky, umění i stavby.'),
   YN('Hlásí se většina obyvatel ČR k nějaké víře?',false,'Většina obyvatel se k víře nehlásí.'),
   MC('Komu patří synagoga?','židům',['muslimům','křesťanům'],'Synagoga je modlitebna židů.'),
   MC('Komu patří mešita?','muslimům',['židům','křesťanům'],'Mešita je modlitebna muslimů (islám).'),
   CL(x=>`Do kterého umění patří ${x}?`,{'výtvarné':['malířství','sochařství','fotografie','architektura'],'dramatické':['divadlo','film'],'hudební':['hudba','zpěv'],'literární':['knihy','básně']},(x,g)=>`${x[0].toUpperCase()+x.slice(1)} patří do umění ${g=='literární'?'literárního':g=='výtvarné'?'výtvarného':g=='dramatické'?'dramatického':'hudebního'}.`),
   CL(x=>`Do kterého umění patří ${x}?`,{'výtvarné':['malířství','architektura'],'taneční':['balet','lidový tanec'],'hudební':['zpěv','hra na housle']},(x,g)=>`${x} je umění ${g}.`),
   MC('Co přináší umění?','obohacuje, zušlechťuje a přináší radost',['je nutné k přežití','jen peníze'],'Umění není nutné k přežití, ale obohacuje nás.'),
   MC('Co je kulturní památka?','dílo, předmět nebo stavba ukazující život a tvorbu předků',['nový obchod','dálnice'],'Kulturní památky ukazují způsob života a tvorbu předků.'),
   MC('Kdo prohlašuje národní kulturní památky?','vláda',['starosta','škola'],'Národní kulturní památky prohlašuje vláda ČR.'),
   MC('Co je národní kulturní památka?','korunovační klenoty',['nákupní centrum','fotbalový stadion'],'Např. korunovační klenoty, hrad Buchlov, zámek Červená Lhota.'),
   MC('Který hrad je národní kulturní památka?','hrad Buchlov',['hrad z kostek','Disneyland'],'Hrad Buchlov je národní kulturní památka.'),
   MC('Jak se chováme v muzeu nebo na hradě?','na nic nesaháme a mluvíme potichu',['běháme a křičíme','saháme na obrazy'],'Památky chráníme před poškozením.')]}
];
COURSES.vlast={id:'vlast',name:'Vlastivěda',sub:'Na písemku: naše vlast, stát, svátky, kultura',icon:'🇨🇿',topics:VL_TOPICS,finalN:15,passFinal:12,color:'var(--lea-soft)',exam:true};
