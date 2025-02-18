import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter } from "@/components/ui/glitch-dialog";
import { Input } from "@/components/ui/input";

type Props = {
	question: string;
	setQuetion: (value: string) => void;
	handleSend: () => void;
	isPending: boolean;
};

export default function LainInput({
	question,
	setQuetion,
	handleSend,
	isPending,
}: Props) {
	return (
		<div className="space-y-2">
			<Input
				className="border mt-1"
				placeholder="Tell LAIN what you want..."
				value={question}
				onChange={(e) => setQuetion(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSend();
					}
				}}
			/>
			<DialogDescription>
				e.g. 'Create a dog-themed token' or 'Buy some XXX Coin'
			</DialogDescription>
			<DialogFooter className="pt-2">
				<Button
					className="bg-blue-800 text-white font-bold p-2 hover:bg-blue-900 active:bg-blue-900"
					size="sm"
					onClick={handleSend}
					disabled={isPending}
				>
					{isPending ? "Generating..." : "Send"}
				</Button>
			</DialogFooter>
		</div>
	);
}
