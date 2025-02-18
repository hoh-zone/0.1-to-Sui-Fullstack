import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Cat, Dog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
export interface PetCardProps {
  petName: string
  desc: string
  avatar: string
  petType: string
  sex: number
  adoptNeedAddress: string
  weight: string
  ageType: string
  hairType: string
  hairLength: string
  isVaccine: number
  isDeworm: number
  isNeuter: number
  petDescription: string
  imgs: string
  ageMonth: number
  adoptStatus: string
  infoUpdateTime: string
  characterDescription: string
  adoptConditions: string
  address: string
  sourceRemark: string
  isShared: 0 | 1
  documentId: string
}

export default function PetCard({ animalInfo, onClick }: { animalInfo: PetCardProps, onClick: (params: PetCardProps) => void }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full flex-shrink-0 hover:cursor-pointer" onClick={() => {
      onClick(animalInfo)
    }}>
      <div className="relative h-40 w-full">
        <Image src={animalInfo.avatar || "/placeholder.svg"} alt={`${animalInfo.petName}的照片`} fill className="object-cover" />
      </div>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-start">
            <h3 className="text-sm text-gray-900 mb-0 mr-2">{animalInfo.petName}</h3>
            { animalInfo.petType === 'dog' && <Dog className="h-4 w-4 mr-2" />}
            { animalInfo.petType === 'cat' && <Cat className="h-4 w-4 mr-2" />}
            { animalInfo.sex === 1 && <Image src="/icons/male.svg" width={16} height={16} alt="公" />}
            { animalInfo.sex === 2 && <Image src="/icons/female.svg" width={16} height={16} alt="母"/>}
            {/* {animalInfo.adoptNeedAddress && (
              <span className="text-xs px-2 py-1 bg-orange-100 text-[hsl(24.6,95%,53.1%)] rounded-full">{animalInfo.adoptNeedAddress}</span>
            )} */}
          </div>
          <p className="flex items-center text-sm">
            <span className="text-xs px-2 py-1 bg-orange-400 text-white rounded-sm mr-1">领养区域</span>
            <span className="text-xs px-2 py-1 bg-orange-100 text-[hsl(24.6,95%,53.1%)] rounded-sm truncate max-w-52">{animalInfo.adoptNeedAddress}</span>
          </p>
          <div>
            <Badge variant="secondary" className="mr-1">{parseFloat(parseFloat(animalInfo.weight).toFixed(1))} kg</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.ageType}</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.hairType}</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.hairLength}</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.isVaccine === 1 ? '已' : '未'}疫苗</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.isDeworm === 1 ? '已' : '未'}驱虫</Badge>
            <Badge variant="secondary" className="mr-1">{animalInfo.isNeuter === 1 ? '已' : '未'}绝育</Badge>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{animalInfo.petDescription}</p>
        </div>
      </CardContent>
    </Card>
  )
}

