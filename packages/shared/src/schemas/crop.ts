import { z } from 'zod'

export const CropSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  optimalConditions: z
    .object({
      temperature: z.object({
        min: z.number(),
        max: z.number(),
      }),
      rainfall: z.object({
        min: z.number(),
        max: z.number(),
      }),
      soilType: z.string().array(),
    })
    .optional(),
  plantingSeasons: z.string().array(),
  harvestingPeriod: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateCropSchema = CropSchema.omit({ id: true, createdAt: true, updatedAt: true })

export type Crop = z.infer<typeof CropSchema>
export type CreateCrop = z.infer<typeof CreateCropSchema>
