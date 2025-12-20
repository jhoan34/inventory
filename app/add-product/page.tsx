
import Sidebar from "@/components/sidevar"
import { addProduct } from "@/lib/actions/products"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"

export default async function AddProduct() {
    const user = await getCurrentUser()

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/add-product" />
            <main className="ml-64 p-8">
                <div className="m-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
                            <p className="text-gray-500 text-sm">Add a new product to your inventory.</p>
                        </div>

                    </div>
                </div>
                <div className="max-w-2xl ">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form className="space-y-6" action={addProduct}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                <input type="text" name="name" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                <input type="text" name="sku" id="sku" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                <input step="0.01" min="0" required type="number" name="price" id="price" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input step="1" min="0" required type="number" name="quantity" id="quantity" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="lowStockAt" className="block text-sm font-medium text-gray-700 mb-2">Low Stock At</label>
                                <input step="1" min="0" type="number" name="lowStockAt" id="lowStockAt" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" />
                            </div>
                            <button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Product</button>
                            <Link href="/Inventory" type="button" className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Cancel</Link>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    )
}