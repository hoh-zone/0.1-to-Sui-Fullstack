import { Button } from "@/components/ui/button";
import { coinAtom } from "@/store/createAtom";
import { CoinMetaData } from "@/types";
import { useAtom } from "jotai";
import Image from "next/image";

type Props = {
	coinMetaData: CoinMetaData; 
	reGenerate: () => void;
	handleClose: () => void;
};

export default function Result({ coinMetaData, reGenerate, handleClose }: Props) {
	const [_, setCoinMetaData] = useAtom(coinAtom);
	function handleConfirm() {
		setCoinMetaData(coinMetaData);
		handleClose();
	}
	return (
		<div className="w-full space-y-4">
			<strong>result:</strong>
			<div className="bg-blue-900/30 p-4 rounded-lg space-y-2">
				<div className="flex space-x-2">
					<span className="text-blue-300">Name:</span>
					<span>{coinMetaData?.name}</span>
				</div>
				<div className="flex space-x-2">
					<span className="text-blue-300">Symbol:</span>
					<span>{coinMetaData?.symbol}</span>
				</div>
				<div className="space-y-1">
					<span className="text-blue-300">Description:</span>
					<p className="text-sm">{coinMetaData?.description}</p>
				</div>
				<div className="space-y-1">
					<span className="text-blue-300">Image:</span>
					{coinMetaData?.icon_url && (
						<Image
							src={coinMetaData?.icon_url}
							alt={coinMetaData?.name}
							width={100}
							height={100}
						/>
					)}
				</div>
			</div>
			<div className="flex justify-end space-x-2">
				<Button variant="outline" onClick={() => reGenerate()} size="sm">
					Generate Again
				</Button>
				<Button
					onClick={handleConfirm}
					className="text-white bg-blue-800 hover:bg-blue-900"
					size="sm"
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}
