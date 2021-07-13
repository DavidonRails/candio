<template>
<div class="assessmentView">
    <b-row>
      <b-colxx xl="6" lg="12">
        <h2>Assessments Library</h2>
        <p>Welcome to our assessment library. Here you can take any of our available assessments to earn certifications, improve your profile, and get feedback on your skills. You can also retake assessments you’ve taken in the past after a delay if you think your skills have improved in the meantime.</p>
      </b-colxx>

      <b-colxx xl="6" lg="12">
        <div class="d-flex flex-row pb-3 border-bottom justify-content-center align-items-center">
          <span class="assessment_logo"></span>
        </div>
      </b-colxx>

    </b-row>

    <div class="separator mb-5"></div>

    <b-row>
      <b-colxx xxs="12">
        <h2>Core assessments</h2>
        <p>Earn a high score on these quizzes to qualify for a FastTrack interview.</p>
      </b-colxx>
    </b-row>

    <b-row>

      <!-- First Type -->
      <template v-for="(item, index) in assessmentList">
        <b-colxx v-if="!item.category" xl="3" lg="3" class="mt-5">
          <b-card>
              <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="width: 32px; height: 32px;">
                    <path :d="item.path" :fill="item.color" fill-rule="evenodd"></path>
                  </svg>

                  <h5 class="mb-0 font-weight-semibold color-theme-1 mb-4 mt-3" :style="{ color: item.color }">{{item.label}}</h5>
              </div>
              <div class="pl-3 pr-3 pt-3 pb-0 d-flex flex-column flex-grow-1">
                  <p class="text-muted mb-4 card-desc">{{item.summary}}</p>

                  <!-- There is no challenge for Quiz.  -->
                  <b-button v-if=" !item.challenge " :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <span class="d-inline-block">Take a Quiz</span>
                  </b-button>

                  <b-button v-if=" item.challenge " :disabled="item.challenge.state == 3" :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <!-- 0 : challenge had been created for quiz, 1 : challenge exist and it had been pledge  -->
                    <span v-if=" item.challenge.state == 0 || item.challenge.state == 1 " class="d-inline-block">Continue Quiz</span>

                    <!-- 2 : challenge had been completed  -->
                    <span v-if=" item.challenge.state == 2 " class="d-inline-block">View Result</span>

                    <!-- 3 : challenge had been time overed  -->
                    <span v-if=" item.challenge.state == 3 " class="d-inline-block">Time Over</span>
                  </b-button>
              </div>
          </b-card>
        </b-colxx>
      </template>
    </b-row>

    <div class="separator mb-5 mt-5"></div>

    <b-row>
      <b-colxx xxs="12">
        <h2>Entry-level core assessments</h2>
        <p>Take the entry-level version of one of our core assessments, aimed specifically at students, self-taught developers, and new graduates.</p>
      </b-colxx>
    </b-row>

    <b-row>
      <!-- Second Type -->
      <template v-for="(item, index) in assessmentList">
        <b-colxx v-if="item.category=='junior'" xl="3" lg="3" class="mt-5">
          <b-card>
              <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="width: 32px; height: 32px;">
                    <path :d="item.path" :fill="item.color" fill-rule="evenodd"></path>
                  </svg>

                  <h5 class="mb-0 font-weight-semibold color-theme-1 mb-4 mt-3" :style="{ color: item.color }">{{item.label}}</h5>
              </div>
              <div class="pl-3 pr-3 pt-3 pb-0 d-flex flex-column flex-grow-1">
                  <p class="text-muted mb-4 card-desc">{{item.summary}}</p>

                  <!-- There is no challenge for Quiz.  -->
                  <b-button v-if=" !item.challenge " :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <span class="d-inline-block">Take a Quiz</span>
                  </b-button>

                  <b-button v-if=" item.challenge " :disabled="item.challenge.state == 3" :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <!-- 0 : challenge had been created for quiz, 1 : challenge exist and it had been pledge  -->
                    <span v-if=" item.challenge.state == 0 || item.challenge.state == 1 " class="d-inline-block">Continue Quiz</span>

                    <!-- 2 : challenge had been completed  -->
                    <span v-if=" item.challenge.state == 2 " class="d-inline-block">View Result</span>

                    <!-- 3 : challenge had been time overed  -->
                    <span v-if=" item.challenge.state == 3 " class="d-inline-block">Time Over</span>
                  </b-button>

              </div>
          </b-card>
        </b-colxx>
      </template>
    </b-row>

    <div class="separator mb-5 mt-5"></div>

    <b-row>
      <b-colxx xxs="12">
        <h2>Language quizzes</h2>
        <p>Take the entry-level version of one of our core assessments, aimed specifically at students, self-taught developers, and new graduates.</p>
      </b-colxx>
    </b-row>

    <b-row>
      <!-- Third Type -->
      <template v-for="(item, index) in assessmentList">
        <b-colxx v-if="item.category=='language'" xl="3" lg="3" class="mt-5">
          <b-card>
              <div class="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="width: 32px; height: 32px;">
                    <path :d="item.path" :fill="item.color" fill-rule="evenodd"></path>
                  </svg>

                  <h5 class="mb-0 font-weight-semibold color-theme-1 mb-4 mt-3" :style="{ color: item.color }">{{item.label}}</h5>
              </div>
              <div class="pl-3 pr-3 pt-3 pb-0 d-flex flex-column flex-grow-1">
                  <p class="text-muted mb-4 card-desc">{{item.summary}}</p>

                  <!-- There is no challenge for Quiz.  -->
                  <b-button v-if=" !item.challenge " :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <span class="d-inline-block">Take a Quiz</span>
                  </b-button>

                  <b-button v-if=" item.challenge " :disabled="item.challenge.state == 3" :style="{ backgroundColor: item.color, borderColor: item.color }" @click="challenge(index)">
                    <!-- 0 : challenge had been created for quiz, 1 : challenge exist and it had been pledge  -->
                    <span v-if=" item.challenge.state == 0 || item.challenge.state == 1 " class="d-inline-block">Continue Quiz</span>

                    <!-- 2 : challenge had been completed  -->
                    <span v-if=" item.challenge.state == 2 " class="d-inline-block">View Result</span>

                    <!-- 3 : challenge had been time overed  -->
                    <span v-if=" item.challenge.state == 3 " class="d-inline-block">Time Over</span>
                  </b-button>

              </div>
          </b-card>
        </b-colxx>
      </template>
    </b-row>

</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import axios from 'axios'

import {
  backendApi
} from '../../constants/config'

import {
 svgIcons
} from '../../data/svg-icon'

export default {
    components: {

    },
    data() {
        return {
          isLoad: false,
          currentColor: '#F18024',
          apiBase: backendApi + '/assessments',
          svgIcons,
        }
    },

    computed: {
        ...mapGetters(["currentUser", "assessmentList",])
    },

    created() {
      this.loadItems();
    },

    methods: {
      ...mapActions(["getAssessmentList", "setChallenge", ]),
      loadItems() {
        var self = this;

        this.getAssessmentList().then(
          function () {
            console.log("init : ", self.assessmentList);
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );
      },

      challenge(index) {
        console.log("Selected : ", this.assessmentList[index]);
        this.setChallenge(this.assessmentList[index]);
        this.$router.push("/candidate/challenge");
      }
    }
}
</script>
