# the subscript digits U+2080-2089 (inferiors), which URW Gothic does not
# have, as its superscript digits (U+2070-2079 and the ones of Latin-1) moved
# down, their bottom at BOTTOM units below the baseline (of 1000 per em)
import sys, pathlib, math
from fontTools.ttLib import TTFont
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
BOTTOM = -50
src, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
supers = {0: 0x2070, 1: 0xB9, 2: 0xB2, 3: 0xB3, **{d: 0x2070 + d for d in range(4, 10)}}
t = TTFont(src)
cmap = t.getBestCmap(); gs = t.getGlyphSet()
cff = t['CFF '].cff; top = cff.topDictIndex[0]; cs = top.CharStrings
# the shift of all inferiors the same: from the bottom of the superior two
b = BoundsPen(gs); gs[cmap[0xB2]].draw(b); dy = BOTTOM - b.bounds[1]
# along the slant of the obliques
dx = dy * math.tan(math.radians(-t['post'].italicAngle))
order = t.getGlyphOrder()
for d, su in supers.items():
    name = f'uni{0x2080 + d:04X}'
    if 0x2080 + d in cmap:
        continue
    g = cmap[su]; width = t['hmtx'][g][0]
    pen = T2CharStringPen(width, gs)
    gs[g].draw(TransformPen(pen, (1, 0, 0, 1, dx, dy)))
    c = pen.getCharString(private=top.Private, globalSubrs=cff.GlobalSubrs)
    cs.charStringsIndex.append(c); cs.charStrings[name] = len(cs.charStringsIndex) - 1
    top.charset.append(name); order.append(name)
    t['hmtx'][name] = t['hmtx'][g]
    for sub in t['cmap'].tables:
        if sub.isUnicode():
            sub.cmap[0x2080 + d] = name
t.setGlyphOrder(order); t['maxp'].numGlyphs = len(order)
t.save(out); print(out.name, 'shift', round(dx), dy)
