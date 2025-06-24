import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { db } from '../../config/firebase';
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const Telegram = () => {
  const [URL, setURL] = useState('');
  const [telegramLinks, setTelegramLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const collectionRef = collection(db, 'Telegram');

  // Fetch existing links
  const fetchLinks = async () => {
    const data = await getDocs(collectionRef);
    setTelegramLinks(
      data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    );
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // Add or Update Link
  const handleSave = async () => {
    if (!URL.trim()) {
      toast.error('Please enter a valid Telegram link');
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // Update
        const docRef = doc(db, 'Telegram', editId);
        await updateDoc(docRef, { URL });
        toast.success('Telegram Link updated successfully!');
      } else {
        // Add
        await addDoc(collectionRef, { URL });
        toast.success('Telegram Link added successfully!');
      }
      setURL('');
      setEditId(null);
      fetchLinks();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link) => {
    setURL(link.URL);
    setEditId(link.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'Telegram', id));
      toast.success('Deleted successfully');
      fetchLinks();
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-6 2xl:ml-[5rem] xl:ml-[2.5rem]">
      <h1 className="text-2xl font-bold">Telegram Link</h1>

      <div className="mt-4 lg:w-[70%] sm:w-[95%]">
        <h3 className="text-[18px] font-semibold">
          {editId ? 'Update Telegram Link' : 'Add Telegram Link'}
        </h3>
        <Input
          className="mt-2"
          value={URL}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Enter Telegram Link"
        />
        <Button
          variant="outline"
          disabled={loading}
          className="w-[150px] bg-[#3D5DA6] text-white hover:bg-blue-900 cursor-pointer hover:text-white mt-4"
          onClick={handleSave}
        >
          {loading ? 'Saving...' : editId ? 'Update Link' : 'Add Link'}
        </Button>
      </div>

      {/* List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Saved Telegram Links</h3>
        {telegramLinks.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between bg-gray-100 p-4 rounded mb-2"
          >
            <span className="break-all">{link.URL}</span>
            <div className="flex gap-2">
              <Button
                className="bg-green-600 text-white hover:bg-yellow-600"
                onClick={() => handleEdit(link)}
              >  
                Edit
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(link.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Telegram;
