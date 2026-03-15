# Ultra-Premium Portfolio Redesign Plan
## Sanat Jha — Final Complete Architecture
### Dark Black + Mint + Skeuomorphic + Mouse Interactive Layer

---

# PART 1 — EXTRACTED CONTENT

## Personal Information
Name: Sanat Jha
Role: Software Developer
Education: BTech, IIT Roorkee
Description: Passionate software engineer focused on building web and mobile applications

## Skills
Python, Django, Flutter, HTML, CSS, C++, Git, GitHub, VS Code, Arduino

## Education History
BTech — IIT Roorkee
12th Boards — MPS School, Kota
10th Boards — Amity International School, Gurugram

## Personal Story
Journey of cracking JEE Advanced — late-night studying, dedication, perseverance leading to IIT Roorkee

## Projects
Mic Camera Stories — platform for sharing personal stories
Consumer Compass — technology gadget review platform
Cerebral Enigma — blog on technology, social issues, psychology

## Contact
Email: sanatjha4@gmail.com
Instagram: @sanatjha4
LinkedIn: Sanat Kumar Jha
GitHub: Sanat-Jha

---

# PART 2 — TECHNOLOGY STACK

## Core Framework
Next.js 14 with App Router
TypeScript throughout
React 18 with concurrent features

## Styling System
TailwindCSS as utility base
CSS custom properties for skeuomorphic and mouse-interaction tokens
PostCSS for processing
CSS layers: base → skeuomorphic → mouse-effects → components → utilities

## Animation Stack
GSAP 3 with ScrollTrigger plugin for scroll-driven animations
GSAP SplitText for character and word-level text animations
Framer Motion for component mount/exit transitions, layout animations, and mouse-driven transforms
Lenis for smooth scroll with momentum and easing

## Mouse Tracking Infrastructure
A global MouseTracker context at the root layout level
Publishes normalized mouse position (x: -1 to 1, y: -1 to 1) and raw pixel position
All mouse-interactive components subscribe via useMouseTracker hook
useSpring from Framer Motion for all physics-based following
Custom useMagnet hook for magnetic attraction logic
Custom useTilt hook for perspective tilt logic
Custom useRipple hook for click ripple effects
Custom useTrail hook for cursor trail particles

## WebGL Layer
Three.js for PCB background and hero orb
React Three Fiber as React wrapper
Drei for helpers, environment maps, and post-processing
useFrame hook for per-frame mouse-reactive updates inside Three.js

## Fonts
Roboto Slab via next/font, weights 300, 600, 700

## Performance Tools
next/image, next/dynamic, Vercel Analytics, Bundle Analyzer

---

# PART 3 — FOLDER ARCHITECTURE

