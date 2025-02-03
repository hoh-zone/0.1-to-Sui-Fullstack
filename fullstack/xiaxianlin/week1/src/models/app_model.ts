import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { createContainer } from "unstated-next";

type SuiData = {
  dataType: "moveObject" | "package";
  fields: any;
  hasPublicTransfer: boolean;
  type: string;
  disassembled: {
    [key: string]: unknown;
  };
};

const useContainer = () => {
  const account = useCurrentAccount();
  const { data, isPending } = useSuiClientQuery(
    "getOwnedObjects",
    { owner: account?.address as string, options: { showContent: true } },
    { enabled: !!account },
  );

  const objects = useMemo<SuiData[]>(() => {
    if (!data?.data.length) return [];
    return data?.data?.map((i) => i.data?.content).filter(Boolean) as SuiData[];
  }, [data]);

  return {
    account,
    objects,
    loading: isPending,
  };
};

export const AppModel = createContainer(useContainer);
export const useAppModel = AppModel.useContainer;
