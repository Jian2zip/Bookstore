# Bookstore Website Design Blueprint

This document defines the functional structure and visual design for an independent bookstore website that supports both in-person and online sales.

## 0) Business context (chosen baseline + one-line rationale per choice)

- **Store name:** **Mosslight Books**  
  Reason: The name sounds warm and literary without feeling corporate.
- **Location:** **Taipei, Taiwan (single flagship shop + online shipping nationwide)**  
  Reason: One physical location with online reach keeps operations realistic for an independent shop.
- **Languages:** **Traditional Chinese (default) and English with a visible language switch**  
  Reason: Bilingual support serves local readers and international customers in Taipei.
- **Core inventory:** **new titles, secondhand/out-of-print books, a small antiquarian shelf, and stationery**  
  Reason: This mix supports everyday browsing while preserving the shop’s collectible identity.
- **Audience:** **local readers, students/academics, collectors, and gift buyers**  
  Reason: These groups map directly to high-intent bookstore purchase behaviors.
- **Brand personality:** **quiet, scholarly, warm, slightly idiosyncratic**  
  Reason: A human, curated tone differentiates the shop from mass-market retailers.

---

## 1) Site map and main user flows

## Site map

- **Home**
  - Featured staff pick
  - Curated shelves
  - Upcoming events
  - Quick search
  - Store hours/location
- **Shop**
  - Search results (grid/list toggle)
  - Filters (language, edition, condition, price, availability, subject)
  - Curated shelves index
- **Book detail**
  - Metadata
  - Used-copy condition + real-copy photo + defect notes
  - Availability by location
  - Reserve for pickup
  - Staff note
  - Related titles / same translator / series
- **Cart & Checkout**
  - Guest or account checkout
  - Shipping/pickup options + pickup window
  - Payment methods
- **Account**
  - Orders
  - Wishlist
  - Alerts (back-in-stock/preorder)
- **Community**
  - Events calendar
  - Event detail + RSVP
  - Membership (optional)
- **Ask a bookseller**
  - Short form for recommendation requests
- **About & Visit**
  - Story, photos, hours, map, contact
- **Admin (brief)**
  - Inventory upload (CSV / ISBN scan)
  - Used-book intake
  - Shelf curation and featured picks

## Main flows

1. **Finding a book**
   - Home/Search → query (title/author/ISBN/translator/publisher, typo-tolerant mixed CJK/Latin) → filter/sort → open book detail.
2. **Buying a used copy**
   - Search → used badge/filter → detail page (actual copy photo + condition notes) → add to cart (single-copy stock lock) → checkout.
3. **Reserving for pickup**
   - Detail page → choose location stock → “Reserve for pickup” → choose pickup window → confirmation with pickup instructions.
4. **Joining an event**
   - Home or Community → event detail → RSVP (guest/account) → reminder email/calendar link.

---

## 2) Key page wireframe descriptions (desktop + mobile)

## Home
- **Desktop:** top nav + search, one hero staff pick, two curated shelves, upcoming events strip, store info block.  
  Reason: Priority is editorial discovery, not promotions.
- **Mobile:** sticky top search, stacked modules, thumb-friendly quick actions (Shop / Events / Visit / Account).  
  Reason: Mobile users need immediate paths with minimal scrolling friction.

## Search results
- **Desktop:** left filter rail, right results area with grid/list switch and active filter chips.  
  Reason: Persistent filters reduce decision fatigue in large catalogs.
- **Mobile:** filter drawer + sticky result header with count/sort/view toggle.  
  Reason: Drawer preserves space while keeping controls accessible.

## Book detail
- **Desktop:** cover + gallery left, metadata center, buy/reserve card right, staff note and related modules below.  
  Reason: Separating reading info from purchase actions improves scannability.
- **Mobile:** cover, title/author, buy box, condition notes, staff note, related items in vertical flow.  
  Reason: Purchase-critical data appears before secondary discovery modules.

## Cart & checkout
- **Desktop:** two-column cart (items + summary) and stepper checkout (delivery → payment → review).  
  Reason: Clear progression reduces abandonment.
- **Mobile:** single-column steps with concise summaries and editable sections.  
  Reason: Compact steps are easier to complete on small screens.

## Events
- **Desktop:** month/list toggle, featured upcoming event card, RSVP CTA.  
  Reason: Both planners and casual browsers are supported.
- **Mobile:** agenda list default with date chips and simple RSVP flow.  
  Reason: List format is faster to parse on phones.

---

## 3) Design system

## Color tokens (WCAG-conscious)
- `--bg-paper: #F7F3EA`
- `--bg-card: #FFFDF8`
- `--text-primary: #1F1D1A`
- `--text-secondary: #5E584E`
- `--border-soft: #D9D1C3`
- `--accent-ink: #2E4A5A`
- `--accent-clay: #A45A3F`
- `--success-olive: #4E6B50`

Reason: Paper neutrals keep focus on covers while deep accents maintain readable contrast.

