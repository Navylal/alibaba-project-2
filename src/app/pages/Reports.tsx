import { TrendingUp, DollarSign, ShoppingBag, TestTube, Download } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const salesTrendData = [
  { month: "Oct", revenue: 12500000, cost: 6200000, profit: 6300000 },
  { month: "Nov", revenue: 15200000, cost: 7500000, profit: 7700000 },
  { month: "Dec", revenue: 18800000, cost: 9200000, profit: 9600000 },
  { month: "Jan", revenue: 16500000, cost: 8100000, profit: 8400000 },
  { month: "Feb", revenue: 19200000, cost: 9400000, profit: 9800000 },
  { month: "Mar", revenue: 22100000, cost: 10800000, profit: 11300000 },
  { month: "Apr", revenue: 24500000, cost: 12000000, profit: 12500000 },
];

const materialUsageData = [
  { name: "Vanilla Extract", usage: 2500, cost: 3750000 },
  { name: "Rose Oil", usage: 1800, cost: 4500000 },
  { name: "Lavender Oil", usage: 2200, cost: 3960000 },
  { name: "Musk Base", usage: 1500, cost: 4500000 },
  { name: "Jasmine Oil", usage: 1600, cost: 3520000 },
  { name: "Sandalwood Oil", usage: 1200, cost: 4200000 },
];

const testerVsSalesData = [
  { month: "Oct", sales: 12500000, tester: 185000 },
  { month: "Nov", sales: 15200000, tester: 210000 },
  { month: "Dec", sales: 18800000, tester: 245000 },
  { month: "Jan", sales: 16500000, tester: 198000 },
  { month: "Feb", sales: 19200000, tester: 225000 },
  { month: "Mar", sales: 22100000, tester: 268000 },
  { month: "Apr", sales: 24500000, tester: 295000 },
];

const productDistribution = [
  { name: "10ml Bottles", value: 35 },
  { name: "30ml Bottles", value: 45 },
  { name: "50ml Bottles", value: 15 },
  { name: "100ml Bottles", value: 5 },
];

const COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981"];

export default function Reports() {
  const currentMonth = salesTrendData[salesTrendData.length - 1];

  const handleExportToExcel = () => {
    alert("Exporting to Excel...\nThis feature will download the report data as an Excel file.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all hover:bg-green-700"
        >
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Total Revenue</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            Rp {currentMonth.revenue.toLocaleString()}
          </p>
          <p className="text-xs text-green-600">+10.9% from last month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Total Cost</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">Rp {currentMonth.cost.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {((currentMonth.cost / currentMonth.revenue) * 100).toFixed(1)}% of revenue
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Net Profit</h3>
          </div>
          <p className="text-2xl text-gray-900 mb-1">
            Rp {currentMonth.profit.toLocaleString()}
          </p>
          <p className="text-xs text-blue-600">
            {((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}% margin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Revenue & Profit Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Material Usage Cost</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                />
                <Bar dataKey="cost" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Tester vs Sales Comparison</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testerVsSalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Sales Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="tester"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Tester Cost"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <TestTube className="w-4 h-4 text-orange-600" />
              <p className="text-sm text-orange-900">Tester Waste Analysis</p>
            </div>
            <p className="text-xs text-orange-700">
              Tester costs represent ~1.2% of total sales. Consider implementing a tester fee or
              limiting free samples to optimize costs.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Product Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {productDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-2">Business Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Best Selling Size</p>
                <p className="text-gray-900">30ml bottles (45%)</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Avg. Order Value</p>
                <p className="text-gray-900">Rp 157,000</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Growth Rate</p>
                <p className="text-green-600">+96% (6 months)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
