import { IconEnvelope, IconLocationPin, IconPhone } from "../Utils/SVGIcons";
import Link from "./Link";

export default function Footer() {
  return <div className="bg-primary-950 p-1 text-white">
    <div className="px-2 py-3 fraunces-regular flex gap-3 mb-4">
      <div>
        <div className="flex flex-col gap-2 items-center">
          <img className="w-[24px] h-[24px] rounded-md" src="/kape_kalakal.jpeg" alt="icon" title="icon" />
          <h1 className="text-sm">Kape Kalakal</h1>
        </div>
        <p className="text-xs text-center">Brew cafe quality coffee without the fuss or waste of traditional paper filters.</p>
      </div>

      {/* <div>
        <h1 className="text-sm">Navigation</h1>
        <div className="text-sm">
        <ul className="pl-2">
          <li><Link href="/#home">Home</Link></li>
          <li><Link href="/#promos">Promos</Link></li>
          <li><Link href="/#bestseller">Best Sellers</Link></li>
          <li><Link href="/products">Products</Link></li>
        </ul>
        </div>
      </div> */}

      <div>
        <h1 className="text-sm w-max">Contact us</h1>
        <div className="text-sm">
        <ul className="pl-2">
          <li>
            <Link href="tel:09212312213">
              <IconPhone className="w-[8px] h-auto" />
              09xxxxxxxxx
            </Link>
          </li>
          <li>
            <Link href="mailto:kapekalakal@gmail.com">
              <IconEnvelope className="w-[8px] h-auto" />
              kapekalakal@gmail.com
            </Link>
          </li>
          <li>
            <Link href="#" target="_blank">
              <IconLocationPin className="w-[12px] h-auto" />
              7 Mt. Malinang, Quezon City, Metro Manila
            </Link>
          </li>
        </ul>
        </div>
      </div>

    </div>
    <p className="italic text-xs fraunces-regular">&copy; 2025 Kape Kalakal. All Rights Reserved.</p>
  </div>
}