import { roles } from "./config";

const topMenuData = [
  {
    id: "dashboards",
    icon: "simple-icon-home",
    label: "Dashboard",
    to: "/candidate/dashboards",
    key: 'm-001',
    //newWindow: false,                            //  Opens the url in new window when set to true
    roles: [roles.CANDIDATE],   // Set the authorized roles to view the menu items. If it is undefined, all the users can view
  },
  {
    id: "profile",
    icon: "simple-icon-user",
    label: "Profile",
    to: "/candidate/profile",
    key: 'm-002',
    roles: [roles.CANDIDATE]
  },
  {
    id: "assessment",
    icon: "iconsminds-student-male",
    label: "Assessment",
    to: "/candidate/assessment",
    key: 'm-003',
    roles: [roles.CANDIDATE]
  },
  {
    id: "report",
    icon: "simple-icon-book-open",
    label: "Report",
    to: "/candidate/report",
    key: 'm-004',
    roles: [roles.CANDIDATE]
  },
  {
    id: "community",
    icon: "iconsminds-speach-bubbles",
    label: "Community",
    to: "/candidate/community",
    key: 'm-005',
    roles: [roles.CANDIDATE]
  },
  {
    id: "earn",
    icon: "iconsminds-coins-2",
    label: "Earn",
    to: "/candidate/earn",
    key: 'm-006',
    roles: [roles.CANDIDATE]
  },
  /*
  {
    id: "docs",
    icon: "iconsminds-library",
    label: "menu.docs",
    to: "https://piaf-vue-docs.coloredstrategies.com/",
    newWindow: true
  }
  */

  {
    id: "dashboards",
    icon: "simple-icon-home",
    label: "Dashboard",
    to: "/company/dashboards",
    key: 'm-007',
    roles: [roles.ORG_ADMIN],   // Set the authorized roles to view the menu items. If it is undefined, all the users can view
  },
  {
    id: "profile",
    icon: "iconsminds-hotel",
    label: "Profile",
    to: "/company/profile",
    key: 'm-008',
    roles: [roles.ORG_ADMIN],
  },
  {
    id: "project",
    icon: "iconsminds-management",
    label: "Project",
    to: "/company/jobs",
    key: 'm-009',
    roles: [roles.ORG_ADMIN],
  },
  {
    id: "report",
    icon: "simple-icon-book-open",
    label: "Report",
    to: "/company/report",
    key: 'm-010',
    roles: [roles.ORG_ADMIN],

  },
  {
    id: "community",
    icon: "iconsminds-speach-bubbles",
    label: "Community",
    to: "/company/community",
    key: 'm-011',
    roles: [roles.ORG_ADMIN],

  },
  {
    id: "earn",
    icon: "simple-icon-wallet",
    label: "Wallet",
    to: "/company/earn",
    key: 'm-012',
    roles: [roles.ORG_ADMIN],

  },

];
export default topMenuData;
