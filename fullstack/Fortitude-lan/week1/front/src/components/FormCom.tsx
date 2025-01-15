"use client";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import { createProfileTx, queryInfo, queryState } from "@/lib/contracts";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import { useToast } from "@/hooks/use-toast";

export function FormCom() {
  const { toast } = useToast();
  const currentUser = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [name, setname] = useState("");
  const [desc, setdesc] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!currentUser) {
      console.log("User not connected");
      toast({
        variant: "destructive",
        title: "User not connected.",
        description: "Please connect wallet.",
      });
      return;
    }
    const tx = await createProfileTx(name, desc);
    tx.setGasBudget(1e7);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Profile created");
          toast({
            variant: "success",
            title: "Profile created Successfully!",
          });
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <div className="border-solid border-2 border-custom-blue max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent dark:bg-black">
      <h2 className=" text-center font-bold text-xl text-neutral-50 dark:text-neutral-200">
        Create Profile
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300"></p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            placeholder="Enter a description"
            rows={5}
            name="desc"
            value={desc}
            onChange={(e) => {
              setdesc(e.target.value);
            }}
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-custom-blue dark:from-zinc-900 dark:to-zinc-900 to-black-100 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Confirm &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-custom-blue dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
