'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // make column NOT NULL first (all rows already have a value)
    await queryInterface.changeColumn('services', 'created_by', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // add FK constraint referencing users.id
    await queryInterface.addConstraint('services', {
      fields: ['created_by'],
      type: 'foreign key',
      name: 'services_created_by_fkey',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'restrict'
    });
  },

  async down (queryInterface/*, Sequelize*/) {
    await queryInterface.removeConstraint('services', 'services_created_by_fkey')
      .catch(() => {});
    await queryInterface.changeColumn('services', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true
    });
  }
};
