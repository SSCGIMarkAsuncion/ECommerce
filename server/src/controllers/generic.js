import { ObjectId } from 'mongodb';
import MError from '../error.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} _
 * @param {import('express').NextFunction} next
 */
export async function validateParamId(req,_,next) {
  if (!req.params.id) throw new MError(400, "Parameter ID is empty");
  try {
    const id = new ObjectId(req.params.id);
    req.mParamId = id;
  }
  catch (e) {
    throw new MError(400, "Id Format is invalid")
  }

  next();
}

/**
 * @param {import('mongoose').Model} Model
 */
export function GenericDelete(Model) {
  /** 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  return async (req, res) => {
    const id = req.mParamId;
    const deleted = await Model.findByIdAndDelete(id);

    console.log(`${Model.modelName}::Delete`, deleted);

    res.status(200).send(null);
  };
}

/**
 * @param {import('mongoose').Model} Model
 * @param {typeof import('../utils/ReqBody.js').ReqBody} CReqBody
 */
export function GenericUpdate(Model, CReqBody) {
  /** 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  return async (req, res) => {
    const id = req.mParamId;
    const body = new CReqBody(req.body);
    body.validate();

    const set = body.toObj();
    console.log(`${Model.modelName}::Update::Set`, set);
    const update = await Model.findByIdAndUpdate(id, set, {
      new: true,
      runValidators: true
    });

    console.log(`${Model.modelName}::Update`, update);

    res.status(200).json(update);
  };
}

/**
 * @param {import('mongoose').Model} Model
 * @param {typeof import('../utils/ReqBody.js').ReqBody} CReqBody
 */
export function GenericAdd(Model, CReqBody) {
  /** 
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  return async (req, res) => {
    const body = new CReqBody(req.body);
    body.validate();

    const set = body.toObj();
    console.log(`${Model.modelName}::Add::new`, set);
    const newDoc = await Model.insertOne(set);

    console.log(`${Model.modelName}::Add`, newDoc);
    res.status(200).json(newDoc);
  };
}