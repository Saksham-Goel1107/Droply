"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn } = useSignIn();
  const router = useRouter();
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [cooldownEndTime, setCooldownEndTime] = useState<Date | null>(null);

  // Check if user is in cooldown
  const isInCooldown = cooldownEndTime && new Date() < cooldownEndTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if in cooldown
    if (isInCooldown) {
      const timeLeft = Math.ceil((cooldownEndTime!.getTime() - new Date().getTime()) / 1000 / 60);
      setError(`Too many attempts. Please try again in ${timeLeft} minutes.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!signIn) {
        throw new Error("Sign-in functionality is not available.");
      }

      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setSuccess(true);
      // Reset attempts on success
      setRemainingAttempts(5);
      setCooldownEndTime(null);
    } catch (err: any) {
      console.error("Error initiating password reset:", err);
      
      // Decrement remaining attempts
      const newAttempts = remainingAttempts - 1;
      setRemainingAttempts(newAttempts);

      // If no attempts left, set cooldown
      if (newAttempts <= 0) {
        const cooldownEnd = new Date();
        cooldownEnd.setMinutes(cooldownEnd.getMinutes() + 30); // 30 minute cooldown
        setCooldownEndTime(cooldownEnd);
        setError("Too many attempts. Please try again in 30 minutes.");
      } else {
        setError(
          `${err.errors?.[0]?.message || "Failed to send reset instructions"}. ${newAttempts} attempts remaining.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-default-200 bg-default-50 shadow-xl">
      <CardHeader className="flex flex-col gap-1 items-center pb-2">
        <h1 className="text-2xl font-bold text-default-900">Reset Password</h1>
        <p className="text-default-500 text-center">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </CardHeader>

      <Divider />

      <CardBody className="py-6">
        {error && (
          <div className="bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="bg-success-50 text-success-700 p-4 rounded-lg">
              <p>Password reset instructions have been sent to your email address.</p>
            </div>
            <Button
              variant="flat"
              color="primary"
              className="w-full"
              onClick={() => router.push("/sign-in")}
            >
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-default-900"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="h-4 w-4 text-default-500" />}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Sending Instructions..." : "Reset Password"}
            </Button>
          </form>
        )}
      </CardBody>

      <Divider />

      <CardFooter className="flex justify-center py-4">
        <Link
          href="/sign-in"
          className="text-primary hover:underline font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
