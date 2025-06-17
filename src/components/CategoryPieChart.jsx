import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A020F0',
  '#FF69B4',
  '#4B0082',
];

const renderCustomizedLabel = ({ name, value }) => {
  return (
    <text className="text-[10px] fill-gray-700">
      {`${name}: ${value}`}
    </text>
  );
};


const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No data available for chart.</p>;
  }

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="relative w-full h-[300px]">
      {/* Center total display */}
      <div className="absolute b-[5rem]  inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Total</p>
          <p className=" text-xl font-bold text-purple-700">{total}</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={60} // Makes it a donut
            label={renderCustomizedLabel}
            
          >
            {data.map((entry, index) => (
              <Cell
                className='text-[8px]'
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
