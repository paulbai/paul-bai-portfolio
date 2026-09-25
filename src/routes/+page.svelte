<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { Draggable } from 'gsap/Draggable';
  import {
    ArrowUpRight,
    ArrowDownLeft,
    ArrowDown,
    ArrowUp,
    Menu,
    X,
    Mail,
    Pause,
    Play,
    Copy,
    MapPin,
    Globe
  } from '@lucide/svelte';
  import { projects, type Project } from '$lib/data/projects';
  import { introLayout } from '$lib/variant-b-layout.js';
  import Atmosphere from '$lib/components/variant-b/Atmosphere.svelte';
  import Brush from '$lib/components/variant-b/Brush.svelte';
  import ProjectRail from '$lib/components/variant-b/ProjectRail.svelte';
  import '$lib/styles/variant-b.css';
  import antonFont from '@fontsource/anton/files/anton-latin-400-normal.woff2?url';

  const email = 'paulbaikanu13@gmail.com';
  const github = 'https://github.com/paulbai';
  const linkedin = 'https://www.linkedin.com/in/paul-bai-kanu-4895bb153/';
  const navigation = [
    ['01', 'Introduce', '#introduce'],
    ['02', 'About', '#about-b'],
    ['03', 'Works', '#works-b'],
    ['04', 'Principles', '#principles-b'],
    ['05', 'Contact', '#contact-b']
  ];
  const focusAreas = [
    ['Product strategy', 'Fintech · Blockchain · AI'],
    ['Customer experience', 'Financial access · Trust · Clarity'],
    ['Financial-product systems', 'Wallets · Payments · Connected experiences'],
    ['Cross-functional delivery', 'Strategy · Design · Engineering · Compliance']
  ];
  const principles = [
    {
      word: 'Clarity',
      title: 'Technology should earn its complexity.',
      body: 'Blockchain and AI are valuable when they remove friction, create trust, or open access, not when they are added for novelty.'
    },
    {
      word: 'Trust',
      title: 'Financial products are trust products.',
      body: 'Every flow should make people feel informed, in control, and secure.'
    },
    {
      word: 'Together',
      title: 'Design is a team sport.',
      body: 'The strongest products emerge when strategy, design, engineering, compliance, and business move in the same direction.'
    }
  ];
  let root: HTMLDivElement;
  let menuDialog: HTMLDialogElement;
  let projectDialog: HTMLDialogElement;
  let menuButton: HTMLButtonElement;
  let lastTrigger: HTMLElement | null = null;
  let project = $state<Project>(projects[0]);
  let dialogOpen = $state(false);
  let menuOpen = $state(false);
  let reduced = $state(false);
  let stopped = $state(false);
  let ready = $state(false);
  let activeSection = $state('#introduce');
  let progress = $state(0);
  let pointer = $state({ x: 0, y: 0 });
  let copied = $state(false);
  let copyMessage = $state('');
  let copyTimer: ReturnType<typeof setTimeout>;
  let restoreOverflow = '';
  let motionMedia: gsap.MatchMedia | undefined;
  let rebuild = () => {};
  let flushResize = () => {};
  const rulerX = Array.from({ length: 24 }, (_, i) => (i + 1) * 100);
  const rulerY = Array.from({ length: 16 }, (_, i) => (i + 1) * 100);

  function lockScroll() {
    restoreOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.documentElement.style.overflow = restoreOverflow;
  }
  function openProject(next: Project) {
    project = next;
    lastTrigger = document.activeElement as HTMLElement;
    dialogOpen = true;
    lockScroll();
    projectDialog.showModal();
    projectDialog.querySelector('.b-project-dialog-inner')?.scrollTo(0, 0);
  }
  function closeProject() {
    dialogOpen = false;
    unlockScroll();
    lastTrigger?.focus({ preventScroll: true });
  }
  function openMenu() {
    menuOpen = true;
    lockScroll();
    menuDialog.showModal();
    menuDialog.querySelector('.b-menu-body')?.scrollTo(0, 0);
  }
  function closeMenu() {
    menuOpen = false;
    unlockScroll();
    menuButton?.focus({ preventScroll: true });
  }
  function navigate(event: MouseEvent, href: string) {
    event.preventDefault();
    if (menuDialog.open) menuDialog.close();
    flushResize();
    const target = document.querySelector<HTMLElement>(href);
    target?.scrollIntoView({ behavior: reduced || stopped ? 'instant' : 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
    history.replaceState(null, '', href);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
      copyMessage = 'Email address copied.';
    } catch {
      copyMessage = 'Please use the email link below, or copy paulbaikanu13@gmail.com.';
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
      copyMessage = '';
    }, 3500);
  }
  function toggleMotion() {
    stopped = !stopped;
    rebuild();
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced = preference.matches;
    let alive = true;
    let scrollFrame = 0;
    let pointerFrame = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let viewportWidth = innerWidth;
    let viewportHeight = innerHeight;
    const trackScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        progress = Math.min(
          100,
          Math.round(
            (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100
          )
        );
        scrollFrame = 0;
      });
    };
    const trackPointer = (e: PointerEvent) => {
      if (pointerFrame || reduced || stopped || e.pointerType !== 'mouse') return;
      pointerFrame = requestAnimationFrame(() => {
        pointer = { x: Math.round(e.clientX), y: Math.round(e.clientY) };
        pointerFrame = 0;
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) activeSection = '#' + entry.target.id;
      },
      { rootMargin: '-15% 0px -55% 0px' }
    );
    root.querySelectorAll('section[id],footer[id]').forEach((e) => observer.observe(e));

    rebuild = () => {
      motionMedia?.revert();
      ready = true;
      root.classList.add('b-ready');
      root.classList.toggle('b-static', reduced || stopped);
      // Short screens need normal document flow: a pinned viewport must never
      // trap the introduction or its links below the fold.
      root.classList.toggle('b-flow', innerHeight <= 600);
      if (reduced || stopped) return;
      motionMedia = gsap.matchMedia();
      motionMedia.add(
        '(min-width: 0px)',
        () => {
          const duration = () => innerHeight * 2.35;
          const q = gsap.utils.selector(root);
          const copy = q('.b-intro-copy')[0] as HTMLElement;
          const copyTop = parseFloat(getComputedStyle(copy).top) || 0;
          const title = q('.b-name')[0] as HTMLElement;
          const { desktop, flowing, heroY, heroScale } = introLayout({
            width: innerWidth,
            height: innerHeight,
            titleWidth: title.offsetWidth,
            titleHeight: title.offsetHeight,
            copyTop,
            copyHeight: copy.offsetHeight
          });
          root.classList.toggle('b-flow', flowing);
          if (!flowing) {
            const identity = q('.b-identity')[0] as HTMLElement;
            const sidebarWidth = (q('.b-sidebar')[0] as HTMLElement).offsetWidth;
            const finalX = desktop ? innerWidth - sidebarWidth + 26 : 20;
            const nameWidth = title.offsetWidth;
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: '#introduce',
                start: 'top top',
                end: duration,
                scrub: 0.7,
                invalidateOnRefresh: true
              }
            });
            gsap.set(identity, { transformOrigin: '0% 0%' });
            if (desktop) {
              timeline.fromTo(
                identity,
                {
                  x: innerWidth * 0.04 - finalX,
                  y: heroY - 30,
                  scaleX: heroScale,
                  scaleY: heroScale * 0.7
                },
                { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: 'none', duration: 0.67 },
                0
              );
              timeline.fromTo(
                q('.b-name-brush'),
                { x: nameWidth * 0.22, scaleX: 0.7, transformOrigin: '0% 50%' },
                { x: 0, scaleX: 1, ease: 'none', duration: 0.67 },
                0
              );
              const tagline = q('.b-sidebar-tag')[0] as HTMLElement;
              timeline.fromTo(
                tagline,
                {
                  x: innerWidth * 0.04 - finalX,
                  y: 35 - tagline.offsetTop,
                  scale: 1.28,
                  transformOrigin: '0% 0%'
                },
                { x: 0, y: 0, scale: 1, duration: 0.67, ease: 'none' },
                0
              );
              const links = q('.b-sidebar-nav a') as HTMLElement[];
              const initialScale = 1.45;
              const widths = links.map((link) => link.offsetWidth * initialScale);
              let left =
                innerWidth - 60 - widths.reduce((a, b) => a + b, 0) - 30 * (links.length - 1);
              for (let i = 0; i < links.length; i++) {
                const nav = links[i].offsetParent as HTMLElement;
                const baseLeft = innerWidth - sidebarWidth + nav.offsetLeft + links[i].offsetLeft;
                const baseTop = nav.offsetTop + links[i].offsetTop;
                timeline.fromTo(
                  links[i],
                  {
                    x: left - baseLeft,
                    y: 30 - baseTop,
                    scale: initialScale,
                    transformOrigin: '0% 0%'
                  },
                  { x: 0, y: 0, scale: 1, duration: 1, ease: 'none' },
                  0
                );
                left += widths[i] + 30;
              }
              const photo = q('.b-sidebar-photo')[0] as HTMLElement;
              const sx = (innerWidth * 0.11) / photo.offsetWidth,
                sy = sx;
              timeline.fromTo(
                photo,
                {
                  x: innerWidth * 0.795 - (innerWidth - sidebarWidth + photo.offsetLeft),
                  y: innerHeight * 0.632 - photo.offsetTop,
                  scaleX: sx,
                  scaleY: sy,
                  transformOrigin: '0% 0%'
                },
                { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 1, ease: 'none' },
                0
              );
              timeline.fromTo(
                q('.b-sidebar-photo img'),
                { scaleY: sx / sy },
                { scaleY: 1, duration: 1, ease: 'none' },
                0
              );
              timeline.fromTo(
                q('.b-side-social'),
                {
                  x: -80,
                  y: innerHeight * 0.9 - (q('.b-side-social')[0] as HTMLElement).offsetTop
                },
                { x: 0, y: 0, duration: 1, ease: 'none' },
                0
              );
              timeline.fromTo(
                q('.b-sidebar-bio,.b-sidebar-email,.b-photo-caption'),
                { opacity: 0 },
                { opacity: 1, duration: 0.2 },
                0.8
              );
            } else {
              gsap.set(identity, {
                x: innerWidth * 0.04 - 20,
                y: heroY - 30,
                scaleX: heroScale,
                scaleY: heroScale * 0.7
              });
              gsap.set(q('.b-name-brush'), {
                x: nameWidth * 0.08,
                scaleX: 0.85,
                transformOrigin: '0% 50%'
              });
              timeline.to(identity, { y: -180, opacity: 0, duration: 0.35, ease: 'none' }, 0.12);
            }
            timeline.to(
              q('.b-opening-note,.b-opening-index,.b-hero-social,.b-keep-going'),
              { opacity: 0, duration: 0.18 },
              0
            );
            timeline.fromTo(
              q('.b-intro-copy'),
              { opacity: 0, y: 80 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
              0.24
            );
            timeline.fromTo(
              q('.b-intro-stat'),
              { opacity: 0, y: 40, rotation: 4 },
              { opacity: 1, y: 0, rotation: 0, stagger: 0.08, duration: 0.25 },
              0.58
            );
          }
          for (const element of q('[data-b-reveal]')) {
            gsap.fromTo(
              element,
              { opacity: 1, y: 30, rotation: 2 },
              {
                opacity: 1,
                y: 0,
                rotation: 0,
                ease: 'none',
                scrollTrigger: { trigger: element, start: 'top 92%', end: 'top 62%', scrub: 0.6 }
              }
            );
          }
          const cards = q('.b-principle');
          cards.forEach((card: HTMLElement, i: number) =>
            gsap.fromTo(
              card,
              { x: (1 - i) * (innerWidth < 1280 ? 10 : 65), rotation: 0, y: 45 },
              {
                x: 0,
                y: innerWidth < 1280 ? 0 : (i % 2) * -28,
                rotation: (i - 1) * (innerWidth < 1280 ? 3 : 8),
                scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 55%', scrub: 0.8 }
              }
            )
          );
          const letters = q('.b-transition-letter');
          gsap.fromTo(
            letters,
            {
              y: () => gsap.utils.random(-65, 65),
              rotation: () => gsap.utils.random(-25, 25),
              opacity: 0.35
            },
            {
              y: 0,
              rotation: 0,
              opacity: 1,
              stagger: 0.02,
              scrollTrigger: {
                trigger: '.b-transition',
                start: 'top 85%',
                end: 'center 48%',
                scrub: 0.8
              }
            }
          );
          gsap.to(q('.b-sidebar'), {
            opacity: 0,
            pointerEvents: 'none',
            scrollTrigger: { trigger: '#contact-b', start: 'top 65%', end: 'top 10%', scrub: true }
          });
          const drag = matchMedia('(pointer: fine) and (min-width: 1024px)').matches
            ? Draggable.create(q('.b-contact-wall'), {
                type: 'x,y',
                bounds: { minX: -130, maxX: 130, minY: -130, maxY: 130 },
                edgeResistance: 0.7,
                onDragStart() {
                  root.classList.add('b-dragging');
                },
                onDragEnd() {
                  root.classList.remove('b-dragging');
                  gsap.to(this.target, { x: 0, y: 0, duration: 1.2, ease: 'power3.out' });
                }
              })
            : [];
          return () => {
            drag.forEach((d) => d.kill());
          };
        },
        root
      );
      ScrollTrigger.refresh();
    };
    document.fonts.ready.then(() => {
      if (alive) rebuild();
    });
    const motionChange = () => {
      reduced = preference.matches;
      rebuild();
    };
    const resize = () => {
      if (
        innerWidth === viewportWidth &&
        Math.abs(innerHeight - viewportHeight) < 100 &&
        innerHeight <= 600 === viewportHeight <= 600
      )
        return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(flushResize, 180);
    };
    flushResize = () => {
      clearTimeout(resizeTimer);
      if (viewportWidth === innerWidth && viewportHeight === innerHeight) return;
      viewportWidth = innerWidth;
      viewportHeight = innerHeight;
      rebuild();
    };
    preference.addEventListener('change', motionChange);
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('pointermove', trackPointer, { passive: true });
    trackScroll();
    return () => {
      alive = false;
      motionMedia?.revert();
      observer.disconnect();
      clearTimeout(copyTimer);
      clearTimeout(resizeTimer);
      preference.removeEventListener('change', motionChange);
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('pointermove', trackPointer);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(pointerFrame);
      if (dialogOpen || menuOpen) unlockScroll();
    };
  });
