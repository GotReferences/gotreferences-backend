"use strict";
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Blog = sequelize.define("Blog", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    author_id: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    },
    excerpt: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.STRING,
    },
    tags: {
      type: DataTypes.JSONB,
    },
    featured_image: {
      type: DataTypes.STRING,
    },
    seo_title: {
      type: DataTypes.STRING,
    },
    seo_description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    published_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: "blog",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  return Blog;
};
