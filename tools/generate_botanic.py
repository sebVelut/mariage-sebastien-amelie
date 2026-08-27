#!/usr/bin/env python3
"""
Genere les illustrations botaniques (SVG) du site.

Style : aquarelle florale — feuillage vert-bleute et violine, fleurs lavande,
violet et rose magenta, dans l'esprit du save-the-date.

Usage :  python3 tools/generate_botanic.py
Sortie : assets/img/botanic/*.svg

Ou regler les couleurs :
  LEAVES  -> teintes du feuillage      (clair, fonce)
  BLOOMS  -> teintes des fleurs        (coeur, petale clair, petale fonce)
  BUDS    -> teintes des petites baies (clair, fonce)
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "img", "botanic")
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- palettes --
# Feuillage : vert-bleute dominant, quelques feuilles violines comme sur
# l'aquarelle du faire-part.
LEAVES = [
    ("#C4D6D2", "#93B3AC"),   # vert d'eau clair
    ("#B0C8C4", "#7FA39C"),   # vert-bleute
    ("#A7BFC6", "#758FA0"),   # vert ardoise
    ("#9DB6B0", "#6C8D86"),   # vert profond
    ("#C3C6E2", "#8E92C2"),   # feuille bleu-lavande
    ("#B6ADD6", "#8074B2"),   # feuille violine
]

# Fleurs : (coeur, petale clair, petale fonce)
BLOOMS = [
    ("#F3EEF8", "#D4C9EC", "#8E7FC4"),   # lavande
    ("#F1EFFA", "#C2C6EC", "#7C86C6"),   # bleu-violet
    ("#F6EEF4", "#E7C4DC", "#B87BA8"),   # rose magenta
    ("#FBF0F2", "#EFCBD4", "#C88C9E"),   # rose poudre
    ("#F2EDF9", "#C8B6E4", "#7A6BB0"),   # violet profond
]

# Force du flou "aquarelle" applique aux fleurs (0 = contours nets)
WATERCOLOR = 1.1

BUDS = [("#CFC5E8", "#8D7FBE"), ("#E6C6DC", "#B87BA8"), ("#C2CBE6", "#7E8CC0")]

STEMS = ["#8FA79E", "#87A0A6", "#9AA3C0"]


# ------------------------------------------------------------- geometrie --
def bezier(p0, p1, p2, p3, t):
    """Point et tangente d'une cubique de Bezier."""
    mt = 1 - t
    x = (mt ** 3 * p0[0] + 3 * mt * mt * t * p1[0]
         + 3 * mt * t * t * p2[0] + t ** 3 * p3[0])
    y = (mt ** 3 * p0[1] + 3 * mt * mt * t * p1[1]
         + 3 * mt * t * t * p2[1] + t ** 3 * p3[1])
    dx = (3 * mt * mt * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0])
          + 3 * t * t * (p3[0] - p2[0]))
    dy = (3 * mt * mt * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1])
          + 3 * t * t * (p3[1] - p2[1]))
    return x, y, math.degrees(math.atan2(dy, dx))


def defs():
    """Degrades radiaux : un par teinte de feuille, trois par fleur."""
    out = []
    for i, (light, dark) in enumerate(LEAVES):
        out.append(
            f'<radialGradient id="lg{i}" cx="38%" cy="34%" r="78%">'
            f'<stop offset="0%" stop-color="{light}"/>'
            f'<stop offset="62%" stop-color="{dark}"/>'
            f'<stop offset="100%" stop-color="{dark}" stop-opacity=".88"/>'
            f'</radialGradient>')
    for i, (core, light, dark) in enumerate(BLOOMS):
        # petale : clair au pied, sature au bout
        out.append(
            f'<radialGradient id="pt{i}" cx="50%" cy="88%" r="96%">'
            f'<stop offset="0%" stop-color="{core}"/>'
            f'<stop offset="42%" stop-color="{light}"/>'
            f'<stop offset="100%" stop-color="{dark}" stop-opacity=".92"/>'
            f'</radialGradient>')
        out.append(
            f'<radialGradient id="ct{i}" cx="42%" cy="38%" r="70%">'
            f'<stop offset="0%" stop-color="{core}"/>'
            f'<stop offset="100%" stop-color="{dark}" stop-opacity=".75"/>'
            f'</radialGradient>')
        # halo : le lavis qui deborde autour de la fleur
        out.append(
            f'<radialGradient id="hl{i}" cx="50%" cy="50%" r="50%">'
            f'<stop offset="0%" stop-color="{light}" stop-opacity=".38"/>'
            f'<stop offset="58%" stop-color="{light}" stop-opacity=".16"/>'
            f'<stop offset="100%" stop-color="{light}" stop-opacity="0"/>'
            f'</radialGradient>')
    # flou aquarelle des petales
    out.append(f'<filter id="wc" x="-40%" y="-40%" width="180%" height="180%">'
               f'<feGaussianBlur stdDeviation="{WATERCOLOR}"/></filter>')
    return "".join(out)


