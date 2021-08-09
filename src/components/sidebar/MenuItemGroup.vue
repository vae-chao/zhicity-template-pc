<template>
    <el-menu-item-group>
        <template slot="title" v-if="groupName">{{groupName}}</template>
        <el-menu-item :index="_item.name" v-for="(_item, _index) in item" :key="_index">{{_item.title}}</el-menu-item>
    </el-menu-item-group>
</template>

<script>
    export default {
        name: 'MenuItemGroup',
        props: {
            groupName: String,
            item: {
                type: Array,
                required: true
            }
        }
    }
</script>
