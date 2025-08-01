export class MError {
  message: string;
  constructor(msg: any) {
    if (msg instanceof Error) {
      this.message = msg.message;
      return;
    }
    this.message = msg;
  }

  toErrorList() {
    if (typeof this.message == "string") {
      return [this.message];
    }

    const keys = Object.keys(this.message)
    let merrs: string[] = [];
    keys.forEach((key) => {
      merrs.push(this.message[key as any]);
    });
    return merrs;
  }
};