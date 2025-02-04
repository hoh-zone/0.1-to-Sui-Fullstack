import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { networkConfig } from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
const formSchema = z.object({
  name: z.string().min(1),
  profile: z.string().min(1),
});

function NoProfile() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      profile: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const tx = new Transaction();
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "week_two",
      function: "create_profile",
      arguments: [
        tx.pure.string(values.name),
        tx.pure.string(values.profile),
        tx.object(networkConfig.testnet.stateObjectID),
      ],
    });
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  };
  return (
    <div className="container flex flex-col justify-between items-start pt-10 pb-10">
      <div className="w-full text-center font-bold text-3xl mb-5">
        Create Profile
      </div>
      <div className="w-full text-center">
        Enter your details to create your on-chain profile
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <>
                <FormItem className="mt-5">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <Button type="submit" className="w-full mt-10">
            Create Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default NoProfile;
