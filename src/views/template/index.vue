<template>
  <div class="big-custom-tab-wrap">
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
      </ul>
      <Button
        @click="jumpToEdit"
        class="tab-header-right"
        type="warning"
      >创建模板</Button>
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
      tabArr: [{
        route: 'templateTodo',
        name: '未完成'
      }, {
        route: 'templateComplete',
        name: '已完成'
      }]
    }
  },
  methods: {
    jumpToEdit() {
      this.$router.push({
        name: 'editTemplate',
        // params:{
        //   type:'prop'
        // }
      });
    },
    jump(route) {
      this.$router.push({
        name: route
      });
    }
  }
}
</script>
<style>
</style>


