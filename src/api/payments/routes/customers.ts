import customersController from '../controllers/customers';

export default {
  routes: [
    {
      method: 'GET',
      path: '/customers/:cpfCnpj',
      handler: 'customers.findCustomerByCpfCnpj',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/customers/:id',
      handler: 'customers.updateCustomer',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
