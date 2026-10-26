#!/usr/bin/env python3
"""Validate the standalone WordPress distribution source without PHP/WP runtime."""
import json, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parents[1]/"wordpress"
theme=root/"forex-trade-technology"
plugin=root/"forex-contact"
read=lambda p: json.loads(p.read_text(encoding="utf8"))
errors=[]
def check(expr,msg):
    if not expr:errors.append(msg)
for file in ("style.css","functions.php","theme.json","inc/render.php","inc/import.php","templates/front-page.html","templates/page.html","templates/404.html","parts/header.html","parts/footer.html","parts/final-cta.html","assets/css/front.css","assets/css/editor.css","assets/js/editor.js","assets/js/view.js","source/content/site.config.json","source/theme/theme.json"):
    check((theme/file).exists(),"Missing "+file)
check((plugin/"forex-contact.php").exists(),"Missing standalone contact plugin")
data=read(theme/"source/content/site.config.json")
pages=[read(p) for p in sorted((theme/"source/content/pages").glob("*.json"))]
check(len(pages)==13,"Expected 13 source pages")
check(len({p["slug"] for p in pages})==13,"Page paths must be unique")
check(all(p["seo"]["canonicalPath"]==p["slug"] for p in pages),"Canonical mismatch")
check(sum(len(p["sections"]) for p in pages)==87,"Expected 87 original sections")
check(sum(len(s.get("items",[])) for p in pages for s in p["sections"] if s.get("layout")=="faqAccordion")==42,"Expected 42 FAQs")
check(len(next(p for p in pages if p["id"]=="home")["pageTop"]["slides"])==5,"Expected five home slides")
check(len(read(theme/"source/theme/theme.json")["assets"]["images"])==26,"Expected 26 images")
for key in ("section","home-slider","trading-stack-flow","trust-carousel","audience-carousel","icon-card","contact-form"):
    p=theme/"blocks"/key/"block.json"
    check(p.exists(),"Missing block "+key)
    if p.exists():
        doc=read(p)
        check(doc.get("name")=="forex-trade-technology/"+key,"Wrong block name "+key)
        check(doc.get("apiVersion")==3,"Block not apiVersion 3 "+key)
wptheme=read(theme/"theme.json")
check(wptheme.get("version")==3,"WordPress theme.json needs schema version 3")
front=(theme/"assets/css/front.css").read_text(encoding="utf8")
css=(theme/"source/theme/styles/index.css").read_text(encoding="utf8")
for path in re.findall(r'@import\s+["\']([^"\']+)["\']',css):
    check((theme/"source/theme/styles"/path).resolve().exists(),"Missing CSS import "+path)
check("@import url('../../source/theme/styles/index.css')" in front,"CSS cascade missing")
for token in ("FTT_RESEND_API_KEY","FTT_CONTACT_FROM","FTT_CONTACT_TO"):
    check(token in (plugin/"forex-contact.php").read_text(encoding="utf8"),"Secret boundary "+token)
if errors:
    for error in errors:print("FAIL",error)
    sys.exit(1)
print("PASS WordPress distribution checks: 13 pages, 87 sections, 42 FAQs, 26 assets, 7 custom blocks; no WordPress runtime in Next.")
