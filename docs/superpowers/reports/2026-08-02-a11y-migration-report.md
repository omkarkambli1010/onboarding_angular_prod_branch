# Accessibility Migration Report

**Date:** 2026-08-02
**Target:** `onboarding-diy-pwa-release-Prod-43_release_accessiblity`, branch `feature/a11y-migration`
**Source:** `onboarding-diy-pwa-feature-disability_feature_2_fix`, range `d17f3c7..3619ebe`

**Result:** `npm run build` exits 0. 112 files changed under `src/` and
`tsconfig.json` (+2011 / −2126; the negative net is almost entirely multi-line
attribute lists collapsed onto single lines, plus 39 removed `setTitle` calls).
The build emits only pre-existing vendor CSS warnings (swiper, bootstrap) and
the pre-existing `heic2any` CommonJS bailout.

## How the work is delivered

No commits were made for the migration itself — the changes sit in the working
tree, per the standing instruction for this repo. Four commits predate that
instruction and remain on `feature/a11y-migration`: the spec, the plan, the
`skipLibCheck` build fix, and Group 1 (viewport).

Reviewable groupings are written as patch files against `master` in
`docs/superpowers/patches/`:

| Patch | Files | Contents |
| --- | --- | --- |
| `00-build-skiplibcheck.patch` | 1 | `tsconfig.json` — **not** an accessibility change |
| `01-viewport-zoom.patch` | 2 | `src/index.html`, `src/assets/js/script.js` |
| `02-colour-contrast.patch` | 21 | stylesheets |
| `03-aria-semantic-html.patch` | 44 | component templates |
| `04-page-title-system.patch` | 37 | `PageTitleStrategy`, route titles, 34 `setTitle` removals |
| `05-otp-focus-live-regions.patch` | 8 | OTP directive, focus restoration, live regions |

Together the six patches reproduce every changed file.

## Migrated

### Group 1 — Viewport and zoom (WCAG 1.4.4)

`src/index.html` now declares `content="width=device-width, initial-scale=1"`.
The iOS-only handler in `src/assets/js/script.js` that rewrote the viewport at
runtime was removed; it silently re-disabled zoom on iPhone and iPad and
cancelled the meta-tag fix.

### Group 2 — Colour contrast (WCAG 1.4.3, 1.4.6)

21 stylesheets. Error red, success green and placeholder grey darkened to clear
4.5:1; warning text and Trust-section text raised to clear 7:1. Border and
background colours were deliberately left alone — they are judged at the 3:1
non-text threshold and already pass.

`src/assets/css/style.css` also gained the supporting rules the migrated markup
needs: `.skip-link` / `.skip-link:focus`, a global `*:focus-visible` outline, and
the element-level `:focus-visible` rules. See "Retargeted" below — these are the
one addition taken from outside the migrated commit range.

### Group 3 — ARIA and semantic HTML (WCAG 1.1.1, 1.3.1, 2.4.x, 4.1.2)

44 templates. Broken `aria-labelledby` / `aria-describedby` repointed at real
headings; dangling references removed where the control already had an
accessible name; heading levels corrected (`h1`→`h2` inside dialogs, `h5`→`h2`,
`h6`→`h3`) so heading order is monotonic; click-only `div`s given
`role="button"`, `tabindex="0"` and keyboard handlers; decorative icons marked
`aria-hidden`; dialogs given names.

Specific fixes made in the target beyond a straight port:

- `yono-email` email input carried two `id` attributes — on `master`
  `id="floatingInput"` and `id="exampleInputEmail1"`, and the source's
  resolution left `id="yonoEmailInp"` alongside `id="exampleInputEmail1"`.
  Browsers silently honour only the first, which breaks `label[for]`
  association. The input now has a single `id="yonoEmailInp"` matching its
  visible `<label for>`. `floatingInput` was referenced only by a commented-out
  label and nothing in TypeScript. The source flagged this defect and never
  fixed it.
- `home`: the `email2faotp` and `emailotp` dialogs both pointed
  `aria-labelledby` at a non-existent `otpLabel`. They now point at new
  `email2faOtpLabel` / `emailOtpLabel` ids on their own titles.
- `home`: the `tracktimeline2` dialog has no title element, so
  `aria-labelledby="tracktimelineLabel"` (dangling) was replaced with
  `aria-label="Application status timeline"`.
- `home`: the 2FA email input had a dangling `aria-describedby="emailHelp"` and
  no accessible name; it now carries `aria-label="Email ID"`.
- `yono-email`: OTP dialog repointed at a new `emailOtpLabel`.
- `email-home-otp-screen`: success dialog's title given `id="emailModalSuccess"`
  to match the existing `aria-labelledby`.
