# DevForge Intro AI Video Prompt

Use este prompt para gerar o video IA da intro quando o Higgsfield estiver autenticado.

## Prompt

```text
cinematic SaaS website intro, floating laptop descending into frame, vertical social video cards behind it, AI assistant panels, WhatsApp lead cards, CRM pipeline, security shield, dashboard numbers, teal cyan light, coral and amber accents, dark premium tech office, smooth scroll-controlled motion, no readable text, commercial quality
```

## Configuracao sugerida

- Modelo: Seedance 2.0
- Duracao: 12s
- Proporcao: 16:9
- Uso no site: video de fundo da intro, sem texto dentro do video

## Comando

```powershell
higgsfield auth login
higgsfield generate create seedance_2_0 --prompt "cinematic SaaS website intro, floating laptop descending into frame, vertical social video cards behind it, AI assistant panels, WhatsApp lead cards, CRM pipeline, security shield, dashboard numbers, teal cyan light, coral and amber accents, dark premium tech office, smooth scroll-controlled motion, no readable text, commercial quality" --duration 12 --aspect_ratio 16:9 --wait --wait-timeout 20m
```

Depois de baixar o video, coloque o arquivo em `media/devforge-intro.mp4` e adicione uma tag `video` dentro de `.intro-bg-video`.
