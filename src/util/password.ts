import bcrypt from 'bcrypt';
import { scrypt, randomBytes } from 'crypto';

export class Password {
  static async toHash(password: string) {
    return await bcrypt.hash(password, 10);
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    return await bcrypt.compare(storedPassword, suppliedPassword);
  }
}
