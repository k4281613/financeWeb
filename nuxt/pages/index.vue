<template>
    <el-container>
        <el-header>
            <myheader></myheader><!-- 固定-->
        </el-header>
        <el-container>
            <nuxt-child/>
        </el-container>
<!--        <el-footer style="height: 50px;z-index: 990" >-->
<!--            <el-backtop style="z-index: 999"></el-backtop>-->
<!--            项目地址：https://gitee.com/sise174/creeper.git-->
<!--        </el-footer>-->
    </el-container>
</template>

<script>
    import myheader from '../components/navbar.vue'

    export default {
        /*asyncData({redirect}) {
            redirect('/newIndex/datashow');
        },*/
        components: {
            myheader
        },
        data() {
            return {}
        },
        methods: {},
        created:function(){
            this.$router.push('/newIndex/datashow'); // 页面加载时跳转
        },
        beforeMount: function () {
            // console.log('%cbeforeMount 钩子执行...', 'color: red; font-size: 20px;');
        },
        mounted: function () {
            //console.log('%cmounted 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeUpdate: function () {
            // console.log('%cbeforeUpdate 钩子执行...', 'color: red; font-size: 20px;');
        },
        updated: function () {
            //console.log('%cupdated 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeDestroy: function () {
            //console.log('%cbeforeDestroy 钩子执行...', 'color: red; font-size: 20px;');
        },
        destroyed: function () {
            // console.log('%cdestroyed 钩子执行...', 'color: red; font-size: 20px;');
        },
        head: {
            title: '麦壳社区',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {name: 'keywords', content: '首页,麦壳社区,麦壳,樱花谷,樱花谷科技,软件开发,微信小程序,微信公众号,保定,软件'},
                {
                    name: 'description',
                    content: '麦壳社区主要经营软件定制开发、微信小程序、微信公众号、APP、企业官网、ERP的研发；公司以客户第一-合作共赢为宗旨，旨在为客户提供软件一站式服务'
                },
                {name: 'robots', content: 'all'},
                {name: 'author', content: '麦壳社区技术部'},
                {name: 'copyright', content: '保定樱花谷网路科技有限公司版权所有'},
                {name: 'renderer', content: 'webkit'}
            ],
            link: [
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto'}
            ]
        }
    }
</script>

<style>
    .your-table .el-table__body-wrapper::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    .your-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 3px;
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #a1a3a9;
        border-radius: 3px;
    }

    .el-loading-spinner .el-loading-text {
        color: black;
    }

    .el-loading-spinner i {
        color: black;
    }

    .el-aside {
        z-index: 999;
        background-color: #3F3F3F;
        color: #333;
        text-align: center;
        width: 200px;
        min-height: 100%;
        top: 60px;
        left: 0;
        height: auto;
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .el-main {
        z-index: unset;
        background-color: #E9EEF3;
        padding-top: 80px;
        padding-left: 220px;
        padding-bottom: 60px;
        color: #333;
        text-align: center;
        width: 100%;
        position: absolute;
    }

    .el-header {
        z-index: 999;
        background-color: #545c64;
        color: #333;
        text-align: center;
        line-height: 60px;
        height: 60px;
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .el-footer {
        z-index: 999;
        position: fixed;
        bottom: 0px;
        left: 0;
        background-color: #545c64;
        color: white;
        text-align: center;
        line-height: 60px;
        width: 100%;
        height: 60px;
        padding: 0;

    }

    .el-progress-bar {
        padding: 0;
        margin: 0;
    }

    .el-pager li, .el-pager li.btn-quicknext:hover, .el-pager li.btn-quickprev:hover {
        color: #3F3F3F;
    }

    body {
        background-color: #E9EEF3;
        overflow-y: scroll;
        /*white-space: nowrap;*/
    }

    body > .el-container {
        margin-bottom: 40px;
    }
</style>