# ---------------------------------------------------------------- feuille --
def leaf(cx, cy, rx, ry, angle, dark, opacity, gid, midrib=True):
    out = [
        f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({angle:.1f})" '
        f'opacity="{opacity:.2f}">',
        f'<ellipse rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#{gid})"/>',
    ]
    if midrib:
        out.append(
            f'<path d="M{-rx * 0.82:.1f} 0 Q0 {-ry * 0.14:.1f} {rx * 0.82:.1f} 0" '
            f'fill="none" stroke="{dark}" stroke-opacity=".32" '
            f'stroke-width="{max(0.7, ry * 0.09):.2f}" stroke-linecap="round"/>')
    out.append('</g>')
    return "".join(out)


# ------------------------------------------------------------------ fleur --
def bloom(rnd, cx, cy, r=26, bi=None, petals=None, tilt=None):
    """Fleur aquarelle : petales rayonnants + coeur pointille."""
    bi = rnd.randrange(len(BLOOMS)) if bi is None else bi
    core, light, dark = BLOOMS[bi]
    n = petals if petals else rnd.choice([5, 5, 6, 7])
    tilt = rnd.uniform(0, 360) if tilt is None else tilt
    squash = rnd.uniform(0.78, 1.0)          # legere perspective
    out = [f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({tilt:.1f}) '
           f'scale(1 {squash:.2f})">',
           # lavis diffus autour de la fleur
           f'<circle r="{r * 1.55:.1f}" fill="url(#hl{bi})"/>',
           f'<g filter="url(#wc)">']

    # couche arriere : petales legerement plus grands et plus pales
    for i in range(n):
        a = 360 / n * i + rnd.uniform(-7, 7)
        pr = r * rnd.uniform(1.0, 1.14)
        out.append(
            f'<ellipse cx="0" cy="{-pr * 0.52:.1f}" rx="{pr * 0.44:.1f}" '
            f'ry="{pr * 0.56:.1f}" fill="url(#pt{bi})" opacity=".55" '
            f'transform="rotate({a:.1f})"/>')
    # couche avant
    for i in range(n):
        a = 360 / n * i + 180 / n + rnd.uniform(-6, 6)
        pr = r * rnd.uniform(0.86, 1.0)
        out.append(
            f'<ellipse cx="0" cy="{-pr * 0.5:.1f}" rx="{pr * 0.4:.1f}" '
            f'ry="{pr * 0.54:.1f}" fill="url(#pt{bi})" opacity=".9" '
            f'transform="rotate({a:.1f})"/>')

    out.append('</g>')   # fin du groupe floute

    # coeur (net, pour garder un point de nettete)
    out.append(f'<circle r="{r * 0.2:.1f}" fill="url(#ct{bi})"/>')
    for _ in range(rnd.randint(5, 8)):
        a = rnd.uniform(0, math.tau)
        d = rnd.uniform(r * 0.06, r * 0.24)
        out.append(f'<circle cx="{math.cos(a) * d:.1f}" cy="{math.sin(a) * d:.1f}" '
                   f'r="{rnd.uniform(0.8, 1.7):.1f}" fill="{dark}" opacity=".55"/>')
    out.append('</g>')
    return "".join(out)


