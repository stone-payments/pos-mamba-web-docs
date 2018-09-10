<!--
  @title: Introdução
  @description: Test
-->

O Mamba SDK permite o desenvolvimento de aplicativos para o POS da Stone, habilitando uma experiência para o usuário que vai além de apenas pagamento. O Mamba é um sistema e framework desenvolvido pelo time da Stone com suporte para POS. O Mamba SDK faz a abstração das funções do POS, facilitando o desenvolvimento de aplicativos em linguagem Web e, dessa maneira, simplificamos a inserção de aplicativos nos POS.

> É necessário ter o [Node.js](https://nodejs.org/en/) instalado e ter alguma familiaridade com a linha de comando

> Antes de começar a usar o Mamba SDK, recomendamos ter uma boa base de conhecimento de [JavaScript ES2015](http://babeljs.io/docs/learn-es2015/).

O Mamba SDK utiliza o <span style="color:#a03636">**[Svelte](https://svelte.technology/guide)**</span> como framework UI, isso quer dizer que não temos um [Virtual DOM](https://pt.stackoverflow.com/questions/43169/qual-a-diferen%C3%A7a-entre-dom-e-virtual-dom) como no React, Angular, Vue, entre outros. Portanto, os componentes são compilados para um JavaScript ideal durante o build.

### Entendendo um componente em Mamba SDK

Um componente é um arquivo html muito semelhante ao Vue.js. Ou seja, ele é um bloco de código autossuficiente e reutilizável que encapsula marcações, estilos e comportamentos que estão juntos.


## Começando

### 1. Crie um novo projeto

Para iniciar, execute o seguinte comando:
```bash
git clone https://github.com/stone-payments/pos-mamba-app-template <my-app>
cd <my-app>
```
Depois é necessário instalar as dependências do projeto. É recomendado que seja utilizado o `Yarn` para gerenciamento de dependências determinísticas, mas o `npm install` também pode ser utilizado.

```bash
yarn  # Instala dependências do projeto (ou `npm install`)
```

### 2. Rode o projeto

Depois de concluir a etapa de instalação, você está pronto para iniciar o projeto!

```bash
yarn start # Inicie o ambiente de desenvolvimento
```

### 3. Usando alguns componentes da SDK

**Para componentes Web, instale o componente/pacote que deseja usar no projeto:**

```bash
yarn install @mamba/buttom # Componente do botão


# Se quiser usar o dialog por exemplo:

yarn install @mamba/dialog
```



**Para importar o componente instalado, basta seguir uma das formas abaixo:**

```js
<script>
  import Button from '@mamba/buttom';

  export default {
    components: { Button }
  }
</script>

// ou 

<script>
  export default {
    components: {
      Button: '@mamba/buttom'
    }
  }
</script>
```

#### Para módulos da API nativa:

```bash
yarn install @mamba/pos
```

Agora é só importar o módulo desejado, sempre descontruindo objeto do pacote `@mamba/native`:

```js
import System from '@mamba/pos/system.js'
```

### Compatibilidade

O Mamba SDK foi desenvolvido para o [WebKit 534.48.3](https://developers.whatismybrowser.com/useragents/explore/layout_engine_name/webkit/1785) que é equivalente ao Safari 5.1.
