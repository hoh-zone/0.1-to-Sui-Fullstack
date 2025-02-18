const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('contract-strapi-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  getPetApply(ctx) {
    return strapi.plugin('contract-strapi-plugin').service('service').getPetApply(ctx.query.documentId);
  },
  createContract(ctx) {
    // console.log('createContract ctx.request.body = ', ctx.request.body);
    ctx.body = strapi.plugin('contract-strapi-plugin').service('service').createContract(ctx.request.body);
  },
  getRecord(ctx) {
    return strapi.plugin('contract-strapi-plugin').service('service').getRecord(ctx.query.documentId);
  },
  updateRecord(ctx) {
    ctx.body = strapi.plugin('contract-strapi-plugin').service('service').updateRecord(ctx.request.body);
  },
  updateContract(ctx) {
    ctx.body = strapi.plugin('contract-strapi-plugin').service('service').updateContract(ctx.request.body);
  },
  getRecordsByContract(ctx) {
    return strapi.plugin('contract-strapi-plugin').service('service').getRecordsByContract(ctx.query.contractId);
  }
});

export default controller;
