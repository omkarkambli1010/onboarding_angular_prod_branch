# Accessibility Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate every WCAG-attributable change from `onboarding-diy-pwa-feature-disability_feature_2_fix` into this Prod-43 branch without losing any Prod-43 business logic.

**Architecture:** The source's `d17f3c7` commit is the pre-accessibility baseline, which makes it a valid merge base for this repo even though the two repos have unrelated histories. We fetch the source's objects into this repo's object store, then apply the accessibility range `d17f3c7..3619ebe` in five path-scoped patches using `git apply --3way`. Git performs a genuine per-file three-way merge; conflicts are resolved by re-implementing the WCAG intent against Prod-43's current structure.

**Tech Stack:** Angular 16, TypeScript, Bootstrap modals, `ng-otp-input`, Angular Router `TitleStrategy`, npm.

## Global Constraints

- Repo under change: `D:\tmp\onboarding-diy-pwa-release-Prod-43_release_accessiblity`, branch `feature/a11y-migration`.
- Source repo (read-only): `D:\tmp\onboarding-diy-pwa-feature-disability_feature_2_fix`.
- Accessibility commit range in source: `d17f3c7..3619ebe`.
- **Never remove Prod-43 business logic.** Where the source deletes a line, keep it unless the deletion is itself the accessibility fix. The only sanctioned deletions are the `setTitle()` calls in Task 5 and the iOS viewport override in Task 2.
- **Do not migrate** `ACCESSIBILITY_CHANGES_SUMMARY.txt` or `SBI Securities - DIY Onboarding - A11y Remediation Report.xlsx`. They are out of scope.
- Drop any hunk in the source range that is not traceable to a WCAG success criterion.
- The shell is PowerShell. `&&` and `||` are unavailable; chain with `;` and `if ($?) { }`.
- Verification command for every task: `npm run build` from the repo root. It must exit 0.
- Commit message trailer on every commit: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

---

### Task 1: Establish baseline and stage the source objects

Proves the build is green *before* any accessibility change, so a later failure is unambiguously ours. Then makes the source's baseline blobs resolvable so `git apply --3way` can do real three-way merges.

**Files:**
- Modify: none (git plumbing and a scratch patch directory only)
- Create: `.a11y-patches/` (scratch, git-ignored, deleted in Task 7)

**Interfaces:**
- Produces: a fetched remote `a11y-src` whose objects include `d17f3c7` and `3619ebe`; a `.a11y-patches/` directory holding the five path-scoped patch files consumed by Tasks 2–6.

- [ ] **Step 1: Confirm we are on the migration branch**

```powershell
cd D:\tmp\onboarding-diy-pwa-release-Prod-43_release_accessiblity
git rev-parse --abbrev-ref HEAD
```

Expected: `feature/a11y-migration`. If not, run `git checkout feature/a11y-migration`.

- [ ] **Step 2: Record the baseline build result**

```powershell
npm run build
```

Expected: exit 0. If this fails, **stop and report** — the branch was already broken and this migration must not be blamed for it.

- [ ] **Step 3: Fetch the source repo's objects**

```powershell
git remote add a11y-src D:/tmp/onboarding-diy-pwa-feature-disability_feature_2_fix
git fetch a11y-src
```

- [ ] **Step 4: Verify both endpoint commits resolve locally**

```powershell
git cat-file -t d17f3c7; git cat-file -t 3619ebe
```

Expected: `commit` printed twice. If either fails, the fetch did not bring the objects and `--3way` will not work.

- [ ] **Step 5: Create the scratch patch directory and ignore it**

```powershell
New-Item -ItemType Directory -Force .a11y-patches | Out-Null
Add-Content -Path .git\info\exclude -Value ".a11y-patches/"
```

Using `.git\info\exclude` rather than `.gitignore` keeps the scratch directory out of the committed tree entirely.

- [ ] **Step 6: Generate the five path-scoped patches**

```powershell
git diff d17f3c7 3619ebe -- src/assets/js/script.js > .a11y-patches/01-viewport.patch
git diff d17f3c7 3619ebe -- "*.css" > .a11y-patches/02-contrast.patch
git diff d17f3c7 3619ebe -- "*.html" > .a11y-patches/03-aria.patch
git diff d17f3c7 3619ebe -- src/app/page-title.strategy.ts src/app/app-routing.module.ts > .a11y-patches/04-titles.patch
git diff d17f3c7 3619ebe -- src/app/otp-aria-label.directive.ts src/app/app.module.ts src/app/app.component.ts > .a11y-patches/05-directive.patch
Get-ChildItem .a11y-patches | Select-Object Name, Length
```

