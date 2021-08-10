<template>
    <i @click="onClickCollapse()" :class="state.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
</template>

<script>
    export default {
        name: 'IsCollapse',
        data() {
            return {
                state: this.$store.state
            }
        },
        methods: {
            onClickCollapse() {
                this.$store.commit('setIsCollapse')
            }
        }
    }
</script>

<style scoped lang="scss">
    i {
        font-size: 18px;
        cursor: pointer;
        margin-right: 10px;
    }
</style>