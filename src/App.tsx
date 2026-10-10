import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { languages, projects, text, type Language, type Project } from './content';

type RouteState = { lang: Language; project: string | null };
const langNames: Record<Language, string> = { ua: 'УКР', en: 'ENG', it: 'ITA' };

function readRoute(): RouteState {
  const match = window.location.pathname.match(/^\/(ua|en|it)(?:\/projects\/([a-z0-9-]+))?\/?$/);
  return { lang: (match?.[1] as Language) ?? 'ua', project: match?.[2] ?? null };
}

function usePortfolioRoute() {
  const [route, setRoute] = useState<RouteState>(readRoute);
  const [lastProjectId, setLastProjectId] = useState<string | null>(() => readRoute().project);
  useEffect(() => {
    if (window.location.pathname === '/') window.history.replaceState(null, '', '/ua');
    const onPop = () => { const nextRoute = readRoute(); setRoute(nextRoute); if (nextRoute.project) setLastProjectId(nextRoute.project); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (lang: Language, project: string | null = null) => {
    const path = project ? `/${lang}/projects/${project}` : `/${lang}`;
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
    setRoute({ lang, project });
    if (project) setLastProjectId(project);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return { route, navigate, lastProjectId };
}

function ProjectArt({ project, small = false }: { project: Project; small?: boolean }) {
  return (
    <div className={`project-art project-art--${project.visual}${small ? ' project-art--small' : ''}`} aria-label={`${project.title} — ${project.visual === 'aura' || project.visual === 'rodus' ? 'design interpretation of the live website' : 'conceptual visual placeholder'}`} role="img">
      <div className="art-grid" />
      <div className="art-noise" />
      {project.visual === 'aura' && (
        <div className="real-site-scene real-site-scene--aura">
          <div className="real-site-window">
            <div className="real-site-toolbar" aria-hidden="true">
              <span className="real-site-window-dots">● ● ●</span>
              <span>aura-arc.com</span>
            </div>
            <div className="real-site-content real-site-content--aura">
              <img className="real-site-aura-logo"
                src="https://aura-arc.com/__l5e/assets-v1/189467cc-271b-4f27-9c16-41659b099c09/aura-arc-logo.png"
                alt="" loading="lazy"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              <span className="real-site-eyebrow">A NEURO-IDENTITY PROGRAM</span>
              <strong>AURA ARC</strong>
              <p>A guided transformation from inherited patterns to a conscious identity.</p>
              <div className="real-site-aura-stages" aria-hidden="true">
                <span>SHADOW</span><span>REWIRING</span><span>REGULATION</span><span>AWAKENING</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {project.visual === 'rodus' && (
        <div className="real-site-scene real-site-scene--rodosy">
          <div className="real-site-window">
            <div className="real-site-toolbar" aria-hidden="true">
              <span className="real-site-window-dots">● ● ●</span>
              <span>rodosy.it</span>
            </div>
            <div className="real-site-content real-site-content--rodosy">
              <div className="real-site-rodosy-nav"><span>RòDoSy</span><span>UA / IT</span></div>
              <span className="real-site-eyebrow">РÒДОСИ · ЦЕНТР КУЛЬТУРИ ТА РОЗВИТКУ</span>
              <strong>Українська освіта,<br />культура та спільнота<br />в Мілані</strong>
              <p>Місце, де ваші ідеї знаходять підтримку, а таланти — можливість розкритися.</p>
              <span className="real-site-rodosy-pill">Освіта · Культура · Спільнота</span>
            </div>
          </div>
        </div>
      )}
      {project.visual === 'mav8' && (
        <div className="mav8-layout">
          <div className="mav8-globe"><span>M</span><span>A</span><span>V</span><span>8</span></div>
          <div className="mav8-art-title">MAV8<span>®</span></div>
          <div className="mav8-art-caption">AI · AUTOMATION · DIGITAL SYSTEMS</div>
        </div>
      )}
      {project.visual === 'nova' && (
        <div className="nova-layout">
          <div className="nova-core"><div className="nova-core-inner" /></div>
          <span className="nova-title">NOVA</span>
          <span className="nova-caption">ARTIFICIAL INTELLIGENCE / AGENT</span>
        </div>
      )}
      {project.visual === 'sasha' && (
        <div className="game-layout">
          <div className="game-chess"><span>PLAY</span><div className="game-dial">↗</div></div>
          <div className="game-title">LET'S<br />PLAY.</div>
          <span className="game-caption">INTERACTIVE EXPERIENCE</span>
        </div>
      )}
      {project.visual === 'natalia' && (
        <div className="natalia-layout">
          <div className="natalia-tile tile-one">?</div><div className="natalia-tile tile-two">+</div><div className="natalia-tile tile-three">✳</div>
          <div className="natalia-title">COMING<br /><em>TO LIFE.</em></div>
          <span className="natalia-caption">WORK IN PROGRESS</span>
        </div>
      )}
      {project.visual !== 'aura' && project.visual !== 'rodus' && <span className="placeholder-note">VISUAL CONCEPT · PLACEHOLDER</span>}
    </div>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function WorkSection({ lang, openProject, initialProjectId }: { lang: Language; openProject: (id: string) => void; initialProjectId: string | null }) {
  const [active, setActive] = useState(() => Math.max(0, projects.findIndex((item) => item.id === initialProjectId)));
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const t = text[lang];
  const current = projects[active];

  function changeSlide(next: number) {
    const length = projects.length;
    const target = ((next % length) + length) % length;
    if (target === active) return;
    setDirection(next > active ? 1 : -1);
    setActive(target);
  }

  return (
    <section className="work-section" id="work">
      <div className="container work-head">
        <Reveal><p className="eyebrow eyebrow--dark">{t.selectedLabel}</p></Reveal>
        <Reveal><h2 className="section-title work-title">{t.selectedTitle} <em>{t.selectedTitleItalic}</em></h2></Reveal>
      </div>
      <div className="container selected-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={t.selectedTitle}
        onKeyDown={(event) => {
          if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;
          if (event.key === 'ArrowRight') { event.preventDefault(); changeSlide(active + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); changeSlide(active - 1); }
        }}
        tabIndex={0}
      >
        <div className="selected-carousel-topline">
          <span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          <span>{t.carouselHint}</span>
        </div>
        <div className="selected-carousel-layout">
          <div className="selected-carousel-visual" aria-live="off">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={current.id} className="selected-carousel-slide"
                initial={reducedMotion ? false : { opacity: 0, x: direction * 65, scale: .97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: direction * -50, scale: .985 }}
                transition={{ duration: reducedMotion ? 0 : .42, ease: [0.22, 1, 0.36, 1] }}
                drag={reducedMotion ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={.18}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -65 || info.velocity.x < -450) changeSlide(active + 1);
                  if (info.offset.x > 65 || info.velocity.x > 450) changeSlide(active - 1);
                }}
              >
                <ProjectArt project={current} />
              </motion.div>
            </AnimatePresence>
            <span className="selected-carousel-visual-caption">{current.title} / {current.category[lang]}</span>
          </div>
          <div className="selected-carousel-info" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div className="selected-carousel-info-inner" key={current.id}
                initial={reducedMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reducedMotion ? 0 : .32 }}
              >
                <span className="selected-carousel-category">{current.category[lang]}</span>
                <h3>{current.title}</h3>
                <p>{current.summary[lang]}</p>
                {current.inDevelopment && <span className="in-dev">{t.inDevelopment}</span>}
                <button type="button" className="text-link" onClick={() => openProject(current.id)}>
                  {t.caseView} <ArrowUpRight size={19} />
                </button>
              </motion.div>
            </AnimatePresence>
            <div className="selected-carousel-bottom">
              <div className="selected-carousel-arrows">
                <button type="button" onClick={() => changeSlide(active - 1)} aria-label={t.carouselPrev}><ArrowLeft size={23}/></button>
                <button type="button" onClick={() => changeSlide(active + 1)} aria-label={t.carouselNext}><ArrowRight size={23}/></button>
              </div>
              <div className="selected-carousel-pagination" role="group" aria-label={t.carouselChoose}>
                {projects.map((project, index) => (
                  <button type="button" key={project.id}
                    className={active === index ? 'is-active' : ''}
                    aria-label={`${t.carouselChoose}: ${project.title}`}
                    aria-current={active === index ? 'true' : undefined}
                    onClick={() => changeSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyTimeline({ lang }: { lang: Language }) {
  const t = text[lang];
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const items = [
    { year: '2018', period: '2018', title: t.journeyEducation, description: t.journeyEducationDescription },
    { year: '2019', period: '2019 — 2023', title: t.journeyEarlyTitle, description: t.journeyEarlyDescription },
    { year: '2021', period: '2021', title: t.journeyFirstExitTitle, description: t.journeyFirstExitDescription },
    { year: '2023', period: '2023', title: t.journeyPlatform, description: t.journeyPlatformDescription },
    { year: '2024', period: '2024 — ' + t.journeyNow, title: t.journeyAI, description: t.journeyAIDescription },
    { year: '2025', period: '2025', title: t.journeyExit, description: t.journeyExitDescription },
    { year: '2026', period: t.journeyMav8Period, title: t.journeyMav8Title, description: t.journeyMav8Description },
  ];

  return (
    <div className="journey-years">
      <p className="journey-years-hint">{t.journeyHint}</p>
      <div className="journey-years-list">
        {items.map((item, index) => {
          const open = active === index;
          const panelId = `journey-panel-${index}`;
          return (
            <article key={item.year} className={`journey-years-item${open ? ' is-open' : ''}`}>
              <button type="button" className="journey-years-trigger"
                aria-expanded={open} aria-controls={panelId}
                onClick={() => setActive(open ? null : index)}
              >
                <span>{item.year}</span>
                <span className="journey-years-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div key="panel" id={panelId} className="journey-years-panel"
                    initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }}
                    role="region" aria-label={item.title}
                  >
                    <div className="journey-years-content">
                      <span className="journey-years-period">{item.period}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      {item.year === '2026' && (
                        <a href="https://mav8.site/" target="_blank" rel="noopener noreferrer">
                          {t.visitMav8}<ArrowUpRight size={17}/>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Portfolio({ lang, navigate, lastProjectId }: { lang: Language; navigate: (lang: Language, project?: string | null) => void; lastProjectId: string | null }) {
  const t = text[lang];
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroPhotoY = useTransform(heroScrollProgress, [0, 1], [0, -16]);
  return (
    <>
      <section ref={heroRef} className="hero hero-editorial" id="top">
        <div className="hero-editorial-texture" aria-hidden="true" />
        <div className="container hero-editorial-inner">
          <div className="hero-editorial-meta">
            <span className="hero-editorial-kicker">{t.heroEyebrow}</span>
            <span className="hero-editorial-availability"><span className="availability-dot" />{t.availability}</span>
          </div>
          <div className="hero-editorial-stage">
            <div className="hero-photo-scene">
              <div className="hero-motion-type" aria-hidden="true">
                <div className="hero-motion-row hero-motion-row--agents">
                  <div className="hero-motion-track">
                    <span>AI AGENTS · AI AGENTS ·&nbsp;</span>
                    <span>AI AGENTS <i>✳</i> AI AGENTS <i>✳</i>&nbsp;</span>
                  </div>
                </div>
                <div className="hero-motion-row hero-motion-row--automation">
                  <div className="hero-motion-track">
                    <span>AUTOMATION · AUTOMATION ·&nbsp;</span>
                    <span>AUTOMATION <i>✳</i> AUTOMATION <i>✳</i>&nbsp;</span>
                  </div>
                </div>
                <div className="hero-motion-row hero-motion-row--systems">
                  <div className="hero-motion-track">
                    <span>DIGITAL SYSTEMS · DIGITAL SYSTEMS ·&nbsp;</span>
                    <span>DIGITAL SYSTEMS <i>✳</i> DIGITAL SYSTEMS <i>✳</i>&nbsp;</span>
                  </div>
                </div>
              </div>
              <motion.div className="hero-editorial-photo" style={reducedMotion ? undefined : { y: heroPhotoY }} initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                <div className="hero-photo-fallback" aria-hidden="true"><span>MR</span><small>MARINA RAV</small></div>
                <img src="/images/marina-hero.webp" alt="Marina Rav — портрет у шоколадному костюмі" decoding="async" fetchPriority="high" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
              </motion.div>
              </div>
            <motion.div className="hero-editorial-name" initial={reducedMotion ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.35 }}>
              <h1>MARINA <em>RAV</em></h1>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="about-section about-editorial" id="about">
        <div className="container about-editorial-grid">
          <Reveal className="about-editorial-intro">
            <p className="eyebrow eyebrow--dark">{t.aboutLabel}</p>
            <h2 className="section-title">{t.aboutHeadingA}<br/><em>{t.aboutHeadingB}</em><br/>{t.aboutHeadingC}</h2>
            <p className="about-editorial-lead">{t.aboutStatement}</p><div className="about-skills"><span>AI Agents</span><span>Business Automation</span><span>Digital Systems</span><span>Digital Products</span></div>
          </Reveal>
          <Reveal className="about-editorial-portrait" delay={0.1}>
            <figure className="about-photo-frame">
              <img src="/images/marina-about.webp" alt="Marina Rav — digital products, AI and business systems" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/marina-hero.webp'; }} />
              <figcaption><span>MARINA RAV</span><span>MILANO · ITALIA</span></figcaption>
            </figure>
          </Reveal>
          <div className="about-editorial-details">
            <Reveal><p>{t.aboutText}</p></Reveal>
            
            
          </div>
        </div>
      </section>
      <section className="journey-section" id="journey">
        <div className="container">
          <div className="journey-heading">
            <Reveal><p className="eyebrow">{t.journeyLabel}</p>
              <h2>{t.journeyTitle}<br/><em>{t.journeyItalic}</em></h2>
              <p className="journey-intro">{t.journeyIntro}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <a className="journey-cv-link" href="/images/marina-ravliuk-cv.pdf" download="Marina_Ravliuk_CV.pdf">
                <span>{t.cvDownload}</span><Download size={21}/>
              </a>
            </Reveal>
          </div>
          <JourneyTimeline lang={lang} />
        </div>
      </section>
      <WorkSection lang={lang} initialProjectId={lastProjectId} openProject={(id) => navigate(lang, id)} />
      <section className="contact-section" id="contact"><div className="container">
        <Reveal><p className="eyebrow">{t.contactLabel}</p><h2>{t.contactTitle}<br/><em>{t.contactItalic}</em></h2><p className="contact-intro">{t.contactText}</p>
          <a className="contact-button" href="mailto:info@marinaravliuk.com?subject=Collaboration%20with%20Marina%20Rav" aria-label={t.contactButton}>{t.contactButton}<ArrowUpRight size={22}/></a>
          <nav className="contact-social-links" aria-label="Social profiles">
            <a href="https://www.instagram.com/marinaravvv/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14}/></a>
            <a href="https://www.linkedin.com/in/marina-rav-609504b9/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14}/></a>
          </nav>
        </Reveal>
      </div></section>
    </>
  );
}

function ProjectPage({ lang, project, navigate }: { lang: Language; project: Project; navigate: (lang: Language, project?: string | null) => void }) {
  const t = text[lang];
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState<'visual' | 'context'>('visual');
  const index = projects.findIndex((item) => item.id === project.id);
  const next = projects[(index + 1) % projects.length];
  const backToWork = () => {
    navigate(lang);
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() =>
        document.getElementById('work')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
      )
    );
  };

  return <motion.main className="case-page case-page-v2"
    initial={reducedMotion ? false : { opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: reducedMotion ? 0 : .5, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="container case-head case-head-v2">
      <button type="button" className="back-link" onClick={backToWork}>
        <ArrowLeft size={18}/>{t.backToWork}
      </button>
      <div className="case-kicker"><span>{t.caseIndexLabel}</span><span>{String(index + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span></div>
      <div className="case-title-row">
        <h1>{project.title}</h1>
        <span className="case-title-mark" aria-hidden="true">↗</span>
      </div>
      <p className="case-lead">{project.summary[lang]}</p>
      <div className="case-tag-list" aria-label={t.projectType}>
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </div>

    <section className="container case-showcase" aria-label={t.caseShowcase}>
      <div className="case-showcase-nav">
        <span>{t.caseShowcase}</span>
        <div className="case-view-switch" role="group" aria-label={t.caseShowcase}>
          <button type="button" className={view === 'visual' ? 'is-selected' : ''}
            aria-pressed={view === 'visual'} onClick={() => setView('visual')}>
            <span>01</span> {t.caseViewVisual}
          </button>
          <button type="button" className={view === 'context' ? 'is-selected' : ''}
            aria-pressed={view === 'context'} onClick={() => setView('context')}>
            <span>02</span> {t.caseViewContext}
          </button>
        </div>
      </div>
      <div className="case-showcase-stage">
        <AnimatePresence mode="wait" initial={false}>
          {view === 'visual'
            ? <motion.div key="visual" className="case-showcase-slide"
                initial={reducedMotion ? false : { opacity: 0, y: 18, scale: .99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -15, scale: 1.01 }}
                transition={{ duration: reducedMotion ? 0 : .35, ease: [0.22, 1, 0.36, 1] }}>
                <ProjectArt project={project}/>
              </motion.div>
            : <motion.div key="context" className="case-showcase-slide case-context-visual"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -15 }}
                transition={{ duration: reducedMotion ? 0 : .35, ease: [0.22, 1, 0.36, 1] }}>
                <div className="case-context-top"><span>MARINA RAV / {String(index + 1).padStart(2,'0')}</span><span>{project.category[lang]}</span></div>
                <div className="case-context-main"><span>{t.caseDetailsTitle}</span><h2>{project.title}</h2><p>{project.summary[lang]}</p></div>
                <div className="case-context-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </motion.div>}
        </AnimatePresence>
      </div>
      <div className="case-showcase-caption">
        <span>{project.title} · {t.caseShowcase}</span>
        <span>{t.caseVisualNote}</span>
      </div>
    </section>

    <section className="container case-content case-content-v2" aria-labelledby="case-about-heading">
      <Reveal className="case-detail">
        <p className="eyebrow eyebrow--dark">{t.aboutProject}</p>
        <h2 id="case-about-heading">{t.caseDetailsTitle}</h2>
        <p className="case-description">{project.detail[lang]}</p>
      </Reveal>
      <aside className="case-aside">
        <div className="case-fact">
          <span>{t.projectType}</span>
          <strong>{project.category[lang]}</strong>
        </div>
        <div className="case-fact">
          <span>{t.projectIndex}</span>
          <strong>{String(index + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</strong>
        </div>
        {project.inDevelopment && <div className="case-fact"><span>{t.projectStatus}</span><strong>{t.inDevelopment}</strong></div>}
        {project.url
          ? <a className="case-site-link" href={project.url} target="_blank" rel="noopener noreferrer">
              {project.id === 'mav8' ? t.visitMav8 : t.visitWebsite}<ArrowUpRight size={18}/>
            </a>
          : <p className="case-muted">{t.comingSoon}</p>}
      </aside>
    </section>

    <section className="container next-project case-next-v2">
      <span>{t.caseNextNote}</span>
      <button type="button" onClick={() => navigate(lang, next.id)}
        aria-label={`${t.nextProject}: ${next.title}`}>
        <span>{next.title}</span><ArrowRight size={33}/>
      </button>
    </section>
  </motion.main>;
}

export default function App() {
  const { route, navigate, lastProjectId } = usePortfolioRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = text[route.lang];
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 35 });
  const project = projects.find((item) => item.id === route.project);
  useEffect(() => {
    document.documentElement.lang = route.lang === 'ua' ? 'uk' : route.lang;
    document.title = project ? `${project.title} — Marina Rav` : 'Marina Rav — AI Automation & Digital Systems';
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = project ? project.summary[route.lang] : t.heroIntro;
    languages.forEach((language) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language === 'ua' ? 'uk' : language}"]`);
      if (!link) { link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = language === 'ua' ? 'uk' : language; document.head.appendChild(link); }
      link.href = window.location.origin + `/${language}` + (project ? `/projects/${project.id}` : '');
    });
  }, [route.lang, project, t.heroIntro]);

  const gotoSection = (id: string) => {
    setMenuOpen(false);
    if (project) {
      navigate(route.lang);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })));
    } else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  const navItems = [{ id: 'about', title: t.navAbout }, { id: 'journey', title: t.navJourney }, { id: 'work', title: t.navWork }, { id: 'contact', title: t.navContact }];
  return <div className="portfolio">
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <header className="site-header"><div className="container header-inner">
      <button className="logo logo-editorial" aria-label="Home" type="button" onClick={() => { setMenuOpen(false); navigate(route.lang); }}>MARINA RAV</button>
      <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => <button type="button" key={item.id} onClick={() => gotoSection(item.id)}>{item.title}</button>)}
      </nav>
      <div className="header-end"><div className="language-switch" aria-label="Choose language">{languages.map((language) => <button key={language} type="button" aria-pressed={route.lang === language} className={route.lang === language ? 'is-current' : ''} onClick={() => {setMenuOpen(false);navigate(language,project?.id ?? null);}}>{langNames[language]}</button>)}</div>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23}/> : <Menu size={23}/>}</button></div>
    </div></header>
    {project ? <ProjectPage key={project.id} lang={route.lang} project={project} navigate={navigate}/> : <main><Portfolio lang={route.lang} navigate={navigate} lastProjectId={lastProjectId}/></main>}
    <footer className="site-footer">
      <div className="container footer-inner footer-bottom">
        <span>© {new Date().getFullYear()} MARINA RAV</span>
        <span>{t.footer}</span>
        <button type="button" onClick={() => { if (project) navigate(route.lang); else window.scrollTo({top:0,behavior:'smooth'}); }}>{t.backToTop} ↑</button>
      </div>
    </footer>
  </div>;
}
