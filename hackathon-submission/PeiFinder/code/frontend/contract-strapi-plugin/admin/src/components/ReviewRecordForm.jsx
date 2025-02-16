import { useState } from 'react';
import { Box, Button, Alert, Field, SingleSelect,
  SingleSelectOption, Textarea } from '@strapi/design-system';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import {SUI_SYSTEM_STATE_OBJECT_ID} from "@mysten/sui/utils";
import {
    useFetchClient,
  } from '@strapi/strapi/admin';
import { PACKAGE_ID, CONTRACTS_CONTAINER, SUI_MIST } from '../config/constantsjs';

const CreateContractForm = ({ record }) => {
  console.log('record = ', record);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: 'success',
    msg: '',
  });
  const [result, setResult] = useState(false);
  const [comment, setComment] = useState('');
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
      console.log('packageId = ', PACKAGE_ID);
      await new Promise((resolve, reject) => {
        txb.moveCall({
          target: `${PACKAGE_ID}::apply_for_adoption::audit_record`,
          arguments: [
            txb.pure.id(record?.contract?.contractAddress),
            txb.object(CONTRACTS_CONTAINER), // contracts
            txb.pure.bool(result === 'Pass'),
            txb.pure.string(comment),
            txb.object(SUI_SYSTEM_STATE_OBJECT_ID)
          ],
          typeArguments: [],
        });
        console.log('start txb !!!!!!!!!!!!!!!!!!')
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
                const recordRes = await fetchClient.put('/contract-strapi-plugin/records', {
                  documentId: record?.documentId,
                  data: {
                    result,
                    comment,
                  },
                  status: 'published'
                }); // 更新记录
                // console.log('更新记录 = ', recordRes)
              
                if (recordRes.error) {
                  reject(new Error(recordRes.error.message));
                  return
                }
        
                await new Promise(res => setTimeout(res, 500));
        
                const allRecordsRes = await fetchClient.get(`/contract-strapi-plugin/getRecordsByContract/api::record.record?contractId=${record.contract.documentId}`);
                // console.log('所有记录 = ', allRecordsRes)
                if (allRecordsRes.error) {
                  reject(new Error(allRecordsRes.error.message));
                  return
                }
                const allRecords = allRecordsRes.data
                // console.log('record.contract = ', record.contract)
                if (allRecords.length >= record.contract.recordTimes) {
                  // 通过次数够了，更新合同状态
                  const contractRes = await fetchClient.put(`/contract-strapi-plugin/contracts`, {
                    documentId: record?.contract?.documentId,
                    data: {
                      state: 'complete',
                      finishDate: new Date().toISOString()
                    },
                    status: 'published'
                  });
                  // console.log('更新合同状态 = ', contractRes)
                  if (contractRes.error) {
                    reject(new Error(contractRes.error.message));
                    return
                  }
                }

                resolve('');
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
        msg: '审核成功',
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
            <Field.Label>审核结果</Field.Label>
            <SingleSelect onChange={setResult} value={result}>
              <SingleSelectOption value="Pass">通过</SingleSelectOption>
              <SingleSelectOption value="Reject">不通过</SingleSelectOption>
            </SingleSelect>
            <Field.Error />
          </Field.Root>
        </Box>
        <Box paddingTop={2}>
          <Field.Root>
            <Field.Label>评论</Field.Label>
            <Textarea
              placeholder="请填写审核评论"
              name="comment"
              onChange={(v) => {
                setComment(v.target.value);
              }}
            />
            <Field.Error />
          </Field.Root>
        </Box>
      </Box>
      <Button type="submit" disabled={loading} onClick={handleSubmit}>
        {loading ? '提交中...' : '提交'}
      </Button>
    </>
  );
};

export default CreateContractForm;
