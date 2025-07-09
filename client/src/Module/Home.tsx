// import { useState } from 'react'

import Button from "../Components/Button";

export default function Home() {
  return (
    <div className="bg-primary-800">
      <img src="/coffee_cup.png"></img>
      <Button pType="outline" pColor="whitePrimary">Button</Button>
      <Button pType="filled" pColor="whitePrimary">Button</Button>
    </div>
  )
}