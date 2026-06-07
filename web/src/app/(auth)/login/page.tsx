import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "../_components/auth-form";
import { signIn } from "../_actions";
import { labels } from "@/lib/labels";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.auth.signIn}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthForm action={signIn} mode="signin" />
        <p className="text-center text-sm text-muted-foreground">
          {labels.auth.noAccount}{" "}
          <Link
            href="/signup"
            className="font-medium underline underline-offset-4"
          >
            {labels.auth.signUp}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
