"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import OTPForm from "../otp-form";
import Link from "next/link";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const formSchema = z.object({
  // RegExp prodived by Twillo
  phoneNumber: z.string().trim().regex(new RegExp("^\\+[1-9]\\d{1,14}$"), {
    message: "Invalid phone number",
  }),
});

export default function Page() {
  const [isOTPFormOpen, SetIsOTPFormOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/createAccessCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const { error } = await response.json();
        form.setError(error.type, { message: error.message });
      }

      const data = await response.json();
      console.log("API Response:", data);

      SetIsOTPFormOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {!isOTPFormOpen ? (
        <Card className="mx-auto w-96">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              We will send a verification code to your phone number for signing
              in!
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Please enter your phone number with the country code
                            (i.e. +84 for VN)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.formState.errors.root && (
                    <p className="text-destructive text-sm">
                      {form.formState.errors.root.message}
                    </p>
                  )}

                  <div className="grid gap-2"></div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      form.formState.isSubmitting || !form.formState.isDirty
                    }
                  >
                    {form.formState.isSubmitting ? (
                      <Spinner size="small" className="text-background" />
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="mt-4 text-center text-sm">
              You are a student?{" "}
              <Link href="/sign-in/student" className="underline">
                Sign in for student
              </Link>
            </div>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <OTPForm recipient={form.getValues("phoneNumber")} />
      )}
    </>
  );
}
