<!--
  @title: Introdução
  @description: Test
-->

O Mamba SDK permite o desenvolvimento de aplicativos para o POS da Stone, habilitando uma experiência para o usuário que vai além de apenas pagamento. O Mamba é um sistema desenvolvido pelo time da Stone com suporte para POS. O Mamba SDK faz a abstração das funções do POS, facilitando o desenvolvimento de aplicativos em linguagem Web e, dessa maneira, simplificamos a inserção de aplicativos nos POS.

> É necessário ter o [Node.js](https://nodejs.org/en/) instalado e ter alguma familiaridade com a linha de comando
> antes de começar a usar o Mamba SDK, recomendamos ter uma boa base de conhecimento de [JavaScript ES2015](http://babeljs.io/docs/learn-es2015/).

O Mamba SDK utiliza o **[Svelte](https://v2.svelte.dev/guide)** como framework UI, isso quer dizer que não temos um [Virtual DOM](https://pt.stackoverflow.com/questions/43169/qual-a-diferen%C3%A7a-entre-dom-e-virtual-dom) como no React, Angular, Vue, entre outros. Portanto, os componentes são compilados para um JavaScript ideal durante o build.

### Entendendo um componente em Mamba SDK

Um componente é um arquivo html muito semelhante ao Vue.js. Ou seja, ele é um bloco de código autossuficiente e reutilizável que encapsula marcações, estilos e comportamentos que estão juntos.


## Começando

### 1. Crie um novo projeto

#### Utilizando a CLI

```bash
# Instale a CLI globalmente
npm i -g @mamba/cli

# Crie um novo aplicativo em 'my-mamba-app'
mamba new app my-mamba-app

? Name: My Mamba App
? Version: 0.0.1
? Description: My new Mamba app

# Entre no diretório do App.
cd my-mamba-app

```

#### Manualmente

Para iniciar, execute o seguinte comando:
```bash
git clone https://github.com/stone-payments/pos-mamba-app-template.git my-app
cd my-app
```
Depois é necessário instalar as dependências do projeto. É recomendado que seja utilizado o [`NPM`](https://docs.npmjs.com/) para gerenciamento de dependências determinísticas, mas o `npm install` também pode ser utilizado.

```bash
npm install  # Instala dependências do projeto (ou `npm i`)
```

## Desenvolvendo

Depois de concluir a etapa de instalação, você está pronto para iniciar o projeto!

```bash
npm run start # Inicie o ambiente de desenvolvimento
```

### Usando alguns componentes da SDK

**Para componentes Web, instale o componente/pacote que deseja usar no projeto:**

```bash
npm install @mamba/button # Componente do botão


# Se quiser usar o dialog por exemplo:

npm install @mamba/dialog
```

**Para importar o componente instalado, basta seguir uma das formas abaixo:**

```html
<script>
  import Button from '@mamba/button/Button.html';

  export default {
    components: {
      Button,
    },
  };
</script>
```

```html
<script>
  export default {
    components: {
      Button: '@mamba/button/Button.html',
    },
  };
</script>
```

### Para módulos da API nativa:

```bash
npm install @mamba/pos
```

Agora é só importar o módulo desejado, sempre desconstruindo objeto do pacote `@mamba/native`:

```js
import System from '@mamba/pos/system.js'
```

## Finalizando

### Testando no Simulador Virtual

Todos os apps da SDK, a partir da versão 2.0, possuem acoplado um simulador virtual da POS para agilizar o desenvolvimento. Basta rodar `npm run start` e depois acessar `http://localhost:8080/` no seu navegador e o app se encontrará lá. Simples e rápido.

### Build

Antes de enviar sua aplicação para testar no `POS` é necessário realizar o `build` desta. Para isso, em seu terminal execute:

```bash
# Utilizando a CLI
mamba app build

# Manualmente
npm run build

```
### Deploy

Para testar suas aplicações em seu POS você deve primeiro ter o Aplicativo de Developer instalado e antes ter realizado o `build` da sua aplicação. Após, digite no terminal do seu computador:

```bash
npm run serve

```
Após o servidor iniciar, abra o aplicativo de developer em seu `POS` e digite o IP local da máquina. Após alguns segundos o seu app será automaticamente baixado e aparecerá na lista de aplicativos instalados do Aplicativo de Developer.

### Compatibilidade

O Mamba SDK foi desenvolvido para o [WebKit 534.48.3](https://developers.whatismybrowser.com/useragents/explore/layout_engine_name/webkit/1785) que é equivalente ao Safari 5.1.
