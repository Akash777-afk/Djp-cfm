# Assets

Files here are organized by which page owns them, so it's obvious at a
glance where an asset belongs and what's safe to touch.

```
src/assets/
├── shared/                 used by 2+ pages
├── landing/                used only by the landing page
├── incident-management/    used only by /incident-management
├── escalation-matrix/      used only by /escalation-matrix
├── change-management/      used only by /change-management and /change-management/crq
└── noc-portal/             used only by /noc-portal
```

References in code always include the folder, e.g.
`src="/assets/escalation-matrix/L1-recon.png"`.

## Maintenance rules

- **Adding a new asset**: drop it in the folder for the one page that uses
  it. If you already know 2+ pages will use it, put it in `shared/` instead.
- **An asset becomes used by a second page**: move the file into `shared/`
  and update every reference (old page + new page) to the new path.
- **Before deleting anything as unused**: grep the codebase for the filename
  once first (`grep -r "filename.ext" src/app`) in case something
  references it dynamically (string concatenation, a constant built
  elsewhere) rather than as a literal path.
- Keep this file in sync when you move things around — it's the map.

## shared/ (10 files — used by 2+ pages)

| File | Used by |
|---|---|
| `Airtel-logo 5.png` | change-management, incident-management, landing |
| `Dropdown-topbar.svg` | change-management, escalation-matrix, incident-management |
| `Download.png` | escalation-matrix, noc-portal |
| `Expansion.png` | escalation-matrix, noc-portal |
| `Filter.png` | escalation-matrix, noc-portal |
| `Refresh.png` | escalation-matrix, noc-portal |
| `Search-topbar.svg` | escalation-matrix, incident-management |
| `Settings.png` | escalation-matrix, noc-portal |
| `im-3-refresh.svg` | change-management, incident-management |
| `im-3-tier1.png` | escalation-matrix, incident-management |

## landing/ (9 files)

`Expand.svg`, `Icon-2.svg`, `Icon-3.svg`, `Icon-4.svg`, `Icon-5.svg`,
`Vector-1.svg`, `Vector-3.svg`, `Vector-4.svg`, `Vector.svg`

## incident-management/ (14 files)

`IM-Broadcast.svg`, `SR-overview.svg`,
`im-2-cd1-t.svg`, `im-2-cd2-t.svg`, `im-2-cd3-t.svg`, `im-2-cd4-t.svg`,
`im-2-cd5-t.svg`, `im-2-cd6-t.svg`, `im-2-cd7-t.svg`, `im-2-cd8-t.svg`,
`im-3-settings.svg`, `im-3-tablerefresh.svg`, `im-3-vipflag1.svg`,
`im-3-vipflag2.svg`

## escalation-matrix/ (10 files)

`AirtelIQ2.svg`, `Allcount.svg`, `Escalatedicon.png`,
`Knowledge-managemnt.svg`, `L1-recon.png`, `L2-recon.png`, `L3-recon.png`,
`Level 6.svg`, `level 4.svg`, `level 5.svg`

## change-management/ (16 files)

`Icon-2.png`, `Icon-3.png`, `Icon-4.png`, `Icon-5.png`, `Icon-6.png`,
`Iconsch.png`, `cm-3-ic1.svg`, `cm-3-ic2.svg`, `cm-3-ic3.svg`,
`contact.png`, `graph.png`, `iconoir_filter.png`, `mail po icons.svg`,
`planned outage icon.svg`, `plus.png`, `uil_calender.png`

## noc-portal/ (49 files)

`Aiinsights.svg`, `Clock.svg`, `Expected root cause.png`,
`FLT Observation.png`, `Frame 13.svg`, `Frame 14.svg`,
`Frame 427319839.svg`, `Frame 427319853.svg`, `Frame 427319854.svg`,
`Frame 427319855.svg`, `Group ssr.svg`, `Group ssr2.svg`, `Group ssr3.svg`,
`Group ssr4.png`, `Group ssr5.png`, `Knowledgemmt.svg`, `LSIHI.svg`,
`Mail.svg`, `Phone.svg`, `RefreshCw.svg`, `RefreshCwss.svg`, `TOPpol.png`,
`TrendingUp.svg`, `ai-chatbot-robot.png`, `alert.svg`, `alert2.svg`,
`docu.svg`, `edit.png`, `eye.svg`, `fluent-mdl2_my-network.svg`,
`gg_info-1.svg`, `gg_info.svg`, `graph.svg`, `hammenu.svg`, `hicon.svg`,
`ic_sharp-alarm.svg`, `icon-park-outline_alarm.svg`,
`iconoir_auto-flashssr.svg`, `invent.svg`, `ix_details.svg`, `link.svg`,
`majesticons_analytics-line.svg`, `material-symbols_call.svg`,
`mdi_list-status.svg`, `perfoemance.svg`, `proicons_attachssr.svg`,
`solar_alarm-linearssr.svg`, `tdesign_call.svg`, `topology.svg`

*(`.gitkeep` stays at the assets root — it's a git housekeeping file, not a
real asset. This folder previously also had `NOC_Portal/` — a
differently-cased duplicate of this same folder — and an `_unused/`
archive of confirmed-orphaned files; both were removed in the 2026-08-28
structure cleanup after every file was individually re-verified as
genuinely unreferenced.)*
