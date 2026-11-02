import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-id=lea]');await pg.wait_for_timeout(200);await pg.screenshot(path='u1.png')
        await pg.click('[data-to=learn]');await pg.click('[data-g=learnCount]');await pg.wait_for_timeout(200)
        await pg.click('.fruit >> nth=0');await pg.screenshot(path='u2.png')
        n=await pg.locator('.fruit').count()
        for r in range(5):
            n=await pg.locator('.fruit').count()
            await pg.click(f'[data-act=countAns][data-n="{n}"]');await pg.wait_for_timeout(1700)
        await pg.screenshot(path='u3.png')
        await pg.click('[data-close]');await pg.wait_for_timeout(200)
        print('after round view:',await pg.locator('h1').inner_text())
        await pg.click('[data-g=learnFind]');await pg.wait_for_timeout(200);await pg.screenshot(path='u4.png')
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-act=back]')
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');await pg.click('[data-to=geoLesson]');await pg.wait_for_timeout(200);await pg.screenshot(path='u5.png',full_page=True)
        await pg.click('[data-act=back]');await pg.click('[data-g=geoQuiz]')
        for i in range(8):
            await pg.screenshot(path=f'q{i}.png')
            opts=await pg.locator('[data-act=geoAns]').all()
            for o in opts:
                await o.click();await pg.wait_for_timeout(80)
                if await pg.locator('[data-act=learnNext]').count(): break
            await pg.click('[data-act=learnNext]');await pg.wait_for_timeout(150)
        await pg.screenshot(path='u6.png')
        print(errs);await b.close()
asyncio.run(main())
