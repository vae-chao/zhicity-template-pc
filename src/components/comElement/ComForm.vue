<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="com-form">
        <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
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