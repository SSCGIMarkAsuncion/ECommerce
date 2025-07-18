export class MError {
  msg: any;
  constructor(msg: any) {
    this.msg = msg;
  }
  static toErrorList(err: MError) {
    if (typeof err.msg == "string") {
      return [err.msg];
    }

    const keys = Object.keys(err.msg)
    let merrs: string[] = [];
    keys.forEach((key) => {
      merrs.push(err.msg[key]);
    });
    return merrs;
  }
};

// export class PromisedError {
//   msg: Promise<any>;
//   constructor(msg: Promise<any>) {
//     this.msg = msg;
//   }
// }