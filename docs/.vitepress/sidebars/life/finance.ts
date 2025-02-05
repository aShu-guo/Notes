export default {
  '/life/finance/': [
    {
      text: '金融学学习',
      link: '/life/finance/',
      items: [
        {
          text: '396经济学综合',
          link: '/life/finance/396/',
          items: [{ text: '函数', link: '/life/finance/396/chapter-1' }],
        },
        {
          text: '431金融学',
          link: '/life/finance/431/',
          items: [
            {
              text: '货币金融学',
              link: '/life/finance/431/monetary-finance/',
              items: [
                {
                  text: '货币与货币制度',
                  link: '/life/finance/431/monetary-finance/chapter-1',
                },
                {
                  text: '信用与金融（补充）',
                  link: '/life/finance/431/monetary-finance/chapter-1.1',
                },
                {
                  text: '金融体系概述',
                  link: '/life/finance/431/monetary-finance/chapter-2',
                },
                {
                  text: '利率',
                  link: '/life/finance/431/monetary-finance/chapter-3',
                  items: [
                    {
                      text: '经济学学派',
                      link: '/life/finance/431/monetary-finance/chapter-3.1',
                    },
                    {
                      text: '凯恩斯利率决定理论',
                      link: '/life/finance/431/monetary-finance/chapter-3.2',
                    },
                  ],
                },
              ],
            },
            {
              text: '公司理财',
              link: '/life/finance/431/company-finance/',
              items: [
                {
                  text: '会计报表',
                  link: '/life/finance/431/company-finance/chapter-1',
                },
                {
                  text: '企业经营能力分析',
                  link: '/life/finance/431/company-finance/chapter-2',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
