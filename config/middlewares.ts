// config/middlewares.ts
export default [
  'strapi::errors',
  {
    name: 'strapi::errors',
    config: {
      enabled: true, // Habilite se estiver desabilitado
    },
  },
  'strapi::security',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: false, // Desative temporariamente, se necessário
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:4200', // URL frontend Angular em desenvolvimento
        'https://instituto-jr-frontend.vercel.app', // URL em produção
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  {
    name: 'strapi::logger',
    config: {
      level: 'debug', // Níveis disponíveis: 'info', 'warn', 'error', 'debug'
    },
  },
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
