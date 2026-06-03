# Graph Report - .  (2026-06-03)

## Corpus Check
- 65 files · ~101,044 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 517 nodes · 948 edges · 48 communities (28 shown, 20 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Geo & Core Math|Geo & Core Math]]
- [[_COMMUNITY_Design Rationale & Concepts|Design Rationale & Concepts]]
- [[_COMMUNITY_Controls Panel UI|Controls Panel UI]]
- [[_COMMUNITY_Package & Dependencies|Package & Dependencies]]
- [[_COMMUNITY_Design Research & Specs|Design Research & Specs]]
- [[_COMMUNITY_App Shell & Render Loop|App Shell & Render Loop]]
- [[_COMMUNITY_Screenshots & Flow Stages|Screenshots & Flow Stages]]
- [[_COMMUNITY_Canvas Rendering|Canvas Rendering]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Serialization|Serialization]]
- [[_COMMUNITY_GPX Parsing|GPX Parsing]]
- [[_COMMUNITY_State & Edit Config|State & Edit Config]]
- [[_COMMUNITY_Core Transform Pipeline|Core Transform Pipeline]]
- [[_COMMUNITY_Parse Helpers & Types|Parse Helpers & Types]]
- [[_COMMUNITY_Geo Distance & Home Detection|Geo Distance & Home Detection]]
- [[_COMMUNITY_Export Formats|Export Formats]]
- [[_COMMUNITY_Track Simplification|Track Simplification]]
- [[_COMMUNITY_Brand & Favicon|Brand & Favicon]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Privacy Zone Actions|Privacy Zone Actions]]
- [[_COMMUNITY_Bounds & Stats|Bounds & Stats]]
- [[_COMMUNITY_Workspace Layout & States|Workspace Layout & States]]
- [[_COMMUNITY_Claude Hooks Settings|Claude Hooks Settings]]
- [[_COMMUNITY_No-Network Guard|No-Network Guard]]
- [[_COMMUNITY_Simplify Feature|Simplify Feature]]
- [[_COMMUNITY_Security Posture|Security Posture]]
- [[_COMMUNITY_Vanilla TS Rationale|Vanilla TS Rationale]]
- [[_COMMUNITY_Stats Algorithm|Stats Algorithm]]
- [[_COMMUNITY_Metadata Strip & Fuzz|Metadata Strip & Fuzz]]
- [[_COMMUNITY_Decimals To Meters|Decimals To Meters]]
- [[_COMMUNITY_All Track Points|All Track Points]]
- [[_COMMUNITY_TypeScript Choice|TypeScript Choice]]
- [[_COMMUNITY_Vite Bundler|Vite Bundler]]
- [[_COMMUNITY_Tailwind Styling|Tailwind Styling]]
- [[_COMMUNITY_Playwright Testing|Playwright Testing]]
- [[_COMMUNITY_Linting & Formatting|Linting & Formatting]]
- [[_COMMUNITY_Dependency Licenses|Dependency Licenses]]
- [[_COMMUNITY_Trim Feature|Trim Feature]]
- [[_COMMUNITY_Merge Feature|Merge Feature]]
- [[_COMMUNITY_Export Feature|Export Feature]]
- [[_COMMUNITY_Package Identity|Package Identity]]
- [[_COMMUNITY_Graphify Hook|Graphify Hook]]

