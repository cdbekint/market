<template>
  <div class = "register" v-if="state">
    <div class="main_bg" @click="changeState"></div>

    <div class="main_body" v-if="!payState">
      <div class="body_join">
        <img src="/static/images/active/member.png" alt="">
      </div>
      <div class="body_input" >
      <div class="inviterinfo">
        <div class="inviteravater">
            <img :src="Inviter.headImg" alt="">
          </div>
          <div class="inviternote">
             {{Inviter.realName}}正在邀请你成为会员
          </div>
         
      </div>
          
        <div class="input_name">
          <input type="text" v-model="name" placeholder="   *请输入您的真实姓名（必填）">
        </div>
        <div class="input_num">
          <input type="text" v-model="phone" placeholder="   *请输入您的手机号码（必填）" >
        </div>
        <div class="body_check">
          <img :src="'/static/images/active/'+checkState+'.png'" v-if="isCheck">
          <span>{{msg}}</span>
        </div>
      </div>
      <div class="body_pay" @click="pay">支付{{money}}元成为会员</div>
    </div>

    <div class="main_body payed_body" v-if="payState">
      <div class="body_join">
        <img src="/static/images/active/joinsuccess.png" alt="">
      </div>
      <div class="body_info" >
        <span>恭喜您成为{{company}}会员，众多精彩活动、优质商品在等你喔！</span>
      </div>
      <div class="body_pay payed_pay" @click="changeState">返回当前页面</div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'register',
    props:["datas","state"],
    created(){
      this.name = ''
      this.phone = ''
      this.email = ''
      var state = this.util.getURLParam('state').split(",")
      this.realInviterId=~~(state[2]===undefined?(this.util.getCookie("realInviterId")||window.localStorage["realInviterId"]):state[2])
    },
    watch: {
      datas: {
        handler (val) {
          this.company = val.companyName;
          this.params = {
            inviterId: ~~(this.util.getCookie("realInviterId")||window.localStorage["realInviterId"]),//邀请人信息
            activityId:val.id,//活动id
            companyId: val.companyId//公司id
          }
          if(!this.params.inviterId){
            this.Inviter.realName = this.company
            this.Inviter.headImg = "http://m.market.cdbeki.com/"+val.companyLogoImg
          }else{
            this.getInviterInfo()
          }
          this.params.inviterId=~~this.params.inviterId
          setTimeout(()=>{
            this.http.get(this.$store.state.prefix + '/pubInfo/getCompanyRegisterIno/' + val.companyId).then((res) => {
              if(res.error == false){
                this.money = res.result.registerMoney;
                this.params.payAmount = this.money;
              }
              else{
                this.$Message.error(res.msg)
              }
            })
          },200)
        }
      },
      deep:true
    },
    methods:{
      changeState(){
        this.$emit("childClick",false)
      },
      getInviterInfo(){
        this.http.get(this.$store.state.prefix +'/pubInfo/account?accountId='+ this.realInviterId).then(res=>{
          if(res.error === false)
            {
              this.Inviter=res.result
            }else{
              this.$Message.error(res.msg)
            }
        })
      },
      pay(){
        if(!this._checkInfo())
          return;
        this.http.put(this.$store.state.prefix + '/customer',{
            realName:this.name,
            phone:this.phone,
            email:this.email
          }).then(res => {
            if (res.error === false) {
            }else{
              this.$Message.error(res.msg)
            }
          })
        if (this.isPaying === true)
          return;
        this.isPaying = true;
        this.http.post(this.$store.state.prefix + '/pay/payMember/'+this.params.companyId+'/'+this.params.activityId+'/'+this.realInviterId, this.params).then((res) => {
          if (res.error === false) {
            var row = res.result;
            var onBridgeReady = () => {
              var me = this;
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest',{
                  'appId': row.appid,
                  'timeStamp': row.timeStamp,
                  'nonceStr': row.nonce_str,
                  'package':  row.prepay_id,
                  'signType': row.sign_type,
                  'paySign': row.sign
                },
                function (res) {
                  //在发起支付调起微信支付的窗口后进行状态恢复
                  me.isPaying = false;
                  if (res.err_msg === 'get_brand_wcpay_request:ok') {
                    me.$Message.success("支付成功，您已成为会员。")
                    me.payState = true;
                    me.$store.state.isMember = 1;
                  }else{
                    me.$Message.success("支付失败。")
                  }
                }
              )
            }
            if (typeof WeixinJSBridge === 'undefined') {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
              }
            } else {
              onBridgeReady()
            }
          }else {
            this.$Message.error(res.msg)
          }
        })
      },
      _checkInfo(){
        if(this.name == ''){
          this.isCheck = true;
          this.checkState = "err";
          this.msg = "请输入真实姓名";
          return false;
        }
        if(this.phone == ''){
          this.isCheck = true;
          this.checkState = "err";
          this.msg = "请输入手机号码";
          return false;
        }
        else if(!(/^1[34578]\d{9}$/.test(this.phone))){
          this.isCheck = true;
          this.checkState = "err";
          this.msg = "您输入的手机号码格式错误";
          return false;
        }
        this.isCheck = true;
        this.checkState="right"
        this.msg = "验证成功"
        return true
      }
    },
    data () {
      return {
        isPaying:false,
        payState:false,
        company:"",
        name:'',
        phone:'',
        email:'',
        params: {
          inviterId: ~~(this.util.getCookie("realInviterId")||window.localStorage["realInviterId"]),//邀请人信息
          activityId:0,//活动id
          companyId: 0//公司id
        },
        isCheck:false,
        showPage:true,
        msg:"请准确输入以上信息",
        money:0,
        checkState:'err',
        Inviter:{
          realName:'',
          headImg:''
        }
      }
    }
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  rrem(val){
    return (val/108px)rem
  }
  .register
    width:100%
    z-index 1500
    .main_bg
      width:100%
      height rrem(1922px)
      background #000
      position fixed
      top 0px
      left 0px
      z-index 1500
      opacity 0.5
    .main_body
      width rrem(1000px)
      height rrem(1000px)
      z-index 1510
      position fixed
      top rrem(350px)
      left rrem(40px)
      background #fff
      .body_join
        position absolute
        left rrem(275px)
        top rrem(-69px)
        width rrem(436px)
        height rrem(140px)
        img
          height 100%
          width 100%
      .body_input
        position absolute
        top rrem(120px)
        left rrem(40px)
        width rrem(920px)
        height rrem(680px)
        input
          border 1px solid #aeaeae
          margin-bottom rrem(40px)
          height rrem(100px)
          width 100%
          line-height rrem(100px)
          padding-left rrem(20px)
        .input_name
          width 100%
      .body_check
        text-align center
        display flex
        justify-content center
        img
          margin-right rrem(10px)
          width rrem(45px)
          height rrem(45px)
        span
          line-height rrem(55px)
          height rrem(45px)
      .body_pay
        background #ff007e
        position absolute
        top rrem(850px)
        left rrem(40px)
        line-height rrem(125px)
        text-align center
        font-size rrem(54px)
        color #fff
        height rrem(125px)
        width rrem(920px)
        &:hover
          background red
    .payed_body
      height rrem(530px)
      .body_info
        width rrem(920px)
        height rrem(190px)
        position absolute
        top rrem(150px)
        left rrem(40px)
        text-align center
        span
          display block
          width 100%
          height rrem(100px)
          line-height rrem(100px)
          font-size rrem(48px)
          color #ff007e
      .payed_pay
        top rrem(360px)
.inviterinfo
  text-align:center
  height rrem(250px)
  .inviteravater
    width rrem(160px)
    height rrem(160px)
    margin:0px auto
    img
      width:100%
      height:100%
      border-radius:10px
  .inviternote
    width:100%
    height rrem(90px)
    text-align:center
    line-height rrem(90px)
</style>
