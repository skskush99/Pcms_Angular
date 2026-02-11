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
        linkPage: 'case/case-registration'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Complaint Register',
        linkPage: 'case/complaint-register'
      },
    //   {
    //     // icon : 'fa-solid fa-file',
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Lawyer & OIC',
    //     linkPage: 'case-management/case-oic-lawyer-list'
    //   },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case Lawyer Info(F2)',
      //     linkPage : 'case-management/add-case-lawyer-info'
      // },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Case Hearing',
        linkPage: 'case-management/case-hearing-list'
      },
      {
        icon: 'fa fa-angle-double-right',
        englishName: 'Case Decision',
        linkPage: 'case-management/case-decision-list'
      },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Contempt',
    //     linkPage: 'case-management/case-contempt'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Without Case No',
    //     linkPage: 'case-management/case-without-case-number'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Decided on 1st Hearing',
    //     linkPage: 'case-management/decided-on-1st-hearing'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Documents',
    //     linkPage: 'case-management/case-documents'
    //   },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case OIC Info',
      //     linkPage : 'case-management/add-case-oic-info'
      // },

    //   {
    //     // icon : 'fa-solid fa-file',
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Factual Report',
    //     linkPage: 'case-management/factual-report'
    //   },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Sign Authority',
      //     linkPage : 'case-management/add-sign-authority'
      // },

    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Deleted Case History',
    //     linkPage: 'case-management/deleted-case-history'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Lawyer Merge',
    //     linkPage: 'case-management/lawyer-merge'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Office Merge',
    //     linkPage: 'case-management/office-merge'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'OIC Merge',
    //     linkPage: 'case-management/oic-merge'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Transfer',
    //     linkPage: 'case-management/case-transfer'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Office Transfer',
    //     linkPage: 'case-management/office-transfer'
    //   },
    //   {
    //     icon: 'fa fa-angle-double-right',
    //     englishName: 'Case Delete/Restore',
    //     linkPage: 'case-management/case-delete-restore'
    //   },

      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case Lawyer Info',
      //     linkPage : 'case-management/add-case-lawyer-info'
      // },

      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case Pettioner',
      //     linkPage : 'case-management/case-pettioner'
      // },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case Respondent',
      //     linkPage : 'case-management/case-respondent'
      // },

      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Delete Case',
      //     linkPage : 'case-management/delete-case'
      // },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'Case Registration',
      //     linkPage : 'case-management/add-case-registration'
      // },
      // {
      //     icon : 'fa fa-angle-double-right',
      //     englishName : 'linkPage Case',
      //     linkPage : 'case-management/linkPage-cases'
      // },

    ]
  },
//   {
//     icon: 'fa-solid fa-users-gear',
//     englishName: 'Lawyer Appointment',
//     linkPage: 'z',
//     subMenus: [
//       {
//         icon: 'fa fa-angle-double-right',
//         englishName: 'Lawyer Appointment',
//         linkPage: 'law-dept/lawyer-appointment-list'
//       },
//     ]
//   },
 
 
//   {
//     icon: 'fa-solid fa-pen-nib',
//     englishName: 'Case File Register',
//     linkPage: 'zl',
//     subMenus: [
//       {
//         icon: 'fa fa-angle-double-right',
//         englishName: 'Case File Register',
//         linkPage: 'law-dept/case-file-register-list'
//       },
//       {
//         icon: 'fa fa-angle-double-right',
//         englishName: 'Connected Cases',
//         linkPage: 'law-dept/connected-cases'
//       },
//     ]
//   },


