import { Context } from 'koa';
import {
  createCustomer, getCustomerByCpfCnpj, updateCustomer, createPaymentLink,
  CustomerData, PaymentData
} from '../../../services/asaas';

function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf[10]);
}

function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  const tamanho = cnpj.length - 2;
  const numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = 0; i < tamanho; i++) {
    soma += parseInt(numeros[i]) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos[0])) return false;

  soma = 0;
  pos = tamanho - 7;
  for (let i = 0; i < tamanho + 1; i++) {
    soma += parseInt(numeros[i]) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos[1]);
}

export default {
  async createPayment(ctx: Context) {
    try {
      const { customerData, paymentData } = ctx.request.body as { customerData: CustomerData; paymentData: PaymentData };

      console.log(`[createPayment] Dados recebidos:`);
      console.log(`- Dados do cliente:`, customerData);
      console.log(`- Dados do pagamento:`, paymentData);

      // Validação do CPF ou CNPJ
      if (!validarCPF(customerData.cpfCnpj) && !validarCNPJ(customerData.cpfCnpj)) {
        console.error('[createPayment] CPF ou CNPJ inválido:', customerData.cpfCnpj);
        ctx.throw(400, 'CPF ou CNPJ inválido.');
      }

      customerData.cpfCnpj = customerData.cpfCnpj.replace(/\D/g, '');
      console.log(`[createPayment] CPF/CNPJ após limpeza: ${customerData.cpfCnpj}`);

      // Verifica se o cliente já existe no Asaas
      console.log('Recebendo dados de pagamento:', paymentData);
      console.log('Recebendo dados de cliente:', customerData);

      let customer = await getCustomerByCpfCnpj(customerData.cpfCnpj);
      console.log('Resultado da busca por cliente:', customer);

      if (customer) {
          console.log('Cliente encontrado, atualizando:', customer.id);
          await updateCustomer(customer.id, customerData);
      } else {
          console.log('Cliente não encontrado, criando um novo cliente');
          customer = await createCustomer(customerData);
      }

      console.log('Cliente final após criação/atualização:', customer);
      console.log(`[createPayment] ID do cliente usado no pagamento: ${customer.id}`);

      paymentData.customer = customer.id;

      const paymentResponse = await createPaymentLink(paymentData);
      console.log(`[createPayment] Resposta do Asaas para o pagamento:`, paymentResponse);

      ctx.body = { invoiceUrl: paymentResponse.invoiceUrl };
    } catch (error) {
      console.error('[createPayment] Erro ao criar pagamento:', error);
      ctx.throw(500, 'Erro interno ao criar pagamento.');
    }
  },
};
