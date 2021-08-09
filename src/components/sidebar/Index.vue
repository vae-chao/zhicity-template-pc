<template>
    <el-menu class="com-sidebar"
             :default-active="activeMenu"
             :background-color="variablesStyle.menuBg"
             :text-color="variablesStyle.menuText"
             :active-text-color="variablesStyle.menuActiveText"
             :collapse="isCollapse"
             :unique-opened="false"
             :collapse-transition="false"
             mode="vertical"
             @select="onSwitchRouter">
        <menu-item :index="item.name" :key="index" v-for="(item, index) in menuList" :item="item">
        </menu-item>
    </el-menu>
</template>

<script>
    import MenuItem from './MenuItem.vue';
    import variables from '@/assets/scss/variables.scss';

    export default {
        name: 'Sidebar',
        components: {
            MenuItem
        },
        data() {
            return {
                isCollapse: this.$store.state.isCollapse,
                menuList: []
            }
        },
        computed: {
            activeMenu() {
                const route = this.$route;
                const {meta, name} = route;
                return name
            },
            variablesStyle() {
                return variables
            },
        },
        methods: {
            onSwitchRouter(index, indexPath) {
                // console.log('index, indexPath', index, indexPath)
                this.$router.push({
                    name: index
                })
            }
        },
        created() {
            this.menuList = [
                {
                    title: '列表数据',
                    name: 'List',
                    icon: 'el-icon-location'
                },
                {
                    name: 'about',
                    title: '导航二',
                    icon: 'el-icon-menu',
                    children: [
                        {
                            name: 'Data',
                            title: '数据展示',
                        },
                        {
                            name: 'deduceIndex',
                            title: 'Echarts',
                        },
                    ]
                }
            ]
        }
    }
</script>

<style scoped lang="scss">
    .com-sidebar:not(.el-menu--collapse) {
        width: 250px;
        min-width: 250px;
    }

    .com-sidebar {
        height: 100%;
    }
</style>