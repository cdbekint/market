<template>
  <div class="customerlist">
    <div class="content-title" style="margin:5px;">
      <div class="titlename">
        <span>客户列表</span>
      </div>
      <div class="titellink">
        <span>选择类型：</span>
        <Select v-model="searchVal" slot="prepend" style="width:30%;">
          <Option value="1">会员</Option>
          <Option value="2">员工</Option>
          <Option value="3">会员加员工</Option>
        </Select>
        <Input v-model="nameOrPhone" placeholder="姓名或手机" style="width: 30%"></Input>
        <Button type="primary" icon="ios-search" @click="search">查询</Button>
      </div>
    </div>
    <div class="content">
      <Table border :columns="companyCol" :data="companyData" class="giftlistable"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="pager.total" :page-size="pager.size" :current="pager.current" @on-change="changePage"></Page>
        </div>
      </div>
      <div style="margin-top:10px;width:100%;text-align:left">
        <p>剩余积分：客户的当前可兑换积分</p>
        <p>额外积分：员工或者代理所享受的员工提成积分和一二级消费返还积分的总和。（员工只有员工提成积分）</p>
        <p>会员：过链接缴纳注册金额后的顾客成为会员，会员可以参加所有的优惠活动进行团购及即时提现等功能</p>
        <p>员工：成为会员后管理员可设置其为员工。员工享有公司设定的员工提成，员工不享有一二级返还积分</p>
        <p>代理：享受所有员工的待遇，并且享受一二级人员消费所返还的积分。</p>
      </div>
    </div>
    <Modal v-model="employeemodal" title="选取新员工">
      <Table highlight-row border :columns="employeeColumns" :data="employee" @on-row-click="changeEmployee"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="employeepager.total" :page-size="employeepager.size" :current="employeepager.current" @on-change="getEmployeeList"></Page>
        </div>
      </div>
      
    </Modal>
    <Modal v-model="addPointmodal" title="自定义加分">
      <Row>
        <Col span="20" offset="2">
        <Form :label-width="100">
          <Form-item label="自定义加分数值">
            <Input v-model="customerPoints" placeholder="请输入正整数的分值"></Input>
          </Form-item>
          <Form-item label="加分备注">
            <Input v-model="remarks" placeholder="请输入备注" type='textarea'></Input>
          </Form-item>
          <Form-item>
            <Col span="12">
            <Input v-model="randomStr" placeholder="请输入验证码"></Input>
            </Col>
            <Col span="12" style="text-align:center">
            <Button type="primary" @click="addPointToUser" v-if="smscountdown.enable"> 获取验证码</Button>
            <Button icon="ios-clock-outline" v-else disabled>{{smscountdown.timer}}秒后发送</Button>
            </Col>
          </Form-item>
          <Form-item style="text-align:center">
            <Button type="error" size="large" @click="sureAddPoints" v-if="smscountdown.sureAble">确认加分</Button>
            <Button disabled v-else>确认加分</Button>
          </Form-item>
        </Form>
        </Col>
      </Row>
      <div slot="footer">
        <p v-if="customerPoints!=''">将为{{this.willaddPointUser.realName || this.willaddPointUser.nickName}} 自定义加分:
          <span style="color:red;font-weight:bold"> {{this.customerPoints}}{{this.customerPoints
            <=0 ? '分,且不大于0' : '分'}} </span>
        </p>
      </div>
    </Modal>
    <!-- <Modal v-model="addPointmodalTwo" title="确认加分" @on-ok="sureAddPoints" @on-cancel="cancelAddPonints"> -->
    <!-- <Input v-model="customerPoints"></Input> -->
    <!-- <Icon type="information-circled"></Icon>自定义积分请输入数字 -->
    <!-- </Modal> -->
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Customer',
  data() {
    return {
      searchVal: '',
      nameOrPhone: '',
      companyCol: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'nickName',
          render(row) {
            if (row.realName) {
              return '<span v-text="row.realName"></span>'
            } else {
              return '<span v-text="row.nickName"></span>'
            }
          }
        },
        {
          title: '头像',
          key: 'headImg',
          render(row) {
            return '<img :src="row.headImg" style="width:40px;height:40px;"/>'
          }
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '消费金额',
          key: 'selfExpense'
        },
        {
          title: '提现金额',
          key: 'withdrawAmount'
        },
        {
          title: '累计积分',
          key: 'allPoints'
        },
        {
          title: '额外积分',
          key: 'employeePoints'
        },
        {
          title: '剩余积分',
          key: 'points'
        },
        {
          title: '会员',
          key: 'member',
          render(row) {
            if (row.member == 1)
              return '<img src="/static/images/member.png" style="width:40px;height:40px;display: block;margin:auto;"/>'
            else
              return '<img src="/static/images/nomember.png" style="width:40px;height:40px;display: block;margin:auto;"/>'
          }
        },
        {
          title: '员工',
          key: 'employee',
          render(row) {
            if (row.employee == 1)
              return '<img src="/static/images/huang.png" style="width:40px;height:40px;display: block;margin:auto;cursor:pointer"/>'
            else if (row.member == 1)
              return '<img src="/static/images/nohuang.png" style="width:40px;height:40px;display: block;margin:auto;cursor:pointer" @click="setEmployee(row.accountId)"/>'
            else
              return ''
          }
        }, {
          title: '代理',
          key: 'employee',
          render(row) {
            if (row.employee == 1) {
              if (row.agent == 0) {
                return '<img src="/static/images/agentno.png" style="width:40px;height:40px;display: block;margin:auto;cursor:pointer" @click="setAgent(row)"/>'
              } else {
                return '<img src="/static/images/agentyes.png" style="width:40px;height:40px;display: block;margin:auto;cursor:pointer" @click="cancelAgent(row)"/>'
              }

            } else {
              return ''
            }
          }
        }, {
          title: '操作',
          key: 'action',
          render(row) {
            if (row.employee == 1) {
              var action = ""
              if (row.agent == 1) {
                action = '<i-button type="text" size="small" @click="addPoints(row)">自定义加分</i-button>'
              } else {
                action = '<i-button type="text" size="small" @click="changeCustomer(row)">客资转换</i-button>' +
                  '<i-button type="text" size="small" @click="addPoints(row,`addpoint`)">自定义加分</i-button>'
              }
              action += '<i-button type="text" size="small" @click="goToResource(row)">客资</i-button>'
              return action

            } else {
              return '<i-button type="text" size="small" @click="addPoints(row)">自定义加分</i-button>'
            }
          }
        }

      ],
      pager: {
        total: 0,
        size: 12,
        current: 1
      },
      companyData: [],
      currentEmployee: {},
      employeemodal: false,
      employee: [],
      employeeColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '头像',
          key: 'headImg',
          render(row) {
            return '<img :src="row.headImg" style="width:40px;height:40px"/>'
          }
        },
        {
          title: '会员姓名',
          key: 'realName'
        },
        {
          title: '电话',
          key: 'phone'
        }
      ],
      employeepager: {
        current: 1,
        total: 1,
        size: 12
      },
      addPointmodal: false,
      willaddPointUser: {},
      customerPoints: '',
      randomStr: '',
      remarks: '',
      //短信时间判断
      smscountdown: {
        timer: localStorage.getItem('timeNum') || 0, // 计时器时间
        enable: localStorage.getItem('PointEnable') || true, //短信开关
        sureAble: localStorage.getItem('sureAble') || true, // 确认加积分开关
        captcha: ''
      },
    }
  },
  created() {
    console.log(this.smscountdown.sureAble)
    this.getList(1)
    this.getEmployeeList(1)
    let timeNum = localStorage.getItem('timeNum')
    let time = (Date.now() - localStorage.getItem('nowTime')) / 1000
    if (time <= timeNum) {
      this.smscountdown.timer = Math.ceil(timeNum - time)
      this.smscountdown.enable = localStorage.getItem('PointEnable')
      this.interval()
    }
  },
  methods: {
    //第一步的加积分
    addPointToUser() {
      if (this.customerPoints <= 0 || '') {
        this.$Message.error('请输入自定义加分分值')
        return
      }
      if (this.remarks == '') {
        this.$Message.error('请填写加分说明')
        return
      }
      this.smscountdown.enable = false
      this.customerPoints = ~~this.customerPoints
      this.http.post(this.$store.state.prefix + '/customer/sendAuthCode', { accountId: this.willaddPointUser.accountId, companyId: this.willaddPointUser.companyId, points: this.customerPoints }).then(res => {
        if (!res.error) {
          this.$Message.success('短信发送成功')
          this.smscountdown.enable = false
          this.addPointBtn = true
          this.smscountdown.timer = 60
          this.smscountdown.interval = setInterval(() => {
            this.smscountdown.timer--
            if (this.smscountdown.timer <= 0) {
              this.smscountdown.enable = true
              localStorage.removeItem('PointEnable', this.smscountdown.enable)
              localStorage.removeItem('timeNum', this.smscountdown.timer)
              localStorage.removeItem('nowTime', Date.now())
              clearInterval(this.smscountdown.interval)
            } else {
              this.smscountdown.enable = false
              localStorage.setItem('PointEnable', this.smscountdown.enable)
              localStorage.setItem('timeNum', this.smscountdown.timer)
              localStorage.setItem('nowTime', Date.now())
            }
          }, 1000)
        } else {
          this.$Message.error(res.msg)
          this.smscountdown.enable = true
          localStorage.removeItem('PointEnable', this.smscountdown.enable)
        }
      })
    },
    //最后一步的加积分
    sureAddPoints() {
      if (this.customerPoints <= 0 || '') {
        this.$Message.error('请填正确的积分数')
        return
      }
      if (this.randomStr == '') {
        this.$Message.error('请填验证码')
        return
      } else if (this.randomStr.length != 6) {
        this.$Message.error('请填6位数验证码')
        return
      }
      if (this.remarks == '') {
        this.$Message.error('请填写加分说明')
        return
      }
      this.smscountdown.sureAble = false
      localStorage.setItem('sureAble', this.smscountdown.sureAble)
      this.http.put(this.$store.state.prefix + '/customer/updateUserPoints', {
        accountId: this.willaddPointUser.accountId,
        points: this.customerPoints,
        companyId: this.willaddPointUser.companyId,
        randomStr: this.randomStr,
        remarks: this.remarks
      }).then(res => {
        if (res.error === false) {
          this.$Message.success('自定义积分添加成功!')
          this.willaddPointUser.customerPoints = 0
          this.addPointmodal = false
          this.search()
          this.smscountdown.enable = true
          this.smscountdown.sureAble = true
          localStorage.removeItem('sureAble', this.smscountdown.sureAble)
          this.smscountdown.timer = 0
          clearInterval(this.smscountdown.interval)
          this.randomStr = ''
          this.remarks = ''
          this.customerPoints = ''
        } else {
          this.smscountdown.sureAble = true
           localStorage.removeItem('sureAble', this.smscountdown.sureAble)
          this.$Message.error(res.msg)
        }
      })
    },
    changeEmployee(row) {
      var _this = this
      var param = {
        accountId: this.currentEmployee.accountId,
        newAccountId: row.accountId
      }
      console.log(param)
      this.$Modal.confirm({
        title: '客资转移',
        content: '<p>确定将' + this.currentEmployee.realName + '的所有客户资源转换到' + row.realName + '名下？</p>',
        onOk: () => {
          _this.http.put(_this.$store.state.prefix + '/customer/updateEmployee2Other', param).then(res => {
            if (res.error === false) {
              _this.$Message.success('客户资源转移成功!')
              _this.getList(1)
              _this.employeemodal = false
              _this.getEmployeeList(1)
            } else {
              _this.$Message.error(res.msg)
            }
          })
        },
        onCancel: () => {
        }
      })
    }, getEmployeeList(pageno) {
      this.http.get(this.$store.state.prefix + '/customer/getCompanyUserInfo/' + (pageno || 1) + "?employee=1").then(res => {
        if (res.error === false) {
          this.employeepager = res.result
          this.employee = res.result.records
        } else {
          this.$Message.error(res.msg)
        }

      })
    },
    setEmployee(id) {
      var _this = this
      this.$Modal.confirm({
        title: '新增确认',
        content: '<p>设置为员工后将获得额外提成，确定修改？</p>',
        onOk: () => {
          _this.http.put(_this.$store.state.prefix + '/customer/updateUser2Employee', { accountId: id }).then(res => {
            if (res.error === false) {
              _this.$Message.success('设置员工成功!')
              _this.getList(1)
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    changeCustomer(employee) {
      this.employeemodal = true
      this.currentEmployee = employee
    },
    getList(pageNo) {
      this.companyData = [];
      this.pager = {
        total: 0,
        size: 12,
        current: 1
      };
      this.http.get(this.$store.state.prefix + '/customer/getCompanyUserInfo/' + pageNo || 1).then(res => {
        if (res.error === false) {
          this.companyData = res.result.records;
          this.pager = res.result
        }
      })
    },
    search() {
      this.companyData = []
      this.pager = {
        total: 0,
        size: 12,
        current: 1
      }
      var url = "";
      if (this.searchVal == 1) {
        url = '/customer/getCompanyUserInfo/1?member=1&employee=0&nameOrPhone=' + this.nameOrPhone
      } else if (this.searchVal == 2) {
        url = '/customer/getCompanyUserInfo/1?member=1&employee=1&nameOrPhone=' + this.nameOrPhone
      } else {
        url = '/customer/getCompanyUserInfo/1?nameOrPhone=' + this.nameOrPhone
      }
      this.http.get(this.$store.state.prefix + url).then(res => {
        if (res.error === false) {
          this.companyData = res.result.records;
          this.pager = res.result
        }
      })
    },
    changePage(e) {
      var url = "";
      if (this.searchVal == 1) {
        url = '/customer/getCompanyUserInfo/' + e + '?member=1&employee=0'
      } else if (this.searchVal == 2) {
        url = '/customer/getCompanyUserInfo/' + e + '?member=1&employee=1'
      } else {
        url = '/customer/getCompanyUserInfo/' + e
      }
      this.http.get(this.$store.state.prefix + url).then(res => {
        if (res.error === false) {
          this.companyData = res.result.records;
          this.pager = res.result
        }
      })
    },
    addPoints(row, type) {
      if (type == 'addpoint') {
        this.addPointmodal = true
        this.willaddPointUser = row
        return
      }
      this.addPointmodal = true
      this.willaddPointUser = row
      // this.http.post(this.$store.state.prefix + '/customer/sendAuthCode', { accountId: this.willaddPointUser.accountId, companyId: this.willaddPointUser.companyId, points: this.customerPoints }).then(res => {
      //   console.log(res)
      // })
    },
    cancelAgent(row) {
      this.$Modal.confirm({
        title: '取消代理',
        content: '<p>确定取消' + (row.realName || row.nickName) + '的代理权限？</p>',
        onOk: () => {
          this.http.put(this.$store.state.prefix + "/customer/cancelAgent2Employee", { companyId: row.companyId, accountId: row.accountId }).then(res => {
            if (res.error == false) {
              this.$Notice.info({ title: "取消成功", desc: (row.realName || row.nickName) + '的代理权限取消成功，将不再享有提成分红' })
              this.search()
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    setAgent(row) {
      console.log(row)
      this.$Modal.confirm({
        title: '设为代理',
        content: '<p>确定将' + (row.realName || row.nickName) + '设为公司代理？</p>',
        onOk: () => {
          this.http.put(this.$store.state.prefix + "/customer/updateEmployee2Agent", { companyId: row.companyId, accountId: row.accountId }).then(res => {
            if (res.error == false) {
              this.$Notice.info({ title: "设置成功", desc: (row.realName || row.nickName) + '的代理权限设置成功，将享有提成分红' })
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    goToResource(row) {
      this.$router.push({ path: '/resource', query: { id: row.accountId, name: row.realName || row.nickName } })
    },
    judge() {
      if (this.customerPoints <= 0) {
        this.$Message.error("积分不能小于0")
      }
    },
     interval() {
      let timer = setInterval(() => {
        this.smscountdown.timer--
        if (this.smscountdown.timer <= 0) {
          this.smscountdown.enable = true
          localStorage.removeItem('PointEnable', this.smscountdown.enable)
          localStorage.removeItem('timeNum', this.smscountdown.timer)
          localStorage.removeItem('nowTime', Date.now())
          clearInterval(timer)
        } else {
          this.smscountdown.enable = false
          localStorage.setItem('PointEnable', this.smscountdown.enable)
          localStorage.setItem('timeNum', this.smscountdown.timer)
          localStorage.setItem('nowTime', Date.now())
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='stylus' rel="stylesheet/stylus">

</style>
