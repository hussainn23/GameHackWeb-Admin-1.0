import React, { useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { db, storage } from '../../config/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const AddApk = () => {
  const [name, setName] = useState('');
    const [bonus, setBonus] = useState('');
   const [rating, setRating] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [mainImg,setmainImg]=useState(null)
  const [logo,setLogo]=useState(null)
  const [head1,sethead1]=useState('')
  const [Pic1,setPic1]=useState(null)
  const [des1,setdes1]=useState('')
  const [head2,sethead2]=useState('')
   const [Pic2,setPic2]=useState(null)
   const [des2,setdes2]=useState('')
  const [head3,sethead3]=useState('')
   const [Pic3,setPic3]=useState(null)
   const [des3,setdes3]=useState('')
  const [head4,sethead4]=useState('')
   const [des4,setdes4]=useState('')
    const [Pic4,setPic4]=useState(null)
  const [head5,sethead5]=useState('')
   const [Pic5,setPic5]=useState(null)
   const [des5,setdes5]=useState('')
  const fileInputRef = useRef(null);
  const [showOnMainScreen, setShowOnMainScreen] = useState(false);
const [mainPosition, setMainPosition] = useState('');


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const onFileChange = (file) => {
    setFile(file);
  };

 const handleUpload = async () => {
  if (!file || !name || !description || !mainImg) {
    toast.error('Please fill all required fields and select files');
    return;
  }

  try {
    // Upload APK
    const apkRef = ref(storage, `apk/${file.name}`);
    await uploadBytes(apkRef, file);
    const apkURL = await getDownloadURL(apkRef);

    // Helper function to upload images
    const uploadImage = async (img, imgName) => {
      if (!img) return '';
      const imgRef = ref(storage, `apk/images/${Date.now()}_${imgName}`);
      await uploadBytes(imgRef, img);
      return await getDownloadURL(imgRef);
    };

    // Upload main image and logo
    const mainImgURL = await uploadImage(mainImg, 'mainImg');
    const logoURL = await uploadImage(logo, 'logo');

    // Upload additional images
    const Pic1URL = await uploadImage(Pic1, 'Pic1');
    const Pic2URL = await uploadImage(Pic2, 'Pic2');
    const Pic3URL = await uploadImage(Pic3, 'Pic3');
    const Pic4URL = await uploadImage(Pic4, 'Pic4');
    const Pic5URL = await uploadImage(Pic5, 'Pic5');
  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // Size in MB with 2 decimals

    // Create Firestore document
   await addDoc(collection(db, 'APK'), {
  Name: name,
  Description: description,
  Category: category,
  URL: apkURL,
  rating:rating,
  bonus:bonus,
  created_at: serverTimestamp(),
  MainImage: mainImgURL,
  Logo: logoURL,
  SizeMB: fileSizeInMB,
 Visible: showOnMainScreen,
  MainScreenPosition: showOnMainScreen ? mainPosition : null,
  Sections: [
    { Heading: head1, Image: Pic1URL, Description: des1 },
    { Heading: head2, Image: Pic2URL, Description: des2 },
    { Heading: head3, Image: Pic3URL, Description: des3 },
    { Heading: head4, Image: Pic4URL, Description: des4 },
    { Heading: head5, Image: Pic5URL, Description: des5 },
  ]
});


    toast.success('APK Uploaded Successfully!');
    setName('');
    setDescription('');
    setFile(null);
    setmainImg(null);
    setLogo(null);
    // Also reset headings/images/descriptions if needed
  } catch (error) {
    toast.error('Upload failed. Please try again.');
    console.error('Upload Error:', error);
  }
};


  return (
    <div className="p-6 2xl:ml-[5rem] xl:ml-[2.5rem]">
      <h1 className="text-2xl font-bold">Upload APP</h1>

      <div className="mt-4 lg:w-[70%] sm:w-[95%]">
        <h3 className="text-[18px] font-semibold">File Upload</h3>
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full border-2 border-dashed border-gray-300 rounded-md p-11 text-center cursor-pointer hover:border-blue-500 transition mt-2.5"
        >
          <p className="text-sm text-gray-500">
            Drag and drop file here,<br />
            <span className="text-blue-600 underline">or click to select file</span>
          </p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => onFileChange(e.target.files[0])}
          />
        </div>

        <h3 className="text-[18px] font-semibold mt-4">App Name</h3>
        <Input className="mt-2" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />

        <h3 className="text-[18px] font-semibold mt-4">Description</h3>
        <Textarea
                  name="Description" className="mt-2" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)}  maxLength={95}/>
         <div className="flex flex-col sm:flex-col gap-6 mt-4">
  {/* Main Image */}
  <div className="flex-1">
    <h3 className="text-[18px] font-semibold mb-2">Select Main Image</h3>
    <Input
      accept="image/*"
      type="file"
      className="w-full"
      onChange={(e) => setmainImg(e.target.files[0])}
    />
  </div>

  {/* Logo Image */}
  <div className="flex-1">
    <h3 className="text-[18px] font-semibold mb-2">Select Logo</h3>
    <Input
      accept="image/*"
      type="file"
      className="w-full"
      onChange={(e) => setLogo(e.target.files[0])}
    />
  </div>
