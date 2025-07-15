export default class MError {
  status = null;
  message = "";
  constructor(status = null, message = "") {
    this.status = status;
    this.message = message;
  }
}