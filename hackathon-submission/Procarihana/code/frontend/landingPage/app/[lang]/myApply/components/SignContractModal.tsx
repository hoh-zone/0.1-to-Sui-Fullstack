import { Button, Modal, Checkbox, message, Space } from "antd";
import type { CheckboxProps } from "antd";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useContext,
} from "react";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_SYSTEM_STATE_OBJECT_ID } from "@mysten/sui/utils";
import type { DataType as Contract } from "./Contracts";
import { SUI_MIST, PACKAGE_ID, CONTRACTS_CONTAINER } from "@/config/constants";
import { useNetworkVariable } from "@/config";

const SignContractModal = (
  {
    contract,
    onSuccess,
  }: {
    contract?: Contract | null;
    onSuccess?: () => void;
  },
  ref: Ref<{
    setOpen: Function;
  }>
) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const account = useCurrentAccount();
  const validator = useNetworkVariable("validator" as never);
  useImperativeHandle(ref, () => ({
    setOpen,
  }));
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
          showEvents: true,
        },
      }),
  });

  // console.log("user in child = ", storeData);
  const onSignContract = async () => {
    // if (!account?.address) {
    //   messageApi.open({
    //     type: "warning",
    //     content: "请先连接钱包",
    //   });
    //   return;
    // }

    try {
      const txb = new Transaction();

      txb.setGasBudget(100000000 + parseInt(contract?.deposit + "" || "0"));
      const [coin] = txb.splitCoins(txb.gas, [contract?.deposit]);
      await new Promise(async (resolve, reject) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::apply_for_adoption::sign_adopt_contract`,
          arguments: [
            txb.pure.id(contract?.contractAddress),
            txb.object(CONTRACTS_CONTAINER), // contracts
            coin,
            txb.object(SUI_SYSTEM_STATE_OBJECT_ID),
            txb.pure.address(validator), // validator
          ],
          typeArguments: [],
        });

        // Show loading state
        setLoading(true);

        signAndExecute(
          {
            transaction: txb,
          },
          {
            onSuccess: async (data) => {
              console.log("transaction digest: " + JSON.stringify(data));
              if ((data.effects && data.effects.status.status) === "success") {
                const res = await fetch(
                  `/api/petContracts/${contract?.documentId}?id=${contract?.documentId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      data: {
                        state: "inProgress",
                        signDate: new Date().toISOString(),
                      },
                    }),
                  }
                );
                if (res && res.ok) {
                  resolve("");
                  messageApi.open({
                    type: "success",
                    content: "交易成功",
                  });
                  setOpen(false);
                  onSuccess && onSuccess();
                } else {
                  reject(new Error("签署合同失败: " + res.statusText));
                }
              } else {
                reject(new Error("交易失败, digest: " + data.digest));
              }
            },
            onError: (err) => {
              console.error("交易失败: " + err);
              reject(err);
            },
          }
        );
      });
    } catch (e: any) {
      messageApi.open({
        type: "error",
        content: e.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      setIsAgree(false);
    }
  }, [open]);

  return (
    <Modal
      title={<p>签署合同</p>}
      open={open}
      maskClosable={false}
      onCancel={() => setOpen(false)}
      cancelText="取消"
      // eslint-disable-next-line react/jsx-no-duplicate-props
      footer={(_, { OkBtn, CancelBtn }) => (
        <div className="flex justify-between items-center w-full">
          {contextHolder}
          <Checkbox
            checked={isAgree}
            onChange={(e) => {
              setIsAgree(e.target.checked);
            }}
          >
            已阅读条款并同意
          </Checkbox>
          <Space>
            <Button
              type="primary"
              disabled={!isAgree}
              onClick={onSignContract}
              loading={loading}
            >
              签约
            </Button>
            <CancelBtn />
          </Space>
        </div>
      )}
    >
      <section className="text-center">
        <h4 className="pb-3">领养协议条款</h4>
      </section>
      <section>
        <p className="mt-2">
          1. 领养人将支付 &nbsp;
          <span className="text-red-500">
            {(contract && contract.deposit / SUI_MIST) || 0}
          </span>
          &nbsp;
          SUI，作为押金。押金和产生的利息将根据回访结果结果返还，返还规则：全部回访通过，则返还全部押金，否则按通过比例返还。
        </p>
        <p className="mt-2">
          2.
          如果有恶意弃养动物的情况，则不退还押金，并会在社交平台曝光弃养行为。
        </p>
      </section>
    </Modal>
  );
};

export default forwardRef(SignContractModal);
