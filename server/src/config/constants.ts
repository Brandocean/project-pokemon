export const SALT_ROUNDS = 10;

export const JWT_EXPIRES_IN = '7d';

export const MIN_PASSWORD_LENGTH = 8;

export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'La solicitud contiene datos inválidos',
  REQUIRED_SIGNUP_FIELDS: 'Los campos email, password y name son obligatorios',
  AUTHENTICATION_REQUIRED: 'Se requiere autenticación',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  FORBIDDEN: 'No tienes permiso para realizar esta acción',
  NOT_FOUND: 'No se encontró el recurso solicitado',
  EMAIL_ALREADY_EXISTS: 'Ya existe una cuenta con ese correo electrónico',
  DUPLICATE_RESOURCE: 'El recurso ya existe',
  TOO_MANY_SIGNIN_ATTEMPTS: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.',
  TOO_MANY_SIGNUP_ATTEMPTS: 'Demasiados intentos de registro. Inténtalo de nuevo más tarde.',
  INTERNAL_SERVER_ERROR: 'Ha ocurrido un error en el servidor',
} as const;
