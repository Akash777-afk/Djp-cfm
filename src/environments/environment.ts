// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // Change Management runs entirely on local mock data (no HTTP calls at
  // all — see ChangeManagementService) until the real backend is reliable
  // enough for demos. Flip to false to restore live API calls; every other
  // module (Incident Management, Escalation Matrix, NOC Portal) is
  // unaffected by this flag.
  useMockChangeManagement: true,

  // ---- DJP backend base URLs (mirrors djp/EscalationMatrix's environment.ts
  // exactly — dev-176 values). Different DJP services target different base
  // URLs even though they look similar; don't assume they're interchangeable.
  // Confirmed via live VPN testing + source re-check (see
  // escalation-matrix.service.ts / session.service.ts):
  //   - apiEndPoint     -> fetchEscalationsHistory, getEscalationsCallCount,
  //                        activityLog, logUser (AppService.apiEndPoint is
  //                        assigned from broadcastURL in its constructor,
  //                        but these calls all build their URL from the raw
  //                        environment.apiEndPoint import instead — that
  //                        constructor assignment is dead for them)
  //   - broadcastURL    -> getUrl/getHyperLinkNavurls (the one method that
  //                        genuinely uses AppService's this.apiEndPoint)
  //   - tierOneEndPoint -> cp-rest/security/user (session/user details)
  // apiURL / loginEndPoint / nocPortalUrl / kmPortalUrl are carried over for
  // later modules (Change Management, Incident Management) but not yet
  // consumed by anything in djp-cfm.
  apiURL: 'http://10.240.72.176:8090',
  apiEndPoint: 'http://10.240.72.176:9000',
  broadcastURL: 'http://10.240.72.176:8090',
  tierOneEndPoint: 'http://10.240.72.176:8180',
  loginEndPoint: 'http://10.240.72.176:8090',
  nocPortalUrl: 'http://10.240.72.176:8180/customerPortal/',
  kmPortalUrl: 'http://10.240.72.176:8180/KnowledegeManagement/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
