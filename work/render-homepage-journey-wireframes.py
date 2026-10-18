from pathlib import Path
from xml.sax.saxutils import escape
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "outputs/homepage-journey-audit"
OUTPUT.mkdir(parents=True, exist_ok=True)
FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
SERIF = "/System/Library/Fonts/Supplemental/Georgia.ttf"
INK = "#16211c"
MUTED = "#4e5c55"
PAPER = "#f5f3ec"
SURFACE = "#fffefa"
LINE = "#bfc8c1"
TEAL = "#15574e"
SOFT = "#d9eee8"

class Board:
    def __init__(self, width, height, name):
        self.image = Image.new("RGB", (width, height), PAPER)
        self.draw = ImageDraw.Draw(self.image)
        self.name = name
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">', f'<title id="title">{escape(name.replace("-", " "))}</title>', '<desc id="desc">Design-only wireframe. Example learner state is fictional. Available, planned and future content are separately labeled. No application or progress changes.</desc>', f'<rect width="100%" height="100%" fill="{PAPER}"/>']
    def box(self, x, y, width, height, fill=SURFACE, radius=14, outline=LINE):
        self.draw.rounded_rectangle((x, y, x+width, y+height), radius=radius, fill=fill, outline=outline, width=1)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{outline}"/>')
    def text(self, x, y, value, size=18, color=INK, weight=False, serif=False, width=None):
        font = ImageFont.truetype(SERIF if serif else BOLD if weight else FONT, size)
        lines = []
        for paragraph in value.split("\n"):
            current = ""
            for word in paragraph.split():
                candidate = current + (" " if current else "") + word
                if width and self.draw.textlength(candidate, font=font) > width and current:
                    lines.append(current)
                    current = word
                else:
                    current = candidate
            lines.append(current)
        for index, line in enumerate(lines):
            position = y + index * (size+9)
            self.draw.text((x, position), line, font=font, fill=color)
            family = "Georgia,serif" if serif else "Arial,sans-serif"
            self.svg.append(f'<text x="{x}" y="{position+size}" font-family="{family}" font-size="{size}" font-weight="{700 if weight else 400}" fill="{color}">{escape(line)}</text>')
        return y + len(lines)*(size+9)
    def line(self, x1, y1, x2, y2, dashed=False):
        self.draw.line((x1,y1,x2,y2), fill=TEAL, width=2)
        self.svg.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{TEAL}" stroke-width="2" fill="none"'+(' stroke-dasharray="6 5"' if dashed else '')+'/>')
    def save(self):
        self.image.save(OUTPUT / (self.name+".png"))
        (OUTPUT / (self.name+".svg")).write_text("\n".join(self.svg+["</svg>"])+"\n")

desktop = Board(1280, 1120, "wireframe-desktop")
desktop.text(42,26,"M  ML Math Lab",22,weight=True)
desktop.text(480,30,"Learning journey   |   Browse topics   |   Resources   |   Help",18)
desktop.text(42,91,"DESIGN ONLY / ILLUSTRATIVE RETURNING LEARNER / NO RECORDED PROGRESS",14,color=MUTED)
desktop.text(42,129,"Build understanding. Then build models.",38,serif=True)
desktop.text(42,188,"One useful next step, with the freedom to explore.",19,color=MUTED)
desktop.box(42,238,777,277)
desktop.text(65,259,"WHERE YOU ARE",14,color=TEAL,weight=True)
desktop.text(65,288,"Python for ML  /  pandas",27,weight=True)
desktop.text(65,332,"Why this matters",17,weight=True)
desktop.text(65,361,"Keep feature rows and targets aligned so model errors describe the right observations.",19,width=710)
desktop.box(65,425,450,57,fill=INK,outline=INK,radius=9)
desktop.text(84,443,"Continue D02: Aligned selection  →",20,color=SURFACE,weight=True)
desktop.text(541,444,"Change starting point",16,color=TEAL)
desktop.box(843,238,395,277)
desktop.text(866,261,"YOUR LEARNING EVIDENCE",14,color=TEAL,weight=True)
desktop.text(866,302,"This lesson: in progress",20,weight=True)
desktop.text(866,341,"Module mastery: not demonstrated",17,width=345)
desktop.text(866,385,"Completion and mastery are separate.",17,width=345)
desktop.text(866,437,"Local browser only • View details",15,color=MUTED,width=345)
desktop.text(42,553,"Your learning journey",27,serif=True)
desktop.text(42,595,"Suggested order, not locked prerequisites. Open any available topic.",17,color=MUTED)
stages = [
    ("01  Math Foundations","AVAILABLE","Understand ML's mathematical language.","Six subjects + integration"),
    ("02  Python for ML","AVAILABLE","Turn mathematical ideas into reliable code.","Six complete modules"),
    ("03  ML Algorithms","PARTLY AVAILABLE","Train and evaluate prediction models.","Linear Regression available"),
    ("04  Project Studio","PLANNED","Build complete ML solutions.","Regression bridge available separately"),
    ("05  Deployment & MLOps","FUTURE / UNSCOPED","Deliver, monitor and maintain models.","No course or route available")
]
for index, (title,status,purpose,detail) in enumerate(stages):
    position = 42+index*243
    desktop.box(position,642,224,218,fill=SOFT if index==1 else SURFACE)
    desktop.text(position+14,658,status,12,color=TEAL,weight=True,width=195)
    desktop.text(position+14,693,title,19,weight=True,width=194)
    desktop.text(position+14,753,purpose,16,width=194)
    desktop.text(position+14,814,detail,13,color=MUTED,width=194)
