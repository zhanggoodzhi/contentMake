#技术栈

1. [Vue2](https://cn.vuejs.org/v2/guide/)
2. [Vuex](https://vuex.vuejs.org/zh/guide/)
3. [Vue-cli3](https://cli.vuejs.org/zh/guide/)
4. [iView](https://www.iviewui.com/)
5. [axios](https://www.kancloud.cn/yunye/axios/234845)
---
#运行方式

安装依赖 npm install
开发环境 npm run dev
打包项目 npm run build

运行本系统需要Node.js8环境
---
#目录结构

│  .eslintrc.js               **配置Eslint校验**
│  .gitignore                 **git忽略文件**
│  .postcssrc.js              **postcss配置文件，可以对CSS特殊编译，这里没怎么用**
│  babel.config.js            **配置babel,及ES5转ES6**
│  jsconfig.json              **vscode编辑器用的一些配置**
│  package-lock.json          **npm包具体的版本树**
│  package.json               **npm一些基本配置**
│  README.md                  **开发文档**
│  vue.config.js              **额外的webpack配置**
│
├─.vscode                     **vscode编辑器用的一些配置** 
├─public
│  │  config.js               **配置后端API路径**
│  │  index.html              **主网页**
│  │
│  └─img                      **图片**
│
└─src                         **代码目录**
  ├─assets                    **存放iconfont字体文件**
  │  └─iconfont
  ├─components                **组件目录**
  │  ├─areaComponents         **试题页面的组件**
  │  │  └─areas
  │  ├─CustomCollapse         **定制化的折叠面板组件**
  │  ├─editPaper              **编辑试卷模块**
  │  │  ├─AreaBasket
  │  │  │  └─areas
  │  │  ├─PaperBox
  │  │  │  └─areas
  │  │  └─PaperProperty
  │  ├─editTemplate           **编辑模板模块**
  │  │  ├─box
  │  │  │  └─areas
  │  │  └─property
  │  │      └─areas
  │  ├─HoverBox               **带工具栏的div盒子**
  │  ├─InputBox               **带工具栏的input框**
  │  ├─loadingBarModal        **进度条弹框**
  │  ├─PaperAreaCollapse      **试卷编辑中的折叠面板**
  │  ├─paperListItem          **试卷列表组件**
  │  ├─PaperPreviewComponents **试卷预览组件**   
  │  │  └─paperPreviewAreas
  │  ├─QuestionCollapse       **试卷预览中的折叠面板**
  │  ├─RedConfirmModal        **带红色按钮的确认弹框**
  │  ├─selectTemplate         **选择模板组件**
  │  ├─templateComplete       **模板完成列表组件**
  │  ├─templateTodo           **模板未完成列表组件**
  │  └─TipInputNumber         **带文字提示的数字输入框**
  ├─config
  |   ├─index.js              **项目的一些全局配置**
  |   ├─menu.js               **菜单配置**
  ├─plugins
  |   ├─axios.js              **项目的一些全局配置**
  |   ├─bus.js                **eventbus事件配置（用的比较少）**
  |   ├─service.js            **接口配置**
  |   ├─utils.js              **工具函数（由于引入后还要在data里面写一次太麻烦，目前大多转移到src/main.js里了）**
  ├─store
  │  └─module                 **存放vuex状态和函数的目录**
  └─views                     **页面菜单入口组件**
      │  404.vue                    **404页面**
      │  Layout.vue                 **公用布局**
      │  Login.vue                  **登录页**
      │  setContentStorage.vue      **从考拉网跳转过来的重定向页面**
      │
      ├─area
      │      index.vue              **试题页面**
      │
      ├─config
      │      index.vue              **用户菜单**
      │      password.vue           **修改密码**
      │      personInfo.vue         **个人中心**
      │
      ├─paper
      │  │  editPaper.vue           **编辑试卷页**
      │  │  index.vue               **试卷菜单**
      │  │  paperPreview.vue        **试卷预览页**
      │  │  paperReleased.vue       **试卷已发布列表**
      │  │  paperToBeRelease.vue    **试卷未发布列表**
      │  │  paperToDo.vue           **试卷未完成列表**
      │  │  paperToVerify.vue       **试卷待验收列表**
      │  │  selectTemplate.vue      **选择模板页**
      │  │
      │  └─componetDecorate
      │          paperItemDecorate.vue    **试卷列表公用组件**
      │
      └─template
              complete.vue                **模板已完成列表**
              editTemplate.vue            **编辑模板**
              index.vue                   **模板菜单**
              todo.vue                    **模板未完成列表**
---
#注意事项

1. 写less的时候<style></style>标签如果加了scope,代表局部样式，如果想改iview组件的样式，必须去掉scope，但是外层一定要包一个特殊的类，以免影响到其他页面。
2. api地址的配置在public/config.js里面。
3. 组件写在components里面，页面写在views里面，公共方法写在src/main里面。
4. 文件引用，@代表src的绝对路径
5. iconfont 用法：打开public/iconfont/demo_index.html，查看第二种font-class,找类名. 当Button组件这种iview的组件引用iconfont,类名前要加上空格，因为iview会把类名前面加上ivu-icon-,会出现错误