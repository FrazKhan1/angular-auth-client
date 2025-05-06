import * as CryptoJS from 'crypto-js';

export const environment = {
  production: false,
  encryptionKey: 'your-encryption-key', // Store securely in env variables in real projects
};

export function saveUser(user: any) {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(user),
      environment.encryptionKey
    ).toString();
    document.cookie = `user=${encrypted}; path=/; max-age=86400; secure; samesite=strict`;
  } catch (error) {
    console.error('Error saving user to cookie', error);
  }
}

export function getUser(): any | null {
  try {
    const name = 'user=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) {
        const encrypted = c.substring(name.length);
        const decrypted = CryptoJS.AES.decrypt(encrypted, environment.encryptionKey).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function clearUser() {
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}
