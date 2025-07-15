export class User {
  _id = null;
  username = "";
  email = "";
  password = "";
  role = "";

  static project() {
    return {
      _id: 1,
      username: 1,
      email: 1,
      password: 1,
      role: 1
    };
  }
}