import { MError } from "../Utils/Error";

const api = import.meta.env.VITE_API;

export default function useImageMedia() {
  const url = `${api}/file`;
  const upload = async (buffer: Uint8Array): Promise<string | MError>  => {
    const res = await fetch(`${url}/upload`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: buffer
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 399) {
      return resjson.url;
    }
    throw new MError(resjson);
  };

  const deleteImg = async (link: string) => {
    const res = await fetch(`${url}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "text/plain",
      },
      body: link
    });

    const resjson = await res.json();
    if (res.status >= 200 && res.status < 399) {
      return resjson;
    }
    throw new MError(resjson);
  }

  return {
    upload,
    deleteImg
  };
}