<template>
<div class="challengeView">

    <div v-if="isLoad" class="loading"></div>

    <b-row>

        <b-col v-if="quiz" offset-md="2" offset-sm="0" md="8" sm="12">
          <!-- State = 0 : Challenge Exist, But had not pledge -->
          <b-card v-if="quiz.state == 0" :title="challenge.label" class="challenge_card text-center">

            <div  class="text-left">
              <b-card-text>
                {{challenge.label}} covers the following areas:

                <br />
                <br />
                <p>{{challenge.description}}</p>
              </b-card-text>
              <b-form-group>
              <b-form-checkbox v-model="bPledge" name="pledge" @click="setPledge">
                Pledge: I promise to answer myself without help from anyone.
              </b-form-checkbox>
              </b-form-group>
              <br />

            </div>

            <b-button :disabled="!bPledge" variant="primary" @click="startQuiz">
              <span class="d-inline-block">Take a Quiz</span>
            </b-button>
          </b-card>

          <!-- State = 1 : Challenge in Progress -->
          <b-card v-if="quiz.state == 1" :title="challenge.label" class="challenge_card text-center">

            <div v-if="!isLoad && !requestError" class="position-relative timer">
                <b-badge variant="danger" pill class="position-absolute badge-top-right text-large ">{{secondPerQuestion}} s</b-badge>
            </div>

            <div  class="text-left">
              <b-card-text>
                <h4>Question {{quiz.progress + 1}} : </h4>
                {{curQuestion.query}}
                <br />
                <br />

                <h4>Answers : </h4>
                  <b-form-group label="Please select one answer.">
                    <b-form-checkbox v-for="(ans, index) in curQuestion.answers" v-model="selected" :key="ans.id" :value="index" name="flavour">
                      {{ ans.answer }} - {{ans.isCorrect}}
                    </b-form-checkbox>
                  </b-form-group>
                  {{selected}}
              </b-card-text>

            </div>

            <b-button v-if="!isLoad" variant="primary" @click="next">
              <span class="d-inline-block">Next</span>
            </b-button>
          </b-card>

          <!-- State = 2 : Challenge in Progress -->
          <b-card v-if="quiz.state == 2" :title="challenge.label" class="challenge_card text-center">
            <div class="text-left">
              <b-card-text style="margin-bottom: 200px;">
                <h4>Thanks for your challenge!</h4>
                Your score is {{quiz.score}} of {{quiz.question_list.length}} questions.
                <br />
                <br />
              </b-card-text>

            </div>

            <b-button variant="primary" @click="goAssessment()">
              <span class="d-inline-block">Go Assessment</span>
            </b-button>
          </b-card>

          <!-- State = 3 : Challenge had been time over -->
          <b-card v-if="quiz.state == 3" :title="challenge.label" class="challenge_card text-center">
            <div class="text-left">
              <b-card-text style="margin-bottom: 200px;">
                <h4>Sorry, We can not process your challenge because you have exceeded the a hour as limitaiton time for Quiz.</h4>
                <br />
                <h4>Please contact to Administrator if you want to retake this Quiz.</h4>
                <br />
              </b-card-text>
            </div>

            <b-button variant="primary" @click="goAssessment()">
              <span class="d-inline-block">Go Assessment</span>
            </b-button>
          </b-card>


        </b-col>
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
          bPledge: false,
          currentColor: '#F18024',
          apiBase: backendApi + '/assessments',
          svgIcons,
          curQuestion: [],
          selected: -1,
          state : 0, // 0: challenge created, 1 : Pledge agree, challenge started,  2 : challenge completed, 3 : challenge abstention
          interval: null,

        }
    },

    computed: {
        ...mapGetters(["currentUser", "challenge", "quiz", "secondPerQuestion", "requestError"])
    },

    created() {
      this.init();
    },

    beforeDestroy () {
      console.log('clear interval');
      clearInterval(this.interval)
    },

    methods: {
      ...mapActions([ "getQuiz", "startChallenge", "nextQuestion", "setSecondPerQuestion", ]),
      init() {
          var self = this;

          self.isLoad = true;

          var params = {
              user_id: this.currentUser.id,
              quiz_id: this.challenge.id
          };

          this.getQuiz(params).then(
            function () {

              self.isLoad = false;

              console.log("Init Quiz : ", self.quiz.question_list.length);
              if(self.quiz.progress <= self.quiz.question_list.length) {
                self.curQuestion = self.quiz.questions[self.quiz.progress];
              }
              console.log("Current Question : ", self.curQuestion);
              console.log(self.interval);
              if(self.interval == null && self.quiz.state == 1) {
                console.log("init timer");
                self.setSecondPerQuestion();
                self.interval = setInterval(() => {
                    self.timeCount();
                }, 1000);
              }

            },
            function (err) {
              self.isLoad = false;
              console.log("ERR : ", err);
            }
          );

      },

      setPledge() {
        this.bPledge = !this.bPledge;
      },

      startQuiz() {
          var self = this;

          self.isLoad = true;

          var params = {
            challenge_id: this.quiz.id
          };

          this.startChallenge(params).then(
            function () {
              self.isLoad = false;

              if(self.quiz.progress <= self.quiz.question_list.length) {
                self.curQuestion = self.quiz.questions[self.quiz.progress];
              }
              console.log("Current Quiz : ", self.curQuestion);

              if(self.interval == null && self.quiz.state == 1) {
                console.log("start timer");
                self.setSecondPerQuestion();
                self.interval = setInterval(() => {
                    self.timeCount();
                }, 1000);
              }

            },
            function (err) {
              self.isLoad = false;
              console.log("ERR : ", err);
            }
          );
      },

      next() {
        var self = this;

        if(this.selected == -1) {
          alert('Please select one answer');
          return;
        } else {

          self.isLoad = true;

          var params = {
            challenge_id : this.quiz.id,
            user_id : this.currentUser.id,
            quiz_id : this.quiz.quiz_id,
            question_id : this.curQuestion.id,
            answer_id : this.curQuestion.answers[this.selected].id,
          }

          self.selected = -1;
          self.curQuestion = [];

          this.nextQuestion(params).then(
            function (res) {

              console.log("BBBBBBBb : ", self.quiz.questions);
              self.isLoad = false;

              if(self.quiz.progress <= self.quiz.question_list.length) {
                self.curQuestion = self.quiz.questions[self.quiz.progress];
              }
              console.log("Current Quiz : ", self.curQuestion);
              self.setSecondPerQuestion();

            },
            function (err) {
              self.isLoad = false;
              console.log("ERR : ", err);
            }
          );

        }

      },

      timeCount() {
          var self  = this;

          this.setSecondPerQuestion(this.secondPerQuestion - 1);
          console.log(this.secondPerQuestion);

          if(self.quiz.progress >= self.quiz.question_list.length) clearInterval(this.interval);

          if(this.secondPerQuestion == 0 ) {

              self.isLoad = true;

              var params = {
                challenge_id : this.quiz.id,
                user_id : this.currentUser.id,
                quiz_id : this.quiz.quiz_id,
                question_id : this.curQuestion.id,
                answer_id : -1,
              }

              self.selected = -1;
              self.curQuestion = [];

              this.nextQuestion(params).then(
                function (res) {

                  self.isLoad = false;

                  if(self.quiz.progress <= self.quiz.question_list.length) {
                    self.curQuestion = self.quiz.questions[self.quiz.progress];
                  }
                  console.log("Current Quiz : ", self.curQuestion);
                  self.setSecondPerQuestion();

                },
                function (err) {
                  self.isLoad = false;
                  console.log("ERR : ", err);
                }
              );

          }


      },

      goAssessment() {
          this.$router.push("/candidate/assessment");
      },
    },

    watch: {

        requestError(val) {
            if (val != null) {
                this.$notify("error", "Sorry! Server down!", val, {
                    duration: 3000,
                    permanent: false
                });

            }
        }
    },
}
</script>
