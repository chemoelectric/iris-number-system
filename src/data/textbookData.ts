import { TextbookChapter } from '../types';

export function generateFormalIndexChapter(chapters: TextbookChapter[]): TextbookChapter {
  interface FormalEntry {
    type: string;
    title: string;
    anchorId: string;
    chapterTitle: string;
    sectionTitle: string;
  }

  const entries: FormalEntry[] = [];

  chapters.filter((c) => c.id !== 'chap-index').forEach((chap) => {
    chap.sections.forEach((sec) => {
      const lines = sec.contentAsciiDoc.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\[(POSTULATE|THEOREM|DEFINITION|AXIOM|LEMMA|COROLLARY)\]$/i)) {
          const type = line.replace(/[\[\]]/g, '').toUpperCase();
          let anchorId = '';
          if (i > 0 && lines[i - 1].trim().match(/^\[#([a-zA-Z0-9_-]+)\]$/)) {
            anchorId = lines[i - 1].trim().match(/^\[#([a-zA-Z0-9_-]+)\]$/)![1];
          }
          let title = `${type}`;
          if (i + 1 < lines.length && lines[i + 1].trim().startsWith('.')) {
            title = lines[i + 1].trim().substring(1).trim();
          }
          if (!anchorId) {
            anchorId = `${type.toLowerCase()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          }
          entries.push({
            type,
            title,
            anchorId,
            chapterTitle: chap.title,
            sectionTitle: sec.title
          });
        }
      }
    });
  });

  const postulates = entries.filter((e) => e.type === 'POSTULATE');
  const theorems = entries.filter((e) => e.type === 'THEOREM');
  const definitions = entries.filter((e) => e.type === 'DEFINITION');
  const others = entries.filter((e) => !['POSTULATE', 'THEOREM', 'DEFINITION'].includes(e.type));

  let indexDoc = `== Index of Formal Statements\n\n`;
  indexDoc += `This index provides a canonical reference of all axiomatic Postulates, Theorems, and Definitions established across the Counting-Iris Treatise. Click any entry below to jump directly to its position in the textbook.\n\n`;

  if (postulates.length > 0) {
    indexDoc += `=== Postulates\n\n`;
    postulates.forEach((e) => {
      indexDoc += `* xref:${e.anchorId}[**${e.title}**]\n  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexDoc += `\n`;
  }

  if (theorems.length > 0) {
    indexDoc += `=== Theorems\n\n`;
    theorems.forEach((e) => {
      indexDoc += `* xref:${e.anchorId}[**${e.title}**]\n  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexDoc += `\n`;
  }

  if (definitions.length > 0) {
    indexDoc += `=== Definitions\n\n`;
    definitions.forEach((e) => {
      indexDoc += `* xref:${e.anchorId}[**${e.title}**]\n  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexDoc += `\n`;
  }

  if (others.length > 0) {
    indexDoc += `=== Axioms & Formal Statements\n\n`;
    others.forEach((e) => {
      indexDoc += `* xref:${e.anchorId}[**${e.title}**]\n  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexDoc += `\n`;
  }

  return {
    id: 'chap-index',
    title: 'Index of Formal Statements',
    summary: 'A canonical index of all Postulates, Theorems, Definitions, and Axioms established within the Counting-Iris Treatise.',
    sections: [
      {
        id: 'sec-index-formal',
        title: 'Index of Postulates, Theorems, and Definitions',
        contentAsciiDoc: indexDoc
      }
    ]
  };
}

export function getCompleteChapters(chapters: TextbookChapter[]): TextbookChapter[] {
  const baseChapters = chapters.filter((c) => c.id !== 'chap-index');
  const indexChap = generateFormalIndexChapter(baseChapters);
  return [...baseChapters, indexChap];
}

export const INITIAL_TEXTBOOK: {
  title: string;
  subtitle: string;
  author: string;
  description: string;
  chapters: TextbookChapter[];
} = {
  title: 'The Iris Number System',
  subtitle: 'An Unnumbered AsciiDoc / LatexMath Treatise on Unified Multi-Algebra',
  author: 'Frederic Custer',
  description: 'A formal axiomatic development of the Counting-Iris Number System unifying discrete arithmetic, Clifford Algebra Cl(4,1,1), Nonstandard Analysis (*R), Jaynesian Maximum Entropy, and tautological proofs in number theory.',
  chapters: getCompleteChapters([
    {
      id: 'chap-integers',
      title: 'The Integers',
      summary: 'Foundational definition of the discrete integer domain Z, its canonical scalar embedding into Clifford Algebra Cl(4,1,1), and the essential postulates governing the tautological structure.',
      sections: [
        {
          id: 'sec-integers-def',
          title: 'Definition of the Integers',
          contentAsciiDoc: `
== Definition of the Integers

The domain of **Integers**, denoted by \\(\\mathbb{Z}\\), forms the discrete algebraic backbone of the Counting-Iris Number System. In standard arithmetic, \\(\\mathbb{Z}\\) is defined as the set of equivalence classes of ordered pairs of natural numbers under the relation \\((a,b) \\sim (c,d) \\iff a+d = b+c\\).

Within the **Counting-Iris framework**, the integers are constructed as the minimal discrete subring generated by the multiplicative identity \\(\\mathbf{1}\\) and its additive inverse \\(-\\mathbf{1}\\) under successor iterations:

\\[
\\mathbb{Z} = \\{ \\dots, -3\\mathbf{1}, -2\\mathbf{1}, -\\mathbf{1}, \\mathbf{0}, \\mathbf{1}, 2\\mathbf{1}, 3\\mathbf{1}, \\dots \\}
\\]

In this framework, every integer \\(n \\in \\mathbb{Z}\\) acts both as a discrete scalar multiplicity and as a discrete projection operator upon the continuous spectrum of the Iris basis \\(\\{1, \\iota, \\varpi, \\vartheta\\}\\).

[NOTE]
====
In the Counting-Iris Number System, chapters and sections are un-numbered to emphasize conceptual cohesion and non-hierarchical tautological deduction over rigid ordinal indexing.
====
`
        },
        {
          id: 'sec-integers-postulates',
          title: 'Postulates of the Tautological Structure',
          contentAsciiDoc: `
== Postulates of the Tautological Structure

To establish the tautological engine of the Iris Number System starting strictly from the integers \\(\\mathbb{Z}\\), we postulate the following foundational axioms:

[#postulate-1]
[POSTULATE]
.Postulate 1: Successor Order and Discrete Ring Properties
====
The domain \\((\\mathbb{Z}, +, \\cdot, \\le)\\) is a totally ordered commutative ring with no zero divisors, generated by the discrete successor operator \\(S(n) = n + \\mathbf{1}\\). For every non-zero integer \\(n \\in \\mathbb{Z}\\setminus\\{0\\}\\), the absolute value \\(|n| \\ge 1\\) guarantees a discrete gap.
====

[#postulate-2]
[POSTULATE]
.Postulate 2: Canonical Scalar Embedding into Clifford Algebra Cl(4,1,1)
====
There exists a canonical ring monomorphism embedding the integers into the grade-0 scalar subalgebra of the 6-generator Clifford algebra \\(Cl(4,1,1)\\) with metric signature \\((++++,-,0)\\):

\\[
\\iota_0: \\mathbb{Z} \\hookrightarrow Cl(4,1,1), \\quad n \\mapsto n \\cdot \\mathbf{1}_{Cl}
\\]

where \\(\\mathbf{1}_{Cl}\\) is the Clifford unit scalar element satisfying \\(\\mathbf{1}_{Cl} e_A = e_A \\mathbf{1}_{Cl} = e_A\\) for all basis elements \\(e_A\\).
====

[#postulate-3]
[POSTULATE]
.Postulate 3: Metric Preservation of Quadratic Forms
====
For any discrete tuple \\((a,b) \\in \\mathbb{Z}^2\\), the Clifford metric norm over orthogonal basis generators \\(e_1, e_2\\) preserves exact integer quadratic forms:

\\[
\\|a e_1 + b e_2\\|^2 = (a e_1 + b e_2)(a e_1 + b e_2)^\dagger = a^2 + b^2 \\in \\mathbb{Z}_{\\ge 0}
\\]

This guarantees that diophantine norm equations in \\(\\mathbb{Z}\\) map directly into geometric invariants of \\(Cl(4,1,1)\\).
====

[#postulate-4]
[POSTULATE]
.Postulate 4: Bivector Parity Duality
====
Every integer \\(n \\in \\mathbb{Z}\\) possesses a canonical parity projection into the bivector subalgebra \\(e_{23}, e_{31}, e_{12}\\) (isomorphic to quaternions \\(\\mathbf{H}\\)). Even integers \\(n = 2k\\) yield zero bivector commutator residue, whereas odd integers \\(n = 2k+1\\) yield a unit parity residue \\(e_{23} \\wedge e_{31}\\).
====

[#postulate-5]
[POSTULATE]
.Postulate 5: Nonstandard Extension via Transfer
====
Under ultrafilter extension, the standard integers \\(\\mathbb{Z}\\) extend tautologically to the nonstandard integers \\({}^*\\mathbb{Z}\\) embedded in \\({}^*\\mathbb{R}\\). The extension introduces infinite nonstandard integers \\(\\omega \\in {}^*\\mathbb{Z} \\setminus \\mathbb{Z}\\) and exact infinitesimals \\(\\epsilon = 1/\\omega\\), satisfying the Transfer Principle:

\\[
\\forall n \\in \\mathbb{Z}, \\quad n < \\omega \\quad \\text{and} \\quad \\epsilon \\cdot \\omega = 1
\\]
====

[#postulate-6]
[POSTULATE]
.Postulate 6: Jaynesian Maximum Entropy Prior
====
Any probability measure \\(P(n)\\) assigned over discrete integer states \\(n \\in \\mathbb{Z}\\) under expectation constraint \\(\\langle A(n) \\rangle = a\\) maximizes the Shannon-Jaynes entropy:

\\[
S[P] = -\\sum_{n \\in \\mathbb{Z}} P(n) \\ln P(n)
\\]

yielding the canonical unbiased prior distribution \\(P(n) = \\frac{1}{Z} e^{-\\lambda A(n)}\\).
====
`
        },
        {
          id: 'sec-integers-clifford',
          title: 'Clifford Algebra Integration and Parity Algebra',
          contentAsciiDoc: `
== Clifford Algebra Integration and Parity Algebra

Through Postulate 2 and Postulate 4, integer arithmetic in \\(\\mathbb{Z}\\) is not merely isolated symbolic counting, but a projection of geometric operations in \\(Cl(4,1,1)\\).

Let \\(n, m \\in \\mathbb{Z}\\). Consider their representation as bivector-graded multivectors:

\\[
M(n) = n \\cdot \\mathbf{1}_{Cl} + \\frac{1 - (-1)^n}{2} e_{12}
\\]

When \\(n\\) is even, \\(M(n) = n \\mathbf{1}_{Cl}\\) is purely scalar. When \\(n\\) is odd, \\(M(n) = n \\mathbf{1}_{Cl} + e_{12}\\) acquires a unit bivector component whose square is \\(e_{12}^2 = -1\\).

[#theorem-parity-conservation]
[THEOREM]
.Theorem: Parity Conservation in Geometric Products
====
For any two integers \\(n, m \\in \\mathbb{Z}\\), the geometric product \\(M(n) M(m)\\) preserves the additive parity rule in \\(\\mathbb{Z}\\):

\\[
\\text{Grade}_2\\left( M(n) M(m) \\right) \\neq 0 \\iff n+m \\equiv 1 \\pmod 2
\\]
====

This algebraic duality provides the structural foundation for proving parity-based number theory conjectures (such as Goldbach's Partition Problem) without relying on heuristic approximations.
`
        }
      ]
    },
    {
      id: 'chap-rationals',
      title: 'The Iris and the Rational Numbers',
      summary: 'Construction of the rational field Q and its extension into the Iris domain via multiplicative quotients, Clifford fractional rotors, and star-finite partition grids in nonstandard analysis.',
      sections: [
        {
          id: 'sec-rationals-def',
          title: 'Definition of the Iris-Rational Domain',
          contentAsciiDoc: `
== Definition of the Iris-Rational Domain

The construction of the rational numbers \\(\\mathbb{Q}\\) proceeds from the discrete integers \\(\\mathbb{Z}\\) via the quotient field construction (localization with respect to \\(\\mathbb{Z} \\setminus \\{0\\}\\)). 

In the **Counting-Iris Number System**, a rational number \\(q = \\frac{a}{b} \\in \\mathbb{Q}\\) (with \\(a, b \\in \\mathbb{Z}, b \\neq 0, \\gcd(a,b) = 1\\)) is interpreted not merely as a fraction of integers, but as a discrete ratio operator that scales and rotates the fundamental Iris generator \\(\\iota\\).

We define the extended **Iris-Rational Domain** \\(\\mathbb{Q}(\\iota)\\) as the formal set of elements:

\\[
\\mathbb{Q}(\\iota) = \\left\\{ q_0 + q_1 \\iota \\;\\middle|\\; q_0, q_1 \\in \\mathbb{Q} \\right\\}
\\]

where the Iris generator \\(\\iota\\) satisfies the fundamental quadratic constraint:

\\[
\\iota^2 = -\\mathbf{1} + \\varpi \\vartheta
\\]

Here, \\(\\varpi\\) and \\(\\vartheta\\) represent the non-zero nilpotent-infinitesimal basis elements of the Iris spectrum.

[#definition-iris-ratio-operator]
[DEFINITION]
.Definition: Iris Ratio Operator
====
For any non-zero rational quotient \\(q = \\frac{a}{b}\\), the associated Iris ratio operator \\(\\hat{R}_q\\) acts on the Clifford scalar basis via fractional dilatation:

\\[
\\hat{R}_q \\left( n \\cdot \\mathbf{1}_{Cl} \\right) = \\frac{a n}{b} \\cdot \\mathbf{1}_{Cl} + \\sin\\left( \\pi \\frac{a}{b} \\right) e_{12}
\\]

where \\(e_{12}\\) is the primary bivector generator of \\(Cl(4,1,1)\\).
====
`
        },
        {
          id: 'sec-rationals-rotors',
          title: 'Geometric Fractional Rotors in Cl(4,1,1)',
          contentAsciiDoc: `
== Geometric Fractional Rotors in Cl(4,1,1)

Every rational ratio \\(q = \\frac{p}{q} \\in \\mathbb{Q}\\) induces a discrete fractional rotor \\(\\Omega_q \\in Cl(4,1,1)\\) through exponentiation of the bivector plane \\(e_{12}\\):

\\[
\\Omega_q = \\exp\\left( \\frac{\\pi}{2} \\frac{p}{q} e_{12} \\right) = \\cos\\left( \\frac{\\pi p}{2 q} \\right) \\mathbf{1}_{Cl} + \\sin\\left( \\frac{\\pi p}{2 q} \\right) e_{12}
\\]

[#postulate-rational-commutation]
[POSTULATE]
.Postulate: Rational Commutation and Cyclotomic Density
====
The family of fractional rotors \\(\\{\\Omega_q \\mid q \\in \\mathbb{Q}\\}\\) forms a dense abelian subgroup of the Spin(2) rotor group in \\(Cl(4,1,1)\\). For any rational phase \\(q = p/q\\), the rotor \\(\\Omega_q\\) is cyclotomic with finite order \\(2q\\):

\\[
(\\Omega_q)^{2q} = \\cos(\\pi p) \\mathbf{1}_{Cl} + \\sin(\\pi p) e_{12} = (-1)^p \\mathbf{1}_{Cl}
\\]
====

This cyclotomic density bridges the discrete lattice of integers \\(\\mathbb{Z}\\) with the continuous phase space required for spectral density analysis in the Iris Number System.
`
        },
        {
          id: 'sec-rationals-nonstandard',
          title: 'Nonstandard Rational Densities and Star-Finite Grids',
          contentAsciiDoc: `
== Nonstandard Rational Densities and Star-Finite Grids

Under nonstandard extension via ultraproducts, the rational field \\(\\mathbb{Q}\\) extends to the nonstandard rational field \\({}^*\\mathbb{Q}\\).

Let \\(\\omega \\in {}^*\\mathbb{N} \\setminus \\mathbb{N}\\) be an infinite nonstandard integer. We construct the **Star-Finite Rational Grid** \\(\\mathcal{G}_\\omega\\):

\\[
\\mathcal{G}_\\omega = \\left\\{ \\frac{k}{\\omega} \\;\\middle|\\; k \\in {}^*\\mathbb{Z}, \\, -\\omega^2 \\le k \\le \\omega^2 \\right\\}
\\]

[#theorem-standard-part-mapping]
[THEOREM]
.Theorem: Standard Part Mapping of Rational Grids
====
For every standard real number \\(x \\in \\mathbb{R}\\), there exists a nonstandard rational grid point \\(g \\in \\mathcal{G}_\\omega\\) such that \\(x = \\mathrm{st}(g)\\), where \\(\\mathrm{st}: {}^*\\mathbb{R} \\to \\mathbb{R}\\) is the standard part map. The error \\(\\delta = g - x\\) is an exact infinitesimal satisfying:

\\[
|g - x| \\le \\frac{1}{2\\omega} \\in {}^*\\mathbb{R}_{>0}
\\]
====

The star-finite rational grid \\(\\mathcal{G}_\\omega\\) provides an exact computational substrate where continuous real calculus is executed as star-finite discrete sum manipulations on rational fractions, ensuring that no rounding or truncation errors occur in tautological deductions.
`
        }
      ]
    }
  ])
};

export function generateFullAsciiDoc(textbook = INITIAL_TEXTBOOK): string {
  const chapters = getCompleteChapters(textbook.chapters);
  let adoc = `= ${textbook.title}\n`;
  adoc += `:author: ${textbook.author}\n`;
  adoc += `:doctype: book\n`;
  adoc += `:toc: left\n`;
  adoc += `:toc-title: Table of Contents\n`;
  adoc += `:stem: latexmath\n`;
  adoc += `:sectnums!:\n\n`; // Chapters and sections are not numbered, only named!
  adoc += `${textbook.description}\n\n`;

  chapters.forEach((chap) => {
    adoc += `= ${chap.title}\n\n`; // Un-numbered chapter name
    if (chap.summary) {
      adoc += `${chap.summary}\n\n`;
    }
    chap.sections.forEach((sec) => {
      adoc += `${sec.contentAsciiDoc.trim()}\n\n`;
    });
  });

  return adoc;
}
