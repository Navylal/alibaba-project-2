import { Users, Gift, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useCustomers } from "../../hooks/useSupabase";

export default function Customers() {
  const { customers, loading } = useCustomers();

  const totalCustomers = customers.length;
  const activeRewards = customers.filter((c) => c.has_reward).length;
  const avgSpending =
    totalCustomers > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.total_spent, 0) / totalCustomers)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1">Customer Management</h1>
          <p className="text-muted-foreground">Track customer loyalty and purchase history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Total Customers</h3>
          </div>
          <p className="text-2xl text-gray-900">{totalCustomers}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Active Rewards</h3>
          </div>
          <p className="text-2xl text-gray-900">{activeRewards}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm text-muted-foreground">Avg. Spending</h3>
          </div>
          <p className="text-2xl text-gray-900">Rp {avgSpending.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg text-gray-900">Customer List</h2>
          <p className="text-sm text-muted-foreground">All registered customers and their loyalty status</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Transactions</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Total Spent</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Loyalty Progress</th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{customer.name}</p>
                            {customer.has_reward && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                                <Gift className="w-3 h-3" />
                                Reward Available
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{customer.phone}</td>
                      <td className="py-4 px-4 text-sm text-gray-900">{customer.total_transactions}x</td>
                      <td className="py-4 px-4 text-sm text-gray-900">
                        Rp {customer.total_spent.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                              <div
                                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${(customer.loyalty_progress / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{customer.loyalty_progress}/10</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {customer.last_visit
                          ? new Date(customer.last_visit).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg text-gray-900 mb-2">Loyalty Program</h3>
            <p className="text-sm text-gray-700 mb-3">
              Customers earn 1 point for each transaction. After 10 transactions, they receive a 10%
              discount reward that can be used on their next purchase.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Active Rewards: </span>
                <span className="text-gray-900">{activeRewards}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg. Return Rate: </span>
                <span className="text-gray-900">
                  {totalCustomers > 0
                    ? Math.round((customers.filter((c) => c.total_transactions > 1).length / totalCustomers) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
