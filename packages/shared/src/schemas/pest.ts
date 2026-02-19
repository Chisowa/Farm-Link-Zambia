import { z } from "zod";

export const PestSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  commonName: z.string().optional(),
  description: z.string().optional(),
  commonSymptoms: z.string().array(),
  affectedCrops: z.string().array(),
  managementStrategies: z.string().array(),
  biologicalControl: z.string().array().optional(),
  chemicalControl: z.string().array().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreatePestSchema = PestSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Pest = z.infer<typeof PestSchema>;
export type CreatePest = z.infer<typeof CreatePestSchema>;