Expected: five non-empty `.patch` files. Note the `.html` patch will be the largest.

- [ ] **Step 7: Confirm the working tree is still clean**

```powershell
git status --porcelain
```

Expected: no output. This task changes no tracked files by design — it only stages git objects and scratch patches. There is nothing to commit; proceed to Task 2.

---

### Task 2: Viewport and zoom (WCAG 1.4.4)

Re-enables pinch-zoom. **This is the one retargeted change:** the source patched `src/index.prod.html` and `src/index.uat.html`, neither of which exists here. `angular.json:17` builds `src/index.html`, so the meta fix goes there instead.

**Files:**
- Modify: `src/index.html:55`
- Modify: `src/assets/js/script.js:1-12`

**Interfaces:**
- Consumes: `.a11y-patches/01-viewport.patch` from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Confirm the defect is present**

```powershell
Select-String -Path src\index.html -Pattern "viewport"
```

Expected, on line 55:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
```

`maximum-scale=1`, `minimum-scale=1`, and `user-scalable=no` each independently block zoom.

- [ ] **Step 2: Fix the viewport meta by hand**

Replace that line in `src/index.html` with:

```html
    <meta name="viewport" content="width=device-width, initial-scale=1" />
```

Do not apply a patch here — the source's change targets filenames that do not exist in this repo.

- [ ] **Step 3: Apply the script.js patch**

```powershell
git apply --3way .a11y-patches/01-viewport.patch
```

If it conflicts, resolve by hand: delete the `if (/iPhone|iPad|iPod/.test(navigator.userAgent)) { ... }` block at the top of the file that rewrites the viewport meta at runtime, and leave a comment in its place. That block silently re-disabled zoom on iOS, cancelling the meta fix.

Result should be:

```javascript
// // Owlcarousel
// NOTE: The viewport override that disabled pinch-zoom on iOS was removed to
// meet WCAG "zoom and scaling must not be disabled" accessibility requirements.
```

- [ ] **Step 4: Verify no zoom-blocking directive survives anywhere**

```powershell
Select-String -Path src\index.html, src\assets\js\script.js -Pattern "user-scalable|maximum-scale"
```

Expected: no output. Any hit means the fix is incomplete.

- [ ] **Step 5: Build**

```powershell
npm run build
```

Expected: exit 0.

- [ ] **Step 6: Commit**

```powershell
git add src/index.html src/assets/js/script.js
git commit -m @'
a11y: re-enable pinch-zoom and text scaling (WCAG 1.4.4)

Viewport meta no longer locks scale. Removed the iOS-only script that
rewrote the viewport at runtime and silently re-disabled zoom.

Retargeted from the source's index.prod.html/index.uat.html to
index.html, which is the file angular.json actually builds here.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

---

### Task 3: Colour contrast (WCAG 1.4.3, 1.4.6)

21 stylesheets. Lowest-risk group — isolated colour values, no structural change.

**Files:**
- Modify: `src/assets/css/style.css` and 20 component stylesheets (`adhaar-copy`, `aggregator-callback`, `bp-sso`, `digilocker-screen`, `email-home-otp-screen`, `esign`, `father-spouse-name`, `fnothankyou`, `header`, `home`, `link-bank-account`, `mobile-home-otp-screen`, `nominee-callback`, `plan-preference`, `selfie`, `thankyou`, `upload-process`, `upload-signature`, `yono-email`, `yono-mobile`)

**Interfaces:**
- Consumes: `.a11y-patches/02-contrast.patch` from Task 1.
- Produces: nothing consumed by later tasks.

Target ratios, all against white:

| Text role | Before | After |
| --- | --- | --- |
| Error / invalid red | 3.7:1 | 5.5:1 |
| Success / status green | 2.9:1 | 5.4:1 |
| Input placeholder grey | 2.9–4.1:1 | 4.7:1 |
| Warning / error message | 5.9:1 | 7.2:1 |
| Trust card sub-text | 6.7:1 | 7.3:1 |

Border and background colours are **deliberately not changed** — they are judged at the 3:1 non-text threshold and already pass.

- [ ] **Step 1: Apply the contrast patch**

```powershell
git apply --3way .a11y-patches/02-contrast.patch
```

