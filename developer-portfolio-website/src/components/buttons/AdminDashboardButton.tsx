import { ShieldUser } from "lucide-react";
import Link from "next/link";

export function AdminDashboardButton() {
    return (
        <div className="fixed top-4 left-18">
            <Link href="/dashboard" locale={"false"}>
                <button 
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:bg-gray-100 transition cursor-pointer"
                >
                    <ShieldUser className="w-6 h-6 text-gray-800"></ShieldUser>
                </button>
            </Link>

        </div>
    );
}