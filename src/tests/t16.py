import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={S:()=>S,addLog,render,V:()=>V,go,X:()=>X,GM:()=>GM,has,pointsOf,put,ITEMS,back,L:()=>L,mazeMove,g2move};",1)
async def closeov(pg):
    await pg.wait_for_timeout(250)
    while await pg.locator('.ov').count():
        await pg.locator('.ov button').last.click(force=True);await pg.wait_for_timeout(250)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8></head><body>'+html+'</body></html>')
        await pg.click('[data-id=bea]')
        await pg.evaluate("__T.addLog('bea',2000,'task','test',true);__T.S().settings.gameCap=999;__T.ITEMS.filter(i=>(i.for||['lea','bea']).includes('bea')).forEach(i=>__T.put('kids/bea/unlocked/'+i.id,true));__T.render()")
        P=lambda: pg.evaluate("__T.pointsOf('bea')")
        # pexeso
        await pg.evaluate("__T.go('pexeso')")
        cards=await pg.evaluate("__T.X().cards.map(c=>c.e)")
        seen={}
        for i,e in enumerate(cards): seen.setdefault(e,[]).append(i)
        for e,(i,j) in seen.items():
            await pg.click(f'[data-i="{i}"]');await pg.click(f'[data-i="{j}"]');await pg.wait_for_timeout(300)
        await closeov(pg);print('pexeso',await P())
        # puzzle
        await pg.evaluate("__T.go('puzzle')")
        for _ in range(30):
            perm=await pg.evaluate("__T.X().perm")
            bad=[i for i,v in enumerate(perm) if v!=i]
            if not bad:break
            i=bad[0];j=perm.index(i)
            await pg.click(f'[data-act=puzTap][data-i="{i}"]');await pg.click(f'[data-act=puzTap][data-i="{j}"]')
        await pg.wait_for_timeout(500);await closeov(pg);print('puzzle',await P())
        # maze BFS
        await pg.evaluate("__T.V().mazeLv=0;__T.go('maze')")
        path=await pg.evaluate("""(()=>{const X=__T.X(),n=X.n,c=X.cells,prev={0:null},q=[0];const D=[['U',-n,0],['R',1,1],['D',n,2],['L',-1,3]];
          while(q.length){const u=q.shift();for(const[d,o,w]of D){if(c[u][w])continue;const v=u+o;if(v in prev)continue;prev[v]=[u,d];q.push(v)}}
          const out=[];let v=n*n-1;while(prev[v]){out.unshift(prev[v][1]);v=prev[v][0]}return out})()""")
        for d in path: await pg.evaluate(f"__T.mazeMove('{d}')")
        await closeov(pg);print('maze',await P(),await pg.evaluate("__T.V().mazeLv"))
        # hangman
        await pg.evaluate("__T.go('hangman')");w=await pg.evaluate("__T.X().w")
        for ch in dict.fromkeys(w): await pg.click(f'[data-k="{ch}"]')
        await closeov(pg);print('hangman',w,await P())
        # pixel
        await pg.evaluate("__T.go('pixel')")
        await pg.evaluate("""(()=>{const X=__T.X();X.t.g.join('').split('').forEach((c,i)=>X.cells[i]=c);X.cells[0]=X.cells[0]})()""")
        await pg.evaluate("pxCheck()") if False else None
        # paint last needed cell via real pointer to trigger check
        tg=await pg.evaluate("__T.X().t.g.join('')")
        await pg.evaluate("(()=>{const X=__T.X();const tg=X.t.g.join('');const i=[...tg].findIndex(c=>c!=='.');X.cells[i]='.';})()")
        i=[k for k,c in enumerate(tg) if c!='.'][0]
        await pg.click(f'[data-act=pxCol][data-c="{tg[i]}"]')
        box=await pg.locator(f'#board i[data-i="{i}"]').bounding_box()
        await pg.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
        await closeov(pg);print('pixel',await P())
        # duel
        await pg.evaluate("__T.go('duel')")
        for _ in range(7):
            a=await pg.evaluate("__T.X().q.ans");await pg.click(f'[data-act=duelAns][data-p="0"][data-o="{a}"]');await pg.wait_for_timeout(800)
        await closeov(pg);print('duel',await P(),await pg.evaluate("__T.V().name"))
        # music
        await pg.evaluate("__T.V().song='hvezda';__T.go('music')")
        for n in [0,0,4,4,5,5,4,3,3,2,2,1,1,0]: await pg.click(f'[data-act=musTap][data-i="{n}"]',force=True)
        await pg.wait_for_timeout(700);await closeov(pg);print('music',await P())
        # diff
        await pg.evaluate("__T.go('diff')")
        ds=await pg.evaluate("__T.X().diffs")
        for d in ds:
            bb=await pg.locator('#dB').bounding_box();await pg.mouse.click(bb['x']+bb['width']*d['x']/100,bb['y']+bb['height']*d['y']/100)
        await closeov(pg);print('diff',await P())
        # 2048
        await pg.evaluate("__T.go('g2048')");await pg.evaluate("__T.X().b=[128,128,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]");await pg.evaluate("__T.g2move('L')");await closeov(pg);print('2048',await P())
        # iy quiz
        await pg.evaluate("__T.go('learn')");await pg.click('[data-act=startIy]')
        for _ in range(10):
            a=await pg.evaluate("__T.L().q.ans");await pg.click(f'[data-act=geoAns][data-o="{a}"]');await pg.click('[data-act=learnNext]')
        await closeov(pg);print('iy',await P(),await pg.evaluate("__T.V().name"))
        # album
        await pg.evaluate("__T.go('album')");await pg.click('[data-act=buyPack]');await closeov(pg);print('album',await P(),await pg.evaluate("Object.keys(__T.S().kids.bea.stickers||{}).length"))
        # reward claim
        await pg.evaluate("__T.go('shop')");await pg.locator('[data-act=buyReward]').first.click();await closeov(pg)
        print('claim',await P(),await pg.evaluate("JSON.stringify(Object.values(__T.S().claims))"))
        log=await pg.evaluate("Object.values(__T.S().log).sort((a,b)=>a.ts-b.ts).filter(l=>l.kid==='bea').slice(-14).map(l=>l.pts+' '+l.type+' '+l.text)")
        print('\n'.join(log));print(errs);await b.close()
asyncio.run(main())
