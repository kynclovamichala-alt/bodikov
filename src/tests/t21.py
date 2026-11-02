import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={go,COURSES,S:()=>S,L:()=>L,V:()=>V,startCourse};",1)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        r=await pg.evaluate("""(()=>{let bad=[],n=0;for(const t of __T.COURSES.vlast.topics){if(t.gen.length<6)bad.push(t.id+' few');for(let k=0;k<400;k++){const q=t.gen[k%t.gen.length]();n++;if(!q.opts.includes(q.ans)||new Set(q.opts).size!==q.opts.length||q.opts.length<2)bad.push(t.id+':'+q.q+JSON.stringify(q.opts))}}return [n,[...new Set(bad)].slice(0,10)]})()""")
        print(r)
        await pg.click('[data-id=bea]');await pg.click('[data-to=learn]')
        await pg.screenshot(path='/tmp/claude-0/sh/v0.png',full_page=True)
        await pg.evaluate("__T.go('course',{course:'vlast'})")
        await pg.screenshot(path='/tmp/claude-0/sh/v1.png',full_page=True)
        await pg.evaluate("__T.go('topic',{course:'vlast',topic:'symboly'})")
        await pg.screenshot(path='/tmp/claude-0/sh/v2.png',full_page=True)
        await pg.evaluate("__T.startCourse('vlast','symboly')")
        for i in range(6):
            a=await pg.evaluate("__T.L().q.ans");await pg.click(f'[data-act=geoAns][data-o="{a}"]')
            if i==0: await pg.screenshot(path='/tmp/claude-0/sh/v3.png',full_page=True)
            await pg.click('[data-act=learnNext]')
        await pg.wait_for_timeout(400);print(await pg.evaluate("JSON.stringify(__T.S().kids.bea.courses.vlast)"))
        print(errs);await b.close()
asyncio.run(main())
