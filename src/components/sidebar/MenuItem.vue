<template>
    <el-submenu :index="item.name" v-if="item.children && item.children.length">
        <template slot="title">
            <i :class="item.icon" v-if="item.icon"></i>
            <span>{{item.title}}</span>
        </template>
        <menu-item-group :item="item.children"></menu-item-group>
    </el-submenu>
    <el-menu-item :index="item.name" v-else>
        <i :class="item.icon" v-if="item.icon"></i>
        <template slot="title">{{item.title}}</template>
    </el-menu-item>
</template>

<script>
    import MenuItemGroup from "./MenuItemGroup";

    export default {
        name: 'MenuItem',
        components: {
            MenuItemGroup
        },
        props: {
            item: {
                type: Object,
                required: true
            }
        }
    }
</script>
