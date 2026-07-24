import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, candidaturasTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

/* ── Auth middleware ───────────────────────────────────────── */
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const password = req.headers["x-admin-password"] as string | undefined;
  const expected = process.env.ADMIN_PASSWORD ?? "seletapsi@admin";
  if (!password || password !== expected) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }
  next();
}

/* ── List all candidaturas ─────────────────────────────────── */
router.get("/admin/candidaturas", requireAdmin, async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(candidaturasTable)
      .orderBy(candidaturasTable.criado_em);
    res.json(rows);
  } catch (err) {
    req.log.error(err, "Erro ao listar candidaturas");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Get single candidatura ────────────────────────────────── */
router.get("/admin/candidaturas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    const [row] = await db
      .select()
      .from(candidaturasTable)
      .where(eq(candidaturasTable.id, id));
    if (!row) { res.status(404).json({ error: "Não encontrado" }); return; }
    res.json(row);
  } catch (err) {
    req.log.error(err, "Erro ao buscar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Approve ───────────────────────────────────────────────── */
router.put("/admin/candidaturas/:id/aprovar", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    await db
      .update(candidaturasTable)
      .set({ status: "aprovado", atualizado_em: new Date() })
      .where(eq(candidaturasTable.id, id));
    res.json({ ok: true, status: "aprovado" });
  } catch (err) {
    req.log.error(err, "Erro ao aprovar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Reject ────────────────────────────────────────────────── */
router.put("/admin/candidaturas/:id/rejeitar", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    await db
      .update(candidaturasTable)
      .set({ status: "rejeitado", atualizado_em: new Date() })
      .where(eq(candidaturasTable.id, id));
    res.json({ ok: true, status: "rejeitado" });
  } catch (err) {
    req.log.error(err, "Erro ao rejeitar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

/* ── Delete ────────────────────────────────────────────────── */
router.delete("/admin/candidaturas/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  try {
    await db
      .delete(candidaturasTable)
      .where(eq(candidaturasTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err, "Erro ao deletar candidatura");
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
