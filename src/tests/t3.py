import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'fonts' not in m.text and 'Failed to load' not in m.text else None)
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.wait_for_timeout(300);await pg.screenshot(path='j1.png')
        await pg.click('[data-id=jirka]');await pg.wait_for_timeout(300);await pg.screenshot(path='j2.png')
        await pg.click('[data-to=games]');await pg.click('[data-to=tetris]');await pg.wait_for_timeout(500)
        for k in ['left','rot','drop','right','right','drop','drop']:
            await pg.click(f'[data-k={k}]');await pg.wait_for_timeout(100)
        await pg.screenshot(path='j3.png')
        await pg.click('[data-act=back]');await pg.click('[data-to=cars]');await pg.wait_for_timeout(2500);await pg.screenshot(path='j4.png')
        await pg.wait_for_timeout(6000);await pg.screenshot(path='j4b.png')
        await pg.click('[data-act=back]');await pg.click('[data-to=build]');await pg.wait_for_timeout(600)
        for i in range(5):
            await pg.click('[data-act=buildDrop]');await pg.wait_for_timeout(700)
        await pg.screenshot(path='j5.png')
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-to=learn]');await pg.wait_for_timeout(200);await pg.screenshot(path='j6.png')
        await pg.click('[data-g=emoQuiz]');await pg.wait_for_timeout(200);await pg.screenshot(path='j7.png')
        await pg.click('[data-act=back]');await pg.click('[data-to=calm]');await pg.click('[data-act=startBreath]');await pg.wait_for_timeout(3500);await pg.screenshot(path='j8.png')
        await pg.click('[data-act=back]');await pg.click('[data-act=startGround]');await pg.click('[data-act=groundTap]');await pg.screenshot(path='j9.png')
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-g=selfTest]')
        for i in range(8): await pg.click('[data-act=likert][data-v="%d"]'%(1+i%5))
        await pg.screenshot(path='j10.png',full_page=True)
        await pg.click('[data-act=selfDone]');await pg.wait_for_timeout(300);await pg.click('[data-close]');await pg.wait_for_timeout(300)
        print('view',await pg.locator('h1').first.inner_text())
        await pg.click('[data-act=back]');await pg.click('[data-to=shop]');await pg.screenshot(path='j11.png')
        print(errs);await b.close()
asyncio.run(main())
