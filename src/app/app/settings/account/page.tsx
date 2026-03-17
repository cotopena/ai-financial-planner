import { RoutePage } from "@/components/workspace/route-page";

export default function AccountPage() {
  return (
    <RoutePage
      eyebrow="Account"
      title="Profile and sign-in settings"
      description="Account route scaffold for name, email, password, and workspace defaults."
      sections={[
        {
          title: "Profile settings",
          description: "This page will eventually mirror authenticated Clerk identity plus local defaults.",
          items: [
            "Full name and email",
            "Password / auth method",
            "Default business landing behavior",
          ],
        },
        {
          title: "Ownership model",
          description: "v1 supports one user with multiple businesses and multiple scenarios.",
        },
      ]}
    />
  );
}
