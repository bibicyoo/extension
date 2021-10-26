<template>
    <el-header>
      <span>bibic functions v0.1 {{$t('message.hello')}}</span>
      <el-select class="topLangCombo" v-model="targetLang" placeholder="language" size="mini">
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="index">
        </el-option>
      </el-select>
    </el-header>
</template>
<script>
  import locale from 'element-ui/lib/locale'
  import en from 'element-ui/lib/locale/lang/en'
  import ko from 'element-ui/lib/locale/lang/ko'
  import ja from 'element-ui/lib/locale/lang/ja'
  import CmUtils from '@/assets/common/cmUtils'

  export default {
    name: 'topTitle',
    data() {
      return {
        options: require('@/assets/lang/lang.json'),
        targetLang: '',
        targetIndex: 0,
      }
    },
    watch : {
      targetLang: function() {
        if (this.targetLang === undefined || this.targetLang == null) {
          this.targetLang = 'en';
        }
        if (this.targetLang == 'en'){
          locale.use(en);
        } else if (this.targetLang == 'ko') {
          locale.use(ko);
        } else if (this.targetLang == 'ja') {
          locale.use(ja);
        }
        CmUtils.setStorage('targetLang', this.targetLang);
        this.$i18n.locale = this.targetLang;
        this.moveAction(this.$router.currentRoute.path + '?' + this.targetIndex++);
      },
    },
    mounted() {
      const that = this;
      CmUtils.getStorage('targetLang').then(function (value) {
        if (value !== null && value !== undefined) {
          that.targetLang = value;
        }
      });
      
    },
    methods : {
      moveAction(path) {
          this.$emit("moveAction", path);
      },
    }
  };
</script>