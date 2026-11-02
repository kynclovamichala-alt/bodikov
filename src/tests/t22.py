import asyncio,json
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={S:()=>S,addLog};",1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(accept_downloads=True)
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('dialog',lambda d:asyncio.ensure_future(d.accept()))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        await pg.evaluate("__T.addLog('bea',77,'task','t',true)")
        await pg.click('[data-act=parentLogin]')
        for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=settings]')
        async with pg.expect_download() as dl: await pg.click('[data-act=backupDl]')
        d=await dl.value;path='/tmp/claude-0/z.json';await d.save_as(path);j=json.load(open(path));print(d.suggested_filename,len(j['state']['log']))
        await pg.click('[data-act=resetAll]');await pg.click('[data-act=resetAll]');print('after reset',len(await pg.evaluate("Object.keys(__T.S().log||{})")))
        await pg.click('[data-act=parentLogin]') if await pg.locator('[data-act=parentLogin]').count() else None
        if await pg.locator('[data-k="1"]').count():
            for k in '1234': await pg.click(f'[data-k="{k}"]')
        await pg.click('[data-t=settings]')
        await pg.set_input_files('#restorefile',path);await pg.wait_for_timeout(500)
        print('after restore',len(await pg.evaluate("Object.keys(__T.S().log||{})")),errs);await b.close()
asyncio.run(main())
