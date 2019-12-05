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
        :title="'Certification'"
      >
        <!--        <template v-slot:modal-title>-->
        <!--          <div style="font-size: 40px;" class="nice-font px-3">-->
        <!--            Certification-->
        <!--          </div>-->
        <!--          <p style="font-size: 17px; color: #575e65; margin-top: -7px; padding-left: 2px;" class="mb-0 nice-font px-3">Give some details to describe your certification!</p>-->
        <!--        </template>-->
        <div class="d-block text-center px-3 nice-font pb-2">
          <b-alert variant="danger" v-if="showAlert" :show="10">{{alertText}}</b-alert>
          <b-form class="text-left">
            <label class="mb-0 smaller-font">Title of certification*</label>
            <b-form-group>
              <b-form-input id="title" v-model.trim="newCertification.title" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Issuer*</label>
            <b-form-group>
              <b-form-input id="issuer" v-model.trim="newCertification.issuer" class="input-field"></b-form-input>
            </b-form-group>
            <label class="mb-0 smaller-font">Description*</label>
            <b-form-group>
              <b-form-input
                id="description"
                v-model.trim="newCertification.description"
                class="input-field"
              ></b-form-input>
            </b-form-group>
            <div class="row">
              <div class="col-6">
                <label class="mb-0 smaller-font">Issue Date*</label>
                <b-form-group>
                  <b-form-input
                    id="issueDate"
                    v-model="newCertification.issueDate"
                    type="date"
                    required
                    class="input-field"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-6">
                <label class="mb-0 smaller-font">Expiry Date*</label>
                <b-form-group>
                  <b-form-input
                    id="expiryDate"
                    v-model="newCertification.expiryDate"
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
              @click="editCertification"
            >Close</button>
            <button
              class="mt-2 btn btn-outline-primary w-25"
              v-if="buttonText === 'Edit Certification'"
              @click="editCertification"
            >{{buttonText}}</button>
            <button
              class="mt-2 btn btn-outline-primary w-25"
              type="submit"
              v-else
              @click="addCertification"
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
  name: "CertificationModal",
  components: {},
  props: {
    showModal: {
      type: Boolean,
      default: false,
      required: true
    },
    certification: {
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
      newCertification: {},
      showAlert: false,
      alertText: ""
    };
  },
  watch: {
    showModal(newVal) {
      this.show = newVal;
    },
    certification(newVal) {
      this.newCertification = newVal;
      this.newCertification.issueDate = this.$moment(
        this.newCertification.issueDate
      ).format("YYYY-MM-DD");
      this.newCertification.expiryDate = this.$moment(
        this.newCertification.expiryDate
      ).format("YYYY-MM-DD");
    }
  },
  methods: {
    addCertification() {
      var headers = {
        // Authorization:
        //   "Bearer " +
        //   localStorage
        //     .getItem("jwtToken")
        //     .substring(4, localStorage.getItem("jwtToken").length)
      };

      if (this.newCertification.title.length === 0) {
        this.showAlert = true;
        this.alertText = "Title of the certification is required";
      } else if (this.newCertification.issuer.length === 0) {
        this.showAlert = true;
        this.alertText = "Issuer is required";
      } else if (this.newCertification.issueDate == "Invalid date") {
        this.newCertification.issueDate = null;
      } else if (this.newCertification.issueDate == "Invalid date") {
        this.showAlert = true;
        this.alertText = "Issue date is required";
      } else if (this.newCertification.expiryDate == "Invalid date") {
        this.showAlert = true;
        this.alertText = "Expiry date is required";
      } else {
        axios
          .post(
            `${url}/api/profile/certification`,
            { data: [this.newCertification], user: { id: this.user._id } },
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
                "<span style=\"  font-family: 'Raleway', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;\">Successfully added certification!</span>"
            });
            this.show = false;
            this.newCertification = {};
            this.$emit("hideModal");
          })
          .catch(e => {
            if (e.response.status === 400) {
              this.showAlert = true;
              this.alertText = "Error while added certification";
            }
          });
      }
    },
    editCertification() {
      var headers = {
        // Authorization:
        //   "Bearer " +
        //   localStorage
        //     .getItem("jwtToken")
        //     .substring(4, localStorage.getItem("jwtToken").length)
      };

      var id = this.certification._id;

      axios
        .patch(
          `${url}/api/profile/certification/${id}`,
          this.newCertification,
          {
            headers: headers
          }
        )
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
                "<span style=\"  font-family: 'Raleway', sans-serif; font-size: 16px; font-weight: 200; color: white; padding-top: 10px;\">Successfully edited certification!</span>"
            });
            this.show = false;
            this.newCertification = {};
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
