<template>
    <div>
        <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 background-color="#3F3F3F" text-color="#fff" active-text-color="#ffd04b">
            <div v-for="item in items.menus" :key="item.id">
                <el-menu-item :index="(item.id+'')" @click="goto(item.path)">
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
            </div>
            <div v-for="item in items.submenus" :key="item.id">
                <el-submenu :index="(item.id+'')">
                    <template slot="title">
                        <span>{{item.name}}</span>
                    </template>
                    <el-menu-item-group v-if="item.ischildrens">
                        <el-menu-item :index="children.index" v-for="children in item.childrens" :key="children.id" @click="goto(children.path)">
                            {{children.name}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </div>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: 'myaside',
        props: ['items'],
        data() {
            return {};
        },
        methods: {
            goto(path) {
                this.$router.push(path)
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        },
        mounted() {
            console.log(this.items)
        }
    }
</script>
