export interface User {
  id: string,
  username: string,
  email: string,
  role: "admin" | "superadmin" | "user"
};