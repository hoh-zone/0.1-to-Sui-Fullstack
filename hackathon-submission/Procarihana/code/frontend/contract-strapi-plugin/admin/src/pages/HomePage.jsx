import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from '@mysten/dapp-kit';
import { useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  TextButton,
  Typography,
  TextInput,
  Button,
  Alert,
  Field,
} from '@strapi/design-system';
import usePetApply from '../hooks/usePetApply';
import useRecord from '../hooks/useRecord';
import { getTranslation } from '../utils/getTranslation';
import { Providers } from '../components/providers/sui-provider';
import CreateContractForm from '../components/CreateContractForm';
import ReviewRecordForm from '../components/ReviewRecordForm';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { status, petApplies, refetchPetApplies, model } = usePetApply();
  const { status: recordStatus, record, refetchRecord } = useRecord();
  console.log('model = ', model);
  return (
    <Providers>
      <Box
        aria-labelledy="additional-informations"
        background="neutral0"
        marginTop={4}
        width={'100%'}
      >
        {model === 'api::pet-apply.pet-apply' && (
          <>
            <ConnectButton>连接钱包</ConnectButton>
            <CreateContractForm petApply={petApplies} />
          </>
        )}
        {model === 'api::record.record' && (
          <>
            <ConnectButton>连接钱包</ConnectButton>
            <ReviewRecordForm record={record} />
          </>
        )}
      </Box>
    </Providers>
  );
};

export { HomePage };
