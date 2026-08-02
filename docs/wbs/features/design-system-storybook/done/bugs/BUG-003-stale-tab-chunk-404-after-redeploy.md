# BUG-003: Every story fails to load in a tab left open across a redeploy

**Priority:** P1
**Status:** DONE
**Reported:** 2026-08-02
**Started:** 2026-08-02
**Completed:** 2026-08-02

## Description

On the deployed Storybook, navigating to any story shows:

> Failed to fetch dynamically imported module:
> `https://timesubmit-design-system.vercel.app/assets/ListCardInvoiceMobile.stories-CwSiebno.js`

Reported across atoms, molecules, organisms and pages, so it is not
component-specific. The story tree still renders and the story index is intact;
only the lazily-imported story chunk fails.

## Screenshot

User-supplied: `ListCardInvoiceMobile → List` showing the red "failed to render"
panel with a `TypeError: Failed to fetch dynamically imported module`.

## Root Cause

**Deployment version skew, not a broken build.**

Storybook's static build code-splits one chunk per story file and names it with
a content hash. Every build produces new hashes. A browser tab holds the shell
(`index.html`, `iframe.html`, the story index) from whichever deployment it
loaded, and only requests a story's chunk when you navigate to it. Once the
production alias moves to a newer deployment, the old hashed filenames no longer
exist and every subsequent lazy import 404s.

Four production deployments went out in quick succession while the reporter had
the tab open, which is why it looked like everything was broken at once.

Evidence:

| Check | Result |
|---|---|
| `GET /assets/ListCardInvoiceMobile.stories-CwSiebno.js` (the requested hash) | **404** |
| Same story chunk in the current build | `ListCardInvoiceMobile.stories-cP94VblL.js` — different hash |
| `index.json` on the live site | contains the story, so the index is fine |
| Fresh load of the same story URL in a clean tab | **renders correctly**, 34 nodes, real invoice rows, no error |

The last row is the decisive one: the deployment is healthy. Only clients that
started on an older deployment are affected.

## Feature / Task Reference

- **Feature:** design-system-storybook — `docs/wbs/features/design-system-storybook/feature.md`

Introduced by the Vercel setup, not by any component work.

## Proposed Fix

**Option A — Vercel Skew Protection.** Investigated and *not* used. Vercel only
applies it automatically to frameworks it supports; this is a plain static
build, so it needs the deployment ID threaded onto every asset URL at build
time (Vite `experimental.renderBuiltUrl` appending `?dpl=$VERCEL_DEPLOYMENT_ID`).
That is the better long-term answer because it avoids the reload entirely, but
it means owning asset-URL rewriting inside the Storybook Vite build. Not enabled
in the project settings either: on its own it would change nothing here and
would read as protection that is not actually in place.

**Option D — handle `vite:preloadError` (chosen).** Vite dispatches this event
precisely for "the chunk I want no longer exists on the server". Reloading the
preview document re-fetches `iframe.html`, picks up current chunk names, and the
story id stays in the URL so the user lands where they were going. Self
contained, no platform features, works on any host.

**Option B — do nothing, tell people to reload.** Rejected. It will recur on
every single deploy, the error text points at Storybook configuration rather
than at the real cause, and a design system is exactly the kind of site people
leave open all day.

**Option C — disable code splitting so there are no lazy chunks.** Rejected.
It would make the initial load carry all 257 entries.

## Files to Modify

- `.storybook/preview-head.html` — new, the recovery handler for the preview
- `.storybook/manager-head.html` — new, the same for the manager
- `NOTES.md` — cause, evidence and the reproduction method
- `src/docs/Conventions.mdx` — known limits

No component code changes: nothing in `src/components` was wrong.

## Acceptance Criteria

- [x] A chunk from a superseded deployment recovers instead of showing the error
- [x] Recovery does not loop when a chunk is genuinely missing
- [x] A fresh load of a story still renders normally
- [x] `npm test` still passes — 253 storybook, 5 unit

## Implementation Notes

### Reproduced properly, after two attempts that proved nothing

The first two attempts looked like passes and were worthless, which is the same
trap as the false-positive test in BUG-002:

1. `history.pushState` + `popstate` in the manager — the story rendered and no
   error appeared, but the preview iframe never changed story, so no lazy chunk
   was ever fetched. Nothing was under test.
2. `setCurrentStory` through the manager — the manager reloaded the iframe,
   which fetched a *fresh* document from the new build. Again no skew.

Both were caught by asserting the recovery marker rather than just "did it
render". `recoveredAt` was `null` both times, which is what exposed them.

The reproduction that works removes the manager entirely:

1. Build A, copy aside. Perturb `src/lib/cn.ts` so hashes shift, build B.
   `ListCardInvoiceMobile.stories-BfvQZAWq.js` → `...-B3aQz4dq.js`.
2. Serve build A, open `iframe.html?id=...` **directly** so nothing can reload it.
3. Swap the served directory to build B. The build-A chunk now 404s.
4. Inside that stale document, `__STORYBOOK_ADDONS_CHANNEL__.emit('setCurrentStory', …)`
   for a story from a file it has never imported.

Result: Vite fired `vite:preloadError`, the handler reloaded, and
`molecules-pagination--default` rendered from build B with the story id intact.
The recovery marker was set. That is the real failure and the real recovery, not
a synthetic event.

The anti-loop guard was checked separately: a second `vite:preloadError` 12.1s
after a recovery (inside the 15s cooldown) did **not** reload and left the
marker untouched. An earlier attempt at this "failed" at 20s — correctly, since
the cooldown had expired. Worth stating because it briefly looked like the guard
was broken.

### Process notes

Fixed inline rather than via a sub-agent: this session carries a standing
instruction not to dispatch agents unless asked, which overrides the workflow's
delegation default. Recording it rather than dropping it silently.

The "Bug or Missing Feature?" triage gate could not be run as written —
`docs/PRODUCT_SOURCE_OF_TRUTH.md` does not exist in this repo. This is
unambiguously a defect in shipped behaviour (a deployed site failing to serve a
file it advertises), not an unbuilt capability, so it proceeds as a bug.

## Agent Assignment

- **Agent:** none — fixed inline per the standing instruction above. The natural
  choice would have been `vercel:deployment-expert`.
- **Model:** n/a
- **Binding skills:** Vercel MCP (`search_vercel_documentation`, deployment and
  project tools) used for the current API rather than training data.
