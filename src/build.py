import json,sys,re,os
src=os.path.dirname(os.path.abspath(__file__))
root=os.path.dirname(src)
css=open(f'{src}/base.css.txt').read()+open(f'{src}/extra.css').read()
pics=open(f'{src}/pics.txt').read()
js=open(f'{src}/app.js').read().replace('/*PICS*/',pics).replace('/*ADULT*/',''.join(open(f'{src}/{n}').read() for n in ['adult.js','course.js','science.js','engine.js','vlast.js','rewards.js','pet.js','talk.js','games2.js']))
def build(config,version,deploy):
    j=js.replace('/*FIREBASE_CONFIG*/null',json.dumps(config) if config else 'null').replace("'/*APP_VERSION*/dev'",repr(version))
    head='''<title>Bodíkov</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#E4F2FF">
'''
    if deploy:
        head='''<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Bodíkov</title><meta name="theme-color" content="#E4F2FF">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Bodíkov">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-family:system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
'''
    head+='''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@600;700;800;900&display=swap">
'''
    out=head+'<style>'+css+'</style>\n'+('</head><body>' if deploy else '')+'<div id="app"></div>\n<script>\n'+j+'\n</script>\n'+('</body></html>\n' if deploy else '')
    return out
open(f'{src}/_preview.html','w').write(build(None,'dev',False))
cfg=None
if os.path.exists(f'{src}/firebase.json'): cfg=json.load(open(f'{src}/firebase.json'))
ver=sys.argv[1] if len(sys.argv)>1 else 'dev'
open(f'{root}/index.html','w').write(build(cfg,ver,True))
open(f'{root}/version.json','w').write(json.dumps({'v':ver}))
print('built',ver,'config' if cfg else 'no-config')
