import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  console.warn("Supabase env vars mangler — tjek .env.local");
}

export const supabase = createClient(url, key);

export type BookingRow = {
  id: string;
  service: string;
  price: string;
  date: string;
  time: string;
  duration: number;
  name: string;
  phone: string;
  email: string;
  note?: string | null;
  created_at: string;
};
