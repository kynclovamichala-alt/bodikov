import asyncio,json,copy
from playwright.async_api import async_playwright
MOCK=r"""
(()=>{const cbs=[];let state=null;const clone=v=>v==null?null:JSON.parse(JSON.stringify(v));
window.__recv=s=>{state=s;cbs.forEach(cb=>cb({val:()=>clone(state)}))};
const ref=path=>({on(ev,cb){if(path==='.info/connected'){setTimeout(()=>cb({val:()=>true}),10);return}cbs.push(cb);setTimeout(()=>cb({val:()=>clone(state)}),20)},
  set(v){return window.__push(JSON.stringify({op:'set',v}))},update(u){return window.__push(JSON.stringify({op:'update',u}))}});
window.firebase={apps:[],initializeApp(){this.apps.push(1)},auth(){return{signInAnonymously:()=>Promise.resolve()}},database(){return{ref}}};})();
"""
master={'s':None}
pages=[]
def setp(d,path,v):
    ps=path.split('/');o=d
    for p in ps[:-1]:
        if not isinstance(o.get(p),dict): o[p]={}
        o=o[p]
    if v is None: o.pop(ps[-1],None)
    else: o[ps[-1]]=v
async def push(js):
    m=json.loads(js)
    if m['op']=='set': master['s']=m['v']
    else:
        if master['s'] is None: master['s']={}
        for k,v in m['u'].items(): setp(master['s'],k,v)
    for pg in pages:
        await pg.evaluate('s=>window.__recv(s)',master['s'])
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        errs=[]
        async def mk():
            ctx=await b.new_context(viewport={'width':390,'height':844})
            await ctx.add_init_script(MOCK)
            await ctx.expose_function('__push',push)
            pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)));pages.append(pg);return pg
        par=await mk();await par.goto('http://localhost:8765/index.html');await par.wait_for_timeout(300)
        await par.screenshot(path='y1.png')
        await par.click('[data-act=newFamily]');await par.wait_for_timeout(400)
        fam=await par.evaluate("JSON.parse(localStorage.getItem('bodikov-device')).family")
        print('family',fam,'master has state',master['s'] is not None)
        lea=await mk();await lea.goto('http://localhost:8765/index.html#rodina='+fam);await lea.wait_for_timeout(500)
        await lea.screenshot(path='y2.png')
        await lea.click('[data-r=lea]');await lea.wait_for_timeout(300);await lea.screenshot(path='y3.png')
        # parent adds task for lea
        await par.click('[data-t=tasks]');await par.fill('#f-title','Nakrmit rybičky');await par.click('[data-group=icon] [data-v="🐶"]');await par.click('#taskform [type=submit]');await par.wait_for_timeout(400)
        await lea.wait_for_timeout(300);await lea.click('[data-act=goTasks]');await lea.wait_for_timeout(200)
        titles=await lea.locator('.task h3').all_inner_texts();print('lea tasks',titles)
        # lea completes new task
        await lea.click('#t-'+[t for t in (await lea.evaluate("Object.keys(JSON.parse(localStorage.getItem('bodikov-v2')).tasks)")) if t.startswith('t') and t not in('t-socks','t-bed','t-room')][0]+' [data-act=done]')
        await lea.wait_for_timeout(300);await lea.click('[data-close]');await lea.click('[data-act=back]')
        await par.click('[data-t=approve]');await par.wait_for_timeout(200);await par.screenshot(path='y4.png')
        await par.click('[data-act=approve]');await par.wait_for_timeout(500)
        await lea.wait_for_timeout(500);await lea.screenshot(path='y5.png')
        print('lea jar',await lea.locator('.jar span').inner_text())
        await par.click('[data-t=settings]');await par.wait_for_timeout(200);await par.screenshot(path='y6.png',full_page=True)
        print(errs);await b.close()
asyncio.run(main())
