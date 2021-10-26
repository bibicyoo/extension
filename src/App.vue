<template>
  <div id="app">
    <TopTitle id="topTitle" @moveAction="moveAction"/>
    <el-container>
      <LeftMenu id="leftMenu" @moveAction="moveAction" :activeIndex="activeIndex" />
      <div id="rightBody">
        <router-view id="mainPage" :key="$route.fullPath"/>
      </div>
    </el-container>
  </div>
</template>

<script>
  import LeftMenu from '@/components/LeftMenu.vue';
  import TopTitle from '@/components/TopTitle.vue';
  import CmUtils from '@/assets/common/cmUtils'

  export default {
    name: 'App',
    components: {
      LeftMenu,
      TopTitle,
    },
    data() {
        return {
            tagetPath: 'init',
            activeIndex: '0',
            userTagList:[
              {tagNm: '운영', tagType: 'success'},
              {tagNm: '긴급', tagType: 'info'},
              {tagNm: '반영', tagType: 'warning'},
              {tagNm: '결제', tagType: 'danger'},
              {tagNm: '기타', tagType: 'danger'}
            ]
        }
    },
    mounted () {
      /**벌크데이터 */
      CmUtils.setStorageByArray(CmUtils.tableList.tag, this.userTagList, 'tagNm');

      const that = this;
      CmUtils.getStorage(CmUtils.tableList.tagetPath).then(function (value) {
        that.tagetPath = value;
      });
    },
    watch : {
      tagetPath: function() {
        if (this.tagetPath === undefined || this.tagetPath == null) {
          this.tagetPath = '/';
        }
        this.moveAction(this.tagetPath);
      },
    },
    methods : {
      async moveAction(path) {
          let currentPath = this.$router.history.current.fullPath;
          if (path !== null && path !== 'none') {
              if (currentPath != path){
                  let pathValid = path.indexOf('?');
                  await CmUtils.setStorage(CmUtils.tableList.tagetPath, pathValid > -1 ? path.split('?')[0] : path);
                  this.$router.push(path);
                  this.$router.options.routes.forEach(route => {
                    if (route.path == this.tagetPath) {
                      this.activeIndex = route.index;
                    }
                  });
              }
          }
      },
    }
  }
</script>

<style lang="scss">
@import "./assets/style/style.css";
</style>