- [ ] **Step 2: Find any conflicts**

```powershell
git diff --check; Select-String -Path src -Include *.css -Pattern "^<<<<<<<" -Recurse
```

Expected: no output. If there are conflict markers, resolve each one by keeping Prod-43's rule structure and applying only the colour value change from the source side, then delete the markers.

- [ ] **Step 3: Confirm no layout properties were touched**

```powershell
git diff --unified=0 -- "*.css" | Select-String -Pattern "^[+-]" | Select-String -NotMatch "^[+-]{3}" | Select-String -Pattern "color|background|border|opacity|outline" -NotMatch
```

Expected: little or no output. Anything printed is a non-colour CSS change — inspect it, and revert it unless it is an accessibility fix such as a focus outline or `:focus-visible` rule.

- [ ] **Step 4: Build**

```powershell
npm run build
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```powershell
git add "*.css"
git commit -m @'
a11y: raise text colour contrast to AA/AAA (WCAG 1.4.3, 1.4.6)

Darkened error red, success green, and placeholder grey to clear 4.5:1.
Raised warning text and Trust-section text to clear 7:1. Border and
background colours left unchanged - they pass the 3:1 non-text threshold.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

---

### Task 4: ARIA attributes and semantic HTML (WCAG 4.1.2, 1.1.1, 2.4.x)

45 templates, and the group carrying the most conflicts because Prod-43 restructured markup on several screens. **Expect to resolve conflicts by hand here** — that is the plan, not a failure.

**Files:**
- Modify: 45 `*.component.html` files across the app
- Modify: `src/app/yono-email/yono-email.component.html` — additionally fix the duplicate `id` the source flagged but never fixed

**Interfaces:**
- Consumes: `.a11y-patches/03-aria.patch` from Task 1.
- Produces: an element with `id="main-content"` must exist in `src/app/app.component.html` for Task 6's skip link to target. If the patch does not create it, add it in this task.

- [ ] **Step 1: Apply the ARIA patch, allowing rejects**

```powershell
git apply --3way .a11y-patches/03-aria.patch
```

This will likely report conflicts. That is expected — continue to Step 2 rather than aborting.

- [ ] **Step 2: List every file left with conflict markers**

```powershell
Select-String -Path src -Include *.html -Pattern "^<<<<<<<" -Recurse | Select-Object -ExpandProperty Path -Unique
```

Record this list. Each file needs individual resolution in Step 3.

- [ ] **Step 3: Resolve each conflict by WCAG intent**

For every conflicted file, work hunk by hunk:

1. Read the source side of the conflict and identify what it fixes — a repointed `aria-labelledby`, a removed dangling `aria-describedby`, an added `alt`, a dialog name, a `role`.
2. Read Prod-43's side and understand what business change it made.
3. Write a resolution that keeps **all** of Prod-43's markup and structure, and applies the accessibility attribute to it — repointing `aria-labelledby` at whatever the heading's `id` is *in the target's markup*, which may differ from the source's.
4. Delete the conflict markers.

Rules for the recurring cases:

- **Dangling `aria-labelledby` / `aria-describedby`** (points at an id that does not exist): if the target has a real heading or label, point the attribute at that element's `id`. If the control already has an accessible name from visible text or `aria-label`, remove the broken attribute entirely.
- **Modal dialogs** (trading-preference acceptance, opt-out confirmation, OTP verification): the dialog needs `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing at its title element's `id`.
- **Duplicated attribute** on a button: keep one.
- If a hunk is pure reformatting with no attribute change, **drop it** — take Prod-43's side.

- [ ] **Step 4: Verify every conflict marker is gone**

```powershell
Select-String -Path src -Include *.html -Pattern "^<<<<<<<|^>>>>>>>|^=======" -Recurse
```

Expected: no output.

- [ ] **Step 5: Fix the duplicate id on the yono-email input**

```powershell
Select-String -Path src\app\yono-email\yono-email.component.html -Pattern "id="
```

The email input carries two `id` attributes. Remove the second one. Browsers silently ignore it, but it is invalid HTML and breaks `label[for]` association.

- [ ] **Step 6: Verify no dangling ARIA references remain**

For each `aria-labelledby` and `aria-describedby` value in the changed templates, confirm an element with that `id` exists in the same template:

```powershell
Get-ChildItem src -Include *.html -Recurse | ForEach-Object {
  $file = $_.FullName
  $c = Get-Content $file -Raw
  foreach ($m in [regex]::Matches($c, 'aria-(?:labelledby|describedby)="([^"]+)"')) {
    foreach ($ref in ($m.Groups[1].Value -split '\s+')) {
      if ($ref -and ($c -notmatch ('id="' + [regex]::Escape($ref) + '"'))) {
        "DANGLING: '$ref' in $file"
      }
    }
  }
}
```

The filename is captured into `$file` before the inner loop because `$_` is rebound by each nested pipeline.

Expected: no output. Any hit is a broken reference that must be repointed or removed. Note this check is per-template and will flag ids that legitimately live in a parent template — verify each hit before acting.

- [ ] **Step 7: Ensure the skip-link target exists**

```powershell
Select-String -Path src\app\app.component.html -Pattern "main-content"
```

If there is no output, add `id="main-content"` to the main content wrapper element in `src/app/app.component.html`. Task 6 depends on it.

- [ ] **Step 8: Build**

```powershell
npm run build
```

Expected: exit 0. Angular's template compiler will catch malformed HTML introduced during conflict resolution.

- [ ] **Step 9: Commit**

```powershell
git add "*.html"
git commit -m @'
a11y: correct ARIA references and semantic markup (WCAG 4.1.2, 1.1.1)

