"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemCreateSchema, type ItemCreateInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Item } from "@/hooks/useItems";
import { useGoals } from "@/hooks/useGoals";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: ItemCreateInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function ItemForm({ initialData, onSubmit, isSubmitting }: ItemFormProps) {
  const [scrapeUrl, setScrapeUrl] = useState(initialData?.sourceUrl || "");
  const [isScraping, setIsScraping] = useState(false);
  const { data: goals } = useGoals();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itemCreateSchema),
    defaultValues: {
      title: initialData?.title || "",
      price: initialData?.price || 0,
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
      sourceUrl: initialData?.sourceUrl || "",
      category: (initialData?.category as any) || "WISHLIST",
      listType: (initialData?.listType as any) || "WISHLIST",
      priority: (initialData?.priority as any) || "MEDIUM",
      status: (initialData?.status as any) || "PENDING",
      targetDate: initialData?.targetDate
        ? new Date(initialData.targetDate).toISOString().split("T")[0]
        : "",
      goalId: initialData?.goalId || "",
      notes: initialData?.notes || "",
    },
  });

  const handleScrape = async () => {
    if (!scrapeUrl) {
      toast.error("Please enter a URL to scrape");
      return;
    }

    setIsScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl }),
      });

      if (!res.ok) throw new Error("Failed to scrape");

      const data = await res.json();
      
      if (data.title) setValue("title", data.title);
      if (data.price) setValue("price", data.price);
      if (data.imageUrl) setValue("imageUrl", data.imageUrl);
      if (data.description) setValue("description", data.description);
      setValue("sourceUrl", scrapeUrl);
      
      if (data.title || data.price) {
        toast.success("Data extracted successfully!");
      } else {
        toast.info("Could not extract all data, please fill in manually");
      }
    } catch {
      toast.error("Failed to extract data from URL");
    } finally {
      setIsScraping(false);
    }
  };

  const goalOptions = [
    { value: "", label: "None (Standalone Item)" },
    ...(goals?.map((g) => ({ value: g.id, label: g.title })) || []),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Auto-fill section */}
      <Card variant="parchment" padding="sm" className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-body-strong text-ink">Auto-fill from URL</h3>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Paste link from Amazon, Airbnb, etc."
              value={scrapeUrl}
              onChange={(e) => setScrapeUrl(e.target.value)}
              icon={<Link2 className="h-4 w-4" />}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleScrape}
            disabled={isScraping || !scrapeUrl}
          >
            {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
          </Button>
        </div>
      </Card>

      {/* Main Form */}
      <div className="space-y-6">
        <Input
          label="Item Name"
          {...register("title")}
          error={errors.title?.message}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price"
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            required
          />
          <Input
            label="Image URL"
            {...register("imageUrl")}
            error={errors.imageUrl?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Select
            label="List"
            {...register("listType")}
            options={[
              { value: "WISHLIST", label: "Wishlist" },
              { value: "BUY_LIST", label: "Buy List" },
            ]}
          />
          <Select
            label="Priority"
            {...register("priority")}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "DREAM", label: "Dream" },
            ]}
          />
          <Select
            label="Category"
            {...register("category")}
            options={[
              { value: "WISHLIST", label: "General" },
              { value: "ELECTRONICS", label: "Electronics" },
              { value: "FASHION", label: "Fashion" },
              { value: "HOME", label: "Home & Furniture" },
              { value: "VEHICLE", label: "Car / Bike" },
              { value: "TRIP", label: "Trip / Travel" },
              { value: "HEALTH", label: "Health & Fitness" },
              { value: "EDUCATION", label: "Education" },
              { value: "BUY_LIST", label: "Real Estate" },
              { value: "EXPERIENCE", label: "Experience" },
              { value: "OTHER", label: "Other" },
            ]}
          />
          <Select
            label="Status"
            {...register("status")}
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "SAVING", label: "Saving" },
              { value: "PURCHASED", label: "Purchased" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Link to Goal (Optional)"
            {...register("goalId")}
            options={goalOptions}
          />
          <Input
            label="Target Date (Optional)"
            type="date"
            {...register("targetDate")}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-caption-strong text-ink">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full rounded-[11px] border border-hairline bg-canvas px-4 py-2.5 text-body text-ink outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder="Why do you want this? Add any personal notes..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : null}
          {initialData ? "Save Changes" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
