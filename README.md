# MoiréTest
See it in action [here](https://kevinchiggins.github.io/MoireTest/)!!

 UI prototype in JavaScript for manipulating hard-pixel (? - see 14/02/20) SVG moiré art

As this is an experimental prototype, I'll use a devlog format (with dated entries, most recent first) rather than write documentation as such. And I'll freely bust wild ideas without concern for if/when they get done.

#### 18/02/20

I badly need, in terms of atmosphere and grandiosity, to have shapes going up to the edge of the viewport... two ways of doing this might be:

- to "ghost" handles when they are past the viewport - they go hollow and freeze in place but its actual coords outside the SVG are still registered by the program, i.e. of the mouse over the document, until a mouseup event over the document. The ghost handle represents a way to bring a handle outside the document back into play. Mousedown on it and dragging it outside its own bounds will snap the actual vert's coords back to the handle, within the SVG. This can be avoided by a mouseup *within its own bounds* which will leave the handle ghosted and vert's coords in the outside place. However, this means that ghosted handles are non-living - the vert's position in the outside world can't be modified, only sought again from within the real world.
- to just use SVG viewport stuff and scroll some way

#### 17/02/20

For lines in particular, a fill canvas or fill frame with hatching/moire would be fairly easily done.

I could get curved hatching by getting JS to "scribble" i.e. make a single path go back on forth on a quadratic curve with the end pixels walking by one or whatever each x... this would need proper path parsing though.

Okay, here's a subtle one. To soften hard-pixel moiré without opacity, make two versions of the border/masking, with one using dashes twice as thick as the other - but with gaps between dashes correspondingly narrowed so the two moiré patterns should align, with one simply consuming more pixels on the same rhythm. Then use these with two close shades for a softer blend!

Okay, I actually spent an hour playing with this, by simply disabling my object selection and hard-coding handles to move all objects (i.e. only works if 3 objectrs with identical coords are loaded). This isn't building for the future, but I did get great visuals from the two-colour (actually I used a 3rd background colour to lessen the harshness) blend! This persuades me (and also looking up data- tags - they're not technically legal yet but will display fine) to go for the multi-element object paradigm. It suits my purposes. 

[Nathalie Lawhead wrote a cool post](http://www.nathalielawhead.com/candybox/the-wonderful-world-of-tools-made-by-small-teams-solo-devs-and-shareware-weird-beautiful-and-experimental-things-to-be-creative-in-an-analysis-on-building-for-approachability) on small, weird software in the space between tool and game, that absolutely resonates with my reasons for working on this project. She brought up some memories such as of a story-making competition with her brother and sister. She says:

- amateurish interfaces can spur creativity
- similarly, it doesn't have to be serious... both of these come under **approachability**
- premade material is great
- there needn't be a *purpose* or *application* for what is made in the software... similarly, software can encourage pride in making stuff that isn't necessarily good

___

Last night in bed I was similarly pondering local, personal, familial, intimate use of images. What about these ways to dis*semina*te pictures:

- Whatsapp stickers, memes, emojis
- icons (for files, apps, or anything)
- renderings of dreams, visions, places, perhaps as make-your-own-story/animation/film or adventure game-type **backgrounds** (with gentle, ambiguous, not really Western perspective - Nathalie's article showed some of this) for further collaging
- logos, tags, devotional text (names of spirits, genres), again for chats, or to illustrate one's surroundings or other output
- illustrations of personal concepts, neologisms, mottoes, catchphrases memories and associations
- beadwork, mosaics that make physical the grid nature of moiré... sure, even just printing out some of this stuff big, maybe on vinyl, would have an incredible **material** impact

Use cases:

6. [DONE] multiple downloads per session - just a UI tweak to stop people clicking the same link without regenerating it using the button
7. change shape order
8. circle radius
   - make circle like other objects (fuzzy, no gradient)
   - type in
   - drag
9. pattern from box
   - type in coords
   - then drag

#### 16/02/20

Use cases:

5. [DONE!] change shape colour

Some more feature ideas:

- project platonic solids e.g. cube, 4-pyramid, 3-pyramid, cylinder, sphere in orthographic perspective
  - the idea would be to speed quick composition
  - it'd go well with lighting, patterns, hatching and fuzzed edges
  - spin them by 15 degree increments
  - handles are overlapped, affecting two SVG elements at once to maintain integrity of 3D illusion
  - clicking on an overlapped handle again changes what shape (which set of other handles) is selected
- selecting more than one handle - start with CTRL
- pattern maker - drag over current image - tiles appear around dragged rectangle
- for a phone, the whole control panel should be foldable, for sure

Got loading SVG from a separate file with an ```XMLHttpRequest```! Although it needs a HTTP server, and also couldn't do it from a different server, so it's not a long-term solution. However for integration with other programs/languages/libraries, it'll be a help.

Speaking of which: Plotly for Python could be a bridge between maths problems and SVG art! All a whiles away. But I was thinking today of making visualisations for solutions, time taken, or stats about solutions, of Project Euler maths problems, in Python. So, a future use case could be, generate some interesting stats, export as a conventional graph (maybe adding a reference in a JSON list so my main page adds it to a gallery), then restyle with masks, moire/dither/hatching patterns and softened edges.

#### 15/02/20

I'm thinking, re the control panel:

- I'm gonna need foldable panels, which shouldn't be too hard
- **Styled buttons** would add a lot

Was thinking about lighting:

- 16-tone graduated edges is theoretically doable but will basically involve drawing any such shape 16 times, right? I.e. I could piggyback on stroke and use that to widen or narrow any shape, then make a pattern of overdraws... what am I getting over gradients??
- triangulated normal maps is still the coolest

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
