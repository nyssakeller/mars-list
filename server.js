const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/items_to_pack', (request, response) => {
  database('items_to_pack').select()
    .then(items => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`Mars Packing List is running on ${app.get('port')}.`);
});

module.exports = app;