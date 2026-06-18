# Hands of Heritage - Website Structure

This file documents the application structure, routing, components, and data flow of the Hands of Heritage (HOH) website. It serves as the developer's guide to the repository and should be updated whenever new routes, components, or major architectural patterns are introduced.

---

## 1. Directory Tree

```text
HOHHH/
├── app/                              # Next.js App Router root
│   ├── admin/                        # Route: /admin
│   │   └── page.tsx                  # Admin Panel dashboard page
│   ├── api/                          # API endpoints
│   │   └── quotes/
│   │       ├── route.ts              # /api/quotes - GET lists, POST submits quotes
│   │       └── [id]/
│   │           └── route.ts          # /api/quotes/[id] - PATCH status, DELETE quote
│   ├── components/                   # Shared UI Components
│   │   ├── EnquiryModal.tsx          # Single-product enquiry form modal
│   │   ├── GalleryGrid.tsx           # Portfolio-style image grid for /gallery
│   │   ├── MobileBottomBar.tsx       # Bottom sticky navigation bar for mobile
│   │   ├── ProductShelf.tsx          # Reusable category showcase grid
│   │   ├── SiteFooter.tsx            # Global footer component
│   │   └── SiteHeader.tsx            # Global header navigation component
│   ├── corporate-gifts/              # Route: /corporate-gifts
│   │   └── page.tsx                  # Corporate landing page
│   ├── gallery/                      # Route: /gallery
│   │   └── page.tsx                  # Full catalogue index
│   ├── packaging/                    # Route: /packaging
│   │   ├── page.tsx                  # Packaging shell
│   │   └── PackagingContent.tsx      # Client component showing velvet boxes, ribbons, etc.
│   ├── wedding-favours/              # Route: /wedding-favours
│   │   └── page.tsx                  # Wedding favour landing page
│   ├── globals.css                   # Core styling system (CSS tokens, variables, components)
│   ├── layout.tsx                    # Root layout (handles HTML shell & MobileBottomBar)
│   ├── page.tsx                      # Route: / (Homepage & Quote Drawer)
│   └── site-content.ts               # Product database & selection helpers
├── public/                           # Static assets
│   ├── download.mp4                  # Background loop video for hero section
│   ├── logohoh.png                   # Brand logo image
│   └── *.png                         # High-res product images (e.g. Copper, Brass, Marble items)
├── package.json                      # npm packages and run scripts
├── tsconfig.json                     # TypeScript compiler settings
├── REFERENCE.md                      # Development state tracker
└── structure.md                      # This directory map and system architecture guide
```

---

## 2. Route Manifest

| Route Path | File Location | Render Type | Core Functionality |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | Client-side (`'use client'`) | Home page, loading screen, full catalogue grid, category filtering, right-hand quote drawer, FAQs. |
| `/wedding-favours` | `app/wedding-favours/page.tsx` | Server-side (Static metadata) | Segment landing page showing targeted favors (diyas, coasters), unboxing details, and planning checklist. |
| `/corporate-gifts` | `app/corporate-gifts/page.tsx` | Server-side (Static metadata) | Segment landing page showing statement drinkware, desk objects, client onboarding hampers. |
| `/packaging` | `app/packaging/page.tsx` | Server-side + Client component | Interactive showcase of packaging finishes (boxes, ribbons, wax seals) and packaging guidelines. |
| `/gallery` | `app/gallery/page.tsx` | Server-side + Client component | Full grid display of all items in `site-content.ts` with quick product-enquiry popup. |
| `/admin` | `app/admin/page.tsx` | Client-side (`'use client'`) | Admin Panel dashboard supporting Enquiry List and Analytics Overview tabs (statistics, pipeline value, product leaderboard, material splits, top occasions, delivery cities). |
| `/api/quotes` | `app/api/quotes/route.ts` | Server Route Handler | GET: Retrieves all quotes. POST: Submits a new quote request. |
| `/api/quotes/[id]` | `app/api/quotes/[id]/route.ts` | Server Route Handler | PATCH: Updates the status of a quote. DELETE: Removes a quote request. |

---

## 3. Component Details & Interactions

### `EnquiryModal`
*   **Props:** `{ item: ShowcaseItem | null, onClose: () => void }`
*   **Behavior:** Renders an absolute overlay covering the viewport. Collects contact details (name, email, phone, quantity, occasion, city) for the selected product. Shows alert upon completion.

### `MobileBottomBar`
*   **Behavior:** Rendered at the bottom of the layout on viewport widths $< 1040\text{px}$. 
*   **State Interaction:** The "Quote" tab triggers a custom event `open-quote-drawer` on `window` when clicked on the homepage (`/`) to toggle the sliding quote drawer.

### `ProductShelf`
*   **Props:** `{ eyebrow: string, title: string, items: ShowcaseItem[] }`
*   **Behavior:** Renders a focused row/grid of products tailored to a landing page (e.g., corporate picks). Clicking a card launches `EnquiryModal`.

### `GalleryGrid`
*   **Props:** `{ items: ShowcaseItem[] }`
*   **Behavior:** Formats items into a mosaic brick layout (every 9th item is styled `wide`). Clicking a tile launches `EnquiryModal`.

---

## 4. State Management & Data Patterns

### Data Model
Products are defined in `app/site-content.ts` using the `ShowcaseItem` type:
```typescript
export type ShowcaseItem = {
  name: string;
  material: string;
  category: string;
  image: string;
};
```

### Quote Basket System
Currently managed via local state in the Homepage (`app/page.tsx`):
*   `quoteItems`: Array of products added to the basket.
*   `drawerOpen`: Boolean to toggle the right-hand slide-out panel (animated with Framer Motion).
*   **Cross-component communication:** Triggered via custom browser event `open-quote-drawer` dispatched from child or sibling pages.

### Data Storage
*   **Google Firebase Firestore:** Quote submissions are stored directly in the `quotes` collection.
*   **Real-time Synchronization:** The Admin Panel `/admin` uses Firestore's real-time `onSnapshot` listener to sync and refresh data automatically on the dashboard.
*   **Deprecation Note:** The local JSON endpoints under `/api/quotes` and `/api/quotes/[id]` are deprecated and no longer active as data operations are client-driven via Firebase SDK.
*   **Data Shape:** Each request matches a unified schema containing id, timestamp, type (`basket` or `single`), status (`New`, `Contacted`, `Archived`), and list of selected items.

---

## 5. Coding & Style Guidelines
*   **Typography:** Google Fonts (`Cormorant Garamond` for elegant serif headings and `Jost`/`Inter` for readable body text).
*   **Theme Palette:** Earthy, luxurious tones (terracotta orange, warm bronze, brushed gold, cream background `#f7f0e8`, text `#251b14`).
*   **Responsiveness:** Grid layouts adapt using media queries at breakpoints (`1040px` for header/bar switches, `780px`, and `560px` for column wraps).
