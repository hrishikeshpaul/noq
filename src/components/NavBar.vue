<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="warning" class="shadow-sm">
        <b-navbar-brand href="/" class="ml-5"><b>noQ</b></b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right class="mr-5">
              <b-dropdown-item href="/profile">Profile</b-dropdown-item>
              <b-dropdown-item href="#" @click.prevent="logout">Log Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar'

export default {
  name: 'NavBar',
  components: {
    Gravatar
  },
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$emit('logout')
    }
  }
}
</script>

<style scoped>

</style>
