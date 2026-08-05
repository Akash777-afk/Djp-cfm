# Assets

Files here are organized by which page owns them, so it's obvious at a
glance where an asset belongs and what's safe to touch.

```
src/assets/
├── shared/               used by 2+ pages
├── landing/               used only by the landing page
├── incident-management/   used only by /incident-management
├── escalation-matrix/     used only by /escalation-matrix
├── change-management/     used only by /change-management and /change-management/crq
└── _unused/                not referenced anywhere in src/app — cleanup candidates
```

References in code always include the folder, e.g.
`src="/assets/escalation-matrix/EMLevel4.png"`.

## Maintenance rules

- **Adding a new asset**: drop it in the folder for the one page that uses
  it. If you already know 2+ pages will use it, put it in `shared/` instead.
- **An asset becomes used by a second page**: move the file into `shared/`
  and update every reference (old page + new page) to the new path.
- **Deleting from `_unused/`**: grep the codebase for the filename once
  first (`grep -r "filename.ext" src/app`) in case something references it
  dynamically (string concatenation, a constant built elsewhere) rather
  than as a literal path — the classification below was built from a static
  scan and won't catch that. If nothing turns up, it's safe to delete.
- Keep this file in sync when you move things around — it's the map.

## shared/ (8 files — used by 2+ pages)

| File | Used by |
|---|---|
| `Airtel-logo 5.png` | change-management, incident-management, landing |
| `Dropdown-topbar.svg` | change-management, escalation-matrix, incident-management |
| `Screenshot 2026-07-28 121148.png` | change-management, incident-management |
| `Search-topbar.svg` | escalation-matrix, incident-management |
| `famicons_book.png` | change-management, escalation-matrix, incident-management |
| `header-topright2.png` | change-management, incident-management, landing |
| `im-3-refresh.svg` | change-management, incident-management |
| `im-3-tier1.png` | escalation-matrix, incident-management |

## landing/ (11 files)

`Expand.svg`, `Icon-2.svg`, `Icon-3.svg`, `Icon-4.svg`, `Icon-5.svg`,
`Vector-1.svg`, `Vector-3.svg`, `Vector-4.svg`, `Vector.svg`,
`not-submitted.svg`, `submitted.svg`

## incident-management/ (24 files)

`Breadcrumb-incedentm.png`, `SR-overview.svg`, `im-1-broadcast.svg`,
`im-2-cd1-b.svg`, `im-2-cd1-t.svg`, `im-2-cd2-b.svg`, `im-2-cd2-t.svg`,
`im-2-cd3-b.svg`, `im-2-cd3-t.svg`, `im-2-cd4-b.svg`, `im-2-cd4-t.svg`,
`im-2-cd5-b.svg`, `im-2-cd5-t.svg`, `im-2-cd6-b.svg`, `im-2-cd6-t.svg`,
`im-2-cd7-b.svg`, `im-2-cd7-t.svg`, `im-2-cd8-b.svg`, `im-2-cd8-t.svg`,
`im-2-refresh.svg`, `im-3-settings.svg`, `im-3-tablerefresh.svg`,
`im-3-vipflag1.svg`, `im-3-vipflag2.svg`

## escalation-matrix/ (14 files)

`Download.png`, `E1m.png`, `EMLevel4.png`, `EMLevel5.png`, `EMLevel6.png`,
`Escalatedicon.png`, `Expansion.png`, `Filter.png`, `L1-recon.png`,
`L2-recon.png`, `L3-recon.png`, `Refresh.png`, `Settings.png`, `TotalEM.png`

## change-management/ (18 files)

`Icon-2.png`, `Icon-3.png`, `Icon-4.png`, `Icon-5.png`, `Icon-6.png`,
`Iconsch.png`, `Screenshot 2026-07-28 121147.png`, `cm-3-ic1.svg`,
`cm-3-ic2.svg`, `cm-3-ic3.svg`, `contact.png`, `graph.png`,
`iconoir_filter.png`, `mail po icons.svg`, `material-symbols_call.png`,
`planned outage icon.svg`, `plus.png`, `uil_calender.png`

## _unused/ (67 files)

Not referenced anywhere in `src/app` as of this reorg. Kept rather than
deleted in case they're wanted later — see the deletion rule above before
removing any of them.

`academicons_open-data.png`, `Ai insights.png`, `Broadcasticon.png`,
`cm-1-searchicon.png`, `contact.svg`, `Documentation-topbar.svg`,
`edit.png`, `EMLevel1.png`, `EMLevel2.png`, `EMLevel3.png`, `graph.svg`,
`Group 427319744.svg`, `header-topright.png`, `Icon-1.png`, `Icon-7.png`,
`icon-park-outline_more-app.svg`, `icon-park-solid_add.png`,
`icon-park_full-screen-one.svg`, `Icon.png`, `Icon.svg`,
`im-1-airtel-logo.svg`, `im-1-brdct.svg`, `im-1-menu.svg`,
`im-1-playbutton.svg`, `im-1-refresh.svg`, `im-1-searchbutton.svg`,
`im-1-sidebar.svg`, `im-1-time.svg`, `incident-management.svg`,
`inventory blueprint.png`, `link status.png`, `mdi_contact.png`,
`mennuu.png`, `modern-ui.svg`, `performance.png`, `plus.svg`,
`streamline_customer-support-1-1.svg`, `streamline_customer-support-1.svg`,
`tabler_topology-star.svg`, `tdesign_task-error.svg`, `tile-1.svg`,
`tile-2.svg`, `tile-3.svg`, `tile-4.svg`, `tile-5.svg`, `tile-6.svg`,
`tile-7.svg`, `tile-8.svg`, `tile-open.svg`, `topology.png`,
`Vector-1.png`, `Vector-10.png`, `Vector-11.png`, `Vector-12.png`,
`Vector-13.png`, `Vector-14.png`, `Vector-15.png`, `Vector-2.png`,
`Vector-2.svg`, `Vector-3.png`, `Vector-4.png`, `Vector-5.png`,
`Vector-6.png`, `Vector-7.png`, `Vector-8.png`, `Vector-9.png`,
`Vector.png`

*(`.gitkeep` stays at the assets root, not in `_unused/` — it's a git
housekeeping file, not a real asset.)*
