<template>
    <div class="hotStock"  v-loading="uLoading">
        <h2 style="margin-bottom: 20px">热股榜</h2>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" tab-position="left">
            <el-tab-pane v-for="(item,index) in hotStockData" :key="index" :name="(index+'')">
                <span slot="label">{{item.topic}}</span>
                <p>
                    <el-button type="text" style="margin-right: 50px" @click="gethotstockdata(item.size,item._type,item.type)">1小时内最热</el-button>
                    <i class="el-icon-user"></i>
                    <el-button type="text" style="margin-left: 50px" @click="gethotstockdata(item.size,item._type,item.type+10)">24小时内最热</el-button>
                </p>
                <table>
                    <tbody>
                    <tr v-for="(children,index) in hotStockitem" :key="index"
                        :style="{'color': (children.increment > 0 ? 'red':'green')}"
                        class="hotstockli">
                        <td style="color: black">{{index + 1}}</td>
                        <td style="color: black">{{children.code}}</td>
                        <td style="color: black">
                            <el-link :href="children.url" target="_blank">{{children.name}}</el-link>
                        </td>
                        <td>
                            <i :class="[children.increment > 0 ? 'el-icon-top':'el-icon-bottom']"></i>
                        </td>
                        <td>{{children.value}}</td>
                    </tr>
                    </tbody>
                </table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "hotStock",
        data(){
            return{
                uLoading: true,
                activeName: '0',
                hotStockData: [
                    {topic: '全球', size: 8, _type: 10, type: 10},
                    {topic: '美股', size: 8, _type: 11, type: 11},
                    {topic: '泸深', size: 8, _type: 12, type: 12},
                    {topic: '港股', size: 8, _type: 13, type: 13},
                ],
                hotStockitem: [],
            }
        },
        methods:{
            handleClick(value) {
                console.log(value.index);
                const obj = this.hotStockData[value.index];
                this.gethotstockdata(obj.size, obj._type, obj._type);
            },
            gethotstockdata(size, _type, type) {
                this.uLoading = true;
                this.axios.post(`/posthotstock`, {
                    size: size, _type: _type, type: type
                }).then(res => {
                    this.hotStockitem = res.data.data.items;
                    for (let i = 0; i < this.hotStockitem.length; i++) {
                        this.hotStockitem[i].url = 'https://xueqiu.com/S/' + this.hotStockitem[i].code;
                    }
                    this.uLoading = false;
                })
            }

        },
        mounted() {
            this.gethotstockdata(8, 10, 10);
        }
    }
</script>

<style scoped>
</style>
