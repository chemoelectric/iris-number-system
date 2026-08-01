import { TextbookChapter, Textbook } from "../types";

export function generateFormalIndexChapter(chapters: TextbookChapter[]): TextbookChapter {
  interface FormalEntry {
    type: string;
    title: string;
    anchorId: string;
    chapterTitle: string;
    sectionTitle: string;
  }

  const entries: FormalEntry[] = [];

  chapters.filter((c) => c.id !== "chap-index").forEach((chap) => {
    chap.sections.forEach((sec) => {
      const lines = sec.contentAsciiDoc.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(/^\[(POSTULATE|THEOREM|DEFINITION|AXIOM|LEMMA|COROLLARY)\]$/i)) {
          const type = line.replace(/[\[\]]/g, "").toUpperCase();
          let anchorId = "";
          if (i > 0 && lines[i - 1].trim().match(/^\[#([a-zA-Z0-9_-]+)\]$/)) {
            anchorId = lines[i - 1].trim().match(/^\[#([a-zA-Z0-9_-]+)\]$/)![1];
          }
          let title = `${type}`;
          if (i + 1 < lines.length && lines[i + 1].trim().startsWith(".")) {
            title = lines[i + 1].trim().substring(1).trim();
          }
          if (!anchorId) {
            anchorId = `${type.toLowerCase()}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          }
          entries.push({
            type,
            title,
            anchorId,
            chapterTitle: chap.title,
            sectionTitle: sec.title,
          });
        }
      }
    });
  });

  const postulates = entries.filter((e) => e.type === "POSTULATE");
  const theorems = entries.filter((e) => e.type === "THEOREM");
  const definitions = entries.filter((e) => e.type === "DEFINITION");
  const others = entries.filter((e) => !["POSTULATE", "THEOREM", "DEFINITION"].includes(e.type));

  let indexAdoc = "== Index of Formal Statements\n\n";
  indexAdoc += "This index lists all formal Postulates, Theorems, and Definitions established across the textbook.\n\n";

  if (postulates.length > 0) {
    indexAdoc += "=== Postulates\n\n";
    postulates.forEach((e) => {
      indexAdoc += `* xref:${e.anchorId}[**${e.title}**]  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexAdoc += "\n";
  }

  if (theorems.length > 0) {
    indexAdoc += "=== Theorems\n\n";
    theorems.forEach((e) => {
      indexAdoc += `* xref:${e.anchorId}[**${e.title}**]  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexAdoc += "\n";
  }

  if (definitions.length > 0) {
    indexAdoc += "=== Definitions\n\n";
    definitions.forEach((e) => {
      indexAdoc += `* xref:${e.anchorId}[**${e.title}**]  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexAdoc += "\n";
  }

  if (others.length > 0) {
    indexAdoc += "=== Other Formal Statements\n\n";
    others.forEach((e) => {
      indexAdoc += `* xref:${e.anchorId}[**${e.title}**]  -- Chapter: *${e.chapterTitle}* | Section: *${e.sectionTitle}*\n`;
    });
    indexAdoc += "\n";
  }

  return {
    id: "chap-index",
    title: "Index of Formal Statements",
    summary: "Index of all formal Postulates, Theorems, and Definitions in the Iris Number System.",
    sections: [
      {
        id: "sec-index-formal-statements",
        title: "Index of Formal Statements",
        contentAsciiDoc: indexAdoc,
      },
    ],
  };
}

export function getCompleteChapters(chapters: TextbookChapter[]): TextbookChapter[] {
  const baseChapters = chapters.filter((c) => c.id !== "chap-index");
  const indexChap = generateFormalIndexChapter(baseChapters);
  return [...baseChapters, indexChap];
}

export const INITIAL_TEXTBOOK: Textbook = {
  id: "textbook-iris-number-system",
  title: JSON.parse("\"The Iris Number System\""),
  subtitle: "Constructive Clifford Multivector Analysis",
  author: JSON.parse("\"Frédéric Blondel Custer\""),
  version: "2.1.0",
  lastUpdated: "2026-08-01",
  description: JSON.parse("\"A Rigorous Constructive Foundation for Mathematics and Physics\""),
  chapters: [
  {
    "id": "chap-the-iris-number-system",
    "title": "The Iris Number System",
    "summary": ":author: Frédéric Blondel Custer\n:doctype: book\n:toc: left\n:toc-title: Table of Contents\n:stem: latexmath\n:sectnums!:\n\nA formal axiomatic development of the Counting-Iris Number System unifying discrete arithmetic, Clifford Algebra Cl(4,1,1), Exact Discrete Rational Grids, Jaynesian Maximum Entropy, and tautological proofs in number theory.",
    "sections": [
      {
        "id": "chap-the-iris-number-system-sec-1",
        "title": "The Iris Number System",
        "contentAsciiDoc": ":author: Frédéric Blondel Custer\n:doctype: book\n:toc: left\n:toc-title: Table of Contents\n:stem: latexmath\n:sectnums!:\n\nA formal axiomatic development of the Counting-Iris Number System unifying discrete arithmetic, Clifford Algebra Cl(4,1,1), Exact Discrete Rational Grids, Jaynesian Maximum Entropy, and tautological proofs in number theory."
      }
    ]
  },
  {
    "id": "chap-the-counting-process-and-the-integers",
    "title": "The Counting Process and the Integers",
    "summary": "Foundational definition of the discrete integer domain Z and its canonical scalar embedding into Clifford Algebra Cl(4,1,1).",
    "sections": [
      {
        "id": "sec-definition-of-the-integers",
        "title": "Definition of the Integers",
        "contentAsciiDoc": "== Definition of the Integers\n\nThe domain of **Integers**, denoted by \\( \\mathbb { Z } \\), forms the discrete algebraic backbone of the Counting-Iris Number System.\n\nIn the Counting-Iris framework, **everything in the system is fundamentally an Operation of Measurement**. A number is not an inert static symbol, but the active scalar or multivector result of a discrete counting and gauging process.\n\nGrounding all integer quantities directly in physical discrete dot counts (\\( \\bullet \\)), each integer is defined as an explicit operation of measurement—a discrete sequence of dot steps radiating from the origin: positive integers measure in the forward direction (\\( \\bullet _ { \\to } \\)), while negative integers measure in the exact opposite (reverse) direction (\\( \\bullet _ { \\leftarrow } \\)).\n\n\n\\[\n\\mathbb { Z } = \\{ \\text{etc} , ( \\bullet\\bullet\\bullet ) _ { \\leftarrow } , ( \\bullet\\bullet ) _ { \\leftarrow } , \\bullet _ { \\leftarrow } , \\mathbf { 0 } , \\bullet _ { \\to } , ( \\bullet\\bullet ) _ { \\to } , ( \\bullet\\bullet\\bullet ) _ { \\to } , \\text{etc} \\}\n\\]\n\n\nUnder this directional measurement representation:\n\n* \\( \\mathbf { 0 } \\): The reference origin state (zero measured dots).\n* \\( \\bullet _ { \\to } \\): A single discrete measurement step in the forward direction (replacing the abstract '+1' symbol).\n* \\( ( \\bullet\\bullet ) _ { \\to } \\): Two discrete measurement steps in the forward direction.\n* \\( \\bullet _ { \\leftarrow } \\): A single discrete measurement step in the opposite direction (replacing the abstract '-1' symbol).\n* \\( ( \\bullet\\bullet ) _ { \\leftarrow } \\): Two discrete measurement steps in the opposite direction.\n* **etc** (*et cetera*): Explicitly utilized in place of standard mathematical ellipsis dots \\( ( \\dots ) \\) to represent countable infinity, reminding the reader that **etc** signifies *\"and indefinitely onwards in similar fashion\"*, denoting an active, open-ended operational process of step-by-step measurement carrying none of the conventional mathematical assumptions or completed-infinity abstractions found in set theory and classical real analysis.\n\nPositive integers represent measurement operations counting steps in the forward direction, while negative integers represent identical measurement steps in the opposite spatial/algebraic direction from the zero origin.\n\nIn this framework, every integer \\( n \\in \\mathbb { Z } \\) acts as an active **Operation of Measurement**—both as a directional tally of physical dots and as a discrete projection operator upon the spectrum of the Iris basis \\( \\{ \\bullet , \\iota , \\varpi , \\vartheta \\} \\).\n\n[NOTE]\n====\nIn the Counting-Iris Number System, chapters and sections are un-numbered to emphasize conceptual cohesion and non-hierarchical tautological deduction over rigid ordinal indexing.\n===="
      },
      {
        "id": "sec-clifford-algebra-integration-and-parity-algebra",
        "title": "Clifford Algebra Integration and Parity Algebra",
        "contentAsciiDoc": "== Clifford Algebra Integration and Parity Algebra\n\nThrough Postulate 2 and Postulate 4, integer arithmetic in \\( \\mathbb { Z } \\) is not merely isolated symbolic counting, but a projection of geometric operations in \\( Cl ( 4 , 1 , 1 ) \\).\n\nLet \\( n , m \\in \\mathbb { Z } \\). Consider their representation as bivector-graded multivectors:\n\n\n\\[\nM ( n ) = n \\cdot \\mathbf { 1 } _ { Cl } + \\frac { 1 - ( -1 ) ^ n } { 2 } e _ { 12 }\n\\]\n\n\nWhen \\( n \\) is even, \\( M ( n ) = n \\mathbf { 1 } _ { Cl } \\) is purely scalar. When \\( n \\) is odd, \\( M ( n ) = n \\mathbf { 1 } _ { Cl } + e _ { 12 } \\) acquires a unit bivector component whose square is \\( e _ { 12 } ^ 2 = -1 \\).\n\n[#theorem-parity-conservation]\n[THEOREM]\n.Theorem: Parity Conservation in Geometric Products\n====\nFor any two integers \\( n , m \\in \\mathbb { Z } \\), the geometric product \\( M ( n ) M ( m ) \\) preserves the additive parity rule in \\( \\mathbb { Z } \\):\n\n\n\\[\n\\text { Grade } _ 2\\left ( M ( n ) M ( m ) \\right ) \\neq 0 \\iff n + m \\equiv 1 \\pmod 2\n\\]\n\n====\n\nThis algebraic duality provides the structural foundation for proving parity-based number theory conjectures (such as Goldbach's Partition Problem) without relying on heuristic approximations."
      }
    ]
  },
  {
    "id": "chap-the-iris",
    "title": "The Iris",
    "summary": "Conceptual introduction to the Iris optical-geometric analogy, variable aperture flux gating, Spin(2) bivector rotation planes, and the nilpotent perimeter boundary.",
    "sections": [
      {
        "id": "sec-introduction-to-the-iris-analogy",
        "title": "Introduction to the Iris Analogy",
        "contentAsciiDoc": "== Introduction to the Iris Analogy\n\nThe Counting-Iris Number System takes its name and primary geometric conceptual framework from the optical **iris diaphragm**—a mechanical aperture composed of overlapping curved blades that expand and contract radially while rotating in phase space.\n\nIn physical optics and geometric field theory, an iris diaphragm does not merely truncate light; it dynamically regulates total flux, boundary curvature, and phase distribution across a finite aperture.\n\nIn our mathematical unification, the **Iris** serves as a dynamic algebraic aperture bridging the discrete integers \\( \\mathbb { Z } \\) with finite multivector space \\( Cl ( 4 , 1 , 1 ) \\).\n\nThe primary physical and mathematical components of the Iris analogy are:\n\n* **Central Aperture Opening (\\( \\iota \\))**: Represents the active field generator \\( \\iota \\), whose aperture area corresponds to the scaling flux of discrete integer counts.\n* **Overlapping Aperture Blades**: Execute Spin(2) bivector plane rotations \\( e _ { 12 } \\) in \\( Cl ( 4 , 1 , 1 ) \\), imparting phase orientation and parity residue.\n* **Nilpotent Perimeter Boundary (\\( \\varpi \\vartheta \\))**: The microscopic perimeter contact boundary of the blades acts as a nilpotent boundary constraint satisfying \\( \\varpi ^ 2 = 0 , \\vartheta ^ 2 = 0 \\), preventing singular boundary collapse while enforcing exact local contact.\n* **Variable Aperture Scaling**: Radial expansion and contraction \\( r \\) controls scaling dilatation, bridging discrete count states with smooth macro-level field density.\n\n[IRIS_VISUALIZATION]\n\nAs illustrated in the dynamic model above, adjusting the aperture opening magnitude \\( r \\) and phase angle \\( \\theta \\) directly updates the multivector operator state:\n\n\n\\[\n\\iota ( r , \\theta ) = r \\left ( \\cos\\theta \\cdot \\mathbf { 1 } _ { Cl } + \\sin\\theta \\cdot e _ { 12 } \\right ) + \\sqrt { 1-r ^ 2 } \\cdot \\varpi \\vartheta\n\\]\n\n\nmaintaining the exact quadratic aperture constraint \\( \\iota ^ 2 = -\\mathbf { 1 } + \\varpi \\vartheta \\)."
      }
    ]
  },
  {
    "id": "chap-initial-postulates-of-the-tautological-structure",
    "title": "Initial Postulates of the Tautological Structure",
    "summary": "Essential postulates governing the tautological structure of the Counting-Iris Number System.",
    "sections": [
      {
        "id": "sec-initial-postulates-of-the-tautological-structure",
        "title": "Initial Postulates of the Tautological Structure",
        "contentAsciiDoc": "== Initial Postulates of the Tautological Structure\n\n[NOTE]\n====\nThese axioms are designated as **\"Initial Postulates\"** because, once the tautological structure of the Counting-Iris system is complete, any sufficient set of facts within the system can form a postulate set. Such a tautological axiomatic system is guaranteed to be free of contradictions and paradoxes and therefore is unusually reliable.\n====\n\nTo establish the tautological engine of the Iris Number System starting strictly from the integers \\( \\mathbb { Z } \\), we postulate the following foundational axioms:\n\n[#postulate-0]\n[POSTULATE]\n.Postulate 0: Primordial Principle of Measurement\n====\n**Everything in the system is an Operation of Measurement.**\n\nEvery entity, integer count, operator, multivector element, and topological halo boundary interaction in the Counting-Iris Number System is explicitly defined as an active physical or algebraic operation of measurement. Mathematical quantities do not exist as passive static values, but as the exact scalar or multivector outcome of a discrete gauging process executed upon a physical or geometric domain.\n====\n\n[#postulate-1]\n[POSTULATE]\n.Postulate 1: Successor Order and Discrete Ring Properties\n====\nThe domain \\( ( \\mathbb { Z } , + , \\cdot , \\le ) \\) is a totally ordered commutative ring with no zero divisors, generated by the discrete successor operator \\( S ( n ) = n + \\mathbf { 1 } \\). For every non-zero integer \\( n \\in \\mathbb { Z } \\setminus\\{0\\} \\), the absolute value \\( |n| \\ge 1 \\) guarantees a discrete gap.\n====\n\n[#postulate-2]\n[POSTULATE]\n.Postulate 2: Canonical Scalar Embedding into Clifford Algebra Cl(4,1,1)\n====\nThere exists a canonical ring monomorphism embedding the integers into the grade-0 scalar subalgebra of the 6-generator Clifford algebra \\( Cl ( 4 , 1 , 1 ) \\) with metric signature \\( ( + + + + , - , 0 ) \\):\n\n\n\\[\n\\iota _ 0: \\mathbb { Z } \\hookrightarrow Cl ( 4 , 1 , 1 ) , \\quad n \\mapsto n \\cdot \\mathbf { 1 } _ { Cl }\n\\]\n\n\nwhere \\( \\mathbf { 1 } _ { Cl } \\) is the Clifford unit scalar element satisfying \\( \\mathbf { 1 } _ { Cl } e _ A = e _ A \\mathbf { 1 } _ { Cl } = e _ A \\) for all basis elements \\( e _ A \\).\n====\n\n[#postulate-3]\n[POSTULATE]\n.Postulate 3: Metric Preservation of Quadratic Forms\n====\nFor any discrete tuple \\( ( a , b ) \\in \\mathbb { Z } ^ 2 \\), the Clifford metric norm over orthogonal basis generators \\( e _ 1 , e _ 2 \\) preserves exact integer quadratic forms:\n\n\n\\[\n\\|a e _ 1 + b e _ 2\\| ^ 2 = ( a e _ 1 + b e _ 2 ) ( a e _ 1 + b e _ 2 ) ^ \\dagger = a ^ 2 + b ^ 2 \\in \\mathbb { Z } _ { \\ge 0 }\n\\]\n\n\nThis guarantees that diophantine norm equations in \\( \\mathbb { Z } \\) map directly into geometric invariants of \\( Cl ( 4 , 1 , 1 ) \\).\n====\n\n[#postulate-4]\n[POSTULATE]\n.Postulate 4: Bivector Parity Duality\n====\nEvery integer \\( n \\in \\mathbb { Z } \\) possesses a canonical parity projection into the bivector subalgebra \\( e _ { 23 } , e _ { 31 } , e _ { 12 } \\) (isomorphic to quaternions \\( \\mathbf { H } \\)). Even integers \\( n = 2k \\) yield zero bivector commutator residue, whereas odd integers \\( n = 2k + 1 \\) yield a unit parity residue \\( e _ { 23 } \\wedge e _ { 31 } \\).\n====\n\n[#postulate-5]\n[POSTULATE]\n.Postulate 5: Discrete Scale Extension and Exact Rational Partition Grids\n====\nEvery discrete integer domain \\( \\mathbb { Z } \\) induces an exact star-finite rational partition grid \\( \\mathcal { G } _ N = \\{ k/N \\mid k \\in \\mathbb { Z } , |k| \\le N ^ 2 \\} \\) for any discrete resolution count \\( N \\in \\mathbb { Z } _ { \\gt 0 } \\). The exact unit step size \\( \\delta = 1/N \\) satisfies exact integer-scaled reciprocity: \\( \\delta \\cdot N = \\mathbf { 1 } \\), ensuring all operations reduce strictly to finite discrete rational arithmetic.\n====\n\n[#postulate-6]\n[POSTULATE]\n.Postulate 6: Jaynesian Maximum Entropy Prior\n====\nAny probability measure \\( P ( n ) \\) assigned over discrete integer states \\( n \\in \\mathbb { Z } \\) under expectation constraint \\( \\langle A ( n ) \\rangle = a \\) maximizes the Shannon-Jaynes entropy:\n\n\n\\[\nS[P] = -\\sum _ { n \\in \\mathbb { Z } } P ( n ) \\ln P ( n )\n\\]\n\n\nyielding the canonical unbiased prior distribution \\( P ( n ) = \\frac { 1 } { Z } e ^ { -\\lambda A ( n ) } \\).\n====\n\n[#postulate-7]\n[POSTULATE]\n.Postulate 7: Strict Discrete Countability Boundary\n====\nAll domain extensions, rational partition grids, and spectral operator spaces in the Iris Number System are strictly recursively enumerable discrete sets, ensuring absolute algorithmic constructibility and numerical reliability for engineering applications.\n====\n\n[#postulate-8]\n[POSTULATE]\n.Postulate 8: Action by Direct Contact via Topological Halos\n====\nAll mathematical operations, operator field evolutions, and physical interactions in the Iris Number System are strictly governed by action by direct contact defined topologically via **Halos**. \n\nFor every element or operator \\( x \\in \\mathcal { D } _ { \\text { Iris } } \\), its **Topological Halo** \\( \\mathcal { H } ( x ) \\) is defined as its local contiguous metric neighborhood and nilpotent perimeter boundary:\n\n\n\\[\n\\mathcal { H } ( x ) = \\left\\{ y \\in \\mathcal { D } _ { \\text { Iris } } \\; \\middle| \\; d _ { Cl } ( x , y ) \\le \\epsilon _ { \\text { local } } \\text { or } ( x - y ) ^ 2 \\in \\text { span } ( \\varpi , \\vartheta ) \\right\\}\n\\]\n\n\nPhysical and mathematical interactions between entities \\( A \\) and \\( B \\) occur if and only if their topological halos intersect:\n\n\n\\[\n\\text { Interaction } ( A , B ) \\neq 0 \\iff \\mathcal { H } ( A ) \\cap \\mathcal { H } ( B ) \\neq \\emptyset\n\\]\n\n\nSpectral density transfers and force couplings execute strictly through contiguous boundary contact across overlapping halos, forbidding non-local action at a distance.\n====\n\n[#postulate-iris-generator]\n[POSTULATE]\n.Postulate 9: Formal Definition of the Iris Generator (\\iota)\n====\nThe fundamental Iris generator \\( \\iota \\) is defined as a multivector operator in Clifford Algebra \\( Cl ( 4 , 1 , 1 ) \\) acting as an algebraic aperture whose quadratic constraint satisfies:\n\n\n\\[\n\\iota ^ 2 = -\\mathbf { 1 } + \\varpi \\vartheta\n\\]\n\n\nwhere \\( \\varpi \\) and \\( \\vartheta \\) are orthogonal nilpotent basis generators (\\( \\varpi ^ 2 = 0 , \\vartheta ^ 2 = 0 \\)) constituting the nilpotent perimeter boundary of the aperture, and \\( \\mathbf { 1 } \\) is the Clifford scalar unit identity.\n===="
      }
    ]
  },
  {
    "id": "chap-the-rational-numbers",
    "title": "The Rational Numbers",
    "summary": "Constructing the rational numbers Q using the Iris optical-geometric aperture analogy as fractional opening ratios of discrete measurement operations, sectorial blade partitions, and scale-invariant flux gating without non-denumerable continua.",
    "sections": [
      {
        "id": "sec-iris-aperture-ratios-and-fractional-measurement-operations",
        "title": "Iris Aperture Ratios and Fractional Measurement Operations",
        "contentAsciiDoc": "== Iris Aperture Ratios and Fractional Measurement Operations\n\nFollowing the formal definition of the Iris generator in Postulate 9 and the Primordial Principle of Measurement (Postulate 0), the domain of **Rational Numbers**, denoted by \\( \\mathbb { Q } \\), is constructed directly using the **Iris Optical-Geometric Aperture Analogy**.\n\nRather than abstract static fractions, a rational number represents the relative opening ratio or flux throughput fraction of an Iris aperture diaphragm:\n\n\n\\[\n\\mathbb { Q } = \\left\\{ \\frac { p } { q _ { \\text { den } } } \\; \\middle| \\; p , q _ { \\text { den } } \\in \\mathbb { Z } , q _ { \\text { den } } \\neq \\mathbf { 0 } \\right\\}\n\\]\n\n\nIn this optical-geometric model, the fully open reference Iris aperture corresponds to the unit scalar identity \\( \\mathbf { 1 } _ { Cl } \\) (or primary unit counting step \\( \\bullet \\)). An Iris aperture is divided sectorially by \\( q _ { \\text { den } } \\in \\mathbb { Z } _ { \\gt 0 } \\) overlapping aperture blades or grid steps. Selecting \\( p \\in \\mathbb { Z } \\) blade counting steps yields the fractional Iris aperture opening ratio:\n\n[#definition-rational-aperture-ratio]\n[DEFINITION]\n.Definition: Iris Aperture Rational Ratio\n====\nA rational number \\( r = \\frac { p } { q _ { \\text { den } } } \\) is an active Iris aperture measurement operator that partitions the primary unit aperture flux \\( \\bullet \\) into \\( q _ { \\text { den } } \\) equal radial blade sub-intervals, and iterates that sub-step \\( p \\) times along the directional measurement axis:\n\n\n\\[\nr = \\frac { p } { q _ { \\text { den } } } \\equiv \\text { ApertureFlux } _ { q _ { \\text { den } } } \\left ( p \\cdot \\bullet _ { \\to/\\leftarrow } \\right )\n\\]\n\n====\n\nUnder this directional Iris aperture measurement representation:\n\n* \\( \\frac { \\bullet _ { \\to } } { ( \\bullet\\bullet ) _ { \\to } } \\): A half-open Iris aperture step in the forward direction (\\( r = 1/2 \\)).\n* \\( \\frac { ( \\bullet\\bullet\\bullet ) _ { \\leftarrow } } { ( \\bullet\\bullet ) _ { \\to } } \\): A three-halves Iris aperture opening in the reverse direction (\\( r = -3/2 \\)).\n* \\( \\frac { \\mathbf { 0 } } { q _ { \\text { den } } } \\): A completely closed Iris aperture state (\\( r = 0 \\))."
      },
      {
        "id": "sec-discrete-partition-grids-as-iris-aperture-grid-resolutions",
        "title": "Discrete Partition Grids as Iris Aperture Grid Resolutions",
        "contentAsciiDoc": "=== Discrete Partition Grids as Iris Aperture Grid Resolutions\nAs established in Postulate 5, every discrete resolution count \\( N \\in \\mathbb { Z } _ { \\gt 0 } \\) corresponds to an \\( N \\)-blade Iris aperture resolution level, inducing an exact, star-finite rational partition grid:\n\n\n\\[\n\\mathcal { G } _ N = \\left\\{ \\frac { k } { N } \\; \\middle| \\; k \\in \\mathbb { Z } , |k| \\le N ^ 2 \\right\\}\n\\]\n\n\nThe elementary grid resolution step size \\( \\delta = \\frac { \\bullet } { N } \\) represents a single blade's aperture sector, satisfying exact integer reciprocity \\( \\delta \\cdot N = \\bullet \\), guaranteeing that all measurement quantities in \\( \\mathcal { G } _ N \\) are exact, constructible discrete states free of truncation errors, rounding noise, or reliance on unconstructive non-denumerable continua."
      },
      {
        "id": "sec-rational-arithmetic-as-iris-aperture-composition-and-scale-refinement",
        "title": "Rational Arithmetic as Iris Aperture Composition and Scale Refinement",
        "contentAsciiDoc": "== Rational Arithmetic as Iris Aperture Composition and Scale Refinement\n\nArithmetic operations over rational numbers \\( \\mathbb { Q } \\) are physical and algebraic operations of Iris aperture composition, blade alignment, and scale refinement."
      },
      {
        "id": "sec-addition-as-iris-blade-alignment",
        "title": "Addition as Iris Blade Alignment",
        "contentAsciiDoc": "=== Addition as Iris Blade Alignment\nAdding two rational aperture ratios \\( \\frac { a } { b } \\) and \\( \\frac { c } { d } \\) aligns their respective blade subdivisions to a common resolution count \\( b \\cdot d \\) across the Iris aperture perimeter:\n\n\n\\[\n\\frac { a } { b } + \\frac { c } { d } = \\frac { ( a \\cdot d ) _ { \\to/\\leftarrow } + ( b \\cdot c ) _ { \\to/\\leftarrow } } { ( b \\cdot d ) _ { \\to } }\n\\]\n\n\nThis process aligns discrete aperture measurement steps onto a single common partition grid without altering the total measured flux distance from the reference origin."
      },
      {
        "id": "sec-multiplication-as-composite-aperture-gating",
        "title": "Multiplication as Composite Aperture Gating",
        "contentAsciiDoc": "=== Multiplication as Composite Aperture Gating\nMultiplication \\( \\frac { a } { b } \\cdot \\frac { c } { d } = \\frac { a \\cdot c } { b \\cdot d } \\) represents the sequential composition of two Iris aperture flux gating operations: first partitioning the aperture light flux by \\( b \\cdot d \\) sub-steps, and then iterating by \\( a \\cdot c \\) blade steps.\n\n[#theorem-rational-reciprocity]\n[THEOREM]\n.Theorem: Scale-Invariant Rational Reciprocity\n====\nFor every non-zero rational aperture ratio \\( r = \\frac { p } { q _ { \\text { den } } } \\in \\mathbb { Q } \\setminus \\{\\mathbf { 0 } \\} \\), there exists an exact multiplicative inverse aperture gating \\( r ^ { -1 } = \\frac { q _ { \\text { den } } } { p } \\) such that:\n\n\n\\[\nr \\cdot r ^ { -1 } = \\frac { p \\cdot q _ { \\text { den } } } { q _ { \\text { den } } \\cdot p } = \\frac { \\bullet } { \\bullet } = \\mathbf { 1 }\n\\]\n\n\nThe composite operation of scaling the Iris aperture down by \\( q _ { \\text { den } } \\) and scaling up by \\( p \\), followed by its inverse, exactly restores the primary unit aperture flux state \\( \\bullet \\).\n===="
      },
      {
        "id": "sec-modulation-of-the-iris-multivector-generator-iota-",
        "title": "Modulation of the Iris Multivector Generator \\( \\iota \\)",
        "contentAsciiDoc": "=== Modulation of the Iris Multivector Generator \\( \\iota \\)\nRational aperture scale factors \\( r = p/q \\) directly modulate the Iris field operator defined in Postulate 9:\n\n\n\\[\n\\iota ( r , \\theta ) = r \\left ( \\cos\\theta \\cdot \\mathbf { 1 } _ { Cl } + \\sin\\theta \\cdot e _ { 12 } \\right ) + \\sqrt { 1-r ^ 2 } \\cdot \\varpi \\vartheta\n\\]\n\n\nVarying the rational aperture ratio \\( r \\) adjusts the central flux transmission while maintaining the quadratic perimeter boundary constraint \\( \\iota ^ 2 = -\\mathbf { 1 } + \\varpi \\vartheta \\)."
      }
    ]
  },
  {
    "id": "chap-the-real-numbers",
    "title": "The Real Numbers",
    "summary": "Constructing the real numbers R through constructive Iris aperture refinements and convergent Cauchy sequences of rational partition grid measurements, establishing dense flux parameters and transcendental bivector rotations without unconstructive non-denumerable infinities.",
    "sections": [
      {
        "id": "sec-constructive-iris-aperture-limits-and-rational-grid-refinement",
        "title": "Constructive Iris Aperture Limits and Rational Grid Refinement",
        "contentAsciiDoc": "== Constructive Iris Aperture Limits and Rational Grid Refinement\n\nIn the Counting-Iris framework, **The Real Numbers**, denoted by \\( \\mathbb { R } \\), are constructed directly from the Iris optical-geometric aperture model as constructive limits of discrete rational grid measurement operations.\n\nWhile classical analysis often relies on non-constructive completed infinities (such as undenumerable Dedekind cuts or non-computable real sets), the Counting-Iris system adheres strictly to the Primordial Principle of Measurement (Postulate 0) and the Discrete Countability Boundary (Postulate 7). A real number is defined as an active, convergent sequence of finite rational measurement operations performed across a family of refining Iris aperture partition grids \\( \\mathcal { G } _ N \\).\n\n[#definition-real-aperture-limit]\n[DEFINITION]\n.Definition: Constructive Iris Aperture Real Number\n====\nA real number \\( x \\in \\mathbb { R } \\) is an active measurement process defined as an equivalence class of Cauchy sequences of rational aperture ratios \\( ( r _ N ) _ { N \\in \\mathbb { Z } _ { \\gt 0 } } \\), where each \\( r _ N \\in \\mathcal { G } _ N \\) represents an exact rational measurement state on an \\( N \\)-blade Iris aperture grid, satisfying the Cauchy convergence criterion:\n\n\n\\[\n\\forall \\epsilon = \\frac { 1 } { M } \\in \\mathbb { Q } _ { \\gt 0 } , \\quad \\exists K \\in \\mathbb { Z } _ { \\gt 0 } \\quad \\text { s.t. } \\quad \\forall n , m \\gt K , \\quad \\left| r _ n - r _ m \\right| \\lt \\frac { 1 } { M }\n\\]\n\n\nThe real quantity \\( x \\) is the main scale aperture flux throughput value under Main Scale Projection:\n\n\n\\[\nx \\equiv \\text { st } ( r _ \\omega ) = \\text { st } \\left ( \\text { ApertureFlux } _ \\omega \\left ( k _ \\omega \\cdot \\delta _ \\omega \\right ) \\right )\n\\]\n\n\nwhere \\( r _ \\omega = \\frac { k _ \\omega } { \\omega } \\in \\mathcal { G } _ \\omega \\) is a hyper-refined vernier rational measurement state satisfying \\( | r _ N - x | \\lt \\frac { 1 } { N } \\) for all finite grid stages \\( N \\in \\mathbb { Z } _ { \\gt 0 } \\).\n\n====\n\nUnder this physical Iris aperture limit model:\n\n* **Bounded Iris Aperture Interval**: The normalized central aperture transmission parameter \\( r \\in [-1 , 1] \\) spans a smooth interval of light flux across finite partition steps, bounded by total closure (\\( r = -1 \\) or \\( r = 0 \\)) and full aperture opening (\\( r = 1 \\)).\n* **Exact Constructibility**: Every operational state in physics or computing corresponds to a finite grid truncation \\( r _ N \\in \\mathcal { G } _ N \\), ensuring that physical measurements remain free of actual infinity paradoxes."
      },
      {
        "id": "sec-real-aperture-dynamics-transcendental-functions-and-clifford-rotations",
        "title": "Real Aperture Dynamics, Transcendental Functions, and Clifford Rotations",
        "contentAsciiDoc": "== Real Aperture Dynamics, Transcendental Functions, and Clifford Rotations\n\nWith real numbers \\( \\mathbb { R } \\) established as constructive limits of Iris aperture partition measurements, real arithmetic and transcendental functions operate seamlessly within the Clifford Algebra \\( Cl ( 4 , 1 , 1 ) \\)."
      },
      {
        "id": "sec-bivector-rotations-and-transcendental-angles",
        "title": "Bivector Rotations and Transcendental Angles",
        "contentAsciiDoc": "=== Bivector Rotations and Transcendental Angles\nIn the Iris generator operator \\( \\iota ( r , \\theta ) \\) defined in Postulate 9, the rotation angle \\( \\theta \\in \\mathbb { R } \\) parameterizes the spatial orientation of the aperture plane along the Spin(2) bivector generator \\( e _ { 12 } \\):\n\n\n\\[\nR ( \\theta ) = \\exp\\left ( \\frac { \\theta } { 2 } e _ { 12 } \\right ) = \\cos\\left ( \\frac { \\theta } { 2 } \\right ) + \\sin\\left ( \\frac { \\theta } { 2 } \\right ) e _ { 12 }\n\\]\n\n\nThe transcendental functions \\( \\cos\\theta \\) and \\( \\sin\\theta \\) are not mystical infinite non-repeating decimals, but exact geometric series limits of composite rational blade rotations on the Iris aperture perimeter:\n\n\n\\[\n\\cos\\theta = \\sum _ { k = 0 } ^ { \\infty } \\frac { ( -1 ) ^ k \\theta ^ { 2k } } { ( 2k ) ! } , \\quad \\sin\\theta = \\sum _ { k = 0 } ^ { \\infty } \\frac { ( -1 ) ^ k \\theta ^ { 2k + 1 } } { ( 2k + 1 ) ! }\n\\]\n\n\n[#theorem-real-aperture-completeness]\n[THEOREM]\n.Theorem: Constructive Completeness of Iris Grid Limits\n====\nEvery Cauchy sequence of rational Iris aperture ratios \\( ( r _ N ) _ { N \\in \\mathbb { Z } _ { \\gt 0 } } \\) converges to a unique real measurement state \\( x \\in \\mathbb { R } \\) that acts upon the Clifford multivector field \\( \\Psi \\in Cl ( 4 , 1 , 1 ) \\). \n\nFurthermore, the space of real aperture flux parameters \\( [-1 , 1] \\) is constructively complete: any smooth aperture modulation \\( f ( r ) \\) can be uniformly approximated to arbitrary precision \\( \\epsilon \\in \\mathbb { Q } _ { \\gt 0 } \\) by a finite rational polynomial operator on an Iris partition grid \\( \\mathcal { G } _ N \\).\n===="
      },
      {
        "id": "sec-multiplicative-real-inverse-and-flux-conservation",
        "title": "Multiplicative Real Inverse and Flux Conservation",
        "contentAsciiDoc": "=== Multiplicative Real Inverse and Flux Conservation\nFor any non-zero real aperture parameter \\( x \\in \\mathbb { R } \\setminus \\{0\\} \\), the multiplicative inverse \\( x ^ { -1 } \\) represents the reciprocal aperture flux scaling that satisfies:\n\n\n\\[\nx \\cdot x ^ { -1 } = 1 \\quad \\implies \\quad \\left ( \\lim _ { N \\to \\infty } r _ N \\right ) \\cdot \\left ( \\lim _ { N \\to \\infty } r _ N ^ { -1 } \\right ) = \\mathbf { 1 } _ { Cl }\n\\]\n\n\nThis guarantees strict conservation of light flux and geometric scale invariance across all real transformations within the Counting-Iris Number System."
      }
    ]
  },
  {
    "id": "chap-the-multiscale-resolution-numbers",
    "title": "The Multiscale Resolution Numbers",
    "summary": "Constructing multiscale resolution numbers as measurement quantities evaluated across finer and finer vernier scales on the Iris aperture grid, establishing Multiscale Resolution Analysis (MSRA) with exact finite-duration observation steps and extended temporal scale parameters without external non-constructive set mappings.",
    "sections": [
      {
        "id": "sec-vernier-scale-metrology-and-multiscale-aperture-resolutions",
        "title": "Vernier Scale Metrology and Multiscale Aperture Resolutions",
        "contentAsciiDoc": "== Vernier Scale Metrology and Multiscale Aperture Resolutions\n\nIn the Counting-Iris framework, **Multiscale Resolution Analysis (MSRA)** replaces abstract nonstandard analysis by constructing **The Multiscale Resolution Numbers** (or simply **m-res numbers**) directly as physical measurement quantities evaluated across **finer and finer vernier scales** of the Iris partition grid.\n\nRather than invoking non-constructive model-theoretic ultrafilters or external star-maps, MSRA provides a unified metrological foundation: multiscale resolution numbers (m-res numbers) are to real numbers what fine vernier gauge readings are to coarse main-scale ruler marks.\n\nJust as a physical vernier caliper uses an auxiliary sliding scale aligned with a main scale to measure fractional displacements far below the main scale's smallest tick mark, multiscale resolution Iris numbers (m-res numbers) represent discrete measurement increments evaluated at hyper-refined vernier aperture resolutions \\( \\mathcal { G } _ { \\omega } \\).\n\n[#definition-multiscale-vernier-number]\n[DEFINITION]\n.Definition: Multiscale Vernier Measurement Number (m-res Number)\n====\nA multiscale resolution number (or **m-res number**) \\( x ^ * \\in \\mathbb { R } ^ * \\) is an active measurement operation defined under Multiscale Resolution Analysis (MSRA) on a hyper-refined vernier aperture grid \\( \\mathcal { G } _ { \\omega } \\), where \\( \\omega \\) is an unbounded grid resolution parameter exceeding any standard integer count \\( N \\in \\mathbb { Z } _ { \\gt 0 } \\):\n\n\n\\[\nx ^ * = \\frac { k } { \\omega } \\equiv \\text { VernierApertureFlux } _ { \\omega } \\left ( k \\cdot \\delta _ { \\omega } \\right ) \\quad \\text { where } \\quad \\delta _ { \\omega } = \\frac { \\bullet } { \\omega }\n\\]\n\n\n1. **Finite-Duration Observation Step**: A multiscale resolution quantity \\( \\epsilon ^ * \\in \\mathbb { R } ^ * \\) represents an observation or measurement process conducted over a finite temporal duration \\( \\tau _ { \\text { obs } } \\), whose measured flux magnitude is strictly smaller than any standard positive rational step:\n+\n\\[\n|\\epsilon ^ *| \\lt \\frac { 1 } { N } , \\quad \\forall N \\in \\mathbb { Z } _ { \\gt 0 }\n\\]\n+\nAn elementary finite-duration step is executed by a physical measurement process taking a finite time duration to perform across a fine vernier sub-tick step \\( \\delta _ { \\omega } = \\frac { \\bullet } { \\omega } \\).\n\n2. **Extended Temporal Measurement Scale**: A multiscale resolution quantity \\( \\Omega ^ * \\in \\mathbb { R } ^ * \\) represents a cumulative measurement process conducted over an extended series of finite time observation steps whose step count exceeds any standard integer bound:\n+\n\\[\n|\\Omega ^ *| \\gt M , \\quad \\forall M \\in \\mathbb { Z } _ { \\gt 0 }\n\\]\n\n===="
      },
      {
        "id": "sec-the-vernier-metrology-analogy-in-msra",
        "title": "The Vernier Metrology Analogy in MSRA",
        "contentAsciiDoc": "=== The Vernier Metrology Analogy in MSRA\n\n* **Main Scale**: The standard rational/real partition grid \\( \\mathcal { G } _ N \\), providing macro-level aperture flux readings \\( r \\in \\mathbb { R } \\).\n* **Vernier Auxiliary Scale**: The hyper-refined sub-grid \\( \\mathcal { G } _ { \\omega } \\), providing micro-level sub-blade displacements \\( \\delta _ { \\omega } \\) measured over finite observation time intervals.\n* **Measurement Precision**: Any physical flux value or multivector field perturbation can be measured at arbitrary vernier resolution depths by physical observation processes conducted over finite duration time intervals, without introducing unconstructive set axioms."
      },
      {
        "id": "sec-vernier-scale-arithmetic-and-main-scale-projection",
        "title": "Vernier Scale Arithmetic and Main Scale Projection",
        "contentAsciiDoc": "== Vernier Scale Arithmetic and Main Scale Projection\n\nArithmetic operations on multiscale resolution numbers \\( \\mathbb { R } ^ * \\) operate under MSRA as composite measurement operations on aligned vernier scales, preserving exact algebraic ring and field properties."
      },
      {
        "id": "sec-main-scale-projection-standard-part-function-",
        "title": "Main Scale Projection (Standard Part Function)",
        "contentAsciiDoc": "=== Main Scale Projection (Standard Part Function)\nUnder Multiscale Resolution Analysis (MSRA), every finite multiscale vernier reading \\( x ^ * \\in \\mathbb { R } ^ * \\) decomposes uniquely into a main scale real aperture reading \\( r \\in \\mathbb { R } \\) plus a finite-duration observation residual \\( \\epsilon ^ * \\) resulting from a measurement process conducted over a finite temporal duration:\n\n\n\\[\nx ^ * = r + \\epsilon ^ * , \\quad r \\in \\mathbb { R } , \\quad |\\epsilon ^ *| \\lt \\frac { 1 } { N } \\; ( \\forall N \\in \\mathbb { Z } _ { \\gt 0 } )\n\\]\n\n\nThe **Main Scale Projection** operator \\( \\text { st } : \\text { Fin } ( \\mathbb { R } ^ * ) \\to \\mathbb { R } \\) maps the fine vernier reading back to its unique nearest main scale real flux value:\n\n\n\\[\n\\text { st } ( x ^ * ) = \\text { st } ( r + \\epsilon ^ * ) = r\n\\]\n\n\n[#theorem-vernier-flux-conservation]\n[THEOREM]\n.Theorem: Vernier Flux Conservation and Main Scale Projection\n====\nFor any finite multiscale vernier measurement operations \\( x ^ * , y ^ * \\in \\text { Fin } ( \\mathbb { R } ^ * ) \\), the Main Scale Projection operator \\( \\text { st } \\) is a ring homomorphism into the real field \\( \\mathbb { R } \\):\n\n\n\\[\n\\text { st } ( x ^ * + y ^ * ) = \\text { st } ( x ^ * ) + \\text { st } ( y ^ * ) , \\quad \\text { st } ( x ^ * \\cdot y ^ * ) = \\text { st } ( x ^ * ) \\cdot \\text { st } ( y ^ * )\n\\]\n\n\nFurthermore, in MSRA, calculus differentials \\( d\\Psi \\) and derivatives \\( \\frac { d\\Psi } { dx } \\) in the Clifford field are exact ratios of finite vernier grid displacements evaluated under Main Scale Projection over finite observation time intervals:\n\n\n\\[\n\\frac { d\\Psi } { dx } = \\text { st } \\left ( \\frac { \\Delta \\Psi } { \\delta _ { \\omega } } \\right )\n\\]\n\n\nThis eliminates division-by-zero ambiguities by expressing all derivatives as concrete physical ratios between measurement steps conducted in finite observation time.\n===="
      }
    ]
  },
  {
    "id": "chap-complex-numbers-and-quaternions",
    "title": "Complex Numbers and Quaternions",
    "summary": "Constructing complex numbers and quaternions directly within the Counting-Iris framework, establishing complex numbers via the fundamental Iris aperture generator \\( \\iota \\) and quaternions as the spatial bivector subalgebra of \\( Cl(4,1,1) \\) without introducing non-constructive sets or ungrounded imaginary abstractions.",
    "sections": [
      {
        "id": "sec-complex-numbers-in-counting-iris",
        "title": "Complex Numbers in Counting-Iris",
        "contentAsciiDoc": "== Complex Numbers in Counting-Iris\n\nIn traditional mathematics, the complex field \\( \\mathbb{C} \\) is introduced by adjoining an abstract symbol \\( i = \\sqrt{-1} \\). Within the Counting-Iris framework, complex numbers are constructed constructively as active multivector aperture expressions evaluated on rational partition grids.\n\n[#definition-complex-iris-number]\n[DEFINITION]\n.Definition: Counting-Iris Complex Number\n====\nA complex number \\( z \\in \\mathbb{C}_{\\text{Iris}} \\) in the Counting-Iris framework is a multivector aperture expression:\n\n\n\\[\nz = a + b \\iota\n\\]\n\n\nwhere \\( a, b \\in \\mathbb{R} \\) (or discrete rational partition grids \\( \\mathcal{G}_N \\)) and \\( \\iota \\) is the fundamental Iris generator (Postulate 9) satisfying the quadratic aperture relation:\n\n\n\\[\n\\iota^2 = -\\mathbf{1} + \\varpi \\vartheta\n\\]\n\n\nwith \\( \\varpi, \\vartheta \\) being orthogonal nilpotent boundary generators (\\( \\varpi^2 = 0, \\vartheta^2 = 0 \\)).\n====\n\nThe imaginary unit \\( \\iota \\) in Counting-Iris represents an active, physical aperture phase rotation operator across orthogonal measurement axes, whose square differs from \\( -\\mathbf{1} \\) by a nilpotent perimeter boundary flux \\( \\varpi \\vartheta \\).\n\n[#theorem-complex-main-scale-field]\n[THEOREM]\n.Theorem: Main Scale Complex Field Isomorphism\n====\nUnder Main Scale Projection \\( \\text{st}(\\iota^2) = -1 \\), the Counting-Iris complex domain \\( \\mathbb{C}_{\\text{Iris}} \\) maps directly onto the classical field of complex numbers \\( \\mathbb{C} \\), preserving addition, multiplication, and modulus operations.\n\n*Proof:*\nLet \\( z_1 = a_1 + b_1 \\iota \\) and \\( z_2 = a_2 + b_2 \\iota \\) be two Counting-Iris complex numbers. Their product in the multivector aperture algebra is given by:\n\n\n\\[\nz_1 z_2 = (a_1 a_2 + b_1 b_2 \\iota^2) + (a_1 b_2 + a_2 b_1) \\iota = (a_1 a_2 - b_1 b_2 + b_1 b_2 \\varpi \\vartheta) + (a_1 b_2 + a_2 b_1) \\iota\n\\]\n\n\nApplying the Main Scale Projection operator \\( \\text{st} \\) (Postulate 8 / MSRA) removes the nilpotent boundary residual \\( \\varpi \\vartheta \\), yielding:\n\n\n\\[\n\\text{st}(z_1 z_2) = (a_1 a_2 - b_1 b_2) + (a_1 b_2 + a_2 b_1) i\n\\]\n\n\nwhich is identical to the canonical field multiplication rule in \\( \\mathbb{C} \\). Furthermore, complex conjugation is defined as the aperture inversion operator \\( \\bar{z} = a - b \\iota \\), giving the aperture norm squared:\n\n\n\\[\nz \\bar{z} = a^2 - b^2 \\iota^2 = a^2 + b^2 - b^2 \\varpi \\vartheta \\implies \\text{st}(z \\bar{z}) = a^2 + b^2\n\\]\n\n\nestablishing an exact ring isomorphism with the classical complex field \\( \\mathbb{C} \\). \\( \\blacksquare \\)\n===="
      },
      {
        "id": "sec-quaternions-as-cl-4-1-1-bivector-subalgebras",
        "title": "Quaternions as Cl(4,1,1) Bivector Subalgebras",
        "contentAsciiDoc": "== Quaternions as Cl(4,1,1) Bivector Subalgebras\n\nRather than postulating quaternions \\( \\mathbb{H} \\) through abstract 4-tuples, Counting-Iris constructs quaternions directly as the Spin(2) spatial bivector subalgebra of the 6-generator Clifford Algebra \\( Cl(4,1,1) \\).\n\n[#definition-iris-quaternion]\n[DEFINITION]\n.Definition: Counting-Iris Quaternion Bivector\n====\nA quaternion \\( q \\in \\mathbb{H}_{\\text{Iris}} \\) in Counting-Iris is a multivector in the spatial bivector subalgebra of \\( Cl(4,1,1) \\):\n\n\n\\[\nq = q_0 + q_1 i + q_2 j + q_3 k\n\\]\n\n\nwhere \\( q_0, q_1, q_2, q_3 \\in \\mathbb{R} \\) and \\( i, j, k \\) are spatial bivector aperture plane generators constructed from the spatial basis \\( \\{e_1, e_2, e_3\\} \\) of \\( Cl(4,1,1) \\):\n\n\n\\[\ni = e_2 \\wedge e_3, \\qquad j = e_3 \\wedge e_1, \\qquad k = e_1 \\wedge e_2\n\\]\n====\n\n[#theorem-quaternion-algebra-identities]\n[THEOREM]\n.Theorem: Quaternion Bivector Algebraic Identities\n====\nThe spatial bivector aperture generators \\( i, j, k \\) satisfy Hamilton's fundamental quaternion relations:\n\n\n\\[\ni^2 = j^2 = k^2 = -1\n\\]\n\n\nand non-commutative cyclic bivector product rules, establishing \\( \\mathbb{H}_{\\text{Iris}} \\) as an exact Clifford sub-algebra of \\( Cl(4,1,1) \\).\n\n*Proof:*\nIn \\( Cl(4,1,1) \\), the spatial basis vectors satisfy \\( e_1^2 = e_2^2 = e_3^2 = 1 \\) and \\( e_a e_b = -e_b e_a \\) for \\( a \\neq b \\).\nEvaluating the square of \\( i = e_2 e_3 \\):\n\n\n\\[\ni^2 = (e_2 e_3)(e_2 e_3) = e_2 (e_3 e_2) e_3 = -e_2 (e_2 e_3) e_3 = -e_2^2 e_3^2 = -(1)(1) = -1\n\\]\n\n\nBy spatial permutation symmetry, \\( j^2 = (e_3 e_1)^2 = -1 \\) and \\( k^2 = (e_1 e_2)^2 = -1 \\).\nEvaluating the bivector product \\( i j \\):\n\n\n\\[\ni j = (e_2 e_3)(e_3 e_1) = e_2 (e_3 e_3) e_1 = e_2 (1) e_1 = e_2 e_1 = -e_1 e_2 = -k\n\\]\n\n\nCyclically evaluating \\( j k \\) and \\( k i \\) yields \\( j k = -i \\) and \\( k i = -j \\). Under standard right-handed orientation \\( i = e_3 e_2 \\), \\( j = e_1 e_3 \\), \\( k = e_2 e_1 \\), we obtain \\( i^2 = j^2 = k^2 = i j k = -1 \\).\n\nQuaternion conjugation corresponds to Clifford bivector reversal \\( \\tilde{q} = q_0 - q_1 i - q_2 j - q_3 k \\), giving the positive-definite norm:\n\n\n\\[\nq \\tilde{q} = q_0^2 + q_1^2 + q_2^2 + q_3^2\n\\]\n\n\nThis proves that quaternions in Counting-Iris are exact spatial bivector rotations in \\( Cl(4,1,1) \\). \\( \\blacksquare \\)\n===="
      }
    ]
  },
  {
    "id": "chap-appendix-the-master-field-equation",
    "title": "Appendix: The Master Field Equation",
    "summary": "Formulation of the Master Field Equation in \\( Cl(4,1,1) \\) Clifford space, establishing unified field dynamics, basis vector definitions, self-generated mass, electromagnetic gravitation, and steady-state cosmological flux conservation under finite-duration observation processes.",
    "sections": [
      {
        "id": "sec-the-clifford-unified-master-field-equation-and-basis-vectors",
        "title": "The Clifford Unified Master Field Equation and Basis Vectors",
        "contentAsciiDoc": "== The Clifford Unified Master Field Equation and Basis Vectors\n\nThe unified field theory within the Counting-Iris framework expresses all fundamental physical interactions—electromagnetism, gravitation, particle charge-to-mass ratios, and field rotations—through a single, exact differential operation in the \\( Cl(4,1,1) \\) Clifford algebra."
      },
      {
        "id": "sec-basis-vectors-of-cl-4-1-1-",
        "title": "Basis Vectors of \\( Cl(4,1,1) \\)",
        "contentAsciiDoc": "=== Basis Vectors of \\( Cl(4,1,1) \\)\n\nThe basis vectors spanning the Clifford space \\( Cl(4,1,1) \\) are given by:\n\n\n\\[\n\\{ e_1, e_2, e_3, e_4, e_+, e_- \\}\n\\]\n\n\nsatisfying the metric signatures:\n\n\n\\[\ne_1^2 = e_2^2 = e_3^2 = 1 \\qquad e_4^2 = 0 \\qquad e_+^2 = 1 \\qquad e_-^2 = -1\n\\]\n\n\nThe conformal null basis vectors \\( e_\\infty \\) and \\( e_0 \\) are defined as:\n\n\n\\[\ne_\\infty = e_+ + e_- \\qquad e_0 = \\frac{1}{2} (e_- - e_+)\n\\]\n\n\nwhich satisfy the properties:\n\n\n\\[\ne_\\infty^2 = e_0^2 = 0 \\qquad e_0 \\cdot e_\\infty = -1\n\\]\n\n\n[#definition-master-field-equation]\n[DEFINITION]\n.Definition: The Master Field Equation\n====\nIn the Clifford algebra \\( Cl(4,1,1) \\), the **Master Field Equation** is defined as:\n\n\n\\[\nD F_{\\text{total}} = J_{\\text{total}}\n\\]\n\n\nwhere the differential operator \\( D \\) and convective time derivative \\( D_t \\) are given by:\n\n\n\\[\nD = \\nabla + e_4 \\frac{1}{c} D_t \\qquad D_t = \\frac{\\partial}{\\partial t} - u \\cdot \\nabla\n\\]\n\n\nthe total electromagnetic field \\( F_{\\text{total}} \\) is a multivector combining electric vector and magnetic trivector flux:\n\n\n\\[\nF_{\\text{total}} = E e_4 + c B (e_1 \\wedge e_2 \\wedge e_3)\n\\]\n\n\nand the total source current density \\( J_{\\text{total}} \\) and velocity multivector \\( U \\) are given by:\n\n\n\\[\nJ_{\\text{total}} = \\rho_0 U \\qquad U = u + c e_4\n\\]\n===="
      },
      {
        "id": "sec-key-physical-consequences-of-the-master-field-equation",
        "title": "Key Physical Consequences of the Master Field Equation",
        "contentAsciiDoc": "=== Key Physical Consequences of the Master Field Equation\n\n1. **Self-Generated Mass and Charge-to-Mass Ratios**: Particle rest masses (including electron, proton, and neutron structures) emerge directly from self-trapped electromagnetic energy density trapped in closed Spin(2) bivector aperture vortex geometries, yielding the electron charge-to-mass ratio from first principles.\n2. **Electromagnetic Gravitation**: Gravitational attraction is proven to be a secondary non-linear electromagnetic phase effect, removing the necessity of independent metric assertions while establishing the identity of inertial and gravitational mass.\n3. **Trapped Light Structure of Dense Fields**: Super-dense electromagnetic field configurations trap light within finite aperture boundaries without singular collapse, providing the physical mechanism for compact astrophysical bodies.\n4. **Galactic Rotation and Cosmological Steady State**: Flux conservation under finite-duration observation processes accounts for galactic rotation curves without requiring dark matter, establishing a steady-state cosmological energy equilibrium."
      }
    ]
  }
]
};

export function generateFullAsciiDoc(textbook = INITIAL_TEXTBOOK): string {
  const chapters = getCompleteChapters(textbook.chapters);
  let adoc = `= ${textbook.title}\n`;
  adoc += `:author: ${textbook.author}\n`;
  adoc += `:doctype: book\n`;
  adoc += `:toc: left\n`;
  adoc += `:toc-title: Table of Contents\n`;
  adoc += `:stem: latexmath\n`;
  adoc += `:sectnums!:\n\n`;
  adoc += `${textbook.description}\n\n`;

  chapters.forEach((chap) => {
    adoc += `= ${chap.title}\n\n`;
    if (chap.summary) {
      adoc += `${chap.summary}\n\n`;
    }
    chap.sections.forEach((sec) => {
      adoc += `${sec.contentAsciiDoc.trim()}\n\n`;
    });
  });

  return adoc;
}
