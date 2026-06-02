"use client";

import { useState } from "react";
import { useItems, useCreateItem, type Item } from "@/hooks/useItems";
import { ItemCard } from "@/components/items/ItemCard";
import { ItemFilters, type FilterState } from "@/components/items/ItemFilters";
import { Modal } from "@/components/ui/Modal";
import { ItemForm } from "@/components/items/ItemForm";
import { useUpdateItem, useDeleteItem } from "@/hooks/useItems";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ItemCreateInput } from "@/lib/validations";

export default function BuyListPage() {
  const { data: items, isLoading } = useItems();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priority: "",
    status: "",
    sortBy: "newest",
  });
  
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const buyListItems = items?.filter((i) => i.listType === "BUY_LIST") || [];
  
  const filteredItems = buyListItems
    .filter((item) => !filters.category || item.category === filters.category)
    .filter((item) => !filters.priority || item.priority === filters.priority)
    .filter((item) => !filters.status || item.status === filters.status)
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "priority": {
          const p = { DREAM: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return (p[a.priority as keyof typeof p] ?? 3) - (p[b.priority as keyof typeof p] ?? 3);
        }
        case "deadline":
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleCreate = async (data: ItemCreateInput) => {
    try {
      await createItem.mutateAsync({ ...data, listType: "BUY_LIST" });
      toast.success("Item added to buy list!");
      setIsAddModalOpen(false);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingItem) return;
    try {
      await updateItem.mutateAsync({ id: editingItem.id, data });
      toast.success("Item updated");
      setEditingItem(null);
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem.mutateAsync(id);
        toast.success("Item deleted");
        setEditingItem(null);
      } catch {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-md text-ink">Buy List</h1>
          <p className="mt-2 text-body text-ink-muted-80">
            Committed purchases you are actively saving for.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add to Buy List
        </Button>
      </div>

      <ItemFilters filters={filters} onFilterChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[18px] border border-hairline bg-canvas-parchment p-8 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-ink-muted-48" />
          <h3 className="text-tagline text-ink">No items found</h3>
          <p className="mt-2 text-body text-ink-muted-80">
            {buyListItems.length === 0
              ? "Your buy list is empty. Move items here when you're ready to commit!"
              : "No items match your current filters."}
          </p>
          {buyListItems.length === 0 && (
            <Button onClick={() => setIsAddModalOpen(true)} className="mt-6" variant="secondary">
              <Plus className="h-4 w-4 mr-2" /> Add your first item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add to Buy List"
        className="max-w-2xl"
      >
        <ItemForm
          onSubmit={handleCreate}
          isSubmitting={createItem.isPending}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Item"
      >
        {editingItem && (
          <div>
            <ItemForm
              initialData={editingItem}
              onSubmit={handleUpdate}
              isSubmitting={updateItem.isPending}
            />
            <div className="mt-6 border-t border-hairline pt-6">
              <button
                onClick={() => handleDelete(editingItem.id)}
                className="text-caption font-medium text-danger hover:underline"
              >
                Delete this item entirely
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
