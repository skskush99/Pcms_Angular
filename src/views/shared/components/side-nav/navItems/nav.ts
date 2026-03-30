const navData = [
  {
    icon: "fa-solid fa-house",
    englishName: 'Dashboard',
    linkPage: 'dashboard'
  },
  {
    icon: 'fa-solid fa-users-gear',
    englishName: 'User Management',
    linkPage: 'master',
    subMenus: [
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'User Registration',
        linkPage: 'user/user-registration'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Add Role',
        linkPage: 'user/permission-mapping-list'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Permission Mapping',
        linkPage: 'user/menu-mapping'
      },
    ]
  },
  {
    icon: 'fa-solid fa-gear',
    englishName: 'Masters',
    linkPage: 'm',
    subMenus: [
      {
        englishName: 'Department ',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/admin-dept'
      },
      {
        englishName: 'Office',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/office'
      },
      {
        englishName: 'Court',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/court'
      },
      {
        englishName: 'Designation',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/designation'
      },
      {
        englishName: 'Division',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/division'
      },
      {
        englishName: 'District',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/district'
      },
      {
        englishName: 'Court Type',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/court-type'
      },
      {
        englishName: 'Police Range',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/police-range'
      },
      {
        englishName: 'Police District',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/police-district'
      },
      {
        englishName: 'Police Circle',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/police-circle'
      },
      {
        englishName: 'Police Station',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/police-station'
      },
      {
        englishName: 'Crime Classification',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/crime-classification'
      },
      {
        englishName: 'Crime Act',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/crime-act'
      },
      {
        englishName: 'Crime Sub Act',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/crime-sub-act'
      },
      {
        englishName: 'FIR Status',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/fir-status'
      },
      {
        englishName: 'Circular Order',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/circular-list'
      },
      {
        englishName: 'Nodal Officer',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/nodal-officer'
      },
      {
        englishName: 'Case Decision Type',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/case-decision-type'
      },
      {
        englishName: 'Case Decision Reason',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/case-decision-reason'
      },
      {
        englishName: 'Raj Master',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/raj-master-data'
      },
      {
        englishName: 'Requested Info',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/requested-info'
      },

    ]
  },
  {
    icon: 'fa-solid fa-users-gear',
    englishName: 'Case Management',
    linkPage: 'p',
    subMenus: [
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Case Registration',
        linkPage: 'case/case-list'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Complaint Register',
        linkPage: 'case/complaint-register/complain-register-details'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Case Hearing',
        linkPage: 'case-management/case-hearing-list'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Case Disposal',
        linkPage: 'case/cash-disposal'
      },
    ]
  },
  {
    icon: 'fa-solid fa-users-gear',
    englishName: 'Report',
    linkPage: 'nz',
    subMenus: [
      {
        icon: 'fa-solid fa-folder',
        englishName: 'Summary',
        linkPage: 'nz',
        subMenus: [
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Prosecution Return No.1',
            linkPage: 'report/prosecution-return-no1',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Pravivran no.-2',
            linkPage: 'report/pravivran-no2',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Pravivran no.-3',
            linkPage: 'report/pravivran-no3',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Pravivran no.-3 K',
            linkPage: 'report/pravivran-no3-k',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Pravivran no.-3 Kha',
            linkPage: 'report/pravivran-no3-kha',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Pravivran no.-7',
            linkPage: 'report/pravivran-no7',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Return-4',
            linkPage: 'report/return-4',
          }
        ]
      },

      // ================= DETAILS =================
      {
        icon: 'fa-solid fa-folder',
        englishName: 'Details',
        linkPage: 'nz',
        subMenus: [
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Mahila Atayachar BNS',
            linkPage: 'report/mahila-atayachar-bns',
          }
        ]
      },

      // ================= MIS =================
      {
        icon: 'fa-solid fa-folder',
        englishName: 'MIS',
        linkPage: 'nz',
        subMenus: [
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Format-A',
            linkPage: 'report/format-a',
          },
          {
            icon: 'fa fa-angle-double-right',
            englishName: 'Format-B',
            linkPage: 'report/format-b',
          }
        ]
      }
    ]
  }
]

export default navData