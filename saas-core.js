(function attachCore(root) {
  function toPositiveNumber(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return parsed;
  }

  function roundMoney(value) {
    return Math.round(value);
  }

  function calculateSaasImpact(input) {
    const monthlyOrders = toPositiveNumber(input.monthlyOrders);
    const averageTicket = toPositiveNumber(input.averageTicket);
    const conversionLiftPct = toPositiveNumber(input.conversionLiftPct);
    const retentionLiftPct = toPositiveNumber(input.retentionLiftPct);
    const savedHours = toPositiveNumber(input.savedHours);
    const hourlyCost = toPositiveNumber(input.hourlyCost);

    const currentRevenue = monthlyOrders * averageTicket;
    const revenueLift = roundMoney(currentRevenue * ((conversionLiftPct + retentionLiftPct) / 100));
    const automationSavings = roundMoney(savedHours * hourlyCost);
    const monthlyImpact = revenueLift + automationSavings;

    return {
      revenueLift,
      automationSavings,
      monthlyImpact,
      annualImpact: monthlyImpact * 12,
    };
  }

  function formatBRL(value) {
    return toPositiveNumber(value)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })
      .replace(/\u00a0/g, ' ');
  }

  function buildWhatsAppUrl(input) {
    const phone = String(input.phone || '').replace(/\D/g, '');
    const plan = input.plan || 'Landing Growth';
    const segment = input.segment || 'negocio digital';
    const monthlyImpact = formatBRL(input.monthlyImpact || 0);
    const message = [
      `Quero conhecer o plano ${plan} da DevForge.`,
      `Meu segmento: ${segment}.`,
      `Potencial estimado de impacto mensal: ${monthlyImpact}.`,
      'Quero uma estrategia digital para vender melhor, organizar atendimento e medir resultados.',
    ].join(' ');

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function getMotionStrategy(choice) {
    const normalized = String(choice || 'abc').toLowerCase();
    const strategies = {
      abc: {
        motionLayers: [
          'computer-scroll',
          'ai-security-cockpit',
          'social-commerce-flow',
        ],
        demandPillars: [
          'Landing pages que explicam a oferta e geram contato',
          'Sistemas sob medida para cortar trabalho manual',
          'Bancos de dados, dashboards e historico de cliente',
          'IA aplicada ao atendimento, triagem e follow-up',
          'Seguranca, LGPD, backups, logs e permissao por perfil',
          'TikTok, Instagram, WhatsApp e CRM no mesmo fluxo',
        ],
        promise: 'a empresa entende o gargalo, automatiza a rotina e cresce com controle',
      },
    };

    return strategies[normalized] || strategies.abc;
  }

  function getGrowthBlueprint() {
    return [
      {
        id: 'channel-radar',
        headline: 'Atração com origem identificada',
        metric: 'canal certo',
      },
      {
        id: 'conversion-page',
        headline: 'Landing page feita para converter',
        metric: 'menos duvida',
      },
      {
        id: 'ai-service',
        headline: 'Atendimento com IA e contexto',
        metric: 'resposta rapida',
      },
      {
        id: 'secure-database',
        headline: 'Banco de dados e segurança',
        metric: 'controle real',
      },
      {
        id: 'growth-loop',
        headline: 'Evolução depois do lançamento',
        metric: 'crescimento continuo',
      },
    ];
  }

  function getTrustCommunication() {
    return {
      heroHeadline: 'Criamos automacoes, sistemas e paginas que transformam atendimento em venda organizada.',
      trustPillars: [
        {
          id: 'growth-offer',
          label: 'Crescimento claro',
          copy: 'A empresa entende o gargalo, a oferta, o canal de entrada e o proximo passo antes de investir.',
        },
        {
          id: 'automation-system',
          label: 'Sistema e automacao',
          copy: 'Landing page, sistema, WhatsApp, CRM e rotina interna trabalham no mesmo fluxo.',
        },
        {
          id: 'data-security',
          label: 'Dados protegidos',
          copy: 'Banco de dados, permissao, backup, logs e historico entram na proposta desde o desenho.',
        },
        {
          id: 'ai-implementation',
          label: 'IA com uso real',
          copy: 'A IA responde, resume, classifica e lembra sua equipe sem tirar o controle humano da operacao.',
        },
      ],
      about: {
        owner: 'Murilo Caniloi Ambrosio',
        role: 'Full Stack Developer e AI Integration Engineer por tras da DevForge',
      },
      assurances: [
        'A empresa crescer com mais controle e menos retrabalho e o centro da proposta.',
        'O comprador ve servico, processo, seguranca e uso pratico antes de falar de preco.',
        'A animacao chama atencao, mas a copy mostra como o projeto vende, atende e organiza.',
      ],
    };
  }

  function getIntroBlueprint() {
    return {
      headline: 'Sua empresa aparece, responde, organiza e cresce.',
      stages: [
        {
          id: 'attract',
          label: 'Atrair',
          copy: 'TikTok, Instagram, Google e indicacao levam a pessoa para uma oferta clara',
        },
        {
          id: 'convert',
          label: 'Converter',
          copy: 'landing page, prova, duvidas respondidas e WhatsApp reduzem atrito',
        },
        {
          id: 'automation',
          label: 'Automatizar',
          copy: 'IA, CRM e follow-up tiram tarefa repetida da rotina da equipe',
        },
        {
          id: 'database',
          label: 'Dados',
          copy: 'secure database, historico, permissao e painel deixam a operacao sob controle',
        },
        {
          id: 'trust',
          label: 'Seguranca',
          copy: 'LGPD, backup, logs e revisao humana deixam a entrega mais confiavel',
        },
        {
          id: 'growth',
          label: 'Crescer',
          copy: 'metricas mostram onde investir, corrigir e escalar o projeto',
        },
      ],
      videoPrompt: {
        model: 'Seedance 2.0',
        aspectRatio: '16:9',
        duration: 12,
        prompt:
          'cinematic SaaS website intro, floating laptop descending into frame, vertical social video cards behind it, AI assistant panels, WhatsApp lead cards, CRM pipeline, secure database, security shield, dashboard numbers, teal cyan light, coral and amber accents, dark premium tech office, smooth scroll-controlled motion, no readable text, commercial quality',
      },
    };
  }

  function getFounderProfile() {
    return {
      name: 'Murilo Caniloi Ambrosio',
      github: 'https://github.com/murilocaniloiambrosio-ai',
      positioning: 'Full Stack Developer & AI Integration Engineer em Guarulhos, SP',
      capabilities: [
        'Full Stack development',
        'AI integration',
        'business automation',
        'React and Vite interfaces',
        'Python RPA',
        'n8n workflows',
        'database modeling',
        'DevOps and Cloud learning',
      ],
      projects: [
        'DEVFORGE v2',
        'Liftmax platform',
        'app_financeiro',
        'daily-planner',
        'Python RPA automation bot',
      ],
    };
  }

  const api = {
    calculateSaasImpact,
    formatBRL,
    buildWhatsAppUrl,
    getMotionStrategy,
    getGrowthBlueprint,
    getTrustCommunication,
    getIntroBlueprint,
    getFounderProfile,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.DevForgeSaasCore = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
