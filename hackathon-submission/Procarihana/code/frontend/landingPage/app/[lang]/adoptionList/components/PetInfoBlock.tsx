import { Cake, Weight, Feather, Ruler, Baby, Bug, Scissors, Syringe } from 'lucide-react'

import type { PetCardProps } from './PetCard'

const PetInfoBlock = ({
    animalInfo,
    type,
}: {
    animalInfo: PetCardProps | null,
    type: 'age' | 'weight' | 'hairType' | 'hairLength' | 'ageType' | 'isDeworm' | 'isNeuter' | 'isVaccine'
}) => {
    return <div className='flex flex-col items-center justify-center bg-slate-200 rounded-sm pt-2 text-gray-700 w-20 h-20'>
        { type === 'age' && <>
            <Cake className='mb-1'></Cake>
            <span>{mounthsToYear(animalInfo && animalInfo.ageMonth || 0)}年</span>
        </> }
        { type === 'weight' && <>
            <Weight className='mb-1'></Weight>
            <span>{animalInfo && parseFloat(animalInfo.weight).toFixed(1)}kg</span>
        </> }
        { type === 'hairType' && <>
            <Feather className='mb-1'></Feather>
            <span>{animalInfo && animalInfo.hairType}</span>
        </> }
        { type === 'hairLength' && <>
            <Ruler className='mb-1'></Ruler>
            <span>{animalInfo && animalInfo.hairLength}</span>
        </> }
        { type === 'ageType' && <>
            <Baby className='mb-1'></Baby>
            <span>{animalInfo && animalInfo.ageType}</span>
        </> }
        { type === 'isDeworm' && <>
            <Bug className='mb-1'></Bug>
            <span>{animalInfo && animalInfo.isDeworm === 1 ? '已' : '未'}驱虫</span>
        </> }
        { type === 'isNeuter' && <>
            <Scissors className='mb-1'></Scissors>
            <span>{animalInfo && animalInfo.isNeuter === 1 ? '已' : '未'}绝育</span>
        </> }
        { type === 'isVaccine' && <>
            <Syringe className='mb-1'></Syringe>
            <span>{animalInfo && animalInfo.isVaccine === 1 ? '已' : '未'}疫苗</span>
        </> }
    </div>
}

function mounthsToYear(mounths: number) {
    return (mounths / 12).toFixed(1)
}

export default PetInfoBlock