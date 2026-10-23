import type {DeepLesson} from "../deep-read";
export const TRANSFORMATIONS_DEEP:DeepLesson[]=[
 {
  "title": "What a matrix does to space",
  "minutes": 14,
  "sections": [
   {
    "id": "trn-observe",
    "kicker": "1 · Observe",
    "title": "Matrices move points",
    "blocks": [
     {
      "kind": "p",
      "text": "Think of a matrix as a machine that takes every point on a sheet of paper and moves it. Some matrices stretch the sheet, some rotate it, some shear it. A neural network layer is such a machine acting on data."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The question",
      "text": "What do scaling, rotation and shear look like, and when can a transformation be undone?"
     }
    ]
   },
   {
    "id": "trn-express",
    "kicker": "2 · Express",
    "title": "Transformations and the determinant",
    "blocks": [
     {
      "kind": "eq",
      "lines": [
       "new point = M · point",
       "determinant of M = factor by which areas change",
       "inverse M⁻¹ undoes M, if det ≠ 0"
      ],
      "note": "A determinant of 0 means the transformation squashes the sheet onto a line."
     }
    ]
   },
   {
    "id": "trn-visualize",
    "kicker": "3 · Visualize",
    "title": "Three points, three machines",
    "blocks": [
     {
      "kind": "p",
      "text": "Points (1, 0), (0, 1) and (1, 1). Scaling by 2 horizontally and 0.5 vertically moves (1, 1) to (2, 0.5). A 90 degree rotation sends (1, 0) to (0, 1) and (0, 1) to (−1, 0). A shear slides each point sideways by its height."
     },
     {
      "kind": "table",
      "caption": "Determinants",
      "headers": [
       "Transformation",
       "Determinant",
       "Meaning"
      ],
      "rows": [
       [
        "Scale (2, 0.5)",
        "1.0",
        "Areas unchanged"
       ],
       [
        "Rotation 90°",
        "1.0",
        "Areas unchanged"
       ],
       [
        "Shear",
        "1.0",
        "Areas unchanged"
       ],
       [
        "Flatten [[1,2],[2,4]]",
        "0.0",
        "Everything lands on a line"
       ]
      ]
     }
    ]
   },
   {
    "id": "trn-discover",
    "kicker": "4 · Discover",
    "title": "Squashing loses information",
    "blocks": [
     {
      "kind": "p",
      "text": "The flattening matrix sends the three points to (1, 2), (2, 4) and (3, 6), all on one line. Different inputs now share a line, and you cannot tell which input produced which output. NumPy refuses to compute an inverse. The shear, in contrast, is undone by the matrix [[1, −1], [0, 1]]."
     },
     {
      "kind": "p",
      "text": "Applying two transformations is multiplying their matrices, right one first: rotate-after-scale is the matrix rot @ scale."
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "The idea in one sentence",
      "text": "A matrix moves every point, the determinant says how areas scale, and a zero determinant means information is lost for good."
     }
    ]
   },
   {
    "id": "trn-apply",
    "kicker": "5 · Apply",
    "title": "Two worked examples",
    "blocks": [
     {
      "kind": "p",
      "text": "Example 1, an area. A scale of 3 in x and 2 in y has determinant 6, so a 1 × 1 square becomes 6 square units."
     },
     {
      "kind": "p",
      "text": "Example 2, redundant features. If one feature is exactly twice another, the data matrix squashes two dimensions into one, and the least-squares weights are no longer unique."
     },
     {
      "kind": "callout",
      "tone": "ml",
      "title": "Where this shows up",
      "text": "Collinear features, PCA, whitening and the layers of a network are all transformations. Rank and determinant explain when they lose information."
     },
     {
      "kind": "check",
      "question": "A matrix has determinant 0. What does it do to a square?",
      "options": [
       "Doubles it",
       "Collapses it onto a line or point",
       "Rotates it"
      ],
      "answer": 1,
      "why": "Zero area scaling means the square is flattened and cannot be recovered."
     }
    ]
   },
   {
    "id": "trn-wrong",
    "kicker": "6 · Where it goes wrong",
    "title": "Three ways it goes wrong",
    "blocks": [
     {
      "kind": "callout",
      "tone": "warn",
      "title": "1 · Inverting a singular matrix",
      "text": "Check the determinant, or use least squares."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "2 · Reading the order backwards",
      "text": "In M2 @ M1, M1 acts first."
     },
     {
      "kind": "callout",
      "tone": "warn",
      "title": "3 · Trusting a tiny nonzero determinant",
      "text": "Numerically it is almost singular and the inverse is unstable."
     }
    ]
   },
   {
    "id": "trn-python",
    "kicker": "7 · In Python",
    "title": "Transformations in code",
    "blocks": [
     {
      "kind": "code",
      "caption": "Scale, rotate, shear, flatten and invert",
      "code": "import numpy as np\n\npts = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0]])\nscale = np.array([[2.0, 0.0], [0.0, 0.5]])\ntheta = np.pi / 2\nrot = np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]])\nshear = np.array([[1.0, 1.0], [0.0, 1.0]])\nprint(\"scale:\\n\", pts @ scale.T)\nprint(\"rotate 90 degrees:\\n\", np.round(pts @ rot.T, 3) + 0.0)\nfor name, M in ((\"scale\", scale), (\"rotation\", rot), (\"shear\", shear)):\n    print(name.ljust(8), \"determinant (area factor):\", round(float(np.linalg.det(M)), 3))\n\n# a transformation can be undone only if its determinant is not zero\nflatten = np.array([[1.0, 2.0], [2.0, 4.0]])           # the second row is twice the first\nprint(\"flatten determinant:\", np.linalg.det(flatten))\nprint(\"images of three points under flatten:\", (pts @ flatten.T).tolist(), \"-> they all land on one line\")\ntry:\n    np.linalg.inv(flatten)\nexcept np.linalg.LinAlgError:\n    print(\"flatten has no inverse: information was lost\")\nprint(\"undo the shear:\", np.round(np.linalg.inv(shear), 3) + 0.0)\n\n# applying two transformations is multiplying their matrices (right one first)\nprint(\"scale then rotate equals rot @ scale:\", np.allclose(rot @ (scale @ pts[2]), (rot @ scale) @ pts[2]))",
      "output": "scale:\n [[2.  0. ]\n [0.  0.5]\n [2.  0.5]]\nrotate 90 degrees:\n [[ 0.  1.]\n [-1.  0.]\n [-1.  1.]]\nscale    determinant (area factor): 1.0\nrotation determinant (area factor): 1.0\nshear    determinant (area factor): 1.0\nflatten determinant: 0.0\nimages of three points under flatten: [[1.0, 2.0], [2.0, 4.0], [3.0, 6.0]] -> they all land on one line\nflatten has no inverse: information was lost\nundo the shear: [[ 1. -1.]\n [ 0.  1.]]\nscale then rotate equals rot @ scale: True"
     },
     {
      "kind": "callout",
      "tone": "idea",
      "title": "Keep this",
      "text": "Ask what a matrix does to a square. If it flattens it, something was lost."
     }
    ]
   }
  ]
 }
];
