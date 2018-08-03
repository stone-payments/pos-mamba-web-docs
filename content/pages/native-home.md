<!--
  @title: API Nativa
-->

O Mamba Websdk oferece um conjunto de funções capazes de interagir com as funcionalidades nativas do POS.<br/>Para isso, basta importar as funções nativas necessárias.

 ```bash
yarn install @mambasdk/native
```

Agora só importar o módulo que deseja, sempre descontruindo objeto do pacote `@mambasdk/native`:

```js
import System from '@mambasdk/native/system.js'
```