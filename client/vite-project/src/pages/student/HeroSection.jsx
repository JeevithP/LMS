import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const [searchQuery,setSearchQuery]=useState("");
  const navigate=useNavigate();

  const searchHandler=(e)=>{
    e.preventDefault();
    if(searchQuery.trim()!==""){
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery("");
  }
  return (
    <div className='relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 py-16 px-4 text-center'>
        <div className='max-w-3xl mx-auto'>
            <h1 className='text-white text-4xl font-bold mb-4 mt-8'>Find The Best Courses For You</h1>
            <p>Discover,Learn and Upskill Youself</p>
            <form onSubmit={searchHandler} action="" className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6 my-6">
                <Input
                type="text"
                value={searchQuery}
                onChange={(e)=>setSearchQuery(e.target.value)}
                placeholder="Search Courses"
                className="flex-grow bg-white border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-500"/>
                <Button type="submit" className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">Search</Button>
            </form>
            <Button className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200" onClick={()=>navigate('/course/search?query')}>Explore Courses</Button>
        </div>
    </div>
  )
}
