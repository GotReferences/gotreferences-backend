"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE blog ALTER COLUMN tags TYPE JSONB USING to_jsonb(tags);'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE blog ALTER COLUMN tags TYPE TEXT[];'
    );
  }
};