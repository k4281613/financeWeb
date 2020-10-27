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
            //redirect('/newtoday');
        },
        components: {
            myaside,
        },
        data() {
            return {
                items: {
                    menus: [
                        {id: 1, name: '名人访谈',path:'/essence/SnowTalking'},
                        {id: 2, name: '找人',path:'/essence/counselor'},
                    ],
                    submenus: [
                        {
                            id: 3, name: '资讯中心', ischildrens: true, childrens: [
                                {id: 1, index: '3-1', name: '雪球热帖',path:'/essence/snowhotnew'},
                                {id: 2, index: '3-2', name: '7*24',path:'/essence/SevenMultiptDay'},
                                {id: 3, index: '3-3', name: '热股榜',path:'/essence/hotStock'},
                                {id: 4, index: '3-4', name: '热门新闻',path:'/essence/hotnew'},
                                {id: 5, index: '3-5', name: '热门公告',path:'/essence/hotnotice'},
                            ],
                        }
                    ]
                },
            }
        },
        methods: {},
        beforeCreate: function () {
            console.log(this.$route.name)
            //console.log('%cbeforeCreate 钩子执行...', 'color: red; font-size: 20px;');
        },
        created: function () {
            this.$router.push({
                path: '/essence/SnowTalking'
            })
            //console.log('%ccteated 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeMount: function () {
            //console.log('%cbeforeMount 钩子执行...', 'color: red; font-size: 20px;');
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
            // console.log('%cbeforeDestroy 钩子执行...', 'color: red; font-size: 20px;');
        },
        destroyed: function () {
            // console.log('%cdestroyed 钩子执行...', 'color: red; font-size: 20px;');
        },
    }
</script>

<style>
/*    .el-aside {
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
