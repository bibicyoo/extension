<template>
    <el-dialog width="90%" :title="$t('message.editMemo')" :visible.sync="addMemoPopDisplay" :before-close="closeMemo" size="mini">
      <el-form :model="form">
        <el-form-item size="mini">
          <el-input type="textarea" autocomplete="off" :placeholder="'*' + $t('routerValue.memo.text')"
          :autosize="{minRows: 2, minRows: 4, maxRows: 2, maxRows: 4}" v-model="form.memo" />
        </el-form-item>
        <el-form-item size="small">
          <el-select v-model="form.tagList" multiple filterable allow-create :placeholder="$t('routerValue.memo.tag')" style="width:100% !important">
            <el-option v-for="item in userTagList" :key="item.tagNm" :label="item.tagNm" :value="item.tagNm" size="mini"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small">
          <el-date-picker v-model="form.date" type="date" :placeholder="$t('routerValue.memo.date')" style="width:100% !important"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMemo()" size="mini">{{$t('message.confirm')}}</el-button>
        <el-button @click="closeMemo()" size="mini">{{$t('message.cancel')}}</el-button>
      </span>
    </el-dialog>
</template>
<script>
  import CmUtils from '@/assets/common/cmUtils'
  export default {
    name: 'addMemoPop',
    props: {
      addMemoPopDisplay: Boolean,
      userTagList: Array,
    },
    data() {
      return {
        message: this.$i18n.messages[this.$i18n.locale].message,
        form: {
          seq: '',
          index: '',
          memo: '',
          tagList: [],
          currentTagList: [],
          date: null,
          putDate: '',
          patchDate: '',
          delYn:'N',
        },
      }
    },
    watch : {
      addMemoPopDisplay: function() {
        if(this.addMemoPopDisplay == true) {
          this.form.memo = '';
          this.form.tagList = [];
          this.form.currentTagList = [];
          this.form.date = null;
        }
      }
    },
    mounted() {},
    methods : {
      async addMemo() {
        if (this.form.memo == null || this.form.memo == '') {
          CmUtils.printMessage(this, this.message.emptyMemo, CmUtils.messageType.error, 700);
          return false;
        } else {
          this.form.seq = CmUtils.getSeq(CmUtils.tableList.memo);
          //TODO
          this.form.index = 0;
          
          if (this.form.date !== null && this.form.date !== '') {
            this.form.date = CmUtils.getDateToString(this.form.date);
          } else {
            this.form.date = null;
          }

          let currentDate = CmUtils.getDateToString(new Date());
          this.form.putDate = currentDate;
          this.form.patchDate = currentDate;
          
          if (this.form.tagList.length > 0){
            this.form.currentTagList = this.form.tagList;
            let tagList = [];
            let tagCustomList = [];
            this.form.currentTagList.forEach((tag, index) => {
              this.userTagList.forEach(userTag => {
                if (tag == userTag.tagNm) {
                  tagList.push(userTag);
                  this.form.currentTagList[index] = null;
                }
              });
            });
            this.form.currentTagList.forEach(tag => {
              if (tag !== null) {
                tagCustomList.push({tagNm: tag, tagType: 'info'});
              }
            });

            if (tagCustomList.length > 0) {
              tagList = tagList.concat(tagCustomList);
              /**tag insert*/
              await CmUtils.setStorageByArray(CmUtils.tableList.tag, tagCustomList, 'tagNm');
            }
            this.form.currentTagList = tagList;
          }

          /**memo insert*/
          let submitForm = CmUtils.setSubmitForm(this.form,
            [{valueNm : 'seq', dataNm : null},
             {valueNm : 'index', dataNm : null},
             {valueNm : 'memo', dataNm : null},
             {valueNm : 'currentTagList', dataNm : 'tagList'}, 
             {valueNm : 'date', dataNm : null}, 
             {valueNm : 'putDate', dataNm : null}, 
             {valueNm : 'patchDate', dataNm : null},
             {valueNm : 'delYn', dataNm : null}
            ]);
          const that = this;
          await CmUtils.setStorageByArray(CmUtils.tableList.memo, [submitForm], 'seq').then(function () {
            that.$emit("addMemo", 'insert');
            CmUtils.printMessage(that, that.$t('message.registConfirm', [that.message.memo]), CmUtils.messageType.success, 700);
          });
        }
      },
      closeMemo() {
        this.$emit("addMemo");
      }
    }
  };
</script>