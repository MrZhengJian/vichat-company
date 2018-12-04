<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <div class="ivu-avatar">{{userName}}</div>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout" style="text-align:center">{{$t('logout')}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  computed: {
    userName () {
      return this.$store.state.user.userObj.userName
    },
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
      }
    }
  }
}
</script>