def buds(rnd, cx, cy, n=7, r=4.2, spread=26):
    """Petites baies / boutons groupes."""
    out = []
    light, dark = rnd.choice(BUDS)
    for _ in range(n):
        a = rnd.uniform(0, math.tau)
        d = rnd.uniform(0, spread)
        rr = r * rnd.uniform(0.7, 1.2)
        out.append(f'<circle cx="{cx + math.cos(a) * d:.1f}" '
                   f'cy="{cy + math.sin(a) * d:.1f}" r="{rr:.1f}" '
                   f'fill="{light}" stroke="{dark}" stroke-opacity=".55" '
                   f'stroke-width=".8" opacity=".9"/>')
    return "".join(out)


# ----------------------------------------------------------------- branche --
def branch(rnd, p0, p1, p2, p3, n_leaves=14, leaf_len=26, leaf_w=15,
           taper=0.55, spread=64, stem_w=2.2, kind="euca", start=0.06,
           violet_ratio=0.22):
    """Tige en Bezier + feuilles alternees. `violet_ratio` = part de feuilles
    violines (indices 4 et 5 de LEAVES)."""
    stem = rnd.choice(STEMS)
    parts = [
        f'<path d="M{p0[0]:.1f} {p0[1]:.1f} C{p1[0]:.1f} {p1[1]:.1f} '
        f'{p2[0]:.1f} {p2[1]:.1f} {p3[0]:.1f} {p3[1]:.1f}" fill="none" '
        f'stroke="{stem}" stroke-width="{stem_w}" stroke-linecap="round" '
        f'opacity=".85"/>'
    ]
    for i in range(n_leaves):
        t = start + (1 - start) * (i / max(1, n_leaves - 1))
        x, y, ang = bezier(p0, p1, p2, p3, t)
        side = 1 if i % 2 == 0 else -1
        scale = (1 - taper * t) * rnd.uniform(0.82, 1.14)
        rx = leaf_len * scale
        ry = leaf_w * scale
        la = ang + side * (spread + rnd.uniform(-11, 11))
        off = rx * 0.86
        lx = x + math.cos(math.radians(la)) * off
        ly = y + math.sin(math.radians(la)) * off
        gi = rnd.randrange(4, 6) if rnd.random() < violet_ratio else rnd.randrange(4)
        if kind == "olive":
            ry *= 0.52
            rx *= 1.12
        parts.append(leaf(lx, ly, rx, ry, la, LEAVES[gi][1],
                          rnd.uniform(0.78, 0.97), f"lg{gi}"))
        parts.append(
            f'<path d="M{x:.1f} {y:.1f} L{lx - math.cos(math.radians(la)) * rx * 0.72:.1f} '
            f'{ly - math.sin(math.radians(la)) * rx * 0.72:.1f}" stroke="{stem}" '
            f'stroke-width="{stem_w * 0.55:.2f}" opacity=".7" stroke-linecap="round"/>')
    return "".join(parts)


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" fill="none">'
            f'<defs>{defs()}</defs>{body}</svg>')


def write(name, content):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(content)
    print("  ->", name, f"({len(content) // 1024} Ko)")


# ------------------------------------------------------- 1. colonne gauche --
def column_left(seed=7):
    rnd = random.Random(seed)
    W, H = 320, 1200
    b = []
    b.append(branch(rnd, (-10, H + 30), (90, H * 0.78), (10, H * 0.46), (120, H * 0.10),
                    n_leaves=22, leaf_len=34, leaf_w=22, spread=58, stem_w=2.6))
    b.append(branch(rnd, (-30, H + 10), (140, H * 0.86), (60, H * 0.60), (200, H * 0.30),
                    n_leaves=16, leaf_len=27, leaf_w=17, spread=70, stem_w=2.0,
                    kind="olive"))
    b.append(branch(rnd, (-20, H * 0.74), (80, H * 0.62), (30, H * 0.44), (110, H * 0.24),
                    n_leaves=12, leaf_len=22, leaf_w=15, spread=76, stem_w=1.6))
    # fleurs echelonnees le long de la colonne
    b.append(bloom(rnd, 74, H * 0.13, 30, bi=0))
    b.append(bloom(rnd, 40, H * 0.21, 20, bi=2))
    b.append(bloom(rnd, 108, H * 0.42, 26, bi=4))
    b.append(bloom(rnd, 62, H * 0.50, 18, bi=1))
    b.append(bloom(rnd, 46, H * 0.70, 28, bi=3))
    b.append(bloom(rnd, 96, H * 0.79, 21, bi=0))
    b.append(bloom(rnd, 38, H * 0.92, 24, bi=1))
    b.append(buds(rnd, 96, H * 0.34, n=8, spread=30))
    b.append(buds(rnd, 58, H * 0.62, n=6, spread=24))
    return svg(W, H, f'<g opacity=".95">{"".join(b)}</g>')


