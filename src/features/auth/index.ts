/* ─── Auth Feature Barrel Export ─── */

export {
  signInWithEmail,
  signUpWithEmail,
  signInWithOAuth,
  signOut,
  getCurrentUser,
  type AuthResult,
} from "./actions";

export {
  OAuthButtons,
  AuthError,
  SubmitButton,
} from "./components";

export { AuthHydrator } from "./auth-hydrator";
