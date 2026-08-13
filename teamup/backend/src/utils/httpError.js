export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(message = 'Ressource introuvable') {
  return new HttpError(404, message);
}

