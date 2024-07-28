export const SidebarData = [
  {
    title: "總覽",
    path: "/Dashboard",
  },
  {
    title: "收支紀錄",
    childrens: [
      {
        title: "總覽",
        path: "/inc-exp/dashboard",
      },
      {
        title: "明細",
        path: "/inc-exp/detail",
      },
    ],
  },
  {
    title: "金融機構",
    childrens: [
      {
        title: "總覽",
        path: "/bank/dashboard",
      },
      {
        title: "明細",
        path: "/bank/detail",
      },
      {
        title: "定存",
        path: "/bank/time-deposit",
      },
    ],
  },
  {
    title: "投資",
    childrens: [
      {
        title: "股票總覽",
        path: "/investment/dashboard-stock",
      },
      {
        title: "股票明細",
        path: "/investment/stock-detail",
      },
      {
        title: "股息",
        path: "/investment/dividend",
      },
    ],
  },
  {
    title: "外幣",
    childrens: [
      {
        title: "外幣買賣",
        path: "/currency/transaction",
      },
      {
        title: "外幣管理",
        path: "/currency/manage",
      },
    ],
  },
  // {
  //     title: "使用說明",
  //     path: "Description"
  // }
  // {
  //     title: "貸款",
  //     path: ""
  // },
  // {
  //     title: "保險",
  //     path: ""
  // },
  // {
  //     title: "試算功能",
  //     path: ""
  // },
];
