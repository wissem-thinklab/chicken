import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import { STORAGE_KEY } from './constant';

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { access_token } = res.data;

    if (!access_token) {
      throw new Error('Access token not found in response');
    }

    setSession(access_token);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};


/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Forgot password
 *************************************** */
export const forgotPassword = async ({ email }) => {
  try {
    const res = await axios.post(endpoints.auth.forgotPassword, { email });
    return res.data;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
  }
};

/** **************************************
 * Verify reset token
 *************************************** */
export const verifyResetToken = async ({ token, email }) => {
  try {
    const res = await axios.post(endpoints.auth.verifyToken, { token, email });
    
    return {
      ...(res.data ?? {}),
      scope: 'superadmin',
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error || new Error('Lien de réinitialisation invalide ou expiré.');
  }
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({
  token,
  email,
  password,
  passwordConfirmation,
}) => {
  try {
    const payload = {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    };

    const res = await axios.post(endpoints.auth.resetPassword, payload);
    const responseData = res.data;

    // Extraction flexible du token si l'API connecte l'utilisateur automatiquement
    const accessToken = 
      responseData?.access_token || 
      responseData?.accessToken || 
      responseData?.data?.access_token;

    if (accessToken) {
      setSession(accessToken);
    }

    return responseData;
  } catch (error) {
console.error('Détails de l\'erreur Laravel :', error.response?.data || error);    throw error;
  }
};