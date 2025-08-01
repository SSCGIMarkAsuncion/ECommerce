export class MError extends Error {
  constructor(msg: any) {
    if (msg instanceof Error) {
      super(msg.message);
      return;
    }
    super(msg);
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