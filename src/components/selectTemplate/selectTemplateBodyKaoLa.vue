<template>
    <div class="big-custom-tab-wrap">
        <div class="tab-header">
            <ul class="clearfix">
                <li
                    v-for="(v,index) in tabArr"
                    class="tab-item"
                    :class="{'active':v.selected}"
                    @click="jump(v,index+1)"
                >
                    {{v.name}}
                </li>
            </ul>
        </div>
        <div class="tab-content">
            <selectTemplateContainer :Type= currentIndex :renderData= renderData 
            :totalOptionalTemplateCount= totalOptionalTemplateCount 
            :hasNoData= hasNoData
            :loadingData= loadingData
            :ifSearch= ifSearch
            @pageChange="pageChange"
            @pageSizeChange="pageSizeChange"
            @search="search"></selectTemplateContainer>
        </div>
    </div>
</template>

<script>
import selectTemplateContainer from "@/components/selectTemplate/selectTemplateContainer";
export default {
  props: ["renderData","totalOptionalTemplateCount","hasNoData","loadingData","ifSearch"],
  components: {
    selectTemplateContainer
  },
  created() {
  },
  data() {
    return {
      currentIndex: 1,
      tabArr: [
        {
          selected: true,
          name: "推荐模版"
        },
        {
          selected: false,
          name: "我的模版"
        }
      ]
    };
  },
  methods: {
    jumpToEdit() {
      //   this.$router.push({
      //     // name: 'editTemplate',
      //   });
    },
    jump(v,index) {
      this.tabArr.forEach(e => {
        e.selected = false;
      });
      v.selected = true;
      this.currentIndex = index;
      this.$emit('templatesStatusSwitch',index);
    },
    pageChange(index){
      this.$emit('pageChange',index);
    },
    pageSizeChange(size){
      this.$emit('pageSizeChange',size);
    },
    search(name){
        this.$emit('search',name);
    },
  }
};
</script>
<style>
</style>


