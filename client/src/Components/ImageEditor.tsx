import { useCallback, useEffect, useRef, useState, type HTMLProps } from "react";
import Input from "./Input";
import Button from "./Button";
import { IconXMark } from "../Utils/SVGIcons";
import useImageMedia from "../Hooks/useImageMedia";
import type { MError } from "../Utils/Error";
import Img from "./Img";
import { useNotification } from "../Context/Notify";

export interface ImageEditorProps extends HTMLProps<HTMLDivElement> {
  imgs: string[],
  onChangeImgs: (imgs: string[]) => void,
  onProcessing?: () => void,
  onProcessingDone?: () => void,
  onErr?: (e: MError) => void
};

export function ImageEditor(props: ImageEditorProps) {
  const [ imgs, setImgs ] = useState([ ...props.imgs ]);
  const { upload, deleteImg } = useImageMedia();
  const ref = useRef<HTMLInputElement>(null);
  const notify = useNotification();

  useEffect(() => {
    props.onChangeImgs(imgs);
  }, [imgs]);

  const onRemove = useCallback((img: string) => {
    deleteImg(img)
      .then((v) => notify("info", `Image deletion status ${v.result || "ok"}`))
      .catch((e) => notify("error", e.message));

    setImgs((v) => {
      return [ ...v.filter((i) => i !== img) ];
    });
  }, []);

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files
    if (!files) return;
    const urls = Array.from(files);
    if (urls.length <= 0) return;

    const arrbuffer = await urls[0].arrayBuffer();
    const rawbuffer = new Uint8Array(arrbuffer);

    try {
      if (props.onProcessing)
        props.onProcessing();
      const imageurl = await upload(rawbuffer);
      setImgs((prev) => [...prev, imageurl as string]);
      if (props.onProcessingDone)
        props.onProcessingDone();
    }
    catch (e) {
      if (props.onProcessingDone)
        props.onProcessingDone();
      if (props.onErr)
        props.onErr(e as MError);
    }
  }, []);

  return <div className="m-2">
    <div className="w-full rounded-md min-h-[10vh] border-2 border-dashed bg-gray-200 text-gray-500 border-gray-400 p-4 flex items-center justify-center" onClick={(e) => {
      e.stopPropagation();
      if (ref.current)
        ref.current.click();
    }}>
      Press to upload Image
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 my-2">
      {
        imgs.map((img, i) => {
          return <Image key={i} src={img} alt={img} title={img} className="h-[30svh]" editable onRemove={onRemove} />
        })
      }
    </div>
    <Input
      ref={ref}
      hidden={true}
      onChange={onUpload}
      type="file" accept="image/png, image/jpeg" />
  </div>;
}

export interface ImageProps extends HTMLProps<HTMLImageElement> {
  editable: boolean
  onRemove?: (img: string) => void
};

export function Image({ editable = false, ...props }: ImageProps) {
  const forwardProps = {
    ...props,
  };
  delete forwardProps.onRemove;

  return <div className="bg-gray-200 relative flex items-center">
    <Img {...forwardProps} className={`m-auto object-cover ${props.className}`}/>
    { editable && <Button pType="icon" className="absolute top-1 right-1 ml-auto w-8 h-8" onClick={(e) => {
        e.stopPropagation();
        if (props.onRemove)
          props.onRemove(props.src as string);
      }} >
        <IconXMark className="fill-red-800" />
      </Button>
    }
  </div>
}