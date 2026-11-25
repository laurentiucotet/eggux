---
title: "best practices on product pages for digital products on mobile screens"
status: done
kind: "Desk research · 5 sources (Baymard Institute, Nielsen Norman Group, Apple HIG, Material Design, payment provider guidance)"
created: "2026-11-25"
error: ""
---

# best practices on product pages for digital products on mobile screens

## Report

### What was analysed

We looked at what makes a product page work on a phone when the product is digital, such as a gift card, a downloadable care guide or an extended warranty. We drew on public e-commerce usability research (Baymard Institute's product page and mobile studies, Nielsen Norman Group's e-commerce guidelines), platform guidance on touch targets and layout (Apple HIG, Material Design) and payment provider advice on express checkout. We read it against our actors: a busy parent using one hand on a weak connection, and a loyal customer who forgets passwords.

### What we found

The biggest risk with a digital product is that people can't tell what they actually get. Product page studies keep finding that shoppers drop off when the format, the delivery method or the scope is unclear. For a digital item, the page has to answer four questions near the price: what it is, how it arrives (by email, straight away), when it can be used, and what happens if it doesn't work for them (refund or exchange). People scan on mobile, so these work best as short labelled lines above the fold, not as part of a long description.

Showing the price with all costs included matters more here, because people don't expect a delivery fee on a digital product. Any extra charge that appears later feels like a trick.

The primary action should stay within reach. A sticky "Add to cart" or "Buy now" bar works well on mobile as long as it doesn't cover content. This matches what we already do in checkout (D-005, D-009) and should use the same 48 px height (D-006).

Express payment buttons (Apple Pay, Google Pay) on the product page cut out typing, which fits the under-two-minute goal. Payment providers report better mobile conversion when these buttons appear early.

Digital orders don't need a delivery address. Collecting one adds friction and makes people doubt what they're buying.

Previews (a sample page, a picture of the gift card email) and recent reviews reduce doubt, but heavy media hurts load time on weak connections. Images should load lazily and stay small.

### Limits

This is secondary research. Most published studies cover physical goods, and we applied them to digital products by inference. We have no analytics or tests from this shop. The express payment gains come from payment providers, who have an interest in the result. Before committing, test the layout with 5–8 mobile shoppers.

## Findings

### F-01 · Show format, delivery method, timing and refund terms near the price on digital product pages.
- Source: Baymard product page research; NN/g e-commerce guidelines
- Vote: accepted
- Question: Q-008

### F-02 · Skip the delivery address step (D-003) when the cart holds only digital items.
- Source: Checkout friction research; Guest checkout workflow
- Vote: accepted
- Question: Q-009

### F-03 · Use the same 48 px sticky primary button bar on product pages as in checkout.
- Source: Apple HIG, Material Design; D-005, D-006, D-009
- Vote: accepted
- Question: Q-010

### F-04 · Offer express payment on the product page so the busy parent can buy without typing.
- Source: Payment provider guidance; Busy parent goals
- Vote: accepted
- Question: Q-011

### F-05 · Show the full price up front with no extra fees added later in checkout.
- Source: Baymard checkout abandonment research
- Vote: open

### F-06 · Keep previews light and lazy-loaded so the page works on weak mobile connections.
- Source: Mobile performance good practice; Busy parent constraints
- Vote: open
