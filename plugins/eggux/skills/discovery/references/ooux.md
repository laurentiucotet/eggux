# OOUX quick reference

Object-Oriented UX (Sophia Prater): model the things users care about before designing screens.

## Finding objects
- Look for nouns that repeat across interviews and documents.
- An object has multiple instances and its own attributes (Order yes; Settings usually no).
- Merge synonyms into one object and record the chosen term in decisions.md.
- Views (Dashboard, Home, Inbox) are not objects; they show objects.

## ORCA
| Step | Question |
|---|---|
| Objects | What are the things? |
| Relationships | How do they connect? One-to-many, many-to-many? Which way do users navigate? |
| CTAs | What can each actor do to each object? Create, edit, cancel, assign, export... |
| Attributes | What do users need to know about it? Which are core (card), which are detail-only? |

## What objects give the UI
Each object gets a consistent set of representations, built from the same attributes:
- **Card / list row:** core attributes, primary CTA
- **Detail page:** all attributes, all CTAs the actor may run, related objects
- **Create/edit form:** editable attributes with validation
- **Empty state:** what to show when the actor has none yet

Relationships become navigation: from a Customer detail page, the actor sees and opens their
Orders.
