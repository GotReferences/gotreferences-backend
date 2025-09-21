'use strict';

module.exports = {
  async up (queryInterface/*, Sequelize*/) {
    await queryInterface.dropTable('"Services"').catch(() => {});
  },
  async down () { /* no-op */ }
};
