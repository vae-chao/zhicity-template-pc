<template>
    <div class="com-breadcrumb">
        <div class="top-breadcrumb">
            <is-collapse></is-collapse>
            <el-breadcrumb :separator="separator" :separator-class="separatorClass">
                <template v-for="(item, index) in breadcrumbList">
                    <el-breadcrumb-item :to="{ name: item.name }" :key="index">{{ item.meta && item.meta.title }}
                    </el-breadcrumb-item>
                </template>
            </el-breadcrumb>
        </div>

        <slot></slot>
    </div>
</template>

<script>
    import IsCollapse from "../IsCollapse.vue";

    export default {
        name: 'Breadcrumb',
        props: {
            separator: String,
            separatorClass: String, // 注意如果设置此项，这将使 separator 设置失效
            breadcrumbData: Array
        },
        components: {
            IsCollapse
        },
        data() {
            return {
                breadcrumbList: []
            }
        },
        created() {
            if (Array.isArray(this.breadcrumbData) && this.breadcrumbData.length) {
                this.breadcrumbList = this.breadcrumbData;
            } else {
                console.log('this.$route', this.$route)
                this.breadcrumbList = (this.$route.matched || []).filter(item => item.name !== 'middleware');
            }
        }
    }
</script>

<style scoped lang="scss">
    .com-breadcrumb {
        background-color: $themeBgColor;
        padding: 20px;
        position: relative;

        /deep/ .el-breadcrumb {
            pointer-events: none;
        }

        .top-breadcrumb {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
    }
</style>