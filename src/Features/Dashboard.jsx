import { MdWavingHand } from "react-icons/md";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaPlus } from "react-icons/fa6";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { DeleteIcon, Pen } from "lucide-react";
import CategoryPieChart from "../components/CategoryPieChart";

const DashboardCard = ({ title, description, icon, onClick }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer transition-transform hover:scale-[1.02]"
  >
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="text-blue-500">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-center">{icon}</div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [apkList, setApkList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const collectionRef = collection(db, "APK");
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApkList(data);
    });

    return () => unsubscribe();
  }, []);
 const categoryCount = apkList.reduce((acc, apk) => {
    const category = apk.Category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryCount).map(([key, value]) => ({
    name: key,
    value,
  }));
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <h2 className="text-lg font-medium flex items-center gap-2 text-gray-600">
        Welcome back, Admin <MdWavingHand size={25} color="#1A2536" />
      </h2>

      <div className="pt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="View All Apps"
          description="Tap to view list of all apps"
          icon={<p className="text-lg font-semibold">Total APKs: {apkList.length}</p>}
          onClick={() => navigate("/allApks")}
        />
        <DashboardCard
          title="Add New App"
          description="Tap to add a new app"
          icon={<FaPlus size={55} />}
          onClick={() => navigate("/addApk")}
        />
        <DashboardCard
          title="Edit App"
          description="Tap to edit existing apps"
          icon={<Pen size={55} />}
          onClick={() => navigate("/editApks")}
        />
        <DashboardCard
          title="Delete App"
          description="Tap to delete apps"
          icon={<DeleteIcon size={55} />}
          onClick={() => navigate("/deleteApks")}
        />
      <div className=" bg-white p-6 rounded-lg shadow  col-span-1
    lg:col-start-3      
    lg:row-start-1       
    lg:row-span-2">
        <h3 className=" font-semibold ">APK Categories Overview</h3>
        <CategoryPieChart data={chartData} />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
