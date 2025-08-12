import type { InputDefs } from "../Context/EditableData";
import { toDateTimeLocalString, type IColumn } from "../Utils/DataBuilder";
import { checkPassword } from "../Utils/FormValidators";

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
    id: "id",
    enableColumnFilter: true
  },
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
    name: "Updated At",
    id: "updatedAt",
    enableColumnFilter: true,
    isDate: true
  },
];

export const USERS_EDIT_INPUTS: InputDefs<User> = [
  [
    {
      inputType: "text",
      id: "id",
      label: "Id",
      readOnly: true,
    },
    {
      inputType: "datetime-local",
      id: "createdAt",
      label: "CreatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.createdAt)
      }
    },
    {
      inputType: "datetime-local",
      id: "updatedAt",
      label: "UpdatedAt",
      readOnly: true,
      defaultValue: (data) => {
        return toDateTimeLocalString(data.current.updatedAt)
      }
    }
  ],
  [
    {
      inputType: "text",
      id: "username",
      label: "Username",
      placeholder: "John",
      required: true,
    },
    {
      inputType: "email",
      id: "email",
      label: "Email",
      placeholder: "John@email.com",
      required: true,
    },
  ],
  [
    {
      inputType: "password",
      id: "password",
      label: "Password",
      validators: [checkPassword],
      defaultValue: (data) => {
        data.current.password = ""; // force remove the field to not include in update
        return "";
      }
    },
    {
      inputType: "select",
      id: "role",
      label: "Role",
      required: true,
      defaultValue: (data) => data.current.role,
      options: ["user", "admin", "superadmin"]
    }
  ]
];