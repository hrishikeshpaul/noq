<template>
  <div>
    <div class="wrapper">
      <b-card
        style="height: 200px; border-radius: 10px; width: 180px;"
      >
        <img
          :src="job.employer.profilepicture ? job.employer.profilepicture.toString() : require('../assets/company.jpg')"
          class="card-img-top embed-responsive"
          style="max-height: 299px; height: 100%; border-radius: 10px; object-fit: cover;"/>
        <div class="info_background" :style="info_bg"></div>
        <div class="info">
          <p style="font-weight: 400; font-size: 16px; margin-top: 2px;" class="mb-0">{{job.company}}</p>
          <p style="font-size: 12px; margin-top: -3px" class="mb-0">{{job.location}}</p>
          <p style="font-size: 12px;" class="mb-1">{{displaySkills(job.skills)}}</p>
          <br/>
          <br/>
          <br/>
        </div>
      </b-card>
      <div class="overlay"  @click="$emit('showJobModal')" v-if="!whatIf">
        <div class="overlay_bg" :style="info_bg"></div>
        <div class="text">
          <div class="row">
            <div class="col-6 pl-5">
              <div style="margin-left: 30px; font-size: 12px" class="mb-2">Dismiss</div>
              <button class="mr-5 btn-sm btn-danger" @click="$emit('reject', job._id)" style="margin-left: 35px; border: none;" ><i class="ti-close"></i>
              </button>
            </div>
            <div class="col-6 pr-5">
              <div style="margin-left: 46px; font-size: 12px" class="mb-2">Apply</div>
              <button @click="$emit('accept', job)" class="mr-4 btn-sm btn-success" style="margin-left: 45px; border: none;"><i class="ti-check"></i></button>
            </div>
          </div>
        </div>
    </div>
    </div>

  </div>
</template>

<script>
import * as Vibrant from 'node-vibrant'
export default {
  name: 'JobCard',
  data () {
    return {
      skillsToShow: '',
      imgArray: [
        '../assets/company.jpg',
      ],
      info_bg:{
        backgroundColor:"#FFD8B1"
      }
    }
  },
  props: {
    job: {
      type: Object,
      required: true,
      default: {
        skills: []
      }
    },
    whatIf: {
      type: Boolean
    }
  },

  mounted () {
    if (this.job.employer.profilepicture) {
      Vibrant.from(this.job.employer.profilepicture.toString()).getPalette().then(response => {
        this.info_bg.backgroundColor = response.DarkMuted.getHex()
      })
    } else {
      this.info_bg.backgroundColor = 'rgba(0,0,0,0.8)'
    }
  },
  methods: {
    displaySkills (skills) {
      if (skills.length > 0) {
        if (skills.length > 2) {
          return skills[0].name + ", " + skills[1].name + " & more"
        } else {
          return skills.map(s => s.name).join(', ')
        }
      } else {
        return ''
      }
    },
  }
}
</script>

<style scoped>
  .wrapper {
    position: relative;
    border-radius: 10px;}

  .overlay {
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 66.66%;
    width: 100%;
    opacity: 0;
    /*border-radius: 10px;*/
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transition: .5s ease;
    /*background-color: rgba(38, 40, 39, 0.5);*/
  }
  .overlay_bg {
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    opacity: 0.9;
    /*border-radius: 10px;*/
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transition: .5s ease;
    background-color: rgba(39, 233, 228, 0.5);
  }
  .info_background{
    position: absolute;
    top: 66.7%;
    left: -0.3%;
    height: 33.3%;
    width: 100.6%;
    text-align: center;
    opacity: .9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba(2, 117, 216, 0.78);
  }

  .info {
    color: white;
    font-size: 20px;
    position: absolute;
    top: 66.66%;
    left: 0;
    height: 33.3%;
    width: 100%;
    text-align: center;
  }

  .wrapper:hover .overlay {
    opacity: 1;
  }

  .btn-lg {
    border-radius: 100px;
    width: 60px;
    height: 60px;
  }

  .text {
    color: white;
    font-size: 16px;
    position: relative;
    top: 50%;
    left: 30%;
    opacity: 0.98;

    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .embed-responsive {
    object-fit: cover;
  }

  .card-body {
    padding: 0px !important;
  }

  button{
    cursor: pointer;
  }
  .whatifborder {
    border: 3px solid rgba(250,177,135,0.7)
  }

</style>