//   {
//     icon: 'fa-solid fa-users-gear',
//     englishName: 'High Court Services',
//     linkPage: 'nz',
//     subMenus: [
//       {
//         icon: 'fa fa-angle-double-right',
//         englishName: 'Cause List',
//         linkPage: 'high-court/cause-list',
//       }
//     ]
//   },
  {
    icon: 'fa-solid fa-users-gear',
    englishName: 'Reports',
    linkPage: 'nz',
    subMenus: [
      //comment By Vishnu 11022026//Start// 
      // {
      //   icon: 'fa-solid fa-file',
      //   englishName: 'Appeal Nigrani Register',
      //   linkPage: 'ma',
      // },
      // {
      //   icon: 'fa-solid fa-file',
      //   englishName: 'Dainik Mukadma Suchi',
      //   linkPage: 'ma',
      // },
      // {
      //   icon: 'fa-solid fa-file',
      //   englishName: 'Witness Entry Report',
      //   linkPage: 'ma',
      // },
      // {
      //   icon: 'fa-solid fa-file',
      //   englishName: 'Prosecution Register-1',
      //   linkPage: 'ma',
      // },
//comment By Vishnu 11022026//End // 
     
      {
        icon: 'fa-solid fa-file',
        englishName: 'Prosecution Return No.1',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Pravivran no.-2',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Pravivran no.-3',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Pravivran no.-3 K',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Pravivaran-3 kha',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Pravivaran -7',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Mahila Atayachar IPC',
        linkPage: 'ma',
      },{
        icon: 'fa-solid fa-file',
        englishName: 'Mahila Atayachar BNS ',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Return-4',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Format-A',
        linkPage: 'ma',
      },
      {
        icon: 'fa-solid fa-file',
        englishName: 'Format-B',
        linkPage: 'ma',
      },
      // {
      //   icon: 'fa-solid fa-users-gear',
      //   englishName: 'Analysis Reports',
      //   linkPage: 'ma',
      // },
    //   {
    //     icon: 'fa-solid fa-users-gear',
    //     englishName: 'Analysis Reports',
    //     linkPage: 'ma',
    //     subsubMenus: [
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Important Cases Report',
    //         linkPage: 'report/important-cases-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Pre Decision Analysis',
    //         linkPage: 'report/pre-decision-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Post Decision Analysis',
    //         linkPage: 'report/post-decision-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Pre Decision Date Wise',
    //         linkPage: 'report/pre-decision-analysis-date-wise-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Lawyer Wise Report (Details)',
    //         linkPage: 'report/lawyer-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Lawyer Performance(Summery)',
    //         linkPage: 'report/lawyer-performance-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'OIC Performance',
    //         linkPage: 'report/oic-performance-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Decision (F/A)',
    //         linkPage: 'report/decision-F_A-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Year Wise Report',
    //         linkPage: 'report/year-wise-analysis-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Contempt Wise',
    //         linkPage: 'report/contempt-wise-analysis-report'
    //       },

    //     ]
    //   },
    //   {
    //     icon: 'fa-solid fa-users-gear',
    //     englishName: 'Details Report',
    //     linkPage: 'msa',
    //     subsubMenus: [
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Court Wise',
    //         linkPage: 'report/court-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Abbreviation Wise',
    //         linkPage: 'report/abbreviation-wise-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Priority Wise',
    //         linkPage: 'report/priority-wise-detail-report'
    //       },

    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Sub Priority Wise',
    //         linkPage: 'report/sub-priority-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Subject Matter Wise',
    //         linkPage: 'report/subject-matter-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Subject Category Wise',
    //         linkPage: 'report/subject-category-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Contempt Wise',
    //         linkPage: 'report/contempt-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Lawyer Performance',
    //         linkPage: 'report/lawyer-performance-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'District Wise',
    //         linkPage: 'report/district-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Stay Order Wise',
    //         linkPage: 'report/stay-order-wise-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'AAG Performance ',
    //         linkPage: 'report/aag-performance-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'AAG Case Details ',
    //         linkPage: 'report/aag-case-detail-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Case Wise SLA ',
    //         linkPage: 'report/case-wise-sla-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'AAG Appointed',
    //         linkPage: 'report/aag-appointed-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'HC/Sc Lawyer\'s Cases',
    //         linkPage: 'report/hc-sc-lawyer-cases'
    //       },
    //     ]
    //   },
    //    {
    //      icon: 'fa-solid fa-users-gear',
    //      englishName: 'Monthly Litigation',
    //      linkPage: 'ma',
    //      subsubMenus: [
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Monthly Status',
    //          linkPage: 'report/monthly-status'
    //        },
    //      ]
    //    },
    //   {
    //     icon: 'fa-solid fa-users-gear',
    //     englishName: 'Pending Cases Report',
    //     linkPage: 'ma',
    //     subsubMenus: [
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Reply Not Filed',
    //         linkPage: 'report/pending-cases-report/reply-not-filed'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Order Pending For Appeal',
    //         linkPage: 'report/pending-cases-report/order-pending-for-appeal-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Decision Not Implemented',
    //         linkPage: 'report/pending-cases-report/decision-not-implemented-report'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Reply Not Filed Upto 3 Months',
    //         linkPage: 'report/pending-cases-report/reply-not-filed-upto-3-months'
    //       },
    //       {
    //         icon: 'fa fa-angle-double-right',
    //         englishName: 'Reply Not Filed More then 3 Months',
    //         linkPage: 'report/pending-cases-report/reply-not-filed-more-then-3-months'
    //       },
    //     ]
    //   },
      // {
      //   icon: 'fa-solid fa-users-gear',
      //   englishName: 'Case File Register',
      //   linkPage: 'ma',
      //   subsubMenus: [
      //     {
      //       icon: 'fa fa-angle-double-right',
      //       englishName: 'CNR Status',
      //       linkPage: 'report/cnr-list'
      //     },
      //     {
      //       icon: 'fa fa-angle-double-right',
      //       englishName: 'Financial Implication Wise',
      //       linkPage: 'report/financial-implication-wise-report'
      //     },
      //     {
      //       icon: 'fa fa-angle-double-right',
      //       englishName: 'Lawyer Summary',
      //       linkPage: 'report/gla-wise-report'
      //     },
      //     {
      //       icon: 'fa fa-angle-double-right',
      //       englishName: 'Duplicate Records',
      //       linkPage: 'report/duplicate-records'
      //     },
      //     {
      //       icon: 'fa fa-angle-double-right',
      //       englishName: 'OIC Appointed Report',
      //       linkPage: 'report/oic-appointed-summary-report'
      //     },
      //   ]
      // },

    //    {
    //      icon: 'fa-solid fa-users-gear',
    //      englishName: 'MIS Reports',
    //      linkPage: 'n',
    //      subsubMenus: [
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Attention Warranted',
    //          linkPage: 'report/action-to-be-taken-dept-wise'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Summary Report',
    //          linkPage: 'report/dashboard-details'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Entry Status',
    //          linkPage: 'report/summary-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Action Pending Report',
    //          linkPage: 'report/action-pending-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Lawyer Performance',
    //          linkPage: 'report/lawyer-performance-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Litigation Review',
    //          linkPage: 'report/litigation-review-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Login Detail Report',
    //          linkPage: 'report/login-detail-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Cases Listed (Date Wise)',
    //          linkPage: 'report/date-wise-case-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'SMS History',
    //          linkPage: 'report/sms-history'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Email History',
    //          linkPage: 'report/email-history-list'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Next Hearing Update History',
    //          linkPage: 'report/next-hearing-updated-list'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'To Be Update Decision Detail',
    //          linkPage: 'report/case-decision-updated-list'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Decision In F/A',
    //          linkPage: 'report/decision-in-fa-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Talking Points',
    //          linkPage: 'report/talking-points'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Dash Board Pendency Reports',
    //          linkPage: 'report/action-to-be-taken-dept-wise-pendency'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'AAG Performance',
    //          linkPage: 'report/aag-perfomance'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Decision Summary',
    //          linkPage: 'report/decision-summary'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Evaluation Report',
    //          linkPage: 'report/evaluation-summary'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Factual Report (Date)',
    //          linkPage: 'report/factual-report-date-wise'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Factual Report (Document)',
    //          linkPage: 'report/factual-report-doc-wise'
    //        },
    //      ]
    //    },
    //    {
    //      icon: 'fa-solid fa-users-gear',
    //      englishName: 'Summary Reports',
    //      linkPage: 'n',
    //      subsubMenus: [
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Deficiency Report',
    //          linkPage: 'report/validation-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Evaluation Report',
    //          linkPage: 'report/evaluation-summary'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'District - Evaluation',
    //          linkPage: 'report/evaluation-summary-district-wise'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Office wise',
    //          linkPage: 'report/office-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Court Wise Report',
    //          linkPage: 'report/court-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'User Registration Report',
    //          linkPage: 'report/user-registration-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Courtplace Wise',
    //          linkPage: 'report/court-place-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Case Not in Check List Wise Report',
    //          linkPage: 'report/case-not-in-check-list-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Priority Wise',
    //          linkPage: 'report/priority-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'SubPriority Wise',
    //          linkPage: 'report/sub-priority-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'CNR Report',
    //          linkPage: 'report/cnr-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Subject Category Wise',
    //          linkPage: 'report/subject-category-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'OIC Wise Report',
    //          linkPage: 'report/oic-wise-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Monthly Entry Status',
    //          linkPage: 'report/monthly-entry-status-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Case Document Report',
    //          linkPage: 'report/case-document-summary-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Reply Filed Report',
    //          linkPage: 'report/reply-filed-summary-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Due Course Report',
    //          linkPage: 'report/due-course-summary-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Pending Deficiency',
    //          linkPage: 'report/pending-deficiency-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Due Course Report Dist. Wise',
    //          linkPage: 'report/due-course-summary-report-dist-wise'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Pending Percentage Report',
    //          linkPage: 'report/pending-document-percentage-report'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Attention Warranted Except Contemp Cases',
    //          linkPage: 'report/action-to-be-taken-dept-wise'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Attention Warranted',
    //          linkPage: 'report/action-to-be-taken-new'
    //        },
    //        {
    //          icon: 'fa fa-angle-double-right',
    //          englishName: 'Attention Warranted Except Contemp Cases New',
    //          linkPage: 'report/action-to-be-taken-deptwise-new-sa'
    //        },
    //      ]
    //    },
    ]
  },
  // {
  //   icon: "fa-regular fa-credit-card",
  //   englishName: 'Lawyer Payment',
  //   linkPage: 'zxl',
  //   subMenus: [
  //     {
  //       icon: 'fa fa-angle-double-right',
  //       englishName: 'Payment Request',
  //       linkPage: 'law-dept/lawyer-payment-request'
  //     },
  //     {
  //       icon: 'fa fa-angle-double-right',
  //       englishName: 'Bill Generate',
  //       linkPage: 'law-dept/lawyer-bill-generate'
  //     },
  //     {
  //       icon: 'fa fa-angle-double-right',
  //       englishName: 'Disposed List',
  //       linkPage: 'law-dept/lawyer-disposed-list'
  //     },
  //   ]
  // },
  
]

export default navData