- `nominee`: six email inputs carried a dangling `aria-describedby="emailHelp"`;
  all six already have a real `<label for>`, so the attribute was removed.
- `declaration`: the help and trading-preference dialogs are each declared twice
  in the template. The second copies' titles were renamed to
  `helpscreenAltLabel` / `tradingprefAltLabel` to avoid duplicate ids, and their
  containers' `aria-labelledby` were repointed to match.
- `link-bank-account`: the two bank-verification radios used different `name`
  values, so they were never a single radio group. They now share
  `name="bankVerificationMethod"`, the `(click)` moved from the wrapping `div`
  onto the input's `(change)`, and each has a real `<label for>`.
- `penny-drop`: two close buttons shared `id="successClose"`; renamed to
  `myModalClose` and `verifySuccessClose`. Nothing in the component references
  either id, so behaviour is unchanged.

### Group 4 — Page-title system (WCAG 2.4.2)

`src/app/page-title.strategy.ts` (new) provides `PageTitleStrategy`, registered
in `app-routing.module.ts` as `{ provide: TitleStrategy, useClass: PageTitleStrategy }`.
39 route entries now declare a `title:`, mapped onto **this** branch's 50-route
table by `path`, not by position. 39 per-component `this.title.setTitle(...)`
calls were removed — several announced the wrong page (`annual-income`
identified itself as "Personal Details").

Routes left without a title, matching the source exactly: the `''` redirect,
`msf-sso/:refno`, `yono-sso/:refno`, `aacallback`, `bp-sso/:formNumber`, and the
`**` wildcard. The two home routes carry `title: ''` deliberately — that makes
`buildTitle` return falsy so the strategy applies `DEFAULT_TITLE`, which is the
correct landing-page title.

Prod-43's extra route `yonotab-sso/:refno` (not present in the source) was given
`title: 'Signing In'`.

### Group 5 — OTP labels, focus restoration, skip link, live regions

- `src/app/otp-aria-label.directive.ts` (new), declared in `AppModule`. Its
  selector is the `ng-otp-input` element, so every OTP screen is covered without
  a per-template change: each digit input gets
  `aria-label="OTP digit N of M"` and `inputmode="numeric"` (WCAG 1.3.1/3.3.2/4.1.2).
- `AppComponent.restoreFocusAfterModalClose()` remembers the focused element on
  `show.bs.modal` and returns focus to it on `hidden.bs.modal`, for both native
  and jQuery-driven dialogs (WCAG 2.4.3). These dialogs are opened
  programmatically, so Bootstrap has no trigger to hand focus back to.
- `AppComponent.skipToMain()` plus the skip link and `<main id="main-content">`
  wrapper in `app.component.html` (WCAG 2.4.1).
- `home`: `ngAfterViewInit` strips PrimeNG's `aria-hidden="true"` from *visible*
  carousel items — NVDA was skipping the testimonial and video content (WCAG
  1.3.1). YouTube embeds gained `cc_load_policy=1` (WCAG 1.2.2) and a transcript
  panel with `focusTranscript()` (WCAG 1.2.3).
- `digilocker-screen`: `toggleGif()` freezes the looping DigiLocker GIF by
  painting the current frame to a canvas (WCAG 2.2.2), with a status live region.
- `email-home-otp-screen`, `mobile-home-otp-screen`: `resendStatusMsg` live
  region announcing that a code was sent and when another can be requested
  (WCAG 4.1.3).
- `thankyou`: `submissionStatusMsg` live region announcing successful submission
  (WCAG 4.1.3).

## Retargeted

- **Viewport.** The source patched `src/index.prod.html` and `src/index.uat.html`.
  Neither file exists here; `angular.json` builds `src/index.html`, so the fix
  went there.
- **Skip-link and focus-visible CSS.** These rules live in the source's
  `style.css` at `d17f3c7`, i.e. *before* the migrated range, so they are not in
  the `d17f3c7..3619ebe` diff — but this branch never had them. Without them the
  migrated skip link renders as visible text at the top of every page and the
  focus indicator is missing. Both blocks were copied in verbatim.
- **Route titles.** Mapped onto this branch's route table by `path`.
  `app-routing.module.ts` was not overwritten.

## Hand-reconciled

Every one of the 40 templates that conflicted was resolved against Prod-43's
markup. Beyond the ARIA work listed above, these files needed structural repair
where the resolution had damaged or lost Prod-43 content:

