export function isAdmin(role) {
  return role == "superadmin" || role == "admin";
}

export default {
  USER: "user",
  SUPERADMIN: "superadmin",
  ADMIN: "admin"
};