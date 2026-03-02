import { z } from "zod";

const telefoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10,11}$/, "Telefone inválido.");

const cadastroLeadSchema = z
  .object({
    nome: z.string().trim().min(2, "Nome obrigatório."),
    email: z.string().trim().email("E-mail inválido."),
    telefone: telefoneSchema,
    cidade: z.string().trim().min(2, "Cidade obrigatória."),
    tipo_pessoa: z.enum(["PF", "PJ"]),
    uc: z
      .string()
      .trim()
      .regex(/^\d*$/, "UC deve conter apenas números.")
      .max(20, "UC muito longa.")
      .optional(),
    status: z.literal("novo"),
    origem: z.literal("LP"),
  })
  .strict();

const simulacaoLeadSchema = z
  .object({
    nome: z.string().trim().min(2, "Nome obrigatório."),
    cidade: z.string().trim().min(2, "Cidade obrigatória."),
    telefone: telefoneSchema,
    valor_fatura: z.number().finite().nonnegative(),
    status: z.literal("novo"),
    origem: z.literal("LP-Simulação"),
  })
  .strict();

export const leadPayloadSchema = z.union([
  cadastroLeadSchema,
  simulacaoLeadSchema,
]);

export type LeadPayload = z.infer<typeof leadPayloadSchema>;
