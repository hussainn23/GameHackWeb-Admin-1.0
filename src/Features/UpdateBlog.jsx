import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc,serverTimestamp  } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blogData, setblogData] = useState({
    Name: '',
    Sections: [],
  });

  const [sections, setSections] = useState([]);

  const getStoragePathFromURL = (url) => {
    try {
      return decodeURIComponent(new URL(url).pathname.split('/o/')[1].split('?')[0]);
    } catch {
      return null;
    }
  };

  const fetchBlog = async () => {
    try {
      const docRef = doc(db, 'Blogs', id); // ✅ Corrected collection name
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setblogData({ Name: data.Name }); // ✅ Corrected setter
        const formattedSections = (data.Sections || []).map((sec) => ({ ...sec, File: null }));
        setSections(formattedSections);
      } else {
        toast.error('Blog not found');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching blog');
    }
  };

  const deleteOldImage = async (url) => {
    const path = getStoragePathFromURL(url);
    if (!path) return;
    const fileRef = ref(storage, path);
    try {
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('Failed to delete old image:', error.message);
    }
  };

  const uploadImage = async (file, name) => {
    const imageRef = ref(storage, `blogs/images/${Date.now()}_${name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleChange = (e) => {
    setblogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSectionChange = (index, key, value) => {
    const newSections = [...sections];
    newSections[index][key] = value;
    setSections(newSections);
  };

  const handleFileChange = (index, file) => {
    const newSections = [...sections];
    newSections[index].File = file;
    setSections(newSections);
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'Blogs', id); // ✅ Corrected collection

      const updatedSections = await Promise.all(
        sections.map(async (section, index) => {
          let imageUrl = section.Image;
          if (section.File) {
            if (section.Image) await deleteOldImage(section.Image);
            imageUrl = await uploadImage(section.File, `section${index + 1}`);
          }
          return {
            Heading: section.Heading,
            Description: section.Description,
            Image: imageUrl,
          };
        })
      );

      const updateData = {
        Name: blogData.Name,
        Sections: updatedSections,
        Date: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);

      toast.success('Blog updated successfully!');
      navigate('/allblogs');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update blog');
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
      <div className="mt-4 lg:w-[70%] sm:w-[95%] space-y-4">
        <h3 className="text-[18px] font-semibold mt-4">Blog Title</h3>
        <Input
          type="text"
          name="Name"
          value={blogData.Name}
          onChange={handleChange}
          placeholder="Blog Title"
        />
        {sections.map((section, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded shadow">
            <Input
              className="mb-2"
              value={section.Heading || ''}
              onChange={(e) => handleSectionChange(index, 'Heading', e.target.value)}
              placeholder={`Heading ${index + 1}`}
            />
            <Textarea
              className="mb-2"
              value={section.Description || ''}
              onChange={(e) => handleSectionChange(index, 'Description', e.target.value)}
              placeholder={`Description ${index + 1}`}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
            />
            {section.Image && (
              <img
                src={section.Image}
                alt={`Section ${index + 1} preview`}
                className="mt-2 w-full max-h-60 rounded object-cover"
              />
            )}
          </div>
        ))}

        <Button
          onClick={handleUpdate}
          className="bg-[#3D5DA6] text-white hover:bg-blue-900"
        >
          Update Blog
        </Button>
      </div>
    </div>
  );
};

export default UpdateBlog;
