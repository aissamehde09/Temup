import { z } from 'zod';

const level = z.enum(['Débutant', 'Intermédiaire', 'Confirmé']);
const positiveId = z.coerce.number().int().positive();

export const idParamSchema = z.object({
  params: z.object({ id: positiveId }),
});

export const mongoIdParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Identifiant MongoDB invalide') }),
});

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(190).toLowerCase(),
    password: z.string().min(8).max(120),
    confirmPassword: z.string().min(8).max(120),
    city: z.string().trim().min(2).max(120),
    level,
    sports: z.array(positiveId).min(1),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2).max(80),
    lastName: z.string().trim().min(2).max(80),
    city: z.string().trim().min(2).max(120),
    level,
    bio: z.string().trim().max(1000).optional().or(z.literal('')),
  }),
});

export const updateAvatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().max(7_000_000).nullable(),
  }),
});

export const matchQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    sport: z.string().trim().optional(),
    city: z.string().trim().optional(),
    date: z.string().trim().optional(),
    level: level.optional(),
    organizerId: z.coerce.number().int().positive().optional(),
  }),
});

export const matchBodySchema = z.object({
  body: z.object({
    sportId: positiveId,
    title: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(120),
    location: z.string().trim().min(2).max(180),
    address: z.string().trim().max(255).optional().or(z.literal('')),
    matchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    matchTime: z.string().regex(/^\d{2}:\d{2}$/),
    level,
    maxPlayers: z.coerce.number().int().min(2).max(30),
    description: z.string().trim().max(1500).optional().or(z.literal('')),
    imageUrl: z.string().max(7_000_000).refine((value) => value === '' || value.startsWith('data:image/') || /^https?:\/\//.test(value), 'Image invalide').optional().or(z.literal('')),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
  }),
});
