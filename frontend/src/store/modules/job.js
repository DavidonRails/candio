import {
  backendApi
} from '../../constants/config'

import axios from 'axios'
import user from './user'

import { getRandomText, getRandomProjectName } from "../../utils/index";

function parseJopQuiz(data) {

  data.forEach((e) => {
    e.type = JSON.parse(e.type);

    if(e.answers) {
      e.answers = e.answers.split(",");
      var ans = [];

      e.answers.forEach((t) => {
        ans.push({ value: getRandomText(), label: t });
      });

      e.answers = ans;

    } else {
      e.answers = [];
    }
  });

  return data;
}

function loadCompanyProfile() {
  if(localStorage.getItem('company') == null || localStorage.getItem('company') == 'undefined' ) {
    localStorage.removeItem('company')
    return null;
  } else {
    return JSON.parse(localStorage.getItem('company'));
  }

}

export default {
  state: {
    companyProfile: loadCompanyProfile(),

    // Jobs
    jobs: null,

    jobState: "",
    search: null,
    sortOption: null,
    sortDirection: null,

    totalJobCount: 0,
    jobsPerPage: 5,
    curPage: 1,
    curJob : null,

    // Candidates
    jobCandidates: null,
    application: "",

    totalCandCount: 0,
    candsPerPage: 5,

    requestError: null,
  },

  getters: {
    _getCompanyProfile: state=>state.companyProfile,
    _getRequestError: state=>state.requestError,
    // Job List
    _getJobs: state => state.jobs,
    _totalJobCount: state => state.totalJobCount,
    _jobsPerPage: state => state.jobsPerPage,
    _getCurJob: state => state.curJob,
    _getJobState: state=> state.jobState,

    // Job Candidators
    _getJobCandidates: state => state.jobCandidates,
    _getJobApplication: state => state.application,
    _totalCandCount: state => state.totalCandCount,
    _candsPerPage: state => state.candsPerPage,

    // Common
    _getSearch: state=>state.search,
    _curPage: state => state.curPage,

  },

  mutations: {
    _setCompanyProfile(state, payload) {
      state.companyProfile = payload
      localStorage.setItem('company', JSON.stringify(state.companyProfile))
    },

    _setCurJob(state, payload) {
      state.curJob = payload
    },

    _setJobs(state, payload) {
      state.jobs = payload
    },

    _setTotalJobCount(state, payload) {
      state.totalJobCount = payload
    },

    _setError(state, payload) {
      state.requestError = payload
    },

    _showError(state, payload) {
      state.requestError = payload
    },

    _clearError(state) {
      state.requestError = null
    },

  },

  actions: {

    __setJobState({ commit, state }, payload) {
      state.jobState = payload;
    },

    __setSearch({ commit, state }, payload) {
      state.search = payload;
    },

    __setSortOption({ commit, state }, payload) {
      state.sortOption = payload;
    },

    __setSortDirection({ commit, state }, payload) {
      state.sortDirection = payload;
    },

    __setCurPage({ commit, state }, payload) {
      state.curPage = payload;
    },

    __setJobApplication({ commit, state }, payload) {
      state.application = payload;
    },

    __getJobCandidates({ commit, state }, payload) {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        jobId: state.curJob.id,
        limit: state.candsPerPage,
        offset: (state.curPage - 1) * state.candsPerPage,
        application: state.application,
        orderBy: state.sortOption,
        orderDirect: state.sortDirection
      };

      console.log("Params : ", params);

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/getCandidateForJob`, params, { headers: headers })
        .then(response => {

          console.log("Get Candidates : ", response.data)
          state.jobCandidates = response.data.candidates;
          state.totalCandCount = response.data.count;

          resolve(response)

        }).catch(error => {
          console.log(error);
          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });

    },

    __getCompanyJobs({ commit, state }, payload) {
      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        userId: user.state.currentUser.id,
        limit: state.jobsPerPage,
        offset: (state.curPage - 1) * state.jobsPerPage,
        jobState: state.jobState,
        search: state.search,
        orderBy: state.sortOption,
        orderDirect: state.sortDirection
      };

      console.log("Params : ", params);

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/getAllJobsForCompany`, params, { headers: headers })
        .then(response => {

          console.log("Get Jobs Result : ", response.data)

          var company = response.data.company;
          commit('_setCompanyProfile', company);

          var jobs = response.data.jobs;
          commit('_setJobs', jobs);

          commit('_setTotalJobCount', response.data.count);

          resolve(jobs)

        }).catch(error => {
          console.log(error);
          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });

    },

    __setCurJob({ commit, state }, payload) {
      commit('_setCurJob', payload);
    },

    __getCurJob({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        userId: user.state.currentUser.id,
        id: payload
      };

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/getJobDetail`, params, { headers: headers })
        .then(response => {

          var keyword = response.data.keyword;
          keyword = keyword.split(",");
          response.data.keyword = keyword;

          response.data.application.questions = parseJopQuiz(response.data.application.questions);
          console.log("GET CURRENT JOB : ", response.data);

          commit('_setCurJob', response.data);
          resolve(response.data)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });
    },

    __initCurJob({ commit, state}, payload) {
      var job = {
        id: null,
        userId: null,
        companyId: null,
        title: getRandomProjectName(),
        department: "Engineering",
        industry: "Outsourcing/Offshoring",
        code: "rnM-20",
        country: "United States",
        region: "Phoenix",
        remote: false,
        function: "Information Technology",
        employmentType: "Full-time",
        experience: "Executive",
        education: "Bachelor's Degree",
        keyword: ["React Native", "Android"],
        fromSalary: 4000,
        toSalary: 8000,
        currency: "United States Dollar (USD)",
        status: 0,

        application: {
          id: null,
          userId: null,
          companyId: null,
          jobId: null,
          name: "mandatory",
          email: "mandatory",
          headline: "optional",
          phone: "optional",
          address: "optional",
          photo: "optional",
          education: "optional",
          experience: "optional",
          summary: "optional",
          resume: "optional",
          coverletter: "mandatory",
          questions: [
            /*
            {
              order: 1,
              jobId: 1,
              type: 'free-text', // Pharagrap Quiz Type
              quiz: 'hello world',
              answers: [],
            },
            */
          ]
        },
      };

      commit('_setCurJob', job);
    },

    __saveJob({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        id: state.curJob.id? state.curJob.id: "",
        userId: user.state.currentUser.id,
        companyId: state.companyProfile.id,
        title: state.curJob.title,
        department: state.curJob.department,
        industry: state.curJob.industry,
        code: state.curJob.code,
        country: state.curJob.country,
        region: state.curJob.region,
        remote: state.curJob.remote,
        function: state.curJob.function,
        employmentType: state.curJob.employmentType,
        experience: state.curJob.experience,
        education: state.curJob.education,
        keyword: state.curJob.keyword,
        fromSalary: state.curJob.fromSalary,
        toSalary: state.curJob.toSalary,
        currency: state.curJob.currency,
        status: state.curJob.status,

        application: state.curJob.application
      };

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/saveJob`, params, { headers: headers })
        .then(response => {
          console.log("Save Job : ", response.data);

          var keyword = response.data.keyword;
          keyword = keyword.split(",");
          response.data.keyword = keyword;

          response.data.application.questions = parseJopQuiz(response.data.application.questions);

          commit('_setCurJob', response.data);

          resolve(response.data)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });

    },

    __publishJob({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        jobId: payload
      };

      console.log("PUBLISH JOB : ", params);

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/publishJob`, params, { headers: headers })
        .then(response => {
          state.curJob.status = 3; // Published

          resolve(response.data)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });
    },

    __archieveJob({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        jobId: payload
      };

      console.log("PUBLISH JOB : ", params);

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/archieveJob`, params, { headers: headers })
        .then(response => {
          state.curJob.status = 4; // Archieve Job

          resolve(response.data)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });
    },

    __sendInvitation({ commit, state }, payload) {

      var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.state.currentUser.accessToken
      }

      commit('_clearError')

      var params = {
        userId: payload.userId,
        jobId: payload.jobId
      };

      console.log("Send Invitation : ", params);

      return new Promise ((resolve, reject) => {
        axios.post(`${backendApi}/sendInvitation`, params, { headers: headers })
        .then(response => {
          console.log(response);

          resolve(response.data)
        }).catch(error => {

          commit('_setError', "Sorry! System Error")

          setTimeout(() => {
            commit('_clearError')
          }, 3000)
          reject(error)

        });
      });
    },

  // End Actions
  },





  // End Class
}
