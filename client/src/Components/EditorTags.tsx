import { useCallback, useEffect, useState, type HTMLProps } from "react";
import Input from "./Input";
import { Pill } from "./Pill";

export interface EditorTagsProps extends HTMLProps<HTMLInputElement> {
  tags: string[],
  onChangeTags: (tags: string[]) => void
};

export function EditorTags(props: EditorTagsProps) {
  const [ tags, setTags ] = useState(props.tags);

  useEffect(() => {
    props.onChangeTags(tags);
  }, [tags]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const inp = e.target as HTMLInputElement;

    // console.log(e.key);
    if (e.key == "Enter") {
      e.preventDefault();
      if (inp.value.length == 0 || !inp.value) {
        return;
      }
      // console.debug("add", inp.value);
      setTags(v => {
         const found = v.find((vname) => inp.value == vname);
         if (found) {
          return v;
         }
         return [ ...v, inp.value];
      });
      inp.value = "";
    }
  }, []);

  const onRemove = useCallback((name: string) => {
    setTags(v => {
      const ind = v.findIndex((vname) => name === vname);
      v.splice(ind, 1);
      return [...v];
    })
  }, []);

  return <div>
    <Input label="Tags" onKeyDown={onKeyDown} placeholder="Press Enter to add Tags" className="mb-1" />
    <div className="flex flex-wrap gap-1">
      {
        tags.map((tag) => {
          if (!tag) return null;
          return <Pill key={tag} editable onRemove={onRemove}>{tag}</Pill>
        })
      }
    </div>
  </div>
}