import asyncio
from playwright.async_api import async_playwright
async def jar(pg): return int(await pg.locator('.jar span').inner_text())
async def draw(pg):
    bx=await pg.locator('#cv').bounding_box();x0,y0=bx['x']+40,bx['y']+40
    await pg.mouse.move(x0,y0);await pg.mouse.down()
    for i in range(60): await pg.mouse.move(x0+i*4,y0+(i%12)*12)
    await pg.mouse.up()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/home/claude/bodikov.html').read()+'</body></html>')
        await pg.click('[data-id=bea]');await pg.click('[data-to=games]')
        await pg.click('[data-to=mirror]');s0=await jar(pg)
        await pg.click('[data-act=mirrorDone]');await pg.wait_for_timeout(200)
        print('empty drawing Hotovo -> jar',await jar(pg),'(toast:',await pg.locator('.toast').inner_text() if await pg.locator('.toast').count() else '',')')
        await draw(pg);await pg.click('[data-act=mirrorDone]');await pg.wait_for_timeout(200);await pg.click('[data-close]')
        print('mirror: before',s0,'after',await jar(pg))
        await pg.click('[data-act=back]');await pg.click('[data-to=mandala]');s1=await jar(pg);await draw(pg);await pg.click('[data-act=mirrorDone]');await pg.wait_for_timeout(300);print('toast',await pg.locator('.toast').all_inner_texts(),'ov',await pg.locator('.ov').count());await pg.screenshot(path='m9.png')
        if await pg.locator('[data-close]').count(): await pg.click('[data-close]')
        print('mandala: before',s1,'after',await jar(pg))
        await pg.click('[data-act=back]');await pg.click('[data-to=colorPick]');await pg.click('[data-act=pickPic][data-id=house]');s2=await jar(pg)
        await pg.click('[data-act=fillcol][data-c="#FF5C93"]')
        rs=await pg.locator('#colorpic [data-r]').all()
        for r in rs: await r.click(force=True)
        await pg.click('[data-act=colorDone]');await pg.wait_for_timeout(200);await pg.click('[data-close]')
        print('coloring: before',s2,'after',await jar(pg))
        print('log:',await pg.evaluate("Object.values(JSON.parse(localStorage.getItem('bodikov-v2')||'{}').log||{}).length") if False else '')
        print(errs);await b.close()
asyncio.run(main())
