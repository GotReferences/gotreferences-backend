const express = require("express");
const { Client } = require("pg");

const router = express.Router();

const DEFAULT_URL = "postgresql://gradmin:JaBah123JaBah123@gotreferences-aurora-instance.cn2s6a0e8tmp.us-east-1.rds.amazonaws.com:5432/gotreferences?sslmode=require";
const connStr = process.env.DATABASE_URL || DEFAULT_URL;

function redacted(url) {
  return (url || "").replace(/:[^:@/]+@/, ":******@");
}

async function runQuery(sql, params = []) {
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const res = await client.query(sql, params);
    return res.rows;
  } finally {
    await client.end();
  }
}

function parseRows(rows) {
  return rows.map(r => {
    if (typeof r.tags === "string") {
      try { r.tags = JSON.parse(r.tags); } catch { /* leave as-is */ }
    }
    return r;
  });
}

router.get("/_debug", async (_req, res) => {
  const out = { hasEnv: !!process.env.DATABASE_URL, databaseUrl: redacted(connStr), ping: null, error: null };
  try {
    const rows = await runQuery("SELECT 1 AS ok");
    out.ping = rows[0]?.ok === 1 ? "ok" : "unexpected";
    res.json(out);
  } catch (e) {
    out.error = String(e?.message || e);
    res.status(500).json(out);
  }
});

router.get("/", async (_req, res) => {
  try {
    const rows = await runQuery(`
      SELECT
        id, title, content, excerpt,
        featured_image, category, tags,
        seo_title, seo_description,
        user_id, created_at, updated_at, published_at
      FROM public.blogs
      ORDER BY created_at DESC
      LIMIT 50
    `);
    res.json(parseRows(rows));
  } catch (err) {
    console.error("GET /api/blog error:", err);
    res.status(500).json({ error: "Failed to load blog posts" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await runQuery(`
      SELECT
        id, title, content, excerpt,
        featured_image, category, tags,
        seo_title, seo_description,
        user_id, created_at, updated_at, published_at
      FROM public.blogs
      WHERE id = $1
      LIMIT 1
    `, [req.params.id]);

    if (!rows.length) return res.status(404).json({ error: "Post not found" });
    res.json(parseRows(rows)[0]);
  } catch (err) {
    console.error("GET /api/blog/:id error:", err);
    res.status(500).json({ error: "Failed to load blog post" });
  }
});

module.exports = router;
