import Sidebar from "@/components/sidevar"
import { getCurrentUser } from "@/lib/auth"
import { AccountSettings } from "@stackframe/stack"

export default async function Settings() {
    const user = await getCurrentUser()
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/settings" />
            <main className="ml-64 p-8">
                <div className="m-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                            <p className="text-gray-500 text-sm">Manage your account settings.</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-4xl ">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <AccountSettings fullPage />
                    </div>
                </div>
            </main>
        </div>
    )
}