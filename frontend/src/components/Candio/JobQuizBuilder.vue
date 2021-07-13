<template>
<div class="border question mb-4 p-1 edit-quesiton">
    <div class="d-flex w-100" >
        <div class="w-70">
            <div class="list-item-heading mb-0 truncate w-100 m-1">
                <span class="badge badge-pill handle mr-1"><i class="simple-icon-cursor-move"/></span>{{data.quiz}}
            </div>
        </div>

        <div class="w-30 m-0">
            <b-button variant="outline-theme-3" class="icon-button float-right mr-1" @click="changeMode('preview')"  v-if="mode=='edit'">
                <i class="simple-icon-eye"></i>
            </b-button>
            <b-button variant="outline-theme-3" class="icon-button float-right mr-1" @click="changeMode('edit')" v-if="mode=='preview'">
                <i class="simple-icon-pencil"></i>
            </b-button>

            <b-button variant="outline-theme-3" class="icon-button rotate-icon-click rotate float-right mr-1"
                @click="showDetail = !showDetail"
                :aria-controls="`questionCollapse${sort}`"
                :aria-expanded="showDetail ? 'true' : 'false'"
            >
                <i :class="{'with-rotate-icon':true,'simple-icon-arrow-down':!showDetail,'simple-icon-arrow-up':showDetail}"></i>
            </b-button>
        </div>
    </div>
    <b-collapse :id="`questionCollapse${sort}`" class="question-collapse" v-model="showDetail" >
        <div class="pt-0">
            <div v-if="mode=='edit'" key="edit">
                <div class="form-group mb-3">
                    <label>Type</label>
                    <v-select :id="`j_quiz_type_${sort}`" :options="jobQuizTypeList" v-model="data.type">
                        <template slot="option" slot-scope="option">
                            {{ option.label }}
                        </template>
                    </v-select>

                </div>
                <div class="form-group mb-5">
                    <label>Question</label>
                    <b-input v-model="data.quiz"/>
                </div>

                <!--div class="separator mb-4"></!--div-->

                <div class="form-group" v-if="data.type.options">

                    <label class="d-block">Answers</label>
                    <draggable type="div" class="answers mb-3 sortable" :options="{handle:'.handle'}">
                        <div class="mb-1 position-relative" v-for="(a,index) in data.answers" :key="index">

                            <b-input v-model="a.label" />

                            <div class="input-icons">
                                <span class="badge badge-pill handle pr-0 mr-0"><i class="simple-icon-cursor-move"/></span>
                                <span class="badge badge-pill" @click="deleteAnswer(a.value)"><i class="simple-icon-ban"/></span>
                            </div>
                        </div>
                    </draggable>

                    <div class="text-center">
                        <b-button variant="link" size="sm" class="float-right" @click="addAnswer"><i class="simple-icon-plus btn-group-icon"/> Add Answer</b-button>
                    </div>
                </div>

                <b-button variant="link" size="sm" class="text-danger mb-2" @click="deleteQuiz"><i class="simple-icon-trash"/> Delete question</b-button>

            </div>
            <div  v-else-if="mode=='preview'" key="preview">
                <div class="m-2 color-strong" style="font-style: italic;">Question : </div>
                <div class="m-2 ml-3">{{data.quiz}}</div>

                <div class="m-2 color-strong" style="font-style: italic;">Answers : </div>

                <div class="m-2 ml-3">
                  <b-textarea key="free-text-preview" :rows="2" :max-rows="2" v-if="data.type.value=='free-text'" />
                  <b-input key="short-text-preview" v-if="data.type.value=='short_text'" />
                  <b-input key="boolean-select-preview" v-if="data.type.value=='boolean'"/>
                  <v-select :options="data.answers" key="dropdown-preview" v-else-if="data.type.value=='dropdown'"/>
                  <v-select multiple :options="data.answers" key="multiple-select-preview" v-else-if="data.type.value=='multiple_choice'" />
                  <v-date-picker mode="single" v-model="tempDate" key="date-input-preview" v-else-if="data.type.value=='date'"
                  :input-props="{ class:'form-control', placeholder: 'Please select date...' }"></v-date-picker>
                  <b-input type="number" placeholder="" key="number-input-preview" v-else-if="data.type.value=='numeric'" />
                  <b-form-file key="file-input-preview" placeholder="Please select file..." v-else-if="data.type.value=='file'" />

                </div>

            </div>
        </div>
    </b-collapse>
</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Draggable from 'vuedraggable'
import { jobQuizTypeList } from "../../constants/job";
import { getRandomText } from "../../utils/index";

import {
    mapGetters,
    mapActions,
    mapState
} from "vuex";

export default {
  props: ['data', 'sort'],

  components: {
    'v-select' :vSelect,
    'draggable' :Draggable
  },

  computed: {
      ...mapGetters(["currentUser", "_getCompanyProfile", "_getCurJob", ]),
  },

  data () {
    return {
      jobQuizTypeList,
      mode: 'edit', // edit,
      showDetail: false,
      quiz: '',
      answers: null,
      tempDate: null,
      type: jobQuizTypeList[0]
    }
  },

  mounted () {
    if(!this.data.type) this.data.type = this.jobQuizTypeList[0];

    // this.quiz = this.data.quiz;
    // this.answers = this.data.answers;
    // this.type = this.jobQuizTypeList.find(x => x.value === this.data.type);
  },

  methods: {
    deleteQuiz() {
      this._getCurJob.application.questions.splice(this.sort, 1);
    },
    changeMode (mode) {
      this.mode = mode
      this.showDetail = true
    },
    deleteAnswer (option) {
      this.data.answers = this.data.answers.filter(x => x.value !== option)
    },
    addAnswer () {
      this.data.answers.push({ value: getRandomText(), label: '' })
      console.log(this.data.answers);
    },
    checkQuizAnswer(index) {
      console.log(this.data.answers);
    },
  },

  watch: {
    showDetail (val) {
      if (!val) {
      }
    }
  }
}
</script>
