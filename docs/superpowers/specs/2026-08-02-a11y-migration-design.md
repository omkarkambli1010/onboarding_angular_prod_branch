# Accessibility Migration Design

**Date:** 2026-08-02
**Target:** `onboarding-diy-pwa-release-Prod-43_release_accessiblity` (branch `master`, Angular 16)
**Source:** `onboarding-diy-pwa-feature-disability_feature_2_fix` (branch `main`)

## Problem

The source project carries a full WCAG 2.2 AA remediation (~94% score). The target
project is built from a newer branch that contains Prod-43 business features the
source does not have. We need the accessibility work in the target **without**
losing any Prod-43 business logic.

This is a merge problem, not a copy problem.

## Stack Correction

Both projects are **Angular 16** applications (`angular.json`, Angular Router,
`.component.ts/.html/.css`). They are not Next.js or React. No App Router or
React patterns apply.

## Baseline Measurements

The source's accessibility work is the range `d17f3c7..3619ebe` (three commits:
`accessibility changes`, `accessibility changes 1`, `accessiblity changes 2`).
`d17f3c7` is the pre-a11y baseline and therefore a valid merge base.

Real diff size: **114 files, +1673 / -819**.

Note: the source's `ACCESSIBILITY_CHANGES_SUMMARY.txt` claims 26 files. That
document describes only the final round and materially undercounts the work.
It is not a reliable migration checklist.

Each of the 114 files was classified by comparing the target's blob hash against
the source's baseline blob:

| Category | Count | Consequence |
| --- | --- | --- |
| Identical to source baseline | 45 | Patch applies cleanly |
| Diverged in target | 63 | Requires real 3-way merge |
| Absent from target | 2 | `src/index.prod.html`, `src/index.uat.html` |
| New files added by a11y work | 4 | 2 code, 2 documents |

Routing has diverged: the target declares 50 routes, the source baseline 49.

## Scope

**In scope:** every change traceable to a WCAG success criterion — ARIA
attributes, alt and label text, semantic HTML, colour contrast, viewport/zoom,
the page-title system, the OTP aria-label directive, and focus/live-region logic.

**Out of scope:** the source's PM-facing documents
(`ACCESSIBILITY_CHANGES_SUMMARY.txt`, `SBI Securities - DIY Onboarding - A11y
Remediation Report.xlsx`), and any hunk in the source range that is not
WCAG-attributable (stray refactors, formatting churn).

**Invariant:** no Prod-43 business logic is removed. Where the source deletes a
line, the line is kept unless the deletion is itself the accessibility fix — the
only such case is the `setTitle()` removals in Group 4.

## Mechanism

1. In the target, add the source as a remote and fetch, so the source's baseline
   blobs enter the target's object store.
2. Generate the patch for `d17f3c7..3619ebe` and apply it with `git apply --3way`.
   Because the base blobs resolve, git performs a genuine per-file three-way
   merge: the 45 unchanged files apply silently; the 63 diverged files either
   auto-merge or raise conflict markers.
3. Resolve conflicts by intent (see Conflict Policy).
4. Remove the remote so the target's history stays clean.

File copying is rejected: it would overwrite Prod-43 changes that live in the
same files as the accessibility changes.

## Change Groups

Work lands on branch `feature/a11y-migration` as five reviewable commits. Each
group is independently revertible.

### Group 1 — Viewport and zoom (WCAG 1.4.4)

Files: `src/index.html`, `src/assets/js/script.js`

The source patched `src/index.prod.html` and `src/index.uat.html`. **The target
has neither file** — `angular.json` builds `src/index.html`. The fix is
retargeted there.

- `src/index.html:55` currently reads
  `content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"`.
  It becomes `content="width=device-width, initial-scale=1"`.
- The iOS gesture handler in `script.js` that re-disables zoom at runtime is
  removed; it silently cancelled the meta-tag fix on iPhone and iPad.

This group changes visible behaviour — users can pinch-zoom, which may shift
layouts QA has not previously seen. That is the intended remediation.

