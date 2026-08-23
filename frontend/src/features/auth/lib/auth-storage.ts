export const authStorage = {
  setAccessToken(token: string) {
    localStorage.setItem("access_token", token);
  },

  getAccessToken() {
    return localStorage.getItem("access_token");
  },

  setRefreshToken(token: string) {
    localStorage.setItem("refresh_token", token);
  },

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  setUser(user: unknown) {
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser<T>() {
    const user = localStorage.getItem("user");

    return user ? (JSON.parse(user) as T) : null;
  },

  clear() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};
