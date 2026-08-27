#!/usr/bin/env python3
"""
Assemble le site en UN SEUL fichier HTML autonome (CSS, JS et SVG intégrés).
Pratique pour un aperçu partageable ou un envoi par e-mail.

Usage :
    python3 tools/build_single_file.py               -> apercu.html (page complète)
    python3 tools/build_single_file.py --fragment out.html
        -> sans <!doctype>/<html>/<head>/<body>, pour un hébergeur qui
           fournit lui-même l'ossature de la page.
"""
import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda *p: open(os.path.join(ROOT, *p), encoding="utf-8").read()

FONTS = ("https://fonts.googleapis.com/css2?"
         "family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400"
         "&family=Jost:wght@200;300;400;500&family=Petit+Formal+Script&display=swap")


def svg_data_uri(rel_from_css):
    """assets/css/../img/botanic/x.svg  ->  data:image/svg+xml;base64,…"""
    path = os.path.normpath(os.path.join(ROOT, "assets", "css", rel_from_css))
    with open(path, "rb") as f:
        return "data:image/svg+xml;base64," + base64.b64encode(f.read()).decode()


def inline_css():
    css = read("assets", "css", "style.css")
    # remplace url("../img/…") par le SVG encodé
    def sub(m):
        return 'url("%s")' % svg_data_uri(m.group(1))
    return re.sub(r'url\("(\.\./img/[^"]+)"\)', sub, css)


def build(fragment=False):
    html = read("index.html")

    body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
    # on retire les <script src> : le JS est injecté juste après
    body = re.sub(r'\s*<script src="[^"]+"></script>', "", body)

    js = read("assets", "js", "config.js") + "\n" + read("assets", "js", "main.js")

    cfg = read("assets", "js", "config.js")
    noms = re.findall(r'prenom[AB]:\s*"([^"]+)"', cfg) or ["Notre", "mariage"]

    head = (
        f'<title>Faire-part {noms[0]} &amp; {noms[-1]}</title>\n'
        f'<link rel="preconnect" href="https://fonts.googleapis.com">\n'
        f'<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
        f'<link rel="stylesheet" href="{FONTS}">\n'
        f"<style>\n{inline_css()}\n</style>"
    )
    tail = f"<script>\n{js}\n</script>"

    if fragment:
        return f"{head}\n{body}\n{tail}\n"

    return (
        '<!DOCTYPE html>\n<html lang="fr">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f"{head}\n</head>\n<body>\n{body}\n{tail}\n</body>\n</html>\n"
    )


if __name__ == "__main__":
    frag = "--fragment" in sys.argv
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    out = args[0] if args else os.path.join(ROOT, "apercu.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(build(frag))
    print(f"{out} — {os.path.getsize(out) // 1024} Ko")
