exports.up = function (knex) {
  return knex.schema.createTable('prices', (table) => {
    // Incremental id
    table.increments();
    table.string('platform');
    table.float('ether_buy').defaultTo(0);
    table.float('ether_sell').defaultTo(0);
    table.float('btc_buy').defaultTo(0);
    table.float('btc_sell').defaultTo(0);

    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('prices');
};
