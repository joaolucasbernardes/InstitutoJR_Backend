import { Context } from 'koa';
import { getCustomerByCpfCnpj, updateCustomer } from '../../../services/asaas';
import { CustomerData } from '../../../services/asaas';

export default {
  /**
   * Buscar um cliente pelo CPF/CNPJ.
   *
   * @param ctx - O contexto do Koa, que inclui a requisição e resposta.
   */
  async findCustomerByCpfCnpj(ctx: Context) {
    try {
      const cpfCnpj = ctx.params.cpfCnpj;
      console.log(`[findCustomerByCpfCnpj] CPF/CNPJ recebido: ${cpfCnpj}`);
      
      const customer = await getCustomerByCpfCnpj(cpfCnpj);
      console.log(`[findCustomerByCpfCnpj] Resultado da busca por CPF/CNPJ:`, customer);

      if (customer) {
        console.log(`[findCustomerByCpfCnpj] Cliente encontrado:`, customer);
        ctx.body = { customer };
      } else {
        console.warn(`[findCustomerByCpfCnpj] Nenhum cliente encontrado para o CPF/CNPJ: ${cpfCnpj}`);
        ctx.status = 404;
        ctx.body = { message: 'Cliente não encontrado.' };
      }
    } catch (error) {
      console.error('[findCustomerByCpfCnpj] Erro ao buscar cliente:', error);
      ctx.throw(500, 'Erro interno ao buscar cliente.');
    }
  },

  /**
   * Atualizar um cliente existente.
   *
   * @param ctx - O contexto do Koa, que inclui a requisição e resposta.
   */
  async updateCustomer(ctx: Context) {
    try {
      const { id } = ctx.params;
      const customerData: CustomerData = ctx.request.body;

      console.log(`[updateCustomer] ID do cliente recebido: ${id}`);
      console.log(`[updateCustomer] Dados do cliente para atualização:`, customerData);

      const updatedCustomer = await updateCustomer(id, customerData);
      console.log(`[updateCustomer] Resultado da atualização:`, updatedCustomer);

      ctx.body = { updatedCustomer };
    } catch (error) {
      console.error('[updateCustomer] Erro ao atualizar cliente:', error);
      ctx.throw(500, 'Erro interno ao atualizar cliente.');
    }
  }
};
