import { Suspense } from "react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SetupAccountForm from "./setup-account-form";

export default function Page() {
  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Set Up Your Account</CardTitle>
      </CardHeader>
      <Suspense fallback={<div>Loading...</div>}>
        <SetupAccountForm />
      </Suspense>
    </Card>
  );
}
