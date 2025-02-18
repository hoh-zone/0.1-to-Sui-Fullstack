import { useState } from 'react';
import { Box, Button, Alert, Field } from '@strapi/design-system';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import {
    useFetchClient,
  } from '@strapi/strapi/admin';
import { PACKAGE_ID, CONTRACTS_CONTAINER, SUI_MIST } from '../config/constantsjs';

const CreateContractForm = ({ petApply }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    msg: '',
  });
  const [deposit, setDeposit] = useState(0);
  const [recordTimes, setRecordTimes] = useState(0);
  const fetchClient = useFetchClient();

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

  const handleSubmit = async (e) => {
    // Prevent submitting parent form
    e.preventDefault();
    e.stopPropagation();

    try {
      const txb = new Transaction();

      txb.setGasBudget(100000000);
      console.log('!!!!!!petApply = ', petApply);
      console.log('packageId = ', PACKAGE_ID);
      await new Promise((resolve, reject) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::apply_for_adoption::create_adopt_contract`,
          arguments: [
            txb.pure.string(petApply.userId),
            txb.pure.string(petApply.documentId),
            txb.pure.u64(deposit * SUI_MIST),
            txb.pure.address(petApply.userWallet), // adopter_address
            txb.object(CONTRACTS_CONTAINER), // contracts
            txb.pure.u64(recordTimes),
            txb.pure.u64(0),
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
              console.log('transaction digest: ' + JSON.stringify(data));
              if ((data.effects && data.effects.status.status) === 'success') {
                const contractId =
                  data.events &&
                  Array.isArray(data.events) &&
                  data.events.length > 0 &&
                  data.events[0].parsedJson.contractId;

                  const res = await fetchClient.post('/contract-strapi-plugin/contracts', {
                    contractAddress: contractId,
                    userId: petApply.userId,
                    deposit: deposit * SUI_MIST,
                    recordTimes: parseInt(recordTimes),
                    userWallet: petApply.userWallet,
                    state: 'toSign',
                    status: 'published',
                    pet: petApply.pet.documentId,
                    petApply: petApply.documentId,
                  }); // 保存合约信息到数据库
  
                  if (res.error) {
                    reject(new Error(res.error.message));
                  } else {
                    resolve();
                  }
              } else {
                reject(new Error('交易失败: ' + data.digest));
              }
            },
            onError: (err) => {
              console.error('transaction error: ' + err);
              reject(err);
            },
          }
        );
      });

      setMessage({
        type: 'success',
        msg: '合同创建成功',
      });
    } catch (e) {
      console.error(e);
      setMessage({
        type: 'error',
        msg: e.message,
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({
          type: 'success',
          msg: '',
        });
      }, 5000);
    }
  };
  return (
    <>
      {message.msg && (
        <Alert title="Tips" variant={message.type}>
          {message.msg}
        </Alert>
      )}
      <Box paddingTop={2} paddingBottom={2}>
        <Box paddingTop={2}>
          <Field.Root>
            <Field.Label>押金数量(SUI)</Field.Label>
            <Field.Input
              type="text"
              placeholder="填写押金(SUI)"
              onChange={(e) => setDeposit(e.target.value)}
              value={deposit}
            />
            <Field.Error />
          </Field.Root>
        </Box>
        <Box paddingTop={2}>
          <Field.Root>
            <Field.Label>回访次数</Field.Label>
            <Field.Input
              type="text"
              placeholder="填写回访次数"
              onChange={(e) => setRecordTimes(e.target.value)}
              value={recordTimes}
            />
            <Field.Error />
          </Field.Root>
        </Box>
      </Box>
      <Button type="submit" disabled={loading} onClick={handleSubmit}>
        {loading ? '提交中...' : '创建合同'}
      </Button>
    </>
  );
};

export default CreateContractForm;
