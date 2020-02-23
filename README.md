# MoiréTest
See it in action [here](https://kevinchiggins.github.io/MoireTest/)!!

 UI prototype in JavaScript for manipulating hard-pixel (? - see 14/02/20) SVG moiré art

As this is an experimental prototype, I'll use a devlog format (with dated entries, most recent first) rather than write documentation as such. And I'll freely bust wild ideas without concern for if/when they get done.

#### 23/02/20

Bug hunting. Realised that the **bad variable name** selectedShape I called out a few days ago was leading to mistakes again and I've probably cumulatively lost an hour due to it... in future I will rename instantly if I notice such. Now it's selectedShapeId.

Ah yeah - another bug... my insertion for new shapes assumes that the shape that ends up just above the new shape *in the array* will be in svgObject - whereas of course it's just as likely in the mask. What I need to do is traverse back up the array from there looking for the first shape which is in svgObject (i.e. whose masking is set to false, "" or true, "mask1") and upon failing append to svgObject (then redrawHandles).

Obviously, my crude design is getting strained.

Tidied up the UI a fair bit today, just layout mostly

[FIXED, forgot to use getAttribute**NS**] Bug: setting colour of unfilled rect changes it to filled (w/o changing checkbox)

[FIXED] Bug: adding a shape cause the shape above it to be dropped from the rotation, plus it's not going in after the selected shape!!

Ugh, having the separate shapesMasking array is such poor design! Actually, it wouldn't be hard to merge them and maybe that should be done before making multi-shapes.

Remaining use cases:

9. [DONE]Adding and removing shapes			
   - [DONE]first on top
   - [DONE]add rects, circles, curves
   - [DONE] a way of changing circle radius (rough - just a number field that's otherwise disabled)
   - [DONE] insert just above current selection
   - [DONE] remove shape
10. [DONE] Fill checkbox
    - need to sort it so all shapes have a stroke of the same colour (a handy but I think appropriate simplification)
11. [DONE] Get workaround into save-load!! And tidied it up a micron
12. [DONE] Get masking into save-load!! Heheh, I have to extract shapes from the mask... now, they will lose their order in the original session but that's fine - overall order is just a way of dealing with things within the app - so, I'll simply put them on top of the array
13. Working rect!
14. Multi-object/blend, say just for curves - it's a tasty effect!
15. UI nice to haves
    - disable edits when all deleted
    - a preview button to hide handles (maybe piggyback on previous!)
    - use hatching and moire made in the app, as backgrounds for hip UI elements? 
    - make a grid layout or some such

Then I want to make a gallery (prob with screenshots) for this readme, and I'm done! Time to write a blog post about it.

___

I think I need to stop for the night. Still, a serious day's work! Even if a lot of it is coming up against the limits of the design. I'm nearly done with my goal of a prototype moiré art tool that exports framed-looking, re-editable pieces!

#### 22/02/20

8. [DONE] Finally got masking done!

**Aaand,** I found *another* thing that kind of sinks the project. First and most obviously, the browser compatibility of the moire I'm getting in Slimjet/Chrome is non-existent - I just checked (no crisp edges in Edge or IE, and a quite different look in Firefox). Second, my original idea was "masked moiré", very much using masking to cut out nice chunks of moiré. However, I can't do this with paths (curves) because Slimjet/Chrome crudely clips them without regard for stroke-width when it masks them, presumably as an optimisation. Leaving me with big unwanted gaps cut into my moiré which depends on very wide dashed strokes.

I found a workaround for Slimjet/Chrome: add invisible commands to the path with coordinates at the corners of the canvas - this prompts the browser not to clip inside those bounds. But it's obviously a dodgy workaround and not proper SVG output anymore (even if it displays okay as is).

[DONE, quite successfully although it won't work for circles and rects with wide strokes - but they have no use anyway!] I'll try use this workaround to get a few nice images and call it a day.

Anyhow, fixed a bunch of bugs and unfinished stuff with the masking: keeping track of masking and position correctly as shapes switch between unmasked, masked and sent to mask.

#### 21/02/20

selectedShape is a bad variable name, confusable with the shape local variable I legitimately make here and there. Should be selectedShapeId.

[FIXED]Gotta head out to the pub now, but I have a BUG: moving the shape up (in order) while it's in the mask, removes the defs clause altogether.

#### 20/02/20

**Okay I'm stumped.** The slow down has gone away, while I was fluting around changing the dash arrays in the app. This seemed to cause two near-crashes... and then performance was great, the slow down from quadratic curves overlapping themselves totally gone - whatever the dash array (I thought for a sec it might be that non-fractional dash sizes or larger gaps were making the difference, but no - the same dash array I've been having problems with for two days, is now fine).

**Same results on multiple tests... opening a new browser instance starts with a slowdown, changing sizes eliminates it... like it has to warm up??** I think it's **going to very small dashes with big spaces that's the fix**. E.g.,

 .1,3.1,3.

 .1,4.

Maybe it needs a new dash array each time to force it to recalculate or clear something?

No, I was thinking it comes down to the actual dash array: .5 at the start seemed bad, 1,1 is always fine (**nope, on restart 1,1 was also slow**)... but now this (orig, slow value) is fine too: .5,2,.5,0.

**Three changes of dash array?** No, seems not enough. Three unseen dash-arrays?

**It seems to have to freeze for a good few seconds on a change of dash-array, two or three times, and then it's fast.** This suggests that I can finish packaging this app by simply keeping Slimjet open in the faster state - but that there's no point developing it as a tool to release unless I unlock the mystery.

___

Minimal design for masking:

- [DONE] all shapes have three radio buttons: sent to mask; masked; unmasked
- [DONE] hapes with sent to mask, are not appended with the rest, but inside a mask, "moire-mask" - in the same order as they are in the shapes array, where they stay
- [DONE] a shapesMasking array with arrays of boolean flags (sent/not sent; masked/unmasked (only valid if not sent)) is kept
- [DONE] order of shapes in mask is taken from original order
- [DONE] shapes can be taken back out of masks and reappear with order intact

#### 19/02/20

Okay, this is in the wrapping up stages but this morning I want to be sure of the context of that pesky slow down. So I'll make four versions:

- [DONE] test-no-xml.html -  similar to no-xml.html, i.e. that reads the SVG shapes from the .html file, but uses any extra functionality I've implemented since I saved no-xml.html i.e. changing shape order
- [DONE] test-xml-pegged.html - one similar to blend.html, i.e. loading with an XML request and then pegging the updateShape rate to a setInterval
- [DONE] test-xml-basic.html - one that loads from an XML request with no attempt to mitigate slow down
- [DONE] test-orig-no-xml - find out why the older no-xml.html is way faster!? by making a copy and tweaking it

I'll stay alert to the possibility that some other change (not the loading by XML GET request) caused the slow down, i.e. if no-xml.html is still faster than test-no-xml.html - perhaps even something within the SVG data itself!

**Okay**, test-no-xml.html is no faster. Next I'll try put the same SVG data into a copy of no-xml.html (which seems fast still).

**Okay**, I've found the, or a culprit! **Auto** or **geometricPrecision** shape-rendering modes are **way faster** in (my Chrome browser clone) Slimjet, than **crispEdges** or, mysteriously, **optimizeSpeed**! This doesn't quite tally with my memories of making sunsets and stuff 2/3 days ago (should've committed that version, of course) using crispEdges, but maybe my memory is skating over a slow down that was there.

In any case, this suggests a hack - switch shape-rendering mode while dragging! [DONE] Nope, no joy, still feels rough.

Okay, again, best pause on this. What I learned today:

- how to use about:tracing to see individual frames - here I can see that RasterDecoderImpl::DoEndRasterCHROMIUM::flush is taking up to 500ms to complete, and that's in the GPU, and that the latency is from that
- how to use the performance tab of devtools to see individual frames (which indicates that rasterising is the problem)
- that crispEdges seems to be poorly optimised in Slimjet. This kind of weakens the whole premise of this project... my idea of subverting how SVG is meant to be used will inevitably come up against weaker parts of browser implementations. When I consider how the interface didn't even work in Firefox... I'm avoidably putting myself into trouble with this project brief.

___

Minimal design for multi-objects:

- blend only (overlay three versions of the same object: a background - no dashes, blend - thick dashes, and foreground - thin dashes)
- no more than 10 (and actually 3) shapes per, and ten in total, for simplicity of storing info in id, "multi0shape2"
- [NO]okay, a crude approach: hold only the shape0 in the shapes array; calls to updateShape, though, and anywhere else needed, check id and look up a 2D array, restOfMultis, and get shapes 1-9 from there and manipulate them... 
- 2nd version (because shapes need to be editable separately (stroke, etc.)): a menu "add to multishape": with options path0 or rect0 (dynamically set according to what shape is currently selected). When a shape is selected of the same type as a multishape, there are two options e.g. circle0 and circle1 (circle1 meaning create a new one). If added to a non-new multishape, a shape takes the coordinates of the already-present members. A shape can be removed from a multishape with a button that replaces the menu once it's part of one. Editing the handles of any shape in a multishape updates the coords of all.

#### 18/02/20

Use cases:

7. [DONE] change shape order

I badly need, in terms of atmosphere and grandiosity, to have shapes going up to the edge of the viewport... two ways of doing this might be:

- to "ghost" handles when they are past the viewport - they go hollow and freeze in place but its actual coords outside the SVG are still registered by the program, i.e. of the mouse over the document, until a mouseup event over the document. The ghost handle represents a way to bring a handle outside the document back into play. Mousedown on it and dragging it outside its own bounds will snap the actual vert's coords back to the handle, within the SVG. This can be avoided by a mouseup *within its own bounds* which will leave the handle ghosted and vert's coords in the outside place. However, this means that ghosted handles are non-living - the vert's position in the outside world can't be modified, only sought again from within the real world.
- to just use SVG viewport stuff and scroll some way

Having problems with **major slowing down** and I suspect it's due to having loaded the SVG using an XmlHttpRequest.

Turns out no. I guess I just didn't notice this slowdown previously. Unfortunately, it happens when there's lots of complex overdraw which is of course when the moiré gets interesting.

___

**All right, it's decided.** This prototype has served its purpose and the rough and ready nature of it would impede further work. The main discovery is that, **yes** these effects look great, and **no** they don't perform well enough (well the ones from curves) to be stackable in an interactive editor. Therefore I'll package up what I have so far and leave the tons of ideas for future exploration, quite possibly from different approaches e.g. generative, visualisation, or transformation of input data.

I'll wrap it up this week.

**Essentials**

- circular and rectangular masking to make tight, framed-feeling graphics
- adding and removing shapes (lines and simple quadratic curves)
- a gallery for this readme file

**Optional**

- filled circles and rectangles as shapes
- some kind of transform, viewport shift or move all or move whole shape option
- multishapes - even just the "blended" quadratic curve
- a gallery page with "Edit me" option for each

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
  - triangles lit using their normals (from triangulating a point heightmap) - **this is fresh**
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
