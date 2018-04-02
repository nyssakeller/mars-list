exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items_to_pack', (table) => {
      table.increments('id').primary();
      table.string('item_name');
      table.string('packed_status');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items_to_pack')
  ])
};

