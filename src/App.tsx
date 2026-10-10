import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { languages, projects, stack, text, type Language, type Project } from './content';

type RouteState = { lang: Language };
const langNames: Record<Language, string> = { ua: 'УКР', en: 'ENG', it: 'ITA' };

function readRoute(): RouteState {
  const match = window.location.pathname.match(/^\/(ua|en|it)(?:\/projects\/[a-z0-9-]+)?\/?$/);
  const lang: Language = (match?.[1] as Language) ?? 'ua';
  // Old case URLs should never strand visitors on removed internal pages.
  if (window.location.pathname.includes('/projects/')) {
    window.history.replaceState(null, '', `/${lang}#work`);
  }
  return { lang };
}

function usePortfolioRoute() {
  const [route, setRoute] = useState<RouteState>(readRoute);
  useEffect(() => {
    if (window.location.pathname === '/') window.history.replaceState(null, '', '/ua');
    const onPop = () => setRoute(readRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (lang: Language) => {
    const path = `/${lang}`;
    if (window.location.pathname !== path || window.location.hash) window.history.pushState(null, '', path);
    setRoute({ lang });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return { route, navigate };
}

function ProjectArt({ project, small = false, imageIndex = 0, onImageReady }: { project: Project; small?: boolean; imageIndex?: number; onImageReady?: (ready: boolean) => void }) {
  // Keep every real screenshot mounted so switching images never reveals a
  // conceptual mockup or flashes while a new <img> starts decoding.
  if (project.gallery?.length) {
    return (
      <div className={`project-art project-art--${project.visual} project-art--gallery${small ? ' project-art--small' : ''}`}
        role="img" aria-label={`${project.title} — website screenshots`}>
        {project.gallery.map((src, index) => (
          <img key={src} src={src} alt=""
            className={`project-gallery-image${index === imageIndex ? ' is-active' : ''}`}
            draggable={false} loading="eager" decoding="async"
            onLoad={(event) => onImageReady?.(event.currentTarget.complete)}
            onError={(event) => { event.currentTarget.style.visibility = 'hidden'; onImageReady?.(false); }}
          />
        ))}
      </div>
    );
  }
  const imageSrc = project.gallery?.[imageIndex];
  return (
    <div className={`project-art project-art--${project.visual}${small ? ' project-art--small' : ''}`} aria-label={`${project.title} — ${project.gallery?.length ? 'screenshots from the live website' : 'visual concept'}`} role="img">
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
      {project.visual === 'pleasure' && (
        <div className="real-site-scene real-site-scene--pleasure">
          <div className="real-site-window real-site-window--pleasure">
            <div className="real-site-toolbar" aria-hidden="true">
              <span className="real-site-window-dots">● ● ●</span>
              <span>pleasuremapmilano.lovable.app</span>
            </div>
            <div className="real-site-pleasure-screen">
              <img
                src="https://pleasuremapmilano.lovable.app/__l5e/assets-v1/45e7d195-eb12-4725-8ee1-7c8af75efdb1/hero.png"
                alt="" loading="lazy"
              />
              <div className="real-site-pleasure-overlay">
                <span>PLEASURE MAP</span>
                <strong>Pleasure Map <em>Milano</em></strong>
                <p>Жива зустріч · 18 жовтня · Мілан</p>
              </div>
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
      {project.visual !== 'aura' && project.visual !== 'rodus' && project.visual !== 'pleasure' && <span className="placeholder-note">VISUAL CONCEPT · PLACEHOLDER</span>}
      {imageSrc && <img
        key={imageSrc}
        className="project-art-screenshot"
        src={imageSrc}
        alt=""
        draggable={false}
        loading={small ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={(event) => {
          event.currentTarget.classList.add('is-loaded');
          onImageReady?.(true);
        }}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          onImageReady?.(false);
        }}
      />}
    </div>
  );
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div className={className} initial={reducedMotion ? false : { opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function WorkSection({ lang }: { lang: Language }) {
  const [active, setActive] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
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
    setImageIndex(0);
  }

  function changeImage(delta: number) {
    const length = current.gallery?.length ?? 0;
    if (length < 2) return;
    setImageIndex((index) => (index + delta + length) % length);
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
                <ProjectArt project={current} imageIndex={imageIndex} />
              </motion.div>
            </AnimatePresence>
            <div className="selected-carousel-preview-footer">
              <span className="selected-carousel-visual-caption">{current.title} / {current.category[lang]}</span>
              {(current.gallery?.length ?? 0) > 1 && (
                <div className="selected-carousel-image-nav" aria-label={t.caseScreenshotNote}>
                  <button type="button" onClick={() => changeImage(-1)} aria-label={`${t.caseScreenshotNote}: ${((imageIndex - 1 + (current.gallery?.length ?? 1)) % (current.gallery?.length ?? 1)) + 1}`}><ArrowLeft size={18}/></button>
                  <span aria-live="polite">{String(imageIndex + 1).padStart(2, '0')} / {String(current.gallery?.length ?? 0).padStart(2, '0')}</span>
                  <button type="button" onClick={() => changeImage(1)} aria-label={`${t.caseScreenshotNote}: ${((imageIndex + 1) % (current.gallery?.length ?? 1)) + 1}`}><ArrowRight size={18}/></button>
                </div>
              )}
            </div>
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
                <div className="selected-carousel-tags" aria-label={t.projectType}>
                  {current.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                {current.inDevelopment && <span className="in-dev">{t.inDevelopment}</span>}
                {current.url && (
                  <a className="text-link selected-carousel-live-link" href={current.url}
                    target="_blank" rel="noopener noreferrer"
                    aria-label={`${t.visitWebsite}: ${current.title}`}>
                    {t.visitWebsite} <ArrowUpRight size={19} />
                  </a>
                )}
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

function Portfolio({ lang }: { lang: Language }) {
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
                <img src="/images/marina-hero-v3.webp" alt="Marina Rav — діловий editorial-портрет із телефоном та кавою" decoding="async" fetchPriority="high" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/marina-hero-v2.webp'; }} />
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
              <img src="/images/marina-about-v2.webp" alt="Marina Rav — editorial-фото з ноутбуком" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/marina-about.webp'; }} />
              <figcaption><span>MARINA RAV</span><span>MILANO · ITALIA</span></figcaption>
            </figure>
          </Reveal>
          <div className="about-editorial-details">
            <Reveal><p>{t.aboutText}</p></Reveal>
            
            
          </div>
        </div>
      </section>
      <section className="tools-ribbon" aria-label={t.stackLabel}>
        <div className="container tools-ribbon-heading">
          <span>{t.stackLabel}</span>
          <span aria-hidden="true">AI · AUTOMATION · DIGITAL SYSTEMS</span>
        </div>
        <div className="tools-ribbon-mask">
          <div className="tools-ribbon-track">
            {[0, 1].map((copy) => (
              <div className="tools-ribbon-sequence" key={copy} aria-hidden={copy === 1}>
                {stack.map((tool) => (
                  <span className="tools-ribbon-name" key={tool}>{tool}</span>
                ))}
              </div>
            ))}
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
      <WorkSection lang={lang} />
      <section className="mav8-section mav8-company-section" id="mav8" aria-labelledby="mav8-company-heading">
        <div className="container mav8-grid">
          <Reveal className="mav8-text mav8-company-text">
            <p className="eyebrow">{t.mav8Label}</p>
            <h2 id="mav8-company-heading">MAV8<span className="mav8-company-asterisk">®</span></h2>
            <p className="mav8-company-statement">{t.mav8Title}</p>
            <p>{t.mav8Body}</p>
            <div className="mav8-company-skills" aria-label="MAV8 skills">
              {['MAKE', 'AI', 'AUTOMATE', 'AGENTS', 'BUILD', 'SELL', 'DATA', 'CREATE'].map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            <a className="pill-link mav8-company-cta" href="https://mav8.site/" target="_blank" rel="noopener noreferrer">
              {t.visitMav8}<ArrowUpRight size={19}/>
            </a>
          </Reveal>
          <Reveal delay={0.12} className="mav8-company-feature">
            <a className="mav8-feature mav8-feature-3d" href="https://mav8.site/" target="_blank" rel="noopener noreferrer" aria-label={t.visitMav8}>
              <div className="mav8-feature-circle">M<span>8</span></div>
              <strong>MAV8</strong>
              <small>AI · AUTOMATION · DIGITAL SYSTEMS</small>
              <span className="mav8-feature-view">{t.visitMav8}<ArrowUpRight size={15}/></span>
            </a>
          </Reveal>
        </div>
      </section>
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

export default function App() {
  const { route, navigate } = usePortfolioRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = text[route.lang];
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 130, damping: 35 });
  useEffect(() => {
    document.documentElement.lang = route.lang === 'ua' ? 'uk' : route.lang;
    document.title = 'Marina Rav — AI Automation & Digital Systems';
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = t.heroIntro;
    languages.forEach((language) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language === 'ua' ? 'uk' : language}"]`);
      if (!link) { link = document.createElement('link'); link.rel = 'alternate'; link.hreflang = language === 'ua' ? 'uk' : language; document.head.appendChild(link); }
      link.href = window.location.origin + `/${language}`;
    });
  }, [route.lang, t.heroIntro]);

  const gotoSection = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    if (window.location.hash === '#work') {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById('work')?.scrollIntoView({ behavior: 'instant' })));
    }
  }, []);
  const navItems = [{ id: 'about', title: t.navAbout }, { id: 'journey', title: t.navJourney }, { id: 'work', title: t.navWork }, { id: 'contact', title: t.navContact }];
  return <div className="portfolio">
    <motion.div className="scroll-progress" style={{ scaleX: progress }} />
    <header className="site-header"><div className="container header-inner">
      <button className="logo logo-editorial" aria-label="Home" type="button" onClick={() => { setMenuOpen(false); navigate(route.lang); }}>MARINA RAV</button>
      <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
        {navItems.map((item) => <button type="button" key={item.id} onClick={() => gotoSection(item.id)}>{item.title}</button>)}
      </nav>
      <div className="header-end"><div className="language-switch" aria-label="Choose language">{languages.map((language) => <button key={language} type="button" aria-pressed={route.lang === language} className={route.lang === language ? 'is-current' : ''} onClick={() => {setMenuOpen(false);navigate(language);}}>{langNames[language]}</button>)}</div>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={23}/> : <Menu size={23}/>}</button></div>
    </div></header>
    <main><Portfolio lang={route.lang}/></main>
    <footer className="site-footer">
      <div className="container footer-inner footer-bottom">
        <span>© {new Date().getFullYear()} MARINA RAV</span>
        <span>{t.footer}</span>
        <button type="button" onClick={() => { window.scrollTo({top:0,behavior:'smooth'}); }}>{t.backToTop} ↑</button>
      </div>
    </footer>
  </div>;
}
