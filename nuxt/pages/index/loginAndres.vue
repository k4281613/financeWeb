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
        components: {
            myaside,
        },
        data() {
            return {
                items: {
                    menus: [
                        {id: 1, name: '登陆',path: '/loginAndres/login'},
                        {id: 2, name: '注册',path: '/loginAndres/res'},
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
                path: '/loginAndres/login'
            })
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
