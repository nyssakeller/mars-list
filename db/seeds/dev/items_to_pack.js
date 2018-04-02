exports.seed = function(knex, Promise) {
  return knex('items_to_pack').del()
    .then(() => {
      return Promise.all([
        knex('items_to_pack').insert({
          item_name: 'Oxygen Tank', 
          packed_status: false
        }, 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};