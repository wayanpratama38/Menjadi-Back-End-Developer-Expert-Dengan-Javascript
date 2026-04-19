/* eslint-disable camelcase */
/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('comment_likes', {
    id : {
      type : 'VARCHAR(50)',
      notNull : true,
      primaryKey : true,
    },
    comment_id : {
      references : 'comments',
      notNull : true,
      onDelete : 'CASCADE',
      type : 'VARCHAR(50)',
    },
    user_id : {
      references: 'users',
      notNull : true,
      onDelete  : 'CASCADE',
      type : 'VARCHAR(50)'
    }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('comment_likes');
};
