import type { IColumn } from "../Utils/DataBuilder";

export default class User {
  id: string;
  username: string;
  email: string;
  password: string | null; // only included for login and register
  role: "admin" | "superadmin" | "user";
  createdAt: Date | null;
  updatedAt: Date | null;

  constructor(obj: any) {
    this.id = obj._id;
    this.username = obj.username;
    this.email = obj.email;
    this.role = obj.role;
    this.password = obj.password? obj.password:null;
    this.createdAt = obj.createdAt? new Date(obj.createdAt):null;
    this.updatedAt = obj.updatedAt? new Date(obj.updatedAt):null;
  }

  isAdmin() {
    return this.role == "admin" || this.role == "superadmin";
  }

  toJson() {
    return JSON.stringify(this);
  }

  static empty() {
    return new User({
      _id: "",
      username: "",
      email: "",
      password: "",
      role: "",
      createdAt: null, updatedAt: null
    });
  }

  static from(form: FormData) {
    return new User({
      _id: form.get("id"),
      username: form.get("username"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role"),
      createdAt: null, updatedAt: null
    });
  }
};

export const USERS_COLUMNS: IColumn[] = [
  {
    id: "email",
    enableColumnFilter: true
  },
  // {
  //   id: "description",
  //   enableColumnFilter: true
  // },
  {
    id: "username",
    enableColumnFilter: true,
  },
  {
    id: "role",
    enableColumnFilter: true,
  },
  {
    name: "Created At",
    id: "createdAt",
    enableColumnFilter: true,
    isDate: true
  },
  {
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: true,
    isDate: true
  },
];