```
/app
  layout.tsx                   root layout, MouseTrackerProvider wraps everything
  page.tsx                     home page
  globals.css
  loading.tsx                  curtain animation

/context
  MouseTrackerContext.tsx      global mouse state publisher
  MouseTrackerProvider.tsx     provider component, attaches window mousemove listener
  useMouseTracker.ts           hook to consume mouse context anywhere

/hooks
  useMagnet.ts                 magnetic attraction toward element center
  useTilt.ts                   perspective tilt based on cursor position within element
  useRipple.ts                 click ripple effect generator
  useTrail.ts                  cursor trail particle positions
  useProximityGlow.ts          glow intensity based on cursor distance from element
  useParallaxMouse.ts          layer parallax based on global mouse position
  useCursorShape.ts            cursor shape state manager (default, hover, drag, text)
  useSpotlight.ts              mouse-driven spotlight position for section backgrounds
  useMagneticField.ts          multi-element magnetic field interaction

/components
  /cursor
    CustomCursor.tsx           the glass bubble cursor outer ring
    CursorDot.tsx              the precise inner tracking dot
    CursorTrail.tsx            fading particle trail behind cursor
    CursorMorphTarget.tsx      cursor shape definition per element type
    CursorLabel.tsx            small text that appears inside cursor on hover
    CursorRing.tsx             expanding ring on click

  /navbar
    Navbar.tsx
    NavLink.tsx                magnetic nav link with recessed underline
    MobileMenu.tsx

  /hero
    Hero.tsx
    HeroText.tsx               GSAP split text
    HeroOrb.tsx                Three.js glass marble, mouse-reactive rotation
    RoleScrambler.tsx
    HeroParallaxLayers.tsx     multi-depth parallax on mouse move

  /about
    About.tsx
    PortraitFrame.tsx          metal-framed portrait with tilt and reflection
    BioPlaque.tsx
    PortraitSpotlight.tsx      mouse-driven light hitting portrait surface

  /journey
    Journey.tsx
    TimelineWire.tsx
    TimelineNode.tsx
    TimelineCard.tsx           cards tilt on hover

  /education
    Education.tsx
    DegreeCard.tsx             tilt + proximity glow

  /skills
    Skills.tsx
    KeycapGrid.tsx
    Keycap.tsx                 pressable with ripple
    SkillsSpotlight.tsx        mouse spotlight over keycap grid

  /projects
    Projects.tsx
    ProjectCard.tsx            full tilt + bezel reflection + parallax internals
    ProjectBezel.tsx
    ProjectMeta.tsx
    ProjectParallax.tsx        inner card layers move at different mouse speeds

  /contact
    Contact.tsx
    ContactForm.tsx
    InsetInput.tsx
    GlowButton.tsx             magnetic + press ripple
    SocialLinks.tsx            magnetic social tiles

  /shared
    MagneticWrapper.tsx        HOC applying magnetic pull to any child
    TiltCard.tsx               HOC applying perspective tilt to any child
    ProximityGlow.tsx          HOC applying glow based on cursor distance
    SpotlightSection.tsx       section wrapper with mouse spotlight background
    ScrollProgress.tsx
    EtchedDivider.tsx
    SectionTitle.tsx

  /footer
    Footer.tsx

/mouse
  magneticField.ts             multi-element repulsion and attraction physics
  cursorStates.ts              all cursor shape state definitions
  springConfigs.ts             Framer Motion spring configs for all mouse effects
  rippleEngine.ts              ripple particle lifecycle management
  trailEngine.ts               trail particle positions and fade logic
  proximityEngine.ts           distance calculation utilities
  spotlightEngine.ts           mouse-to-spotlight coordinate mapping

/animations
  /gsap
    splitTextReveal.ts
    scrollFade.ts
    parallaxText.ts
    timelineScrub.ts

  /framer
    pageTransitions.ts
    cardHover.ts
    keycapPress.ts
    mouseDrivenVariants.ts     variants that take mouse position as input

/webgl
  /background
    PCBScene.tsx               main Three.js scene, mouse-reactive torch
    CircuitTraces.tsx
    GlowNodes.tsx
    TorchLight.tsx             PointLight following mouse in 3D space

  /hero
    GlassOrb.tsx               mouse-reactive rotation, refraction
    OrbShader.ts               GLSL shader for glass + mint tint

/lib
  smoothScroll.ts
  animationConfig.ts
  skeuomorphicTokens.ts
  materialSystem.ts
  mouseConfig.ts               global mouse effect configuration constants

/styles
  skeuomorphic.css
  surfaces.css
  shadows.css
  mouse-effects.css            CSS for cursor, trails, ripples, spotlight overlays
  animations.css

/data
  projects.ts
  skills.ts
  education.ts
  journey.ts
  navigation.ts
```

---

# PART 4 — GLOBAL MOUSE TRACKING SYSTEM

This is the nervous system of the entire page. Every mouse-interactive element draws from this single source of truth.

## MouseTrackerContext

A React context that lives at the root layout level, wrapping the entire application. It maintains:

```
rawX, rawY          pixel position from mousemove event
normalizedX         mapped from -1 (left edge) to +1 (right edge)
normalizedY         mapped from -1 (top edge) to +1 (bottom edge)
velocityX           pixels per frame, horizontal
velocityY           pixels per frame, vertical
speed               magnitude of velocity vector
isMoving            true if speed > threshold
isIdle              true if no movement for 2000ms
targetElement       currently hovered DOM element or null
```

## Update Strategy
Window-level mousemove listener using passive: true
Position stored in a ref for non-React reads (WebGL, GSAP)
Position also stored in state with requestAnimationFrame throttling for React consumers
Velocity calculated as delta between current and previous frame position

## Spring Configs (from /mouse/springConfigs.ts)

```
CURSOR_OUTER_RING:    stiffness 400, damping 35    (slightly laggy, physical weight)
CURSOR_DOT:           stiffness 800, damping 45    (near-instant tracking)
MAGNETIC_PULL:        stiffness 200, damping 20    (elastic snap toward target)
CARD_TILT:            stiffness 300, damping 30    (smooth perspective tilt)
PARALLAX_HERO:        stiffness 80,  damping 18    (slow dreamy layers)
PARALLAX_CARD:        stiffness 150, damping 22    (medium internal parallax)
ORB_ROTATION:         stiffness 60,  damping 15    (very slow, inertial orb)
SPOTLIGHT:            stiffness 120, damping 25    (smooth light following)
PROXIMITY_GLOW:       stiffness 500, damping 40    (fast reactive glow)
```

---

# PART 5 — CUSTOM CURSOR SYSTEM

## Layer Architecture
The cursor system is five stacked layers, all position: fixed, pointer-events: none, z-index: 9999

### Layer 1 — Trail Particles
Thirty small dots, each 4px diameter
Each particle is a snapshot of a previous cursor position, taken every 16ms
Particle opacity fades from 0.35 (newest) to 0 (oldest) over 500ms lifetime
Particle size reduces from 4px (newest) to 1px (oldest)
Color: mint rgba(152,255,152,X) where X is the opacity
Particles rendered via canvas element for performance — not DOM nodes
Canvas covers full viewport, redrawn every frame via requestAnimationFrame

