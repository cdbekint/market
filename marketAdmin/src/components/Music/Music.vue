<template>
<div class="musicinfo">
  <div class="content-title">
      <!-- 页面的标题 -->

      <div class="titlename">
        <span>音乐库</span>
      </div>
      <div class="titellink">
      <router-link to="/music/add" class="innerbtnlink">新增音乐</router-link>
      </div>
 </div>
 <div class="content">
  <Table border :columns="musiclistColumns" :data="musiclistData" class="musiclistable"></Table>
    <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="musicpager.total" :page-size="musicpager.size" :current="musicpager.current" @on-change="changePage"></Page>
        </div>
    </div>
 </div>
</div>
</template>

<script  type="text/ecmascript-6">
export default {
  name: 'Music',
  data () {
    return {
      musiclistColumns: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '音乐名称',
          key: 'name'
        },
        {
          title: '音乐地址',
          key: 'url',
          render (row) {
            return '<a :href="murl+row.url" target="_blank" v-text="row.url"></a>'
          }
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '操作',
          key: 'action',
          render (row) {
            return '<i-button type="text" size="small" @click = "update(row.id)">修改</i-button>' +
              '<i-button type="text" size="small" @click="del(row.id)">删除</i-button>'
          }
        }
      ],
      musiclistData: [],
      musicpager: {
        total: 1,
        size:12,
        current: 1
      }
    }
  },
  created () {
    this.getMusicList(1)
  },
  methods: {
    getMusicList (pageNo) {
      this.http.get(this.$store.state.prefix + '/music/page/' + (pageNo || 1)).then(res => {
        if (res.error === false) {
          this.musicpager = res.result
          this.musiclistData = res.result.records
          this.musiclistData.forEach(item=>{
            item.createDate = this.util.changeDateToTime(item.createDate);
          })
        }
      })
    },
    changePage (e) {
      this.getMusicList(e)
    },
    update (id) {
      this.router.push({path: '/music/edit', query: {id: id}});
    },
    del (id) {
      var _this=this
      this.$Modal.confirm({
        title: '删除音乐',
        content: '<p>确定将此音乐进行删除，将不可恢复</p>',
        onOk: () => {
          _this.http.post(_this.$store.state.prefix + '/music/delete', {id: id}).then(res => {
            if (res.error === false) {
              _this.$Message.success('删除成功')
              _this.getMusicList(1);
            }
          })
        },
        onCancel: () => {
        }
      })
      
    }
  }
}
</script>
<style lang='stylus' rel="stylesheet/stylus">
.ivu-table
  td,th
    text-align:center
</style>
