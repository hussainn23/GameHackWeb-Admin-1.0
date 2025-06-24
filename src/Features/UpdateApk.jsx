import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const UpdateApk = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apkData, setApkData] = useState({
    Name: '',
    URL: '',
    Description: '',
    Category: '',
    MainImage: '',
    Logo: '',
    SizeMB: '',
    Sections: [],
    Visible: false,
    Position: '',
    rating:'',
    bonus:''
  });

  const [mainImgFile, setMainImgFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [sections, setSections] = useState([]);

  const fetchApk = async () => {
    try {
      const docRef = doc(db, 'APK', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setApkData({
          ...data,
          Visible: data.Visible || false,
          Position: data.Position || ''
        });
        const formattedSections = (data.Sections || []).map((sec) => ({ ...sec, File: null }));
        setSections(formattedSections);
      } else {
        toast.error('APK not found');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching APK');
    }
  };

  const getStoragePathFromURL = (url) => {
    const match = url.match(/\/o\/(.*?)\?alt/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return null;
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
    const imageRef = ref(storage, `apk/images/${Date.now()}_${name}`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const handleChange = (e) => {
    setApkData({
      ...apkData,
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
      const docRef = doc(db, 'APK', id);

      const updateData = {
        Name: apkData.Name,
        rating:apkData.rating,
        bonus:apkData.bonus,
        Description: apkData.Description,
        Category: apkData.Category || '',
        URL: apkData.URL,
        SizeMB: apkData.SizeMB || '',
        Visible: apkData.Visible,
        Position: apkData.Visible ? apkData.Position : ''
      };

      if (mainImgFile) {
        if (apkData.MainImage) await deleteOldImage(apkData.MainImage);
        const mainImgURL = await uploadImage(mainImgFile, 'mainImage');
        updateData.MainImage = mainImgURL;
      } else {
        updateData.MainImage = apkData.MainImage;
      }

      if (logoFile) {
        if (apkData.Logo) await deleteOldImage(apkData.Logo);
        const logoURL = await uploadImage(logoFile, 'logo');
        updateData.Logo = logoURL;
      } else {
        updateData.Logo = apkData.Logo;
      }

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
      updateData.Sections = updatedSections;

      await updateDoc(docRef, updateData);

      toast.success('APK updated successfully!');
      navigate('/editApks');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update APK');
    }
  };

  useEffect(() => {
    fetchApk();
  }, [id]);

  return (
    <div className="p-6 2xl:ml-[5rem]">
      <h2 className="text-2xl font-bold mb-4">Update APP</h2>
      <div className="mt-4 lg:w-[70%] sm:w-[95%] space-y-4">
        <h3 className="text-[18px] font-semibold mt-4">App Name</h3>
        <Input
          type="text"
          name="Name"
          value={apkData.Name}
          onChange={handleChange}
          placeholder="APK Name"
        />
        <h3 className="text-[18px] font-semibold">APK Download URL</h3>
        <Input
          type="text"
          name="URL"
          value={apkData.URL}
          onChange={handleChange}
          placeholder="APK Download URL"
        />
        <h3 className="text-[18px] font-semibold">Category</h3>
        <Input
          type="text"
          name="Category"
          value={apkData.Category}
          onChange={handleChange}
          placeholder="e.g. Games, Tools, Social"
        />
        <h3 className="text-[18px] font-semibold mt-4">Description</h3>
        <Textarea
          name="Description"
          value={apkData.Description}
          onChange={handleChange}
          placeholder="APK Description"
          className="min-h-[100px]"
          maxLength={95}
        />
        <h3 className="text-[18px] font-semibold mb-2">Select Main Image</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setMainImgFile(e.target.files[0])}
        />
        <h3 className="text-[18px] font-semibold mb-2">Select Logo</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
        />
          <div className='flex lg:flex-row sm:flex-col lg:items-center gap-3'>
<div>
    <h3 className="text-[18px] font-semibold">Enter Rating</h3>
        <Input
  className="mt-2"
  placeholder="Enter Rating"
  name="rating"
  value={apkData.rating}
  onChange={handleChange}
/>



</div>
<div>
  <h3 className="text-[18px] font-semibold">Enter Bonus</h3>
       <Input
  className="mt-2"
  placeholder="Enter Bonus"
  name="bonus"
  value={apkData.bonus}
  onChange={handleChange}
/>

</div>

  
</div>
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="visible"
            checked={apkData.Visible}
            onCheckedChange={(val) => setApkData({ ...apkData, Visible: val })}
          />
          <label htmlFor="visible" className="text-sm">App visible on main screen</label>
        </div>

        {apkData.Visible && (
          <div className="mt-2">
            <h3 className="text-[18px] font-semibold mb-2">Select Position</h3>
            <Select value={apkData.Position} onValueChange={(val) => setApkData({ ...apkData, Position: val })}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {sections.map((section, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded shadow">
            <Input
              className="mb-2"
              value={section.Heading}
              onChange={(e) => handleSectionChange(index, 'Heading', e.target.value)}
              placeholder={`Heading ${index + 1}`}
            />
            <Textarea
              className="mb-2"
              value={section.Description}
              onChange={(e) => handleSectionChange(index, 'Description', e.target.value)}
              placeholder={`Description ${index + 1}`}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
            />
          </div>
        ))}

        <Button
          onClick={handleUpdate}
          className="bg-[#3D5DA6] text-white hover:bg-blue-900"
        >
          Update APP
        </Button>
      </div>
    </div>
  );
};

export default UpdateApk;
