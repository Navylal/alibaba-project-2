import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useMaterials() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name');

      if (error) throw error;
      setMaterials(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { materials, loading, error, refetch: fetchMaterials };
}

export function useBottles() {
  const [bottles, setBottles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBottles();
  }, []);

  async function fetchBottles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bottles')
        .select('*')
        .order('type, size');

      if (error) throw error;
      setBottles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { bottles, loading, error, refetch: fetchBottles };
}

export function useFinishedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('finished_products')
        .select('*, bottles(*)')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { products, loading, error, refetch: fetchProducts };
}

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function searchCustomerByPhone(phone: string) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      return null;
    }
  }

  async function updateCustomer(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchCustomers();
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }

  return { customers, loading, error, refetch: fetchCustomers, searchCustomerByPhone, updateCustomer };
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*, customers(*), transaction_items(*)')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTransaction(transactionData: any, items: any[], customerId?: string) {
    try {
      // Generate transaction number
      const transactionNumber = `TRX-${Date.now()}`;

      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          transaction_number: transactionNumber,
          customer_id: customerId || null,
          subtotal: transactionData.subtotal,
          discount_percentage: transactionData.discount_percentage || 0,
          discount_amount: transactionData.discount_amount || 0,
          total: transactionData.total,
          payment_method: transactionData.payment_method || null,
          status: 'completed',
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create transaction items
      const itemsToInsert = items.map((item) => ({
        transaction_id: transaction.id,
        product_id: item.product_id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // Update customer loyalty if applicable
      if (customerId) {
        const { data: customer } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customer) {
          const newTransactionCount = customer.total_transactions + 1;
          const newLoyaltyProgress = (newTransactionCount % 10);
          const hasReward = newLoyaltyProgress === 0 && newTransactionCount > 0;

          await supabase
            .from('customers')
            .update({
              total_transactions: newTransactionCount,
              total_spent: customer.total_spent + transactionData.total,
              loyalty_progress: newLoyaltyProgress,
              has_reward: hasReward,
              last_visit: new Date().toISOString(),
            })
            .eq('id', customerId);
        }
      }

      // Update product stock
      for (const item of items) {
        const { data: product } = await supabase
          .from('finished_products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (product) {
          await supabase
            .from('finished_products')
            .update({ stock: product.stock - item.quantity })
            .eq('id', item.product_id);
        }
      }

      await fetchTransactions();
      return transaction;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }

  return { transactions, loading, error, refetch: fetchTransactions, createTransaction };
}

export function useTesters() {
  const [testers, setTesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTesters();
  }, []);

  async function fetchTesters() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testers')
        .select('*, tester_materials(*)')
        .order('date', { ascending: false });

      if (error) throw error;
      setTesters(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTester(testerData: any, materials: any[]) {
    try {
      const { data: tester, error: testerError } = await supabase
        .from('testers')
        .insert({
          date: new Date().toISOString().split('T')[0],
          total_cost: testerData.total_cost,
          notes: testerData.notes || null,
        })
        .select()
        .single();

      if (testerError) throw testerError;

      const materialsToInsert = materials.map((mat) => ({
        tester_id: tester.id,
        material_id: mat.material_id,
        material_name: mat.name,
        ml_amount: mat.ml,
        cost: mat.cost,
      }));

      const { error: materialsError } = await supabase
        .from('tester_materials')
        .insert(materialsToInsert);

      if (materialsError) throw materialsError;

      await fetchTesters();
      return tester;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }

  return { testers, loading, error, refetch: fetchTesters, createTester };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);

      // Get today's transactions
      const today = new Date().toISOString().split('T')[0];
      const { data: todayTransactions, error: txError } = await supabase
        .from('transactions')
        .select('total, subtotal')
        .gte('created_at', today);

      if (txError) throw txError;

      const totalSalesToday = todayTransactions?.reduce((sum, tx) => sum + tx.total, 0) || 0;
      const estimatedProfit = totalSalesToday * 0.5;

      // Get total transactions count
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });

      // Get low stock count
      const { data: lowStockMaterials } = await supabase
        .from('materials')
        .select('id, stock, low_stock_threshold')
        .lt('stock', supabase.rpc('low_stock_threshold'));

      const { data: lowStockBottles } = await supabase
        .from('bottles')
        .select('id, stock, low_stock_threshold')
        .lt('stock', supabase.rpc('low_stock_threshold'));

      const lowStockCount = (lowStockMaterials?.length || 0) + (lowStockBottles?.length || 0);

      setStats({
        totalSalesToday,
        profitToday: estimatedProfit,
        totalTransactions: totalTransactions || 0,
        lowStockItems: lowStockCount,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { stats, loading, error, refetch: fetchStats };
}
