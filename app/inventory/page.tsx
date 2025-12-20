import Pagination from "@/components/pagination";
import Sidebar from "@/components/sidevar";
import { deleteProduct } from "@/lib/actions/products";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/prisma/seed";

export default async function Inventory({ searchParams }: { searchParams: Promise<{ q?: string, page: string }> }) {
    const user = await getCurrentUser();
    const q = await searchParams
    const query = (q.q || "").trim()

    const where = {
        userId: user.id,
        ...(q ? { name: { contains: query, mode: "insensitive" as const } } : {})
    }

    const totalProducts = await prisma.product.findMany({
        where
    })
    const pageSize = 10
    const currentPage = Math.max(1, Number(q.page) || 1)
    const [totalCounts, items] = await Promise.all([
        prisma.product.count({ where }),
        prisma.product.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * pageSize,
            take: pageSize
        })

    ])
    const totalPages = Math.max(1, Math.ceil(totalCounts / pageSize))


    return (
        <div className="min-h-screen bg-gray-50 ">
            <Sidebar currentPath="/inventory" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                            <p className="text-gray-500 text-sm">Manage your inventory items here.</p>
                        </div>

                    </div>
                </div>

                <div className="space-y-6">
                    {/*SEARCH*/}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form className="flex gap-2" action="/inventory" method="GET">
                            <input type="text" name="q" placeholder="Search products..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Search</button>

                        </form>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${Number(product.price).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.lowStockAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            <form action={async (formdata: FormData) => {
                                                "use server"
                                                await deleteProduct(formdata)
                                            }}>
                                                <input type="hidden" name="id" value={product.id} />
                                                <button type="submit" className="text-red-600 hover:text-red-800">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/inventory" searchParams={{ q: String(query), pageSize: String(pageSize) }} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}