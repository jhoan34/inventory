
interface CharData {
    week: string
    products : number
}


export default function ProductChart(
    { data }: 
    { data: CharData[] }
){
    console.log(data)
    return (
        <>
            <div>

            </div>
        </>
    )
}