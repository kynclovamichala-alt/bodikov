import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={S:()=>S,addLog,render,V:()=>V,go,X:()=>X,GM:()=>GM,has,pointsOf,put,ITEMS,back};",1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        await pg.click('[data-id=jirka]')
        await pg.evaluate("__T.addLog('jirka',500,'task','t',true);['cars_snow','cars_race','game_snake','game_parking','game_breakout'].forEach(i=>__T.put('kids/jirka/unlocked/'+i,true));__T.go('games')")
        await pg.screenshot(path='/tmp/claude-0/sh/jg.png',full_page=True)
        await pg.evaluate("__T.go('cars')");await pg.click('[data-act=carTh][data-v=snow]');await pg.click('[data-act=carCar][data-v=race]');await pg.wait_for_timeout(600)
        await pg.screenshot(path='/tmp/claude-0/sh/jcars.png')
        await pg.evaluate("__T.back();__T.go('snake')");await pg.click('[data-act=snDir][data-d=U]');await pg.wait_for_timeout(3500);await pg.screenshot(path='/tmp/claude-0/sh/jsnake.png')
        await pg.evaluate("__T.back();__T.V().pkLv=4;__T.go('parking')");
        bb=await pg.locator('[data-hold=F]').bounding_box();await pg.mouse.move(bb['x']+20,bb['y']+20);await pg.mouse.down();await pg.wait_for_timeout(1200);await pg.mouse.up()
        await pg.screenshot(path='/tmp/claude-0/sh/jpark.png')
        await pg.evaluate("__T.back();__T.go('breakout')");await pg.click('#gcv');await pg.wait_for_timeout(1500);await pg.screenshot(path='/tmp/claude-0/sh/jbr.png')
        await pg.evaluate("__T.back();__T.back()")
        # lea
        await pg.evaluate("__T.V().kid='lea';__T.go('games')");await pg.screenshot(path='/tmp/claude-0/sh/lg.png',full_page=True)
        # parent claim
        await pg.evaluate("__T.S().claims={c1:{id:'c1',kid:'lea',rid:'x',title:'Nanuk',icon:'🍦',price:40,ts:Date.now(),status:'pending'}};S=__T.S()")
        await pg.evaluate("location.hash='';__T.go('picker')")
        await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/claude-0/sh/par.png',full_page=True)
        await pg.click('[data-act=claimDone]');print(await pg.evaluate("JSON.stringify(__T.S().claims)"))
        await pg.click('[data-t=rewards]');await pg.screenshot(path='/tmp/claude-0/sh/parr.png',full_page=True)
        print(errs);await b.close()
asyncio.run(main())
