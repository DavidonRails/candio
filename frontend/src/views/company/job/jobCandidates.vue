<template>
<div ref="jobCandidateView" class="jobCandidateView" v-if="_getCurJob != null">
  <b-row class="header p-3 m-0 border-bottom bg-dark text-white">
      <b-colxx xxs="12">
          <h3 class="d-inline-block mr-3">Job Candidates</h3>

          <b-link variant="link" href="/company/jobs" class="rotate-arrow-icon text-light">
            <span class="d-inline-block">Jobs</span>
          </b-link>

          <b-link variant="link" :href="`/company/jobs/${this._getCurJob.id}/`" class="rotate-arrow-icon text-light">
            <i class="simple-icon-arrow-right"></i>
            <span class="d-inline-block">{{_getCurJob.title}}</span>
          </b-link>
      </b-colxx>
  </b-row>

  <b-row>
      <b-colxx class="disable-text-selection">

          <template v-if="isLoad">
              <b-row key="list">
                <b-colxx xxs="12" class="mb-3">
                      <b-card class="d-flex flex-row bg-dark text-white" no-body>
                          <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                              <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                                  <p class="mb-0 mr-3 w-1 w-sm-100"></p>

                                  <p class="mb-0 list-item-heading w-15 w-sm-100 ">Username</p>
                                  <p class="mb-0 list-item-heading w-15 w-sm-100 ">Resume/Links</p>
                                  <p class="mb-0 list-item-heading w-15 w-sm-100">Certificate</p>
                                  <p class="mb-0 list-item-heading w-15 w-sm-100">Title</p>
                                  <p class="mb-0 list-item-heading w-15 w-sm-100">Skill</p>
                                  <p class="mb-0 list-item-heading w-15 w-sm-100">Stage</p>
                              </div>
                          </div>
                      </b-card>
                </b-colxx>

                <b-colxx xxs="12" class="mb-3" v-for="(item, index) in _getJobCandidates" :key="index" :id="item.jobManagementId">
                    <template>
                    <b-card :class="{'d-flex flex-row':true}" no-body>
                        <div class="pl-2 d-flex flex-grow-1 min-width-zero">
                            <div class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
                                <div class="w-1 w-sm-100 mr-3">
                                    <b-badge pill variant="primary">{{ index + 1 }}</b-badge>
                                </div>

                                <router-link :to="`?p=${item.jobManagementId}`" class="w-15 w-sm-100">
                                    <p class="list-item-heading mb-0 truncate">{{item.username}}</p>
                                </router-link>

                                <div class="mb-0 w-15 w-sm-100">
                                  <a  v-if="item.resume" :href="`${item.resume}`" target="_blank" class="w-15 w-sm-100">
                                      <span :id="'tooltip-resume-'+index+1" class="glyph-icon simple-icon-globe" ></span>
                                      <b-tooltip :target="'tooltip-resume-'+index+1" placement="top" :title="`${item.resume}`">
                                      </b-tooltip>
                                  </a>
                                </div>

                                <div class="mb-0 w-15 w-sm-100">
                                  <span class="glyph mr-1 text-primary" :id="'tool-'+index+'-'+i" v-for="(icon, i) in item.fitRating" :key="i">
                                      <span class="glyph-icon simple-icon-trophy"/>
                                      <b-tooltip :target="'tool-'+index+'-'+i" placement="top" :title="icon.skill + ' : ' + icon.score"></b-tooltip>
                                    </span>

                                </div>

                                <p class="mb-0 text-muted text-small w-15 w-sm-100">{{item.title}}</p>
                                <p class="mb-0 text-muted text-small w-15 w-sm-100">{{item.skill}}</p>
                                <div class="w-15 w-sm-100">
                                    <b-badge pill variant="JobStage[item.stage].color">{{ JobStage[item.stage].label }}</b-badge>
                                </div>

                                <div class="mb-0 w-5 w-sm-100">
                                  <b-dropdown variant="empty" size="sm" class="dropdown-menu-right pro-dorpdown float-right" toggle-class="p-0" right no-caret>
                                    <template slot="button-content">
                                        <span class="glyph-icon simple-icon-options-vertical"></span>
                                    </template>

                                    <b-dropdown-item @click="inviteCan(index)">Schedule interview</b-dropdown-item>
                                    <b-dropdown-item @click="addTagCan(index)">Add tags</b-dropdown-item>
                                    <b-dropdown-item @click="shareCan(index)">Share</b-dropdown-item>
                                    <b-dropdown-divider></b-dropdown-divider>
                                    <!--b-dropdown-item :disabled="job.status == 4" :active="job.status != 4" @click="archieveJob(index)">Archieve Job</!--b-dropdown-item-->

                                    <b-dropdown-item @click="deleteCan(index)" class="bg-secondary white">Delete</b-dropdown-item>
                                  </b-dropdown>

                                </div>
                            </div>

                        </div>
                    </b-card>
                    </template>
                </b-colxx>

              </b-row>

              <!--b-row v-if="_getJobCandidates.length > 0">
                  <b-colxx xxs="12">
                    <b-pagination size="sm" align="center" :total-rows="_totalCandCount" :per-page="_candsPerPage" v-model="currentPage" >
                        <template v-slot:next-text>
                          <i class="simple-icon-arrow-right"/>
                        </template>
                        <template v-slot:prev-text>
                          <i class="simple-icon-arrow-left"/>
                        </template>
                        <template v-slot:first-text>
                          <i class="simple-icon-control-start"/>
                        </template>
                        <template v-slot:last-text>
                          <i class="simple-icon-control-end"/>
                        </template>
                    </b-pagination>
                  </b-colxx>
              </!--b-row-->

          </template>

          <template v-else>
              <div class="loading"></div>
          </template>

      </b-colxx>
  </b-row>