### Group 2 — Colour contrast (WCAG 1.4.3, 1.4.6)

Roughly 15 stylesheets including `src/assets/css/style.css` and the `home`,
`yono-email`, `yono-mobile`, `thankyou`, `bp-sso`, `upload-process`,
`email-home-otp-screen`, `mobile-home-otp-screen`, `aggregator-callback`,
`fnothankyou`, and `nominee-callback` component stylesheets.

Isolated colour values; lowest risk in the migration. Error red, success green,
and placeholder grey are darkened to clear 4.5:1; warning text and Trust-section
text are raised to clear 7:1. Border and background colours are deliberately
untouched — they are judged against the 3:1 non-text threshold and already pass.

### Group 3 — ARIA and semantic HTML (WCAG 4.1.2, 1.1.1, 2.4.x)

Roughly 50 component templates. This group carries the bulk of the conflicts
because Prod-43 restructured markup on several screens.

Covers: broken `aria-labelledby` and `aria-describedby` references repointed at
real headings, dangling references removed where the control already has an
accessible name, a duplicated attribute cleaned up, and dialog/checkbox naming
for the trading-preference, opt-out, and OTP modals.

Also fixes the duplicate `id` attribute on the `yono-email` email input, which
the source flagged in its Section B but never fixed.

### Group 4 — Page-title system (WCAG 2.4.2)

Files: `src/app/page-title.strategy.ts` (new), `src/app/app-routing.module.ts`,
and roughly 40 `*.component.ts` files.

Replaces per-component `this.title.setTitle(...)` calls with a centralised
Angular `TitleStrategy` plus a `title:` property on each route. Several
components previously set wrong or copy-pasted titles.

**Atomic and highest-risk.** The strategy, the route titles, and the `setTitle()`
removals must land together or pages lose their titles entirely. Titles are
mapped onto the *target's* 50-route table rather than overwriting
`app-routing.module.ts` wholesale; the route Prod-43 added receives its own title.

Given its own commit specifically so it can be reverted alone.

### Group 5 — OTP directive, focus management, live regions

Files: `src/app/otp-aria-label.directive.ts` (new), `src/app/app.module.ts`,
`src/app/app.component.ts`, `src/app/app.component.html`, plus the `header`,
`digilocker-screen`, `home`, and `thankyou` components.

These carry substantive TypeScript additions (`app.component.ts` +47,
`home.component.ts` +54, `digilocker-screen.component.ts` +37). Each is read
individually and **only** the accessibility logic is migrated; Prod-43 logic in
the same files is left intact.

## Conflict Policy

For every conflicted hunk:

1. Identify the WCAG success criterion the source hunk addresses.
2. Read the target's current markup or logic.
3. Apply the equivalent fix to the target's structure — re-implementing by hand
   where Prod-43 restructured the code.
4. If the hunk is not WCAG-attributable, drop it.

Skipping a conflicted region is not acceptable: the screens that changed most in
Prod-43 are exactly the screens that would silently lose their fixes.

## Verification

1. `npm run build` in the target must succeed (Angular 16, `node_modules`
   already present).
2. Full review of `git diff master..feature/a11y-migration`, hunk by hunk,
   confirming every change is accessibility-attributable and no business code was
   clobbered.
3. Written report covering what migrated, what was retargeted, and what was
   dropped with reasons.

A manual screen-reader pass (NVDA or VoiceOver) remains recommended after this
migration; automated criteria do not cover everything.

## Out of Reach

Two items cannot be fixed in this codebase and are carried forward as known gaps:

- **Third-party sites.** DigiLocker (`accounts.digitallocker.gov.in`) and NSDL /
  Protean eSign (`esign.egov.proteantech.in`) are vendor-owned; issues there must
  be raised with the vendors.
- **Marketing banner images of text.** The home-screen hero banners have
  promotional copy baked into the image files. Remediation requires the design
  team to re-export them; it is an asset task, not a code change.
