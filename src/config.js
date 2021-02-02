const path = require('path')

module.exports = {
  server: {
    port: {
      dev: 3000,
      prod: 8080,
    },
    credentials: {
      dev: {
        // key: path.join(process.cwd(), 'localhost.key'),
        // cert: path.join(process.cwd(), 'localhost.cert'),
        requestCert: false,
        rejectUnauthorized: false,
      },
      prod: {
        key: '/home/deployusr/cert/Stone.key',
        cert: '/home/deployusr/cert/stone.crt',
        ca: [
          '/home/deployusr/cert/gd_bundle-g2-g1.crt',
          '/home/deployusr/cert/be94a68b8af575bd.crt',
        ],
      },
    },
  },
}
