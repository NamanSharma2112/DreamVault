"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      toast.success("Welcome to DreamVault! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-surface-tile-2 p-12 lg:flex">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary-on-dark" />
          <span className="text-tagline text-on-dark">DreamVault</span>
        </div>
        <div>
          <h2 className="text-display-lg text-on-dark">
            Start building your
            <br />
            vault of dreams.
          </h2>
          <p className="mt-4 text-body text-body-muted">
            Every great achievement started with a single wish. 
            Create your account and start planning today.
          </p>
        </div>
        <p className="text-fine-print text-ink-muted-48">
          © {new Date().getFullYear()} DreamVault
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:hidden">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-tagline text-ink">DreamVault</span>
            </div>
            <h1 className="text-display-md text-ink">Create Account</h1>
            <p className="mt-1 text-caption text-ink-muted-48">
              Join DreamVault and start saving for your dreams
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              required
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
              minLength={6}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="md"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-caption text-ink-muted-48">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
