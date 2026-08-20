export const environment = {
  production: true,

  // See environment.ts — same mock-only switch for Change Management.
  useMockChangeManagement: true,

  // Mirrors djp/EscalationMatrix's environment.prod.ts exactly — see
  // environment.ts for which base URL each DJP service actually uses.
  apiURL: 'http://10.59.144.118:8090',
  apiEndPoint: 'http://10.59.144.118:9000',
  broadcastURL: 'http://10.59.144.118:8090',
  tierOneEndPoint: 'http://10.59.144.118:8180',
  loginEndPoint: 'http://10.59.144.118:8090',
  nocPortalUrl: 'http://10.59.144.118:8180/customerPortal/',
  kmPortalUrl: 'http://10.59.144.118:8180/KnowledegeManagement/',
};
