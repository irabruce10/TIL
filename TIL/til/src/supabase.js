import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://dernzfdwfifxxnygqezh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlcm56ZmR3ZmlmeHhueWdxZXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI3NTk1ODksImV4cCI6MjAzODMzNTU4OX0.dB1882JQaKBpGyPkxzwbEZ0EDFjpCk7ax6eUu0dFrcY";
const supabase = createClient(supabaseUrl, supabaseKey);


export default supabase