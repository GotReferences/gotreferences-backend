'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. ensure columns exist
    const table = 'services';
    await queryInterface.addColumn(table, 'created_by', { type: Sequelize.UUID, allowNull: true })
      .catch(() => {});
    await queryInterface.addColumn(table, 'createdAt', { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') })
      .catch(() => {});
    await queryInterface.addColumn(table, 'updatedAt', { type: Sequelize.DATE, defaultValue: Sequelize.fn('NOW') })
      .catch(() => {});

    // 2. copy data from quoted table if it exists
    await queryInterface.sequelize.query('INSERT INTO services SELECT * FROM "Services" ON CONFLICT DO NOTHING;')
      .catch(() => {});

    // 3. drop duplicate snake-case timestamps
    await queryInterface.removeColumn(table, 'created_at').catch(() => {});
    await queryInterface.removeColumn(table, 'updated_at').catch(() => {});

    // 4. drop old quoted table
    await queryInterface.dropTable('"Services"').catch(() => {});
  },

  async down (queryInterface/*, Sequelize*/) {
    // reverse not required for prod
  }
};
