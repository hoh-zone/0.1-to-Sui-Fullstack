import { cn } from "@/utils";
import Image from "next/image";
import * as React from "react";

interface FileUploadProps
	extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
	value?: string | null;
	onChange?: (url: string) => void;
	onClear?: () => void;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
	({ value, onChange, onClear, ...props }, ref) => {
		const accept = "image/jpg,image/jpeg,image/png";
		const maxSize = 10;

		const [error, setError] = React.useState<string>("");
		const fileInputRef = React.useRef<HTMLInputElement>(null);

		const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			setError("");

			if (file) {
				if (maxSize && file.size > maxSize * 1024 * 1024) {
					setError(`File size must be less than ${maxSize}MB`);
					return;
				}

				if (accept && !accept.includes(file.type)) {
					setError(`File type must be ${accept}`);
					return;
				}

				onChange?.(URL.createObjectURL(file));
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
			}
		};

		return (
			<div className="space-y-2">
				<div
					ref={ref}
					className={cn(
						"border-4 border-dashed rounded-lg p-4 text-center",
						"hover:border-brand/50 transition-colors cursor-pointer",
						error && "border-red-500",
					)}
					onClick={() => fileInputRef.current?.click()}
				>
					{value ? (
						<div className="relative">
							<Image
								src={value}
								alt="image"
								className="mx-auto"
								width={140}
								height={140}
							/>
						</div>
					) : (
						<p className="text-sm text-muted-foreground">
							Click to upload
							<br />
							JPG,PNG image
							<br />
							up to {maxSize}MB
						</p>
					)}
				</div>

				<input
					type="file"
					accept=".jpg,.jpeg,.png"
					className="hidden"
					ref={fileInputRef}
					{...props}
					onChange={handleFileSelect}
				/>

				{error && <p className="text-sm text-red-500">Error: {error}</p>}
			</div>
		);
	},
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
