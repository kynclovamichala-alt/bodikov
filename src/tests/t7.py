import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-id=bea]');await pg.click('[data-to=games]');await pg.click('[data-to=mandala]');await pg.wait_for_timeout(200)
        bx=await pg.locator('#cv').bounding_box();print(bx)
        print(await pg.evaluate("(()=>{const r=document.querySelector('#cv').getBoundingClientRect();const e=document.elementFromPoint(r.x+60,r.y+60);return e.tagName+' '+e.id+' '+e.className})()"))
        cx,cy=bx['x']+bx['width']/2,bx['y']+bx['height']/2
        await pg.mouse.move(cx+20,cy+20);await pg.mouse.down()
        for i in range(60): await pg.mouse.move(cx+20+i*2,cy+20+(i%10)*6)
        await pg.mouse.up();await pg.screenshot(path='m10.png')
        await pg.click('[data-act=mirrorDone]');await pg.wait_for_timeout(300);print('ov',await pg.locator('.ov').count(),await pg.locator('.toast').all_inner_texts())
        print(errs);await b.close()
asyncio.run(main())
