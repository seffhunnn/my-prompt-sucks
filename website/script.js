document.addEventListener("DOMContentLoaded", () => {

  // 1. HIGHLIGHT USER OS ON KEYBOARD SHORTCUT GUIDE
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const winShortcutBox = document.getElementById("winShortcutBox");
  const macShortcutBox = document.getElementById("macShortcutBox");

  if (isMac && macShortcutBox) {
    macShortcutBox.classList.add("detected-os");
  } else if (!isMac && winShortcutBox) {
    winShortcutBox.classList.add("detected-os");
  }

  // 2. MOBILE MENU DRAWER LOGIC
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      mobileDrawer.classList.toggle("active");
    });

    // Close menu when clicking navigation drawer items
    const drawerLinks = mobileDrawer.querySelectorAll("a");
    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileToggle.classList.remove("active");
        mobileDrawer.classList.remove("active");
      });
    });
  }


  // 3. SMOOTH SCROLLING via LENIS
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Intercept anchor clicks for smooth scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Skip download buttons — they handle their own navigation
      if (this.classList.contains('download-btn')) return;
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        lenis.scrollTo(0);
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -80 // Offset navbar height
        });
      }
    });
  });


  // 4. GSAP & SCROLL TRIGGER ANIMATIONS
  gsap.registerPlugin(ScrollTrigger);

  // Hero section entry reveal timeline
  const heroTl = gsap.timeline();
  
  heroTl.from(".navbar", {
    y: -40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });

  heroTl.from(".hero-badge", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.4");

  heroTl.from(".hero-title", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.4");

  heroTl.from(".hero-desc", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.5");

  heroTl.from(".hero-btns", {
    opacity: 0,
    y: 15,
    duration: 0.5,
    ease: "power3.out"
  }, "-=0.4");

  heroTl.from(".shortcut-guide-strip", {
    opacity: 0,
    y: 15,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.4");

  heroTl.from(".release-meta-strip", {
    opacity: 0,
    y: 10,
    duration: 0.5,
    ease: "power3.out"
  }, "-=0.3");

  heroTl.from(".extension-mockup-wrapper", {
    opacity: 0,
    x: 40,
    rotateY: -20,
    rotateX: 20,
    duration: 1.2,
    ease: "power4.out"
  }, "-=1");

  // Scroll reveals for section elements
  gsap.utils.toArray(".step-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: i * 0.15,
      ease: "power3.out"
    });
  });

  gsap.utils.toArray(".feature-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: (i % 4) * 0.1,
      ease: "power3.out"
    });
  });

  gsap.from(".feature-block-large", {
    scrollTrigger: {
      trigger: ".feature-block-large",
      start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out"
  });

  gsap.utils.toArray(".platform-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
      },
      opacity: 0,
      scale: 0.95,
      y: 30,
      duration: 0.6,
      delay: i * 0.1,
      ease: "power3.out"
    });
  });

  gsap.from(".download-card-wrapper", {
    scrollTrigger: {
      trigger: ".download-card-wrapper",
      start: "top 80%",
    },
    opacity: 0,
    y: 40,
    duration: 0.9,
    ease: "power3.out"
  });


  // 5. LIVING ATMOSPHERIC CANVAS PARTICLE SYSTEM
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 130; // Richer atmospheric glow
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
      // Start randomly positioned
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = Math.random() * 2 + 1; // 1px to 3px
      this.speedY = Math.random() * -0.5 - 0.2; // Drifting upwards
      this.speedX = Math.random() * 0.4 - 0.2; // Slow horizontal sway
      this.opacity = Math.random() * 0.4 + 0.1; // Dim glow
      this.hue = 45; // Warm yellow base
      this.saturation = 90;
      this.lightness = Math.random() * 10 + 60; // 60% to 70% light
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = dx / distance;
          let directionY = dy / distance;
          
          this.x += directionX * force * 1.5;
          this.y += directionY * force * 1.5;
        }
      }

      // Recycle if screen edge reached
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
      ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, 55%, 0.3)`;
      ctx.shadowBlur = 4;
      ctx.fill();
      // Reset shadow blur
      ctx.shadowBlur = 0;
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Low opacity background glow
    ctx.fillStyle = "rgba(11, 11, 12, 0.05)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();


  // 6. AUTOMATED PROMPT SHOWCASE CYCLE
  const categoryTabs = document.querySelectorAll(".category-tab");
  const badPromptText = document.getElementById("badPromptText");
  const goodPromptText = document.getElementById("goodPromptText");
  const showcaseConnector = document.querySelector(".showcase-connector");
  const beamStatus = document.getElementById("beamStatus");

  const SHOWCASE_DATA = [
    {
      category: "Coding",
      bad: "make login page",
      good: `# System Prompt
