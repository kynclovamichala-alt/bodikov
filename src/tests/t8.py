import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=points]');await pg.fill('#bonus-lea','50');await pg.click('[data-act=bonus][data-id=lea][data-sign="1"]')
        print('lea prices tetris:',await pg.locator('#pr-lea-game_tetris').input_value(),'jirka has game items:',await pg.locator('#pr-jirka-game_tetris').count())
        await pg.click('[data-act=back]');await pg.click('[data-id=lea]');await pg.click('[data-to=games]');await pg.screenshot(path='g1.png',full_page=True)
        await pg.click('[data-act=lockedItem][data-item=game_tetris]');await pg.wait_for_timeout(200)
        await pg.click('[data-act=buy][data-item=game_tetris]');await pg.click('[data-yes]');await pg.wait_for_timeout(200);await pg.click('[data-close]');await pg.wait_for_timeout(400)
        print('opened:',await pg.locator('h1').first.inner_text(),'jar',await pg.locator('.jar span').inner_text())
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.screenshot(path='g2.png',full_page=True)
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-id=jirka]');await pg.click('[data-to=shop]')
        print('jirka shop:',await pg.locator('.item h3').all_inner_texts())
        print(errs);await b.close()
asyncio.run(main())