Repointed broken aria-labelledby/aria-describedby at real headings,
removed dangling references where the control already had a name, and
gave the trading-preference, opt-out, and OTP dialogs proper names.
Fixed the duplicate id on the yono-email input.

Conflicts resolved against Prod-43 markup; all Prod-43 structure kept.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

---

### Task 5: Page-title system (WCAG 2.4.2)

**Highest-risk task, and atomic.** The `TitleStrategy`, the route titles, and the removal of 34 per-component `setTitle()` calls must land in one commit or pages lose their titles. It gets its own commit so QA can revert it alone.

The target declares 50 routes; the source baseline had 49. Titles are mapped onto *this* repo's route table — do not overwrite `app-routing.module.ts` wholesale.

**Files:**
- Create: `src/app/page-title.strategy.ts`
- Modify: `src/app/app-routing.module.ts`
- Modify: 34 `*.component.ts` files — remove one `this.title.setTitle(...)` line each
- Modify: `src/app/email-home-page/email-home-page.component.ts`, `src/app/email-home-screen/email-home-screen.component.ts` — three lines each

**Interfaces:**
- Consumes: `.a11y-patches/04-titles.patch` from Task 1.
- Produces: `PageTitleStrategy` class, exported from `src/app/page-title.strategy.ts`, registered in `app-routing.module.ts` providers as `{ provide: TitleStrategy, useClass: PageTitleStrategy }`.

- [ ] **Step 1: Create the title strategy**

Create `src/app/page-title.strategy.ts` with exactly:

```typescript
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_SUFFIX = 'Onboarding - SBI Securities';
const DEFAULT_TITLE =
  'Open Demat Account - Demat & Trading Account Online for Free | SBI Securities';

/**
 * WCAG 2.4.2 - every step of the journey needs a title that identifies the
 * current step, not the landing page title inherited from index.html.
 */
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(
      pageTitle ? `${pageTitle} - ${SITE_SUFFIX}` : DEFAULT_TITLE
    );
  }
}
```

- [ ] **Step 2: Read the source's route titles**

```powershell
git show 3619ebe:src/app/app-routing.module.ts | Select-String -Pattern "title:"
```

This is the authoritative title map. Sample of the expected shape:

```typescript
{ path: '', component: HomeComponent, title: '' },
{ path: 'home', component: HomeComponent, title: '' },
{ path: 'mobile-home-otp', component: MobileHomeOtpScreenComponent, title: 'OTP Verification for Demat Account Opening' },
{ path: 'email', component: EmailHomeScreenComponent, title: 'Email Verification' },
{ path: 'email-home-textpage', component: EmailHomePageComponent, title: 'Email ID' },
{ path: 'email-home-otp', component: EmailHomeOtpScreenComponent, title: 'Email OTP Verification' },
{ path: 'digilocker-screen', component: DigilockerScreenComponent, title: 'DigiLocker Verification' },
```

The empty `title: ''` on the two home routes is intentional — it makes `buildTitle` return falsy so `DEFAULT_TITLE` is used, which is the correct landing-page title.

- [ ] **Step 3: Add titles to this repo's route table by hand**

