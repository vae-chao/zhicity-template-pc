<template>
    <div class="common-select">
        <span v-if="label">{{ label }}</span>
        <el-select :value="value"
                   :placeholder="placeholder"
                   :disabled="disabled"
                   :multiple="multiple"
                   :clearable="clearable"
                   :size="size"
                   @change="$emit('change', $event)"
                   @clear="$emit('clear', $event)">
            <el-option
                v-for="item in optionsMap"
                :key="item[optionValue] || item.value"
                :label="item[optionLabel] || item.label"
                :value="item[optionValue] || item.value"
                :disabled="item.disabled">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: 'commonSelect',
        model: {
            event: 'change'
        },
        props: {
            label: String,
            value: [String, Number, Boolean],
            placeholder: String,
            optionsMap: Array,
            optionValue: [String, Number],
            optionLabel: String,
            disabled: Boolean,
            multiple: Boolean,
            clearable: Boolean,
            size: {
                type: String,
                default: 'small'
            }
        },
    }
</script>

<style scoped lang="scss">
    .common-select {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        & > span {
            padding-right: 10px;
            white-space: nowrap;
        }

        .el-select {
            width: 100%;
        }
    }
</style>

