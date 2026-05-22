import { Calendar, TestTube, Loader2 } from "lucide-react";
import { useTesters } from "../../hooks/useSupabase";

export default function Tester() {
  const { testers, loading } = useTesters();

  const totalWaste = testers.reduce((sum, item) => sum + item.total_cost, 0);
  const avgCost = testers.length > 0 ? Math.round(totalWaste / testers.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Tester Tracking</h1>
        <p className="text-muted-foreground">Track materials used for testing and samples</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Total Testers</h3>
          </div>
          <p className="text-2xl text-gray-900">{testers.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Total Waste Cost</h3>
          </div>
          <p className="text-2xl text-gray-900">Rp {totalWaste.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Avg Cost per Tester</h3>
          </div>
          <p className="text-2xl text-gray-900">Rp {avgCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Tester History</h2>
          <p className="text-sm text-muted-foreground">All testing and sampling activities</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : testers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tester records found</p>
              <p className="text-sm">Create testers in the Calculator page</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Materials Used</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Total Cost</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {testers.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(item.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {item.tester_materials?.map((mat: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700">
                              • {mat.material_name} ({mat.ml_amount}ml)
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-red-600">Rp {item.total_cost.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">{item.notes || "-"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TestTube className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-2">About Tester Tracking</h3>
            <p className="text-sm text-gray-700 mb-3">
              This section helps you track materials used for customer testing, samples, and experimentation.
              While these don't generate direct revenue, monitoring waste costs helps optimize your testing
              process.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Total Records: </span>
                <span className="text-gray-900">{testers.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Waste: </span>
                <span className="text-gray-900">Rp {totalWaste.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
