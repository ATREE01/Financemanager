export const SidebarData =[
    {
        title: "總覽",
        path: "/Dashboard",
    },
    {
        title: "收支紀錄",
        childrens:[
            {
                title: "總覽",
                path: "IncomeAndExpenditure/Dashboard"
            },
            {
                title: "明細",
                path: "IncomeAndExpenditure/Detail"
            }
        ]
    },
    {
        title: "金融機構",
        childrens:[
            {
                title:"總覽",
                path:"Bank/Dashboard"
            },
            {
                title:"明細",
                path:"Bank/Detail"
            },
            {
                title:"定存",
                path:"Bank/TimeDeposit"
            }
        ]
    },
    {
        title: "投資",
        path: ""
    },
    {
        title: "外幣管理",
        path: "currency"
    },
    {
        title: "貸款",
        path: ""
    },
    {
        title: "保險",
        path: ""
    },
    {
        title: "試算功能",
        path: ""
    },
]