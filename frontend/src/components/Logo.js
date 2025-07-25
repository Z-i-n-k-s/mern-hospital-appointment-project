import React from 'react'

const Logo = ({ w, h, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w}
      height={h}
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <rect width="64" height="64" rx="12" fill="#E0F2F1" />
      <path
        d="M36 12h-8v12H16v8h12v12h8V32h12v-8H36V12z"
        fill="#00796B"
      />
    </svg>
  )
}

export default Logo
