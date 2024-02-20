module.exports = {
  title: 'Hello VuePress',
  description: 'Just playing around',
  themeConfig: {
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Demo', link: '/demo/' },
    //   { text: 'External', link: 'https://google.com' },
    // ],
    sidebar: [
      {
        title: 'Home',   // 必要的
        path: '/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1 
      },
      {
        title: 'Demo',
        children: [
          {
            title: 'demo',
            path:'/demo/'
          }
        ],
        initialOpenGroupIndex: -1 // 可选的, 默认值是 0
      }
    ]
  }
}