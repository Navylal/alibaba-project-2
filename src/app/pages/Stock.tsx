import { useState, useMemo } from "react";
import { Plus, Edit2, AlertCircle, Search, Loader2 } from "lucide-react";
import { useMaterials, useBottles, useFinishedProducts } from "../../hooks/useSupabase";

type Tab = "materials" | "bottles" | "finished";

export default function Stock() {
  const [activeTab, setActiveTab] = useState<Tab>("materials");
  const [searchQuery, setSearchQuery] = useState("");

  const { materials, loading: loadingMaterials } = useMaterials();
  const { bottles, loading: loadingBottles } = useBottles();
  const { products, loading: loadingProducts } = useFinishedProducts();

  const getCurrentData = () => {
    switch (activeTab) {
      case "materials":
        return materials.map((m) => ({
          ...m,
          lowStock: m.stock < m.low_stock_threshold,
          price: m.price_per_ml * 1000,
        }));
      case "bottles":
        return bottles.map((b) => ({
          ...b,
          lowStock: b.stock < b.low_stock_threshold,
          unit: "pcs",
        }));
      case "finished":
        return products.map((p) => ({
          ...p,
          lowStock: p.stock < p.low_stock_threshold,
          price: p.selling_price,
          unit: "pcs",
        }));
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const loading = loadingMaterials || loadingBottles || loadingProducts;

  const normalStock = useMemo(
    () =>
      currentData.filter(
        (i) => !i.lowStock && i.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [currentData, searchQuery]
  );

  const lowStockData = useMemo(
    () =>
      currentData.filter(
        (i) => i.lowStock && i.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [currentData, searchQuery]
  );

  const StockTable = ({ data, title }: { data: typeof currentData; title?: string }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Item Name</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Unit</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {item.lowStock && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <span className="text-sm text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm ${item.lowStock ? "text-red-600" : "text-gray-900"}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{item.unit}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      Rp {item.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      {item.lowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Stock Management</h1>
          <p className="text-muted-foreground">Manage your materials and bottles inventory</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("materials")}
              className={`py-4 border-b-2 transition-all ${
                activeTab === "materials"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab("bottles")}
              className={`py-4 border-b-2 transition-all ${
                activeTab === "bottles"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Bottles & Packaging
            </button>
            <button
              onClick={() => setActiveTab("finished")}
              className={`py-4 border-b-2 transition-all ${
                activeTab === "finished"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Parfum Jadi
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {lowStockData.length > 0 && <StockTable data={lowStockData} title="⚠️ Low Stock Items" />}
          <StockTable data={normalStock} title="Available Stock" />
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-muted-foreground mb-2">Total Items</h3>
          <p className="text-2xl text-gray-900">{currentData.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-muted-foreground mb-2">Low Stock Items</h3>
          <p className="text-2xl text-red-600">{currentData.filter((i) => i.lowStock).length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm text-muted-foreground mb-2">Total Value</h3>
          <p className="text-2xl text-gray-900">
            Rp {currentData.reduce((sum, i) => sum + i.stock * i.price, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
