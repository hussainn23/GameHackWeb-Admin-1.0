import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { Button } from '../components/ui/button';
import { FaPencil } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from 'sonner';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, 'Blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Unknown date';
    const dateObj = timestamp.toDate();
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "Blogs", id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("Blog not found");
        return;
      }

      const data = docSnap.data();
      const urlsToDelete = [];

      if (Array.isArray(data.Sections)) {
        data.Sections.forEach(section => {
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

      await deleteDoc(docRef);
      toast.success("Blog and related files deleted successfully");
      navigate("/allblogs");
    } catch (error) {
      console.error("Error deleting Blog and files:", error);
      toast.error("Error deleting Blog");
    }
  };

  if (!blog) return <p className='p-4'>Loading...</p>;

  return (
    <div className='p-4 flex justify-center'>
      <Card className='w-full max-w-4xl p-6 rounded-xl shadow-lg bg-white space-y-6'>
        {/* Title & Date */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <h2 className="text-2xl font-bold text-[#3D5DA6]">{blog.Name}</h2>
          <span className="text-sm text-gray-600">{formatDate(blog.Date)}</span>
        </div>

        {/* Blog Sections */}
      {blog.Sections && blog.Sections.map((section, index) => {
  // Check if any content exists in the section
  const hasContent = section.Heading || section.Image || section.Description;

  if (!hasContent) return null;

  return (
    <CardContent
      key={index}
      className="pt-4 space-y-3 border-t"
    >
      {section.Heading && (
        <h3 className="text-lg font-semibold text-gray-800">{section.Heading}</h3>
      )}

      {section.Image && (
        <img
          src={section.Image}
          alt={`Section ${index + 1}`}
          className="w-full rounded-md max-h-64 object-cover"
        />
      )}

      {section.Description && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {section.Description}
        </p>
      )}
    </CardContent>
  );
})}


        {/* Buttons */}
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t">
          <Button
            variant="outline"
            className="text-white bg-blue-800 hover:bg-blue-600 w-full sm:w-auto"
            onClick={() => navigate(`/updateblog/${blog.id}`)}
          >
            Edit Details <FaPencil className="ml-2" />
          </Button>

          <Button
            variant="outline"
            className="text-white bg-red-700 hover:bg-red-600 w-full sm:w-auto"
            onClick={() => handleDelete(blog.id)}
          >
            Delete Blog <ImBin className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogDetails;
