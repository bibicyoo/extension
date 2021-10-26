<template>
  <div class="useBtnSection">
    <div class="btnSection">
      <el-button type="info" icon="el-icon-setting" circle @click="setting" size="mini" :title="$t('message.setting')"/>
      <el-button type="danger" icon="el-icon-delete" circle @click="delMemo" size="mini" :title="$t('message.del')"/>
      <el-button type="primary" icon="el-icon-edit" circle @click="addMemo" size="mini" :title="$t('message.add')"/>
    </div>
    <el-table v-if="memo.length > 0" ref="memoTable" :data="memo" :default-sort = "{prop: 'date', order: 'descending'}" size="mini" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column prop="date" :label="this.routerValue.text" sortable>
        <template slot-scope="scope">
          <el-input type="textarea" :autosize="{minRows: 2, minRows: 4, maxRows: 2, maxRows: 4}" v-model="scope.row.memo" />
          <el-tag class="dateTag" :type="formatDateTag(scope.row.date)" size="mini" disable-transitions>{{formatDate(scope.row, 'date')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="tagList" :label="this.routerValue.tag" width="80"
        :filters="this.filterTagList"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag v-for="(tag, index) in scope.row.tagList" :key="index" :type="tag.tagType" disable-transitions size="mini">{{tag.tagNm}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else :description="$t('message.emptyMemo')"></el-empty>
    <AddMemoPop :addMemoPopDisplay="addMemoPopDisplay" :userTagList=userTagList @addMemo="addMemo"/>
    <SettingPop :settingPopDisplay="settingPopDisplay" :userTagList=userTagList @setting="setting"/>
  </div>
</template>
<script>
  import AddMemoPop from "@/components/AddMemoPop";
  import SettingPop from "@/components/SettingPop";
  import CmUtils from '@/assets/common/cmUtils';
  export default {
    name: 'memo',
    components: {
      AddMemoPop,
      SettingPop,
    },
    data() {
      return {
          routerValue: this.$i18n.messages[this.$i18n.locale].routerValue.memo,
          message: this.$i18n.messages[this.$i18n.locale].message,
          userTagList: [],
          filterTagList: [],
          addMemoPopDisplay: false,
          settingPopDisplay: false,
          memo: [],
          currentRow: null,
        }
    },
    created() {

    },
    mounted () {
      this.getUserTag();
      this.getMemoList();
    },
    watch: {
      userTagList : function () {
        this.filterTagList = [];
        this.userTagList.forEach(userTag => {
          let tagValidLine = {};
          tagValidLine.text = userTag.tagNm;
          tagValidLine.value = userTag.tagNm;
          this.filterTagList.push(tagValidLine);
        });
      }
    },
    computed: {
    },
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      formatter(row, column) {
        let data = row[column.property];
        return data;
      },
      formatDate(row, column) {
        let data = row[column];

        if (data == null || data == '') {
          data = this.routerValue.emptyDate;
        } else {
          data = this.routerValue.date + " : " + data;
        }
        return data;
      },
      formatDateTag(date) {
        let tag = 'info';
        if (date !== null && date !== '') {
          let currentDate = new Date();
          let doDate = new Date(date);
          currentDate.setHours(0, 0, 0, 0);
          doDate.setHours(0, 0, 0, 0);
          
          if(currentDate.getTime() == doDate.getTime()) {
            tag = 'success';
          } else if (currentDate.getTime() > doDate.getTime()) {
            tag = 'danger';
          } else {
            tag = 'warning';
          }
        }
        return tag;
      },
      filterTag(value, row) {
        let confirmGbn = false;
        if (row.tagList !== null && row.tagList !== undefined){
          for (let i=0; i < row.tagList.length; i++) {
            if (row.tagList[i].tagNm === value) {
              confirmGbn = true;
              break;
            } else {
              confirmGbn = false;
            }
          }
        }
        return confirmGbn;
      },
      async getUserTag() {
        const that = this;
        await CmUtils.getStorage(CmUtils.tableList.tag).then(function (value) {
          that.userTagList = value;
        });
      },
      async getMemoList() {
        const that = this;
        await CmUtils.getStorage(CmUtils.tableList.memo).then(function (value) {
          that.memo = value != undefined ? value : [];
        });
      },
      async addMemo(status) {
        if (status !== null && status == 'insert') {
          await this.getUserTag();
          await this.getMemoList();
        }
        this.addMemoPopDisplay = (!this.addMemoPopDisplay);
      },
      async delMemo() {
        if (this.currentRow !== null) {
          const that = this;
          // let seq = this.currentRow.seq;
          await CmUtils.removeStorageByArray(CmUtils.tableList.memo, this.currentRow.seq, 'seq').then(function () {
            CmUtils.printMessage(that, that.$t('message.deleteConfirm', [that.message.memo]), CmUtils.messageType.success, 700);
            that.getMemoList();
          });
        } else {
          CmUtils.printMessage(this, this.message.emptySelectMemo, CmUtils.messageType.error, 700);
        }
      },
      async setting(status) {
        if (status !== null && (status == 'update' || status == 'insert')) {
          await this.getMemoList();
        }
        this.settingPopDisplay = (!this.settingPopDisplay);
      }
    }
  }
</script>