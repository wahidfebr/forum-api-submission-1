/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'cascade',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    parent_id: {
      type: 'VARCHAR(50)',
      references: 'comments',
      onDelete: 'cascade',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    deleted_at: {
      type: 'TIMESTAMPTZ',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
