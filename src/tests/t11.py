import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/tmp/claude-0/test.html').read()+'</body></html>')
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');await pg.screenshot(path='c1.png')
        await pg.click('[data-act=openCourse][data-c=geo]');await pg.screenshot(path='c2.png',full_page=True)
        await pg.click('[data-act=openTopic][data-id=delka]');await pg.screenshot(path='c3.png',full_page=True)
        await pg.click('[data-act=startCourse]')
        shots=0
        for i in range(6):
            await pg.screenshot(path=f'q_d{i}.png')
            ans=await pg.evaluate("document.querySelector('.opt') && null")
            # click options until solved
            for o in await pg.locator('[data-act=geoAns]').all():
                if await pg.locator('[data-act=learnNext]').count():break
                await o.click()
            await pg.click('[data-act=learnNext]')
        await pg.wait_for_timeout(300);await pg.screenshot(path='c4.png')
        if await pg.locator('[data-close]').count(): await pg.click('[data-close]')
        await pg.wait_for_timeout(200);print('after:',await pg.locator('h1').first.inner_text())
        # science
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-act=openCourse][data-c=prir]');await pg.screenshot(path='c5.png',full_page=True)
        for tid in ['stavba','foto','poloha']:
            pass
        await pg.click('[data-act=openTopic][data-id=stavba]');await pg.screenshot(path='c6.png',full_page=True)
        await pg.click('[data-act=startCourse]');await pg.screenshot(path='c7.png')
        await pg.evaluate("1")
        print(errs);await b.close()
asyncio.run(main())
