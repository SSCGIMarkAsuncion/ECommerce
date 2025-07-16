export interface User {
  id: string,
  username: string,
  email: string,
  role: "admin" | "superadmin" | "user"
};

export function isAdmin(user: User) {
  return user.role == "admin" || user.role == "superadmin";
}