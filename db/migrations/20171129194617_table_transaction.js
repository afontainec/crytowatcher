exports.up = function (knex) {
  return knex.schema.createTable('transaction', (table) => {
    // Incremental id
    table.increments();
    table.string('from_currency').notNullable();
    table.float('amount_from').notNullable();
    table.string('to_currency').notNullable();
    table.float('price').notNullable();
    // created_at and updated_at
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('transaction');
};
