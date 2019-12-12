<template>
  <div class="pb-2">
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search for a city"
      :options="options"
      :show-labels="false"
      :taggable="false"
      :multiple="false"
      :option-height="194"
      @search-change="searchQuery"
    />
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import axios from 'axios'

  export default {
    name: 'LocationSelect',
    components: {
      Multiselect
    },
    data () {
      return {
        value: this.rVal,
        options: []
      }
    },
    props: {
      rVal: {
        type: String
      }
    },
    created () {
      this.options = ['search for your city']
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
        this.options=['search for your city']
        axios({
          method: 'GET',
          'url':
          'https://cors-anywhere.herokuapp.com/' +
            'http://api.geonames.org/postalCodeSearchJSON?placename_startsWith=' +
            newVal +
            '&username=rayzhang001'
        })
          .then(result => {
            var arr = result.data.postalCodes
            arr.forEach(s => {
              let address = s.placeName + ', ' + s['ISO3166-2']
              if (!this.options.includes(address)) {
                this.options.push(address)
              }
            })
          })
      }
    }
  }
</script>

<style scoped>
  /deep/ .multiselect__single {
    background-color: #e6e6e6 !important;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__tags {
    background-color: #e6e6e6 !important;
    border: none !important;
    font-weight: 300 !important;
  }

  /deep/ .multiselect__tags:hover {
    background-color: #E3E3E3 !important;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__single:hover {
    background-color: #E3E3E3 !important;
    font-weight: 300 !important;
  }
  /deep/ .multiselect__input {
    background-color: #e6e6e6 !important;
    font-weight: 300 !important;
  }
</style>
