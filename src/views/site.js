const html = require('./html');

module.exports = (content) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>DDB-Test</title>
      <style>
        .site-header {
          padding-bottom: 1em;
          margin-bottom: 1em;
          border-bottom: 2px solid grey;
        }
        .site-title {
          font-size: 2em;
        }
      </style>
    </head>
    <body>
      <header class="site-header">
        <span class="site-title"><a href="/">DDB Test</a></span>
      </header>
      ${content}
    </body>
  </html>
`;
