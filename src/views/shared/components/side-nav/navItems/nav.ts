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
      // {
      //   icon: 'fa fa-angle-double-right',
      //   englishName: 'User Role Mapping',
      //   linkPage: 'user/user-role-mapping'
      // },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Add Role',
        linkPage: 'user/permission-mapping-list'
      },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Add Menu',
      //     linkPage : 'user/add-menu'
      // },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Permission Mapping',
        linkPage: 'user/menu-mapping'
      },
    ]
  },
  //   {
  //     icon: 'fa-solid fa-users-gear',
  //     englishName: 'Pre-Litigation',
  //     linkPage: 'n',
  //     subMenus: [
  //       {
  //         icon: 'fa-solid fa-file',
  //         englishName: 'Notice For Demand Of Justice',
  //         linkPage: 'pre-litigation/notice-demand-justice'
  //       },
  //       {
  //         icon: 'fa-solid fa-file',
  //         englishName: 'Notice Under 80 CPC',
  //         linkPage: 'pre-litigation/notice-under-80-cpc'
  //       },
  //       {
  //         icon: 'fa-solid fa-file',
  //         englishName: 'Arbitration',
  //         linkPage: 'pre-litigation/arbitration'
  //       },
  //     ]
  //   },
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
      //   {
      //     englishName: 'HoD/Units/Department',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/unit-dept-list'
      //   },
      {
        englishName: 'Office',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/office'
      },
      //   {
      //     englishName: 'OIC',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/oic-list'
      //   },
      //   {
      //     englishName: 'Lawyer',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/lawyer-list'
      //   },
      //   {
      //     englishName: 'Court Type',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/court-type-list'
      //   },
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
      //   {
      //     englishName: 'Court Place',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/court-place'
      //   },
      //   {
      //     englishName: 'Subject Category',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/subject-category-list'
      //   },
      //   {
      //     englishName: 'Subject Sub Category',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/subject-sub-category-list'
      //   },
      //   {
      //     englishName: 'Subject Matters',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/subject-matters-list'
      //   },
      // {
      //     englishName : 'Add State',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'add-state'
      // },

      //   {
      //     englishName: 'Subject Sub Matters',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/subject-sub-matters-list'
      //   },
      //   {
      //     englishName: 'Sub Priority',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/sub-priority-list'
      //   },
      //   {
      //     englishName: 'Case Abbreviation',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/case-abbreviation-list'
      //   },
      //   {
      //     englishName: 'News',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/news-list'
      //   },
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

      //   {
      //     englishName: 'Law Dept Lawyer',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/law-dept-lawyer'
      //   },
      //   {
      //     englishName: 'Law Dept Office',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/law-dept-office'
      //   },
      //   {
      //     englishName: 'Law Dept Sign Authority',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/law-dept-signature-authority'
      //   },
      //   {
      //     englishName: 'Law Dept cc',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/law-dept-cc'
      //   },
      //   {
      //     englishName: 'Grouping',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/grouping'
      //   },
      //   {
      //     englishName: 'Fee Slab',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/fee-slab'
      //   },
      //   {
      //     englishName: 'Head',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/head'
      //   },
      {
        englishName: 'Requested Info',
        icon: 'fa fa-angle-double-right',
        linkPage: 'master/requested-info'
      },
      //   {
      //     englishName: 'Lawyer Bank',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/lawyer-bank-list'
      //   },
      //   {
      //     englishName: 'Lawyer Verified By',
      //     icon: 'fa fa-angle-double-right',
      //     linkPage: 'master/lawyer-verified-by-list'
      //   },
      // {
      //     englishName : 'Add District',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'master/add-district'
      // },
      // {
      //     englishName : 'Add Division',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'master/add-division'
      // },
      // {
      //     englishName : 'Add Place',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'add-place'
      // },
      // {
      //     englishName : 'Add State',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'add-state'
      // },
      // {
      //     englishName : 'Tehsil',
      //     icon : 'fa fa-angle-double-right',
      //     linkPage : 'master/tehsil'
      // },

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
      // {
      //   icon: 'fa fa-angle-double-right',
      //   englishName: 'Complaint Register',
      //   linkPage: 'case/complaint-register'
      // },
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

      // ================= SUMMARY =================
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