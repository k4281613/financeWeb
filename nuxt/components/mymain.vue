<template>
    <div>
        <el-row>
            <el-col :span='6' :offset='9' style="margin-top:50px">
                <el-alert
                        title="@ 联系邮箱  1411380024@qq.com"
                        :closable="false"
                        type="warning">
                </el-alert>
                <el-alert
                        style='margin-top:20px;'
                        title="@ 保定樱花谷网络科技有限公司"
                        :closable="false"
                        type="warning">
                </el-alert>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        name: 'mymain',
        props: ['items'],
        data() {
            return {};
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>
