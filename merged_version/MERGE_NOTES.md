# Merged LingoLab — secondary UI restore (2026-03-26)

## Changes in `merged_version/lingolab-main`

### Home — “See the difference”
- **index.html:** `#translation` word-block panel (removed `#english-translation`); Explore nav → `pages/explore.html`.
- **js/script.js:** Secondary word-block `renderWords` + globe; merged auth (`create-account.html`, optional handlers, `#auth`).
- **js/explore.js:** Secondary `renderBreakdown` on shared `#sentence-select` / `#translation`; null-safe bindings.
- **css/styles.css:** Secondary `.word-blocks-grid` / `.word-block` rules.

### Explore
- **pages/explore.html:** Canonical secondary page; added `../js/site-header.js`.
- **explore.html (root):** Redirect to `pages/explore.html`.
- **css/explore.css:** Resolved merge conflict (kept incoming rebracketing refinement block).
- Root pages updated to link `pages/explore.html` where applicable (index, teacher-resources, post-create pages, etc.).

### Minigames
- Re-synced `pages/games/*.html` from secondary source tree.
- Fixed `../../js/site-header.js` on word-boundary, translation-gap, morphology.
- Resolved `morphology.html` head conflict (pages/games paths + site-header).

## Verification

| Check | Result |
|-------|--------|
| Merge conflict markers in merged tree | None (`<<<<<<<` grep clean) |
| `scripts/link_check.py` | Not present in workspace (skipped) |
| `pytest tests/` | Source tests missing (only `__pycache__`); exit 5 — skipped |

### Manual smoke (recommended)
1. Open `index.html` → pick sentence + language → word blocks appear.
2. Nav **Explore** → `pages/explore.html` styled correctly.
3. From Explore, open each game under `pages/games/`.
4. Root `explore.html` redirects to `pages/explore.html`.

## Source trees (read-only for this pass)
- Primary: `version4/version3/lingolab-main`
- Secondary: `another_pulled_in/lingolab-main`