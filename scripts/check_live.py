import re
import urllib.request

BASE = "https://samiinw.github.io/relic/"
UA = {"User-Agent": "Mozilla/5.0"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")


status, html = fetch(BASE)
print("PAGE", BASE, "->", status)

m = re.findall(r'/relic/_next/static/[^"\']+\.js', html)
if not m:
    print("No _next JS bundle reference found in HTML")
else:
    bundle = "https://samiinw.github.io" + m[0]
    bstatus, _ = fetch(bundle)
    print("BUNDLE", bundle, "->", bstatus)

print("HAS_HERO", "Provenance" in html)
