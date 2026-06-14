document.addEventListener("DOMContentLoaded", () => {
  // Remove js-loading class to initiate smooth GSAP reveal transitions
  document.documentElement.classList.remove("js-loading");

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


  // ── KEYBOARD SHORTCUT SCROLL TO SHOWCASE ───────────────────────────────────
  window.addEventListener("keydown", (e) => {
    // Check for (Ctrl or Cmd) + Shift + E
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;
    const isE = e.key === 'e' || e.key === 'E' || e.keyCode === 69;

    if (isCmdOrCtrl && isShift && isE) {
      e.preventDefault();
      const targetElement = document.getElementById("playground");
      if (targetElement && lenis) {
        lenis.scrollTo(targetElement, {
          offset: -80 // Offset navbar height
        });
      }
    }
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
  gsap.utils.toArray(".walkthrough-step").forEach((card, i) => {
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

  const featureBlockLarge = document.querySelector(".feature-block-large");
  if (featureBlockLarge) {
    gsap.from(featureBlockLarge, {
      scrollTrigger: {
        trigger: featureBlockLarge,
        start: "top 80%",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out"
    });
  }

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

  const isMobile = window.innerWidth < 768;
  const particles = [];
  const particleCount = isMobile ? 80 : 180; // Balanced count for a clean, non-crowded drift
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
          
          // Amplified push force for clearly visible mouse interactions
          this.x += directionX * force * 4.5;
          this.y += directionY * force * 4.5;
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
      if (!isMobile) {
        ctx.shadowColor = `hsla(${this.hue}, ${this.saturation}%, 55%, 0.3)`;
        ctx.shadowBlur = 4;
      }
      ctx.fill();
      if (!isMobile) {
        ctx.shadowBlur = 0;
      }
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Burst particle pool — must be declared before animateParticles is called
  const burstParticles = [];

  // Single unified render loop — handles both background particles and burst pool
  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Low opacity background glow
    ctx.fillStyle = "rgba(11, 11, 12, 0.05)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Burst overlay — drawn on top, culled when life expires
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      burstParticles[i].update();
      burstParticles[i].draw();
      if (burstParticles[i].life <= 0) burstParticles.splice(i, 1);
    }

    requestAnimationFrame(animateParticles);
  }
  
  animateParticles();


  // ── MOCKUP BUTTON BURST INTERACTION ────────────────────────────────────────

  class BurstParticle {
    constructor(x, y, hue, saturation, size, speed, angle) {
      this.x    = x;
      this.y    = y;
      this.hue  = hue;
      this.sat  = saturation;
      this.size = size * (Math.random() * 0.8 + 0.6);
      this.vx   = Math.cos(angle) * speed * (Math.random() * 0.6 + 0.7);
      this.vy   = Math.sin(angle) * speed * (Math.random() * 0.6 + 0.7);
      this.life = 1.0;
      this.decay = Math.random() * 0.018 + 0.012;
      this.gravity = 0.06;
    }
    update() {
      this.x   += this.vx;
      this.y   += this.vy;
      this.vy  += this.gravity;
      this.vx  *= 0.97;
      this.life -= this.decay;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, 65%, ${this.life * 0.9})`;
      ctx.shadowColor = `hsla(${this.hue}, ${this.sat}%, 55%, ${this.life * 0.5})`;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function spawnBurst(originEl, hue, saturation, count, speed) {
    const rect = originEl.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
      burstParticles.push(
        new BurstParticle(cx, cy, hue, saturation,
          Math.random() * 3 + 1.5, speed, angle)
      );
    }
  }

  // Wire up mockup buttons — remove disabled so they're clickable
  const mockupBtns = document.querySelectorAll(".mockup-btn");
  mockupBtns.forEach(btn => btn.removeAttribute("disabled"));

  const saveBtn = document.querySelector(".mockup-btn.primary");
  const testBtn = document.querySelector(".mockup-btn:not(.primary)");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      // Golden yellow burst — 52 particles shooting outward
      spawnBurst(saveBtn, 45, 95, 52, 7.5);
      // Brief status ripple: flash the success alert
      const alert = document.querySelector(".mockup-status-alert");
      if (alert) {
        alert.style.transition = "opacity 0.08s ease";
        alert.style.opacity    = "0.3";
        setTimeout(() => { alert.style.opacity = "1"; }, 100);
      }
    });
  }

  if (testBtn) {
    testBtn.addEventListener("click", () => {
      // Cool white ripple ring burst — 38 particles, wider spread
      spawnBurst(testBtn, 200, 30, 38, 6.0);
      // Second ring delayed — layered depth
      setTimeout(() => spawnBurst(testBtn, 210, 20, 26, 4.5), 80);
    });
  }


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
  const REPO       = "seffhunnn/my-prompt-sucks";
  const GITHUB_API = `https://api.github.com/repos/${REPO}/releases/latest`;
  const FALLBACK   = `https://github.com/${REPO}/releases/latest`;
  const log        = (label, data) => console.log(`[MPS Download] ${label}`, data ?? "");

  // Shared state — set once by the API, read by every click handler
  let resolvedZipUrl  = null;   // browser_download_url of the ZIP asset
  let resolvedName    = null;   // asset filename (e.g. my-prompt-sucks-v1.0.2.zip)
  let resolvedVersion = null;   // tag_name (e.g. v1.0.2)

  // ── Helpers ──────────────────────────────────────────────────────────────

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return null;
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  }

  function relativeDate(iso) {
    if (!iso) return null;
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (d === 0) return "today";
    if (d === 1) return "yesterday";
    if (d < 7)   return `${d} days ago`;
    if (d < 30)  return `${Math.floor(d / 7)}w ago`;
    if (d < 365) return `${Math.floor(d / 30)}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
  }

  function setText(id, t) {
    const e = document.getElementById(id);
    if (e && t !== null && t !== undefined) {
      e.classList.remove("version-loading-shimmer");
      e.textContent = t;
    }
  }
  function showEl(id)      { const e = document.getElementById(id); if (e) e.style.display = ""; }

  function updateDynamicVersions(tag) {
    if (!tag) return;
    const isFallback = tag === "Latest Release" || tag === "Latest";
    const versionNum = isFallback ? "Latest" : (tag.startsWith('v') ? tag.slice(1) : tag);
    const resolvedTag = isFallback ? "Latest Release" : tag;

    document.querySelectorAll(".dynamic-version-num").forEach(el => {
      el.classList.remove("version-loading-shimmer");
      el.textContent = versionNum;
      el.style.opacity = "0";
      el.style.transition = "opacity 0.25s ease-in-out";
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });
    });

    document.querySelectorAll(".dynamic-version-tag").forEach(el => {
      el.classList.remove("version-loading-shimmer");
      el.textContent = resolvedTag;
      el.style.opacity = "0";
      el.style.transition = "opacity 0.25s ease-in-out";
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });
    });
  }

  // ── Native download — no fetch, no blob, no CORS ─────────────────────────
  // GitHub release assets block cross-origin fetch requests.
  // Setting window.location.href lets the browser download directly.

  function nativeDownload(url) {
    log("Triggering native download", url);
    window.location.href = url;
  }

  // ── Wire every .download-btn to natively download the ZIP ────────────────

  function attachDownloadListeners() {
    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (resolvedZipUrl) {
          nativeDownload(resolvedZipUrl);
        } else {
          log("No resolved ZIP — opening release page as fallback");
          window.location.href = FALLBACK;
        }
      });
    });
  }

  // ── Update button labels after API resolves ──────────────────────────────

  function updateButtonLabels(label) {
    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.classList.remove("is-loading");
      btn.classList.add("is-resolved");
      const lbl = btn.querySelector(".btn-label");
      if (lbl) {
        lbl.style.transition = "opacity 0.18s ease";
        lbl.style.opacity = "0";
        setTimeout(() => { lbl.textContent = label; lbl.style.opacity = "1"; }, 180);
      }
    });
  }

  function markButtonsFallback() {
    document.querySelectorAll(".download-btn").forEach(btn => {
      btn.classList.remove("is-loading");
      btn.classList.add("is-fallback");
      const lbl = btn.querySelector(".btn-label");
      if (lbl) lbl.textContent = "View Latest Release";
    });
  }

  // ── Populate metadata strips ─────────────────────────────────────────────

  function populateMeta({ vId, dId, sId, sSep, stripId, version, date, size }) {
    if (version) setText(vId, version);
    if (date)    setText(dId, date);
    if (size) { setText(sId, `${size} · extension only`); showEl(sSep); }
    const strip = document.getElementById(stripId);
    if (strip) strip.classList.add("is-visible");
  }

  // ── Main: fetch latest release and wire everything up ────────────────────

  async function wireDownloadButtons() {
    log("Fetching latest release from", GITHUB_API);

    try {
      const res = await fetch(GITHUB_API, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      log("API response status", res.status);
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);

      const release = await res.json();
      log("Release object", release.tag_name, release);

      // Find the ZIP asset whose name contains "my-prompt-sucks"
      const zipAsset = (release.assets || []).find(a =>
        a.name && a.name.endsWith(".zip") && a.name.includes("my-prompt-sucks")
      );
      log("ZIP asset found", zipAsset ? zipAsset.name : "NONE", zipAsset);

      if (!zipAsset) {
        log("WARNING: No ZIP asset found — falling back to release page");
        markButtonsFallback();
        updateDynamicVersions("Latest Release");
        setText("hero-meta-version", "Latest Release");
        setText("wt-meta-version",  "Latest Release");
        ["hero-release-meta", "walkthrough-release-meta"].forEach(id => {
          const el = document.getElementById(id); if (el) el.classList.add("is-visible");
        });
        const tp = document.getElementById("setup-trust-pill");
        if (tp) tp.classList.add("is-visible");
        return;
      }

      // Store resolved values for click handlers
      resolvedZipUrl  = zipAsset.browser_download_url;
      resolvedName    = zipAsset.name;
      resolvedVersion = release.tag_name || "";
      const size      = formatBytes(zipAsset.size);
      const date      = relativeDate(release.published_at);
      const btnLabel  = `Download ${resolvedVersion}`;

      log("RESOLVED — browser_download_url", resolvedZipUrl);
      log("RESOLVED — filename", resolvedName);
      log("RESOLVED — version", resolvedVersion);

      // Also stamp href directly on every download button so that
      // right-click → Save Link As, middle-click, and ctrl+click all work
      document.querySelectorAll(".download-btn").forEach(btn => {
        btn.href = resolvedZipUrl;
      });

      updateDynamicVersions(resolvedVersion);

      // Update UI
      updateButtonLabels(btnLabel);

      populateMeta({
        vId: "hero-meta-version", dId: "hero-meta-date",
        sId: "hero-meta-size", sSep: "hero-meta-size-sep", stripId: "hero-release-meta",
        version: resolvedVersion, date, size
      });
      populateMeta({
        vId: "wt-meta-version", dId: "wt-meta-date",
        sId: "wt-meta-size", sSep: "wt-meta-size-sep", stripId: "walkthrough-release-meta",
        version: resolvedVersion, date, size
      });

      const tp = document.getElementById("setup-trust-pill");
      const tt = document.getElementById("setup-trust-text");
      if (tp && tt && size) {
        tt.textContent = `${size} · extension-only · no website files`;
        tp.classList.add("has-size", "is-visible");
      } else if (tp) {
        tp.classList.add("is-visible");
      }

    } catch (err) {
      log("ERROR — API request failed", err.message);
      markButtonsFallback();
      updateDynamicVersions("Latest Release");
      setText("hero-meta-version", "Latest Release");
      setText("wt-meta-version",  "Latest Release");
      ["hero-release-meta", "walkthrough-release-meta"].forEach(id => {
        const el = document.getElementById(id); if (el) el.classList.add("is-visible");
      });
      const tp = document.getElementById("setup-trust-pill");
      if (tp) tp.classList.add("is-visible");
    }
  }

  // Attach click handlers immediately (no API dependency)
  attachDownloadListeners();

  // Fetch release data
  wireDownloadButtons();

  // 10. CINEMATIC SCROLL PROGRESS BAR
  const progressBar = document.querySelector(".scroll-progress-bar");
  if (progressBar) {
    let ticking = false;

    const updateProgressBar = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollProgress = window.scrollY / scrollHeight;
        progressBar.style.transform = `scaleX(${scrollProgress})`;
      } else {
        progressBar.style.transform = "scaleX(0)";
      }
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgressBar);
        ticking = true;
      }
    }, { passive: true });

    // Initial run
    updateProgressBar();
  }
});

