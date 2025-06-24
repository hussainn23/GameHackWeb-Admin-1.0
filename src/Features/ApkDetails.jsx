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
      const apkDocRef = doc(db, "APK", id);
      const apkSnap = await getDoc(apkDocRef);

      if (!apkSnap.exists()) {
        toast.error("APK not found");
        return;
      }

      const apkData = apkSnap.data();
      const urlsToDelete = [];

      if (apkData.URL) urlsToDelete.push(apkData.URL);
      if (apkData.MainImage) urlsToDelete.push(apkData.MainImage);
      if (apkData.Logo) urlsToDelete.push(apkData.Logo);
      if (Array.isArray(apkData.Sections)) {
        apkData.Sections.forEach(section => {
          if (section.Image) urlsToDelete.push(section.Image);
        });
      }

      for (const url of urlsToDelete) {
        const path = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef).catch(() => {
          console.warn(`Failed to delete from storage: ${url}`);
        });
      }

      await deleteDoc(apkDocRef);
      toast.success("APK and related files deleted successfully");
      navigate("/");
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
      <Card className='w-full max-w-3xl p-4 rounded-xl shadow-lg'>
        {/* Banner Image */}
        {apk.MainImage && (
          <img
            src={apk.MainImage}
            alt="App Banner"
            className="w-full h-60 object-center rounded-lg mb-4"
          />
        )}

        {/* Top Info Row */}
        <div className='flex items-center gap-4 mb-4'>
          {/* Logo */}
          {apk.Logo && (
            <img
              src={apk.Logo}
              alt={`${apk.Name} logo`}
              className="w-16 h-16 object-cover rounded-md border"
            />
          )}

          {/* Title & Tags */}
          <div className='flex-1'>
            <CardTitle className='text-xl font-bold'>{apk.Name}</CardTitle>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              {apk.Category && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {apk.Category}
                </span>
              )}
              {apk.SizeMB && <span>{apk.SizeMB} MB</span>}
              {apk.Visible && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                  Visible on Home
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <CardContent className='text-sm text-gray-800 mb-4'>
          <h3 className="text-base font-semibold mb-2">Description</h3>
          <p>{apk.Description}</p>
        </CardContent>

        {/* Actions */}
        <CardFooter className='flex lg:flex-row sm:flex-col gap-3 justify-end'>
          <Button
            variant="outline"
            className='text-white bg-blue-800 hover:bg-blue-600 w-full sm:w-auto'
            onClick={() => navigate(`/updateapk/${apk.id}`)}
          >
            Edit Details <FaPencil className="ml-2" />
          </Button>

          <Button
            variant="outline"
            className='text-white bg-red-700 hover:bg-red-600 w-full sm:w-auto'
            onClick={() => handleDelete(apk.id, apk.URL)}
          >
            Delete APK <ImBin className="ml-2" />
          </Button>

          <Button
            variant="outline"
            className='text-white bg-green-800 hover:bg-green-600 w-full sm:w-auto'
          >
            <a href={apk.URL} target="_blank" rel="noopener noreferrer" className='flex items-center w-full h-full'>
              Download <FaDownload className="ml-2" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApkDetails;
