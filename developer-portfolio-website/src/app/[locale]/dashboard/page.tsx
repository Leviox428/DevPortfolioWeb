
import AdminDashboard from "@/src/components/adminDashboard/AdminDashboard";
import EntryPoint from "@/src/components/EntryPoint";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { generateToken } from "@/src/models/serverModels/pageModel";

export default async function AdminDashboardPage() {
  const token = await generateToken();

  return  (
    <EntryPoint token={token}>
        <AuthProvider isAdmin={true}>
          <AdminDashboard></AdminDashboard>
        </AuthProvider>
    </EntryPoint>
  );
}
