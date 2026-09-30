# Partio — Brand Identity, Visual Design Brief & Motion System

> **Document Version:** 1.0.0  
> **Brand Classification:** Institutional Confidential Financial Operations  
> **Core Tagline:** Allocate fairly. Pay privately. Prove everything.

---

## 1. Brand Philosophy & Positioning

Partio is **financial infrastructure**, not a speculative DeFi casino or a purple meme crypto app. Its visual identity communicates:
- **Discretion & Confidentiality:** Deep obsidian, graphite, and titanium tones create a grounded institutional foundation.
- **Precision & Mathematical Truth:** Crisp emerald green and muted mint accents highlight verified cryptographic invariants.
- **Modern Fluidity:** Subtle silk gradients with 60fps animations reflect active capital partition streams.

---

## 2. Color Palette & Design Tokens

```
Obsidian Night   #0b0f17  ████  Primary background canvas
Deep Graphite    #152130  ████  Elevated card and module backgrounds
Titanium Slate   #1c2a3d  ████  Interactive shard and input background
Luminous Emerald #10b981  ████  Verified invariants, primary action CTA
Muted Mint       #34d399  ████  Active value streams and secondary badges
Subdued Gold     #f59e0b  ████  Pending approvals and review warnings
Pure Slate       #f8fafc  ████  High-contrast header typography
Muted Slate      #94a3b8  ████  Financial metadata and hash labels
```

### Contrast & Accessibility Targets:
- **WCAG 2.1 Level AAA:** Text contrast ratios exceed $7:1$ for all body text on deep graphite cards.
- **Zero Background Grid Overlays:** High-DPI screens render silky, uncluttered titanium gradients without visual interference.

---

## 3. Typography & Financial Layouts

- **Headings & Brand Title:** `Inter / Plus Jakarta Sans` — bold, commanding, institutional.
- **Monospace Financial Data:** `JetBrains Mono` — used for pool amounts, contract IDs, and transaction nullifiers.
- **Tabular Alignment:** Numbers are right-aligned with fixed tabular figures (`tabular-nums`) to prevent layout shift during state changes.

---

## 4. 60fps Motion Principles & Interactive Shards

Partio employs subtle, purposeful motion via **Framer Motion**:
1. **The Vault Donut Shard:** Interactive SVG donut with interactive percentage shares and real-time secret witness toggling (`••••••••••` vs amount).
2. **Value Stream Animation:** Fluid emerald-to-mint gradient pulses moving across connection conduits to demonstrate rule evaluation.
3. **ZK Proof Pipeline:** Animated 4-stage pipeline visualizing witness loading, polynomial constraint checks, and on-chain nullifier anchoring.
4. **Instant Tab Transitions:** Smooth 280ms cross-fades between dashboard views.
