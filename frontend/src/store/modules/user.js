import firebase from 'firebase/app'
import 'firebase/auth'

import {
  backendApi,
  avatarURLs,
} from '../../constants/config'

import axios from 'axios'
export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null,
    fbProvider : new firebase.auth.GoogleAuthProvider(),

  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
    fbProvider: state => state.fbProvider,

  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      if(!payload.photoURL) {
        //  var index = payload.id % 4;
        //  state.currentUser.photoURL = avatarURLs[index];
        state.currentUser.photoURL = "https://ui-avatars.com/api/?name="+ state.currentUser.title;
      }
      localStorage.setItem('user', JSON.stringify(state.currentUser))
      state.processing = false
      state.loginError = null
    },

    setSkillData(state, payload) {
      state.currentUser.skill = payload.skill
      state.processing = false
      state.loginError = null
    },

    setCompanyData(state, payload) {
      state.currentUser.company = payload
      state.processing = false
      state.loginError = null
    },

    setLogout(state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    showError(state, payload) {
      state.loginError = payload
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit, state }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/auth/signin`, payload)
        .then(response => {
          console.log(response)
          commit('clearError')
          commit('setUser', response.data)
          console.log("User Data : ", state.currentUser)
          resolve(response.data)

        }).catch(error => {
          console.log('Login Error : ', error);
          commit('setError', error)
          setTimeout(() => {
            commit('clearError')
          }, 10000)
          reject(error)

        })

      })
    },

    setPersonalData({ commit }, payload) {
      commit('setUser', payload);
    },

    setSkillData({ commit }, payload) {
      commit('setSkillData', payload);
    },

    setCompanyData({ commit }, payload) {
      commit('setCompanyData', payload);
    },

    register({ commit }, payload) {

      commit('clearError')
      commit('setProcessing', true)
      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/auth/signup`, payload)
        .then(response => {

          commit('clearError')
          commit('setUser', response.data)
          resolve(response.data)

        }).catch(error => {

          commit('showError', error.response.data.message)
          setTimeout(() => {
            commit('clearError')
          }, 10000)
          reject(error)

        })
      })

    },

    googleSignin({ commit }, provider) {

        return new Promise ((resolve, reject) => {
            firebase.auth().signInWithPopup(provider).then(function(result) {
              // This gives you a Google Access Token. You can use it to access the Google API.
              var token = result.credential.accessToken;
              // The signed-in user info.
              var user = result.user;

              let info = {
                uid: user.uid,
                provider : user.providerData[0].providerId,
              };

              resolve(info);

            }).catch(function(error) {

              var errorMessage = error.message;
              commit('setError', errorMessage)
              setTimeout(() => {
                commit('clearError')
              }, 10000)

              reject(error);
            });

        });
    },

    googleSignup({ commit, dispatch }, provider) {

      return new Promise ((resolve, reject) => {
          firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            let info = {
              uid: user.uid,
              username: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              isAnonymous : user.isAnonymous,
              provider : user.providerData[0].providerId,
            };

            resolve(info);

          }).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;

            commit('setError', errorMessage)
            setTimeout(() => {
              commit('clearError')
            }, 10000)

            reject(error);
          });
      });
    },

    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      /*
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError')
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
      */
    },

    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      /*
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
      */
    },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => { })

    }
  }
}
