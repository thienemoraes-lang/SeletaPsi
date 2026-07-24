import { Router, type IRouter } from "express";
import { db, candidaturasTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/psicologos", async (req, res): Promise<void> => {
  try {
    const rows = await db
      .select()
      .from(candidaturasTable)
      .where(eq(candidaturasTable.status, "aprovado"))
      .orderBy(candidaturasTable.criado_em);

    const psicologos = rows.map((r) => ({
      id: r.id,
      nome: r.nome,
      crp: r.crp,
      estado_crp: r.estado_crp,
      cidade: r.cidade,
      estado: r.estado,
      modalidade: r.modalidade,
      valor_sessao: r.valor_sessao,
      abordagem: r.abordagem,
      especialidades: r.especialidades
        ? r.especialidades.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      whatsapp: r.whatsapp,
      instagram: r.instagram,
      site: r.site,
      foto_url: r.foto_url,
    }));

    res.json(psicologos);
  } catch (err) {
    req.log.error(err, "Erro ao buscar psicólogos");
    res.status(500).json({ error: "Erro ao buscar psicólogos" });
  }
});

export default router;
