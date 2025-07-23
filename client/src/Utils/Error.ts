export class MError {
  msg: any;
  constructor(msg: any) {
    this.msg = msg;
  }

  toErrorList() {
    if (typeof this.msg == "string") {
      return [this.msg];
    }

    const keys = Object.keys(this.msg)
    let merrs: string[] = [];
    keys.forEach((key) => {
      merrs.push(this.msg[key]);
    });
    return merrs;
  }
};