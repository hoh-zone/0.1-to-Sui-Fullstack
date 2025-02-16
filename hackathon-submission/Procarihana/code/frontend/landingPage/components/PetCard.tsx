import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface PetCardProps {
  name: string
  desc: string
  imageUrl: string
  city?: string
}

export default function PetCard({ name, desc, imageUrl, city }: PetCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 w-[200px] h-[280px] flex-shrink-0">
      <div className="relative h-40 w-full">
        <Image src={imageUrl || "/placeholder.svg"} alt={`${name}的照片`} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-900">{name}</h3>
            {city && (
              <span className="text-xs px-2 py-1 bg-orange-100 text-[hsl(24.6,95%,53.1%)] rounded-full">{city}</span>
            )}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{desc}</p>
        </div>
      </CardContent>
    </Card>
  )
}

