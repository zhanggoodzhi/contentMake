<template>
  <div class="big-custom-tab-wrap">
    <div class="tab-header">
      <ul class="clearfix">
        <li
          v-for="v in formatArr"
          class="tab-item"
          :class="{'active':$route.name===v.route}"
          @click="jump(v.route)"
        >
          {{v.name}}
        </li>
      </ul>
      <Button
        @click="jumpToSelectTemplate"
        class="tab-header-right"
        type="warning"
      >创建试卷</Button>
    </div>
    <div class="tab-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabArr: [
        {
          route: "paperToDo",
          name: "未完成"
        },
        {
          route: "papertoBeRelease",
          name: "待验收"
        },
        {
          route: "paperReleased",
          name: "已发布"
        },
        {
          route: "papertoVerify",
          name: "待审核"
        }
      ],
      kaola_tabArr: [
        {
          route: "paperToDo",
          name: "未完成"
        },
        {
          route: "papertoVerify",
          name: "待审核"
        },
        {
          route: "paperReleased",
          name: "已发布"
        },
      ]
    };
  },
  computed:{
    formatArr(){
      if(this.ifkaola()){
        return this.kaola_tabArr;
      }
      return this.tabArr;
    }
  },
  methods: {
    jumpToSelectTemplate() {
      this.$router.push({
        name: "selectTemplate"
      });
    },
    jump(route) {
      this.$router.push({
        name: route
      });
    }
  }
};
</script>


