// src/utils/authUtils.ts
export interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // token过期时间的时间戳
}

export const getAuthData = (): AuthData | null => {
  const authData = localStorage.getItem('authData');
  if (authData) {
    const parsedData: AuthData = JSON.parse(authData);
    if (parsedData.expiresAt > Date.now()) {
      return parsedData;
    } else {
      removeAuthData();
      return null;
    }
  }
  return null;
};

export const setAuthData = (data: AuthData) => {
  localStorage.setItem('authData', JSON.stringify(data));
};

export const removeAuthData = () => {
  localStorage.removeItem('authData');
};