Act as an expert Web Developer specializing in secure authentication systems.

# Context
Building a robust, modern login interface for a developer portfolio.

# Requirements
- Build a responsive layout with Vanilla HTML, CSS, and JS.
- Implement password visibility toggle.
- Add client-side validation (email format, password strength).
- Incorporate subtle micro-interactions & sleek dark mode aesthetics.
- Provide full component code with comments.`
    },
    {
      category: "Writing",
      bad: "write article funny",
      good: `# System Prompt
Act as a seasoned tech satirist and humorist copywriter.

# Context
Writing a 500-word blog post about developer caffeine addiction.

# Tone & Style
- Dry, witty, slightly self-deprecating.
- Target audience: Software developers and engineering teams.
- Use relatable analogies (e.g., git commits, stack overflows).

# Structure
- Hook: The relationship between coffee and compiling.
- Body: 3 stages of caffeine crash.
- CTA: Subscribe for more dev humor.`
    },
    {
      category: "Marketing",
      bad: "write marketing email",
      good: `# System Prompt
Act as an expert B2B Growth Copywriter specializing in cold email campaigns.

# Goal
Get engineering managers to book a 5-minute demo.

# Value Proposition
Our developer tool reduces pipeline build times by 40% and integrates in seconds.

# Copy constraints
- Subject Line: Short, developer-focused, no spam triggers.
- Keep email under 150 words.
- Clear, low-friction call-to-action.`
    },
    {
      category: "Research",
      bad: "explain quantum physics",
      good: `# System Prompt
Act as an elite physics educator specializing in conceptual visualization.

# Target Audience
A high-school student with zero mathematical background in quantum mechanics.

# Core Concepts
- Superposition (using a spinning coin metaphor).
- Entanglement (using connected dice).
- Duality (light acting as wave and particle).

# Guidelines
- Do not use equations or jargon without instant explanation.
- Add a conceptual summary table.`
    },
    {
      category: "UI/UX",
      bad: "make portfolio website",
      good: `# System Prompt
Act as a Senior UI/UX Designer & Frontend Architect.

# Task
Design a responsive developer portfolio page layout structure.

# Guidelines
- Layout: Left sidebar nav (desktop), single column scrolling sections.
- Color Palette: Midnight dark theme with warm gold accents.
- Key Sections: Interactive terminal introduction, active project cards, simple feedback form.
- Accessibility: AA grade contrast compliance.`
    },
    {
      category: "Productivity",
      bad: "plan my sprint",
      good: `# System Prompt
Act as an Agile Project Manager and Productivity Engineer.

# Goal
Organize a 2-week development sprint for a team of 3 builders.

# Input List
- Feature A (Critical, requires frontend & backend)
- Bug B (High priority, blocker)
- Documentation (Medium priority)
- Feature C (Low priority, nice-to-have)