### Layer 2 — Outer Ring
32px diameter circle
Border: 1px solid rgba(152,255,152,0.45)
Background: rgba(152,255,152,0.04) — near-invisible tint
Top-left quadrant has a subtle bright arc: a CSS radial-gradient at 4% opacity on top-left, simulating glass sphere specular highlight
Follows mouse with CURSOR_OUTER_RING spring (slight lag gives physical weight)
Framer Motion useSpring on both x and y

### Layer 3 — Inner Dot
6px diameter circle
Solid mint fill rgba(152,255,152,1.0)
Faint glow: box-shadow 0 0 8px rgba(152,255,152,0.80)
Tracks mouse position exactly, no spring lag
Updates via direct transform set in mousemove handler for zero-latency feel

### Layer 4 — Cursor Label
Small text that appears inside the outer ring for specific hover targets
Text: "VISIT", "DRAG", "READ", "PRESS" depending on element type
Font: 8px Roboto Slab, all-caps, letter-spacing 0.12em, mint color
Fades in when hovering a labeled target, fades out when leaving
Framer Motion opacity transition 150ms

### Layer 5 — Click Ring
On every mousedown: a ring spawns at click position
Ring starts at 8px diameter, expands to 48px over 400ms
Ring opacity fades from 0.7 to 0 over the same 400ms
Color: mint border
After 400ms: element removed from DOM
Multiple rings can exist simultaneously (rapid clicking)

## Cursor Shape States

Default state: outer ring 32px + inner dot 6px

Link hover state:
  Outer ring expands to 48px
  Inner dot disappears (opacity 0)
  Ring fill becomes rgba(152,255,152,0.10)
  Transition: 200ms

Card hover state:
  Outer ring morphs to a rounded rectangle matching approximate card proportions
  Width: 56px, Height: 40px, border-radius: 10px
  Inner dot disappears
  Transition: 250ms spring

Button hover state:
  Outer ring compresses to 24px
  Fill becomes rgba(152,255,152,0.20)
  Cursor label "PRESS" fades in
  Inner dot dims to 50% opacity
  Transition: 150ms

Text / input hover state:
  Outer ring fades to opacity 0
  Inner dot becomes a tall thin line: width 2px, height 20px, border-radius 1px
  Acts as a text I-beam cursor

Image hover state:
  Outer ring expands to 64px
  Cursor label "VIEW" appears inside ring
  Ring border brightens to rgba(152,255,152,0.80)

Draggable element hover:
  Outer ring becomes a crosshair-like shape: two perpendicular lines, 48px span
  Cursor label "DRAG" appears

Idle state (no movement for 2000ms):
  Both outer ring and inner dot fade to 40% opacity
  Trail particles pause generation

## Mobile / Touch
Entire cursor system hidden on touch devices via @media (pointer: coarse)
No custom cursor rendered, no trail, no rings
All hover effects replaced with tap states instead

---

# PART 6 — HERO SECTION MOUSE EFFECTS

## Multi-Layer Parallax System
The hero section has five depth layers that separate on mouse movement

Layer 1 (deepest, furthest back) — PCB background
Moves at 0.8% of mouse normalized position
X range: ±8px, Y range: ±6px

Layer 2 — Large faded "SANAT JHA" background text
Moves at 1.5% of mouse normalized position
X range: ±15px, Y range: ±10px
This text is purely atmospheric — very low opacity, very large font size

Layer 3 — Bio text block
Moves at 2.5% of mouse normalized position
X range: ±25px, Y range: ±16px

Layer 4 — Name and role title
Moves at 3.5% of mouse normalized position
X range: ±35px, Y range: ±22px

Layer 5 (closest, shallowest) — Glass orb
Moves at 5.0% of mouse normalized position
X range: ±50px, Y range: ±32px

All layers use PARALLAX_HERO spring config for smooth following
The result: moving the mouse subtly separates the layers into a 3D diorama effect
Depth perception created purely through differential movement speeds

## Glass Orb Mouse Rotation
The orb in Three.js rotates toward the mouse cursor
Horizontal mouse position → orb Y-axis rotation, range ±25 degrees
Vertical mouse position → orb X-axis rotation, range ±15 degrees
Rotation uses ORB_ROTATION spring for very slow, inertial feeling
On fast mouse movement (velocity > threshold): orb briefly wobbles, then settles
Wobble: a damped oscillation on both axes, duration 800ms

## Orb Light Following
The PointLight inside the orb scene tracks mouse position
Light position maps mouse to a hemisphere above the orb
As mouse moves left: light shifts left, changing the refraction and caustic patterns on the orb surface
This creates a live interactive glass-light simulation

## Hero Text Magnetic Words
Each word in the hero name "SANAT" and "JHA" has a subtle magnetic repulsion effect
When cursor passes within 80px of a word: that word slightly pushes away (max 6px)
The word springs back when cursor leaves
Creates a physical "hovering text" feeling without being distracting

---

# PART 7 — DESIGN SYSTEM

## Color Palette

