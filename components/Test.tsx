import LampHeading from "./ui/lamp-heading";

import React from 'react'

function Heading() {
  return (
    <LampHeading
  text="Dashboard"
  textSize="lg"
  className="bg-linear-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent"
  glowIntensity={0.8}
  glowSize={40}
  showParticles={true}
  pulseEffect={true}
  gradientColors={{
    from: "#FF4500",
    via: "#FF6B00",
    to: "#FFD700",
  }}
  animationSpeed={2}
/>
  )
}

export default Heading