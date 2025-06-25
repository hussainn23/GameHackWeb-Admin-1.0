import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Features/Dashboard'
import ListApk from './Features/ListApk';
import ApkDetails from './Features/ApkDetails';
import AddApk from './Features/AddApk';
import { Toaster } from 'sonner';
import DeleteApk from './Features/DeleteApk';
import EditApk from './Features/EditApk';
import  UpdateApk  from './Features/UpdateApk';
import Telegram from './Features/Telegram';
import Addblogs from './Features/Addblogs';
import AllBlogs from './Features/AllBlogs';
import BlogDetails from './Features/BlogDetails';
import UpdateBlog from './Features/UpdateBlog';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Toaster richColors position="top-center" />
     <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/allApks" element={<ListApk />}/>
         <Route path="/apkdetails/:id" element={<ApkDetails />}/>
          <Route path="/blogdetails/:id" element={<BlogDetails />}/>
         <Route path="/updateapk/:id" element={<UpdateApk />}/>
         <Route  path='/addApk' element={<AddApk />}/>
            <Route path="/updateblog/:id" element={<UpdateBlog />}/>
          <Route  path='/allblogs' element={<AllBlogs />}/>
           <Route  path='/addblogs' element={<Addblogs/>}/>
         <Route path='/deleteApks' element={<DeleteApk />}/>
         <Route path='/editApks' element={<EditApk />}/>
         <Route path='/telegram' element={<Telegram />}/>
      </Routes>

    </>
  )
}

export default App
