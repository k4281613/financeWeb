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
                        {id: 1, name: '数据展示',path: '/newIndex/datashow'},
                        {id: 2, name: '7*24',path: '/newIndex/SevenMultiptDay'},
                        {id: 3, name: '今日热帖',path: '/newIndex/snowhotnew'},
                    ]
                },
            }
        },
        methods: {},
        beforeCreate: function () {
            console.log(this.$route.name,this.$route.path)
            // console.log('%cbeforeCreate 钩子执行...', 'color: red; font-size: 20px;');
        },
        created: function () {
            this.$router.push({
                path: '/newIndex/datashow'
            })
            //console.log('%ccteated 钩子执行...', 'color: red; font-size: 20px;');
        },
        beforeMount: function () {
            localStorage.setItem('SnowNewRoute',this.$route.path)
            // console.log('%cbeforeMount 钩子执行...', 'color: red; font-size: 20px;');
        },
        mounted: function () {
            // console.log(localStorage.getItem('SnowNewRoute'))
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
