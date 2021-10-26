<template>
  <div>
    <button @click="moveAction('/about')">이동</button>
    <button @click="modalAction('test');">알림</button>
    <button @click="save">저장</button>
    {{mapTest}}
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      mapTest : 'test123'
    };
  },
  created() {
    //alert('created');
  },
  mounted () {
    //alert('mounted');
    browser.runtime.sendMessage({})
  },
  computed: {
    defaultText () {
      return browser.i18n.getMessage('extName')
    }
  },
  methods: {
    modalAction(msg) {
      alert(msg);
    },
    save() {
      chrome.storage.sync.set({key: this.data}, () => {
        console.log('Value is set to ' + this.data);
      });
    }
  }
}
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
