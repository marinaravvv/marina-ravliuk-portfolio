"""Generate the three public two-page resumes for Marina Ravliuk.
Run: pip install reportlab && python scripts/generate_cv_pdfs.py
Only public professional data is included. Editable factual source: DATA below.
"""
from pathlib import Path
from html import escape
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "cv"
OUT.mkdir(parents=True, exist_ok=True)
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
if not Path(REG).exists():
    REG = "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"
    BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
pdfmetrics.registerFont(TTFont("Rav", REG))
pdfmetrics.registerFont(TTFont("RavBold", BOLD))
DARK = HexColor("#302219")
ACCENT = HexColor("#866751")
MUTED = HexColor("#79665A")
LINE = HexColor("#DAD0C4")

DATA = {
 "UA": {
  "profile_title":"ПРОФІЛЬ",
  "profile":"Засновниця MAV8. Створюю AI-агентів, автоматизації та цифрові бізнес-системи. Поєдную технології, продуктове мислення й досвід управління бізнесами, щоб перетворювати складні процеси на практичні рішення — від ідеї до впровадження.",
  "skills_title":"КЛЮЧОВІ КОМПЕТЕНЦІЇ",
  "skills":["AI ТА АВТОМАТИЗАЦІЯ  ·  AI agents, LLM, n8n, API, інтеграції, RAG",
            "ЦИФРОВІ ПРОДУКТИ  ·  MVP, вебплатформи, UX, продуктові рішення",
            "БІЗНЕС-СИСТЕМИ  ·  CRM, продажі, процеси, операційна ефективність"],
  "experience_title":"ПРОФЕСІЙНИЙ ДОСВІД",
  "jobs":[
   ("2026 — ДОТЕПЕР","MAV8 · ЗАСНОВНИЦЯ","Компанія AI, Automation & Digital Systems",
    ["Розвиваю MAV8 як B2B-компанію та екосистему цифрових рішень, продуктів і навчання.",
     "Напрями: AI-агенти, автоматизація, бізнес-системи, аналітика та цифрові продукти."]),
   ("2024 — ДОТЕПЕР","НЕЗАЛЕЖНІ AI ТА DIGITAL-ПРОЄКТИ","AI Automation / Digital Product Development",
    ["Проєктую AI-асистентів, агентні процеси та інтеграції на базі OpenAI, Claude, n8n, Supabase.",
     "Працюю від визначення бізнес-завдання до прототипу й впровадження."]),
   ("2021 — 2025","ВЛАСНА ШКОЛА АНГЛІЙСЬКОЇ МОВИ","Засновниця · Київ",
    ["Створила й розвивала школу: освітні продукти, маркетинг, продажі, операційні процеси.",
     "У 2023 працювала над цифровою освітньою платформою. Продала школу у 2025."])],
  "page2":"ПРОЄКТИ, БІЗНЕС ТА ОСВІТА",
  "projects":"ВИБРАНІ DIGITAL-ПРОЄКТИ",
  "works":[("AURA ARC","Вебсайт для програми особистісної трансформації.","aura-arc.com"),
           ("RòDoSy","Освітньо-культурний вебсайт української спільноти в Мілані.","rodosy.it")],
  "earlier":"ПОПЕРЕДНІЙ ДОСВІД",
  "past":[("2019 — 2023","КИЇВСЬКИЙ ЛІЦЕЙ","Викладання англійської, репетиторство й освітні матеріали для шкіл Києва."),
          ("2019 — 2021","ВЛАСНИЙ ОНЛАЙН-МАГАЗИН","Текстиль і дитячі товари. Запуск, управління та продаж бізнесу у 2021.")],
  "tools":"ІНСТРУМЕНТИ",
  "education":"ОСВІТА",
  "degree":"Чернівецький національний університет · Філологія, англійська мова та література · 2018",
  "langs_label":"МОВИ",
  "langs":"Українська — рідна · Російська — рідна · Англійська — B2 · Італійська — A1 (вивчаю)"},
 "EN": {
  "profile_title":"PROFILE",
  "profile":"Founder of MAV8. I build AI agents, automations and digital business systems. My approach combines technology, product thinking and experience running businesses to turn complex processes into practical solutions — from concept to implementation.",
  "skills_title":"CORE EXPERTISE",
  "skills":["AI & AUTOMATION  ·  AI agents, LLMs, n8n, APIs, integrations, RAG",
            "DIGITAL PRODUCTS  ·  MVPs, web platforms, UX, product development",
            "BUSINESS SYSTEMS  ·  CRM, sales workflows, operations, process optimization"],
  "experience_title":"PROFESSIONAL EXPERIENCE",
  "jobs":[
   ("2026 — PRESENT","MAV8 · FOUNDER","AI, Automation & Digital Systems company",
    ["Developing MAV8 as a B2B services company and digital solutions and education ecosystem.",
     "Focus: AI agents, business automation, internal systems, analytics and digital products."]),
   ("2024 — PRESENT","INDEPENDENT AI & DIGITAL PROJECTS","AI Automation / Digital Product Development",
    ["Designing AI assistants, agentic workflows and integrations with OpenAI, Claude, n8n and Supabase.",
     "From business problem definition to prototypes and practical implementation."]),
   ("2021 — 2025","ENGLISH LANGUAGE SCHOOL","Founder · Kyiv, Ukraine",
    ["Founded and managed a school across education products, marketing, sales and operations.",
     "Developed an education platform in 2023. Successfully sold the school in 2025."])],
  "page2":"PROJECTS, BUSINESS & EDUCATION",
  "projects":"SELECTED DIGITAL WORK",
  "works":[("AURA ARC","Digital website experience for a guided personal development program.","aura-arc.com"),
           ("RòDoSy","Cultural and educational website for the Ukrainian community in Milan.","rodosy.it")],
  "earlier":"EARLIER EXPERIENCE",
  "past":[("2019 — 2023","KYIV LYCEUM","English-language teaching, private tutoring and learning resources for schools in Kyiv."),
          ("2019 — 2021","ONLINE RETAIL BUSINESS","Textiles and children's goods. Launched, ran and sold the shop in 2021.")],
  "tools":"TOOLS & TECHNOLOGIES",
  "education":"EDUCATION",
  "degree":"Chernivtsi National University · English Language and Literature · Graduated 2018",
  "langs_label":"LANGUAGES",
  "langs":"Ukrainian — Native · Russian — Native · English — B2 · Italian — A1 (learning)"},
 "IT": {
  "profile_title":"PROFILO",
  "profile":"Fondatrice di MAV8. Progetto agenti AI, automazioni e sistemi digitali per le aziende. Unisco tecnologia, visione di prodotto ed esperienza imprenditoriale per trasformare processi complessi in soluzioni concrete — dall’idea all’implementazione.",
  "skills_title":"COMPETENZE PRINCIPALI",
  "skills":["AI E AUTOMAZIONE  ·  Agenti AI, LLM, n8n, API, integrazioni, RAG",
            "PRODOTTI DIGITALI  ·  MVP, piattaforme web, UX, sviluppo di prodotto",
            "SISTEMI AZIENDALI  ·  CRM, flussi commerciali, processi, operatività"],
  "experience_title":"ESPERIENZA PROFESSIONALE",
  "jobs":[
   ("2026 — OGGI","MAV8 · FONDATRICE","Azienda AI, Automation & Digital Systems",
    ["Sviluppo MAV8 come azienda B2B ed ecosistema di soluzioni, prodotti e formazione.",
     "Ambiti: agenti AI, automazione, sistemi interni, analisi dati e prodotti digitali."]),
   ("2024 — OGGI","PROGETTI INDIPENDENTI AI E DIGITAL","AI Automation / Digital Product Development",
    ["Progetto assistenti AI, workflow agentici e integrazioni con OpenAI, Claude, n8n e Supabase.",
     "Dalle esigenze aziendali al prototipo e all'implementazione."]),
   ("2021 — 2025","SCUOLA PRIVATA DI INGLESE","Fondatrice · Kyiv, Ucraina",
    ["Ho fondato e gestito una scuola occupandomi di prodotti, marketing, vendite e processi.",
     "Nel 2023 ho sviluppato una piattaforma educativa. Ho venduto la scuola nel 2025."])],
  "page2":"PROGETTI, IMPRESA E FORMAZIONE",
  "projects":"PROGETTI DIGITALI SELEZIONATI",
  "works":[("AURA ARC","Sito web per un programma guidato di sviluppo personale.","aura-arc.com"),
           ("RòDoSy","Sito culturale ed educativo per la comunità ucraina a Milano.","rodosy.it")],
  "earlier":"ESPERIENZE PRECEDENTI",
  "past":[("2019 — 2023","LICEO DI KYIV","Insegnamento dell'inglese, lezioni private e materiali didattici per le scuole di Kyiv."),
          ("2019 — 2021","NEGOZIO ONLINE","Tessili e prodotti per bambini. Avvio, gestione e vendita dell'attività nel 2021.")],
  "tools":"STRUMENTI E TECNOLOGIE",
  "education":"FORMAZIONE",
  "degree":"Università Nazionale di Černivci · Filologia, Lingua e letteratura inglese · Laurea 2018",
  "langs_label":"LINGUE",
  "langs":"Ucraino — madrelingua · Russo — madrelingua · Inglese — B2 · Italiano — A1 (in apprendimento)"}
}
STYLE = {
 "name": ParagraphStyle("name",fontName="RavBold",fontSize=24,leading=29,textColor=DARK,spaceAfter=4),
 "sub": ParagraphStyle("sub",fontName="Rav",fontSize=8.4,leading=12,textColor=ACCENT,spaceAfter=10),
 "contact": ParagraphStyle("contact",fontName="Rav",fontSize=8,leading=11.5,textColor=MUTED,spaceAfter=2),
 "section": ParagraphStyle("section",fontName="RavBold",fontSize=10.2,leading=14,textColor=DARK,spaceBefore=16,spaceAfter=7),
 "normal": ParagraphStyle("normal",fontName="Rav",fontSize=9.3,leading=14.4,textColor=DARK,spaceAfter=5),
 "small": ParagraphStyle("small",fontName="Rav",fontSize=8.7,leading=13.0,textColor=MUTED,spaceAfter=4),
 "date": ParagraphStyle("date",fontName="Rav",fontSize=8,leading=11,textColor=ACCENT,spaceAfter=3),
 "job": ParagraphStyle("job",fontName="RavBold",fontSize=9.2,leading=13,textColor=DARK,spaceAfter=4),
 "bullet": ParagraphStyle("bullet",fontName="Rav",fontSize=8.7,leading=12.9,textColor=DARK,leftIndent=10,firstLineIndent=-7,spaceAfter=4),
}
def P(text,kind="normal"):
    return Paragraph(escape(text),STYLE[kind])
