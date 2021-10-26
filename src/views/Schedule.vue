<template>
  <el-calendar v-model="now">
  </el-calendar>
</template>

<script>
export default {
  name: 'schedule',
  data() {
    return {
      now: new Date()
    }
  },
  created() {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  }
}
</script>