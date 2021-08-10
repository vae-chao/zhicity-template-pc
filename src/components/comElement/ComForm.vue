<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="com-form">

    </el-form>
</template>

<script>
    export default {
        name: 'ComForm',
        data() {
            return {
                ruleForm: {},
                rules: {}
            }
        },
        props: {
            labelWidth: String
        }
    }
</script>

<style scoped lang="scss">
</style>