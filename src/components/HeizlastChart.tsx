import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';

interface HeizlastChartProps {
  data: {
    name: string;
    wert: number | string | undefined | null; // Allow string
  }[];
}

// Helper to safely parse value for chart
// Updated parameter type to match the interface
const parseChartValue = (value: number | string | undefined | null): number => {
    if (typeof value === 'number') {
        // Value is already a number
        return !isNaN(value) ? value : 0; // Handle potential NaN numbers
    }
    if (typeof value === 'string') {
        // Value is a string, try to parse it
        const parsed = parseFloat(value.replace(',', '.'));
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    // Return 0 for undefined, null, or unparseable strings/NaN numbers
    return 0;
};

const HeizlastChart: React.FC<HeizlastChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.name,
    // Now the argument type matches the parameter type
    Wert: parseChartValue(item.wert) // Use 'Wert' as the data key for the bar
  }));

  // Find max value for Y-axis domain, add some padding
  const maxValue = Math.max(...chartData.map(d => d.Wert), 0);
  const yAxisMax = maxValue > 0 ? Math.ceil(maxValue * 1.1) : 10; // Ensure a minimum range if all values are 0 or less

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20, // Increased top margin for LabelList
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis unit=" kWh" domain={[0, yAxisMax]} />
        <Tooltip formatter={(value: number) => [`${value.toFixed(1)} kWh`, 'Wert']} />
        <Legend />
        <Bar dataKey="Wert" fill="#3b82f6"> {/* Use the same blue as results text */}
           <LabelList dataKey="Wert" position="top" formatter={(value: number) => `${value.toFixed(1)}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HeizlastChart;

