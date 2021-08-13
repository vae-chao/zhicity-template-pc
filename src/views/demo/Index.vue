<template>
    <div class="view-demo">
        <ComBreadcrumb></ComBreadcrumb>

        <div class="demo-index p20">
            <ComTable :columns="columns" :data="tableData" :pager="page" :loading="listLoading"
                      @getAjaxMethod="getList"
                      @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"
                      :header-cell-style="{'background-color': '#E8ECF1', color: '#474747',}">
                <template slot="table_back">
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button>{{scope.row.roleDesc}}</el-button>
                        </template>
                    </el-table-column>
                </template>
            </ComTable>
        </div>
    </div>
</template>

<script>
    import {getTransitPageListAPI} from '../../request/api.js';

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
                    layout: 'total, sizes, prev, pager, next, jumper'
                },
            }
        },
        methods: {
            async getList(obj) {
                console.log('obj',obj)
                let {params, method} = obj;
                let {data, code, message} = await getTransitPageListAPI({...params});
                method({data, code, message});
                /*if (Number(code) === 0) {
                    console.log('data', data)
                    this.tableData = data && data.list;
                } else {
                    this.$message.error(message)
                }*/
            },
            // 翻页处理
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.getList();
            },
            // 展示条数
            handleSizeChange(val) {
                this.page.currentPage = 1;
                this.page.pageSize = val;
                this.getList(val);
            }
        },
        created() {
            // this.getList()
        }
    }
</script>

<style scoped lang="scss">
    .demo-index {
        margin: 20px;
    }
</style>