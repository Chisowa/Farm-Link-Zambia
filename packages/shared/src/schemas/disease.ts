import { z } from "zod";

export const DiseaseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  commonName: z.string().optional(),
  description: z.string().optional(),
  causative: z.string().optional(),
  commonSymptoms: z.string().array(),
  affectedCrops: z.string().array(),
  managementStrategies: z.string().array(),
  preventiveMeasures: z.string().array().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateDiseaseSchema = DiseaseSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type Disease = z.infer<typeof DiseaseSchema>;
export type CreateDisease = z.infer<typeof CreateDiseaseSchema>;
