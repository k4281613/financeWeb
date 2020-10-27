<template>
    <div class="hotnewDetail">
        <el-page-header @back="goBack"></el-page-header>
        <div class="article__author">
            <el-avatar shape="square" :size="40" :src="item.profile_image_url"></el-avatar>
            <div class="avatar__article">
                <el-link :href="item.profile" target="_blank">
                    <h4>{{item.user}}</h4>
                </el-link>
                <p>来自{{item.source}} 发布于{{item.created_at}}</p>
            </div>
        </div>
        <h2>{{item.title}}</h2>
        <div style="text-align: right">
            <el-link :href="item.target" target="_blank">
                {{item.target}}
            </el-link>
        </div>
        <el-divider></el-divider>
        <div class="myhotcontext">
            <div v-html="text" class="article__bd__detail"></div>
            <p class="widget-meta__info">{{item.retweet_count}} 转发 · {{item.reply_count}} 评论 · {{item.like_count}} 赞</p>
            <div class="comment__mod--wonderful" v-if="wonderful.count">
                <h3>精彩评论（{{wonderful.count}}）</h3>
                <div class="comment__list">
                    <div class="comment__item" v-for="(data,index) in wonderful.comments" :key="index">
                        <div class="comment__item__main">
                            <el-avatar :size="40" :src="data.profile_image_url"></el-avatar>
                            <div class="comment__item__main__hd">
                                <el-link :href="data.profile" class="user-name" target="_blank">
                                    <h4>{{data.screen_name}}</h4>
                                </el-link>
                                <span class="time">{{data.timeBefore}}</span>
                                <p v-html="data.text"></p>
                            </div>
                        </div>
                        <div class="comment__item__ft">
                            <span>赞({{data.like_count}})</span>
                            <span style="float: right" v-if="data.reply_count">
                                <el-link @click="openReply(data.id,data.reply_count)" class="user-name" target="_blank" type="primary">
                                    查看{{data.reply_count}}条回复
                                </el-link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <el-dialog :visible.sync="dialogVisible" width="80%" v-if="dialogVisible">
                <span slot="title">
                    <h3>查看回复({{reply_comment_count}})</h3>
                </span>
                <reply_comment_hot-detail :reply_id="reply_id"></reply_comment_hot-detail>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <div class="comment__mod--all">
                <h3 id="allTitle">全部评论（{{all.count}}）</h3>
                <div class="comment__list">
                    <div class="comment__item" v-for="(data,index) in all.comments" :key="index">
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
                            <span style="float: right" v-if="data.reply_count">
                                <el-link href="" class="user-name" target="_blank" type="primary">
                                    查看{{data.reply_count}}条回复
                                </el-link>
                            </span>
                        </div>
                    </div>
                    <el-pagination
                            small
                            layout="prev, pager, next"
                            :total="all.count"
                            :page-size="20"
                            :pager-count="5"
                            @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import reply_comment_hotDetail from './reply_comment_hotDetail.vue'

    export default {
        name: "hotnewDetail",
        data() {
            return {
                item: this.$route.query.item,
                text: '',
                wonderful: {},
                all: {},
                dialogVisible: false,
                reply_comment: {},
                reply_comment_count:0,
                reply_id:''
            }
        },
        components: {
            reply_comment_hotDetail
        },
        methods: {
            handleCurrentChange(val) {
                this.comment(this.item.id, val, 'all')
                const anchor = this.$el.querySelector('#allTitle');
                document.documentElement.scrollTop = anchor.offsetTop - 100;
                console.log(`当前页: ${val}`);
            },
            openReply(id,count) {
                console.log(id);
                this.reply_comment_count = count;
                this.reply_id = id;
                this.dialogVisible = true;
            },
            goBack() {
                this.$router.go(-1);//返回上一层
            },
            newDetail() {
                this.axios.post('/posthothotnewDetail', {
                    url: this.item.target
                }).then(res => {
                    this.text = res.data;
                });
            },
            comment(id, page, type) {
                this.axios.post('/postcomment', {
                    id: id,
                    page: page,
                    type: type
                }).then(res => {
                    //console.log(res.data, type);
                    const data = res.data;
                    (type == 'all') ? this.all = data : this.wonderful = data;
                });
            }
        },
        mounted() {
            this.newDetail();
            this.comment(this.item.id, 1, 'wonderful');
            this.comment(this.item.id, 1, 'all');
        }
    }
</script>

<style>
    blockquote {
        margin-left: 2em;
        margin-right: 2em;
    }

    .comment__item__reply {
        margin-top: 12px;
        margin-bottom: 10px;
    }

    .comment__item__reply {
        padding: 10px 12px;
        margin-top: 14px;
        margin-right: 0;
        margin-left: 0;
        line-height: 1.6;
        background: #f9f9f9;
        font-size: 14px;
    }

    .comment__list {
        border-bottom: 0;
    }

    .comment__item {
        padding: 15px 0 10px;
        border-top: 1px solid #edf0f5;
    }

    .comment__item__main {
        display: flex;
        justify-items: flex-start;
        flex-wrap: nowrap;
    }

    .comment__item__main__hd {
        width: 100%;
        margin-left: 10px;
    }

    .comment__item__main__hd user-name {
        margin-bottom: 8px;
        width: 100%;
    }

    .comment__item__main__hd .time {
        float: right;
        font-size: 12px;
        color: #909499;
    }

    .comment__item__main p {
        font-size: 15px;
        line-height: 1.6;
        margin: 5px 0;
        word-break: break-all;
        overflow: hidden;
    }

    .comment__item__ft {
        position: relative;
        display: inline-block;
        padding-left: 48px;
        color: #909499;
        line-height: 1;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-size: 13px;
        width: 100%;
    }

    .comment__mod--wonderful, .comment__mod--all {
        margin-top: 10px;
        text-align: left;
    }

    .comment__mod--wonderful, .comment__mod--all h3 {
        text-align: left;
    }

    .widget-meta__info {
        color: #666c72;
        line-height: 1.5;
        text-indent: 1rem;
        text-align: left;
        margin-top: 10px;
    }

    .article__author {
        margin: 20px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .avatar__article {
        text-align: left;
        font-size: 10px;
        padding-left: 10px;
    }

    .article__bd__detail {
        line-height: 1.8;
        word-wrap: break-word;
        font-size: 14px;
        text-align: justify;
        text-justify: inter-ideograph;
    }

    .ke_img {
        max-width: 100%;
        display: block;
        border: none;
        padding: 0;
        margin: 30px auto;
        cursor: zoom-in;
    }

    .article__bd__detail p {
        margin: 10px 0;
        text-align: justify;
        text-justify: inter-ideograph;
    }


</style>
