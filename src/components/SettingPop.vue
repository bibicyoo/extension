<template>
  <el-dialog width="90%" :title="$t('message.setting')" :visible.sync="settingPopDisplay" :before-close="closeSetting" size="mini">
    <el-form :model="form" :label-position="labelPosition">
      <el-form-item :label="$t('message.editTag')" size="small" class="settingTagForm">
        <el-input class="inputText" v-model="form.tagNm" :placeholder="$t('message.tag')" />
        <input type="hidden" value="I" v-model="form.tagIud" />
        <el-select class="comboBox" v-model="form.tagType" :placeholder="$t('message.color')">
          <el-option label="danger" value="danger"></el-option>
          <el-option label="info" value="info"></el-option>
          <el-option label="success" value="success"></el-option>
          <el-option label="warning" value="warning"></el-option>
        </el-select>
        <el-button size="mini" type="primary" @click="addTag">{{$t('message.registTag')}}</el-button>
        <el-button size="mini" type="info" @click="paramInit">{{$t('message.reload')}}</el-button>
      </el-form-item>
      <el-form-item size="mini">
        <el-tag :key="tag.tagNm" v-for="tag in userTagList" :disable-transitions="false"
        closable @click="editTag(tag)" @close="delTag(tag)" :type="tag.tagType" size="mini" style="cursor: pointer;">
          {{tag.tagNm}}
        </el-tag>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeSetting" size="mini">{{$t('message.confirm')}}</el-button>
      <el-button @click="closeSetting" size="mini">{{$t('message.cancel')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import CmUtils from '@/assets/common/cmUtils'
  export default {
    name: 'settingPop',
    props: {
      settingPopDisplay: Boolean,
      userTagList: Array,
    },
    data() {
      return {
        message: this.$i18n.messages[this.$i18n.locale].message,
        labelPosition: 'top',
        status: '',
        form: {
          tagNm: '',
          uTagNm: '',
          tagType: '',
          tagIud: 'I',
        }
      }
    },
    watch : {
      settingPopDisplay: function() {
        if(this.settingPopDisplay == true) {
          this.paramInit();
        }
      }
    },
    mounted() {},
    methods : {
      paramInit() {
        this.status = '';
        this.form.tagNm = '';
        this.form.uTagNm = '';
        this.form.tagType = '';
        this.form.tagIud = 'I';
      },
      async addTag() {
          if (this.form.tagNm == null || this.form.tagNm == '') {            
            CmUtils.printMessage(this, this.$t('message.confirmParam', [this.message.tag]), CmUtils.messageType.error, 700);
            return false;
          } else if (this.form.tagType == null || this.form.tagType == '') {
            CmUtils.printMessage(this, this.$t('message.confirmParam', [this.message.color]), CmUtils.messageType.error, 700);
            return false;
          } else {
            let tagValid = true;
            /**user tag validation */
            for (var i=0; i < this.userTagList.length; i++) {
              if (this.form.tagNm == this.userTagList[i].tagNm) {
                CmUtils.printMessage(this, this.$t('message.confirmParam', [this.message.duplicate + this.message.tag]), CmUtils.messageType.error, 700);
                tagValid = false;
                break;
              }
            }

            if (this.form.tagIud == 'I' && tagValid) {
              /**tag insert*/
              let submitForm = CmUtils.setSubmitForm(this.form,
                [{valueNm : 'tagNm', dataNm : null},
                {valueNm : 'tagType', dataNm : null}
                ]);
              const that = this;
              CmUtils.setStorageByArray(CmUtils.tableList.tag, [submitForm], 'tagNm').then(function () {
                CmUtils.printMessage(that, that.$t('message.registConfirm', [that.message.tag]), CmUtils.messageType.success, 700);
                that.userTagList.push(submitForm);
                that.paramInit();
              });
            } else if (this.form.tagIud == 'U' && tagValid) {
              let delGbn = false;
              let tagIdx = -1;
              this.userTagList.forEach((tag, idx) => {
                if (this.form.uTagNm == tag.tagNm) {
                  delGbn = true;
                  tagIdx = idx;
                }
              });
              if (delGbn) {
                this.userTagList.splice(tagIdx, 1);
                /**tag update*/
                const that = this;
                await CmUtils.removeStorageByArray(CmUtils.tableList.tag, this.form.uTagNm, 'tagNm').then(function () {
                  /**tag insert*/
                  let submitForm = CmUtils.setSubmitForm(that.form,
                  [{valueNm : 'tagNm', dataNm : null},
                  {valueNm : 'tagType', dataNm : null}
                  ]);

                  CmUtils.setStorageByArray(CmUtils.tableList.tag, [submitForm], 'tagNm').then(function () {
                    CmUtils.printMessage(that, that.$t('message.editConfirm', [that.message.tag]), CmUtils.messageType.success, 700);
                    that.userTagList.push(submitForm);
                    that.memoSyncData(that.form.uTagNm, submitForm);
                    that.paramInit();
                  });
                });
              }
            }
          }
      },
      async memoSyncData(uTagNm, tag) {
        let seq = uTagNm != null ? uTagNm : tag.tagNm;
        let uMemoList = [];
        const memoList = await CmUtils.getStorage(CmUtils.tableList.memo);
        if (memoList !== null && memoList.length > 0) {
          memoList.forEach((memo, jdx) => {
            if (memo.tagList !== null && memo.tagList.length > 0) {
              memo.tagList.forEach((memoTag, idx) => {
                console.log('memoTag.tagNm', memoTag.tagNm);
                console.log('seq', seq);
                if (memoTag.tagNm == seq) {
                  if (uTagNm !== null) {
                    memoList[jdx].tagList[idx] = tag;
                  } else {
                    memoList[jdx].tagList.splice(idx, 1);
                  }
                  uMemoList.push(memoList[jdx]);
                }
              });
            }
          });
        }
        /**memo update*/
        for (var i=0; i < uMemoList.length; i++) {
          console.log('test', uMemoList[i]);
          await CmUtils.removeStorageByArray(CmUtils.tableList.memo, uMemoList[i].seq, 'seq');
          await CmUtils.setStorageByArray(CmUtils.tableList.memo, [uMemoList[i]], 'seq');
        }
        this.status = 'update';
      },
      async delTag(tag) {
        /**tag delete*/
        const that = this;
        let seq = tag.tagNm;

        await CmUtils.removeStorageByArray(CmUtils.tableList.tag, seq, 'tagNm').then(function () {
          CmUtils.printMessage(that, that.$t('message.deleteConfirm', [that.message.tag]), CmUtils.messageType.success, 700);
          that.userTagList.splice(that.userTagList.indexOf(tag), 1);
          that.memoSyncData(null, tag);
          that.paramInit();
          that.status = 'insert';
        });
      },
      editTag(tag) {
        this.form.tagNm = tag.tagNm;
        this.form.uTagNm = tag.tagNm;
        this.form.tagType = tag.tagType;
        this.form.tagIud = 'U';
      },
      closeSetting() {
        this.$emit("setting", this.status);
      }
    }
  };
</script>