/**
 * 20250828-init-blog.js
 * Purpose: Align Sequelize with the existing Aurora "blog" table and add safeguards (unique slug, helpful indexes).
 * This migration is safe to run even if the table already exists.
 */
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // 1) Detect if "blog" table exists
      let exists = true;
      try {
        await queryInterface.describeTable("blog");
      } catch (e) {
        exists = false;
      }

      // 2) Create table if it does not exist (matches current Aurora schema you shared)
      if (!exists) {
        await queryInterface.createTable("blog", {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.literal("gen_random_uuid()")
          },
          author_id: {
            type: Sequelize.UUID,
            allowNull: false
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false
          },
          slug: {
            type: Sequelize.STRING,
            allowNull: true, // Aurora already has slug; we won’t force NOT NULL if existing rows could be null
            unique: true
          },
          excerpt: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          content: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          category: {
            type: Sequelize.STRING,
            allowNull: true
          },
          tags: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true
          },
          seo_title: {
            type: Sequelize.STRING,
            allowNull: true
          },
          seo_description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          featured_image: {
            type: Sequelize.STRING,
            allowNull: true
          },
          published_at: {
            type: Sequelize.DATE,
            allowNull: true
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
          }
        }, { transaction: t });

        // unique on slug (if present)
        await queryInterface.addIndex("blog", ["slug"], {
          name: "blog_slug_unique",
          unique: true,
          where: { slug: { [Sequelize.Op.ne]: null } },
          transaction: t
        });

        // helpful secondary indexes
        await queryInterface.addIndex("blog", ["published_at"], {
          name: "blog_published_at_idx",
          transaction: t
        });
        await queryInterface.addIndex("blog", ["category"], {
          name: "blog_category_idx",
          transaction: t
        });
      } else {
        // 3) If table exists, ensure constraints/indexes are present (idempotent guards)
        // unique on slug (nullable unique)
        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_slug_unique'
            ) THEN
              CREATE UNIQUE INDEX blog_slug_unique ON blog (slug) WHERE slug IS NOT NULL;
            END IF;
          END$$;
        `, { transaction: t });

        // published_at index
        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_published_at_idx'
            ) THEN
              CREATE INDEX blog_published_at_idx ON blog (published_at);
            END IF;
          END$$;
        `, { transaction: t });

        // category index
        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_category_idx'
            ) THEN
              CREATE INDEX blog_category_idx ON blog (category);
            END IF;
          END$$;
        `, { transaction: t });
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface /*, Sequelize */) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Only drop indexes we created if table exists; do NOT drop the table by default
      let exists = true;
      try {
        await queryInterface.describeTable("blog");
      } catch (e) {
        exists = false;
      }

      if (exists) {
        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_slug_unique') THEN
              DROP INDEX blog_slug_unique;
            END IF;
          END$$;
        `, { transaction: t });

        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_published_at_idx') THEN
              DROP INDEX blog_published_at_idx;
            END IF;
          END$$;
        `, { transaction: t });

        await queryInterface.sequelize.query(`
          DO $$
          BEGIN
            IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'blog_category_idx') THEN
              DROP INDEX blog_category_idx;
            END IF;
          END$$;
        `, { transaction: t });
      }

      // We intentionally do not drop the table to avoid data loss.
      // If you want to allow table drop, uncomment:
      // await queryInterface.dropTable("blog", { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
