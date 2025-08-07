import type { HTMLProps } from "react";
import type User from "../Models/User";
export interface AvatarProps extends HTMLProps<HTMLDivElement> {
  user: User,
  withName?: boolean,
  nameClass?: string
  avatarClass?: string
  subtitleClass?: string
  subtitle?: string
};

export default function Avatar({user, withName = false, subtitleClass = "", subtitle ="", nameClass = "", avatarClass = "", ...props }: AvatarProps) {
  const colors = ["bg-red-600", "bg-orange-600", "bg-amber-600", "bg-yellow-600", "bg-lime-600", "bg-green-600"];
  const colorIndex = user.username[0].charCodeAt(0) % colors.length;

  return <div className={`flex gap-1 items-center ${props.className}`}>
    <div className={`rounded-full ${colors[colorIndex]} ${avatarClass} text-white overflow-hidden flex items-center justify-center`}>
      <span className="size-[inherit] text-center">{user.username[0]}</span>
    </div>
    { withName && <div className="flex flex-col">
        <p className={nameClass}>{user.username}</p>
        { (subtitle.length>0) && <p className={subtitleClass}>{subtitle}</p>}
      </div>
    }
  </div>
}