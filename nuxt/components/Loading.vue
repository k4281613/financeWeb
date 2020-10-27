<template>
    <div v-if="Loading"
         style="height: calc(100%);width:calc(100% - 220px);;position:absolute;color: #7F828B;"
         v-loading="Loading"
         element-loading-text="拼命加载数据中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#E9EEF3">
    </div>
</template>

<script>
    export default {
        props: ['Loading'],
        name: "Loading.vue"
    }
</script>

<style scoped>
    .el-loading-spinner .el-loading-text {
        color: black;
    }

    .el-loading-spinner i {
        color: black;
    }
</style>
