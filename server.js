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

app.post('/api/v1/items_to_pack', (request, response) => {
  const itemsInfo = request.body;

  for (let requiredParameter of ['item_name']) {
    if (!itemsInfo[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { item_name: <String> }. 
          You're missing a "${requiredParameter}" property.` });
    }
  }

  database('items_to_pack').insert(itemsInfo, 'id')
    .then(items => {
      const { item_name, packed_status } = itemsInfo;
      response.status(201).json({ id: items[0], item_name, packed_status: 'false' });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/items_to_pack/:id/', (request, response) => {
  const { id } = request.params;
  const items = database('items_to_pack');

  items.where('id', id).delete()
    .then( data => {
      return response.status(204).json({ data });
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});


app.listen(app.get('port'), () => {
  console.log(`Mars Packing List is running on ${app.get('port')}.`);
});

module.exports = app;