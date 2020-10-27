<template>
    <div class="comment__mod--wonderful" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" style="overflow: auto;height: 300px">
        <div class="comment__list">
            <div class="comment__item" v-for="(data,index) in replies" :key="index">
                <div class="comment__item__main">
                    <el-avatar :size="40" :src="data.profile_image_url"></el-avatar>
                    <div class="comment__item__main__hd">
                        <el-link :href="data.profile" class="user-name" target="_blank">
                            <h4>{{data.screen_name}}</h4>
                        </el-link>
                        <span class="time">{{data.timeBefore}}</span>
                        <blockquote class="comment__item__reply" v-if="data.reply_screenName">
                            <el-link :href="data.reply_comment_profile" class="user-name">
                                <span>@{{data.reply_screenName}}：</span>
                            </el-link>
                            <span v-html="data.reply_comment_text"></span>
                        </blockquote>
                        <p v-html="data.text"></p>
                    </div>
                </div>
                <div class="comment__item__ft">
                    <span>赞({{data.like_count}})</span>
                </div>
            </div>
        </div>
        <p v-if="noMore">没有更多了</p>
    </div>
</template>

<script>
    export default {
        name: "reply_comment_hotDetail",
        props: ['reply_id'],
        data() {
            return {
                count: 0,
                page: 0,
                replies: [],
            }
        },
        computed: {
            noMore() {
                // console.log(this.page,this.max_page)
                return this.page >= this.max_page;
            },
            disabled() {
                return this.noMore
            },
        },
        methods: {
            getmessage() {
                this.axios.post('/postreply_comment', {
                    id: this.reply_id,
                    page: this.page
                }).then(res => {
                    // this.replies = [...this.replies, ...res.data.replies];
                    this.replies = [...this.replies, ...res.data.replies];
                    this.max_page = res.data.max_page;
                    // console.log(this.max_page)
                    console.log(res.data);
                });
            },
            load() {
                // console.log(this.page);
                    this.page += 1;
                    this.getmessage() //调用接口，此时页数+1，查询下一页数据
            }
        },
        mounted() {
            /*this.axios.post('/postreply_comment', {
                id: this.reply_id,
                page:1
            }).then(res => {
                this.replies = res.data.replies;
                console.log(res.data);
            });*/
        }
    }
</script>

<style scoped>
    .infinite-list {
        height: 300px;
    }
</style>
