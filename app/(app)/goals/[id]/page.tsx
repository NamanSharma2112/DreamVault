"use client";

import { use, useState } from "react";
import { useGoal, useUpdateGoal, useDeleteGoal } from "@/hooks/useGoals";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, daysUntil, getProgressPercentage } from "@/lib/utils";
import { calculateMonthlySaving, projectCompletionDate, getTimeToGoal } from "@/lib/finance";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { Calendar, Target, TrendingUp, AlertTriangle, ArrowLeft, Trash2, Edit2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalUpdateSchema, type GoalUpdateInput } from "@/lib/validations";

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: goal, isLoading } = useGoal(id);
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalUpdateSchema),
    values: goal ? {
      title: goal.title,
      description: goal.description || "",
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      targetDate: goal.targetDate.split("T")[0],
      goalType: (goal.goalType as any),
      status: (goal.status as any),
    } : undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardSkeleton className="h-40" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CardSkeleton className="h-64" />
          <CardSkeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-display-md text-ink">Goal not found</h2>
        <Link href="/goals" className="mt-4 text-primary hover:underline">
          Return to goals
        </Link>
      </div>
    );
  }

  const progress = getProgressPercentage(goal.savedAmount, goal.targetAmount);
  const days = daysUntil(goal.targetDate);
  const monthlySaving = calculateMonthlySaving(goal.targetAmount, goal.savedAmount, goal.targetDate);
  
  const handleUpdate = async (data: GoalUpdateInput) => {
    try {
      await updateGoal.mutateAsync({ id, data });
      toast.success("Goal updated");
      setIsEditModalOpen(false);
    } catch {
      toast.error("Failed to update goal");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure? Items linked to this goal will be unlinked, but not deleted.")) {
      try {
        await deleteGoal.mutateAsync(id);
        toast.success("Goal deleted");
        router.push("/goals");
      } catch {
        toast.error("Failed to delete goal");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Nav */}
      <div className="flex items-center justify-between">
        <Link href="/goals" className="inline-flex items-center gap-2 text-caption text-ink-muted-80 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to goals
        </Link>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="h-4 w-4 mr-1.5" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-danger hover:text-danger hover:bg-danger/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <Card padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Target className="h-40 w-40" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={goal.status === "ACTIVE" ? "primary" : goal.status === "COMPLETED" ? "success" : "warning"}>
              {goal.status}
            </Badge>
            <span className="text-caption text-ink-muted-48">{goal.goalType}</span>
          </div>
          
          <h1 className="text-display-lg text-ink">{goal.title}</h1>
          {goal.description && (
            <p className="mt-2 max-w-2xl text-body text-ink-muted-80">{goal.description}</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-fine-print text-ink-muted-48 uppercase tracking-wider">Target Amount</p>
              <p className="text-tagline text-ink mt-1">{formatCurrency(goal.targetAmount)}</p>
            </div>
            <div>
              <p className="text-fine-print text-ink-muted-48 uppercase tracking-wider">Saved So Far</p>
              <p className="text-tagline text-ink mt-1">{formatCurrency(goal.savedAmount)}</p>
            </div>
            <div>
              <p className="text-fine-print text-ink-muted-48 uppercase tracking-wider">Target Date</p>
              <p className="text-tagline text-ink mt-1">
                {new Date(goal.targetDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-fine-print text-ink-muted-48 uppercase tracking-wider">Time Left</p>
              <p className={`text-tagline mt-1 ${days < 30 && days > 0 ? "text-warning" : days < 0 ? "text-danger" : "text-ink"}`}>
                {days > 0 ? `${days} days` : days === 0 ? "Today" : "Overdue"}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-caption-strong text-ink">Progress</span>
              <span className="text-caption-strong text-ink">{progress}%</span>
            </div>
            <Progress 
              value={goal.savedAmount} 
              max={goal.targetAmount} 
              size="lg"
              color={progress >= 100 ? "success" : progress >= 50 ? "primary" : "warning"}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Financial Plan */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-body-strong text-ink mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Savings Plan
            </h3>
            
            {goal.status === "COMPLETED" ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mb-3" />
                <p className="text-body-strong text-ink">Goal Achieved!</p>
                <p className="text-caption text-ink-muted-80 mt-1">You successfully saved {formatCurrency(goal.targetAmount)}.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-[11px] bg-canvas-parchment p-4">
                  <p className="text-caption text-ink-muted-80 mb-1">Required to hit deadline:</p>
                  <p className="text-display-md text-ink">{formatCurrency(monthlySaving)}<span className="text-body text-ink-muted-48">/mo</span></p>
                </div>
                
                {days < 0 && goal.savedAmount < goal.targetAmount && (
                  <div className="flex items-start gap-2 rounded-[11px] bg-danger/10 p-3 text-danger">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-caption">This goal is past its target date. Consider adjusting the deadline or adding funds.</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Linked Items */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-body-strong text-ink">Linked Items ({goal.items.length})</h3>
              <Link href="/add">
                <Button variant="ghost" size="sm">Add Item</Button>
              </Link>
            </div>
            
            {goal.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-ink-muted-48">
                <Target className="h-12 w-12 mb-3 opacity-20" />
                <p>No items linked to this goal yet.</p>
                <p className="text-caption mt-1">Link items when adding or editing them.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goal.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 rounded-[11px] bg-canvas-parchment/50 p-3 hover:bg-canvas-parchment transition-colors">
                    <div className="h-12 w-12 shrink-0 rounded-[8px] bg-canvas overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-divider-soft text-ink-muted-48">
                          {item.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body font-medium text-ink truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={item.status === "PURCHASED" ? "success" : "default"} className="scale-90 origin-left">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-body-strong text-ink">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Cost Analysis */}
                <div className="mt-6 pt-4 border-t border-hairline flex justify-between items-center">
                  <span className="text-caption text-ink-muted-80">Total Items Cost</span>
                  <span className="text-body-strong text-ink">
                    {formatCurrency(goal.items.reduce((sum, item) => sum + item.price, 0))}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Goal">
        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
          <Input label="Title" {...register("title")} error={errors.title?.message} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Amount" type="number" step="0.01" {...register("targetAmount", { valueAsNumber: true })} error={errors.targetAmount?.message} required />
            <Input label="Saved Amount" type="number" step="0.01" {...register("savedAmount", { valueAsNumber: true })} error={errors.savedAmount?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Date" type="date" {...register("targetDate")} error={errors.targetDate?.message} required />
            <Select label="Status" {...register("status")} options={[
              { value: "ACTIVE", label: "Active" },
              { value: "COMPLETED", label: "Completed" },
              { value: "PAUSED", label: "Paused" },
              { value: "CANCELLED", label: "Cancelled" },
            ]} />
          </div>
          <Input label="Image URL (Optional)" {...register("imageUrl")} error={errors.imageUrl?.message} placeholder="https://example.com/image.jpg" />
          <div className="space-y-1.5">
            <label className="text-caption-strong text-ink">Description</label>
            <textarea {...register("description")} className="w-full rounded-[11px] border border-hairline bg-canvas px-4 py-2.5 text-body text-ink outline-none focus:border-primary" rows={3} />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={updateGoal.isPending}>
              {updateGoal.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
