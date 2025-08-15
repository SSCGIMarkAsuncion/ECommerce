import Navbar, { NavbarOffset } from "../Components/Navbar";
import Footer from "../Components/Footer";
import type { ReactNode } from "react";
import { Theme } from "../Utils/Theme";
import { IconBoxStacks, IconCart, IconStar } from "../Utils/SVGIcons";
import ContactUs from "../Components/ContactUs";

export default function AboutUs() {
  return <>
    <NavbarOffset />
    <div className="min-h-[80svh] w-[90%] mx-auto fraunces-regular text-primary-900">
      <div id="howitstarted" className="grid grid-cols-2 gap-1 py-12">
        <div>
          <p className="text-sm text-primary-900/80">How it started</p>
          <h1 className="text-4xl mb-4">Founded in 2025 by a group of passionate students and entrepreneurs</h1>
          <p className="text-md text-justify"><span className="text-xl font-semibold">Kape Kalakal</span> was born out of love for local coffee, crafts, and the Filipino spirit of bayanihan. The name, a blend of kape (coffee) and kalakal (trade), reflects our belief that local products deserve a national—and even global—stage.<br /><br />  What started as a school project has grown into a digital platform supporting farmers, artisans, and small businesses from Luzon to Mindanao.</p>
        </div>
        <div className="p-4 flex items-center">
          <img
            className="rounded-md w-full object-cover"
            src="https://www.cyanpak.com/uploads/e1.jpg" />
        </div>
      </div>

      <div id="missionvision" className="grid grid-cols-2 gap-1 mb-8">
        <MissionVissionCard>
          <p className="text-sm text-green-700 font-semibold">Our mission</p>
          <p>To empower Filipino producers by providing a fair, accessible, and community-driven marketplace.</p>
        </MissionVissionCard>
        <MissionVissionCard>
          <p className="text-sm text-green-700 font-semibold">Our vision</p>
          <p>A Philippines where every local product finds its way into homes across the islands and beyond—promoting culture, sustainability, and economic growth.</p>
        </MissionVissionCard>
      </div>

      <div id="whatweoffer">
        <p className="text-center text-sm text-primary-900/80">Services</p>
        <h1 className="text-center text-4xl font-semibold tracking-wide mb-2">What we offer</h1>
        <div className={`${Theme.rounded} bg-primary-700 grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 justify-center flex-wrap`}>
          <ServiceCard
            icon={<IconCart className="size-4" />}
            title="Local Marketplace"
            subtitle="Discover curated products from trusted local producers."
           />
          <ServiceCard
            icon={<IconStar className="size-4" />}
            title="Verified Reviews"
            subtitle="Buy with confidence from community-rated sellers."
           />
          <ServiceCard
            icon={<IconBoxStacks className="size-4" />}
            title="Flexible Logistics"
            subtitle="Nationwide shipping and local pickup options."
           />
          {/* <ServiceCard
            icon={<IconCommunity className="size-4" />}
            title="Community Engagement"
            subtitle="Support forums, events, and features that let buyers and sellers interact directly."
           /> */}
        </div>
      </div>

      <div id="corevalues" className="my-6">
        <p className="text-center text-sm text-primary-900/80">Why choose us</p>
        <h1 className="text-center text-4xl font-semibold tracking-wide mb-8">Our core values</h1>
        <div className="flex gap-10 w-[80%] flex-wrap justify-center mx-auto">
          <CoreValue
            num={1}
            title="Bayanihan"
            content="We work hand-in-hand with communities and value collaboration over competition."
          />
          <CoreValue
            num={2}
            title="Cultural Pride"
            content="We celebrate Filipino heritage and support indigenous and local artisans."
          />
          <CoreValue
            num={3}
            title="Sustainability"
            content="We promote eco-friendly packaging and slow commerce."
          />
          <CoreValue
            num={4}
            title="Integrity"
            content="We operate with honesty and transparency in all aspects of the business."
          />
          <CoreValue
            num={5}
            title="Quality Over Quantity"
            content="We carefully curate products to ensure authenticity and excellence."
          />
        </div>
      </div>
    </div>
    <div id="contact" className="bg-primary-50/70 mt-8 text-primary-900">
      <div className="w-[90%] mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-12 ">
        <ContactUs />
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.8996135015977!2d121.04467497416896!3d14.71826717418687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b0f0e5bb68dd%3A0x74ca74293192219d!2s7%20Mt.%20Malinang%2C%20Quezon%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1754009613862!5m2!1sen!2sph"
          className="border-0 h-full w-full"
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
    <Navbar />
    <Footer />
  </>
}

function MissionVissionCard({ children }: { children: ReactNode }) {
  return <div className={`${Theme.rounded} bg-gray-100 p-6`}>
    {children}
  </div>
}

interface ServiceCardProps {
  icon: ReactNode,
  title: string,
  subtitle: string
};

function ServiceCard(props: ServiceCardProps) {
  return <div className={`p-6 bg-gray-50 border-1 border-gray-400 rounded-md hover:scale-110 ${Theme.transition}`}>
    <div className="mb-4 flex items-center bg-primary-200 border-1 border-primary-400 rounded-full p-2 *:fill-primary-600 w-max h-max">
      {props.icon}
    </div>
    <h1 className="text-2xl my-2 font-semibold">{props.title}</h1>
    <p className="text-md text-wrap">{props.subtitle}</p>
  </div>
}

interface CoreValueProps {
  num: number,
  title: string,
  content: string
};

function CoreValue({ num, title, content }: CoreValueProps) {
  return <div className={`relative ${Theme.rounded} w-max hover:translate-y-[-10%] ${Theme.transition}`}>
    <div className="absolute top-[-5px] left-[-5px] w-full h-full bg-primary-800 rounded-[inherit] z-9"></div>
    <div className={`relative h-full max-w-[200px] bg-white p-4 rounded-[inherit] z-10 shadow-sm shadow-black`}>
      <p className="text-2xl my-2 font-semibold"> {title} </p>
      <p className="text-sm text-wrap"> {content} </p>
    </div>
    <div className="absolute rounded-[inherit] top-[-20px] left-[10px] bg-primary-800 flex items-center justify-center p-2 text-lg aspect-square size-9 text-white z-11">
      <span>{num}</span>
    </div>
  </div>
}