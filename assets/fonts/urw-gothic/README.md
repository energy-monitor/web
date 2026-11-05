# URW Gothic

The font of the site (see `assets/styles/fonts.scss`): URW Gothic of the
URW base 35 fonts, release 20200910
(https://github.com/ArtifexSoftware/urw-base35-fonts, `fonts/URWGothic-*.otf`),
a geometric sans (a clone of ITC Avant Garde Gothic) close to Century Gothic,
in the weights Book (400) and Demi (600) with their obliques. License: AGPL-3
with a font exception (`LICENSE`, `COPYING`); the source of these files are the
OpenType fonts of the release above and the script `inferiors.py`.

The files are those fonts with two changes:

1. the subscript digits U+2080-2089 (e.g. the 2 of CO₂), which the fonts do
   not have: their superscript digits moved below the baseline (along the
   slant of the obliques), `inferiors.py` (fonttools):

       python inferiors.py URWGothic-<style>.otf <output>.otf

   Without them the browser takes the digit of another font, of another
   size and position on every computer.

2. a subset of their characters
   (Latin with its extensions, combining marks, punctuation, currency,
   letterlike, arrows, math operators, geometric shapes) as WOFF2 (fonttools
   with brotli):

       pyftsubset <output>.otf --layout-features='*' --flavor=woff2 \
           --unicodes="U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2200-22FF,U+25A0-25FF"
