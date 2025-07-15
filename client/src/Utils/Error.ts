export class MError {
  msg: any;
  constructor(msg: any) {
    this.msg = msg;
  }
};

// export class PromisedError {
//   msg: Promise<any>;
//   constructor(msg: Promise<any>) {
//     this.msg = msg;
//   }
// }