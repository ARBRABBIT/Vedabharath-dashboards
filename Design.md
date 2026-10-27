# Veda Bharath UI Design System

Source audit: **27 October 2026**. Scope: the local application in this directory.

> **Warehouse Exception removal:** The `/orders` Exception queue and its dedicated shortage-resolution workflow are removed. To be delivered remains a separate queue. This supersedes the original warehouse-exception observations below; super-admin historical order-status displays are a separate feature.

> **Dropdown update — 27 October 2026:** The inventory stock-status control now uses the shared `SelectDropdown` component documented in section 7.2. That specification supersedes the original native status-select description and inventory source snapshot in Appendix 18. Other audit entries remain historical source observations; the page has since been simplified to the stock-details view.

## Table of contents

1. [Design System Overview](#1-design-system-overview)
2. [Application Architecture](#2-application-architecture)
3. [Design Tokens](#3-design-tokens)
4. [Color System](#4-color-system)
5. [Typography System](#5-typography-system)
6. [Layout System](#6-layout-system)
7. [Component Library](#7-component-library)
8. [Navigation Patterns](#8-navigation-patterns)
9. [Forms & Validation](#9-forms--validation)
10. [Icons & Assets](#10-icons--assets)
11. [Motion & Interaction](#11-motion--interaction)
12. [Responsive Guidelines](#12-responsive-guidelines)
13. [Accessibility Guidelines](#13-accessibility-guidelines)
14. [Page & Screen Patterns](#14-page--screen-patterns)
15. [Design Consistency Audit](#15-design-consistency-audit)
16. [Implementation Guidelines](#16-implementation-guidelines)
17. [New Screen Creation Guidelines](#17-new-screen-creation-guidelines)
18. [Reference Appendix](#18-reference-appendix)
19. [AI Development Rules — Mandatory for All New Screens](#19-ai-development-rules--mandatory-for-all-new-screens)
20. [Verification & New Screen Readiness](#20-verification--new-screen-readiness)

## 1. Design System Overview

This document records the **existing implementation**, with separately labeled improvements. It is the starting point for reproducing existing screens and extending their design language. It does not establish that demo actions persist, that the application is accessible, or that every layout works at every viewport.

Evidence labels:

- **Existing:** directly supported by source, including installed Tailwind defaults.
- **Inferred:** an interpretation of repeated implementation choices, not a formal product requirement.
- **Recommended:** a proposed future change; not an implemented feature or token.
- **Unverified:** runtime rendering, behavior, or a property that could not be established.

Unless qualified otherwise, technical specifications below are **Existing source specifications**. Pixel equivalents of rem values assume a 16px root; the application does not override the root font size. An element's final computed size can differ because of content, borders, flex shrinking, caller classes, or browser behavior.

**Inferred visual identity:** a light, rounded operations dashboard combining Figtree typography, amber/orange actions, white panels, agricultural green cues, rice imagery, quiet separators, pill controls, and compact business data. Warehouse views favor green-gray ink and soft shadows. Super-admin views favor neutral gray ink, brighter orange, and larger panels edged with a 2px translucent black border. Both are established contexts; do not silently unify them while adding a screen.

Use the human-readable recipes in sections 3–17, then the file-specific contracts in Appendix 18. Those contracts retain exact JSX classes, dynamic branches, props, motion attributes, and state initializers. An undefined focus/loading/error style means **not implemented**, not permission to claim an existing standard.

## 2. Application Architecture

| Concern | Verified implementation | Source |
|---|---|---|
| Framework | Next.js 16.2.12, App Router | `package.json`, `src/app` |
| Rendering | React / React DOM 19.2.4; server route wrappers and client stateful screens | `package.json`, `"use client"` directives |
| Language | TypeScript, strict mode, JSX; `@/*` maps to `./src/*` | `tsconfig.json` |
| Styling | Tailwind CSS v4 through `@tailwindcss/postcss`; inline utility recipes and inline React styles | `postcss.config.mjs`, `src/app/globals.css` |
| Shared UI | Handwritten React components; no installed Radix/shadcn/MUI component system | `src/components/ui`, `package.json` |
| Icons | `lucide-react` declared `^1.27.0` | `package.json` |
| Motion | `framer-motion` declared `^12.43.0`; requestAnimationFrame counter; Tailwind transitions/spinner | `src/components/ui`, `AnimatedCounter.tsx` |
| Installed but unused | `gsap` declared `^3.15.0`; no source import/use found | `package.json`, all `src` |
| Charts | Handwritten SVG, inline widths, `smoothPath` cubic interpolation; no chart library | dashboard cards, `src/lib/smooth-path.ts` |
| Fonts | `next/font/google` Figtree; Latin; 400/500/600/700 | `src/app/layout.tsx` |
| State/data | Component-local state and fixture modules; default-password flag in localStorage | `*Data.ts`, `src/lib/authState.ts` |
| Theme | Light only. No dark theme switch or dark token set in source | `globals.css`, all UI files |
| Config | Empty Next options; no project Tailwind config or custom breakpoint file | `next.config.ts`, project inventory |

The root layout imports global CSS, sets `lang="en"`, `h-full antialiased`, and a `min-h-full flex flex-col font-sans overflow-x-hidden` body. Business pages repeat their navbar and main wrapper instead of inheriting a dashboard layout. Only `src/app/layout.tsx` is a layout file. The README's Geist text is boilerplate; actual code uses Figtree.

Directories: `src/app` contains routes and page-local compositions; `src/components/auth` authentication; `dashboard` navigation, overview cards and profile; `orders` queue and flow modals; `inventory` stock/batch controls and fixtures; `reports` CSV cards; `super-admin` domain widgets, modal families and fixture data; `ui` shared auth primitives and animated text; `src/lib` auth flag and SVG math; `public` eight PNGs.

### Complete route inventory

All **33 page modules** are included. `/` redirects, so this is **32 screen-bearing route modules plus one redirect**. Dynamic routes and in-page states add views, not additional page files. Source for each row is `src/app/<route>/page.tsx` (root: `src/app/page.tsx`).

| Route | Purpose and composition | States / exceptions |
|---|---|---|
| `/` | Redirect to `/login` | No independent UI |
| `/login` | AuthLayout + LoginForm | Required ID/password; pending spinner; invalid credentials text; role-dependent redirect |
| `/signup` | AuthLayout + SignupForm | Name/email/phone/password/confirmation; mismatch; simulated pending; login link |
| `/forgot-password` | AuthLayout + ForgotPasswordForm | Email entry → masked-address success with animated check |
| `/set-new-password` | AuthLayout + SetNewPasswordForm | Two password fields; match check; role query; local flag; login redirect |
| `/update-default-password` | AuthLayout + notice | Primary set-password link and secondary return-to-login |
| `/dashboard` | Warehouse overview | Duplicates `/warehouse`; navbar's Dashboard link points to `/warehouse` |
| `/warehouse` | Hero, three glass KPI chips, growth/alerts/fulfillment cards, ticket table | Range selector, stock deep links, ticket reply; route-local `loading.tsx` spinner |
| `/orders` | Warehouse hero + OrdersQueue | Five queues; one expanded card; pagination; packing/shipping/exception/return flows; search value does not filter orders |
| `/inventory` | Hero + three KPI chips + InventoryBoard | Allocations/details; batch search; context selectors; create/dossier/update modals; stock empty state |
| `/reports` | Hero + ReportsGrid | Three fixture CSV downloads; no pending/error panel |
| `/super-admin` | Two dashboard rows | Top sellers/support tickets, offers/reviews; widgets 380px tall; scrollable lists |
| `/super-admin/products` | Top selling table | Most Ordered/Best Revenue sorting; date control stores selection without filtering data; 5/page |
| `/super-admin/products/[sku]` | Product gallery, details, feature tiles, sales metrics, variants table, reviews | Unknown SKU calls `notFound()`; visibility toggles; edit link into product wizard; Weekly/Monthly select has no data handler |
| `/super-admin/tickets` | Header, filter capsule, search, ticket cards | Category/priority filters, default Urgent; reply/template flows; empty result |
| `/super-admin/offers` | Header/status filter, Percentage/Coupon/Drafts tabs, search, table | Default Coupon; 5/page; Drafts intentionally filters to zero; launch/edit dialogs |
| `/super-admin/reviews` | Filter capsule, search, 900px-min table | Rating/product/visibility filters; 5/page; toggles; empty result |
| `/super-admin/revenue` | Full-height blurred financial placeholder | ComingSoonCard overlays disabled, `aria-hidden` dummy dashboard; not a functioning financial screen |
| `/super-admin/master-data` | Six destination cards | Products, tags, benefits, nutrition, coupons, drafts; 1/2/3-column grid |
| `/super-admin/master-data/products` | Published/Drafts/Hidden catalog | Search, visibility/delete/relocation confirmation, row menu, stock status, edit/new links; reads `?tab=` |
| `/super-admin/master-data/products/new` | Three-tab product wizard | Basic Details; Cooking & benefits; Reviews & Offers; `?edit=sku` prefill; upload; pickers; preview; success; draft link |
| `/super-admin/master-data/tags` | Search + tag cards | 1/2/3 columns; create/edit FormModal; pagination |
| `/super-admin/master-data/health-benefits` | Search + 720px-min table | Create/edit FormModal; pagination |
| `/super-admin/master-data/nutrition` | Search + nutrient cards | 140px-min cards; create/edit FormModal; pagination |
| `/super-admin/master-data/coupons` | Search + flex rows | Fixed 220px discount/100px action columns; create/edit FormModal; pagination; no explicit narrow-screen table wrapper |
| `/super-admin/master-data/drafts` | Search + categorized draft cards | Resume if available; direct local delete; empty state; pagination |
| `/super-admin/users` | Header actions, four KPIs, warehouse cards, customer directory | Create/edit hub; create/admin/customer details; expand hubs; search; 760px-min customer table; reads deep links |
| `/super-admin/users/orders` | Header actions + order accordions | Search, filter modal, one expanded order, details; 5/page; customer/items/action composition |
| `/super-admin/users/drafts` | Draft cards and search | Confirm discard → animated success; resume; pagination; empty state |
| `/super-admin/site-content` | Blogs/Banners/Drafts workspace | Reads query tab then clears it from URL; featured blog, list, banner/event split, draft table; search |
| `/super-admin/site-content/blogs` | Full blog catalog | Search, 1/2/3-column grid, pagination, new/edit links, empty state |
| `/super-admin/site-content/blogs/[id]` | Blog editor or preview | `/new` handled by dynamic segment; metadata, tags, sections/reorder, hero upload, status cycle, save draft, publish-success modal; unknown ID opens blank editor |
| `/super-admin/site-content/banners/new` | Banner editor + preview | Image click/drop, placement picker, two DateFields, live preview, draft dialog, scheduling-success modal; fixture dates start August 2026 |

There are no custom `error.tsx`, `not-found.tsx`, bottom navigation, dashboard sidebar, or catch-all route files in the source inventory. `ErrorState` and `EditProductModal` exist but have no incoming source imports; document them as available, currently unused components.

## 3. Design Tokens

### Actual named tokens versus repeated literals

The only application-wide CSS variables are defined in [globals.css](src/app/globals.css):

```css
:root { --background: #ffffff; --foreground: #1a1c1d; }
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-figtree);
}
```

`--font-figtree` is generated by Next's font loader. `BUTTON_BASE_CLASSES`, `BUTTON_VARIANT_CLASSES` in `components/ui/Button.tsx`, and `PRIMARY_BUTTON`, `SECONDARY_BUTTON`, `pillClasses` in `orders/modals/modalHelpers.ts` are shared **class recipes**, not semantic CSS token definitions. Other palettes are hardcoded in JSX or local helper functions. Names such as “warehouse primary” below are documentary roles, **not existing importable tokens**.

### Framework-derived tokens

Verified against installed `node_modules/tailwindcss/theme.css`:

| Foundation | Exact value | Interpretation |
|---|---|---|
| Spacing base | `--spacing: 0.25rem` | 4px at default root; numbered spacing is multiplier × 4px |
| Breakpoints | sm 40rem; md 48rem; lg 64rem; xl 80rem; 2xl 96rem | 640/768/1024/1280/1536px equivalents; 2xl is available but unused |
| Weights | normal 400; medium 500; semibold 600; bold 700; extrabold 800 | Font loader requests only 400–700; 800 appears in drawer title and may synthesize |
| Radius | md .375rem; lg .5rem; xl .75rem; 2xl 1rem; 3xl 1.5rem | 6/8/12/16/24px; `rounded-full` uses an effectively infinite radius |
| Default transition | 150ms, `cubic-bezier(0.4,0,0.2,1)` | Applies when a Tailwind transition has no duration/ease override |
| Blur | sm 8px; md 12px | Backdrop utilities in shells and scrolled headers |
| Spin | `spin 1s linear infinite` | Loader2 via `animate-spin` |

No named app spacing, elevation, motion, semantic state, or z-index token scale exists. Appendix 18 inventories all literal and utility usage rather than inventing one.

### Layer roles

| Utility | Value | Existing use |
|---|---|---|
| `z-10` | 10 | Hero content, close controls, local foreground elements |
| `z-20` | 20 | Filter menu, calendar, emoji popover |
| `z-40` | 40 | Sticky navbars |
| `z-50` | 50 | ModalShell, standalone dialogs, notification/mobile panels |
| `z-[60]` | 60 | Product publish-success overlay |

These are usage conventions, not an enforced layering API. Stacking contexts still affect final order.

## 4. Color System

### Main roles and exact values

| Documentary role | Existing literal/class | Purpose and source examples |
|---|---|---|
| Auth / warehouse amber | `#F9A51A` | Button primary, TextField focus, navbar active, order IDs, stock tabs |
| Amber hover | `#e6960f` | Shared Button, warehouse CTA hover |
| Super-admin / flow orange | `#F7931E` | Super-admin CTAs, filter selection, helpers primary, chart orders |
| Flow hover | `#e6850f` | `modalHelpers.PRIMARY_BUTTON` |
| Text-link hover | `#e07f0e` | Master data / user management links |
| Warehouse success | `#3BB54A` | Stock badges, report download, fulfillment steps |
| Warehouse success hover | `#2f9d3d` | Report/stock action hover |
| Super-admin success | `#22C55E` | Live status, growth, customer identity, positive tags |
| Green soft surface | `#EBF7EC` | Shared pills, success discs, stock status |
| Orange soft surface | `#FEF3E2` | Warning, extension information, status pills |
| Error foreground | `#EF4444` | Error text, urgent tags, returned state, delete affordances |
| Error stronger | `#DC2626`, `#D93025` | Warehouse red pill; destructive confirmation icons |
| Error surface | `#FEE2E2`, `#FEF2F2`, `#FFDAD6` | Pills, inline error blocks, destructive icon discs |
| Information | `#3B82F6` on `#EFF6FF`; `#1A73E8` on `#E8F0FE` | Super-admin info/status; warehouse blue helper pill |
| Page surface | `#F5F5F7` | Operational pages and most super-admin routes |
| Auth/root/overview surface | `#ffffff` / `bg-white` | Auth, root body, warehouse/dashboard wrapper, cards |
| Inner neutral surface | `#F9FAFB`, `#F3F4F6`, `#FAFAFA` | Nested admin cards, tracks, review rows |
| Auth field surface | `#F3F3F5` | TextField and secondary Button hover |
| Root/auth ink | `#1A1C1D` | Body inherited foreground and auth headings |
| Warehouse ink | `#171D15`, `#1D1D1F` | Order, inventory, modal heading text |
| Warehouse supporting | `#3E4A3C`, `#6E7B6A`, `#86868B` | Table values, labels and muted metadata |
| Auth supporting | `#3D4949`, `#6D7A7A` | Label/body and field icon/placeholder |
| Super-admin ink | `black` (`#000000`), `#374151` | Titles and secondary values |
| Super-admin muted | `#6B7280`, `#9CA3AF` | Body descriptions, captions/placeholders |
| Subtle border | `#F1F5F9`, `#F3F4F6` | Warehouse / super-admin separators |
| Default border | `#BDCAB8`, `#E5E7EB`, `#E5E5E7`, `#E4E4E7` | Warehouse outline; admin inputs; flow controls; auth outline |
| Card border | `black/[0.04]` | Super-admin/overview panel outline; 2px |
| Focus | `#F9A51A` at 40% or `#F7931E` | Auth focus-within ring / admin field ring |
| Notification dot | `#EF4646` | Navbar unread count |
| Inverse text | `white`, `white/80`, `#F2F2F2` | CTAs, glass KPIs, hero text |

There is no primary active/pressed color token, disabled palette, or dark-mode palette. Disabled styling is mostly opacity (40%, 50%, or 60%) and cursor changes. Do not describe opacity as a new gray token.

### Alpha and semantic differences

Tailwind `/N` denotes N% alpha; `/[0.04]` denotes 4%, not 0.04%. Existing examples: white/20 glass backgrounds, white/30 glass borders, white/80 KPI text, black/40 modal overlay, black/5 placeholder overlay, `#BDCAB8/30` dividers, green/red at 10% on warehouse order badges, amber/10 or /15 icon discs, `#6D7A7A/50` placeholders. See the exact expression inventory in Appendix 18 for every variant.

Status names are **context-dependent**:

- `pillClasses`: blue `#E8F0FE/#1A73E8`, green `#EBF7EC/#3BB54A`, orange `#FEF3E2/#F7931E`, red `#FEE2E2/#DC2626`.
- Super-admin orders: Delivered blue; Exception orange; Returned red; other statuses green.
- Warehouse OrderCard: all statuses except negative-tone Returned use green, including Exception.
- Offers: Active green, Scheduled blue, Completed neutral. Content Scheduled is orange instead.
- Draft category: Products orange, Master Data green, other categories blue.
- Product performance: ≥65% Most Selling green; <48% Less Selling red; intermediate Trending blue.
- Product stock dot: <100 red; <500 orange `#F97316`; ≥500 green.
- Warehouse stock: quantity ≤0 Out of Stock; positive fraction ≤20% Low Stock; above 20% In Stock. Stock bar percentage is rounded and capped at 100.
- Batch age: ≥1 year green Aged–Ready / Ready for Dispatch; below 1 year orange Under Ageing / Maturing in Warehouse.

Sources: `modalHelpers.ts`, `inventoryData.ts`, `productStockData.ts`, and each super-admin domain's `*Data.ts` helpers. Preserve those mappings when reproducing screens; standardization is a recommendation in section 15.

All additional colors, gradients, SVG fills/strokes and alpha expressions have a source-indexed registry in Appendix 18. Decorative blog/banner colors are content treatments, not a second global brand palette.

## 5. Typography System

Figtree is the default sans font throughout. No project-specific H1–H6 CSS defaults exist; headings receive utility styles. Semantic heading level does not determine size. The table records intended recipes from source, not universal heading tokens.

| Style / source | Size | Weight | Line-height | Tracking / color |
|---|---|---|---|---|
| Auth AnimatedTitle | 32px | 600 | 38px | -0.9px; `#1A1C1D` |
| Hero title | 32px → sm 40px → lg 50px | 600 | 1.2 → lg 60px | normal; `#F2F2F2` |
| Hero subtitle | 18px → sm 20px → lg 24px | 400 | 1.2 → lg 29px | normal; white |
| PageHeader / admin page H1 | 28px | 700 | inherited 1.5 unless overridden | normal; black |
| Auth banner quote | 28px → xl 36px | 700 | 1.4 → xl 1.35 | white |
| Blog preview H1 | `text-4xl`: 36px | 700 | `leading-tight`: 1.25 | black |
| Dashboard card H3 / ticket table H2 | `text-xl`: 20px / `text-2xl`: 24px | 600 | 28px / 32px | black |
| Modal title | mostly 20px; pack/ship 24px; track 28px | 700 | 28px / 32px / inherited 1.5 | warehouse ink or black |
| Body | `text-sm`: 14px or `text-base`: 16px | 400 | 20px / 24px | local supporting ink |
| Long description | 14px | 400 | `leading-relaxed`: 1.625 (22.75px) | usually `#6B7280` |
| Auth supporting text | 16px | 400 | 26px | `#3D4949` |
| Form label | 14px | 600 | 20px | `#3D4949`, black, or `#171D15` |
| Auth Button | 16px | 700 | 24px | white or `#1A1C1D` |
| Flow helper button | 16px | 600 | 24px | white or `#64748B` |
| Admin actions | 14px, table actions 12px | 600–700 | 20px / 16px | white / orange / gray |
| Navbar label | 18px | 400; selected 500 | 110% (19.8px) | black / `#F9A51A` |
| Table headers | 12px | 600 or 700 | 16px | uppercase; `tracking-wide` .025em or explicit .6px |
| Table values | 14px, identity sometimes 16px | 400/600/700 | 20px / 24px | value hierarchy by weight/color |
| Caption/helper | 12px | 400–600 | 16px, some explicit 18/19px | muted |
| Compact badges | 10px, 11px, 12px | 600–700 | inherited 1.5 for arbitrary sizes; 16px for text-xs | often uppercase/wide |
| Navbar notification | 9px | 700 | 1 (`leading-none`) | white |
| Hero KPI value | 24px | 500 | 28px | white; unit 16px |
| Admin KPI value | 30px (`text-3xl`), some 24px | 700 | 36px / 32px | black |

Installed Tailwind sizes used here: xs 12/16, sm 14/20, base 16/24, lg 18/28, xl 20/28, 2xl 24/32, 3xl 30/36, 4xl 36/40 (font/line-height px). Arbitrary `text-[Npx]` changes font size but does not supply a paired default line-height; use the actual `leading-*` or inherited line-height. `font-extrabold` exists in the notification drawer despite the loader's 400–700 range.

Alignment: normal flow is left aligned; confirmation/auth success states center; amounts/actions often align right; numeric chart/calendar grids center. `uppercase`, `capitalize`, explicit tracking (`0.4px`, `0.5px`, `0.6px`, `1.1px`, `1.2px`), `tracking-tight` (-.025em), truncation and line-clamp are local patterns. Appendix 18 preserves all local deviations. There is no separate H5/H6, tooltip, or form-error typography token.

## 6. Layout System

### Shells, grids and spacing

| Recipe | Exact existing behavior |
|---|---|
| Dashboard/admin main | `flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16`: horizontal 24/40/64px, top 24px, bottom 40px; fluid width, no shared max-width |
| Header | Sticky top 0, z40; same horizontal spacing, py20px; height content-driven, not a fixed height token |
| Auth left panel | Full width below lg; 50% at lg; px24 → sm48 → lg64 → xl96; pt56 → lg80; pb32 → lg40 |
| Auth inner | Centered `w-full max-w-[454px]`; logo height56px; children mt32 → lg40; security footer pushed by mt-auto |
| Auth art | Hidden below lg; 50% width; cover image; max412px quote panel, radius46px, padding36px; min-height460 → xl560px |
| Hero | Full width radius24px; min-height280 → sm300 → lg338px; px32 → sm40, py32px; with children justify-between/gap36px; otherwise bottom-aligned/gap4px |
| Warehouse grid | Reports 1 → sm2 → lg3 columns gap24px; stock details gap20px |
| Admin overview | Two stacked rows, gap24px; flex-row at lg; widget height380px |
| Admin tile grid | Mostly 1 → sm2 → lg3, gap16px or 24px; user KPIs lg4 |
| Product wizard | Basic form lg `1.5fr 1fr`; preview lg `1.4fr 1fr`; other tabs lg2 columns |
| Blog editor | lg `1.6fr 1fr`; blog preview max760px centered, px24 py40 |
| Site content | Blog workspace lg `1.4fr 1fr`; banners lg `1.6fr 1fr` |
| Warehouse order | Header wraps below sm; expanded content column → sm row; customer width280px, actions294px; middle flex with side borders at sm |
| Admin expanded order | Grid 1 → sm `[280px_1fr_auto]`; action button220px |
| Revenue | `h-screen overflow-hidden`; flex-1 clipped placeholder and centered overlay |

The installed spacing base is 4px, but the application also uses half-steps and many explicit values. Common values: 1=4px, 1.5=6px, 2=8px, 2.5=10px, 3=12px, 3.5=14px, 4=16px, 5=20px, 6=24px, 7=28px, 8=32px, 9=36px, 10=40px, 12=48px, 14=56px, 16=64px, 20=80px, 24=96px. These are framework utilities, not a formally restricted app scale.

Repeated rhythms: page sections mt24/32px; field groups gap20/24px; auth form gap32px and fields gap26px; cards p20→sm24 or p24/p28; modal bodies p24→sm28/32, p28→sm36/40, tracking p32→sm48; icon/text gaps6/8/12px. One-off examples: auth field padding18px and gap18px; search left19px; navbar gap13px; avatar54.74px; banner emblem offset39.5px. The exact class ledger records every spacing value by owning element.

### Radius, border and elevation

| Element | Radius / border |
|---|---|
| Auth Button/TextField; admin pills/actions | Full pill |
| Warehouse order card / standalone confirmations | 20px |
| ProfileModal | 18px |
| ModalShell, reports, inventory allocation card, hero | 24px |
| Admin standard cards / drafts | 28px frequently |
| Dashboard widgets/admin tables/product details | 32px |
| Inner tiles, product cards, dropdowns | Often 16px (`rounded-2xl`) |
| Flow buttons/fields | 12px (`rounded-xl`) |
| Thumbnails | 6/8/12/16px according to context |
| Auth glass quote | 46px |

Standard border utilities are 1px solid; `border-2` is 2px. Explicit 3px and 6px borders occur in decorative/success treatments. Dashed borders mark uploads, decorative chart labels and placeholders. Default border color is not a shared app token; use each recipe's explicit color. No elevation enum exists.

| Documentary elevation | Exact CSS shadow | Source example |
|---|---|---|
| Warehouse soft card | `0 4px 24px rgba(0,0,0,.04)` | OrderCard, ReportCard, inventory |
| Standalone confirmation | `0 12px 32px rgba(0,0,0,.08)` | CancelOrder / LogoutConfirm |
| Main modal | `0 32px 80px rgba(0,0,0,.12)` | ModalShell |
| Dropdown | `0 16px 40px rgba(0,0,0,.12)` | FilterDropdown |
| Calendar | `0 16px 40px rgba(0,0,0,.14)` | DateField |
| Notification/mobile popover | `0 32px 80px rgba(0,0,0,.12), 0 2px 16px rgba(0,0,0,.04)` | DashboardNavbar / NotificationsPanel |
| Scrolled navbar | `0 2px 16px rgba(0,0,0,.06)` | Both navbars |
| Orange flow CTA | `0 10px 15px -3px rgba(247,147,30,.2)` | PRIMARY_BUTTON helper |
| Super-admin drawer | `0 24px 60px rgba(0,0,0,.18)` | SuperAdminNotificationsPanel |

Additional shadows (including success glow, grain drop-shadow, selected-tab double shadow, and `shadow-sm`) are indexed in Appendix 18. App code does not define numbered elevation levels.

### Overflow and printing

Tables use `overflow-x-auto` and explicit min-widths: inventory880px; top sellers/reviews/offers900px; health benefits720px; customer directory760px; product variants720px. Table padding is mostly 16px vertical with 16/24px horizontal; inventory rows use20px vertical and 24/36px edges. Narrow views keep tables scrollable rather than converting to cards.

Modal content commonly caps at85/88/90/92vh with internal vertical scrolling; individual picker lists cap at280/360/420px. Some small dialogs only rely on backdrop overflow. `.scrollbar-hide` removes visual scrollbar affordances but retains scrolling. Root body hides horizontal overflow, which can conceal layout overflow rather than fix it.

Print rules in `globals.css` hide all body descendants except `#invoice-print-area`, remove backdrop background/blur, position print overlay at inset0 with24px padding, make `.modal-card` static/full width/max640px with no shadow/radius, uncap invoice height/overflow, and hide `.no-print`. `InvoiceModal` calls `window.print()`; cancellation or successful physical printing is not detected.

## 7. Component Library

### Inventory bag-count update

Inventory product cards now replace the single total-kg figure with two labeled stock tiles: **1kg — number of bags** and **5kg — number of bags**. Tiles use the established12px radius, `#F5F5F7` surface,12px padding/gap,12px muted semibold labels,24px bold count and14px bag suffix (singular for1). They use semantic dl/dt/dd markup in a two-column grid. The existing status pill, stock-level percentage/bar and update action remain.

`ProductStock` in `productStockData.ts` now stores `bags: Record<1 | 5, number>` as the stock source of truth; `stockQuantityKg` derives 1kg-count +5 ×5kg-count for capacity-based stock status and percentage. The initial bag splits are **explicit illustrative fixtures**, not inferred actual package counts: an aggregate kilogram value cannot establish the pack-size split. For the existing demo records they preserve the previous numeric stock levels; Indrani's previous generic-unit fixture is now an explicit rice bag fixture. Dashboard inventory alerts derive kilogram totals from the same helper rather than retaining stale duplicate quantity fields.

UpdateStockModal shows a read-only Product field bound to the product card/deep-link SKU, with no product selector or editable SKU state. An invalid SKU does not fall back to another product. It adds a Pack Size select using the shared field-appearance SelectDropdown and a Number of Bags field. The selected size defaults to1kg, shows available bag count, and controls which count is added/removed. Only positive whole bag counts are accepted; removals require notes and cannot exceed available bags for that size. Zero/negative/fractional/oversized removals cannot submit; excessive removal shows an associated inline error. The success message names the selected size and bag count. The form remains vertically scrollable at85vh. Adjustments remain component-local demo state, with no backend inventory persistence.


### Return / Replacement resolution update

**Replacement queue transition update:** After validated replacement assignment, OrdersQueue moves the order from Returned/Replacement to To be delivered, selects the destination tab, puts the order first on page1, expands the card and opens its delivery summary. The record carries `isReplacement`, the assigned Self Delivery `shipment` (driver name/+91 phone), and later `deliveredAt`. Card and shipped-summary header show the exact **Replacement product** tag using a soft-orange pill (`#FEF3E2`,12px semibold dark warehouse ink,12px horizontal/4px vertical padding). Status remains To be delivered/Shipped until Mark as Delivered completes it; that action moves the same tagged order into Delivered and retains driver details/completion time for reopening. Replacement Delivered cards reuse the fulfillment summary rather than a generic fixture-only delivered modal. Queue mutations deduplicate matching IDs at the destination and recompute actual counts/pages with10 records per full page. These transitions persist while OrdersQueue is mounted, not across reloads or navigation away; no dispatch/backend persistence is implemented. Wallet returns still stay in the returned queue with a completed credit summary. This supersedes the earlier replacement-success-only behavior below.


The Returned/ Replacement queue's primary action is now **View Details**, using the existing FileText icon. `ReturnedOrderModal.tsx` contains a native, labeled radio group ordered **Replacement** (default) first, then **Return**. Closing an unresolved detail popup resets its selection and validation display to Replacement for the next opening; completed wallet returns retain their recorded resolution. Radio cards reuse 12px corners,16px padding, the soft orange selected surface `#FEF3E2`, orange border/accent `#F7931E`,14px labels and12px descriptions; they stack below640px and sit side by side above it. The popup keeps the existing900px modal width,24/32px padding,85vh scroll limit, order item rows and customer/delivery details.

- **Return:** displays Add Money to User Wallet, the existing item subtotal minus ₹50 return-shipping calculation (clamped to zero), and a confirmation dialog. Zero amounts disable the action. `ProcessRefundModal.tsx` now confirms a wallet credit and shows Money Added to Wallet; it no longer describes a credit to the original payment method or a3–5 day delay.
- **Replacement:** shows order number, amount, payment method, items/pack sizes/quantities, customer and delivery address, Self Delivery, and driver-name/phone assignment fields. Fields follow the shipping design:56px gray surfaces,12px radius, amber focus, fixed+91 prefix, ASCII digits only/max10. Assign Replacement validates nonblank trimmed name and exactly10 digits, focuses the first invalid field, and shows red inline errors associated by aria-describedby/aria-invalid.
- `returnResolution.ts` defines a typed wallet/assignment result. `OrderCard` holds the result locally, so completed details remain available through View Details. Wallet-return radio choices lock after credit and the action is replaced with a green result summary, preventing another credit in the same mounted card. Replacement assignment now transitions to the delivery queue as described above. Replacement results retain driver name and +91 phone. Support-ticket resolution routes back to the Return/Replacement choices rather than bypassing them to an original-payment refund.

**Implementation limit:** wallet credit and replacement assignment are prototype state transitions. No wallet ledger API, balance mutation, payment transfer, durable replacement order, driver dispatch API or persistence across reload/unmount is implemented. The success UI is a local preview, not evidence that a real wallet was credited or a delivery was dispatched. This update supersedes the original returned-order, refund-modal, and flow snapshots later in this document.


### Shipping method form update

**Exit behavior:** Warehouse order packing and invoice dialogs close directly through their close control, backdrop or Escape. The Exit and Save to Drafts confirmation and its dedicated component have been removed from this flow.

**Shipped confirmation update:** The delivery-partner card displays Self Delivery with labeled Driver Name and Phone Number from the submitted form; the shipped timeline also uses these details instead of a fixture AWB/courier. The final fulfillment step is Delivered (pending until confirmed). The primary CTA is Mark as Delivered; activation stores a local completion timestamp, completes the green timeline step, announces the Delivered badge, and disables the action with the label Delivered. The timestamp is displayed in Asia/Kolkata time. Driver details remain visible. This replaces the previous View Delivery Details CTA. Self delivery shows no carrier tracking ID, external tracking link, fabricated hub events or estimated delivery claim. The existing rounded gray panel, warehouse typography, muted labels,16px Lucide icons and amber actions are reused. New type source: `src/components/orders/modals/shipmentDetails.ts`.

**Existing update:** `src/components/orders/modals/ShipOrderModal.tsx` offers only **Self Delivery** (default) and **Ship Rocket**. The courier control now uses the shared `SelectDropdown` with `appearance="field"`: a full-width 56px gray trigger and a white, rounded, shadowed menu. Ship Rocket remains visible as a muted, aria-disabled option with an “Unavailable” badge and cannot be selected by pointer, keyboard, or typeahead. Self Delivery displays controlled Delivery Person Name and Delivery Person Phone Number inputs instead of the tracking number, barcode action and scan hint. The phone control uses a fixed, non-editable +91 prefix, `type="tel"`, `inputMode="numeric"`, a 10-character limit and `[0-9]{10}` pattern. On change, non-ASCII digits are removed and the local value is capped at 10 digits; the prefix is associated through aria-describedby. Its 56px filled wrapper uses the existing amber focus-within ring. Labels bind to input IDs. Fields reuse the existing 56px height, 12px radius, `#F5F5F7` surface, 16px horizontal padding, 14px semibold Figtree, dark warehouse ink and amber focus ring. The SMS toggle reads “Send SMS delivery confirmation” for Self Delivery. Ship Rocket retains tracking/barcode controls and the SMS tracking-link label. Self Delivery submission now requires a nonblank trimmed driver name and exactly 10 phone digits. Clicking Ship Package with missing/invalid details blocks the shipping callback, focuses the first invalid field, and displays per-field red `#DC2626` rings and inline messages (`role="alert"`, `aria-invalid`, `aria-describedby`). Errors are shown only after attempting submission and clear as values become valid. Values are retained in local modal state when switching methods; validated submission emits a typed `ShipmentDetails` value to OrderFulfillmentModal. That flow retains the selected method, trimmed driver name and +91-prefixed phone, then passes the same value to ShippedOrderModal. The separate Delivery Details/Call Driver popup has been removed from the fulfillment flow; its legacy TrackShipmentModal component is no longer mounted. Backend persistence is not implemented. This specification supersedes the historical ShipOrderModal snapshot below.


All 88 component files have file-specific recipes in Appendix 18; page-local components are also captured. Specifications in this section explain how the recipes compose. Every component inherits Figtree unless a caller supplies a different style; no component adds another font. Use props rather than copying JSX when a suitable shared component exists.

### 7.1 Shared action primitives

**Button — `src/components/ui/Button.tsx`**

Purpose: full-width auth action. Anatomy: inline-flex centered content, gap8px, optional leading Loader2. Default variant primary; only `primary` and `secondary` are implemented.

- Base: full width, pill radius, vertical padding18px, text16/24px, weight700; no explicit horizontal padding or fixed height. Nominal default height60px (24 + 36), secondary adds its two 1px borders.
- Primary: `#F9A51A`, white; hover `#e6960f`.
- Secondary: white, `#1A1C1D`, 1px `#E4E4E7`; hover `#F3F3F5`.
- Transition: colors200ms; inherited Tailwind easing. No custom focus-visible, pressed, error or success variant.
- Disabled: cursor not-allowed and opacity .6. `loading` also disables and inserts18px spinning Loader2, stroke2.5. Caller controls label; no built-in `aria-busy`.
- Responsive: fluid full width; no breakpoint classes or size API. `className` extends string; no class-merging utility resolves conflicting overrides.

**ButtonLink — `ui/ButtonLink.tsx`** uses Next Link with shared button base/variant recipes, centered text. It has no loading or native disabled prop. Disabled utility classes in its shared string do not create disabled anchor behavior. No size variants.

**Flow helper actions — `orders/modals/modalHelpers.ts`**

- `PRIMARY_BUTTON`: radius12px, orange `#F7931E`, white16px/600, px32 py14px; nominal52px tall; orange shadow above; hover `#e6850f`; transition-colors150ms default. No built-in disabled/loading/focus treatment.
- `SECONDARY_BUTTON`: radius12px, gray `#64748B`,16px/600, px24 py12px; nominal48px tall; no border/background in base; hover `#F5F5F7`.
- Page-local admin CTA: usually pill, orange,14px/600, px20 py10px (nominal40px); hover opacity.90. Table actions use12px, px16–20, py6px (nominal28px plus border where present).
- Warehouse OrderCard CTA: radius12px;14px/700; py16px primary (nominal52px), secondary py12px with1px `#BDCAB8` (nominal46px); icons20/16px. Disabled opacity.6.

There are no shared tertiary/outline/ghost/destructive/icon/FAB variants. Outline, text, destructive and icon actions are **local recipes**, not variants accepted by Button. See CancelOrderModal/ConfirmModal for destructive intent; confirmation CTAs often remain orange.

```tsx
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";

<Button type="submit" loading={saving}>{saving ? "Saving..." : "Save"}</Button>
<ButtonLink href="/login" variant="secondary">Continue to login</ButtonLink>
```

These snippets use actual APIs. `saving` is caller state, not a project-global variable.

### 7.2 Fields and selection

### Shared SelectDropdown — inventory stock status

**Existing, added 27 October 2026.** Source: [SelectDropdown.tsx](src/components/ui/SelectDropdown.tsx). Integration: [InventoryBoard.tsx](src/components/inventory/InventoryBoard.tsx). Use this design-system component for short, single-value lists needing a custom menu; the existing super-admin `FilterDropdown` remains a separate component.

| Property | Implemented specification |
|---|---|
| API | Generic string `value`, readonly `SelectOption<T>[]`, `onChange(value)`, accessible `label`, optional `disabled`, `id`, and `appearance="filter" ∣ "field"` |
| Option shape | `{ value, label, tone?: "neutral" ∣ "success" ∣ "warning" ∣ "danger", disabled?: boolean }`; no search/multi-select API |
| Typography | Inherited Figtree; 14px/20px; trigger/selected option 600, other options 500; ink `#171D15` |
| Trigger | Minimum 44px high; padding 16px horizontal / 10px vertical; 12px radius; 1px `#BDCAB8` at30% border; white by default; 12px content/chevron gap |
| Status treatment | Neutral dot `#86868B`/white trigger; success `#3BB54A`/`#EBF7EC`; warning `#F7931E`/`#FEF3E2`; danger `#DC2626`/`#FEE2E2`; labels keep dark ink |
| Icons | Decorative 8px circular status marker; Lucide ChevronDown16px/stroke2 and selected Check16px/stroke2.5 in `#F7931E` |
| Open state | Amber `#F9A51A` trigger border, chevron rotates180°; menu8px below, right-aligned, z20 |
| Menu | White,16px radius,1px subtle green-gray border,6px padding; minimum200px wide; max-height280px with vertical scrolling/overscroll containment; max-width viewport minus48px |
| Elevation | Existing dropdown recipe `0 16px 40px rgba(0,0,0,.12)` |
| Option rows | Minimum44px high,12px radius,12px horizontal /10px vertical padding; status dot/text gap10px; trailing check for selected option |
| Selected | Soft orange `#FEF3E2`,600 weight, orange check; state also exposed via `aria-selected` |
| Hover / navigation | Active unselected row `#F5F5F7`; active row has1px inset amber40% ring; pointer movement updates active option |
| Focus | Trigger2px amber focus-visible ring with2px offset; open listbox receives focus and exposes active option through `aria-activedescendant`; active-row ring indicates position |
| Disabled / empty | Native disabled trigger,50% opacity, not-allowed cursor; empty/all-disabled options disable opening. Disabled options have muted `#86868B` text, a not-allowed cursor and an Unavailable badge; pointer selection is guarded and keyboard/typeahead skips them |
| Motion | Colors150ms; chevron transform150ms, disabled for reduced-motion preference; menu opens/closes instantly to keep repeated selection quick |
| Responsive | Full-width trigger below640px; auto width/min190px from640px; menu remains right-aligned and width-constrained; no portal or viewport-flipping behavior |
| Not implemented | Loading/error/success-submission states, async options, multi-select, searchable list; status-success tone is data classification, not submission feedback |

**Field appearance:** use `appearance="field"` inside forms. Full-width at all breakpoints, minimum56px trigger height with `#F5F5F7` fill; no status dots. Other geometry, selection, focus and menu recipes remain shared. Optional `id` connects an external label to the trigger. Inventory keeps the default filter appearance.

**Keyboard contract:** Enter/Space opens through the native button; Up/Down also opens at the current selection. Home/End opens at first/last option. In the list, arrows wrap through enabled options, Home/End jump to enabled endpoints, typing matches option-label prefixes (500ms sequence window; repeated letters cycle), Enter/Space commits, Escape dismisses/restores trigger focus, and Tab dismisses while preserving ordinary forward/backward traversal. Pointer selection commits and restores focus. Outside pointer interaction or leaving the component closes the popup. Active options scroll into view. The control has an accessible name, listbox/option roles, expanded/control relationships and selected-state semantics. These behaviors are implemented in source; live keyboard/assistive-technology testing was unavailable in this session.

```tsx
import { SelectDropdown, type SelectOption } from "@/components/ui/SelectDropdown";

type Status = "all" | "out" | "low" | "in";
const options: readonly SelectOption<Status>[] = [
  { value: "all", label: "All Statuses", tone: "neutral" },
  { value: "out", label: "Out of Stock", tone: "danger" },
  { value: "low", label: "Low Stock", tone: "warning" },
  { value: "in", label: "In Stock", tone: "success" },
];
// status and setStatus are caller-owned React state.
<SelectDropdown label="Stock status" value={status} onChange={setStatus} options={options} />
```

Inventory reuses `STATUS_LABELS` and the existing `statusFilter` state, preserving search, filtering and query-driven initial status/SKU behavior. Menu styling reuses the established palette, rounded geometry and dropdown shadow rather than relying on the operating system's native popup appearance. If adding this component inside a clipping container or near the bottom of a viewport, review placement; automatic collision avoidance is not implemented.


**TextField — `ui/TextField.tsx`** accepts label, Lucide icon, optional id, native input props, and type. Outer column gap8px; label14px/600 `#3D4949`, linked through htmlFor/useId. Field wrapper is a pill `#F3F3F5`, px24 py18px, gap18px; icon18px stroke2 in `#6D7A7A`. Input fills available width/min-width0, transparent,16px `#1A1C1D`, no outline, placeholder `#6D7A7A/50`. Focus-within adds2px amber40% ring. Password toggles Eye/EyeOff18px and accessible text but uses `tabIndex={-1}`. There is no error/helper prop, error-border variant, loading indicator, or disabled wrapper treatment. Browser attributes pass to input; disabled input behavior is native. No breakpoint classes.

**Admin fields** are local or generated by FormModal:14px, px16 py12 or10px, radius12px; filled `#F5F5F7` or white border `#E5E7EB`; placeholder `#9CA3AF`. FormModal uses2px orange focus ring. User/hub and offer outlined inputs usually change border to orange on focus. Many warehouse modal inputs suppress outline with no replacement. Textareas often use resize-none; rows and fixed heights vary (see ledger).

**FilterDropdown — `super-admin/ui/FilterDropdown.tsx`** is controlled by value/options/onChange, optional highlight/icon. Trigger pill py8 pl20 pr16, gap8,14px/600; normal `#374151`, hover black; highlighted orange/white. Chevron16px stroke2. Menu absolute left0/top-full, mt8, z20, min180px/max-height280px, white16px radius, p6px, dropdown shadow. Options full-width, radius12px, px12 py8,14px, hover `#F9FAFB`; selected black600 and14px orange Check stroke2.5. Trigger toggles; option calls onChange and closes; outside mousedown closes. No Escape, roving arrows, listbox/menu roles, aria-expanded or active-descendant implementation. No entry/exit motion; no responsive classes.

**DateField — `super-admin/content/DateField.tsx`** controlled Date value. Label14px/600; trigger full width, outlined12px radius, px16 py10px,14px; focus orange border; calendar16px. Popover absolute left, z20,300px wide, p16px/radius16px and calendar shadow; Monday-first seven-column grid, ≥35 date cells. Day targets28px circles; selected orange/white700; out-of-month `#D1D5DB`; month arrows24px. Opening resets displayed month; date click immediately calls onChange; Apply only closes. Outside click closes. No date-range validation or responsive repositioning/focus model.

**Local toggles**: visibility buttons usually44×24px track,20px white thumb, orange checked/gray unchecked; translate22px versus2px. ShipOrder notification toggles are44×24px with2px padding and local knob transition. They are buttons with local booleans, not a shared Switch; ARIA checked/switch semantics are not consistently supplied.

**Selection/check controls**: picker/offer/template choices combine native buttons with drawn check marks or styled boxes. Native checkbox occurs in returned-ticket resolution. There is no shared Checkbox, Radio, Slider, OTP, or multi-select component API. Native `<select>` and `<input type="date">` coexist with custom pickers; do not treat their menus as app-styled dropdowns.

### 7.3 Modal foundation and workflows

**ModalShell — `orders/modals/ModalShell.tsx`** accepts open/onClose/children, optional `maxWidth` class string (default `max-w-[500px]`). Fixed inset0 z50 flex-centered backdrop black40%, blur8px, px16/py32, overflow-y-auto. Card relative/full width/radius24px/white/main-modal shadow. It handles Escape, backdrop click, stopPropagation and body overflow lock/restoration. Close button at top/right20px,36px circle, `#F5F5F7`, hover `#e9e9ec`, icon14px stroke2.5. No built-in body padding, header, footer, focus trap, focus return, dialog role, accessible title association, portal, responsive width switch, loading or validation UI. Callers own all of those. Animation: backdrop180ms; card200ms opacity/y12→0/scale.97→1, cubic `[.22,1,.36,1]`; inverse exit.

```tsx
import { ModalShell } from "@/components/orders/modals/ModalShell";
<ModalShell open={open} onClose={close} maxWidth="max-w-[680px]">
  <div className="p-7 sm:p-8">{children}</div>
</ModalShell>
```

`open`, `close`, `children` are caller values. The example accurately composes existing primitives; it does not add absent dialog accessibility.

#### Warehouse order modal catalog

Paths below are under `src/components/orders/modals/`. Widths are max-width, not fixed widths; typography/colors inherit the flow recipes except where listed.

| Component | Anatomy, size, interactions and variants |
|---|---|
| OrderFulfillmentModal | State coordinator with pack/invoice/ship/shipped/track steps; save-exit and print-confirm dialogs; no own visual shell |
| PackOrderModal | 820px; p28→sm40;85vh body; title24px/700 with -.7px tracking; two columns at sm/gap32; item, delivery/contact tiles; print and pack actions |
| InvoiceModal | 580px; p28→sm36;85vh body;24px amber title; delivery/items/totals; print area and no-print actions; print callback indicates invocation, not actual printing |
| InvoicePrintedModal | 420px; centered p32/gap16;64px orange-soft disc; spring check; back/continue choices |
| ShipOrderModal | 860px; p28→sm36;85vh;24px title; sm two-column forms/gap32;56px filled courier/tracking controls; generator icon action; SMS/email toggles; ship action |
| ShippedOrderModal | 900px; p28→sm36;85vh;24px heading; customer/shipment blocks and completed/pending timeline; track action |
| TrackShipmentModal | 960px; p32→sm48;85vh;28px title; sm2 columns/gap40; tracking copy with1500ms label reset; timeline statuses; contact links/actions |
| CancelOrderModal | Standalone420px; radius20/p32; centered;64px red-soft icon disc; cancel/confirm; parent marks local order cancelled |
| DeliveredOrderModal | 900px; p24→sm28;92vh;20px heading; sm2 columns; customer/payment/timeline; invoice callback |
| ReturnedFlowModal | Coordinator: detail/refund/ticket; caller can start at ticket; no own style |
| ReturnedOrderModal | 900px; p24→sm28;92vh;20px heading; sm2 columns; return items/reason/timeline; support/refund |
| ProcessRefundModal | Standalone460px; radius20/p32;56px warning → green success disc; local confirmation then callback |
| SupportTicketModal | 780px; p24→sm28;92vh; sm2 columns; customer context, reason, reply, attachment chips,232px emoji grid, resolve checkbox, send-disabled-until-text, refund action |

Standalone confirmations repeat motion/backdrop patterns rather than using ModalShell; inspect their own useEffect cleanup and body-lock behavior before changing nesting. No network refund/shipping/support mutation is implemented by these components.

#### Inventory modals

| Component (`src/components/inventory`) | Specification |
|---|---|
| CreateBatchModal | ModalShell900;92vh;p24→sm32;sm2 columns/gap32; farm/contact, aging, photo and quality/rack fields; PNG/JPEG preview; farm/rack nonblank guard silently returns; adds batch locally then closes |
| BatchDossierModal | Same900px layout; view/edit mode, age/warehouse/farm/quality/rack fields, photo selection; save callback updates parent; no async state |
| UpdateStockModal | 680px;p28→sm32;sm2 columns/gap24; product native select; Add/Remove split control; quantity and8-row notes; remove requires notes, quantity must be>0; disabled .5 CTA; success replaces form; parent clamps stock at0 |

#### Super-admin modal families

All use ModalShell unless specified. Sources are within the named `src/components/super-admin/` folder. Exact fields, classes, selection styling and callbacks are retained per file in Appendix 18.

| Family/component | Widths and implemented states |
|---|---|
| masterdata/FormModal | 420px; p24 form; text/textarea descriptors, required badge/helper; form → draft → draftSuccess or success; p32 centered success; required marker does not enforce validation; callback only on regular submit |
| masterdata/ConfirmModal | 440px;p32;64px configurable icon disc; title20/700; body14 relaxed; optional note tile; equal-width outline/orange pill actions |
| masterdata/RelocationConfirmModal | 440px;p32; product/grid relocation summary, cancel/confirm |
| masterdata/StockStatusModal | 560px; two variant stock choices, pricing/discount type and date fields; Coupon/Percentage branch; local form values; save does not persist a backend record |
| masterdata/HealthBenefitsPickerModal | 620px; searchable stacked multi-choice list; max360px; current IDs initialize local selection; apply callback |
| masterdata/NutrientsPickerModal | 620px; searchable two-column list, max360px; clear/cancel/apply |
| masterdata/TestimonialsPickerModal | 940px; search; All Ratings/Recent controls; 1→sm2 cards/max420px; multi-select and apply |
| offers/LaunchOfferModal | Form560, products680, customers720, success420px; Percentage/Coupon and target variants; local validations and selection subviews; success does not insert an offer into parent list |
| offers/EditOfferModal | 480px; name/subtitle/discount/note/status; pair grid; onSave updates parent fixture state |
| orders/FiltersModal | 700px; category sidebar, content area min280px; Product/Status/Payment/Date selection, month grid/range; draft/reset/apply; selection state local until apply |
| orders/OrderDetailModal | Ship760px/p32, others900px/p28;90vh;1→sm2 grid; status-specific order detail compositions; includes local placeholder actions, not warehouse fulfillment coordinator |
| products/EditProductModal | 520px; name/description/price/in-stock; local fields + onSave; currently unused |
| users/CreateHubModal | Form460, success420px; name/zone/admin/address; guard nonblank name/address; local create/edit callback; success resets on reopen |
| users/CreateAdminModal | Form520, success420px; shield identity illustration; name/email/hub; nonblank guard; type=email alone does not validate a button-driven submit |
| users/HubDetailModal | 520px; hub identity/status, two-column metrics, admins, select-admin callback |
| users/AdminDetailModal | Detail520; reassign form440; confirm420; suspend400px; details → reassign form/confirmation or suspend confirmation; parent callbacks |
| users/CustomerDetailModal | 820px;p32;88vh; three stats; sm `.8fr 1.2fr` details/history; account/contact/address sections |
| tickets/TicketReplyModal | 780px;92vh;p24→sm28;1→sm2; text/attachments/emoji/template selection, sent state; disabled empty reply; footer stacks→sm row |
| tickets/SelectTemplateModal | 820px; search, category rail, 1→sm2 template cards/max360px; selection then apply to reply |
| content/SaveDraftModal | 440px;p32; animated orange folder/check; keep editing/save as draft callbacks |
| content/BannerScheduledModal | 440px; schedule success, check disc and banner preview/date, Done callback |

### 7.4 Navigation, dashboards and content

| Component | Purpose, anatomy, exact recipe and behavior |
|---|---|
| AuthLayout | Two-pane shell described in section6; includes actual logo and decorative cover/quote; security claim/link is copy, not verified encryption implementation |
| DashboardNavbar / SuperAdminNavbar | Logo + centered desktop links + bell/avatar + mobile toggle; sticky and scroll styling; details section8 |
| HeroBanner | Decorative cover + title/subtitle + optional KPI children; dimensions section6; no own interactive state |
| NotificationsPanel | Warehouse anchored popover300px→sm340px/max88vw, radius16/p20/mt12,65vh list; unread/read fixture items, notification destinations and ticket dialog; no async fetch |
| SuperAdminNotificationsPanel | Backdrop + fixed right drawer inset24px,400px/max88vw,radius24,p24; All/category filters, mark-all-read; title26px/800; movement section11 |
| ProfileModal | Standalone500px,radius18,white/soft shadow; profile identity/header, two-column details with gap24×20 and px32; logout callback opens confirmation; demo profile shared between roles |
| LogoutConfirmModal | Standalone420px,radius20,p32/gap24; danger disc, heading20px/700, two actions; confirmation routes to login |
| AnimatedTitle / Heading / Subtitle | Motion text wrappers; accept caller classes; Heading configurable element defaults h3; Title h1; Subtitle p; timing section11 |
| AnimatedCounter | Numeric span; value/duration/decimals/prefix/suffix/className;900ms cubic ease-out; restart from0 when value/duration changes |
| CompanyGrowthCard | Radius32,2px black4% border,p20→sm24,flex1.15; title20/600; native7d/30d/90d selector changes fixture series;400×200 SVG coordinate space; amber orders/green delivery and legends; no point tooltip |
| InventoryAlertsCard | Same radius32/border/padding,flex1; title and View All; stock rows link to inventory details/status/SKU; no dismiss action |
| FulfillmentOverviewCard | Same panel recipe,flex1; decorative SVG curve and animated rice grain, KPI counter; no interactive chart tooltip |
| ActivityTicketTable | Orders Pipeline heading24/600; semantic table, ticket rows and reply triggers; TicketReplyModal opens; horizontal handling recorded in ledger |
| dashboard/TicketReplyModal | 560px; simple ticket info + reply textarea; sent success branch; distinct from richer admin and returned-order reply components |
| OrderCard / OrdersQueue | Accordion and five-queue composition detailed in sections2/6/8; statuses, customer items, local action flows; no animated body height |
| InventoryBoard / StockDetailsGrid | Allocations/details controls and responsive table/product-card grid; product card p20/radius16/border, product art220px high, status10px, quantity24px,6px progress track, full-width12px-radius CTA; empty result replaces grid |
| ReportCard / ReportsGrid | Card radius24,p28,gap20,soft shadow;48px orange icon square radius12/icon24;20px600 title;14/22 body; green14px600 download link with16px icon;1/2/3 columns,24px gap; downloads generated quoted CSV Blob |
| TopSellingProductsCard | 380px panel,radius32,2px black4% border,p20→sm24; product rows and link to all products; decorative image asset; clipped/scrolling content per ledger |
| ActiveSupportTicketsCard | Same380px panel; ticket list with reply action; reuses dashboard's simple TicketReplyModal, not admin rich composer |
| ActiveOffersCard | Same380px panel,flex.9; offers list/status and View All link |
| CustomerReviewsCard | Same380px panel,flex1.75; nested gray review rows, p16/radius16,gap12; rows stack→sm horizontal; overview links to reviews |
| PageHeader | Back Link32px target/icon24; title28/700; subtitle14px/gray;margin4; flex gap16, inner gap12; optional right slot shrink0; default back `/super-admin`; no explicit responsive wrapping |
| Pagination | Summary14px gray;32px circular buttons,8px gaps,14px600 numbers; orange active; gray-border inactive/hover; native disabled arrows opacity.4; no aria-current; no mobile-specific stacking |
| ErrorState | Available unused; centered px24/py96/gap20;64px white danger icon disc/shadow;20px title,14px relaxed max360 description; optional orange Retry |
| ProductRowMenu | More-actions trigger; anchored menu with stock/edit/delete callbacks; outside click closes; no full menu keyboard model |
| StarRating | Default size14px, five stars/gap2; gray base and clipped orange overlay with fractional fill; stroke0; no built-in accessible rating text |
| ComingSoonCard | max380px,mx24,p32,radius32,border2 black4%,shadow;64px orange-soft Rocket disc/icon28;20px700 title;14px relaxed explanation |
| DummyRevenueDashboard | Static financial background with three KPI cards and transactions; deliberately blurred, pointer-disabled and aria-hidden by route wrapper |

There are no shared Tooltip, Toast, Skeleton, Breadcrumb, Accordion, Avatar or Progress APIs. Existing accordions, initials avatars, progress bars, empty states and success dialogs are inline compositions. Do not invent exports for them.

### 7.5 Interactive state matrix

**I** = explicitly implemented; **N** = no explicit custom implementation; **B** = native/browser behavior only (not an authored state); **—** = not applicable. “Active” means selected/toggled when stated; it does not imply `:active` press feedback. N states are candidates for improvement, not existing features.

| Component/family | Default | Hover | Focus | Active/selected | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Button | I | I | B | N pressed | I | I | N |
| ButtonLink | I | I | B | N | N behavior | N | — |
| Flow helper / admin local CTA | I | I | B | N pressed | Per caller only | N | — |
| TextField | I | N wrapper | I ring | I password visibility | B input | — | N field; caller text |
| Auth forms | I | Links/actions I | TextField I | Success branches | Pending buttons I | I simulated | Login/mismatch I |
| FormModal fields | I | N | I ring | I values | N | N | N enforcement |
| Offer form fields | I | N | I border | I type/target | N general | N | I red field borders |
| Warehouse modal fields | I | N | Often N | I values | Per control | N | Guards, usually no message |
| FilterDropdown | I | I options | B | I selected check/highlight | N | N | N |
| DateField | I | I days/arrows | I trigger border | I date/month | N | N | N |
| Native selects/date inputs | I | Generally N custom | Varies by class | B native + I values | Per caller | — | Varies by form |
| Visibility / notification switches | I | Varies | B | I boolean + thumb | Generally N | N | N |
| Picker/template choice buttons | I | I where class set | B | I selection | Per apply control | N | N |
| Queue/inventory/admin tabs | I | I inactive | B | I selected fill | N | N | — |
| Navbar links/mobile trigger | I | I | B | I route/menu | N | N | — |
| Pagination | I | I inactive (queue arrows opacity only) | B | I current visual | I arrows | N | — |
| Order accordions | I | Mostly no row hover | B | I expand/chevron | Action-level I | N | Stock warning text I |
| ModalShell | I open | I close button | N management | I open/closed | — | N | Caller-owned |
| Standalone confirmations | I | I actions | N management | I local success where defined | Per action | N | N network state |
| Ticket composers | I | I tools/actions | Field-specific | I sent/resolved/selection | I blank reply | N | N delivery error |
| CreateHub/CreateAdmin | I | I actions | I field | I success | N pending | N | I nonblank text guard |
| Stock update | I | I actions | Often N fields | I add/remove/success | I invalid CTA | N | No error message |
| Notification panels | I | I rows/actions | Limited/browser | I read/filter | Per item | N | N |
| Report download | I | I green text | B | N | N | N | N |
| StarRating/SVG charts/progress | I | N chart tooltip | — | — | — | Counter only | — |
| Upload regions | I | I in several editors | Often N div trigger | I preview/drag-over where coded | N | N | Generally N |

Exact control-level pseudo-classes and `disabled`, `aria-*`, `tabIndex`, `type` attributes are retained in Appendix 18, preventing a family-level “I” from implying every control supports that state.

## 8. Navigation Patterns

**Order queue pagination update:** `OrdersQueue.tsx` now uses a 10-order page size across all five warehouse queues: To Be Packed, Ship, To be delivered, Delivered, and Returned/ Replacement. The warehouse Exception feature, fixtures, card actions and exception-only resolution/extension/cancellation-refund dialogs have been removed. The added To be delivered queue uses pending-delivery demo fixtures derived from the shipping seed records; it is not a live backend state transition. Its View Details action opens the shipped summary with Mark as Delivered, with no exception-resolution flow. The local demo fixtures are expanded deterministically from the existing seed orders to match each advertised total (84 or284), with unique order IDs within a queue; they are not live backend records. The footer shows the actual visible range and total. Pagination shows the first/last page and current page ±1 with ellipses, rather than rendering every page button; the current page has aria-current. Returned presentation reads “Returned/ Replacement,” while its internal Returned key/deep links remain stable.

Warehouse desktop navigation: Dashboard `/warehouse`, Orders `/orders`, Inventory `/inventory`, Reports `/reports`. Uses `pathname.startsWith(href)`, so `/dashboard` does not visually select Dashboard. Super-admin primary navigation: Dashboard, Master Data, User Management, Revenue Management, Site Content. Dashboard matches exact `/super-admin`; other items match exact or descendant paths. Products/tickets/offers/reviews are accessible from dashboard cards rather than top-level navbar items.

Both navbars: logo40px high → sm48px, default layout gap36px links,18px normal black/selected500 amber. Super-admin additionally shows1.5px gradient underline amber→transparent. Right cluster gap13px; bell target40px/icon24 stroke1.5; unread badge16px high/min16px with2px white border and9px bold text, capped99+. Profile54.74px circle with2px `#F5A623` border, amber fill and18px600 initials.

Desktop links appear at md768px, mobile toggle below md. Mobile toggle44px circle, gray fill/hover; opens220px absolute panel below header, right24→sm40, mt8,p20,radius16,border `#F1F5F9`; gap16 links. Opening/closing animates opacity/y/scale180ms; choosing link closes. Expanded ARIA state and menu keyboard patterns are not implemented. Header after `scrollY > 8` switches from transparent/no-shadow to white90%,12px backdrop blur and navbar shadow over300ms `transition-all`.

Tabs: warehouse tabs separate12px-radius buttons, selected amber/white and double shadow; inactive Orders green, Inventory amber. Admin tabs use white pill-group p6/gap4 with orange selected pill and gray inactive. These are ordinary buttons, not ARIA tablists, and use local state. No shared breadcrumbs or stepper; back links and wizard tabs convey location.

Deep links: `/orders?tab=Delivered`; `/inventory?view=details&status=out|low|in&sku=…`; master-product `?tab=Drafts` and `new?edit=sku`; site-content `?tab=Blogs|Banners|Drafts`. State is generally not continuously synchronized to URL; content reads and removes its query. See `users/page.tsx` ledger/source for its hub/customer context links. Pagination is local and does not provide URL history.

## 9. Forms & Validation

Authentication forms use semantic `<form onSubmit>`, linked labels, required/native field validation and autocomplete. SetNewPassword and Signup check matching passwords but define no minimum length or password-strength rule. Login simulates700ms; forgot/reset/signup use local timeouts (exact per-file initializers/handlers are source truth). Forgot success masks local email; set-new-password marks role-specific localStorage flag and returns to login. These are demo workflows; a success screen is not proof of a server operation. Signup and forgot use disabled plus changing label, not Button's loading spinner prop.

FormModal descriptors support `text`/`textarea`, label, placeholder, optional required marker. `required` is rendered as copy but not forwarded to the control; `handleSubmit` calls onSubmit without validating. Its “Draft” success is local step state and does not add a durable draft. Do not describe required badges or success copy as backend enforcement.

LaunchOffer validates nonblank percentage/max-discount or coupon and both dates, sets per-field red borders, and shows local success. It does not validate date ordering/range or enforce a production discount policy. Product wizard requires a name before advancing Basic Details and offer title/start/end when adding an offer; an inline red-soft error block appears. CreateAdmin checks nonblank name/email/hub, CreateHub nonblank name/address. CreateBatch silently rejects missing farm/rack. UpdateStock disables unless quantity>0 and removal notes nonblank. Different validation models are an existing inconsistency.

Search inputs: warehouse full width/max318 at sm, py14,pl44,pr16,text16,radius-full,border `#BDCAB8/30`, focus amber; admin mostly200/220/240px, py10/12,pl44,pr16,text14,border `#E5E7EB`, focus orange. Search icons15px/16px at left19/16px. Most searches lack programmatic labels. OrdersQueue search currently stores input only. Inventory warehouse/variety selectors intentionally update viewing context rather than filter batches.

File uploads: product/editor images use hidden file inputs and object URLs; inventory uses PNG/JPEG; content/product/ticket picks use `image/*`; attachment removal/chips are local. Banner includes drag-over/drop handling; visual drag/drop wording elsewhere does not establish implemented drag handlers. No shared file-size validation, retry, upload progress, server upload contract, or cleanup standard exists. Native date fields coexist with two custom calendars. No OTP, range slider or password-strength meter exists.

**Recommended for new work:** retain the surrounding form appearance while adding associated labels, aria-invalid/describedby, field-level messages, pending and recoverable error states where real async operations are introduced. Use existing visual recipes; do not claim those semantic additions are already universal.

## 10. Icons & Assets

Lucide is the established icon family: normally outlined, currentColor, frequently explicit stroke2, sometimes1.5 in navbar/KPIs or2.5 in emphasis controls. Check success marks use up to3.5; stars use stroke0/filled paths. Without explicit override the installed Lucide defaults apply; there is no single project stroke override.

Common sizes:12px warning;14px caption/table/close;15px warehouse search;16px inline/filter;18px auth field;20px action;24px bell/report;28px confirmation;48px auth success. Containers:32/36/40/48/56/64px circles/squares, plus auth success96/144px circles. Icon-to-text spacing is usually6/8/12px; auth fields18px. Appendices retain each actual size/stroke/class. Choose the matching existing Lucide glyph, align to text baseline/center according to recipe, and keep decoration distinct from meaningful icon-only actions. **Recommended:** provide accessible names and hide redundant decorative icons from assistive technology.

| Public file | Intrinsic PNG size | Existing treatment |
|---|---|---|
| `/veda-bharat-logo.png` | 568×236 | Auth height56px, navbar40→48px, auto width; Next Image supplied layout dimensions differ from intrinsic |
| `/icon.png` | 81×81 | Metadata icon/shortcut/apple |
| `/login/right-banner.png` | 683×768 | Decorative cover of right auth half; hidden below lg |
| `/login/banner-frame.png` | 81×81 | Decorative52px emblem within79px white circle |
| `/Warehouse/dashboard-banner.png` | 5280×1360 | Hero fill/object-cover, radius24 via wrapper; batch fallback photo |
| `/Warehouse/product.png` | 224×224 | Reused fixture product in rows/cards/gallery; object-cover thumbnails or contain stock card220px height |
| `/Warehouse/ricegrain.png` | 57×69 | Decorative animated fulfillment grain; rendered Next Image props64×91 |
| `/SuperAdmin/Dashboard/image 400.png` | 460×282 | TopSellingProductsCard decorative product/background illustration |

There are no public SVG files, local font files, or external image CDN configuration. SVG charts and gradients are authored inline. Product galleries use square aspect wrappers; thumbnails6–16px radii; preview uploads use object-cover. Blog/banner gradients are fixture data or inline CSS, often with cover/overlay text. Their exact gradients are in Appendix 18. Preserve path case (`Warehouse`, `SuperAdmin`) and spaces in the asset filename.

## 11. Motion & Interaction

| Trigger / element | Initial → final / exit | Duration, easing, delay | Source |
|---|---|---|---|
| Mount AnimatedTitle words | opacity0/blur9px/y6 →1/blur0/y0 |450ms `[.22,1,.36,1]`; stagger90ms, delayChildren40ms | `ui/AnimatedTitle.tsx` |
| Mount AnimatedHeading words | opacity0/blur8px/y4 →1/blur0/y0 |750ms same cubic; stagger140ms, delayChildren80ms | `ui/AnimatedHeading.tsx` |
| Mount subtitle | opacity0→1 |500ms easeOut,150ms delay | `ui/AnimatedSubtitle.tsx` |
| Open/close shell backdrop | opacity0↔1 |180ms; no explicit easing override | `orders/modals/ModalShell.tsx` |
| Open/close shell card | opacity0/y12/scale.97 ↔ opacity1/y0/scale1 |200ms cubic `[.22,1,.36,1]` | ModalShell; repeated standalone dialogs |
| Mobile nav / warehouse notifications | opacity0/y-8/scale.98 ↔1/0/1 |180ms same cubic | Navbar / NotificationsPanel |
| Super-admin drawer | x110% ↔0; backdrop opacity |280ms cubic for drawer;180ms backdrop | SuperAdminNotificationsPanel |
| Success/draft icon group | scale0,opacity0→scale1,opacity1 | spring stiffness400/damping15; inner scale spring400/12 with150ms delay; no fixed duration | FormModal, SaveDraft, user creation, wizard, blog publish |
| Forgot-password success | outer and inner scale0/opacity0→1 | spring120/20 delay150ms; inner130/22 delay450ms | ForgotPasswordForm |
| Numeric mount/change | display0→value |900ms default; `1-(1-progress)^3`; RAF cleanup | AnimatedCounter |
| Fulfillment grain mount | opacity0,blur10,scale.8→1/blur0/1 |400ms easeOut | FulfillmentOverviewCard |
| Grain trajectory | configured x/y arrays, rotation `[-10,-2,-14,4]` |1400ms easeInOut; no infinite repeat declared | FulfillmentOverviewCard |
| CTA/color hover | local color/background or opacity change |150ms framework default; shared Button200ms | Local classes / ui/Button |
| Header scroll threshold | bg/shadow/backdrop changes |300ms transition-all | Both navbars |
| Chevron expansion | rotate0↔180deg | Warehouse order200ms; others framework default where transition-transform | OrderCard / admin order page |
| Visibility switch | fill + thumb translation |150ms framework default | Review/product visibility buttons |
| Loader | rotation full turn |1000ms linear infinite | Tailwind animate-spin |
| Review strip navigation | `scrollBy` ±260px smooth | Browser-controlled duration/easing, not specified | Product wizard preview |
| Copy tracking feedback | copied label then reset |1500ms timeout; not an animation duration | TrackShipmentModal |

No GSAP execution, page-transition manager, scroll-triggered animation system, skeleton animation, button `whileTap` press system or global reduced-motion branch exists in `src`. CSS transitions are explicit local classes; `transition-all` is used in navbars. Native select opening and smooth scroll timing are browser-controlled. Framer defaults apply where easing is omitted; do not substitute the Tailwind CSS cubic for a Framer default. **Recommended:** honor reduced motion for blur/stagger/grain/counters/spinners and use property-specific header transitions.

## 12. Responsive Guidelines

Existing breakpoint behavior derives from installed Tailwind defaults; no app overrides. Minimum-width responsive utilities apply upward.

| Region | Base (<640px) | sm ≥640px | md ≥768px | lg ≥1024px | xl ≥1280px |
|---|---|---|---|---|---|
| Main margin |24px |40px |same |64px |same |
| Navbar logo |40px high |48px |same |same |same |
| Primary nav |Mobile trigger/panel |same |Desktop links, mobile hidden |same |same |
| Auth |Full-width form, no art |px48 |same |Half form/art;px64,pt80 |px96; enlarged quote |
| Hero |280px min;32px heading;18px subtitle |300px;40/20px |same |338px;50/24px |same |
| Report/stock/admin tile grids |1 column |2 columns |same |3 columns |same |
| User KPI grid |1 |2 |same |4 |same |
| Overview widget rows |Stacked |same |same |Horizontal |same |
| Order details |Stacked |Horizontal fixed side columns |same |same |same |
| Typical modal inner layout |1 column |2 columns |same |same |same |
| Admin ticket footer |Stacked |Row/end-aligned |same |same |same |
| Tables |Horizontal scrolling at min width |same strategy |same |same |same |
| Blog/product editors |1 column |Local paired fields/grids |same |Asymmetric columns |same |
| Notification popup |300px/max88vw |340px/max88vw |same |same |same |
| Modal card |w-full minus backdrop padding, capped by maxWidth |same |same |same |same |

No responsive switch is implemented for fixed coupon columns, PageHeader's right slot, many filter capsules, fixed calendar width, fixed three-column banner preview categories, or some modal inner grids (nutrient picker stays2 columns). Their existence must not be interpreted as verified mobile usability. At640px warehouse order's280px+294px nonshrinking side columns plus padding/gaps already exceed available width before middle content; overflow is a source-supported risk. Super-admin nav becomes visible at768px despite five long labels plus logo/actions and36px gaps. Root overflow-x-hidden can mask clipping. Touch targets include24px calendar arrows,28px days/table actions,32px pagination/back links,36px close buttons,40px bell and44px menu/switch width; no universal44px target rule is implemented.

**Recommended verification viewports:**360,640,768,1024,1280,1440px, plus text zoom and320 CSS-pixel reflow. These are a future test plan, not a claim that those viewports were visually inspected.

## 13. Accessibility Guidelines

Reference for recommendations: [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) and [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). This is a source review with limited mathematical contrast checks, **not WCAG conformance certification**.

### Verified source implementations

Root declares English; auth TextField connects labels and IDs and supplies autocomplete via callers; most actions use button/Link; many icon-only controls have aria-label; native disabled is used in pending/invalid actions; ModalShell supports Escape/backdrop dismissal and scroll locking; many data displays are semantic tables; several meaningful images have alt while decorative images use empty alt; warehouse notification rows implement Enter/Space keyboard activation alongside role=button and tabIndex=0; revenue dummy background is aria-hidden and pointer-disabled. Recommendations do not erase these working details.

### Identified issues

| Evidence | Impact | Recommended improvement |
|---|---|---|
| ModalShell and repeated standalone overlays lack dialog role/title association, focus trap/restoration/inert background | Keyboard/assistive-tech context can remain behind overlay | Accessible dialog contract; initial focus, trap, return focus and background isolation |
| TextField password button `tabIndex={-1}` | Password visibility unavailable through ordinary Tab navigation | Keep action in keyboard order with visible focus |
| FormModal labels lack htmlFor/ID and required is copy only | Labels not programmatic; required contract misleading | Bind IDs; forward required or validate explicitly |
| FilterDropdown lacks expanded/control/selection roles and keyboard selection model | Popup state not announced; no arrow/Escape behavior | Appropriate listbox/menu pattern with selection and focus |
| DateField uses unbound label and unlabeled icon arrows; no calendar keyboard grid | Calendar operation/state unclear | Named controls, date labels, keyboard navigation and selected semantics |
| Visibility switches have no checked state semantics; accordions no aria-expanded/controls | State not exposed | role=switch/aria-checked or aria-pressed; expansion relationship |
| Searches often placeholder-only; upload div triggers lack keyboard activation | Controls hard to identify or activate | Real label/button; keyboard equivalent for drop/click |
| Login/mismatch/success feedback has no consistent live region | Async or validation result may not be announced | role=alert or polite live status with deliberate focus |
| Multiple outline-none fields have no focus replacement | Keyboard location invisible | Reuse focus-within/ring recipe consistently |
| No reduced-motion branch | Decorative animation cannot respect preference | useReducedMotion / prefers-reduced-motion variants |
| SVG charts/StarRating/progress mostly lack text alternatives/state semantics | Information conveyed visually only | Accessible summaries, rating text, progress value semantics |
| Small/adjacent targets and constrained fixed layouts | Motor/reflow usability risks | Review WCAG2.2 target-size exceptions/spacing and reflow; test actual layout |

WCAG AA review targets include4.5:1 normal text,3:1 qualifying large text and meaningful non-text control contrast, keyboard operation, discernible names, status announcements and24×24 CSS-pixel minimum target size subject to exceptions.44×44 is a recommended usability target here, not an assertion that WCAG AA always requires44px.

### Contrast calculations

Section20 records calculation results. Solid white text on `#F7931E`, `#F9A51A` and `#22C55E` does not meet4.5:1 normal text. `#9CA3AF` on white also falls below4.5:1. This affects common14–16px action labels, muted captions and some status treatments. Gradient/image/alpha overlays require compositing and runtime verification; no unmeasured contrast pass is claimed.

## 14. Page & Screen Patterns

The route inventory in section2 is the coverage checklist. Each route's exact node/utility/conditional contract is in Appendix18; use that when recreating screen-specific variations.

**Warehouse overview template:** white page → DashboardNavbar → main padding → HeroBanner with glass KPIs → mt24/gap24 responsive row of CompanyGrowth/InventoryAlerts/Fulfillment → mt40 Orders Pipeline table. Chips: min199px, radius16,border white30%,bg white20%,p10px,blur8px,32px white icon disc; label14px500/capitalize/.5px tracking/white80%; value24px500/28px line-height.

**Warehouse list template:** gray page → navbar → hero without KPI → mt32 controls → queue cards or inventory allocation panel. Search max318px at sm; tab controls wrap. Use OrderCard for order flows; use InventoryBoard for table/product switch. Reports instead use three CSV cards.

**Super-admin table template:** gray shell/main → PageHeader → mt24 capsule filters/search → mt20 white radius32 panel/border2 black4% → overflow table with uppercase12px headers,14px rows, muted12px metadata → bordered pagination footer. This pattern is page-local, not an exported DataTable. Product, review and offer tables each have different columns and helpers.

**Super-admin card catalog:** gray shell → PageHeader/search →1/2/3-column card grid; radius16 for tag/nutrient,28 for drafts/tickets/master destinations. Empty results are local text/white panels. Do not use ErrorState automatically: it is not wired into current routes.

**Product wizard:** Basic Details form with image upload/variants and side information; Cooking & benefits with editable characteristics/nutrition/cooking and pickers; Reviews & Offers with testimonials and discount details. Tab/Next controls retain local values. Preview composes gallery/variants, characteristics/nutrition/benefits, reviews/cooking panels; success is a page-local440px centered overlay at z60. Publish/draft actions do not establish persisted products. New and edit share route; edit query uses PRODUCTS data, which is separate from master-data catalog fixtures.

**Blog workflow:** `/blogs/new` and known IDs use the dynamic editor; wide editor plus metadata side column, editable sections, reorder/delete actions, tags normalized uppercase/no spaces, author and hero selector; preview switches to white centered article max760px with36px heading and body sections. Publish yields local success; draft navigates to workspace; no rich-text editor library or autosave.

**Banner workflow:** upload/drag region, placement menu and custom start/end calendar; cover-like live preview; browser-chrome-styled storefront preview; schedule success modal displays banner/date. No file-size/date-order enforcement, backend scheduling, or responsive guarantees for preview's fixed3-column category grid.

**User management:** four KPI tiles; two-column hubs at lg, each with identity/status/address, three nested metrics, avatars/footer; customer table and modal details. Hub/admin create/edit/reassign/suspend mutate parent fixture state. Customer detail/history is local fixture presentation.

**Ticket pattern:** warehouse simple reply, returned-order support/refund composer, and super-admin template-rich composer are three separate implementations. Choose by role/workflow; same filename does not mean equivalent props or behavior.

## 15. Design Consistency Audit

No UI changes were made during this audit. Suggested standards are **Recommended**, not extracted tokens.

| Priority | Issue / source location | Existing implementation | Suggested standard |
|---|---|---|---|
| High | Action/text contrast — Button, admin CTAs, status helpers | White on bright amber/orange/green; pale gray captions | Contrast-safe foreground/background pair by role, verified on actual surfaces |
| High | Modal accessibility — ModalShell and standalone dialogs | Repeated animated divs without focus lifecycle | One accessible shared dialog foundation before expanding modal use |
| High | Form labels/focus — FormModal, modal inputs, searches | Mixed linked labels, unbound labels, placeholder-only controls; outline suppression | Shared field contract with label, hint, error, focus and validation semantics |
| High | Responsive order detail — OrderCard | sm row with280px and294px fixed side columns | Stack until sufficient width; avoid nonshrinking columns at640px |
| High | Mobile administration — navbars/PageHeader/filter groups/coupons | md desktop nav and rigid inner widths | Test actual content width; deliberate wrapping or later breakpoint |
| High | Misleading completion — FormModal, LaunchOffer, wizard, content editors | Local success/draft copy without persistence or list insertion | Wire durable behavior or clearly distinguish prototype completion |
| Medium | Primary action color — Button vs modalHelpers/admin pages | `#F9A51A` versus `#F7931E`; two hover oranges | Define documented role-aware tokens; do not bulk replace without design approval |
| Medium | Success/info mappings — OrderCard vs ordersData/contentData/offersData | Exception green in warehouse, orange in admin; Scheduled blue/orange | Shared semantic meanings or explicitly justified domain mappings |
| Medium | Button API and geometry — ui/Button, local CTAs, helpers | Full pill60px, pill40px, rectangle52px, mini28px | Shared context/size variants retaining existing role identity |
| Medium | Card geometry — reports/order/dashboard/admin | Radius16/20/24/28/32 and multiple border/shadow conventions | Document context roles; consolidate equivalent patterns only |
| Medium | Duplicated page — dashboard/page.tsx and warehouse/page.tsx | Same content, different metadata; active nav differs | Shared overview composition and explicit alias behavior |
| Medium | Repeated navbars/dialogs/reply forms | Near-duplicate shells and three TicketReplyModal concepts | Shared foundation plus domain-specific content APIs |
| Medium | Search/date controls — OrdersQueue, products/page.tsx, product detail | Search/date range can change value without changing rows/chart | Implement expected effect or disable explanatory prototype affordance |
| Medium | Pagination — super-admin/ui/Pagination.tsx | Zero items yields “Showing1 to0”; no aria-current; all pages rendered | Accurate zero summary, current semantics and scalable page window |
| Medium | Motion — all animated wrappers/counters | Blur/stagger/trajectory without reduced-motion handling | Shared motion preference and intentional timing recipes |
| Medium | Required/validation — FormModal/CreateAdmin/CreateBatch | Decorative required badge, nonblank guards, silent return | Per-field validity/messages and explicit submission contract |
| Medium | Drafts consistency — master-data/drafts vs users/drafts | Direct deletion versus confirmation/success | One consistent destructive confirmation policy |
| Medium | Offer Drafts tab | Always false filter, appears empty | Real draft data or clearly unavailable state |
| Medium | Resource lifetime — object URL uploads | No uniform object URL revoke/cleanup | Lifecycle cleanup after replacement/removal/unmount |
| Low | Font range — layout and drawer |400–700 loaded; font800 used | Load actual desired weight or use700 |
| Low | Assets — product art reused for all products |224px image stretched into larger contexts; grain aspect differs | Product-specific responsive imagery and intrinsic ratios |
| Low | Content/README — master-data coupon card / README | Coupon description discusses users; README claims Geist | Correct descriptive copy independently of visual system |
| Low | Unused components — ErrorState, EditProductModal | Defined, not imported by current screens | Explicitly integrate or remove in a separate change |

No Critical-level finding is asserted from this UI-only static audit. Runtime security/backend correctness was outside scope. Highest priority findings are High because they affect access, readability, or core workflow expectations.

## 16. Implementation Guidelines

1. Read the route recipe and component contract first. Source remains authoritative if a later code change makes this document stale; update both together.
2. Choose warehouse/auth/super-admin context explicitly. Use its existing primary, ink and surface mapping rather than freely mixing palettes.
3. Reuse Button/ButtonLink/TextField only where their actual dimensions and APIs fit. Do not pass imaginary size/variant/error props. Reuse ModalShell, PageHeader, Pagination and FilterDropdown with their documented limitations.
4. Match existing page margins, section gaps, card grouping, typography and responsive thresholds. Avoid inventing max-width wrappers for fluid dashboards.
5. For controls without a shared primitive, start from the nearest same-domain recipe in Appendix18. Keep interactive classes and state guards together; separate selected state from pressed feedback.
6. Class strings are concatenated directly. There is no clsx/cva/tailwind-merge dependency. Do not assume the last conflicting Tailwind token necessarily wins; inspect CSS output if overriding.
7. Keep fixture semantics explicit. Do not carry a local demo success claim into a new asynchronous backend action without pending/error/retry handling.
8. Use Lucide and the existing image assets where appropriate. Avoid new fonts, chart libraries or arbitrary colors to solve a local layout problem.
9. Add accessibility semantics recommended above while preserving surrounding appearance. Existing omissions are not constraints on new work.
10. Update documentation when adding a token, state, variant or breakpoint behavior. Record why any new value is needed and avoid silently claiming it already existed.

## 17. New Screen Creation Guidelines

**Recommended implementation workflow:** identify role and closest route → inspect corresponding source/component atlas → choose shell → reuse actions/forms/navigation → define data and state transitions → implement responsive layout → add keyboard/focus/error semantics → check against existing screen alongside new screen.

A new super-admin list can use SuperAdminNavbar, the standard main wrapper, PageHeader, existing filter capsule, table recipe and Pagination. A warehouse operations screen can use DashboardNavbar, HeroBanner and domain cards. An auth screen can use AuthLayout, AnimatedTitle/Subtitle, TextField and Button. New dialogs can begin with ModalShell but must supply accessible dialog semantics and a focus lifecycle before production use.

Required review checklist:

- Correct role-specific action color, text hierarchy, surface, radius, border and spacing.
- Appropriate link versus button and meaningful labels/icons.
- Default, hover, focus-visible, selected/expanded, disabled states as applicable.
- Pending, success, empty and recoverable error behavior for actual async/data operations; clearly labeled recommendations where no precedent exists.
- Existing navigation routes/deep-link conventions and accurate zero-item pagination.
- Layout verified at narrow mobile, breakpoints and desktop; scroll containers are discoverable.
- Keyboard dialog/menu/calendar behavior; focus restored after overlays; labels and status announcements.
- Contrast, meaningful alternatives, target sizes, zoom/reflow and reduced-motion preference.
- No duplicated primitive or undocumented style introduced unnecessarily.

## 18. Reference Appendix

### How to use the source atlas

The appended inventories are extracted from all140 `.ts`, `.tsx` and `.css` source files, including33 page modules,88 component modules, one root layout, one loading view, domain fixtures and utilities. Each route/component contract lists source line references, props/state declarations and exact JSX style recipes. Class expressions preserve both conditional variants; inline styles preserve SVG/chart/gradient geometry. Attribute presence does not prove runtime accessibility or correctness. A native control may behave through the browser even when no custom class defines a state.

In the atlas, a control with no class has inherited/browser styling. `className={PRIMARY_BUTTON}` refers to the recipe documented in section7 and its defining source. Dynamic `${…}`/object expressions are source expressions, not literal CSS. Runtime values depending on files, viewport, props or data remain runtime-dependent. These records describe author-defined values; computed browser metrics and screenshots remain unverified.

Token sources: `src/app/globals.css`, `src/app/layout.tsx`, installed `node_modules/tailwindcss/theme.css`; class helpers `src/components/ui/Button.tsx`, `src/components/orders/modals/modalHelpers.ts`; semantic helpers in domain `*Data.ts` modules. Framework conventions were checked against installed Next documentation on layouts/pages and CSS in `node_modules/next/dist/docs/01-app/01-getting-started/`.

Known limitations: browser surface unavailable; current existing dev server returns HTTP500 for all33 tested route paths. The login response identifies `TurbopackInternalError`, failure writing `/login/page` through `globals.css`, with a spawned Node process exiting before connection. A second Next dev instance refused to run because a pre-existing server holds the project. No existing server was terminated. Therefore no visual, keyboard, touch, animation playback, hydrated modal flow, screen-reader or print-preview verification was completed. API wiring, data durability and any security copy are unverified or explicitly absent in source. No production build/lint rerun was necessary for a documentation-only edit.

### Detailed extracted inventories

The following generated reference is part of this document, not an alternate design standard.

### 18.A Complete literal color registry
Every distinct hex literal in `src` is listed below, case-normalized. Contexts are extracted utility/attribute expressions, not invented token names. Several colors are decorative or one-off. References show up to three owning files; the module atlas records the rest. White/black/transparent/currentColor and built-in Tailwind colors are listed separately.

| Exact HEX | Context / expression examples | Source references |
|---|---|---|
| #006C47 | <code>bg-[#006C47]</code>, <code>#006C47</code> | [src/components/dashboard/CompanyGrowthCard.tsx](<src/components/dashboard/CompanyGrowthCard.tsx>) line 91 |
| #006D3A | <code>text-[#006D3A]</code> | [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) line 28 |
| #006E1F | <code>text-[#006E1F]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 224 |
| #10B981 | <code>text-[#10B981]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 211 |
| #111827 | <code>text-[#111827]</code>, <code>hover:text-[#111827]</code> | [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>) line 38 |
| #171D15 | <code>text-[#171D15]</code>, <code>hover:text-[#171D15]</code> | [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 30; [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) line 52; [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>) line 85 |
| #1A1C1D | <code>#1a1c1d</code>, <code>text-[#1A1C1D]</code>, <code>hover:text-[#1A1C1D]</code> | [src/app/globals.css](<src/app/globals.css>) line 5; [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) line 37; [src/components/auth/LoginForm.tsx](<src/components/auth/LoginForm.tsx>) line 64 |
| #1A73E8 | <code>text-[#1A73E8]</code> | [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 50 |
| #1B4332 | <code>#1B4332</code>, <code>text-[#1B4332]</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 66 |
| #1D1D1F | <code>text-[#1D1D1F]</code>, <code>hover:text-[#1D1D1F]</code> | [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) line 330; [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 207; [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 58 |
| #1D4ED8 | <code>hover:text-[#1D4ED8]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 181 |
| #1EA34D | <code>hover:text-[#1ea34d]</code> | [src/components/super-admin/tickets/TicketReplyModal.tsx](<src/components/super-admin/tickets/TicketReplyModal.tsx>) line 98 |
| #1F1B17 | <code>text-[#1F1B17]</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 48; [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 132 |
| #22C55E | <code>text-[#22C55E]</code>, <code>hover:border-[#22C55E]</code>, <code>bg-[#22C55E]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 29; [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>) line 143; [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 13 |
| #2563EB | <code>text-[#2563EB]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 181 |
| #25D366 | <code>text-[#25D366]</code> | [src/components/orders/modals/ShippedOrderModal.tsx](<src/components/orders/modals/ShippedOrderModal.tsx>) line 110 |
| #2C2C2C | <code>text-[#2C2C2C]</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 117; [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 136 |
| #2E4A2A | <code>#2E4A2A</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 72 |
| #2E7D32 | <code>border-[#2E7D32]</code>, <code>text-[#2E7D32]</code>, <code>hover:bg-[#2E7D32]/5</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 75; [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) line 30 |
| #2F9D3D | <code>hover:bg-[#2f9d3d]</code>, <code>hover:text-[#2f9d3d]</code> | [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 25; [src/components/orders/modals/SupportTicketModal.tsx](<src/components/orders/modals/SupportTicketModal.tsx>) line 87; [src/components/reports/ReportCard.tsx](<src/components/reports/ReportCard.tsx>) line 43 |
| #374151 | <code>text-[#374151]</code>, <code>hover:text-[#374151]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 232; [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) line 92; [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>) line 80 |
| #3B2F1E | <code>#3B2F1E</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 26 |
| #3B82F6 | <code>text-[#3B82F6]</code>, <code>bg-[#3B82F6]</code>, <code>border-[#3B82F6]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 30; [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 14; [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 24 |
| #3BB54A | <code>text-[#3BB54A]</code>, <code>bg-[#3BB54A]/10</code>, <code>bg-[#3BB54A]</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 53; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 99; [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) line 47 |
| #3D4949 | <code>text-[#3D4949]/80</code>, <code>text-[#3D4949]</code>, <code>hover:text-[#3D4949]</code> | [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) line 29; [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) line 57; [src/components/auth/LoginForm.tsx](<src/components/auth/LoginForm.tsx>) line 67 |
| #3E4A3C | <code>text-[#3E4A3C]</code>, <code>placeholder:text-[#3E4A3C]/50</code>, <code>text-[#3E4A3C]/70</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 218; [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 121; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 77 |
| #3E5C3A | <code>#3E5C3A</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 92; [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 103 |
| #3F4942 | <code>text-[#3F4942]</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 62 |
| #475569 | <code>text-[#475569]</code> | [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 79 |
| #4A3B2C | <code>#4A3B2C</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 172 |
| #4C6B3F | <code>#4C6B3F</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 49 |
| #544437 | <code>text-[#544437]/50</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 124 |
| #6B4A2B | <code>#6B4A2B</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 26 |
| #6B7280 | <code>text-[#6B7280]</code> | [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 84; [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) line 81; [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) line 81 |
| #6B8A4A | <code>#6B8A4A</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 72 |
| #6D7A7A | <code>text-[#6D7A7A]</code>, <code>placeholder:text-[#6D7A7A]/50</code> | [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>) line 31 |
| #6E6E73 | <code>text-[#6E6E73]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 143 |
| #6E7B6A | <code>text-[#6E7B6A]</code> | [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 27; [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) line 75; [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>) line 99 |
| #7A5230 | <code>#7A5230</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 71 |
| #83818C | <code>text-[#83818C]</code> | [src/components/dashboard/CompanyGrowthCard.tsx](<src/components/dashboard/CompanyGrowthCard.tsx>) line 70 |
| #83FC87 | <code>bg-[#83FC87]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 247 |
| #86868B | <code>text-[#86868B]</code>, <code>placeholder:text-[#86868B]</code>, <code>bg-[#86868B]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 230; [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 61; [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 150 |
| #8A4B2C | <code>#8A4B2C</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 38 |
| #8A5A2C | <code>#8A5A2C</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 112 |
| #8A6B4A | <code>#8A6B4A</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 172 |
| #8F4E00 | <code>text-[#8F4E00]</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 117 |
| #8FAE68 | <code>#8FAE68</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 92; [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 103 |
| #9CA3AF | <code>text-[#9CA3AF]</code>, <code>placeholder:text-[#9CA3AF]</code> | [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 70; [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) line 45; [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) line 64 |
| #A9C97A | <code>#A9C97A</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 49 |
| #B45309 | <code>text-[#B45309]</code> | [src/components/super-admin/content/SaveDraftModal.tsx](<src/components/super-admin/content/SaveDraftModal.tsx>) line 39 |
| #BBE5C4 | <code>border-[#BBE5C4]</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 322 |
| #BDCAB8 | <code>border-[#BDCAB8]/30</code>, <code>border-[#BDCAB8]</code>, <code>sm:border-[#BDCAB8]/30</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 92; [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 35; [src/components/orders/OrderCard.tsx](<src/components/orders/OrderCard.tsx>) line 97 |
| #C22A20 | <code>hover:bg-[#c22a20]</code> | [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 72 |
| #C79A5B | <code>text-[#C79A5B]</code>, <code>#C79A5B</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 214; [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 71 |
| #C9762F | <code>#C9762F</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 192 |
| #C97B3D | <code>#C97B3D</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 38 |
| #C99257 | <code>#C99257</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 112 |
| #C9D9A8 | <code>#C9D9A8</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 72 |
| #D1D5DB | <code>placeholder:text-[#D1D5DB]</code>, <code>bg-[#D1D5DB]</code>, <code>text-[#D1D5DB]</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 262; [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>) line 43; [src/components/super-admin/content/DateField.tsx](<src/components/super-admin/content/DateField.tsx>) line 125 |
| #D1FAE5 | <code>border-[#D1FAE5]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 211 |
| #D5DCCF | <code>bg-[#D5DCCF]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 246 |
| #D8F3DC | <code>bg-[#D8F3DC]</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 133 |
| #D93025 | <code>text-[#D93025]</code>, <code>bg-[#D93025]</code>, <code>bg-[#D93025]/10</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 33; [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 55; [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 31 |
| #D9D9DE | <code>border-[#D9D9DE]</code> | [src/components/inventory/CreateBatchModal.tsx](<src/components/inventory/CreateBatchModal.tsx>) line 198 |
| #DADADA | <code>border-[#DADADA]/55</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 53 |
| #DBE6D2 | <code>hover:bg-[#dbe6d2]</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 121; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 77 |
| #DC2626 | <code>text-[#DC2626]</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 18; [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 23; [src/components/orders/modals/ReturnedOrderModal.tsx](<src/components/orders/modals/ReturnedOrderModal.tsx>) line 143 |
| #E07F0E | <code>hover:text-[#e07f0e]</code> | [src/app/super-admin/master-data/page.tsx](<src/app/super-admin/master-data/page.tsx>) line 65; [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 334; [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 189 |
| #E4E4E7 | <code>hover:bg-[#E4E4E7]</code>, <code>border-[#E4E4E7]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 128; [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) line 14 |
| #E5C9A0 | <code>border-[#E5C9A0]</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 181 |
| #E5E5E7 | <code>border-[#E5E5E7]</code>, <code>bg-[#E5E5E7]</code> | [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 106; [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) line 90; [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>) line 125 |
| #E5E7EB | <code>border-[#E5E7EB]</code>, <code>text-[#E5E7EB]</code>, <code>bg-[#E5E7EB]</code> | [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 79; [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) line 54; [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) line 73 |
| #E5EEFF | <code>bg-[#E5EEFF]</code> | [src/app/super-admin/products/page.tsx](<src/app/super-admin/products/page.tsx>) line 130 |
| #E6960F | <code>hover:text-[#e6960f]</code>, <code>hover:bg-[#e6960f]</code> | [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) line 35; [src/components/auth/SignupForm.tsx](<src/components/auth/SignupForm.tsx>) line 113; [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 198 |
| #E6FBEA | <code>hover:bg-[#E6FBEA]</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 322 |
| #E8B65A | <code>#E8B65A</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 192 |
| #E8D9B5 | <code>#E8D9B5</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 26 |
| #E8F0FE | <code>bg-[#E8F0FE]</code> | [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 50 |
| #E9E9EC | <code>hover:bg-[#e9e9ec]</code> | [src/components/orders/modals/ModalShell.tsx](<src/components/orders/modals/ModalShell.tsx>) line 57; [src/components/orders/modals/SupportTicketModal.tsx](<src/components/orders/modals/SupportTicketModal.tsx>) line 169; [src/components/super-admin/tickets/TicketReplyModal.tsx](<src/components/super-admin/tickets/TicketReplyModal.tsx>) line 180 |
| #E9F0E3 | <code>bg-[#E9F0E3]</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 121; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 77; [src/components/orders/modals/InvoiceModal.tsx](<src/components/orders/modals/InvoiceModal.tsx>) line 92 |
| #EAEAEB | <code>hover:bg-[#EAEAEB]</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 146; [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 165 |
| #EBF7EC | <code>bg-[#EBF7EC]</code>, <code>border-[#EBF7EC]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 29; [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>) line 143; [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 13 |
| #ECFDF5 | <code>bg-[#ECFDF5]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 211 |
| #EDEDEF | <code>border-[#EDEDEF]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 151 |
| #EEF2F1 | <code>bg-[#EEF2F1]</code> | [src/components/super-admin/users/HubDetailModal.tsx](<src/components/super-admin/users/HubDetailModal.tsx>) line 56 |
| #EF4444 | <code>hover:text-[#EF4444]</code>, <code>text-[#EF4444]</code>, <code>bg-[#EF4444]</code> | [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) line 74; [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 506; [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) line 138 |
| #EF4646 | <code>bg-[#EF4646]</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 119; [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 138 |
| #EFE7C2 | <code>#EFE7C2</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 49 |
| #EFF6E9 | <code>bg-[#EFF6E9]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 223 |
| #EFF6FF | <code>bg-[#EFF6FF]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 30; [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 14; [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 197 |
| #F0F0F0 | <code>border-[#F0F0F0]</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 243; [src/components/orders/modals/InvoiceModal.tsx](<src/components/orders/modals/InvoiceModal.tsx>) line 30 |
| #F0F0F2 | <code>bg-[#F0F0F2]</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 128 |
| #F0FDF4 | <code>bg-[#F0FDF4]</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 322; [src/components/super-admin/masterdata/StockStatusModal.tsx](<src/components/super-admin/masterdata/StockStatusModal.tsx>) line 144; [src/components/super-admin/offers/LaunchOfferModal.tsx](<src/components/super-admin/offers/LaunchOfferModal.tsx>) line 357 |
| #F1F5F9 | <code>border-[#F1F5F9]</code>, <code>bg-[#F1F5F9]</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 173; [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 192; [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) line 62 |
| #F2A65A | <code>#F2A65A</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 92; [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 103 |
| #F2F2F2 | <code>text-[#F2F2F2]</code> | [src/components/dashboard/HeroBanner.tsx](<src/components/dashboard/HeroBanner.tsx>) line 30 |
| #F3E7D0 | <code>border-[#F3E7D0]</code> | [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) line 81 |
| #F3F3F5 | <code>hover:bg-[#F3F3F5]</code>, <code>bg-[#F3F3F5]</code> | [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) line 14; [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>) line 30 |
| #F3F4F6 | <code>border-[#F3F4F6]</code>, <code>divide-[#F3F4F6]</code>, <code>bg-[#F3F4F6]</code> | [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) line 83; [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) line 81; [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 242 |
| #F59E0B | <code>bg-[#F59E0B]</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 66 |
| #F5A623 | <code>border-[#F5A623]</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 137; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 83; [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 156 |
| #F5F5F7 | <code>bg-[#F5F5F7]</code>, <code>hover:bg-[#F5F5F7]</code>, <code>hover:bg-[#F5F5F7]/50</code> | [src/app/inventory/page.tsx](<src/app/inventory/page.tsx>) line 20; [src/app/orders/page.tsx](<src/app/orders/page.tsx>) line 12; [src/app/reports/page.tsx](<src/app/reports/page.tsx>) line 12 |
| #F7931E | <code>text-[#F7931E]</code>, <code>bg-[#F7931E]</code>, <code>focus:border-[#F7931E]</code> | [src/app/dashboard/page.tsx](<src/app/dashboard/page.tsx>) line 38; [src/app/inventory/page.tsx](<src/app/inventory/page.tsx>) line 35; [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 61 |
| #F7F7F7 | <code>bg-[#F7F7F7]/60</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 131 |
| #F97316 | <code>text-[#F97316]</code>, <code>bg-[#F97316]</code> | [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>) line 39; [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 200 |
| #F9A51A | <code>text-[#F9A51A]</code>, <code>bg-[#F9A51A]/10</code>, <code>bg-[#F9A51A]</code> | [src/app/warehouse/loading.tsx](<src/app/warehouse/loading.tsx>) line 6; [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) line 35; [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) line 45 |
| #F9D0CF | <code>border-[#F9D0CF]</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 33 |
| #F9DBD8 | <code>hover:bg-[#f9dbd8]</code> | [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 110 |
| #F9FAFB | <code>bg-[#F9FAFB]</code>, <code>hover:bg-[#F9FAFB]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 212; [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) line 330; [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>) line 168 |
| #FAFAF8 | <code>bg-[#FAFAF8]</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 181 |
| #FAFAFA | <code>bg-[#FAFAFA]</code>, <code>hover:bg-[#FAFAFA]</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 58; [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>) line 20; [src/components/inventory/CreateBatchModal.tsx](<src/components/inventory/CreateBatchModal.tsx>) line 198 |
| #FCA5A5 | <code>border-[#FCA5A5]</code> | [src/components/super-admin/users/AdminDetailModal.tsx](<src/components/super-admin/users/AdminDetailModal.tsx>) line 297 |
| #FCE8E6 | <code>bg-[#FCE8E6]</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 32; [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) line 110 |
| #FDE3E3 | <code>hover:bg-[#FDE3E3]</code> | [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>) line 19 |
| #FDF4E7 | <code>bg-[#FDF4E7]</code> | [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>) line 109 |
| #FEE2E2 | <code>bg-[#FEE2E2]</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 18; [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 23; [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 53 |
| #FEF2F2 | <code>bg-[#FEF2F2]</code>, <code>hover:bg-[#FEF2F2]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 870; [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) line 283; [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 136 |
| #FEF3E2 | <code>hover:bg-[#FEF3E2]</code>, <code>bg-[#FEF3E2]</code>, <code>#FEF3E2</code> | [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 103; [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) line 98; [src/app/super-admin/master-data/nutrition/page.tsx](<src/app/super-admin/master-data/nutrition/page.tsx>) line 89 |
| #FEF9F0 | <code>bg-[#FEF9F0]</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 181; [src/components/super-admin/orders/OrderDetailModal.tsx](<src/components/super-admin/orders/OrderDetailModal.tsx>) line 160 |
| #FFEDD5 | <code>shadow-[0_0_0_4px_#FFEDD5]</code> | [src/components/orders/modals/TrackShipmentModal.tsx](<src/components/orders/modals/TrackShipmentModal.tsx>) line 36 |
| #FFFFFF | <code>#ffffff</code> | [src/app/globals.css](<src/app/globals.css>) line 4 |

Named color values: `white = #FFFFFF`, `black = #000000`, `transparent` is transparent color, `currentColor` inherits computed foreground. The auth errors additionally use `text-red-600`, defined by installed Tailwind as `oklch(57.7% 0.245 27.325)`. No app-defined named gray palette exists.

#### Alpha, CSS color functions and gradients
CSS functions below preserve source syntax. Underscores inside arbitrary Tailwind values encode spaces when compiled.

| Expression | Source example |
|---|---|
| <code>&quot;linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)&quot;,</code> | [src/components/super-admin/users/HubDetailModal.tsx](<src/components/super-admin/users/HubDetailModal.tsx>) line 61 |
| <code>: &quot;linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)&quot;,</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 92 |
| <code>&lt;div className=&quot;relative flex h-[220px] flex-col justify-center px-8&quot; style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})`, backgroundSize: &quot;cover&quot;, backgroundPosition: &quot;center&quot; }}&gt;</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 266 |
| <code>? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})`</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 91 |
| <code>bannerGradient=&quot;linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)&quot;</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 138 |
| <code>bg-[#3BB54A]/10</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 59 |
| <code>bg-[#D93025]/10</code> | [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 31 |
| <code>bg-[#EF4444]/10</code> | [src/components/orders/OrderCard.tsx](<src/components/orders/OrderCard.tsx>) line 82 |
| <code>bg-[#F7931E]/10</code> | [src/components/orders/modals/PackOrderModal.tsx](<src/components/orders/modals/PackOrderModal.tsx>) line 86 |
| <code>bg-[#F7931E]/15</code> | [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>) line 110 |
| <code>bg-[#F7F7F7]/60</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 131 |
| <code>bg-[#F9A51A]/10</code> | [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) line 45 |
| <code>bg-black/0</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 195 |
| <code>bg-black/40</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 945 |
| <code>bg-black/5</code> | [src/app/super-admin/revenue/page.tsx](<src/app/super-admin/revenue/page.tsx>) line 20 |
| <code>bg-black/50</code> | [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>) line 183 |
| <code>bg-white/20</code> | [src/app/dashboard/page.tsx](<src/app/dashboard/page.tsx>) line 35 |
| <code>bg-white/70</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 117 |
| <code>bg-white/90</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 71 |
| <code>bg-white/95</code> | [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>) line 265 |
| <code>border-[#22C55E]/40</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 303 |
| <code>border-[#BDCAB8]/30</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 92 |
| <code>border-[#DADADA]/55</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 53 |
| <code>border-black/5</code> | [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 340 |
| <code>border-black/[0.04]</code> | [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) line 90 |
| <code>border-black/[0.08]</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 746 |
| <code>border-white/20</code> | [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>) line 120 |
| <code>border-white/30</code> | [src/app/dashboard/page.tsx](<src/app/dashboard/page.tsx>) line 35 |
| <code>border-white/50</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 117 |
| <code>const heroGradient = existing?.gradient ?? &quot;linear-gradient(135deg, #2E4A2A 0%, #6B8A4A 55%, #C9D9A8 100%)&quot;;</code> | [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 72 |
| <code>focus-within:ring-[#F9A51A]/40</code> | [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>) line 30 |
| <code>from-black/80</code> | [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>) line 107 |
| <code>gradient: &quot;linear-gradient(135deg, #3B2F1E 0%, #6B4A2B 45%, #E8D9B5 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 26 |
| <code>gradient: &quot;linear-gradient(135deg, #4A3B2C 0%, #8A6B4A 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 172 |
| <code>gradient: &quot;linear-gradient(135deg, #4C6B3F 0%, #A9C97A 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 182 |
| <code>gradient: &quot;linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 49 |
| <code>gradient: &quot;linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 71 |
| <code>gradient: &quot;linear-gradient(135deg, #8A4B2C 0%, #C97B3D 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 38 |
| <code>gradient: &quot;linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 112 |
| <code>gradient: &quot;linear-gradient(135deg, #C9762F 0%, #E8B65A 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 192 |
| <code>gradient: &quot;linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)&quot;,</code> | [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 103 |
| <code>group-hover:bg-black/40</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 195 |
| <code>hover:bg-[#2E7D32]/5</code> | [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 75 |
| <code>hover:bg-[#F5F5F7]/50</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 222 |
| <code>hover:bg-[#F7931E]/20</code> | [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>) line 159 |
| <code>hover:border-[#F7931E]/30</code> | [src/app/super-admin/site-content/blogs/page.tsx](<src/app/super-admin/site-content/blogs/page.tsx>) line 67 |
| <code>placeholder:text-[#3E4A3C]/50</code> | [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 92 |
| <code>placeholder:text-[#6D7A7A]/50</code> | [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>) line 35 |
| <code>rgba(0,0,0,0.04)</code> | [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) line 202 |
| <code>rgba(0,0,0,0.05)</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 357 |
| <code>rgba(0,0,0,0.06)</code> | [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 71 |
| <code>rgba(0,0,0,0.08)</code> | [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) line 51 |
| <code>rgba(0,0,0,0.1)</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 117 |
| <code>rgba(0,0,0,0.12)</code> | [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 946 |
| <code>rgba(0,0,0,0.14)</code> | [src/components/super-admin/content/DateField.tsx](<src/components/super-admin/content/DateField.tsx>) line 84 |
| <code>rgba(0,0,0,0.15)</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 91 |
| <code>rgba(0,0,0,0.18)</code> | [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) line 118 |
| <code>rgba(0,0,0,0.22)</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 86 |
| <code>rgba(0,0,0,0.35)</code> | [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) line 91 |
| <code>rgba(134,134,139,0.16)</code> | [src/components/dashboard/CompanyGrowthCard.tsx](<src/components/dashboard/CompanyGrowthCard.tsx>) line 139 |
| <code>rgba(34,197,94,0.45)</code> | [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) line 51 |
| <code>sm:border-[#BDCAB8]/30</code> | [src/components/orders/OrderCard.tsx](<src/components/orders/OrderCard.tsx>) line 117 |
| <code>text-[#3D4949]/80</code> | [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) line 29 |
| <code>text-[#544437]/50</code> | [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>) line 124 |
| <code>text-[#F7931E]/80</code> | [src/components/super-admin/orders/FiltersModal.tsx](<src/components/super-admin/orders/FiltersModal.tsx>) line 154 |
| <code>text-white/80</code> | [src/app/dashboard/page.tsx](<src/app/dashboard/page.tsx>) line 41 |
| <code>via-black/20</code> | [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>) line 107 |

### 18.B Complete module contracts and visual recipes
Each expandable module contains its actual props/state/recipe declarations and JSX anatomy. Repeated identical rows within a file are grouped by source line. All styled nodes, component invocations, controls, inline SVG geometry and authored motion attributes are included. Properties not shown are not explicitly set on that node; check inherited classes and the component contract. Event expressions name the actual handler or state transition; presence of a handler does not imply network persistence.

<details>
<summary>src/app/dashboard/page.tsx — 66 lines</summary>

Source: [src/app/dashboard/page.tsx](<src/app/dashboard/page.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Clock, ShoppingBag, Truck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 23 | <code>&quot;flex min-h-screen w-full flex-col bg-white&quot;</code> |  |
| <code>DashboardNavbar</code> · 24 | Inherited / component-owned |  |
| <code>main</code> · 26 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>HeroBanner</code> · 27 | Inherited / component-owned | <code>heading=&quot;Dashboard&quot;</code>; <code>subtitle=&quot;Monitor your operations and take action&quot;</code> |
| <code>div</code> · 31 | <code>&quot;flex flex-wrap gap-3&quot;</code> |  |
| <code>div</code> · 33 | <code>&quot;flex w-fit min-w-[199px] items-center gap-3 rounded-2xl border border-white/30 bg-white/20 p-2.5 backdrop-blur-sm&quot;</code> |  |
| <code>div</code> · 37 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white&quot;</code> |  |
| <code>stat.icon</code> · 38 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>div</code> · 40 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 41 | <code>&quot;whitespace-nowrap text-sm font-medium capitalize tracking-[0.5px] text-white/80&quot;</code> |  |
| <code>AnimatedCounter</code> · 44 | <code>&quot;text-2xl font-medium leading-7 text-white&quot;</code> | <code>value={stat.value}</code> |
| <code>div</code> · 54 | <code>&quot;mt-6 flex flex-col gap-6 lg:flex-row&quot;</code> |  |
| <code>CompanyGrowthCard</code> · 55 | Inherited / component-owned |  |
| <code>InventoryAlertsCard</code> · 56 | Inherited / component-owned |  |
| <code>FulfillmentOverviewCard</code> · 57 | Inherited / component-owned |  |
| <code>div</code> · 60 | <code>&quot;mt-10&quot;</code> |  |
| <code>ActivityTicketTable</code> · 61 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/forgot-password/page.tsx — 15 lines</summary>

Source: [src/app/forgot-password/page.tsx](<src/app/forgot-password/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AuthLayout</code> · 11 | Inherited / component-owned |  |
| <code>ForgotPasswordForm</code> · 12 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/globals.css — 68 lines</summary>

Source: [src/app/globals.css](<src/app/globals.css>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #1a1c1d;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-figtree);
}

body {
  background: var(--background);
  color: var(--foreground);
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@media print {
  body * {
    visibility: hidden;
  }

  #invoice-print-area,
  #invoice-print-area * {
    visibility: visible;
  }

  .modal-backdrop {
    position: fixed !important;
    inset: 0 !important;
    display: flex !important;
    align-items: flex-start !important;
    justify-content: center !important;
    padding: 24px !important;
    margin: 0 !important;
    background: none !important;
    backdrop-filter: none !important;
    overflow: visible !important;
  }

  .modal-card {
    position: static !important;
    width: 100% !important;
    max-width: 640px !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  #invoice-print-area {
    max-height: none !important;
    overflow: visible !important;
    padding: 0 !important;
  }

  .no-print {
    display: none !important;
  }
}
```

</details>

<details>
<summary>src/app/inventory/page.tsx — 55 lines</summary>

Source: [src/app/inventory/page.tsx](<src/app/inventory/page.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>CheckCircle2, Hourglass, Layers</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 20 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>DashboardNavbar</code> · 21 | Inherited / component-owned |  |
| <code>main</code> · 23 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>HeroBanner</code> · 24 | Inherited / component-owned | <code>heading=&quot;Inventory Under Control&quot;</code>; <code>subtitle=&quot;Monitor stock levels, movements, and availability with ease.&quot;</code> |
| <code>div</code> · 28 | <code>&quot;flex flex-wrap gap-3&quot;</code> |  |
| <code>div</code> · 30 | <code>&quot;flex w-fit min-w-[199px] items-center gap-3 rounded-2xl border border-white/30 bg-white/20 p-2.5 backdrop-blur-sm&quot;</code> |  |
| <code>div</code> · 34 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white&quot;</code> |  |
| <code>stat.icon</code> · 35 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>div</code> · 37 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 38 | <code>&quot;whitespace-nowrap text-sm font-medium capitalize tracking-[0.5px] text-white/80&quot;</code> |  |
| <code>div</code> · 41 | <code>&quot;flex items-baseline text-2xl font-medium leading-7 text-white&quot;</code> |  |
| <code>AnimatedCounter</code> · 42 | Inherited / component-owned | <code>value={stat.value}</code> |
| <code>span</code> · 43 | <code>&quot;text-base&quot;</code> |  |
| <code>InventoryBoard</code> · 51 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/layout.tsx — 39 lines</summary>

Source: [src/app/layout.tsx](<src/app/layout.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>html</code> · 30 | <code>{`${figtree.variable} h-full antialiased`}</code> |  |
| <code>body</code> · 31 | <code>&quot;min-h-full flex flex-col font-sans overflow-x-hidden&quot;</code> |  |

</details>

<details>
<summary>src/app/login/page.tsx — 15 lines</summary>

Source: [src/app/login/page.tsx](<src/app/login/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AuthLayout</code> · 11 | Inherited / component-owned |  |
| <code>LoginForm</code> · 12 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/orders/page.tsx — 25 lines</summary>

Source: [src/app/orders/page.tsx](<src/app/orders/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 12 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>DashboardNavbar</code> · 13 | Inherited / component-owned |  |
| <code>main</code> · 15 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>HeroBanner</code> · 16 | Inherited / component-owned | <code>heading=&quot;Orders Made Effortless&quot;</code>; <code>subtitle=&quot;Track, manage, and process every order without the clutter.&quot;</code> |
| <code>OrdersQueue</code> · 21 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/page.tsx — 5 lines</summary>

Source: [src/app/page.tsx](<src/app/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

Fixture/data definitions or nonvisual exports; no standalone rendered component. The importing screen defines appearance. Values are local demo data, not verified backend content.

</details>

<details>
<summary>src/app/reports/page.tsx — 25 lines</summary>

Source: [src/app/reports/page.tsx](<src/app/reports/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 12 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>DashboardNavbar</code> · 13 | Inherited / component-owned |  |
| <code>main</code> · 15 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>HeroBanner</code> · 16 | Inherited / component-owned | <code>heading=&quot;Reports&quot;</code>; <code>subtitle=&quot;Turn business data into clear and actionable insights.&quot;</code> |
| <code>ReportsGrid</code> · 21 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/set-new-password/page.tsx — 15 lines</summary>

Source: [src/app/set-new-password/page.tsx](<src/app/set-new-password/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AuthLayout</code> · 11 | Inherited / component-owned |  |
| <code>SetNewPasswordForm</code> · 12 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/signup/page.tsx — 15 lines</summary>

Source: [src/app/signup/page.tsx](<src/app/signup/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AuthLayout</code> · 11 | Inherited / component-owned |  |
| <code>SignupForm</code> · 12 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/super-admin/master-data/coupons/page.tsx — 141 lines</summary>

Source: [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[coupons, setCoupons] = useState(INITIAL_COUPONS);
// line 15
[search, setSearch] = useState("");
// line 16
[page, setPage] = useState(1);
// line 17
[createOpen, setCreateOpen] = useState(false);
// line 18
[editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
```

Lucide imports: <code>Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 49 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 50 | Inherited / component-owned |  |
| <code>main</code> · 52 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 53 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Add all the basic details of your new rice product&quot;</code>; <code>title=&quot;Coupons&quot;</code> |
| <code>button</code> · 58 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setCreateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 63 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 69 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 70 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 71 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Coupons&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 83 | <code>&quot;mt-5 flex flex-col gap-3&quot;</code> |  |
| <code>div</code> · 84 | <code>&quot;flex items-center px-6 text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 85 | <code>&quot;flex-1&quot;</code> |  |
| <code>span</code> · 86 | <code>&quot;w-[220px]&quot;</code> |  |
| <code>span</code> · 87 | <code>&quot;w-[100px] text-right&quot;</code> |  |
| <code>div</code> · 90 | <code>&quot;flex items-center rounded-2xl border-2 border-black/[0.04] bg-white px-6 py-5&quot;</code> |  |
| <code>div</code> · 91 | <code>&quot;flex-1&quot;</code> |  |
| <code>p</code> · 92 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 93, 97 | <code>&quot;text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 95 | <code>&quot;w-[220px]&quot;</code> |  |
| <code>p</code> · 96 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 99 | <code>&quot;w-[100px] text-right&quot;</code> |  |
| <code>button</code> · 100 | <code>&quot;cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]&quot;</code> | <code>onClick={() =&gt; setEditingCoupon(coupon)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 112 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 113 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>FormModal</code> · 124 | Inherited / component-owned | <code>onClose={() =&gt; { setCreateOpen(false); setEditingCoupon(null); }}</code>; <code>onSubmit={handleSubmit}</code>; <code>open={createOpen &#124;&#124; editingCoupon !== null}</code>; <code>title=&quot;Coupons&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/drafts/page.tsx — 118 lines</summary>

Source: [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 15
[drafts, setDrafts] = useState(INITIAL_DRAFTS);
// line 16
[search, setSearch] = useState("");
// line 17
[page, setPage] = useState(1);
```

Lucide imports: <code>Calendar, Clock, Search, Trash2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 34 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 35 | Inherited / component-owned |  |
| <code>main</code> · 37 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 38 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Manage, resume, or discard your pending operational updates across all modules.&quot;</code>; <code>title=&quot;Drafts&quot;</code> |
| <code>div</code> · 44 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 45 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 46 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Drafts&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 58 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 60 | <code>&quot;col-span-full py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 63 | <code>&quot;flex flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>div</code> · 64 | <code>&quot;flex items-start justify-between&quot;</code> |  |
| <code>span</code> · 65 | <code>{`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryPillClasses(draft.category)}`}</code> |  |
| <code>button</code> · 70 | <code>&quot;cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#EF4444]&quot;</code> | <code>aria-label=&quot;Delete draft&quot;</code>; <code>onClick={() =&gt; handleDelete(draft.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Trash2</code> · 76 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h3</code> · 80 | <code>&quot;mt-3 text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 81 | <code>&quot;mt-1.5 flex-1 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 83 | <code>&quot;mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>span</code> · 84 | <code>&quot;flex items-center gap-1.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>Calendar</code> · 86 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Clock</code> · 88 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 92 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>disabled={!draft.resumeHref}</code>; <code>onClick={() =&gt; handleResume(draft.resumeHref)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 105 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 106 | Inherited / component-owned | <code>onPageChange={setPage}</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/health-benefits/page.tsx — 139 lines</summary>

Source: [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[benefits, setBenefits] = useState(INITIAL_HEALTH_BENEFITS);
// line 15
[search, setSearch] = useState("");
// line 16
[page, setPage] = useState(1);
// line 17
[createOpen, setCreateOpen] = useState(false);
// line 18
[editingBenefit, setEditingBenefit] = useState<HealthBenefit | null>(null);
```

Lucide imports: <code>Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 43 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 44 | Inherited / component-owned |  |
| <code>main</code> · 46 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 47 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Manage wellness claims shown for products.&quot;</code>; <code>title=&quot;Health Benefits&quot;</code> |
| <code>button</code> · 52 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setCreateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 57 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 63 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 64 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 65 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Health Benefits..&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 77 | <code>&quot;mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 78 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 79 | <code>&quot;w-full min-w-[720px]&quot;</code> |  |
| <code>tr</code> · 81 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 82 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 83, 84 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 85 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>tr</code> · 90 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 91 | <code>&quot;px-6 py-4 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 92 | <code>&quot;px-4 py-4 text-sm font-semibold text-black&quot;</code> |  |
| <code>td</code> · 93 | <code>&quot;px-4 py-4 text-sm text-[#6B7280]&quot;</code> |  |
| <code>td</code> · 94 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>button</code> · 95 | <code>&quot;cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]&quot;</code> | <code>onClick={() =&gt; setEditingBenefit(benefit)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 109 | <code>&quot;border-t border-[#F3F4F6] px-6 pb-6 pt-4&quot;</code> |  |
| <code>Pagination</code> · 110 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>FormModal</code> · 122 | Inherited / component-owned | <code>onClose={() =&gt; { setCreateOpen(false); setEditingBenefit(null); }}</code>; <code>onSubmit={handleSubmit}</code>; <code>open={createOpen &#124;&#124; editingBenefit !== null}</code>; <code>title=&quot;Health Benefits&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/nutrition/page.tsx — 127 lines</summary>

Source: [src/app/super-admin/master-data/nutrition/page.tsx](<src/app/super-admin/master-data/nutrition/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[nutrients, setNutrients] = useState(INITIAL_NUTRIENTS);
// line 15
[search, setSearch] = useState("");
// line 16
[page, setPage] = useState(1);
// line 17
[createOpen, setCreateOpen] = useState(false);
// line 18
[editingNutrient, setEditingNutrient] = useState<Nutrient | null>(null);
```

Lucide imports: <code>Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 43 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 44 | Inherited / component-owned |  |
| <code>main</code> · 46 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 47 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Maintain the master list of nutrients used across products.&quot;</code>; <code>title=&quot;Nutrition Library&quot;</code> |
| <code>button</code> · 52 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setCreateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 57 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 63 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 64 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 65 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Nutrition...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 77 | <code>&quot;mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>div</code> · 79 | <code>&quot;flex min-h-[140px] flex-col justify-between rounded-2xl border-2 border-black/[0.04] bg-white p-8&quot;</code> |  |
| <code>h3</code> · 80 | <code>&quot;text-lg font-semibold text-black&quot;</code> |  |
| <code>div</code> · 81 | <code>&quot;mt-6 flex items-end justify-between&quot;</code> |  |
| <code>p</code> · 83 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 84 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>button</code> · 86 | <code>&quot;cursor-pointer rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]&quot;</code> | <code>onClick={() =&gt; setEditingNutrient(nutrient)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 98 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 99 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>FormModal</code> · 110 | Inherited / component-owned | <code>onClose={() =&gt; { setCreateOpen(false); setEditingNutrient(null); }}</code>; <code>onSubmit={handleSubmit}</code>; <code>open={createOpen &#124;&#124; editingNutrient !== null}</code>; <code>title=&quot;Nutrition Library&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/page.tsx — 75 lines</summary>

Source: [src/app/super-admin/master-data/page.tsx](<src/app/super-admin/master-data/page.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Archive, Briefcase, FolderOpen, Leaf, Tag, Users</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 51 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 52 | Inherited / component-owned |  |
| <code>main</code> · 54 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;flex min-h-[280px] flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-6&quot;</code> |  |
| <code>span</code> · 58 | <code>&quot;flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7931E]&quot;</code> |  |
| <code>card.icon</code> · 59 | <code>&quot;h-5 w-5 text-white&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h3</code> · 61 | <code>&quot;mt-4 text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 62 | <code>&quot;mt-2 max-w-[300px] flex-1 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>Link</code> · 63 | <code>&quot;mt-4 flex w-fit cursor-pointer items-center gap-1.5 text-sm font-bold text-[#F7931E] hover:text-[#e07f0e]&quot;</code> | <code>href={card.href}</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/products/new/page.tsx — 995 lines</summary>

Source: [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 20
type WizardTab = "Basic Details" | "Cooking & benefits" | "Reviews & Offers";
// line 21
type Variant = { id: string; qty: string; mrp: string; sellingPrice: string };
// line 40
[step, setStep] = useState<"form" | "preview" | "success">("form");
// line 41
[tab, setTab] = useState<WizardTab>("Basic Details");
// line 43
[productName, setProductName] = useState("");
// line 44
[productTag, setProductTag] = useState("");
// line 45
[shortDescription, setShortDescription] = useState("");
// line 46
[fullDescription, setFullDescription] = useState("");
// line 47
[images, setImages] = useState<string[]>([]);
// line 48
[variants, setVariants] = useState<Variant[]>([
    { id: "v1", qty: "1 kg", mrp: "540", sellingPrice: "460" },
    { id: "v2", qty: "5 kg", mrp: "680", sellingPrice: "590" },
  ]);
// line 53
[characteristics, setCharacteristics] = useState<string[]>([
    "Slender, fine grains",
    "Pearly white colour",
    "Naturally pleasant aroma",
    "Becomes soft and fluffy when cooked",
  ]);
// line 59
[nutritionRows, setNutritionRows] = useState<NutritionRow[]>([]);
// line 60
[cookingSteps, setCookingSteps] = useState(
    "1. Wash the rice 2-3 times.\n2. Add 2.5 cups of water for 1 cup of rice.\n3. Pressure cook for 3 whistles.",
  );
// line 63
[hasMethod, setHasMethod] = useState(true);
// line 64
[isEditingMethod, setIsEditingMethod] = useState(false);
// line 65
[healthBenefitIds, setHealthBenefitIds] = useState<string[]>([]);
// line 67
[testimonialIds, setTestimonialIds] = useState<string[]>([]);
// line 68
[offerTitle, setOfferTitle] = useState("");
// line 69
[offerType, setOfferType] = useState("Percentage");
// line 70
[discountValue, setDiscountValue] = useState("");
// line 71
[minOrder, setMinOrder] = useState("");
// line 72
[offerDescription, setOfferDescription] = useState("");
// line 73
[offerStartDate, setOfferStartDate] = useState("");
// line 74
[offerEndDate, setOfferEndDate] = useState("");
// line 76
[formError, setFormError] = useState<string | null>(null);
// line 77
[editingSku, setEditingSku] = useState<string | null>(null);
// line 79
[healthPickerOpen, setHealthPickerOpen] = useState(false);
// line 80
[nutrientPickerOpen, setNutrientPickerOpen] = useState(false);
// line 81
[testimonialPickerOpen, setTestimonialPickerOpen] = useState(false);
```

Lucide imports: <code>ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Droplet, Heart, Lightbulb, Plus, ShieldCheck, Star, Trash2, Upload, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 133, 347 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 134, 348 | Inherited / component-owned |  |
| <code>main</code> · 136, 350 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 137 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>button</code> · 138 | <code>&quot;mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70&quot;</code> | <code>aria-label=&quot;Back&quot;</code>; <code>onClick={() =&gt; setStep(&quot;form&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowLeft</code> · 144 | <code>&quot;h-6 w-6&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h1</code> · 147 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 148, 580, 631, 687, 721, 779 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 152 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]&quot;</code> |  |
| <code>div</code> · 153, 208, 228, 240, 254, 267, 310, 374, 463, 542, 578, 629, 685, 717, 775 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white p-6&quot;</code> |  |
| <code>div</code> · 154 | <code>&quot;flex flex-col gap-4 sm:flex-row&quot;</code> |  |
| <code>div</code> · 155 | <code>&quot;sm:w-[260px] sm:shrink-0&quot;</code> |  |
| <code>div</code> · 156 | <code>&quot;aspect-square overflow-hidden rounded-2xl bg-[#F5F5F7]&quot;</code> |  |
| <code>img</code> · 159 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>src={images[0]}</code> |
| <code>Image</code> · 161 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={260}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={260}</code> |
| <code>div</code> · 164 | <code>&quot;mt-2 grid grid-cols-4 gap-2&quot;</code> |  |
| <code>div</code> · 166 | <code>&quot;aspect-square overflow-hidden rounded-lg bg-[#F5F5F7]&quot;</code> |  |
| <code>img</code> · 169 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>src={images[index]}</code> |
| <code>Image</code> · 171 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={80}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={80}</code> |
| <code>div</code> · 178, 975 | <code>&quot;flex-1&quot;</code> |  |
| <code>h2</code> · 179 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 180 | <code>&quot;mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>Star</code> · 182 | <code>&quot;h-3.5 w-3.5 fill-[#F7931E] text-[#F7931E]&quot;</code> | <code>strokeWidth={0}</code> |
| <code>div</code> · 186 | <code>&quot;mt-2 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 187 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>span</code> · 188, 377, 545, 724 | <code>&quot;text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 189 | <code>&quot;rounded-full bg-[#EBF7EC] px-2.5 py-1 text-xs font-bold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 191 | <code>&quot;mt-3 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 194 | <code>&quot;mt-4 flex flex-wrap gap-4&quot;</code> |  |
| <code>div</code> · 196 | <code>&quot;flex w-16 flex-col items-center gap-1.5 text-center&quot;</code> |  |
| <code>span</code> · 197 | <code>{`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${badge.iconBg}`}</code> |  |
| <code>badge.icon</code> · 198 | <code>{`h-4 w-4 ${badge.iconColor}`}</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 200 | <code>&quot;text-[10px] font-bold uppercase leading-tight text-[#6B7280]&quot;</code> |  |
| <code>h3</code> · 209, 229, 241, 255, 269, 311, 465 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>div</code> · 210, 230 | <code>&quot;mt-3 flex flex-col gap-2&quot;</code> |  |
| <code>div</code> · 212 | <code>&quot;flex items-center justify-between rounded-xl bg-[#F9FAFB] p-3&quot;</code> |  |
| <code>p</code> · 214, 299 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 215, 977 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 217 | <code>&quot;text-right&quot;</code> |  |
| <code>p</code> · 218 | <code>&quot;text-sm font-bold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 219 | <code>&quot;text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 227 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 232 | <code>&quot;flex items-start gap-2 text-sm text-[#374151]&quot;</code> |  |
| <code>Check</code> · 233 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 242 | <code>&quot;mt-3 flex flex-col divide-y divide-[#F3F4F6]&quot;</code> |  |
| <code>div</code> · 244 | <code>&quot;flex items-center justify-between py-2 text-sm&quot;</code> |  |
| <code>span</code> · 245 | <code>&quot;text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 246 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 256 | <code>&quot;mt-3 flex flex-col gap-3&quot;</code> |  |
| <code>p</code> · 258 | <code>&quot;text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 266 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2&quot;</code> |  |
| <code>div</code> · 268, 464, 635, 776 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>div</code> · 271, 295, 550 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 272 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]&quot;</code> | <code>aria-label=&quot;Scroll reviews left&quot;</code>; <code>onClick={() =&gt; reviewsScrollRef.current?.scrollBy({ left: -260, behavior: &quot;smooth&quot; })}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 278 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 280 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]&quot;</code> | <code>aria-label=&quot;Scroll reviews right&quot;</code>; <code>onClick={() =&gt; reviewsScrollRef.current?.scrollBy({ left: 260, behavior: &quot;smooth&quot; })}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 286 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 292 | <code>&quot;scrollbar-hide mt-3 flex gap-3 overflow-x-auto scroll-smooth&quot;</code> |  |
| <code>div</code> · 294 | <code>&quot;w-[240px] shrink-0 rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>div</code> · 296 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-semibold text-white&quot;</code> |  |
| <code>p</code> · 301 | <code>&quot;mt-2 text-xs leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 306 | <code>&quot;mt-3 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 312 | <code>&quot;mt-3 whitespace-pre-line text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>div</code> · 316, 873 | <code>&quot;mt-6 flex items-center justify-end gap-6&quot;</code> |  |
| <code>button</code> · 317, 874 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; router.push(&quot;/super-admin/master-data/products?tab=Drafts&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 324 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;success&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>SuccessOverlay</code> · 335 | Inherited / component-owned | <code>onDone={() =&gt; router.push(&quot;/super-admin/master-data/products&quot;)}</code> |
| <code>PageHeader</code> · 351 | Inherited / component-owned | <code>backHref={editingSku ? `/super-admin/products/${editingSku}` : &quot;/super-admin/master-data/products&quot;}</code>; <code>subtitle=&quot;Add all the basic details of your new rice product&quot;</code>; <code>title={editingSku ? &quot;Edit Product Details&quot; : &quot;Add New Product&quot;}</code> |
| <code>div</code> · 357 | <code>&quot;mt-4 inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>button</code> · 359 | <code>{`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${ tab === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; setTab(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 373 | <code>&quot;mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]&quot;</code> |  |
| <code>div</code> · 375, 543, 718 | <code>&quot;flex items-center justify-between border-b border-[#F3F4F6] pb-4&quot;</code> |  |
| <code>h2</code> · 376 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 380 | <code>&quot;mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2&quot;</code> |  |
| <code>label</code> · 382, 392, 404, 415, 426 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>input</code> · 383 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setProductName(event.target.value)}</code>; <code>placeholder=&quot;e.g. Organic Ashwagandha Powder&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={productName}</code> |
| <code>input</code> · 393 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setProductTag(event.target.value)}</code>; <code>placeholder=&quot;e.g Trending&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={productTag}</code> |
| <code>div</code> · 403, 414, 425, 853 | <code>&quot;mt-4&quot;</code> |  |
| <code>input</code> · 405 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setShortDescription(event.target.value)}</code>; <code>placeholder=&quot;Brief tagline for the product list...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={shortDescription}</code> |
| <code>textarea</code> · 416 | <code>&quot;mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setFullDescription(event.target.value)}</code>; <code>placeholder=&quot;Describe the health benefits, origin, and detailed usage...&quot;</code>; <code>rows={5}</code>; <code>value={fullDescription}</code> |
| <code>div</code> · 427 | <code>&quot;mt-1.5 flex flex-wrap gap-3&quot;</code> |  |
| <code>button</code> · 428 | <code>&quot;flex h-[120px] w-[120px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#E5E7EB] text-[#9CA3AF] hover:border-[#F7931E]&quot;</code> | <code>onClick={() =&gt; imageInputRef.current?.click()}</code>; <code>type=&quot;button&quot;</code> |
| <code>Upload</code> · 433 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>span</code> · 434 | <code>&quot;text-xs font-medium&quot;</code> |  |
| <code>input</code> · 436 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/*&quot;</code>; <code>multiple=true</code>; <code>onChange={(event) =&gt; handleImageSelect(event.target.files)}</code>; <code>type=&quot;file&quot;</code> |
| <code>div</code> · 445 | <code>&quot;relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>img</code> · 447 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>src={url}</code> |
| <code>button</code> · 448 | <code>&quot;absolute right-1.5 top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow&quot;</code> | <code>onClick={() =&gt; setImages((prev) =&gt; prev.filter((_, i) =&gt; i !== index))}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 453 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>p</code> · 458 | <code>&quot;mt-2 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 462 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>button</code> · 466 | <code>&quot;flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-3 py-1.5 text-xs font-bold text-[#22C55E] hover:opacity-80&quot;</code> | <code>onClick={addVariant}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 471 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>p</code> · 475 | <code>&quot;mt-1 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 477 | <code>&quot;mt-3 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 484 | <code>&quot;mt-2 grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-2&quot;</code> |  |
| <code>input</code> · 485 | <code>&quot;rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setVariants((prev) =&gt; prev.map((v) =&gt; (v.id === variant.id ? { ...v, qty: event.target.value } : v)))}</code>; <code>type=&quot;text&quot;</code>; <code>value={variant.qty}</code> |
| <code>input</code> · 491 | <code>&quot;rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setVariants((prev) =&gt; prev.map((v) =&gt; (v.id === variant.id ? { ...v, mrp: event.target.value } : v)))}</code>; <code>type=&quot;text&quot;</code>; <code>value={variant.mrp}</code> |
| <code>input</code> · 497 | <code>&quot;rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setVariants((prev) =&gt; prev.map((v) =&gt; (v.id === variant.id ? { ...v, sellingPrice: event.target.value } : v)))}</code>; <code>type=&quot;text&quot;</code>; <code>value={variant.sellingPrice}</code> |
| <code>button</code> · 503 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>onClick={() =&gt; setVariants((prev) =&gt; prev.filter((v) =&gt; v.id !== variant.id))}</code>; <code>type=&quot;button&quot;</code> |
| <code>Trash2</code> · 508, 564, 615, 767 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 514 | <code>&quot;rounded-[28px] bg-[#F9FAFB] p-6&quot;</code> |  |
| <code>p</code> · 515 | <code>&quot;flex items-center gap-2 text-sm font-bold text-[#22C55E]&quot;</code> |  |
| <code>span</code> · 516 | <code>&quot;flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Lightbulb</code> · 517 | <code>&quot;h-3.5 w-3.5 text-[#22C55E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>ul</code> · 521 | <code>&quot;mt-3 flex flex-col gap-2 text-sm text-[#374151]&quot;</code> |  |
| <code>li</code> · 522, 526, 530 | <code>&quot;flex items-start gap-2&quot;</code> |  |
| <code>Check</code> · 523, 527, 531 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#374151]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 541 | <code>&quot;mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2&quot;</code> |  |
| <code>h3</code> · 544, 579, 630, 686, 720, 778 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 547 | <code>&quot;mt-3 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 548, 689 | <code>&quot;mt-4 flex flex-col gap-2.5&quot;</code> |  |
| <code>input</code> · 551 | <code>&quot;flex-1 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setCharacteristics((prev) =&gt; prev.map((c, i) =&gt; (i === index ? event.target.value : c))) }</code>; <code>type=&quot;text&quot;</code>; <code>value={item}</code> |
| <code>button</code> · 559 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>onClick={() =&gt; setCharacteristics((prev) =&gt; prev.filter((_, i) =&gt; i !== index))}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 568 | <code>&quot;mt-1 cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]&quot;</code> | <code>onClick={addCharacteristic}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 583 | <code>&quot;mt-4 grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 591 | <code>&quot;mt-2 grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] items-center gap-2&quot;</code> |  |
| <code>input</code> · 592 | <code>&quot;rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-black outline-none&quot;</code> | <code>type=&quot;text&quot;</code>; <code>value={row.name}</code> |
| <code>input</code> · 598 | <code>&quot;rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setNutritionRows((prev) =&gt; prev.map((r) =&gt; (r.id === row.id ? { ...r, value: event.target.value } : r)))}</code>; <code>type=&quot;text&quot;</code>; <code>value={row.value}</code> |
| <code>input</code> · 604 | <code>&quot;rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setNutritionRows((prev) =&gt; prev.map((r) =&gt; (r.id === row.id ? { ...r, unit: event.target.value } : r)))}</code>; <code>type=&quot;text&quot;</code>; <code>value={row.unit}</code> |
| <code>button</code> · 610 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>onClick={() =&gt; setNutritionRows((prev) =&gt; prev.filter((r) =&gt; r.id !== row.id))}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 620 | <code>&quot;mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]&quot;</code> | <code>onClick={() =&gt; setNutrientPickerOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 634 | <code>&quot;mt-4 rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>p</code> · 636 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>button</code> · 637 | <code>&quot;cursor-pointer text-xs font-bold text-[#EF4444] hover:opacity-80&quot;</code> | <code>onClick={() =&gt; { setHasMethod(false); setIsEditingMethod(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>textarea</code> · 650 | <code>&quot;mt-3 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#374151] outline-none focus:border-[#F7931E]&quot;</code> | <code>onBlur={() =&gt; setIsEditingMethod(false)}</code>; <code>onChange={(event) =&gt; setCookingSteps(event.target.value)}</code>; <code>rows={4}</code>; <code>value={cookingSteps}</code> |
| <code>p</code> · 659 | <code>&quot;mt-3 whitespace-pre-line rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>button</code> · 665 | <code>&quot;mt-3 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]&quot;</code> | <code>onClick={() =&gt; setIsEditingMethod(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 675 | <code>&quot;mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]&quot;</code> | <code>onClick={() =&gt; setHasMethod(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 691 | <code>&quot;flex items-start justify-between gap-2 rounded-xl border border-[#E5E7EB] px-4 py-3&quot;</code> |  |
| <code>p</code> · 692 | <code>&quot;text-sm text-[#374151]&quot;</code> |  |
| <code>button</code> · 693 | <code>&quot;shrink-0 cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>onClick={() =&gt; setHealthBenefitIds((prev) =&gt; prev.filter((id) =&gt; id !== item.id))}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 698 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 704 | <code>&quot;mt-4 w-full cursor-pointer rounded-xl border-2 border-dashed border-[#E5E7EB] py-3 text-sm font-semibold text-[#22C55E] hover:border-[#22C55E]&quot;</code> | <code>onClick={() =&gt; setHealthPickerOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 716 | <code>&quot;mt-5 flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 723 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>button</code> · 725 | <code>&quot;flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-4 py-2 text-sm font-bold text-[#22C55E] hover:opacity-80&quot;</code> | <code>onClick={() =&gt; setTestimonialPickerOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronDown</code> · 731 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 737 | <code>&quot;mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 738 | <code>&quot;w-[220px] text-center&quot;</code> |  |
| <code>span</code> · 739 | <code>&quot;w-[260px] text-center&quot;</code> |  |
| <code>span</code> · 740, 741 | <code>&quot;w-[160px] text-center&quot;</code> |  |
| <code>div</code> · 744 | <code>&quot;mt-2 flex flex-col gap-3&quot;</code> |  |
| <code>div</code> · 746 | <code>&quot;flex items-center justify-between rounded-2xl border border-black/[0.08] p-4&quot;</code> |  |
| <code>div</code> · 747 | <code>&quot;flex w-[220px] shrink-0 items-center gap-2.5&quot;</code> |  |
| <code>div</code> · 748 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-semibold text-[#22C55E]&quot;</code> |  |
| <code>span</code> · 751 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 753 | <code>&quot;flex w-[260px] shrink-0 items-center&quot;</code> |  |
| <code>p</code> · 754 | <code>&quot;line-clamp-3 text-sm text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 756 | <code>&quot;flex w-[160px] shrink-0 items-center justify-center gap-0.5&quot;</code> |  |
| <code>Star</code> · 758 | <code>{`h-3.5 w-3.5 ${index &lt; Math.round(item.rating) ? &quot;fill-[#F7931E] text-[#F7931E]&quot; : &quot;text-[#E5E7EB]&quot;}`}</code> | <code>strokeWidth={0}</code> |
| <code>div</code> · 761 | <code>&quot;flex w-[160px] shrink-0 items-center justify-center&quot;</code> |  |
| <code>button</code> · 762 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>onClick={() =&gt; setTestimonialIds((prev) =&gt; prev.filter((id) =&gt; id !== item.id))}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 781 | <code>&quot;flex cursor-pointer items-center gap-1.5 rounded-full bg-[#EBF7EC] px-4 py-2 text-sm font-bold text-[#22C55E] hover:opacity-80&quot;</code> | <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 785 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 790 | <code>&quot;mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5&quot;</code> |  |
| <code>div</code> · 791 | <code>&quot;grid grid-cols-1 gap-4 sm:grid-cols-3&quot;</code> |  |
| <code>label</code> · 793, 802, 813, 825, 834, 843, 854 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 794 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setOfferTitle(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={offerTitle}</code> |
| <code>select</code> · 803 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setOfferType(event.target.value)}</code>; <code>value={offerType}</code> |
| <code>div</code> · 814 | <code>&quot;relative mt-1.5&quot;</code> |  |
| <code>input</code> · 815 | <code>&quot;w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setDiscountValue(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={discountValue}</code> |
| <code>span</code> · 821 | <code>&quot;pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 826 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setOfferStartDate(event.target.value)}</code>; <code>type=&quot;date&quot;</code>; <code>value={offerStartDate}</code> |
| <code>input</code> · 835 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setOfferEndDate(event.target.value)}</code>; <code>type=&quot;date&quot;</code>; <code>value={offerEndDate}</code> |
| <code>input</code> · 844 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setMinOrder(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={minOrder}</code> |
| <code>textarea</code> · 855 | <code>&quot;mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setOfferDescription(event.target.value.slice(0, 200))}</code>; <code>rows={3}</code>; <code>value={offerDescription}</code> |
| <code>p</code> · 862 | <code>&quot;mt-1 text-right text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 870 | <code>&quot;mt-4 rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#EF4444]&quot;</code> |  |
| <code>button</code> · 881 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { if (tab === &quot;Basic Details&quot;) { if (!productName.trim()) { setFormError(&quot;Product Name is required before continuing.&quot;); return; } setFormError(null); setTab(&quot;Cooking &amp; benefits&quot;); } else if (tab === &quot;Cooking &amp; benefits&quot;) { setFormError(null); setTab(&quot;Reviews &amp; Offers&quot;); } else { const offerStarted = offerTitle.trim() &#124;&#124; offerStartDate &#124;&#124; offerEndDate; if (offerStarted &amp;&amp; (!offerTitle.trim() &#124;&#124; !offerStartDate &#124;&#124; !offerEndDate)) { setFormError(&quot;Offer Title, Start Date, and End Date are required to add an offer.&quot;); return; } setFormError(null); setStep(&quot;preview&quot;); } }}</code>; <code>type=&quot;button&quot;</code> |
| <code>HealthBenefitsPickerModal</code> · 911 | Inherited / component-owned | <code>onApply={setHealthBenefitIds}</code>; <code>onClose={() =&gt; setHealthPickerOpen(false)}</code>; <code>open={healthPickerOpen}</code> |
| <code>NutrientsPickerModal</code> · 917 | Inherited / component-owned | <code>onApply={applyNutrients}</code>; <code>onClose={() =&gt; setNutrientPickerOpen(false)}</code>; <code>open={nutrientPickerOpen}</code> |
| <code>TestimonialsPickerModal</code> · 923 | Inherited / component-owned | <code>onApply={setTestimonialIds}</code>; <code>onClose={() =&gt; setTestimonialPickerOpen(false)}</code>; <code>open={testimonialPickerOpen}</code> |
| <code>div</code> · 945 | <code>&quot;fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm&quot;</code> |  |
| <code>div</code> · 946 | <code>&quot;w-full max-w-[440px] rounded-[24px] bg-white p-8 text-center shadow-[0_32px_80px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>motion.div</code> · 947 | <code>&quot;mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 953 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 958 | <code>&quot;h-7 w-7 text-[#F7931E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 961 | <code>&quot;mt-4 text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 962 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 966 | <code>&quot;mt-5 flex items-center gap-3 rounded-2xl border border-[#F3F4F6] p-3 text-left&quot;</code> |  |
| <code>div</code> · 967 | <code>&quot;h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>img</code> · 970 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>src={imageUrl}</code> |
| <code>Image</code> · 972 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={48}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={48}</code> |
| <code>p</code> · 976 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>span</code> · 979 | <code>&quot;flex items-center gap-1 rounded-full bg-[#EBF7EC] px-2.5 py-1 text-[10px] font-bold text-[#22C55E]&quot;</code> |  |
| <code>span</code> · 980 | <code>&quot;h-1.5 w-1.5 rounded-full bg-[#22C55E]&quot;</code> |  |
| <code>button</code> · 985 | <code>&quot;mt-5 w-full cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onDone}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/products/page.tsx — 361 lines</summary>

Source: [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 27
[products, setProducts] = useState(INITIAL_PRODUCTS);
// line 28
[tab, setTab] = useState<Tab>("Published");
// line 29
[search, setSearch] = useState("");
// line 30
[stockProduct, setStockProduct] = useState<MasterProduct | null>(null);
// line 31
[visibilityTarget, setVisibilityTarget] = useState<MasterProduct | null>(null);
// line 32
[deleteTarget, setDeleteTarget] = useState<MasterProduct | null>(null);
// line 33
[relocationTarget, setRelocationTarget] = useState<{ product: MasterProduct; newGrid: number } | null>(null);
// line 34
[drafts, setDrafts] = useState(INITIAL_DRAFTS);
// line 313
[open, setOpen] = useState(false);
```

Lucide imports: <code>Calendar, Check, ChevronDown, Clock, Eye, EyeOff, Plus, Search, Trash2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 74 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 75 | Inherited / component-owned |  |
| <code>main</code> · 77 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 78 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Add all the basic details of your new rice product&quot;</code>; <code>title=&quot;Products&quot;</code> |
| <code>div</code> · 84 | <code>&quot;mt-6 flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 85 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>button</code> · 87 | <code>{`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${ tab === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; setTab(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 100 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 101 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 102 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 103 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>Link</code> · 111 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href=&quot;/super-admin/master-data/products/new&quot;</code> |
| <code>Plus</code> · 115 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 122 | <code>&quot;mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 124 | <code>&quot;col-span-full rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 129 | <code>&quot;flex flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>div</code> · 130 | <code>&quot;flex items-start justify-between&quot;</code> |  |
| <code>span</code> · 131 | <code>{`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryPillClasses(draft.category)}`}</code> |  |
| <code>button</code> · 134 | <code>&quot;cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#EF4444]&quot;</code> | <code>aria-label=&quot;Delete draft&quot;</code>; <code>onClick={() =&gt; handleDeleteDraft(draft.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Trash2</code> · 140 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h3</code> · 144 | <code>&quot;mt-3 text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 145 | <code>&quot;mt-1.5 flex-1 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 147 | <code>&quot;mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>span</code> · 148 | <code>&quot;flex items-center gap-1.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>Calendar</code> · 150 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Clock</code> · 152 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Link</code> · 157 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href={draft.resumeHref}</code> |
| <code>span</code> · 164 | <code>&quot;cursor-not-allowed whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white opacity-40&quot;</code> |  |
| <code>div</code> · 173 | <code>&quot;mt-5 flex flex-col gap-3&quot;</code> |  |
| <code>p</code> · 175 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 180 | <code>&quot;flex flex-wrap items-center gap-8 rounded-2xl border-2 border-black/[0.04] bg-white p-4&quot;</code> |  |
| <code>div</code> · 184 | <code>&quot;h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 185 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={56}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={56}</code> |
| <code>div</code> · 193 | <code>&quot;min-w-[220px] flex-1&quot;</code> |  |
| <code>div</code> · 194 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>p</code> · 195 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 197 | <code>&quot;rounded-md bg-[#F3F4F6] px-1.5 py-0.5 text-[10px] font-bold text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 202 | <code>&quot;truncate text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 205 | <code>&quot;w-[110px] shrink-0&quot;</code> |  |
| <code>p</code> · 206, 211, 226 | <code>&quot;text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 207 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>div</code> · 210 | <code>&quot;w-[120px] shrink-0&quot;</code> |  |
| <code>span</code> · 212 | <code>{`mt-0.5 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tagToneClasses(product.tagTone)}`}</code> |  |
| <code>div</code> · 217 | <code>&quot;w-[130px] shrink-0&quot;</code> |  |
| <code>p</code> · 218 | <code>&quot;whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>GridSelect</code> · 219 | Inherited / component-owned | <code>onChange={(grid) =&gt; setRelocationTarget({ product, newGrid: grid })}</code>; <code>value={product.storefrontGrid}</code> |
| <code>div</code> · 225 | <code>&quot;shrink-0 text-center&quot;</code> |  |
| <code>button</code> · 227 | <code>{`relative mt-1 flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${ product.visible ? &quot;bg-[#F7931E]&quot; : &quot;bg-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; setVisibilityTarget(product)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 234 | <code>{`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${ product.visible ? &quot;translate-x-[22px]&quot; : &quot;translate-x-0.5&quot; }`}</code> |  |
| <code>ProductRowMenu</code> · 242 | Inherited / component-owned | <code>onDelete={() =&gt; setDeleteTarget(product)}</code>; <code>onEditDetails={() =&gt; {}}</code>; <code>onStockStatus={() =&gt; setStockProduct(product)}</code> |
| <code>StockStatusModal</code> · 253 | Inherited / component-owned | <code>onClose={() =&gt; setStockProduct(null)}</code>; <code>open={stockProduct !== null}</code> |
| <code>ConfirmModal</code> · 255 | Inherited / component-owned | <code>onCancel={() =&gt; setVisibilityTarget(null)}</code>; <code>onClose={() =&gt; setVisibilityTarget(null)}</code>; <code>onConfirm={() =&gt; visibilityTarget &amp;&amp; toggleVisibility(visibilityTarget)}</code>; <code>open={visibilityTarget !== null}</code>; <code>title={visibilityTarget?.visible ? &quot;Hide Product from Storefront?&quot; : &quot;Publish Product to Storefront?&quot;}</code> |
| <code>ConfirmModal</code> · 279 | Inherited / component-owned | <code>onCancel={() =&gt; setDeleteTarget(null)}</code>; <code>onClose={() =&gt; setDeleteTarget(null)}</code>; <code>onConfirm={handleDelete}</code>; <code>open={deleteTarget !== null}</code>; <code>title=&quot;Delete this product?&quot;</code> |
| <code>RelocationConfirmModal</code> · 293 | Inherited / component-owned | <code>onClose={() =&gt; setRelocationTarget(null)}</code>; <code>onConfirm={() =&gt; { if (!relocationTarget) return; const { product, newGrid } = relocationTarget; setProducts((prev) =&gt; prev.map((item) =&gt; (item.id === product.id ? { ...item, storefrontGrid: newGrid } : item)), ); setRelocationTarget(null); }}</code>; <code>open={relocationTarget !== null}</code> |
| <code>div</code> · 326 | <code>&quot;relative mt-0.5&quot;</code> |  |
| <code>button</code> · 327 | <code>&quot;flex h-[33px] w-14 cursor-pointer items-center justify-between rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] px-2.5 text-sm font-semibold text-[#1D1D1F] outline-none focus:border-[#F7931E]&quot;</code> | <code>onClick={() =&gt; setOpen((prev) =&gt; !prev)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronDown</code> · 333 | <code>&quot;h-3 w-3 shrink-0 text-[#6B7280]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 337 | <code>&quot;absolute left-0 top-full z-20 mt-1.5 w-[100px] overflow-hidden rounded-xl border border-[#F3F4F6] bg-white py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 341 | <code>{`flex w-full cursor-pointer items-center justify-between px-3 py-1.5 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${ option === value ? &quot;font-semibold text-[#F7931E]&quot; : &quot;text-[#374151]&quot; }`}</code> | <code>onClick={() =&gt; { onChange(option); setOpen(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>Check</code> · 353 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/app/super-admin/master-data/tags/page.tsx — 109 lines</summary>

Source: [src/app/super-admin/master-data/tags/page.tsx](<src/app/super-admin/master-data/tags/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[tags, setTags] = useState(INITIAL_TAGS);
// line 15
[search, setSearch] = useState("");
// line 16
[page, setPage] = useState(1);
// line 17
[createOpen, setCreateOpen] = useState(false);
// line 18
[editingTag, setEditingTag] = useState<ProductTag | null>(null);
```

Lucide imports: <code>Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 33 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 34 | Inherited / component-owned |  |
| <code>main</code> · 36 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 37 | Inherited / component-owned | <code>backHref=&quot;/super-admin/master-data&quot;</code>; <code>subtitle=&quot;Manage tags shown on customer-facing product listings.&quot;</code>; <code>title=&quot;Product Tags&quot;</code> |
| <code>button</code> · 42 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setCreateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 47 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 53 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 54 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 55 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Health Benefits..&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 67 | <code>&quot;mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>div</code> · 69 | <code>&quot;flex min-h-[100px] flex-col justify-between rounded-2xl border-2 border-black/[0.04] bg-white p-6&quot;</code> |  |
| <code>h3</code> · 70 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>button</code> · 71 | <code>&quot;mt-3 cursor-pointer self-end rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]&quot;</code> | <code>onClick={() =&gt; setEditingTag(tag)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 82 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 83 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>FormModal</code> · 94 | Inherited / component-owned | <code>onClose={() =&gt; { setCreateOpen(false); setEditingTag(null); }}</code>; <code>onSubmit={handleCreate}</code>; <code>open={createOpen &#124;&#124; editingTag !== null}</code>; <code>title=&quot;Product Tag&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/offers/page.tsx — 202 lines</summary>

Source: [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
[offers, setOffers] = useState(OFFERS);
// line 19
[tab, setTab] = useState<Tab>("Coupon");
// line 20
[statusFilter, setStatusFilter] = useState<StatusFilter>("All Statuses");
// line 21
[search, setSearch] = useState("");
// line 22
[page, setPage] = useState(1);
// line 23
[launchOpen, setLaunchOpen] = useState(false);
// line 24
[editingOffer, setEditingOffer] = useState<Offer | null>(null);
```

Lucide imports: <code>Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 43 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 44 | Inherited / component-owned |  |
| <code>main</code> · 46 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 47 | Inherited / component-owned | <code>subtitle=&quot;Track the performance of all your marketing campaigns and offers&quot;</code>; <code>title=&quot;Active Offers&quot;</code> |
| <code>div</code> · 51 | <code>&quot;rounded-full border border-[#E5E7EB] bg-white&quot;</code> |  |
| <code>FilterDropdown</code> · 52 | Inherited / component-owned | <code>onChange={(value) =&gt; { setStatusFilter(value as StatusFilter); setPage(1); }}</code>; <code>value={statusFilter}</code> |
| <code>div</code> · 69 | <code>&quot;mt-6 flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 70 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>button</code> · 72 | <code>{`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${ tab === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; { setTab(option); setPage(1); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 88 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 89 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 90 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 91 | <code>&quot;w-[200px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>button</code> · 102 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setLaunchOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 107 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 113 | <code>&quot;mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 114 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 115 | <code>&quot;w-full min-w-[900px]&quot;</code> |  |
| <code>tr</code> · 117 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 118 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 119, 120, 121, 122, 123, 124 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 125 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>td</code> · 131 | <code>&quot;px-6 py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>tr</code> · 137 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 138 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>p</code> · 139 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 140, 149, 153 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 142, 147, 151, 157 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>span</code> · 143 | <code>&quot;inline-flex rounded-full bg-[#EBF7EC] px-2.5 py-1 text-xs font-semibold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 148 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 152 | <code>&quot;text-sm text-black&quot;</code> |  |
| <code>td</code> · 155, 156 | <code>&quot;px-4 py-4 text-sm text-black&quot;</code> |  |
| <code>span</code> · 158 | <code>{`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClasses(offer.status)}`}</code> |  |
| <code>td</code> · 164 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>button</code> · 165 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setEditingOffer(offer)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 179 | <code>&quot;border-t border-[#F3F4F6] px-6 pb-6 pt-4&quot;</code> |  |
| <code>Pagination</code> · 180 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>LaunchOfferModal</code> · 192 | Inherited / component-owned | <code>onClose={() =&gt; setLaunchOpen(false)}</code>; <code>open={launchOpen}</code> |
| <code>EditOfferModal</code> · 194 | Inherited / component-owned | <code>onClose={() =&gt; setEditingOffer(null)}</code>; <code>onSave={handleSaveOffer}</code>; <code>open={editingOffer !== null}</code> |

</details>

<details>
<summary>src/app/super-admin/page.tsx — 30 lines</summary>

Source: [src/app/super-admin/page.tsx](<src/app/super-admin/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 14 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 15 | Inherited / component-owned |  |
| <code>main</code> · 17 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 18 | <code>&quot;flex flex-col gap-6 lg:flex-row&quot;</code> |  |
| <code>TopSellingProductsCard</code> · 19 | Inherited / component-owned |  |
| <code>ActiveSupportTicketsCard</code> · 20 | Inherited / component-owned |  |
| <code>div</code> · 23 | <code>&quot;mt-6 flex flex-col gap-6 lg:flex-row&quot;</code> |  |
| <code>ActiveOffersCard</code> · 24 | Inherited / component-owned |  |
| <code>CustomerReviewsCard</code> · 25 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/super-admin/products/[sku]/page.tsx — 366 lines</summary>

Source: [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 76
[details] = useState({
    name: `Premium ${product.name}`,
    description: product.description,
    price: product.price,
    inStock: product.stock > 0,
  });
// line 82
[reviews, setReviews] = useState(INITIAL_REVIEWS);
```

Lucide imports: <code>ChevronDown, Droplet, Leaf, Pencil, ShieldCheck, Star, TrendingUp</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 96 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 97 | Inherited / component-owned |  |
| <code>main</code> · 99 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 100 | Inherited / component-owned | <code>backHref=&quot;/super-admin/products&quot;</code>; <code>subtitle=&quot;View comprehensive details and performance metrics of your product&quot;</code>; <code>title=&quot;Product details&quot;</code> |
| <code>div</code> · 106 | <code>&quot;mt-6 flex flex-col gap-6 lg:flex-row&quot;</code> |  |
| <code>div</code> · 107 | <code>&quot;rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:w-[320px] sm:shrink-0&quot;</code> |  |
| <code>div</code> · 108 | <code>&quot;aspect-square w-full overflow-hidden rounded-2xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 109 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt={product.name}</code>; <code>height={320}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={320}</code> |
| <code>div</code> · 117 | <code>&quot;mt-3 grid grid-cols-4 gap-2&quot;</code> |  |
| <code>div</code> · 119 | <code>&quot;aspect-square overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 120 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={70}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={70}</code> |
| <code>div</code> · 132 | <code>&quot;flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-6&quot;</code> |  |
| <code>div</code> · 133 | <code>&quot;flex items-start justify-between gap-3&quot;</code> |  |
| <code>span</code> · 134 | <code>{`inline-flex rounded-full px-3 py-1 text-xs font-bold ${ inStock ? &quot;bg-[#EBF7EC] text-[#22C55E]&quot; : &quot;bg-[#FEF2F2] text-[#EF4444]&quot; }`}</code> |  |
| <code>div</code> · 141 | <code>&quot;text-right&quot;</code> |  |
| <code>p</code> · 142, 197, 206, 216 | <code>&quot;text-xs font-medium uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 143 | <code>&quot;text-2xl font-bold text-[#22C55E]&quot;</code> |  |
| <code>span</code> · 144 | <code>&quot;text-sm font-medium text-[#6B7280]&quot;</code> |  |
| <code>h2</code> · 149 | <code>&quot;mt-3 text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 150 | <code>&quot;mt-1.5 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 152 | <code>&quot;mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 154 | <code>&quot;flex items-center gap-3 rounded-2xl bg-[#F9FAFB] p-3.5&quot;</code> |  |
| <code>span</code> · 158 | <code>{`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${feature.iconBg}`}</code> |  |
| <code>feature.icon</code> · 161 | <code>{`h-4 w-4 ${feature.iconColor}`}</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 164, 238, 264, 322 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 165, 239, 259, 265, 281, 323 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 171 | <code>&quot;mt-6 flex justify-end&quot;</code> |  |
| <code>Link</code> · 172 | <code>&quot;flex cursor-pointer items-center gap-2 rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href={`/super-admin/master-data/products/new?edit=${product.sku}`}</code> |
| <code>Pencil</code> · 176 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 183, 290 | <code>&quot;mt-6 rounded-[32px] border-2 border-black/[0.04] bg-white p-6&quot;</code> |  |
| <code>div</code> · 184, 291 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>h3</code> · 185, 292 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>div</code> · 186 | <code>&quot;relative&quot;</code> |  |
| <code>select</code> · 187 | <code>&quot;cursor-pointer appearance-none rounded-full bg-[#F3F4F6] py-1.5 pl-4 pr-8 text-xs font-medium text-[#374151] outline-none&quot;</code> |  |
| <code>ChevronDown</code> · 191 | <code>&quot;pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 195 | <code>&quot;mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3&quot;</code> |  |
| <code>div</code> · 198, 207 | <code>&quot;mt-1 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 199, 208 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>span</code> · 200, 209 | <code>&quot;flex items-center gap-0.5 text-xs font-semibold text-[#22C55E]&quot;</code> |  |
| <code>TrendingUp</code> · 201, 210 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>p</code> · 217 | <code>&quot;mt-1 text-[28px] font-bold text-black&quot;</code> |  |
| <code>div</code> · 222 | <code>&quot;mt-6 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>h3</code> · 223 | <code>&quot;px-6 pt-6 text-xl font-semibold text-black&quot;</code> |  |
| <code>div</code> · 224 | <code>&quot;mt-4 overflow-x-auto&quot;</code> |  |
| <code>table</code> · 225 | <code>&quot;w-full min-w-[720px]&quot;</code> |  |
| <code>tr</code> · 227 | <code>&quot;bg-[#F9FAFB] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 228 | <code>&quot;px-6 py-3&quot;</code> |  |
| <code>th</code> · 229, 230, 231, 232 | <code>&quot;px-4 py-3&quot;</code> |  |
| <code>tr</code> · 236 | <code>&quot;border-b border-[#F3F4F6]&quot;</code> |  |
| <code>td</code> · 237, 263 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>td</code> · 241, 267 | <code>&quot;px-4 py-4 text-sm text-black&quot;</code> |  |
| <code>td</code> · 242, 248, 257, 268, 274, 279 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>p</code> · 243 | <code>&quot;text-sm font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 244, 270 | <code>&quot;mt-1.5 h-1.5 w-[100px] overflow-hidden rounded-full bg-[#F3F4F6]&quot;</code> |  |
| <code>div</code> · 245 | <code>&quot;h-full w-3/4 rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>span</code> · 249 | <code>{`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${ kgStock &lt; 20 ? &quot;bg-[#FEF2F2] text-[#EF4444]&quot; : &quot;bg-[#F3F4F6] text-[#374151]&quot; }`}</code> |  |
| <code>p</code> · 258, 280 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 269 | <code>&quot;text-sm font-bold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 271 | <code>&quot;h-full w-1/5 rounded-full bg-[#EF4444]&quot;</code> |  |
| <code>span</code> · 275 | <code>&quot;inline-flex rounded-full bg-[#FEF2F2] px-2.5 py-1 text-[10px] font-bold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 287 | <code>&quot;h-2&quot;</code> |  |
| <code>div</code> · 293 | <code>&quot;flex items-center gap-1.5&quot;</code> |  |
| <code>span</code> · 294 | <code>&quot;text-xs font-medium text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 295, 326 | <code>&quot;flex items-center gap-0.5&quot;</code> |  |
| <code>Star</code> · 297 | <code>&quot;h-3.5 w-3.5 fill-[#F7931E] text-[#F7931E]&quot;</code> | <code>strokeWidth={0}</code> |
| <code>span</code> · 300 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>span</code> · 301 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 305 | <code>&quot;scrollbar-hide mt-4 flex max-h-[360px] flex-col gap-4 overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 307 | <code>{`shrink-0 rounded-2xl bg-[#F9FAFB] p-4 transition-opacity ${ review.visible ? &quot;opacity-100&quot; : &quot;opacity-50&quot; }`}</code> |  |
| <code>div</code> · 313 | <code>&quot;flex items-start justify-between gap-2&quot;</code> |  |
| <code>div</code> · 314 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 315 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white&quot;</code> |  |
| <code>Star</code> · 328 | <code>{`h-3 w-3 ${ index &lt; review.rating ? &quot;fill-[#F7931E] text-[#F7931E]&quot; : &quot;text-[#E5E7EB]&quot; }`}</code> | <code>strokeWidth={0}</code> |
| <code>p</code> · 338 | <code>&quot;mt-3 text-xs leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 340 | <code>&quot;mt-3 flex items-center justify-end gap-2 border-t border-black/5 pt-3&quot;</code> |  |
| <code>span</code> · 341 | <code>&quot;text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 344 | <code>{`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${ review.visible ? &quot;bg-[#F7931E]&quot; : &quot;bg-[#E5E7EB]&quot; }`}</code> | <code>aria-label=&quot;Toggle review visibility&quot;</code>; <code>onClick={() =&gt; toggleReviewVisibility(review.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 352 | <code>{`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${ review.visible ? &quot;translate-x-[22px]&quot; : &quot;translate-x-0.5&quot; }`}</code> |  |

</details>

<details>
<summary>src/app/super-admin/products/page.tsx — 195 lines</summary>

Source: [src/app/super-admin/products/page.tsx](<src/app/super-admin/products/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
[sortMode, setSortMode] = useState<SortMode>("ordered");
// line 19
[dateRange, setDateRange] = useState("30");
// line 20
[page, setPage] = useState(1);
```

Lucide imports: <code>Calendar</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 34 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 35 | Inherited / component-owned |  |
| <code>main</code> · 37 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 38 | Inherited / component-owned | <code>subtitle=&quot;Track product sales, stock availability and active orders.&quot;</code>; <code>title=&quot;Top Selling Products&quot;</code> |
| <code>div</code> · 43 | <code>&quot;mt-6 flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 44 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>button</code> · 45 | <code>{`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${ sortMode === &quot;ordered&quot; ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; { setSortMode(&quot;ordered&quot;); setPage(1); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 57 | <code>{`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${ sortMode === &quot;revenue&quot; ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; { setSortMode(&quot;revenue&quot;); setPage(1); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 71 | <code>&quot;rounded-full border border-[#E5E7EB] bg-white&quot;</code> |  |
| <code>FilterDropdown</code> · 72 | Inherited / component-owned | <code>onChange={setDateRange}</code>; <code>value={dateRange}</code> |
| <code>Calendar</code> · 75 | <code>&quot;h-4 w-4 shrink-0 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 85 | <code>&quot;mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 86 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 87 | <code>&quot;w-full min-w-[900px]&quot;</code> |  |
| <code>tr</code> · 89 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 90 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 91, 92, 93, 94, 95, 96 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 97 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>tr</code> · 104 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 105 | <code>&quot;px-6 py-4 text-sm font-bold text-black&quot;</code> |  |
| <code>td</code> · 108, 125, 137, 143, 150, 159 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>div</code> · 109 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 110 | <code>&quot;h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 111 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={44}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={44}</code> |
| <code>p</code> · 120 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 121 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 126 | <code>&quot;flex gap-1.5&quot;</code> |  |
| <code>span</code> · 128 | <code>&quot;rounded-md bg-[#E5EEFF] px-2 py-1 text-[11px] font-medium text-[#374151]&quot;</code> |  |
| <code>div</code> · 138 | <code>&quot;flex items-center gap-1.5 text-sm text-black&quot;</code> |  |
| <code>span</code> · 139 | <code>{`h-2 w-2 rounded-full ${stockDotColor(product.stock)}`}</code> |  |
| <code>p</code> · 144 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 145 | <code>{`text-xs ${product.ordersDelta &gt;= 0 ? &quot;text-[#22C55E]&quot; : &quot;text-[#EF4444]&quot;}`}</code> |  |
| <code>p</code> · 151 | <code>&quot;text-sm font-medium text-black&quot;</code> |  |
| <code>div</code> · 152 | <code>&quot;mt-1.5 h-1.5 w-[110px] overflow-hidden rounded-full bg-[#F3F4F6]&quot;</code> |  |
| <code>div</code> · 153 | <code>&quot;h-full rounded-full bg-[#F7931E]&quot;</code> | <code>style={{ width: `${product.salesPercent}%` }}</code> |
| <code>span</code> · 160 | <code>{`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tagPillClasses(performanceTag(product.salesPercent))}`}</code> |  |
| <code>td</code> · 166 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>Link</code> · 167 | <code>&quot;inline-block cursor-pointer rounded-full bg-[#F7931E] px-5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href={`/super-admin/products/${product.sku}`}</code> |
| <code>div</code> · 181 | <code>&quot;border-t border-[#F3F4F6] px-6 pb-6 pt-4&quot;</code> |  |
| <code>Pagination</code> · 182 | Inherited / component-owned | <code>onPageChange={setPage}</code> |

</details>

<details>
<summary>src/app/super-admin/revenue/page.tsx — 26 lines</summary>

Source: [src/app/super-admin/revenue/page.tsx](<src/app/super-admin/revenue/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 12 | <code>&quot;flex h-screen w-full flex-col overflow-hidden bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 13 | Inherited / component-owned |  |
| <code>div</code> · 15 | <code>&quot;relative flex flex-1 overflow-hidden&quot;</code> |  |
| <code>div</code> · 16 | <code>&quot;pointer-events-none w-full select-none overflow-hidden blur-sm&quot;</code> | <code>aria-hidden=true</code> |
| <code>DummyRevenueDashboard</code> · 17 | Inherited / component-owned |  |
| <code>div</code> · 20 | <code>&quot;absolute inset-0 flex items-center justify-center bg-black/5&quot;</code> |  |
| <code>ComingSoonCard</code> · 21 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/super-admin/reviews/page.tsx — 204 lines</summary>

Source: [src/app/super-admin/reviews/page.tsx](<src/app/super-admin/reviews/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 17
[reviews, setReviews] = useState(CUSTOMER_REVIEWS);
// line 18
[visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("All");
// line 19
[ratingFilter, setRatingFilter] = useState<RatingFilter>("All Ratings");
// line 20
[productFilter, setProductFilter] = useState("All Products");
// line 21
[search, setSearch] = useState("");
// line 22
[page, setPage] = useState(1);
```

Lucide imports: <code>Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 50 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 51 | Inherited / component-owned |  |
| <code>main</code> · 53 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 54 | Inherited / component-owned | <code>subtitle=&quot;Monitor your product satisfaction&quot;</code>; <code>title=&quot;Customer Reviews&quot;</code> |
| <code>div</code> · 56 | <code>&quot;mt-6 flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>FilterDropdown</code> · 58 | Inherited / component-owned | <code>onChange={(value) =&gt; { setRatingFilter(value as RatingFilter); setPage(1); }}</code>; <code>value={ratingFilter}</code> |
| <code>FilterDropdown</code> · 74 | Inherited / component-owned | <code>onChange={(value) =&gt; { setProductFilter(value); setPage(1); }}</code>; <code>value={productFilter}</code> |
| <code>FilterDropdown</code> · 83 | Inherited / component-owned | <code>onChange={(value) =&gt; { setVisibilityFilter(value as VisibilityFilter); setPage(1); }}</code>; <code>value={visibilityFilter}</code> |
| <code>div</code> · 98 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 99 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 100 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 113 | <code>&quot;mt-5 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 114 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 115 | <code>&quot;w-full min-w-[900px]&quot;</code> |  |
| <code>tr</code> · 117 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 118 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 119, 120, 121, 122 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 123 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>td</code> · 129 | <code>&quot;px-6 py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>tr</code> · 135 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 136 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>div</code> · 137 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 138 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white&quot;</code> |  |
| <code>p</code> · 145 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 146, 152, 161 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 150, 154, 159 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>p</code> · 151, 160 | <code>&quot;text-sm text-black&quot;</code> |  |
| <code>StarRating</code> · 155 | Inherited / component-owned | <code>rating={review.rating}</code> |
| <code>p</code> · 156 | <code>&quot;mt-0.5 text-xs font-semibold text-black&quot;</code> |  |
| <code>td</code> · 158 | <code>&quot;max-w-[260px] px-4 py-4 text-sm text-[#6B7280]&quot;</code> |  |
| <code>td</code> · 163 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>div</code> · 164 | <code>&quot;flex items-center justify-end gap-2&quot;</code> |  |
| <code>span</code> · 165 | <code>&quot;text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 168 | <code>{`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${ review.visible ? &quot;bg-[#F7931E]&quot; : &quot;bg-[#E5E7EB]&quot; }`}</code> | <code>aria-label=&quot;Toggle visibility&quot;</code>; <code>onClick={() =&gt; toggleVisibility(review.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 176 | <code>{`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${ review.visible ? &quot;translate-x-[22px]&quot; : &quot;translate-x-0.5&quot; }`}</code> |  |
| <code>div</code> · 190 | <code>&quot;border-t border-[#F3F4F6] px-6 pb-6 pt-4&quot;</code> |  |
| <code>Pagination</code> · 191 | Inherited / component-owned | <code>onPageChange={setPage}</code> |

</details>

<details>
<summary>src/app/super-admin/site-content/banners/new/page.tsx — 306 lines</summary>

Source: [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 26
[step, setStep] = useState<"editor" | "preview" | "success">("editor");
// line 27
[saveDraftOpen, setSaveDraftOpen] = useState(false);
// line 29
[placement, setPlacement] = useState(PLACEMENTS[0]);
// line 30
[placementOpen, setPlacementOpen] = useState(false);
// line 31
[startDate, setStartDate] = useState(new Date(2026, 7, 1));
// line 32
[endDate, setEndDate] = useState(new Date(2026, 7, 15));
// line 33
[imageUrl, setImageUrl] = useState<string | null>(null);
// line 34
[dragOver, setDragOver] = useState(false);
```

Lucide imports: <code>ArrowLeft, Check, ChevronDown, EyeOff, ShoppingCart, Upload, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 43, 147 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 44, 148 | Inherited / component-owned |  |
| <code>main</code> · 46, 150 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 47, 151 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>button</code> · 48 | <code>&quot;mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70&quot;</code> | <code>aria-label=&quot;Back&quot;</code>; <code>onClick={() =&gt; setStep(&quot;editor&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowLeft</code> · 54, 158 | <code>&quot;h-6 w-6&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h1</code> · 57, 161 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 58, 162 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 62 | <code>&quot;mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB]&quot;</code> |  |
| <code>div</code> · 63 | <code>&quot;flex items-center gap-4 border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5&quot;</code> |  |
| <code>div</code> · 64 | <code>&quot;flex items-center gap-1.5&quot;</code> |  |
| <code>span</code> · 65 | <code>&quot;h-2.5 w-2.5 rounded-full bg-[#EF4444]&quot;</code> |  |
| <code>span</code> · 66 | <code>&quot;h-2.5 w-2.5 rounded-full bg-[#F59E0B]&quot;</code> |  |
| <code>span</code> · 67 | <code>&quot;h-2.5 w-2.5 rounded-full bg-[#22C55E]&quot;</code> |  |
| <code>span</code> · 69 | <code>&quot;flex-1 rounded-md bg-white px-3 py-1 text-center text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 74 | <code>&quot;flex items-center justify-between px-8 py-5&quot;</code> |  |
| <code>span</code> · 75 | <code>&quot;text-lg font-bold text-[#F7931E]&quot;</code> |  |
| <code>span</code> · 76 | <code>&quot;text-[#22C55E]&quot;</code> |  |
| <code>nav</code> · 78 | <code>&quot;flex items-center gap-8 text-sm font-medium text-black&quot;</code> |  |
| <code>span</code> · 80, 81, 82 | <code>&quot;text-[#9CA3AF]&quot;</code> |  |
| <code>ShoppingCart</code> · 84 | <code>&quot;h-5 w-5 text-black&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 87 | <code>&quot;relative mx-8 mb-8 flex h-[340px] flex-col justify-center overflow-hidden rounded-2xl px-10&quot;</code> | <code>style={{ backgroundImage: imageUrl ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})` : &quot;linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)&quot;, backgroundSize: &quot;cover&quot;, backgroundPosition: &quot;center&quot;, }}</code> |
| <code>p</code> · 97, 267 | <code>&quot;text-xs font-semibold uppercase tracking-[0.2em] text-white/80&quot;</code> |  |
| <code>h2</code> · 98 | <code>&quot;mt-2 text-4xl font-bold text-white&quot;</code> |  |
| <code>span</code> · 99 | <code>&quot;mt-4 w-fit rounded-lg bg-[#F7931E] px-5 py-2.5 text-sm font-bold text-white&quot;</code> |  |
| <code>div</code> · 104 | <code>&quot;px-8 pb-10&quot;</code> |  |
| <code>h3</code> · 105 | <code>&quot;text-center text-2xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 106 | <code>&quot;mt-6 grid grid-cols-3 gap-6&quot;</code> |  |
| <code>div</code> · 108 | <code>&quot;rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>div</code> · 109 | <code>&quot;aspect-square rounded-xl bg-[#E5E7EB]&quot;</code> |  |
| <code>p</code> · 110 | <code>&quot;mt-3 text-center text-base font-semibold text-black&quot;</code> |  |
| <code>div</code> · 117, 281 | <code>&quot;mt-6 flex items-center justify-end gap-6&quot;</code> |  |
| <code>button</code> · 118 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setStep(&quot;editor&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 125 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;success&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>BannerScheduledModal</code> · 135 | Inherited / component-owned | <code>onDone={() =&gt; router.push(&quot;/super-admin/site-content&quot;)}</code>; <code>open={step === &quot;success&quot;}</code> |
| <code>button</code> · 152 | <code>&quot;mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70&quot;</code> | <code>aria-label=&quot;Back&quot;</code>; <code>onClick={() =&gt; router.push(&quot;/super-admin/site-content&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 166 | <code>&quot;mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6&quot;</code> |  |
| <code>p</code> · 167, 223 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 168 | <code>{`mt-3 flex h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${ dragOver ? &quot;border-[#F7931E] bg-[#FEF9F0]&quot; : &quot;border-[#E5C9A0] bg-[#FAFAF8]&quot; }`}</code> | <code>onClick={() =&gt; fileInputRef.current?.click()}</code>; <code>onDragLeave={() =&gt; setDragOver(false)}</code>; <code>onDragOver={(event) =&gt; { event.preventDefault(); setDragOver(true); }}</code>; <code>onDrop={(event) =&gt; { event.preventDefault(); setDragOver(false); handleFile(event.dataTransfer.files?.[0]); }}</code> |
| <code>input</code> · 184 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/*&quot;</code>; <code>onChange={(event) =&gt; handleFile(event.target.files?.[0])}</code>; <code>type=&quot;file&quot;</code> |
| <code>div</code> · 192 | <code>&quot;group relative h-full w-full overflow-hidden rounded-xl&quot;</code> |  |
| <code>img</code> · 194 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;Banner preview&quot;</code>; <code>src={imageUrl}</code> |
| <code>div</code> · 195 | <code>&quot;absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40&quot;</code> |  |
| <code>span</code> · 196 | <code>&quot;rounded-full bg-white px-4 py-2 text-sm font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100&quot;</code> |  |
| <code>button</code> · 200 | <code>&quot;absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow transition-opacity hover:opacity-90&quot;</code> | <code>aria-label=&quot;Remove banner image&quot;</code>; <code>onClick={(event) =&gt; { event.stopPropagation(); setImageUrl(null); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 209 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>Upload</code> · 214 | <code>&quot;h-6 w-6 text-[#C79A5B]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>p</code> · 215 | <code>&quot;mt-3 text-sm font-medium text-[#374151]&quot;</code> |  |
| <code>p</code> · 216 | <code>&quot;mt-1 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 222 | <code>&quot;relative mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6&quot;</code> |  |
| <code>div</code> · 225 | <code>&quot;relative mt-3&quot;</code> |  |
| <code>label</code> · 226 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>button</code> · 227 | <code>&quot;mt-1.5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-left text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onClick={() =&gt; setPlacementOpen((prev) =&gt; !prev)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronDown</code> · 233 | <code>{`h-4 w-4 text-[#9CA3AF] transition-transform ${placementOpen ? &quot;rotate-180&quot; : &quot;&quot;}`}</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 237 | <code>&quot;absolute left-0 top-full z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#F3F4F6] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 239 | <code>{`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${ option === placement ? &quot;bg-[#FEF3E2] font-semibold text-[#F7931E]&quot; : &quot;text-[#374151]&quot; }`}</code> | <code>onClick={() =&gt; { setPlacement(option); setPlacementOpen(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>Check</code> · 251 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 258 | <code>&quot;mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2&quot;</code> |  |
| <code>DateField</code> · 259 | Inherited / component-owned | <code>label=&quot;Start Date&quot;</code>; <code>onChange={setStartDate}</code>; <code>value={startDate}</code> |
| <code>DateField</code> · 260 | Inherited / component-owned | <code>label=&quot;End Date&quot;</code>; <code>onChange={setEndDate}</code>; <code>value={endDate}</code> |
| <code>div</code> · 264 | <code>&quot;mt-6 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]&quot;</code> |  |
| <code>div</code> · 266 | <code>&quot;relative flex h-[220px] flex-col justify-center px-8&quot;</code> | <code>style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.15)), url(${imageUrl})`, backgroundSize: &quot;cover&quot;, backgroundPosition: &quot;center&quot; }}</code> |
| <code>h3</code> · 268 | <code>&quot;mt-2 text-2xl font-bold text-white&quot;</code> |  |
| <code>div</code> · 271 | <code>&quot;flex h-[220px] flex-col items-center justify-center gap-2 text-center&quot;</code> |  |
| <code>EyeOff</code> · 272 | <code>&quot;h-6 w-6 text-[#9CA3AF]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>p</code> · 273 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 274 | <code>&quot;max-w-[300px] text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 282 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setSaveDraftOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 289 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;preview&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>SaveDraftModal</code> · 299 | Inherited / component-owned | <code>onKeepEditing={() =&gt; setSaveDraftOpen(false)}</code>; <code>onSaveAsDraft={() =&gt; router.push(&quot;/super-admin/site-content?tab=Drafts&quot;)}</code>; <code>open={saveDraftOpen}</code> |

</details>

<details>
<summary>src/app/super-admin/site-content/blogs/[id]/page.tsx — 452 lines</summary>

Source: [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 48
[mode, setMode] = useState<"edit" | "preview">("edit");
// line 49
[saveDraftOpen, setSaveDraftOpen] = useState(false);
// line 50
[postStatus, setPostStatus] = useState<BlogStatus>(existing?.status ?? "Draft");
// line 51
[publishConfirmOpen, setPublishConfirmOpen] = useState(false);
// line 52
[title, setTitle] = useState(existing?.title ?? "");
// line 53
[postHeading, setPostHeading] = useState(
    existing
      ? "Exploring the deep-rooted connections between Vedic wisdom and modern regenerative agriculture at Veda Bharath."
      : "",
  );
// line 58
[subHeading, setSubHeading] = useState(
    existing
      ? "Exploring the deep-rooted connections between Vedic wisdom and modern regenerative agriculture at Veda Bharath."
      : "",
  );
// line 63
[tags, setTags] = useState(existing ? existing.tags.map((tag) => tag.replace("#", "")) : []);
// line 64
[tagInput, setTagInput] = useState("");
// line 65
[sections, setSections] = useState(
    existing ? DEFAULT_SECTIONS : [{ id: "s1", title: "", body: "" }],
  );
// line 68
[author, setAuthor] = useState("VedaBharat Natural Food Products Pvt Ltd");
// line 69
[heroImage, setHeroImage] = useState<string | null>(null);
```

Lucide imports: <code>ArrowLeft, Check, ChevronDown, ChevronUp, ImagePlus, Pencil, Plus, Trash2, X,</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 114 | <code>&quot;flex min-h-screen w-full flex-col bg-white&quot;</code> |  |
| <code>div</code> · 115 | <code>&quot;flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4 sm:px-10 lg:px-16&quot;</code> |  |
| <code>button</code> · 116 | <code>&quot;flex cursor-pointer items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-black&quot;</code> | <code>onClick={() =&gt; setMode(&quot;edit&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowLeft</code> · 121 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 124 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { setPostStatus(&quot;Published&quot;); setPublishConfirmOpen(true); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 136 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={() =&gt; setPublishConfirmOpen(false)}</code>; <code>open={publishConfirmOpen}</code> |
| <code>div</code> · 137 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 138 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 144 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 149 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 153, 194 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 154 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 155, 185, 265 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>button</code> · 158 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; router.push(&quot;/super-admin/site-content&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 168 | <code>&quot;relative h-[420px] w-full bg-cover bg-center&quot;</code> | <code>style={heroImage ? { backgroundImage: `url(${heroImage})` } : { backgroundImage: heroGradient }}</code> |
| <code>button</code> · 172, 240 | <code>&quot;absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm&quot;</code> | <code>onClick={() =&gt; heroInputRef.current?.click()}</code>; <code>type=&quot;button&quot;</code> |
| <code>ImagePlus</code> · 177, 245, 323 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 182 | <code>&quot;mx-auto w-full max-w-[760px] px-6 py-10&quot;</code> |  |
| <code>h1</code> · 183 | <code>&quot;text-4xl font-bold leading-tight text-black&quot;</code> |  |
| <code>p</code> · 184 | <code>&quot;mt-3 text-sm text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 188 | <code>&quot;mt-5 text-base leading-relaxed text-[#374151]&quot;</code> |  |
| <code>div</code> · 193 | <code>&quot;mt-6&quot;</code> |  |
| <code>p</code> · 195 | <code>&quot;mt-2 text-base leading-relaxed text-[#374151]&quot;</code> |  |
| <code>div</code> · 204 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 205 | Inherited / component-owned |  |
| <code>main</code> · 207 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 208, 276 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>button</code> · 209 | <code>&quot;mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70&quot;</code> | <code>aria-label=&quot;Back&quot;</code>; <code>onClick={() =&gt; router.push(&quot;/super-admin/site-content&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowLeft</code> · 215 | <code>&quot;h-6 w-6&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h1</code> · 218 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 219 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 223 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]&quot;</code> |  |
| <code>div</code> · 225 | <code>&quot;relative h-[280px] w-full overflow-hidden rounded-2xl bg-cover bg-center&quot;</code> | <code>style={heroImage ? { backgroundImage: `url(${heroImage})` } : { backgroundImage: heroGradient }}</code> |
| <code>button</code> · 229 | <code>{`absolute left-4 top-4 flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold hover:bg-[#F9FAFB] ${STATUS_DOT[postStatus]}`}</code> | <code>onClick={() =&gt; setPostStatus((prev) =&gt; STATUS_CYCLE[(STATUS_CYCLE.indexOf(prev) + 1) % STATUS_CYCLE.length]) }</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 236 | <code>{`h-1.5 w-1.5 rounded-full ${STATUS_DOT[postStatus].replace(&quot;text-&quot;, &quot;bg-&quot;)}`}</code> |  |
| <code>Pencil</code> · 238 | <code>&quot;h-3 w-3 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 248 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/*&quot;</code>; <code>onChange={(event) =&gt; handleHeroImageSelect(event.target.files)}</code>; <code>type=&quot;file&quot;</code> |
| <code>textarea</code> · 257 | <code>&quot;mt-5 w-full resize-none border-none bg-transparent text-3xl font-bold leading-tight text-black outline-none placeholder:text-[#D1D5DB]&quot;</code> | <code>onChange={(event) =&gt; setTitle(event.target.value)}</code>; <code>placeholder=&quot;Add your blog title...&quot;</code>; <code>rows={2}</code>; <code>value={title}</code> |
| <code>p</code> · 264 | <code>&quot;mt-2 text-sm text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 269 | <code>&quot;mt-4 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>div</code> · 274 | <code>&quot;mt-6 flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 277 | <code>&quot;flex shrink-0 flex-col items-center gap-2 pt-1&quot;</code> |  |
| <code>button</code> · 278 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-black disabled:opacity-30&quot;</code> | <code>disabled={index === 0}</code>; <code>onClick={() =&gt; moveSection(index, -1)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronUp</code> · 284 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 286 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-black disabled:opacity-30&quot;</code> | <code>disabled={index === sections.length - 1}</code>; <code>onClick={() =&gt; moveSection(index, 1)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronDown</code> · 292 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 294 | <code>&quot;cursor-pointer text-[#EF4444] hover:opacity-70&quot;</code> | <code>onClick={() =&gt; removeSection(section.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Trash2</code> · 299 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 303 | <code>&quot;flex-1 rounded-2xl border-2 border-[#22C55E]/40 p-5&quot;</code> |  |
| <code>input</code> · 304 | <code>&quot;w-full border-none bg-transparent text-lg font-bold text-black outline-none placeholder:text-[#9CA3AF]&quot;</code> | <code>onChange={(event) =&gt; setSections((prev) =&gt; prev.map((item) =&gt; (item.id === section.id ? { ...item, title: event.target.value } : item)), ) }</code>; <code>placeholder=&quot;Section title...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={section.title}</code> |
| <code>p</code> · 315 | <code>&quot;mt-2 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>textarea</code> · 316 | <code>&quot;mt-2 w-full resize-none border-none bg-transparent text-sm text-[#9CA3AF] outline-none&quot;</code> | <code>placeholder=&quot;Continue writing here...&quot;</code>; <code>rows={1}</code> |
| <code>div</code> · 322 | <code>&quot;mt-4 flex h-[100px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#BBE5C4] bg-[#F0FDF4] text-[#6B7280] transition-colors hover:bg-[#E6FBEA]&quot;</code> |  |
| <code>span</code> · 324 | <code>&quot;text-xs font-medium&quot;</code> |  |
| <code>button</code> · 331 | <code>&quot;mt-6 flex w-full cursor-pointer items-center justify-center gap-2 border-t border-dashed border-[#E5E7EB] pt-6 text-sm font-bold text-[#F7931E] hover:text-[#e07f0e]&quot;</code> | <code>onClick={addSection}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 336 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 341 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>div</code> · 342, 353, 364 | <code>&quot;rounded-2xl border border-[#E5E7EB] bg-white p-5&quot;</code> |  |
| <code>p</code> · 343, 354, 365, 408, 417 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>textarea</code> · 344 | <code>&quot;mt-2 w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setPostHeading(event.target.value)}</code>; <code>placeholder=&quot;Write a short heading for this post...&quot;</code>; <code>rows={4}</code>; <code>value={postHeading}</code> |
| <code>textarea</code> · 355 | <code>&quot;mt-2 w-full resize-none rounded-xl border border-[#E5E7EB] p-3 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSubHeading(event.target.value)}</code>; <code>placeholder=&quot;Write a supporting sub heading...&quot;</code>; <code>rows={4}</code>; <code>value={subHeading}</code> |
| <code>div</code> · 366 | <code>&quot;mt-2 flex flex-wrap items-center gap-2&quot;</code> |  |
| <code>span</code> · 368 | <code>&quot;flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>button</code> · 373 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-[#EF4444]&quot;</code> | <code>aria-label={`Remove ${tag}`}</code>; <code>onClick={() =&gt; removeTag(tag)}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 379 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 384 | <code>&quot;mt-2 flex items-center gap-2&quot;</code> |  |
| <code>input</code> · 385 | <code>&quot;w-full rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setTagInput(event.target.value)}</code>; <code>onKeyDown={(event) =&gt; { if (event.key === &quot;Enter&quot;) { event.preventDefault(); addTag(); } }}</code>; <code>placeholder=&quot;Write a tag and press Enter&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={tagInput}</code> |
| <code>button</code> · 398 | <code>&quot;shrink-0 cursor-pointer rounded-full border border-dashed border-[#F7931E] px-3 py-1.5 text-xs font-semibold text-[#F7931E] hover:bg-[#FEF3E2]&quot;</code> | <code>onClick={addTag}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 407 | <code>&quot;mt-4 border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>input</code> · 409 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-3 py-2 text-sm font-semibold text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setAuthor(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={author}</code> |
| <code>div</code> · 416 | <code>&quot;mt-3&quot;</code> |  |
| <code>p</code> · 418 | <code>&quot;mt-1 text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 422 | <code>&quot;flex items-center justify-end gap-6&quot;</code> |  |
| <code>button</code> · 423 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setSaveDraftOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 430 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setMode(&quot;preview&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>SaveDraftModal</code> · 442 | Inherited / component-owned | <code>onKeepEditing={() =&gt; setSaveDraftOpen(false)}</code>; <code>onSaveAsDraft={() =&gt; { setPostStatus(&quot;Draft&quot;); router.push(&quot;/super-admin/site-content?tab=Drafts&quot;); }}</code>; <code>open={saveDraftOpen}</code> |

</details>

<details>
<summary>src/app/super-admin/site-content/blogs/page.tsx — 99 lines</summary>

Source: [src/app/super-admin/site-content/blogs/page.tsx](<src/app/super-admin/site-content/blogs/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[search, setSearch] = useState("");
// line 15
[page, setPage] = useState(1);
```

Lucide imports: <code>Pencil, Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 24 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 25 | Inherited / component-owned |  |
| <code>main</code> · 27 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 28 | Inherited / component-owned | <code>backHref=&quot;/super-admin/site-content&quot;</code>; <code>subtitle=&quot;Browse, search, and manage every article in one place.&quot;</code>; <code>title=&quot;All Blogs&quot;</code> |
| <code>Link</code> · 33 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href=&quot;/super-admin/site-content/blogs/new&quot;</code> |
| <code>Plus</code> · 37 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 43 | <code>&quot;relative mt-6&quot;</code> |  |
| <code>Search</code> · 44 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 45 | <code>&quot;w-full rounded-full border border-[#E5E7EB] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search blogs...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 57 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 59 | <code>&quot;col-span-full rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>Link</code> · 64 | <code>&quot;flex items-center gap-3 rounded-2xl border-2 border-black/[0.04] bg-white p-3 transition-colors hover:border-[#F7931E]/30&quot;</code> | <code>href={`/super-admin/site-content/blogs/${blog.id}`}</code> |
| <code>div</code> · 69 | <code>&quot;h-14 w-14 shrink-0 rounded-xl&quot;</code> | <code>style={{ backgroundImage: blog.gradient }}</code> |
| <code>div</code> · 70 | <code>&quot;min-w-0 flex-1&quot;</code> |  |
| <code>span</code> · 71 | <code>{`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusPillClasses(blog.status)}`}</code> |  |
| <code>p</code> · 76 | <code>&quot;mt-1 truncate text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 77 | <code>&quot;mt-0.5 flex items-center gap-1 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>Pencil</code> · 78 | <code>&quot;h-3 w-3 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 86 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 87 | Inherited / component-owned | <code>onPageChange={setPage}</code> |

</details>

<details>
<summary>src/app/super-admin/site-content/page.tsx — 286 lines</summary>

Source: [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
[tab, setTab] = useState<Tab>("Blogs");
// line 19
[search, setSearch] = useState("");
```

Lucide imports: <code>ChevronRight, Eye, Pencil, Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 47 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 48 | Inherited / component-owned |  |
| <code>main</code> · 50 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 51 | <code>&quot;flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 52 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>button</code> · 54 | <code>{`cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors ${ tab === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; setTab(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 67, 246 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 68 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 69 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 70 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>Link</code> · 80 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href=&quot;/super-admin/site-content/blogs/new&quot;</code> |
| <code>Plus</code> · 84, 93 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>Link</code> · 89 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href=&quot;/super-admin/site-content/banners/new&quot;</code> |
| <code>div</code> · 101 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]&quot;</code> |  |
| <code>div</code> · 103 | <code>&quot;relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-[32px] p-8&quot;</code> | <code>style={{ backgroundImage: featured.gradient }}</code> |
| <code>div</code> · 107 | <code>&quot;absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent&quot;</code> |  |
| <code>div</code> · 108 | <code>&quot;relative flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 109, 112 | <code>&quot;rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm&quot;</code> |  |
| <code>h2</code> · 116 | <code>&quot;relative mt-4 text-3xl font-bold leading-tight text-white&quot;</code> |  |
| <code>p</code> · 117 | <code>&quot;relative mt-3 max-w-[520px] text-sm leading-relaxed text-white/80&quot;</code> |  |
| <code>div</code> · 120 | <code>&quot;relative mt-6 flex items-center justify-between border-t border-white/20 pt-5&quot;</code> |  |
| <code>span</code> · 121 | <code>&quot;flex items-center gap-1.5 text-sm text-white/80&quot;</code> |  |
| <code>Eye</code> · 122 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Link</code> · 125 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>href={`/super-admin/site-content/blogs/${featured.id}`}</code> |
| <code>h3</code> · 136 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 137 | <code>&quot;mt-4 flex flex-col gap-3&quot;</code> |  |
| <code>Link</code> · 139 | <code>&quot;flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/[0.04] bg-white p-3 transition-colors hover:border-[#F7931E]/30&quot;</code> | <code>href={`/super-admin/site-content/blogs/${blog.id}`}</code> |
| <code>div</code> · 144 | <code>&quot;h-14 w-14 shrink-0 rounded-xl&quot;</code> | <code>style={{ backgroundImage: blog.gradient }}</code> |
| <code>div</code> · 148, 189 | <code>&quot;min-w-0 flex-1&quot;</code> |  |
| <code>span</code> · 149 | <code>{`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusPillClasses(blog.status)}`}</code> |  |
| <code>p</code> · 154 | <code>&quot;mt-1 truncate text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 155 | <code>&quot;mt-0.5 flex items-center gap-1 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>Pencil</code> · 156 | <code>&quot;h-3 w-3 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Link</code> · 164 | <code>&quot;mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>href=&quot;/super-admin/site-content/blogs&quot;</code> |
| <code>ChevronRight</code> · 169 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 176 | <code>&quot;mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]&quot;</code> |  |
| <code>div</code> · 177 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 179 | <code>&quot;flex items-center gap-4 rounded-[28px] border-2 border-black/[0.04] bg-white p-4&quot;</code> |  |
| <code>div</code> · 180 | <code>&quot;relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl&quot;</code> | <code>style={{ backgroundImage: banner.gradient }}</code> |
| <code>span</code> · 181 | <code>{`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${ banner.status === &quot;Live&quot; ? &quot;bg-[#22C55E] text-white&quot; : &quot;bg-black/50 text-white&quot; }`}</code> |  |
| <code>p</code> · 190 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 191 | <code>&quot;mt-0.5 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 192 | <code>&quot;text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 194 | <code>&quot;mt-3 flex items-center gap-3&quot;</code> |  |
| <code>span</code> · 195 | <code>&quot;cursor-pointer rounded-lg bg-[#F7931E] px-5 py-1.5 text-xs font-bold text-white&quot;</code> |  |
| <code>span</code> · 198 | <code>&quot;cursor-pointer text-xs font-semibold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 201 | <code>&quot;shrink-0 text-right&quot;</code> |  |
| <code>p</code> · 202 | <code>&quot;text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 203 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>div</code> · 209 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>h3</code> · 210 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>p</code> · 211 | <code>&quot;mt-0.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 213 | <code>&quot;mt-4 flex flex-col divide-y divide-[#F3F4F6]&quot;</code> |  |
| <code>div</code> · 215 | <code>&quot;flex cursor-pointer items-center gap-3 py-3&quot;</code> |  |
| <code>div</code> · 216 | <code>&quot;flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F9FAFB]&quot;</code> |  |
| <code>span</code> · 217 | <code>&quot;text-[9px] font-bold uppercase text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 218 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 220 | <code>&quot;flex-1 text-sm font-semibold text-black&quot;</code> |  |
| <code>ChevronRight</code> · 221 | <code>&quot;h-4 w-4 text-[#9CA3AF]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 230 | <code>&quot;mt-6 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 231 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 232 | <code>&quot;w-full min-w-[820px]&quot;</code> |  |
| <code>tr</code> · 234 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 235 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 236, 237, 238 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 239 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>tr</code> · 244 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 245 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>div</code> · 247 | <code>&quot;h-12 w-12 shrink-0 rounded-xl&quot;</code> | <code>style={{ backgroundImage: draft.gradient }}</code> |
| <code>div</code> · 248 | <code>&quot;min-w-0&quot;</code> |  |
| <code>p</code> · 249 | <code>&quot;truncate text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 250 | <code>&quot;truncate text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 254, 260 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>span</code> · 255 | <code>&quot;inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-bold text-[#6B7280]&quot;</code> |  |
| <code>td</code> · 259 | <code>&quot;px-4 py-4 text-sm text-black&quot;</code> |  |
| <code>p</code> · 261 | <code>&quot;text-sm text-black&quot;</code> |  |
| <code>p</code> · 262 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 264 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>Link</code> · 265 | <code>&quot;inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#F7931E] px-4 py-1.5 text-xs font-semibold text-[#F7931E] transition-colors hover:bg-[#FEF3E2]&quot;</code> | <code>href={ draft.type === &quot;BLOG&quot; ? `/super-admin/site-content/blogs/${draft.id}` : `/super-admin/site-content/banners/new` }</code> |

</details>

<details>
<summary>src/app/super-admin/tickets/page.tsx — 124 lines</summary>

Source: [src/app/super-admin/tickets/page.tsx](<src/app/super-admin/tickets/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 15
[categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All Tickets");
// line 16
[priorityFilter, setPriorityFilter] = useState<PriorityFilter>("Urgent");
// line 17
[search, setSearch] = useState("");
// line 18
[activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
```

Lucide imports: <code>Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 35 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 36 | Inherited / component-owned |  |
| <code>main</code> · 38 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 39 | Inherited / component-owned | <code>subtitle=&quot;Resolve The Customer Queries&quot;</code>; <code>title=&quot;Active Support Tickets&quot;</code> |
| <code>div</code> · 41 | <code>&quot;mt-6 flex flex-wrap items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 42 | <code>&quot;inline-flex items-center gap-1 rounded-full bg-white p-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)]&quot;</code> |  |
| <code>FilterDropdown</code> · 43 | Inherited / component-owned | <code>onChange={(value) =&gt; setCategoryFilter(value as CategoryFilter)}</code>; <code>value={categoryFilter}</code> |
| <code>FilterDropdown</code> · 52 | Inherited / component-owned | <code>onChange={(value) =&gt; setPriorityFilter(value as PriorityFilter)}</code>; <code>value={priorityFilter}</code> |
| <code>div</code> · 63 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 64 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 65 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search Tickets...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 75 | <code>&quot;mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 77 | <code>&quot;col-span-full py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 80 | <code>&quot;flex flex-col gap-3 rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>div</code> · 81 | <code>&quot;flex items-start justify-between&quot;</code> |  |
| <code>p</code> · 83 | <code>&quot;text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 84 | <code>&quot;text-sm font-bold text-[#F7931E]&quot;</code> |  |
| <code>span</code> · 86 | <code>&quot;inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-[10px] font-semibold text-[#374151]&quot;</code> |  |
| <code>span</code> · 91 | <code>{`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${priorityPillClasses(ticket.priority)}`}</code> |  |
| <code>div</code> · 97 | <code>&quot;flex items-center gap-2.5&quot;</code> |  |
| <code>div</code> · 98 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>p</code> · 104 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 107 | <code>&quot;line-clamp-2 text-sm text-[#6B7280]&quot;</code> |  |
| <code>button</code> · 109 | <code>&quot;mt-1 w-fit cursor-pointer self-center rounded-full bg-[#F7931E] px-10 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setActiveTicket(ticket)}</code>; <code>type=&quot;button&quot;</code> |
| <code>TicketReplyModal</code> · 121 | Inherited / component-owned | <code>onClose={() =&gt; setActiveTicket(null)}</code>; <code>open={activeTicket !== null}</code> |

</details>

<details>
<summary>src/app/super-admin/users/drafts/page.tsx — 173 lines</summary>

Source: [src/app/super-admin/users/drafts/page.tsx](<src/app/super-admin/users/drafts/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
[drafts, setDrafts] = useState(INITIAL_DRAFTS);
// line 19
[search, setSearch] = useState("");
// line 20
[page, setPage] = useState(1);
// line 21
[deleteTarget, setDeleteTarget] = useState<Draft | null>(null);
// line 22
[deletedConfirmOpen, setDeletedConfirmOpen] = useState(false);
```

Lucide imports: <code>Calendar, Check, Clock, Search, Trash2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 42 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 43 | Inherited / component-owned |  |
| <code>main</code> · 45 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 46 | Inherited / component-owned | <code>backHref=&quot;/super-admin/users&quot;</code>; <code>subtitle=&quot;Manage, resume, or discard your pending operational updates across all modules.&quot;</code>; <code>title=&quot;Drafts&quot;</code> |
| <code>div</code> · 51 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 52 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 53 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 67 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>p</code> · 69 | <code>&quot;col-span-full py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 72 | <code>&quot;flex flex-col rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>div</code> · 73 | <code>&quot;flex items-start justify-between&quot;</code> |  |
| <code>span</code> · 74 | <code>{`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${categoryPillClasses(draft.category)}`}</code> |  |
| <code>button</code> · 79 | <code>&quot;cursor-pointer text-[#9CA3AF] transition-colors hover:text-[#EF4444]&quot;</code> | <code>aria-label=&quot;Delete draft&quot;</code>; <code>onClick={() =&gt; setDeleteTarget(draft)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Trash2</code> · 85 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h3</code> · 89 | <code>&quot;mt-3 text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 90 | <code>&quot;mt-1.5 flex-1 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 92 | <code>&quot;mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>span</code> · 93 | <code>&quot;flex items-center gap-1.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>Calendar</code> · 95 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Clock</code> · 97 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 101 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>disabled={!draft.resumeHref}</code>; <code>onClick={() =&gt; handleResume(draft.resumeHref)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 114 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 115 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>ConfirmModal</code> · 126 | Inherited / component-owned | <code>onCancel={() =&gt; setDeleteTarget(null)}</code>; <code>onClose={() =&gt; setDeleteTarget(null)}</code>; <code>onConfirm={handleDelete}</code>; <code>open={deleteTarget !== null}</code>; <code>title=&quot;Discard this draft?&quot;</code> |
| <code>ModalShell</code> · 140 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={() =&gt; setDeletedConfirmOpen(false)}</code>; <code>open={deletedConfirmOpen}</code> |
| <code>div</code> · 141 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 142 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 148 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 153 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 157 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 158 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>button</code> · 162 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setDeletedConfirmOpen(false)}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/app/super-admin/users/orders/page.tsx — 233 lines</summary>

Source: [src/app/super-admin/users/orders/page.tsx](<src/app/super-admin/users/orders/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 25
[search, setSearch] = useState("");
// line 26
[filters, setFilters] = useState<OrderFilters>(EMPTY_FILTERS);
// line 27
[filtersOpen, setFiltersOpen] = useState(false);
// line 28
[expandedId, setExpandedId] = useState<string | null>(INITIAL_ORDERS[0]?.id ?? null);
// line 29
[viewingOrder, setViewingOrder] = useState<Order | null>(null);
// line 30
[page, setPage] = useState(1);
```

Lucide imports: <code>ChevronDown, FileText, Filter, MapPin, Phone, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 67 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 68 | Inherited / component-owned |  |
| <code>main</code> · 70 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>PageHeader</code> · 71 | Inherited / component-owned | <code>backHref=&quot;/super-admin/users&quot;</code>; <code>subtitle=&quot;Track, manage, and process every order without the clutter&quot;</code>; <code>title={ &lt;&gt; User Management - &lt;span className=&quot;font-normal&quot;&gt;Orders&lt;/span&gt; &lt;/&gt; }</code> |
| <code>span</code> · 74 | <code>&quot;font-normal&quot;</code> |  |
| <code>div</code> · 80 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 81 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 82 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 83 | <code>&quot;w-[240px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSearch(event.target.value); setPage(1); }}</code>; <code>placeholder=&quot;Search Orders, Customers...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>button</code> · 94 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setFiltersOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Filter</code> · 99 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 102 | <code>&quot;flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F7931E] px-1 text-[10px] font-bold text-white&quot;</code> |  |
| <code>div</code> · 111 | <code>&quot;mt-6 flex flex-col gap-4&quot;</code> |  |
| <code>p</code> · 113 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;overflow-hidden rounded-[28px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>button</code> · 122 | <code>&quot;flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left&quot;</code> | <code>onClick={() =&gt; setExpandedId(expanded ? null : order.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 127 | <code>&quot;min-w-0 flex-1&quot;</code> |  |
| <code>p</code> · 128 | <code>&quot;text-sm font-semibold text-[#F7931E]&quot;</code> |  |
| <code>p</code> · 129 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 130, 134, 177 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 132 | <code>&quot;hidden shrink-0 text-right sm:block&quot;</code> |  |
| <code>p</code> · 133 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>div</code> · 136 | <code>&quot;flex shrink-0 items-center gap-3&quot;</code> |  |
| <code>span</code> · 137 | <code>{`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusPillClasses(order.status)}`}</code> |  |
| <code>ChevronDown</code> · 142 | <code>{`h-4 w-4 text-[#9CA3AF] transition-transform ${expanded ? &quot;rotate-180&quot; : &quot;&quot;}`}</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 150 | <code>&quot;grid grid-cols-1 gap-4 border-t border-[#F3F4F6] p-5 sm:grid-cols-[280px_1fr_auto]&quot;</code> |  |
| <code>p</code> · 152, 163, 191 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 153 | <code>&quot;mt-2 flex items-center gap-2 text-sm text-[#374151]&quot;</code> |  |
| <code>Phone</code> · 154 | <code>&quot;h-3.5 w-3.5 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 157 | <code>&quot;mt-1 flex max-w-[260px] items-start gap-2 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>MapPin</code> · 158 | <code>&quot;mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 162 | <code>&quot;sm:border-x sm:border-[#F3F4F6] sm:pl-2 sm:pr-6&quot;</code> |  |
| <code>div</code> · 164 | <code>&quot;mt-2 flex flex-col gap-2&quot;</code> |  |
| <code>div</code> · 166 | <code>&quot;flex items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 167 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>Image</code> · 168 | <code>&quot;h-8 w-8 shrink-0 rounded-md object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={32}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={32}</code> |
| <code>p</code> · 176 | <code>&quot;text-sm text-black&quot;</code> |  |
| <code>p</code> · 179 | <code>&quot;text-xs font-semibold text-[#EF4444]&quot;</code> |  |
| <code>span</code> · 185 | <code>&quot;text-sm text-black&quot;</code> |  |
| <code>div</code> · 190 | <code>&quot;flex flex-col items-start justify-start gap-2 sm:pl-4&quot;</code> |  |
| <code>button</code> · 192 | <code>&quot;flex w-[220px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-[#F7931E] px-5 py-2.5 text-left text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setViewingOrder(order)}</code>; <code>type=&quot;button&quot;</code> |
| <code>FileText</code> · 197 | <code>&quot;h-4 w-4 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 208 | <code>&quot;mt-5&quot;</code> |  |
| <code>Pagination</code> · 209 | Inherited / component-owned | <code>onPageChange={setPage}</code> |
| <code>FiltersModal</code> · 220 | Inherited / component-owned | <code>onApply={setFilters}</code>; <code>onClose={() =&gt; setFiltersOpen(false)}</code>; <code>open={filtersOpen}</code>; <code>value={filters}</code> |
| <code>OrderDetailModal</code> · 230 | Inherited / component-owned | <code>onClose={() =&gt; setViewingOrder(null)}</code>; <code>open={viewingOrder !== null}</code> |

</details>

<details>
<summary>src/app/super-admin/users/page.tsx — 378 lines</summary>

Source: [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 30
[hubs, setHubs] = useState(INITIAL_HUBS);
// line 31
[admins, setAdmins] = useState(INITIAL_ADMINS);
// line 32
[showAllHubs, setShowAllHubs] = useState(false);
// line 33
[customerSearch, setCustomerSearch] = useState("");
// line 35
[createHubOpen, setCreateHubOpen] = useState(false);
// line 36
[createAdminOpen, setCreateAdminOpen] = useState(false);
// line 37
[editingHub, setEditingHub] = useState<Hub | null>(null);
// line 38
[viewingHub, setViewingHub] = useState<Hub | null>(null);
// line 39
[viewingAdmin, setViewingAdmin] = useState<Admin | null>(null);
// line 40
[viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
```

Lucide imports: <code>Building2, MapPin, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 125 | <code>&quot;flex min-h-screen w-full flex-col bg-[#F5F5F7]&quot;</code> |  |
| <code>SuperAdminNavbar</code> · 126 | Inherited / component-owned |  |
| <code>main</code> · 128 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 129 | <code>&quot;flex flex-wrap items-start justify-between gap-4&quot;</code> |  |
| <code>h1</code> · 131 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 132 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 134, 206, 302 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>Link</code> · 135 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>href=&quot;/super-admin/users/drafts&quot;</code> |
| <code>button</code> · 141 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setCreateHubOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 148 | <code>&quot;cursor-pointer whitespace-nowrap rounded-full bg-[#F7931E] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setCreateAdminOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 158 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4&quot;</code> |  |
| <code>div</code> · 159, 163, 167 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>p</code> · 160, 164, 168, 176 | <code>&quot;text-xs font-medium uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 161, 165, 179 | <code>&quot;mt-1.5 text-3xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 169 | <code>&quot;mt-1.5 truncate text-2xl font-bold text-black&quot;</code> |  |
| <code>Link</code> · 171 | <code>&quot;flex flex-col justify-between rounded-[28px] border-2 border-black/[0.04] bg-white p-5 transition-colors hover:border-[#F7931E]/30&quot;</code> | <code>href=&quot;/super-admin/users/orders&quot;</code> |
| <code>div</code> · 175 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>span</code> · 177 | <code>&quot;text-xs font-semibold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 183, 264 | <code>&quot;mt-8 flex items-center justify-between&quot;</code> |  |
| <code>p</code> · 184, 265 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 186 | <code>&quot;cursor-pointer text-xs font-semibold text-[#F7931E] hover:text-[#e07f0e]&quot;</code> | <code>onClick={() =&gt; setShowAllHubs((prev) =&gt; !prev)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 196 | <code>&quot;mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2&quot;</code> |  |
| <code>div</code> · 200 | <code>&quot;flex flex-col gap-4 rounded-2xl border border-white bg-white p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>div</code> · 204 | <code>&quot;flex items-start justify-between gap-3&quot;</code> |  |
| <code>div</code> · 205 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h3</code> · 207 | <code>&quot;text-lg font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>span</code> · 208 | <code>{`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${ hub.status === &quot;Active&quot; ? &quot;border-[#D1FAE5] bg-[#ECFDF5] text-[#10B981]&quot; : &quot;border-[#E5E7EB] bg-[#F3F4F6] text-[#6B7280]&quot; }`}</code> |  |
| <code>p</code> · 218 | <code>&quot;flex items-center gap-1.5 text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>MapPin</code> · 219 | <code>&quot;h-3.5 w-3.5 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 223 | <code>&quot;flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EFF6E9]&quot;</code> |  |
| <code>Building2</code> · 224 | <code>&quot;h-5 w-5 text-[#006E1F]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 228 | <code>&quot;grid grid-cols-3 gap-4&quot;</code> |  |
| <code>div</code> · 229, 233, 237 | <code>&quot;flex flex-col gap-1 rounded-lg bg-[#F9FAFB] p-3&quot;</code> |  |
| <code>p</code> · 230, 234, 238 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#86868B]&quot;</code> |  |
| <code>p</code> · 231, 235 | <code>&quot;text-sm font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 239 | <code>&quot;truncate text-sm font-bold text-[#006E1F]&quot;</code> |  |
| <code>div</code> · 243 | <code>&quot;flex items-center justify-between border-t border-[#F0F0F0] pt-4&quot;</code> |  |
| <code>div</code> · 244 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 245 | <code>&quot;relative flex h-7 w-12 shrink-0 items-center&quot;</code> |  |
| <code>span</code> · 246 | <code>&quot;absolute left-0 h-7 w-7 rounded-full border-2 border-white bg-[#D5DCCF]&quot;</code> |  |
| <code>span</code> · 247 | <code>&quot;absolute left-2 h-7 w-7 rounded-full border-2 border-white bg-[#83FC87]&quot;</code> |  |
| <code>span</code> · 249 | <code>&quot;text-xs font-medium text-[#3E4A3C]&quot;</code> |  |
| <code>button</code> · 251 | <code>&quot;cursor-pointer text-sm font-bold text-[#006E1F] hover:opacity-80&quot;</code> | <code>onClick={() =&gt; setViewingHub(hub)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 266 | <code>&quot;relative&quot;</code> |  |
| <code>Search</code> · 267 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 268 | <code>&quot;w-[220px] rounded-full border border-[#E5E7EB] bg-white py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setCustomerSearch(event.target.value)}</code>; <code>placeholder=&quot;Search customers...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={customerSearch}</code> |
| <code>div</code> · 278 | <code>&quot;mt-3 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 279 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 280 | <code>&quot;w-full min-w-[760px]&quot;</code> |  |
| <code>tr</code> · 282 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 283 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 284, 285, 286, 287, 288 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>td</code> · 294 | <code>&quot;px-6 py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>tr</code> · 300 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 301 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>div</code> · 303 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-bold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 307 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 308 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>td</code> · 312, 313, 317 | <code>&quot;px-4 py-4 text-sm text-black&quot;</code> |  |
| <code>td</code> · 314 | <code>&quot;px-4 py-4 text-sm font-semibold text-black&quot;</code> |  |
| <code>td</code> · 318 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>button</code> · 319 | <code>&quot;cursor-pointer whitespace-nowrap rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setViewingCustomer(customer)}</code>; <code>type=&quot;button&quot;</code> |
| <code>CreateHubModal</code> · 335 | Inherited / component-owned | <code>onClose={() =&gt; setCreateHubOpen(false)}</code>; <code>onSave={handleCreateHub}</code>; <code>open={createHubOpen}</code> |
| <code>CreateHubModal</code> · 341 | Inherited / component-owned | <code>initial={editingHub}</code>; <code>onClose={() =&gt; setEditingHub(null)}</code>; <code>onSave={handleEditHub}</code>; <code>open={editingHub !== null}</code> |
| <code>CreateAdminModal</code> · 348 | Inherited / component-owned | <code>onClose={() =&gt; setCreateAdminOpen(false)}</code>; <code>onCreate={handleCreateAdmin}</code>; <code>open={createAdminOpen}</code> |
| <code>HubDetailModal</code> · 354 | Inherited / component-owned | <code>onClose={() =&gt; setViewingHub(null)}</code>; <code>onSelectAdmin={(admin) =&gt; setViewingAdmin(admin)}</code>; <code>open={viewingHub !== null}</code> |
| <code>AdminDetailModal</code> · 361 | Inherited / component-owned | <code>onClose={() =&gt; setViewingAdmin(null)}</code>; <code>onReassign={handleReassignAdmin}</code>; <code>onSuspend={handleSuspendAdmin}</code>; <code>open={viewingAdmin !== null}</code> |
| <code>CustomerDetailModal</code> · 371 | Inherited / component-owned | <code>onClose={() =&gt; setViewingCustomer(null)}</code>; <code>open={viewingCustomer !== null}</code> |

</details>

<details>
<summary>src/app/update-default-password/page.tsx — 15 lines</summary>

Source: [src/app/update-default-password/page.tsx](<src/app/update-default-password/page.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AuthLayout</code> · 11 | Inherited / component-owned |  |
| <code>UpdateDefaultPasswordNotice</code> · 12 | Inherited / component-owned |  |

</details>

<details>
<summary>src/app/warehouse/loading.tsx — 9 lines</summary>

Source: [src/app/warehouse/loading.tsx](<src/app/warehouse/loading.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Loader2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 5 | <code>&quot;flex min-h-screen w-full items-center justify-center bg-white&quot;</code> |  |
| <code>Loader2</code> · 6 | <code>&quot;h-8 w-8 animate-spin text-[#F9A51A]&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/app/warehouse/page.tsx — 66 lines</summary>

Source: [src/app/warehouse/page.tsx](<src/app/warehouse/page.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Clock, ShoppingBag, Truck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 23 | <code>&quot;flex min-h-screen w-full flex-col bg-white&quot;</code> |  |
| <code>DashboardNavbar</code> · 24 | Inherited / component-owned |  |
| <code>main</code> · 26 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>HeroBanner</code> · 27 | Inherited / component-owned | <code>heading=&quot;Dashboard&quot;</code>; <code>subtitle=&quot;Monitor your operations and take action&quot;</code> |
| <code>div</code> · 31 | <code>&quot;flex flex-wrap gap-3&quot;</code> |  |
| <code>div</code> · 33 | <code>&quot;flex w-fit min-w-[199px] items-center gap-3 rounded-2xl border border-white/30 bg-white/20 p-2.5 backdrop-blur-sm&quot;</code> |  |
| <code>div</code> · 37 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white&quot;</code> |  |
| <code>stat.icon</code> · 38 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>div</code> · 40 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 41 | <code>&quot;whitespace-nowrap text-sm font-medium capitalize tracking-[0.5px] text-white/80&quot;</code> |  |
| <code>AnimatedCounter</code> · 44 | <code>&quot;text-2xl font-medium leading-7 text-white&quot;</code> | <code>value={stat.value}</code> |
| <code>div</code> · 54 | <code>&quot;mt-6 flex flex-col gap-6 lg:flex-row&quot;</code> |  |
| <code>CompanyGrowthCard</code> · 55 | Inherited / component-owned |  |
| <code>InventoryAlertsCard</code> · 56 | Inherited / component-owned |  |
| <code>FulfillmentOverviewCard</code> · 57 | Inherited / component-owned |  |
| <code>div</code> · 60 | <code>&quot;mt-10&quot;</code> |  |
| <code>ActivityTicketTable</code> · 61 | Inherited / component-owned |  |

</details>

<details>
<summary>src/components/auth/AuthLayout.tsx — 74 lines</summary>

Source: [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>ShieldCheck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 10 | <code>&quot;flex min-h-screen w-full bg-white&quot;</code> |  |
| <code>div</code> · 11 | <code>&quot;flex min-h-screen w-full flex-col px-6 pt-14 pb-8 sm:px-12 lg:w-1/2 lg:px-16 lg:pb-10 lg:pt-20 xl:px-24&quot;</code> |  |
| <code>div</code> · 12 | <code>&quot;mx-auto w-full max-w-[454px]&quot;</code> |  |
| <code>Image</code> · 13 | <code>&quot;h-14 w-auto&quot;</code> | <code>alt=&quot;Veda Bharath&quot;</code>; <code>height={80}</code>; <code>src=&quot;/veda-bharat-logo.png&quot;</code>; <code>width={200}</code> |
| <code>div</code> · 23 | <code>&quot;mx-auto mt-8 w-full max-w-[454px] lg:mt-10&quot;</code> |  |
| <code>div</code> · 27 | <code>&quot;mx-auto mb-5 mt-auto flex w-full max-w-[454px] items-center justify-center gap-2 pt-4&quot;</code> |  |
| <code>ShieldCheck</code> · 28 | <code>&quot;h-5 w-5 shrink-0 text-[#006D3A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 29 | <code>&quot;text-center text-xs leading-4 text-[#3D4949]/80&quot;</code> |  |
| <code>a</code> · 31 | <code>&quot;font-semibold text-[#F9A51A] hover:text-[#e6960f]&quot;</code> | <code>href=&quot;#&quot;</code> |
| <code>div</code> · 44 | <code>&quot;relative hidden w-1/2 overflow-hidden lg:block&quot;</code> |  |
| <code>Image</code> · 45 | <code>&quot;object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>fill=true</code>; <code>src=&quot;/login/right-banner.png&quot;</code> |
| <code>div</code> · 53 | <code>&quot;absolute inset-0 flex items-center justify-center px-10 xl:px-16&quot;</code> |  |
| <code>div</code> · 54 | <code>&quot;relative w-full max-w-[412px]&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;flex min-h-[460px] items-center rounded-[46px] border border-white/20 bg-white/20 p-9 backdrop-blur-md xl:min-h-[560px]&quot;</code> |  |
| <code>p</code> · 56 | <code>&quot;max-w-[300px] text-left text-[28px] font-bold leading-[1.4] text-white xl:max-w-[320px] xl:text-[36px] xl:leading-[1.35]&quot;</code> |  |
| <code>div</code> · 60 | <code>&quot;absolute bottom-16 -right-[39.5px] flex h-[79px] w-[79px] -rotate-1 items-center justify-center rounded-full bg-white&quot;</code> |  |
| <code>Image</code> · 61 | <code>&quot;h-13 w-13&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={52}</code>; <code>src=&quot;/login/banner-frame.png&quot;</code>; <code>width={52}</code> |

</details>

<details>
<summary>src/components/auth/ForgotPasswordForm.tsx — 108 lines</summary>

Source: [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 20
[loading, setLoading] = useState(false);
// line 21
[sentTo, setSentTo] = useState<string | null>(null);
```

Lucide imports: <code>ArrowLeft, Check, Mail</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 36 | <code>&quot;flex w-full flex-col items-center gap-8 text-center&quot;</code> |  |
| <code>AnimatedTitle</code> · 37, 82 | <code>&quot;text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]&quot;</code> |  |
| <code>motion.div</code> · 41 | <code>&quot;flex h-36 w-36 items-center justify-center rounded-full bg-[#F9A51A]/10&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 120, damping: 20, delay: 0.15 }}</code> |
| <code>motion.div</code> · 47 | <code>&quot;flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-white bg-[#F9A51A] shadow-[0_14px_40px_-8px_rgba(34,197,94,0.45)]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 130, damping: 22, delay: 0.45 }}</code> |
| <code>Check</code> · 53 | <code>&quot;h-12 w-12 text-white&quot;</code> | <code>strokeWidth={3.5}</code> |
| <code>AnimatedSubtitle</code> · 57, 85 | <code>&quot;text-base leading-[26px] text-[#3D4949]&quot;</code> |  |
| <code>span</code> · 59 | <code>&quot;font-semibold text-[#1A1C1D]&quot;</code> |  |
| <code>ButtonLink</code> · 64 | <code>&quot;mt-2&quot;</code> | <code>href=&quot;/login&quot;</code> |
| <code>div</code> · 72 | <code>&quot;flex w-full flex-col gap-7&quot;</code> |  |
| <code>Link</code> · 73 | <code>&quot;flex items-center gap-2 text-sm font-medium text-[#3D4949] transition-colors hover:text-[#1A1C1D]&quot;</code> | <code>href=&quot;/login&quot;</code> |
| <code>ArrowLeft</code> · 77 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 81 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>form</code> · 90 | <code>&quot;flex flex-col gap-8&quot;</code> | <code>onSubmit={handleSubmit}</code> |
| <code>TextField</code> · 91 | Inherited / component-owned | <code>autoComplete=&quot;email&quot;</code>; <code>id=&quot;email&quot;</code>; <code>label=&quot;Enter registered mail&quot;</code>; <code>name=&quot;email&quot;</code>; <code>placeholder=&quot;Enter your registered mail here&quot;</code>; <code>required=true</code>; <code>type=&quot;email&quot;</code> |
| <code>Button</code> · 102 | Inherited / component-owned | <code>disabled={loading}</code>; <code>type=&quot;submit&quot;</code> |

</details>

<details>
<summary>src/components/auth/LoginForm.tsx — 116 lines</summary>

Source: [src/components/auth/LoginForm.tsx](<src/components/auth/LoginForm.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 30
[loading, setLoading] = useState(false);
// line 31
[error, setError] = useState<string | null>(null);
```

Lucide imports: <code>Lock, User</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 62 | <code>&quot;flex w-full flex-col gap-7&quot;</code> |  |
| <code>div</code> · 63 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>AnimatedTitle</code> · 64 | <code>&quot;text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]&quot;</code> |  |
| <code>AnimatedSubtitle</code> · 67 | <code>&quot;text-base leading-[26px] text-[#3D4949]&quot;</code> |  |
| <code>form</code> · 73 | <code>&quot;flex flex-col gap-8&quot;</code> | <code>onSubmit={handleSubmit}</code> |
| <code>div</code> · 74 | <code>&quot;flex flex-col gap-[26px]&quot;</code> |  |
| <code>TextField</code> · 75 | Inherited / component-owned | <code>autoComplete=&quot;username&quot;</code>; <code>id=&quot;loginId&quot;</code>; <code>inputMode=&quot;email&quot;</code>; <code>label=&quot;Login ID&quot;</code>; <code>name=&quot;loginId&quot;</code>; <code>placeholder=&quot;Enter your assigned ID&quot;</code>; <code>required=true</code> |
| <code>div</code> · 86 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>TextField</code> · 87 | Inherited / component-owned | <code>autoComplete=&quot;current-password&quot;</code>; <code>id=&quot;password&quot;</code>; <code>label=&quot;Password&quot;</code>; <code>name=&quot;password&quot;</code>; <code>placeholder=&quot;Enter Password&quot;</code>; <code>required=true</code>; <code>type=&quot;password&quot;</code> |
| <code>Link</code> · 97 | <code>&quot;self-end text-sm font-medium text-[#3D4949] transition-colors hover:text-[#1A1C1D]&quot;</code> | <code>href=&quot;/forgot-password&quot;</code> |
| <code>p</code> · 107 | <code>&quot;-mt-2 text-sm font-medium text-red-600&quot;</code> |  |
| <code>Button</code> · 110 | Inherited / component-owned | <code>loading={loading}</code>; <code>type=&quot;submit&quot;</code> |

</details>

<details>
<summary>src/components/auth/SetNewPasswordForm.tsx — 87 lines</summary>

Source: [src/components/auth/SetNewPasswordForm.tsx](<src/components/auth/SetNewPasswordForm.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 14
[loading, setLoading] = useState(false);
// line 15
[error, setError] = useState<string | null>(null);
```

Lucide imports: <code>Lock</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 41 | <code>&quot;flex w-full flex-col gap-7&quot;</code> |  |
| <code>div</code> · 42 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>AnimatedTitle</code> · 43 | <code>&quot;text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]&quot;</code> |  |
| <code>AnimatedSubtitle</code> · 46 | <code>&quot;text-base leading-[26px] text-[#3D4949]&quot;</code> |  |
| <code>form</code> · 52 | <code>&quot;flex flex-col gap-8&quot;</code> | <code>onSubmit={handleSubmit}</code> |
| <code>div</code> · 53 | <code>&quot;flex flex-col gap-[26px]&quot;</code> |  |
| <code>TextField</code> · 54 | Inherited / component-owned | <code>autoComplete=&quot;new-password&quot;</code>; <code>id=&quot;newPassword&quot;</code>; <code>label=&quot;New Password&quot;</code>; <code>name=&quot;newPassword&quot;</code>; <code>placeholder=&quot;Enter your password&quot;</code>; <code>required=true</code>; <code>type=&quot;password&quot;</code> |
| <code>TextField</code> · 65 | Inherited / component-owned | <code>autoComplete=&quot;new-password&quot;</code>; <code>id=&quot;confirmNewPassword&quot;</code>; <code>label=&quot;Confirm New Password&quot;</code>; <code>name=&quot;confirmNewPassword&quot;</code>; <code>placeholder=&quot;Re-enter new password&quot;</code>; <code>required=true</code>; <code>type=&quot;password&quot;</code> |
| <code>p</code> · 78 | <code>&quot;-mt-2 text-sm font-medium text-red-600&quot;</code> |  |
| <code>Button</code> · 81 | Inherited / component-owned | <code>disabled={loading}</code>; <code>type=&quot;submit&quot;</code> |

</details>

<details>
<summary>src/components/auth/SignupForm.tsx — 121 lines</summary>

Source: [src/components/auth/SignupForm.tsx](<src/components/auth/SignupForm.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 12
[loading, setLoading] = useState(false);
// line 13
[error, setError] = useState<string | null>(null);
```

Lucide imports: <code>Lock, Mail, Phone, User</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 33 | <code>&quot;flex w-full flex-col gap-7&quot;</code> |  |
| <code>div</code> · 34 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>AnimatedTitle</code> · 35 | <code>&quot;text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]&quot;</code> |  |
| <code>AnimatedSubtitle</code> · 38 | <code>&quot;text-base leading-[26px] text-[#3D4949]&quot;</code> |  |
| <code>form</code> · 44 | <code>&quot;flex flex-col gap-8&quot;</code> | <code>onSubmit={handleSubmit}</code> |
| <code>div</code> · 45 | <code>&quot;flex flex-col gap-[26px]&quot;</code> |  |
| <code>TextField</code> · 46 | Inherited / component-owned | <code>autoComplete=&quot;name&quot;</code>; <code>id=&quot;fullName&quot;</code>; <code>label=&quot;Full Name&quot;</code>; <code>name=&quot;fullName&quot;</code>; <code>placeholder=&quot;Enter your full name&quot;</code>; <code>required=true</code> |
| <code>TextField</code> · 56 | Inherited / component-owned | <code>autoComplete=&quot;email&quot;</code>; <code>id=&quot;email&quot;</code>; <code>label=&quot;Email Address&quot;</code>; <code>name=&quot;email&quot;</code>; <code>placeholder=&quot;Enter your email&quot;</code>; <code>required=true</code>; <code>type=&quot;email&quot;</code> |
| <code>TextField</code> · 67 | Inherited / component-owned | <code>autoComplete=&quot;tel&quot;</code>; <code>id=&quot;phone&quot;</code>; <code>label=&quot;Phone Number&quot;</code>; <code>name=&quot;phone&quot;</code>; <code>placeholder=&quot;Enter your phone number&quot;</code>; <code>required=true</code>; <code>type=&quot;tel&quot;</code> |
| <code>TextField</code> · 78 | Inherited / component-owned | <code>autoComplete=&quot;new-password&quot;</code>; <code>id=&quot;password&quot;</code>; <code>label=&quot;Password&quot;</code>; <code>name=&quot;password&quot;</code>; <code>placeholder=&quot;Create a password&quot;</code>; <code>required=true</code>; <code>type=&quot;password&quot;</code> |
| <code>TextField</code> · 89 | Inherited / component-owned | <code>autoComplete=&quot;new-password&quot;</code>; <code>id=&quot;confirmPassword&quot;</code>; <code>label=&quot;Confirm Password&quot;</code>; <code>name=&quot;confirmPassword&quot;</code>; <code>placeholder=&quot;Re-enter your password&quot;</code>; <code>required=true</code>; <code>type=&quot;password&quot;</code> |
| <code>p</code> · 102 | <code>&quot;-mt-2 text-sm font-medium text-red-600&quot;</code> |  |
| <code>Button</code> · 105 | Inherited / component-owned | <code>disabled={loading}</code>; <code>type=&quot;submit&quot;</code> |
| <code>p</code> · 109 | <code>&quot;-mt-2 text-center text-sm text-[#3D4949]&quot;</code> |  |
| <code>Link</code> · 111 | <code>&quot;font-semibold text-[#F9A51A] hover:text-[#e6960f]&quot;</code> | <code>href=&quot;/login&quot;</code> |

</details>

<details>
<summary>src/components/auth/UpdateDefaultPasswordNotice.tsx — 27 lines</summary>

Source: [src/components/auth/UpdateDefaultPasswordNotice.tsx](<src/components/auth/UpdateDefaultPasswordNotice.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 7 | <code>&quot;flex w-full flex-col gap-7&quot;</code> |  |
| <code>div</code> · 8 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>AnimatedTitle</code> · 9 | <code>&quot;text-[32px] font-semibold leading-[38px] tracking-[-0.9px] text-[#1A1C1D]&quot;</code> |  |
| <code>AnimatedSubtitle</code> · 12 | <code>&quot;text-base leading-[26px] text-[#3D4949]&quot;</code> |  |
| <code>div</code> · 19 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>ButtonLink</code> · 20 | Inherited / component-owned | <code>href=&quot;/set-new-password&quot;</code> |
| <code>ButtonLink</code> · 21 | Inherited / component-owned | <code>href=&quot;/login&quot;</code>; <code>variant=&quot;secondary&quot;</code> |

</details>

<details>
<summary>src/components/dashboard/ActivityTicketTable.tsx — 93 lines</summary>

Source: [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 39
[activeTicket, setActiveTicket] = useState<TicketSummary | null>(null);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>h2</code> · 43 | <code>&quot;text-2xl font-semibold text-black&quot;</code> |  |
| <code>div</code> · 45 | <code>&quot;mt-6 overflow-x-auto&quot;</code> |  |
| <code>table</code> · 46 | <code>&quot;w-full min-w-[720px] border-separate border-spacing-y-3&quot;</code> |  |
| <code>tr</code> · 48 | <code>&quot;text-xs font-medium uppercase tracking-wide text-[#1F1B17]&quot;</code> |  |
| <code>th</code> · 49, 50, 51, 52 | <code>&quot;px-4 pb-2 text-left&quot;</code> |  |
| <code>th</code> · 53 | <code>&quot;px-4 pb-2 text-right&quot;</code> |  |
| <code>tr</code> · 58 | <code>&quot;bg-[#FAFAFA]&quot;</code> |  |
| <code>td</code> · 59 | <code>&quot;rounded-l-2xl px-4 py-4 text-sm font-semibold capitalize text-[#1F1B17]&quot;</code> |  |
| <code>td</code> · 62 | <code>&quot;max-w-[320px] px-4 py-4 text-sm text-[#3F4942]&quot;</code> |  |
| <code>td</code> · 65 | <code>{`px-4 py-4 text-sm font-bold ${PRIORITY_COLOR[ticket.priority]}`}</code> |  |
| <code>td</code> · 70 | <code>&quot;px-4 py-4 text-sm text-[#3F4942]&quot;</code> |  |
| <code>td</code> · 71 | <code>&quot;rounded-r-2xl px-4 py-4 text-right&quot;</code> |  |
| <code>button</code> · 72 | <code>&quot;cursor-pointer rounded-full border border-[#2E7D32] px-4 py-1.5 text-sm font-semibold text-[#2E7D32] transition-colors hover:bg-[#2E7D32]/5&quot;</code> | <code>onClick={() =&gt; setActiveTicket(ticket)}</code>; <code>type=&quot;button&quot;</code> |
| <code>TicketReplyModal</code> · 86 | Inherited / component-owned | <code>onClose={() =&gt; setActiveTicket(null)}</code>; <code>open={activeTicket !== null}</code> |

</details>

<details>
<summary>src/components/dashboard/AnimatedCounter.tsx — 48 lines</summary>

Source: [src/components/dashboard/AnimatedCounter.tsx](<src/components/dashboard/AnimatedCounter.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type AnimatedCounterProps = {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};
// line 22
[display, setDisplay] = useState(0);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>span</code> · 42 | <code>{className}</code> |  |

</details>

<details>
<summary>src/components/dashboard/CompanyGrowthCard.tsx — 172 lines</summary>

Source: [src/components/dashboard/CompanyGrowthCard.tsx](<src/components/dashboard/CompanyGrowthCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 57
[range, setRange] = useState<Range>("30d");
```

Lucide imports: <code>ChevronDown</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 63 | <code>&quot;flex-[1.15] rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 64 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>h3</code> · 65 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>div</code> · 66 | <code>&quot;relative&quot;</code> |  |
| <code>select</code> · 67 | <code>&quot;cursor-pointer appearance-none bg-transparent pr-5 text-xs font-medium text-[#83818C] outline-none&quot;</code> | <code>onChange={(event) =&gt; setRange(event.target.value as Range)}</code>; <code>value={range}</code> |
| <code>option</code> · 73 | Inherited / component-owned | <code>value={key}</code> |
| <code>ChevronDown</code> · 78 | <code>&quot;pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#83818C]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 85 | <code>&quot;mt-4 flex flex-wrap items-center gap-4 sm:gap-6&quot;</code> |  |
| <code>div</code> · 86, 90 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 87 | <code>&quot;h-1.5 w-1.5 rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>span</code> · 88, 92 | <code>&quot;text-sm font-medium text-black&quot;</code> |  |
| <code>span</code> · 91 | <code>&quot;h-1.5 w-1.5 rounded-full bg-[#006C47]&quot;</code> |  |
| <code>div</code> · 96 | <code>&quot;mt-5 flex flex-wrap items-end gap-4 sm:gap-8&quot;</code> |  |
| <code>AnimatedCounter</code> · 98 | <code>&quot;text-[32px] leading-[38px] text-black&quot;</code> | <code>value={config.ordersGrowth}</code> |
| <code>p</code> · 106, 117 | <code>&quot;text-base text-black&quot;</code> |  |
| <code>AnimatedCounter</code> · 109 | <code>&quot;text-[32px] leading-[38px] text-black&quot;</code> | <code>value={config.deliveryGrowth}</code> |
| <code>div</code> · 121 | <code>&quot;mt-6 flex gap-2&quot;</code> |  |
| <code>div</code> · 122 | <code>&quot;flex flex-col justify-between py-0.5 text-xs font-medium text-black&quot;</code> |  |
| <code>svg</code> · 127 | <code>&quot;h-[180px] w-full overflow-visible&quot;</code> | <code>viewBox={`0 -12 ${CHART_WIDTH} ${CHART_HEIGHT + 16}`}</code> |
| <code>line</code> · 133 | Inherited / component-owned | <code>stroke=&quot;rgba(134,134,139,0.16)&quot;</code>; <code>strokeWidth={1}</code>; <code>x1={0}</code>; <code>x2={CHART_WIDTH}</code>; <code>y1={CHART_HEIGHT - tick}</code>; <code>y2={CHART_HEIGHT - tick}</code> |
| <code>path</code> · 143 | Inherited / component-owned | <code>d={smoothPath(deliveryPoints)}</code>; <code>fill=&quot;none&quot;</code>; <code>stroke=&quot;#006C47&quot;</code>; <code>strokeLinecap=&quot;round&quot;</code>; <code>strokeWidth={1.5}</code> |
| <code>path</code> · 150 | Inherited / component-owned | <code>d={smoothPath(ordersPoints)}</code>; <code>fill=&quot;none&quot;</code>; <code>stroke=&quot;#F7931E&quot;</code>; <code>strokeLinecap=&quot;round&quot;</code>; <code>strokeWidth={1.5}</code> |
| <code>circle</code> · 158 | Inherited / component-owned | <code>fill=&quot;#006C47&quot;</code> |
| <code>circle</code> · 161 | Inherited / component-owned | <code>fill=&quot;#F7931E&quot;</code> |
| <code>div</code> · 165 | <code>&quot;flex justify-between pl-7 text-xs font-medium text-black&quot;</code> |  |

</details>

<details>
<summary>src/components/dashboard/DashboardNavbar.tsx — 196 lines</summary>

Source: [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 28
[notificationsOpen, setNotificationsOpen] = useState(false);
// line 29
[profileOpen, setProfileOpen] = useState(false);
// line 30
[logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
// line 31
[scrolled, setScrolled] = useState(false);
// line 32
[notifications, setNotifications] = useState(NOTIFICATIONS);
// line 33
[mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

Lucide imports: <code>Bell, Menu, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>header</code> · 68 | <code>{`sticky top-0 z-40 flex w-full items-center justify-between px-6 py-5 transition-all duration-300 sm:px-10 lg:px-16 ${ scrolled ? &quot;bg-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md&quot; : &quot;bg-transparent shadow-none&quot; }`}</code> |  |
| <code>div</code> · 75 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>Link</code> · 76 | <code>&quot;shrink-0&quot;</code> | <code>href=&quot;/warehouse&quot;</code> |
| <code>Image</code> · 77 | <code>&quot;h-10 w-auto sm:h-12&quot;</code> | <code>alt=&quot;Veda Bharath&quot;</code>; <code>height={58}</code>; <code>src=&quot;/veda-bharat-logo.png&quot;</code>; <code>width={121}</code> |
| <code>nav</code> · 88 | <code>&quot;hidden items-center gap-9 md:flex&quot;</code> |  |
| <code>span</code> · 95 | <code>{textClassName}</code> |  |
| <code>Link</code> · 99 | Inherited / component-owned | <code>href={item.href}</code> |
| <code>div</code> · 109 | <code>&quot;flex items-center gap-[13px]&quot;</code> |  |
| <code>div</code> · 110 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 111 | <code>&quot;relative flex h-10 w-10 cursor-pointer items-center justify-center&quot;</code> | <code>aria-label=&quot;Notifications&quot;</code>; <code>onClick={() =&gt; setNotificationsOpen((open) =&gt; !open)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Bell</code> · 117 | <code>&quot;h-6 w-6 text-[#2C2C2C]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>span</code> · 119 | <code>&quot;absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#EF4646] px-0.5 text-[9px] font-bold leading-none text-white&quot;</code> |  |
| <code>NotificationsPanel</code> · 125 | Inherited / component-owned | <code>onClose={() =&gt; setNotificationsOpen(false)}</code>; <code>onMarkAsRead={handleMarkAsRead}</code>; <code>open={notificationsOpen}</code> |
| <code>button</code> · 133 | <code>&quot;flex h-[54.74px] w-[54.74px] cursor-pointer items-center justify-center rounded-full border-2 border-[#F5A623] bg-[#F9A51A]&quot;</code> | <code>aria-label=&quot;View profile&quot;</code>; <code>onClick={() =&gt; setProfileOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 139 | <code>&quot;text-lg font-semibold text-white&quot;</code> |  |
| <code>button</code> · 142 | <code>&quot;md:hidden flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#2C2C2C] transition-colors hover:bg-[#EAEAEB]&quot;</code> | <code>aria-label=&quot;Toggle mobile menu&quot;</code>; <code>onClick={() =&gt; setMobileMenuOpen(!mobileMenuOpen)}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 148 | <code>&quot;h-5 w-5&quot;</code> |  |
| <code>Menu</code> · 148 | <code>&quot;h-5 w-5&quot;</code> |  |
| <code>ProfileModal</code> · 152 | Inherited / component-owned | <code>onClose={() =&gt; setProfileOpen(false)}</code>; <code>onRequestLogout={() =&gt; { setProfileOpen(false); setLogoutConfirmOpen(true); }}</code>; <code>open={profileOpen}</code> |
| <code>LogoutConfirmModal</code> · 161 | Inherited / component-owned | <code>onClose={() =&gt; setLogoutConfirmOpen(false)}</code>; <code>open={logoutConfirmOpen}</code> |
| <code>AnimatePresence</code> · 166 | Inherited / component-owned |  |
| <code>motion.nav</code> · 168 | <code>&quot;absolute right-6 sm:right-10 top-full mt-2 w-[220px] rounded-2xl bg-white p-5 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-4 md:hidden z-50 border border-[#F1F5F9]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>initial={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>Link</code> · 180 | <code>{className}</code> | <code>href={item.href}</code>; <code>onClick={() =&gt; setMobileMenuOpen(false)}</code> |
| <code>span</code> · 186 | <code>{className}</code> | <code>onClick={() =&gt; setMobileMenuOpen(false)}</code> |

</details>

<details>
<summary>src/components/dashboard/FulfillmentOverviewCard.tsx — 146 lines</summary>

Source: [src/components/dashboard/FulfillmentOverviewCard.tsx](<src/components/dashboard/FulfillmentOverviewCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 42 | <code>&quot;flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>h3</code> · 43 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>div</code> · 45 | <code>&quot;relative mt-12&quot;</code> | <code>style={{ height: SVG_TOP_OFFSET + CHART_RENDER_HEIGHT }}</code> |
| <code>div</code> · 46 | <code>&quot;absolute inset-x-1 flex justify-between&quot;</code> | <code>style={{ top: SVG_TOP_OFFSET, height: CHART_RENDER_HEIGHT }}</code> |
| <code>div</code> · 51 | <code>&quot;h-full w-0 border-l border-dashed border-[#DADADA]/55&quot;</code> |  |
| <code>svg</code> · 58 | <code>&quot;absolute inset-x-0 w-full&quot;</code> | <code>style={{ top: SVG_TOP_OFFSET, height: CHART_RENDER_HEIGHT }}</code>; <code>viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}</code> |
| <code>linearGradient</code> · 65 | Inherited / component-owned | <code>id=&quot;fulfillment-line-fade&quot;</code>; <code>x1=&quot;0&quot;</code>; <code>x2=&quot;1&quot;</code>; <code>y1=&quot;0&quot;</code>; <code>y2=&quot;0&quot;</code> |
| <code>stop</code> · 66 | Inherited / component-owned | <code>offset=&quot;0%&quot;</code>; <code>stopColor=&quot;#1B4332&quot;</code>; <code>stopOpacity={0}</code> |
| <code>stop</code> · 67 | Inherited / component-owned | <code>offset=&quot;15%&quot;</code>; <code>stopColor=&quot;#1B4332&quot;</code>; <code>stopOpacity={1}</code> |
| <code>stop</code> · 68 | Inherited / component-owned | <code>offset=&quot;85%&quot;</code>; <code>stopColor=&quot;#1B4332&quot;</code>; <code>stopOpacity={1}</code> |
| <code>stop</code> · 69 | Inherited / component-owned | <code>offset=&quot;100%&quot;</code>; <code>stopColor=&quot;#1B4332&quot;</code>; <code>stopOpacity={0}</code> |
| <code>path</code> · 72 | Inherited / component-owned | <code>d={smoothPath(points)}</code>; <code>fill=&quot;none&quot;</code>; <code>stroke=&quot;url(#fulfillment-line-fade)&quot;</code>; <code>strokeLinecap=&quot;round&quot;</code>; <code>strokeWidth={2}</code> |
| <code>div</code> · 81 | <code>&quot;pointer-events-none absolute left-1/2 origin-bottom&quot;</code> | <code>style={{ top: peakY, transform: &quot;translate(-50%, -46%)&quot; }}</code> |
| <code>motion.div</code> · 85 | <code>&quot;drop-shadow-[0_18px_14px_rgba(0,0,0,0.22)]&quot;</code> | <code>animate={{ opacity: 1, filter: &quot;blur(0px)&quot;, scale: 1, x: flowKeyframes.x, y: flowKeyframes.y, rotate: [-10, -2, -14, 4], }}</code>; <code>initial={{ opacity: 0, filter: &quot;blur(10px)&quot;, scale: 0.8, x: flowKeyframes.x[0], y: flowKeyframes.y[0], rotate: -10, }}</code>; <code>transition={{ opacity: { duration: 0.4, ease: &quot;easeOut&quot; }, filter: { duration: 0.4, ease: &quot;easeOut&quot; }, scale: { duration: 0.4, ease: &quot;easeOut&quot; }, x: { duration: 1.4, ease: &quot;easeInOut&quot; }, y: { duration: 1.4, ease: &quot;easeInOut&quot; }, rotate: { duration: 1.4, ease: &quot;easeInOut&quot; }, }}</code> |
| <code>Image</code> · 112 | Inherited / component-owned | <code>alt=&quot;&quot;</code>; <code>height={91}</code>; <code>src=&quot;/Warehouse/ricegrain.png&quot;</code>; <code>width={64}</code> |
| <code>div</code> · 116 | <code>&quot;pointer-events-none absolute left-1/2 whitespace-nowrap rounded-lg border border-dashed border-white/50 bg-white/70 px-2.5 py-1 text-[10px] font-bold text-[#8F4E00] shadow-[0_10px_16px_-3px_rgba(0,0,0,0.1)] backdrop-blur-sm&quot;</code> | <code>style={{ top: peakY, transform: &quot;translate(-50%, -220%)&quot; }}</code> |
| <code>AnimatedCounter</code> · 120, 134 | Inherited / component-owned | <code>value={3.5}</code> |
| <code>div</code> · 124 | <code>&quot;flex justify-between text-xs font-medium text-[#544437]/50&quot;</code> |  |
| <code>div</code> · 130 | <code>&quot;mt-6 flex flex-col gap-3&quot;</code> |  |
| <code>div</code> · 131, 137 | <code>&quot;flex items-center justify-between rounded-2xl bg-[#F7F7F7]/60 p-4&quot;</code> |  |
| <code>span</code> · 132, 138 | <code>&quot;text-base font-semibold text-[#1F1B17]&quot;</code> |  |
| <code>span</code> · 133, 139 | <code>&quot;rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-bold text-[#1B4332]&quot;</code> |  |
| <code>AnimatedCounter</code> · 140 | Inherited / component-owned | <code>value={1.5}</code> |

</details>

<details>
<summary>src/components/dashboard/HeroBanner.tsx — 43 lines</summary>

Source: [src/components/dashboard/HeroBanner.tsx](<src/components/dashboard/HeroBanner.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type HeroBannerProps = {
  heading: string;
  subtitle: string;
  children?: ReactNode;
};
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 14 | <code>&quot;relative w-full overflow-hidden rounded-3xl&quot;</code> |  |
| <code>Image</code> · 15 | <code>&quot;object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>fill=true</code>; <code>src=&quot;/Warehouse/dashboard-banner.png&quot;</code> |
| <code>div</code> · 22 | <code>{`relative z-10 flex min-h-[280px] w-full flex-col px-8 py-8 sm:min-h-[300px] sm:px-10 lg:min-h-[338px] ${ children ? &quot;justify-between gap-9&quot; : &quot;justify-end gap-1&quot; }`}</code> |  |
| <code>div</code> · 27 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>AnimatedHeading</code> · 28 | <code>&quot;text-[32px] font-semibold leading-[1.2] text-[#F2F2F2] sm:text-[40px] lg:text-[50px] lg:leading-[60px]&quot;</code> | <code>as=&quot;h1&quot;</code> |
| <code>AnimatedSubtitle</code> · 34 | <code>&quot;text-lg font-normal leading-[1.2] text-white sm:text-xl lg:text-2xl lg:leading-[29px]&quot;</code> |  |

</details>

<details>
<summary>src/components/dashboard/InventoryAlertsCard.tsx — 87 lines</summary>

Source: [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>Link</code> · 15 | <code>{ isOut ? &quot;flex items-center justify-between rounded-xl bg-[#FEF2F2] p-2.5 transition-colors hover:bg-[#FDE3E3]&quot; : &quot;flex items-center justify-between gap-2.5 rounded-xl border border-[#F3F4F6] p-2.5 transition-colors hover:bg-[#FAFAFA]&quot; }</code> | <code>href={`/inventory?view=details&amp;status=${tone}&amp;sku=${product.sku}`}</code> |
| <code>div</code> · 23 | <code>&quot;flex items-center gap-2.5&quot;</code> |  |
| <code>div</code> · 24 | <code>{`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ isOut ? &quot;bg-white&quot; : &quot;bg-[#FAFAFA]&quot; }`}</code> |  |
| <code>Image</code> · 29 | <code>&quot;h-full w-full rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={40}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={40}</code> |
| <code>p</code> · 38 | <code>&quot;text-sm font-medium text-[#111827]&quot;</code> |  |
| <code>p</code> · 39 | <code>{`text-xs ${isOut ? &quot;text-[#EF4444]&quot; : &quot;text-[#F97316]&quot;}`}</code> |  |
| <code>span</code> · 45 | <code>&quot;shrink-0 text-xs font-semibold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;flex-1 rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 56 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>h3</code> · 57 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>Link</code> · 58 | <code>&quot;cursor-pointer text-xs text-[#6B7280] transition-colors hover:text-[#111827]&quot;</code> | <code>href=&quot;/inventory?view=details&quot;</code> |
| <code>div</code> · 66 | <code>&quot;mt-5 flex flex-col gap-3&quot;</code> |  |
| <code>div</code> · 67 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 68 | <code>&quot;h-2 w-2 rounded-full bg-[#EF4444]&quot;</code> |  |
| <code>span</code> · 69, 78 | <code>&quot;text-sm font-medium text-[#111827]&quot;</code> |  |
| <code>AlertRow</code> · 73, 82 | Inherited / component-owned |  |
| <code>div</code> · 76 | <code>&quot;mt-2 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 77 | <code>&quot;h-2 w-2 rounded-full bg-[#F97316]&quot;</code> |  |

</details>

<details>
<summary>src/components/dashboard/LogoutConfirmModal.tsx — 89 lines</summary>

Source: [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type LogoutConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};
```

Lucide imports: <code>LogOut</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 35 | Inherited / component-owned |  |
| <code>motion.div</code> · 37 | <code>&quot;fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={onClose}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 45 | <code>&quot;flex w-full max-w-[420px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>initial={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>onClick={(event) =&gt; event.stopPropagation()}</code>; <code>transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>div</code> · 53 | <code>&quot;flex flex-col items-center gap-4&quot;</code> |  |
| <code>div</code> · 54 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDAD6]&quot;</code> |  |
| <code>LogOut</code> · 55 | <code>&quot;h-6 w-6 text-[#D93025]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 57 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h2</code> · 58 | <code>&quot;text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 61 | <code>&quot;text-sm leading-[22px] text-[#86868B]&quot;</code> |  |
| <code>div</code> · 68 | <code>&quot;flex w-full flex-col gap-3&quot;</code> |  |
| <code>button</code> · 69 | <code>&quot;w-full cursor-pointer rounded-lg bg-[#D93025] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#c22a20]&quot;</code> | <code>onClick={() =&gt; router.push(&quot;/login&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 76 | <code>&quot;w-full cursor-pointer py-2 text-sm font-bold text-[#475569] transition-colors hover:text-[#1D1D1F]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/dashboard/NotificationsPanel.tsx — 202 lines</summary>

Source: [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 79
type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
};
// line 88
[ticketOpen, setTicketOpen] = useState(false);
```

Lucide imports: <code>Archive, Check, Headphones, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 104 | Inherited / component-owned |  |
| <code>motion.div</code> · 106 | <code>&quot;absolute right-0 top-full z-50 mt-3 w-[300px] max-w-[88vw] rounded-2xl bg-white p-5 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_2px_16px_rgba(0,0,0,0.04)] sm:w-[340px]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>initial={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>div</code> · 113 | <code>&quot;mb-4 flex items-center justify-between&quot;</code> |  |
| <code>h2</code> · 114 | <code>&quot;text-lg font-bold tracking-[-0.36px] text-[#1D1D1F]&quot;</code> |  |
| <code>button</code> · 117 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#E9F0E3] text-[#3E4A3C] transition-colors hover:bg-[#dbe6d2]&quot;</code> | <code>aria-label=&quot;Close&quot;</code>; <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 123 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 127 | <code>&quot;flex max-h-[65vh] flex-col gap-3 overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 129 | <code>{`flex cursor-pointer flex-col gap-1.5 rounded-xl p-3 transition-all hover:brightness-[0.98] ${item.cardBg} ${item.cardBorder ?? &quot;&quot;} ${item.read ? &quot;opacity-60 grayscale-[0.2]&quot; : &quot;opacity-100&quot;}`}</code> | <code>onClick={() =&gt; handleAction(item)}</code>; <code>onKeyDown={(event) =&gt; { if (event.key === &quot;Enter&quot; &#124;&#124; event.key === &quot; &quot;) { event.preventDefault(); handleAction(item); } }}</code>; <code>role=&quot;button&quot;</code>; <code>tabIndex={0}</code> |
| <code>div</code> · 142 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>div</code> · 143 | <code>{`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}</code> |  |
| <code>item.icon</code> · 146 | <code>{`h-4 w-4 ${item.iconColor}`}</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 148 | <code>&quot;flex min-w-0 flex-1 flex-col gap-0.5&quot;</code> |  |
| <code>div</code> · 149 | <code>&quot;flex items-start justify-between gap-2&quot;</code> |  |
| <code>p</code> · 150 | <code>&quot;text-xs leading-[18px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 151 | <code>&quot;shrink-0 text-[11px] leading-[18px] text-[#86868B]&quot;</code> |  |
| <code>p</code> · 155 | <code>{`text-[13px] leading-[19px] text-[#1D1D1F] ${ item.messageBold ? &quot;font-bold&quot; : &quot;font-normal&quot; }`}</code> |  |
| <code>div</code> · 164 | <code>&quot;flex justify-end items-center gap-3&quot;</code> |  |
| <code>button</code> · 166 | <code>&quot;cursor-pointer text-[12px] font-semibold text-[#86868B] hover:text-[#1D1D1F] transition-colors&quot;</code> | <code>onClick={(event) =&gt; { event.stopPropagation(); onMarkAsRead(item.id); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 177 | <code>{`cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70 ${item.actionColor}`}</code> | <code>onClick={(event) =&gt; { event.stopPropagation(); handleAction(item); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>TicketReplyModal</code> · 195 | Inherited / component-owned | <code>onClose={() =&gt; setTicketOpen(false)}</code>; <code>open={ticketOpen}</code> |

</details>

<details>
<summary>src/components/dashboard/ProfileModal.tsx — 121 lines</summary>

Source: [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
};
```

Lucide imports: <code>LogOut, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 26 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>span</code> · 27 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 30 | <code>&quot;text-base font-medium text-[#171D15]&quot;</code> |  |
| <code>AnimatePresence</code> · 55 | Inherited / component-owned |  |
| <code>motion.div</code> · 57 | <code>&quot;fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={onClose}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 65 | <code>&quot;relative w-full max-w-[500px] rounded-[18px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>initial={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>onClick={(event) =&gt; event.stopPropagation()}</code>; <code>transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>button</code> · 73 | <code>&quot;absolute right-5 top-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#E9F0E3] text-[#3E4A3C] transition-colors hover:bg-[#dbe6d2]&quot;</code> | <code>aria-label=&quot;Close&quot;</code>; <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 79 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 82 | <code>&quot;flex flex-col items-center gap-1 px-8 pb-5 pt-9&quot;</code> |  |
| <code>div</code> · 83 | <code>&quot;flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[#F5A623] p-[3px]&quot;</code> |  |
| <code>div</code> · 84 | <code>&quot;flex h-full w-full items-center justify-center rounded-full bg-[#F9A51A] text-xl font-bold text-white&quot;</code> |  |
| <code>h2</code> · 88 | <code>&quot;mt-2.5 text-lg font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 89 | <code>&quot;text-sm font-medium text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 92 | <code>&quot;grid grid-cols-2 gap-x-6 gap-y-5 px-8 pb-6&quot;</code> |  |
| <code>ProfileField</code> · 93 | Inherited / component-owned | <code>label=&quot;Email Address&quot;</code>; <code>value={PROFILE.email}</code> |
| <code>ProfileField</code> · 94 | Inherited / component-owned | <code>label=&quot;Phone Number&quot;</code>; <code>value={PROFILE.phone}</code> |
| <code>ProfileField</code> · 95 | Inherited / component-owned | <code>label=&quot;Assigned Role&quot;</code>; <code>value={PROFILE.role}</code> |
| <code>ProfileField</code> · 96 | Inherited / component-owned | <code>label=&quot;Account Status&quot;</code>; <code>value={ &lt;span className=&quot;inline-flex w-fit items-center rounded-full bg-[#EBF7EC] px-2 py-0.5 text-xs font-bold text-[#3BB54A]&quot;&gt; {PROFILE.status} &lt;/span&gt; }</code> |
| <code>span</code> · 99 | <code>&quot;inline-flex w-fit items-center rounded-full bg-[#EBF7EC] px-2 py-0.5 text-xs font-bold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 106 | <code>&quot;border-t border-[#E5E5E7] px-8 py-5&quot;</code> |  |
| <code>button</code> · 107 | <code>&quot;flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#FCE8E6] py-2.5 text-sm font-semibold text-[#D93025] transition-colors hover:bg-[#f9dbd8]&quot;</code> | <code>onClick={onRequestLogout}</code>; <code>type=&quot;button&quot;</code> |
| <code>LogOut</code> · 112 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |

</details>

<details>
<summary>src/components/dashboard/SuperAdminNavbar.tsx — 215 lines</summary>

Source: [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 38
[notificationsOpen, setNotificationsOpen] = useState(false);
// line 39
[profileOpen, setProfileOpen] = useState(false);
// line 40
[logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
// line 41
[scrolled, setScrolled] = useState(false);
// line 42
[notifications, setNotifications] = useState(INITIAL_SUPER_ADMIN_NOTIFICATIONS);
// line 43
[mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

Lucide imports: <code>Bell, Menu, X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>header</code> · 78 | <code>{`sticky top-0 z-40 flex w-full items-center justify-between px-6 py-5 transition-all duration-300 sm:px-10 lg:px-16 ${ scrolled ? &quot;bg-white/90 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-md&quot; : &quot;bg-transparent shadow-none&quot; }`}</code> |  |
| <code>div</code> · 85 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>Link</code> · 86 | <code>&quot;shrink-0&quot;</code> | <code>href=&quot;/super-admin&quot;</code> |
| <code>Image</code> · 87 | <code>&quot;h-10 w-auto sm:h-12&quot;</code> | <code>alt=&quot;Veda Bharath&quot;</code>; <code>height={58}</code>; <code>src=&quot;/veda-bharat-logo.png&quot;</code>; <code>width={121}</code> |
| <code>nav</code> · 98 | <code>&quot;hidden items-center gap-9 md:flex&quot;</code> |  |
| <code>span</code> · 106 | <code>&quot;flex flex-col items-center gap-0.5&quot;</code> |  |
| <code>span</code> · 107 | <code>{textClassName}</code> |  |
| <code>span</code> · 108 | <code>{`h-[1.5px] w-full rounded-full bg-gradient-to-r from-[#F9A51A] to-transparent ${ isActive ? &quot;opacity-100&quot; : &quot;opacity-0&quot; }`}</code> |  |
| <code>Link</code> · 118 | Inherited / component-owned | <code>href={item.href}</code> |
| <code>div</code> · 128 | <code>&quot;flex items-center gap-[13px]&quot;</code> |  |
| <code>div</code> · 129 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 130 | <code>&quot;relative flex h-10 w-10 cursor-pointer items-center justify-center&quot;</code> | <code>aria-label=&quot;Notifications&quot;</code>; <code>onClick={() =&gt; setNotificationsOpen((open) =&gt; !open)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Bell</code> · 136 | <code>&quot;h-6 w-6 text-[#2C2C2C]&quot;</code> | <code>strokeWidth={1.5}</code> |
| <code>span</code> · 138 | <code>&quot;absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-[#EF4646] px-0.5 text-[9px] font-bold leading-none text-white&quot;</code> |  |
| <code>SuperAdminNotificationsPanel</code> · 144 | Inherited / component-owned | <code>onClose={() =&gt; setNotificationsOpen(false)}</code>; <code>onMarkAllAsRead={handleMarkAllAsRead}</code>; <code>open={notificationsOpen}</code> |
| <code>button</code> · 152 | <code>&quot;flex h-[54.74px] w-[54.74px] cursor-pointer items-center justify-center rounded-full border-2 border-[#F5A623] bg-[#F9A51A]&quot;</code> | <code>aria-label=&quot;View profile&quot;</code>; <code>onClick={() =&gt; setProfileOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 158 | <code>&quot;text-lg font-semibold text-white&quot;</code> |  |
| <code>button</code> · 161 | <code>&quot;md:hidden flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#2C2C2C] transition-colors hover:bg-[#EAEAEB]&quot;</code> | <code>aria-label=&quot;Toggle mobile menu&quot;</code>; <code>onClick={() =&gt; setMobileMenuOpen(!mobileMenuOpen)}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 167 | <code>&quot;h-5 w-5&quot;</code> |  |
| <code>Menu</code> · 167 | <code>&quot;h-5 w-5&quot;</code> |  |
| <code>ProfileModal</code> · 171 | Inherited / component-owned | <code>onClose={() =&gt; setProfileOpen(false)}</code>; <code>onRequestLogout={() =&gt; { setProfileOpen(false); setLogoutConfirmOpen(true); }}</code>; <code>open={profileOpen}</code> |
| <code>LogoutConfirmModal</code> · 180 | Inherited / component-owned | <code>onClose={() =&gt; setLogoutConfirmOpen(false)}</code>; <code>open={logoutConfirmOpen}</code> |
| <code>AnimatePresence</code> · 185 | Inherited / component-owned |  |
| <code>motion.nav</code> · 187 | <code>&quot;absolute right-6 sm:right-10 top-full mt-2 w-[220px] rounded-2xl bg-white p-5 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-4 md:hidden z-50 border border-[#F1F5F9]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>initial={{ opacity: 0, y: -8, scale: 0.98 }}</code>; <code>transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>Link</code> · 199 | <code>{className}</code> | <code>href={item.href}</code>; <code>onClick={() =&gt; setMobileMenuOpen(false)}</code> |
| <code>span</code> · 205 | <code>{className}</code> | <code>onClick={() =&gt; setMobileMenuOpen(false)}</code> |

</details>

<details>
<summary>src/components/dashboard/SuperAdminNotificationsPanel.tsx — 191 lines</summary>

Source: [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 63
type SuperAdminNotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  notifications: SuperAdminNotification[];
  onMarkAllAsRead: () => void;
};
// line 76
[activeFilter, setActiveFilter] = useState<"All" | Category>("All");
```

Lucide imports: <code>X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 101 | Inherited / component-owned |  |
| <code>motion.div</code> · 104 | <code>&quot;fixed inset-0 z-50 bg-black/40 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={onClose}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 113 | <code>&quot;fixed inset-y-6 right-6 z-50 flex w-[400px] max-w-[88vw] flex-col rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(0,0,0,0.18)]&quot;</code> | <code>animate={{ x: 0 }}</code>; <code>exit={{ x: &quot;110%&quot; }}</code>; <code>initial={{ x: &quot;110%&quot; }}</code>; <code>transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>div</code> · 120 | <code>&quot;mb-4 flex items-center justify-between&quot;</code> |  |
| <code>h2</code> · 121 | <code>&quot;text-[26px] font-extrabold tracking-tight text-[#1D1D1F]&quot;</code> |  |
| <code>button</code> · 124 | <code>&quot;flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#F0F0F2] text-[#1D1D1F] transition-colors hover:bg-[#E4E4E7]&quot;</code> | <code>aria-label=&quot;Close&quot;</code>; <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 130 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 134 | <code>&quot;mb-4 flex w-fit items-center gap-1 rounded-full bg-[#F5F5F7] p-1.5&quot;</code> |  |
| <code>button</code> · 136 | <code>{`cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${ activeFilter === filter ? &quot;bg-[#F9A51A] text-white&quot; : &quot;text-[#6E6E73] hover:text-[#1D1D1F]&quot; }`}</code> | <code>onClick={() =&gt; setActiveFilter(filter)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 151 | <code>&quot;border-t border-[#EDEDEF]&quot;</code> |  |
| <code>div</code> · 153 | <code>&quot;mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1&quot;</code> |  |
| <code>p</code> · 155 | <code>&quot;py-6 text-center text-sm text-[#86868B]&quot;</code> |  |
| <code>div</code> · 158 | <code>{`rounded-2xl bg-[#F5F5F7] p-4 transition-opacity ${ item.read ? &quot;opacity-60&quot; : &quot;opacity-100&quot; }`}</code> |  |
| <code>div</code> · 164 | <code>&quot;flex items-center justify-between gap-2&quot;</code> |  |
| <code>span</code> · 165 | <code>&quot;text-[11px] font-bold uppercase tracking-[0.4px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 168 | <code>&quot;shrink-0 text-xs text-[#86868B]&quot;</code> |  |
| <code>p</code> · 170 | <code>&quot;mt-1 text-[15px] font-bold leading-[21px] text-[#1D1D1F]&quot;</code> |  |
| <code>div</code> · 177 | <code>&quot;mt-4 border-t border-[#EDEDEF] pt-4 text-center&quot;</code> |  |
| <code>button</code> · 178 | <code>&quot;cursor-pointer text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]&quot;</code> | <code>onClick={onMarkAllAsRead}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/dashboard/TicketReplyModal.tsx — 112 lines</summary>

Source: [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 16
type TicketReplyModalProps = {
  ticket: TicketSummary | null;
  open: boolean;
  onClose: () => void;
};
// line 22
PRIORITY_TONE: Record<TicketSummary["priority"], "red" | "orange" | "blue"> = {
  Urgent: "red",
  Medium: "orange",
  Low: "blue",
};
// line 29
[reply, setReply] = useState("");
// line 30
[sent, setSent] = useState(false);
```

Lucide imports: <code>Check</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 42 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[560px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 43 | <code>&quot;p-7 sm:p-8&quot;</code> |  |
| <code>div</code> · 45 | <code>&quot;flex flex-col items-center gap-4 py-4 text-center&quot;</code> |  |
| <code>div</code> · 46 | <code>&quot;flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 47 | <code>&quot;h-6 w-6 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 49 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h2</code> · 50 | <code>&quot;text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 51 | <code>&quot;text-sm leading-[22px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 52 | <code>&quot;font-bold text-[#171D15]&quot;</code> |  |
| <code>button</code> · 56 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 62 | <code>&quot;flex flex-col gap-1 border-b border-[#F1F5F9] pb-5 pr-10&quot;</code> |  |
| <code>h2</code> · 63 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 64 | <code>&quot;text-sm font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 67 | <code>&quot;mt-3 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 68 | <code>{pillClasses(PRIORITY_TONE[ticket.priority])}</code> |  |
| <code>span</code> · 71 | <code>{pillClasses(&quot;green&quot;)}</code> |  |
| <code>div</code> · 74, 81 | <code>&quot;mt-5 flex flex-col gap-2&quot;</code> |  |
| <code>span</code> · 75, 82 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>p</code> · 76 | <code>&quot;rounded-xl bg-[#F0F9F1] p-3.5 text-sm leading-[21px] text-[#3E4A3C]&quot;</code> |  |
| <code>textarea</code> · 85 | <code>&quot;w-full resize-none rounded-xl border border-[#E5E5E7] p-3 text-sm text-[#171D15] outline-none placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setReply(event.target.value)}</code>; <code>placeholder={`Type your response to ${ticket.customer.split(&quot; &quot;)[0]} here...`}</code>; <code>rows={5}</code>; <code>value={reply}</code> |
| <code>div</code> · 94 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 95 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 98 | <code>{`${PRIMARY_BUTTON} disabled:cursor-not-allowed disabled:opacity-50`}</code> | <code>disabled={!reply.trim()}</code>; <code>onClick={() =&gt; setSent(true)}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/inventory/BatchDossierModal.tsx — 356 lines</summary>

Source: [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 21
type BatchDossierModalProps = {
  batch: Batch | null;
  open: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
};
// line 47
[mode, setMode] = useState<"view" | "edit">("view");
// line 48
[fields, setFields] = useState<EditableFields | null>(null);
// line 49
[photo, setPhoto] = useState<string | null>(null);
```

Lucide imports: <code>BadgeCheck, Camera, CheckCircle2, ChevronDown, Clock, MapPin, Phone, Sprout, User, Warehouse as WarehouseIcon,</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 82 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[900px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 83 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-8&quot;</code> |  |
| <code>div</code> · 84 | <code>&quot;flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-5 pr-10&quot;</code> |  |
| <code>h2</code> · 85 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 88 | <code>&quot;mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 90 | <code>&quot;flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 91 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>span</code> · 92 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]&quot;</code> |  |
| <code>CheckCircle2</code> · 93 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 95, 225 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 96 | <code>&quot;text-base font-bold text-[#3BB54A]&quot;</code> |  |
| <code>span</code> · 99 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 100, 115, 121, 126 | <code>&quot;font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 108, 134, 157, 217, 273 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>span</code> · 109, 135, 158, 218, 274 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 112 | <code>&quot;flex flex-col gap-3 rounded-xl bg-[#F5F5F7] p-4&quot;</code> |  |
| <code>div</code> · 113, 119 | <code>&quot;flex items-center justify-between text-sm&quot;</code> |  |
| <code>span</code> · 114, 120 | <code>&quot;text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 125 | <code>&quot;flex items-center justify-between border-t border-[#E5E5E7] pt-3 text-sm&quot;</code> |  |
| <code>span</code> · 127 | <code>{`font-bold ${agingTone(batch.ageYears) === &quot;green&quot; ? &quot;text-[#3BB54A]&quot; : &quot;text-[#F7931E]&quot;}`}</code> |  |
| <code>div</code> · 138 | <code>&quot;flex flex-col gap-2 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>span</code> · 139 | <code>&quot;text-base font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 140 | <code>&quot;flex items-start gap-2 text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>MapPin</code> · 141 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 144, 148 | <code>&quot;flex items-center gap-2 text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>User</code> · 145 | <code>&quot;h-4 w-4 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Phone</code> · 149 | <code>&quot;h-4 w-4 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 156, 241 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>label</code> · 161, 178, 195, 297, 314 | <code>&quot;flex flex-col gap-1.5&quot;</code> |  |
| <code>span</code> · 162, 179, 196, 298, 315 | <code>&quot;text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 165, 182, 197, 299, 316 | <code>&quot;relative&quot;</code> |  |
| <code>input</code> · 166 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setFields((prev) =&gt; prev &amp;&amp; { ...prev, preArrivalYears: event.target.value }) }</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={fields.preArrivalYears}</code> |
| <code>Clock</code> · 175 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 183 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setFields((prev) =&gt; prev &amp;&amp; { ...prev, warehouseAgingYears: event.target.value }) }</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={fields.warehouseAgingYears}</code> |
| <code>WarehouseIcon</code> · 192 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>select</code> · 198 | <code>&quot;w-full cursor-pointer appearance-none rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setFields((prev) =&gt; prev &amp;&amp; { ...prev, rack: event.target.value })}</code>; <code>value={fields.rack}</code> |
| <code>option</code> · 203 | Inherited / component-owned | <code>value={batch.rack}</code> |
| <code>option</code> · 207 | Inherited / component-owned | <code>value={rack}</code> |
| <code>ChevronDown</code> · 212 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 221 | <code>&quot;flex items-center gap-3 rounded-xl bg-[#F0F9F1] p-4&quot;</code> |  |
| <code>span</code> · 222 | <code>&quot;flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]&quot;</code> |  |
| <code>Sprout</code> · 223 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 226 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 227, 231 | <code>&quot;flex items-center gap-1.5 text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>User</code> · 228 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2}</code> |
| <code>MapPin</code> · 232 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 242 | <code>&quot;relative overflow-hidden rounded-2xl&quot;</code> |  |
| <code>input</code> · 243 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/png,image/jpeg&quot;</code>; <code>onChange={(event) =&gt; { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }}</code>; <code>type=&quot;file&quot;</code> |
| <code>Image</code> · 253 | <code>{`h-[260px] w-full object-cover object-right ${mode === &quot;view&quot; ? &quot;border-2 border-[#3B82F6]&quot; : &quot;&quot;}`}</code> | <code>alt={batch.farm}</code>; <code>height={320}</code>; <code>src={photo ?? batch.photo}</code>; <code>width={520}</code> |
| <code>button</code> · 262 | <code>&quot;absolute bottom-3 left-3 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#171D15] shadow-sm hover:bg-white&quot;</code> | <code>onClick={() =&gt; fileInputRef.current?.click()}</code>; <code>type=&quot;button&quot;</code> |
| <code>Camera</code> · 267 | <code>&quot;h-3.5 w-3.5 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 278 | <code>&quot;grid grid-cols-2 gap-3&quot;</code> |  |
| <code>div</code> · 279, 285 | <code>&quot;rounded-xl bg-[#F5F5F7] p-4&quot;</code> |  |
| <code>span</code> · 280, 286 | <code>&quot;text-[10px] font-bold uppercase tracking-[0.6px] text-[#86868B]&quot;</code> |  |
| <code>p</code> · 283 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 289 | <code>&quot;flex items-center gap-1.5 text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>BadgeCheck</code> · 291 | <code>&quot;h-4 w-4 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 296 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>input</code> · 300 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setFields((prev) =&gt; prev &amp;&amp; { ...prev, moisturePercent: event.target.value }) }</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={fields.moisturePercent}</code> |
| <code>span</code> · 309 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#F7931E]&quot;</code> |  |
| <code>select</code> · 317 | <code>&quot;w-full cursor-pointer appearance-none rounded-xl border border-[#E5E5E7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setFields((prev) =&gt; prev &amp;&amp; { ...prev, purityGrade: event.target.value }) }</code>; <code>value={fields.purityGrade}</code> |
| <code>option</code> · 325 | Inherited / component-owned | <code>value={grade}</code> |
| <code>BadgeCheck</code> · 330 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 339 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 340 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 344 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={() =&gt; setMode(&quot;edit&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 348 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={handleSave}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/inventory/CreateBatchModal.tsx — 263 lines</summary>

Source: [src/components/inventory/CreateBatchModal.tsx](<src/components/inventory/CreateBatchModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 10
type CreateBatchModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (batch: Batch) => void;
};
// line 29
[form, setForm] = useState(EMPTY_FORM);
// line 30
[photoPreview, setPhotoPreview] = useState<string | null>(null);
```

Lucide imports: <code>Image as ImageIcon, MapPin</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 78 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[900px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 79 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-8&quot;</code> |  |
| <code>div</code> · 80 | <code>&quot;flex items-start justify-between gap-4 border-b border-[#F1F5F9] pb-5 pr-10&quot;</code> |  |
| <code>h2</code> · 81 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 84 | <code>&quot;mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 85, 184 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>div</code> · 86, 131, 213 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>span</code> · 87, 132, 214 | <code>&quot;flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 88, 215 | <code>&quot;h-3.5 w-0.5 rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>div</code> · 91, 159, 218 | <code>&quot;grid grid-cols-2 gap-3&quot;</code> |  |
| <code>label</code> · 92, 105, 119, 136, 146, 160, 170, 219, 230 | <code>&quot;flex flex-col gap-1.5&quot;</code> |  |
| <code>span</code> · 93, 106, 120, 137, 147, 161, 171, 220, 231 | <code>&quot;text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>input</code> · 96 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;preArrivalYears&quot;, event.target.value)}</code>; <code>placeholder=&quot;e.g., 0.5&quot;</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={form.preArrivalYears}</code> |
| <code>input</code> · 109 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;warehouseAgingYears&quot;, event.target.value)}</code>; <code>placeholder=&quot;e.g., 1.3&quot;</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={form.warehouseAgingYears}</code> |
| <code>input</code> · 121 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;rackLocation&quot;, event.target.value)}</code>; <code>placeholder=&quot;Enter Zone &amp; Rack...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={form.rackLocation}</code> |
| <code>span</code> · 133 | <code>&quot;h-3.5 w-0.5 rounded-full bg-[#3BB54A]&quot;</code> |  |
| <code>input</code> · 138 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;farmName&quot;, event.target.value)}</code>; <code>placeholder=&quot;Enter farm unit name...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={form.farmName}</code> |
| <code>div</code> · 148 | <code>&quot;relative&quot;</code> |  |
| <code>MapPin</code> · 149 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868B]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 150 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] py-3 pl-10 pr-4 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;address&quot;, event.target.value)}</code>; <code>placeholder=&quot;Enter full address...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={form.address}</code> |
| <code>input</code> · 162 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;managerName&quot;, event.target.value)}</code>; <code>placeholder=&quot;Enter manager name...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={form.managerName}</code> |
| <code>input</code> · 172 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;contactNumber&quot;, event.target.value)}</code>; <code>placeholder=&quot;+91 00000 00000&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={form.contactNumber}</code> |
| <code>input</code> · 185 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/png,image/jpeg&quot;</code>; <code>onChange={(event) =&gt; { const file = event.target.files?.[0]; if (file) setPhotoPreview(URL.createObjectURL(file)); }}</code>; <code>type=&quot;file&quot;</code> |
| <code>button</code> · 195 | <code>&quot;relative flex h-[260px] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-[#D9D9DE] bg-[#FAFAFA] transition-colors hover:border-[#F9A51A]&quot;</code> | <code>onClick={() =&gt; fileInputRef.current?.click()}</code>; <code>type=&quot;button&quot;</code> |
| <code>Image</code> · 201 | <code>&quot;object-cover&quot;</code> | <code>alt=&quot;Unit preview&quot;</code>; <code>fill=true</code>; <code>src={photoPreview}</code> |
| <code>span</code> · 204 | <code>&quot;flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#86868B] shadow-sm&quot;</code> |  |
| <code>ImageIcon</code> · 205 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 207 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 208 | <code>&quot;text-xs text-[#86868B]&quot;</code> |  |
| <code>input</code> · 221 | <code>&quot;w-full rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none placeholder:font-normal placeholder:text-[#86868B] focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;moisturePercent&quot;, event.target.value)}</code>; <code>placeholder=&quot;0.0%&quot;</code>; <code>step=&quot;0.1&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={form.moisturePercent}</code> |
| <code>select</code> · 232 | <code>&quot;w-full cursor-pointer rounded-xl border border-[#E5E5E7] px-4 py-3 text-sm font-semibold text-[#171D15] outline-none focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; update(&quot;purityGrade&quot;, event.target.value)}</code>; <code>value={form.purityGrade}</code> |
| <code>option</code> · 237 | Inherited / component-owned | <code>disabled=true</code>; <code>value=&quot;&quot;</code> |
| <code>option</code> · 241 | Inherited / component-owned | <code>value={grade}</code> |
| <code>div</code> · 252 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 253 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 256 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={handleCreate}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/inventory/InventoryBoard.tsx — 306 lines</summary>

Source: [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 16
STATUS_FILTER_STYLES: Record<StockStatus | "all", string> = {
  all: "bg-[#F5F5F7] text-[#171D15]",
  out: "bg-[#FEE2E2] text-[#DC2626]",
  low: "bg-[#FEF3E2] text-[#F7931E]",
  in: "bg-[#EBF7EC] text-[#3BB54A]",
};
// line 24
[batches, setBatches] = useState<Batch[]>(ALL_BATCHES);
// line 25
[view, setView] = useState<"allocations" | "details">("allocations");
// line 26
[search, setSearch] = useState("");
// line 27
[warehouse, setWarehouse] = useState<string>("Kukatpally");
// line 28
[variety, setVariety] = useState<string>("Dudeshwar");
// line 29
[page, setPage] = useState(1);
// line 30
[selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
// line 31
[createOpen, setCreateOpen] = useState(false);
// line 32
[statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
// line 33
[initialUpdateSku, setInitialUpdateSku] = useState<string | null>(null);
```

Lucide imports: <code>ChevronDown, ChevronLeft, ChevronRight, MapPin, Plus, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 80 | <code>&quot;mt-8 flex flex-col gap-4 pb-8&quot;</code> |  |
| <code>div</code> · 81 | <code>&quot;flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;relative w-full sm:max-w-[318px]&quot;</code> |  |
| <code>Search</code> · 83 | <code>&quot;pointer-events-none absolute left-[19px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#3E4A3C]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 87 | <code>&quot;w-full rounded-full border border-[#BDCAB8]/30 bg-white py-[14px] pl-11 pr-4 text-base text-[#3E4A3C] outline-none placeholder:text-[#3E4A3C]/50 focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder={view === &quot;details&quot; ? &quot;Search Products...&quot; : &quot;Search Batch ID, Product, Farm...&quot;}</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 96 | <code>&quot;flex flex-wrap items-center gap-4&quot;</code> |  |
| <code>button</code> · 105 | <code>{`cursor-pointer whitespace-nowrap rounded-xl px-6 py-2 text-sm font-medium transition-colors ${ isActive ? &quot;bg-[#F9A51A] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]&quot; : &quot;bg-white text-[#F9A51A] hover:bg-[#F5F5F7]&quot; }`}</code> | <code>onClick={() =&gt; setView(tab.key)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 121, 157, 176 | <code>&quot;relative&quot;</code> |  |
| <code>select</code> · 122 | <code>{`cursor-pointer appearance-none whitespace-nowrap rounded-xl border border-[#BDCAB8]/30 py-2 pl-4 pr-9 text-sm font-medium outline-none ${STATUS_FILTER_STYLES[statusFilter]}`}</code> | <code>onChange={(event) =&gt; setStatusFilter(event.target.value as StockStatus &#124; &quot;all&quot;)}</code>; <code>value={statusFilter}</code> |
| <code>option</code> · 127 | Inherited / component-owned | <code>value=&quot;all&quot;</code> |
| <code>option</code> · 128 | Inherited / component-owned | <code>value=&quot;out&quot;</code> |
| <code>option</code> · 129 | Inherited / component-owned | <code>value=&quot;low&quot;</code> |
| <code>option</code> · 130 | Inherited / component-owned | <code>value=&quot;in&quot;</code> |
| <code>ChevronDown</code> · 132 | <code>&quot;pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-current&quot;</code> | <code>strokeWidth={2}</code> |
| <code>StockDetailsGrid</code> · 142 | Inherited / component-owned |  |
| <code>div</code> · 146 | <code>&quot;overflow-hidden rounded-[24px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>div</code> · 147 | <code>&quot;flex flex-col gap-4 border-b border-[#F1F5F9] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9&quot;</code> |  |
| <code>div</code> · 148 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 149 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 150 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 151 | <code>&quot;font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 156 | <code>&quot;flex flex-wrap items-center gap-3&quot;</code> |  |
| <code>select</code> · 158 | <code>&quot;cursor-pointer appearance-none rounded-full bg-[#FEF3E2] py-2.5 pl-4 pr-9 text-sm font-semibold text-[#F7931E] outline-none&quot;</code> | <code>onChange={(event) =&gt; setWarehouse(event.target.value)}</code>; <code>value={warehouse}</code> |
| <code>option</code> · 163 | Inherited / component-owned | <code>value={ALL_WAREHOUSES}</code> |
| <code>option</code> · 165, 184 | Inherited / component-owned | <code>value={name}</code> |
| <code>ChevronDown</code> · 170 | <code>&quot;pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>select</code> · 177 | <code>&quot;cursor-pointer appearance-none rounded-full bg-[#F5F5F7] py-2.5 pl-4 pr-9 text-sm font-semibold text-[#171D15] outline-none&quot;</code> | <code>onChange={(event) =&gt; setVariety(event.target.value)}</code>; <code>value={variety}</code> |
| <code>option</code> · 182 | Inherited / component-owned | <code>value={ALL_VARIETIES}</code> |
| <code>ChevronDown</code> · 189 | <code>&quot;pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 195 | <code>&quot;flex cursor-pointer items-center gap-2 rounded-xl bg-[#F9A51A] px-5 py-2.5 text-sm font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#e6960f]&quot;</code> | <code>onClick={() =&gt; setCreateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Plus</code> · 200 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 206 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 207 | <code>&quot;w-full min-w-[880px] border-collapse&quot;</code> |  |
| <code>tr</code> · 209 | <code>&quot;text-left text-xs font-bold uppercase tracking-[0.6px] text-[#86868B]&quot;</code> |  |
| <code>th</code> · 210 | <code>&quot;px-6 py-4 sm:px-9&quot;</code> |  |
| <code>th</code> · 211, 212, 213, 214, 215, 216 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 217 | <code>&quot;px-6 py-4 sm:pr-9&quot;</code> |  |
| <code>tr</code> · 222 | <code>&quot;border-t border-[#F1F5F9] transition-colors hover:bg-[#F5F5F7]/50&quot;</code> |  |
| <code>td</code> · 223 | <code>&quot;px-6 py-5 text-sm font-bold text-[#171D15] sm:px-9&quot;</code> |  |
| <code>td</code> · 224, 231 | <code>&quot;px-6 py-5&quot;</code> |  |
| <code>span</code> · 225 | <code>&quot;flex items-center gap-1.5 text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>MapPin</code> · 226 | <code>&quot;h-3.5 w-3.5 shrink-0 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>td</code> · 230, 236, 237 | <code>&quot;px-6 py-5 text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 232 | <code>{pillClasses(agingTone(batch.ageYears))}</code> |  |
| <code>td</code> · 238 | <code>&quot;px-6 py-5 text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>td</code> · 241 | <code>&quot;px-6 py-5 sm:pr-9&quot;</code> |  |
| <code>button</code> · 242 | <code>&quot;cursor-pointer whitespace-nowrap rounded-xl border border-[#BDCAB8] px-4 py-2 text-xs font-bold text-[#171D15] transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={() =&gt; setSelectedBatch(batch)}</code>; <code>type=&quot;button&quot;</code> |
| <code>td</code> · 254 | <code>&quot;px-6 py-10 text-center text-sm text-[#86868B] sm:px-9&quot;</code> |  |
| <code>div</code> · 263 | <code>&quot;flex flex-col gap-4 border-t border-[#F1F5F9] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9&quot;</code> |  |
| <code>span</code> · 264 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 268 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>button</code> · 269 | <code>&quot;flex cursor-pointer items-center gap-1 rounded-xl border border-[#BDCAB8] bg-white px-4 py-2 text-sm font-bold text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50&quot;</code> | <code>disabled={page === 1}</code>; <code>onClick={() =&gt; setPage((p) =&gt; Math.max(1, p - 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 275 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>button</code> · 278 | <code>&quot;flex cursor-pointer items-center gap-1 rounded-xl border border-[#BDCAB8] bg-white px-4 py-2 text-sm font-bold text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50&quot;</code> | <code>disabled={page === totalPages}</code>; <code>onClick={() =&gt; setPage((p) =&gt; Math.min(totalPages, p + 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 285 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>BatchDossierModal</code> · 292 | Inherited / component-owned | <code>onClose={() =&gt; setSelectedBatch(null)}</code>; <code>onSave={handleSaveBatch}</code>; <code>open={selectedBatch !== null}</code> |
| <code>CreateBatchModal</code> · 299 | Inherited / component-owned | <code>onClose={() =&gt; setCreateOpen(false)}</code>; <code>onCreate={handleCreateBatch}</code>; <code>open={createOpen}</code> |

</details>

<details>
<summary>src/components/inventory/StockDetailsGrid.tsx — 137 lines</summary>

Source: [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 15
type StockDetailsGridProps = {
  search: string;
  statusFilter: StockStatus | "all";
  initialUpdateSku?: string | null;
};
// line 21
STATUS_STYLES: Record<StockStatus, { pill: string; bar: string; button: string }> = {
  out: {
    pill: "bg-[#FEE2E2] text-[#DC2626]",
    bar: "bg-[#E5E5E7]",
    button: "bg-[#3BB54A] text-white hover:bg-[#2f9d3d]",
  },
  low: {
    pill: "bg-[#FEF3E2] text-[#F7931E]",
    bar: "bg-[#F7931E]",
    button: "bg-[#F9A51A] text-white hover:bg-[#e6960f]",
  },
  in: {
    pill: "bg-[#EBF7EC] text-[#3BB54A]",
    bar: "bg-[#3BB54A]",
    button: "border border-[#BDCAB8] bg-white text-[#171D15] hover:bg-[#F5F5F7]",
  },
};
// line 92
[products, setProducts] = useState<ProductStock[]>(INITIAL_PRODUCTS);
// line 93
[updateSku, setUpdateSku] = useState<string | null>(null);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 51 | <code>&quot;flex flex-col gap-4 rounded-2xl border border-[#F1F5F9] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>Image</code> · 52 | <code>&quot;mx-auto h-[220px] w-auto object-contain&quot;</code> | <code>alt={product.name}</code>; <code>height={240}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={200}</code> |
| <code>div</code> · 60 | <code>&quot;flex items-center justify-between gap-2&quot;</code> |  |
| <code>span</code> · 61 | <code>&quot;text-base font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 62 | <code>{`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.4px] ${styles.pill}`}</code> |  |
| <code>div</code> · 69 | <code>&quot;flex items-end justify-between&quot;</code> |  |
| <code>span</code> · 70 | <code>&quot;text-2xl font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 71 | <code>&quot;text-sm font-medium text-[#86868B]&quot;</code> |  |
| <code>span</code> · 73 | <code>&quot;text-xs font-semibold text-[#86868B]&quot;</code> |  |
| <code>div</code> · 76 | <code>&quot;h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]&quot;</code> |  |
| <code>div</code> · 77 | <code>{`h-full rounded-full ${styles.bar}`}</code> | <code>style={{ width: `${percent}%` }}</code> |
| <code>button</code> · 80 | <code>{`w-full cursor-pointer rounded-xl py-2.5 text-sm font-bold transition-colors ${styles.button}`}</code> | <code>onClick={onUpdate}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 115 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 117 | <code>&quot;rounded-2xl bg-white p-10 text-center text-sm text-[#86868B] shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>ProductCard</code> · 123 | Inherited / component-owned | <code>onUpdate={() =&gt; setUpdateSku(product.sku)}</code> |
| <code>UpdateStockModal</code> · 128 | Inherited / component-owned | <code>onAdjust={handleAdjust}</code>; <code>onClose={() =&gt; setUpdateSku(null)}</code>; <code>open={updateSku !== null}</code> |

</details>

<details>
<summary>src/components/inventory/UpdateStockModal.tsx — 173 lines</summary>

Source: [src/components/inventory/UpdateStockModal.tsx](<src/components/inventory/UpdateStockModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type UpdateStockModalProps = {
  products: ProductStock[];
  initialSku: string | null;
  open: boolean;
  onClose: () => void;
  onAdjust: (sku: string, delta: number) => void;
};
// line 18
[sku, setSku] = useState(initialSku ?? products[0]?.sku ?? "");
// line 19
[adjustment, setAdjustment] = useState<"add" | "remove">("add");
// line 20
[quantity, setQuantity] = useState("5");
// line 21
[notes, setNotes] = useState("");
// line 22
[confirmed, setConfirmed] = useState(false);
```

Lucide imports: <code>Check, ChevronDown</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 49 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[680px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 50 | <code>&quot;p-7 sm:p-8&quot;</code> |  |
| <code>div</code> · 52 | <code>&quot;flex flex-col items-center gap-4 py-4 text-center&quot;</code> |  |
| <code>div</code> · 53 | <code>&quot;flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 54 | <code>&quot;h-6 w-6 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 56 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h2</code> · 57 | <code>&quot;text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 58 | <code>&quot;text-sm leading-[22px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 60 | <code>&quot;font-bold text-[#171D15]&quot;</code> |  |
| <code>button</code> · 63 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 69 | <code>&quot;flex flex-col gap-1 border-b border-[#F1F5F9] pb-5 pr-10&quot;</code> |  |
| <code>h2</code> · 70 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 71 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 74 | <code>&quot;mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 75 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>label</code> · 76, 121, 137 | <code>&quot;flex flex-col gap-1.5&quot;</code> |  |
| <code>span</code> · 77, 98, 122, 138 | <code>&quot;text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 78, 123 | <code>&quot;relative&quot;</code> |  |
| <code>select</code> · 79 | <code>&quot;w-full cursor-pointer appearance-none rounded-xl bg-[#F5F5F7] py-3 pl-4 pr-10 text-sm font-semibold text-[#171D15] outline-none&quot;</code> | <code>onChange={(event) =&gt; setSku(event.target.value)}</code>; <code>value={sku}</code> |
| <code>option</code> · 85 | Inherited / component-owned | <code>value={item.sku}</code> |
| <code>ChevronDown</code> · 90 | <code>&quot;pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 97 | <code>&quot;flex flex-col gap-1.5&quot;</code> |  |
| <code>div</code> · 99 | <code>&quot;grid grid-cols-2 overflow-hidden rounded-xl border border-[#E5E5E7]&quot;</code> |  |
| <code>button</code> · 100 | <code>{`cursor-pointer py-3 text-sm font-bold transition-colors ${ adjustment === &quot;add&quot; ? &quot;bg-white text-[#3BB54A]&quot; : &quot;bg-[#F5F5F7] text-[#86868B]&quot; }`}</code> | <code>onClick={() =&gt; setAdjustment(&quot;add&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 109 | <code>{`cursor-pointer border-l border-[#E5E5E7] py-3 text-sm font-bold transition-colors ${ adjustment === &quot;remove&quot; ? &quot;bg-white text-[#3BB54A]&quot; : &quot;bg-[#F5F5F7] text-[#86868B]&quot; }`}</code> | <code>onClick={() =&gt; setAdjustment(&quot;remove&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>input</code> · 124 | <code>&quot;w-full rounded-xl bg-[#F5F5F7] py-3 pl-4 pr-14 text-sm font-semibold text-[#171D15] outline-none&quot;</code> | <code>onChange={(event) =&gt; setQuantity(event.target.value)}</code>; <code>type=&quot;number&quot;</code>; <code>value={quantity}</code> |
| <code>span</code> · 130 | <code>&quot;pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#86868B]&quot;</code> |  |
| <code>span</code> · 139 | <code>&quot;font-normal text-[#86868B]&quot;</code> |  |
| <code>textarea</code> · 141 | <code>&quot;h-full w-full resize-none rounded-xl bg-[#F5F5F7] p-4 text-sm text-[#171D15] outline-none placeholder:text-[#86868B]&quot;</code> | <code>onChange={(event) =&gt; setNotes(event.target.value)}</code>; <code>placeholder={ adjustment === &quot;add&quot; ? &quot;e.g., Received additional units from weekly farm shipment...&quot; : &quot;e.g., Found damaged seals during morning QA check...&quot; }</code>; <code>rows={8}</code>; <code>value={notes}</code> |
| <code>div</code> · 155 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 156 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 159 | <code>{`${PRIMARY_BUTTON} disabled:cursor-not-allowed disabled:opacity-50`}</code> | <code>disabled={!canSubmit}</code>; <code>onClick={handleSubmit}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/inventory/inventoryData.ts — 128 lines</summary>

Source: [src/components/inventory/inventoryData.ts](<src/components/inventory/inventoryData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 64
export function agingTone(years: number): PillTone {
  return years >= 1 ? "green" : "orange";
}
// line 68
export function agingLabel(years: number) {
  return years >= 1 ? "Aged - Ready" : "Under Ageing";
}
// line 72
export function dossierStatusLabel(years: number) {
  return years >= 1 ? "Ready for Dispatch" : "Maturing in Warehouse";
}
```

</details>

<details>
<summary>src/components/inventory/productStockData.ts — 37 lines</summary>

Source: [src/components/inventory/productStockData.ts](<src/components/inventory/productStockData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 17
export function stockStatus(product: ProductStock): StockStatus {
  if (product.quantity <= 0) return "out";
  const percent = product.quantity / product.maxCapacity;
  if (percent <= 0.2) return "low";
  return "in";
}
// line 24
export function stockPercent(product: ProductStock) {
  return Math.min(100, Math.round((product.quantity / product.maxCapacity) * 100));
}
```

</details>

<details>
<summary>src/components/orders/OrderCard.tsx — 258 lines</summary>

Source: [src/components/orders/OrderCard.tsx](<src/components/orders/OrderCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 32
type OrderCardProps = {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
};
// line 39
[fulfillmentOpen, setFulfillmentOpen] = useState(false);
// line 40
[exceptionOpen, setExceptionOpen] = useState(false);
// line 41
[deliveredOpen, setDeliveredOpen] = useState(false);
// line 42
[returnedOpen, setReturnedOpen] = useState(false);
// line 43
[returnedStep, setReturnedStep] = useState<"detail" | "ticket">("detail");
// line 44
[cancelOpen, setCancelOpen] = useState(false);
// line 45
[invoiceOpen, setInvoiceOpen] = useState(false);
// line 46
[cancelled, setCancelled] = useState(false);
// line 47
[refundProcessed, setRefundProcessed] = useState(false);
```

Lucide imports: <code>AlertTriangle, ChevronDown, MapPin, Phone, type LucideIcon</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 61 | <code>&quot;w-full overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>button</code> · 62 | <code>&quot;flex w-full cursor-pointer flex-wrap items-center justify-between gap-4 px-6 py-6 text-left sm:flex-nowrap sm:px-9&quot;</code> | <code>onClick={onToggle}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 67 | <code>&quot;flex flex-1 flex-wrap items-center gap-x-8 gap-y-2 sm:gap-x-10&quot;</code> |  |
| <code>span</code> · 68 | <code>&quot;text-lg font-bold text-[#F9A51A]&quot;</code> |  |
| <code>div</code> · 69, 73 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 70 | <code>&quot;text-lg font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 71 | <code>&quot;text-sm font-medium text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 74 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 75 | <code>&quot;text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 79 | <code>&quot;flex shrink-0 items-center gap-4&quot;</code> |  |
| <code>span</code> · 80 | <code>{`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.6px] ${ isNegative ? &quot;bg-[#EF4444]/10 text-[#EF4444]&quot; : &quot;bg-[#3BB54A]/10 text-[#3BB54A]&quot; }`}</code> |  |
| <code>ChevronDown</code> · 87 | <code>{`h-4 w-4 shrink-0 text-[#171D15] transition-transform duration-200 ${ expanded ? &quot;rotate-180&quot; : &quot;&quot; }`}</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 97 | <code>&quot;flex flex-col gap-8 border-t border-[#BDCAB8]/30 px-6 py-6 sm:flex-row sm:px-9&quot;</code> |  |
| <code>div</code> · 98 | <code>&quot;flex flex-col gap-4 sm:w-[280px] sm:shrink-0&quot;</code> |  |
| <code>h4</code> · 99, 118, 149 | <code>&quot;text-xs font-bold uppercase tracking-[1.2px] text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 103 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>Phone</code> · 104 | <code>&quot;h-[18px] w-[18px] shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 105, 132 | <code>&quot;text-base font-semibold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 109 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>MapPin</code> · 110 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 111 | <code>&quot;text-sm leading-[23px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 117 | <code>&quot;flex flex-col gap-4 sm:flex-1 sm:border-x sm:border-[#BDCAB8]/30 sm:px-8&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 123 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>Image</code> · 124 | <code>&quot;h-[62px] w-[62px] shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={62}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={62}</code> |
| <code>div</code> · 131 | <code>&quot;flex flex-1 flex-col&quot;</code> |  |
| <code>span</code> · 133 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 135 | <code>&quot;mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#EF4444]&quot;</code> |  |
| <code>AlertTriangle</code> · 136 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>span</code> · 141 | <code>&quot;text-base font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 148 | <code>&quot;flex flex-col gap-4 sm:w-[294px] sm:shrink-0&quot;</code> |  |
| <code>button</code> · 152 | <code>&quot;flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F9A51A] py-4 text-sm font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#e6960f] disabled:cursor-not-allowed disabled:opacity-60&quot;</code> | <code>disabled={cancelled &#124;&#124; refundProcessed}</code>; <code>onClick={ isPackFlow &#124;&#124; isShipFlow ? () =&gt; setFulfillmentOpen(true) : isExceptionFlow ? () =&gt; setExceptionOpen(true) : isDeliveredFlow ? () =&gt; setDeliveredOpen(true) : isReturnedFlow ? () =&gt; { setReturnedStep(&quot;detail&quot;); setReturnedOpen(true); } : undefined }</code>; <code>type=&quot;button&quot;</code> |
| <code>PrimaryIcon</code> · 171 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 179 | <code>&quot;flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#BDCAB8] py-3 text-sm font-bold text-[#171D15] transition-colors hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60&quot;</code> | <code>disabled={cancelled}</code>; <code>onClick={ isCancelFlow ? () =&gt; setCancelOpen(true) : isViewInvoiceFlow ? () =&gt; setInvoiceOpen(true) : isSupportTicketFlow ? () =&gt; { setReturnedStep(&quot;ticket&quot;); setReturnedOpen(true); } : undefined }</code>; <code>type=&quot;button&quot;</code> |
| <code>SecondaryIcon</code> · 196 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>OrderFulfillmentModal</code> · 205 | Inherited / component-owned | <code>onClose={() =&gt; setFulfillmentOpen(false)}</code>; <code>open={fulfillmentOpen}</code> |
| <code>DeliveredOrderModal</code> · 223 | Inherited / component-owned | <code>onClose={() =&gt; setDeliveredOpen(false)}</code>; <code>onDownloadInvoice={() =&gt; setInvoiceOpen(true)}</code>; <code>open={deliveredOpen}</code> |
| <code>ReturnedFlowModal</code> · 232 | Inherited / component-owned | <code>onClose={() =&gt; setReturnedOpen(false)}</code>; <code>onRefunded={() =&gt; setRefundProcessed(true)}</code>; <code>open={returnedOpen}</code> |
| <code>CancelOrderModal</code> · 242 | Inherited / component-owned | <code>onClose={() =&gt; setCancelOpen(false)}</code>; <code>onConfirm={() =&gt; { setCancelled(true); setCancelOpen(false); }}</code>; <code>open={cancelOpen}</code> |
| <code>InvoiceModal</code> · 254 | Inherited / component-owned | <code>onClose={() =&gt; setInvoiceOpen(false)}</code>; <code>onPrinted={() =&gt; {}}</code>; <code>open={invoiceOpen}</code> |

</details>

<details>
<summary>src/components/orders/OrdersQueue.tsx — 501 lines</summary>

Source: [src/components/orders/OrdersQueue.tsx](<src/components/orders/OrdersQueue.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 372
[activeTabLabel, setActiveTabLabel] = useState(TABS[0].label);
// line 375
[page, setPage] = useState(1);
// line 377
[expandedId, setExpandedId] = useState<string | null>(currentOrders[0]?.id ?? null);
// line 378
[search, setSearch] = useState("");
```

Lucide imports: <code>ChevronLeft, ChevronRight, FileText, MessageCircleQuestion, PackageCheck, PackageX, RotateCcw, Search, Truck, type LucideIcon,</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 399 | <code>&quot;mt-8 flex flex-col gap-4 pb-8&quot;</code> |  |
| <code>div</code> · 400 | <code>&quot;flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between&quot;</code> |  |
| <code>div</code> · 401 | <code>&quot;relative w-full sm:max-w-[318px]&quot;</code> |  |
| <code>Search</code> · 402 | <code>&quot;pointer-events-none absolute left-[19px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#3E4A3C]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 406 | <code>&quot;w-full rounded-full border border-[#BDCAB8]/30 bg-white py-[14px] pl-11 pr-4 text-base text-[#3E4A3C] outline-none placeholder:text-[#3E4A3C]/50 focus:border-[#F9A51A]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search Orders, Customers...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 415 | <code>&quot;flex flex-wrap items-center gap-4&quot;</code> |  |
| <code>button</code> · 419 | <code>{`cursor-pointer whitespace-nowrap rounded-xl px-6 py-2 text-sm font-medium transition-colors ${ isActive ? &quot;bg-[#F9A51A] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]&quot; : &quot;bg-white text-[#3BB54A] hover:bg-[#F5F5F7]&quot; }`}</code> | <code>onClick={() =&gt; setActiveTabLabel(tab.label)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 436 | <code>&quot;mt-4 flex items-center justify-between&quot;</code> |  |
| <code>span</code> · 437 | <code>&quot;text-xs font-bold uppercase tracking-[1.1px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 440 | <code>&quot;text-sm text-[#86868B]&quot;</code> |  |
| <code>div</code> · 445 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>OrderCard</code> · 447 | Inherited / component-owned | <code>onToggle={() =&gt; setExpandedId((current) =&gt; (current === order.id ? null : order.id)) }</code> |
| <code>div</code> · 458 | <code>&quot;mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between&quot;</code> |  |
| <code>span</code> · 459 | <code>&quot;text-lg font-medium text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 462 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 463 | <code>&quot;flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#BDCAB8] bg-white text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50&quot;</code> | <code>disabled={page === 1}</code>; <code>onClick={() =&gt; setPage((p) =&gt; Math.max(1, p - 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 469 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>button</code> · 475 | <code>{`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-sm font-bold transition-colors ${ isActive ? &quot;bg-[#F9A51A] text-white&quot; : &quot;border border-[#BDCAB8] bg-white text-[#171D15] hover:bg-[#F5F5F7]&quot; }`}</code> | <code>onClick={() =&gt; setPage(pageNumber)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 489 | <code>&quot;flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[#BDCAB8] bg-white text-[#171D15] transition-opacity disabled:cursor-not-allowed disabled:opacity-50&quot;</code> | <code>disabled={page === activeTab.pages.length}</code>; <code>onClick={() =&gt; setPage((p) =&gt; Math.min(activeTab.pages.length, p + 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 495 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/components/orders/modals/CancelOrderModal.tsx — 80 lines</summary>

Source: [src/components/orders/modals/CancelOrderModal.tsx](<src/components/orders/modals/CancelOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type CancelOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
```

Lucide imports: <code>Trash2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 36 | Inherited / component-owned |  |
| <code>motion.div</code> · 38 | <code>&quot;fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={onClose}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 46 | <code>&quot;flex w-full max-w-[420px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>initial={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>onClick={(event) =&gt; event.stopPropagation()}</code>; <code>transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>div</code> · 54 | <code>&quot;flex flex-col items-center gap-4&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FFDAD6]&quot;</code> |  |
| <code>Trash2</code> · 56 | <code>&quot;h-6 w-6 text-[#D93025]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 58 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h2</code> · 59 | <code>&quot;text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 60 | <code>&quot;text-sm leading-[22px] text-[#86868B]&quot;</code> |  |
| <code>div</code> · 67 | <code>&quot;flex w-full justify-center gap-4&quot;</code> |  |
| <code>button</code> · 68 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 71 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onConfirm}</code>; <code>type=&quot;button&quot;</code> |

</details>



<details>
<summary>src/components/orders/modals/DeliveredOrderModal.tsx — 140 lines</summary>

Source: [src/components/orders/modals/DeliveredOrderModal.tsx](<src/components/orders/modals/DeliveredOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type DeliveredOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onDownloadInvoice: () => void;
};
```

Lucide imports: <code>Check, Download, MapPin, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 23, 53 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>Image</code> · 24 | <code>&quot;h-11 w-11 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={44}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={44}</code> |
| <code>div</code> · 31 | <code>&quot;flex flex-1 flex-col&quot;</code> |  |
| <code>span</code> · 32, 37, 70, 91 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 33 | <code>&quot;text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>ModalShell</code> · 50 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[900px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 51 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-7&quot;</code> |  |
| <code>div</code> · 52 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>h2</code> · 54 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 55 | <code>{pillClasses(&quot;green&quot;)}</code> |  |
| <code>span</code> · 57 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 60 | <code>&quot;mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 61 | <code>&quot;flex flex-col gap-4 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>span</code> · 62, 78, 88, 106 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 65 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>span</code> · 66 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-[#3BB54A]&quot;</code> |  |
| <code>Check</code> · 67 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 69 | <code>&quot;flex flex-col gap-0.5&quot;</code> |  |
| <code>span</code> · 71 | <code>&quot;text-xs text-[#86868B]&quot;</code> |  |
| <code>div</code> · 77 | <code>&quot;flex flex-col gap-3 border-t border-[#F1F5F9] pt-4&quot;</code> |  |
| <code>DeliveredItemRow</code> · 82 | Inherited / component-owned |  |
| <code>div</code> · 87 | <code>&quot;flex flex-col gap-3 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>div</code> · 93 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>Phone</code> · 94 | <code>&quot;h-3.5 w-3.5 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 95 | <code>&quot;text-sm text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 99 | <code>&quot;flex items-start gap-2&quot;</code> |  |
| <code>MapPin</code> · 100 | <code>&quot;mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 101 | <code>&quot;text-xs leading-[18px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 105 | <code>&quot;mt-2 flex flex-col gap-2.5 border-t border-[#F1F5F9] pt-3&quot;</code> |  |
| <code>div</code> · 109, 113, 117 | <code>&quot;flex items-center justify-between text-sm&quot;</code> |  |
| <code>span</code> · 110, 114, 118 | <code>&quot;text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 111 | <code>&quot;font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 115 | <code>&quot;font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 119 | <code>&quot;font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;flex items-center justify-between border-t border-[#F1F5F9] pt-2.5 text-base font-bold text-[#171D15]&quot;</code> |  |
| <code>button</code> · 127 | <code>&quot;mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#E5E5E7] py-3 text-sm font-semibold text-[#171D15] transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={onDownloadInvoice}</code>; <code>type=&quot;button&quot;</code> |
| <code>Download</code> · 132 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |

</details>







<details>
<summary>src/components/orders/modals/InvoiceModal.tsx — 155 lines</summary>

Source: [src/components/orders/modals/InvoiceModal.tsx](<src/components/orders/modals/InvoiceModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type InvoiceModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onPrinted: () => void;
};
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 28 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[580px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 29 | <code>&quot;max-h-[85vh] overflow-y-auto p-7 sm:p-9&quot;</code> | <code>id=&quot;invoice-print-area&quot;</code> |
| <code>div</code> · 30 | <code>&quot;flex items-start justify-between border-b border-[#F0F0F0] pb-6 sm:pr-8&quot;</code> |  |
| <code>div</code> · 31 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 32 | <code>&quot;text-2xl font-bold tracking-[-0.5px] text-[#F9A51A]&quot;</code> |  |
| <code>p</code> · 33 | <code>&quot;text-sm font-medium tracking-[0.3px] text-[#86868B]&quot;</code> |  |
| <code>div</code> · 35 | <code>&quot;flex flex-col items-end gap-1&quot;</code> |  |
| <code>span</code> · 36 | <code>&quot;text-[10px] font-bold uppercase tracking-[1px] text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 39 | <code>&quot;text-2xl font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 40 | <code>&quot;text-sm text-[#86868B]&quot;</code> |  |
| <code>div</code> · 51 | <code>&quot;grid grid-cols-1 gap-6 border-b border-[#F0F0F0] py-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 52, 63 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>span</code> · 53, 64 | <code>&quot;text-xs font-bold uppercase tracking-[1px] text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 56 | <code>&quot;text-lg font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 57, 67 | <code>&quot;text-sm leading-[23px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 73 | <code>&quot;py-6&quot;</code> |  |
| <code>div</code> · 74 | <code>&quot;flex justify-between pb-3 text-xs font-bold uppercase tracking-[1px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 78, 94 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;flex items-center justify-between border-t border-dashed border-[#F0F0F0] py-4&quot;</code> |  |
| <code>div</code> · 86 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>Image</code> · 87 | <code>&quot;h-10 w-10 rounded-lg bg-[#E9F0E3] object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={40}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={40}</code> |
| <code>span</code> · 95 | <code>&quot;text-lg font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 96 | <code>&quot;text-base text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 101 | <code>&quot;text-xl font-semibold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 108 | <code>&quot;flex items-end justify-between gap-8 border-t border-[#F0F0F0] pt-6&quot;</code> |  |
| <code>Image</code> · 109 | <code>&quot;h-9 w-auto&quot;</code> | <code>alt=&quot;Veda Bharath&quot;</code>; <code>height={58}</code>; <code>src=&quot;/veda-bharat-logo.png&quot;</code>; <code>width={140}</code> |
| <code>div</code> · 118 | <code>&quot;flex w-full max-w-[240px] flex-col gap-3&quot;</code> |  |
| <code>div</code> · 119, 123 | <code>&quot;flex items-center justify-between text-base text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 121 | <code>&quot;text-base font-medium text-[#171D15]&quot;</code> |  |
| <code>span</code> · 125 | <code>&quot;text-base font-medium text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 127 | <code>&quot;flex items-center justify-between border-t border-[#F0F0F0] pt-3 text-lg font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 131 | <code>&quot;ml-auto w-fit rounded-full bg-[#EBF7EC] px-3 py-1 text-xs font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 137 | <code>&quot;no-print mt-6 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 138 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 141 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={() =&gt; { window.print(); onPrinted(); }}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/InvoicePrintedModal.tsx — 54 lines</summary>

Source: [src/components/orders/modals/InvoicePrintedModal.tsx](<src/components/orders/modals/InvoicePrintedModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type InvoicePrintedModalProps = {
  open: boolean;
  onBack: () => void;
  onContinue: () => void;
};
```

Lucide imports: <code>Check</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 16 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={onBack}</code>; <code>open={open}</code> |
| <code>div</code> · 17 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 18 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 24 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 29 | <code>&quot;h-7 w-7 text-[#F7931E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 33 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 34 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 39 | <code>&quot;mt-2 flex w-full items-center justify-between&quot;</code> |  |
| <code>button</code> · 40 | <code>&quot;cursor-pointer text-sm font-semibold text-[#3E4A3C] hover:text-black&quot;</code> | <code>onClick={onBack}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 47 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onContinue}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/ModalShell.tsx — 67 lines</summary>

Source: [src/components/orders/modals/ModalShell.tsx](<src/components/orders/modals/ModalShell.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
};
```

Lucide imports: <code>X</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 35 | Inherited / component-owned |  |
| <code>motion.div</code> · 37 | <code>&quot;modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 py-8 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={onClose}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 45 | <code>{`modal-card relative w-full ${maxWidth} rounded-[24px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.12)]`}</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>initial={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>onClick={(event) =&gt; event.stopPropagation()}</code>; <code>transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>button</code> · 53 | <code>&quot;absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#F5F5F7] text-[#6E7B6A] transition-colors hover:bg-[#e9e9ec]&quot;</code> | <code>aria-label=&quot;Close&quot;</code>; <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 59 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/components/orders/modals/OrderFulfillmentModal.tsx — 90 lines</summary>

Source: [src/components/orders/modals/OrderFulfillmentModal.tsx](<src/components/orders/modals/OrderFulfillmentModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 13
type FlowStep = "pack" | "invoice" | "ship" | "shipped" | "track";
// line 15
type OrderFulfillmentModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  initialStep?: FlowStep;
};
// line 28
[step, setStep] = useState<FlowStep>(initialStep);
// line 29
[exitConfirmOpen, setExitConfirmOpen] = useState(false);
// line 30
[printedConfirmOpen, setPrintedConfirmOpen] = useState(false);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>PackOrderModal</code> · 42 | Inherited / component-owned | <code>onClose={() =&gt; setExitConfirmOpen(true)}</code>; <code>onPackOrder={() =&gt; setStep(&quot;ship&quot;)}</code>; <code>onPrintInvoice={() =&gt; setStep(&quot;invoice&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;pack&quot; &amp;&amp; !exitConfirmOpen}</code> |
| <code>InvoiceModal</code> · 49 | Inherited / component-owned | <code>onClose={() =&gt; setExitConfirmOpen(true)}</code>; <code>onPrinted={() =&gt; setPrintedConfirmOpen(true)}</code>; <code>open={open &amp;&amp; step === &quot;invoice&quot; &amp;&amp; !exitConfirmOpen &amp;&amp; !printedConfirmOpen}</code> |
| <code>InvoicePrintedModal</code> · 55 | Inherited / component-owned | <code>onBack={() =&gt; { setPrintedConfirmOpen(false); setStep(&quot;pack&quot;); }}</code>; <code>onContinue={() =&gt; { setPrintedConfirmOpen(false); setStep(&quot;ship&quot;); }}</code>; <code>open={open &amp;&amp; printedConfirmOpen}</code> |
| <code>ShipOrderModal</code> · 71 | Inherited / component-owned | <code>onCancel={onClose}</code>; <code>onShip={() =&gt; setStep(&quot;shipped&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;ship&quot;}</code> |
| <code>ShippedOrderModal</code> · 77 | Inherited / component-owned | <code>onBack={onClose}</code>; <code>onTrack={() =&gt; setStep(&quot;track&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;shipped&quot;}</code> |
| <code>TrackShipmentModal</code> · 83 | Inherited / component-owned | <code>onClose={() =&gt; setStep(&quot;shipped&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;track&quot;}</code> |

</details>

<details>
<summary>src/components/orders/modals/PackOrderModal.tsx — 127 lines</summary>

Source: [src/components/orders/modals/PackOrderModal.tsx](<src/components/orders/modals/PackOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
type PackOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onPrintInvoice: () => void;
  onPackOrder: () => void;
};
```

Lucide imports: <code>Mail, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 38 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[820px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 39 | <code>&quot;max-h-[85vh] overflow-y-auto p-7 sm:p-10&quot;</code> |  |
| <code>div</code> · 40 | <code>&quot;flex flex-wrap items-start justify-between gap-4 border-b border-[#F1F5F9] pb-6 sm:pr-10&quot;</code> |  |
| <code>div</code> · 41, 89 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 42 | <code>&quot;text-2xl font-bold tracking-[-0.7px] text-[#171D15]&quot;</code> |  |
| <code>p</code> · 43 | <code>&quot;text-sm font-semibold text-[#3E4A3C]/70&quot;</code> |  |
| <code>span</code> · 45 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 48 | <code>&quot;grid grid-cols-1 gap-8 py-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 49, 83, 98 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>h3</code> · 50, 84, 99 | <code>&quot;text-[15px] font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 51 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;flex items-center gap-4 rounded-2xl bg-[#F5F5F7] p-5&quot;</code> |  |
| <code>Image</code> · 59 | <code>&quot;h-16 w-16 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={64}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={64}</code> |
| <code>div</code> · 66 | <code>&quot;flex flex-1 flex-col&quot;</code> |  |
| <code>span</code> · 67, 90 | <code>&quot;text-[15px] font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 68 | <code>&quot;text-[13px] text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 72 | <code>&quot;text-lg font-bold text-[#F7931E]&quot;</code> |  |
| <code>p</code> · 77 | <code>&quot;text-sm text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 85 | <code>&quot;flex items-start gap-4 rounded-2xl bg-[#F5F5F7] p-5&quot;</code> |  |
| <code>div</code> · 86 | <code>&quot;flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/10 text-base font-bold text-[#F7931E]&quot;</code> |  |
| <code>span</code> · 91 | <code>&quot;text-[13px] leading-[21px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 100 | <code>&quot;flex flex-col gap-4 rounded-2xl bg-[#F5F5F7] p-5&quot;</code> |  |
| <code>div</code> · 101, 107 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>Phone</code> · 102 | <code>&quot;h-[15px] w-[15px] shrink-0 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 103, 109 | <code>&quot;text-[15px] font-semibold text-[#171D15]&quot;</code> |  |
| <code>Mail</code> · 108 | <code>&quot;h-[15px] w-[15px] shrink-0 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 116 | <code>&quot;flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 117 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onPrintInvoice}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 120 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onPackOrder}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/ProcessRefundModal.tsx — 111 lines</summary>

Source: [src/components/orders/modals/ProcessRefundModal.tsx](<src/components/orders/modals/ProcessRefundModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type ProcessRefundModalProps = {
  order: Order;
  amount: number;
  open: boolean;
  onBack: () => void;
  onConfirm: () => void;
};
// line 18
[confirmed, setConfirmed] = useState(false);
```

Lucide imports: <code>Check, IndianRupee</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>AnimatePresence</code> · 45 | Inherited / component-owned |  |
| <code>motion.div</code> · 47 | <code>&quot;fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm&quot;</code> | <code>animate={{ opacity: 1 }}</code>; <code>exit={{ opacity: 0 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>onClick={confirmed ? undefined : onBack}</code>; <code>transition={{ duration: 0.18 }}</code> |
| <code>motion.div</code> · 55 | <code>&quot;flex w-full max-w-[460px] flex-col items-center gap-6 rounded-[20px] bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]&quot;</code> | <code>animate={{ opacity: 1, y: 0, scale: 1 }}</code>; <code>exit={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>initial={{ opacity: 0, y: 12, scale: 0.97 }}</code>; <code>onClick={(event) =&gt; event.stopPropagation()}</code>; <code>transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}</code> |
| <code>div</code> · 65 | <code>&quot;flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 66 | <code>&quot;h-6 w-6 text-[#3BB54A]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 68, 84 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h2</code> · 69, 85 | <code>&quot;text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 70, 87 | <code>&quot;text-sm leading-[22px] text-[#86868B]&quot;</code> |  |
| <code>button</code> · 75 | <code>{`w-full ${PRIMARY_BUTTON}`}</code> | <code>onClick={onConfirm}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 81 | <code>&quot;flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> |  |
| <code>IndianRupee</code> · 82 | <code>&quot;h-6 w-6 text-[#F7931E]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>span</code> · 86 | <code>&quot;text-3xl font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 92 | <code>&quot;flex w-full justify-center gap-3&quot;</code> |  |
| <code>button</code> · 93 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onBack}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 96 | <code>&quot;cursor-pointer whitespace-nowrap rounded-xl bg-[#F7931E] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_15px_-3px_rgba(247,147,30,0.2)] transition-colors hover:bg-[#e6850f]&quot;</code> | <code>onClick={() =&gt; setConfirmed(true)}</code>; <code>type=&quot;button&quot;</code> |

</details>





<details>
<summary>src/components/orders/modals/ReturnedFlowModal.tsx — 73 lines</summary>

Source: [src/components/orders/modals/ReturnedFlowModal.tsx](<src/components/orders/modals/ReturnedFlowModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 10
type FlowStep = "detail" | "refund" | "ticket";
// line 12
type ReturnedFlowModalProps = {
  order: Order;
  open: boolean;
  initialStep?: FlowStep;
  onClose: () => void;
  onRefunded: () => void;
};
// line 33
[step, setStep] = useState<FlowStep>(initialStep);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ReturnedOrderModal</code> · 48 | Inherited / component-owned | <code>onClose={onClose}</code>; <code>onProcessRefund={() =&gt; setStep(&quot;refund&quot;)}</code>; <code>onViewTicket={() =&gt; setStep(&quot;ticket&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;detail&quot;}</code> |
| <code>ProcessRefundModal</code> · 55 | Inherited / component-owned | <code>onBack={() =&gt; setStep(&quot;detail&quot;)}</code>; <code>onConfirm={() =&gt; { onRefunded(); onClose(); }}</code>; <code>open={open &amp;&amp; step === &quot;refund&quot;}</code> |
| <code>SupportTicketModal</code> · 65 | Inherited / component-owned | <code>onClose={onClose}</code>; <code>onInitiateRefund={() =&gt; setStep(&quot;refund&quot;)}</code>; <code>open={open &amp;&amp; step === &quot;ticket&quot;}</code> |

</details>

<details>
<summary>src/components/orders/modals/ReturnedOrderModal.tsx — 167 lines</summary>

Source: [src/components/orders/modals/ReturnedOrderModal.tsx](<src/components/orders/modals/ReturnedOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type ReturnedOrderModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onProcessRefund: () => void;
  onViewTicket: () => void;
};
```

Lucide imports: <code>Info, MapPin, MessageCircleQuestion, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 29 | <code>&quot;flex items-center gap-3 border-t border-[#F1F5F9] pt-3 first:border-t-0 first:pt-0&quot;</code> |  |
| <code>Image</code> · 30 | <code>&quot;h-11 w-11 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={44}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={44}</code> |
| <code>div</code> · 37 | <code>&quot;flex flex-1 flex-col&quot;</code> |  |
| <code>span</code> · 38, 93, 101, 112, 118, 136 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 39, 40 | <code>&quot;text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 44 | <code>&quot;flex flex-col items-end gap-1&quot;</code> |  |
| <code>span</code> · 45, 148 | <code>&quot;text-[10px] font-bold uppercase tracking-[0.6px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 48, 74 | <code>{pillClasses(&quot;red&quot;)}</code> |  |
| <code>ModalShell</code> · 69 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[900px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 70 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-7&quot;</code> |  |
| <code>div</code> · 71 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 72, 113 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>h2</code> · 73 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>button</code> · 76 | <code>&quot;flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E5E7] px-4 py-2 text-xs font-semibold text-[#171D15] transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={onViewTicket}</code>; <code>type=&quot;button&quot;</code> |
| <code>MessageCircleQuestion</code> · 81 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 86 | <code>&quot;mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 87, 110 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 88, 100, 111, 135 | <code>&quot;flex flex-col gap-3 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>div</code> · 89 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 90 | <code>&quot;flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-white&quot;</code> |  |
| <code>Info</code> · 91 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>p</code> · 95 | <code>&quot;rounded-xl bg-[#F0F9F1] p-3.5 text-xs leading-[19px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 102 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>ReturnedItemRow</code> · 104 | Inherited / component-owned |  |
| <code>span</code> · 114 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/10 text-xs font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 117 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 120 | <code>&quot;flex items-center gap-1 text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>Phone</code> · 121 | <code>&quot;h-3 w-3 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 128 | <code>&quot;flex items-start gap-2 border-t border-[#F1F5F9] pt-3&quot;</code> |  |
| <code>MapPin</code> · 129 | <code>&quot;mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F9A51A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 130 | <code>&quot;text-xs leading-[18px] text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 137, 141 | <code>&quot;flex items-center justify-between text-sm&quot;</code> |  |
| <code>span</code> · 138, 142 | <code>&quot;text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 139 | <code>&quot;font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 143 | <code>&quot;font-semibold text-[#DC2626]&quot;</code> |  |
| <code>div</code> · 147 | <code>&quot;flex flex-col gap-0.5 border-t border-[#F1F5F9] pt-3&quot;</code> |  |
| <code>span</code> · 151 | <code>&quot;text-2xl font-bold text-[#F7931E]&quot;</code> |  |
| <code>button</code> · 155 | <code>{`w-full text-center ${PRIMARY_BUTTON}`}</code> | <code>onClick={onProcessRefund}</code>; <code>type=&quot;button&quot;</code> |
| <code>p</code> · 158 | <code>&quot;text-[11px] leading-[16px] text-[#86868B]&quot;</code> |  |

</details>

<details>
<summary>src/components/orders/modals/ShipOrderModal.tsx — 198 lines</summary>

Source: [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 16
type ShipOrderModalProps = {
  order: Order;
  open: boolean;
  onCancel: () => void;
  onShip: () => void;
};
// line 78
[smsEnabled, setSmsEnabled] = useState(true);
// line 79
[emailEnabled, setEmailEnabled] = useState(true);
// line 80
[courier, setCourier] = useState(COURIERS[0]);
// line 81
[tracking, setTracking] = useState(generateTrackingNumber);
```

Lucide imports: <code>Barcode, CheckCircle2, ChevronDown, Info</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>button</code> · 37 | <code>{`flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${ checked ? &quot;bg-[#F7931E]&quot; : &quot;bg-[#D1D5DB]&quot; }`}</code> | <code>aria-checked={checked}</code>; <code>onClick={() =&gt; onChange(!checked)}</code>; <code>role=&quot;switch&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 46 | <code>{`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${ checked ? &quot;translate-x-5&quot; : &quot;translate-x-0&quot; }`}</code> |  |
| <code>div</code> · 67 | <code>&quot;flex items-center justify-between gap-3 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>div</code> · 68, 113 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 69 | <code>&quot;text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 70 | <code>&quot;text-xs text-[#6E7B6A]&quot;</code> |  |
| <code>Toggle</code> · 72 | Inherited / component-owned | <code>checked={checked}</code>; <code>onChange={onChange}</code> |
| <code>ModalShell</code> · 88 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[860px]&quot;</code>; <code>onClose={onCancel}</code>; <code>open={open}</code> |
| <code>div</code> · 89 | <code>&quot;max-h-[85vh] overflow-y-auto p-7 sm:p-9&quot;</code> |  |
| <code>div</code> · 90 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 91 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 92 | <code>&quot;text-2xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 93 | <code>&quot;text-[13px] font-semibold tracking-[0.2px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 97 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 100 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 101 | <code>&quot;flex items-center justify-between rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>span</code> · 102, 114 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 103 | <code>&quot;flex items-center gap-1.5 text-sm font-bold text-[#F7931E]&quot;</code> |  |
| <code>CheckCircle2</code> · 104 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 109 | <code>&quot;flex items-center gap-3 rounded-xl bg-[#FDF4E7] p-4&quot;</code> |  |
| <code>div</code> · 110 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E]/15 text-[#F7931E]&quot;</code> |  |
| <code>CheckCircle2</code> · 111 | <code>&quot;h-5 w-5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 115 | <code>&quot;text-xs text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 120 | <code>&quot;mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>div</code> · 122, 143 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>label</code> · 123 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> | <code>htmlFor=&quot;courier-select&quot;</code> |
| <code>div</code> · 126 | <code>&quot;relative flex h-14 items-center rounded-xl bg-[#F5F5F7] px-4&quot;</code> |  |
| <code>select</code> · 127 | <code>&quot;w-full cursor-pointer appearance-none bg-transparent text-sm font-semibold text-[#171D15] outline-none&quot;</code> | <code>id=&quot;courier-select&quot;</code>; <code>onChange={(event) =&gt; setCourier(event.target.value)}</code>; <code>value={courier}</code> |
| <code>option</code> · 134 | Inherited / component-owned | <code>value={name}</code> |
| <code>ChevronDown</code> · 139 | <code>&quot;pointer-events-none h-4 w-4 shrink-0 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>label</code> · 144 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> | <code>htmlFor=&quot;tracking-number&quot;</code> |
| <code>div</code> · 147 | <code>&quot;flex h-14 items-center gap-2 rounded-xl border-2 border-[#F7931E] pl-4 pr-2&quot;</code> |  |
| <code>input</code> · 148 | <code>&quot;w-full bg-transparent text-sm font-semibold text-[#171D15] outline-none&quot;</code> | <code>id=&quot;tracking-number&quot;</code>; <code>onChange={(event) =&gt; setTracking(event.target.value)}</code>; <code>value={tracking}</code> |
| <code>button</code> · 154 | <code>&quot;flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#F7931E]/10 text-[#F7931E] transition-colors hover:bg-[#F7931E]/20&quot;</code> | <code>aria-label=&quot;Scan barcode&quot;</code>; <code>onClick={() =&gt; setTracking(generateTrackingNumber())}</code>; <code>title=&quot;Scan barcode&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>Barcode</code> · 161 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 164 | <code>&quot;flex items-center gap-1.5 text-xs font-semibold text-[#F7931E]&quot;</code> |  |
| <code>Info</code> · 165 | <code>&quot;h-3.5 w-3.5 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 171 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>NotificationRow</code> · 172 | Inherited / component-owned | <code>checked={smsEnabled}</code>; <code>onChange={setSmsEnabled}</code>; <code>title=&quot;Send SMS tracking link&quot;</code> |
| <code>NotificationRow</code> · 178 | Inherited / component-owned | <code>checked={emailEnabled}</code>; <code>onChange={setEmailEnabled}</code>; <code>title=&quot;Send Email dispatch confirmation&quot;</code> |
| <code>div</code> · 187 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 188 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onCancel}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 191 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onShip}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/ShippedOrderModal.tsx — 154 lines</summary>

Source: [src/components/orders/modals/ShippedOrderModal.tsx](<src/components/orders/modals/ShippedOrderModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type ShippedOrderModalProps = {
  order: Order;
  open: boolean;
  onBack: () => void;
  onTrack: () => void;
};
```

Lucide imports: <code>Check, Truck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>svg</code> · 20 | <code>{className}</code> | <code>aria-hidden=&quot;true&quot;</code>; <code>fill=&quot;currentColor&quot;</code>; <code>viewBox=&quot;0 0 24 24&quot;</code> |
| <code>path</code> · 21 | Inherited / component-owned | <code>d=&quot;M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z&quot;</code> |
| <code>div</code> · 28 | <code>&quot;flex flex-col items-center&quot;</code> |  |
| <code>span</code> · 30 | <code>&quot;flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3BB54A] text-white shadow-[0_0_0_4px_white]&quot;</code> |  |
| <code>Check</code> · 31 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={3}</code> |
| <code>span</code> · 34 | <code>&quot;h-6 w-6 shrink-0 rounded-full border-2 border-[#E5E5E7] bg-white shadow-[0_0_0_4px_white]&quot;</code> |  |
| <code>span</code> · 37 | <code>{`mt-1 w-px flex-1 ${step.done ? &quot;bg-[#3BB54A]&quot; : &quot;bg-[#E5E5E7]&quot;}`}</code> |  |
| <code>ModalShell</code> · 59 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[900px]&quot;</code>; <code>onClose={onBack}</code>; <code>open={open}</code> |
| <code>div</code> · 60 | <code>&quot;max-h-[85vh] overflow-y-auto p-7 sm:p-9&quot;</code> |  |
| <code>div</code> · 61 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 62 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 63 | <code>&quot;text-2xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 64 | <code>&quot;text-sm font-semibold text-[#3E4A3C]/70&quot;</code> |  |
| <code>span</code> · 66 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 69 | <code>&quot;mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 70 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 71 | <code>&quot;flex flex-col gap-2 rounded-xl bg-[#F5F5F7] p-4&quot;</code> |  |
| <code>div</code> · 72 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>Truck</code> · 73 | <code>&quot;h-4 w-4 text-[#6E7B6A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 74, 85 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>span</code> · 78 | <code>&quot;text-base font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 79 | <code>&quot;text-sm font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>span</code> · 80, 135 | <code>&quot;text-xs text-[#86868B]&quot;</code> |  |
| <code>div</code> · 84, 104 | <code>&quot;flex flex-col gap-2 rounded-xl border border-[#F1F5F9] p-4&quot;</code> |  |
| <code>div</code> · 88 | <code>&quot;flex items-center justify-between gap-3&quot;</code> |  |
| <code>div</code> · 89 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>Image</code> · 90 | <code>&quot;h-10 w-10 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={40}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={40}</code> |
| <code>span</code> · 97 | <code>&quot;text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 99, 106 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>div</code> · 105 | <code>&quot;flex items-start justify-between gap-3&quot;</code> |  |
| <code>a</code> · 107 | <code>&quot;flex shrink-0 items-center gap-1 text-xs font-bold uppercase text-[#25D366]&quot;</code> | <code>href=&quot;#&quot;</code>; <code>onClick={(event) =&gt; event.preventDefault()}</code> |
| <code>WhatsAppIcon</code> · 112 | <code>&quot;h-3.5 w-3.5&quot;</code> |  |
| <code>span</code> · 116 | <code>&quot;text-xs leading-[18px] text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 117, 134 | <code>&quot;text-xs text-[#3E4A3C]&quot;</code> |  |
| <code>div</code> · 121 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 122 | <code>&quot;mb-4 text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>div</code> · 126 | <code>&quot;flex gap-4&quot;</code> |  |
| <code>TimelineDot</code> · 127 | Inherited / component-owned | <code>step={step}</code> |
| <code>div</code> · 128 | <code>&quot;flex flex-1 flex-col gap-0.5 pb-6&quot;</code> |  |
| <code>span</code> · 129 | <code>{`text-sm font-bold ${step.done ? &quot;text-[#171D15]&quot; : &quot;text-[#86868B]&quot;}`}</code> |  |
| <code>p</code> · 139 | <code>&quot;text-xs italic text-[#86868B]&quot;</code> |  |
| <code>div</code> · 143 | <code>&quot;mt-7 flex justify-end gap-4 border-t border-[#F1F5F9] pt-6&quot;</code> |  |
| <code>button</code> · 144 | <code>{SECONDARY_BUTTON}</code> | <code>onClick={onBack}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 147 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onTrack}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/SupportTicketModal.tsx — 208 lines</summary>

Source: [src/components/orders/modals/SupportTicketModal.tsx](<src/components/orders/modals/SupportTicketModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 10
type SupportTicketModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
  onInitiateRefund: () => void;
};
// line 23
[reply, setReply] = useState("");
// line 24
[resolved, setResolved] = useState(false);
// line 25
[sent, setSent] = useState(false);
// line 26
[attachments, setAttachments] = useState<File[]>([]);
// line 27
[emojiOpen, setEmojiOpen] = useState(false);
```

Lucide imports: <code>Paperclip, Smile, X, Zap</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 33 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[780px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 34 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-7&quot;</code> |  |
| <code>div</code> · 35 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 36 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 37 | <code>&quot;text-xl font-bold text-[#171D15]&quot;</code> |  |
| <code>p</code> · 38 | <code>&quot;text-sm font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 44 | <code>&quot;mt-3 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 45 | <code>{pillClasses(&quot;green&quot;)}</code> |  |
| <code>span</code> · 46 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 49 | <code>&quot;mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 50, 79 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>span</code> · 51, 81 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#6E7B6A]&quot;</code> |  |
| <code>p</code> · 54 | <code>&quot;text-sm font-bold text-[#171D15]&quot;</code> |  |
| <code>span</code> · 55 | <code>&quot;font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;rounded-xl bg-[#F0F9F1] p-3.5&quot;</code> |  |
| <code>p</code> · 58 | <code>&quot;text-sm leading-[21px] text-[#3E4A3C]&quot;</code> |  |
| <code>span</code> · 64 | <code>&quot;text-xs text-[#86868B]&quot;</code> |  |
| <code>div</code> · 65 | <code>&quot;flex gap-2&quot;</code> |  |
| <code>Image</code> · 67 | <code>&quot;h-14 w-14 shrink-0 rounded-lg border border-[#F1F5F9] object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={56}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={56}</code> |
| <code>div</code> · 80 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>button</code> · 84 | <code>&quot;flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#3BB54A] hover:text-[#2f9d3d]&quot;</code> | <code>onClick={() =&gt; setReply(TEMPLATE_REPLY)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Zap</code> · 89 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 93 | <code>&quot;relative flex-1 rounded-xl border border-[#E5E5E7] p-3&quot;</code> |  |
| <code>textarea</code> · 94 | <code>&quot;h-full w-full resize-none bg-transparent text-sm text-[#171D15] outline-none placeholder:text-[#86868B]&quot;</code> | <code>onChange={(event) =&gt; setReply(event.target.value)}</code>; <code>placeholder={`Type your response to ${firstName} here...`}</code>; <code>rows={7}</code>; <code>value={reply}</code> |
| <code>input</code> · 101 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/*&quot;</code>; <code>multiple=true</code>; <code>onChange={(event) =&gt; { const files = Array.from(event.target.files ?? []); setAttachments((prev) =&gt; [...prev, ...files]); event.target.value = &quot;&quot;; }}</code>; <code>type=&quot;file&quot;</code> |
| <code>div</code> · 113 | <code>&quot;absolute bottom-3 right-3 flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 114 | <code>&quot;cursor-pointer text-[#86868B] transition-colors hover:text-[#171D15]&quot;</code> | <code>aria-label=&quot;Attach file&quot;</code>; <code>onClick={() =&gt; fileInputRef.current?.click()}</code>; <code>title=&quot;Attach file&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>Paperclip</code> · 121 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 123 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 124 | <code>&quot;cursor-pointer text-[#86868B] transition-colors hover:text-[#171D15]&quot;</code> | <code>aria-label=&quot;Insert emoji&quot;</code>; <code>onClick={() =&gt; setEmojiOpen((value) =&gt; !value)}</code>; <code>title=&quot;Insert emoji&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>Smile</code> · 131 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 135 | <code>&quot;fixed inset-0 z-10&quot;</code> | <code>onClick={() =&gt; setEmojiOpen(false)}</code> |
| <code>div</code> · 136 | <code>&quot;absolute bottom-7 right-0 z-20 grid w-[232px] grid-cols-6 gap-1 rounded-xl border border-[#E5E5E7] bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 138 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={() =&gt; { setReply((prev) =&gt; prev + emoji); setEmojiOpen(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 158 | <code>&quot;flex flex-wrap gap-2&quot;</code> |  |
| <code>span</code> · 160 | <code>&quot;flex items-center gap-1.5 rounded-full bg-[#F5F5F7] py-1 pl-3 pr-1.5 text-xs font-medium text-[#171D15]&quot;</code> |  |
| <code>button</code> · 165 | <code>&quot;flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[#86868B] hover:bg-[#e9e9ec] hover:text-[#171D15]&quot;</code> | <code>aria-label={`Remove ${file.name}`}</code>; <code>onClick={() =&gt; setAttachments((prev) =&gt; prev.filter((_, i) =&gt; i !== index))}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 171 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 180 | <code>&quot;mt-6 flex flex-col gap-4 border-t border-[#F1F5F9] pt-5 sm:flex-row sm:items-center sm:justify-between&quot;</code> |  |
| <code>label</code> · 181 | <code>&quot;flex cursor-pointer items-center gap-2 text-sm font-semibold text-[#171D15]&quot;</code> |  |
| <code>input</code> · 182 | <code>&quot;h-4 w-4 cursor-pointer accent-[#F7931E]&quot;</code> | <code>checked={resolved}</code>; <code>onChange={(event) =&gt; setResolved(event.target.checked)}</code>; <code>type=&quot;checkbox&quot;</code> |
| <code>div</code> · 191 | <code>&quot;flex items-center gap-5&quot;</code> |  |
| <code>button</code> · 192 | <code>&quot;cursor-pointer text-sm font-semibold text-[#3BB54A] transition-colors hover:text-[#2f9d3d] disabled:cursor-not-allowed disabled:opacity-50&quot;</code> | <code>disabled={!reply.trim() &#124;&#124; sent}</code>; <code>onClick={() =&gt; setSent(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 200 | <code>{PRIMARY_BUTTON}</code> | <code>onClick={onInitiateRefund}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/orders/modals/TrackShipmentModal.tsx — 156 lines</summary>

Source: [src/components/orders/modals/TrackShipmentModal.tsx](<src/components/orders/modals/TrackShipmentModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type TrackShipmentModalProps = {
  order: Order;
  open: boolean;
  onClose: () => void;
};
// line 48
[copied, setCopied] = useState(false);
```

Lucide imports: <code>Check, Copy, ExternalLink, Share2, Truck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>span</code> · 28 | <code>&quot;flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F7931E]&quot;</code> |  |
| <code>Check</code> · 29 | <code>&quot;h-3 w-3 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>span</code> · 35 | <code>&quot;flex h-6 w-6 shrink-0 items-center justify-center&quot;</code> |  |
| <code>span</code> · 36 | <code>&quot;h-3 w-3 rounded-full bg-[#F7931E] shadow-[0_0_0_4px_#FFEDD5]&quot;</code> |  |
| <code>span</code> · 41 | <code>&quot;flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F5F5F7]&quot;</code> |  |
| <code>span</code> · 42 | <code>&quot;h-2.5 w-2.5 rounded-full bg-[#86868B]&quot;</code> |  |
| <code>ModalShell</code> · 57 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[960px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 58 | <code>&quot;max-h-[85vh] overflow-y-auto p-8 sm:p-12&quot;</code> |  |
| <code>div</code> · 59 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 60, 70 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 61 | <code>&quot;text-[28px] font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>p</code> · 62 | <code>&quot;text-[15px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 64 | <code>{pillClasses(&quot;blue&quot;)}</code> |  |
| <code>div</code> · 67 | <code>&quot;mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 68 | <code>&quot;flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 69 | <code>&quot;flex items-center justify-between gap-4 rounded-2xl bg-[#F5F5F7] p-6&quot;</code> |  |
| <code>span</code> · 71 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#86868B]&quot;</code> |  |
| <code>span</code> · 74, 87 | <code>&quot;text-base font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>span</code> · 76 | <code>&quot;whitespace-nowrap rounded-full bg-[#EBF7EC] px-3 py-1 text-sm font-semibold text-[#3BB54A]&quot;</code> |  |
| <code>div</code> · 81 | <code>&quot;flex items-center justify-between gap-4 rounded-2xl border border-black/5 p-6&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>div</code> · 83 | <code>&quot;flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Truck</code> · 84 | <code>&quot;h-5 w-5 text-[#1D1D1F]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 86, 121 | <code>&quot;flex flex-col&quot;</code> |  |
| <code>span</code> · 88 | <code>&quot;text-sm font-medium text-[#3BB54A]&quot;</code> |  |
| <code>button</code> · 91 | <code>&quot;flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#86868B] transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>aria-label=&quot;Copy tracking ID&quot;</code>; <code>onClick={handleCopy}</code>; <code>title={copied ? &quot;Copied!&quot; : &quot;Copy tracking ID&quot;}</code>; <code>type=&quot;button&quot;</code> |
| <code>Copy</code> · 98 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 102 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>a</code> · 103 | <code>&quot;flex h-12 items-center justify-center gap-2 rounded-lg border border-[#E5E5E7] text-base font-semibold text-[#1D1D1F] transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>href=&quot;#&quot;</code>; <code>onClick={(event) =&gt; event.preventDefault()}</code> |
| <code>ExternalLink</code> · 109 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 111 | <code>&quot;flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#F7931E] text-base font-semibold text-white transition-colors hover:bg-[#e6850f]&quot;</code> | <code>type=&quot;button&quot;</code> |
| <code>Share2</code> · 116 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 122 | <code>&quot;mb-8 text-xl font-bold text-[#1D1D1F]&quot;</code> |  |
| <code>div</code> · 124 | <code>&quot;flex gap-4&quot;</code> |  |
| <code>div</code> · 125 | <code>&quot;flex flex-col items-center&quot;</code> |  |
| <code>TimelineDot</code> · 126 | Inherited / component-owned |  |
| <code>span</code> · 128 | <code>{`mt-1 w-0.5 flex-1 ${ step.status === &quot;pending&quot; ? &quot;bg-black/5&quot; : &quot;bg-[#F7931E]&quot; }`}</code> |  |
| <code>div</code> · 135 | <code>&quot;flex flex-1 flex-col gap-0.5 pb-10&quot;</code> |  |
| <code>span</code> · 136 | <code>{`text-[15px] ${ step.status === &quot;pending&quot; ? &quot;font-semibold text-[#86868B]&quot; : step.status === &quot;active&quot; ? &quot;font-bold text-[#1D1D1F]&quot; : &quot;font-semibold text-[#1D1D1F]&quot; }`}</code> |  |
| <code>span</code> · 147 | <code>&quot;text-[13px] text-[#86868B]&quot;</code> |  |

</details>

<details>
<summary>src/components/orders/modals/modalHelpers.ts — 104 lines</summary>

Source: [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```ts
// line 49
TONE_STYLES = {
  blue: "bg-[#E8F0FE] text-[#1A73E8]",
  green: "bg-[#EBF7EC] text-[#3BB54A]",
  orange: "bg-[#FEF3E2] text-[#F7931E]",
  red: "bg-[#FEE2E2] text-[#DC2626]",
} as const;
// line 100
SECONDARY_BUTTON =
  "cursor-pointer rounded-xl px-6 py-3 text-base font-semibold text-[#64748B] transition-colors hover:bg-[#F5F5F7]";
// line 103
PRIMARY_BUTTON =
  "cursor-pointer rounded-xl bg-[#F7931E] px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(247,147,30,0.2)] transition-colors hover:bg-[#e6850f]";
```

**Visual definitions / utility evidence**

```ts
// line 1
export function deriveEmail(customer: string) {
  const slug = customer.trim().toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).join(".");
  return `${slug}@example.com`;
}
// line 6
export function batchCode(itemName: string, orderId: string) {
  const initials = itemName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
  const num = orderId.replace(/\D/g, "").slice(-2);
  return `VB-${initials}-${num}`;
}
// line 17
export function splitVariant(variant: string) {
  const [packSize, price] = variant.split("•").map((part) => part.trim());
  return { packSize: packSize ?? variant, price: price ?? "" };
}
// line 22
export function maskPhone(phone: string) {
  const match = phone.match(/^(\+\d{1,3})\s?(.*)$/);
  if (!match) return phone;
  const [, code, rest] = match;

  const digits = rest.replace(/\D/g, "");
  const last3 = digits.slice(-3);
  const maskedDigits = "•".repeat(Math.max(digits.length - 3, 0)) + last3;

  const groups = rest.trim().split(/\s+/);
  let cursor = 0;
  const maskedGroups = groups.map((group) => {
    const chunk = maskedDigits.slice(cursor, cursor + group.length);
    cursor += group.length;
    return chunk;
  });

  return `${code} ${maskedGroups.join(" ")}`;
}
// line 42
export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(local.length, 7));
  return `${visible}***@${domain}`;
}
// line 58
export function pillClasses(tone: PillTone) {
  return `whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${TONE_STYLES[tone]}`;
}
// line 62
export function placedLabel(time: string) {
  return time.trim().toLowerCase().startsWith("ordered") ? time : `Placed ${time}`;
}
// line 66
export function transactionId(orderId: string) {
  const digits = orderId.replace(/\D/g, "").padStart(5, "0").slice(-5);
  return `#TXN-${digits}`;
}
// line 71
export function isCOD(paymentMethod: string) {
  return paymentMethod.toLowerCase().includes("cod");
}
// line 75
export function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
// line 84
export function ticketId(orderId: string) {
  const digits = orderId.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return `#TKT-${digits}`;
}
// line 89
export function deliveredOn(orderId: string) {
  const digits = Number(orderId.replace(/\D/g, "").slice(-3)) || 0;
  const date = new Date();
  date.setDate(date.getDate() - ((digits % 5) + 1));
  date.setHours(9 + (digits % 8), (digits % 4) * 15, 0, 0);

  const dateStr = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${dateStr} at ${timeStr}`;
}
```

</details>

<details>
<summary>src/components/reports/ReportCard.tsx — 50 lines</summary>

Source: [src/components/reports/ReportCard.tsx](<src/components/reports/ReportCard.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Download, type LucideIcon</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 30 | <code>&quot;flex flex-col gap-5 rounded-[24px] bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)]&quot;</code> |  |
| <code>div</code> · 31 | <code>&quot;flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F9A51A]&quot;</code> |  |
| <code>Icon</code> · 32 | <code>&quot;h-6 w-6 text-white&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 35 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>h3</code> · 36 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>p</code> · 37 | <code>&quot;text-sm leading-[22px] text-[#6E7B6A]&quot;</code> |  |
| <code>button</code> · 40 | <code>&quot;flex w-fit cursor-pointer items-center gap-2 text-sm font-semibold text-[#3BB54A] transition-colors hover:text-[#2f9d3d]&quot;</code> | <code>onClick={() =&gt; downloadCsv(fileName, rows)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Download</code> · 45 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |

</details>

<details>
<summary>src/components/reports/ReportsGrid.tsx — 55 lines</summary>

Source: [src/components/reports/ReportsGrid.tsx](<src/components/reports/ReportsGrid.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>ClipboardCheck, Gauge, ShoppingCart</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 49 | <code>&quot;mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3&quot;</code> |  |
| <code>ReportCard</code> · 51 | Inherited / component-owned |  |

</details>

<details>
<summary>src/components/super-admin/ActiveOffersCard.tsx — 44 lines</summary>

Source: [src/components/super-admin/ActiveOffersCard.tsx](<src/components/super-admin/ActiveOffersCard.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Tag</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 13 | <code>&quot;flex h-[380px] flex-[0.9] flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 14 | <code>&quot;flex shrink-0 items-center justify-between&quot;</code> |  |
| <code>h3</code> · 15 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>Link</code> · 16 | <code>&quot;cursor-pointer text-xs text-[#6B7280] hover:text-black&quot;</code> | <code>href=&quot;/super-admin/offers&quot;</code> |
| <code>div</code> · 21 | <code>&quot;mt-4 flex flex-1 flex-col gap-3 scrollbar-hide overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 23 | <code>&quot;flex shrink-0 items-center justify-between gap-3 rounded-2xl bg-[#FAFAFA] p-3&quot;</code> |  |
| <code>div</code> · 27 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 28 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white&quot;</code> |  |
| <code>Tag</code> · 29 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 32 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 33 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 36 | <code>&quot;shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#F7931E]&quot;</code> |  |

</details>

<details>
<summary>src/components/super-admin/ActiveSupportTicketsCard.tsx — 103 lines</summary>

Source: [src/components/super-admin/ActiveSupportTicketsCard.tsx](<src/components/super-admin/ActiveSupportTicketsCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 51
[activeTicket, setActiveTicket] = useState<TicketSummary | null>(null);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 54 | <code>&quot;flex h-[380px] flex-1 flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;flex shrink-0 items-center justify-between&quot;</code> |  |
| <code>h3</code> · 56 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>Link</code> · 57 | <code>&quot;cursor-pointer text-xs text-[#6B7280] hover:text-black&quot;</code> | <code>href=&quot;/super-admin/tickets&quot;</code> |
| <code>div</code> · 62 | <code>&quot;mt-4 flex flex-1 flex-col scrollbar-hide overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 64 | <code>{`flex shrink-0 items-start justify-between gap-4 py-4 ${ index !== TICKETS.length - 1 ? &quot;border-b border-[#F3F4F6]&quot; : &quot;&quot; }`}</code> |  |
| <code>div</code> · 70 | <code>&quot;min-w-0&quot;</code> |  |
| <code>div</code> · 71 | <code>&quot;flex flex-wrap items-center gap-2&quot;</code> |  |
| <code>span</code> · 72 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 73 | <code>&quot;text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 74 | <code>&quot;rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 78 | <code>&quot;mt-1 text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 79 | <code>&quot;mt-0.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;flex shrink-0 flex-col items-end gap-2&quot;</code> |  |
| <code>span</code> · 83 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 84 | <code>&quot;cursor-pointer whitespace-nowrap rounded-lg bg-[#F7931E] px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setActiveTicket(ticket)}</code>; <code>type=&quot;button&quot;</code> |
| <code>TicketReplyModal</code> · 96 | Inherited / component-owned | <code>onClose={() =&gt; setActiveTicket(null)}</code>; <code>open={activeTicket !== null}</code> |

</details>

<details>
<summary>src/components/super-admin/CustomerReviewsCard.tsx — 93 lines</summary>

Source: [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Star</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 42 | <code>&quot;flex h-[380px] flex-[1.75] flex-col rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 43 | <code>&quot;flex shrink-0 items-start justify-between gap-3&quot;</code> |  |
| <code>h3</code> · 45 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>Link</code> · 47 | <code>&quot;shrink-0 cursor-pointer text-xs text-[#6B7280] hover:text-black&quot;</code> | <code>href=&quot;/super-admin/reviews&quot;</code> |
| <code>div</code> · 55 | <code>&quot;mt-4 flex flex-1 flex-col gap-3 scrollbar-hide overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;flex shrink-0 flex-col gap-3 rounded-2xl bg-[#FAFAFA] p-4 sm:flex-row sm:items-center&quot;</code> |  |
| <code>div</code> · 61 | <code>&quot;flex items-center gap-3 sm:w-[190px] sm:shrink-0&quot;</code> |  |
| <code>div</code> · 62 | <code>{`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${review.avatarBg}`}</code> |  |
| <code>p</code> · 68 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 69 | <code>&quot;mt-0.5 flex items-center gap-0.5&quot;</code> |  |
| <code>Star</code> · 71 | <code>&quot;h-3 w-3 fill-[#F7931E] text-[#F7931E]&quot;</code> | <code>strokeWidth={0}</code> |
| <code>span</code> · 81 | <code>&quot;flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#F3E7D0] bg-white px-2 py-0.5 text-center text-[10px] font-bold text-[#F7931E]&quot;</code> |  |
| <code>p</code> · 85 | <code>&quot;ml-12 text-left text-xs leading-relaxed text-[#6B7280] sm:w-[340px]&quot;</code> |  |

</details>

<details>
<summary>src/components/super-admin/TopSellingProductsCard.tsx — 57 lines</summary>

Source: [src/components/super-admin/TopSellingProductsCard.tsx](<src/components/super-admin/TopSellingProductsCard.tsx>). Coverage: source parsed; visual rendering unverified.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 14 | <code>&quot;relative flex h-[380px] flex-1 flex-col overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white p-5 sm:p-6&quot;</code> |  |
| <code>div</code> · 15 | <code>&quot;flex shrink-0 items-start justify-between gap-3&quot;</code> |  |
| <code>h3</code> · 17 | <code>&quot;text-xl font-semibold text-black&quot;</code> |  |
| <code>Link</code> · 19 | <code>&quot;shrink-0 cursor-pointer text-xs text-[#6B7280] hover:text-black&quot;</code> | <code>href=&quot;/super-admin/products&quot;</code> |
| <code>div</code> · 27 | <code>&quot;relative z-10 mt-5 flex flex-1 flex-col gap-4 scrollbar-hide overflow-y-auto pr-1&quot;</code> |  |
| <code>div</code> · 29 | <code>&quot;flex shrink-0 items-center gap-3&quot;</code> |  |
| <code>div</code> · 30 | <code>&quot;h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 31 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={56}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={56}</code> |
| <code>p</code> · 40 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 41 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 47 | <code>&quot;pointer-events-none absolute bottom-0 right-0 hidden h-[330px] w-[360px] sm:block&quot;</code> |  |
| <code>Image</code> · 48 | <code>&quot;object-contain object-bottom&quot;</code> | <code>alt=&quot;&quot;</code>; <code>fill=true</code>; <code>src=&quot;/SuperAdmin/Dashboard/image%20400.png&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/content/BannerScheduledModal.tsx — 49 lines</summary>

Source: [src/components/super-admin/content/BannerScheduledModal.tsx](<src/components/super-admin/content/BannerScheduledModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type BannerScheduledModalProps = {
  open: boolean;
  onDone: () => void;
  bannerGradient: string;
  imageUrl?: string | null;
  startDateLabel: string;
};
```

Lucide imports: <code>Check</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 16 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[440px]&quot;</code>; <code>onClose={onDone}</code>; <code>open={open}</code> |
| <code>div</code> · 17 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>div</code> · 18 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 19 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 22 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 23 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 25 | <code>&quot;font-bold text-black&quot;</code> |  |
| <code>div</code> · 29 | <code>&quot;relative h-[110px] w-full overflow-hidden rounded-2xl border border-[#E5E7EB]&quot;</code> | <code>style={imageUrl ? undefined : { backgroundImage: bannerGradient }}</code> |
| <code>img</code> · 35 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;Scheduled banner&quot;</code>; <code>src={imageUrl}</code> |
| <code>button</code> · 39 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onDone}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/content/DateField.tsx — 150 lines</summary>

Source: [src/components/super-admin/content/DateField.tsx](<src/components/super-admin/content/DateField.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 46
type DateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
};
// line 53
[open, setOpen] = useState(false);
// line 54
[viewDate, setViewDate] = useState(new Date(value));
```

Lucide imports: <code>Calendar, ChevronLeft, ChevronRight</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 69 | <code>&quot;relative&quot;</code> |  |
| <code>label</code> · 70 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>button</code> · 71 | <code>&quot;mt-1.5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-left text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onClick={() =&gt; { setViewDate(new Date(value)); setOpen((prev) =&gt; !prev); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>Calendar</code> · 80 | <code>&quot;h-4 w-4 text-[#9CA3AF]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 84 | <code>&quot;absolute left-0 top-full z-20 mt-2 w-[300px] rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.14)]&quot;</code> |  |
| <code>div</code> · 85 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>p</code> · 86, 135 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>div</code> · 89 | <code>&quot;flex items-center gap-1&quot;</code> |  |
| <code>button</code> · 90 | <code>&quot;flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={() =&gt; setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 95 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 97 | <code>&quot;flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={() =&gt; setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 102 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 107 | <code>&quot;mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 112 | <code>&quot;grid grid-cols-7 gap-y-1 text-center text-xs&quot;</code> |  |
| <code>button</code> · 116 | <code>{`mx-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full ${ selected ? &quot;bg-[#F7931E] font-bold text-white&quot; : cell.inMonth ? &quot;text-[#374151] hover:bg-[#F5F5F7]&quot; : &quot;text-[#D1D5DB]&quot; }`}</code> | <code>onClick={() =&gt; onChange(cell.date)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 134 | <code>&quot;mt-3 flex items-center justify-between border-t border-[#F3F4F6] pt-3&quot;</code> |  |
| <code>button</code> · 138 | <code>&quot;cursor-pointer rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setOpen(false)}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/content/SaveDraftModal.tsx — 65 lines</summary>

Source: [src/components/super-admin/content/SaveDraftModal.tsx](<src/components/super-admin/content/SaveDraftModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 7
type SaveDraftModalProps = {
  open: boolean;
  onKeepEditing: () => void;
  onSaveAsDraft: () => void;
};
```

Lucide imports: <code>FolderOpen, Info</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 15 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[440px]&quot;</code>; <code>onClose={onKeepEditing}</code>; <code>open={open}</code> |
| <code>div</code> · 16 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 17 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 23 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>FolderOpen</code> · 28 | <code>&quot;h-7 w-7 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 32 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 33 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 39 | <code>&quot;flex items-center gap-2 rounded-xl bg-[#FEF3E2] p-3 text-left text-xs text-[#B45309]&quot;</code> |  |
| <code>Info</code> · 40 | <code>&quot;h-4 w-4 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 41 | <code>&quot;whitespace-nowrap&quot;</code> |  |
| <code>div</code> · 46 | <code>&quot;mt-2 flex w-full items-center gap-3&quot;</code> |  |
| <code>button</code> · 47 | <code>&quot;flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onKeepEditing}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 54 | <code>&quot;flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onSaveAsDraft}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/content/contentData.ts — 200 lines</summary>

Source: [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 10
  gradient: string;
// line 26
    gradient: "linear-gradient(135deg, #3B2F1E 0%, #6B4A2B 45%, #E8D9B5 100%)",
// line 38
    gradient: "linear-gradient(135deg, #8A4B2C 0%, #C97B3D 100%)",
// line 49
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)",
// line 60
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)",
// line 71
    gradient: "linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)",
// line 92
  gradient: string;
// line 103
    gradient: "linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)",
// line 112
    gradient: "linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)",
// line 121
    gradient: "linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)",
// line 140
  gradient: string;
// line 152
    gradient: "linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)",
// line 162
    gradient: "linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)",
// line 172
    gradient: "linear-gradient(135deg, #4A3B2C 0%, #8A6B4A 100%)",
// line 182
    gradient: "linear-gradient(135deg, #4C6B3F 0%, #A9C97A 100%)",
// line 192
    gradient: "linear-gradient(135deg, #C9762F 0%, #E8B65A 100%)",
// line 196
export function statusPillClasses(status: BlogStatus | BannerStatus) {
  if (status === "Draft") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (status === "Scheduled") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
```

</details>

<details>
<summary>src/components/super-admin/drafts/draftsData.ts — 47 lines</summary>

Source: [src/components/super-admin/drafts/draftsData.ts](<src/components/super-admin/drafts/draftsData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 43
export function categoryPillClasses(category: DraftCategory) {
  if (category === "Products") return "bg-[#FEF3E2] text-[#F7931E]";
  if (category === "Master Data") return "bg-[#EBF7EC] text-[#22C55E]";
  return "bg-[#EFF6FF] text-[#3B82F6]";
}
```

</details>

<details>
<summary>src/components/super-admin/masterdata/ConfirmModal.tsx — 74 lines</summary>

Source: [src/components/super-admin/masterdata/ConfirmModal.tsx](<src/components/super-admin/masterdata/ConfirmModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  noteIcon?: LucideIcon;
  noteText?: string;
  cancelLabel: string;
  onCancel: () => void;
  confirmLabel: string;
  onConfirm: () => void;
};
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 38 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[440px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 39 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>div</code> · 40 | <code>{`flex h-16 w-16 items-center justify-center rounded-full ${iconBg}`}</code> |  |
| <code>Icon</code> · 41 | <code>{`h-7 w-7 ${iconColor}`}</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 44 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 45 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 49 | <code>&quot;flex w-full items-center gap-2 rounded-xl bg-[#F9FAFB] p-3 text-left text-sm text-[#374151]&quot;</code> |  |
| <code>NoteIcon</code> · 50 | <code>&quot;h-4 w-4 shrink-0 text-[#9CA3AF]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 55 | <code>&quot;mt-2 flex w-full items-center gap-3&quot;</code> |  |
| <code>button</code> · 56 | <code>&quot;flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onCancel}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 63 | <code>&quot;flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onConfirm}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/FormModal.tsx — 191 lines</summary>

Source: [src/components/super-admin/masterdata/FormModal.tsx](<src/components/super-admin/masterdata/FormModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
export type FormField = {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder?: string;
  required?: boolean;
};
// line 17
type FormModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  helperText?: string;
  fields: FormField[];
  submitLabel: string;
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
};
// line 29
[values, setValues] = useState<Record<string, string>>({});
// line 30
[step, setStep] = useState<"form" | "draft" | "draftSuccess" | "success">("form");
```

Lucide imports: <code>Check, FolderCheck, Tag</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>SaveDraftModal</code> · 47 | Inherited / component-owned | <code>onKeepEditing={() =&gt; setStep(&quot;form&quot;)}</code>; <code>onSaveAsDraft={() =&gt; setStep(&quot;draftSuccess&quot;)}</code>; <code>open={open}</code> |
| <code>ModalShell</code> · 57, 96, 132 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 58, 97 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 59 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 65, 104 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>FolderCheck</code> · 70 | <code>&quot;h-7 w-7 text-[#F7931E]&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>h2</code> · 74, 113, 134 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 75, 114 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>button</code> · 79, 116 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { setStep(&quot;form&quot;); onClose(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>motion.div</code> · 98 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>Check</code> · 109 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 133 | <code>&quot;p-6&quot;</code> |  |
| <code>div</code> · 136 | <code>&quot;mt-5 flex flex-col gap-5&quot;</code> |  |
| <code>div</code> · 139 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>label</code> · 140 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 142 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>textarea</code> · 146 | <code>&quot;mt-1.5 w-full resize-none rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setValues((prev) =&gt; ({ ...prev, [field.key]: event.target.value }))}</code>; <code>placeholder={field.placeholder}</code>; <code>rows={3}</code>; <code>value={values[field.key] ?? &quot;&quot;}</code> |
| <code>input</code> · 154 | <code>&quot;mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setValues((prev) =&gt; ({ ...prev, [field.key]: event.target.value }))}</code>; <code>placeholder={field.placeholder}</code>; <code>type=&quot;text&quot;</code>; <code>value={values[field.key] ?? &quot;&quot;}</code> |
| <code>p</code> · 165 | <code>&quot;flex items-center gap-1.5 text-xs text-[#F7931E]&quot;</code> |  |
| <code>Tag</code> · 166 | <code>&quot;h-3.5 w-3.5 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 172 | <code>&quot;mt-6 flex items-center justify-end gap-3&quot;</code> |  |
| <code>button</code> · 173 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setStep(&quot;draft&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 180 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleSubmit}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/HealthBenefitsPickerModal.tsx — 92 lines</summary>

Source: [src/components/super-admin/masterdata/HealthBenefitsPickerModal.tsx](<src/components/super-admin/masterdata/HealthBenefitsPickerModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type HealthBenefitsPickerModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};
// line 16
[search, setSearch] = useState("");
// line 17
[selected, setSelected] = useState<string[]>(selectedIds);
```

Lucide imports: <code>Check, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 26 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[620px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 27 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 28 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 29, 56 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 31 | <code>&quot;relative mt-4&quot;</code> |  |
| <code>Search</code> · 32 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 33 | <code>&quot;w-full rounded-full border border-[#E5E7EB] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search for a health benefits&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 42 | <code>&quot;mt-4 flex max-h-[360px] flex-col gap-3 overflow-y-auto pr-1&quot;</code> |  |
| <code>button</code> · 46 | <code>{`flex items-center justify-between gap-4 rounded-2xl border-2 p-4 text-left transition-colors ${ checked ? &quot;border-[#F7931E] bg-white&quot; : &quot;border-[#F3F4F6] bg-white hover:border-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; toggle(item.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>p</code> · 55 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>span</code> · 58 | <code>{`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ checked ? &quot;bg-[#F7931E]&quot; : &quot;border-2 border-[#D1D5DB]&quot; }`}</code> |  |
| <code>Check</code> · 63 | <code>&quot;h-4 w-4 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 70 | <code>&quot;mt-5 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 71 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 78 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { onApply(selected); onClose(); }}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/NutrientsPickerModal.tsx — 92 lines</summary>

Source: [src/components/super-admin/masterdata/NutrientsPickerModal.tsx](<src/components/super-admin/masterdata/NutrientsPickerModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type NutrientsPickerModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};
// line 16
[search, setSearch] = useState("");
// line 17
[selected, setSelected] = useState<string[]>(selectedIds);
```

Lucide imports: <code>Check, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 26 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[620px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 27 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 28 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 29 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 31 | <code>&quot;relative mt-4&quot;</code> |  |
| <code>Search</code> · 32 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 33 | <code>&quot;w-full rounded-full border border-[#E5E7EB] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search for a specific nutrient...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 42 | <code>&quot;mt-4 grid max-h-[360px] grid-cols-2 gap-3 overflow-y-auto pr-1&quot;</code> |  |
| <code>button</code> · 46 | <code>{`flex items-center justify-between gap-2 rounded-2xl border-2 p-4 text-left transition-colors ${ checked ? &quot;border-[#F7931E] bg-white&quot; : &quot;border-[#F3F4F6] bg-white hover:border-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; toggle(item.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>p</code> · 55 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 56 | <code>&quot;mt-1 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 58 | <code>{`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${ checked ? &quot;bg-[#F7931E]&quot; : &quot;border-2 border-[#D1D5DB]&quot; }`}</code> |  |
| <code>Check</code> · 63 | <code>&quot;h-4 w-4 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 70 | <code>&quot;mt-5 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 71 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 78 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { onApply(selected); onClose(); }}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/ProductRowMenu.tsx — 72 lines</summary>

Source: [src/components/super-admin/masterdata/ProductRowMenu.tsx](<src/components/super-admin/masterdata/ProductRowMenu.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type ProductRowMenuProps = {
  onStockStatus: () => void;
  onEditDetails: () => void;
  onDelete: () => void;
};
// line 13
[open, setOpen] = useState(false);
```

Lucide imports: <code>MoreVertical</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 26 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 27 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F5F5F7]&quot;</code> | <code>aria-label=&quot;More actions&quot;</code>; <code>onClick={() =&gt; setOpen((prev) =&gt; !prev)}</code>; <code>type=&quot;button&quot;</code> |
| <code>MoreVertical</code> · 33 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 37 | <code>&quot;absolute right-0 top-full z-20 mt-1 w-[180px] overflow-hidden rounded-xl border border-[#F3F4F6] bg-white py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 38 | <code>&quot;block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; { setOpen(false); onStockStatus(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 48 | <code>&quot;block w-full cursor-pointer px-4 py-2 text-left text-sm text-[#374151] hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; { setOpen(false); onEditDetails(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 58 | <code>&quot;block w-full cursor-pointer px-4 py-2 text-left text-sm font-medium text-[#EF4444] hover:bg-[#FEF2F2]&quot;</code> | <code>onClick={() =&gt; { setOpen(false); onDelete(); }}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/RelocationConfirmModal.tsx — 67 lines</summary>

Source: [src/components/super-admin/masterdata/RelocationConfirmModal.tsx](<src/components/super-admin/masterdata/RelocationConfirmModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type RelocationConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  productName: string;
  fromLabel: string;
  toLabel: string;
  onConfirm: () => void;
};
```

Lucide imports: <code>ArrowRight, ArrowRightLeft</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 24 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[440px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 25 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>div</code> · 26 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>ArrowRightLeft</code> · 27 | <code>&quot;h-6 w-6 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 30 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 31 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 32 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 36 | <code>&quot;flex w-full items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] p-4 text-left&quot;</code> |  |
| <code>p</code> · 38, 43 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 39 | <code>&quot;text-sm font-semibold text-[#6B7280]&quot;</code> |  |
| <code>ArrowRight</code> · 41 | <code>&quot;h-4 w-4 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 42 | <code>&quot;text-right&quot;</code> |  |
| <code>p</code> · 44 | <code>&quot;text-sm font-semibold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 48 | <code>&quot;mt-2 flex w-full items-center gap-3&quot;</code> |  |
| <code>button</code> · 49 | <code>&quot;flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 56 | <code>&quot;flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onConfirm}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/StockStatusModal.tsx — 168 lines</summary>

Source: [src/components/super-admin/masterdata/StockStatusModal.tsx](<src/components/super-admin/masterdata/StockStatusModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type StockStatusModalProps = {
  product: MasterProduct | null;
  open: boolean;
  onClose: () => void;
};
// line 16
[variant1Status, setVariant1Status] = useState("In Stock");
// line 17
[variant2Status, setVariant2Status] = useState("Out of Stock");
// line 18
[discountType, setDiscountType] = useState<"Coupon" | "Percentage">("Coupon");
```

Lucide imports: <code>Tag</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 23 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[560px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 24 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 25 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 27 | <code>&quot;mt-4 flex items-center gap-4&quot;</code> |  |
| <code>div</code> · 28 | <code>&quot;h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 29 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={64}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={64}</code> |
| <code>p</code> · 32 | <code>&quot;text-base font-bold text-black&quot;</code> |  |
| <code>p</code> · 33 | <code>&quot;text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 37, 81 | <code>&quot;mt-5 text-base font-bold text-black&quot;</code> |  |
| <code>div</code> · 38, 82 | <code>&quot;mt-2 grid grid-cols-2 gap-3&quot;</code> |  |
| <code>label</code> · 40, 48, 60, 68 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 41 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>defaultValue=&quot;2 kg&quot;</code>; <code>type=&quot;text&quot;</code> |
| <code>select</code> · 49 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setVariant1Status(event.target.value)}</code>; <code>value={variant1Status}</code> |
| <code>input</code> · 61 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>defaultValue=&quot;5 kg&quot;</code>; <code>type=&quot;text&quot;</code> |
| <code>select</code> · 69 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setVariant2Status(event.target.value)}</code>; <code>value={variant2Status}</code> |
| <code>label</code> · 84, 97, 106, 129, 136 | <code>&quot;text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>select</code> · 85 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setDiscountType(event.target.value as &quot;Coupon&quot; &#124; &quot;Percentage&quot;)}</code>; <code>value={discountType}</code> |
| <code>select</code> · 98 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> |  |
| <code>option</code> · 99 | Inherited / component-owned | <code>value=&quot;&quot;</code> |
| <code>div</code> · 107 | <code>&quot;mt-1.5 flex gap-2&quot;</code> |  |
| <code>div</code> · 108 | <code>&quot;relative w-full&quot;</code> |  |
| <code>input</code> · 109 | <code>&quot;w-full rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-7 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>max={100}</code>; <code>min={0}</code>; <code>placeholder=&quot;0&quot;</code>; <code>type=&quot;number&quot;</code> |
| <code>span</code> · 116 | <code>&quot;pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 118 | <code>&quot;w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>min={0}</code>; <code>placeholder=&quot;₹ Max&quot;</code>; <code>type=&quot;number&quot;</code> |
| <code>input</code> · 130, 137 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>type=&quot;date&quot;</code> |
| <code>div</code> · 144 | <code>&quot;mt-4 flex items-center gap-2 rounded-xl bg-[#F0FDF4] p-3 text-sm text-[#22C55E]&quot;</code> |  |
| <code>Tag</code> · 145 | <code>&quot;h-4 w-4 shrink-0&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 149 | <code>&quot;mt-6 flex items-center justify-end gap-3&quot;</code> |  |
| <code>button</code> · 150 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 157 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/TestimonialsPickerModal.tsx — 179 lines</summary>

Source: [src/components/super-admin/masterdata/TestimonialsPickerModal.tsx](<src/components/super-admin/masterdata/TestimonialsPickerModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 12
type TestimonialsPickerModalProps = {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  onApply: (ids: string[]) => void;
};
// line 20
[search, setSearch] = useState("");
// line 21
[selected, setSelected] = useState<string[]>(selectedIds);
// line 22
[sortMode, setSortMode] = useState<"All Ratings" | "Recent">("All Ratings");
```

Lucide imports: <code>ArrowRight, Check, Search, Star</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 42 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[940px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 43 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 44 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 45 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 47 | <code>&quot;relative mt-4&quot;</code> |  |
| <code>Search</code> · 48 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 49 | <code>&quot;w-full rounded-full bg-[#F5F5F7] py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search customer names or keywords...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 58 | <code>&quot;mt-3 flex items-center justify-between&quot;</code> |  |
| <code>div</code> · 59 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 61 | <code>{`cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${ sortMode === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;bg-[#F3F4F6] font-medium text-[#374151] hover:bg-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; setSortMode(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 73 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; { setSelected([]); setSortMode(&quot;All Ratings&quot;); setSearch(&quot;&quot;); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 86 | <code>&quot;mt-4 grid max-h-[420px] grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2&quot;</code> |  |
| <code>button</code> · 90 | <code>{`relative rounded-2xl border-2 p-4 text-left transition-colors ${ checked ? &quot;border-[#F7931E] bg-white&quot; : &quot;border-[#F3F4F6] bg-white hover:border-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; toggle(item.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 98 | <code>{`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full ${ checked ? &quot;bg-[#F7931E]&quot; : &quot;border-2 border-[#D1D5DB]&quot; }`}</code> |  |
| <code>Check</code> · 103 | <code>&quot;h-4 w-4 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 105 | <code>&quot;flex items-center gap-2.5&quot;</code> |  |
| <code>div</code> · 106 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white&quot;</code> |  |
| <code>p</code> · 110 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>div</code> · 111 | <code>&quot;flex items-center gap-1.5 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 112 | <code>&quot;flex items-center gap-0.5&quot;</code> |  |
| <code>Star</code> · 114 | <code>{`h-3 w-3 ${index &lt; Math.round(item.rating) ? &quot;fill-[#F7931E] text-[#F7931E]&quot; : &quot;text-[#E5E7EB]&quot;}`}</code> | <code>strokeWidth={0}</code> |
| <code>p</code> · 125 | <code>&quot;mt-3 pr-6 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>span</code> · 127 | <code>&quot;mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#F7931E]&quot;</code> |  |
| <code>span</code> · 128 | <code>&quot;flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>Check</code> · 129 | <code>&quot;h-2.5 w-2.5 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 139 | <code>&quot;mt-5 flex items-center justify-between border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>div</code> · 140 | <code>&quot;flex items-center gap-2 text-sm text-[#374151]&quot;</code> |  |
| <code>span</code> · 142 | <code>&quot;flex -space-x-2&quot;</code> |  |
| <code>span</code> · 144 | <code>&quot;flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#F7931E] text-[10px] font-semibold text-white&quot;</code> |  |
| <code>span</code> · 153 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 155 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>button</code> · 156 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-8 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 163 | <code>&quot;flex cursor-pointer items-center gap-2 rounded-full bg-[#F7931E] px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { onApply(selected); onClose(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowRight</code> · 172 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/components/super-admin/masterdata/masterDataData.ts — 105 lines</summary>

Source: [src/components/super-admin/masterdata/masterDataData.ts](<src/components/super-admin/masterdata/masterDataData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 76
export function tagToneClasses(tone: "green" | "blue" | "red") {
  if (tone === "blue") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (tone === "red") return "bg-[#FEE2E2] text-[#EF4444]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
```

</details>

<details>
<summary>src/components/super-admin/offers/EditOfferModal.tsx — 123 lines</summary>

Source: [src/components/super-admin/offers/EditOfferModal.tsx](<src/components/super-admin/offers/EditOfferModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 7
type EditOfferModalProps = {
  offer: Offer | null;
  open: boolean;
  onClose: () => void;
  onSave: (offer: Offer) => void;
};
// line 15
[name, setName] = useState("");
// line 16
[subtitle, setSubtitle] = useState("");
// line 17
[discount, setDiscount] = useState("");
// line 18
[discountNote, setDiscountNote] = useState("");
// line 19
[status, setStatus] = useState<Offer["status"]>("Active");
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 46 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[480px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 47 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 48 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 49 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 51 | <code>&quot;mt-5 flex flex-col gap-4&quot;</code> |  |
| <code>label</code> · 53, 62, 72, 81, 91 | <code>&quot;text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>input</code> · 54 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setName(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={name}</code> |
| <code>input</code> · 63 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSubtitle(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={subtitle}</code> |
| <code>div</code> · 70 | <code>&quot;grid grid-cols-2 gap-3&quot;</code> |  |
| <code>input</code> · 73 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setDiscount(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={discount}</code> |
| <code>input</code> · 82 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setDiscountNote(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={discountNote}</code> |
| <code>select</code> · 92 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setStatus(event.target.value as Offer[&quot;status&quot;])}</code>; <code>value={status}</code> |
| <code>option</code> · 97 | Inherited / component-owned | <code>value=&quot;Active&quot;</code> |
| <code>option</code> · 98 | Inherited / component-owned | <code>value=&quot;Scheduled&quot;</code> |
| <code>option</code> · 99 | Inherited / component-owned | <code>value=&quot;Completed&quot;</code> |
| <code>div</code> · 104 | <code>&quot;mt-6 flex items-center justify-end gap-3&quot;</code> |  |
| <code>button</code> · 105 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 112 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleSave}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/offers/LaunchOfferModal.tsx — 549 lines</summary>

Source: [src/components/super-admin/offers/LaunchOfferModal.tsx](<src/components/super-admin/offers/LaunchOfferModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 37
type LaunchOfferModalProps = {
  open: boolean;
  onClose: () => void;
};
// line 43
[step, setStep] = useState<Step>("form");
// line 44
[offerType, setOfferType] = useState<OfferType>("percentage");
// line 45
[applyTarget, setApplyTarget] = useState<ApplyTarget>("all");
// line 46
[selectedProducts, setSelectedProducts] = useState<string[]>([]);
// line 47
[selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
// line 48
[productSearch, setProductSearch] = useState("");
// line 49
[customerSearch, setCustomerSearch] = useState("");
// line 51
[discountValue, setDiscountValue] = useState("");
// line 52
[minOrderValue, setMinOrderValue] = useState("");
// line 53
[maxDiscountValue, setMaxDiscountValue] = useState("");
// line 54
[coupon, setCoupon] = useState("");
// line 55
[startDate, setStartDate] = useState("");
// line 56
[endDate, setEndDate] = useState("");
// line 57
[errors, setErrors] = useState<Record<string, boolean>>({});
```

Lucide imports: <code>ArrowLeft, Check, ChevronDown, Percent, Search, Ticket</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 111 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[680px]&quot;</code>; <code>onClose={handleClose}</code>; <code>open={open}</code> |
| <code>div</code> · 112, 214, 347 | <code>&quot;p-6&quot;</code> |  |
| <code>div</code> · 113 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>button</code> · 114, 215 | <code>&quot;flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setStep(&quot;form&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ArrowLeft</code> · 119, 220 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 124, 224 | <code>&quot;relative mt-4&quot;</code> |  |
| <code>Search</code> · 125, 225 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 126 | <code>&quot;w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setProductSearch(event.target.value)}</code>; <code>placeholder=&quot;Search products...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={productSearch}</code> |
| <code>div</code> · 135 | <code>&quot;mt-4 flex max-h-[360px] flex-col gap-1 overflow-y-auto&quot;</code> |  |
| <code>button</code> · 139 | <code>&quot;flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setSelectedProducts((prev) =&gt; checked ? prev.filter((sku) =&gt; sku !== product.sku) : [...prev, product.sku], ) }</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 149 | <code>{`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${ checked ? &quot;border-[#F7931E] bg-[#F7931E]&quot; : &quot;border-[#D1D5DB]&quot; }`}</code> |  |
| <code>Check</code> · 154, 265 | <code>&quot;h-3.5 w-3.5 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>div</code> · 156 | <code>&quot;h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#F5F5F7]&quot;</code> |  |
| <code>Image</code> · 157 | <code>&quot;h-full w-full object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={40}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={40}</code> |
| <code>div</code> · 165 | <code>&quot;min-w-0 flex-1&quot;</code> |  |
| <code>p</code> · 166 | <code>&quot;truncate text-sm font-medium text-black&quot;</code> |  |
| <code>p</code> · 167 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 169 | <code>&quot;shrink-0 text-right text-sm text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 171 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 178, 286 | <code>&quot;mt-4 flex items-center justify-between border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>p</code> · 179, 287 | <code>&quot;text-sm text-[#374151]&quot;</code> |  |
| <code>span</code> · 180, 288 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>button</code> · 181 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-black&quot;</code> | <code>onClick={() =&gt; setSelectedProducts([])}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 189, 297 | <code>&quot;flex items-center gap-4&quot;</code> |  |
| <code>button</code> · 190, 298 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setStep(&quot;form&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 197, 305 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;form&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 213 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[720px]&quot;</code>; <code>onClose={handleClose}</code>; <code>open={open}</code> |
| <code>input</code> · 226 | <code>&quot;w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setCustomerSearch(event.target.value)}</code>; <code>placeholder=&quot;Search By Number&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={customerSearch}</code> |
| <code>div</code> · 235 | <code>&quot;mt-4 overflow-x-auto&quot;</code> |  |
| <code>table</code> · 236 | <code>&quot;w-full min-w-[460px]&quot;</code> |  |
| <code>tr</code> · 238 | <code>&quot;text-left text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>th</code> · 239 | <code>&quot;w-8 py-2&quot;</code> |  |
| <code>th</code> · 240, 241, 242 | <code>&quot;py-2&quot;</code> |  |
| <code>th</code> · 243 | <code>&quot;py-2 text-right&quot;</code> |  |
| <code>tr</code> · 250 | <code>&quot;cursor-pointer border-t border-[#F3F4F6] hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setSelectedCustomers((prev) =&gt; checked ? prev.filter((id) =&gt; id !== customer.id) : [...prev, customer.id], ) }</code> |
| <code>td</code> · 259, 268 | <code>&quot;py-2.5&quot;</code> |  |
| <code>span</code> · 260 | <code>{`flex h-5 w-5 items-center justify-center rounded-md border-2 ${ checked ? &quot;border-[#F7931E] bg-[#F7931E]&quot; : &quot;border-[#D1D5DB]&quot; }`}</code> |  |
| <code>div</code> · 269 | <code>&quot;flex items-center gap-2.5&quot;</code> |  |
| <code>div</code> · 270 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-[11px] font-semibold text-white&quot;</code> |  |
| <code>span</code> · 273 | <code>&quot;text-sm font-medium text-black&quot;</code> |  |
| <code>td</code> · 276, 277 | <code>&quot;py-2.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>td</code> · 278 | <code>&quot;py-2.5 text-right text-sm text-black&quot;</code> |  |
| <code>button</code> · 289 | <code>&quot;cursor-pointer text-[#9CA3AF] hover:text-black&quot;</code> | <code>onClick={() =&gt; setSelectedCustomers([])}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 321 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={handleClose}</code>; <code>open={open}</code> |
| <code>div</code> · 322 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>div</code> · 323 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 324 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 327, 348 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 328 | <code>&quot;mt-1.5 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>button</code> · 333 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 346 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[560px]&quot;</code>; <code>onClose={handleClose}</code>; <code>open={open}</code> |
| <code>p</code> · 349 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 351 | <code>&quot;mt-5 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 352 | <code>&quot;mt-2 grid grid-cols-2 gap-3&quot;</code> |  |
| <code>button</code> · 353 | <code>{`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${ offerType === &quot;percentage&quot; ? &quot;border-[#22C55E] bg-[#F0FDF4]&quot; : &quot;border-[#F3F4F6] bg-white&quot; }`}</code> | <code>onClick={() =&gt; setOfferType(&quot;percentage&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 360 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white&quot;</code> |  |
| <code>Percent</code> · 361 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>span</code> · 364, 383 | <code>&quot;block text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 365, 384 | <code>&quot;block text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 368 | <code>{`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${ offerType === &quot;coupon&quot; ? &quot;border-[#22C55E] bg-[#F0FDF4]&quot; : &quot;border-[#F3F4F6] bg-white&quot; }`}</code> | <code>onClick={() =&gt; setOfferType(&quot;coupon&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 375 | <code>{`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${ offerType === &quot;coupon&quot; ? &quot;bg-[#22C55E] text-white&quot; : &quot;bg-[#F3F4F6] text-[#6B7280]&quot; }`}</code> |  |
| <code>Ticket</code> · 380 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 390, 436, 466 | <code>&quot;mt-4 grid grid-cols-2 gap-3&quot;</code> |  |
| <code>label</code> · 392, 410, 420, 438, 454 | <code>&quot;text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>div</code> · 393, 469, 483, 501 | <code>&quot;relative mt-1.5&quot;</code> |  |
| <code>input</code> · 394 | <code>{`w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${ errors.discountValue ? &quot;border-[#EF4444]&quot; : &quot;border-[#E5E7EB]&quot; }`}</code> | <code>onChange={(event) =&gt; setDiscountValue(event.target.value)}</code>; <code>placeholder=&quot;e.g. 20&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={discountValue}</code> |
| <code>span</code> · 403 | <code>&quot;pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 407, 431, 451, 479, 493 | <code>&quot;mt-1 text-xs text-[#EF4444]&quot;</code> |  |
| <code>input</code> · 411, 455 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setMinOrderValue(event.target.value)}</code>; <code>placeholder=&quot;e.g. 500&quot;</code>; <code>type=&quot;number&quot;</code>; <code>value={minOrderValue}</code> |
| <code>div</code> · 419 | <code>&quot;col-span-2&quot;</code> |  |
| <code>input</code> · 421 | <code>{`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${ errors.maxDiscountValue ? &quot;border-[#EF4444]&quot; : &quot;border-[#E5E7EB]&quot; }`}</code> | <code>onChange={(event) =&gt; setMaxDiscountValue(event.target.value)}</code>; <code>placeholder=&quot;e.g. ₹ 200&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={maxDiscountValue}</code> |
| <code>select</code> · 439 | <code>{`mt-1.5 w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm outline-none focus:border-[#F7931E] ${ errors.coupon ? &quot;border-[#EF4444]&quot; : &quot;border-[#E5E7EB]&quot; }`}</code> | <code>onChange={(event) =&gt; setCoupon(event.target.value)}</code>; <code>value={coupon}</code> |
| <code>option</code> · 446 | Inherited / component-owned | <code>value=&quot;&quot;</code> |
| <code>option</code> · 447 | Inherited / component-owned | <code>value=&quot;FEV243&quot;</code> |
| <code>option</code> · 448 | Inherited / component-owned | <code>value=&quot;SAVE10&quot;</code> |
| <code>option</code> · 449 | Inherited / component-owned | <code>value=&quot;WELCOME5&quot;</code> |
| <code>label</code> · 468, 482, 498 | <code>&quot;text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 470 | <code>{`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E] ${ errors.startDate ? &quot;border-[#EF4444]&quot; : &quot;border-[#E5E7EB]&quot; }`}</code> | <code>onChange={(event) =&gt; setStartDate(event.target.value)}</code>; <code>type=&quot;date&quot;</code>; <code>value={startDate}</code> |
| <code>input</code> · 484 | <code>{`w-full cursor-pointer rounded-xl border px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E] ${ errors.endDate ? &quot;border-[#EF4444]&quot; : &quot;border-[#E5E7EB]&quot; }`}</code> | <code>onChange={(event) =&gt; setEndDate(event.target.value)}</code>; <code>type=&quot;date&quot;</code>; <code>value={endDate}</code> |
| <code>div</code> · 497 | <code>&quot;mt-4&quot;</code> |  |
| <code>select</code> · 502 | <code>&quot;w-full cursor-pointer appearance-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm text-black outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setApplyTarget(event.target.value as ApplyTarget)}</code>; <code>value={applyTarget}</code> |
| <code>option</code> · 507 | Inherited / component-owned | <code>value=&quot;all&quot;</code> |
| <code>option</code> · 508 | Inherited / component-owned | <code>value=&quot;limited&quot;</code> |
| <code>ChevronDown</code> · 510 | <code>&quot;pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 514 | <code>&quot;mt-2 cursor-pointer text-sm font-semibold text-[#F7931E] hover:text-[#e07f0e]&quot;</code> | <code>onClick={() =&gt; setStep(offerType === &quot;coupon&quot; ? &quot;selectUsers&quot; : &quot;selectProducts&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 530 | <code>&quot;mt-6 flex items-center justify-end gap-3&quot;</code> |  |
| <code>button</code> · 531 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={handleClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 538 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleLaunch}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/offers/offersData.ts — 178 lines</summary>

Source: [src/components/super-admin/offers/offersData.ts](<src/components/super-admin/offers/offersData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 174
export function statusPillClasses(status: Offer["status"]) {
  if (status === "Active") return "bg-[#EBF7EC] text-[#22C55E]";
  if (status === "Scheduled") return "bg-[#EFF6FF] text-[#3B82F6]";
  return "bg-[#F3F4F6] text-[#6B7280]";
}
```

</details>

<details>
<summary>src/components/super-admin/orders/FiltersModal.tsx — 352 lines</summary>

Source: [src/components/super-admin/orders/FiltersModal.tsx](<src/components/super-admin/orders/FiltersModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 28
type FiltersModalProps = {
  open: boolean;
  onClose: () => void;
  products: string[];
  statuses: string[];
  methods: string[];
  value: OrderFilters;
  onApply: (filters: OrderFilters) => void;
};
// line 107
[tab, setTab] = useState<Tab>("Product");
// line 108
[draft, setDraft] = useState<OrderFilters>(value);
// line 109
[viewMonth, setViewMonth] = useState(() => (value.dateFrom ? new Date(value.dateFrom) : new Date()));
```

Lucide imports: <code>Check, ChevronLeft, ChevronRight</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>button</code> · 87 | <code>{`flex w-full cursor-pointer items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition-colors ${ checked ? &quot;border-[#F7931E] bg-white text-[#F7931E]&quot; : &quot;border-[#F3F4F6] bg-white text-[#374151] hover:border-[#E5E7EB]&quot; }`}</code> | <code>onClick={onToggle}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 95 | <code>{`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${ checked ? &quot;bg-[#F7931E]&quot; : &quot;border-2 border-[#D1D5DB]&quot; }`}</code> |  |
| <code>Check</code> · 100 | <code>&quot;h-3.5 w-3.5 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>ModalShell</code> · 141 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[700px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 142 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 143 | <code>&quot;text-xl font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 145 | <code>&quot;mt-4 flex gap-5&quot;</code> |  |
| <code>div</code> · 146, 282 | <code>&quot;w-[140px] shrink-0&quot;</code> |  |
| <code>div</code> · 147 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>button</code> · 149 | <code>{`cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${ tab === option ? &quot;bg-[#F7931E] text-white&quot; : &quot;text-[#F7931E]/80 hover:bg-[#FEF3E2]&quot; }`}</code> | <code>onClick={() =&gt; setTab(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 163 | <code>&quot;min-h-[280px] flex-1&quot;</code> |  |
| <code>div</code> · 165, 178, 191 | <code>&quot;flex flex-col gap-3&quot;</code> |  |
| <code>CheckRow</code> · 167 | Inherited / component-owned | <code>checked={draft.products.includes(product)}</code>; <code>label={product}</code>; <code>onToggle={() =&gt; setDraft((prev) =&gt; ({ ...prev, products: toggle(prev.products, product) }))}</code> |
| <code>CheckRow</code> · 180 | Inherited / component-owned | <code>checked={draft.statuses.includes(status)}</code>; <code>label={status}</code>; <code>onToggle={() =&gt; setDraft((prev) =&gt; ({ ...prev, statuses: toggle(prev.statuses, status) }))}</code> |
| <code>CheckRow</code> · 193 | Inherited / component-owned | <code>checked={draft.methods.includes(method)}</code>; <code>label={method}</code>; <code>onToggle={() =&gt; setDraft((prev) =&gt; ({ ...prev, methods: toggle(prev.methods, method) }))}</code> |
| <code>div</code> · 204 | <code>&quot;flex gap-4&quot;</code> |  |
| <code>div</code> · 205 | <code>&quot;flex-1&quot;</code> |  |
| <code>div</code> · 206 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>p</code> · 207 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>div</code> · 210 | <code>&quot;flex items-center gap-1&quot;</code> |  |
| <code>button</code> · 211 | <code>&quot;flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#374151]&quot;</code> | <code>aria-label=&quot;Previous month&quot;</code>; <code>onClick={() =&gt; setViewMonth((prev) =&gt; new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 217 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 219 | <code>&quot;flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#374151]&quot;</code> | <code>aria-label=&quot;Next month&quot;</code>; <code>onClick={() =&gt; setViewMonth((prev) =&gt; new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 225 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 229 | <code>&quot;mt-3 grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 235 | <code>&quot;grid grid-cols-7 text-center text-xs&quot;</code> |  |
| <code>button</code> · 244 | <code>{`relative flex h-7 w-full cursor-pointer items-center justify-center py-0.5 ${ inRange ? &quot;bg-[#FEF3E2]&quot; : &quot;&quot; } ${isStart &amp;&amp; draft.dateTo ? &quot;rounded-l-full bg-[#FEF3E2]&quot; : &quot;&quot;} ${ isEnd &amp;&amp; draft.dateFrom !== draft.dateTo ? &quot;rounded-r-full bg-[#FEF3E2]&quot; : &quot;&quot; }`}</code> | <code>onClick={() =&gt; setDraft((prev) =&gt; { if (!prev.dateFrom &#124;&#124; (prev.dateFrom &amp;&amp; prev.dateTo)) { return { ...prev, dateFrom: iso, dateTo: null, dateQuick: null }; } if (iso &lt; prev.dateFrom) { return { ...prev, dateFrom: iso, dateTo: prev.dateFrom, dateQuick: null }; } return { ...prev, dateTo: iso, dateQuick: null }; }) }</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 264 | <code>{`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${ isStart &#124;&#124; isEnd ? &quot;bg-[#F7931E] font-semibold text-white&quot; : cell.inCurrentMonth ? &quot;text-[#374151] hover:bg-[#FEF3E2]&quot; : &quot;text-[#D1D5DB] hover:bg-[#F9FAFB]&quot; } ${isToday &amp;&amp; !isStart &amp;&amp; !isEnd ? &quot;ring-1 ring-[#F7931E]&quot; : &quot;&quot;}`}</code> |  |
| <code>p</code> · 283 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 284 | <code>&quot;mt-2 flex flex-col gap-1&quot;</code> |  |
| <code>button</code> · 286 | <code>{`cursor-pointer rounded-lg px-3 py-2 text-left text-sm transition-colors ${ draft.dateQuick === option ? &quot;bg-[#FEF3E2] font-semibold text-[#F7931E]&quot; : &quot;text-[#374151] hover:bg-[#F9FAFB]&quot; }`}</code> | <code>onClick={() =&gt; { if (draft.dateQuick === option) { setDraft((prev) =&gt; ({ ...prev, dateQuick: null, dateFrom: null, dateTo: null })); return; } const range = quickSelectRange(option); setDraft((prev) =&gt; ({ ...prev, dateQuick: option, dateFrom: range.from, dateTo: range.to })); setViewMonth(new Date(range.to)); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 307 | <code>&quot;mt-3&quot;</code> |  |
| <code>p</code> · 308 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 309 | <code>&quot;text-sm font-semibold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 324 | <code>&quot;mt-5 flex items-center justify-between border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 325 | <code>&quot;cursor-pointer text-sm font-semibold text-[#F7931E] hover:text-[#e07f0e]&quot;</code> | <code>onClick={handleClear}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 332 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>button</code> · 333 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 340 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleApply}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/orders/OrderDetailModal.tsx — 477 lines</summary>

Source: [src/components/super-admin/orders/OrderDetailModal.tsx](<src/components/super-admin/orders/OrderDetailModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 16
type OrderDetailModalProps = {
  order: Order | null;
  open: boolean;
  onClose: () => void;
};
```

Lucide imports: <code>AlertCircle, Check, Mail, MapPin, MessageSquare, PackageCheck, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 36 | Inherited / component-owned | <code>maxWidth={order.status === &quot;Ship&quot; ? &quot;max-w-[760px]&quot; : &quot;max-w-[900px]&quot;}</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 37 | <code>{`max-h-[90vh] overflow-y-auto ${order.status === &quot;Ship&quot; ? &quot;p-8&quot; : &quot;p-7&quot;}`}</code> |  |
| <code>div</code> · 38 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>h2</code> · 42, 49 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 43 | <code>&quot;mt-1 text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 50 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 58 | <code>&quot;inline-flex shrink-0 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#3B82F6]&quot;</code> |  |
| <code>div</code> · 63 | <code>{`mt-6 grid grid-cols-1 sm:grid-cols-2 ${order.status === &quot;Ship&quot; ? &quot;gap-8&quot; : &quot;gap-5&quot;}`}</code> |  |
| <code>div</code> · 66, 105, 202, 254, 295, 428 | <code>&quot;flex flex-col gap-4&quot;</code> |  |
| <code>div</code> · 67, 106, 119, 146, 203, 255, 296, 313, 429, 442 | <code>&quot;rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>p</code> · 68, 81, 107, 120, 148, 204, 268, 297, 324, 402, 430, 443 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 69, 431 | <code>&quot;mt-2 flex items-start gap-3&quot;</code> |  |
| <code>span</code> · 70 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>Check</code> · 71 | <code>&quot;h-4 w-4 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>p</code> · 74, 213, 227, 303, 314, 343, 436 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 75, 94, 151, 189, 191, 194, 214, 244, 281, 282, 304, 342, 373, 383, 392, 417, 437 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 82, 155, 269, 405 | <code>&quot;mt-2 flex flex-col gap-2&quot;</code> |  |
| <code>div</code> · 84, 271, 407 | <code>&quot;flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3&quot;</code> |  |
| <code>Image</code> · 85, 163, 408 | <code>&quot;h-11 w-11 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={44}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={44}</code> |
| <code>div</code> · 92, 170, 279, 415 | <code>&quot;min-w-0 flex-1&quot;</code> |  |
| <code>p</code> · 93, 171, 280, 416 | <code>&quot;truncate text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 98, 176 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 108 | <code>&quot;mt-2 text-sm font-bold text-black&quot;</code> |  |
| <code>p</code> · 109 | <code>&quot;mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>Phone</code> · 110 | <code>&quot;h-3.5 w-3.5 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 113 | <code>&quot;mt-1 flex items-start gap-1.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>MapPin</code> · 114 | <code>&quot;mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 121, 315 | <code>&quot;mt-2 flex justify-between text-sm&quot;</code> |  |
| <code>span</code> · 122, 126, 130, 316, 320 | <code>&quot;text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 123, 127, 131, 317 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 125, 129, 319 | <code>&quot;mt-1.5 flex justify-between text-sm&quot;</code> |  |
| <code>div</code> · 133 | <code>&quot;mt-3 flex justify-between border-t border-[#E5E7EB] pt-3 text-sm&quot;</code> |  |
| <code>span</code> · 134 | <code>&quot;font-bold text-black&quot;</code> |  |
| <code>span</code> · 135 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>div</code> · 147 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>div</code> · 157 | <code>{`flex items-center gap-3 rounded-xl border p-3 ${ item.outOfStock ? &quot;border-[#F7931E] bg-[#FEF9F0]&quot; : &quot;border-transparent bg-white&quot; }`}</code> |  |
| <code>p</code> · 172 | <code>{`text-xs ${item.outOfStock ? &quot;font-semibold text-[#F7931E]&quot; : &quot;text-[#9CA3AF]&quot;}`}</code> |  |
| <code>span</code> · 178 | <code>&quot;flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>AlertCircle</code> · 179 | <code>&quot;h-3.5 w-3.5 text-white&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>p</code> · 186 | <code>&quot;mt-4 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 187 | <code>&quot;mt-2 grid grid-cols-2 gap-3 text-sm&quot;</code> |  |
| <code>p</code> · 190, 195 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>p</code> · 198 | <code>&quot;mt-3 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 199 | <code>&quot;text-sm text-[#374151]&quot;</code> |  |
| <code>div</code> · 205 | <code>&quot;mt-3 flex gap-3&quot;</code> |  |
| <code>div</code> · 206, 221 | <code>&quot;flex flex-col items-center&quot;</code> |  |
| <code>span</code> · 207, 222 | <code>&quot;flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>Check</code> · 208, 346 | <code>&quot;h-4 w-4 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>span</code> · 210 | <code>&quot;my-1 w-0.5 flex-1 bg-[#F7931E]/30&quot;</code> |  |
| <code>div</code> · 212 | <code>&quot;pb-4&quot;</code> |  |
| <code>span</code> · 215 | <code>&quot;mt-1 inline-flex rounded-full bg-[#EBF7EC] px-2 py-0.5 text-[10px] font-bold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 220 | <code>&quot;flex gap-3&quot;</code> |  |
| <code>AlertCircle</code> · 223 | <code>&quot;h-4 w-4 text-white&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 228 | <code>&quot;mt-1.5 rounded-lg bg-white p-2.5 text-xs italic text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 235 | <code>&quot;rounded-2xl bg-[#F0FDF4] p-4&quot;</code> |  |
| <code>p</code> · 236 | <code>&quot;text-sm font-bold text-[#22C55E]&quot;</code> |  |
| <code>button</code> · 237 | <code>&quot;mt-2 flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white p-3 text-left transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>type=&quot;button&quot;</code> |
| <code>MessageSquare</code> · 241, 379 | <code>&quot;h-4 w-4 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 242 | <code>&quot;flex-1&quot;</code> |  |
| <code>p</code> · 243, 382, 391 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 256 | <code>&quot;flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#F7931E]&quot;</code> |  |
| <code>AlertCircle</code> · 257 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 260 | <code>&quot;mt-2 rounded-xl bg-[#F0FDF4] p-3 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>Image</code> · 272 | <code>&quot;h-12 w-12 shrink-0 rounded-lg object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={48}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={48}</code> |
| <code>span</code> · 286 | <code>&quot;inline-flex shrink-0 rounded-full bg-[#FEE2E2] px-2.5 py-1 text-[10px] font-bold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 298 | <code>&quot;mt-2 flex items-center gap-2&quot;</code> |  |
| <code>div</code> · 299 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC] text-xs font-bold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 307 | <code>&quot;mt-3 flex items-start gap-1.5 text-sm text-[#374151]&quot;</code> |  |
| <code>MapPin</code> · 308 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 321 | <code>&quot;font-semibold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 323 | <code>&quot;mt-3 border-t border-[#E5E7EB] pt-3&quot;</code> |  |
| <code>p</code> · 325 | <code>&quot;text-2xl font-bold text-[#F7931E]&quot;</code> |  |
| <code>p</code> · 329 | <code>&quot;mt-2 text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 339 | <code>&quot;flex flex-col gap-6&quot;</code> |  |
| <code>div</code> · 340 | <code>&quot;flex items-center justify-between rounded-2xl border border-[#E5E7EB] p-5&quot;</code> |  |
| <code>span</code> · 345 | <code>&quot;flex h-8 w-8 items-center justify-center rounded-full bg-[#F7931E]&quot;</code> |  |
| <code>label</code> · 351, 359 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 354, 360 | <code>&quot;mt-2 rounded-xl bg-[#F9FAFB] px-4 py-3.5 text-sm font-medium text-black&quot;</code> |  |
| <code>div</code> · 366 | <code>&quot;flex flex-col gap-5&quot;</code> |  |
| <code>div</code> · 367 | <code>&quot;mb-1 flex items-center gap-3 rounded-2xl bg-[#FEF3E2] p-5&quot;</code> |  |
| <code>span</code> · 368 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white&quot;</code> |  |
| <code>PackageCheck</code> · 369 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 372 | <code>&quot;text-sm font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 377, 386 | <code>&quot;flex items-center gap-3 rounded-2xl border border-[#E5E7EB] p-5&quot;</code> |  |
| <code>span</code> · 378, 387 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F9FAFB]&quot;</code> |  |
| <code>Mail</code> · 388, 449 | <code>&quot;h-4 w-4 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 422 | <code>&quot;text-sm font-bold text-[#F7931E]&quot;</code> |  |
| <code>div</code> · 432 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-bold text-white&quot;</code> |  |
| <code>p</code> · 444 | <code>&quot;mt-2 flex items-center gap-2 text-sm text-black&quot;</code> |  |
| <code>Phone</code> · 445 | <code>&quot;h-4 w-4 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 448 | <code>&quot;mt-1.5 flex items-center gap-2 text-sm text-black&quot;</code> |  |
| <code>div</code> · 458 | <code>&quot;mt-6 flex items-center justify-end gap-6 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 459 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 466 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/orders/ordersData.ts — 173 lines</summary>

Source: [src/components/super-admin/orders/ordersData.ts](<src/components/super-admin/orders/ordersData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 168
export function statusPillClasses(status: OrderStatus) {
  if (status === "Delivered") return "bg-[#EFF6FF] text-[#3B82F6]";
  if (status === "Exception") return "bg-[#FEF3E2] text-[#F7931E]";
  if (status === "Returned") return "bg-[#FEE2E2] text-[#EF4444]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
```

</details>

<details>
<summary>src/components/super-admin/products/EditProductModal.tsx — 109 lines</summary>

Source: [src/components/super-admin/products/EditProductModal.tsx](<src/components/super-admin/products/EditProductModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 13
type EditProductModalProps = {
  open: boolean;
  onClose: () => void;
  initial: ProductDetailsEdit;
  onSave: (data: ProductDetailsEdit) => void;
};
// line 21
[name, setName] = useState(initial.name);
// line 22
[description, setDescription] = useState(initial.description);
// line 23
[price, setPrice] = useState(String(initial.price));
// line 24
[inStock, setInStock] = useState(initial.inStock);
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 40 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[520px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 41 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 42 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 43 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 45 | <code>&quot;mt-5 flex flex-col gap-4&quot;</code> |  |
| <code>label</code> · 47, 57, 68, 77 | <code>&quot;text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>input</code> · 48 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setName(event.target.value)}</code>; <code>type=&quot;text&quot;</code>; <code>value={name}</code> |
| <code>textarea</code> · 58 | <code>&quot;mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setDescription(event.target.value)}</code>; <code>rows={3}</code>; <code>value={description}</code> |
| <code>div</code> · 66 | <code>&quot;grid grid-cols-2 gap-3&quot;</code> |  |
| <code>input</code> · 69 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setPrice(event.target.value)}</code>; <code>type=&quot;number&quot;</code>; <code>value={price}</code> |
| <code>select</code> · 78 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setInStock(event.target.value === &quot;in&quot;)}</code>; <code>value={inStock ? &quot;in&quot; : &quot;out&quot;}</code> |
| <code>option</code> · 83 | Inherited / component-owned | <code>value=&quot;in&quot;</code> |
| <code>option</code> · 84 | Inherited / component-owned | <code>value=&quot;out&quot;</code> |
| <code>div</code> · 90 | <code>&quot;mt-6 flex items-center justify-end gap-3&quot;</code> |  |
| <code>button</code> · 91 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 98 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleSave}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/products/productsData.ts — 214 lines</summary>

Source: [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 198
export function stockDotColor(stock: number) {
  if (stock < 100) return "bg-[#EF4444]";
  if (stock < 500) return "bg-[#F97316]";
  return "bg-[#22C55E]";
}
// line 204
export function performanceTag(salesPercent: number): "Most Selling" | "Trending" | "Less Selling" {
  if (salesPercent >= 65) return "Most Selling";
  if (salesPercent < 48) return "Less Selling";
  return "Trending";
}
// line 210
export function tagPillClasses(tag: ReturnType<typeof performanceTag>) {
  if (tag === "Most Selling") return "bg-[#EBF7EC] text-[#22C55E]";
  if (tag === "Less Selling") return "bg-[#FEF2F2] text-[#EF4444]";
  return "bg-[#EFF6FF] text-[#3B82F6]";
}
```

</details>

<details>
<summary>src/components/super-admin/revenue/ComingSoonCard.tsx — 18 lines</summary>

Source: [src/components/super-admin/revenue/ComingSoonCard.tsx](<src/components/super-admin/revenue/ComingSoonCard.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Rocket</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 5 | <code>&quot;mx-6 flex max-w-[380px] flex-col items-center gap-4 rounded-[32px] border-2 border-black/[0.04] bg-white p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>div</code> · 6 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> |  |
| <code>Rocket</code> · 7 | <code>&quot;h-7 w-7 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 10 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 11 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |

</details>

<details>
<summary>src/components/super-admin/revenue/DummyRevenueDashboard.tsx — 119 lines</summary>

Source: [src/components/super-admin/revenue/DummyRevenueDashboard.tsx](<src/components/super-admin/revenue/DummyRevenueDashboard.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Clock, Filter, RotateCcw, TrendingUp</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>main</code> · 6 | <code>&quot;flex-1 px-6 pb-10 pt-6 sm:px-10 lg:px-16&quot;</code> |  |
| <code>div</code> · 7 | <code>&quot;flex flex-wrap items-start justify-between gap-4&quot;</code> |  |
| <code>h1</code> · 9 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 10 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 12 | <code>&quot;rounded-full border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 17 | <code>&quot;mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3&quot;</code> |  |
| <code>div</code> · 18, 27, 36 | <code>&quot;rounded-[28px] border-2 border-black/[0.04] bg-white p-5&quot;</code> |  |
| <code>div</code> · 19, 28, 37 | <code>&quot;flex items-start justify-between&quot;</code> |  |
| <code>p</code> · 20, 29, 38 | <code>&quot;text-xs font-medium uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>span</code> · 21 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> |  |
| <code>TrendingUp</code> · 22 | <code>&quot;h-4 w-4 text-[#22C55E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 25, 34, 43 | <code>&quot;mt-3 text-3xl font-bold text-black&quot;</code> |  |
| <code>span</code> · 30 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> |  |
| <code>Clock</code> · 31 | <code>&quot;h-4 w-4 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>span</code> · 39 | <code>&quot;flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEE2E2]&quot;</code> |  |
| <code>RotateCcw</code> · 40 | <code>&quot;h-4 w-4 text-[#EF4444]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 47 | <code>&quot;mt-8 flex items-center justify-between&quot;</code> |  |
| <code>h3</code> · 48 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>span</code> · 49 | <code>&quot;flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#374151]&quot;</code> |  |
| <code>Filter</code> · 50 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 55 | <code>&quot;mt-3 overflow-hidden rounded-[32px] border-2 border-black/[0.04] bg-white&quot;</code> |  |
| <code>div</code> · 56 | <code>&quot;overflow-x-auto&quot;</code> |  |
| <code>table</code> · 57 | <code>&quot;w-full min-w-[760px]&quot;</code> |  |
| <code>tr</code> · 59 | <code>&quot;border-b border-[#F3F4F6] text-left text-xs font-semibold uppercase tracking-wide text-[#6B7280]&quot;</code> |  |
| <code>th</code> · 60 | <code>&quot;px-6 py-4&quot;</code> |  |
| <code>th</code> · 61, 62, 63, 64 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>th</code> · 65 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>tr</code> · 70 | <code>&quot;border-b border-[#F3F4F6] last:border-none&quot;</code> |  |
| <code>td</code> · 71 | <code>{`px-6 py-4 text-sm font-semibold ${ txn.status === &quot;Refunded&quot; ? &quot;text-[#EF4444]&quot; : &quot;text-black&quot; }`}</code> |  |
| <code>td</code> · 78 | <code>&quot;px-4 py-4 text-sm text-[#374151]&quot;</code> |  |
| <code>td</code> · 79 | <code>&quot;px-4 py-4 text-sm text-[#6B7280]&quot;</code> |  |
| <code>td</code> · 80 | <code>{`px-4 py-4 text-sm font-semibold ${txn.amount &lt; 0 ? &quot;text-[#EF4444]&quot; : &quot;text-black&quot;}`}</code> |  |
| <code>td</code> · 83 | <code>&quot;px-4 py-4&quot;</code> |  |
| <code>span</code> · 84 | <code>{`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusPillClasses(txn.status)}`}</code> |  |
| <code>td</code> · 90 | <code>&quot;px-4 py-4 text-right&quot;</code> |  |
| <code>span</code> · 91 | <code>&quot;inline-block whitespace-nowrap rounded-lg border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>div</code> · 101 | <code>&quot;flex items-center justify-between border-t border-[#F3F4F6] px-6 py-4&quot;</code> |  |
| <code>p</code> · 102 | <code>&quot;text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 103 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 105 | <code>{`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${ num === 1 ? &quot;bg-[#F7931E] text-white&quot; : &quot;border border-[#E5E7EB] text-[#374151]&quot; }`}</code> |  |

</details>

<details>
<summary>src/components/super-admin/revenue/revenueData.ts — 20 lines</summary>

Source: [src/components/super-admin/revenue/revenueData.ts](<src/components/super-admin/revenue/revenueData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 16
export function statusPillClasses(status: Transaction["status"]) {
  if (status === "Refunded") return "bg-[#FEE2E2] text-[#EF4444]";
  if (status === "Pending") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#EBF7EC] text-[#22C55E]";
}
```

</details>

<details>
<summary>src/components/super-admin/reviews/StarRating.tsx — 19 lines</summary>

Source: [src/components/super-admin/reviews/StarRating.tsx](<src/components/super-admin/reviews/StarRating.tsx>). Coverage: source parsed; visual rendering unverified.

Lucide imports: <code>Star</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 5 | <code>&quot;flex items-center gap-0.5&quot;</code> |  |
| <code>span</code> · 9 | <code>&quot;relative inline-block&quot;</code> | <code>style={{ width: size, height: size }}</code> |
| <code>Star</code> · 10 | <code>&quot;absolute inset-0 text-[#E5E7EB]&quot;</code> | <code>fill=&quot;currentColor&quot;</code>; <code>strokeWidth={0}</code>; <code>style={{ width: size, height: size }}</code> |
| <code>span</code> · 11 | <code>&quot;absolute inset-0 overflow-hidden&quot;</code> | <code>style={{ width: `${fillAmount * 100}%` }}</code> |
| <code>Star</code> · 12 | <code>&quot;text-[#F7931E]&quot;</code> | <code>fill=&quot;currentColor&quot;</code>; <code>strokeWidth={0}</code>; <code>style={{ width: size, height: size }}</code> |

</details>

<details>
<summary>src/components/super-admin/reviews/reviewsData.ts — 159 lines</summary>

Source: [src/components/super-admin/reviews/reviewsData.ts](<src/components/super-admin/reviews/reviewsData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

Fixture/data definitions or nonvisual exports; no standalone rendered component. The importing screen defines appearance. Values are local demo data, not verified backend content.

</details>

<details>
<summary>src/components/super-admin/tickets/SelectTemplateModal.tsx — 122 lines</summary>

Source: [src/components/super-admin/tickets/SelectTemplateModal.tsx](<src/components/super-admin/tickets/SelectTemplateModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 8
type SelectTemplateModalProps = {
  open: boolean;
  onClose: () => void;
  onApply: (template: ReplyTemplate) => void;
};
// line 15
[category, setCategory] = useState<ReplyTemplate["category"]>("Order Issues");
// line 16
[search, setSearch] = useState("");
// line 17
[selectedId, setSelectedId] = useState<string | null>(null);
```

Lucide imports: <code>Check, Search</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 38 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[820px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 39 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 40 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 41 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 43 | <code>&quot;relative mt-4&quot;</code> |  |
| <code>Search</code> · 44 | <code>&quot;pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]&quot;</code> |  |
| <code>input</code> · 45 | <code>&quot;w-full rounded-full border border-[#E5E7EB] py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSearch(event.target.value)}</code>; <code>placeholder=&quot;Search templates...&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={search}</code> |
| <code>div</code> · 54 | <code>&quot;mt-4 flex gap-5&quot;</code> |  |
| <code>div</code> · 55 | <code>&quot;w-[160px] shrink-0&quot;</code> |  |
| <code>div</code> · 56 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>button</code> · 58 | <code>{`cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${ category === option ? &quot;bg-[#F0FDF4] text-[#22C55E]&quot; : &quot;text-[#374151] hover:bg-[#F9FAFB]&quot; }`}</code> | <code>onClick={() =&gt; setCategory(option)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 74 | <code>&quot;grid max-h-[360px] flex-1 grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2&quot;</code> |  |
| <code>button</code> · 78 | <code>{`relative cursor-pointer rounded-2xl border-2 p-4 text-left transition-colors ${ selected ? &quot;border-[#22C55E] bg-[#F0FDF4]&quot; : &quot;border-[#F3F4F6] bg-white hover:border-[#E5E7EB]&quot; }`}</code> | <code>onClick={() =&gt; setSelectedId(template.id)}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 87 | <code>&quot;absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#22C55E]&quot;</code> |  |
| <code>Check</code> · 88 | <code>&quot;h-3 w-3 text-white&quot;</code> | <code>strokeWidth={3}</code> |
| <code>p</code> · 91 | <code>&quot;pr-6 text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 92 | <code>&quot;mt-1.5 text-xs leading-relaxed text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 97 | <code>&quot;col-span-2 py-10 text-center text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 102 | <code>&quot;mt-5 flex items-center justify-end gap-3 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 103 | <code>&quot;cursor-pointer rounded-full border border-[#E5E7EB] px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 110 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>disabled={!selectedId}</code>; <code>onClick={handleApply}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/tickets/TicketReplyModal.tsx — 224 lines</summary>

Source: [src/components/super-admin/tickets/TicketReplyModal.tsx](<src/components/super-admin/tickets/TicketReplyModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 12
type TicketReplyModalProps = {
  ticket: SupportTicket | null;
  open: boolean;
  onClose: () => void;
};
// line 19
[reply, setReply] = useState("");
// line 20
[attachments, setAttachments] = useState<File[]>([]);
// line 21
[emojiOpen, setEmojiOpen] = useState(false);
// line 22
[templateOpen, setTemplateOpen] = useState(false);
// line 23
[sent, setSent] = useState(false);
```

Lucide imports: <code>Paperclip, Smile, X, Zap</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 39 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[780px]&quot;</code>; <code>onClose={handleClose}</code>; <code>open={open}</code> |
| <code>div</code> · 40 | <code>&quot;max-h-[92vh] overflow-y-auto p-6 sm:p-7&quot;</code> |  |
| <code>div</code> · 41 | <code>&quot;flex items-start justify-between gap-4 pr-10&quot;</code> |  |
| <code>div</code> · 42 | <code>&quot;flex flex-col gap-1&quot;</code> |  |
| <code>h2</code> · 43 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 44, 61 | <code>&quot;text-sm font-semibold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 50 | <code>&quot;mt-3 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 51 | <code>&quot;inline-flex rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold text-[#374151]&quot;</code> |  |
| <code>span</code> · 54 | <code>{`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityPillClasses(ticket.priority)}`}</code> |  |
| <code>div</code> · 60 | <code>&quot;mt-6 rounded-2xl bg-[#F0FDF4] p-6 text-center&quot;</code> |  |
| <code>div</code> · 64 | <code>&quot;mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2&quot;</code> |  |
| <code>div</code> · 65, 90 | <code>&quot;flex flex-col gap-2&quot;</code> |  |
| <code>span</code> · 66, 92 | <code>&quot;text-xs font-bold uppercase tracking-[0.6px] text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 69 | <code>&quot;text-sm font-bold text-black&quot;</code> |  |
| <code>span</code> · 70 | <code>&quot;font-semibold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 72 | <code>&quot;rounded-xl bg-[#F0FDF4] p-3.5&quot;</code> |  |
| <code>p</code> · 73 | <code>&quot;text-sm leading-[21px] text-[#374151]&quot;</code> |  |
| <code>span</code> · 75 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 76 | <code>&quot;flex gap-2&quot;</code> |  |
| <code>Image</code> · 78 | <code>&quot;h-14 w-14 shrink-0 rounded-lg border border-[#F1F5F9] object-cover&quot;</code> | <code>alt=&quot;&quot;</code>; <code>height={56}</code>; <code>src=&quot;/Warehouse/product.png&quot;</code>; <code>width={56}</code> |
| <code>div</code> · 91 | <code>&quot;flex items-center justify-between&quot;</code> |  |
| <code>button</code> · 95 | <code>&quot;flex cursor-pointer items-center gap-1 text-xs font-semibold text-[#22C55E] hover:text-[#1ea34d]&quot;</code> | <code>onClick={() =&gt; setTemplateOpen(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>Zap</code> · 100 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 104 | <code>&quot;relative flex-1 rounded-xl border border-[#E5E5E7] p-3&quot;</code> |  |
| <code>textarea</code> · 105 | <code>&quot;h-full w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-[#9CA3AF]&quot;</code> | <code>onChange={(event) =&gt; setReply(event.target.value)}</code>; <code>placeholder={`Type your response to ${firstName} here...`}</code>; <code>rows={7}</code>; <code>value={reply}</code> |
| <code>input</code> · 112 | <code>&quot;hidden&quot;</code> | <code>accept=&quot;image/*&quot;</code>; <code>multiple=true</code>; <code>onChange={(event) =&gt; { const files = Array.from(event.target.files ?? []); setAttachments((prev) =&gt; [...prev, ...files]); event.target.value = &quot;&quot;; }}</code>; <code>type=&quot;file&quot;</code> |
| <code>div</code> · 124 | <code>&quot;absolute bottom-3 right-3 flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 125 | <code>&quot;cursor-pointer text-[#9CA3AF] transition-colors hover:text-black&quot;</code> | <code>aria-label=&quot;Attach file&quot;</code>; <code>onClick={() =&gt; fileInputRef.current?.click()}</code>; <code>title=&quot;Attach file&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>Paperclip</code> · 132 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 134 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 135 | <code>&quot;cursor-pointer text-[#9CA3AF] transition-colors hover:text-black&quot;</code> | <code>aria-label=&quot;Insert emoji&quot;</code>; <code>onClick={() =&gt; setEmojiOpen((value) =&gt; !value)}</code>; <code>title=&quot;Insert emoji&quot;</code>; <code>type=&quot;button&quot;</code> |
| <code>Smile</code> · 142 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 146 | <code>&quot;fixed inset-0 z-10&quot;</code> | <code>onClick={() =&gt; setEmojiOpen(false)}</code> |
| <code>div</code> · 147 | <code>&quot;absolute bottom-7 right-0 z-20 grid w-[232px] grid-cols-6 gap-1 rounded-xl border border-[#E5E5E7] bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 149 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-lg transition-colors hover:bg-[#F5F5F7]&quot;</code> | <code>onClick={() =&gt; { setReply((prev) =&gt; prev + emoji); setEmojiOpen(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 169 | <code>&quot;flex flex-wrap gap-2&quot;</code> |  |
| <code>span</code> · 171 | <code>&quot;flex items-center gap-1.5 rounded-full bg-[#F5F5F7] py-1 pl-3 pr-1.5 text-xs font-medium text-black&quot;</code> |  |
| <code>button</code> · 176 | <code>&quot;flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#e9e9ec] hover:text-black&quot;</code> | <code>aria-label={`Remove ${file.name}`}</code>; <code>onClick={() =&gt; setAttachments((prev) =&gt; prev.filter((_, i) =&gt; i !== index))}</code>; <code>type=&quot;button&quot;</code> |
| <code>X</code> · 182 | <code>&quot;h-3 w-3&quot;</code> | <code>strokeWidth={2.5}</code> |
| <code>div</code> · 193 | <code>&quot;mt-6 flex flex-col gap-4 border-t border-[#F1F5F9] pt-5 sm:flex-row sm:items-center sm:justify-end&quot;</code> |  |
| <code>button</code> · 194 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={handleClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 201 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>disabled={!reply.trim()}</code>; <code>onClick={() =&gt; setSent(true)}</code>; <code>type=&quot;button&quot;</code> |
| <code>SelectTemplateModal</code> · 214 | Inherited / component-owned | <code>onApply={(template) =&gt; { setReply(template.preview); setTemplateOpen(false); }}</code>; <code>onClose={() =&gt; setTemplateOpen(false)}</code>; <code>open={templateOpen}</code> |

</details>

<details>
<summary>src/components/super-admin/tickets/templatesData.ts — 166 lines</summary>

Source: [src/components/super-admin/tickets/templatesData.ts](<src/components/super-admin/tickets/templatesData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

Fixture/data definitions or nonvisual exports; no standalone rendered component. The importing screen defines appearance. Values are local demo data, not verified backend content.

</details>

<details>
<summary>src/components/super-admin/tickets/ticketsData.ts — 117 lines</summary>

Source: [src/components/super-admin/tickets/ticketsData.ts](<src/components/super-admin/tickets/ticketsData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 113
export function priorityPillClasses(priority: SupportTicket["priority"]) {
  if (priority === "Urgent") return "bg-[#FEE2E2] text-[#EF4444]";
  if (priority === "Medium") return "bg-[#FEF3E2] text-[#F7931E]";
  return "bg-[#F3F4F6] text-[#6B7280]";
}
```

</details>

<details>
<summary>src/components/super-admin/ui/ErrorState.tsx — 36 lines</summary>

Source: [src/components/super-admin/ui/ErrorState.tsx](<src/components/super-admin/ui/ErrorState.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};
```

Lucide imports: <code>AlertTriangle</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 17 | <code>&quot;flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center&quot;</code> |  |
| <code>div</code> · 18 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]&quot;</code> |  |
| <code>AlertTriangle</code> · 19 | <code>&quot;h-6 w-6 text-[#EF4444]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 22 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 23 | <code>&quot;mx-auto mt-1.5 max-w-[360px] text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>button</code> · 26 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onRetry}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/ui/FilterDropdown.tsx — 76 lines</summary>

Source: [src/components/super-admin/ui/FilterDropdown.tsx](<src/components/super-admin/ui/FilterDropdown.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type FilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  highlight?: boolean;
  icon?: ReactNode;
};
// line 18
[open, setOpen] = useState(false);
```

Lucide imports: <code>Check, ChevronDown</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 36 | <code>&quot;relative&quot;</code> |  |
| <code>button</code> · 37 | <code>{`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full py-2 pl-5 pr-4 text-sm font-semibold transition-colors ${ highlight ? &quot;bg-[#F7931E] text-white&quot; : &quot;bg-transparent text-[#374151] hover:text-black&quot; }`}</code> | <code>onClick={() =&gt; setOpen((prev) =&gt; !prev)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronDown</code> · 46 | <code>{`h-4 w-4 shrink-0 ${highlight ? &quot;text-white&quot; : &quot;text-[#6B7280]&quot;}`}</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 53 | <code>&quot;absolute left-0 top-full z-20 mt-2 max-h-[280px] min-w-[180px] overflow-y-auto rounded-2xl bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.12)]&quot;</code> |  |
| <code>button</code> · 55 | <code>{`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-[#F9FAFB] ${ option.value === value ? &quot;font-semibold text-black&quot; : &quot;text-[#374151]&quot; }`}</code> | <code>onClick={() =&gt; { onChange(option.value); setOpen(false); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>span</code> · 66 | <code>&quot;truncate&quot;</code> |  |
| <code>Check</code> · 68 | <code>&quot;h-3.5 w-3.5 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/components/super-admin/ui/PageHeader.tsx — 31 lines</summary>

Source: [src/components/super-admin/ui/PageHeader.tsx](<src/components/super-admin/ui/PageHeader.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type PageHeaderProps = {
  title: ReactNode;
  subtitle: string;
  backHref?: string;
  right?: ReactNode;
};
```

Lucide imports: <code>ArrowLeft</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 14 | <code>&quot;flex items-start justify-between gap-4&quot;</code> |  |
| <code>div</code> · 15 | <code>&quot;flex items-start gap-3&quot;</code> |  |
| <code>Link</code> · 16 | <code>&quot;mt-1 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-70&quot;</code> | <code>aria-label=&quot;Back&quot;</code>; <code>href={backHref}</code> |
| <code>ArrowLeft</code> · 21 | <code>&quot;h-6 w-6&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h1</code> · 24 | <code>&quot;text-[28px] font-bold text-black&quot;</code> |  |
| <code>p</code> · 25 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 28 | <code>&quot;shrink-0&quot;</code> |  |

</details>

<details>
<summary>src/components/super-admin/ui/Pagination.tsx — 70 lines</summary>

Source: [src/components/super-admin/ui/Pagination.tsx](<src/components/super-admin/ui/Pagination.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};
```

Lucide imports: <code>ChevronLeft, ChevronRight</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 26 | <code>&quot;flex items-center justify-between px-1 pt-4&quot;</code> |  |
| <code>p</code> · 27 | <code>&quot;text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 30 | <code>&quot;flex items-center gap-2&quot;</code> |  |
| <code>button</code> · 31 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] transition-colors hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>aria-label=&quot;Previous page&quot;</code>; <code>disabled={page === 1}</code>; <code>onClick={() =&gt; onPageChange(page - 1)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronLeft</code> · 38 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 44 | <code>{`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-colors ${ isActive ? &quot;bg-[#F7931E] text-white&quot; : &quot;border border-[#E5E7EB] text-[#374151] hover:bg-[#F5F5F7]&quot; }`}</code> | <code>onClick={() =&gt; onPageChange(pageNum)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 58 | <code>&quot;flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] transition-colors hover:bg-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-40&quot;</code> | <code>aria-label=&quot;Next page&quot;</code>; <code>disabled={page === totalPages}</code>; <code>onClick={() =&gt; onPageChange(page + 1)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ChevronRight</code> · 65 | <code>&quot;h-4 w-4&quot;</code> | <code>strokeWidth={2}</code> |

</details>

<details>
<summary>src/components/super-admin/users/AdminDetailModal.tsx — 312 lines</summary>

Source: [src/components/super-admin/users/AdminDetailModal.tsx](<src/components/super-admin/users/AdminDetailModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 19
type AdminDetailModalProps = {
  admin: Admin | null;
  hub: Hub | null;
  hubs: Hub[];
  allAdmins: Admin[];
  open: boolean;
  onClose: () => void;
  onSuspend: (adminId: string) => void;
  onReassign: (adminId: string, newHubId: string) => void;
};
// line 31
[step, setStep] = useState<"detail" | "reassignForm" | "reassignConfirm" | "suspendConfirm">("detail");
// line 32
[selectedHubId, setSelectedHubId] = useState("");
// line 33
[selectedAdminId, setSelectedAdminId] = useState("");
// line 34
[zone, setZone] = useState(ZONES[0]);
// line 35
[address, setAddress] = useState("");
```

Lucide imports: <code>ArrowRightLeft, LogOut, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 60 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[440px]&quot;</code>; <code>onClose={closeAll}</code>; <code>open={open}</code> |
| <code>div</code> · 61, 259 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 62, 162, 223, 260 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 64 | <code>&quot;mt-5 flex flex-col gap-4&quot;</code> |  |
| <code>label</code> · 66, 84, 96 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>select</code> · 67 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; { setSelectedHubId(event.target.value); const nextHub = hubs.find((item) =&gt; item.id === event.target.value); setAddress(nextHub?.facilityAddress ?? &quot;&quot;); }}</code>; <code>value={selectedHubId}</code> |
| <code>option</code> · 77, 103 | Inherited / component-owned | <code>value={item.id}</code> |
| <code>select</code> · 85 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setZone(event.target.value)}</code>; <code>value={zone}</code> |
| <code>select</code> · 97 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setSelectedAdminId(event.target.value)}</code>; <code>value={selectedAdminId}</code> |
| <code>label</code> · 110 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>label</code> · 111 | <code>&quot;mt-2 block text-sm font-semibold text-black&quot;</code> |  |
| <code>textarea</code> · 112 | <code>&quot;mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setAddress(event.target.value)}</code>; <code>rows={3}</code>; <code>value={address}</code> |
| <code>div</code> · 121 | <code>&quot;mt-6 flex items-center justify-end gap-6 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 122 | <code>&quot;cursor-pointer text-sm font-bold text-[#EF4444] hover:opacity-80&quot;</code> | <code>onClick={closeAll}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 129 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;reassignConfirm&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 145 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={closeAll}</code>; <code>open={open}</code> |
| <code>div</code> · 146, 207 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 147 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 153, 214 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>ArrowRightLeft</code> · 158 | <code>&quot;h-6 w-6 text-[#22C55E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 163, 226 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 164 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>div</code> · 168 | <code>&quot;flex w-full items-center justify-between gap-3 rounded-xl bg-[#F9FAFB] p-4 text-left&quot;</code> |  |
| <code>p</code> · 170, 175 | <code>&quot;text-[10px] font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 171 | <code>&quot;text-sm font-semibold text-[#6B7280]&quot;</code> |  |
| <code>ArrowRightLeft</code> · 173 | <code>&quot;h-4 w-4 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 174 | <code>&quot;text-right&quot;</code> |  |
| <code>p</code> · 176 | <code>&quot;text-sm font-semibold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 180 | <code>&quot;mt-2 flex w-full items-center gap-3&quot;</code> |  |
| <code>button</code> · 181 | <code>&quot;flex-1 cursor-pointer rounded-full border border-[#E5E7EB] py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; setStep(&quot;reassignForm&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 188 | <code>&quot;flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; { onReassign(selectedAdminId, selectedHubId); closeAll(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 206 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[400px]&quot;</code>; <code>onClose={closeAll}</code>; <code>open={open}</code> |
| <code>motion.div</code> · 208 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE2E2]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>LogOut</code> · 219 | <code>&quot;h-6 w-6 text-[#EF4444]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>button</code> · 233 | <code>{`mt-2 w-full cursor-pointer rounded-full py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 ${ admin.status === &quot;Active&quot; ? &quot;bg-[#EF4444]&quot; : &quot;bg-[#F7931E]&quot; }`}</code> | <code>onClick={() =&gt; { onSuspend(admin.id); closeAll(); }}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 245 | <code>&quot;cursor-pointer text-sm font-semibold text-[#374151] hover:text-black&quot;</code> | <code>onClick={() =&gt; setStep(&quot;detail&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 258 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[520px]&quot;</code>; <code>onClose={closeAll}</code>; <code>open={open}</code> |
| <code>div</code> · 262 | <code>&quot;mt-4 flex items-center gap-4&quot;</code> |  |
| <code>div</code> · 263 | <code>&quot;flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-lg font-bold text-white&quot;</code> |  |
| <code>span</code> · 267 | <code>&quot;inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3B82F6]&quot;</code> |  |
| <code>p</code> · 270 | <code>&quot;mt-1 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 274 | <code>&quot;mt-5 rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>p</code> · 275, 280 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>p</code> · 276 | <code>&quot;mt-1 text-sm font-semibold text-black&quot;</code> |  |
| <code>div</code> · 279 | <code>&quot;mt-5 border-t border-[#F3F4F6] pt-4&quot;</code> |  |
| <code>div</code> · 281 | <code>&quot;mt-2 flex items-center gap-2&quot;</code> |  |
| <code>span</code> · 282 | <code>&quot;h-2 w-2 rounded-full bg-[#22C55E]&quot;</code> |  |
| <code>p</code> · 284 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 285 | <code>&quot;flex items-center gap-1.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>Phone</code> · 286 | <code>&quot;h-3.5 w-3.5&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 293 | <code>&quot;mt-6 flex items-center gap-3&quot;</code> |  |
| <code>button</code> · 294 | <code>&quot;flex-1 cursor-pointer rounded-full border-2 border-[#FCA5A5] py-3 text-sm font-bold text-[#EF4444] transition-colors hover:bg-[#FEF2F2]&quot;</code> | <code>onClick={() =&gt; setStep(&quot;suspendConfirm&quot;)}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 301 | <code>&quot;flex-1 cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={() =&gt; setStep(&quot;reassignForm&quot;)}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/users/CreateAdminModal.tsx — 147 lines</summary>

Source: [src/components/super-admin/users/CreateAdminModal.tsx](<src/components/super-admin/users/CreateAdminModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 9
type CreateAdminModalProps = {
  open: boolean;
  onClose: () => void;
  hubs: Hub[];
  onCreate: (data: { name: string; email: string; hubId: string }) => void;
};
// line 17
[name, setName] = useState("");
// line 18
[email, setEmail] = useState("");
// line 19
[hubId, setHubId] = useState(hubs[0]?.id ?? "");
// line 20
[error, setError] = useState(false);
// line 21
[step, setStep] = useState<"form" | "success">("form");
```

Lucide imports: <code>Check, ShieldCheck</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 44 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 45 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 46 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 52 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 57 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 61 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 62 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 63 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>button</code> · 67 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 80 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[520px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 81 | <code>&quot;p-8 text-center&quot;</code> |  |
| <code>div</code> · 82 | <code>&quot;mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3E2]&quot;</code> |  |
| <code>ShieldCheck</code> · 83 | <code>&quot;h-6 w-6 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>h2</code> · 85 | <code>&quot;mt-4 text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 86 | <code>&quot;mt-1.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 88 | <code>&quot;mt-6 flex flex-col gap-4 text-left&quot;</code> |  |
| <code>label</code> · 90, 100 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#374151]&quot;</code> |  |
| <code>input</code> · 91 | <code>&quot;mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setName(event.target.value)}</code>; <code>placeholder=&quot;Enter administrator&#x27;s full name&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={name}</code> |
| <code>input</code> · 101 | <code>&quot;mt-1.5 w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setEmail(event.target.value)}</code>; <code>placeholder=&quot;name@vedabharath.com&quot;</code>; <code>type=&quot;email&quot;</code>; <code>value={email}</code> |
| <code>label</code> · 110 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>select</code> · 111 | <code>&quot;mt-1.5 w-full cursor-pointer rounded-xl bg-[#F5F5F7] px-4 py-3 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setHubId(event.target.value)}</code>; <code>value={hubId}</code> |
| <code>option</code> · 117 | Inherited / component-owned | <code>value={hub.id}</code> |
| <code>p</code> · 124 | <code>&quot;text-center text-sm font-medium text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 128 | <code>&quot;mt-6 flex items-center justify-center gap-8 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 129 | <code>&quot;cursor-pointer text-sm font-bold text-[#EF4444] hover:opacity-80&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 136 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-10 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleCreate}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/users/CreateHubModal.tsx — 186 lines</summary>

Source: [src/components/super-admin/users/CreateHubModal.tsx](<src/components/super-admin/users/CreateHubModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 18
type CreateHubModalProps = {
  open: boolean;
  onClose: () => void;
  initial?: Hub | null;
  admins?: Admin[];
  onSave: (data: HubFormData) => void;
};
// line 27
[name, setName] = useState("");
// line 28
[zone, setZone] = useState("");
// line 29
[address, setAddress] = useState("");
// line 30
[adminId, setAdminId] = useState("");
// line 31
[error, setError] = useState(false);
// line 32
[step, setStep] = useState<"form" | "success">("form");
```

Lucide imports: <code>Check</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 56 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[420px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 57 | <code>&quot;flex flex-col items-center gap-4 p-8 text-center&quot;</code> |  |
| <code>motion.div</code> · 58 | <code>&quot;flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EC]&quot;</code> | <code>animate={{ scale: 1, opacity: 1 }}</code>; <code>initial={{ scale: 0, opacity: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 15 }}</code> |
| <code>motion.div</code> · 64 | Inherited / component-owned | <code>animate={{ scale: 1 }}</code>; <code>initial={{ scale: 0 }}</code>; <code>transition={{ type: &quot;spring&quot;, stiffness: 400, damping: 12, delay: 0.15 }}</code> |
| <code>Check</code> · 69 | <code>&quot;h-7 w-7 text-[#22C55E]&quot;</code> | <code>strokeWidth={3}</code> |
| <code>h2</code> · 73 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 74 | <code>&quot;mt-2 text-sm leading-relaxed text-[#6B7280]&quot;</code> |  |
| <code>span</code> · 75 | <code>&quot;font-semibold text-black&quot;</code> |  |
| <code>button</code> · 79 | <code>&quot;mt-2 w-full cursor-pointer rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>ModalShell</code> · 92 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[460px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 93 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 94 | <code>&quot;text-lg font-bold text-black&quot;</code> |  |
| <code>div</code> · 98 | <code>&quot;mt-5 flex flex-col gap-4&quot;</code> |  |
| <code>label</code> · 100, 111, 131 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>input</code> · 101 | <code>&quot;mt-1.5 w-full rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setName(event.target.value)}</code>; <code>placeholder=&quot;e.g., Whitefield Logistics Center&quot;</code>; <code>type=&quot;text&quot;</code>; <code>value={name}</code> |
| <code>select</code> · 112 | <code>{`mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#F7931E] ${ zone ? &quot;text-black&quot; : &quot;text-[#9CA3AF]&quot; }`}</code> | <code>onChange={(event) =&gt; setZone(event.target.value)}</code>; <code>value={zone}</code> |
| <code>option</code> · 119 | Inherited / component-owned | <code>disabled=true</code>; <code>value=&quot;&quot;</code> |
| <code>option</code> · 123 | <code>&quot;text-black&quot;</code> | <code>value={option}</code> |
| <code>select</code> · 132 | <code>{`mt-1.5 w-full cursor-pointer rounded-xl border border-[#E5E7EB] py-2.5 pl-4 pr-10 text-sm outline-none focus:border-[#F7931E] ${ adminId ? &quot;text-black&quot; : &quot;text-[#9CA3AF]&quot; }`}</code> | <code>onChange={(event) =&gt; setAdminId(event.target.value)}</code>; <code>value={adminId}</code> |
| <code>option</code> · 139 | Inherited / component-owned | <code>value=&quot;&quot;</code> |
| <code>option</code> · 141 | <code>&quot;text-black&quot;</code> | <code>value={admin.id}</code> |
| <code>p</code> · 149 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>label</code> · 150 | <code>&quot;mt-2 block text-sm font-semibold text-black&quot;</code> |  |
| <code>textarea</code> · 151 | <code>&quot;mt-1.5 w-full resize-none rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none placeholder:text-[#9CA3AF] focus:border-[#F7931E]&quot;</code> | <code>onChange={(event) =&gt; setAddress(event.target.value)}</code>; <code>placeholder=&quot;e.g., Plot 45, Industrial Area...&quot;</code>; <code>rows={3}</code>; <code>value={address}</code> |
| <code>p</code> · 161 | <code>&quot;rounded-xl bg-[#FEF2F2] px-4 py-3 text-sm font-semibold text-[#EF4444]&quot;</code> |  |
| <code>div</code> · 167 | <code>&quot;mt-6 flex items-center justify-end gap-6 border-t border-[#F3F4F6] pt-5&quot;</code> |  |
| <code>button</code> · 168 | <code>&quot;cursor-pointer text-sm font-bold text-[#EF4444] hover:opacity-80&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |
| <code>button</code> · 175 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-10 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={handleCreate}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/users/CustomerDetailModal.tsx — 111 lines</summary>

Source: [src/components/super-admin/users/CustomerDetailModal.tsx](<src/components/super-admin/users/CustomerDetailModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 15
type CustomerDetailModalProps = {
  customer: Customer | null;
  open: boolean;
  onClose: () => void;
};
```

Lucide imports: <code>Mail, MapPin, Phone</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 25 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[820px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 26 | <code>&quot;max-h-[88vh] overflow-y-auto p-8&quot;</code> |  |
| <code>div</code> · 27 | <code>&quot;flex items-center gap-5&quot;</code> |  |
| <code>div</code> · 28 | <code>&quot;flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EBF7EC] text-xl font-bold text-[#22C55E]&quot;</code> |  |
| <code>h2</code> · 32 | <code>&quot;text-2xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 33 | <code>&quot;mt-0.5 text-sm text-[#6B7280]&quot;</code> |  |
| <code>div</code> · 39 | <code>&quot;mt-6 grid grid-cols-3 gap-4&quot;</code> |  |
| <code>div</code> · 40, 44, 48 | <code>&quot;rounded-2xl border border-[#E5E7EB] p-5&quot;</code> |  |
| <code>p</code> · 41, 45, 49 | <code>&quot;text-xs text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 42, 50 | <code>&quot;mt-1.5 text-2xl font-bold text-[#22C55E]&quot;</code> |  |
| <code>p</code> · 46 | <code>&quot;mt-1.5 text-2xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 54 | <code>&quot;mt-8 grid grid-cols-1 gap-10 sm:grid-cols-[0.8fr_1.2fr]&quot;</code> |  |
| <code>p</code> · 56, 76 | <code>&quot;text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;mt-3 flex items-center gap-2.5 text-sm text-[#374151]&quot;</code> |  |
| <code>Mail</code> · 58 | <code>&quot;h-4 w-4 shrink-0 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 61 | <code>&quot;mt-2.5 flex items-center gap-2.5 text-sm text-[#374151]&quot;</code> |  |
| <code>Phone</code> · 62 | <code>&quot;h-4 w-4 shrink-0 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>p</code> · 66 | <code>&quot;mt-6 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 69 | <code>&quot;mt-3 flex max-w-[220px] items-start gap-2.5 text-sm leading-relaxed text-[#374151]&quot;</code> |  |
| <code>MapPin</code> · 70 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 75 | <code>&quot;sm:border-l sm:border-[#E5E7EB] sm:pl-10&quot;</code> |  |
| <code>div</code> · 77 | <code>&quot;mt-3 flex flex-col gap-2.5&quot;</code> |  |
| <code>div</code> · 79 | <code>&quot;flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3&quot;</code> |  |
| <code>p</code> · 84 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>p</code> · 85 | <code>&quot;text-xs text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 87 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>span</code> · 88 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 89 | <code>&quot;inline-flex rounded-full bg-[#EBF7EC] px-2.5 py-1 text-[10px] font-bold text-[#22C55E]&quot;</code> |  |
| <code>div</code> · 99 | <code>&quot;mt-8 flex justify-end border-t border-[#F3F4F6] pt-6&quot;</code> |  |
| <code>button</code> · 100 | <code>&quot;cursor-pointer rounded-full bg-[#F7931E] px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/users/HubDetailModal.tsx — 99 lines</summary>

Source: [src/components/super-admin/users/HubDetailModal.tsx](<src/components/super-admin/users/HubDetailModal.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 15
type HubDetailModalProps = {
  hub: Hub | null;
  admins: Admin[];
  open: boolean;
  onClose: () => void;
  onSelectAdmin: (admin: Admin) => void;
};
```

Lucide imports: <code>MapPin</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>ModalShell</code> · 27 | Inherited / component-owned | <code>maxWidth=&quot;max-w-[520px]&quot;</code>; <code>onClose={onClose}</code>; <code>open={open}</code> |
| <code>div</code> · 28 | <code>&quot;p-6&quot;</code> |  |
| <code>h2</code> · 29 | <code>&quot;text-xl font-bold text-black&quot;</code> |  |
| <code>div</code> · 31 | <code>&quot;mt-4 grid grid-cols-2 gap-3&quot;</code> |  |
| <code>div</code> · 32, 36, 40, 44 | <code>&quot;rounded-2xl bg-[#F9FAFB] p-4&quot;</code> |  |
| <code>p</code> · 33, 37, 41, 45 | <code>&quot;text-xs text-[#6B7280]&quot;</code> |  |
| <code>p</code> · 34, 38, 42, 46 | <code>&quot;mt-1 text-xl font-bold text-black&quot;</code> |  |
| <code>p</code> · 50, 68 | <code>&quot;mt-4 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]&quot;</code> |  |
| <code>div</code> · 51 | <code>&quot;mt-1.5 flex items-start gap-2 text-sm text-[#374151]&quot;</code> |  |
| <code>MapPin</code> · 52 | <code>&quot;mt-0.5 h-4 w-4 shrink-0 text-[#F7931E]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>div</code> · 56 | <code>&quot;relative mt-3 flex h-[140px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#EEF2F1]&quot;</code> |  |
| <code>div</code> · 57 | <code>&quot;absolute inset-0 opacity-40&quot;</code> | <code>style={{ backgroundImage: &quot;linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)&quot;, backgroundSize: &quot;24px 24px&quot;, }}</code> |
| <code>MapPin</code> · 65 | <code>&quot;relative h-7 w-7 text-[#F7931E]&quot;</code> | <code>fill=&quot;#FEF3E2&quot;</code>; <code>strokeWidth={2}</code> |
| <code>div</code> · 69 | <code>&quot;mt-1.5 flex flex-col divide-y divide-[#F3F4F6]&quot;</code> |  |
| <code>p</code> · 70 | <code>&quot;py-3 text-sm text-[#9CA3AF]&quot;</code> |  |
| <code>button</code> · 72 | <code>&quot;flex cursor-pointer items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-[#F9FAFB]&quot;</code> | <code>onClick={() =&gt; onSelectAdmin(admin)}</code>; <code>type=&quot;button&quot;</code> |
| <code>div</code> · 78 | <code>&quot;flex items-center gap-3&quot;</code> |  |
| <code>div</code> · 79 | <code>&quot;flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7931E] text-xs font-semibold text-white&quot;</code> |  |
| <code>span</code> · 82 | <code>&quot;text-sm font-semibold text-black&quot;</code> |  |
| <code>span</code> · 84 | <code>&quot;text-sm text-[#EF4444]&quot;</code> |  |
| <code>button</code> · 89 | <code>&quot;mt-4 flex w-full cursor-pointer items-center justify-center rounded-full bg-[#F7931E] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90&quot;</code> | <code>onClick={onClose}</code>; <code>type=&quot;button&quot;</code> |

</details>

<details>
<summary>src/components/super-admin/users/usersData.ts — 201 lines</summary>

Source: [src/components/super-admin/users/usersData.ts](<src/components/super-admin/users/usersData.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

Fixture/data definitions or nonvisual exports; no standalone rendered component. The importing screen defines appearance. Values are local demo data, not verified backend content.

</details>

<details>
<summary>src/components/ui/AnimatedHeading.tsx — 49 lines</summary>

Source: [src/components/ui/AnimatedHeading.tsx](<src/components/ui/AnimatedHeading.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 26
type AnimatedHeadingProps = {
  as?: ElementType;
  className?: string;
  children: string;
};
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>Tag</code> · 37 | <code>{className}</code> | <code>animate=&quot;visible&quot;</code>; <code>initial=&quot;hidden&quot;</code>; <code>variants={container}</code> |
| <code>motion.span</code> · 39 | <code>&quot;inline-block&quot;</code> | <code>variants={word}</code> |

</details>

<details>
<summary>src/components/ui/AnimatedSubtitle.tsx — 19 lines</summary>

Source: [src/components/ui/AnimatedSubtitle.tsx](<src/components/ui/AnimatedSubtitle.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type AnimatedSubtitleProps = HTMLMotionProps<"p">;
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>motion.p</code> · 9 | <code>{className}</code> | <code>animate={{ opacity: 1 }}</code>; <code>initial={{ opacity: 0 }}</code>; <code>transition={{ duration: 0.5, delay: 0.15, ease: &quot;easeOut&quot; }}</code> |

</details>

<details>
<summary>src/components/ui/AnimatedTitle.tsx — 56 lines</summary>

Source: [src/components/ui/AnimatedTitle.tsx](<src/components/ui/AnimatedTitle.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 26
type AnimatedTitleProps = Omit<HTMLMotionProps<"h1">, "children"> & {
  children: string;
};
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>motion.span</code> · 35 | <code>&quot;inline-block&quot;</code> | <code>variants={word}</code> |
| <code>motion.h1</code> · 46 | <code>{className}</code> | <code>animate=&quot;visible&quot;</code>; <code>initial=&quot;hidden&quot;</code>; <code>variants={container}</code> |

</details>

<details>
<summary>src/components/ui/Button.tsx — 38 lines</summary>

Source: [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 4
export type ButtonVariant = "primary" | "secondary";
// line 6
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};
// line 11
BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-[#F9A51A] text-white hover:bg-[#e6960f]",
  secondary:
    "border border-[#E4E4E7] bg-white text-[#1A1C1D] hover:bg-[#F3F3F5]",
};
// line 17
BUTTON_BASE_CLASSES =
  "w-full rounded-full py-[18px] text-base font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";
```

Lucide imports: <code>Loader2</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>button</code> · 29 | <code>{`inline-flex items-center justify-center gap-2 ${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}</code> | <code>disabled={disabled &#124;&#124; loading}</code> |
| <code>Loader2</code> · 34 | <code>&quot;h-[18px] w-[18px] animate-spin&quot;</code> | <code>strokeWidth={2.5}</code> |

</details>

<details>
<summary>src/components/ui/ButtonLink.tsx — 25 lines</summary>

Source: [src/components/ui/ButtonLink.tsx](<src/components/ui/ButtonLink.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 5
type ButtonLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    variant?: ButtonVariant;
    children: ReactNode;
  };
```

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>Link</code> · 18 | <code>{`inline-flex items-center justify-center text-center ${BUTTON_BASE_CLASSES} ${BUTTON_VARIANT_CLASSES[variant]} ${className}`}</code> |  |

</details>

<details>
<summary>src/components/ui/TextField.tsx — 56 lines</summary>

Source: [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>). Coverage: source parsed; visual rendering unverified.

**Props, state and shared recipes (source excerpts)**

```tsx
// line 6
type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  icon: LucideIcon;
  id?: string;
};
// line 23
[visible, setVisible] = useState(false);
```

Lucide imports: <code>Eye, EyeOff, type LucideIcon</code>.

**Node anatomy, appearance, state attributes and interactions**

| Node / source lines | Exact class recipe | Other authored attributes / motion / callbacks |
|---|---|---|
| <code>div</code> · 26 | <code>&quot;flex w-full flex-col gap-2&quot;</code> |  |
| <code>label</code> · 27 | <code>&quot;text-sm font-semibold text-[#3D4949]&quot;</code> | <code>htmlFor={inputId}</code> |
| <code>div</code> · 30 | <code>&quot;flex w-full items-center gap-[18px] rounded-full bg-[#F3F3F5] px-6 py-[18px] focus-within:ring-2 focus-within:ring-[#F9A51A]/40&quot;</code> |  |
| <code>Icon</code> · 31 | <code>&quot;h-[18px] w-[18px] shrink-0 text-[#6D7A7A]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>input</code> · 32 | <code>{`w-full min-w-0 bg-transparent text-base text-[#1A1C1D] outline-none placeholder:text-[#6D7A7A]/50 ${className}`}</code> | <code>id={inputId}</code>; <code>type={isPassword ? (visible ? &quot;text&quot; : &quot;password&quot;) : type}</code> |
| <code>button</code> · 39 | <code>&quot;shrink-0 text-[#6D7A7A] transition-colors hover:text-[#3D4949]&quot;</code> | <code>aria-label={visible ? &quot;Hide password&quot; : &quot;Show password&quot;}</code>; <code>onClick={() =&gt; setVisible((v) =&gt; !v)}</code>; <code>tabIndex={-1}</code>; <code>type=&quot;button&quot;</code> |
| <code>EyeOff</code> · 47 | <code>&quot;h-[18px] w-[18px]&quot;</code> | <code>strokeWidth={2}</code> |
| <code>Eye</code> · 49 | <code>&quot;h-[18px] w-[18px]&quot;</code> | <code>strokeWidth={2}</code> |

</details>

<details>
<summary>src/lib/authState.ts — 15 lines</summary>

Source: [src/lib/authState.ts](<src/lib/authState.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 7
export function hasUpdatedDefaultPassword(role: AdminRole) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(storageKey(role)) === "true";
}
// line 12
export function markDefaultPasswordUpdated(role: AdminRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(role), "true");
}
```

</details>

<details>
<summary>src/lib/smooth-path.ts — 17 lines</summary>

Source: [src/lib/smooth-path.ts](<src/lib/smooth-path.ts>). Coverage: source parsed; visual rendering unverified.

**Visual definitions / utility evidence**

```ts
// line 1
export function smoothPath(points: Array<[number, number]>) {
  if (points.length < 2) return "";

  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}
```

</details>


### 18.C Per-module interactive-state evidence

This supplements the family state matrix with every source module that directly renders an interactive control. **I** means explicit evidence exists somewhere in the module, **N** means no authored evidence of that state, **B** means native/browser focus behavior only. These are file-level signals; use the node contract above to determine which exact control owns a state. A module can delegate additional states to Button, TextField, ModalShell or another child. Selected state is not CSS pressed feedback. Loading is recorded only where an explicit loading state/spinner appears. Error means conditional validation feedback, not merely an error-colored icon.

| Source | Default | Hover | Custom focus | Selected / expanded / confirmation | Disabled | Loading | Conditional error feedback |
|---|---|---|---|---|---|---|---|
| [src/app/super-admin/master-data/coupons/page.tsx](<src/app/super-admin/master-data/coupons/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/master-data/drafts/page.tsx](<src/app/super-admin/master-data/drafts/page.tsx>) | I | I | I | I | I | N | N |
| [src/app/super-admin/master-data/health-benefits/page.tsx](<src/app/super-admin/master-data/health-benefits/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/master-data/nutrition/page.tsx](<src/app/super-admin/master-data/nutrition/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/master-data/page.tsx](<src/app/super-admin/master-data/page.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) | I | I | I | I | N | N | I |
| [src/app/super-admin/master-data/products/page.tsx](<src/app/super-admin/master-data/products/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/master-data/tags/page.tsx](<src/app/super-admin/master-data/tags/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/offers/page.tsx](<src/app/super-admin/offers/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/app/super-admin/products/page.tsx](<src/app/super-admin/products/page.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/app/super-admin/reviews/page.tsx](<src/app/super-admin/reviews/page.tsx>) | I | N | I | I | N | N | N |
| [src/app/super-admin/site-content/banners/new/page.tsx](<src/app/super-admin/site-content/banners/new/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) | I | I | I | I | I | N | N |
| [src/app/super-admin/site-content/blogs/page.tsx](<src/app/super-admin/site-content/blogs/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/site-content/page.tsx](<src/app/super-admin/site-content/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/tickets/page.tsx](<src/app/super-admin/tickets/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/users/drafts/page.tsx](<src/app/super-admin/users/drafts/page.tsx>) | I | I | I | I | I | N | N |
| [src/app/super-admin/users/orders/page.tsx](<src/app/super-admin/users/orders/page.tsx>) | I | I | I | I | N | N | N |
| [src/app/super-admin/users/page.tsx](<src/app/super-admin/users/page.tsx>) | I | I | I | I | N | N | N |
| [src/components/auth/AuthLayout.tsx](<src/components/auth/AuthLayout.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/auth/ForgotPasswordForm.tsx](<src/components/auth/ForgotPasswordForm.tsx>) | I | I | B / N custom | I | I | I | N |
| [src/components/auth/LoginForm.tsx](<src/components/auth/LoginForm.tsx>) | I | I | B / N custom | I | N | I | I |
| [src/components/auth/SetNewPasswordForm.tsx](<src/components/auth/SetNewPasswordForm.tsx>) | I | N | B / N custom | I | I | I | I |
| [src/components/auth/SignupForm.tsx](<src/components/auth/SignupForm.tsx>) | I | I | B / N custom | I | I | I | I |
| [src/components/auth/UpdateDefaultPasswordNotice.tsx](<src/components/auth/UpdateDefaultPasswordNotice.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/dashboard/CompanyGrowthCard.tsx](<src/components/dashboard/CompanyGrowthCard.tsx>) | I | N | B / N custom | I | N | N | N |
| [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/dashboard/InventoryAlertsCard.tsx](<src/components/dashboard/InventoryAlertsCard.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/dashboard/LogoutConfirmModal.tsx](<src/components/dashboard/LogoutConfirmModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/dashboard/ProfileModal.tsx](<src/components/dashboard/ProfileModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/dashboard/SuperAdminNotificationsPanel.tsx](<src/components/dashboard/SuperAdminNotificationsPanel.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/dashboard/TicketReplyModal.tsx](<src/components/dashboard/TicketReplyModal.tsx>) | I | N | I | I | I | N | N |
| [src/components/inventory/BatchDossierModal.tsx](<src/components/inventory/BatchDossierModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/inventory/CreateBatchModal.tsx](<src/components/inventory/CreateBatchModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) | I | I | I | I | I | N | N |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) | I | N | B / N custom | I | N | N | N |
| [src/components/inventory/UpdateStockModal.tsx](<src/components/inventory/UpdateStockModal.tsx>) | I | N | B / N custom | I | I | N | N |
| [src/components/orders/OrderCard.tsx](<src/components/orders/OrderCard.tsx>) | I | I | B / N custom | I | I | N | N |
| [src/components/orders/OrdersQueue.tsx](<src/components/orders/OrdersQueue.tsx>) | I | I | I | I | I | N | N |
| [src/components/orders/modals/CancelOrderModal.tsx](<src/components/orders/modals/CancelOrderModal.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/orders/modals/DeliveredOrderModal.tsx](<src/components/orders/modals/DeliveredOrderModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/orders/modals/InvoiceModal.tsx](<src/components/orders/modals/InvoiceModal.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/orders/modals/InvoicePrintedModal.tsx](<src/components/orders/modals/InvoicePrintedModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/orders/modals/ModalShell.tsx](<src/components/orders/modals/ModalShell.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/orders/modals/PackOrderModal.tsx](<src/components/orders/modals/PackOrderModal.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/orders/modals/ProcessRefundModal.tsx](<src/components/orders/modals/ProcessRefundModal.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/orders/modals/ReturnedOrderModal.tsx](<src/components/orders/modals/ReturnedOrderModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/orders/modals/ShipOrderModal.tsx](<src/components/orders/modals/ShipOrderModal.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/orders/modals/ShippedOrderModal.tsx](<src/components/orders/modals/ShippedOrderModal.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/orders/modals/SupportTicketModal.tsx](<src/components/orders/modals/SupportTicketModal.tsx>) | I | I | B / N custom | I | I | N | N |
| [src/components/orders/modals/TrackShipmentModal.tsx](<src/components/orders/modals/TrackShipmentModal.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/reports/ReportCard.tsx](<src/components/reports/ReportCard.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/ActiveOffersCard.tsx](<src/components/super-admin/ActiveOffersCard.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/ActiveSupportTicketsCard.tsx](<src/components/super-admin/ActiveSupportTicketsCard.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/TopSellingProductsCard.tsx](<src/components/super-admin/TopSellingProductsCard.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/content/BannerScheduledModal.tsx](<src/components/super-admin/content/BannerScheduledModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/content/DateField.tsx](<src/components/super-admin/content/DateField.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/content/SaveDraftModal.tsx](<src/components/super-admin/content/SaveDraftModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/masterdata/ConfirmModal.tsx](<src/components/super-admin/masterdata/ConfirmModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/masterdata/FormModal.tsx](<src/components/super-admin/masterdata/FormModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/masterdata/HealthBenefitsPickerModal.tsx](<src/components/super-admin/masterdata/HealthBenefitsPickerModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/masterdata/NutrientsPickerModal.tsx](<src/components/super-admin/masterdata/NutrientsPickerModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/masterdata/ProductRowMenu.tsx](<src/components/super-admin/masterdata/ProductRowMenu.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/super-admin/masterdata/RelocationConfirmModal.tsx](<src/components/super-admin/masterdata/RelocationConfirmModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/masterdata/StockStatusModal.tsx](<src/components/super-admin/masterdata/StockStatusModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/masterdata/TestimonialsPickerModal.tsx](<src/components/super-admin/masterdata/TestimonialsPickerModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/offers/EditOfferModal.tsx](<src/components/super-admin/offers/EditOfferModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/offers/LaunchOfferModal.tsx](<src/components/super-admin/offers/LaunchOfferModal.tsx>) | I | I | I | I | N | N | I |
| [src/components/super-admin/orders/FiltersModal.tsx](<src/components/super-admin/orders/FiltersModal.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/super-admin/orders/OrderDetailModal.tsx](<src/components/super-admin/orders/OrderDetailModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/products/EditProductModal.tsx](<src/components/super-admin/products/EditProductModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/tickets/SelectTemplateModal.tsx](<src/components/super-admin/tickets/SelectTemplateModal.tsx>) | I | I | I | I | I | N | N |
| [src/components/super-admin/tickets/TicketReplyModal.tsx](<src/components/super-admin/tickets/TicketReplyModal.tsx>) | I | I | B / N custom | I | I | N | N |
| [src/components/super-admin/ui/ErrorState.tsx](<src/components/super-admin/ui/ErrorState.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/ui/FilterDropdown.tsx](<src/components/super-admin/ui/FilterDropdown.tsx>) | I | I | B / N custom | I | N | N | N |
| [src/components/super-admin/ui/PageHeader.tsx](<src/components/super-admin/ui/PageHeader.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/ui/Pagination.tsx](<src/components/super-admin/ui/Pagination.tsx>) | I | I | B / N custom | I | I | N | N |
| [src/components/super-admin/users/AdminDetailModal.tsx](<src/components/super-admin/users/AdminDetailModal.tsx>) | I | I | I | I | N | N | N |
| [src/components/super-admin/users/CreateAdminModal.tsx](<src/components/super-admin/users/CreateAdminModal.tsx>) | I | I | I | I | N | N | I |
| [src/components/super-admin/users/CreateHubModal.tsx](<src/components/super-admin/users/CreateHubModal.tsx>) | I | I | I | I | N | N | I |
| [src/components/super-admin/users/CustomerDetailModal.tsx](<src/components/super-admin/users/CustomerDetailModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/super-admin/users/HubDetailModal.tsx](<src/components/super-admin/users/HubDetailModal.tsx>) | I | I | B / N custom | N | N | N | N |
| [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) | I | N | B / N custom | N | I | I | N |
| [src/components/ui/ButtonLink.tsx](<src/components/ui/ButtonLink.tsx>) | I | N | B / N custom | N | N | N | N |
| [src/components/ui/TextField.tsx](<src/components/ui/TextField.tsx>) | I | I | I | I | N | N | N |

Direct CSS `active:` press utilities and Framer `whileTap` are absent from the source. Where default browser focus is suppressed by `outline-none` without replacement, treat the B/N focus cell as an identified focus gap. Static wrappers and flow coordinators inherit their child contracts; they are not silently assigned hover/disabled/error behavior.

### 18.D Style-bearing values outside JSX attributes

Fixture-driven notification tones, content gradients, SVG helper styles and class constants can be referenced indirectly from JSX. This registry records their exact string values so dynamic recipes do not hide visual variants. Repeated definitions in a file are deduplicated. Source context determines the associated object key or variant; these strings are not new global tokens.

| Source | Exact authored style value |
|---|---|
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 29 | <code>bg-[#EBF7EC]</code> |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 29 | <code>text-[#22C55E]</code> |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 30 | <code>bg-[#EFF6FF]</code> |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 30 | <code>text-[#3B82F6]</code> |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 31 | <code>bg-[#FEF3E2]</code> |
| [src/app/super-admin/master-data/products/new/page.tsx](<src/app/super-admin/master-data/products/new/page.tsx>) line 31 | <code>text-[#F7931E]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 13 | <code>bg-[#EBF7EC]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 13 | <code>text-[#22C55E]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 14 | <code>bg-[#EFF6FF]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 14 | <code>text-[#3B82F6]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 15 | <code>bg-[#FEF3E2]</code> |
| [src/app/super-admin/products/[sku]/page.tsx](<src/app/super-admin/products/[sku]/page.tsx>) line 15 | <code>text-[#F7931E]</code> |
| [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 24 | <code>text-[#3B82F6]</code> |
| [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 25 | <code>text-[#F7931E]</code> |
| [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 26 | <code>text-[#22C55E]</code> |
| [src/app/super-admin/site-content/blogs/[id]/page.tsx](<src/app/super-admin/site-content/blogs/[id]/page.tsx>) line 72 | <code>linear-gradient(135deg, #2E4A2A 0%, #6B8A4A 55%, #C9D9A8 100%)</code> |
| [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 33 | <code>text-[#D93025]</code> |
| [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 34 | <code>text-[#F7931E]</code> |
| [src/components/dashboard/ActivityTicketTable.tsx](<src/components/dashboard/ActivityTicketTable.tsx>) line 35 | <code>text-[#6B7280]</code> |
| [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 92 | <code>font-medium text-[#F9A51A]</code> |
| [src/components/dashboard/DashboardNavbar.tsx](<src/components/dashboard/DashboardNavbar.tsx>) line 92 | <code>font-normal text-black</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 30 | <code>text-[#F9A51A]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 31 | <code>bg-[#D93025]/10</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 32 | <code>bg-[#FCE8E6]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 33 | <code>border border-[#F9D0CF]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 39 | <code>text-black</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 45 | <code>text-[#1D1D1F]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 46 | <code>bg-white shadow-sm</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 47 | <code>bg-[#F5F5F7]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 53 | <code>text-[#3BB54A]</code> |
| [src/components/dashboard/NotificationsPanel.tsx](<src/components/dashboard/NotificationsPanel.tsx>) line 59 | <code>bg-[#3BB54A]/10</code> |
| [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 102 | <code>font-medium text-[#F9A51A]</code> |
| [src/components/dashboard/SuperAdminNavbar.tsx](<src/components/dashboard/SuperAdminNavbar.tsx>) line 102 | <code>font-normal text-black</code> |
| [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 17 | <code>bg-[#F5F5F7] text-[#171D15]</code> |
| [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 18 | <code>bg-[#FEE2E2] text-[#DC2626]</code> |
| [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 19 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/inventory/InventoryBoard.tsx](<src/components/inventory/InventoryBoard.tsx>) line 20 | <code>bg-[#EBF7EC] text-[#3BB54A]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 23 | <code>bg-[#FEE2E2] text-[#DC2626]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 24 | <code>bg-[#E5E5E7]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 25 | <code>bg-[#3BB54A] text-white hover:bg-[#2f9d3d]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 28 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 29 | <code>bg-[#F7931E]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 30 | <code>bg-[#F9A51A] text-white hover:bg-[#e6960f]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 33 | <code>bg-[#EBF7EC] text-[#3BB54A]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 34 | <code>bg-[#3BB54A]</code> |
| [src/components/inventory/StockDetailsGrid.tsx](<src/components/inventory/StockDetailsGrid.tsx>) line 35 | <code>border border-[#BDCAB8] bg-white text-[#171D15] hover:bg-[#F5F5F7]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 50 | <code>bg-[#E8F0FE] text-[#1A73E8]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 51 | <code>bg-[#EBF7EC] text-[#3BB54A]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 52 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 53 | <code>bg-[#FEE2E2] text-[#DC2626]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 101 | <code>cursor-pointer rounded-xl px-6 py-3 text-base font-semibold text-[#64748B] transition-colors hover:bg-[#F5F5F7]</code> |
| [src/components/orders/modals/modalHelpers.ts](<src/components/orders/modals/modalHelpers.ts>) line 104 | <code>cursor-pointer rounded-xl bg-[#F7931E] px-8 py-3.5 text-base font-semibold text-white shadow-[0_10px_15px_-3px_rgba(247,147,30,0.2)] transition-colors hover:bg-[#e6850f]</code> |
| [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) line 24 | <code>bg-[#F7931E]</code> |
| [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) line 30 | <code>bg-[#2E7D32]</code> |
| [src/components/super-admin/CustomerReviewsCard.tsx](<src/components/super-admin/CustomerReviewsCard.tsx>) line 36 | <code>bg-[#3B82F6]</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 26 | <code>linear-gradient(135deg, #3B2F1E 0%, #6B4A2B 45%, #E8D9B5 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 38 | <code>linear-gradient(135deg, #8A4B2C 0%, #C97B3D 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 49 | <code>linear-gradient(135deg, #4C6B3F 0%, #A9C97A 60%, #EFE7C2 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 71 | <code>linear-gradient(135deg, #7A5230 0%, #C79A5B 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 103 | <code>linear-gradient(135deg, #F2A65A 0%, #8FAE68 60%, #3E5C3A 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 112 | <code>linear-gradient(135deg, #8A5A2C 0%, #C99257 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 172 | <code>linear-gradient(135deg, #4A3B2C 0%, #8A6B4A 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 182 | <code>linear-gradient(135deg, #4C6B3F 0%, #A9C97A 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 192 | <code>linear-gradient(135deg, #C9762F 0%, #E8B65A 100%)</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 197 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 198 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/super-admin/content/contentData.ts](<src/components/super-admin/content/contentData.ts>) line 199 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/drafts/draftsData.ts](<src/components/super-admin/drafts/draftsData.ts>) line 44 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/super-admin/drafts/draftsData.ts](<src/components/super-admin/drafts/draftsData.ts>) line 45 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/drafts/draftsData.ts](<src/components/super-admin/drafts/draftsData.ts>) line 46 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/masterdata/masterDataData.ts](<src/components/super-admin/masterdata/masterDataData.ts>) line 72 | <code>Soft, easy-to-digest rice for daily meals...</code> |
| [src/components/super-admin/masterdata/masterDataData.ts](<src/components/super-admin/masterdata/masterDataData.ts>) line 77 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/masterdata/masterDataData.ts](<src/components/super-admin/masterdata/masterDataData.ts>) line 78 | <code>bg-[#FEE2E2] text-[#EF4444]</code> |
| [src/components/super-admin/masterdata/masterDataData.ts](<src/components/super-admin/masterdata/masterDataData.ts>) line 79 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/offers/offersData.ts](<src/components/super-admin/offers/offersData.ts>) line 175 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/offers/offersData.ts](<src/components/super-admin/offers/offersData.ts>) line 176 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/offers/offersData.ts](<src/components/super-admin/offers/offersData.ts>) line 177 | <code>bg-[#F3F4F6] text-[#6B7280]</code> |
| [src/components/super-admin/orders/ordersData.ts](<src/components/super-admin/orders/ordersData.ts>) line 169 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/orders/ordersData.ts](<src/components/super-admin/orders/ordersData.ts>) line 170 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/super-admin/orders/ordersData.ts](<src/components/super-admin/orders/ordersData.ts>) line 171 | <code>bg-[#FEE2E2] text-[#EF4444]</code> |
| [src/components/super-admin/orders/ordersData.ts](<src/components/super-admin/orders/ordersData.ts>) line 172 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 199 | <code>bg-[#EF4444]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 200 | <code>bg-[#F97316]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 201 | <code>bg-[#22C55E]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 211 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 212 | <code>bg-[#FEF2F2] text-[#EF4444]</code> |
| [src/components/super-admin/products/productsData.ts](<src/components/super-admin/products/productsData.ts>) line 213 | <code>bg-[#EFF6FF] text-[#3B82F6]</code> |
| [src/components/super-admin/revenue/revenueData.ts](<src/components/super-admin/revenue/revenueData.ts>) line 17 | <code>bg-[#FEE2E2] text-[#EF4444]</code> |
| [src/components/super-admin/revenue/revenueData.ts](<src/components/super-admin/revenue/revenueData.ts>) line 18 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/super-admin/revenue/revenueData.ts](<src/components/super-admin/revenue/revenueData.ts>) line 19 | <code>bg-[#EBF7EC] text-[#22C55E]</code> |
| [src/components/super-admin/tickets/ticketsData.ts](<src/components/super-admin/tickets/ticketsData.ts>) line 114 | <code>bg-[#FEE2E2] text-[#EF4444]</code> |
| [src/components/super-admin/tickets/ticketsData.ts](<src/components/super-admin/tickets/ticketsData.ts>) line 115 | <code>bg-[#FEF3E2] text-[#F7931E]</code> |
| [src/components/super-admin/tickets/ticketsData.ts](<src/components/super-admin/tickets/ticketsData.ts>) line 116 | <code>bg-[#F3F4F6] text-[#6B7280]</code> |
| [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) line 12 | <code>bg-[#F9A51A] text-white hover:bg-[#e6960f]</code> |
| [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) line 14 | <code>border border-[#E4E4E7] bg-white text-[#1A1C1D] hover:bg-[#F3F3F5]</code> |
| [src/components/ui/Button.tsx](<src/components/ui/Button.tsx>) line 18 | <code>w-full rounded-full py-[18px] text-base font-bold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60</code> |

## 19. AI Development Rules — Mandatory for All New Screens

These are **development requirements for future changes**, not claims about existing compliance.

1. Read `Design.md` before creating or changing UI. Read the relevant installed Next.js guide before writing Next.js code, as required by `AGENTS.md`.
2. Inspect the closest existing route and relevant component source before building anything new.
3. Reuse established role-specific colors, Figtree typography, spacing and page layouts.
4. Prefer existing shared components with their actual props; do not invent component exports or unsupported variants.
5. Preserve the agricultural visual identity, rounded surfaces, typography hierarchy and warehouse/admin context distinctions.
6. Follow documented responsive patterns, and correct proven overflow in new work rather than inheriting it blindly.
7. Implement applicable default, hover, focus-visible, selected/expanded, disabled, pending, success, empty and error states. Clearly distinguish new behavior from existing precedent.
8. Use Lucide icon sizing/stroke conventions and meaningful labels; preserve case-sensitive asset paths.
9. Match existing motion recipes where motion is appropriate; support reduced motion in new work.
10. Follow accessibility requirements for names, roles, keyboard interaction, focus lifecycle, contrast, announcements and reflow. Do not replicate accessibility defects merely for consistency.
11. Avoid arbitrary style values. Start with the relevant shared recipe or documented utility scale.
12. Justify and document additions to fonts, colors, spacing, geometry or interaction standards.
13. Do not duplicate reusable components; add justified variants or compose existing primitives.
14. Verify relevant mobile, breakpoint and desktop viewports, plus zoom and keyboard operation. State explicitly when verification is blocked.
15. Compare final UI with the matching existing domain screen and update this document when the source changes.

A new screen must look and behave as a coherent continuation of this application's established design. Recommendations are not silently promoted to existing facts, and prototype success copy must not imply unimplemented persistence.

## 20. Verification & New Screen Readiness

### Coverage and accuracy

- Source inventory: all33 route modules,88 component modules, the root layout, warehouse loading view, all supporting TypeScript utilities/fixtures and global CSS (140 source files total).
- Systematic extraction: TypeScript parser traversed3,737 JSX elements; component props, state initializers, style recipes, control attributes, inline styling and authored motion were indexed. Colors include126 distinct hex literals, plus named CSS colors, `red-600`, alpha functions and gradients.
- Cross-checks: document route/component coverage, source references, extraction values, installed Tailwind spacing/breakpoints/type/radius/transition definitions, Next layout/CSS conventions, PNG intrinsic dimensions, and original source hashes.
- Runtime attempts: current dev server on port3000 responded HTTP500 for all33 route probes (dynamic samples `/super-admin/products/VB-NAV` and `/super-admin/site-content/blogs/new`). The returned login error indicates Turbopack/CSS processing failure. These are failed probes, not successful screen rendering checks.
- Browser inspection could not proceed because the requested in-app browser surface was unavailable. No screenshot, mobile-layout, keyboard, screen-reader, print-preview or animation-playback pass is claimed.
- Scope preserved: only `Design.md` is the intended project deliverable; no application source, styles, logic, routes, dependencies or configuration was edited. Source hashes were compared after writing documentation. Next runtime attempts may create normal `.next` cache files; those are not application changes.

### Verified solid-color contrast samples

Ratios below were calculated from source HEX values using sRGB relative luminance. They are mathematical solid-pair results, not sampled screenshots. Alpha, gradients, photos, disabled states and overlay compositing were not measured.

| Foreground / background | Calculated ratio | Normal text AA threshold (4.5:1) |
|---|---|---|
| White / `#F7931E` | 2.30:1 | Below |
| White / `#F9A51A` | 2.01:1 | Below |
| White / `#22C55E` | 2.28:1 | Below |
| `#9CA3AF` / white | 2.54:1 | Below |
| `#171D15` / white | 17.17:1 | Above for this pair |
| `#374151` / white | 10.31:1 | Above for this pair |

### New-screen readiness exercise

| Decision for a hypothetical new screen | Documentation path / available answer | Remaining gap |
|---|---|---|
| Which layout? | Section6 plus warehouse/admin/auth templates in14 | Must check actual viewport and content fit |
| Which text styles? | Section5 and exact local node recipes | No semantic type-token API to import |
| Which colors? | Sections3–4 and complete literal registry | Palette remains hardcoded; some pairs need contrast improvement |
| Which actions? | Button/ButtonLink versus domain helper/local action recipes in7 | No unified action size/variant API |
| Which content components? | Domain catalogs and all module contracts | Generic DataTable/Card/EmptyState components do not exist |
| How to model interactions? | State matrix, flow catalog, props/state/event expressions | Async states need new backend-specific implementation |
| How does mobile work? | Actual breakpoint matrix in12 and source utility recipes | Known rigid layouts and all visual behavior remain unverified |
| How to handle loading/error/empty? | Auth Button loading, warehouse loading view, local empty-result recipes, available ErrorState | No universal skeleton/toast/data-fetch contract; add and label deliberate new behavior |
| How to maintain accessibility? | Existing evidence and separately recommended corrections in13/19 | Requires implementation plus keyboard/AT verification |
| How to verify consistency? | Section17 checklist plus source-indexed reference contracts | Live app must render successfully for final visual sign-off |

**Readiness conclusion:** sufficient for source-faithful construction and extension with the existing components. Production visual/accessibility sign-off remains blocked by runtime/browser limitations and the identified missing standards. New code must not assume the existing demo interactions, responsive layouts or accessibility behavior are production-verified.
