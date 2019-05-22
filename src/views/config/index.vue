<template>
  <div class="big-custom-tab-wrap fixed">
    <div class="tab-header">
      <ul class="clearfix">
        <li
          v-for="v in tabArr"
          class="tab-item"
          :class="{'active':$route.name===v.route}"
          @click="jump(v.route)"
        >
          {{v.name}}
        </li>
        <i @click="backHome" class=" tab-header-right home-icon font_family icon-home"></i>
      </ul>
    </div>
    <div class="tab-content fixed">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // activeTab: '',
      tabArr: [{
        route: 'personInfo',
        name: '个人信息'
      }, {
        route: 'password',
        name: '账户密码'
      }]
    }
  },
  methods: {
    jump(route) {
      this.$router.push({
        name: route
      });
    },
    backHome(){
      this.$router.push('/');
    }
  }
}
</script>
<style lang="less" scoped>
.home-icon.tab-header-right {
  font-size: 24px;
  color: #2493f8;
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    opacity: 0.8;
  }
}
</style>

