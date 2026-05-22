import { useState } from "react";
import { Plus, Minus, Trash2, Search, Gift, CreditCard, ShoppingCart, Loader2 } from "lucide-react";
import { useFinishedProducts, useCustomers, useTransactions } from "../../hooks/useSupabase";

type CartItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function Kasir() {
  const { products, loading: loadingProducts } = useFinishedProducts();
  const { searchCustomerByPhone, updateCustomer } = useCustomers();
  const { createTransaction } = useTransactions();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchPhone, setSearchPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  const addToCart = (product: any) => {
    const existing = cart.find((item) => item.product_id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([
        ...cart,
        {
          id: Date.now().toString(),
          product_id: product.id,
          name: product.name,
          price: product.selling_price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map((item) => (item.product_id === productId ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const handleSearchCustomer = async () => {
    const customer = await searchCustomerByPhone(searchPhone);
    if (customer) {
      setSelectedCustomer(customer);
      if (customer.has_reward) {
        setDiscount(10);
      }
    } else {
      alert("Customer not found");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setProcessing(true);
    try {
      const transactionData = {
        subtotal,
        discount_percentage: discount,
        discount_amount: discountAmount,
        total,
        payment_method: "cash",
      };

      const result = await createTransaction(
        transactionData,
        cart.map((item) => ({ ...item, name: item.name })),
        selectedCustomer?.id
      );

      if (result) {
        // If customer used reward, reset it
        if (selectedCustomer?.has_reward && discount > 0) {
          await updateCustomer(selectedCustomer.id, { has_reward: false });
        }

        alert(`Transaction completed!\nTotal: Rp ${total.toLocaleString()}`);
        setCart([]);
        setSelectedCustomer(null);
        setSearchPhone("");
        setDiscount(0);
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Kasir</h1>
        <p className="text-muted-foreground">Process customer transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg text-gray-900 mb-4">Products</h2>
            {products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No products available</p>
                <p className="text-sm">Add products in Calculator first</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-purple-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <p className="text-sm text-gray-900 mb-1">{product.name}</p>
                    <p className="text-lg text-primary">Rp {product.selling_price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Stock: {product.stock}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg text-gray-900 mb-4">Customer</h2>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Search by phone number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleSearchCustomer}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg transition-all"
              >
                Search
              </button>
            </div>

            {selectedCustomer && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-900">{selectedCustomer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
                  </div>
                  {selectedCustomer.has_reward && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                      <Gift className="w-3 h-3" />
                      Reward Available
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(selectedCustomer.loyalty_progress / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-700">{selectedCustomer.loyalty_progress}/10</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {10 - selectedCustomer.loyalty_progress} more transactions to next reward
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg text-gray-900 mb-4">Cart</h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-900 flex-1">{item.name}</p>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-900">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 border-t border-gray-200 pt-4">
              {selectedCustomer?.has_reward && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-700" />
                    <span className="text-sm text-yellow-700">Reward Discount</span>
                  </div>
                  <span className="text-sm text-yellow-700">-10%</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm text-gray-900">Rp {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount ({discount}%)</span>
                  <span className="text-sm text-red-600">-Rp {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-lg text-gray-900">Total</span>
                <span className="text-2xl text-primary">Rp {total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || processing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
