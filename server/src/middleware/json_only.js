import MError from "../error.js";

export function jsonOnly(req, res, next) {
  const contentType = req.headers["content-type"];
  if (contentType !== "application/json") {
    throw new MError(406, "Not Acceptable");
  }

  next();
};