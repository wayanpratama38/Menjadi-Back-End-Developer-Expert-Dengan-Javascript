/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('replies', {
    id : {
      type : 'VARCHAR(50)',
      primaryKey : true,
      notNull : true,
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
    },
    comment_id : {
      type : 'TEXT',
      references : 'comments',
      onDelete : 'CASCADE',
      notNull : true
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('replies');
};
