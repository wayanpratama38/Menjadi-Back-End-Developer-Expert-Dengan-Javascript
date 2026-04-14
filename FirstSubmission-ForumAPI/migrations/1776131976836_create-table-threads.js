/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('threads', {
    id : {
      primaryKey : true,
      notNull : true,
      type : 'VARCHAR'
    },
    title : {
      notNull : true,
      type : 'TEXT'
    },
    body : {
      notNull : true,
      type : 'TEXT'
    },
    owner : {
      type : 'VARCHAR(50)',
      notNull :true,
      references : 'users',
      onDelete : 'CASCADE'
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('threads');
};
