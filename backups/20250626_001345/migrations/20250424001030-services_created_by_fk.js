'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    // 1. drop the old UUID column if it still exists
    await queryInterface.removeColumn('services', 'created_by').catch(() => {});

    // 2. add new INTEGER column, allow NULL during transition
    await queryInterface.addColumn('services', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    // 3. set all existing rows to user id 1 (demo) – adjust if needed
    await queryInterface.sequelize.query(
      'UPDATE services SET created_by = 1 WHERE created_by IS NULL;'
    );

    // 4. make column NOT NULL
    await queryInterface.changeColumn('services', 'created_by', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // 5. add FK constraint to users(id)
    await queryInterface.addConstraint('services', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'services_created_by_fkey',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down (queryInterface/*, Sequelize*/) {
    await queryInterface.removeConstraint('services', 'services_created_by_fkey').catch(() => {});
    await queryInterface.removeColumn('services', 'created_by').catch(() => {});
  }
};
