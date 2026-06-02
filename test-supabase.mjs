import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jrwbduvxnfklsufzmrvw.supabase.co",
  "sb_publishable_UDfHYQTgwOH1nLWURH_tLg_Co79u2FU"
);

async function test() {
  const { data, error } = await supabase.from("goals").select("*, items(id, title)");
  console.log("Goals error:", error);
  
  const { data: itemsData, error: itemsError } = await supabase.from("items").select("*, goal:goals(id, title)");
  console.log("Items error:", itemsError);
}

test();
