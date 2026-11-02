import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><style>[hidden]{display:none!important}</style></head><body>'+open('/tmp/claude-0/test.html').read()+'</body></html>')
        r=await pg.evaluate("""(()=>{const bad=[];let n=0;for(const C of Object.values(window.__C))for(const t of C.topics){
          try{t.lesson()}catch(e){bad.push(t.id+' lesson '+e)}
          t.gen.forEach((g,gi)=>{for(let i=0;i<400;i++){let q;try{q=g()}catch(e){bad.push(t.id+gi+' '+e);break}n++;
            const s=JSON.stringify(q);
            if(!q.opts.includes(q.ans))bad.push(t.id+gi+' ans not in opts '+s.slice(0,200));
            if(new Set(q.opts).size!==q.opts.length)bad.push(t.id+gi+' dup '+q.opts);
            if(/undefined|NaN|null/.test(q.q+q.opts.join()+q.exp+(q.svg||'')))bad.push(t.id+gi+' undef '+s.slice(0,200));
            if(q.opts.length<2)bad.push(t.id+gi+' few');}})}
          return {n,bad:[...new Set(bad)].slice(0,15)}})()""")
        print(r['n'],r['bad'])
        print(errs);await b.close()
asyncio.run(main())
