// Login and Register Header
export default function FormHeader({ title = "" }) {
  return <>
    <img src="/Logo.svg" className="w-[30vw] md:w-[10vw] mx-auto h-auto" />
    <h1 className="fraunces-regular text-4xl md:text-2xl text-center">{ title }</h1>
  </>
}