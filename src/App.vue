<template lang="jade">
#app
  modal-load
  modal-hint
  router-view
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="stylus">
@import './style/app.styl'
.mint-actionsheet-listitem
  color #3d9bff
  font-size 16px
  font-weight 0
.mint-actionsheet-list
  margin-bottom 1px !important
.mint-actionsheet-button
  font-weight 0
  font-size 16px
  color rgb(153,153,153)
.mint-cell-value {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translate(0, -40%);
}
.mint-cell-title {
  padding-left: 35px;
  font-weight:100;
  color: #000;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 15px;
}
.mint-msgbox-cancel{
  color:#333;
}
.mint-checklist .mint-cell-title{
  color:#000 !important
  padding-left:0;
}
.mint-checklist .mint-cell-wrapper{
  padding:0;
}
.mint-checklist .mint-cell-title .mint-checkbox-label{
  margin-left:50px;
}
</style>