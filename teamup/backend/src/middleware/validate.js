import { HttpError } from '../utils/httpError.js';

function formatValidationIssue(issue) {
  const path = issue.path?.join('.') || '';

  if (issue.message && !/^String must|^Number must|^Invalid|^Required/i.test(issue.message)) {
    return issue.message;
  }

  if (path.includes('email')) return 'Adresse e-mail invalide';
  if (path.includes('password')) return 'Mot de passe invalide';
  if (path.includes('confirmPassword')) return 'La confirmation du mot de passe est invalide';
  if (path.includes('firstName')) return 'Le prénom doit contenir au moins 2 caractères';
  if (path.includes('lastName')) return 'Le nom doit contenir au moins 2 caractères';
  if (path.includes('sportId')) return 'Sport invalide';
  if (path.includes('title')) return 'Le titre du match doit contenir au moins 3 caractères';
  if (path.includes('city')) return 'La ville doit contenir au moins 2 caractères';
  if (path.includes('location')) return 'Le lieu doit contenir au moins 2 caractères';
  if (path.includes('matchDate')) return 'La date du match est invalide';
  if (path.includes('matchTime')) return 'L’heure du match est invalide';
  if (path.includes('maxPlayers')) return 'Le nombre de joueurs doit être compris entre 2 et 30';

  return 'Données invalides';
}

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(new HttpError(400, formatValidationIssue(result.error.issues[0])));
    }

    req.validated = result.data;
    next();
  };
}
