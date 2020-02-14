# MoiréTest
See it in action [here](https://kevinchiggins.github.io/MoireTest/)!!

 UI prototype in JavaScript for manipulating hard-pixel SVG moiré art

As this is an experimental prototype, I'll use a devlog format (with dated entries, most recent first) rather than write documentation as such.

#### 14/02/20

Published on Github

Thinking about my next use case, bezier curves. The thing is, there's a mini-language to be parsed here. K, I'm gonna first of all assume all path elements are a bezier curve with an M absolutely positioned command followed by a q relatively positioned curve definition. I'll draw handles from that and use them to understand how it works. (It might be good to generate identifying text e.g. 'x1 y1' or 'M' for any selected handle, and show it in the control panel).

It'd be good while this thing is small to tighten up the scope, turning globals into parameters etc. Even though I said yesterday I wasn't worried. It's looking good and like I could make some use of it so why not learn how to do it properly?

I wonder could I keep a dynamic menu of dash-arrays... I really would like to get the obviously uncountable complexity under control - say I wanted two lines to have the same... well I could just copy and paste. But I'd like some tools for generating them. Graduated, random, maybe a hi-lo button... work on gaps only and lines only...

Use cases:

4. [DONE!]
   - add quadratic curve with three control points

Why is the quadratic curve changing its order of displaying, and the lines, but not the circle? Oh no... they're just staying in order.

___

**Some thoughts**

I turned off hard pixels and it didn't look much difference, just smoother, and, let's be honest, easier on the eye. So maybe that needn't be central to the vision. Other possibilities are that I use beefy square pixels to lesson the harsh graininess. I also experimented with zooming in and realised that there are two effects that I thought were moiré: one is the classic shimmering subpatterns and depends on rounding to the pixel, and disappears on zooming out - **but**, other effects like the shimmering hair one still can be seen even when individual lines are well-rendered, and finally **moiré from one object painting over itself** seems to similarly sustain when zoomed in.

### 13/02/20

Made repository

I've got ideas for hard-pixel SVG, some of which will fit under the moiré banner, some not.

Moiré ideas:

- fuzzball
- afro hair
- snow-covered mountains
- spatters (strategic filled circles, haloes)
- coronas/haloes
- star crosses/bling (find in moire then mask)
- asteroids
- rain on a windshield
- reflections on a rainy road/damp concrete (roughness)
- noise
- starry skies
- wood grain (look out for it)
- dithering noise
- glitter that catches the light on scrolling
- silhouette against noise/stars
- parabolic masks on moire, maybe animated, for fizzing sparks
- overlaid noise/with opacity for softness - creating ranges of noise intensity
- airbrushing
- masked banded gradients (like 16 shades) - draw the same moiré-creating element with each shade and then mask them together to get a stepped gradient - for bonus marks, use moiré-softened masks (say just on one side overlapping the next, so as to avoid the chance of two gaps lining up and being transparent)

Non-moiré ideas:

- banded shading:
  - normal-mapped triangles (from triangulating point heightmap) - **this is fresh**
    - generate more triangles and/or use blurring to soften edges, crispen peaks, roughen/break edges, like classic game textures
  - crystal facets/lantern glass/leaded glass
  - gouraud shading (from 3D mesh of some kind, or drawn)
  - two colour hard-edged lighting, one rim
  - comic-book edge lighting
  - shading plus "materials": roughness/reflection, tone, noisiness (moiré)
  - palette ranges - 16 base colours and 16 darken/lighten levels (could be done binary with just 4 levels) - could even have similar colour space transforms on base colours (pointless?)
- blurs for blurring glass, softened reflections... i.e. mapped into other shapes
- tiled masks (I think would go well with one-colour moire noise) - **use pattern defs**:
  - pleats
  - tucks
  - stitching
  - lace?!
- hatching
  - the pen and ink irregular patches (cellular?) technique of alternating hatching angles
  - generate slight alternating curves to naturalise hatching? - straight line moiré already can be fairly natural
  - cross hatching
  - cross hatching as a mask to make simple regular dithering patterns
  - hair with masked straight dashed line hatching segments edge matched
- pixelate - use an off-screen getImageData to draw squares on-screen

___

That's all direction for the future, which I include here to excite me about the potential of subversive SVG. However, this particular app, MoiréTest, is to prototype something specific: a JavaScript user interface for controlling a handful of elements in an SVG object (with shapeRendering="crisp-edges") in idiomatic ways:

- lines and curves with wide stroke width and a dash array to make lots of small lines and so moiré
- multiple copies of similar lines/curves with different stroke width and dash array to create complex softenings and gradations
- complex masking of the lines/curves - e.g. generated from the original shape, plus cropping options
- all controlled by HTML buttons generated on the fly in a side panel, to select objects (to avoid complexities of draggable objects - i.e. stacking, window borders)
- and handles to move the vertices/control points of objects
- masks will have a separate panel containing multiple objects per mask

Use cases:

1. [DONE]
   - two lines (all objects from now on switchable between using button panel).... Okay I'm gonna be real basic about this and not try make an object hierarchy from the very get go. First I need two handles per line. And... for that I need a function that turns coords from events into SVG coords!
   - question: should my arrays hold info about SVG elements, or the elements? The first allows e.g. my handles to display offset; but the second is intrinsically simpler. Note that if I use the offset, I need to be very clear about when it's applied and when not - of course, here sending around the ideal value not the element's real value is nicer. It's just that then "handleX" as an argument is not completely clear which it's referring to.
   - what should be the scope of say handles... ah let's keep it global, this is a rough sketch
2. [DONE!]
   - saving! And some rough loading? (Can use text editor)
3. [DONE!]
   - two lines ~~with control points at perceived ends~~ (leave the geometry out for now) - edit no. of lines and dash array with sliders in a control panel
   - styling - separated out CSS, defined two panels and made them float

An **edit link** in a **gallery** would be awesome and perhaps it's easily done - opening one o' them blobs, and linking to the JS so the HTML is short enough that I can write it twice (still very inelegant! but it's a demo!)... or maybe I can link to the HTML??

**Then I want to switch up and test/study:**

- rotation
- masks in masks
- and - necessary so I can scope out the future potential - mobile phone versions (scaling of moire)
