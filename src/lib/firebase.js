import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseEnabled = Object.values(firebaseConfig).every(Boolean);
const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export async function signInAdmin(loginId, password) {
  if (!firebaseEnabled || !auth) return false;
  const adminEmail = loginId.includes('@')
    ? loginId.trim()
    : import.meta.env.VITE_ADMIN_EMAIL || `${loginId}@verma-ji-ki-dukan.local`;
  await signInWithEmailAndPassword(auth, adminEmail, password);
  return true;
}

export async function signOutUser() {
  if (auth) await signOut(auth);
}

export async function resetAdminPassword(loginId) {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  const adminEmail = loginId.includes('@')
    ? loginId.trim()
    : import.meta.env.VITE_ADMIN_EMAIL || `${loginId}@verma-ji-ki-dukan.local`;
  await sendPasswordResetEmail(auth, adminEmail);
}

export async function signInCustomer(email, password) {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerCustomer(name, email, password) {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  return credential;
}

export async function uploadProductImage(file) {
  if (!firebaseEnabled || !storage || !file) return null;
  const imageRef = ref(storage, `products/${crypto.randomUUID()}-${file.name}`);
  const snapshot = await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}
