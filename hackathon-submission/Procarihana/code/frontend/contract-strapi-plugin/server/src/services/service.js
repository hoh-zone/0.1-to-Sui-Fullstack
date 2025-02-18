const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async getPetApply(documentId) {
    // console.log('~~~~~~~~~~~~~~~~documentId', documentId);
    const result = await strapi.db.query('api::pet-apply.pet-apply').findOne({
      where: { document_id: documentId },
      populate: true,
    });
    return result;
  },
  async getRecord(documentId) {
    // console.log('~~~~~~~~~~~~~~~~documentId', documentId);
    const result = await strapi.db.query('api::record.record').findOne({
      where: { document_id: documentId },
      populate: true,
    });
    console.log('getRecord result = ', result);
    return result;
  },
  async createContract(data) {
    const result = await strapi
      .documents('api::pet-contract.pet-contract')
      .create({ data, status: data.status });
    console.log('createContract result = ', result);
    return result;
  },
  async updateContract(data) {
    const result = await strapi
      .documents('api::pet-contract.pet-contract')
      .update({ documentId: data.documentId, data: data.data, status: data.status });
    console.log('updateContract result = ', result);
    return result;
  },
  async updateRecord(data) {
    const result = await strapi.documents('api::record.record').update({
      documentId: data.documentId,
      data: data.data,
      status: data.status,
    });
    console.log('updateRecord result = ', result);
    return result;
  },
  async getRecordsByContract(contractId) {
    console.log('getRecordsByContract contractId = ', contractId);
    const result = await strapi.db.query('api::record.record').findMany({
      filters: {
        contract: {
          documentId: contractId,
        },
        result: 'Pass',
        publishedAt: {
          $notNull: true,
        },
      },
      status: 'published',
    });
    return result;
  },
});

export default service;