# Deliverables
- Categorized backlog.
- Task assignments & estimations.
- Daily standup template.`
    }
  ];

  // Typing sequence definitions (includes typings, typos, deletes, corrections)
  const TYPING_SEQUENCES = {
    "make login page": [
      { type: "write", text: "make logni" },
      { type: "wait", duration: 300 },
      { type: "backspace", count: 2 },
      { type: "wait", duration: 150 },
      { type: "write", text: "in page" }
    ],
    "write article funny": [
      { type: "write", text: "write articel" },
      { type: "wait", duration: 400 },
      { type: "backspace", count: 2 },
      { type: "wait", duration: 100 },
      { type: "write", text: "le funy" },
      { type: "wait", duration: 250 },
      { type: "backspace", count: 1 },
      { type: "write", text: "ny" }
    ],
    "write marketing email": [
      { type: "write", text: "write marketign" },
      { type: "wait", duration: 300 },
      { type: "backspace", count: 3 },
      { type: "wait", duration: 150 },
      { type: "write", text: "ting email" }
    ],
    "explain quantum physics": [
      { type: "write", text: "explain quantom" },
      { type: "wait", duration: 450 },
      { type: "backspace", count: 2 },
      { type: "wait", duration: 200 },
      { type: "write", text: "um physics" }
    ],
    "make portfolio website": [
      { type: "write", text: "make portoflio" },
      { type: "wait", duration: 350 },
      { type: "backspace", count: 3 },
      { type: "wait", duration: 150 },
      { type: "write", text: "folio webste" },
      { type: "wait", duration: 300 },
      { type: "backspace", count: 3 },
      { type: "write", text: "site" }
    ],
    "plan my sprint": [
      { type: "write", text: "plan my sprnit" },
      { type: "wait", duration: 400 },
      { type: "backspace", count: 3 },
      { type: "wait", duration: 150 },
      { type: "write", text: "int" }
    ]
  };

  let currentCategoryIndex = 0;
  let isCycleRunning = false;
  let activeTimeout = null;
  let currentAbortController = null;

  async function startShowcaseCycle() {
    while (isCycleRunning) {
      const data = SHOWCASE_DATA[currentCategoryIndex];
      
      // Update active category tab
      categoryTabs.forEach((tab, index) => {
        if (index === currentCategoryIndex) {
          tab.classList.add("active");
        } else {
          tab.classList.remove("active");
        }
      });

      // Clear previous outputs
      badPromptText.textContent = "";
      goodPromptText.textContent = "";
      showcaseConnector.classList.remove("processing", "completed");
      beamStatus.textContent = "Idle";

      // Create abort controller for this step's animations
      currentAbortController = new AbortController();
      const signal = currentAbortController.signal;

      try {
        // Step 1: Type bad prompt (natural typing speed with typo correction)
        const sequence = TYPING_SEQUENCES[data.bad];
        if (sequence) {
          await executeTypingSequence(badPromptText, sequence, signal);
        } else {
          await typeSimpleText(badPromptText, data.bad, 60, signal);
        }
        if (signal.aborted) return;
        await delay(600, signal);
        if (signal.aborted) return;

        // Step 2: Processing State
        showcaseConnector.classList.add("processing");
        beamStatus.textContent = "Enhancing...";
        await delay(1000, signal);
        if (signal.aborted) return;

        // Step 3: Stream optimized prompt line-by-line
        showcaseConnector.classList.remove("processing");
        showcaseConnector.classList.add("completed");
        beamStatus.textContent = "Optimized";
        await streamOptimizedPrompt(goodPromptText, data.good, signal);
        if (signal.aborted) return;

        // Step 4: Pause to allow reading
        await delay(3000, signal);
        if (signal.aborted) return;

        // Move to next category
        currentCategoryIndex = (currentCategoryIndex + 1) % SHOWCASE_DATA.length;
      } catch (err) {
        if (err.name === 'AbortError') {
          // Expected abort from tab switch or IntersectionObserver — silently continue
        } else {
          console.error(err);
          break;
        }
      }
    }
  }

  // Typewriter sequence execution
  function executeTypingSequence(element, sequence, signal) {
    return new Promise(async (resolve, reject) => {
      element.textContent = "";
      const onAbort = () => {
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal) signal.addEventListener("abort", onAbort);
      
      try {
        for (const step of sequence) {
          if (signal && signal.aborted) {
            reject(new DOMException("Aborted", "AbortError"));
            return;
          }
          
          if (step.type === "write") {
            for (let charIdx = 0; charIdx < step.text.length; charIdx++) {
              if (signal && signal.aborted) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
              }
              element.textContent += step.text[charIdx];
              
              // Human-like speed variations (average 30ms-70ms per key)
              const delayTime = 30 + Math.random() * 40;
              await delay(delayTime, signal);
            }
          } else if (step.type === "backspace") {
            for (let b = 0; b < step.count; b++) {
              if (signal && signal.aborted) {
                reject(new DOMException("Aborted", "AbortError"));
                return;
              }
              element.textContent = element.textContent.slice(0, -1);
              
              // Backspacing is generally slightly faster (20ms-40ms)
              const delayTime = 20 + Math.random() * 20;
              await delay(delayTime, signal);
            }
          } else if (step.type === "wait") {
            await delay(step.duration, signal);
          }
        }
        if (signal) signal.removeEventListener("abort", onAbort);
        resolve();
      } catch (err) {
        if (signal) signal.removeEventListener("abort", onAbort);
        reject(err);
      }
    });
  }

  // Fallback simple typing
  function typeSimpleText(element, text, baseSpeed = 35, signal) {
    return new Promise((resolve, reject) => {
      let i = 0;
      const onAbort = () => {
        clearTimeout(activeTimeout);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal) signal.addEventListener("abort", onAbort);
      
      function typeChar() {
        if (signal && signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }
        if (i < text.length) {
          element.textContent += text[i];
          i++;
          
          let nextSpeed = baseSpeed + (Math.random() * 20 - 10);
          if (text[i - 1] === ' ') nextSpeed += 40;
          
          activeTimeout = setTimeout(typeChar, nextSpeed);
        } else {
          if (signal) signal.removeEventListener("abort", onAbort);
          resolve();
        }
      }
      typeChar();
    });
  }

  // Format single line of markdown to styled HTML spans
  function formatMarkdownLine(line) {
    let escaped = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Headers
    if (escaped.startsWith("# ")) {
      return `<span class="md-h1">${escaped}</span>`;
    } else if (escaped.startsWith("## ")) {
      return `<span class="md-h2">${escaped}</span>`;
    }
    
    // Bullets
    if (escaped.startsWith("- ")) {
      escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<span class="md-bullet">${escaped.slice(2)}</span>`;
    }

    // Bold tags
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code backticks
    escaped = escaped.replace(/`(.*?)`/g, '<code class="inline-code">$1</code>');

    return `<span class="md-text">${escaped}</span>`;
  }

  // Stream optimized prompt line-by-line with staggered reveal
  function streamOptimizedPrompt(element, text, signal) {
    return new Promise((resolve, reject) => {
      const lines = text.split('\n');
      let currentLineIndex = 0;
      element.innerHTML = "";

      const onAbort = () => {
        clearTimeout(activeTimeout);
        reject(new DOMException("Aborted", "AbortError"));
      };
      if (signal) signal.addEventListener("abort", onAbort);

      function revealLine() {
        if (signal && signal.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        if (currentLineIndex < lines.length) {
          const line = lines[currentLineIndex];
          let newEl;

          if (line.trim() === "") {
            newEl = document.createElement("div");
            newEl.style.height = "12px";
          } else {
            const formattedLine = formatMarkdownLine(line);
            const tempSpan = document.createElement("div");
            tempSpan.innerHTML = formattedLine;
            newEl = tempSpan.firstChild;
          }

          if (newEl) {
            element.appendChild(newEl);
            // Stagger reveal animation using GSAP
            gsap.fromTo(newEl, 
              { opacity: 0, y: 8, filter: "blur(2px)" },
              { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.25, ease: "power2.out" }
            );
          }

          currentLineIndex++;

          // Keep scrolling the container body
          const cardBody = element.closest('.card-body');
          if (cardBody) {
            cardBody.scrollTop = cardBody.scrollHeight;
          }

          const delayTime = Math.min(60 + line.length * 2, 180);
          activeTimeout = setTimeout(revealLine, delayTime);
        } else {
          if (signal) signal.removeEventListener("abort", onAbort);
          resolve();
        }
      }
      revealLine();
    });
  }

  // Abortable Delay Helper
  function delay(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal && signal.aborted) {
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      };
      
      const timer = setTimeout(() => {
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);

      if (signal) {
        signal.addEventListener('abort', onAbort);
      }
    });
  }

  // Tab click manual overrides
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetIndex = parseInt(tab.getAttribute("data-index"));
      if (targetIndex === currentCategoryIndex) return;

      // Abort active sequence
      if (currentAbortController) {
        currentAbortController.abort();
      }
      clearTimeout(activeTimeout);

      currentCategoryIndex = targetIndex;
      // The while-loop catches AbortError and immediately restarts at currentCategoryIndex
    });
  });

  // Intersection Observer for power saving
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!isCycleRunning) {
          isCycleRunning = true;
          startShowcaseCycle();
        }
      } else {
        if (isCycleRunning) {
          isCycleRunning = false;
          if (currentAbortController) {
            currentAbortController.abort();
          }
          clearTimeout(activeTimeout);
        }
      }
    });
  }, { threshold: 0.1 });

  const showcaseSection = document.getElementById("playground");
  if (showcaseSection) {
    observer.observe(showcaseSection);
  }

  // 7. KEYBOARD SHORTCUT KEYPRESS ANIMATOR LOOP
  const winKeys = document.querySelectorAll("#winKeys .tactile-key");
  const macKeys = document.querySelectorAll("#macKeys .tactile-key");

  async function animateShortcutLoop() {
    const runSequence = async (keysList) => {
      if (keysList.length < 3) return;
      
      // Press Ctrl/Cmd
      keysList[0].classList.add("pressed");
      await delay(180);
      
      // Press Shift
      keysList[1].classList.add("pressed");
      await delay(180);
      
      // Press E (the highlight key)
      keysList[2].classList.add("pressed");
      await delay(350);
      
      // Release all
      keysList.forEach(k => k.classList.remove("pressed"));
    };

    while (true) {
      // Pause between looping demonstrations
      await delay(3000);
      
      // Run Windows/Linux sequence
      await runSequence(winKeys);
      
      await delay(1000);
      
      // Run macOS sequence
      await runSequence(macKeys);
    }
  }
  
  // 8. CURSOR REACTIVE LIGHTING FOR CARDS
  const reactiveCards = document.querySelectorAll(".platform-card, .setup-card");
  reactiveCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 9. ONBOARDING HELP ACCORDIONS TOGGLE
  const helpTriggers = document.querySelectorAll(".help-expander-trigger");
  helpTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const expander = trigger.closest(".help-expander");
      const content = expander.querySelector(".help-expander-content");
      
      if (expander.classList.contains("active")) {
        expander.classList.remove("active");
        content.style.maxHeight = "0px";
      } else {
        // Close other active help panels first
        document.querySelectorAll(".help-expander.active").forEach(other => {
          other.classList.remove("active");
          other.querySelector(".help-expander-content").style.maxHeight = "0px";
        });
        
        expander.classList.add("active");
        content.style.maxHeight = `${content.scrollHeight}px`;
      }
    });
  });

  // 10. GSAP SCROLL TRIGGER FOR SETUP CARDS REVEAL
  gsap.utils.toArray(".setup-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: i * 0.15,
      ease: "power3.out"
    });
  });

  animateShortcutLoop();

  // ─── GITHUB LATEST RELEASE — PREMIUM DOWNLOAD SYSTEM ─────────────────────
  // Fetches the latest release metadata from GitHub API and:
  //  1. Resolves download buttons from loading → version-labelled
  //  2. Populates release metadata strips (version, date, size)
  //  3. Updates trust pills with real size info
  //  4. Gracefully degrades if API is unreachable
  
  const REPO          = "seffhunnn/my-prompt-sucks";
  const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;
  const GITHUB_API    = `https://api.github.com/repos/${REPO}/releases/latest`;

  // All primary download buttons — selected by shared class
  const DL_BUTTONS_SELECTOR = ".download-btn";

  // ── Helpers ──────────────────────────────────────────────────────────────

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return null;
    const mb = bytes / (1024 * 1024);
    return mb >= 1
      ? `${mb.toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`;
  }

  function relativeDate(isoString) {
    if (!isoString) return null;
    const diff = Date.now() - new Date(isoString).getTime();
    const days  = Math.floor(diff / 86_400_000);
    const hours = Math.floor(diff / 3_600_000);
    if (days === 0)  return hours === 0 ? "just now" : `${hours}h ago`;
    if (days === 1)  return "yesterday";
    if (days < 7)   return `${days} days ago`;
    if (days < 30)  return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  function setElText(id, text) {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  }

  function showEl(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "";
  }

  function resolveButton(btn, { label, downloadUrl, assetName, isDirect }) {
    // Fade label out, swap, fade in
    const labelEl = btn.querySelector(".btn-label");
    if (labelEl) {
      labelEl.style.opacity = "0";
      setTimeout(() => {
        labelEl.textContent = label;
        labelEl.style.opacity = "1";
      }, 180);
    }

    btn.href = downloadUrl;
    btn.classList.remove("is-loading");
    btn.classList.add("is-resolved");

    if (isDirect && assetName) {
      btn.setAttribute("download", assetName);
      btn.removeAttribute("target");
      btn.removeAttribute("rel");
    } else {
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    }
  }

  function applyFallback(btn) {
    const labelEl = btn.querySelector(".btn-label");
    if (labelEl) labelEl.textContent = "View Latest Release";
    btn.href = RELEASES_PAGE;
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener noreferrer");
    btn.classList.remove("is-loading");
    btn.classList.add("is-fallback");
  }

  function populateMetaStrip({ versionId, dateId, sizeId, sizeSepId, stripId, version, date, size }) {
    if (version) setElText(versionId, version);
    if (date)    setElText(dateId, date);
    if (size) {
      setElText(sizeId, `${size} · extension only`);
      showEl(sizeSepId);
    }
    const strip = document.getElementById(stripId);
    if (strip) strip.classList.add("is-visible");
  }

  // ── Main fetch ────────────────────────────────────────────────────────────

  async function wireDownloadButtons() {
    try {
      const res = await fetch(GITHUB_API, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "My-Prompt-Sucks-Website"
        }
      });

      if (!res.ok) throw new Error(`GitHub API ${res.status}`);

      const release   = await res.json();
      const zipAsset  = release.assets?.find(a =>
        a.name.endsWith(".zip") && a.name.includes("my-prompt-sucks")
      );

      const version     = release.tag_name  || null;
      const publishedAt = release.published_at || null;
      const size        = zipAsset ? formatBytes(zipAsset.size) : null;
      const dateLabel   = relativeDate(publishedAt);
      const downloadUrl = zipAsset?.browser_download_url || RELEASES_PAGE;
      const isDirect    = !!zipAsset;
      const btnLabel    = version ? `Download ${version}` : "Download Extension";

      // Resolve all download buttons
      document.querySelectorAll(DL_BUTTONS_SELECTOR).forEach(btn => {
        resolveButton(btn, {
          label: btnLabel,
          downloadUrl,
          assetName: zipAsset?.name || null,
          isDirect
        });
      });

      // Populate hero metadata strip
      populateMetaStrip({
        versionId: "hero-meta-version",
        dateId:    "hero-meta-date",
        sizeId:    "hero-meta-size",
        sizeSepId: "hero-meta-size-sep",
        stripId:   "hero-release-meta",
        version,
        date:      dateLabel,
        size
      });

      // Populate walkthrough metadata strip
      populateMetaStrip({
        versionId: "wt-meta-version",
        dateId:    "wt-meta-date",
        sizeId:    "wt-meta-size",
        sizeSepId: "wt-meta-size-sep",
        stripId:   "walkthrough-release-meta",
        version,
        date:      dateLabel,
        size
      });

      // Update trust pill with size if available
      const trustPill = document.getElementById("setup-trust-pill");
      const trustText = document.getElementById("setup-trust-text");
      if (trustPill && trustText) {
        if (size) {
          trustText.textContent = `${size} · extension-only · no website files`;
          trustPill.classList.add("has-size");
        }
        trustPill.classList.add("is-visible");
      }

    } catch (err) {
      // ── Graceful fallback ─────────────────────────────────────────────────
      console.info("[My Prompt Sucks] GitHub API unavailable, falling back gracefully.", err.message);

      document.querySelectorAll(DL_BUTTONS_SELECTOR).forEach(btn => {
        applyFallback(btn);
      });

      // Show fallback version label in meta strips
      ["hero-meta-version", "wt-meta-version"].forEach(id => {
        setElText(id, "Latest Release");
      });
      ["hero-release-meta", "walkthrough-release-meta"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("is-visible");
      });

      // Trust pill still shown with generic text
      const trustPill = document.getElementById("setup-trust-pill");
      if (trustPill) trustPill.classList.add("is-visible");
    }
  }

  wireDownloadButtons();
});

