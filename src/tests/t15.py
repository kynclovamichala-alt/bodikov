import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={S:()=>S,addLog,render,V:()=>V,go,X:()=>X,GM:()=>GM,has,pointsOf,put,ITEMS,back};",1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        await pg.click('[data-id=bea]')
        await pg.evaluate("__T.addLog('bea',2000,'task','test',true);__T.render()")
        await pg.screenshot(path='/tmp/claude-0/sh/home.png',full_page=True)
        # pet
        await pg.click('[data-to=pet]');await pg.click('[data-act=buy][data-item=pet]')
        await pg.wait_for_timeout(300)
        await pg.click('[data-yes]');await pg.wait_for_timeout(500)
        while await pg.locator('.ov').count(): await pg.locator('.ov button').last.click();await pg.wait_for_timeout(300)
        await pg.wait_for_timeout(300);print('view',await pg.evaluate("__T.V().name"),await pg.evaluate("__T.has('bea','pet')"),(await pg.locator('#app').text_content())[:300])
        if await pg.evaluate("__T.V().name")!='pet': await pg.evaluate("__T.go('pet')")
        await pg.click('[data-t=drak]');await pg.fill('#petname','Ohníček');await pg.click('[data-act=petCreate]')
        await pg.wait_for_timeout(300);await pg.screenshot(path='/tmp/claude-0/sh/pet.png',full_page=True)
        for a in ['petPet','petPlay','petWash']: await pg.click(f'[data-act={a}]',force=True);await pg.wait_for_timeout(100)
        await pg.click('[data-act=petTab][data-t=food]');await pg.click('[data-f=pizza]')
        await pg.click('[data-act=petTab][data-t=wear]');await pg.locator('[data-act=petBuyWear]').first.click();await pg.locator('[data-act=petWear]').first.click()
        await pg.screenshot(path='/tmp/claude-0/sh/pet2.png',full_page=True)
        print('pet',await pg.evaluate("JSON.stringify(__T.S().kids.bea.pet)"))
        # buy all games via state
        await pg.evaluate("__T.ITEMS.filter(i=>(i.for||['lea','bea']).includes('bea')).forEach(i=>__T.put('kids/bea/unlocked/'+i.id,true));__T.render()")
        for v in ['games','shop','album','pexeso','puzzle','bubbles','music','maze','diff','pixel','hangman','duel','snake','breakout','parking','g2048','cars']:
            await pg.evaluate(f"__T.go('{v}')");await pg.wait_for_timeout(400)
            await pg.screenshot(path=f'/tmp/claude-0/sh/{v}.png',full_page=True);await pg.evaluate("__T.back()")
        print(errs);await b.close()
asyncio.run(main())
