export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/getPetApply/:slug',
    // name of the controller file & the method.
    handler: 'controller.getPetApply',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/getRecord/:slug',
    // name of the controller file & the method.
    handler: 'controller.getRecord',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/contracts',
    // name of the controller file & the method.
    handler: 'controller.createContract',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/contracts',
    // name of the controller file & the method.
    handler: 'controller.updateContract',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/records',
    // name of the controller file & the method.
    handler: 'controller.updateRecord',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/getRecordsByContract/:slug',
    // name of the controller file & the method.
    handler: 'controller.getRecordsByContract',
    config: {
      policies: [],
    },
  },
];