# ------------------------------------------------------ 2. colonne droite --
def column_right(seed=21):
    rnd = random.Random(seed)
    W, H = 320, 1200
    b = []
    b.append(branch(rnd, (W + 10, H + 40), (W - 100, H * 0.80), (W - 20, H * 0.50),
                    (W - 130, H * 0.12), n_leaves=21, leaf_len=33, leaf_w=21,
                    spread=58, stem_w=2.6))
    b.append(branch(rnd, (W + 30, H * 0.92), (W - 150, H * 0.74), (W - 70, H * 0.50),
                    (W - 190, H * 0.26), n_leaves=15, leaf_len=26, leaf_w=17,
                    spread=72, stem_w=2.0, kind="olive"))
    b.append(branch(rnd, (W + 20, H * 0.60), (W - 90, H * 0.50), (W - 40, H * 0.34),
                    (W - 120, H * 0.16), n_leaves=11, leaf_len=21, leaf_w=14,
                    spread=74, stem_w=1.6))
    b.append(bloom(rnd, W - 78, H * 0.10, 27, bi=2))
    b.append(bloom(rnd, W - 44, H * 0.19, 19, bi=4))
    b.append(bloom(rnd, W - 116, H * 0.38, 29, bi=1))
    b.append(bloom(rnd, W - 58, H * 0.47, 20, bi=3))
    b.append(bloom(rnd, W - 44, H * 0.68, 26, bi=0))
    b.append(bloom(rnd, W - 104, H * 0.82, 22, bi=2))
    b.append(bloom(rnd, W - 40, H * 0.93, 23, bi=4))
    b.append(buds(rnd, W - 92, H * 0.40, n=7, spread=28))
    b.append(buds(rnd, W - 62, H * 0.75, n=6, spread=22))
    return svg(W, H, f'<g opacity=".95">{"".join(b)}</g>')


# --------------------------------------------------------- 3. coin (angle) --
def corner(seed=3, flip_x=False, flip_y=False):
    rnd = random.Random(seed)
    W, H = 420, 380
    b = []
    b.append(branch(rnd, (-20, H + 20), (120, H * 0.70), (250, H * 0.66), (400, H * 0.30),
                    n_leaves=17, leaf_len=30, leaf_w=19, spread=62, stem_w=2.4))
    b.append(branch(rnd, (-20, H + 20), (60, H * 0.60), (60, H * 0.28), (150, -10),
                    n_leaves=13, leaf_len=25, leaf_w=16, spread=70, stem_w=2.0,
                    kind="olive"))
    b.append(branch(rnd, (-10, H + 10), (150, H * 0.92), (300, H * 0.92), (415, H * 0.72),
                    n_leaves=12, leaf_len=24, leaf_w=15, spread=66, stem_w=1.8))
    # bouquet : une grosse fleur, deux moyennes, deux petites
    b.append(bloom(rnd, 96, H * 0.66, 40, bi=4))
    b.append(bloom(rnd, 158, H * 0.46, 31, bi=0))
    b.append(bloom(rnd, 52, H * 0.40, 27, bi=2))
    b.append(bloom(rnd, 196, H * 0.78, 25, bi=3))
    b.append(bloom(rnd, 128, H * 0.90, 20, bi=1))
    b.append(buds(rnd, 218, H * 0.56, n=8, spread=28))
    tr = []
    if flip_x:
        tr.append(f"translate({W} 0) scale(-1 1)")
    if flip_y:
        tr.append(f"translate(0 {H}) scale(1 -1)")
    g = f'<g transform="{" ".join(tr)}">' if tr else "<g>"
    return svg(W, H, f'{g}{"".join(b)}</g>')


