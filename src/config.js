const path = require('path');

module.exports = {
  server: {
    port: {
      dev: 3000,
      prod: 80,
    },
    credentials: {
      dev: {
        key: path.join(process.cwd(), 'localhost.key'),
        cert: path.join(process.cwd(), 'localhost.cert'),
        requestCert: false,
        rejectUnauthorized: false,
      },
      prod: {
        key: '/home/deployusr/cert/_.stone.com.br.key',
        cert: '/home/deployusr/cert/_.stone.com.br.crt',
        ca: [
          '/home/deployusr/cert/gd_bundle-g2-g1.crt',
          '/home/deployusr/cert/be94a68b8af575bd.crt',
        ],
      },
    },
  },
};
