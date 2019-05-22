<template>
  <div class="h100">
    <div class="mw h100">
      <div
        v-if="$route.name!=='paperPreview'"
        class="header w100"
      >
        <div class="layout-center clearfix">
          <div class="left">
            <img
              src="/img/logo2.png"
              alt=""
            >
            <span class="vm">英语听说校园版内容制作系统</span>
          </div>
          <div class="nav-wrap">
            <ul class="clearfix">
              <template v-for="v in menu">
                <li
                  v-if="canShow(v)"
                  class="nav-item"
                  :class="{'active':activeNav===v.route}"
                  @click="jump(v.route)"
                >{{v.name}}</li>
              </template>
            </ul>
          </div>
          <div class="right">
            <Dropdown
              trigger="click"
              class="layout-basket-drop"
              placement="bottom-end"
              @on-visible-change="droupDownShow"
            >
              <a href="javascript:void(0)">
                <Badge
                  :count="BasketCountList!=null ? BasketCountList.TotalCount: 0"
                  class="vm layout-badge"
                  type="warning"
                >
                  <div :class="basketCss">
                    <i class="vm font_family icon-template_list_basket"></i>
                    <span class="vm">试题篮</span>
                  </div>
                </Badge>
              </a>
              <DropdownMenu
                slot="list"
                :trigger="droupDownShow"
              >

                <div
                  class="empty"
                  v-if="BasketCountList==null || BasketCountList.BasketCountItems==null || BasketCountList.BasketCountItems.length == 0"
                >
                  <img
                    src="/img/none-small.png"
                    alt=""
                    class="image"
                  >
                  <div class="text">暂无内容!</div>
                </div>
                <div
                  class="basketcount"
                  v-if="BasketCountList!=null && BasketCountList.BasketCountItems!=null"
                >
                  <div
                    v-for="area in BasketCountList.BasketCountItems"
                    class="droup-item"
                  >

                    <div class="areatype vm">{{formatAreaType(area.AreaType)}}</div>
                    <div class="area-count-container vm">
                      <span class="areacount vm">{{area.Count}}</span>
                      <span class="areatitle vm">&nbsp;题</span>
                    </div>
                    <div
                      class="areadelete vm"
                      @click="deleteAreaCount(area.AreaType)"
                    >
                      <i class="del-icon option-icon font_family icon-template_delete_normal"></i>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
            </Dropdown>
            <Dropdown
              v-if="!ifkaola()"
              @on-click="clickDropDown"
              class="layout-head-icon-drop"
              @on-visible-change="changeArrow"
              trigger="click"
            >
              <a href="javascript:void(0)">
                <div class="drop-down vm">
                  <div class="head-icon vm">
                    {{headFont}}
                  </div>
                  <Icon
                    :class="{'active':headArrowState}"
                    class="arrow"
                    type="ios-arrow-down"
                  />
                </div>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="config">
                  <Icon
                    class="icon vm"
                    type="ios-settings-outline"
                  /><span class="vm">账号设置</span></DropdownItem>
                <DropdownItem name="logout">
                  <Icon
                    class="icon vm"
                    type="ios-exit-outline"
                  /><span class="vm">退出登录</span></DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div
              v-else
              @click="jumpToKaola"
              class="drop-down icon-wrap vm"
            >
              <img
                :src="headiconSrc"
                class="head-icon vm"
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="big-content w100"
        :class="{'full':$route.name==='paperPreview'}"
      >
        <div
          class="layout-center"
          :class="{'full':$route.name==='paperPreview'}"
        >
          <Spin
            size="large"
            fix
            v-if="showGlobLading"
          ></Spin>
          <router-view
            v-if="routeComponentAlive"
            ref="content"
            class="main-body"
          >
          </router-view>
        </div>
      </div>
      <div class="footer w100 clearfix">
        <p>苏ICP备14027754号-3 苏州驰声信息科技有限公司 Copyright © 2016-2019 All Rights Reserved</p>
        <p>苏公网安备 32059002001978号</p>
      </div>
    </div>
    <div class="right-tool-wrap">
      <div
        class="item blue"
        @click="openUrl('http://service.private.tts.chivoxapp.com')"
      >
        <img
          src="/img/logo.png"
          alt=""
        >
        <div class="text-wrap">
          <p>在线文字转</p>
          <p>语音工具</p>
        </div>
      </div>
      <div
        class="item green"
        @click="openUrl('http://service.private.tts.chivoxapp.com')"
      >
        <img
          src="/img/logo.png"
          alt=""
        >
        <div class="text-wrap">
          <p>音频剪辑</p>
          <p>工具下载</p>
        </div>
      </div>
    </div>
    <loadingBarModal></loadingBarModal>
    <RedConfirmModal></RedConfirmModal>
  </div>
</template>

