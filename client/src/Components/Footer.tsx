import { IconEnvelope, IconLocationPin, IconPhone } from "../Utils/SVGIcons";
import Img from "./Img";
import A from "./A";
const Link = A;

export default function Footer() {
  return <div className="bg-primary-900 p-1 text-white mt-2">
    <div className="px-2 py-2 tracking-wide fraunces-regular text-md flex flex-col items-center gap-12 sm:flex-row mb-4">
      <div className="w-max m-auto md:m-[initial] md:w-[initial]">
        <div className="flex gap-2 items-center justify-center md:justify-normal mb-4">
          <Img className="size-9 rounded-md" src="/Logo_2.svg" alt="icon" title="icon" />
          <p>Kape Kalakal</p>
        </div>
        <p className="text-sm w-[20em] text-center md:text-left">Brew cafe quality coffee without the fuss or waste of traditional paper filters.</p>
      </div>
      <div className="ml-auto"></div>

      <div className="w-max m-auto md:m-[initial] md:w-[initial]">
        <h1 className="w-max mb-4">Navigation</h1>
        <ul className="text-xs *:my-2 text-gray-300 [&_svg]:fill-gray-100">
          <li>
            <Link className="flex items-center gap-1" href="/products">
              Products
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-1" href="/#contact">
              Contact us
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-1" href="/aboutus">
              About us
            </Link>
          </li>
        </ul>
      </div>

      <div className="w-max m-auto md:m-[initial] md:w-[initial]">
        <h1 className="w-max mb-4">Contact us</h1>
        <ul className="pl-2 text-xs *:my-2 text-gray-300 [&_svg]:fill-gray-100">
          <li>
            <Link className="flex items-center gap-1" href="tel:09212312213">
              <IconPhone className="w-[12px] h-auto" />
              09212312213
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-1" href="mailto:kapekalakal@gmail.com">
              <IconEnvelope className="w-[12px] h-auto" />
              kapekalakal@gmail.com
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-1" href="#" target="_blank">
              <IconLocationPin className="w-[12px] h-auto" />
              7 Mt. Malinang, Quezon City, Metro Manila
            </Link>
          </li>
        </ul>
      </div>

    </div>
    <p className="italic text-xs fraunces-regular">&copy; 2025 Kape Kalakal. All Rights Reserved.</p>
  </div>
}