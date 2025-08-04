import { Theme } from "../Utils/Theme";
import SearchIcon from "../assets/Search.svg"
import Img from "../Components/Img";

export default function NoResults({ title = "", subtitle = ""}: { title?: string, subtitle?: string }) {
  return <div
   className={`w-full bg-primary-200 border-primary-300 text-primary-600 *:fill-primary-600 border-1 p-8 text-xl text-center animate-appear flex flex-col gap-4 items-center justify-center fraunces-regular font-medium ${Theme.rounded}`}>
    <Img src={SearchIcon} className="size-20"/>
    <div>
      <p className="mt-2">{title}</p>
      <p className="text-primary-500 text-sm">{subtitle}</p>
    </div>
  </div>
}