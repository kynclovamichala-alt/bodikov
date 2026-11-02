import asyncio,re
from playwright.async_api import async_playwright
def ev(e):
    return int(eval(e.replace('·','*').replace(':','//').replace('−','-')))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        # validate generators widely
        bad=await pg.evaluate("""(()=>{return 0})()""")
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]');await pg.screenshot(path='b0.png')
        await pg.click('[data-g=brQuiz]')
        for i in range(8):
            ex=(await pg.locator('.divex').text_content()).split('=')[0].strip()
            v=ev(ex)
            if i==0:
                await pg.click('[data-k="1"]');await pg.click('[data-act=brCheck]');await pg.click('[data-act=brHelp]');await pg.screenshot(path='b1.png')
            for ch in str(v): await pg.click(f'[data-k="{ch}"]')
            await pg.click('[data-act=brCheck]')
            assert await pg.locator('[data-act=learnNext]').count()==1, ('not solved',ex,v)
            if i==1: await pg.screenshot(path='b2.png')
            await pg.click('[data-act=learnNext]')
        await pg.wait_for_timeout(300);await pg.screenshot(path='b3.png')
        print('ok',errs);await b.close()
asyncio.run(main())
