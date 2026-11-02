import asyncio
from playwright.async_api import async_playwright
html=open('/home/claude/bodikov.html').read().replace("MAP.games=vGames2;","MAP.games=vGames2;window.__T={put,go,addLog,S:()=>S};",1)
mock="""window.SpeechRecognition=function(){const r=this;r.start=()=>{setTimeout(()=>{const res=[{transcript:window.__say,confidence:.5},{transcript:'xx'}];res.isFinal=true;r.onresult&&r.onresult({results:[res]});r.onend&&r.onend()},200)};r.stop=()=>{}}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.set_content('<!doctype html><html><head><meta charset=utf8><script>'+mock+'</script></head><body>'+html+'</body></html>')
        await pg.click('[data-id=lea]')
        await pg.evaluate("__T.put('kids/lea/unlocked/pet',true);__T.addLog('lea',50,'task','t',true);__T.put('kids/lea/pet',{type:'kocka',name:'Micka',born:0,ts:Date.now(),food:40,joy:50,clean:80,energy:80});__T.go('pet')")
        await pg.click('[data-act=petTab][data-t=talk]')
        for say in ['pojď si hlát','jekni mi fip','mám hlad']:
            await pg.evaluate(f"window.__say={say!r}");await pg.click('[data-act=petListen]');await pg.wait_for_timeout(800)
            print(say,'|',await pg.locator('.bubble2').text_content(),'| tab',await pg.evaluate("V.petTab") if False else '')
        await pg.screenshot(path='/tmp/claude-0/sh/t4.png',full_page=True)
        print(await pg.evaluate("JSON.stringify(__T.S().kids.lea.pet.joy)"),errs);await b.close()
asyncio.run(main())
