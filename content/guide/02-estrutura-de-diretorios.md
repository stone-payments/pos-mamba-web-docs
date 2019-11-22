<!--
  @title: Estrutura de diretórios
-->

## Estrutura de diretórios

A estrutura de diretórios de nível superior se parece com o diagrama a seguir:

```markup
Mamba Web
├─ packages ······· Pacotes públicos
├─ tools ·········· Ferramentas de projeto, utilitários para construção e teste
└─ package.json ··· Configuração do projeto
```

### Pacotes

O diretório ```packages``` é onde todos os módulos do Mamba são mantidos. Cada subdiretório possui seu pacote NPM. Portanto, é possível instalar cada pacote separadamente no modelo em que está trabalhando.

Pode parecer algo como:

```markup
└─ packages
  ├─ components ··· Componentes Web feito em Svelte
  ├─ native ······· Pacotes nativos para controlar POS
  ├─ store ········ Armazenamento do tipo Redux para vincular aos componentes
  └─ styles ······· Pacote de estilos Mamba
```

### Estrutura por pacote

A estrutura para cada pacote (módulo) se parece com isso:

```markup
└─ packages
  └─ components
    └─ AppBar
      ├─ dist ··········· Arquivos gerados automaticamente
      ├─ example ········ Exemplos específicos do pacote
      ├─ node_modules ··· Dependências NPM
      ├─ src ············ Código fonte do pacote
      ├─ CHANGELOG.md ··· Todo o histórico de alterações do pacote
      ├─ README.md ······ Documentação de pacote com remarcação avançada
      ├─ index.js ······· Ponto de entrada do pacote
      ├─ LICENSE ········ Licença pacote
      ├─ .gitignore······ Gitignore do pacote
      └─ package.json ··· Configuração do NPM / Pacote
```

#### `example(s)`

A pasta `example` é onde todos os exemplos específicos de cada pacote estão localizados.

```markup
└─ packages
  └─ components
    └─ AppBar
      └─ example
        ├─ App.html
        └─ AnotherDemo.html
```
