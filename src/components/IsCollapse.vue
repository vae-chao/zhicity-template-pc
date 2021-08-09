<template>
    <i @click="onClickCollapse()" :class="state.isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
</template>

<script>
    import {useStore} from 'vuex';

    export default {
        name: 'IsCollapse',
        setup() {
            const store = useStore();

            function onClickCollapse() {
                store.commit('setIsCollapse');
            }

            return {
                onClickCollapse,
                state: store.state
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