def section(story,name):
    story.extend([P(name,"section"),HRFlowable(width="100%",thickness=.6,color=LINE,spaceAfter=9)])
def build(code,d):
    path=OUT/f"Marina_Ravliuk_CV_{code}.pdf"
    doc=SimpleDocTemplate(str(path),pagesize=A4,leftMargin=44,rightMargin=44,topMargin=38,bottomMargin=38,
                          title=f"Marina Ravliuk CV {code} 2026",author="Marina Ravliuk")
    story=[P("MARINA RAVLIUK","name"),P("AI AUTOMATION  ·  DIGITAL SYSTEMS  ·  PRODUCT DEVELOPMENT","sub"),
           P("Milano, Italy  ·  info@marinaravliuk.com  ·  +39 351 463 5461","contact"),
           P("mav8.site  ·  linkedin.com/in/marina-rav-609504b9/","contact")]
    section(story,d["profile_title"]);story.append(P(d["profile"]))
    section(story,d["skills_title"])
    for line in d["skills"]:story.append(P(line,"small"))
    section(story,d["experience_title"])
    for date,title,subtitle,points in d["jobs"]:
        story.extend([P(date,"date"),P(title,"job"),P(subtitle,"small")])
        for bullet in points: story.append(P("- "+bullet,"bullet"))
        story.append(Spacer(1,7))
    story.extend([PageBreak(),P("MARINA RAVLIUK","name"),P(d["page2"],"sub")])
    section(story,d["projects"])
    for title,desc,url in d["works"]:
        story.extend([P(title,"job"),P(desc,"small"),P(url,"date"),Spacer(1,4)])
    section(story,d["earlier"])
    for date,title,desc in d["past"]:
        story.extend([P(date,"date"),P(title,"job"),P(desc,"small"),Spacer(1,5)])
    section(story,d["tools"])
    for line in ["AI  ·  OpenAI  ·  Claude  ·  AI agents  ·  LLM  ·  RAG",
                 "AUTOMATION  ·  n8n  ·  Make  ·  APIs  ·  Telegram  ·  Resend",
                 "PRODUCTS  ·  Lovable  ·  Supabase  ·  GitHub  ·  Vercel  ·  Stripe  ·  Figma"]:
        story.append(P(line,"small"))
    section(story,d["education"]);story.append(P(d["degree"],"small"))
    section(story,d["langs_label"]);story.append(P(d["langs"],"small"))
    def footer(canvas,doc):
        canvas.saveState();w,h=A4;canvas.setStrokeColor(LINE);canvas.setLineWidth(.6);canvas.line(44,33,w-44,33)
        canvas.setFont("Rav",7.4);canvas.setFillColor(MUTED)
        canvas.drawString(44,21,"MARINA RAVLIUK  ·  2026")
        canvas.drawRightString(w-44,21,f"{code}  ·  {doc.page:02d}")
        canvas.restoreState()
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
    print(path,len(path.read_bytes()))
for code,data in DATA.items():
    build(code,data)
