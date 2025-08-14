export class ReqBody {
  constructor(body) {}

  validate() { }

  toObj() {
    return Object.fromEntries(
      Object.entries(this)
        .filter(([_, v]) => v !== undefined)
    );
  }
}