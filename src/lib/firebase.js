import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

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

export async function ensureUserProfile(user) {
  if (!db || !user) return null;
  const profileRef = doc(db, 'users', user.uid);
  const existing = await getDoc(profileRef);
  await setDoc(profileRef, {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    updatedAt: serverTimestamp(),
    ...(existing.exists() ? {} : { role: 'customer', createdAt: serverTimestamp() })
  }, { merge: true });
  return { ...existing.data(), uid: user.uid, email: user.email || '', displayName: user.displayName || '' };
}

export async function getUserProfile(user) {
  if (!db || !user) return null;
  const snapshot = await getDoc(doc(db, 'users', user.uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export async function updateUserProfile(user, changes) {
  if (!db || !user) return null;
  const profileRef = doc(db, 'users', user.uid);
  await setDoc(profileRef, {
    uid: user.uid,
    email: user.email || '',
    ...changes,
    updatedAt: serverTimestamp()
  }, { merge: true });
  if (changes.displayName && changes.displayName !== user.displayName) {
    await updateProfile(user, { displayName: changes.displayName });
  }
  return getUserProfile(user);
}

export async function isAdminUser(user) {
  const profile = await getUserProfile(user);
  return profile?.role === 'admin';
}

export async function signInAdmin(loginId, password) {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  const adminEmail = loginId.includes('@')
    ? loginId.trim()
    : import.meta.env.VITE_ADMIN_EMAIL || `${loginId}@verma-ji-ki-dukan.local`;
  const credential = await signInWithEmailAndPassword(auth, adminEmail, password);
  if (!(await isAdminUser(credential.user))) {
    await signOut(auth);
    const error = new Error('This account is not authorized as an admin.');
    error.code = 'auth/admin-not-authorized';
    throw error;
  }
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
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credential.user);
  return credential;
}

export async function signInCustomerWithGoogle() {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  try {
    const credential = await signInWithPopup(auth, new GoogleAuthProvider());
    await ensureUserProfile(credential.user);
    return credential;
  } catch (error) {
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      await signInWithRedirect(auth, new GoogleAuthProvider());
      return null;
    }
    throw error;
  }
}

export async function registerCustomer(name, email, password) {
  if (!firebaseEnabled || !auth) throw new Error('Firebase is not configured.');
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
  await ensureUserProfile(credential.user);
  return credential;
}

export async function uploadProductImage(file) {
  if (!firebaseEnabled || !storage || !file) return null;
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5 MB.');
  const imageRef = ref(storage, `products/${crypto.randomUUID()}-${file.name}`);
  const snapshot = await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(snapshot.ref);
}
