"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsInput } from "@/lib/validations";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { Wallet, Settings2, ShieldCheck, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsSchema),
  });

  const income = watch("monthlyIncome") || 0;
  const expenses = watch("monthlyExpenses") || 0;
  const savings = watch("monthlySavings") || 0;
  
  // Calculate unallocated
  const unallocated = income - expenses - savings;

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        reset({
          name: data.name || "",
          monthlyIncome: data.monthlyIncome || 0,
          monthlySavings: data.monthlySavings || 0,
          monthlyExpenses: data.monthlyExpenses || 0,
          currency: data.currency || "INR",
        });
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setIsLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: SettingsInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-display-md text-ink">Settings & Financial Plan</h1>
        <p className="mt-2 text-body text-ink-muted-80">
          Configure your profile and set up your monthly financial capacity to get accurate savings plans.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Settings */}
        <Card padding="lg">
          <div className="mb-6 flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-body-strong text-ink">Profile Preferences</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Full Name"
              {...register("name")}
              error={errors.name?.message}
            />
            <Select
              label="Primary Currency"
              {...register("currency")}
              options={[
                { value: "INR", label: "Indian Rupee (₹)" },
                { value: "USD", label: "US Dollar ($)" },
                { value: "EUR", label: "Euro (€)" },
                { value: "GBP", label: "British Pound (£)" },
              ]}
              error={errors.currency?.message}
            />
          </div>
        </Card>

        {/* Financial Planning */}
        <Card padding="lg">
          <div className="mb-6 flex items-center gap-3">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-body-strong text-ink">Monthly Cash Flow</h2>
          </div>
          <p className="mb-6 text-caption text-ink-muted-80">
            Tell us about your monthly income and expenses. This helps DreamVault calculate how long it will take to reach your goals. We never share this data.
          </p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Input
              label="Monthly Net Income"
              type="number"
              step="1"
              {...register("monthlyIncome", { valueAsNumber: true })}
              error={errors.monthlyIncome?.message}
            />
            <Input
              label="Monthly Fixed Expenses"
              type="number"
              step="1"
              {...register("monthlyExpenses", { valueAsNumber: true })}
              error={errors.monthlyExpenses?.message}
            />
            <Input
              label="Monthly Savings Target"
              type="number"
              step="1"
              {...register("monthlySavings", { valueAsNumber: true })}
              error={errors.monthlySavings?.message}
            />
          </div>

          {/* Cash Flow Summary */}
          {income > 0 && (
            <div className="mt-8 rounded-[11px] bg-canvas-parchment p-6">
              <h3 className="text-caption-strong text-ink mb-4">Cash Flow Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-caption">
                  <span className="text-ink-muted-80">Income</span>
                  <span className="text-success">{formatCurrency(income)}</span>
                </div>
                <div className="flex justify-between text-caption">
                  <span className="text-ink-muted-80">Expenses</span>
                  <span className="text-danger">-{formatCurrency(expenses)}</span>
                </div>
                <div className="flex justify-between text-caption border-b border-hairline pb-3">
                  <span className="text-ink-muted-80">Dedicated Savings</span>
                  <span className="text-primary">-{formatCurrency(savings)}</span>
                </div>
                <div className="flex justify-between text-body-strong pt-1">
                  <span className="text-ink">Unallocated "Fun" Money</span>
                  <span className={unallocated >= 0 ? "text-ink" : "text-danger"}>
                    {formatCurrency(unallocated)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-ink-muted-48">
            <ShieldCheck className="h-4 w-4" />
            Your data is stored securely.
          </div>
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
