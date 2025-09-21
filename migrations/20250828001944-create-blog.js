"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      title: Sequelize.STRING,
      slug: Sequelize.STRING,
      excerpt: Sequelize.TEXT,
      content: Sequelize.TEXT,
      seo_title: Sequelize.STRING,
      seo_description: Sequelize.TEXT,
      featured_image: Sequelize.STRING,
      category: Sequelize.STRING,
      tags: Sequelize.JSONB,
      author_id: Sequelize.UUID,
      user_id: Sequelize.UUID,
      published_at: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("blog");
  },
};