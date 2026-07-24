import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const candidaturasTable = pgTable("candidaturas", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf: varchar("cpf", { length: 20 }),
  crp: varchar("crp", { length: 50 }).notNull(),
  estado_crp: varchar("estado_crp", { length: 10 }),
  telefone: varchar("telefone", { length: 30 }),
  whatsapp: varchar("whatsapp", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 50 }),
  instagram: varchar("instagram", { length: 255 }),
  site: varchar("site", { length: 255 }),
  modalidade: varchar("modalidade", { length: 50 }),
  valor_sessao: varchar("valor_sessao", { length: 50 }),
  abordagem: varchar("abordagem", { length: 255 }),
  especialidades: text("especialidades"),
  tempo_experiencia: varchar("tempo_experiencia", { length: 100 }),
  formacao: text("formacao"),
  especializacoes_detalhe: text("especializacoes_detalhe"),
  curriculo: text("curriculo"),
  documentos: text("documentos"),
  foto_url: text("foto_url"),
  status: varchar("status", { length: 20 }).notNull().default("pendente"),
  criado_em: timestamp("criado_em").defaultNow(),
  atualizado_em: timestamp("atualizado_em").defaultNow(),
});

export const insertCandidaturaSchema = createInsertSchema(candidaturasTable).omit({
  id: true,
  criado_em: true,
  atualizado_em: true,
  status: true,
});

export type InsertCandidatura = z.infer<typeof insertCandidaturaSchema>;
export type Candidatura = typeof candidaturasTable.$inferSelect;
