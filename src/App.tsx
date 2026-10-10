import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { expertise, languages, processSteps, projects, stack, text, type Language, type Project } from './content';

type RouteState = { lang: Language; project: string | null };
const langNames: Record<Language, string> = { ua: 'УКР', en: 'ENG', it: 'ITA' };

function readRoute(): RouteState {
  const match = window.location.pathname.match(/^\/(ua|en|it)(?:\/projects\/([a-z0-9-]+))?\/?$/);
  return { lang: (match?.[1] as Language) ?? 'ua', project: match?.[2] ?? null };
}

function usePortfolioRoute() {
  const [route, setRoute] = useState<RouteState>(readRoute);
  useEffect(() => {
    if (window.location.pathname === '/') window.history.replaceState(null, '', '/ua');
    const onPop = () => setRoute(readRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (lang: Language, project: string | null = null) => {
    const path = project ? `/${lang}/projects/${project}` : `/${lang}`;
    if (window.location.pathname !== path) window.history.pushState(null, '', path);
    setRoute({ lang, project });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return { route, navigate };
}

function ProjectArt({ project, small = false }: { project: Project; small?: boolean }) {
  return (
    <div className={`project-art project-art--${project.visual}${small ? ' project-art--small' : ''}`} aria-label={`${project.title} — conceptual visual placeholder`} role="img">
      <div className="art-grid" />
      <div className="art-noise" />
      {project.visual === 'aura' && (
        <div className="aura-layout">
          <span className="art-side-label">AURA / EDITION 01</span>
          <div className="aura-orb"><span /></div>
          <div className="aura-title">AURA</div>
          <span className="art-bottom-label">CREATIVE CONCEPT</span>
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
      <span className="placeholder-note">VISUAL CONCEPT · PLACEHOLDER</span>
    </div>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function WorkSection({ lang, openProject }: { lang: Language; openProject: (id: string) => void }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const t = text[lang];
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const candidates = entries.filter((entry) => entry.isIntersecting);
      if (candidates.length) {
        const selected = candidates.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const index = Number((selected.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      }
    }, { rootMargin: '-25% 0px -25% 0px', threshold: [0, 0.15, 0.4, 0.6] });
    stepRefs.current.forEach((element) => { if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  const current = projects[active];
  return (
    <section className="work-section" id="work">
      <div className="container work-head">
        <Reveal><p className="eyebrow eyebrow--dark">{t.selectedLabel}</p></Reveal>
        <Reveal><h2 className="section-title work-title">{t.selectedTitle} <em>{t.selectedTitleItalic}</em></h2></Reveal>
      </div>
      <div className="work-story container">
        <div className="work-sticky">
          <div className="work-preview-wrap">
            <AnimatePresence mode="wait">
              <motion.div key={current.id} className="work-preview" initial={{ opacity: 0, scale: 0.94, y: 25 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.045, y: -20 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
                <ProjectArt project={current} />
              </motion.div>
            </AnimatePresence>
            <div className="preview-bottom"><span>{String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><span>{current.category[lang]}</span></div>
          </div>
        </div>
        <div className="work-steps">
          {projects.map((project, index) => (
            <div className={`work-step ${active === index ? 'is-active' : ''}`} data-index={index} ref={(node) => { stepRefs.current[index] = node; }} key={project.id}>
              <div className="work-step-number">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</div>
              <div className="work-mobile-art"><ProjectArt project={project} small /></div>
              <h3>{project.title}</h3>
              <p className="work-step-category">{project.category[lang]}</p>
              <p className="work-step-desc">{project.summary[lang]}</p>
              {project.inDevelopment && <span className="in-dev">{t.inDevelopment}</span>}
              <button type="button" className="text-link" onClick={() => openProject(project.id)}>{t.caseView} <ArrowUpRight size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio({ lang, navigate }: { lang: Language; navigate: (lang: Language, project?: string | null) => void }) {
  const t = text[lang];
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress: heroScrollProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroPhotoY = useTransform(heroScrollProgress, [0, 1], [0, -26]);
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
                    <span>AI AGENTS <i>✳</i> AI AGENTS <i>✳</i>&nbsp;</span>
                    <span>AI AGENTS <i>✳</i> AI AGENTS <i>✳</i>&nbsp;</span>
                  </div>
                </div>
                <div className="hero-motion-row hero-motion-row--automation">
                  <div className="hero-motion-track">
                    <span>AUTOMATION <i>✳</i> AUTOMATION <i>✳</i>&nbsp;</span>
                    <span>AUTOMATION <i>✳</i> AUTOMATION <i>✳</i>&nbsp;</span>
                  </div>
                </div>
                <div className="hero-motion-row hero-motion-row--systems">
                  <div className="hero-motion-track">
                    <span>DIGITAL SYSTEMS <i>✳</i> DIGITAL SYSTEMS <i>✳</i>&nbsp;</span>
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
            <p className="about-editorial-lead">{t.aboutStatement}</p>
          </Reveal>
          <Reveal className="about-editorial-portrait" delay={0.1}>
            <figure className="about-photo-frame">
              <img src="/images/marina-about.webp" alt="Marina Rav — digital products, AI and business systems" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/marina-hero.webp'; }} />
              <figcaption><span>MARINA RAV</span><span>MILANO · ITALIA</span></figcaption>
            </figure>
          </Reveal>
          <div className="about-editorial-details">
            <Reveal><p>{t.aboutText}</p></Reveal>
            <Reveal delay={0.08}><p>{t.aboutSecond}</p></Reveal>
            <Reveal><div className="about-editorial-foot"><span>{t.aboutPhotoCaption}</span><span>45°27′N · 9°11′E</span></div></Reveal>
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
          <div className="journey-timeline">
            {[
              { year: '2024 — '+t.journeyNow, name: t.journeyAI, description: t.journeyAIDescription, number: '01' },
              { year: '2025', name: t.journeyExit, description: t.journeyExitDescription, number: '02' },
              { year: '2023', name: t.journeyPlatform, description: t.journeyPlatformDescription, number: '03' },
              { year: '2021 — 2025', name: t.journeySchool, description: t.journeySchoolDescription, number: '04' },
              { year: '2018', name: t.journeyEducation, description: t.journeyEducationDescription, number: '05' }
            ].map((item, index) => (
              <Reveal key={item.number} delay={index * .04}>
                <article className="journey-item">
                  <span className="journey-number">{item.number}</span>
                  <span className="journey-year">{item.year}</span>
                  <div className="journey-item-content"><h3>{item.name}</h3><p>{item.description}</p></div>
                  <span className="journey-plus" aria-hidden="true">↗</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="expertise-section" id="expertise"><div className="container">
        <Reveal><p className="eyebrow">{t.expertiseLabel}</p><h2 className="section-title">{t.expertiseTitle}<em>.</em></h2></Reveal>
        <div className="expertise-list">{expertise.map((item, index) => <Reveal delay={index * 0.045} key={item.number}><div className="expertise-row"><span>{item.number}</span><h3>{item.title[lang]}</h3><p>{item.description[lang]}</p><ArrowUpRight size={24}/></div></Reveal>)}</div>
      </div></section>
      <WorkSection lang={lang} openProject={(id) => navigate(lang, id)} />
      <section className="process-section" id="process"><div className="container">
        <Reveal><p className="eyebrow eyebrow--dark">{t.processLabel}</p><h2 className="section-title">{t.processTitle}</h2></Reveal>
        <div className="process-grid">{processSteps.map((step, index) => <Reveal delay={index * 0.07} key={step.number}><div className="process-card"><div className="process-card-head"><span>{step.number}</span><span className="process-line" /></div><h3>{step.title[lang]}</h3><p>{step.description[lang]}</p></div></Reveal>)}</div>
      </div></section>
      <section className="mav8-section"><div className="container mav8-grid">
        <Reveal><div className="mav8-text"><p className="eyebrow">{t.mav8Label}</p><h2>{t.mav8Title}</h2><p>{t.mav8Body}</p><a className="pill-link" href="https://mav8.site" target="_blank" rel="noopener noreferrer">{t.visitMav8}<ArrowUpRight size={17}/></a></div></Reveal>
        <Reveal delay={0.1}><button type="button" className="mav8-feature mav8-feature-3d" onClick={() => navigate(lang, "mav8")} aria-label={`${t.caseView}: MAV8`}><div className="mav8-feature-circle">M<span>8</span></div><strong>MAV8</strong><small>AI / AUTOMATION / DIGITAL ECOSYSTEM</small><span className="mav8-feature-view">{t.caseView}<ArrowUpRight size={17}/></span></button></Reveal>
      </div></section>
      <section className="stack-section"><div className="container"><p className="eyebrow eyebrow--dark">{t.stackLabel}</p><div className="stack-wrap">{stack.map((name) => <span key={name}>{name}</span>)}</div></div></section>
      <section className="contact-section" id="contact"><div className="container">
        <Reveal><p className="eyebrow">{t.contactLabel}</p><h2>{t.contactTitle}<br/><em>{t.contactItalic}</em></h2><p className="contact-intro">{t.contactText}</p><a className="contact-button" href="mailto:info@marinaravliuk.com?subject=Collaboration%20with%20Marina%20Rav">{t.contactButton}<ArrowUpRight size={22}/></a></Reveal>
      </div></section>
    </>
  );
}

function ProjectPage({ lang, project, navigate }: { lang: Language; project: Project; navigate: (lang: Language, project?: string | null) => void }) {
  const t = text[lang];
  const next = projects[(projects.findIndex((item) => item.id === project.id) + 1) % projects.length];
  return <main className="case-page">
    <div className="container case-head">
      <button type="button" className="back-link" onClick={() => navigate(lang)}><ArrowLeft size={17}/>{t.backToWork}</button>
      <div className="case-kicker"><span>{t.published}</span><span>{String(projects.indexOf(project)+1).padStart(2,'0')} / 05</span></div>
      <h1>{project.title}<span>↗</span></h1><p>{project.summary[lang]}</p>
    </div>
    <div className="container case-art"><ProjectArt project={project}/></div>
    <div className="container case-content">
      <div className="case-detail"><p className="eyebrow eyebrow--dark">{t.aboutProject}</p><p>{project.detail[lang]}</p><p className="case-muted">{t.comingSoon}</p></div>
      <aside><div><span>{t.projectType}</span><strong>{project.category[lang]}</strong></div>{project.inDevelopment && <div><span>{t.projectStatus}</span><strong>{t.inDevelopment}</strong></div>}{project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{t.visitMav8}<ArrowUpRight size={17}/></a>}</aside>
    </div>
    <div className="container next-project"><span>{t.nextProject}</span><button onClick={() => navigate(lang,next.id)} type="button">{next.title}<ArrowRight size={34}/></button></div>
  </main>;
}

export default function App() {
  const { route, navigate } = usePortfolioRoute();
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
  const navItems = [{ id: 'about', title: t.navAbout }, { id: 'journey', title: t.navJourney }, { id: 'expertise', title: t.navExpertise }, { id: 'work', title: t.navWork }, { id: 'process', title: t.navProcess }, { id: 'contact', title: t.navContact }];
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
    {project ? <ProjectPage lang={route.lang} project={project} navigate={navigate}/> : <main><Portfolio lang={route.lang} navigate={navigate}/></main>}
    <footer className="site-footer"><div className="container footer-inner"><span>© {new Date().getFullYear()} MARINA RAV</span><span>{t.footer}</span><button type="button" onClick={() => { if (project) navigate(route.lang); else window.scrollTo({top:0,behavior:'smooth'}); }}>BACK TO TOP ↑</button></div></footer>
  </div>;
}
