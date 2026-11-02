import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');print(await pg.locator('.note').last.inner_text())
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-id=lea]');await pg.click('[data-to=learn]');print(await pg.locator('.note').last.inner_text())
        await pg.click('[data-act=back]');await pg.click('[data-act=back]');await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=points]');print([await pg.locator(f'#lc-{k}').input_value() for k in ['lea','bea','jirka']])
        print(errs);await b.close()
asyncio.run(main())
