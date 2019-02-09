const arc = require('@architect/functions');
const layout = require('../layouts/blog');
const html = require('../html');

module.exports = (title = 'Nichts gefunden') =>
  layout(
    title,
    html`
      <h1>Nichts gefunden.</h1>
      <p>Sorry, aber die Seite, die du suchst, existiert nicht.</p>
      <p><a href="${arc.http.helpers.url('/')}">Zurück zur Startseite</a></p>
    `
  );
