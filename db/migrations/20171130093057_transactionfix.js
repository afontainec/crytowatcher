exports.up = function (knex) {
  return knex.schema.table('transaction', (table) => {
    table.integer('account_id');
    table.foreign('account_id').references('account.id').onDelete('CASCADE');
    table.float('amount_to').notNullable();
    table.float('amount_left');
  });
};

exports.down = function (knex) {
  return knex.schema.table('transaction', (table) => {
    table.dropColumn('account_id');
    table.dropColumn('amount_to');
    table.dropColumn('amount_left');
  });
};
