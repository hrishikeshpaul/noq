<template>
  <div>
    <div>
      <b-modal
        ref="modal"
        hide-footer
        v-model="show"
        data-keyboard="false"
        size="lg"
        data-backdrop="static"
        :title="'Honor'"
      >
        <!--        <template v-slot:modal-title>-->
        <!--          <div style="font-size: 40px;" class="nice-font px-3">-->
        <!--            Honor-->
        <!--          </div>-->
        <!--          <p style="font-size: 17px; color: #575e65; margin-top: -7px; padding-left: 2px;" class="mb-0 nice-font px-3">Give some details to describe your honor!</p>-->
        <!--        </template>-->
        <div class="d-block text-center px-3 nice-font pb-2">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Title of honor*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newHonor.title" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Issuer*</label>
            <b-form-group>
              <b-form-input id="issuer" v-model.trim="newHonor.issuer" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Description*</label>
            <b-form-group>
              <b-form-input
                id="description"
                v-model.trim="newHonor.description"
                class="input-field"
              ></b-form-input>
            </b-form-group>
            <div class="row">
              <div class="col-6">
                <label class="mb-0 smaller-font">Issue Date*</label>
                <b-form-group>
                  <b-form-input
                    id="from"
                    v-model="newHonor.issueDate"
                    type="date"
                    required
                    class="input-field"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
          </b-form>
          <div class="text-right">
            <button
              class="mt-2 btn btn-outline-secondary w-10"
              @click="editHonor "
            >Close</button>
            <button
              class="mt-2 btn btn-outline-primary w-25"
              v-if="buttonText === 'Edit Honor'"
              @click="editHonor "
            >{{buttonText}}</button>
            <button
              class="mt-2 btn btn-outline-primary w-25 "
              type="submit"
              v-else
              @click="addHonor "
            >{{buttonText}}</button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import url from "../config/server_config";

export default {
  name: "HonorModal",
  components: {},
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    honor: {
      type: Object
    },
    user: {
      type: Object
    },
    buttonText: {
      type: String
    }
  },
  data() {
    return {
      show: false,
      newHonor: {},
      showAlert: false,
      alertText: ""
    };
  },
  watch: {
    showModal(newVal) {
      this.show = newVal;
    },
    honor(newVal) {
      this.newHonor = newVal;
      this.newHonor.issueDate = this.$moment(this.newHonor.issueDate).format(
        "YYYY-MM-DD"
      );
    }
  },
  methods: {
    addHonor() {
      var headers = {
        // Authorization:
        //   "Bearer " +
        //   localStorage
        //     .getItem("jwtToken")
        //     .substring(4, localStorage.getItem("jwtToken").length)
      };

      if (this.newHonor.title.length === 0) {
        this.showAlert = true;
        this.alertText = "Title of the honor is required";
      } else if (this.newHonor.issuer.length === 0) {
        this.showAlert = true;
        this.alertText = "Issuer is required";
      } else if (this.newHonor.issueDate == "Invalid date") {
        this.newHonor.issueDate = null;
      } else if (this.newHonor.issueDate == "Invalid date") {
        this.showAlert = true;
        this.alertText = "Issue date is required";
      } else {
        console.log(this.newHonor);
        axios
          .post(
            `${url}/api/profile/honor`,
            { data: [this.newHonor], user: { id: this.user._id } },
            { headers: headers }
          )
          .then(response => {
            this.$swal({
              position: "top-right",
              backdrop: false,
              showConfirmButton: false,
              timer: 2500,
              width: "300px",
              imageHeight: 20,
              imageWidth: 20,
              background: "rgba(92,184,92,0.93)",
              title:
                "<span style=\"  font-family: 'Raleway', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;\">Successfully added honor!</span>"
            });
            this.show = false;
            this.newHonor = {};
            this.$emit("hideModal");
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true;
              this.alertText = "Error while adding honor";
            }
          });
      }
    },
    editHonor() {
      var headers = {
        // Authorization:
        //   "Bearer " +
        //   localStorage
        //     .getItem("jwtToken")
        //     .substring(4, localStorage.getItem("jwtToken").length)
      };

      var id = this.honor._id;

      axios
        .patch(`${url}/api/profile/honor/${id}`, this.newHonor, {
          headers: headers
        })
        .then(response => {
          if (response.status === 200) {
            this.$swal({
              position: "top-right",
              backdrop: false,
              showConfirmButton: false,
              timer: 2500,
              width: "300px",
              imageHeight: 20,
              imageWidth: 20,
              background: "rgba(92,184,92,0.93)",
              title:
                "<span style=\"  font-family: 'Raleway', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;\">Successfully edited honor!</span>"
            });
            this.show = false;
            this.newHonor = {};
            this.$emit("hideModal");
          }
        })
        .catch(e => {
          if (e.response.status === 400) {
            this.showAlert = true;
            this.alertText = "Error";
          }
        });
    }
  }
};
</script>

<style scoped>
  button {
    border-radius: 5px;
    cursor: pointer;
  }

  label {
    font-size: 15px;
    font-weight: 300;
    color: #6d6d6d;
  }
  .info-hover {
    cursor: pointer;
  }
  .info-hover:hover {
    background-color: #6c757d;
  }
  .nice-font {
    font-family: "Roboto", sans-serif;
    font-weight: 200;
  }
  .input-field {
    border: 0;
    border-radius: 5px;
    outline: none;
    font-weight: 300;
    box-shadow: none;
    margin-top: 1px;
    background-color: #e6e6e6;
  }
  .input-field:hover {
    background-color: #E3E3E3;
  }
  .input-field:focus {
    background-color: #E3E3E3;
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
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
  }
  /deep/ .modal-title {
    font-family: "Raleway", sans-serif;
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
    transition: opacity 0.5s ease;
  }
  /deep/ .modal-header {
    color: white;
    background-color: #c68967;
  }
  /deep/ .close {
    color: white;
  }

  /deep/ .btn-outline-primary {
    border: 1px solid #c68967 !important;
    color: grey !important;
  }

  /deep/ .btn-outline-primary:hover {
    border-color: #c68967 !important;
    background-color: #de9a73 !important;
    color: white !important;
  }

  /deep/ .modal {
    backdrop-filter: saturate(180%) blur(5px) !important;
  }

</style>
