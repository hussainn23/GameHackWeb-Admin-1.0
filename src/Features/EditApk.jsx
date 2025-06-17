import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, onSnapshot,doc } from "firebase/firestore";
import { db, storage } from "../../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import {Button} from '@/components/ui/button'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { Pen } from 'lucide-react';

const EditApk = () => {
        const [apkList,setapkList]=useState([])
        const navigate = useNavigate();
          useEffect(() => {
                const collectionRef = collection(db, 'APK');
              
                const TotalApks = onSnapshot(collectionRef, (snapshot) => {
                  const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setapkList(data);
                });
              
                // Cleanup the listener on component unmount
                return () => TotalApks();
              }, []);
  return (
         <div className='p-4'>
      <h1 className='text-2xl font-bold'>Edit APPS</h1>
       <div className='p-4 lg:grid-cols-3 grid gap-3 sm:grid-cols-1'>
                        {apkList.map(apk => (
                        <Card  className='cursor-pointer'>
                       <CardHeader>
                         <CardTitle><strong >Name : </strong>{apk.Name}</CardTitle>
                        <CardDescription className='text-black text-lg'>
              <strong>Description:</strong>{" "}
             {apk.Description}
            </CardDescription>
            
                       </CardHeader>
                       <CardContent className='flex gap-1 justify-center'>
                                 <Button variant="outline" className='cursor-pointer text-white bg-green-700 hover:bg-green-600 hover:text-white' onClick={() => navigate(`/updateapk/${apk.id}`)} >Edit APP <Pen /></Button>
                     
                       </CardContent>
                     
                         </Card>
                    ))}
              </div></div>
  )
}

export default EditApk