```
Primary Background:       #000000
Secondary Background:     #0B0B0B
Card Surface:             #0F0F0F
Raised Surface:           #141414
Deep Inset:               #030303

Mint Accent:              #98FF98
Mint Glow Dim:            rgba(152, 255, 152, 0.15)
Mint Glow Mid:            rgba(152, 255, 152, 0.30)
Mint Glow Bright:         rgba(152, 255, 152, 0.50)
Mint Text Glow:           0 0 10px rgba(152, 255, 152, 0.60)

Primary Text:             #F5F5F5
Secondary Text:           #AAAAAA
Muted Text:               #555555
Engraved Text:            #333333

Border Highlight:         rgba(255, 255, 255, 0.08)
Border Top Highlight:     rgba(255, 255, 255, 0.14)
Border Shadow:            rgba(0, 0, 0, 0.80)
```

## Skeuomorphic Shadow Token System

```
--shadow-outer-light:       1px 1px 0px rgba(255,255,255,0.06)
--shadow-outer-dark:        2px 4px 16px rgba(0,0,0,0.70)
--shadow-convex:            0 4px 10px rgba(0,0,0,0.60),
                            inset 0 1px 0 rgba(255,255,255,0.09)
--shadow-inset:             inset 2px 2px 6px rgba(0,0,0,0.80),
                            inset -1px -1px 3px rgba(255,255,255,0.04)
--shadow-glass-card:        2px 4px 16px rgba(0,0,0,0.70),
                            inset 0 1px 0 rgba(255,255,255,0.07)
--shadow-mint-glow:         0 0 12px rgba(152,255,152,0.25)
--shadow-mint-glow-hot:     0 0 20px rgba(152,255,152,0.55)
--shadow-keycap:            2px 4px 10px rgba(0,0,0,0.70),
                            inset 0 1px 0 rgba(255,255,255,0.08)
--shadow-keycap-pressed:    0 1px 4px rgba(0,0,0,0.80),
                            inset 1px 2px 4px rgba(0,0,0,0.70)
--shadow-timeline-node:     0 0 10px rgba(152,255,152,0.30),
                            inset 0 1px 0 rgba(255,255,255,0.10)
--shadow-tilt-lifted:       0 20px 60px rgba(0,0,0,0.80),
                            0 8px 20px rgba(0,0,0,0.50)
--shadow-proximity-glow:    0 0 var(--glow-radius) rgba(152,255,152,var(--glow-alpha))
```

## Material Surface Classes

```
.surface-glass
  → frosted glass panel
  → rgba white fill 4–6%
  → top and left border brighter
  → outer drop shadow + inner top highlight
  → mouse tilt interaction enabled by default

.surface-metal
  → brushed dark panel
  → subtle top-to-bottom gradient
  → brushed noise texture overlay 3%
  → strong bottom-right shadow

.surface-convex
  → raised pill or button
  → lighter top face, darker bottom
  → border-bottom thicker (3px physical wall)
  → spring press animation
  → magnetic pull enabled by default

.surface-inset
  → recessed well for inputs
  → #030303 near-black fill
  → deep inner shadow
  → reversed bevel (bottom/right highlight)

.surface-engraved
  → text and icons carved into surface
  → darker text than parent
  → text-shadow reversed from light source
```

## Typography Scale

```
Hero Name:          80px  Roboto Slab 700  engraved + mouse-repulsion per word
Hero Role:          28px  Roboto Slab 300  scramble animation
Section Title:      48px  Roboto Slab 600  engraved, mask reveal on scroll
Subsection:         24px  Roboto Slab 400
Card Title:         20px  Roboto Slab 600
Body Copy:          17px  Roboto Slab 300  word stagger on scroll
Label / Meta:       13px  Roboto Slab 400  letter-spacing 0.10em
Micro / Caption:    11px  Roboto Slab 400  letter-spacing 0.14em  all-caps
```

---

# PART 8 — NAVIGATION

## Visual Construction
Fixed floating pill navbar, centered horizontally, 12px from top
Surface class: surface-glass
Top border rgba(255,255,255,0.14), bottom border rgba(0,0,0,0.80)
Inner top glow: inset 0 1px 0 rgba(255,255,255,0.07)
Backdrop blur: 12px
Box shadow: 0 8px 32px rgba(0,0,0,0.60)

## Mouse Interaction
Navbar itself has a very subtle mouse-tracking highlight
A small circular glow spot inside the navbar follows the cursor horizontally
The glow is rgba(152,255,152,0.06) — barely perceptible, adds life

## Nav Link Mouse Effects
Each link is wrapped in MagneticWrapper with reduced pull strength (max 4px)
On hover: link text gains mint color and mint text-shadow
Active link: physical recessed underline via inset shadow
Cursor shape changes to button hover state when over nav links

## Mobile
Hamburger triggers glass drawer from right
Drawer items have magnetic pull at full strength

---

# PART 9 — SCROLL PROGRESS INDICATOR

## Visual
3px thin bar fixed at very top of viewport, full width
Track: surface-inset treatment, #111 with inner shadow
Fill: mint color, scaleX from 0 to 1 using CSS transform-origin left
Fill right edge has a beveled highlight — small bright line at the tip of the fill
Mint glow on fill: box-shadow 0 0 8px rgba(152,255,152,0.50)

