const test = require('node:test');
const assert = require('node:assert/strict');

const {
  calculateSaasImpact,
  formatBRL,
  buildWhatsAppUrl,
  getMotionStrategy,
  getGrowthBlueprint,
  getTrustCommunication,
  getIntroBlueprint,
  getFounderProfile,
} = require('./saas-core');

test('calculateSaasImpact estimates monthly and annual upside from growth and automation', () => {
  const result = calculateSaasImpact({
    monthlyOrders: 420,
    averageTicket: 180,
    conversionLiftPct: 18,
    retentionLiftPct: 7,
    savedHours: 54,
    hourlyCost: 85,
  });

  assert.equal(result.revenueLift, 18900);
  assert.equal(result.automationSavings, 4590);
  assert.equal(result.monthlyImpact, 23490);
  assert.equal(result.annualImpact, 281880);
});

test('calculateSaasImpact clamps invalid values to zero', () => {
  const result = calculateSaasImpact({
    monthlyOrders: -10,
    averageTicket: 0,
    conversionLiftPct: -5,
    retentionLiftPct: 4,
    savedHours: -1,
    hourlyCost: 100,
  });

  assert.equal(result.revenueLift, 0);
  assert.equal(result.automationSavings, 0);
  assert.equal(result.monthlyImpact, 0);
  assert.equal(result.annualImpact, 0);
});

test('formatBRL returns compact Brazilian currency without cents', () => {
  assert.equal(formatBRL(23490), 'R$ 23.490');
});

test('buildWhatsAppUrl encodes a business diagnosis message', () => {
  const url = buildWhatsAppUrl({
    phone: '5511998992348',
    plan: 'Automation OS',
    segment: 'ecommerce',
    monthlyImpact: 23490,
  });

  assert.ok(url.startsWith('https://wa.me/5511998992348?text='));
  assert.ok(decodeURIComponent(url).includes('plano Automation OS'));
  assert.ok(decodeURIComponent(url).includes('ecommerce'));
  assert.ok(decodeURIComponent(url).includes('R$ 23.490'));
});

test('getMotionStrategy combines computer, AI security, and social commerce for ABC direction', () => {
  const strategy = getMotionStrategy('abc');

  assert.deepEqual(strategy.motionLayers, [
    'computer-scroll',
    'ai-security-cockpit',
    'social-commerce-flow',
  ]);
  assert.ok(strategy.demandPillars.includes('Landing pages que explicam a oferta e geram contato'));
  assert.ok(strategy.demandPillars.includes('Sistemas sob medida para cortar trabalho manual'));
  assert.ok(strategy.demandPillars.includes('IA aplicada ao atendimento, triagem e follow-up'));
  assert.ok(strategy.demandPillars.includes('Seguranca, LGPD, backups, logs e permissao por perfil'));
  assert.equal(strategy.promise, 'a empresa entende o gargalo, automatiza a rotina e cresce com controle');
});

test('getGrowthBlueprint maps attention into business growth stages', () => {
  const blueprint = getGrowthBlueprint();

  assert.equal(blueprint.length, 5);
  assert.deepEqual(blueprint.map((item) => item.id), [
    'channel-radar',
    'conversion-page',
    'ai-service',
    'secure-database',
    'growth-loop',
  ]);
  assert.equal(blueprint[0].headline, 'Atração com origem identificada');
  assert.equal(blueprint[4].metric, 'crescimento continuo');
});

test('getTrustCommunication keeps the SaaS pitch clear, personal, and doubt-reducing', () => {
  const communication = getTrustCommunication();

  assert.equal(
    communication.heroHeadline,
    'Criamos automacoes, sistemas e paginas que transformam atendimento em venda organizada.'
  );
  assert.deepEqual(communication.trustPillars.map((item) => item.id), [
    'growth-offer',
    'automation-system',
    'data-security',
    'ai-implementation',
  ]);
  assert.ok(communication.about.owner.includes('Murilo Caniloi'));
  assert.ok(communication.assurances.some((item) => item.includes('empresa crescer')));
});

test('getIntroBlueprint defines the scroll-video intro journey', () => {
  const intro = getIntroBlueprint();

  assert.equal(intro.headline, 'Sua empresa aparece, responde, organiza e cresce.');
  assert.deepEqual(intro.stages.map((stage) => stage.id), [
    'attract',
    'convert',
    'automation',
    'database',
    'trust',
    'growth',
  ]);
  assert.equal(intro.videoPrompt.aspectRatio, '16:9');
  assert.ok(intro.videoPrompt.prompt.includes('secure database'));
});

test('getFounderProfile reflects Murilos public GitHub positioning', () => {
  const profile = getFounderProfile();

  assert.equal(profile.name, 'Murilo Caniloi Ambrosio');
  assert.equal(profile.github, 'https://github.com/murilocaniloiambrosio-ai');
  assert.ok(profile.positioning.includes('Full Stack'));
  assert.ok(profile.capabilities.includes('AI integration'));
  assert.ok(profile.projects.includes('DEVFORGE v2'));
  assert.ok(profile.projects.includes('Liftmax platform'));
});
