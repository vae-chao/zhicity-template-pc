<template>
    <div class="layout-page">
        <top-bar></top-bar>
        <div class="page-main">
            <side-bar class="side-bar"></side-bar>
            <div class="main-content">
                <router-view class="child-view"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import TopBar from "../../components/TopBar";
    import SideBar from '../../components/sidebar/Index.vue';

    export default {
        name: 'index',
        components: {
            TopBar,
            SideBar
        }
    }
</script>

<style scoped lang="scss">
    .layout-page {
        height: 100%;
        position: relative;

        .page-main {
            height: 100%;
            padding-top: $menuHeight;
            /*overflow: hidden;*/
        }
    }

    .side-bar {
        float: left;
    }

    /* sidebar 宽度 与  child-view 最小宽度息息相关*/
    .child-view {
        width: 100%;
        height: 100%;
        min-width: 1098px;
    }

    .main-content {
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;
        position: relative;
    }
</style>