import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, onSnapshot, doc, getDoc } from "firebase/firestore";

import { db, storage } from "../../config/firebase";
import { ref, deleteObject } from "firebase/storage";
import {Button} from '@/components/ui/button'
import { ImBin } from "react-icons/im";
import {
  Card,

  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const DeleteApk = () => {
      const [apkList,setapkList]=useState([])
        const navigate = useNavigate();
const handleDelete = async (id, apkUrl) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this APK?");
  if (!confirmDelete) return;

  try {
    // 1. Get the document to extract image URLs
    const apkDocRef = doc(db, "APK", id);
    const apkSnap = await getDoc(apkDocRef);

    if (!apkSnap.exists()) {
      toast.error("APK not found");
      return;
    }

    const apkData = apkSnap.data();

    // 2. Collect all URLs (apk file + images)
    const urlsToDelete = [];

    if (apkData.URL) urlsToDelete.push(apkData.URL);
    if (apkData.MainImage) urlsToDelete.push(apkData.MainImage);
    if (apkData.Logo) urlsToDelete.push(apkData.Logo);
    if (Array.isArray(apkData.Sections)) {
      apkData.Sections.forEach(section => {
        if (section.Image) urlsToDelete.push(section.Image);
      });
    }

    // 3. Delete from Storage
    for (const url of urlsToDelete) {
      const path = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);
      const storageRef = ref(storage, path);
      await deleteObject(storageRef).catch(() => {
        console.warn(`Failed to delete from storage: ${url}`);
      });
    }

    // 4. Delete document
    await deleteDoc(apkDocRef);

    // 5. Update UI
    setapkList(prev => prev.filter(apk => apk.id !== id));

    toast.success("APK and related files deleted successfully");
  } catch (error) {
    console.error("Error deleting APK and files:", error);
    toast.error("Error deleting APK");
  }
};


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
     <div className='p-4 2xl:ml-[5rem] xl:ml-[2.5rem]'>
      <h1 className='text-2xl font-bold'>Delete APPS</h1>
        <div className='p-4 lg:grid-cols-3 grid gap-3 sm:grid-cols-1'>
               {apkList.map(apk => (
  <Card key={apk.id} className='cursor-pointer shadow-md border border-gray-200 hover:shadow-lg transition duration-300'>
    <CardHeader className="flex flex-col gap-2">
      {/* Optional logo */}
      {apk.Logo && (
        <img
          src={apk.Logo}
          alt="App Logo"
          className="w-16 h-16 object-cover rounded-md border"
        />
      )}
      <CardTitle className="text-xl font-semibold text-blue-900">
        <strong>Name:</strong> {apk.Name}
      </CardTitle>
      <CardDescription className='text-gray-800 text-sm'>
        <strong>Description:</strong> {apk.Description}
      </CardDescription>
    </CardHeader>

    <CardContent className='flex justify-center p-4'>
      <Button
        variant="outline"
        className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md shadow-sm transition-all duration-300 flex items-center gap-2'
        onClick={() => handleDelete(apk.id, apk.URL)}
      >
        Delete App <ImBin className="text-base" />
      </Button>
    </CardContent>
  </Card>
))}

        </div>
      </div>
  )
}

export default DeleteApk