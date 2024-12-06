// types/global.d.ts

declare const strapi: {
    log: {
      error: (...args: any[]) => void;
      warn: (...args: any[]) => void;
      info: (...args: any[]) => void;
    };
    // Adicione outros métodos ou propriedades que você precise
  };
  
  export {};
  