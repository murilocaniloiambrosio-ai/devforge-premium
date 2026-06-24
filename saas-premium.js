(function initDevForgeSaas() {
  const core = window.DevForgeSaasCore;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  }

  function closeNav() {
    if (!navToggle || !navLinks) return;
    document.body.classList.remove('nav-open');
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  function initNavigation() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
  }

  function initTrendTabs() {
    const tabs = Array.from(document.querySelectorAll('[data-trend-tab]'));
    const panels = Array.from(document.querySelectorAll('[data-trend-panel]'));
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.trendTab;
        tabs.forEach((item) => {
          const active = item === tab;
          item.classList.toggle('active', active);
          item.setAttribute('aria-selected', String(active));
        });
        panels.forEach((panel) => {
          panel.classList.toggle('active', panel.dataset.trendPanel === target);
        });
      });
    });
  }

  function initBillingToggle() {
    const buttons = Array.from(document.querySelectorAll('[data-period]'));
    const cards = Array.from(document.querySelectorAll('[data-plan-card]'));
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const period = button.dataset.period;
        buttons.forEach((item) => item.classList.toggle('active', item === button));
        cards.forEach((card) => {
          const price = card.querySelector('[data-plan-price]');
          if (price) {
            price.textContent = card.dataset[period] || card.dataset.setup || '';
          }
        });
      });
    });
  }

  function getCalculatorValues(form) {
    return {
      monthlyOrders: form.elements.monthlyOrders.value,
      averageTicket: form.elements.averageTicket.value,
      conversionLiftPct: form.elements.conversionLiftPct.value,
      retentionLiftPct: form.elements.retentionLiftPct.value,
      savedHours: form.elements.savedHours.value,
      hourlyCost: form.elements.hourlyCost.value,
    };
  }

  function updateCalculatorOutputs(form, values) {
    const outputMap = {
      monthlyOrders: Number(values.monthlyOrders).toLocaleString('pt-BR'),
      averageTicket: core.formatBRL(values.averageTicket),
      conversionLiftPct: `${values.conversionLiftPct}%`,
      retentionLiftPct: `${values.retentionLiftPct}%`,
      savedHours: `${values.savedHours}h`,
      hourlyCost: core.formatBRL(values.hourlyCost),
    };

    Object.entries(outputMap).forEach(([name, value]) => {
      const output = form.querySelector(`[data-output="${name}"]`);
      if (output) output.textContent = value;
    });
  }

  function initCalculator() {
    const form = document.querySelector('[data-calculator]');
    const monthlyNode = document.querySelector('[data-impact-monthly]');
    const annualNode = document.querySelector('[data-impact-annual]');
    const whatsApp = document.querySelector('[data-calculator-whatsapp]');
    if (!form || !monthlyNode || !annualNode || !core) return;

    function render() {
      const values = getCalculatorValues(form);
      const impact = core.calculateSaasImpact(values);
      updateCalculatorOutputs(form, values);
      monthlyNode.textContent = core.formatBRL(impact.monthlyImpact);
      annualNode.textContent = core.formatBRL(impact.annualImpact);

      if (whatsApp) {
        whatsApp.href = core.buildWhatsAppUrl({
          phone: '5511998992348',
          plan: 'Automation OS',
          segment: 'automacao, sistema e IA para empresa',
          monthlyImpact: impact.monthlyImpact,
        });
      }
    }

    form.addEventListener('input', render);
    render();
  }

  function initPlanLinks() {
    if (!core) return;
    document.querySelectorAll('[data-plan-cta]').forEach((link) => {
      const plan = link.dataset.planCta;
      link.href = core.buildWhatsAppUrl({
        phone: '5511998992348',
        plan,
        segment: 'projeto digital para crescimento',
        monthlyImpact: 0,
      });
    });
  }

  function initMotionScene() {
    const scene = document.querySelector('[data-motion-scene]');
    if (!scene || reduceMotion) return;

    let ticking = false;

    function updateScrollMotion() {
      const rect = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, Math.abs(rect.top) / Math.max(1, rect.height)));
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));
      ticking = false;
    }

    function requestScrollMotion() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollMotion);
    }

    scene.addEventListener('pointermove', (event) => {
      const rect = scene.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      document.documentElement.style.setProperty('--mouse-x', mouseX.toFixed(3));
      document.documentElement.style.setProperty('--mouse-y', mouseY.toFixed(3));
    });

    window.addEventListener('scroll', requestScrollMotion, { passive: true });
    updateScrollMotion();
  }

  function initIntroScene() {
    const scene = document.querySelector('[data-intro-scene]');
    if (!scene) return;

    if (reduceMotion) {
      document.documentElement.style.setProperty('--intro-progress', '1');
      scene.dataset.introStage = 'growth';
      return;
    }

    const stages = ['attract', 'convert', 'automation', 'database', 'trust', 'growth'];
    let ticking = false;

    function updateIntroMotion() {
      const rect = scene.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const stageIndex = Math.min(stages.length - 1, Math.floor(progress * stages.length));

      document.documentElement.style.setProperty('--intro-progress', progress.toFixed(3));
      scene.dataset.introStage = stages[stageIndex];
      ticking = false;
    }

    function requestIntroMotion() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateIntroMotion);
    }

    window.addEventListener('scroll', requestIntroMotion, { passive: true });
    window.addEventListener('resize', requestIntroMotion);
    updateIntroMotion();
  }

  function initRevealCards() {
    const cards = Array.from(document.querySelectorAll('.reveal-card'));
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22 });

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
      observer.observe(card);
    });
  }

  function initCountUps() {
    const counters = Array.from(document.querySelectorAll('[data-count-up]'));
    if (!counters.length || !core) return;

    function animateCounter(node) {
      const target = Number(node.dataset.target || 0);
      if (!Number.isFinite(target) || target <= 0) return;

      if (reduceMotion) {
        node.textContent = core.formatBRL(target);
        return;
      }

      const duration = 1500;
      const start = performance.now();

      function frame(now) {
        const elapsed = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        node.textContent = core.formatBRL(target * eased);
        if (elapsed < 1) {
          window.requestAnimationFrame(frame);
        }
      }

      window.requestAnimationFrame(frame);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.65 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function initMagneticButtons() {
    if (reduceMotion) return;
    const buttons = Array.from(document.querySelectorAll('.btn'));
    buttons.forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener('pointerleave', () => {
        button.style.transform = '';
      });
    });
  }

  function initGrowthReactor() {
    const reactor = document.querySelector('[data-growth-reactor]');
    if (!reactor) return;

    const steps = Array.from(reactor.querySelectorAll('[data-reactor-step]'));
    if (!steps.length) return;

    let activeIndex = Math.max(0, steps.findIndex((step) => step.classList.contains('active')));
    let timer = null;

    function setActive(index) {
      activeIndex = (index + steps.length) % steps.length;
      steps.forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === activeIndex);
      });
      reactor.dataset.activeStep = steps[activeIndex].dataset.reactorStep || '';
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = window.setInterval(() => setActive(activeIndex + 1), 2600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    steps.forEach((step, index) => {
      step.addEventListener('pointerenter', () => {
        stop();
        setActive(index);
      });
      step.addEventListener('click', () => setActive(index));
    });

    reactor.addEventListener('pointerleave', start);
    setActive(activeIndex);
    start();
  }

  window.addEventListener('scroll', setHeaderState, { passive: true });
  setHeaderState();
  initNavigation();
  initTrendTabs();
  initBillingToggle();
  initCalculator();
  initPlanLinks();
  initIntroScene();
  initMotionScene();
  initRevealCards();
  initCountUps();
  initMagneticButtons();
  initGrowthReactor();
})();