## Typography
- **Heading serif:** `"Noto Serif TC", "Source Han Serif TC", "Iowan Old Style", "Times New Roman", serif`
- **Body sans:** `"Noto Sans TC", "Source Han Sans TC", "Inter", "PingFang TC", "Microsoft JhengHei", sans-serif`
- **Reading measure:** target 60–75 characters; body line-height 1.65.

Reason: Noto/Source Han families give reliable CJK + Latin coverage with strong readability.

## Type scale
- `Display`: 48/56
- `H1`: 36/44
- `H2`: 28/36
- `H3`: 22/30
- `Body L`: 18/30
- `Body`: 16/26
- `Meta`: 14/22
- `Caption`: 12/18

Reason: A restrained scale keeps hierarchy clear without overpowering book imagery.

## Spacing scale
- 4, 8, 12, 16, 24, 32, 48, 64

Reason: An 8pt-based rhythm with 4pt micro-steps balances precision and implementation simplicity.

## Component list

1. **Book card**
   - Fields: cover (true ratio), title, author, price, availability badge.
   - Variant A (new): clean metadata + “In stock”.
   - Variant B (used): condition chip (A/B/C), “Only 1 copy” indicator, optional defect icon.
2. **Shelf/collection module**
   - Shelf title, short curator line, horizontal scroll/list.
3. **Staff pick card**
   - Book info + signed-note style block (subtle handwriting accent optional).
4. **Filters + results header**
   - Result count, active chips, sort, grid/list switch, availability quick toggle.
5. **Empty states**
   - No results, out-of-stock, empty cart with gentle guidance and related actions.

Reason: These components directly map to the bookstore’s core browsing and conversion journeys.

---

## 4) Two alternative visual directions

## Direction A — “Quiet Study”
Muted paper backgrounds, serif headlines, fine dividers, and generous whitespace produce a calm, library-like rhythm centered on thoughtful browsing rather than sales urgency.

**Sample home layout (top to bottom):**
1. Header (logo, search, language, account/cart)
2. Staff pick spotlight (single feature)
3. Curated shelf: “Bookseller’s desk”
4. Curated shelf: “Secondhand finds this week”
5. Upcoming events (3 cards)
6. Visit block (hours, map, contact)

Reason: This direction best embodies a scholarly brand with minimal visual noise.

## Direction B — “Warm Letterpress”
Soft cream surfaces, textured photo treatment, and clay/ink accents evoke printed matter and craft, making the store feel tactile and personable while staying restrained.

**Sample home layout (top to bottom):**
1. Header with compact utility bar (hours + location)
2. Feature row (staff pick + short handwritten note motif)
3. Shelf duo grid (new arrivals / out-of-print)
4. Community strip (next event + RSVP)
5. Ask a bookseller CTA
6. Footer newsletter + membership teaser

Reason: This direction adds more personality for gift buyers and community engagement without becoming promotional.

---

## 5) Accessibility checklist + risk list

## Accessibility checklist (WCAG 2.2 AA target)
- [ ] Text/background contrast >= 4.5:1 for body and >= 3:1 for large text.
- [ ] Full keyboard navigation for search, filters, cart, checkout, RSVP, language switch.
- [ ] Visible focus styles on all interactive controls.
- [ ] Alt text for every cover image (title + author + edition/condition if relevant).
- [ ] Semantic landmarks (`header`, `nav`, `main`, `footer`) and correct heading order.
- [ ] Form labels, error messaging, and status announcements (`aria-live`) for stock/cart updates.
- [ ] Tap targets >= 44x44px on mobile.
- [ ] Supports 200% zoom and reflow without horizontal scrolling.
- [ ] Lazy-loaded images reserve space to prevent layout shift.

Reason: These checks prioritize real usability for low-vision and keyboard-only users.

## Key risks and mitigations

1. **Single-copy used stock collisions**  
   Mitigation: short cart reservation timer + immediate stock release on timeout.
2. **Mixed Chinese/English search quality**  
   Mitigation: indexed bilingual fields, typo tolerance, transliteration/alias support.
3. **CJK typography consistency across devices**  
   Mitigation: tested fallback stacks and conservative line-height/letter-spacing defaults.
4. **Operational overhead for curation freshness**  
   Mitigation: lightweight admin curation interface editable by staff without developer support.
5. **Image-heavy pages on slow mobile networks**  
   Mitigation: responsive image sizes, lazy loading, and aggressive caching of cover thumbnails.

Reason: These are the highest-likelihood failure points for bookstore trust and conversion.

---

## 6) Voice and microcopy (in-store tone)

- **Empty cart:** “Your bag is empty for now—may we suggest today’s staff shelf?”
- **Out of stock:** “This copy has found a home; leave an alert and we’ll write when another arrives.”
- **No search results:** “We couldn’t find that title yet—try another spelling, or ask a bookseller and we’ll help you track it down.”

Reason: The language stays brief, friendly, and expert without sounding automated.