<script>
import { bus, updateBasketStateEvent, updateTopBasketEvent } from "@/plugins/bus";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import { menu, menu_kaola } from "@/config/menu";
import { getUserData } from "@/plugins/utils";
import loadingBarModal from "@/components/loadingBarModal";
import RedConfirmModal from "@/components/RedConfirmModal";
import {
  userdetail,
  GetAllAbility,
  GetAreaTypeList,
  GetPaperTypeList,
  GetGradeList,
  GetPaperNameList,
  GetMaterialTree,
  GetCountOfAreaType,
  DeleteBasketByAreaType
} from "@/plugins/service";
const qs = require("qs");
export default {
  components: {
    loadingBarModal,
    RedConfirmModal
  },
  data() {
    return {
      menu: this.ifkaola() ? menu_kaola : menu,
      headArrowState: false,
      activeNav: "",
      userData: null,
      basketCss: "basket"
    };
  },
  created() {
    this.userData = getUserData();
    this.getUserDetail();
    this.figuerNavActive(this.$route);
    bus.$on(updateTopBasketEvent, () => {
      this.getBasketCount();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.figuerNavActive(to);
    next();
  },
  mounted: function () {
    if (this.Ability.Lv1 == null) {
      GetAllAbility().then(d => {
        const data = d.ResponseData;

        this.changeAbility(data);
      });
    }
    //题型
    if (this.AreaTypeList == null) {
      GetAreaTypeList("1").then(d => {
        const data = d.ResponseData;
        this.changeAreaType(data);
      });
    }
    //试卷类型
    if (this.PaperTypeList == null) {
      GetPaperTypeList().then(d => {
        const data = d.ResponseData;

        this.changePaperType(data);
      });
    }
    //年级
    if (this.GradeList == null) {
      GetGradeList().then(d => {
        const data = d.ResponseData;

        this.changeGrade(data);
      });
    }
    //试卷列表
    if (this.PaperNameList == null) {
      GetPaperNameList("1").then(d => {
        const data = d.ResponseData;

        this.changePaperName(data);
      });
    }
    //教材树
    if (this.MaterialTree == null) {
      GetMaterialTree().then(d => {
        const data = d.ResponseData;

        this.changeMaterialTree(data);
      });
    }
    //当前用户试题篮
    this.getBasketCount();
  },
  computed: {
    ...mapState([
      'routeComponentAlive',
      "showGlobLading",
      "userDetail",
      "Ability",
      "AreaTypeList",
      "PaperTypeList",
      "GradeList",
      "PaperNameList",
      "MaterialTree",
      "BasketCountList"
    ]),
    headiconSrc() {
      const headPic = this.getLSUserData().headPic;
      if (headPic) {
        return window.KAOLA_API_URL + headPic;
      }
      return '/img/defaultuser.png';
    },
    headFont() {
      const name = this.userDetail && this.userDetail.NickName;
      if (!name) {
        return "";
      } else {
        return name[name.length - 1];
      }
    }
  },
  methods: {
    droupDownShow(visible) {
      this.basketCss = visible ? "basket-droup" : "basket";
    },
    ...mapMutations([
      "changeUserDetail",
      "changeAbility",
      "changeAreaType",
      "changePaperType",
      "changeGrade",
      "changePaperName",
      "changeMaterialTree",
      "changeBasketCountList"
    ]),
    jumpToKaola() {
      window.open(window.KAOLA_API_LOGIN_URL);
    },
    figuerNavActive(route) {
      const arr = route.matched;
      for (const v of this.menu) {
        if (arr.find(sv => sv.name === v.route)) {
          this.activeNav = v.route;
          return;
        }
        this.activeNav = "";
      }
    },
    getUserDetail() {
      userdetail({ userID: this.userData.userID }).then(data => {
        this.changeUserDetail(data);
      });
    },
    changeArrow() {
      this.headArrowState = !this.headArrowState;
    },
    jump(route) {
      this.$router.push({
        name: route
      });
      this.activeNav = route;
    },
    clickDropDown(v) {
      if (v === "config") {
        this.$router.push({ name: "config" });
        return;
      }
      if (v === "logout") {
        this.$router.push({ name: "login" });
        return;
      }
    },
    openUrl(url) {
      window.open(url);
    },
    canShow(v) {
      if (v.route === "template" && this.getLSUserData().userType == 5) {
        return false;
      }
      return true;
    },
    getBasketCount() {
      GetCountOfAreaType().then(d => {
        const data = d.ResponseData;
        this.changeBasketCountList(data);
      });
    },
    async deleteAreaCount(areatype) {
      const d = await DeleteBasketByAreaType(areatype);
      if (d.Success) {
        this.getBasketCount();
        this.$Message.success(d.State);
        bus.$emit("updateBasketStateEvent");
      }
    }
  },
  beforeDestroy() {
    bus.$off("updateBasketStateEvent");
    bus.$off(updateTopBasketEvent);
  }
};
</script>

<style scoped lang="less">
@minwidth: 1198px;
.mw {
  min-width: @minwidth;
}
.layout-center {
  width: @minwidth;
  margin: 0 auto;
  &.full {
    width: auto;
  }
}

.big-content {
  min-height: calc(100% - 144px);
  padding-left: 0;
  padding-right: 0;
  padding-top: 17px;
  background: #f7f7f7;
  &.full {
    padding-top: 0;
    min-height: 100%;
  }
}
@media screen and (min-width: 1200px) {
  .header {
    padding-left: calc(100vw - 100%) !important;
    margin-left: calc(100% - 100vw);
    width: 100vw;
  }
}
.header {
  padding-left: 0;
  padding-right: 0;
  line-height: normal !important;
  background-color: #2493f8;
  height: 78px;
  .left {
    padding-top: 20px;
    float: left;
    img {
      width: 109px;
      height: 29px;
      vertical-align: -7px;
    }
    span {
      font-size: 20px;
      margin-left: 8px;
      color: white;
    }
  }
  .nav-wrap {
    height: 100%;
    margin-left: 171px;
    float: left;
    .nav-item {
      transition: all 0.2s;
      float: left;
      width: 130px;
      padding: 28px 0;
      color: white;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      /* font-family: "MicrosoftYaHei"; */
      &.active {
        background-color: #1f7dd3;
        font-weight: bold;
        /* font-family: "MicrosoftYaHei-Bold"; */
      }
      &:hover {
        background-color: #1f7dd3;
      }
    }
  }
  .right {
    padding-top: 23px;
    height: 100%;
    float: right;
    .basket-droup {
      border-right: 1px solid #107bdc;
      text-align: center;
      width: 116px;
      line-height: 33px;
      height: 34px;
      background-color: #ffffff;
      border-radius: 4px 4px 0 0;
      i {
        margin-right: 6px;
      }
      span {
        font-size: 14px;
        color: #2493f8;
      }
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        opacity: 0.8;
      }
    }
    .empty {
      width: 100%;
      height: 120px;
      position: relative;
      .image {
        // margin: 20px;
        width: 80px;
        position: absolute;
        left: 50px;
        top: 38px;
      }
      .text {
        position: absolute;
        right: 50px;
        top: 55px;
        color: #999;
        font-size: 14px;
      }
    }
    .basket {
      border-right: 1px solid #107bdc;
      text-align: center;
      width: 116px;
      line-height: 33px;
      height: 34px;
      background-color: #ffffff;
      border-radius: 4px;
      i {
        margin-right: 6px;
        font-size: 14px;
      }
      span {
        font-size: 14px;
        color: #2493f8;
      }
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        opacity: 0.8;
      }
    }
    .drop-down {
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        opacity: 0.8;
      }
      &.icon-wrap {
        margin-left: 67px;
        background: transparent;
      }
      .head-icon {
        width: 36px;
        height: 36px;
        display: inline-block;
        background: white;
        color: #2493f8;
        font-size: 16px;
        text-align: center;
        line-height: 36px;
        border-radius: 50%;
        box-shadow: 0 0 5px white;
      }
      .arrow {
        margin-left: 3px;
        color: white;
        font-size: 20px;
        transition: all 0.2s;
        &.active {
          transform: rotateZ(180deg);
        }
      }
    }

    .basketcount {
      width: 264px;
      .droup-item {
        border-bottom: dotted 1px #eaeef0;
        padding: 9px 0px;
        &:last-child {
          border-bottom: 0;
        }
      }
      .areatype {
        display: inline-block;
        width: 70%;
        font-size: 14px;
        color: #333333;
      }
      .area-count-container {
        display: inline-block;
        width: 20%;
        .areacount {
          font-size: 16px;
          color: #ff8a00;
        }
      }

      .areatitle {
        font-size: 12px;
        color: #999999;
      }
      .areadelete {
        display: inline-block;
        width: 10%;
        cursor: pointer;
        font-size: 12px;
        color: #999999;
      }
      .arealine {
        //width: 233px;
        height: 1px;
        background-color: #eaeef0;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }
  }
}
.layout-head-icon-drop {
  .icon {
    font-size: 18px;
    margin-right: 5px;
  }
}
.footer {
  padding: 15px 0 !important;
  text-align: center;
  background: #f7f7f7;
  font-size: 12px;
  color: #999999;
}
.del-icon {
  font-size: 13px;
  &:hover {
    opacity: 0.8;
  }
}
</style>
<style lang="less">
.ivu-layout {
  display: block !important;
}
.layout-basket-drop {
  .ivu-select-dropdown {
    padding: 0 15px;
    box-shadow: none;
    border: 1px solid #107bdc;
    border-top: 0;
    margin: 0 !important;
  }
}
.layout-head-icon-drop {
  margin-left: 67px;
  .ivu-dropdown-item {
    transition: all 0.2s;
    &:hover {
      background: white !important;
      span {
        color: #2591f6;
      }
    }
  }
}
.right-tool-wrap {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  .item {
    padding: 12px 10px;
    border-radius: 6px 0px 0px 6px;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &:last-child {
      margin-top: 10px;
    }
    &.blue {
      background-color: #2493f8;
    }
    &.green {
      background-color: #00d05f;
    }
    img {
      width: 36px;
      height: 36px;
      vertical-align: middle;
    }
    .text-wrap {
      margin-left: 5px;
      vertical-align: middle;
      display: inline-block;
      color: #ffffff;
      font-size: 14px;
    }
  }
}
</style>
<style>
.hhhhhhh {
  color: #2493f8;
}
.layout-badge .ivu-badge-count {
  box-shadow: none;
  border: 0;
  background: #ff8a00;
}
</style>


