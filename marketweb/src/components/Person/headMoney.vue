<template>
  <div class="headMoney">
    <div class="main_bg">
      <img src="/static/images/person/bg.png">
      <img :src="Person.headImg" v-if="Person.headImg" class="info_img">
      <div class="info_head">
        <div class='head_name'>
          <img src="/static/images/person/guan.png">
          <span v-text="Person.realName||Person.nickName"></span>
        </div>
        <p class="phone" v-text="'电话：'+Person.phone"></p>
        <p class="email" v-text="'邮箱：'+Person.email"></p>
      </div>
      <div class="main_money">
        <div class="money_info">
          <div class="info_jifen">
            <span v-text="'累计积分：'+(Person.totalPoint?Person.totalPoint:0)"></span>
            <span v-text="'可用积分：'+(Person.points?Person.points:0)"></span>
            <span v-text="'已换现金：'+(Person.usedCash?Person.usedCash:0)"></span>
            <span v-text="'可换现金：'+~~(Person.cashs?Person.cashs:0)"></span>
          </div>
        </div>
      </div>
      <img src="/static/images/person/jifen.png" class="main_jifen" @click="goToCompany">
      <img src="/static/images/person/tixian.png" class="main_jifen main_tixian" @click="isWithdraw=true">
    </div>
    <Modal v-model="isWithdraw" @on-ok="ok" @on-cancel="cancel" ok-text="即刻提现" :closable="false" title="积分提现" style="position: relative;padding:0px 15%">
  
      <Row style="text-align:left;padding-left:40px;font-size:1.3em;color:#AEAEAE">
        <div>
          <span>可提积分 {{Person.points}}({{~~Person.cashs}} 元)</span>
          <br>
          <!-- <p>当前提现金额: <span style="color:#131313;font-weight:bolder">{{parseFloat(Person.toCashRate/100*(withdrawPoint>Person.points?Person.points:withdrawPoint)).toFixed(2)}}元</span></p> -->
        </div>
      </Row>
      <Row style="text-align:center;padding-left:40px;">
        <Input v-model="withdrawAmount" style="border-radius:0px;padding:3px;font-size:1.2em;color:#B5B5B5" placeholder="直接输入提现金额">
          <span slot="append">={{Person.toCashRate== void 0?0:Math.ceil(~~withdrawAmount/(Person.toCashRate/100))}}分</span>
        </Input>
      </Row>
      <Row style="text-align:center;font-size:0.8em;padding:10px">
        提现金额不能低于1元，到账金额以提现的积分折现为准
      </Row>
  
    </Modal>
    <Modal v-model="paySuccess" :closable="false" width="1000">
      <p class="modelTitle">
        <img src='/static/images/company/messages.png'>
      </p>
      <p class="modelPic">
        <img src="/static/images/company/success.png">
      </p>
      <p class="modelSuccess">提现成功</p>
      <p class="modelTishi">钱已到帐，请查看钱包</p>
      <p slot="footer" class="modelBack" @click="paySuccess=false">返回当前页面</p>
    </Modal>
    <Modal v-model="payFalse.falseState" :closable="false" width="1000">
      <p class="modelTitle">
        <img src='/static/images/company/messages.png'>
      </p>
      <!-- <p class="modelPic">
        <img src="/static/images/company/success.png">
      </p> -->
      <p class="modelSuccess">{{payFalse.msg}}</p>
      <p class="modelTishi">{{payFalse.msg}}</p>
      <p slot="footer" class="modelBack" @click="payFalse.falseState=false">确定</p>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'headMoney',
  props: ["Person"],
  created() {

  },
  data() {
    return {
      info: {
        name: '巴黎春天',
        logo: '/static/images/a1.png'
      },
      totalPoint: 0,
      points: 0,
      usedCash: 0,
      cashs: 0,
      isWithdraw: false,
      withdrawPoint: 0,
      withdrawAmount: 0,
      paySuccess:false,
      payFalse:{
        falseState:false,
        msg:''
      }
    }
  },
  methods: {
    ok() {
      // this.payFalse.falseState = true
      this.withdrawPoint = Math.ceil(parseInt(this.withdrawAmount) / this.Person.toCashRate * 100)
      if (this.Person.toCashRate <= 0) {
        this.$Message.error('积分兑换率为0，无法兑换')
        return
      }
      if(this.withdrawPoint){
        this.$Message.error('输入的兑换金额不对')
        return
      }
      if (this.withdrawPoint === 0) {
        this.$Message.error("提现积分必须大于0");
        return
      }
      if (this.withdrawPoint * this.Person.toCashRate < 1) {
        this.$Message.error("提现金额必须大于1元")
        return
      }
      this.http.post(this.$store.state.prefix + "/withdraw", {
        withdrawType: 1,
        withdrawPoints: this.withdrawPoint,
        companyId: this.Person.companyId
      }).then(res => {
        if (res.error == false) {
          // this.$Message.success("恭喜你提现成功");
          this.$emit('freshHead', this.Person.companyId)
          this.paySuccess = true
          // this.$Modal.success({
          //   title: "恭喜你提现成功",
          //   content: "恭喜你提现成功"
          // });
        }
        else {
           this.payFalse.falseState = true
           this.payFalse = res.msg
        }
      })
    },
    cancel() {
      this.isWithdraw = false;
    },
    goToCompany() {
      this.$router.push({ path: '/company', query: { companyId: this.Person.companyId } })
    }
  }, watch: {
    Person: {
      handler(val) {
      }, deep: true
    },
    withdrawAmount(nval, oval) {
      if (~~nval > this.Person.cashs) {
        this.withdrawAmount = ~~this.Person.cashs
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .ivu-modal-footer
    border-top none 
  rrem(val){
    return (val/108px)rem
  }
  .ivu-modal-body
    padding 0  
    padding-top rrem(132px)
  .modelTitle
     width rrem(436px)
     height rrem(140px)
     position absolute
     left rrem(295px) 
     top rrem(-70px)
     img
      width 100%
  .modelPic
    width rrem(110px)
    height rrem(110px)
    margin 0 auto
    // margin-top rrem(132px)
    img
      width 100%
  .modelSuccess
    height rrem(101px)
    line-height rrem(101px)
    font-size rrem(44px)
    color #ff017e
    font-weight 600
    text-align center
  .modelTishi
    height rrem(94px)
    line-height rrem(94px)
    color #999999
    font-size rrem(28px)
    text-align center 
  .modelBack
    width rrem(920px)
    height rrem(125px)
    line-height rrem(125px)
    background #ff017e
    text-align center  
    color #fff
    font-size rrem(50px)
    font-weight 600
    margin-bottom rrem(29px)
  .headMoney
    width 100%
    height rrem(645px)
    background url('../../../static/images/company/bg1.png') 100% repeat
    background-size rrem(1080px)
    position relative
    .main_bg
      position absolute
      background #fff
      border-radius rrem(40px)
      top rrem(40px)
      left rrem(40px)
      width rrem(1000px)
      height rrem(570px)
      box-shadow 0 2px 20px 0px rgba(0,0,0,.2)
      img
        height 100%
        width 100%
      .info_img
        position absolute
        top rrem(52px)
        left rrem(60px)
        border rrem(8px) solid #ff007e
        border-radius 100%
        height rrem(193px)
        width rrem(193px)
      .info_head
        position absolute
        left rrem(293px)
        top rrem(90px)
        .head_name
          img
            width rrem(45px)
            height rrem(38px)
          span
            font-size rrem(36px)
            font-weight bold
            color #ff007e
        p
          font-size rrem(32px)
          line-height rrem(40px)
          color #aeaeae
          height rrem(40px)
        .phone
          margin-top rrem(10px)
      .main_money
        top rrem(287px)
        width 100%
        height rrem(220px)
        position absolute
        .money_info
          background #f7f7f7
          border-top-right-radius rrem(100px)
          border-bottom-right-radius rrem(100px)
          height 100%
          width rrem(695px)
          .info_jifen
            padding-left rrem(40px)
            padding-top rrem(38px)
            span
              margin-top rrem(10px)
              font-weight bold
              color #aeaeae
              font-size rrem(32px)
              margin-right rrem(20px)
              width rrem(285px)
              height rrem(60px)
              line-height rrem(60px)
              display inline-block
      .main_jifen
        width rrem(235px)
        height rrem(90px)
        top rrem(290px)
        right rrem(38px)
        position absolute
      .main_tixian
        top rrem(415px)
</style>
