'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/home', controller.home.index);
  router.get('/mymoive', controller.snowIndex.videofile);
  //首页
  router.post('/getsonwhotnew', controller.snowIndex.SnowHotNew);
  router.post('/getSevenMultiptDay', controller.snowIndex.SevenMultiptDay);
  router.get('/getdatashow', controller.snowIndex.datashow);
  router.post('/posthotstock', controller.snowIndex.hotstock);
  //精华
  router.get('/getNewSnowTalking', controller.essence.NewSnowTalking);
  router.post('/postOldSonwTakling', controller.essence.OldSonwTakling);
  router.post('/postOldSonwTaklingDetail', controller.essence.OldSonwTaklingDetail);
  router.get('/getcounselorList', controller.essence.counselorList);
  router.post('/postcounselor', controller.essence.counselor);
  router.post('/posthotmessage', controller.essence.hotmessage);
  router.post('/posthothotnewDetail', controller.essence.hotnewDetail);
  router.post('/postcomment', controller.essence.comment);
  router.post('/postreply_comment', controller.essence.reply_comment);
  //行情中心
  router.post('/postlist_sizer', controller.market.getlist);
  router.post('/postIndustriesList', controller.market.IndustriesList);
  router.post('/postScreenerValues', controller.market.screenerValues);
  router.post('/searchValues', controller.market.searchValues);
  router.post('/marketCenterQuote', controller.market.marketCenter);
  router.post('/newStockforeshow', controller.market.newStockforeshow);
  router.post('/marketsort', controller.market.marketsort);
  router.post('/shmarket', controller.market.shmarket);
  router.post('/hkmarket', controller.market.hkmarket);
  router.post('/usmarket', controller.market.usmarket);
  router.post('/debtmarket', controller.market.debtmarket);
  router.post('/fundmarket', controller.market.fundmarket);
  router.post('/grouphotoday', controller.market.grouphotoday);
  router.post('/groupdetail', controller.market.groupdetail);
  router.post('/sendcode', controller.userInfo.sendcode);
  router.post('/login', controller.userInfo.login);
};

