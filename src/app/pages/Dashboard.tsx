import { DollarSign, TrendingUp, ShoppingBag, AlertTriangle, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboardStats, useMaterials, useBottles, useTransactions } from "../../hooks/useSupabase";

export default function Dashboard() {
  const { stats, loading: loadingStats } = useDashboardStats();
  const { materials } = useMaterials();
  const { bottles } = useBottles();
  const { transactions } = useTransactions();

  const lowStockMaterials = materials.filter((m) => m.stock < m.low_stock_threshold);
  const lowStockBottles = bottles.filter((b) => b.stock < b.low_stock_threshold);
  const lowStockCount = lowStockMaterials.length + lowStockBottles.length;

  const recentTransactions = transactions.slice(0, 5);

  const salesData = [
    { date: "Mon", sales: 4200000 },
    { date: "Tue", sales: 3800000 },
    { date: "Wed", sales: 5100000 },
    { date: "Thu", sales: 4600000 },
    { date: "Fri", sales: 6200000 },
    { date: "Sat", sales: 8400000 },
    { date: "Sun", sales: 7100000 },
  ];

  if (loadingStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-muted-foreground">Track your perfume shop performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Total Sales Today</h3>
          <p className="text-2xl text-gray-900">Rp {(stats?.totalSalesToday || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">+8.2%</span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Profit Today</h3>
          <p className="text-2xl text-gray-900">Rp {(stats?.profitToday || 0).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
              {recentTransactions.length} today
            </span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Total Transactions</h3>
          <p className="text-2xl text-gray-900">{stats?.totalTransactions || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">
              {lowStockCount > 0 ? "Action needed" : "All good"}
            </span>
          </div>
          <h3 className="text-sm text-muted-foreground mb-1">Low Stock Alert</h3>
          <p className="text-2xl text-gray-900">{lowStockCount} Items</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h2 className="text-lg text-gray-900 mb-1">Sales Overview</h2>
          <p className="text-sm text-muted-foreground">Weekly sales performance</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Low Stock Items</h2>
          <div className="space-y-3">
            {lowStockCount === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>All stock levels are healthy</p>
              </div>
            ) : (
              <>
                {lowStockMaterials.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.stock} {item.unit} remaining
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                      Low Stock
                    </span>
                  </div>
                ))}
                {lowStockBottles.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.stock} pcs remaining</p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                      Low Stock
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No transactions yet</p>
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">
                      {tx.customers?.name || "Walk-in Customer"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-900">Rp {tx.total.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
