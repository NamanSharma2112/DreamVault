"use client";

import { useState } from "react";
import { useCreateItem } from "@/hooks/useItems";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ItemForm } from "@/components/items/ItemForm";
import { toast } from "sonner";
import { Link2, Loader2, Heart, ShoppingBag, Plus, Sparkles } from "lucide-react";
import type { ItemCreateInput } from "@/lib/validations";

interface QuickAddProps {
  defaultListType?: "WISHLIST" | "BUY_LIST";
}

export function QuickAdd({ defaultListType = "WISHLIST" }: QuickAddProps) {
  const [url, setUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrapedData, setScrapedData] = useState<Partial<ItemCreateInput> | null>(null);
  const [activeList, setActiveList] = useState<"WISHLIST" | "BUY_LIST">(defaultListType);
  const createItem = useCreateItem();

  const handleQuickScrape = async () => {
    if (!url.trim()) {
      toast.error("Paste a link first");
      return;
    }
    setIsScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setScrapedData({
        title: data.title || "",
        price: data.price || 0,
        imageUrl: data.imageUrl || "",
        description: data.description || "",
        sourceUrl: url,
        listType: activeList,
      });
      setIsModalOpen(true);
      if (data.title || data.price) {
        toast.success("Product data extracted! Review and save.");
      } else {
        toast.info("Couldn't extract all info. Fill in the details manually.");
      }
    } catch {
      // Open form anyway so user can fill manually
      setScrapedData({
        sourceUrl: url,
        listType: activeList,
      });
      setIsModalOpen(true);
      toast.info("Couldn't scrape this link. Fill in the details manually.");
    } finally {
      setIsScraping(false);
    }
  };

  const handleCreate = async (data: ItemCreateInput) => {
    try {
      await createItem.mutateAsync({ ...data, listType: activeList });
      toast.success(`Added to ${activeList === "WISHLIST" ? "Wishlist" : "Buy List"}!`);
      setIsModalOpen(false);
      setUrl("");
      setScrapedData(null);
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleAddManual = () => {
    setScrapedData({ listType: activeList });
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-body-strong text-ink">Quick Add</h3>
          </div>
          <p className="text-caption text-ink-muted-80 mb-5">
            Paste a link from Amazon, Myntra, Flipkart, or any site — we'll extract the details automatically.
          </p>

          {/* List type toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveList("WISHLIST")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-caption font-medium transition-all duration-200 ${
                activeList === "WISHLIST"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-canvas-parchment text-ink-muted-80 hover:bg-divider-soft"
              }`}
            >
              <Heart className="h-3.5 w-3.5" /> Wishlist
            </button>
            <button
              onClick={() => setActiveList("BUY_LIST")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-caption font-medium transition-all duration-200 ${
                activeList === "BUY_LIST"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-canvas-parchment text-ink-muted-80 hover:bg-divider-soft"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Buy List
            </button>
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Paste product link (Amazon, Myntra, etc.)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                icon={<Link2 className="h-4 w-4" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQuickScrape();
                  }
                }}
              />
            </div>
            <Button onClick={handleQuickScrape} disabled={isScraping || !url.trim()}>
              {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
            </Button>
          </div>

          {/* Or add manually */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-hairline" />
            <span className="text-fine-print text-ink-muted-48">or</span>
            <div className="h-px flex-1 bg-hairline" />
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={handleAddManual}>
              <Plus className="h-4 w-4 mr-2" /> Add Manually
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setScrapedData(null);
        }}
        title={`Add to ${activeList === "WISHLIST" ? "Wishlist" : "Buy List"}`}
        className="max-w-2xl"
      >
        <ItemForm
          initialData={scrapedData as any}
          onSubmit={handleCreate}
          isSubmitting={createItem.isPending}
        />
      </Modal>
    </>
  );
}
