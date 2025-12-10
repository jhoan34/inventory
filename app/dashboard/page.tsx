import ProductChart from "@/components/productchart";
import Sidebar from "@/components/sidevar"
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/prisma/seed";
import { TrendingUp } from "lucide-react";
//import { main, prisma } from "@/prisma/seed"

export default async function Dashboard(){

    const user = await getCurrentUser();
    const userId = user.id;

    const [totalProduct, lowStockProducts, recentProducts, totalStockValue] = await Promise.all([
        prisma.product.count({
            where : {
                userId : userId,
            }
        }),
        prisma.product.count({
            where : {
                userId : userId,
                lowStockAt : {
                    not : null,
                },
                quantity: {
                    lte : 5
                }
            }
        }),
        prisma.product.findMany({
            where : {
                userId : userId,
            },
            orderBy : {
                createdAt : "desc",
            },
            take: 5
        }),
        prisma.product.findMany({
            where : {
                userId : userId,
            },
            orderBy : {
                createdAt : "desc",
            },
            take: 5
        })
        
    ])


    const allProduct = await prisma.product.findMany({
        where: {
            userId : userId
        }
    })
    const totalValue = totalStockValue.reduce((acc, product) => acc + Number(product.price) * Number(product.quantity), 0);
    

    const now = new Date()
    const weeklyProductsData = []

    for (let i = 11; i >= 0; i--){
        const weekstart = new Date(now)
        weekstart.setDate(weekstart.getDate() - i * 7)
        weekstart.setHours(0,0,0,0)
    
        const weekEnd = new Date(weekstart)
        weekstart.setDate(weekEnd.getDate() + 6)
        weekstart.setHours(23,59,59,999)

        const weekLabel = `${String(weekstart.getMonth() + 1).padStart(2, "0")}/${String(weekstart.getDate() + 1).padStart(2, "0")}`
        const weekProducts =  allProduct.filter((pro) => {
            const productDate = new Date(pro.createdAt)
            return productDate >= weekstart && productDate <= weekEnd
        })

        weeklyProductsData.push({
            week: weekLabel,
            products : weekProducts.length
        })
    }




    return(
        <>
            <div className="min-h-screen bg-gray-50">
                <Sidebar currentPath="/dashboard"/>
                <main className="ml-64 p-8">
                    {/*Header*/}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                                <p className="text-gray-500 text-sm">Welcome back! Here is an overview of your inventory.</p>
                            </div>
                        </div>
                    </div>


                    {/**Key Metrics*/}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Key Metrics</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {totalProduct}
                                    </div>
                                    <div className="text-sm text-gray-500">Total Products</div>
                                    <div className="flex items-center justify-center mt-1">
                                        <span className="text-xs text-green-600">+{totalProduct}</span>
                                        <TrendingUp className="w-3 h-3 text-green-600 ml-1"/>
                                    </div>

                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {Number(totalValue).toFixed(0)}
                                    </div>
                                    <div className="text-sm text-gray-500">Total Value</div>
                                    <div className="flex items-center justify-center mt-1">
                                        <span className="text-xs text-green-600">+{Number(totalValue).toFixed(0)}</span>
                                        <TrendingUp className="w-3 h-3 text-green-600 ml-1"/>
                                    </div>

                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {lowStockProducts}
                                    </div>
                                    <div className="text-sm text-gray-500">Low Stack</div>
                                    <div className="flex items-center justify-center mt-1">
                                        <span className="text-xs text-green-600">+{lowStockProducts}</span>
                                        <TrendingUp className="w-3 h-3 text-green-600 ml-1"/>
                                    </div>

                                </div>
                            </div>
                            
                        </div>
                        {/*chart*/}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2>New products per week</h2>
                            </div>
                            <div className="h-48">
                                <ProductChart data={weeklyProductsData}/>
                            </div>
                        </div>
                    </div>

                    {/*second metric*/}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Stock Levels</h2>
                            </div>
                            <div className="space-y-3">
                                {
                                    recentProducts.map((product, key) => {
                                        const stockLevel = product.quantity === 0 ? 0: product.quantity <= (product.lowStockAt || 5) ? 1 : 2 
                                        const bgColors = ["bg-red-600", "bg-yellow-600", "bg-green-600"]
                                        const textColors = ["text-red-600", "text-yellow-600", "text-green-600"]
                                        return (
                                            <>
                                                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`} />
                                                        <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                    </div>
                                                    <div className={`text-sm font-medium ${textColors[stockLevel]}`} >
                                                        {product.quantity} Units
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}