import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "../_components/auth-form";
import { signUp } from "../_actions";
import { labels } from "@/lib/labels";

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.auth.signUp}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthForm action={signUp} mode="signup" />
        <p className="text-center text-sm text-muted-foreground">
          {labels.auth.hasAccount}{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4"
          >
            {labels.auth.signIn}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
