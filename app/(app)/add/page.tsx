"use client";

import { ItemForm } from "@/components/items/ItemForm";
import { useCreateItem } from "@/hooks/useItems";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function AddItemPage() {
  const router = useRouter();
  const createItem = useCreateItem();

  const handleSubmit = async (data: any) => {
    try {
      await createItem.mutateAsync(data);
      toast.success("Item added successfully! 🎉");
      
      // Redirect based on the selected list
      if (data.listType === "BUY_LIST") {
        router.push("/buylist");
      } else {
        router.push("/wishlist");
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-display-md text-ink">Add a new dream</h1>
        <p className="mt-2 text-body text-ink-muted-80">
          Paste a link to automatically fetch details, or enter them manually.
        </p>
      </div>

      <ItemForm onSubmit={handleSubmit} isSubmitting={createItem.isPending} />
    </div>
  );
}
