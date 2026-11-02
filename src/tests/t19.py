import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={put,go,addLog,petAnswer};",1)
tests=['řekni mi vtip','jekni mi fip','sasfívej mi','zazpívej','pojď si hlát','pojď si hrát','mám hlad','mám tě lád','já tě miluju','jak še máš','jak te más','koupat','chci papat','hajat','pohlaď','ahoj','čau','hádanka','já jsem smutná','něco úplně jiného','sestra','haf haf','jak se jmenuješ']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        await pg.click('[data-id=lea]')
        await pg.evaluate("__T.put('kids/lea/unlocked/pet',true);__T.addLog('lea',50,'task','t',true);__T.put('kids/lea/pet',{type:'kocka',name:'Micka',born:0,ts:Date.now(),food:40,joy:80,clean:80,energy:80});__T.go('pet')")
        for t in tests:
            r=await pg.evaluate(f"__T.petAnswer({t!r})");print(t,'->',r[:60])
        print(errs);await b.close()
asyncio.run(main())
