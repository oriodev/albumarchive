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
import { signupSchema } from "@/zod/signup-schema";
import { FormField, FormItem, FormControl, FormMessage } from "../ui/form";
import { signUp } from "@/api/auth.api";
import { createSession } from "@/api/session.api";
import { useRouter } from "next/navigation";
import { PasswordInput } from "../ui/password-input";

export function SignUpForm() {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { setError } = form;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {
      const response = await signUp(values);

      if (response.statusCode === 409) {
        if (response.message.includes("username")) {
          setError("username", {
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
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Enter your email below to create a new account
            </CardDescription>
          </CardHeader>

          {/* SIGN UP FORM */}
          <CardContent>
            <div className="grid gap-4">
              {/* USERNAME */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="name">Username</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="bloop123"
                          required
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <p className="italic text-sm">min 6 characters</p>
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
                Signup
              </Button>
              <Button variant="outline" className="w-full">
                Signup with Google (one day)
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
