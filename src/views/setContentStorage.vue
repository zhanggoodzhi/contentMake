<template>
  <div></div>
</template>
<script>
import { refreshToken } from '@/plugins/axios';
export default {
  data() {
    return {};
  },
  created() {    
    var routerData = this.$route.query;   
    console.log('重定向初始路由',location.href);
    refreshToken(routerData.refresh_token,"/#/"+routerData.directurl);      
  }
};
</script>

