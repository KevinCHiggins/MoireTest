# MoiréTest
 UI prototype in JavaScript for manipulating hard-pixel SVG moiré art

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
  - generate slight alternating curves to naturalise hatching?
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

2. 
   - saving! And some rough loading? (Can use text editor)
3. 
   - two lines with control points at perceived ends - no. of lines and dash array controlled by sliders in control panel

4. 
   - add quadratic curve with three control points

**Then I want to switch up and test/study:**

- rotation
- masks in masks
- and - necessary so I can scope out the future potential - mobile phone versions (scaling of moire)