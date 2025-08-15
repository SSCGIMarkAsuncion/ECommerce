import { History } from "../Models/History";
import { MError } from "../Utils/Error";
const api = `${import.meta.env.VITE_API}/history`;
export default function useHistory() {
  const getHistory = async () => {
    const res = await fetch(api, {
      credentials: "include"
    });

    const resjson = await res.json() as any[];
    if (res.status >= 200 && res.status <= 399) {
      const arrhisotry = resjson.map((item) => new History(item));
      return arrhisotry;
    }
    throw new MError(resjson);
  };

  return {
    getHistory
  };
}