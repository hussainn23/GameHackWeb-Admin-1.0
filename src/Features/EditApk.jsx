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
                     {apkList.map((apk) => (
  <Card
    key={apk.id}
    className="cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-xl border"
  >
    <div className="p-4 flex items-start gap-4">
      {/* App Logo (optional if available) */}
      {apk.Logo && (
        <img
          src={apk.Logo}
          alt={`${apk.Name} logo`}
          className="w-16 h-16 object-cover rounded-md border"
        />
      )}

      <div className="flex-1">
        {/* App Name and Category */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-[#1F2937]">{apk.Name}</h2>
          {apk.Visible && (
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
              On Main Screen
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
          <strong className="text-gray-800">Description: </strong>
          {apk.Description}
        </p>

        {/* Edit Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="text-white bg-green-700 hover:bg-green-600 flex items-center gap-2 px-4 py-2"
            onClick={() => navigate(`/updateapk/${apk.id}`)}
          >
            Edit App <Pen size={16} />
          </Button>
        </div>
      </div>
    </div>
  </Card>
))}

              </div></div>
  )
}

export default EditApk