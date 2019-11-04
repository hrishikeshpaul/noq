<template>
  <div class="pb-2">
    <multiselect
      v-model="value"
      :max-height="150"
      tag-placeholder="Add this as new tag"
      placeholder="Search or add a tag"
      label="keyName" track-by="id"
      :options="options"
      :taggable="true"
      :multiple="true"
      :option-height="104"
      @search-change="searchQuery"
      @tag="addTag"></multiselect>
  </div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import 'vue-multiselect/dist/vue-multiselect.min.css'
    import axios from "axios";



    export default {
        name: 'SkillSelect',
        components: {
            Multiselect
        },
        data() {
            return {
                value: [],
                options: []
            }
        },
        mounted() {
            axios({
                method: "GET", "url": 'https://cors-anywhere.herokuapp.com/' +
                    'https://trendyskills.com/service?q=keywords&like=' +
                    '' +
                    '&key=ULkph5viBzDWhvnh'
            })
                .then(result => {
                    this.options = result.data.keywords
                })
        },
        watch: {
            value(newVal) {
                if (typeof newVal.hasOwnProperty('keyName') !== null) {
                    this.$emit('addSkills', newVal);
                }
            }
        },
        methods: {
            searchQuery(newVal) {
                axios({
                    method: "GET", "url": 'https://cors-anywhere.herokuapp.com/' +
                        'https://trendyskills.com/service?q=keywords&like=' +
                        newVal +
                        '&key=ULkph5viBzDWhvnh'
                })
                    .then(result => {
                        this.options = result.data.keywords
                    })
            },
            addTag(newTag) {
                const tag = {
                    keyName: newTag,
                    id: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                };
                this.options.push(tag);
                this.value.push(tag);
            }
        }
    }
</script>

<style scoped>

</style>
