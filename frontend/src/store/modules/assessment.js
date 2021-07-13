import {
  backendApi
} from '../../constants/config'


import { svgIcons }
from '../../data/svg-icon'

import axios from 'axios'
import user from './user'


export default {
  state: {
    requestError: null,
    assessmentList: [],
    challenge: localStorage.getItem('challenge') != null ? JSON.parse(localStorage.getItem('challenge')) : null,
    quiz: null,
    secondPerQuestion: 120,
  },
  getters: {
    assessmentList: state => state.assessmentList,
    requestError: state => state.requestError,
    challenge: state => state.challenge,
    quiz: state => state.quiz,
    secondPerQuestion: state => state.secondPerQuestion,
  },
  mutations: {
    setAssessmentList(state, payload) {
      state.assessmentList = payload
      state.requestError = null
    },
    setError(state, payload) {
      state.requestError = payload
      state.currentUser = null
    },
    showError(state, payload) {
      state.requestError = payload
    },
    clearError(state) {
      state.requestError = null
    },
    setChallenge(state, payload) {
      state.challenge = payload
    },
    setQuiz(state, payload) {
      state.quiz = payload
    },
    updateQuiz(state, payload) {
      state.quiz.progress = payload.progress
      state.quiz.state = payload.state
      state.quiz.score = payload.score
      state.quiz.question_list = payload.question_list
    },
    setSecondPerQuestion(state, payload) {
      state.secondPerQuestion = payload
    },
  },
  actions: {
    setSecondPerQuestion({ commit }, payload = 120) {
      commit('setSecondPerQuestion', payload);
    },

    getAssessmentList({ commit }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('clearError')

      var params = {
        user_id: user.state.currentUser.id
      };


      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/assessments`, params,
        {
          headers: headers
        })
        .then(response => {

          commit('clearError')

          response.data.forEach(e => {
            if(svgIcons[e.assessment]) {
              e.path = svgIcons[e.assessment].path;
            } else {
              e.path = svgIcons.common.path;
            }

            if(e.challenge) {

              if(e.challenge.state == 1 || e.challenge.state == 0) { // 0 : Challenge had been created , 1 : Challenge had been pledged
                e.color = '#90221D';
              } else { // 0 - 2: Completed, 3: Time over
                e.color = '#A5A8AA';
              }
            } else { // There is no any challenge for quiz.

              if(e.category == 'language') {
                e.color = '#07B67C';
              } else if(e.category == 'junior') {
                e.color = '#4D8DDB';
              } else {
                e.color = '#F18024';
              }
            }

          });
          commit('setAssessmentList', response.data)
          resolve(response.data)

        }).catch(error => {

          commit('setError', error)

          setTimeout(() => {
            commit('clearError')
          }, 3000)
          reject(error)

        })

      });

    },

    setChallenge({commit}, payload) {
      commit('setChallenge', payload);
      localStorage.setItem('challenge', JSON.stringify(payload))
    },

    getQuiz({commit}, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('clearError')

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/questions`, payload,
        {
          headers: headers
        })
        .then(response => {

          commit('clearError')

          commit('setQuiz', response.data)

          resolve(response.data)

        }).catch(error => {

          commit('setError', error)
          setTimeout(() => {
            commit('clearError')
          }, 3000)
          reject(error)

        })

      });

    },

    startChallenge({commit}, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('clearError')
      console.log(payload);
      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/startChallenge`, payload,
        {
          headers: headers
        })
        .then(response => {

          commit('clearError')
          commit('updateQuiz', response.data)
          console.log('start quiz state  : ', this.state.quiz)
          resolve(response.data)

        }).catch(error => {

          commit('setError', error)
          setTimeout(() => {
            commit('clearError')
          }, 10000)
          reject(error)

        })

      });

    },


    nextQuestion({commit}, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('clearError')
      console.log(payload);
      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/nextQuestion`, payload,
        {
          headers: headers
        })
        .then(response => {

          commit('clearError')

          commit('updateQuiz', response.data)

          resolve(response.data)

        }).catch(error => {

          commit('setError', error)
          setTimeout(() => {
            commit('clearError')
          }, 3000)
          reject(error)

        })

      });

    }


  }
}
