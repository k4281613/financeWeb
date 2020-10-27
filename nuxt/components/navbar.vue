<template>
    <div>
        <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-menu-item v-for="item in items" :key="item.id" :index="(item.id+'')" @click="goto(item.path)">
                {{item.name}}
            </el-menu-item>
            <el-menu-item @click="gotologin()" style="float: right" index="5">
                <el-button type="text">登陆</el-button>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name:'navbar',
        data() {
            return {
                activeIndex: '1',
                items:[
                    {id:1,name:'首页',path:'/newIndex/datashow'},
                    {id:2,name:'行情',path:'/market/sizer'},
                    {id:3,name:'精华',path:'/essence/SnowTalking'},
                    {id:4,name:'问答',path:'/questions/hotquestion'},
                ]
            };
        },
        methods: {
            goto(path){
                this.$router.push(path);
            },
            gotologin(){
                this.$router.push('/loginAndres/login');
                this.activeIndex='5';
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            }
        }
    }
</script>
