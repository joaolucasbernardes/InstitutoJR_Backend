// src/api/checkout/routes/index.ts
import prepareCheckout from '../controllers/checkout';
import getPaymentStatus from '../controllers/payment-status';

export default {
  routes: [
    {
      method: 'POST',
      path: '/prepare-checkout',
      handler: prepareCheckout.prepareCheckout,
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/payment-status',
      handler: getPaymentStatus.getPaymentStatus,
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
