"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/zod/login-schema";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { PasswordInput } from "../ui/password-input";
import { login } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import { createSession } from "@/api/session.api";

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { setError } = form;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const response = await login(values);

      // ERROR HANDLING
      if (response.statusCode === 401) {
        if (response.message.includes("password")) {
          setError("password", {
            type: "manual",
            message: response.message,
          });
        }

        if (response.message.includes("email")) {
          setError("email", {
            type: "manual",
            message: response.message,
          });
        }
      }

      console.log("response: ", response);

      // SESSION HANDLING
      if (response.token) {
        await createSession(response.token);
        router.push("/central");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <Link
                            href="#"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <PasswordInput id="password" required {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SUBMIT */}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div>
              {/* NO ACCOUNT? */}
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </div>

              {/* BACK TO HOME */}
              <div className="mt-4 text-center text-sm">
                <Link href="/" className="underline">
                  Back to homepage
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
