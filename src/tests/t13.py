import asyncio
from playwright.async_api import async_playwright
async def round_(pg,c,t):
    await pg.click(f'[data-act=startCourse][data-c={c}][data-id={t}]')
    while True:
        for o in await pg.locator('[data-act=geoAns]').all():
            if await pg.locator('[data-act=learnNext]').count():break
            await o.click()
        last=(await pg.locator('[data-act=learnNext]').inner_text()).strip()=='Hotovo!'
        await pg.click('[data-act=learnNext]')
        if last:break
    await pg.wait_for_timeout(200);t=await pg.locator('.ovbox h2').inner_text();await pg.click('[data-close]');await pg.wait_for_timeout(200);return t
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/tmp/claude-0/test2.html').read()+'</body></html>')
        await pg.evaluate('window.__perfect=true')
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');await pg.click('[data-act=openCourse][data-c=prir]')
        await pg.click('[data-act=openTopic][data-id=foto]')
        for i in range(3): print(await round_(pg,'prir','foto'))
        await pg.screenshot(path='p1.png',full_page=True)
        await pg.click('[data-act=back]');await pg.screenshot(path='p2.png')
        await pg.click('[data-act=startCourse][data-id=final]')
        print('final total dots',await pg.locator('.progress i').count())
        await pg.screenshot(path='p3.png')
        await pg.click('[data-act=back]')
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-act=back]')
        await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=points]');await pg.screenshot(path='p4.png')
        print(errs);await b.close()
asyncio.run(main())
