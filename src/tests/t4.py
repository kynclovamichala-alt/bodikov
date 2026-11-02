import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1"><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');await pg.screenshot(path='d0.png')
        await pg.click('[data-g=divQuiz]')
        # wrong answer first
        await pg.click('[data-k="9"]');await pg.click('[data-act=divField][data-f=r]');await pg.click('[data-k="9"]');await pg.click('[data-act=divCheck]');await pg.click('[data-act=divHelp]')
        await pg.screenshot(path='d1.png',full_page=True)
        for i in range(8):
            ex=await pg.locator('.divex').inner_text()
            import re
            n,d=map(int,re.findall(r'(\d+) : (\d+)',ex)[0])
            q,r=divmod(n,d)
            await pg.click('[data-act=divField][data-f=q]')
            for _ in range(3): await pg.click('[data-k=del]')
            for ch in str(q): await pg.click(f'[data-k="{ch}"]')
            await pg.click('[data-act=divField][data-f=r]')
            for _ in range(3): await pg.click('[data-k=del]')
            for ch in str(r): await pg.click(f'[data-k="{ch}"]')
            await pg.click('[data-act=divCheck]')
            if i==1: await pg.screenshot(path='d2.png')
            await pg.click('[data-act=learnNext]');await pg.wait_for_timeout(100)
        await pg.wait_for_timeout(300);await pg.screenshot(path='d3.png')
        print(errs);await b.close()
asyncio.run(main())
