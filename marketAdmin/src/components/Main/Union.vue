<template>
  <div class="union">
    <div class="content-title">
      <div class="titlename">
        <span>商家联盟</span>
      </div>
      <div class="titellink">
      </div>
    </div>
    <div class="content">
      <Row>
        <Col span="20" class="unionitems">
        <div class="union-title">
          联盟会员引导增长(今日/累计)
        </div>
  
        <div class="union-content" style='padding-left:10px;'>
          <div class="union-register">
            <div class="uregitem">
              <div class="upper">
                商家
              </div>
              <div class="middle">
                引出注册
                <Tooltip content="为联盟商家带去的注册量（今日引出/累计引出）" placement='right'>
                  <div class='tishi'>?</div>
                </Tooltip>
              </div>
              <div class="down">
                引入注册
                <Tooltip content="联盟商家为我带来的注册量（今日引入/累计引入）" placement='right'>
                  <div class='tishi'>?</div>
                </Tooltip>
              </div>
            </div>
            <div class="uregitem" v-for='item in aboutCompanys'>
              <div class="upper">
                {{item.allianceCompanyInfo.companyName}}
              </div>
              <div class="middle">
                {{item.todayMembers}}/{{item.members}}
              </div>
              <div class="down">
                10/900
              </div>
            </div>
            <div class="uregitem" style="padding:0px 10px;line-height:90px;border-left:0px" v-if="aboutCompanys.length==0">
              暂无任何数据
            </div>
          </div>
        </div>
  
        </Col>
      </Row>
      <Row>
        <Col span="20" class="unionitems">
        <div class="union-title" style="position:relative">
          已联盟商家(移动端商家底部展示)
          <Input style="width:200px;position:absolute;right:0px" placeholder="查找商家（名称）" v-model="queryinfo.companyName" @on-change="getCompanyList"></Input>
          <div class="companydrowplist" v-if="showcompanylist">
            <ul>
              <li v-for="cl in companyList" @click="unionCompany(cl)">
                <div class="companylogo">
                  <img :src="murl+cl.companyLogo" alt="" v-if="cl.companyLogo">
                </div>
                <div class="companyname" v-text="cl.companyName" style='color:#333'></div>
  
              </li>
              <li v-if="companyList.length==0" style="text-align:center;color:#333">暂无匹配项</li>
            </ul>
          </div>
        </div>
        <div class="union-content">
  
          <Col span="4" class="recommanditem" v-for='(item,index) in AllianceInfo' :key="item">
          <div class="companyLogo" @click="removeUnionCompany(item,index)">
            <img :src="murl+item.allianceCompanyInfo.companyLogo" alt="" v-if="item.allianceCompanyInfo.companyLogo">
            <!-- <img :src=''> -->
          </div>
          <div class="companyName" title="item.allianceCompanyInfo.companyName" @click="removeUnionCompany(item,index)">
            {{item.allianceCompanyInfo.companyName}}
          </div>
          </Col>
          <Col class="recommanditem" style="line-height:70px" v-if="AllianceInfo.length==0">
            暂无已联盟商家
          </Col>
  
        </div>
        </Col>
      </Row>
      <Row>
        <Col span="20" class="unionitems">
        <div class="union-title">
          相关商家推荐
        </div>
        <div class="union-content">
          <Col span="4" class="recommanditem" v-for="item in hotCompanyList" :key="item">
          <div class="companyLogo" @click='unionCompany(item)'>
            <img :src='murl+item.companyLogo' v-if='item.companyLogo'>
          </div>
          <div class="companyName" title="item.companyName">
            {{item.companyName}}
          </div>
          <div v-if='item.allianceImg == 1' class='alliance'>
            <img src='/static/images/alin.png'>
          </div>
          </Col>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Union',
  data() {
    return {
      AllianceInfo: [],   //联盟商家
      noAllianceInfo: [], //非商家联盟
      companyList: [],    //所有商家
      hotCompanyList: [],    //热推商家
      aboutCompanys: [],
      showcompanylist: false,
      isGetting: false,
      queryinfo: {
        companyName: '',
        companyId: '',
        withdrawType: '',
        withdrawStatus: '',
        nameOrPhone: '',
        current: 1,
        size: 12,
        total: 1
      },
      addCompanyInfo: {
        companyId: '',
        allianceCompanyId: ''
      }
    }
  },
  methods: {
    getCompanyList() {
      this.isGetting = true
      if (this.queryinfo.companyName == '') {
        this.showcompanylist = false
        return;
      }
      this.showcompanylist = true
      this.http.post(this.$store.state.prefix + "/company/getCompanyInfoByName", { companyName: this.queryinfo.companyName }).then(res => {
        if (res.error == false) {
          this.getcompanyloading = false
          this.isGetting = false
          this.companyList = res.result
        }
      })
    },
    //点击联盟
    unionCompany(data) {
        let arr = this.AllianceInfo
        if (data.id == this.$store.state.companyId) {
          this.$Message.error('不能与自己联盟');
            return
          }
        for (var i = 0; i < arr.length; i++) {
            if (data.id == arr[i].allianceCompanyId) {
              this.$Message.error('已经与该商家联盟');
              return
            }
          }
      this.$Modal.confirm({
        title: '确定联盟?',
        content:'<p>确定与商家:<span style="color:red;font-size:1.2em;font-weight:bolder">'+data.companyName+'</span>,形成联盟?</p>',
        onOk: () => {
          this.addCompany(data)
          if (data.allianceImg) {
            data.allianceImg = 1
          }
        },
        onCancel: () => {
        }
      });
    },
    //点击解除联盟   data  点击该商家的所有信息  index是排列在联盟的索引
    removeUnionCompany(data, index) {
      console.log(data)
      this.$Modal.confirm({
        title: '确定解除联盟?',
        content:'<p>确定与商家:<span style="color:red;font-size:1.2em;font-weight:bolder">'+data.allianceCompanyInfo.companyName+'</span>,解除联盟?</p>',
        onOk: () => {
          this.removeCompany(data.id, index)
          this.hotCompanyList.forEach(item => {
            if (data.allianceCompanyInfo.companyName == item.companyName) {
              if (item.allianceImg) {
                item.allianceImg = 2
              }
            }
          })
        },
        onCancel: () => {
        }
      });
    },
    //和商家联盟
    addCompany(data) {
      this.addCompanyInfo.allianceCompanyId = data.id
      this.addCompanyInfo.companyId = this.$store.state.companyId - 0
      this.http.post(this.$store.state.prefix + '/alliance/addAlliance', this.addCompanyInfo).then(res => {
        if (!res.error) {
          this.http.get(this.$store.state.prefix + '/alliance/getAllianceInfo?companyId=' + this.$store.state.companyId).then(res => {
            if (!res.error) {
              if (res.result) {
                this.AllianceInfo = res.result
                this.aboutCompanys = [...this.AllianceInfo, ...this.noAllianceInfo]
                this.$Message.info('联盟成功');
              }
            }
          })
        }
      })
    },
    //和商家解除联盟
    removeCompany(data, index) {
      this.http.post(this.$store.state.prefix + '/alliance/deleteAlliance', { id: data }).then(res => {
        if (!res.error) {
          this.AllianceInfo.splice(index, 1)
          this.aboutCompanys = [...this.AllianceInfo, ...this.noAllianceInfo]
        }
      })
    }
  },
  watch: {
  },
  created() {
    if (this.$store.state.token) {
      this.http.all([this.http.get(this.$store.state.prefix + '/alliance/getAllianceInfo?companyId=' + this.$store.state.companyId),
      this.http.post(this.$store.state.prefix + '/company/getRecommendCompany?', { companyId: this.$store.state.companyId }),
      this.http.get(this.$store.state.prefix + '/alliance/getNoAllianceInfo?companyId=' + this.$store.state.companyId)
      ])
        .then(this.http.spread(function (res, resTwo, resThree) {
          //联盟商家
          if (!res.error) {
            if (res.result) {
              this.AllianceInfo = res.result
              this.aboutCompanys = [...this.AllianceInfo, ...this.noAllianceInfo]
            }
          }
          //热推商家
          if (!resTwo.error) {
            if (resTwo.result) {
              this.hotCompanyList = resTwo.result
              const arr = this.hotCompanyList
              const id = this.$store.state.companyId
              const AlliancCompanys = this.AllianceInfo
              arr.forEach(function (item, index) {
                item = Object.assign(item, { allianceImg: 2 })
                if (AlliancCompanys) {
                  AlliancCompanys.forEach(list => {
                    if (item.id == list.allianceCompanyInfo.id) {
                      item.allianceImg = 1
                      return
                    } else {
                      item.allianceImg = 2
                    }
                  })
                }
                if (item.id == id) {
                  arr.splice(index, 1)
                }
              });

            }
          }
          //非联盟商家
          if (!res.error) {
            if (res.result) {
              this.noAllianceInfo = res.result
            }
          }
        }.bind(this)));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='stylus' rel="stylesheet/stylus">
.tishi
  width:15px
  height:15px
  background-color:#ffac38
  border-radius:50%
  color:#fff
  line-height:15px
  text-align:center
  cursor pointer
.unionitems
  border-radius:5px
  min-height:125px
  border:1px solid #ccc
  margin:10px 0px
  border-top:none
  .union-title
    height:35px
    background:#44b549
    color:#fff
    line-height:35px
    text-align:left
    font-size:1.2em
    font-weight:bolder
    padding:0px 10px
  .companydrowplist
    position:absolute
    width:200px
    top:34px
    right:0
    z-index:100
    // min-height:100px
    max-height:300px
    overflow-y:auto
    z-index:1000
    border:1px solid #ccc
    background:#fff
    border-radius:5px
    ul
      li
        overflow:hidden
        display:flex
        border-bottom:1px solid #eee
        cursor:pointer
        .companylogo
          width:40px
          height:40px
          overflow:hidden
          img
            width:100%
            height:auto
        .companyname
          flex1:1
          text-align:left
  .union-content
    padding:10px 0px
    height :110px
    .recommanditem
      height:70px
      cursor:pointer
      position relative
      .alliance
        opacity 0.8
        width 20px
        height 20px
        position absolute
        right 0px
        top 0px
        img
          width 100%
      .companyLogo
        height:50px
        width:50px
        margin:0 auto
        img
          width:100%
          height:auto
          max-height:50px
      .companyName
        width:100%
        height:20px
        overflow:hidden
    .union-register
      width:auto
      height:90px
      .uregitem
        height:90px
        width:auto
        float:left
        border:1px solid #ccc
        .upper
          height:30px
          line-height:30px
          padding:0px 10px
          border-bottom:1px solid #ccc
        .middle
          height:30px
          line-height:30px
          padding:0px 10px
          border-bottom:1px solid #ccc
        .down
          height:30px
          line-height:30px
          padding:0px 10px
</style>
