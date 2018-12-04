const path = require('path');

module.exports = {
  server: {
    ports: {
      dev: 3000,
      prod: 80,
      secure: 443
    },
    credentials: {
      staging: {
        key: path.join(process.cwd(), "key-staging.pem"),
        cert: path.join(process.cwd(), "cert-staging.pem"),
        password: "1234"
      },
      prod: {
        key: "/home/deployusr/cert/_.stone.com.br.key",
        cert: "/home/deployusr/cert/_.stone.com.br.crt", 
        ca: [
          "/home/deployusr/cert/gd_bundle-g2-g1.crt",
          "/home/deployusr/cert/be94a68b8af575bd.crt"
        ]
      }
    }
  }
}