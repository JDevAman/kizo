import { createClient } from "@supabase/supabase-js";
import config from "../config";

const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey
);

export default supabase;
