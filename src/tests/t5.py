import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=points]');await pg.fill('#bonus-lea','200');await pg.click('[data-act=bonus][data-id=lea][data-sign="1"]')
        await pg.click('[data-act=back]');await pg.click('[data-id=lea]');await pg.click('[data-to=shop]')
        for it in ['mirror4','kaleido','mandala6']:
            await pg.click(f'[data-act=buy][data-item={it}]');await pg.click('[data-yes]');await pg.wait_for_timeout(200);await pg.click('[data-close]');await pg.wait_for_timeout(300);print('after unlock:',await pg.locator('h1').first.inner_text());await pg.click('[data-act=back]');await pg.wait_for_timeout(100)
        await pg.click('[data-act=back]');await pg.click('[data-to=games]');await pg.screenshot(path='k0.png')
        await pg.click('[data-act=openItem][data-item=kaleido]');await pg.wait_for_timeout(200)
        print(await pg.locator('.chips .chip.on').all_inner_texts())
        await pg.screenshot(path='k1.png')
        print(errs);await b.close()
asyncio.run(main())
