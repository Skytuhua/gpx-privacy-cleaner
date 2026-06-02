# Graph Report - .  (2026-06-02)

## Corpus Check
- 61 files · ~99,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 488 nodes · 908 edges · 39 communities (22 shown, 17 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.81)
- Token cost: 0 input · 254,142 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Geo & Privacy Core|Geo & Privacy Core]]
- [[_COMMUNITY_Architecture Rationale|Architecture Rationale]]
- [[_COMMUNITY_UI Control Panels|UI Control Panels]]
- [[_COMMUNITY_Package & Dependencies|Package & Dependencies]]
- [[_COMMUNITY_Core Pipeline Functions|Core Pipeline Functions]]
- [[_COMMUNITY_Design Research & Specs|Design Research & Specs]]
- [[_COMMUNITY_Canvas Map Rendering|Canvas Map Rendering]]
- [[_COMMUNITY_Screenshots & User Flow|Screenshots & User Flow]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Serialization (GPXCSVGeoJSON)|Serialization (GPX/CSV/GeoJSON)]]
- [[_COMMUNITY_GPX Parsing|GPX Parsing]]
- [[_COMMUNITY_App Bootstrap & Export Wiring|App Bootstrap & Export Wiring]]
- [[_COMMUNITY_App State Store & EditConfig|App State Store & EditConfig]]
- [[_COMMUNITY_ParseSerialize Helpers|Parse/Serialize Helpers]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Workspace Layout & A11y|Workspace Layout & A11y]]
- [[_COMMUNITY_No-Network Guard|No-Network Guard]]
- [[_COMMUNITY_Simplify (Douglas-Peucker)|Simplify (Douglas-Peucker)]]
- [[_COMMUNITY_Security Posture|Security Posture]]
- [[_COMMUNITY_No-Framework Rationale|No-Framework Rationale]]
- [[_COMMUNITY_Stats Computation|Stats Computation]]
- [[_COMMUNITY_Metadata Strip & Fuzzing|Metadata Strip & Fuzzing]]
- [[_COMMUNITY_decimalsToMeters|decimalsToMeters]]
- [[_COMMUNITY_allTrackPoints|allTrackPoints]]
- [[_COMMUNITY_TypeScript Choice|TypeScript Choice]]
- [[_COMMUNITY_Vite Bundler|Vite Bundler]]
- [[_COMMUNITY_Tailwind CSS|Tailwind CSS]]
- [[_COMMUNITY_Playwright E2E|Playwright E2E]]
- [[_COMMUNITY_ESLint + Prettier|ESLint + Prettier]]
- [[_COMMUNITY_Dependency Licenses|Dependency Licenses]]
- [[_COMMUNITY_F7 Trim|F7 Trim]]
- [[_COMMUNITY_F9 Merge|F9 Merge]]
- [[_COMMUNITY_F10 Export & Report|F10 Export & Report]]

## God Nodes (most connected - your core abstractions)
1. `GpxDoc` - 26 edges
2. `TrackCanvas` - 25 edges
3. `Store` - 24 edges
4. `compilerOptions` - 19 edges
5. `applyEdits()` - 18 edges
6. `applyEdits` - 17 edges
7. `GeoPoint` - 16 edges
8. `GPX Privacy Cleaner Design System (Canonical)` - 14 edges
9. `toGpx()` - 12 edges
10. `parseGpx()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Own-canvas rendering rationale (no tiles = no network, no licensing)` --semantically_similar_to--> `Why GPX won (demonstrable, offline, unmet wedge)`  [INFERRED] [semantically similar]
  ARCHITECTURE.md → RESEARCH.md
- `Rationale: CSP connect-src none = files never leave browser` --semantically_similar_to--> `Rationale: No upload/cloud language (strictly local tool)`  [INFERRED] [semantically similar]
  index.html → design-system/MASTER.md
- `applyEdits` --shares_data_with--> `GpxDoc`  [INFERRED]
  src/core/transform.ts → src/core/types.ts
- `Content-Security-Policy meta tag` --conceptually_related_to--> `Zero-network core principle`  [EXTRACTED]
  ARCHITECTURE.md → SPEC.md
