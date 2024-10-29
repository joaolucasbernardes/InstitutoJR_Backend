import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres'); // Altere para 'postgres'
  const connections = {
    postgres: {
      connection: {
        host: env('DATABASE_HOST', 'junction.proxy.rlwy.net'), // Host do Railway
        port: env.int('DATABASE_PORT', 41610),
        database: env('DATABASE_NAME', 'railway'),
        user: env('DATABASE_USERNAME', 'postgres'),
        password: env('DATABASE_PASSWORD', 'AGpOSFaPIRIlBmCSRRPKAadyvMfjEVNq'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
