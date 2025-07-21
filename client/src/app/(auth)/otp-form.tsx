import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import useAuthStore from "@/stores/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface IProps {
  recipient: string;
}

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time code must be 6 characters.",
  }),
});

export default function OTPForm({ recipient }: IProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });
  const { setUser } = useAuthStore();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch(`${SERVER_URL}/auth/validateAccessCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: recipient,
          code: values.code,
        }),
        credentials: "include",
      });
      if (!response.ok) {
        const { error } = await response.json();
        form.setError(error.type, { message: error.message });
      }

      const data = await response.json();
      setUser({
        phoneNumber: data.user.phoneNumber,
        name: data.user.name,
        role: data.user.role,
        email: data.user.email,
      });

      if (data.user.role === "instructor") {
        router.push("/students");
      } else {
        router.push("/lessons");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle>Enter Verification Code</CardTitle>
        <CardDescription>
          We have sent a one-time code to{" "}
          <span className="font-bold">{recipient}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                    // onComplete={(code) => handleSubmit(code)}
                  >
                    <InputOTPGroup className="space-x-4 *:rounded-lg! *:border!">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                  {/* <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription> */}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? (
                <Spinner size="small" className="text-background" />
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
