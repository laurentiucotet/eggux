---
title: "Saving an account right after a guest checkout"
status: done
kind: "Desk research · 6 sources"
created: "2026-11-25"
error: ""
---

# Saving an account right after a guest checkout

## Report

### What was analysed

We looked at what happens on the confirmation screen at step 4 of the Guest checkout workflow, where the shopper gets an optional "Save my details" offer. Sources were Baymard Institute's checkout usability benchmarks (account-creation and confirmation-page guidelines), Nielsen Norman Group articles on guest checkout and on delaying registration, the WCAG 2.2 rule on accessible authentication (3.3.8), browser documentation for autocomplete="new-password" and passkeys, and GDPR guidance on consent. We checked each against the Busy parent and Loyal customer actors, the Customer account and Order objects, and D-005 and D-006.

### What we found

Baymard keeps finding forced account creation among the top reasons people abandon checkout, at roughly a quarter of abandonments. Its recommended fix is the one this project already uses: let people check out as a guest, then offer an account after payment, when the shop already has their email, name and address. At that point the only new thing the shopper has to give is a credential. Each extra field asked on the confirmation screen lowers uptake, because the shopper's goal is already done.

The offer works best when it is inline and secondary. Order number, delivery estimate and "confirmation email sent" should come first. A modal that hides them makes people anxious that the order didn't go through. The benefits should be concrete and tied to this order: track this order, reorder in one tap, and earn points on this purchase. Generic lines like "create an account for a better experience" get ignored.

The Busy parent forgets passwords, and so does the Loyal customer on a new device. A one-tap passkey or an emailed set-up link takes less effort than typing a password one-handed. WCAG 3.3.8 also favours methods that don't depend on memory. If a password is used, it should have a show toggle and autocomplete="new-password" so the phone suggests a strong one.

The email may already belong to an account. In that case, don't show an error. Offer to add this order to that account after sign-in. The confirmation email should repeat the offer, because many shoppers close the tab right away. Any marketing opt-in must be separate and unticked.

### Limits

This rests on general benchmarks, not tests with this shop's users. Uptake rates differ a lot by sector and region, and we found no public numbers for home-goods shops on mobile. How widely shoppers accept passkeys is still changing. Giving points backdated to this order depends on how the business sets up the loyalty programme. We need to test these points with real shoppers before deciding.

## Findings

### F-01 · Keep account saving after payment, never before. The current step 4 placement is right.
- Source: Baymard checkout benchmark: forced accounts are a top abandonment cause
- Vote: open

### F-02 · Ask only for a credential. Prefill email, name and address from the Order.
- Source: Baymard confirmation-page guidelines; NN/g on delayed registration
- Vote: open

### F-03 · Show the offer inline below the order number, not in a modal that hides confirmation.
- Source: Baymard confirmation-page research; NN/g on post-task interruptions
- Vote: open

### F-04 · Offer a passkey or emailed set-up link before a typed password, since both actors forget passwords.
- Source: WCAG 2.2 SC 3.3.8; actors.md constraints; passkey documentation
- Vote: accepted
- Question: Q-006

### F-05 · State concrete benefits tied to this order, like tracking, reorder and points on this purchase.
- Source: Baymard and NN/g on account-creation motivation; Loyal customer goals
- Vote: open

### F-06 · If the email already has an account, offer to add the order after sign-in. Also repeat the offer in the confirmation email.
- Source: Common practice in major shops; Order belongs to account or guest email
- Vote: open
