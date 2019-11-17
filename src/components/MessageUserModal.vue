<template>
  <div>
    <div>
      <b-modal ref="modal" hide-footer v-model="show" data-keyboard="false" size="lg"
               data-backdrop="static" :title="'Message'">
        <div class="d-block text-center px-3 nice-font pb-2">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">To</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="user.name" class="input-field" disabled></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Message*</label>
            <b-form-group>
              <b-form-textarea id="position" v-model.trim="messageBody" class="input-field" rows="4"></b-form-textarea>
            </b-form-group>

          </b-form>
          <div class="text-right">
            <button class="mt-2 btn btn-outline-secondary w-10"  @click="$emit('hideModal')">Close</button>
            <button class="mt-2 btn btn-outline-primary w-25"  @click="sendMessage">Send</button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import url from '../config/server_config'

export default {
  name: 'MessageUserModal',
  components: {
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    user: {
      type: Object
    }
  },
  data () {
    return {
      show: false,
      newUser: {},
      showAlert: false,
      alertText: '',
      messageBody: '',
      user_id: localStorage.user_id
    }
  },
  watch: {
    showModal (newVal) {
      this.show = newVal
    }
  },
  methods: {
    sendMessage () {
      var headers = {
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken').substring(4, localStorage.getItem('jwtToken').length)
      }

      axios.post(`${url}/api/messages/`, {from: this.user_id, to: [this.user._id], body: this.messageBody}, {headers: headers})
        .then(res => {
          this.$swal({
            position: 'top-right',
            backdrop: false,
            showConfirmButton: false,
            timer: 2500,
            width: '300px',
            imageHeight: 20,
            imageWidth: 20,
            background: 'rgba(92,184,92,0.93)',
            title: '<span style="  font-family: \'Roboto\', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;">Successfully sent message!</span>'
          })
          this.show = false
          this.messageBody = ''
          this.$emit('hideModal')
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style scoped>
  button {
    border-radius: 5px;
    cursor: pointer;
  }

  label {
    font-size: 15px;
    color: #6d6d6d;
  }
  .info-hover {
    cursor: pointer;
  }
  .info-hover:hover {
    background-color: #6c757d;
  }
  .nice-font {
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
  }
  .input-field {
    border: 0;
    font-weight: 100;
    border-radius: 2px;
    outline: none;
    box-shadow: none;
    margin-top: 1px;
    background-color: #f6f6f6;
  }
  .input-field:hover {
    background-color: #f1f1f1;
  }
  .input-field:focus {
    background-color: #eaeaea;
  }
  .smaller-font {
    font-size: 13px;
  }
  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  /deep/ .modal-title {
    font-family: 'Roboto', sans-serif;
    font-weight: 200;
    padding-left: 1rem;
    font-size: 35px;
  }

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  .modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease
  }
  /deep/ .modal-header {
    color: white;
    background-color: #c68967;
  }
  /deep/ .close {
    color: white;
  }
  /deep/ .bg-light {
    background-color: #ececec !important;
  }
  /deep/ .btn-outline-primary {
    border-color: #c68967 !important;
    color: grey;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: #c68967 !important;
    background-color: #de9a73;
    color: white;
  }
</style>
