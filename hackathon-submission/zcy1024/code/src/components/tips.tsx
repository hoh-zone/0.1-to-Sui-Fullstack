'use client'

export default function Tips({tips}: { tips: string }) {
    return (
        <div className={"absolute top-0 left-0 w-full h-full bg-black transition-opacity " + (tips ? "opacity-60 z-50" : "opacity-0 -z-50")}>
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold tracking-widest">
                <div className="animate-bounce">
                    {
                        Array.from(tips).map((char, index) => {
                            const rand = Math.floor(Math.random() * 1000) % 3;
                            return (<span key={index} className={rand === 0 ? "text-red-600" : (rand === 1 ? "text-green-600" : "text-blue-600")}>{char}</span>)
                        })
                    }
                </div>
            </div>
        </div>
    )
}