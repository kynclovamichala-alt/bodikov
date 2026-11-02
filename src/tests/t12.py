import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':1000,'height':900})
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+open('/tmp/claude-0/test.html').read()+'</body></html>')
        await pg.evaluate("""(()=>{const out=[];for(const C of Object.values(window.__C))for(const t of C.topics)t.gen.forEach(g=>{for(let k=0;k<3;k++){const q=g();if(q.svg)out.push(`<div style="width:300px;display:inline-block;margin:4px;vertical-align:top;font:12px sans-serif" class="geo">${window.__G(q.svg)}<div>${t.id}: ${q.q} <b>${q.ans}</b></div></div>`)}});
          document.getElementById('app').innerHTML='<div style="background:#fff;width:960px">'+out.join('')+'</div>';document.getElementById('app').style.maxWidth='980px';})()""")
        await pg.screenshot(path='gal.png',full_page=True)
        await b.close()
asyncio.run(main())
