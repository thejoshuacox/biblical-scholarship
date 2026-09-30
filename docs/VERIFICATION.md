# Verification record

Verified locally on 2026-09-29.

- Production build: TypeScript, content validation, and Vite build passed.
- Deterministic tests: 15 passing, covering normalization, formatting, caching, concurrent request deduplication, expiration, cross-chapter ranges, invalid references, unavailable verses, translation identity, malformed responses, timeouts, network failures, retry, absent parallels, source/model references, and translator-note rendering.
- Browser suite: 20 passing on desktop and an emulated iPhone viewport using Chromium/Edge. Includes route accessibility scans with axe, mobile navigation, keyboard skip links, 320-pixel reflow, live passage loading, view controls, and recovery from a simulated HTTP 503.
- Visual inspection: homepage and three-column comparison at desktop size; labeled, stacked passage groups at 390-pixel phone width.
- Live API: Matthew 8:23–27 (5 verses), Mark 4:35–41 (7), Luke 8:22–25 (4), and Mark 4:41–5:2 (3) passed against AO Lab's BSB endpoint.
- Dependency installation audit: zero known vulnerabilities after updating the test runner to 4.1.11.
- Academic sources: official Yale lecture transcripts and relevant sections inspected. Lecture 7's example is explicitly identified as a different sea episode.
- Render documentation checked; a Static Site configuration is prepared. No Render deployment was performed.

Accessibility scans and Chromium emulation are useful checks, not a claim of a full accessibility audit or testing on a physical iPhone. The public Bible API must be reachable to display passages. The build itself does not depend on API availability.

The source repository is private by default. The owner can connect it to Render and make the resulting website publicly accessible.
