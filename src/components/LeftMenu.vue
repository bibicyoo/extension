<template>
    <el-aside>
      <!--<el-menu :default-openeds="['1', '3']" style="width: 100%; overflow: hidden;">-->
      <el-menu :default-active="activeIndex" @select="handleSelect" :collapse="isCollapse">
        <el-menu-item v-for="(menu, index) in this.menuList" :key="index" :index="menu.index" @click="moveAction(menu.path)">
            <i :class="menu.icon"></i>
            <span slot="title">{{$t(menu.title)}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
</template>
<script>
    export default {
        name: 'leftMenu',
        props: {
            activeIndex: String,
        },
        data() {
            return {
                menuList: [],
                isCollapse: true,
            }
        },
        created() {
            this.$router.options.routes.forEach(route => {
                this.menuList.push({
                    name: route.name
                    , path: route.path
                    , title: route.title
                    , depth: route.depth
                    , index: route.index
                    , icon: route.icon
                    , parentIndex: route.parentIndex
                    , depthList : route.depthList
                })
            })
        },
        methods : {
            moveAction(path) {
                this.$emit("moveAction", path);
            },
            handleSelect() {
                // console.log(key, keyPath);
            },
        }
    };
</script>