import axios from 'axios';

const asaasApi = axios.create({
  baseURL: process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
    access_token: process.env.ASAAS_TOKEN as string,
  },
});

export interface CustomerData {
  id?: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  postalCode?: string;
  companyName?: string;
  tradingName?: string;
}

export interface CustomerResponse {
  data: CustomerData[];
  totalCount: number;
}

export interface PaymentData {
  customer?: string;
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD';
  dueDate: string;
  value: number;
  description?: string;
  externalReference?: string;
  redirectUrl?: string;
}

// Função para buscar o cliente por CPF/CNPJ
export const getCustomerByCpfCnpj = async (cpfCnpj: string): Promise<CustomerData | null> => {
  console.log('Buscando cliente com CPF/CNPJ:', cpfCnpj);
  try {
      const response = await asaasApi.get<CustomerResponse>(`/customers?cpfCnpj=${cpfCnpj}`);
      console.log('Resposta da API Asaas para busca de cliente:', response.data);
      return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
      console.error('Erro ao buscar cliente:', error.response?.data || error.message);
      throw error;
  }
};

export const createCustomer = async (customerData: CustomerData): Promise<any> => {
  console.log('Criando cliente no Asaas com dados:', customerData);
  try {
      const response = await asaasApi.post('/customers', customerData);
      console.log('Resposta da API Asaas para criação de cliente:', response.data);
      return response.data;
  } catch (error) {
      console.error('Erro ao criar cliente:', error.response?.data || error.message);
      throw error;
  }
};

export const updateCustomer = async (customerId: string, customerData: CustomerData): Promise<any> => {
  console.log('Atualizando cliente no Asaas com ID:', customerId, 'e dados:', customerData);
  try {
      const response = await asaasApi.put(`/customers/${customerId}`, customerData);
      console.log('Resposta da API Asaas para atualização de cliente:', response.data);
      return response.data;
  } catch (error) {
      console.error('Erro ao atualizar cliente:', error.response?.data || error.message);
      throw error;
  }
};

// Função para criar link de pagamento
export const createPaymentLink = async (paymentData: PaymentData): Promise<any> => {
  console.log(`[createPaymentLink] Enviando dados para criação de pagamento:`, paymentData);

  try {
    const response = await asaasApi.post('/payments', paymentData);
    console.log(`[createPaymentLink] Pagamento criado com sucesso:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`[createPaymentLink] Erro ao criar link de pagamento no Asaas:`, error.response?.data || error.message);
    throw error;
  }
};
