import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Button } from '@/components/ui/button';
import { FaArrowRight } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const AllBlogs = () => {
  const [blogList, setblogList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const collectionRef = collection(db, 'Blogs');
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setblogList(data);
    });
    return () => unsubscribe();
  }, []);

  // Function to format Firestore Timestamp
  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Unknown date';
    const dateObj = timestamp.toDate();
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='lg:p-4 2xl:ml-[5rem] xl:ml-[2.5rem] sm:py-3'>
      <h1 className='text-3xl font-bold mb-4 text-gray-800'>All Blogs</h1>

      <div className='grid lg:grid-cols-2 sm:grid-cols-1 gap-6'>
        {blogList.map(blog => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden border p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#3D5DA6]">{blog.Name}</h2>
                <span className="text-sm text-gray-500">{formatDate(blog.Date)}</span>
              </div>

              <div className="text-gray-600 line-clamp-4 text-sm">
                {blog.Sections && blog.Sections[0]?.Description?.slice(0, 100)}...
              </div>

              <div className="flex mt-3">
                <Button
                  variant="outline"
                  className="text-white bg-[#3D5DA6] hover:bg-blue-600 hover:text-white w-full flex justify-center items-center"
                  onClick={() => navigate(`/blogdetails/${blog.id}`)}
                >
                  View Details <FaArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
