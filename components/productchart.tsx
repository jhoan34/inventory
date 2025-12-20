"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface CharData {
    week: string
    products: number
}


export default function ProductChart(
    { data }:
        { data: CharData[] }
) {
    console.log(data)
    return (
        <>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="week" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickCount={5} />
                        <Area type="monotone" dataKey="products" stroke="#007bff" fill="#007bff" fillOpacity={0.2} strokeWidth={2} dot={{ fill: "#007bff", r: 4 }} activeDot={{ r: 8, fill: "#007bff" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                padding: "8px",
                                borderRadius: "4px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                            labelStyle={{
                                color: "#666",
                                fontSize: "12px",
                                fontWeight: "500"
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}