Edit `src/app/app-routing.module.ts`. For each route, add the `title:` value from Step 2 matched **by `path`**, not by position. Do not reorder, remove, or alter any route. Prod-43's extra route will not appear in the source map — give it a descriptive title consistent with the others (a short human-readable name for the step).

Then wire the strategy. Add to the imports:

```typescript
import { PageTitleStrategy } from './page-title.strategy';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
```

And add the provider to the `@NgModule`:

```typescript
providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
```

- [ ] **Step 4: Verify every route has a title**

```powershell
$c = Get-Content src\app\app-routing.module.ts -Raw
$paths = ([regex]::Matches($c, "path:")).Count
$titles = ([regex]::Matches($c, "title:")).Count
"paths=$paths titles=$titles"
```

Expected: `titles` equals `paths` minus 1. The one exception is the `{ path: '', pathMatch: 'full', redirectTo: '' }` redirect entry, which is not a rendered page and takes no title. If the gap is larger than 1, routes were missed.

- [ ] **Step 5: Find every remaining per-component setTitle call**

```powershell
Select-String -Path src -Include *.ts -Pattern "\.setTitle\(" -Recurse | Where-Object { $_.Path -notmatch "page-title.strategy" }
```

Expected: 34–36 hits.

- [ ] **Step 6: Remove each one**

Delete the `this.title.setTitle('...');` line from every component listed in Step 5. These titles are now wrong anyway — several were copy-pasted, which is why `annual-income.component.ts` announced itself as "Personal Details".

Leave the neighbouring `this.meta.updateTag({...})` calls alone; they are SEO metadata, not titles. If removing `setTitle` leaves the injected `Title` service unused in a component, remove that injection too — otherwise the build will warn.

- [ ] **Step 7: Verify only the strategy sets titles**

```powershell
Select-String -Path src -Include *.ts -Pattern "\.setTitle\(" -Recurse
```

Expected: exactly one hit, in `src/app/page-title.strategy.ts`.

- [ ] **Step 8: Build**

```powershell
npm run build
```

Expected: exit 0. A failure here is most likely an unused `Title` import left behind in Step 6.

- [ ] **Step 9: Commit**

```powershell
git add src/app/page-title.strategy.ts src/app/app-routing.module.ts "*.component.ts"
git commit -m @'
a11y: centralise page titles via TitleStrategy (WCAG 2.4.2)

Every route now declares a title identifying its step in the journey,
applied by PageTitleStrategy. Removed 34 per-component setTitle calls,
several of which announced the wrong page.

Titles mapped onto this branch's route table by path. Atomic by design -
revert this commit as a unit if QA objects.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

---

### Task 6: OTP labels, focus restoration, and skip link (WCAG 1.3.1, 2.4.1, 2.4.3, 3.3.2, 4.1.2)

The remaining behavioural accessibility work. These files carry substantive TypeScript additions — migrate **only** the accessibility logic and leave Prod-43 logic untouched.

**Files:**
- Create: `src/app/otp-aria-label.directive.ts`
- Modify: `src/app/app.module.ts` — import and declare the directive
- Modify: `src/app/app.component.ts` — focus restoration and `skipToMain`
- Modify: `src/app/app.component.html` — skip link markup
- Modify (selectively): `src/app/digilocker-screen/digilocker-screen.component.ts` (+35/−2), `src/app/home/home.component.ts` (+48/−6), `src/app/email-home-otp-screen/email-home-otp-screen.component.ts` (+9/−4), `src/app/mobile-home-otp-screen/mobile-home-otp-screen.component.ts` (+8/−3), `src/app/thankyou/thankyou.component.ts` (+8/−1)

**Interfaces:**
- Consumes: `.a11y-patches/05-directive.patch` from Task 1; the `id="main-content"` element guaranteed by Task 4.
- Produces: `OtpAriaLabelDirective` (selector `ng-otp-input`, non-standalone) declared in `AppModule`; `AppComponent.skipToMain(event: Event): void`.

- [ ] **Step 1: Create the OTP directive**

Create `src/app/otp-aria-label.directive.ts` with exactly:

```typescript
import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * The `ng-otp-input` library renders bare <input> elements with no accessible
 * name, which fails WCAG 1.3.1 / 3.3.2 / 4.1.2 ("Form elements must have labels").
 *
 * This directive matches every <ng-otp-input> element in the app and, after the
 * inputs are rendered, gives each one an aria-label ("OTP digit N of M") plus a
 * numeric inputmode. Applying it via the element selector means it is enforced
 * automatically across all OTP screens (mobile, email, yono, bp-sso, nominee...).
 */
