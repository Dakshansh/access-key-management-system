import { v4 as uuidv4 } from 'uuid';

export function generateUniqueKey(): string {
  return uuidv4().replace(/-/g, '');
}