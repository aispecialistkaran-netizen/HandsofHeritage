# Hands of Heritage (HOH) - Project Reference

## Project Overview
"Hands of Heritage" is a premium e-commerce/enquiry website for handcrafted Indian gifts, specifically targeting wedding favours and corporate gifting. It is built using **Next.js 14**, **React 18**, **TypeScript**, and **Framer Motion** for animations.

## What Happened Till Now (Current State)

### 1. Prototype Development
- An initial high-fidelity HTML/CSS/JS prototype (`hands_of_heritage_homepage_prototype.html`) was created to establish the brand aesthetic, typography (Cormorant Garamond & Jost), color palette (earth tones, brass/copper highlights), and core functionality.

### 2. Next.js Migration & Architecture
- The prototype was successfully migrated to a Next.js App Router structure.
- **Global Styles:** `app/globals.css` contains all the styling, including typography, layout shells, and responsive design tokens.
- **Data Centralization:** `app/site-content.ts` acts as the single source of truth for the product catalogue. It currently houses 29 distinct artisan products categorized by material (Copper, Brass, Marble) and use-case (Drinkware, Serveware, Decor, Accessories).

### 3. Core Features Implemented
- **Landing Page (`app/page.tsx`):** 
  - Dynamic Hero section with mosaic image grid.
  - "How it works" process steps.
  - Interactive **Product Catalogue** with real-time filtering (by material or category).
  - **Quote Basket System:** Users can add products to a quote. This is managed via React state and presented in an animated slide-out drawer (using Framer Motion).
  - Enquiry form to submit the quote request.
- **Subpages:**
  - Dedicated pages for `wedding-favours`, `corporate-gifts`, `packaging`, and `gallery` have been scaffolded.
  - The `wedding-favours` page is fully fleshed out with tailored copy, event-specific curation (e.g., Mehendi, Welcome Hampers, Reception), and shared layout components.
- **Shared Components:** Reusable components like `SiteHeader`, `SiteFooter`, and `ProductShelf` have been extracted to maintain consistency across the site.

### 4. Animations and UX
- **Framer Motion** is deeply integrated for scroll-reveal animations (`sectionReveal`), hover micro-interactions on product cards, and smooth entry/exit animations for the quote drawer.

### 6. Business Focus & Narrative Rebalance (Wedding Favours Priority)
- **Visual & Navigation Hierarchy:** Rebalanced navigation across [SiteHeader.tsx](file:///c:/Users/xMonks/HNDOHH/app/components/SiteHeader.tsx), [page.tsx](file:///c:/Users/xMonks/HNDOHH/app/page.tsx), and [SiteFooter.tsx](file:///c:/Users/xMonks/HNDOHH/app/components/SiteFooter.tsx) to establish Wedding Favours as the primary focus, positioning Corporate Gifts as a clearly partitioned secondary business option.
- **Hero & Storytelling:** Re-framed homepage copy, imagery, and CTAs (`Explore Wedding Favours` & `Request a Quote`) around wedding celebrations, sacred ceremony keepsakes (diyas, tealights), and welcome room hampers.
- **Dedicated Secondary Corporate Section:** Embedded a standalone corporate gifting showcase card on the homepage directing B2B and executive clients cleanly to `/corporate-gifts`.
- **Catalogue Curation:** Curated homepage signature items with 8 premier wedding keepsakes.

## Changes This Document Will Track
Moving forward, this reference file should be updated to reflect:
1. **Backend Integration (Done):** Migrated static quote submissions to a serverless real-time database using Google Firebase Firestore. Form submissions from both client components write directly to the `quotes` collection, and the Admin Panel at `/admin` listens to collections in real time using `onSnapshot` to sync analytics metrics and client lists instantly.
2. **Catalogue Expansion:** Additions or modifications to the product list in `site-content.ts` or migration to a CMS.
3. **New Pages & Components:** Completion of the remaining subpages (`corporate-gifts`, `packaging`, `gallery`) and any new interactive components.
4. **Performance & SEO Optimization:** Implementation of metadata, image optimization strategies, and accessibility improvements.
5. **State Management:** If the quote basket needs to persist across page navigations, tracking the implementation of a global state solution (e.g., React Context or Zustand).

