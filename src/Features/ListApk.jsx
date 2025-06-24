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
import { Checkbox } from "@/components/ui/checkbox"; // ✅ New Import
import { useNavigate } from "react-router-dom";
import { ListFilter } from 'lucide-react';

const ListApk = () => {
  const [apkList, setApkList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [filteredList, setFilteredList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showOnlyVisible, setShowOnlyVisible] = useState(false); // ✅ New State
  const navigate = useNavigate();

  // Fetch APK data in real-time
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

  // Apply filtering whenever data or filter changes
 useEffect(() => {
  let filtered = [...apkList];

  if (selectedCategory) {
    filtered = filtered.filter(
      apk => (apk.Category || "").toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (showOnlyVisible) {
    filtered = filtered.filter(apk => apk.Visible === true);
  }

  if (searchTerm.trim()) {
    filtered = filtered.filter(apk =>
      apk.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredList(filtered);
}, [apkList, selectedCategory, showOnlyVisible, searchTerm]);


  return (
    <div className='lg:p-4 2xl:ml-[5rem] xl:ml-[2.5rem] sm:py-3'>
      <div className=' sm:px-1 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>All APPS</h1>
        <div className='flex items-center gap-4'>
                 <input
      type="text"
      placeholder="Search apps..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border rounded px-3 py-1 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className='cursor-pointer'>
            <ListFilter />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
           {["COLOUR TRADING", "RUMMY GAMES", "YONO GAMES", "OTHER GAMES", "ALL"].map((cat) => (
  <DropdownMenuItem
    key={cat}
    onClick={() => setSelectedCategory(cat === "ALL" ? null : cat.toLowerCase())}
  >
    {cat}
  </DropdownMenuItem>
))}


            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filters</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <label className="flex items-center gap-2 cursor-pointer px-2">
                <Checkbox
                  checked={showOnlyVisible}
                  onCheckedChange={(checked) => setShowOnlyVisible(!!checked)}
                />
                <span>Visible on Main Screen</span>
              </label>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
 
      </div>

      {/* APK Cards */}
      <div className='lg:p-4 sm:p-1 lg:grid-cols-2 grid gap-3 sm:grid-cols-1'>
       {filteredList.map(apk => (
  <Card key={apk.id} className="hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden border">
    <div className="lg:p-4 sm:p-1 flex items-start gap-4">
      {/* App Logo */}
      {apk.Logo && (
        <img
          src={apk.Logo}
          alt={`${apk.Name} logo`}
          className="w-16 h-16 object-cover rounded-md border"
        />
      )}

      {/* Main Info */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold">{apk.Name}</h2>
          {apk.Visible && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              Visible on Home
            </span>
          )}
        </div>

        {/* Category + Size */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          {apk.Category && <span className="bg-gray-100 px-2 py-1 rounded">{apk.Category}</span>}
          {apk.SizeMB && <span>{apk.SizeMB} MB</span>}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
          {apk.Description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            className="text-white bg-[#3D5DA6] hover:bg-blue-600 hover:text-white flex-1"
            onClick={() => navigate(`/apkdetails/${apk.id}`)}
          >
            View Details <FaArrowRight className="ml-2" />
          </Button>
          <Button
            variant="outline"
            className="text-white bg-green-800 hover:bg-green-600 hover:text-white flex-1"
          >
            <a href={apk.URL}  rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
              Download <FaDownload className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  </Card>
))}

      </div>
    </div>
  );
};

export default ListApk;
