# Iris Number System Deduction & Inference Engine

**Author:** Frédéric Blondel Custer

An interactive deduction framework, analytical workbench, and comprehensive textbook environment for the **Counting-Iris Number System (INS)** in number theory, Clifford algebra Cl(4,1,1), nonstandard analysis, Jaynesian Maximum Entropy probability, and constructive multivector analysis.

---

## 🏛️ Project Architecture & Overview

The **Iris Number System Deduction & Inference Engine** provides a constructive first-principles mathematical framework and software environment for formulating, evaluating, and proving mathematical propositions without relying on non-constructive set theory or ungrounded abstractions.

### Core Modules & Features

1. **Iris Textbook (AsciiDoc & LatexMath Renderer)**
   - Complete interactive rendered textbook sourced from `public/Iris_Number_System.adoc`.
   - Dynamic Table of Contents, section navigation, full-text search, and inline KaTeX equation rendering.
   - Automatically updated **Index of Formal Statements** indexing all Postulates, Theorems, Definitions, Axioms, and Lemmas.
   - Direct dynamic AsciiDoc file generation and download option (`/public/Iris_Number_System.adoc`).

2. **Search & Inference Engine Prover**
   - Server-side inference integration powered by Gemini 3.6 Flash.
   - Generates multi-step, rigorous Iris deductions from natural language or mathematical conjectures.
   - Restricts logical inferences to the Counting-Iris framework, Master Field Equation, and Cl(4,1,1) metric preservation.
   - Instant step-by-step verification and direct import into the active deduction workspace.

3. **Deduction Framework & Proof Builder**
   - Step-by-step formal proof builder with status flags (`valid`, `invalid`, `hypothetical`, `pending`).
   - Automated step integrity check and rule justification inspector.
   - High-contrast formatted display with one-click **LaTeX Export** and JSON workspace state export/import.

4. **Iris Calculator & Multivector Workbench**
   - Full implementation of the Cl(4,1,1) 6-generator Clifford algebra signature (+,+,+,+,-,0).
   - Embedded bivector quaternion algebra (i = e_23, j = e_31, k = e_12).
   - Discrete Spectrum Arithmetic (x + ε · residual + ω · scale) and Nonstandard Analysis Standard Part projection st(x).

5. **Zeta & Prime Spectrum Visualizer**
   - Interactive Recharts visualization of the Iris Zeta function ζ_I(s) along the critical line.
   - Numerical zero candidate search and phase spectrum density analysis.
   - Iris Prime Distribution spiral and residue distribution modeling.

6. **Theorem Library & Axiom Workbench**
   - Complete repository of formal axioms, postulates, definitions, and proven theorems.
   - Filterable by domain (*Tautological Discrete Arithmetic*, *Clifford Algebra Cl(4,1,1)*, *Jaynesian MaxEnt Probability*, *Spectral Topology*, etc.).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Environment Setup
Create a `.env` file or export your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation & Development
```bash
# Install dependencies
npm install

# Start the development server (runs express backend + Vite frontend on port 3000)
npm run dev
```

### Production Build
```bash
# Build Vite client and bundle server.ts with esbuild
npm run build

# Launch the production server
npm start
```

---

## 📜 Mathematical Foundations

The inference engine operates strictly within the Counting-Iris number system:
- **Basis Elements**: {1, ι, ϖ, ϑ} with ι² = τ - 1 where τ = (1+√5)/2.
- **Multiscale Resolution Analysis (MSRA)**: Multiscale resolution numbers (short name **m-res numbers**) x* ∈ ℝ* constructed as physical vernier aperture measurement quantities on hyper-refined grid G_ω.
- **Clifford Cl(4,1,1)**: 6 basis generators {e1, e2, e3, e4, e+, e-} satisfying e1²=e2²=e3²=1, e4²=0, e+²=1, e-²=-1.
- **Conformal Null Vectors**: e_∞ = e_+ + e_-, e_0 = 1/2(e_- - e_+).
- **Master Field Equation**: D F_total = J_total where D = ∇ + e4 (1/c) D_t.

---

## 🛠️ Project Structure
```
├── public/
│   └── Iris_Number_System.adoc   # Canonical AsciiDoc source textbook
├── src/
│   ├── components/               # React UI modules (Navbar, Textbook, Prover, Calculator, etc.)
│   ├── data/
│   │   └── textbookData.ts       # Structured JSON textbook parser & AsciiDoc generator
│   ├── lib/
│   │   └── irisEngine.ts         # Clifford Cl(4,1,1) multivector math & Iris arithmetic engine
│   ├── types.ts                  # Shared TypeScript interfaces and domain models
│   ├── App.tsx                   # Main React application shell
│   └── main.tsx                  # Application entry point
├── AGENTS.md                     # System directives and project rules
├── server.ts                     # Express server & Gemini inference endpoint proxy
├── package.json                  # Dependencies & execution scripts
└── README.md                     # Documentation (kept in sync)
```
