"use client";

import { useState } from "react";
import { useExpenses, useCreateExpense } from "@/hooks/useExpenses";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseCreateSchema, type ExpenseCreateInput } from "@/lib/validations";
import { toast } from "sonner";
import { Receipt, Plus, Search } from "lucide-react";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses();
  const createExpense = useCreateExpense();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseCreateSchema),
    defaultValues: {
      amount: 0,
      category: "FOOD",
      description: "",
      expenseDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: ExpenseCreateInput) => {
    try {
      await createExpense.mutateAsync(data);
      toast.success("Expense added");
      setIsModalOpen(false);
      reset();
    } catch {
      toast.error("Failed to add expense");
    }
  };

  const filteredExpenses = expenses?.filter((e: any) => 
    e.description?.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalExpenses = filteredExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-md text-ink">Daily Expenses</h1>
          <p className="text-body text-ink-muted-80 mt-1">Track your daily spending to reach your goals faster.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <p className="text-caption text-ink-muted-80 mb-2">Total Listed Expenses</p>
          <p className="text-display-md text-ink">{formatCurrency(totalExpenses)}</p>
        </Card>
        
        <div className="md:col-span-2">
          <Card className="overflow-hidden p-0">
            <div className="p-4 border-b border-hairline bg-canvas/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted-48" />
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-canvas border border-hairline rounded-[11px] pl-10 pr-4 py-2 text-body focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            
            <div className="divide-y divide-hairline max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  <CardSkeleton className="h-16" />
                  <CardSkeleton className="h-16" />
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="p-12 text-center text-ink-muted-48 flex flex-col items-center">
                  <Receipt className="h-12 w-12 mb-4 opacity-20" />
                  <p>No expenses found.</p>
                </div>
              ) : (
                filteredExpenses.map((expense: any) => (
                  <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-black/5 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-body-strong text-ink truncate">{expense.description || "Uncategorized Expense"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-fine-print px-2 py-0.5 rounded-full bg-divider-soft text-ink-muted-80">
                          {expense.category}
                        </span>
                        <span className="text-caption text-ink-muted-48">
                          {new Date(expense.expenseDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body-strong text-danger">-{formatCurrency(expense.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Expense">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" step="0.01" {...register("amount", { valueAsNumber: true })} error={errors.amount?.message} required />
            <Input label="Date" type="date" {...register("expenseDate")} error={errors.expenseDate?.message} required />
          </div>
          <Select label="Category" {...register("category")} options={[
            { value: "FOOD", label: "Food & Dining" },
            { value: "TRANSPORT", label: "Transportation" },
            { value: "UTILITIES", label: "Utilities" },
            { value: "ENTERTAINMENT", label: "Entertainment" },
            { value: "SHOPPING", label: "Shopping" },
            { value: "HEALTH", label: "Health" },
            { value: "OTHER", label: "Other" },
          ]} />
          <Input label="Description (Optional)" {...register("description")} error={errors.description?.message} placeholder="Lunch at cafe" />
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
