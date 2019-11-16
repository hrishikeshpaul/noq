<template>
  <div class="wrapper">
    <b-card
            style="height: 300px; border-radius: 10px;"
    >
      <img
        :src="job.employer.profilepicture ? job.employer.profilepicture.toString() : require('../assets/company.jpg')"
        class="card-img-top embed-responsive"
        style="max-height: 299px; height: 100%; border-radius: 10px; object-fit: cover;"/>
      <div class="info_background" :style="info_bg"></div>
      <div class="info">
        <span style="font-weight: bold">{{job.company}}</span>
        <br/>
        <span>{{job.location}}</span>
        <br/>
        <span>{{displaySkills(job.skills)}}</span>
        <br/>
        <br/>
        <br/>
      </div>
    </b-card>
    <div class="overlay" :style="info_bg" @click="$emit('showJobModal')">
      <div class="text">
        <div class="row">
          <div class="col-6">
            <div class=" ml-5">Dismiss</div>
            <br>
            <button class=" mr-5 btn-lg btn-danger ml-5" @click="$emit('reject', job._id)" ><i class="ti-close"></i>
            </button>
          </div>
          <div class="col-6">
            <div class="mr-4 ">Apply</div>
            <br>
            <button @click="$emit('accept', job._id)" class=" mr-4 btn-lg btn-success"><i class="ti-check"></i></button>
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
        backgroundColor:"#16a085"
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
    }
  },

  mounted () {
    if (this.job.employer.profilepicture) {
      Vibrant.from(this.job.employer.profilepicture.toString()).getPalette().then(response => {
        this.info_bg.backgroundColor = response.DarkMuted.getHex()
      })
    } else {
      this.info_bg.backgroundColor = 'rgba(0,0,0,0.57)'
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
    background-color: rgba(38, 40, 39, 0.5);
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
    top: 68%;
    left: 0;
    height: 33.3%;
    width: 100%;
    text-align: center;
  }

  .wrapper:hover .overlay {
    opacity: .9;
  }

  .btn-lg {
    border-radius: 100px;
    width: 60px;
    height: 60px;
  }

  .text {
    color: white;
    font-size: 20px;
    position: relative;
    top: 50%;
    left: 50%;
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

</style>