# ---------------------------------------------------- 4. separateur (fin) --
def divider(seed=11):
    rnd = random.Random(seed)
    W, H = 460, 120
    mid = H / 2
    b = []
    b.append(branch(rnd, (20, mid + 6), (110, mid - 24), (150, mid + 16), (205, mid),
                    n_leaves=9, leaf_len=21, leaf_w=13, spread=58, stem_w=1.6,
                    taper=0.42))
    b.append(branch(rnd, (W - 20, mid + 6), (W - 110, mid - 24), (W - 150, mid + 16),
                    (W - 205, mid), n_leaves=9, leaf_len=21, leaf_w=13, spread=58,
                    stem_w=1.6, taper=0.42))
    b.append(bloom(rnd, 168, mid - 4, 17, bi=2))
    b.append(bloom(rnd, W - 168, mid - 4, 17, bi=0))
    b.append(f'<g transform="translate({W / 2:.0f} {mid:.0f}) rotate(45)">'
             f'<rect x="-5" y="-5" width="10" height="10" fill="none" '
             f'stroke="#8E7FC4" stroke-width="1.2" opacity=".8"/></g>')
    return svg(W, H, "".join(b))


# ------------------------------------------------------- 5. petite touffe --
def sprig(seed=5, w=200, h=110, bi=0):
    rnd = random.Random(seed)
    b = [branch(rnd, (10, h - 12), (w * 0.35, h * 0.18), (w * 0.62, h * 0.9),
                (w - 12, h * 0.28), n_leaves=11, leaf_len=20, leaf_w=13,
                spread=62, stem_w=1.5, taper=0.4)]
    b.append(bloom(rnd, w * 0.34, h * 0.44, 22, bi=bi))
    b.append(bloom(rnd, w * 0.62, h * 0.62, 15, bi=(bi + 2) % len(BLOOMS)))
    return svg(w, h, "".join(b))


# ------------------------------------------------------------- 6. couronne --
def wreath(seed=17):
    rnd = random.Random(seed)
    W = H = 480
    cx = cy = W / 2
    R = 168
    b = []
    for side in (-1, 1):
        p0 = (cx, cy + R)
        p1 = (cx + side * R * 1.32, cy + R * 0.58)
        p2 = (cx + side * R * 1.32, cy - R * 0.62)
        p3 = (cx + side * 6, cy - R)
        b.append(branch(rnd, p0, p1, p2, p3, n_leaves=19, leaf_len=27, leaf_w=17,
                        spread=64, stem_w=2.0, taper=0.28))
    # fleurs reparties sur l'anneau
    for ang, r, bi in [(-96, 26, 0), (-24, 20, 2), (36, 30, 4),
                       (110, 23, 1), (172, 27, 3), (232, 19, 2), (292, 24, 0)]:
        a = math.radians(ang)
        b.append(bloom(rnd, cx + math.cos(a) * R * 1.02,
                       cy + math.sin(a) * R * 1.02, r, bi=bi))
    b.append(buds(rnd, cx - R * 0.92, cy + R * 0.26, n=6, spread=22))
    b.append(buds(rnd, cx + R * 0.92, cy - R * 0.34, n=6, spread=22))
    return svg(W, H, "".join(b))


if __name__ == "__main__":
    print("Generation du feuillage :")
    write("column-left.svg", column_left())
    write("column-right.svg", column_right())
    write("corner-top-left.svg", corner(3))
    write("corner-bottom-right.svg", corner(9, flip_x=True, flip_y=True))
    write("corner-top-right.svg", corner(23, flip_x=True))
    write("divider.svg", divider())
    write("sprig-a.svg", sprig(5, bi=0))
    write("sprig-b.svg", sprig(31, bi=2))
    write("wreath.svg", wreath())
    print("Termine.")
