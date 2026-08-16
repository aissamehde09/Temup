import { z } from 'zod';

const level = z.enum(['Débutant', 'Intermédiaire', 'Confirmé']);
const positiveId = z.coerce.number().int().positive();
const sportNameToId = {
  basketball: 1,
  basket: 1,
  football: 2,
  foot: 2,
};

function normalizeMatchBody(body) {
  const source = body && typeof body === 'object' ? body : {};
  const sportName = String(source.sportName || source.sport_name || source.sport || '').trim().toLowerCase();
  const sportIdFromName = sportNameToId[sportName];

  return {
    ...source,
    sportId: source.sportId ?? source.sport_id ?? sportIdFromName,
    matchDate: source.matchDate ?? source.match_date,
    matchTime: String(source.matchTime ?? source.match_time ?? '').slice(0, 5),
    maxPlayers: source.maxPlayers ?? source.max_players,
    imageUrl: source.imageUrl ?? source.image_url ?? '',
  };
}

export const idParamSchema = z.object({
  params: z.object({ id: positiveId }),
});

export const mongoIdParamSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, 'Identifiant MongoDB invalide') }),
});

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
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
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
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
  body: z.preprocess(normalizeMatchBody, z.object({
    sportId: positiveId,
    title: z.string().trim().min(3, 'Le titre du match doit contenir au moins 3 caractères').max(160, 'Le titre du match est trop long'),
    city: z.string().trim().min(2, 'La ville doit contenir au moins 2 caractères').max(120, 'La ville est trop longue'),
    location: z.string().trim().min(2, 'Le lieu doit contenir au moins 2 caractères').max(180, 'Le lieu est trop long'),
    address: z.string().trim().max(255, 'L’adresse est trop longue').optional().or(z.literal('')),
    matchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La date du match est invalide'),
    matchTime: z.string().regex(/^\d{2}:\d{2}$/, 'L’heure du match est invalide'),
    level,
    maxPlayers: z.coerce.number().int().min(2, 'Le match doit accepter au moins 2 joueurs').max(30, 'Le nombre maximum de joueurs ne peut pas dépasser 30'),
    description: z.string().trim().max(1500, 'La description est trop longue').optional().or(z.literal('')),
    imageUrl: z.string().max(7_000_000).refine((value) => value === '' || value.startsWith('data:image/') || /^https?:\/\//.test(value), 'Image invalide').optional().or(z.literal('')),
    latitude: z.coerce.number().min(-90, 'Latitude invalide').max(90, 'Latitude invalide').optional(),
    longitude: z.coerce.number().min(-180, 'Longitude invalide').max(180, 'Longitude invalide').optional(),
  })),
});
