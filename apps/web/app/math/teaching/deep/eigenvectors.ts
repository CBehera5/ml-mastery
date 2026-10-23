import type {DeepLesson} from "../deep-read";
export const EIGENVECTORS_DEEP:DeepLesson[]=[
 {
  "title": "Directions that survive: eigenvectors and PCA",
  "minutes": 14,
  "sections": [
   {
    "id": "eig-observe",
    "kicker": "1 · Observe",
    "title": "Which direction do the customers spread along?",
    "blocks": [
     {
      "kind": "p",
      "text": "A telecom plots 300 customers by monthly data usage and monthly calls. The cloud is a tilted ellipse: heavy data users also call more. Describing each customer by two numbers is wasteful if most of the variation lies along one tilted line."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What is an eigenvector, and how does it find the direction of most spread?"
     }
    ]
   },
   {
    "id": "eig-express",
    "kicker": "2 · Express",
    "title": "Eigenvectors and eigenvalues",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "C v = λ v",
       "C is the covariance matrix of the data",
       "the eigenvector v with the largest λ is the direction of greatest spread"
      ],
      "note": "An eigenvector is a direction that a matrix only stretches, by the factor λ, without turning."
     }
    ]
   },
   {
    "id": "eig-visualize",
    "kicker": "3 · Visualize",
    "title": "The customer cloud",
    "blocks": [
     {
      "kind": "p",
      "text": "The covariance matrix of usage and calls has entries 9.35, 7.61 and 7.14. Its eigenvalues are 15.94 and 0.56, meaning 96.6 percent of the total variance lies along one direction, (0.756, 0.654), and only 3.4 percent along the perpendicular one."
     },
     {
      "kind": "table",
      "caption": "Eigenvalues",
      "headers": [
       "Direction",
       "Eigenvalue",
       "Share of variance"
      ],
      "rows": [
       [
        "First",
        "15.94",
        "96.6%"
       ],
       [
        "Second",
        "0.56",
        "3.4%"
       ]
      ]
     },
     {
      "kind": "p",
      "text": "Checking the definition: C times the first eigenvector gives (12.054, 10.429), exactly 15.94 times the vector. The matrix only stretches this direction."
     }
    ]
   },
   {
    "id": "eig-discover",
    "kicker": "4 · Discover",
    "title": "Keep one direction",
    "blocks": [
     {
      "kind": "p",
      "text": "Projecting each customer onto the first direction keeps 96.6 percent of the variance with one number. The average squared error of rebuilding the original two numbers is 0.557, essentially the dropped eigenvalue, 0.559. This is principal component analysis (PCA)."
     },
     {
      "kind": "p",
      "text": "Not every matrix has real eigenvectors: a 60 degree rotation turns every direction, and its eigenvalues are complex."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "Eigenvectors of the covariance matrix point along the data's main directions, and keeping the biggest ones compresses data with little loss."
     }
    ]
   },
   {
    "id": "eig-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, compression. Replace two correlated columns by one score along the first direction, and keep 96.6 percent of the information in half the columns."
     },
     {
      "kind": "p",
      "text": "Example 2, a warning. If the columns are in different units, the big-number column dominates the covariance. Standardise before PCA."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "PCA for visualisation and noise reduction, eigen-analysis of graphs, and understanding why some optimisation directions are slow."
     },
     {
      "kind": "check",
      "question": "The two eigenvalues are 15.94 and 0.56. Roughly how much variance does the second direction hold?",
      "options": [
       "Half",
       "About 3 percent",
       "About 30 percent"
      ],
      "answer": 1,
      "why": "0.56 ÷ (15.94 + 0.56) ≈ 0.034."
     }
    ]
   },
   {
    "id": "eig-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · PCA on unscaled data",
      "text": "Large-unit columns dominate."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading components as causes",
      "text": "They are directions of variance, not factors."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Keeping directions with no signal",
      "text": "Choose how many to keep from the cumulative variance, not by habit."
     }
    ]
   },
   {
    "id": "eig-python",
    "kicker": "7 · In Python",
    "title": "PCA by eigenvectors in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Covariance, eigenvectors and one-direction compression",
      "code": "import numpy as np\n\nrng = np.random.default_rng(0)\n# 300 customers: monthly data usage and monthly calls, correlated\nusage = rng.normal(0, 3, 300)\ncalls = 0.8 * usage + rng.normal(0, 1, 300)\nX = np.column_stack([usage, calls])\nX = X - X.mean(0)\nC = np.cov(X.T)\nvals, vecs = np.linalg.eigh(C)\norder = vals.argsort()[::-1]\nvals, vecs = vals[order], vecs[:, order]\nprint(\"covariance:\\n\", np.round(C, 2))\nprint(\"eigenvalues:\", np.round(vals, 2), \"| share of variance:\", np.round(vals / vals.sum(), 3))\nvecs[:, 0] = np.abs(vecs[:, 0])             # the sign of an eigenvector is arbitrary; show the positive one\nprint(\"first eigenvector (direction of most spread):\", np.round(vecs[:, 0], 3))\n\n# check Cv = lambda v: the matrix only stretches this direction\nv = vecs[:, 0]\nprint(\"C @ v =\", np.round(C @ v, 3), \"| lambda * v =\", np.round(vals[0] * v, 3))\n\n# project to one dimension and see how much is kept\nproj = X @ vecs[:, :1]\nrebuilt = proj @ vecs[:, :1].T\nprint(\"variance kept by one direction:\", round(float(proj.var(ddof=1) / vals.sum()), 3))\nprint(\"average squared reconstruction error:\", round(float(((X - rebuilt) ** 2).sum(1).mean()), 3), \"| close to the dropped eigenvalue:\", round(float(vals[1]), 3))\n\n# a rotation has no real eigenvector direction\ntheta = np.pi / 3\nR = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])\nprint(\"eigenvalues of a 60 degree rotation:\", np.round(np.linalg.eigvals(R), 3))",
      "output": "covariance:\n [[9.35 7.61]\n [7.61 7.14]]\neigenvalues: [15.94  0.56] | share of variance: [0.966 0.034]\nfirst eigenvector (direction of most spread): [0.756 0.654]\nC @ v = [12.054 10.429] | lambda * v = [12.054 10.429]\nvariance kept by one direction: 0.966\naverage squared reconstruction error: 0.557 | close to the dropped eigenvalue: 0.559\neigenvalues of a 60 degree rotation: [0.5+0.866j 0.5-0.866j]"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Most of the variation often lives in a few directions."
     }
    ]
   }
  ]
 }
];
