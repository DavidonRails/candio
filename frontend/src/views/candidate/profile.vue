<template>
  <div ref="welcomeView" class="welcomeView p-3">

      <b-row>

        <!-- Profile Column -->

        <b-colxx class="col_profile" sm="12" xs="12" xl="12" lg="12">
          <b-row>
            <b-colxx xxs="12" md="8" class="mx-auto py-3 px-3">

              <p class="pt-5 pb-3 color-gray">PROFILE {{curPage}} / 4</p>

              <!-- Page 1 -->
              <div v-if="curPage == 1" class="profile linkedInfo">

                    <h1>Welcome! Let create your profile!</h1>

                    <p class="color-gray">Upload your resume below and we'll try to automatically parse your information for the next steps. Don't worry if your resume isn't prefect, we'll help you polish it later.</p>

                <div class="separator my-5"></div>

                    <h3>Upload your resume</h3>

                    <p class="color-gray">Max. file size: 4MB ( .pdf or .doc files only )</p>

                    <a v-if="get_profile && get_profile.resume" :href="get_profile.resume" download style="text-decoration: underline;">
                      Resume Download
                    </a>

                    <b-form>
                      <b-row>
                        <b-colxx xxs="12" md="6">
                          <b-input-group class="mt-3 mx-3">

                            <b-form-file accept=".doc, .docx, .pdf"
                              ref="uploadResume"
                              @change="uploadResume"
                              v-model="profile.resume"
                              :placeholder="$t('input-groups.choose-file')">
                            </b-form-file>

                          </b-input-group>
                        </b-colxx>

                        <b-colxx v-if="get_profile && get_profile.resume" xxs="12" md="6" class="mt-3">
                          <b-button squared variant="danger"
                            :disabled="fileUploading"
                            :class="{'btn-multiple-state btn-shadow': true,
                                      'show-spinner': fileUploading,
                                      'show-success': !fileUploading && get_profileError===false,
                                      'show-fail': !fileUploading && get_profileError }"
                            @click="deleteResume()">

                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>

                            <span class="icon">
                                <i class="simple-icon-trash"></i>
                            </span>
                            <span class="label d-inline-block">Remove</span>

                          </b-button>
                        </b-colxx>

                      </b-row>
                    </b-form>

                    <p class="color-gray mt-4">No resuem handy?
                      <span @click="skipLinkedinInfo()" class="pl-2" style="text-decoration:underline; pointer:cursor; cursor: pointer;">
                        Skip this step
                      </span>
                    </p>

                <div class="separator my-5"></div>

                    <div class="d-flex justify-content-end align-items-center mt-5">
                      <b-button variant="primary" size="lg"
                        :disabled="fileUploading || processing"
                        :class="{'btn-multiple-state btn-shadow': true,
                                  'show-spinner': fileUploading || processing,
                                  'show-success': !fileUploading && !processing && get_profileError===false,
                                  'show-fail': !fileUploading && !processing && get_profileError }"
                        @click="procLinkedIn()">

                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>

                            <span class="label d-inline-block">Next</span>
                      </b-button>
                    </div>

              </div>

              <!-- Page 2 -->
              <div v-if="curPage == 2" class="profile basicInfo">

                    <h1>Add your basic information</h1>

                    <p class="color-gray">Tell us about yourself, your summary, education, etc.</p>

                <div class="separator my-5"></div>

                    <h3>Upload your photo</h3>
                    <p class="color-gray">Please click avatar box to select your photo.</p>

                    <b-form>
                      <div class="d-flex justify-content-start">
                        <div class="shadow-lg px-1 py-1 avatar_preview text-center" @click="fileBrowser()">
                          <p class="px-1 py-1" v-if="get_profile.photoURL == null" style="width: 150px; margin-left: 25px;">Please click this to select your photo.</p>
                          <img v-if="!fileUploading" :src="get_profile.photoURL" width="auto" height="100%" />
                          <div v-else class="relative_loading" style="margin-top: 80px;"></div>
                        </div>
                      </div>

                      <b-row style="display:none;">
                          <b-colxx xxs="6">
                            <b-input-group class="mt-3">

                              <b-form-file accept=".png, .jpg, .jpeg"
                                @change="uploadAvatar"
                                v-model="profile.photoURL"
                                ref="avatarBrowser"
                                :placeholder="$t('input-groups.choose-file')">
                              </b-form-file>

                            </b-input-group>
                          </b-colxx>
                      </b-row>
                    </b-form>

                <div class="separator my-5"></div>

                    <b-alert v-if="!basicInfoValidate" variant="danger" fade show dismissible>
                      <span class="glyph-icon simple-icon-info"></span> Please fill out the essential fields for basic information.
                    </b-alert>


                    <h3 class="required">Public profile username</h3>

                    <p class="color-gray">This username will be used in Link to share the your Candio Profile Page </p>

                    <b-input-group prepend=" http://www.candio.dev/profile/" class="">
                        <b-form-input v-model="get_profile.shared_name" :placeholder="$t('user.username')"></b-form-input>
                    </b-input-group>

                <div class="separator my-5"></div>

                    <h3 class="required">Summary</h3>

                    <b-form-textarea
                      id="profile_summary"
                      v-model="get_profile.summary"
                      placeholder="Please type your summary..."
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <!-- <b-form-invalid-feedback>Required</b-form-invalid-feedback> -->


                <div class="separator my-5"></div>

                    <h3>Education</h3>

                    <b-row class="mb-5">
                        <b-colxx xxs="6">
                          <label class="color-gray required">Degree</label>
                          <b-form-input v-model="get_profile.education_degree" type="text" placeholder="Degree"/>
                        </b-colxx>

                        <b-colxx xxs="6">
                          <label class="color-gray required">University</label>
                          <b-form-input v-model="get_profile.education_university" type="text" placeholder="University / College"/>
                        </b-colxx>
                    </b-row>

                    <b-alert v-if="!eduPeriodValidate" variant="danger" fade show dismissible>
                      <span class="glyph-icon simple-icon-info"></span> The End date cannot be earlier than the Start date.
                    </b-alert>

                    <b-row style="margin-bottom: 200px;">
                        <b-colxx xxs="6">
                          <label class="color-gray required">Start Date</label>
                          <v-date-picker mode="single" v-model="get_profile.education_start_date" :input-props="{ class:'form-control', placeholder: 'Start Date' }"></v-date-picker>
                        </b-colxx>

                        <b-colxx xxs="6">
                          <label class="color-gray required">End Date</label>
                          <v-date-picker mode="single" v-model="get_profile.education_end_date" :input-props="{ class:'form-control', placeholder: 'End Date' }"></v-date-picker>
                        </b-colxx>
                    </b-row>


                <div class="separator my-5"></div>

                    <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 200px;">
                      <b-button variant="primary" @click="prevPage()">
                        <span class="d-inline-block">Prev</span>
                      </b-button>

                      <b-button variant="primary" size="lg"
                        :disabled="fileUploading || processing"
                        :class="{'btn-multiple-state btn-shadow': true,
                                  'show-spinner': fileUploading || processing,
                                  'show-success': !fileUploading && !processing && get_profileError===false,
                                  'show-fail': !fileUploading && !processing && get_profileError }"
                        @click="procBasicInfo()">

                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>

                            <span class="label d-inline-block">Save & Next</span>
                      </b-button>
                    </div>

              </div>

              <!-- Page 3 -->
              <div v-if="curPage == 3" class="profile experienceInfo">

                    <h1>Add your experience</h1>

                    <p class="color-gray">Tell us how experience you are, your skills, work history and education.</p>

                    <b-alert variant="warning" fade show dismissible>
                      <span class="glyph-icon simple-icon-info"></span> Complete <strong>Work history sections to proceed</strong>
                    </b-alert>

                <div class="separator my-5"></div>

                    <experience-component  ref="expProComp" />

                <div class="separator my-5"></div>

                    <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 200px;">
                      <b-button variant="primary" @click="prevPage()">
                        <span class="d-inline-block">Prev</span>
                      </b-button>

                      <b-button variant="primary" @click="procExperienceInfo()">
                        <span class="d-inline-block">Next</span>
                      </b-button>
                    </div>

              </div>

              <!-- Page 4 -->
              <div v-if="curPage == 4" class="profile finalInfo">

                    <h1>Add final details(optional)</h1>

                    <p class="color-gray">You are almost there, just a few extra inputs and we ar done. If you are in a hurry, you can skip this step.</p>

                <div class="separator my-5"></div>

                <side-project-component ref="sideProComp" ></side-project-component>

                <div class="separator my-5"></div>

                    <div class="d-flex justify-content-between align-items-center" style="margin-bottom: 200px;">
                      <b-button variant="primary" @click="prevPage()">
                        <span class="d-inline-block">Prev</span>
                      </b-button>

                      <b-button variant="primary" size="lg"
                        :disabled="processing"
                        :class="{'btn-multiple-state btn-shadow': true,
                                  'show-spinner': processing,
                                  'show-success': !processing && get_profileError===false,
                                  'show-fail': !processing && get_profileError }"
                        @click="submitProfile()">

                            <span class="spinner d-inline-block">
                                <span class="bounce1"></span>
                                <span class="bounce2"></span>
                                <span class="bounce3"></span>
                            </span>
                            <span class="icon success">
                                <i class="simple-icon-check"></i>
                            </span>
                            <span class="icon fail">
                                <i class="simple-icon-exclamation"></i>
                            </span>

                            <span class="label d-inline-block">Save & Finish</span>
                      </b-button>

                    </div>

              </div>

            </b-colxx>
          </b-row>


        </b-colxx>
      </b-row>


  </div>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";

