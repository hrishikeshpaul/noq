<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false"
               data-backdrop="static" :title="'Delete Confirmation Dialog'" size="lg">
        <div class="d-block text-center">
          <b-card-body>By pressing <b>DELETE</b> you will be removing your posting with the title <b>{{job.title}}</b> and you cannot recover it back.</b-card-body>
        </div>
        <b-button class="mt-3 btn btn-outline-danger" block @click="$emit('delete', job._id)">Delete</b-button>
        <b-button class="mt-3 btn btn-outline-secondary" block @click="$emit('hideModal')">Cancel</b-button>

      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ConfirmModal',
  components: {

  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    job: {
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    }
  }
}
</script>

<style scoped>

</style>
