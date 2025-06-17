import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Button } from '@/components/ui/button';
import { FaDownload, FaArrowRight } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Filter } from 'lucide-react';

const ListApk = () => {
  const [apkList, setApkList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const collectionRef = collection(db, 'APK');

    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApkList(data);
    });

    return () => unsubscribe();
  }, []);

  // Filter logic when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = apkList.filter(apk => apk.Category === selectedCategory);
      setFilteredList(filtered);
    } else {
      setFilteredList(apkList);
    }
  }, [apkList, selectedCategory]);

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>All APPS</h1>

        <DropdownMenu>
          <DropdownMenuTrigger className='cursor-pointer'><Filter /></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["LOTTERY", "WINZO", "COLOUR TRADING", "RUMPY GAMES", "YONO GAMES", "ALL"].map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setSelectedCategory(cat === "ALL" ? null : cat)}
              >
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='p-4 lg:grid-cols-3 grid gap-3 sm:grid-cols-1'>
        {filteredList.map(apk => (
          <Card key={apk.id} className='cursor-pointer'>
            <CardHeader>
              <CardTitle><strong>Name:</strong> {apk.Name}</CardTitle>
              <CardDescription className='text-black text-lg'>
                <strong>Description:</strong>{" "}
                {apk.Description}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex gap-1 justify-center'>
              <Button
                variant="outline"
                className='cursor-pointer text-white bg-[#3D5DA6] hover:bg-blue-600 hover:text-white'
                onClick={() => navigate(`/apkdetails/${apk.id}`)}
              >
                View Details <FaArrowRight />
              </Button>
              <Button
                variant='outline'
                className='cursor-pointer text-white bg-green-800 hover:bg-green-600 hover:text-white'
              >
                <a href={apk.URL} target="_blank" rel="noopener noreferrer">Download</a>
                <FaDownload />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListApk;
