<template>
    <div class="view-demo">
        <ComBreadcrumb></ComBreadcrumb>

        <div class="demo-index p20">
            <ComTable :columns="columns" :data="tableData" :pager="page" :loading="listLoading"
                      @handleCurrentChange="handleCurrentChange"
                      :header-cell-style="{'background-color': '#E8ECF1', color: '#474747',}">
            </ComTable>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Index',
        data() {
            return {
                columns: [
                    {prop: "index", width: "20"},
                    {prop: "roleName", label: "角色名称", width: "150"},
                    {prop: "roleDesc", label: "权限"},
                    {prop: "createDate", label: "创建时间", align: "center"},
                ],
                tableData: [],
                listLoading: false,
                page: {
                    currentPage: 1,
                    pageSize: 10,
                    pageSizes: [10, 20, 50],
                    totalCount: 0,
                },
            }
        },
        methods: {
            getList() {

            },
            // 翻页处理
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
        }
    }
</script>

<style scoped lang="scss">
    .demo-index {
        margin: 20px;
    }
</style>