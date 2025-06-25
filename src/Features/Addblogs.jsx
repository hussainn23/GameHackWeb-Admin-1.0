
import React, { useRef, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { db, storage } from '../../config/firebase';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Textarea } from '@/components/ui/textarea';
const Addblogs = () => {
     const [name, setName] = useState('');
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
     const handleUpload = async () => {
        try{
               // Helper function to upload images
                const uploadImage = async (img, imgName) => {
                  if (!img) return '';
                  const imgRef = ref(storage, `blogs/${Date.now()}_${imgName}`);
                  await uploadBytes(imgRef, img);
                  return await getDownloadURL(imgRef);
                };
    const Pic1URL = await uploadImage(Pic1, 'Pic1');
    const Pic2URL = await uploadImage(Pic2, 'Pic2');
    const Pic3URL = await uploadImage(Pic3, 'Pic3');
    const Pic4URL = await uploadImage(Pic4, 'Pic4');
    const Pic5URL = await uploadImage(Pic5, 'Pic5');
      await addDoc(collection(db, 'Blogs'), {
      Name: name,
     Date: serverTimestamp(),
      Sections: [
    { Heading: head1, Image: Pic1URL, Description: des1 },
    { Heading: head2, Image: Pic2URL, Description: des2 },
    { Heading: head3, Image: Pic3URL, Description: des3 },
    { Heading: head4, Image: Pic4URL, Description: des4 },
    { Heading: head5, Image: Pic5URL, Description: des5 },
  ]})
      toast.success('Blog Uploaded Successfully!');
      setName('')
      sethead1('')
      sethead2('')
      sethead3('')
      sethead4('')
      sethead5('')
      setdes1('')
      setdes2('')
      setdes3('')
      setdes4('')
      setdes5('')
      setPic1(null)
      setPic2(null)
      setPic3(null)
      setPic4(null)
      setPic5(null)
        }
        catch (error) {
            toast.error('Upload failed. Please try again.');
            console.error('Upload Error:', error);
          }
    
     }
  return (
        <div className="p-6 2xl:ml-[5rem] xl:ml-[2.5rem]">
           <div className="mt-4 lg:w-[70%] sm:w-[95%]">
              <h1 className="text-2xl font-bold">Add Blog</h1>
            <h3 className="text-[18px] font-semibold mt-4">Title</h3>
    <Input className="mt-2" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
       {[1, 2, 3, 4, 5].map((num) => (
     <div key={num} className="bg-gray-50 p-6 rounded-lg  shadow-md mt-6">
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
  )
}

export default Addblogs