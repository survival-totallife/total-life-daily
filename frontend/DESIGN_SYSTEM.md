# Total Life Daily - Design System

This document outlines the design system and color theme used throughout the Total Life Daily frontend, matching the
original [daily.totallife.com](https://daily.totallife.com/) website.

## Brand Colors

### Primary Brand Color

The primary brand color is **Coral**, used for main CTAs, links, and accents.

| Name             | Hex       | Tailwind Class | Usage                         |
|------------------|-----------|----------------|-------------------------------|
| Primary          | `#F97356` | `coral-500`    | Main buttons, links, accents  |
| Primary Hover    | `#E85A3D` | `coral-600`    | Button hover states           |
| Primary Light    | `#FEE4E0` | `coral-100`    | Light backgrounds, highlights |
| Primary Lightest | `#FEF2F0` | `coral-50`     | Subtle backgrounds            |

### Five Pillars Color System

Each wellness pillar has its own distinct color for easy identification:

| Pillar            | Hex       | Tailwind Class | Usage                                |
|-------------------|-----------|----------------|--------------------------------------|
| **Nourishment**   | `#22C55E` | `green-500`    | Green, represents nutrition/food     |
| **Restoration**   | `#3B82F6` | `blue-500`     | Blue, represents sleep/rest          |
| **Mindset**       | `#A855F7` | `purple-500`   | Purple, represents mental wellness   |
| **Relationships** | `#EC4899` | `pink-500`     | Pink, represents social connections  |
| **Vitality**      | `#F97316` | `orange-500`   | Orange, represents physical activity |

### Neutral Palette

| Name       | Hex       | Tailwind Class | Usage                    |
|------------|-----------|----------------|--------------------------|
| Background | `#FFFFFF` | `white`        | Page backgrounds         |
| Foreground | `#111827` | `gray-900`     | Primary text, headings   |
| Muted Text | `#6B7280` | `gray-500`     | Secondary text, captions |
| Muted BG   | `#F9FAFB` | `gray-50`      | Subtle backgrounds       |
| Border     | `#E5E7EB` | `gray-200`     | Borders and dividers     |
| Footer BG  | `#111827` | `gray-900`     | Dark footer background   |

## Typography

### Font Family

- **Primary Font**: Inter (Google Fonts)
- **Fallback**: System sans-serif stack

### Font Sizes & Weights

| Element         | Size               | Weight         | Class                                            |
|-----------------|--------------------|----------------|--------------------------------------------------|
| H1 (Hero)       | 3rem / 3.5rem      | Bold (700)     | `text-4xl lg:text-5xl font-bold`                 |
| H2 (Section)    | 1.875rem / 2.25rem | Bold (700)     | `text-3xl lg:text-4xl font-bold`                 |
| H3 (Card Title) | 1.125rem           | Semibold (600) | `text-lg font-semibold`                          |
| Body            | 1rem               | Normal (400)   | `text-base`                                      |
| Small/Caption   | 0.875rem           | Medium (500)   | `text-sm font-medium`                            |
| Label           | 0.75rem            | Semibold (600) | `text-xs font-semibold uppercase tracking-wider` |

## Spacing

Using Tailwind's default spacing scale:

| Name             | Value                                    | Usage                    |
|------------------|------------------------------------------|--------------------------|
| Section Padding  | `py-16 lg:py-24`                         | Vertical section spacing |
| Container        | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` | Content container        |
| Card Gap         | `gap-6 lg:gap-8`                         | Grid gaps between cards  |
| Component Margin | `mb-8`, `mb-12`                          | Between section elements |

## Border Radius

| Name        | Value    | Class          | Usage                         |
|-------------|----------|----------------|-------------------------------|
| Small       | 0.375rem | `rounded-md`   | Buttons, inputs               |
| Medium      | 0.5rem   | `rounded-lg`   | Small cards                   |
| Large       | 0.75rem  | `rounded-xl`   | Cards                         |
| Extra Large | 1rem     | `rounded-2xl`  | Featured cards, images        |
| Full        | 9999px   | `rounded-full` | Pills, avatars, category tabs |

## Shadows

| Name        | Class        | Usage             |
|-------------|--------------|-------------------|
| Small       | `shadow-sm`  | Cards at rest     |
| Medium      | `shadow`     | Card hover state  |
| Large       | `shadow-lg`  | Featured elements |
| Extra Large | `shadow-2xl` | Hero images       |

## Components

### Buttons

#### Primary Button

```html
<button class="px-4 py-2 bg-[#F97356] text-white text-sm font-medium rounded-full hover:bg-[#E85A3D] transition-colors">
  Subscribe
</button>
```

#### Category Tab (Active)

```html
<button class="px-5 py-2.5 rounded-full text-sm font-medium bg-emerald-600 text-white">
  Nourishment
</button>
```

#### Category Tab (Inactive)

```html
<button class="px-5 py-2.5 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50">
  Nourishment
</button>
```

### Cards

#### Article Card

```html
<article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
  <div class="relative aspect-[16/10] overflow-hidden">
    <img class="object-cover group-hover:scale-105 transition-transform duration-300" />
  </div>
  <div class="p-6">
    <h4 class="text-lg font-semibold text-gray-900 group-hover:text-[#F97356] transition-colors mb-3 line-clamp-2">
      Article Title
    </h4>
    <span class="text-sm text-[#F97356] font-medium">Read more</span>
  </div>
</article>
```

### Links

#### Text Link

```html
<a class="text-[#F97356] font-semibold hover:text-[#E85A3D] transition-colors">
  Read More →
</a>
```

### Form Inputs

```html
<input class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97356] focus:border-[#F97356] transition-colors" />
```

## Gradients

### Hero/Newsletter Background

```css
bg-gradient-to-br from-orange-50 via-white to-rose-50
```

### Podcast Section (Dark)

```css
bg-gray-900 text-white
```

## Animations & Transitions

| Property  | Duration | Easing | Class                               |
|-----------|----------|--------|-------------------------------------|
| Color     | 150ms    | ease   | `transition-colors`                 |
| Transform | 300ms    | ease   | `transition-transform duration-300` |
| Shadow    | 150ms    | ease   | `transition-shadow`                 |
| All       | 150ms    | ease   | `transition-all`                    |

### Hover Effects

- **Cards**: Scale image to 105% on hover (`group-hover:scale-105`)
- **Links**: Color change to teal-700 (`hover:text-teal-700`)
- **Buttons**: Background darken (`hover:bg-teal-700`)

## Responsive Breakpoints

Using Tailwind's default breakpoints:

| Breakpoint | Min Width | Usage         |
|------------|-----------|---------------|
| `sm`       | 640px     | Small tablets |
| `md`       | 768px     | Tablets       |
| `lg`       | 1024px    | Laptops       |
| `xl`       | 1280px    | Desktops      |
| `2xl`      | 1536px    | Large screens |

## Accessibility

- Focus states use `focus-visible` with teal ring
- Minimum contrast ratio of 4.5:1 for text
- Interactive elements have clear hover/focus states
- Skip to content link available
- Semantic HTML structure

## CSS Custom Properties

Available in `globals.css` for custom usage:

```css
/* Primary Brand */
--color-primary: 166 84% 29%;

/* Five Pillars */
--color-nourishment: 160 84% 39%;
--color-restoration: 221 83% 53%;
--color-mindset: 271 81% 56%;
--color-relationships: 343 81% 50%;
--color-vitality: 21 90% 48%;
```

Usage in CSS:

```css
.custom-element {
  background-color: hsl(var(--color-primary));
  color: hsl(var(--color-nourishment));
}
```
