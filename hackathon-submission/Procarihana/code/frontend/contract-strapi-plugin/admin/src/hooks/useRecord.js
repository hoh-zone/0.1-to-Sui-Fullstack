import * as React from 'react';
import {
  useFetchClient,
  unstable_useContentManagerContext as useContentManagerContext,
} from '@strapi/strapi/admin';

function usePetApply() {
  const fetchClient = useFetchClient();

  const { model, id, isSingleType } = useContentManagerContext();

  const [status, setStatus] = React.useState('loading');
  const [record, setRecord] = React.useState([]);

  const refetchRecord = React.useCallback(async () => {
    try {
      const { data } = await fetchClient.get(
        `/contract-strapi-plugin/getRecord/${model}?documentId=${isSingleType ? '' : id}`
      );

      setRecord(data);
      console.log('fetch data = ', data)
      setStatus('success');
    } catch (e) {
      setStatus('error');
    }
  }, [fetchClient, id, isSingleType, model]);

  React.useEffect(() => {
    refetchRecord();
  }, [id, isSingleType, setRecord, setStatus, refetchRecord]);

  return { status, record, refetchRecord, model };
}

export default usePetApply;