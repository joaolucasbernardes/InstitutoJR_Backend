// src\api\payments\routes\payments.ts
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payments',
      handler: 'payment.createPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
