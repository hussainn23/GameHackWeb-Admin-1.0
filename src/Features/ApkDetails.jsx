import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { Button } from '../components/ui/button';
import { FaDownload, FaPencil } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from 'sonner';

const ApkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apk, setApk] = useState(null);

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
     setApk(prev => prev.filter(apk => apk.id !== id));
 
     toast.success("APK and related files deleted successfully");
   } catch (error) {
     console.error("Error deleting APK and files:", error);
     toast.error("Error deleting APK");
   }
 };

  useEffect(() => {
    const fetchAPK = async () => {
      const docRef = doc(db, 'APK', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setApk({ id: docSnap.id, ...docSnap.data() });
      }
    };

    fetchAPK();
  }, [id]);

  if (!apk) return <p className='p-4'>Loading...</p>;

  return (
    <div className='p-4 flex items-center justify-center'>
      <Card className='cursor-pointer lg:w-[50%] sm:w-[90%]'>
        <CardHeader>
          <CardTitle><strong>Name: </strong>{apk.Name}</CardTitle>
          <CardDescription className='text-black text-lg'>
            <strong>Category: </strong>
            {apk.Category}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3><strong>Description:</strong> {apk.Description}</h3>
        </CardContent>
        <div className="flex flex-row lg:flex-row sm:flex-col md:flex-col gap-2 justify-center items-center">
           <Button
            variant="outline"
            className='text-white bg-blue-800 hover:bg-blue-600 '
            onClick={() => navigate(`/updateapk/${apk.id}`)} 
          >
            Edit Details <FaPencil className="ml-2" />
          </Button>
          <Button
            variant="outline"
            className='text-white bg-red-700 hover:bg-red-600'
            onClick={() => handleDelete(apk.id, apk.URL)}
          >
            Delete APK <ImBin className="ml-2" />
          </Button>
          <Button
            variant="outline"
            className='text-white bg-green-800 hover:bg-green-600'
          >
            <a href={apk.URL} target="_blank" rel="noopener noreferrer">
              Download
            </a>
            <FaDownload className="ml-2" />
          </Button>
        </div>
   
      </Card>
    </div>
  );
};

export default ApkDetails;
