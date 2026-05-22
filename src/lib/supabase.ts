import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export type Database = {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string;
          name: string;
          stock: number;
          price_per_ml: number;
          unit: string;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['materials']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['materials']['Insert']>;
      };
      bottles: {
        Row: {
          id: string;
          name: string;
          size: string;
          type: string;
          stock: number;
          price: number;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bottles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bottles']['Insert']>;
      };
      finished_products: {
        Row: {
          id: string;
          name: string;
          bottle_id: string | null;
          stock: number;
          selling_price: number;
          hpp: number;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['finished_products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['finished_products']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          address: string | null;
          total_transactions: number;
          total_spent: number;
          loyalty_progress: number;
          has_reward: boolean;
          last_visit: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          transaction_number: string;
          customer_id: string | null;
          subtotal: number;
          discount_percentage: number;
          discount_amount: number;
          total: number;
          payment_method: string | null;
          status: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      testers: {
        Row: {
          id: string;
          date: string;
          total_cost: number;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['testers']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['testers']['Insert']>;
      };
    };
  };
};
