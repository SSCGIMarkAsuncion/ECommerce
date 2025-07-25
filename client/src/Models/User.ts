export default class User {
  id: string;
  username: string;
  email: string;
  password: string | null; // only included for login and register
  role: "admin" | "superadmin" | "user";

  constructor(obj: any) {
    this.id = obj._id;
    this.username = obj.username;
    this.email = obj.email;
    this.role = obj.role;
    this.password = obj.password? obj.password:null;
  }

  isAdmin() {
    return this.role == "admin" || this.role == "superadmin";
  }

  toJson() {
    return JSON.stringify(this);
  }

  static from(form: FormData) {
    return new User({
      _id: form.get("id"),
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role")
    });
  }
};