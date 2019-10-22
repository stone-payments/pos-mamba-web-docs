<!--
  @title: Manifest
-->

## Manifest

O `manifest.xml` é o arquivo que contém todas as instruções do app para a publicação do seu app. **O manifest é gerado automaticamente a partir do `package.json`**, portanto, verifique se seu package.json está configurado corretamente nates de enviá-lo para homologação.

#### package.json
```json
{
  "name": "my-mamba-app",
  "version": "0.0.1",
  "description": "Starter template for Mamba Applications.",
  "mamba": {
    "id": 99,
    "appName": "My Mamba App",
    "iconPath": "assets/logo.bmp",
    "appCreationDate": "2017-07-17T13:32:00",
    "appKey": "11-11-11-11",
    "autoInitiable": true,
    "appPasswordProtectionLevel": "1",
  }
}
```

#### manifest.xml
```xml
<MambaClass Type="Manifest" Version="1.0">
  <Member Name="appName">My Mamba App</Member>
  <Member Name="defaultName">my-mamba-app</Member>
  <Member Name="displayedName">My Mamba App</Member>
  <Member Name="appVersion">0.0.1</Member>
  <Member Name="appDescription">Starter template for Mamba Applications.</Member>
  <Member Name="appLastModificationDate">2019-10-22T15:28:57</Member>
  <Member Name="listInMainMenu">true</Member>
  <Member Name="appTechnology">1</Member>
  <Member Name="appType">0</Member>
  <Member Name="appPasswordProtectionLevel">0</Member>
  <Member Name="runOnUserSelection">index.html</Member>
  <Member Name="id">99</Member>
  <Member Name="iconPath">assets/logo.bmp</Member>
  <Member Name="appCreationDate">2017-07-17T13:32:00</Member>
  <Member Name="appKey">11-11-11-11</Member>
</MambaClass>
```


### Parâmetros

| Parâmetro                  | Descrição                                           | Tipo       | Exemplo           |
| -------------------------- | --------------------------------------------------- | ---------- | ----------------- |
| appName                    | Nome do app                                         | `string`   | `Mamba App`       |
| defaultName                | Nome único de identificação do app no TMS           | `string`   | `Mamba App`       |
| appVersion                 | Versão do app                                       | `number`   | `2.0.0`           |
| appDescription             | Descrição que será exibida na loja                  | `string`   | `Starter temp...` |
| id                         | Id único do app (4 dígitos)                         | `number`   | `1234`            |
| displayedName              | Nome do app, exibido na POS e loja                  | `string`   | `Mamba App`       |
| iconPath                   | URL do ícone (Mínimo de 50x50, proporção 1:1)       | `url`      | `assets/logo.bmp` |
| autoInitiable              | Define se poderá ser iniciado assim que a POS ligar | `boolean`  | `true`            |
| appPasswordProtectionLevel | Define se o app pedirá senha antes de abrir         | `number`   | `0` ou `1`        |
