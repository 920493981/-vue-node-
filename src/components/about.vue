<template>
  <div>
    <div>我就是我，要个人信息吗</div>
    <el-button @click="logout">登出</el-button>
  </div>
</template>
<script>
  export default {
    name: 'about',
    methods: {
      logout: function () {
        var user = sessionStorage.getItem('user')
        console.log('即将删除的user: ' + user)
        if(user) {sessionStorage.removeItem('user')}
        this.$http.get('/api/logout').then(
        response => {
          this.$message({
            message: '登出成功',
            type: 'success'
          })
          this.$router.push('/article')
        }
        )
      }
    }
  }
</script>