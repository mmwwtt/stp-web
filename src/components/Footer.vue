<template>
  <br>
  <div class="footer">
    <div class="context">
      <div class="wx">
        <img src="../imgs/wx.jpg" alt="" ><br>
        添加微信
      </div>
      <div class="info">
        <p><span>联系方式:</span>15988487590</p>
        <p><span>邮箱:</span>2310607361@qq.com </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="less">
.footer{
  margin-top: 100px;
  width: 100%;
  height: 230px;
  background-color: #65a15a;
  padding: 20px 0 50px 0;
  font-size: 18px;
  .context{
    height: 170px;
    display: inline-block;
    .wx{
      float: left;
      margin-right: 150px;
      img {
        width: 150px;
        height: 150px;
      }
    }
    .info{

      margin: 50px 0;
      float: left;
      text-align: left;
      p{
        span{
          display: inline-block;
          text-align: right;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