- `Self-hosted Inter + JetBrains Mono (@fontsource)` --conceptually_related_to--> `Zero-network core principle`  [EXTRACTED]
  ARCHITECTURE.md → SPEC.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Declarative edit pipeline: combine, merge, trim, privacy, simplify, fuzz, strip** — transform_applyEdits, merge_combineDocs, merge_mergeTracks, privacy_applyPrivacyZone, simplify_simplifyDoc, privacy_fuzzCoordinates, privacy_stripMetadata [INFERRED 0.85]
- **Haversine distance shared across privacy, stats, and merge diagnostics** — geo_haversineMeters, privacy_detectHomeZone, privacy_inZone, stats_statsForRun [INFERRED 0.85]
- **GpxDoc immutable model shared by parse, transform, serialize, stats** — types_GpxDoc, parse_parseGpx, transform_applyEdits, serialize_toGpx, stats_computeStats [INFERRED 0.85]
- **Store-driven render pipeline** — state_Store, controls_ControlsPanel, report_ReportPanel [INFERRED 0.85]
- **Cleaned-track export flow** — report_ReportPanel, download_downloadText, download_copyText [INFERRED 0.85]
- **File ingest flow** — app_mountApp, fileLoader_loadFiles, dropzone_Dropzone [INFERRED 0.75]
- **Zero-network promise: principle, canvas rendering, self-hosted fonts, CSP, build guard** — spec_zero_network_principle, arch_canvas_visualization, arch_csp, review_check_no_network_guard [INFERRED 0.85]
- **Anti-doxxing flow: home auto-detect, privacy zone, metadata strip, privacy report** — arch_home_autodetect_algo, spec_f4_privacy_zone, spec_f5_metadata_strip, spec_f10_export_report [INFERRED 0.85]
- **Declarative transform: EditConfig drives pure transform pipeline producing result + report** — arch_editconfig, arch_transform_pipeline, spec_f10_export_report [INFERRED 0.85]
- **Core Design Foundations (pattern + color + typography)** — master_pattern_ops_console, master_color_tokens, master_typography_dashboard_data [INFERRED 0.85]
- **Page Specs Set (dropzone + export-review + workspace)** — dropzone_page_spec, export_review_page_spec, workspace_page_spec [INFERRED 0.85]
- **Privacy Guarantee (CSP + offline copy + trust signals)** — index_strict_csp, master_rationale_offline_copy, master_trust_signals [INFERRED 0.85]
- **End-to-end GPX privacy cleaning user flow** — stage_empty, stage_workspace, stage_privacy_zone, stage_cleaned, stage_simplify, stage_report [INFERRED 0.85]

## Communities (39 total, 17 thin omitted)

### Community 0 - "Geo & Privacy Core"
Cohesion: 0.07
Nodes (60): boundsOf(), decimalsToMeters(), haversineMeters(), mergeBounds(), pointDistanceM(), roundTo(), toLocalMeters(), combineDocs() (+52 more)

### Community 1 - "Architecture Rationale"
Cohesion: 0.05
Nodes (47): Own-canvas rendering rationale (no tiles = no network, no licensing), HTML Canvas 2D local map rendering, Pure core module layer (src/core), Content-Security-Policy meta tag, EditConfig (declarative edit description), Declarative EditConfig rationale (preview/report/undo fall out free; testable), Equirectangular projection scaled to bbox, Home auto-detect clustering algorithm (+39 more)

### Community 2 - "UI Control Panels"
Cohesion: 0.11
Nodes (23): ControlsPanel, section(), stripRow(), toggle(), Dropzone, DropzoneCallbacks, ReportPanel, app (+15 more)

### Community 3 - "Package & Dependencies"
Cohesion: 0.05
Nodes (39): author, description, devDependencies, autoprefixer, eslint, @fontsource/inter, @fontsource/jetbrains-mono, jsdom (+31 more)

