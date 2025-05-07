import React, { useEffect } from 'react'
import { Button } from './button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BuyCourseButton({ courseId }) {
    const [createCheckoutSession, { data,isLoading,isSuccess,isError,error }] = useCreateCheckoutSessionMutation();
    const purchaseCourseHandler = async () => {
        await createCheckoutSession(courseId)
    }
    useEffect(()=>{
        if(isSuccess) {
            if(data?.url){
                window.location.href = data.url; //redirect to stripe checkout page
            }
            else{
                toast.error("Invalid Response From Server");
            }
        }
        if(isError){
            toast.error(error?.data?.message||"Error To Checkout");
        }
        
    },[data,isSuccess,isError,error])
    return (
        <Button className='w-full' onClick={purchaseCourseHandler} disabled={isLoading}>
            {
                isLoading ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please Wait
                    </>

                ) : "Purchase Course"
            }
            
        </Button>
    )
}
