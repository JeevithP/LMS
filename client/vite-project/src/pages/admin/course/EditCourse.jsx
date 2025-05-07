import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import CourseTab from './courseTab'

export default function EditCourse() {
  return (
    <div className='flex-1 mt-5'>
        <div className='flex items-center justify-between mb-5'>
            <h1 className='font-vold text-xl'>Add Detail Infromation Regarding Course</h1>
            <Link to='lecture'>
                <Button className='hover:text-blue-600' variant='link'>Go To Leactures Page</Button>
            </Link>
        </div>
        <CourseTab/>
    </div>
  )
}
