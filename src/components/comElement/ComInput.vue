<template>
    <div class="common-input">
        <span v-if="label">{{ label }}</span>
        <el-input
                :value="value"
                :type="type"
                :placeholder="placeholder"
                :maxlength="maxlength"
                :minlength="minlength"
                :autocomplete="autocomplete"
                :size="size"
                :suffix-icon="suffixicon"
                :prefix-icon="prefixicon"
                :clearable="clearable"
                @blur="$emit('blur', $event)"
                @focus="$emit('focus', $event)"
                @change="$emit('change', $event)"
                @input="$emit('input', $event)"
                @clear="$emit('clear', $event)">
            <template v-if="unit">
                <span slot="suffix">{{unit}}</span>
            </template>
        </el-input>
        <slot name="input_icon"/>
    </div>
</template>

<script>
    export default {
        name: 'commonInput',
        props: {
            value: [String, Number],
            label: String,
            type: String,
            placeholder: String,
            maxlength: Number,
            minlength: Number,
            size: {
                type: String,
                default: 'small'
            },
            clearable: Boolean,
            unit: String,
            autocomplete: String,// 当值设置为 new-password 时，可以避免浏览器保存的密码自动填充
            suffixicon: String, //输入框尾部图标
            prefixicon: String, //输入框头部图标
        },
        data() {
            return {
                // inputs: null
            }
        },
        methods: {
            onBlur() {
                this.$emit('onBlur', this.inputs)
            }
        },
    }

</script>

<style lang="scss" scoped>
    .common-input {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        & > span {
            padding-right: 10px;
            white-space: nowrap;
        }
    }

    .common-item-input {
        width: 100%;
        display: flex;
        align-items: center;

        & > span {
            white-space: nowrap;
        }
    }


</style>
