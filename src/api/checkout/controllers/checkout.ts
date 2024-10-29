// src/api/checkout/controllers/checkout.ts
import https from 'https';
import querystring from 'querystring';

const prepareCheckout = async (ctx) => {
  const { amount, currency, paymentType } = ctx.request.body;
  const path = '/v1/checkouts';
  const data = querystring.stringify({
    'entityId': '8ac7a4c981faa8650181fe7436b3054e',
    'amount': amount,
    'currency': currency,
    'paymentType': paymentType,
    'integrity': 'true'
  });

  const options = {
    port: 443,
    host: 'eu-test.payments-own.financial',
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      'Authorization': 'Bearer OGFjN2E0Yzk4MWZhYTg2NTAxODFmZTc0MzcyYjA1NTJ8Z1p4cktBN2hoNg=='
    }
  };

  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, (res) => {
      const buf: Buffer[] = [];
      res.on('data', (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on('end', () => {
        const jsonString = Buffer.concat(buf).toString('utf8');
        try {
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });

    postRequest.on('error', reject);
    postRequest.write(data);
    postRequest.end();
  });
};

export default { prepareCheckout };