### Community 4 - "Core Pipeline Functions"
Cohesion: 0.06
Nodes (39): boundsOf, haversineMeters, mergeBounds, pointDistanceM, roundTo, toLocalMeters, main entrypoint (mountApp bootstrap), combineDocs (+31 more)

### Community 5 - "Design Research & Specs"
Cohesion: 0.07
Nodes (34): Research: Developer Tool / IDE color palette, Research: VPN & Privacy Tool color palette, UI Pro Max Design Research (style/color/typography/ux), Research: Dark Mode (OLED) style, Research: JetBrains Mono / Dashboard Data typography, Research: UX loading-states / stacking / animation guidelines, Page Spec: Dropzone, Dropzone Pattern: Before-After Transformation (+26 more)

### Community 6 - "Canvas Map Rendering"
Cohesion: 0.20
Nodes (4): GpxDoc, PrivacyZone, allSegmentsPoints(), TrackCanvas

### Community 7 - "Screenshots & User Flow"
Cohesion: 0.15
Nodes (23): Screenshot: Empty / Landing State, Screenshot: Workspace (track loaded), Screenshot: Privacy Zone enabled, Screenshot: Cleaned (4 actions applied), Screenshot: Simplify geometry result, Screenshot: Privacy Report panel detail, Screenshot: Mobile responsive layout, Screenshot: Live deployed app (+15 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+13 more)

### Community 9 - "Serialization (GPX/CSV/GeoJSON)"
Cohesion: 0.20
Nodes (17): byteLength(), escXml(), EXT_AFTER_SYM, EXT_BEFORE_NAME, fmtCoord(), pointHasExtensions(), serializePointChildren(), toCsv() (+9 more)

### Community 10 - "GPX Parsing"
Cohesion: 0.18
Nodes (18): allTrackPoints(), childrenByLocalName(), countPoints(), firstChildText(), parseFloatSafe(), parseGpx(), parseMetadata(), parsePoint() (+10 more)

### Community 11 - "App Bootstrap & Export Wiring"
Cohesion: 0.22
Nodes (17): mountApp, TrackCanvas, ControlsPanel, copyText, downloadText, exportCsv, exportGeoJson, exportGpx (+9 more)

### Community 12 - "App State Store & EditConfig"
Cohesion: 0.22
Nodes (4): defaultEditConfig(), EditConfig, Units, Store

### Community 13 - "Parse/Serialize Helpers"
Cohesion: 0.18
Nodes (15): childrenByLocalName, firstChildText, parseGpx, parseMetadata, parsePoint, serializeExtensions, escXml, fmtCoord (+7 more)

### Community 14 - "Prettier Config"
Cohesion: 0.33
Nodes (5): printWidth, semi, singleQuote, tabWidth, trailingComma

### Community 15 - "Workspace Layout & A11y"
Cohesion: 0.50
Nodes (4): Empty/loading/populated/error panel states, Three-region workspace layout (Controls/Canvas/Stats), axe-core 0 violations accessibility result, F11 App-wide UX (a11y, responsive, states)

## Ambiguous Edges - Review These
- `toGeoJson` → `fmtCoord`  [AMBIGUOUS]
  src/core/serialize.ts · relation: calls

## Knowledge Gaps
- **154 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `printWidth`, `tabWidth` (+149 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `toGeoJson` and `fmtCoord`?**
  _Edge tagged AMBIGUOUS (relation: calls) - confidence is low._
- **Why does `GpxDoc` connect `Canvas Map Rendering` to `Geo & Privacy Core`, `Serialization (GPX/CSV/GeoJSON)`, `GPX Parsing`, `App State Store & EditConfig`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `TrackCanvas` connect `Canvas Map Rendering` to `Geo & Privacy Core`, `UI Control Panels`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `Store` connect `App State Store & EditConfig` to `Geo & Privacy Core`, `UI Control Panels`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Geo & Privacy Core` be split into smaller, more focused modules?**
  _Cohesion score 0.06654622101776574 - nodes in this community are weakly interconnected._
- **Should `Architecture Rationale` be split into smaller, more focused modules?**
  _Cohesion score 0.04625346901017576 - nodes in this community are weakly interconnected._