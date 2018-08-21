<!--
  @title: Migração 1.0 para 2.0 
-->


## Introdução 

Um passo muito importante na transição da SDK 1.0 para a 2.0 é a **Refatoração** dos aplicativos. Isso deve ocorrer porque mudamos o motor utilizado por trás da nossa nova SDK, agora quem é responsável por isso é  o **Svelte**. Desse modo, **não será possível portar o código das aplicações após a atualização da SDK**.

Apesar dessa tarefa parecer ser um pouco trabalhosa, os dois Frameworks são bem parecidos e para ajudá-los nessa transição nosso time de *Developers* preparou este guia.

## Componentes

Os componentes fazem parte do núcleo central de qualquer aplicação, sejam elas produzidas utilizando a SDK 1.0 ou 2.0. Sendo assim, resolvemos começar nosso guia de migração por estes elementos.

Na nossa antiga SDK, um componente seguia a seguinte estrutura:

```js
export default {
  template,
  components: {
    MyComponent
    // declaração dos componentes customizados que estão sendo utilizados no *.html
  },
  props: {
    // propriedades padrão do componente. Podem ser injetadas através da instância do componente.
    myProp: 1,
    myOtherProp: 'other'
  },
  state () {
    return {
      // variáveis de estado inicial do componente
      stateVariable: 15,
      otherStateVariable: true
    }
  },
  onCreate () {
    // callback executada quando o elemento HTML do componente está pronto pra uso
  },
  onUpdate() {
    // callback executada quando o estado do componente precisa ser atualizado
    // use esta callback para atualizar o DOM
    console.log('Algo Mudou Aqui');
  },
  onDestroy() {
    // callback executada antes de o componente ser destruído
    console.log('Elemento Removido');
  },
  onMount() {
    // callback executada antes de o componente aparecer na tela
    console.log('Elemento Inserido no DOM');
  },
  onUnmount() {
    // callback executada antes de o componente ser removido da tela
  },
  methods: {
    // métodos do componente. Serão injetados na instância do componente.
    myMethod () {
      console.log('esse método é público e faz parte da API do componente')
    }
  }
}
```

Em Svelte, eles parecem bastante:

```js
export default {
  components: {
        MyComposverl
  },
  data() {
    return {
      myProp: 1,
      myOtherProp: 'other',
    }
  },
  oncreate() {
    console.log('Elemento Inserido no DOM');
  },
  onupdate() {
    console.log('Algo Mudou Aqui');
  },
  ondestroy() {
    console.log('Elemento Removido');
  },
  onstate({ changed, current, previou }) {
    // executado sempre que alguma alteração acontece
  },
  methods:{
     myMethod () {
      console.log('esse método é público e faz parte da API do componente')
    }   
  }
}
```

Outra parte importante é atribuição de valores às propriedades (`props`/`data`) do componente. Antigamente um valor podia ser acessado diretamente da seguinte forma:

```js
// SDK 1.0

let myVar = this.myProp;
console.log(myVar); // 1
this.myProp = 2
console.log(this.myProp) // 2
```
Agora isso é feito da seguinte maneira: 
```js
//SDK 2.0

let myVarSvelte = this.get().myProp;
console.log(myVarSvelte);
this.set({myProp: 2});
console.log(this.get().myProp); // 2
```

Por fim, uma última modificação que também é importante são as `refs`, que facilitam o acesso a componentes e elementos do `DOM`. Antigamente, no `HTML` tínhamos:

```html
<!-- SDK 1.0 -->
<MyComponent ref="myComponentRef"></MyComponent>

<!-- SDK 2.0 -->
<MyComponent ref:myComponentRef></MyComponent>
```

E para acessá-las:

```js
// SDK 1.0
let myText = "Texto de Exemplo."
this.$refs.myComponentRef.innerText = myText;

// SDK 2.0
this.refs.myComponentRef.innerText = myText;
```

Aproveitando que falamos de `refs` e manipulação de elementos no `DOM`, é interessante também introduzi-los a linguagem de template do **Svelte**. Como vimos no exemplo acima, na versão `1.0` era necessário criar uma referência para inserir uma variável do *JavaScript* dentro de um elemento no `DOM`. Isso atualmente pode ser feito de modo muito mais fácil (desde que essa variável esteja na propriedade `data()`):

```js

<p>{myText}</p>

export default {
  components: {

  },
  data() {
    return {
      myText: "Texto de Exemplo.",
    }
  },
}
```

