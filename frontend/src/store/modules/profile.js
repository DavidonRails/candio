import { firebaseConfig } from '../../constants/config'

import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/auth'

import {
  backendApi
} from '../../constants/config'

import axios from 'axios'
import user from './user'

import { getDateFromString } from '../../utils/index'

function parseExperience(data) {
  console.log("Experience Parse : ", data);
  data.forEach((e) => {
    if(e.start_date) e.start_date = new Date(e.start_date);

    if(e.end_date) {
      e.end_date = new Date(e.end_date);
      e.still_work = false;
    }
    else {
      e.still_work = true;
    }

    e.pro_validate = true;
    e.isRequireEndDate = false;
    e.isPeriodValidate = false;

    e.projects.forEach((p) => {
      p.removed = false;
      p.skills = p.skills.split(",");

      if(p.images) {
        var temp = p.images.split(",");
        var images = [];

        temp.forEach((t) => {
          images.push({
            "default": 0,
            "highlight": 0,
            "path" : t
          });
        });

        p.images = images;

      } else {
        p.images = [];
      }
    });

  });

  return data;
};

function parseSideProjects(data) {
  console.log("Side Projects Parse : ", data);
  data.forEach((e) => {
    /*
    if(e.start_date) e.start_date = new Date(e.start_date);

    if(e.end_date) {
      e.end_date = new Date(e.end_date);
      e.still_work = false;
    }
    else {
      e.still_work = true;
    }

    e.isRequireEndDate = false;
    e.isPeriodValidate = false;
    */
    e.pro_validate = true;
    e.removed = false;
    e.skills = e.skills.split(",");

    if(e.images) {
      var temp = e.images.split(",");
      var images = [];

      temp.forEach((t) => {
        images.push({
          "default": 0,
          "highlight": 0,
          "path" : t
        });
      });

      e.images = images;

    } else {
      e.images = [];
    }

  });

  return data;
};


