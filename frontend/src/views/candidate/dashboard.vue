<template>
<div fluid ref="jobListView" class="jobListView">
    <b-row class="fixed">
        <b-colxx xxs="12">
            <div class="d-flex justify-content-between">
              <h1>{{currentUser.title}}</h1>
            </div>

            <div class="separator my-3"></div>

            <div class="my-2">
                <b-button variant="empty" class="pt-0 pl-0 d-inline-block d-md-none" v-b-toggle.displayOptions>
                    {{ $t('pages.display-options') }} <i class="simple-icon-arrow-down align-middle" />
                </b-button>
                <b-collapse id="displayOptions" class="d-md-block">
                    <div class="d-block d-md-inline-block pt-1">
                        <b-dropdown id="ddown1" :text="`Order By ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                            <b-dropdown-item v-for="(order, index) in sortOptions" :key="index" @click="changeOrderBy(order)">{{ order.label }}</b-dropdown-item>
                        </b-dropdown>
                        <b-dropdown id="ddown2" :text="`${sortDirection}`" variant="outline-dark" class="mr-1 float-md-left btn-group " size="xs">
                            <b-dropdown-item v-for="(direction, index) in sortDirections" :key="index" @click="changeOrderDirection(direction)">{{ direction }}</b-dropdown-item>
                        </b-dropdown>

                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input type="text" placeholder="search" v-model="search" @keyup.native.enter="searchJobs" />
                        </div>
                    </div>
                    <div class="float-md-right pt-1">
                        <span class="text-muted text-small mr-1 mb-2">Filter</span>
                        <b-dropdown id="ddown3" right :text="`Status : ${filterState}`" variant="outline-dark" class="d-inline-block" size="xs">
                            <b-dropdown-item @click="jobFilter(-1)">All</b-dropdown-item>
                            <b-dropdown-item @click="jobFilter(0)">Draft</b-dropdown-item>
                            <b-dropdown-item @click="jobFilter(3)">Published</b-dropdown-item>
                            <b-dropdown-item @click="jobFilter(4)">Archieved</b-dropdown-item>
                            <b-dropdown-item @click="jobFilter(5)">Trash</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-collapse>
            </div>

        </b-colxx>
    </b-row>

    <b-row v-if="_getJobs != null && _getJobs.length == 0">
      <b-colxx>
        <b-alert variant="warning" fade show dismissible>
          There is no results for your company. Please create and publish new job for your projects.
        </b-alert>
      </b-colxx>
    </b-row>

    <template v-if="isLoad">
      <b-row>
        <template v-for="(job, index) in _getJobs">
          <b-colxx xxs="12">
              <b-card class="mb-4 pro-card">
                <b-row>
                  <b-colxx xxs="12" md="12" lg="9" class="truncate m-0 p-0" >
                    <!-- 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved -->
                    <span v-if="job.status == 0" class="pro-status mx-1">Draft</span>
                    <span v-else-if="job.status == 1" class="pro-status mx-1">Basic Information Completed</span>
                    <span v-else-if="job.status == 2" class="pro-status mx-1">Application Form Completed</span>
                    <span v-else-if="job.status == 3" class="pro-status mx-1">Published</span>
                    <span v-else-if="job.status == 4" class="pro-status mx-1">Archieved</span>

                    <span class="pro-title mx-1">{{job.title}}</span>
                    <span class="pro-subTitle mx-1">{{job.department}} - {{job.country}} </span>
                  </b-colxx>

                  <b-colxx xxs="12" md="12" lg="3" class="m-0 p-0">
                    <b-dropdown variant="empty" size="sm" class="dropdown-menu-right pro-dorpdown float-right" toggle-class="p-0" right no-caret>
                      <template slot="button-content">
                          <span class="glyph-icon simple-icon-options-vertical"></span>
                      </template>

                      <b-dropdown-header>CHANGE STATUS</b-dropdown-header>
                      <b-dropdown-divider></b-dropdown-divider>

                      <b-dropdown-item disabled @click="previewJob(index)">Preview Job</b-dropdown-item>
                      <b-dropdown-item disabled @click="editJob(index)">Edit Job</b-dropdown-item>
                      <b-dropdown-item :disabled="job.status == 4" :active="job.status != 4" @click="archieveJob(index)">Archieve Job</b-dropdown-item>
                      <b-dropdown-item disabled @click="cloneJob(index)">Clone Job</b-dropdown-item>

                      <b-dropdown-divider></b-dropdown-divider>

                      <b-dropdown-item disabled @click="deleteJob(index)" class="bg-secondary">Delete Job</b-dropdown-item>
                    </b-dropdown>

                    <b-button v-if="job.status < 3" variant="info" size="sm" class="btnPublishJob mx-1 rounded-lg float-right" @click="publishJob(index)">
                      <span class="d-inline-block">Publish</span>
                    </b-button>

                    <b-button variant="outline-success" size="sm" class="btnEditJob mx-1 rounded-lg float-right" @click="editJob(index)">
                      <span class="">Edit</span>
                    </b-button>

                  </b-colxx>
                </b-row>

                <b-row class="my-2">
                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1" style="border-right:1px solid #afafaf;" >
                    <div class="pro-stage-btn btnSourced">
                      <div class="">_</div>
                      <div class="">Sourced</div>
                    </div>
                  </b-colxx>

                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1" style="border-right:1px solid #afafaf;" >
                    <div class="pro-stage-btn btnApplied">
                      <div class="">_</div>
                      <div class="">Applied</div>
                    </div>
                  </b-colxx>

                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1" style="border-right:1px solid #afafaf;" >
                    <div class="pro-stage-btn btnPhone">
                      <div class="">_</div>
                      <div class="">Phone Screen</div>
                    </div>
                  </b-colxx>

                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1" style="border-right:1px solid #afafaf;" >
                    <div class="pro-stage-btn btnInterview">
                      <div class="">_</div>
                      <div class="">Interveiw</div>
                    </div>
                  </b-colxx>

                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1" style="border-right:1px solid #afafaf;" >
                    <div class="pro-stage-btn btnOffer">
                      <div class="">_</div>
                      <div class="">Offer</div>
                    </div>
                  </b-colxx>

                  <b-colxx xxs="4" md="4" lg="2" class="m-0 p-0 mt-1">
                    <div class="pro-stage-btn btnHired">
                      <div class="">_</div>
                      <div class="">Hired</div>
                    </div>
                  </b-colxx>

                </b-row>

                <b-row>
                  <b-colxx>
                    <div v-if="job.status < 3" class="pro-tooltip">
                      <span class="glyph-icon simple-icon-info"></span> Publish this draft to start receiving candidates.
                    </div>

                    <div v-if="job.status == 3" class="pro-tooltip">
                      <span class="glyph-icon simple-icon-info"></span> Please check candidate's applications.
                    </div>

                    <div v-if="job.status == 4" class="pro-tooltip">
                      <span class="glyph-icon simple-icon-info"></span> Job has been archieved.
                    </div>

                  </b-colxx>
                </b-row>

              </b-card>
          </b-colxx>
        </template>

      </b-row>

      <b-row v-if="_getJobs.length > 0">
          <b-colxx xxs="12">
            <b-pagination size="sm" align="center" :total-rows="_totalJobCount" :per-page="_jobsPerPage" v-model="currentPage" >
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
      </b-row>

    </template>
    <template v-else>
        <div class="loading"></div>
    </template>