@Directive({
  selector: 'ng-otp-input',
  standalone: false,
})
export class OtpAriaLabelDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Defer so the library has rendered its inputs into the DOM.
    setTimeout(() => this.applyLabels(), 0);
  }

  private applyLabels(): void {
    const inputs: NodeListOf<HTMLInputElement> =
      this.el.nativeElement.querySelectorAll('input.otp-input');
    inputs.forEach((input, index) => {
      if (!input.getAttribute('aria-label')) {
        this.renderer.setAttribute(
          input,
          'aria-label',
          `OTP digit ${index + 1} of ${inputs.length}`,
        );
      }
      this.renderer.setAttribute(input, 'inputmode', 'numeric');
    });
  }
}
```

Because the selector is the element name, this applies to every OTP screen automatically — no per-template change needed.

- [ ] **Step 2: Register the directive in AppModule**

In `src/app/app.module.ts`, add the import next to the existing `EmojiBlockerDirective` import:

```typescript
import { OtpAriaLabelDirective } from './otp-aria-label.directive';
```

And add `OtpAriaLabelDirective,` to the `declarations` array, next to `EmojiBlockerDirective,`.

- [ ] **Step 3: Add focus restoration and skip-to-main to AppComponent**

In `src/app/app.component.ts`, add the field, call the restorer from the end of `ngAfterViewInit`, and add both methods:

```typescript
  private modalTrigger: HTMLElement | null = null;
```

At the end of the existing `ngAfterViewInit()` body, after `requestAnimationFrame(raf);`:

```typescript
    this.restoreFocusAfterModalClose();
```

Then add these two methods to the class:

```typescript
  /**
   * WCAG 2.4.3 - the modals here are opened programmatically rather than via a
   * data-bs-toggle trigger, so Bootstrap has no element to hand focus back to
   * and it lands at the top of the page. Remember what was focused when the
   * dialog opened and return focus there once it closes.
   */
  private restoreFocusAfterModalClose() {
    const remember = () => {
      const active = document.activeElement;
      this.modalTrigger = active instanceof HTMLElement ? active : null;
    };

    const restore = () => {
      const trigger = this.modalTrigger;
      this.modalTrigger = null;
      if (trigger && document.body.contains(trigger)) {
        setTimeout(() => trigger.focus(), 0);
      }
    };

    document.addEventListener('show.bs.modal', remember);
    document.addEventListener('hidden.bs.modal', restore);

    // Some dialogs are still driven through the jQuery plugin, whose events do
    // not surface as native DOM events.
    const jq = (window as any).$;
    if (jq) {
      jq(document).on('show.bs.modal', remember);
      jq(document).on('hidden.bs.modal', restore);
    }
  }

  skipToMain(event: Event) {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      // Scroll main content into view for sighted keyboard users
      main.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }
```

Add nothing else to this file. Every other line belongs to Prod-43.

- [ ] **Step 4: Confirm the skip link markup and its target**

```powershell
Select-String -Path src\app\app.component.html -Pattern "skipToMain|main-content"
```

Task 4 should have added both. If the skip link is missing, add it as the first focusable element inside the app template:

```html
<a class="skip-link" href="#main-content" (click)="skipToMain($event)">Skip to main content</a>
```

If `id="main-content"` is missing, add it to the main content wrapper.

- [ ] **Step 5: Migrate the accessibility logic from the five remaining components**

For each of `digilocker-screen`, `home`, `email-home-otp-screen`, `mobile-home-otp-screen`, and `thankyou`, view the source's change and port only what is accessibility work:

```powershell
git diff d17f3c7 3619ebe -- src/app/digilocker-screen/digilocker-screen.component.ts
```

Repeat per file. Port additions that do focus management, ARIA live-region announcements, or screen-reader status text. **Do not port** anything that changes API calls, navigation, validation, or business state — those regions have Prod-43 changes and the source's version is stale.

If a source addition cannot be cleanly separated from stale business logic, skip it and record it for the Task 7 report rather than guessing.

- [ ] **Step 6: Verify the directive is wired**

```powershell
Select-String -Path src\app\app.module.ts -Pattern "OtpAriaLabelDirective"
```

Expected: two hits — the import and the declaration. One hit means the directive will not activate.

- [ ] **Step 7: Build**

```powershell
npm run build
```

Expected: exit 0.

- [ ] **Step 8: Commit**

```powershell
git add src/app/otp-aria-label.directive.ts src/app/app.module.ts src/app/app.component.ts src/app/app.component.html src/app/digilocker-screen src/app/home src/app/email-home-otp-screen src/app/mobile-home-otp-screen src/app/thankyou
git commit -m @'
a11y: OTP input labels, modal focus restoration, skip link

