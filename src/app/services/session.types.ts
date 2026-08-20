// Mirrors djp/EscalationMatrix/src/app/models/user-data.model.ts field-for-
// field — this is the exact shape GET {tierOneEndPoint}/cp-rest/security/user
// returns in DJP, reused as-is per rule 3 (don't reshape response contracts).
export interface UserData {
  username?: string;
  givenName?: string;
  lastName?: string;
  privilegeList?: { privileges: string[] };
  userGroupList?: { userGroups: string[] };
  admin?: boolean;
}

export interface UserDataModel {
  userData?: UserData;
}

// Shape of the activityLog POST body, matches AppService.monitorActivity()'s
// payload literal exactly (odd casing/spacing on "OLM ID" is the real
// contract, not a typo introduced here).
export interface ActivityLogPayload {
  System: string;
  'OLM ID': string;
  Action: string;
  Comments: string;
}

// Mirrors djp/incidentmanagement (and djp/EscalationMatrix)'s
// redirection-urls.model.ts exactly — the response shape of
// GET {broadcastURL}/cfm-mise/djp/getUrl.
export interface VcNips {
  name: string;
  value: string;
}

export interface NocRedirectionUrls {
  nugget: string;
  act: string;
  lsiHref: string;
  airtelIq: string;
  nms: string;
  vcNips: VcNips[];
  elanApi: string;
}

export interface ImRedirectionUrls {
  broadCastCall: string;
}

export interface RedirectionUrls {
  IM: ImRedirectionUrls;
  NOC: NocRedirectionUrls;
}