</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import {
  JobState
} from '../../constants/job'

import axios from 'axios'

export default {
    components: {

    },
    data() {
        return {
          isLoad: false,
          currentPage: 1,

          JobState: JobState,
          search : "",
          filterState: "All",

          sort: null,

          sortOptions: [
            {
              column: 'title',
              label: 'Job Title'
            },
            {
              column: 'department',
              label: 'Department'
            },
            {
              column: 'createdAt',
              label: 'Created At',
            },
            {
              column: 'status',
              label: 'Status'
            }
          ],

          sortDirection: null,

          sortDirections: [
            "DESC",
            "ASC"
          ],

        }
    },

    computed: {
        ...mapGetters(["currentUser", "_getCompanyProfile", "_getJobs", "_getSearch", "_getJobState", "_getCurJob", "_totalJobCount", "_jobsPerPage", ])
    },

    created() {
      this.currentPage = 1;
      this.sort = this.sortOptions[0];
      this.sortDirection = this.sortDirections[0];
      this.filterState = "All";

      this.__setJobState(null);
      this.__setSearch(null);
      this.__setSortOption(this.sort.column);
      this.__setSortDirection(this.sortDirection);

      this.getProjects();
    },

    methods: {
      ...mapActions(["__getCompanyJobs",  "__setCurPage",  "__setCurJob", "__publishJob", "__setJobState", "__setSearch", "__setSortOption", "__setSortDirection" ]),

      getProjects() {
        var self = this;

        self.isLoad = false;
        self.__setCurPage(self.currentPage);

        self.__getCompanyJobs().then(
          function (res) {
            self.isLoad = true;
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );

      },

      crateNewJob() {
        this.$router.push("/company/jobs/new");
      },

      editJob(index) {
        this.__setCurJob(this._getJobs[index]);
        this.$router.push(`/company/jobs/${this._getJobs[index].id}`);
      },

      publishJob(index) {
        console.log(this._getJobs[index].id, this._getJobs[index].title);
        var self = this;

        self.__publishJob(this._getJobs[index].id).then(
          function (res) {
            self._getJobs[index].status = 3; // Published Job
            console.log("Published Job : ", res);
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );
      },

      jobFilter(job_state) {
        if(job_state == -1) {
          this.filterState = "All";
          this.__setJobState(null);
        } else {
          this.filterState = this.JobState[job_state].label;
          this.__setJobState(this.JobState[job_state].value);
        }
        this.getProjects();
      },

      searchJobs() {
        this.__setSearch(this.search);
        this.getProjects();
      },

      changeOrderBy(sort) {
        this.sort = sort;
        this.__setSortOption(this.sort.column);
        this.getProjects();
      },

      changeOrderDirection(direct) {
        this.sortDirection = direct;
        this.__setSortDirection(this.sortDirection);
        this.getProjects();
      },

      previewJob(index) {
        console.log("Preview Job : ", this._getJobs[index].id);
      },

      cloneJob(index) {
        console.log("Clone Job : ", this._getJobs[index].id);
      },

      archieveJob(index) {
        console.log("Archieve Job : ", this._getJobs[index].id);
      },

      deleteJob(index) {
        console.log("Delete Job : ", this._getJobs[index].id);
      },

    },

    watch: {
        currentPage() {
          var self = this;
            console.log("page changed : ", this.currentPage);
            self.__setCurPage(this.currentPage);
            self.getProjects();
        },
    },
}
</script>
