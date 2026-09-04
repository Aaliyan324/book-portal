---
version: "alpha"
name: "Vectra Node — Streamline your global frameworks with AI"
description: "Vectra Node Pricing Section is designed for comparing plans and supporting conversion decisions. Key features include plan comparison blocks and conversion-oriented actions. It is suitable for subscription pricing pages and plan comparison experiences."
colors:
  primary: "#EA580C"
  secondary: "#525252"
  tertiary: "#F0FA06"
  neutral: "#525252"
  background: "#FFFFFF"
  surface: "#E5E5E5"
  text-primary: "#525252"
  text-secondary: "#171717"
  border: "#D4D4D4"
  accent: "#EA580C"
typography:
  display-lg:
    fontFamily: "Inter"
    fontSize: "72px"
    fontWeight: 600
    lineHeight: "72px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
rounded:
  md: "0px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "1px"
  md: "4px"
  lg: "8px"
  xl: "24px"
  gap: "12px"
components:
  button-primary:
    backgroundColor: "{colors.text-secondary}"
    textColor: "{colors.background}"
    typography: "{typography.label-md}"
    rounded: "{rounded.full}"
    padding: "0px"
  button-link:
    textColor: "{colors.secondary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "0px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses light mode with #EA580C as the main accent and #525252 as the neutral foundation.

- **Primary (#EA580C):** Main accent and emphasis color.
- **Secondary (#525252):** Supporting accent for secondary emphasis.
- **Tertiary (#F0FA06):** Reserved accent for supporting contrast moments.
- **Neutral (#525252):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #FFFFFF; Surface: #E5E5E5; Text Primary: #525252; Text Secondary: #171717; Border: #D4D4D4; Accent: #EA580C

## Typography

Typography relies on Inter across display, body, and utility text.

- **Display (`display-lg`):** Inter, 72px, weight 600, line-height 72px, letter-spacing -0.025em.
- **Body (`body-md`):** Inter, 14px, weight 400, line-height 20px.
- **Labels (`label-md`):** Inter, 14px, weight 500, line-height 20px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 1px, 4px, 8px, 24px, 32px, 40px, 48px
- **Gaps:** 12px, 32px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 0.67px #D4D4D4; 2px #A3A3A3; 2px #FFFFFF
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px; rgb(255, 255, 255) 0px 0px 0px 2px
- **Blur:** 4px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 1px padding and a 9999px radius. Drive the shell with linear-gradient(135deg, rgba(23, 23, 23, 0.15), rgba(249, 115, 22, 0.5) 45%, rgba(244, 63, 94, 0.4) 75%, rgba(23, 23, 23, 0.05)) so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 2px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 2px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles.

### Buttons
- **Primary:** background #171717, text #FFFFFF, radius 9999px, padding 0px, border 0px solid rgb(229, 231, 235).
- **Links:** text #525252, radius 0px, padding 0px, border 0px solid rgb(229, 231, 235).

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 2px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected moderate motion intensity without a deliberate reason.

## Motion

Motion feels controlled and interface-led across text, layout, and section transitions. Timing clusters around 150ms. Easing favors ease and cubic-bezier(0.4. Hover behavior focuses on text and color changes. Scroll choreography uses GSAP ScrollTrigger for section reveals and pacing.

**Motion Level:** moderate

**Durations:** 150ms

**Easings:** ease, cubic-bezier(0.4, 0, 0.2, 1)

**Hover Patterns:** text, color

**Scroll Patterns:** gsap-scrolltrigger

## WebGL

Reconstruct the graphics as a ambient background using dpr clamp, custom shaders. The effect should read as technical and meditative: fluid wave field with white and sparse spacing. Build it from shader field so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Ambient background
  - **Effect:**
    - **Value:** Fluid wave field
  - **Primitives:**
    - **Value:** Shader field
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** DPR clamp, custom shaders

**Techniques:** Breathing pulse, Pointer parallax, Shader gradients, DOM fallback

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Gradient / WebGL section -->
      <section id="about" class="relative overflow-hidden" aria-label="Introduction">
        <canvas id="glcanvas" class="absolute inset-0 w-full h-full border-t border-neutral-200" aria-hidden="true"></canvas>
        <div class="relative z-10 flex flex-col items-center text-center px-6 pt-24 md:pt-32 pb-28 md:pb-40">
          <p data-split class="max-w-2xl text-base md:text-lg leading-relaxed text-neut…
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      if (!gl) { canvas.style.background = 'linear-gradient(to bottom,#fdfbf7,#fbcfe8,#9333ea)'; return; }

      const vsrc = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      const fsrc = `
        precision highp float;
        uniform vec2 u_res; uniform float u_time;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        void main(){
      …
      ```
  - **Renderer setup:**
    - **Language:** js
    - **Snippet:**
      ```
      const vsrc = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
      const fsrc = `
        precision highp float;
        uniform vec2 u_res; uniform float u_time;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        void main(){
          vec2 uv = gl_FragCoord.xy / u_res;
          float t = u_time*0.18;
      ```