import { getRandomeFileName, getFileExtension } from '../../utils/index'

import ExperienceComponent from '../../components/Candio/ExperienceView';
import SideProject from '../../components/Candio/SideProject';

import {
    validationMixin
} from "vuelidate";

import { roles } from '../../constants/config'

const {
    required,
    maxLength,
    minLength,
    email,
    sameAs,
    helpers
} = require("vuelidate/lib/validators");

export default {

  components: {
      'experience-component': ExperienceComponent,
      'side-project-component': SideProject,
  },

  data () {
    return {

      processing : false,
      fileUploading : false,

      curPage : 1,

      basicInfoValidate : true,
      eduPeriodValidate : true,

      profile: {
        profileId: null,
        userId : null,
        experience: [],

        photoURL: null,
        resume: null,
        resumeChanged: false,

        education_degree: null,
        education_end_date: null,
        education_start_date: null,
        education_university: null,

        shared_name: null,
        summary: null,
      },


    };
  },

  mixins: [validationMixin],

  computed: { ...mapGetters(["currentUser", "get_profileError", "get_profile", "get_company_list", "get_side_projects", ]), },

  validations: {
      personalForm: {
        role: {
          required,
        },
      },

  },

  mounted() {
    this.init();
  },

  methods: {

    ...mapActions(["setError", "getCandidateProfile", "updateResume", "updateBasicInfo", "signOut", "setProfile", "uploadResumeToFB",
    "saveSideProjects", ]),

    init() {
      var self = this;
      this.curPage = 1;
      this.basicInfoValidate = true;
      this.eduPeriodValidate = true;

      this.getCandidateProfile().then(
        function (data) {
          console.log("Candidate Profile : ", data);
        },
        function (err) {
          console.log("ERR : ", err);
        }
      );
    },

    scrollViewTo(top) {
      this.$refs.welcomeView.scrollTo({
        top:top,
        behavior: 'smooth'
      });
    },

    prevPage() {
      this.curPage -= 1;
      this.basicInfoValidate = true;

      this.scrollViewTo(0);
    },

    // 1st Page
    async uploadResume(e) {
      var file  = e.target.files[0];

      if(file) {
        this.fileUploading = true;

        var params = {
          name: getRandomeFileName(file.name),
          path: file
        }

        var fbURL = await this.uploadResumeToFB(params);

        this.get_profile.resume = fbURL;
        this.get_profile.resumeChanged = true;
        this.fileUploading = false;
      }
    },

    async deleteResume() {
        this.fileUploading = true;

        var res = await this.updateResume('');

        if(res.data == "success") {
          this.$refs.uploadResume.reset();
          this.get_profile.resume = "";
        } else {
          this.setError("Sorry! Could not remove Resume file");
        }

        this.fileUploading = false;
    },

    async procLinkedIn() {

      if(this.get_profile.resumeChanged) {
        this.processing = true;
        var res = await this.updateResume(this.get_profile.resume);

        if(res.data == "success") {
          this.curPage = 2;
          this.basicInfoValidate = true;
          this.eduPeriodValidate = true;
          this.scrollViewTo(0);
        } else {
          this.setError("Sorry! There is a error to update Resume file");
        }
        this.processing = false;
      } else {
          this.curPage = 2;
          this.basicInfoValidate = true;
          this.eduPeriodValidate = true;
          this.scrollViewTo(0);
      }

    },

    skipLinkedinInfo() {
      this.curPage = 2;
      this.basicInfoValidate = true;
      this.eduPeriodValidate = true;
      this.scrollViewTo(0);
    },

    // 2nd Page

    fileBrowser() {
      this.$refs.avatarBrowser.$el.childNodes[0].click();
    },

    async uploadAvatar(e) {

      var file  = e.target.files[0];

      if(file) {
        this.fileUploading = true;
        var params = {
          name: getRandomeFileName(file.name),
          path: file
        }

        var fbURL = await this.uploadResumeToFB(params);

        this.get_profile.photoURL = fbURL;
        this.fileUploading = false;
      }
    },

    async procBasicInfo() {
      this.basicInfoValidate = true;
      this.eduPeriodValidate = true;

      if( !this.get_profile.shared_name || !this.get_profile.summary || !this.get_profile.education_degree || !this.get_profile.education_university ||
          !this.get_profile.education_start_date || !this.get_profile.education_end_date ) {

        this.basicInfoValidate = false;

        this.scrollViewTo(300);

        return false;
      }

      var d1 = Date.parse(this.get_profile.education_start_date);
      var d2 = Date.parse(this.get_profile.education_end_date);

      if (d1 > d2) {
        this.eduPeriodValidate = false;
        return false;
      }

      this.processing = true;
      var res = await this.updateBasicInfo();

      if(res.data == "success") {
        this.currentUser.photoURL = this.get_profile.photoURL;
        this.curPage = 3;
        this.scrollViewTo(0);
      } else {
        this.setError("Sorry! Could not update basic info!");
      }
      this.processing = false;
    },

    // 3rd Page

    procExperienceInfo() {
      this.$refs.expProComp.setNoExperienceError(true);

      if(this.get_company_list.length == 0) {
        this.$refs.expProComp.setNoExperienceError(false);
        return false;
      } else {

        this.curPage = 4;
        this.scrollViewTo(0);
      }
    },

    // 4th Page

    validateSideProjects() {
        var self = this;
        this.$refs.sideProComp.setSideProjectValidat(true);

        // Check Whether Exist Side Projects
        if(this.get_side_projects.length == 0) {
            this.$refs.sideProComp.setNoSideProjectError(false);
            return false;
        }

        // Check Side Projects Validation
        this.get_side_projects.forEach((e) => {

          if( !e.project_name || !e.skills.length || !e.summary /*|| !e.start_date || !e.end_date*/ ) {
            this.$refs.sideProComp.setSideProjectValidat(false);
            return false;
          }
          /*
          if(e.start_date > e.end_date) {
            this.$refs.sideProComp.setSideProjectValidat(false);
            return false;
          }
          */
        });

        if(this.$refs.sideProComp.sideProValidate) return true;
        else  return false;

    },

    submitProfile() {
      var self = this;

      if(this.validateSideProjects()) {
        self.processing = true;

        if(this.get_side_projects.length > 0) {

          this.saveSideProjects().then(
            function (data) {
              console.log("Save Side Projects Result: ", data);
              self.processing = false;

              self.$notify("success", "Success", "Congratulation! Profile Completion!", {
                  duration: 5000,
                  permanent: false
              });

            },
            function (err) {
              console.log("ERR : ", err);
              self.processing = false;
            }
          );
        }

      }

    },

    logout() {
        this.signOut().then(() => {
            this.$router.push('/user/login')
        })
    },

  },

  watch: {

      currentUser(val) {
          // if (val && val.uid && val.uid.length > 0) {
          //     setTimeout(() => {
          //         this.$router.push("/company/dashboards");
          //     }, 200);
          // }
      },

      get_profileError(val) {
          if (val != null) {
              this.$notify("error", "Extended Profile Error", val, {
                  duration: 5000,
                  permanent: false
              });

          }
      }
  },
}
</script>