</div>

         <h3 className="text-[18px] font-semibold mt-4">Select Category</h3>
                <Select value={category} onValueChange={setCategory}>
  <SelectTrigger className='mt-4 w-[100%] mb-5'>
    <SelectValue placeholder="Category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="COLOUR TRADING">COLOUR TRADING</SelectItem>
    <SelectItem value="YONO GAMES">YONO GAMES</SelectItem>
    <SelectItem value="RUMMY GAMES">RUMMY GAMES</SelectItem>
    <SelectItem value="OTHER GAMES">OTHER GAMES</SelectItem>
  </SelectContent>
</Select>
<div className='flex lg:flex-row sm:flex-col lg:items-center gap-3'>
<div>
    <h3 className="text-[18px] font-semibold">Enter Rating</h3>
          <Input className="mt-2" placeholder="Enter Rating" value={rating} onChange={(e) => setRating(e.target.value)} />
</div>
<div>
  <h3 className="text-[18px] font-semibold">Enter Bonus</h3>
        <Input className="mt-2" placeholder="Enter Bonus" value={bonus} onChange={(e) => setBonus(e.target.value)} />

</div>

  
</div>
 
<div className="mt-4">
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={showOnMainScreen}
      onChange={(e) => setShowOnMainScreen(e.target.checked)}
    />
    <span className="text-md">Show app on main screen</span>
  </label>

  {showOnMainScreen && (
    <div className="mt-4">
      <h3 className="text-[18px] font-semibold mb-2">Select Position</h3>
      <Select value={mainPosition} onValueChange={setMainPosition}>
        <SelectTrigger className="w-[100%]">
          <SelectValue placeholder="Choose position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )}
</div>

           {[1, 2, 3, 4, 5].map((num) => (
  <div key={num} className="bg-gray-50 p-6 rounded-lg  shadow-md mb-6">
    <h3 className="text-xl font-semibold mb-2">Heading {num}</h3>
    <Input
      className="w-full mb-4"
      placeholder={`Enter Heading ${num}`}
      value={eval(`head${num}`)}
      onChange={(e) => eval(`sethead${num}`)(e.target.value)}
    />

    <h3 className="text-xl font-semibold mb-2">Picture {num}</h3>
    <Input
      type="file"
      accept="image/*"
      className="w-full mb-4"
      onChange={(e) => eval(`setPic${num}`)(e.target.files[0])}
    />

    <h3 className="text-xl font-semibold mb-2">Description {num}</h3>
    <Textarea
      className="w-full"
      placeholder={`Enter Description ${num}`}
      value={eval(`des${num}`)}
      onChange={(e) => eval(`setdes${num}`)(e.target.value)}
    />
  </div>
))}

        <Button
          variant="outline"
          className=" w-[150px] bg-[#3D5DA6] text-white hover:bg-blue-900 cursor-pointer hover:text-white mt-4"
          onClick={handleUpload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};

export default AddApk;
