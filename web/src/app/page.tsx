import { redirect } from "next/navigation";

// Authenticated users land on the dashboard; the proxy redirects the rest to /login.
export default function Home() {
  redirect("/dashboard");
}