Adds OtpAriaLabelDirective, which names every ng-otp-input digit across
all OTP screens (WCAG 1.3.1/3.3.2/4.1.2). Restores focus to the trigger
element when a programmatically-opened modal closes (WCAG 2.4.3). Adds a
skip-to-main-content link (WCAG 2.4.1).

Only accessibility logic was ported from the source components; Prod-43
business logic in the same files is untouched.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```

---

### Task 7: Full-diff review, cleanup, and report

The verification gate. Nothing ships until the whole diff has been read.

**Files:**
- Delete: `.a11y-patches/`
- Create: `docs/superpowers/reports/2026-08-02-a11y-migration-report.md`

**Interfaces:**
- Consumes: the five commits from Tasks 2–6.
- Produces: the final report.

- [ ] **Step 1: Confirm all five commits landed**

```powershell
git log --oneline master..feature/a11y-migration
```

Expected: the spec-doc commit plus five `a11y:` commits.

- [ ] **Step 2: Review the complete diff hunk by hunk**

```powershell
git diff master..feature/a11y-migration --stat
git diff master..feature/a11y-migration
```

Read every hunk. For each, confirm it is traceable to a WCAG criterion, and that no Prod-43 business logic was deleted or reverted. Anything that fails either test gets fixed now, in a follow-up commit.

- [ ] **Step 3: Verify no Prod-43 code was lost**

```powershell
git diff master..feature/a11y-migration --numstat | ForEach-Object { $p = $_ -split "\t"; if ([int]$p[1] -gt [int]$p[0]) { "NET DELETION: $($p[2]) (+$($p[0]) -$($p[1]))" } }
```

Every file this prints deletes more than it adds. That is expected for the `setTitle` removals in Task 5 and the viewport script in Task 2. **Any other file on this list must be inspected** — it likely means a Prod-43 change was clobbered during conflict resolution.

- [ ] **Step 4: Confirm no conflict markers survive anywhere**

```powershell
Select-String -Path src -Include *.html,*.ts,*.css -Pattern "^<<<<<<<|^>>>>>>>|^=======" -Recurse
```

Expected: no output.

- [ ] **Step 5: Confirm the out-of-scope documents were not migrated**

```powershell
Test-Path ACCESSIBILITY_CHANGES_SUMMARY.txt; Get-ChildItem -Filter "*A11y Remediation Report*"
```

Expected: `False`, and no files listed.

- [ ] **Step 6: Final clean build**

```powershell
npm run build
```

Expected: exit 0.

- [ ] **Step 7: Remove the source remote and scratch patches**

```powershell
git remote remove a11y-src
Remove-Item -Recurse -Force .a11y-patches
git remote -v
```

Expected: no `a11y-src` remote listed. This keeps the target's history clean, as the spec requires.

- [ ] **Step 8: Write the migration report**

Create `docs/superpowers/reports/2026-08-02-a11y-migration-report.md` covering:

- **Migrated:** each of the five groups with its final file count and WCAG criteria.
- **Retargeted:** the viewport fix moved from `index.prod.html` / `index.uat.html` to `index.html`, and why.
- **Hand-reconciled:** every file where a conflict was resolved by re-implementing intent, with a one-line note on what changed versus the source.
- **Dropped:** every source hunk not migrated, with the reason (not WCAG-attributable, or inseparable from stale business logic per Task 6 Step 5).
- **Known gaps:** DigiLocker and NSDL/Protean eSign are vendor-owned; the home-screen hero banners have text baked into the image files and need a design re-export.
- **QA notes:** pinch-zoom is now enabled and may shift mobile layouts QA has not previously exercised; the page-title commit is revertible on its own; a manual NVDA/VoiceOver pass is still recommended.

- [ ] **Step 9: Commit the report**

```powershell
git add docs/superpowers/reports/2026-08-02-a11y-migration-report.md
git commit -m @'
docs: add accessibility migration report

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
'@
```
