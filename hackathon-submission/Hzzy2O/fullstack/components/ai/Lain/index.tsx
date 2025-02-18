import Image from "next/image";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/glitch-dialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import LainBtn from "./LainBtn";
import { CoinMetaData } from "@/types";
import Result from "./TokenResult";
import LainInput from "./LainInput";

export default function Lain() {
	const [question, setQuetion] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [showResult, setShowResult] = useState(false);

	const [tempMetaData, setTempMetaData] = useState<CoinMetaData | null>(null);

	const [showError, setShowError] = useState(false);

	const { mutate: generate, isPending, } = useMutation({
		mutationFn: async (question: string) => {
			const response = await fetch("/api/call/lain", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ question }),
			});

			if (!response.ok) {
				throw new Error("Failed to generate token");
			}

			return response.json() as Promise<CoinMetaData>;
		},
		onSuccess: (data) => {
			setShowResult(true);
			setTempMetaData(data);
		},
		onError: (error) => {
			console.error("Error generating token:", error);
      setShowError(true);
		},
	});

	function handleSend() {
		if (question.trim()) {
			generate(question);
      setShowError(false);
		}
	}

	function handleOpenChange(flag: boolean) {
		setIsOpen(flag);
		setQuetion("");
		setShowResult(false);
    setShowError(false);
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<div>
					<LainBtn />
				</div>
			</DialogTrigger>
			<DialogContent className="top-[40%] sm:max-w-[425px] shadow-[0_0_10px_#5f6c7e] bg-[#021126]">
				<DialogHeader>
					<DialogTitle className="flex space-x-2">
						<Image src="/img/lain.webp" alt="Lain" width={100} height={70} />
						<div className="ml-2 space-y-2">
							<div>Hey! I'm LAIN,</div>
							<div className="font-normal text-sm">
								your AI guide to meme tokens. Let's create something amazing! ✨
							</div>
						</div>
					</DialogTitle>
				</DialogHeader>
				{!showResult ? (
					<LainInput
						question={question}
						setQuetion={setQuetion}
						isPending={isPending}
						handleSend={handleSend}
					/>
				) : (
					<Result
						coinMetaData={tempMetaData as CoinMetaData} 
						reGenerate={handleSend}
						handleClose={() => handleOpenChange(false)}
					/>
				)}
				{showError && (
					<DialogDescription className="text-red-500">
						something might go wrong, please try again later
					</DialogDescription>
				)}
			</DialogContent>
		</Dialog>
	);
}
