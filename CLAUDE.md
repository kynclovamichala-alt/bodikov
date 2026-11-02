# Bodíkov – návod pro Clauda (technická paměť projektu)

> Tento soubor je určen Claudovi v nové relaci. Přečti ho celý, než začneš cokoli měnit.
> Osobní kontext rodiny (není ve veřejném repu) má Michaela v souboru `BODIKOV-ZNALOSTI.md` ve svém Claude projektu.

## Co to je
Rodinná motivační PWA aplikace v češtině. Děti (Lea 4 roky, Bea 10 let, 4. třída) a dospělý Jirka sbírají hvězdičky ⭐ za úkoly od rodičů a za minihry, a hvězdičky utrácejí za odemykání her, mazlíčka, samolepky a skutečné odměny. Rodičovská část je za PINem (výchozí 1234).

- Živá aplikace: https://kynclovamichala-alt.github.io/bodikov/ (GitHub Pages z větve `main`, kořen repa, `.nojekyll`).
- Synchronizace mezi telefony: Firebase Realtime Database, projekt `aplikacedeti` (konfigurace v `src/firebase.json`, je veřejná stejně jako v každé webové aplikaci), anonymní přihlášení, data v `families/{familyId}/state`.
  - Pravidla DB (nastavila Michaela): `.read/.write` jen když `auth != null && $rodina.length >= 12`.
- Telefon se připojí k rodině odkazem `…/bodikov/#rodina=<id>` (najdete v Rodiče → Nastavení). Role telefonu (lea/bea/jirka/parent/shared) je v `localStorage['bodikov-device']`.
- Aktualizace: aplikace se dotazuje na `version.json` a sama se přenačte. Stačí pushnout do `main`.

## Jak buildit a nasadit
```bash
cd <repo>
python3 src/build.py 2026-MM-DD.N        # zapíše index.html + version.json do kořene repa a náhled src/_preview.html
git add -A && git commit -m "…" && git push origin HEAD:main
```
- Verzi zvyšuj vždy (formát `RRRR-MM-DD.N`), jinak se telefony neaktualizují.
- `src/_preview.html` je verze bez Firebase (vše jen lokálně) – hodí se na náhled/testy.
- Před pushem: `node -e` kontrola syntaxe (viz níže) + Playwright testy.

Kontrola syntaxe:
```bash
node -e "const s=require('fs').readFileSync('index.html','utf8');const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]);m.forEach(c=>new Function(c));console.log('ok')"
```

## Struktura zdrojů (`src/`)
Jednosouborová aplikace, vanilla JS/HTML/CSS. `build.py` vloží do `app.js`:
- `/*PICS*/` ← `pics.txt` (obrázky k vybarvování)
- `/*ADULT*/` ← v tomto pořadí: `adult.js, course.js, science.js, engine.js, vlast.js, rewards.js, pet.js, talk.js, games2.js` (vše v jednom `<script>`, sdílí globální rozsah – pozor na kolize názvů konstant, např. `CL` je v science.js)
- CSS = `base.css.txt` + `extra.css`

| Soubor | Obsah |
|---|---|
| `app.js` | jádro: stav `S`, sync, `put(path,val)`, `addLog`, `normalize`, `maintenance` (denní reset, ranní mise 6:30–8:09, migrace), pohledy (home, tasks, games, mirror/mandala, coloring, shop, race, learn, parent), `handlers`, `render`, `MAP` (název pohledu → funkce), `SETUP` (post-render hooky), `ITEMS` (odemykatelné věci s `for` a `price`), `capAward` (denní stropy) |
| `adult.js` | Jirka: emoce (emoQuiz, selfTest, calm, breath, ground); herní rámec `GM/stopGame/gameShell/setupCanvas/gameOver/gameW`; Tetris, Autíčka (témata den/noc/sníh/poušť, závodní auto), Stavitel; Bea: dělení se zbytkem, závorky |
| `course.js` | kurz Přímky a úsečky (TOPICS, 11 témat) |
| `science.js` | kurz Přírodověda (SCI_TOPICS, 10 témat), helpery `MC, YN, CL, li` |
| `vlast.js` | kurz Vlastivěda (VL_TOPICS, 7 témat): stát, demokracie, symboly, obyvatelé, svátky, kultura, umění |
| `engine.js` | `COURSES` (geo, prir, vlast), mistrovství: ≥5/6 napoprvé = hvězda, 3 hvězdy na téma, závěrečný test (`exam:true` → „Zkušební písemka“); pokrok v `kids/{kid}/courses/{cid}/{tid}` |
| `rewards.js` | odměny od rodičů (`rewards`, `claims`), album samolepek (6 sérií × 12), obchod `vShop2`, záloha/obnova dat (JSON) |
| `pet.js` | mazlíček (tamagoči) – 100 ⭐, typy, krmení, šatník, domeček, růst z bodů za úkoly, noční spánek |
| `talk.js` | mazlíček mluví (TTS cs-CZ), záložka Povídání, rozpoznávání řeči tolerantní k šišlání (`lispN`, `lev`), hlasové povely, nálada, „bručoun“ povaha pro Jirku, vztek po 5× lechtání |
| `games2.js` | registr `GAMES` + `vGames2`; pexeso, puzzle (i z fotky), bublinky/ohňostroj, hudební zvířátka, bludiště, rozdíly, pixel art, šibenice (vyjmenovaná slova), souboj v násobilce, had, rozbíječ cihel, parkování, 2048, cvičení i/y |
| `tests/` | Playwright skripty použité při vývoji (cesty v nich ukazují na staré umístění, uprav si je) |

### Datový model (zkráceně)
`S = {kids:{lea,bea,jirka}, tasks, log, settings:{prices, gameCap, learnCap, stickerPrice, morning…}, rewards, claims, …}`
- Body = součet `log` záznamů (`{kid,pts,type,text,d,ts}`); typy: task, streak, game, learn, unlock, pet, reward, bonus, info.
- `kids/{kid}`: `unlocked`, `streak`, `pet`, `stickers`, `stickerDone`, `courses`, `learnCap` (Bea 50, ostatní 15).

## Testování
Headless Chromium + Playwright (Python). Vzor: načíst `_preview.html` přes `page.set_content`, interní funkce zpřístupnit nahrazením řetězce `MAP.games=vGames2;` → `MAP.games=vGames2;window.__T={…};`. Generátory otázek fuzzovat (odpověď musí být mezi možnostmi, možnosti unikátní).

## Pravidla spolupráce
- Komunikace s Michaelou **česky, vykat**, stručně, bez technického žargonu; na konci napsat, co má udělat ona.
- Claude nikdy nezadává hesla, nevytváří účty, nemění bezpečnostní nastavení (Firebase pravidla, přihlášení na GitHub) – to dělá Michaela.
- Design: veselý dětský, velká tlačítka, krátké texty, hodně okamžitých odměn, soutěžení dětí (viz osobní kontext).
- Nové učivo pro Beu: Michaela pošle fotky sešitu/učebnice → udělat kurz „stejným modelem“ jako Přímky a úsečky (taháky + otázky + hvězdy + písemka), přesně podle látky na fotkách.
- Git commit: autor `kynclovamichala-alt <kynclovamichala-alt@users.noreply.github.com>`.
