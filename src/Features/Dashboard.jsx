import { MdWavingHand } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaPlus } from "react-icons/fa6";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
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
    <div className='p-6'>
    <h1 className='text-2xl font-bold'>Dashboard</h1>
    <h2 className='text-lg font-semibold flex gap-1 items-center'>Welcome back,Admin <MdWavingHand size={25} color="#1A2536"/></h2>
    <div className="pt-4 grid lg:grid-cols-3 gap-3 sm:grid-cols-1">
          <Card onClick={()=>navigate('/allApks')} className='cursor-pointer'>
  <CardHeader>
    <CardTitle>View All APKS</CardTitle>
    <CardDescription className='cursor-pointer text-blue-500' onClick={()=>navigate('/allApks')}>Tap to View List of All Apks</CardDescription>
  </CardHeader>
  <CardContent>
    <p><strong>Total number of All Apks : </strong>{apkList.length}</p>
  </CardContent>

        </Card>
        <Card onClick={()=>navigate('/addApk')} className='cursor-pointer '>
        <CardHeader>
             <CardTitle >Add New Apk</CardTitle>
               <CardDescription className='cursor-pointer text-blue-500' onClick={()=>navigate('/addApk')}>Tap to add  new Apks</CardDescription>
        </CardHeader>
          <CardContent>
  <div className="flex items-center justify-center ">
    <FaPlus size={55} />
  </div>
</CardContent>
        </Card>
    </div>
   
    </div>
  )
}

export default Dashboard