<template>
  <div class="pb-2">
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search or add a tag"
      label="name" track-by="id"
      :options="options"
      :taggable="true"
      :multiple="false"
      :option-height="104"
    ></multiselect>
  </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import colleges from "../assets/college.json"


    export default {
        components: {
            Multiselect
        },
        data () {
            return {
                value: { keyName: 'Vue.js', id: 'JavaScript' },
                options: colleges
            }
        },
        watch: {
            value(newVal) {
                if (typeof newVal.hasOwnProperty('name') !== null) {
                    this.$emit('addCompany', newVal);
                }
                console.log(JSON.stringify(newVal))
            }
        },
        methods: {
            nameWithLang ({ name, language }) {
                return `${name} — [${language}]`
            }
        }
    }
</script>

<style scoped>

</style>
