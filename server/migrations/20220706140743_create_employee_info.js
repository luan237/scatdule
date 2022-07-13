/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("employee_list", (table) => {
      table.increments("tableID").primary();
      table.integer("id").notNullable();
      table.unique("id");
      table.string("position").notNullable();
      table.string("name").notNullable();
      table.unique("name");
      table.integer("wage").notNullable();
      table.string("avatar").notNullable();
      table.string("phone").notNullable();
      table.string("address").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("login", (table) => {
      table.increments("tableID").primary();
      table
        .integer("id")
        .notNullable()
        .references("id")
        .inTable("employee_list")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("password").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("schedule", (table) => {
      table.increments("tableID").primary();
      table.string("id").notNullable();
      table.string("task");
      table.bigInteger("start").notNullable();
      table.bigInteger("end").notNullable();
      table.boolean("allDay").notNullable();
      table
        .string("employees")
        .references("name")
        .inTable("employee_list")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("employeesID")
        .references("id")
        .inTable("employee_list")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("employee_list")
    .dropTable("schedule")
    .dropTable("login");
};
