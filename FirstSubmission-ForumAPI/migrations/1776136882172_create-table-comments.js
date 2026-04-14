/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('comments', {
    id : {
      primaryKey : true,
      type : 'VARCHAR(50)'
    },
    thread_id : {
      references : 'threads',
      onDelete : 'CASCADE',
      notNull : true,
      type : 'VARCHAR(50)'
    },
    content : {
      type : 'TEXT',
      notNull : true
    },
    owner : {
      references : 'users',
      onDelete : 'CASCADE',
      notNull : true,
      type : 'VARCHAR(50)'
    },
    date : {
      type : 'TEXT',
      notNull : true,
      default  :pgm.func('current_timestamp')
    },
    is_delete : {
      type :'BOOLEAN',
      notNull : true,
      default : false
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('comments');
};