| File | What was wrong | Fix |
| --- | --- | --- |
| `home.component.html` | The full-name field's bindings had been overwritten by the mobile-number field's, and the mobile-number block deleted — the form had lost a field | Both fields restored with their Prod-43 bindings, plus the source's labels, `aria-required`, and error live regions |
| `nominee.component.html` | Five closing/opening tags dropped, unbalancing the form; two Prod-43 back-arrow SVGs replaced by the source's Font Awesome `<i>` icons | Tags restored; both SVGs restored, with `aria-hidden`/`focusable="false"` added |
| `upload-aadhaar-front.component.html` | `modal-body` duplicated; the `file_type_css` block ("Files supported…") lost; one stray `</div>` | Duplicate removed, block restored, tag balance matches master |
| `upload-additional.component.html` | Same duplication and same lost `file_type_css` block; two stray `</div>`s | Same |
| `email-home-page.component.html` | A `</div>` had been written as `</form>`; the disabled-button hint spans were dropped | Tag corrected; `emailSendOtpHintDesk` / `emailSendOtpHintMob` hints restored |
| `email-home-screen.component.html` | The Google button was opened as `<button>` but closed as `</div>` | Closing tag corrected |
| `digilocker-screen.component.html` | The main heading was opened as `<h2>` but closed as `</div>` | Closing tag corrected |
| `yono-mobile.component.html` | The desktop `<label for="mobileInpDesk">` was dropped | Restored |
| `home.component.css` | The opening `/*` of the commented-out `.trust_section h6` block was lost, so a stray `*/` broke the stylesheet from that point | Comment reopened; the build's `Unexpected "/"` warning is gone |
| `home.component.html` | The Trust-section subtitle was still `<h6>`, whose styles the contrast patch had just commented out — it would have rendered unstyled | Changed to `<p class="trust-subtitle">` as the source does, and the section given `aria-label="Customer Testimonials"` |

Verification used four mechanical checks against `master` for every changed
template: tag-stream equivalence, Angular-binding retention, visible-text
retention, and behaviour-bearing attribute retention. All four are clean apart
from the intentional changes documented here.

## Dropped

- `ACCESSIBILITY_CHANGES_SUMMARY.txt` and
  `SBI Securities - DIY Onboarding - A11y Remediation Report.xlsx` — PM-facing
  documents, explicitly out of scope. Neither exists in this repo.
- Pure reformatting hunks with no attribute change — Prod-43's side was kept.
- The source's `<i class="fa fa-long-arrow-left">` back-arrow markup in
  `nominee.component.html`. That is the source's *baseline* icon, not an
  accessibility fix; Prod-43 had replaced it with an inline SVG, which was kept.
- Removal of the now-unused `private title: Title` constructor injections. The
  source kept them, the build produces no warning for them, and touching 45 more
  files carried more risk than value. They are inert.
- `email-home-page.component.html` has a duplicate `type` attribute
  (`type="text"` and `type="email"` on the same input). It is present in the
  source's baseline too, so it is not attributable to the accessibility work and
  was left as-is. Worth fixing separately.

## Known gaps

- **Third-party sites.** DigiLocker (`accounts.digitallocker.gov.in`) and
  NSDL / Protean eSign (`esign.egov.proteantech.in`) are vendor-owned. Issues
  there must be raised with the vendors.
- **Marketing banner images of text.** The home-screen hero banners have
  promotional copy baked into the image files. Remediation needs a design
  re-export; it is an asset task, not a code change.
- **Video transcripts.** The transcript panel and its links are wired up but each
  `transcript` string is empty, so nothing renders yet. WCAG 1.2.3 is not
  satisfied until the copy is supplied.

## QA notes

- **Pinch-zoom is now enabled.** This is the intended remediation, but it may
  shift mobile layouts QA has not previously exercised. Test on iOS especially —
  the runtime override that used to re-disable zoom there is gone.
- **A visible focus outline now appears on every interactive element**
  (`*:focus-visible`, 3px `#005fcc`). This is a deliberate, global visual change.
- **Reverting the page-title system.** `04-page-title-system.patch` reverses
  cleanly on its own for 34 of the 39 components. The other five —
  `home`, `digilocker-screen`, `thankyou`, `email-home-otp-screen`,
  `mobile-home-otp-screen` — carry both their `setTitle` removal and Group 5's
  live-region logic in the same file, so their diffs sit in
  `05-otp-focus-live-regions.patch`. Reverting Group 4 alone leaves those five
  pages falling back to the `index.html` title.
- **Group 5 depends on Group 3.** The templates in Group 3 reference
  `skipToMain`, `resendStatusMsg`, `submissionStatusMsg`, `gifPaused`,
  `toggleGif`, `gifStatusMsg` and `focusTranscript`; reverting Group 5 without
  Group 3 will not compile.
- **A manual screen-reader pass (NVDA or VoiceOver) is still recommended.**
  Automated criteria do not cover name/role/value quality, focus order, or
  whether the live-region wording actually helps.
