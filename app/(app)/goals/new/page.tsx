"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalCreateSchema, type GoalCreateInput } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateGoal } from "@/hooks/useGoals";

export default function NewGoalPage() {
  const router = useRouter();
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      targetAmount: 0,
      savedAmount: 0,
      goalType: "PURCHASE",
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: GoalCreateInput) => {
    try {
      await createGoal.mutateAsync(data);
      toast.success("Goal created successfully!");
      router.push("/goals");
    } catch {
      toast.error("Failed to create goal");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-display-md text-ink">Create New Goal</h1>
        <p className="mt-2 text-body text-ink-muted-80">
          Set a target amount and deadline for your next big achievement.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Goal Title"
            placeholder="e.g. Trip to Japan 2027"
            {...register("title")}
            error={errors.title?.message}
            required
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Target Amount"
              type="number"
              step="0.01"
              {...register("targetAmount", { valueAsNumber: true })}
              error={errors.targetAmount?.message}
              required
            />
            <Input
              label="Already Saved (Optional)"
              type="number"
              step="0.01"
              {...register("savedAmount", { valueAsNumber: true })}
              error={errors.savedAmount?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Date" type="date" {...register("targetDate")} error={errors.targetDate?.message} required />
            <Select label="Goal Type" {...register("goalType")} options={[
              { value: "PURCHASE", label: "Purchase" },
              { value: "TRIP", label: "Trip" },
              { value: "EXPERIENCE", label: "Experience" },
              { value: "EMERGENCY_FUND", label: "Emergency Fund" },
              { value: "INVESTMENT", label: "Investment" },
              { value: "OTHER", label: "Other" },
            ]} />
          </div>
          
          <Input label="Image URL (Optional)" {...register("imageUrl")} error={errors.imageUrl?.message} placeholder="https://example.com/image.jpg" />

          <div className="space-y-1.5">
            <label className="text-caption-strong text-ink">Description</label>
            <textarea
              {...register("description")}
              className="w-full rounded-[11px] border border-hairline bg-canvas px-4 py-2.5 text-body text-ink outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
              rows={4}
              placeholder="Why is this goal important?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={createGoal.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createGoal.isPending}>
              {createGoal.isPending ? "Creating..." : "Create Goal"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
