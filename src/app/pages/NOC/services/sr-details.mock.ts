import { SrDetails } from '../noc-portal.types';

// ---------------------------------------------------------------------------
// Mock SrDetails response — stands in for a real "GET /sr/{srNumber}" API
// response. Every value here (RCA's field statuses, both Insights cards'
// text) is data, not markup — SrDetailsService is the ONLY place that knows
// about this file; noc-portal.component.ts just sees an Observable<SrDetails>
// and the templates just bind to whatever came back, so swapping this out
// for a real HttpClient call later touches this file and sr-details.service.ts
// only, nothing downstream.
//
// Same content for every SR number searched, matching how every other mock
// "search" in this app already behaves (all-srs, bundle-summary, etc. all
// show the same fixed data regardless of what was searched) — see
// SrDetailsService.getSrDetails for where a real per-SR lookup would go.
// ---------------------------------------------------------------------------
export const MOCK_SR_DETAILS: SrDetails = {

  journey: [
    {
      key: 'report-register', label: 'Report & Register', state: 'done',
      events: [
        { icon: 'ticket', label: 'SR Opening',     time: '09.45 am - 10.05.25', description: 'Ticket Created' },
        { icon: 'assign', label: 'SR Assignment',  time: '09.45 am - 10.05.25', description: 'Team allocated' },
        { icon: 'send',   label: 'FUC sent',       time: '09.45 am - 10.05.25', description: 'First update' },
      ],
    },
    {
      key: 'investigation-diagnosis', label: 'Investigation & Diagnosis', state: 'done',
      events: [
        { icon: 'ticket', label: 'SUC',  time: '10.00 am - 10.05.25', description: 'Subsequent update to customer' },
        { icon: 'chat',   label: 'Task', time: '10.00 am - 10.05.25', description: 'Work order assignment' },
      ],
    },
    {
      key: 'resolution-restoration', label: 'Resolution & Restoration', state: 'current', number: 3,
      events: [
        { icon: 'check', label: 'SR Resolved', time: '10.15 am - 10.05.25', description: 'Service request has been resolved' },
        { icon: 'send',  label: 'RFO sent',     time: '10.15 am - 10.05.25', description: 'Update has been sent' },
      ],
    },
    {
      key: 'closure', label: 'Closure', state: 'upcoming', number: 4,
      events: [
        { icon: 'close', label: 'SR closed', time: '10.30 am - 10.05.25', description: 'Service request has been closed' },
      ],
    },
  ],

  rca: {
    fltPingFields: [
      { label: 'WAN IP Ping Status (IP)', value: 'Down', status: 'down' },
      { label: 'BTS IP Ping Status (IP)', value: 'UP',   status: 'up' },
      { label: 'CPE IP Ping Status (IP)', value: 'Down', status: 'down' },
    ],
    fltAlarmFields: [
      { label: 'a. Infra Alarm',         value: 'No', status: 'no' },
      { label: 'b. CPE Alarm (Everest)', value: 'No', status: 'no' },
    ],
    // Both Expected Root Cause columns render this exact same list, matching
    // the reference image verbatim rather than inventing distinct content.
    rootCauseBullets: [
      'Customer end ODU, IDU or cable issue',
      'Customer end router issue',
      'FLT needs to be performed with the customers',
      'Field visit - Based on FLT outcome',
      'Customer end router issue',
      'FLT needs to be performed with the customers',
      'Field visit - Based on FLT outcome',
    ],
  },

  insights: {
    srSummarization: {
      title: 'SR Summarization',
      description: 'Comprehensive analysis of incident SR-2024-03876 – Payment Gateway Connection Pool Exhaustion',
      fields: [
        {
          label: 'Field Engineer Update',
          value: 'FE Naveen +91 93112 34176 Align WIP ERT 2 PM',
        },
        {
          label: 'Planned ETA / ERT communicated',
          value: 'Ram veer Singh (9870387939) has accepted the task 116971784 and ETA is 21/10/2024 11:35 and estimated resolution time.',
        },
        {
          label: 'Engineering reached site',
          value: 'Ram veer Singh (9870387939) reached the site for task id 116971784 at Mon Oct 21 11:36:00 IST 2024.',
        },
        {
          label: 'Issue identified',
          value: 'Task Number: 116976604 has been Closed with, COMMENTS : PWC LC HAS ACCIDENTLY CUT HIS WIRE, NOW WORK IS IN PROGRESS.',
        },
        {
          label: 'Task closure update',
          value: 'Task Number: 116974900 has been Closed with Comments: link up.',
        },
        {
          label: 'Fault Report Time',
          value: '21-OCT-2024 11:02:20; Circuit UP Time: 21-OCT-2024 11:32:07',
        },
        {
          label: 'RFO Resolution Comments',
          value: 'Dear Customer, Link was affected due to port hung on router at Customer end Uttrakhand Services have been restored after JOJI the cable(s).',
        },
      ],
    },
    historicalFaultInsights: {
      title: 'Historical Fault Insights',
      description: 'Identify recurring issues, fault patterns, and service-impact trends from past incidents.',
      fields: [
        {
          label: 'Resolution & Closure Status',
          value: 'The Ultratech Cement Limited service has experienced incidents, with SR numbers 38179998, 38122843, 38228671 and 38135637 recorded in the last 90 days.',
        },
        { label: 'SR Status',        value: 'Closed (All)' },
        { label: 'Resolution Method', value: 'Back end / Network-side resolution' },
        { label: 'Customer Impact',  value: 'Restored post corrective action' },
        {
          label: 'RFO – Consolidated Observation',
          value: 'Although individual SRs were closed, repeated complaints on the same SI indicate:',
          bullets: [
            'Intermittent MPLS performance degradation',
            'Reactive resolution without permanent corrective action',
          ],
        },
        {
          label: 'Executive One-Line Summary',
          value: 'Multiple service-impacting SRs were raised for the same MPLS SI and customer, resolved individually, but recurrence indicates a need for proactive stabilization rather than reactive closures.',
        },
      ],
    },
  },

};
