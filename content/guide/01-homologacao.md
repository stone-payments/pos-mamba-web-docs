<!--
  @title: Homologação
-->

## Homologação

Antes de publicar seu Aplicativo em nossa loja e poder disponiza-lo para seus usuários este deverá passar pelo um processo de Homologação e tudo deverá estar de acordo com `As Regras`.


##  Regras

1. Sobre o preenchimento do arquivo `README` do App:
    - É preciso disponibilizar uma descrição básica da intenção de uso do App, na seção **Objetivo**
    - Precisamos que seja descrito o fluxo de funcionamento do App na seção **Fluxo da Aplicação**, com detalhes como usar o aplicativo, para ajudar no processo de homologação e fazer a liberação ser mais ágil.
    - Todas as dependências do App, bem como a disponibilização das instruções de build, precisam ser sinalizadas na seção **Dependências**.
    - Se o App utilizar comunicação por rede, é preciso listar **com antecedência** hosts e/ou IPs utilizados, na seção **Endpoints**. Cada alteração nos endpoints requer cadastro no proxy de aplicação e **pode demorar até 5 dias úteis**.
    - Precisamos que sejam fornecidos usuários e/ou chaves de testes, acesso temporário, entre outros,  para testes das funcionalidades do APP durante o processo de Homologação. Devem ser listados, assim como qualquer passo necessário ao processo de Homologação, na seção **Instruções para Homologação**.
2. É necessário o versionamento de todo código-fonte do App (*.js, *.css, *.html, etc.).
3. Para que a homologação aconteça, deve ser exposto um **ambiente de teste**, assim como todos os dados de acesso com usuário e senha.
4. Não será possível fazer qualquer tipo de configuração ou instalação de softwares terceiros no ambiente de homologação, a homologação será realizada apenas com o aplicativo e nada mais.
5. Caso o aplicativo não consiga ser testado completamente, a **liberação do aplicativo será negada** no mesmo momento.
6. A estrutura de arquivos e de configuração do build deve ser compatível com as mais atuais alterações do repositório https://posgitlab.stone.com.br/stone-payments/pos-mamba-3rdparty-template


## Tempo de Atendimento
  1. Liberação de Endpoints: Até 5 dias úteis
  2. Homologação de App: Até 7 dias úteis
  3. Publicação na Loja: Até 2 dias úteis
