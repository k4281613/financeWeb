<template>
    <el-container>
        <el-aside width="200px">
            <myaside :items="items"></myaside>
        </el-aside>
        <el-main>
            <nuxt-child/>
        </el-main>
    </el-container>
</template>

<script>
    import myaside from '../../components/aside.vue'

    export default {
        asyncData({redirect}) {
            // redirect('/market/marketCenter');
        },
        components: {
            myaside,
        },
        data() {
            return {
                items: {
                    menus: [
                        {id: 1, name: '筛选器',path:'/market/sizer'}
                    ],
                    submenus: [
                        {
                            id: 2, name: '行情中心', ischildrens: true, childrens: [
                                {id: 1, index: '2-1', name: '市场一览',path:'/market/marketCenter'},
                                {id: 2, index: '2-2', name: '泸深股市',path:'/market/shmarket'},
                                {id: 3, index: '2-3', name: '香港股市',path:'/market/hkmarket'},
                                {id: 4, index: '2-4', name: '美国股市',path:'/market/usmarket'},
                                {id: 5, index: '2-5', name: '债券及回购',path:'/market/debtmarket'},
                                {id: 6, index: '2-6', name: '基金',path:'/market/fundmarket'},
                            ]},
                        {
                            id: 3, name: '买什么', ischildrens: true, childrens: [
                                {id: 1, index: '3-1', name: '今日热门组合',path:'/market/grouphotoday'},
                            ],
                        }
                    ]
                },
            }
        },
        methods: {},
        beforeCreate: function () {
            console.log(this.$route.name)
           // console.log('%cbeforeCreate 钩子执行...', 'color: red; font-size: 20px;');
        },
        created: function () {
            this.$router.push({
                path: '/market/sizer'
            })
            //console.log('%ccteated 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeMount: function () {
           // console.log('%cbeforeMount 钩子执行...', 'color: red; font-size: 20px;');
        },
        mounted: function () {
            //console.log('%cmounted 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeUpdate: function () {
            //console.log('%cbeforeUpdate 钩子执行...', 'color: red; font-size: 20px;');
        },
        updated: function () {
           // console.log('%cupdated 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeDestroy: function () {
            //console.log('%cbeforeDestroy 钩子执行...', 'color: red; font-size: 20px;');
        },
        destroyed: function () {
           // console.log('%cdestroyed 钩子执行...', 'color: red; font-size: 20px;');
        },
    }
</script>

<style>
/*
    .el-aside {
        background-color: #3F3F3F;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }*/
</style>
