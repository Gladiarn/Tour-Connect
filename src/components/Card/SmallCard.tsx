import React from 'react'

export default function SmallCard({text}: {text:string}) {
  return (
    <div className='text-[13px] px-[3px] py-[1px] bg-[#EEEEEE] rounded-xs'>
      {text}
    </div>
  )
}
