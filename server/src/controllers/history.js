import { History } from "../schema/history.js";

export async function GetHistory(req, res) {
  const arrhistory = await History.find()
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json(arrhistory);
}