O mais interessante é que dessa maneira a propriedade do componente se conecta `two way binding`, ou seja caso a propriedade `myText` se altere, o texto dentro de `<p>` se altera no mesmo momento. Isso facilita muito, não? 
Além desta funcionalidade, a linguagem de template do **Svelte** permite possui diversas outras funcionalidades como: iterações, slots e propriedades computadas, sendo assim recomendamos fortemente que se acesse o guia de introdução deles clicando [aqui]('https://svelte.technology/guide')

Para finalizar, aposto que mesmo após essa explicação, você ainda deve estar se perguntando sobre os componentes visuais de nossa `SDK`. Eles também sofreram modificações, começando pelo nome que não possui mais as iniciais *Mb*, a inclusão de novos componentes e a remoção de alguns que achamos que não fariam mais sentido existir. Para a lista completa dos componentes e suas utilizações [acesse aqui]().

## Páginas

Outra parte importante durante o desenvolvimento de aplicações é a construção de páginas. Basicamente, uma página é uma coleção de componentes que juntos trabalham para compor um cenário, seja uma tela de login, cadastro ou de confirmação de compra. Na `SDK 1.0`, as páginas eram organizadas da seguinte maneira:



```markup
└─ pos-mamba-websdk-template
  └─ src
    └─ pages
      └─ yourpage
        ├─ index.js
        ├─ yourpage.html
        └─ yourpage.scss
```

Agora, as páginas também são componentes `Svelte` e podem ter num único arquivo seu `JS`, `CSS` e `HTML`. Além disso, elas estão localizadas dentro da pasta `routes`, lembrando que essa organização diretório é um padrão de projeto nosso e pode ser alterado de acordo com suas necessidades.


```markup
└─ pos-mamba-websdk-template
  └─ src
    └─ routes
      └─ yourpage.html
```

Como exemplo, temos:

```js
// yourpage.html

<div class="my-page-style">
  <AppBarTitle label="My Page"/>
  <MyComponent>
  </MyComponent>
  <Button on:click="myPageMethod()">Click</Button>
</div>

<script>
  import { AppBarTitle } from '@mambasdk/appbar';

  export default {
    components: {
      AppBarTitle,
      Button: '@mambasdk/button',
    },
    data() {
      return {
        MyData: null,
      };
    },
    methods: {
      myPageMethod() {
        console.log('Method Triggered')
      },
    },
  };
</script>

<style>
  .my-page-style {
    padding: 15px;
    background-color: #fff;
    font-size: 18px;
    text-align: center;
  }
</style>

```


## Rotas

Por fim, temos as rotas. Como sabemos, as rotas são a forma de conexão entre uma página e outra. Em nossa primeira `SDK` esse elemento era especificado da seguinte maneira:

```js
// pos-mamba-websdk-template/src/router/index.js

import { MbRouter } from 'mamba-websdk'

import Example from '../pages/example'

export default new MbRouter({
  routes: [
    {
      path: '/',
      component: Example
    }, 
  ]
})

```

Agora, deve-se especificar as rotas diretamente no componente de acesso da aplicação `App.html`, dessa forma:

```js
//  pos-mamba-app-template/src/App.html

<App>
  <Route exact path="/" component={Home}/>
  <Route path="/otherpage/:payload" component={OtherPage}/>
</App>

<script>
  import Home from './routes/Home.html';
  import OtherPage from './routes/OtherPage.html';

  export default {
    components: {
      App: '@mambasdk/app',
      Route: 'svelte-routing/Route',
    },
    data() {
      return {
        Home,
        OtherPage,
      };
    },
  };
</script>
```
Como pode ser visto, para a administração das rotas foi utilizado o `svelte-routing`, caso deseje saber mais sobre como ele funciona [clique aqui](https://github.com/EmilTholin/svelte-routing).

## Considerações Finais

Acredito que podemos agora dizer que é tão difícil adaptar um aplicativo feito na primeira versão da SDK para a mais atual, não é? Mas, ainda assim, deixaremos aqui um repertório de links que podem ajudá-lo:

* [Documentação do Svelte](https://svelte.technology/guide)
* [Documentação Svelte-Routing](https://github.com/EmilTholin/svelte-routing)
* [Canal do Discord do Svelte](https://discordapp.com/invite/yy75DKs)
* [Documentação SDK 1.0](https://stone-payments.github.io/pos-mamba-websdk-docs/docs/components)

Caso tenha alguma dúvida sinta-se à vontade para nos procurar em nosso canal do [Slack]() ou entrar em contato com nosso [Time de Integrações]().
