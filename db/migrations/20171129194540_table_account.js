exports.up = function (knex) {
  return knex.schema.createTable('account', (table) => {
    // Incremental id
    table.increments();
    table.string('name');
    table.float('clp').defaultTo(0);
    table.float('ether').defaultTo(0);
    table.float('btc').defaultTo(0);
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('account');
};
