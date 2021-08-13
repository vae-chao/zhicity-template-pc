<template>
    <div class="common-table">
        <div class="search-condition">

        </div>
        <el-table :data="data"
                  :max-height="maxHeight"
                  :height="height"
                  :border="border"
                  :stripe="stripe"
                  :size="size"
                  :show-header="showHeader"
                  :tooltip-effect="tooltipEffect"
                  :header-row-class-name="headerRowClassName"
                  :header-row-style="headerRowStyle"
                  :header-cell-class-name="headerCellClassName"
                  :header-cell-style="headerCellStyle"
                  @selection-change="handleSelectionChange" v-loading="loading">
            <slot name="table_pre"/>
            <template v-for="(item, index) in columns">
                <el-table-column
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        :align="item.align"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :fixed="item.fixed"
                        :formatter="item.formatter ? item.formatter : formatterValue">
                </el-table-column>
            </template>
            <slot name="table_back"/>
        </el-table>
        <el-pagination
                background
                v-if="isShowPagination"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pager.currentPage"
                :page-size="pager.pageSize"
                :page-sizes="pager.pageSizes"
                :total="pager.totalCount"
                :layout="pager.layout">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'commonTable',
        props: {
            columns: Array,
            data: Array,
            border: Boolean,
            loading: Boolean,
            stripe: Boolean,
            showHeader: {
                type: Boolean,
                default: true
            },
            tooltipEffect: String,
            pager: {
                type: Object,
                default: () => {
                    return {
                        currentPage: 1,
                        pageSize: 10,
                        pageSizes: [10, 20, 30, 40, 50, 100],
                        totalCount: 0,
                        layout: 'total, prev, pager, next, jumper'
                    }
                }
            },
            isShowPagination: {
                type: Boolean,
                default: true
            },
            size: {
                type: String,
                default: 'medium'
            },
            height: [String, Number],
            maxHeight: [String, Number],
            headerRowClassName: [String, Function],
            headerRowStyle: [Object, Function],
            headerCellClassName: [String, Function],
            headerCellStyle: [Object, Function],
        },
        methods: {
            getCurrentAjaxMethod() {
                let params = {};
                this.$emit('getAjaxMethod', {
                    params, method: ({data, code, message}) => {
                        if (Number(code) === 0) {
                            console.log('data', data)
                            this.tableData = data && data.list;
                        } else {
                            this.$message.error(message)
                        }
                    }
                });
            },
            handleSelectionChange(val) {
                this.$emit('handleSelectionChange', val);
            },
            handleSizeChange(val) {
                this.$emit('handleSizeChange', val);
            },
            handleCurrentChange(val) {
                this.$emit('handleCurrentChange', val);
            },
            formatterValue(row, column, cellValue) {
                return cellValue;
            }
        },
        created() {
            this.getCurrentAjaxMethod();
        }
    };
</script>
<style scoped lang="scss">
    .el-pagination {
        text-align: right;
        padding: 20px 0;
        background-color: rgba(0, 0, 0, 0);
    }
</style>
<style lang="scss">
    .el-pagination.is-background {
        .btn-next, .btn-prev {
            background-color: transparent;
            border: 1px solid #D9D9D9;
            font-weight: normal;
        }

        .el-pager {
            li {
                background-color: transparent;
                border: 1px solid #D9D9D9;
                font-weight: normal;

                /* &:not(.disabled) {
                     &:hover {
                         color: #008236 !important;
                     }

                     &.active {
                         background-color: #008236 !important;
                         border-color: #008236 !important;

                         &:hover {
                             color: #FFFFFF !important;
                         }
                     }
                 }*/
            }
        }
    }
</style>
