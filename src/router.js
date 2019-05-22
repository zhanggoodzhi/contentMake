import iView from "iview";
import * as utils from "@/plugins/utils";
import Vue from "vue";
import Router from "vue-router";
import config from "@/config";
import Layout from "@/views/Layout";
import Login from "@/views/Login";
import view404 from "@/views/404";
import editPaper from "@/views/paper/editPaper";
import selectTemplate from "@/views/paper/selectTemplate";
import paperPreview from "@/views/paper/paperPreview";
import paperToDo from "@/views/paper/paperToDo";
import papertoBeRelease from "@/views/paper/paperToBeRelease";
import paperReleased from "@/views/paper/paperReleased";
import papertoVerify from "@/views/paper/paperToVerify";
import paperIndex from "@/views/paper";
import templateTodo from "@/views/template/todo";
import templateComplete from "@/views/template/complete";
import editTemplate from "@/views/template/editTemplate";
import templateIndex from "@/views/template";
import areaIndex from "@/views/area";
import configIndex from "@/views/config";
import personInfo from "@/views/config/personInfo";
import password from "@/views/config/password";
import blank from "@/components/blank.vue";
import { getToken } from "@/plugins/service";
import setContentStorage from "@/views/setContentStorage";
Vue.use(Router);

const router = new Router({
  mode: config.routerMode,
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/setContentStorage",
      name: "setContentStorage",
      component: setContentStorage
    },
    {
      path: "/",
      name: "layout",
      component: Layout,
      redirect: { name: "paper" },
      children: [
        {
          path: "paper",
          name: "paper",
          component: blank,
          redirect: { name: "paperIndex" },
          children: [
            {
              path: "",
              component: paperIndex,
              name: "paperIndex",
              redirect: { name: "paperToDo" },
              children: [
                {
                  path: "paperToDo",
                  name: "paperToDo",
                  component: paperToDo
                },
                {
                  path: "papertoBeRelease",
                  name: "papertoBeRelease",
                  component: papertoBeRelease
                },
                {
                  path: "paperReleased",
                  name: "paperReleased",
                  component: paperReleased
                }, {
                  path: "papertoVerify",
                  name: "papertoVerify",
                  component: papertoVerify
                }
              ]
            },
            {
              path: "selectTemplate",
              name: "selectTemplate",
              component: selectTemplate,
              children: [
                {
                  path: "recommendTemplate",
                  name: "recommendTemplate",
                  component: papertoBeRelease
                },{
                  path: "myTemplate",
                  name: "myTemplate",
                  component: papertoBeRelease
                }
              ]
            },
            {
              path:
                "editPaper/templateId=:templateId?/paperId=:paperId?/type=:type?",
              name: "editPaper",
              component: editPaper
            },
            {
              path:
                "paperPreview/templateId=:templateId?/paperId=:paperId?/type=:type?",
              name: "paperPreview",
              component: paperPreview
            }
          ]
        },
        {
          path: "template",
          name: "template",
          component: blank,
          redirect: { name: "templateIndex" },
          children: [
            {
              path: "",
              name: "templateIndex",
              component: templateIndex,
              redirect: { name: "templateTodo" },
              children: [
                {
                  path: "todo",
                  name: "templateTodo",
                  component: templateTodo
                },
                {
                  path: "complete",
                  name: "templateComplete",
                  component: templateComplete
                }
              ]
            },
            {
              path: "editTemplate/id=:id?/type=:type?",
              name: "editTemplate",
              component: editTemplate
            },
            {
              path: "templatePreview/id=:id?/type=:type?",
              name: "templatePreview",
              component: editTemplate
            }
          ]
        },
        {
          path: "area",
          name: "area",
          component: areaIndex
        },
        {
          path: "config",
          name: "config",
          component: configIndex,
          redirect: { name: "personInfo" },
          children: [
            {
              path: "personInfo",
              name: "personInfo",
              component: personInfo
            },
            {
              path: "password",
              name: "password",
              component: password
            }
          ]
        }
      ]
    },
    {
      path: "*",
      name: "404",
      component: view404
    }
  ]
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const userData = utils.getUserData();
  if (!userData && to.name !== "login" && to.name != "setContentStorage") {
    // 未登录且要跳转的页面不是登录页
    next({
      name: "login" // 跳转到登录页
    });
  } else {
    next(); // 跳转
  }
});

router.afterEach((to, from) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