</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import {
    validationMixin
} from "vuelidate";

const {
    required,
    maxLength,
    minLength,
    email
} = require("vuelidate/lib/validators");

import {
    mapGetters,
    mapActions,
    mapState
} from "vuex";

import {
  JobApplication, JobStage
} from '../../../constants/job'

import axios from 'axios';

import DataListItem from '../../../components/Listing/DataListItem'

export default {
    props: ['jobId'],
    components: {
      'v-select': vSelect,
      'data-list-item': DataListItem
    },

    data() {
        return {
            isLoad: false,
            currentPage: 1,

            JobApplication: JobApplication,
            JobStage: JobStage,
            search : "",
            filterApplication: "All",

            sortOptions: [
              {
                column: 'username',
                label: 'Username'
              },
              {
                column: 'stage',
                label: 'Stages'
              },
              {
                column: 'rating',
                label: 'Job Fitment Rating',
              },
              {
                column: 'Last updated',
                label: 'Updated At'
              }
            ],

            sortDirections: [
              "DESC",
              "ASC"
            ],

            sort: {
                column: 'title',
                label: 'Product Name'
            },

            page: 1,
            perPage: 4,
            search: '',
            from: 0,
            to: 0,
            total: 0,
            lastPage: 0,
            items: [],
            pageSizes: [4, 8, 12],

        }

    },

    mixins: [validationMixin],

    validations: {
        _getCurJob: {
            title: {
                required
            }
        }
    },

    created() {
    },

    mounted() {
      this.loadItems()

    },

    computed: {
      ...mapGetters(["currentUser", "_getRequestError", "_getCompanyProfile", "_getCurJob", "_getJobCandidates", "_totalCandCount", "_candsPerPage", ]),

    },

    methods: {
      ...mapActions(["__getCurJob", "__setCurPage", "__getJobCandidates", "__setJobApplication", "__sendInvitation" ]),

      scrollViewTo(top) {
        window.scrollTo({
          top:top,
          behavior: 'smooth'
        })
      },

      getJobCandidates() {
        var self = this;

        self.isLoad = false;

        self.__setCurPage(self.currentPage);
        self.__setJobApplication(self.filterApplication);

        self.__getJobCandidates().then(
          function (res) {
            self.isLoad = true;
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );

      },

      loadItems() {
          this.isLoad = false

          var self = this;
          console.log(this.jobId);
          this.__getCurJob(this.jobId).then(function() {
            self.getJobCandidates();
            self.isLoad = true
          });

          /*
          axios
              .get()
              .then(response => {
                  return response.data
              })
              .then(res => {
                  this.total = res.total
                  this.from = res.from
                  this.to = res.to
                  this.items = res.data
                  this.perPage = res.per_page
                  this.selectedItems = []
                  this.lastPage = res.last_page
                  this.isLoad = true
              })
          */
      },

      inviteCan(index) {
          var self = this;

          var params = {
            userId : self._getJobCandidates[index].id,
            jobId : self._getCurJob.id
          };

          self.__sendInvitation(params).then(function(res) {

          });
      },

      deleteCan(index) {
        var self = this;
        console.log(self._getJobCandidates[index].id, self._getJobCandidates[index].email);
      },

      addTagCan(index) {
        var self = this;
        console.log(self._getJobCandidates[index].id, self._getJobCandidates[index].email);
      },

      shareCan(index) {
        var self = this;
        console.log(self._getJobCandidates[index].id, self._getJobCandidates[index].email);
      },


    },

    watch: {
        _getRequestError(val) {
            if (val != null) {
                this.$notify("error", "Company Job Error", val, {
                    duration: 5000,
                    permanent: false
                });

            }
        },
        search() {
            this.page = 1
        },
    },


}
</script>
