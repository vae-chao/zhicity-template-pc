<template>
    <div class="com-pdf" :id="id" :style="'height:' + height">
        暂无数据
    </div>
</template>

<script>
    export default {
        name: 'ComPdf',
        props: {
            id: {
                type: String,
                default: 'node-pdf'
            },
            height: {
                type: String,
                default: '500px'
            },
            url: {
                type: String,
                required: true
            }
        },
        mounted() {
            this.$nextTick(() => {
                PDFObject.embed(this.url, `#${this.id}`);
            })
        },
    }
</script>
