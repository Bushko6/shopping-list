export function nowIso() {
  return new Date().toISOString();
}

export function normalizeName(value, fieldName) {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  if (normalized.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }

  if (normalized.length > 120) {
    throw new Error(`${fieldName} cannot be longer than 120 characters`);
  }

  return normalized;
}

export function normalizePositiveNumber(value, fieldName) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${fieldName} must be a positive number`);
  }

  return number;
}
