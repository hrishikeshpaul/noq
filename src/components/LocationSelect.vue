<template>
  <div class="pb-2">
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search for a city"
      label="name" track-by="name"
      :options="options"
      :taggable="false"
      :multiple="false"
      :option-height="194"
      @search-change="searchQuery"
    ></multiselect>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import axios from 'axios'

  export default {
    name: 'Location select',
    components: {
      Multiselect
    },
    data () {
      return {
        value: {name: this.rVal},
        options: []
      }
    },
    props: {
      rVal: {
        type: String
      }
    },
    created () {
          this.options = [{name: 'search for a city'}]
    },
    watch: {
      value (newVal) {
        if (typeof newVal.hasOwnProperty('name') !== null) {
          this.$emit('addLocation', newVal)
        }
      }
    },
    methods: {
      searchQuery (newVal) {
        axios({
          method: 'GET', 'url': 'https://cors-anywhere.herokuapp.com/' +
            'http://api.geonames.org/postalCodeSearchJSON?placename_startsWith=' +
            newVal +
            '&username=rayzhang001'
        })
          .then(result => {
            // this.options=[]
            var arr = result.data.postalCodes
            arr.forEach(s => {
              let address = s.placeName + ', ' + s['ISO3166-2']
              if (!this.options.includes({name: address})) {
                this.options.push({name: address})
              }
            })
            console.log(this.options[0])

          })
      },
    }
  }
</script>

<style scoped>

</style>