## God Nodes (most connected - your core abstractions)
1. `GpxDoc` - 26 edges
2. `TrackCanvas` - 25 edges
3. `Store` - 24 edges
4. `compilerOptions` - 19 edges
5. `applyEdits()` - 18 edges
6. `applyEdits` - 17 edges
7. `GeoPoint` - 16 edges
8. `mountApp (app shell)` - 15 edges
9. `ReportPanel` - 14 edges
10. `GPX Privacy Cleaner Design System (Canonical)` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Strict CSP (connect-src 'none')` --semantically_similar_to--> `Zero-network build guard (check-no-network)`  [INFERRED] [semantically similar]
  index.html → package.json
- `CHANGELOG` --semantically_similar_to--> `Polish Log`  [INFERRED] [semantically similar]
  CHANGELOG.md → POLISH_LOG.md
- `Own-canvas rendering rationale (no tiles = no network, no licensing)` --semantically_similar_to--> `Why GPX won (demonstrable, offline, unmet wedge)`  [INFERRED] [semantically similar]
  ARCHITECTURE.md → RESEARCH.md
- `Rationale: No upload/cloud language (strictly local tool)` --semantically_similar_to--> `Rationale: CSP connect-src none = files never leave browser`  [INFERRED] [semantically similar]
  design-system/MASTER.md → index.html
- `Polish Log` --references--> `ControlsPanel`  [EXTRACTED]
  POLISH_LOG.md → src/ui/panels/controls.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Zero-network privacy enforcement stack** — index_strict_csp, package_check_no_network_guard, concept_offline_guarantee [INFERRED 0.85]
- **Three-column workspace wiring** — app_mountApp, controls_ControlsPanel, report_ReportPanel, dropzone_Dropzone [EXTRACTED 1.00]
- **Cleaning controls feature set** — concept_privacy_zone, concept_strip_metadata, concept_coordinate_fuzz, concept_simplify [EXTRACTED 1.00]

## Communities (48 total, 20 thin omitted)

### Community 0 - "Geo & Core Math"
Cohesion: 0.07
Nodes (61): boundsOf(), decimalsToMeters(), haversineMeters(), mergeBounds(), pointDistanceM(), roundTo(), toLocalMeters(), combineDocs() (+53 more)

### Community 1 - "Design Rationale & Concepts"
Cohesion: 0.05
Nodes (47): Own-canvas rendering rationale (no tiles = no network, no licensing), HTML Canvas 2D local map rendering, Pure core module layer (src/core), Content-Security-Policy meta tag, EditConfig (declarative edit description), Declarative EditConfig rationale (preview/report/undo fall out free; testable), Equirectangular projection scaled to bbox, Home auto-detect clustering algorithm (+39 more)

### Community 2 - "Controls Panel UI"
Cohesion: 0.11
Nodes (23): ControlsPanel, section(), stripRow(), toggle(), Dropzone, DropzoneCallbacks, ReportPanel, app (+15 more)

### Community 3 - "Package & Dependencies"
Cohesion: 0.05
Nodes (39): author, description, devDependencies, autoprefixer, eslint, @fontsource/inter, @fontsource/jetbrains-mono, jsdom (+31 more)

### Community 4 - "Design Research & Specs"
Cohesion: 0.06
Nodes (39): CHANGELOG, 100% offline / zero-upload guarantee, Privacy zone, Research: Developer Tool / IDE color palette, Research: VPN & Privacy Tool color palette, UI Pro Max Design Research (style/color/typography/ux), Research: Dark Mode (OLED) style, Research: JetBrains Mono / Dashboard Data typography (+31 more)

### Community 5 - "App Shell & Render Loop"
Cohesion: 0.12
Nodes (30): handleFiles, handlePaste, handleSample, mountApp (app shell), render (state-driven render loop), TrackCanvas, Coordinate precision / fuzzing, Simplify (Douglas-Peucker) (+22 more)

### Community 6 - "Screenshots & Flow Stages"
Cohesion: 0.15
Nodes (23): Screenshot: Empty / Landing State, Screenshot: Workspace (track loaded), Screenshot: Privacy Zone enabled, Screenshot: Cleaned (4 actions applied), Screenshot: Simplify geometry result, Screenshot: Privacy Report panel detail, Screenshot: Mobile responsive layout, Screenshot: Live deployed app (+15 more)

### Community 7 - "Canvas Rendering"
Cohesion: 0.21
Nodes (3): PrivacyZone, allSegmentsPoints(), TrackCanvas

### Community 8 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+13 more)

### Community 9 - "Serialization"
Cohesion: 0.20
Nodes (17): byteLength(), escXml(), EXT_AFTER_SYM, EXT_BEFORE_NAME, fmtCoord(), pointHasExtensions(), serializePointChildren(), toCsv() (+9 more)

### Community 10 - "GPX Parsing"
Cohesion: 0.18
Nodes (18): allTrackPoints(), childrenByLocalName(), countPoints(), firstChildText(), parseFloatSafe(), parseGpx(), parseMetadata(), parsePoint() (+10 more)

### Community 11 - "State & Edit Config"
Cohesion: 0.22
Nodes (4): defaultEditConfig(), EditConfig, Units, Store

### Community 12 - "Core Transform Pipeline"
Cohesion: 0.14
Nodes (15): roundTo, main entrypoint (mountApp bootstrap), combineDocs, mergeTracks, countPoints, fuzzCoordinates, inventory, mapAllPoints (+7 more)

### Community 13 - "Parse Helpers & Types"
Cohesion: 0.32
Nodes (8): childrenByLocalName, firstChildText, parseGpx, parseMetadata, parsePoint, serializeExtensions, GeoPoint, GpxDoc

### Community 14 - "Geo Distance & Home Detection"
Cohesion: 0.29
Nodes (7): haversineMeters, pointDistanceM, collectEndpoints, detectHomeZone, segmentGapMeters, parseTime, statsForRun

### Community 15 - "Export Formats"
Cohesion: 0.43
Nodes (7): escXml, fmtCoord, pointHasExtensions, serializePointChildren, toCsv, toGeoJson, toGpx

### Community 16 - "Track Simplification"
Cohesion: 0.33
Nodes (7): toLocalMeters, perpDistance, simplifyDoc, simplifyPoints, simplifySegment, simplifyTrack, elevationGainLoss

### Community 17 - "Brand & Favicon"
Cohesion: 0.47
Nodes (6): GPX Privacy Cleaner Brand, Checkmark Symbol, GPX Privacy Cleaner Favicon, Privacy Protection, Shield Symbol, Verified / Cleaned Data

### Community 18 - "Prettier Config"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 19 - "Privacy Zone Actions"
Cohesion: 0.70
Nodes (5): applyPrivacyZone, cropEnds, cutAll, inZone, PrivacyZone

### Community 20 - "Bounds & Stats"
Cohesion: 0.50
Nodes (5): boundsOf, mergeBounds, computeStats, statsForSegments, docBounds

### Community 21 - "Workspace Layout & States"
Cohesion: 0.50
Nodes (4): Empty/loading/populated/error panel states, Three-region workspace layout (Controls/Canvas/Stats), axe-core 0 violations accessibility result, F11 App-wide UX (a11y, responsive, states)

## Ambiguous Edges - Review These
- `toGeoJson` → `fmtCoord`  [AMBIGUOUS]
  src/core/serialize.ts · relation: calls

## Knowledge Gaps
- **158 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `toGeoJson` and `fmtCoord`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **Why does `GpxDoc` connect `Geo & Core Math` to `Serialization`, `GPX Parsing`, `State & Edit Config`, `Canvas Rendering`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `TrackCanvas` connect `Canvas Rendering` to `Geo & Core Math`, `Controls Panel UI`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `Store` connect `State & Edit Config` to `Geo & Core Math`, `Controls Panel UI`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Geo & Core Math` be split into smaller, more focused modules?**
  _Cohesion score 0.06722689075630252 - nodes in this community are weakly interconnected._
- **Should `Design Rationale & Concepts` be split into smaller, more focused modules?**
  _Cohesion score 0.04625346901017576 - nodes in this community are weakly interconnected._