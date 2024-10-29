// src/api/checkout/controllers/payment-status.ts
import https from 'https';

const getPaymentStatus = async (ctx) => {
  const resourcePath = ctx.query.resourcePath;
  const path = `${resourcePath}?entityId=8ac7a4c981faa8650181fe7436b3054e`;

  const options = {
    port: 443,
    host: 'eu-test.payments-own.financial',
    path: path,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer OGFjN2E0Yzk4MWZhYTg2NTAxODFmZTc0MzcyYjA1NTJ8Z1p4cktBN2hoNg=='
    }
  };

  return new Promise((resolve, reject) => {
    const getRequest = https.request(options, (res) => {
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

    getRequest.on('error', reject);
    getRequest.end();
  });
};

export default { getPaymentStatus };
