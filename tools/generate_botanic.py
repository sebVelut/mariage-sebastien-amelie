#!/usr/bin/env python3
"""
Genere les illustrations botaniques (SVG) du site.
Style : feuillage aquarelle type eucalyptus / olivier, dans une palette verte
douce accordee au faire-part.

Usage :  python3 tools/generate_botanic.py
Sortie : assets/img/botanic/*.svg
"""
import math
import os
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "assets", "img", "botanic")
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- palettes --
GREENS = [
    ("#c9d9be", "#9db98c"),   # sauge tres clair
    ("#b6cca6", "#8bad78"),   # sauge clair
    ("#9dba8c", "#75996a"),   # vert moyen
    ("#87a97a", "#5f8358"),   # vert profond
    ("#a8bfa0", "#7d9c76"),   # vert grisé
]
STEMS = ["#8a9c76", "#7d9169", "#94a583"]
BROWNS = [("#c3ac8c", "#a28767"), ("#b39c7c", "#8f7758")]


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


def leaf(cx, cy, rx, ry, angle, light, dark, opacity, gid, midrib=True):
    """Une feuille : ellipse doucement degradee + nervure centrale."""
    out = [
        f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({angle:.1f})" '
        f'opacity="{opacity:.2f}">',
        f'<ellipse rx="{rx:.1f}" ry="{ry:.1f}" fill="url(#{gid})"/>',
    ]
    if midrib:
        out.append(
            f'<path d="M{-rx * 0.82:.1f} 0 Q0 {-ry * 0.14:.1f} {rx * 0.82:.1f} 0" '
            f'fill="none" stroke="{dark}" stroke-opacity=".38" '
            f'stroke-width="{max(0.7, ry * 0.09):.2f}" stroke-linecap="round"/>')
    out.append('</g>')
    return "".join(out)


def gradients(palette):
    """Degrades radiaux, un par couleur de feuille."""
    defs = []
    for i, (light, dark) in enumerate(palette):
        defs.append(
            f'<radialGradient id="lg{i}" cx="38%" cy="34%" r="78%">'
            f'<stop offset="0%" stop-color="{light}"/>'
            f'<stop offset="62%" stop-color="{dark}"/>'
            f'<stop offset="100%" stop-color="{dark}" stop-opacity=".88"/>'
            f'</radialGradient>')
    return "".join(defs)


def branch(rnd, p0, p1, p2, p3, n_leaves=14, leaf_len=26, leaf_w=15,
           taper=0.55, spread=64, stem_w=2.2, kind="euca", start=0.06):
    """Une branche : tige en Bezier + feuilles alternees le long de la tige."""
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
        jitter = rnd.uniform(-11, 11)
        la = ang + side * (spread + jitter)
        # la feuille pousse depuis la tige, pas centree dessus
        off = rx * 0.86
        lx = x + math.cos(math.radians(la)) * off
        ly = y + math.sin(math.radians(la)) * off
        gi = rnd.randrange(len(GREENS))
        light, dark = GREENS[gi]
        if kind == "olive":
            ry *= 0.52
            rx *= 1.12
        parts.append(leaf(lx, ly, rx, ry, la, light, dark,
                          rnd.uniform(0.78, 0.97), f"lg{gi}"))
        # petit pedoncule
        parts.append(
            f'<path d="M{x:.1f} {y:.1f} L{lx - math.cos(math.radians(la)) * rx * 0.72:.1f} '
            f'{ly - math.sin(math.radians(la)) * rx * 0.72:.1f}" stroke="{stem}" '
            f'stroke-width="{stem_w * 0.55:.2f}" opacity=".7" stroke-linecap="round"/>')
    return "".join(parts)


def berries(rnd, cx, cy, n=7, r=4.2, spread=26):
    out = []
    light, dark = rnd.choice(BROWNS)
    for _ in range(n):
        a = rnd.uniform(0, math.tau)
        d = rnd.uniform(0, spread)
        rr = r * rnd.uniform(0.7, 1.2)
        out.append(f'<circle cx="{cx + math.cos(a) * d:.1f}" '
                   f'cy="{cy + math.sin(a) * d:.1f}" r="{rr:.1f}" '
                   f'fill="{light}" stroke="{dark}" stroke-opacity=".5" '
                   f'stroke-width=".8" opacity=".9"/>')
    return "".join(out)


def svg(w, h, body, extra_defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'width="{w}" height="{h}" fill="none">'
            f'<defs>{gradients(GREENS)}{extra_defs}</defs>{body}</svg>')


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
    b.append(berries(rnd, 96, H * 0.34, n=8, spread=30))
    b.append(berries(rnd, 58, H * 0.62, n=6, spread=24))
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
    b.append(berries(rnd, W - 92, H * 0.40, n=7, spread=28))
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
    b.append(berries(rnd, 170, H * 0.52, n=7, spread=26))
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
    # petit losange central
    b.append(f'<g transform="translate({W / 2:.0f} {mid:.0f}) rotate(45)">'
             f'<rect x="-5" y="-5" width="10" height="10" fill="none" '
             f'stroke="#a2846a" stroke-width="1.2" opacity=".75"/></g>')
    return svg(W, H, "".join(b))


# ------------------------------------------------------- 5. petite touffe --
def sprig(seed=5, w=200, h=110):
    rnd = random.Random(seed)
    b = [branch(rnd, (10, h - 12), (w * 0.35, h * 0.18), (w * 0.62, h * 0.9),
                (w - 12, h * 0.28), n_leaves=11, leaf_len=20, leaf_w=13,
                spread=62, stem_w=1.5, taper=0.4)]
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
    b.append(berries(rnd, cx - R * 0.86, cy + R * 0.2, n=6, spread=22))
    b.append(berries(rnd, cx + R * 0.86, cy - R * 0.3, n=6, spread=22))
    return svg(W, H, "".join(b))


if __name__ == "__main__":
    print("Generation du feuillage :")
    write("column-left.svg", column_left())
    write("column-right.svg", column_right())
    write("corner-top-left.svg", corner(3))
    write("corner-bottom-right.svg", corner(9, flip_x=True, flip_y=True))
    write("corner-top-right.svg", corner(23, flip_x=True))
    write("divider.svg", divider())
    write("sprig-a.svg", sprig(5))
    write("sprig-b.svg", sprig(31))
    write("wreath.svg", wreath())
    print("Termine.")
