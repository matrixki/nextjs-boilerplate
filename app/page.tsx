import AuthGuard from "@/components/AuthGuard";
import DashboardLayout from "@/components/DashboardLayout";

export default function Home() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <h2 className="text-2xl font-bold">
          Welcome to the Slack Bot Dashboard
        </h2>
      </DashboardLayout>
    </AuthGuard>
  );
}
