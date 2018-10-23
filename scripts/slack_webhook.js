let Slack = require('slack-node');

if(process.env.NOW) {

  webhookUri = "https://hooks.slack.com/services/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";

  slack = new Slack();
  slack.setWebhook(webhookUri);

  slack.webhook({
    channel: "#pos_mambaweb_squad",
    username: "MAMBA SDK DOCS",
    text: `Documentação deployada em staging: https://mambadocs.now.sh/ \n Deploy hash: ${process.env.NOW_URL}`,
  }, function(err, response) {
    console.log(response);
  });

}