desktop.box(42,894,777,164)
desktop.text(64,914,"HOW THIS CONCEPT CONNECTS",14,color=TEAL,weight=True)
desktop.text(64,950,"Row identity  →  aligned filtering  →  trustworthy evaluation",19,weight=True,width=730)
desktop.text(64,992,"Refresh: ordered Python records • NumPy masks\nUse next: dataset audit and training-only preparation",16,color=MUTED,width=730)
desktop.box(843,894,395,164)
desktop.text(865,914,"TOOLS & HELP",14,color=TEAL,weight=True)
desktop.text(865,949,"Experiments • Debug challenge\nNotebooks • Getting started",18,width=350)
desktop.text(42,1082,"Available ≠ mastered. Planned and future stages have no launch action.",15,color=MUTED)
desktop.save()

mobile = Board(390, 1615, "wireframe-mobile")
mobile.text(20,22,"M  ML Math Lab",20,weight=True)
mobile.text(278,25,"Browse",17,color=TEAL)
mobile.text(20,77,"DESIGN ONLY • EXAMPLE STATE",12,color=MUTED)
mobile.text(20,109,"Your next useful step",28,serif=True)
mobile.text(20,157,"Explore freely. Keep your progress.",16,color=MUTED)
mobile.box(16,205,358,327)
mobile.text(34,223,"WHERE YOU ARE",12,color=TEAL,weight=True)
mobile.text(34,251,"Python for ML / pandas",23,weight=True,width=318)
mobile.text(34,298,"Why: keep feature rows and targets aligned before fitting an ML model.",18,width=318)
mobile.box(34,390,322,61,fill=INK,outline=INK,radius=9)
mobile.text(49,405,"Continue D02:\nAligned selection →",17,color=SURFACE,weight=True)
mobile.text(34,470,"Change starting point",16,color=TEAL)
mobile.text(34,504,"In progress • Not yet mastered",14,color=MUTED)
mobile.text(20,569,"Your learning journey",25,serif=True)
mobile.text(20,612,"Suggested order, never a lock.",16,color=MUTED)
for index,(title,status,purpose,detail) in enumerate(stages):
    position = 654+index*118
    mobile.box(16,position,358,104,fill=SOFT if index==1 else SURFACE)
    mobile.text(32,position+12,status,11,color=TEAL,weight=True)
    mobile.text(32,position+36,title,20,weight=True,width=325)
    mobile.text(32,position+70,detail,13,color=MUTED,width=325)
mobile.box(16,1264,358,173)
mobile.text(32,1281,"CONNECTED CONCEPTS",12,color=TEAL,weight=True)
mobile.text(32,1312,"Ordered records → aligned rows → trustworthy evaluation",18,width=320)
mobile.text(32,1387,"Refresh one concept, then return.",15,color=MUTED)
mobile.box(16,1458,358,118)
mobile.text(32,1474,"Resources & help",19,weight=True)
mobile.text(32,1511,"Experiments • Challenges\nNotebooks • Getting started",16,width=320)
mobile.save()

concept = Board(1160, 760, "gradient-descent-connections")
concept.text(35,24,"Why gradient descent belongs in your ML journey",30,serif=True)
concept.text(35,75,"Concept connections, not prerequisite locks or mastery equivalences.",17,color=MUTED)
nodes = [
    (35,137,300,125,"Derivatives & partials","Sensitivity of loss to a parameter"),
    (409,137,300,125,"Loss functions","A numerical training objective"),
    (795,137,330,125,"Vectors & gradients","All partials at the same state"),
    (409,337,300,130,"Gradient descent","Move opposite the gradient, with a step size"),
    (35,553,300,130,"Optimization","Stability, scaling and finite-run limits"),
    (409,553,300,130,"Linear Regression","Fit weights by reducing training loss"),
    (795,553,330,130,"Neural networks","Linear-neuron X-Ray available; full curriculum future")
]
for x,y,width,height,title,detail in nodes:
    concept.box(x,y,width,height,fill=SOFT if title=="Gradient descent" else SURFACE)
    concept.text(x+16,y+17,title,22,weight=True,width=width-32)
    concept.text(x+16,y+58,detail,16,width=width-32)
concept.line(335,201,409,365)
concept.line(559,262,559,337)
concept.line(795,201,709,365)
concept.text(44,294,"Differentiate the chosen loss",14,color=TEAL)
concept.text(752,294,"Collect sensitivities",14,color=TEAL)
concept.line(409,432,185,553)
concept.line(559,467,559,553)
concept.line(709,432,960,553)
concept.text(330,491,"Learned parameters, not causal guarantees",14,color=MUTED)
concept.text(35,714,"Direction is not a convergence guarantee. Verify learning rate, fit rows and unseen-data evaluation.",16,color=MUTED)
concept.save()
print("Rendered desktop, mobile and concept wireframes as PNG and accessible SVG.")