## Mouse Interaction
When user hovers within 40px of the top edge of the viewport: progress bar height expands to 8px
The fill thumb at the right edge becomes a draggable indicator
User can drag the thumb to scroll to any position on the page
Drag cursor state activates on the thumb
On release: smooth scroll to the corresponding page position via Lenis

---

# PART 10 — PAGE LOAD ANIMATION

## Sequence

0ms — Curtain panels cover viewport (top and bottom halves, #000000)
200ms — Curtain panels retract away from center
600ms — "SANAT JHA" engraving animation: characters flash then settle
900ms — PCB WebGL background fades in, circuit traces draw themselves
1200ms — Navbar fades down from above
1500ms — Role scrambler begins
1800ms — Glass orb rises with spring physics
2200ms — Bio text word-stagger
2800ms — All complete, cursor trail activates, mouse effects fully live

Total: approximately 2.8 seconds

---

# PART 11 — ABOUT SECTION MOUSE EFFECTS

## Portrait Frame Tilt
The metal-framed portrait uses the useTilt hook
Mouse position within the about section drives tilt
Max tilt: 12 degrees on both axes
Spring config: CARD_TILT
Perspective: 800px applied to the portrait container

## Surface Specular Simulation
As the portrait tilts, a subtle specular highlight layer moves across the metal frame
The highlight is a radial gradient at 8% opacity that tracks the tilt angle
When the frame is tilted toward the light source (simulated top-left): highlight intensifies
When tilted away: highlight fades
This creates a realistic metal-catching-light effect

## Portrait Spotlight
A mouse-driven spotlight shines on the portrait
The spotlight is a CSS radial-gradient overlay positioned using mouse coordinates within the portrait bounds
At center: rgba(255,255,255,0.04) — very subtle brightening
Follows mouse with SPOTLIGHT spring
As cursor leaves the portrait: spotlight fades out over 400ms

## Bio Plaque Proximity Glow
The bio plaque card glows faintly when cursor is nearby
At 200px distance: glow begins, intensity 0
At 0px distance (cursor on card): glow at full intensity
Glow: box-shadow 0 0 30px rgba(152,255,152,0.12)
Driven by useProximityGlow hook

---

# PART 12 — JOURNEY SECTION MOUSE EFFECTS

## Timeline Node Proximity Glow
Each timeline connector node responds to cursor proximity
When cursor within 120px: node's mint glow intensifies smoothly
Node border brightens from rgba(152,255,152,0.50) to rgba(152,255,152,0.90)
Node glow shadow goes from 10px blur to 20px blur
The transition uses PROXIMITY_GLOW spring config — fast, responsive

## Milestone Card Tilt
Each milestone card above/below the wire uses useTilt
Max tilt: 8 degrees
On hover: card lifts 6px, shadow deepens via --shadow-tilt-lifted
The connecting line from card to wire node stretches slightly as card tilts — CSS transform handles this

## Wire Hover Trace
When cursor hovers over or moves along the wire: a mint pulse travels along the wire from the cursor position outward in both directions
The pulse is a 60px wide bright section of the wire that fades as it travels
Speed: 400px per second
Implemented via a pseudo-element with CSS animation triggered on mousemove position

---

# PART 13 — SKILLS SECTION MOUSE EFFECTS

## Skills Section Spotlight
The entire keycap grid section has a mouse-driven spotlight overlay
A large radial-gradient spotlight (400px radius) follows the cursor within the section
Center: rgba(152,255,152,0.05) — very faint mint tint
Edge: transparent
This illuminates keycaps near the cursor more than distant ones, creating a torch-over-keyboard effect

## Keycap Proximity Responses
Each keycap continuously receives its distance to the cursor via useProximityGlow
At 100px distance: keycap border begins to glow — rgba(152,255,152,0.10)
At 50px distance: glow intensifies — rgba(152,255,152,0.25)
At 20px distance (nearly touching): glow at maximum — rgba(152,255,152,0.45), icon brightens
This creates a rippling glow effect as the cursor moves across the grid

## Keycap Magnetic Grouping
Keycaps within 80px of cursor shift very slightly toward the cursor (max 3px)
The shift is proportional to distance — closer keycaps move more
When cursor leaves the grid: all keycaps spring back with stagger based on their original distance from cursor
The stagger creates a wave-like reset motion

## Keycap Press Physics
On mousedown: keycap physically depresses (translateY 2px, border-bottom shrinks, inset shadow)
On mouseup: spring back with slight overshoot (back.out easing, stiffness 800, damping 30)
A small click ripple ring expands from the keycap center on press — 1px mint ring, expands to keycap edge and fades

---

# PART 14 — PROJECT CARDS MOUSE EFFECTS

## Card Tilt and Lift
Each project card uses useTilt with mouse position scoped to the card bounds
Max tilt: 10 degrees on both axes
Perspective: 1000px on the card container
On hover: card lifts translateZ(20px) — increases shadow
Shadow transitions to --shadow-tilt-lifted as card lifts

## Internal Card Parallax
Inside each project card, the content is divided into three depth layers that move independently on mouse

Foreground layer (title, buttons):
  Moves at 3% of mouse position within card
  Range: ±6px X, ±4px Y

Midground layer (description, tech stack):
  Moves at 1.5% of mouse position
  Range: ±3px X, ±2px Y

Background layer (screenshot bezel):
  Moves at -1% (opposite direction, slight counter-motion)
  Range: ±2px X, ±1px Y

The combined effect makes the card interior feel three-dimensional — the title floats in front of the screenshot

## Bezel Screen Reflection
The device bezel around the screenshot has a specular reflection layer
A CSS radial-gradient at 6% opacity moves across the bezel top edge as mouse moves
The reflection tracks the mouse angle and suggests a physical glass surface
Implemented as an absolutely positioned pseudo-element moving via CSS custom properties

## Project Card Magnetic CTA
The "Visit Site" and "GitHub" buttons inside each card have strong magnetic pull
As cursor nears within 60px: button shifts toward cursor (max 10px)
The magnetic field strength is higher here than nav links — these are the primary CTAs
Cursor label "VISIT" or "CODE" appears inside cursor ring when over these buttons

## Card Border Glow Trace
When cursor enters a card: a mint glow begins at the cursor entry point on the border and travels around the card perimeter
The glow travels the full perimeter in 600ms, then fades
On subsequent hover entries: glow re-triggers from the new entry point
Implemented via a border-image animation or SVG border overlay

---

# PART 15 — CONTACT SECTION MOUSE EFFECTS

## Form Section Spotlight
The entire contact form panel has a mouse-driven spotlight overlay
Spotlight is softer and larger than the skills section (600px radius)
Color tint: rgba(152,255,152,0.03) — barely visible
This very subtly illuminates whichever form field the cursor approaches

## Input Field Hover Approach
When cursor is within 40px of an input field (not yet clicked): field shows a pre-focus state
Border subtly brightens: rgba(152,255,152,0.15)
Inset shadow slightly reduces depth — field "rises" slightly toward cursor
The mint label above also fades from #555 to rgba(152,255,152,0.60)

## Social Tile Magnetic Effects
The four social icon tiles (GitHub, LinkedIn, Instagram, Email) have strong magnetic pull
Each tile: max displacement 12px toward cursor
When cursor leaves: spring back with bounce (back.out 1.5 easing)
On hover: tile convex surface appears to push outward — shadow deepens and spreads, simulating the tile physically extending toward the finger

## Submit Button Aura
The mint glow submit button has an ambient aura that responds to cursor proximity
At 100px from button: a faint mint aura appears around the button (box-shadow, 40px blur, 5% opacity)
As cursor approaches: aura tightens and intensifies
At cursor-on-button: aura is replaced by the standard convex hover state
This creates an anticipatory glow — the button seems to know you are approaching

## Ripple on Submit
On submit button click: a large ripple expands from click point
Ripple: mint color, starts at 0px, expands to 200% button width, opacity fades from 0.5 to 0
Duration: 600ms
The button text also briefly flashes white before settling to dark green
All implemented via CSS keyframes triggered by adding a class on click

---

# PART 16 — WEBGL BACKGROUND SYSTEM

## Concept
Full-page Three.js canvas behind all content (z-index: -1)
Dark PCB circuit board aesthetic
Mouse acts as a torch illuminating the board

## Circuit Trace Geometry
Procedurally generated grid of circuit traces using BufferGeometry and LineSegments
Horizontal and vertical lines with randomized T-junctions and breaks
Traces at rest: rgba(30,40,30,0.60) — barely visible dark on dark
Traces in torch zone (within 300px of cursor in world space): rgba(60,80,60,0.90)
Some traces near cursor get mint tint: rgba(152,255,152,0.08)

## Glow Nodes
Circular points at trace intersections
At rest: 2px, rgba(50,60,50,0.40)
In torch zone: 4px, rgba(152,255,152,0.50) with point material glow
Nodes within 150px of cursor pulse: opacity 0.5 to 0.9 on random-offset sine wave

## Torch Light
A Three.js PointLight follows mouse x/y mapped to world coordinates
Color: rgba(152,255,152,0.60), intensity 1.2, distance 400 world units
Scene ambient light: intensity 0.05 — near black
Creates the torch-in-darkness effect via natural Three.js lighting

## Mouse Velocity Distortion
When cursor moves fast (velocity above threshold): circuit traces near the cursor path momentarily distort
Individual trace vertices shift slightly in the direction of mouse travel then spring back
The effect lasts 300ms and decays with distance from the cursor path
Creates a subtle "cutting through circuitry" sensation on fast sweeps

## Hero Orb Integration
The glass marble hero orb is a separate Three.js canvas overlaid in the hero section
Has its own lighting with environment map for realistic glass refraction
Mouse rotation and light following as described in Part 6

## Performance
Lazy loaded via next/dynamic, ssr: false
Reduced motion preference: WebGL replaced with static CSS background
Low GPU mobile devices: particle density halved, no velocity distortion

---

# PART 17 — EDUCATION SECTION MOUSE EFFECTS

## Degree Card Tilt
All three degree cards use useTilt, scoped to each card's bounds
Max tilt: 8 degrees
Spring config: CARD_TILT

## Institutional Badge Rotation
The small embossed institutional badge (circle with initials) on each card rotates slightly toward the cursor
When cursor is in the left half of the card: badge rotates slightly left (max 5 degrees)
When cursor is in the right half: badge rotates slightly right
The rotation is driven by the horizontal component of the cursor position within the card
Spring config: CARD_TILT

## Card Cross-Proximity
When cursor is near one card, the other two cards respond with very slight repulsion — they subtly push away (max 4px) from the cursor direction
This creates a subtle fluid-body effect across the three cards
Implemented by each card listening to the global mouse position and calculating its distance from the cursor

---

# PART 18 — SCROLL TEXT ANIMATIONS

## Section Titles — Mask Reveal
GSAP clip-path wipe from left to right: inset(0 100% 0 0) → inset(0 0% 0 0)
After reveal: engraved text-shadow glow fades in
Duration: 600ms, ease: power3.out

## Body Paragraphs — Word Stagger
SplitText splits body into words
Each word: opacity 0, translateY 12px start
Stagger: 30ms per word
Triggered by ScrollTrigger on viewport entry

## Hero Name — Character Engraving
Each character: opacity 0, scale 1.4, blur 4px start
Lands to opacity 1, scale 1.0, blur 0px with bright flash then engraved settle
Stagger: 40ms per character

## Mouse-Responsive Text
Section subtitles and the bio paragraph have a very subtle mouse parallax
They shift at 1–2% of normalized mouse position
This gives every line of text a floating quality relative to the background
Makes even static text feel alive and responsive

## Parallax Background Text
Large atmospheric background text behind sections ("PROJECTS", "SKILLS", "ABOUT")
These move at 0.3× scroll speed via GSAP parallax
Additionally react to mouse at 0.5% intensity — a second order of motion layered on the scroll parallax
Color: rgba(255,255,255,0.015)

---

# PART 19 — HOVER INTERACTION SYSTEM

## Magnetic Button System
All primary buttons use MagneticWrapper
On entry within 60px: element shifts max 8–12px toward cursor (varies by button importance)
Button and cursor both spring toward each other simultaneously
On leave: spring back via MAGNETIC_PULL config
Buttons include: hero CTA pair, nav links, project card links, social tiles, submit button

## Universal Card Tilt System
All cards (project, degree, journey milestone) use TiltCard HOC
Tilt is scoped to each card's bounding rect
Mouse position normalized within rect: x from -1 to 1, y from -1 to 1
Applied as: rotateX = normalizedY × maxDegrees, rotateY = normalizedX × maxDegrees (inverted Y)
Perspective: 1000px on the card container
On enter: card lifts (translateZ 20px), shadow deepens
On leave: springs back to flat

## Proximity Glow Network
Every interactive element (cards, buttons, keycaps, nodes) emits glow as cursor approaches
The glow radius and intensity are CSS custom properties set by useProximityGlow
--glow-radius: mapped from distance to range 0px–30px
--glow-alpha: mapped from distance to range 0–0.45
This is applied via --shadow-proximity-glow token
The result: cursor passing near any interactive element causes a soft mint corona to form around it

## Keycap Mechanical Press
Press: translateY 2px, border-bottom shrinks, inset shadow (80ms instant feel)
Release: spring back with slight overshoot (stiffness 800, damping 30)
Click ripple: mint ring expands from center, fades over 300ms

## Card Border Trace
On card hover entry: mint glow traces the card border from entry point
Travels full perimeter in 600ms, then fades
Re-triggers on each new entry

---

# PART 20 — FOOTER

## Visual
Thin, minimal section
Etched ruled line at top
40px vertical padding

## Content
Left: "© 2025 Sanat Jha" engraved muted 12px
Center: Small embossed initials badge
Right: "Built with Next.js · Deployed on Vercel" engraved muted 12px

## Mouse Effect
Footer has a very faint mouse parallax — content shifts at 0.5% of normalized mouse position
The PCB texture in the footer background (static CSS, not WebGL) shifts at 1% mouse intensity
Creates a subtle lenticular depth illusion in the footer

---

# PART 21 — MOBILE RESPONSIVE STRATEGY

## Breakpoints
Desktop: 1280px and above
Tablet: 768px to 1279px
Mobile: below 768px

## Mouse Effects on Mobile
Custom cursor: completely hidden on touch devices (@media pointer: coarse)
Cursor trail: disabled
Click ring: disabled
Magnetic pull on all elements: disabled
Card tilt: disabled
Proximity glow: disabled
Parallax layers in hero: disabled
PCB torch light: mouse-reactive WebGL replaced with static version, auto-orbiting torch instead

## Layout Changes on Mobile
Navigation: hamburger → right drawer
Hero: orb stacks below text, orb scales to 70%, name reduces to 52px
About: portrait above bio, full width
Journey: vertical wire layout, cards all to the right
Education: cards stack vertically
Skills: 4-column keycap grid, 60px keycap size
Projects: image-on-top always, no alternating
Contact: single column, info above form

## Touch-Specific Interactions
Keycap press physics remain via touchstart/touchend
Card lift on tap (single press state rather than hover)
Social tiles have tap bounce via Framer Motion whileTap
Submit button has tap press animation

## Performance on Mobile
WebGL background: replaced with static CSS
Hero orb: geometry detail level 2 instead of 4
GSAP animations: only entrance animations, no continuous scrub

---

# PART 22 — PERFORMANCE STRATEGY

## Code Splitting
All section components wrapped in next/dynamic
WebGL components dynamic with ssr: false
Three.js loaded only after page is interactive

## Image Optimization
All images via next/image
Portrait: 600w × 750h WebP
Project screenshots: 800w × 500h WebP lazy loaded

## Mouse Effect Optimization
MouseTrackerContext throttled to 60fps via requestAnimationFrame
Proximity calculations batched: one loop per frame checks all registered elements
Canvas-based cursor trail (not DOM nodes per particle)
will-change: transform applied to all mouse-reactive elements

## Animation Performance
GSAP uses will-change: transform, opacity only
No layout-affecting properties animated
ScrollTrigger markers: false in production

## Bundle Size Targets
First Load JS: below 120kB gzipped for initial route
Three.js chunk: lazy loaded
GSAP + Framer Motion: tree-shaken

---

# PART 23 — RECRUITER-FACING FEATURES

## GitHub Stats Panel
surface-glass panel in About section
Live GitHub API data: commit streak, top languages, contribution count
Etched label + value pairs
Mint bar graph for weekly activity
Mouse hover: individual bars lift with tilt

## Tech Stack Visualization
Horizontal proficiency bars in Skills section
surface-inset track with mint fill animated on scroll entry
Each bar: engraved left label, percentage right
Bars react to cursor proximity — hovering a bar makes it glow

## Project Metrics LED
Each project card has a small metrics row
Live Users, GitHub Stars, Build Status
Build status LED: 8px circle, mint fill, radial glow — pure skeuomorphic
LED pulses slowly when active: opacity 0.7 to 1.0 on a 2s loop
On cursor hover: LED pulse speeds up to 0.5s

## Case Study Expansion
Each project card has "View Case Study" convex button
Click: card expands in-place via Framer Motion layout animation
Reveals: Problem, Approach, Tech decisions, Outcome
Expanded card has its own tilt and parallax layers active
"Close" link collapses the card
No modal — all inline

---

# PART 24 — ANIMATION MASTER TIMELINE

## Phase 1 — Page Load (0ms to 2800ms)
0ms: Curtain panels cover viewport
200ms: Curtain panels retract
600ms: Name engraving animation
900ms: PCB background activates, traces draw
1000ms: Mouse trail and cursor system activates
1200ms: Navbar fades in, mouse effects on nav go live
1500ms: Role scrambler begins
1800ms: Glass orb rises, mouse rotation goes live
2200ms: Bio text word-stagger
2800ms: All complete, all mouse effects fully active across page

## Phase 2 — Scroll Animations
About: portrait mask-reveal, bio fade-translate, GitHub stats animate in
Journey: wire draws, nodes snap, cards appear, mouse proximity effects activate
Education: cards stagger up, tilt effects activate
Skills: keycaps drop in wave, proximity glow network activates
Projects: cards slide from alternating sides, internal parallax activates
Contact: form fields stagger in, social tile magnets activate

## Phase 3 — Continuous Live
Scroll progress bar: updates continuously, draggable
PCB torch light: follows mouse 60fps
Card tilts: active when cursor inside each card
Proximity glow network: active across all interactive elements at all times
Magnetic pull: active on all wrapped elements
Role scrambler: loops indefinitely
Cursor trail: continuously generates particles
Orb rotation: continuously tracks mouse

---

# PART 25 — DEPLOYMENT

## Platform
Vercel, zero-config from GitHub

## Configuration
vercel.json with Cache-Control headers for static assets
Image optimization: WebP and AVIF formats
Edge network: all regions

## Environment Variables
NEXT_PUBLIC_GITHUB_USERNAME for GitHub API stats

## CI/CD
GitHub Actions: lint and type-check on pull request
Preview deployments on every branch push
Production deployment on merge to main

---

# PART 26 — FINAL EXPERIENCE GOAL

Every pixel reacts. The cursor is not a pointer — it is a physical presence the interface is aware of. Move it and the hero layers separate into depth. Hover a card and it tilts under the weight of your attention. Touch a keycap and feel it press. Approach a button and watch it lean toward you. Let the cursor drift near the edge of the screen and the PCB background brightens faintly, as if the circuit board is registering a nearby signal.

The skeuomorphic material gives the page physical weight. The mouse interactivity gives it nervous system awareness. The dark canvas gives it gravity. The mint gives it a single source of power.

The visitor should not feel like they are scrolling through a website. They should feel like they are holding a piece of hardware — responsive, precise, alive — and the portfolio is running on it.