export default {

  state: {
    isUploading: false,
    profile: null,

    company_list: [],

    edit_company: null,
    edit_company_index: null,

    side_projects: [],

    profileError: null,
  },

  getters: {
    get_uploading: state => state.isUploading,

    get_profile: state => state.profile,

    get_company_list: state => state.company_list,
    get_edit_company_index: state => state.edit_company_index,
    get_edit_company: state => state.edit_company,

    get_side_projects: state => state.side_projects,

    get_profileError: state => state.profileError,

  },
  mutations: {

    _setProfile(state, payload) {
      state.profile = payload
    },

    _setCompany(state, payload) {
      state.company_list = payload
    },

    _addCompany(state, payload) {
      console.log("Add Company Index : ", state.edit_company_index)
      state.company_list.push(payload)
    },

    _editCompany(state, payload) {
      console.log("Edit Company Index : ", state.edit_company_index)
      state.company_list[state.edit_company_index] = payload
    },

    _removeCompany(state, payload) {
      console.log("Remove Company Index : ", state.edit_company_index)
      state.company_list.splice(state.edit_company_index, 1);
    },

    _setEditCompanyIndex(state, payload) {
      state.edit_company_index = payload
    },

    _setEditCompany(state, payload) {
      state.edit_company = payload
    },

    _addCompanyProject(state, payload) {
      state.edit_company.projects.push(payload)
    },

    _setSideProject(state, payload) {
      state.side_projects = payload
    },

    _addSideProject(state, payload) {
      state.side_projects.push(payload)
    },

    _setError(state, payload) {
      state.profileError = payload
    },

    _showError(state, payload) {
      state.profileError = payload
    },

    _clearError(state) {
      state.profileError = null
    },
  },

  actions: {
    setError({ commit }, payload) {
      console.log(payload)
      commit('_setError', payload)

      setTimeout(() => {
        commit('_clearError')
      }, 3000)
    },

    setUploadFlag({ commit, state }, payload) {
      state.isUploading = payload;
    },

    setProfile({ commit }, payload) {
      commit('_setProfile', payload);
    },

    getCandidateProfile({ commit, state }, payload) {
      var self = this;

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        userId: user.state.currentUser.id
      };

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/candidateProfile`, params,
        {
          headers: headers
        })
        .then(response => {
          console.log("--- Candidate Profile --- : ", response.data);
          commit('_clearError')

          response.data.photoURL = user.state.currentUser.photoURL;
          response.data.role = user.state.currentUser.role;

          if(response.data.education_start_date) response.data.education_start_date = new Date(response.data.education_start_date);
          if(response.data.education_end_date) response.data.education_end_date = new Date(response.data.education_end_date);

          response.data.resumeChanged = false;

          commit('_setProfile', response.data);

          var sideProjects = parseSideProjects(response.data.side_projects);

          commit('_setSideProject', sideProjects);

          var companys = parseExperience(response.data.experience);

          commit('_setCompany', companys);

          resolve(response.data)

        }).catch(error => {

          commit('_setError', error)

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        })

      });

    },

    async addCompany({ commit }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: payload.id? payload.id: "",
        userId: user.state.currentUser.id,
        profileId: payload.profileId,
        company_name: payload.company_name,
        position: payload.position,
        start_date : payload.start_date,
        end_date : payload.still_work? null : payload.end_date,

        projects: payload.projects,
        still_work : payload.still_work,
      };

      return new Promise ((resolve, reject) => {
          axios.post(`${backendApi}/updateExperience`, params, { headers: headers })
          .then(response => {

            var companys = parseExperience(response.data);
            commit('_setCompany', companys);

            resolve(companys)
          }).catch(error => {
            commit('_setError', "Sorry! System Error")

            setTimeout(() => {
              commit('_clearError')
            }, 3000)
            reject(error)
          });
      });

    },

    updateCompany({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: payload.id? payload.id: "",
        userId: user.state.currentUser.id,
        profileId: payload.profileId,
        company_name: payload.company_name,
        position: payload.position,
        start_date : payload.start_date,
        end_date : payload.still_work? null : payload.end_date,

        projects: payload.projects,
        still_work : payload.still_work,
      };

      payload.projects.forEach((p) => {
        console.log("submit projects : ", p.id);
      });

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/updateExperience`, params, { headers: headers })
        .then(response => {

          var companys = parseExperience(response.data);
          commit('_setCompany', companys);

          resolve(companys)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });

    },

    async removeCompany({ commit, state }, payload) {
      console.log("Remove Company Index : ", state.edit_company_index)

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: state.edit_company.id,
        userId: user.state.currentUser.id,
        profileId: state.profile.profileId,
      };

      console.log("Remove Exp Params : ", params);

      await axios.post(`${backendApi}/removeExperience`, params, { headers: headers })
      .then(response => {

        var companys = parseExperience(response.data);
        commit('_setCompany', companys);

        return response;
      }).catch(error => {
        commit('_setError', "Sorry! System Error")

        setTimeout(() => {
          commit('_clearError')
        }, 3000)
        return error;
      });

    },

    async removeExpProject({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: payload.id,
        userId: payload.userId,
      };

      console.log("Remove Project Params : ", params);

      await axios.post(`${backendApi}/removeExpProject`, params, { headers: headers })
      .then(response => {
        console.log(response.data);
        var companys = parseExperience(response.data);
        commit('_setCompany', companys);

        return response.data;
      }).catch(error => {
        commit('_setError', "Sorry! System Error")

        setTimeout(() => {
          commit('_clearError')
        }, 3000)
        return error;
      });

    },


    setEditCompanyIndex({ commit }, payload) {

      commit('_setEditCompanyIndex', payload);
    },

    setEditCompany({ commit }, payload) {
      commit('_setEditCompany', payload);
    },

    addSideProject({ commit }, payload) {
      commit('_addSideProject', payload);
    },

    async uploadPortfolioToFB({ commit }, payload) {

      const storageRef = firebase.storage().ref(`Portfolio/${payload.name}`);

      await storageRef.putString(payload.path, 'data_url', {
        contentType: payload.type
      });

      return await storageRef.getDownloadURL();
    },

    async uploadResumeToFB({ commit }, payload) {

      const storageRef = firebase.storage().ref(`Resume/${payload.name}`);

      var result = await storageRef.put(payload.path);

      return await storageRef.getDownloadURL();
    },

    addNewCompanyProject({ commit }, payload) {
      commit('_addCompanyProject', payload)
    },

    async updateResume({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        profileId: state.profile.profileId,
        userId: user.state.currentUser.id,
        resume: payload
      };

      return await axios.post(`${backendApi}/updateResume`, params, { headers: headers });
    },


    async updateBasicInfo({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        profileId: state.profile.profileId,
        userId: user.state.currentUser.id,
        photoURL: state.profile.photoURL,
        shared_name: state.profile.shared_name,
        summary: state.profile.summary,
        education_degree: state.profile.education_degree,
        education_university: state.profile.education_university,
        education_start_date: state.profile.education_start_date,
        education_end_date: state.profile.education_end_date
      };

      return await axios.post(`${backendApi}/updateBasicProfile`, params, { headers: headers });
    },

    async saveSideProjects({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        userId: user.state.currentUser.id,
        profileId: state.profile.profileId,
        projects: state.side_projects
      };

      console.log(params);

      return new Promise ((resolve, reject) => {
          axios.post(`${backendApi}/updateSide`, params, { headers: headers })
          .then(response => {
            console.log('Side Projects Result : ', response);
            var sideProjects = parseSideProjects(response.data);
            commit('_setSideProject', sideProjects);

            resolve(sideProjects)
          }).catch(error => {
            commit('_setError', "Sorry! System Error")

            setTimeout(() => {
              commit('_clearError')
            }, 3000)
            reject(error)
          });
      });


    },

    async removeSideProject({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: payload.id,
        userId: payload.userId,
      };

      console.log("Remove Project Params : ", params);

      await axios.post(`${backendApi}/removeSideProject`, params, { headers: headers })
      .then(response => {
        console.log(response.data);
        var sideProjects = parseSideProjects(response.data);
        commit('_setSideProject', sideProjects);

        return sideProjects;
      }).catch(error => {
        commit('_setError', "Sorry! System Error")

        setTimeout(() => {
          commit('_clearError')
        }, 3000)
        return error;
      });

    },



    // end
  }
}
