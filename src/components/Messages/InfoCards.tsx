import React from 'react'
import { infoCardTypes } from '../types'

export default function InfoCards({info} : {info: infoCardTypes}) {

  return (
    <div className='max-w-[350px] h-fit flex flex-col items-center gap-2 px-5 lg:static absolute min-h-[100px] bg-gray-100'>
      <div className={`${info.color} ${info.background} w-15 h-15 flex flex-col gap-1 justify-center items-center`}>
        {info.icon}
        
      </div>
      <p className='font-semibold text-[18px]'>{info.title}</p>
      <p className='text-[15px]'>{info.body}</p>
    </div>
  )
}
