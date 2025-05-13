/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    body: {
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
  pgm.dropTable('threads');
};
