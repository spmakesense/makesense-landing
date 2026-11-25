import base64, os, sys
D = os.path.dirname(os.path.abspath(__file__))
def b64(n): return 'data:image/png;base64,' + base64.b64encode(open(os.path.join(D, n), 'rb').read()).decode()
def svg(inner): return f'<svg viewBox="0 0 24 24">{inner}</svg>'
I = {
 'I_CARD': svg('<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>'),
 'I_GIFT': svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
 'I_PIE': svg('<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>'),
 'I_HOME': svg('<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
 'I_USERS': svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
 'I_SHIELD': svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
 'I_SPROUT': svg('<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>'),
 'I_UMB': svg('<path d="M22 12a10 10 0 0 0-20 0z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>'),
 'I_WA': '<svg viewBox="0 0 24 24" fill="#141414"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
}
def dial(angle):  # gauge with needle; angle in degrees from left (0) to right (180)
    import math
    a = math.radians(180 - angle); x = 20 + 13 * math.cos(a); y = 18 - 13 * math.sin(a)
    return (f'<svg viewBox="0 0 40 22"><path d="M4 18a16 16 0 0 1 32 0" fill="none" stroke="#dde0e6" stroke-width="3.5" stroke-linecap="round"/>'
            f'<path d="M4 18a16 16 0 0 1 32 0" fill="none" stroke="#3BBDD4" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="{50.3*angle/180:.1f} 60"/>'
            f'<line x1="20" y1="18" x2="{x:.1f}" y2="{y:.1f}" stroke="#0D21A1" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="18" r="2.4" fill="#0D21A1"/></svg>')
I.update(DIAL1=dial(70), DIAL2=dial(120), DIAL3=dial(95))
I.update(LOGO=b64('logo_c.png'), FACE=b64('face.png'), QR=b64('qr.png'),
         WA='https://wa.me/972524415395?text=%D7%9E%D7%96%D7%9C%20%D7%98%D7%95%D7%91')
html = open(os.path.join(D, 'guide.tpl.html'), encoding='utf-8').read()
for k, v in I.items(): html = html.replace('{{' + k + '}}', v)
assert '{{' not in html, html[html.index('{{'):html.index('{{')+30]
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
open(os.path.join(out, 'wedding-guide.html'), 'w', encoding='utf-8').write(html)
print('ok')