</script>

<svelte:head>
  <link rel="preload" href={antonFont} as="font" type="font/woff2" crossorigin="anonymous" />
  <link
    rel="preload"
    href="/media/variant-b/fonts/satoshi-regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="variant-b" class:b-ready={ready} class:b-static={reduced || stopped} bind:this={root}>
  <Atmosphere paused={reduced || stopped || dialogOpen || menuOpen} />
  <a class="b-skip" href="#introduce">Skip to content</a>
  <div class="b-rulers" aria-hidden="true">
    <div class="b-ruler-top">
      {#each rulerX as x}<span style:left={`${x}px`}>{x}</span>{/each}<i
        style:left={`${pointer.x}px`}
      ></i>
    </div>
    <div class="b-ruler-left">
      {#each rulerY as y}<span style:top={`${y}px`}>{y}</span>{/each}<i style:top={`${pointer.y}px`}
      ></i>
    </div>
    <i class="b-corner b-tl"></i><i class="b-corner b-tr"></i><i class="b-corner b-bl"></i><i
      class="b-corner b-br"
    ></i>
    <p class="b-coordinates">
      x:{String(pointer.x).padStart(4, '0')} &nbsp; y:{String(pointer.y).padStart(4, '0')} &nbsp; p:{String(
        progress
      ).padStart(3, '0')}% &nbsp; s:{navigation.find((n) => n[2] === activeSection)?.[1] ??
        'Introduce'}
    </p>
  </div>

  <header class="b-mobile-header">
    <a href="#introduce" onclick={(e) => navigate(e, '#introduce')}>Design / Product / Fintech</a>
    <button
      type="button"
      bind:this={menuButton}
      onclick={openMenu}
      aria-label="Open navigation menu"><Menu size={24} /></button
    >
  </header>

  <aside
    class="b-sidebar"
    aria-label="Paul Bai and portfolio navigation"
    inert={activeSection === '#contact-b'}
  >
    <div class="b-identity">
      <h1 class="b-name">Paul <span>Bai</span></h1>
      <Brush class="b-name-brush" />
    </div>
    <p class="b-sidebar-tag">Design / Product / <span>Fintech</span></p>
    <div class="b-side-social">
      <a href={linkedin} target="_blank" rel="noopener noreferrer"
        >LinkedIn <ArrowUpRight size={13} /></a
      ><a href={github} target="_blank" rel="noopener noreferrer"
        >GitHub <ArrowUpRight size={13} /></a
      >
    </div>
    <div class="b-sidebar-bio">
      <p>Product Designer &amp; Product Manager<br />Fintech, blockchain, and AI.</p>
      <p class="b-locale">
        <span><MapPin size={12} /> Freetown</span><span><Globe size={12} /> Working remotely</span>
      </p>
    </div>
    <nav class="b-sidebar-nav" aria-label="Primary navigation">
      {#each navigation as [num, label, href]}<a
          {href}
          class:b-active={activeSection === href}
          onclick={(e) => navigate(e, href)}><small>{num}</small>{label}</a
        >{/each}
    </nav>
    <div class="b-sidebar-photo">
      <img
        src="/media/variant-b/paul-bai-nft.jpg"
        width="500"
        height="500"
        alt="Paul Bai’s NFT avatar: a gray ape in a yellow bucket hat, blue sunglasses, and red jacket, holding a GM mug"
        loading="lazy"
        decoding="async"
      /><span class="b-photo-caption">Paul Bai / 01</span>
    </div>
    <a class="b-sidebar-email" href={`mailto:${email}`}><span>{email}</span><Mail size={17} /></a>
  </aside>

  <main>
    <section id="introduce" class="b-intro-scene" aria-label="Introduction" tabindex="-1">
      <div class="b-intro-stage">
        <p class="b-opening-index">Index / Portfolio / 2026</p>
        <p class="b-opening-note"><ArrowDownLeft /> I design for the way Africa moves.</p>
        <a href="#about-b" class="b-keep-going" onclick={(e) => navigate(e, '#about-b')}
          ><ArrowDown /> Keep exploring</a
        >
        <div class="b-hero-social">
          <a href={linkedin} target="_blank" rel="noopener noreferrer"
            >LinkedIn <ArrowUpRight size={12} /></a
          ><a href={github} target="_blank" rel="noopener noreferrer"
            >GitHub <ArrowUpRight size={12} /></a
          >
        </div>
        <div class="b-intro-copy">
          <h2>
            I design financial<br />products for the<br /><span class="b-accent b-underlined"
              >way Africa moves.<Brush /></span
            >
          </h2>
          <p>
            Currently a Product Manager at <strong>Flot</strong>, and a product builder working
            across fintech, blockchain, and AI. I turn complex technology into useful, trusted
            experiences people can understand and use every day.
          </p>
          <div class="b-intro-stats">
            <div class="b-intro-stat"><strong>21</strong><span>Project spaces</span></div>
            <div class="b-intro-stat"><strong>Flot</strong><span>Product Manager</span></div>
            <div class="b-intro-stat"><strong>Mocha</strong><span>Co-founder</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="about-b" class="b-section b-about" tabindex="-1" aria-labelledby="b-about-title">
      <div class="b-about-intro" data-b-reveal>
        <h2 id="b-about-title">A little <span class="b-accent">about me.</span></h2>
        <p>
          I’m Paul, a product designer, web designer, and product manager working at the
          intersection of financial access, emerging technology, and human behaviour.
        </p>
        <p>
          I design and build websites and digital services, from focused landing pages and business
          websites to complex web applications. I bring product strategy, thoughtful design, and
          hands-on development together to take ideas from the first conversation to a working
          product, with clear user journeys and the foundations to grow.
        </p>
        <p>
          My work is grounded in fintech, but my curiosity extends into blockchain, AI, and the
          technologies reshaping how people transact, save, learn, and build. I’m interested in new
          technology only when it creates a clearer, more useful experience for real people.
        </p>
        <p>
          Before product, I worked on complex engineering and infrastructure projects. That
          background gave me systems thinking, a respect for real-world constraints, and a bias for
          turning ambitious ideas into things that work.
        </p>
      </div>
      <div class="b-focus-list">
        {#each focusAreas as [title, detail], i}<div class="b-focus-row" data-b-reveal>
            <h3><small>{String(i + 1).padStart(2, '0')}</small>{title}</h3>
            <p>{detail}</p>
          </div>{/each}
      </div>
    </section>

    <section id="works-b" class="b-section b-works" tabindex="-1" aria-labelledby="b-works-title">
      <h2 id="b-works-title" data-b-reveal>
        An archive. <span class="b-accent b-underlined">In progress.<Brush /></span>
      </h2>
      <ProjectRail paused={reduced || stopped || dialogOpen || menuOpen} onopen={openProject} />
      <div class="b-work-caption">
        <span class="b-hand">Explore the work <ArrowUpRight size={28} /></span>
        <div>
          <h3>21 <span class="b-accent">project spaces.</span></h3>
          <p>
            Current work, co-founded products, public GitHub repositories, and public
            collaborations, with more case studies to follow.
          </p>
        </div>
      </div>
    </section>

    <section id="current-work-b" class="b-section b-current" aria-labelledby="b-current-title">
      <p class="b-kicker">Current work / Flot</p>
      <h2 id="b-current-title" data-b-reveal>
        Connected systems.<br /><span class="b-accent b-underlined"
          >Clear experiences.<Brush /></span
        >
      </h2>
      <div class="b-feature" data-b-reveal>
        <button
          type="button"
          class="b-feature-image"
          onclick={() => openProject(projects[0])}
          aria-label="Read about 01 / Flot"
          ><img
            src={projects[0].image}
            width="1280"
            height="900"
            loading="lazy"
            alt="Flot’s connected financial product website"
          /><span>01 / Flot <ArrowUpRight /></span></button
        >
        <div class="b-feature-copy">
          <p class="b-kicker">Product Manager · Major contributor</p>
          <h3>Shaping a connected financial ecosystem for how people and businesses move money.</h3>
          <p>
            Flot brings wallets, payments, cards, WhatsApp banking, travel, business finance, and
            developer infrastructure into one connected experience.
          </p>
          <p>
            As Product Manager, I help shape product direction across a financial ecosystem designed
            to make everyday money movement feel simpler, faster, and more accessible.
          </p>
          <a href="https://flotme.ai" target="_blank" rel="noopener noreferrer" class="b-hand"
            >Visit Flot <ArrowUpRight size={24} /></a
          >
        </div>
      </div>
      <p class="b-note">A fuller case study can be shared when the work is public.</p>
      <div class="b-feature b-feature-mocha" data-b-reveal>
        <div class="b-feature-copy">
          <p class="b-kicker">Co-founded product / Mocha</p>
          <h3>Money movement.<br /><span class="b-accent">In a conversation.</span></h3>
          <p>{projects[1].summary}</p>
          <p>Co-founder · WhatsApp-native money movement</p>
          <button type="button" class="b-hand" onclick={() => openProject(projects[1])}
            >Explore Mocha <ArrowUpRight size={24} /></button
          >
        </div>
        <button
          type="button"
          class="b-feature-image"
          onclick={() => openProject(projects[1])}
          aria-label="Read about 02 / Mocha"
          ><img
            src={projects[1].image}
            width="1280"
            height="900"
            loading="lazy"
            alt="Mocha’s WhatsApp-native banking website"
          /><span>02 / Mocha <ArrowUpRight /></span></button
        >
      </div>
      <a class="b-experience-link b-hand" href={github} target="_blank" rel="noopener noreferrer"
        >See what I’m building <ArrowUpRight size={24} /></a
      >
    </section>

    <section
      id="principles-b"
      class="b-section b-principles"
      tabindex="-1"
      aria-labelledby="b-principles-title"
    >
      <h2 id="b-principles-title" data-b-reveal>
        How <span class="b-accent b-underlined">I think.<Brush /></span>
      </h2>
      <p class="b-principles-caption b-hand">The things I come back to.</p>
      <div class="b-principle-fan">
        {#each principles as principle, i}<article class="b-principle">
            <span class="b-principle-number">0{i + 1} / A point of view</span>
            <p class="b-principle-word">{principle.word}</p>
            <h3>{principle.title}</h3>
            <p>{principle.body}</p>
          </article>{/each}
      </div>
    </section>

    <section class="b-transition b-section" aria-label="Let’s work together">
      <p>
        <span class="b-sr-only">Your next big idea. Let’s make it real.</span
        >{#each ['Your next big idea.', 'Let’s make it real.'] as line}<span
            class="b-transition-line"
            aria-hidden="true"
            >{#each [...line] as letter}<span class="b-transition-letter"
                >{letter === ' ' ? '\u00a0' : letter}</span
              >{/each}</span
          >{/each}
      </p>
    </section>

    <footer id="contact-b" class="b-contact" tabindex="-1" aria-labelledby="b-contact-title">
      <div class="b-contact-wall" aria-hidden="true">
        {#each [...projects, ...projects, ...projects] as tile}<img
            src={tile.image}
            width="400"
            height="400"
            loading="lazy"
            alt=""
            draggable="false"
          />{/each}
      </div>
      <div class="b-contact-copy">
        <h2 id="b-contact-title"><span class="b-accent">Your next</span> big idea.</h2>
        <p class="b-hand">Let’s make it real.</p>
        <button
          type="button"
          class="b-email-copy"
          onclick={copyEmail}
          aria-label={copied ? 'Copied. Let’s talk!' : `Copy ${email}`}
          >{copied ? 'Copied. Let’s talk!' : email}<Copy size={17} /></button
        ><a class="b-email-send" href={`mailto:${email}`}
          >Email me about working together <ArrowUpRight size={16} /></a
        >
        <div class="b-footer-social">
          <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a><a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer">LinkedIn</a
          >
        </div>
        <p class="b-contact-location">Based in Freetown, Sierra Leone · Working remotely</p>
      </div>
      <span class="b-drag-label b-hand" aria-hidden="true">Drag to explore <ArrowUpRight /></span><a
        class="b-back-top b-hand"
        href="#introduce"
        onclick={(e) => navigate(e, '#introduce')}>Back to top <ArrowUp size={25} /></a
      >
    </footer>
  </main>

  <div class="b-motion-tools">
    <button
      type="button"
      onclick={toggleMotion}
      disabled={reduced}
      aria-label={stopped
        ? 'Enable motion effects'
        : reduced
          ? 'Reduced motion enabled'
          : 'Pause motion effects'}
      >{#if stopped || reduced}<Play size={12} />{:else}<Pause size={12} />{/if}</button
    >
  </div>

  <dialog
    class="b-menu-dialog"
    bind:this={menuDialog}
    onclose={closeMenu}
    aria-labelledby="b-menu-title"
  >
    <div class="b-dialog-toolbar">
      <button
        type="button"
        class="b-dialog-close"
        onclick={() => menuDialog.close()}
        aria-label="Close navigation menu">Close <X size={22} /></button
      >
    </div>
    <div class="b-menu-body">
      <h2 id="b-menu-title" class="b-menu-name">Paul <span>Bai</span></h2>
      <Brush />
      <div class="b-menu-social">
        <a href={linkedin} target="_blank" rel="noopener noreferrer"
          >LinkedIn <ArrowUpRight size={16} /></a
        ><a href={github} target="_blank" rel="noopener noreferrer"
          >GitHub <ArrowUpRight size={16} /></a
        >
      </div>
      <p>Product Designer &amp; Product Manager<br />Fintech, blockchain, and AI.</p>
      <p class="b-locale"><MapPin size={12} /> Freetown, Sierra Leone · Working remotely</p>
      <nav aria-label="Mobile navigation">
        {#each navigation as [num, label, href]}<a {href} onclick={(e) => navigate(e, href)}
            ><small>{num}</small>{label}</a
          >{/each}
      </nav>
      <img
        src="/media/variant-b/paul-bai-nft.jpg"
        width="500"
        height="500"
        alt="Paul Bai’s NFT avatar: a gray ape in a yellow bucket hat, blue sunglasses, and red jacket, holding a GM mug"
        loading="lazy"
        decoding="async"
      /><a class="b-menu-email" href={`mailto:${email}`}>{email}<Mail size={18} /></a>
    </div>
  </dialog>

  <dialog
    class="b-project-dialog"
    bind:this={projectDialog}
    onclose={closeProject}
    aria-labelledby="b-summary-title"
    onclick={(e) => {
      if (e.target === projectDialog) projectDialog.close();
    }}
  >
    <div class="b-dialog-toolbar">
      <button
        type="button"
        class="b-dialog-close"
        onclick={() => projectDialog.close()}
        aria-label="Close project summary">Close <X size={22} /></button
      >
    </div>
    <div class="b-project-dialog-inner">
      <div class="b-summary-image">
        <img
          src={project.image}
          width="960"
          height="720"
          alt={`${project.title} project preview`}
          loading="lazy"
        />
      </div>
      <div class="b-summary-copy">
        <p class="b-kicker">{project.number} / {project.kind}</p>
        <h2 id="b-summary-title">{project.title}</h2>
        <p class="b-summary-role">{project.phase}</p>
        <p>{project.summary}</p>
        {#if project.website}<a
            class="b-hand"
            href={project.website.href}
            target="_blank"
            rel="noopener noreferrer">Visit {project.website.label} <ArrowUpRight size={23} /></a
          >{:else}<p class="b-not-live">Live website link coming later.</p>{/if}
      </div>
    </div>
  </dialog>
  <p class="b-sr-only" role="status" aria-live="polite">{copyMessage}</p>
</div>
