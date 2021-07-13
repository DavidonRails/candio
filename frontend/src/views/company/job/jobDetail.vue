<template>
<div ref="jobDetailView" class="jobDetailView" v-if="_getCurJob != null">

  <!-- Start Job Header -->
  <div class="jobHeader p-0 m-0">

    <b-row class="p-1 m-0">
      <b-colxx xxs="12" lg="9" md="9" class="d-flex justify-content-start" >
        <h1 v-if="!_getCurJob.title" class="mx-1">New Job</h1>
        <h1 v-if="_getCurJob.title" class="mx-1 text-uppercase truncate">{{_getCurJob.title}}</h1>
      </b-colxx>

      <b-colxx xxs="12" lg="3" md="3" class="d-flex justify-content-end p-1 m-0">
        <b-button v-if="!_getCurJob.id" size="sm" variant="outline-success" class="btnCreateJob mx-1 rounded-lg" @click="createJob()">
          <span class="">Create</span>
        </b-button>

        <b-button v-if="_getCurJob.id" size="sm" variant="outline-success" class="btnEditJob mx-1 rounded-lg" @click="saveJob()">
          <span class="">Save & continue</span>
        </b-button>

        <b-button v-if="_getCurJob.id && _getCurJob.status == 2" size="sm" variant="info" class="btnPublishJob mx-1 rounded-lg" @click="publishCurJob()">
          <span class="d-inline-block">Publish</span>
        </b-button>

        <b-dropdown v-if="_getCurJob.id"
          variant="outline-dark" size="sm"
          class="dropdown-menu-right job-dropdown-menu"
          toggle-class="rounded-sm p-1 ml-1" right no-caret>

          <template slot="button-content">
            <span class="glyph-icon simple-icon-options"></span>
          </template>

          <b-dropdown-header>CHANGE STATUS</b-dropdown-header>
          <b-dropdown-divider></b-dropdown-divider>

          <b-dropdown-item disabled @click="previewJob()">Preview Job</b-dropdown-item>
          <b-dropdown-item disabled @click="editJob()">Edit Job</b-dropdown-item>
          <b-dropdown-item :disabled="_getCurJob.status == 4" :active="_getCurJob.status != 4" @click="archieveJob()">Archieve Job</b-dropdown-item>
          <b-dropdown-item disabled @click="cloneJob()">Clone Job</b-dropdown-item>

          <b-dropdown-divider></b-dropdown-divider>

          <b-dropdown-item @click="deleteJob()" class="bg-secondary">Delete Job</b-dropdown-item>
        </b-dropdown>

      </b-colxx>
    </b-row>

    <b-row class="p-1 m-0">
      <b-colxx class="p-1 m-0" xxs="3" lg="3" md="3" style="border-right:1px solid #afafaf;" >
        <b-button variant="light" class="job-stage-btn btnJob active" @click="showJobBasic()" >
          <div class="job-title">The Job</div>
          <div class="job-title-desc d-none d-lg-block d-xl-block">Tell applicants why it's great to work at your company.</div>
        </b-button>
      </b-colxx>

      <b-colxx class="p-1 m-0" xxs="3" lg="3" md="3" style="border-right:1px solid #afafaf;" >
        <b-button variant="light" class="job-stage-btn btnApplied" :class="_getCurJob.status >= 1 ? 'active':'deactive'"  :disabled="_getCurJob.status < 1" @click="showApplicationForm()" >
          <div class="job-title">Application Form</div>
          <div class="job-title-desc d-none d-lg-block d-xl-block">Design the application form for this role.</div>
        </b-button>
      </b-colxx>

      <b-colxx class="p-1 m-0" xxs="3" lg="3" md="3" style="border-right:1px solid #afafaf;" >
        <b-button variant="light" class="job-stage-btn btnPhone" :class="_getCurJob.status >= 1 ? 'active':'deactive'" :disabled="_getCurJob.status < 2" @click="showCandidates()">
          <div class="job-title">Find Candidates</div>
          <div class="job-title-desc d-none d-lg-block d-xl-block">Post on job boards, engage recruiters, request referrals.</div>
        </b-button>
      </b-colxx>

    </b-row>

    <div class="separator my-3"></div>

  </div>
  <!-- End Job Header -->

  <!-- Job Basic Form -->

  <div v-if="curPage == 1">
      <b-row v-if="$v._getCurJob.$anyError">
        <b-colxx>
          <b-alert variant="warning" fade show dismissible>
            STATUS: This job cannot be published as it doesn’t meet all the job boards’ requirements yet. It’s still visible in your account. To publish it on your careers page and selected job boards,  and  again.
          </b-alert>
        </b-colxx>
      </b-row>

      <b-row class="jobBody">

        <b-colxx xxs="12" md="12" lg="8">
            <b-card class="job-card m-0 p-0">
              <div class="card-header">
                <h3 class="pt-3">Job title and Department</h3>
              </div>

              <div class="card-body p-3">
                <b-row>
                  <b-colxx class="mt-3" xxs="12" md="12" lg="12">
                    <b-form-group>
                      <label class="color-strong required">Job title :</label>
                      <b-form-input type="text" v-model="$v._getCurJob.title.$model" :state="!$v._getCurJob.title.$error" />
                      <b-form-invalid-feedback v-if="!$v._getCurJob.title.required">Please enter job title</b-form-invalid-feedback>
                    </b-form-group>
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Department :</label>
                    <v-select id="job-department" v-model="_getCurJob.department" :options="departmentList" placeholder="Select..." />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="6" md="3" lg="3">
                    <label class="color-strong">Internal code :</label>
                    <b-form-input type="text" v-model="_getCurJob.code" />
                  </b-colxx>
                </b-row>
              </div>

              <div class="card-header">
                <h3 class="pt-3">Location</h3>
              </div>

              <div class="card-body p-3">
                <b-row>
                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong required">Country :</label>
                    <v-select id="job-country" v-model="_getCurJob.country" :options="countryList" placeholder="Select..." />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Region, City or Zip code :</label>
                    <span class="d-flex">
                      <b-form-input class="w-50" type="text" v-model="_getCurJob.region" />

                      <b-button size="sm" id="tool-internal-code" variant="link">
                        <i class="simple-icon-info mt-3" />
                      </b-button>

                      <b-tooltip target="tool-internal-code" placement="top"
                        title="Changing these details may affect the cost of placing this ad on certain job boards.">
                      </b-tooltip>

                      <b-form-checkbox class="mt-2" v-model="_getCurJob.remote"><span class="border-round">Full Remote</span></b-form-checkbox>
                    </span>

                  </b-colxx>

                </b-row>
              </div>

              <div class="card-header">
                <h3 class="pt-3">Company industry and Job function</h3>
              </div>

              <div class="card-body p-3">
                <b-row>
                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Company Industry :</label>
                    <v-select id="job-industry" v-model="_getCurJob.industry" :options="industryList" placeholder="Select..." />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Job function :</label>
                    <v-select id="job-function" v-model="_getCurJob.function" :options="functionList" placeholder="Select..." />
                  </b-colxx>
                </b-row>
              </div>

              <div class="card-header">
                <h3 class="pt-3">Employment details</h3>
              </div>

              <div class="card-body px-3 py-3">
                <b-row>
                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Employment Type :</label>
                    <v-select id="emp-type" v-model="_getCurJob.employmentType" :options="empTypeList" placeholder="Select..." />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Experience :</label>
                    <v-select id="emp-experience" v-model="_getCurJob.experience" :options="empExperienceList" placeholder="Select..." />
                  </b-colxx>
                </b-row>

                <b-row>
                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Education :</label>
                    <v-select id="emp-education" v-model="_getCurJob.education" :options="empEducationList" placeholder="Select..." />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Keywords :</label>
                    <v-select id="emp-keyword" multiple v-model="_getCurJob.keyword" :options="skillList" placeholder="Select..." />
                  </b-colxx>
                </b-row>

              </div>

              <div class="card-header">
                <h3 class="pt-3">Annual salary</h3>
              </div>

              <div class="card-body px-3 py-3">
                <b-row>
                  <b-colxx class="mt-3" xxs="6" md="3" lg="3">
                    <label class="color-strong">From :</label>
                    <b-form-input v-model="_getCurJob.fromSalary" type="number" step="1000" placeholder="" />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="6" md="3" lg="3">
                    <label class="color-strong">To :</label>
                    <b-form-input v-model="_getCurJob.toSalary" type="number" step="1000" placeholder="" />
                  </b-colxx>

                  <b-colxx class="mt-3" xxs="12" md="6" lg="6">
                    <label class="color-strong">Currency :</label>
                    <v-select id="emp-currency" v-model="_getCurJob.currency" :options="currencyList" placeholder="Select..." />
                  </b-colxx>

                </b-row>
              </div>

              <div class="card-footer px-3 py-3">
                <b-row>
                  <b-colxx xxs="9" lg="9" md="9">
                    <!--b-button variant="outline-dark" class="btnPreviewJob mx-1 rounded-lg" @click="previewJob()">
                      <span class="">Preview</span>
                    </!--b-button-->

                    <b-button v-if="!_getCurJob.id" size="sm" variant="outline-success" class="btnEditJob mx-1 rounded-lg" @click="createJob()">
                      <span class="">Create</span>
                    </b-button>

                    <b-button v-if="_getCurJob.id" size="sm" variant="outline-success" class="btnEditJob mx-1 rounded-lg" @click="saveJob()">
                      <span class="">Save & continue</span>
                    </b-button>

                    <b-button v-if="_getCurJob.status == 2" size="sm" variant="info" class="btnPublishJob mx-1 rounded-lg" @click="publishCurJob()">
                      <span class="d-inline-block">Publish</span>
                    </b-button>
                  </b-colxx>

                  <b-colxx v-if="_getCurJob.id" xxs="3" lg="3" md="3">
                    <b-button variant="secondary" size="sm" class="btnDeleteJob mx-1 rounded-lg float-right" @click="deleteJob()">
                      <span class="">Delete</span>
                    </b-button>
                  </b-colxx>
                </b-row>
              </div>
            </b-card>

        </b-colxx>

        <b-colxx  xxs="0" md="0" lg="4" class="px-5 d-none d-lg-block d-xl-block">

          <div class="color-gray font-weight-bold" style="margin-top:80px;">Do</div>
          <div class="color-gray">Use common job titles</div>
          <div class="color-gray">Advertise one job at a time, eg: 'Nurse', not 'nurses'</div>

          <div class="color-gray font-weight-bold" style="margin-top:60px;">Don’t</div>
          <div class="color-gray">Add details like salary or location</div>
          <div class="color-gray">Include words like 'career fairs' or 'help wanted'</div>

          <div v-if="!_getCurJob.remote" class="color-gray" style="margin-top:120px;">
            Use an accurate location to attract the most appropriate candidates
          </div>
          <div v-else-if="_getCurJob.remote" class="color-gray" style="margin-top:120px;">
            Use an accurate location to attract the most appropriate candidates<br />
            Only select fully remote for jobs that can be done anywhere.<br />
            If your job has flexible or temporary work from home options, please enter the office location and include that in the job description instead.
          </div>

          <div class="color-gray" style="margin-top:120px;">Include the industry and function to boost the job’s visibility on some job boards</div>

          <div class="color-gray" style="margin-top:140px;">Include as many details as possible to boost the job’s performance on some job boards</div>

          <div class="color-gray" style="margin-top:220px;">Include a salary to boost the job’s performance on some job boards</div>

        </b-colxx>
      </b-row>
  </div>

  <!-- Job Application Form -->

  <div v-if="curPage == 2">
      <h4 class="color-gray font-weight-bold">CUSTOMIZE YOUR APPLICATION FORM</h4>

      <b-row class="jobBody">

        <b-colxx xxs="12" lg="8" md="12" >
            <b-card class="job-card mb-3">
              <div class="card-header">
                <h4 class="pt-3">Personal information</h4>
              </div>

              <div class="card-body px-3">

                <b-row></b-row>

                <b-row class="py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Name</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.name">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.name='mandatory'" :pressed="_getCurJob.application.name=='mandatory'">Mandatory</b-button>
                        <!--b-button variant="primary" size="sm" @click="_getCurJob.application.name='optional'" :pressed="_getCurJob.application.name=='optional'">Optional</!--b-button>
                        <b-button-- variant="primary" size="sm" @click="_getCurJob.application.name='off'" :pressed="_getCurJob.application.name=='off'">Off</b-button-->
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Email</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.email">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.email='mandatory'" :pressed="_getCurJob.application.email=='mandatory'">Mandatory</b-button>
                        <!--b-button variant="primary" size="sm" @click="_getCurJob.application.email='optional'" :pressed="_getCurJob.application.email=='optional'">Optional</!--b-button>
                        <b-button-- variant="primary" size="sm" @click="_getCurJob.application.email='off'" :pressed="_getCurJob.application.email=='off'">Off</b-button-->
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Headline</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.headline">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.headline='mandatory'" :pressed="_getCurJob.application.headline=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.headline='optional'" :pressed="_getCurJob.application.headline=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.headline='off'" :pressed="_getCurJob.application.headline=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Phone</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.phone">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.phone='mandatory'" :pressed="_getCurJob.application.phone=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.phone='optional'" :pressed="_getCurJob.application.phone=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.phone='off'" :pressed="_getCurJob.application.phone=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Address</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.address">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.address='mandatory'" :pressed="_getCurJob.application.address=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.address='optional'" :pressed="_getCurJob.application.address=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.address='off'" :pressed="_getCurJob.application.address=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Photo</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.photo">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.photo='mandatory'" :pressed="_getCurJob.application.photo=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.photo='optional'" :pressed="_getCurJob.application.photo=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.photo='off'" :pressed="_getCurJob.application.photo=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

              </div>

              <div class="card-header">
                <h4 class="pt-3">Profile</h4>
              </div>

              <div class="card-body px-3">
                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Education</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.education">
                        <!--b-button variant="primary" size="sm" @click="_getCurJob.application.education='mandatory'" :pressed="_getCurJob.application.education=='mandatory'">Mandatory</!--b-button-->
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.education='optional'" :pressed="_getCurJob.application.education=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.education='off'" :pressed="_getCurJob.application.education=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Experience</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.experience">
                        <!--b-button variant="primary" size="sm" @click="_getCurJob.application.experience='mandatory'" :pressed="_getCurJob.application.experience=='mandatory'">Mandatory</!--b-button-->
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.experience='optional'" :pressed="_getCurJob.application.experience=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.experience='off'" :pressed="_getCurJob.application.experience=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Summary</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.summary">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.summary='mandatory'" :pressed="_getCurJob.application.summary=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.summary='optional'" :pressed="_getCurJob.application.summary=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.summary='off'" :pressed="_getCurJob.application.summary=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Resume</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.resume">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.resume='mandatory'" :pressed="_getCurJob.application.resume=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.resume='optional'" :pressed="_getCurJob.application.resume=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.resume='off'" :pressed="_getCurJob.application.resume=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

              </div>

              <div class="card-header">
                <h4 class="pt-3">Details</h4>
              </div>

              <div class="card-body px-3">

                <b-row class=" py-3 border-bottom">
                  <b-colxx xxs="3" md="6" lg="6" >
                    <label class="color-gray m-1">Cover letter</label>
                  </b-colxx>

                  <b-colxx xxs="9" md="6" lg="6" >
                    <b-button-group v-if="_getCurJob.application.coverletter">
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.coverletter='mandatory'" :pressed="_getCurJob.application.coverletter=='mandatory'">Mandatory</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.coverletter='optional'" :pressed="_getCurJob.application.coverletter=='optional'">Optional</b-button>
                        <b-button variant="primary" size="sm" @click="_getCurJob.application.coverletter='off'" :pressed="_getCurJob.application.coverletter=='off'">Off</b-button>
                    </b-button-group>
                  </b-colxx>
                </b-row>

                <b-row class=" py-3">
                  <b-colxx xxs="12" md="12" lg="12">
                    <label class="color-gray m-1">Questions</label>
                    <br />
                    <b-alert v-if="_getCurJob.application.questions && _getCurJob.application.questions.length == 0"
                      variant="danger" fade show dismissible>
                      Please add questions for application form.
                    </b-alert>

                  </b-colxx>
                </b-row>

                <b-row>
                  <b-colxx xxs="12" md="12" lg="12" v-if="_getCurJob.application.questions && _getCurJob.application.questions.length != 0">
                    <div class="sortable-survey">
                        <draggable type="ul" class="list-unstyled m-1" :options="{ handle: '.drag' }">
                            <job-quiz-builder class="drag" v-for="(quiz, index) in _getCurJob.application.questions" :key="`question_${index}`" :data="quiz" :sort="index" />
                        </draggable>
                    </div>
                  </b-colxx>
                </b-row>

                <b-row class="border-bottom">
                  <b-colxx xxs="12" md="12" lg="12" class="m-1">
                    <b-button size="sm" class="btnAddJobQuiz" variant="link" @click="addJobQuiz()">
                      <i class="iconsminds-add" /><span class="d-inline-block">Add a question</span>
                    </b-button>
                  </b-colxx>


                </b-row>

              </div>


              <div class="card-footer px-3 py-3">
                <b-row>
                  <b-colxx xxs="12" lg="6" md="6" class="d-flex justify-content-start">
                    <!--b-button variant="outline-dark" class="btnPreviewJob mx-1 rounded-lg" @click="previewJob()">
                      <span class="">Preview</span>
                    </!--b-button-->

                    <b-button :disabled="_getCurJob.application.questions.length == 0" variant="outline-success" class="btnEditJob mx-1 rounded-lg" @click="saveForm()">
                      <span class="">Save form</span>
                    </b-button>

                    <b-button v-if="_getCurJob.status == 2" variant="info" class="btnPublishJob mx-1 rounded-lg" @click="publishCurJob()">
                      <span class="d-inline-block">Publish</span>
                    </b-button>
                  </b-colxx>

                  <b-colxx xxs="12" lg="6" md="6" class="d-flex justify-content-end">
                    <b-button variant="secondary" class="btnDeleteJob mx-1 rounded-lg" @click="deleteJob()">
                      <span class="">Delete</span>
                    </b-button>
                  </b-colxx>
                </b-row>
              </div>
            </b-card>

        </b-colxx>

        <b-colxx xxs="12"  lg="4" md="12" class="px-5 d-none d-lg-block d-xl-block">
          <!-- From Preview -->
        </b-colxx>
      </b-row>
  </div>

  <!-- Find Candidates -->

  <div v-if="curPage == 3">
    <h4 class="color-gray font-weight-bold">Find Candidates</h4>
  </div>


</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Draggable from 'vuedraggable'
import JobQuizBuidler from '../../../components/Candio/JobQuizBuilder'
import { skillList } from "../../../constants/skill";
import { departmentList,
          industryList,
          functionList,
          empTypeList,
          empExperienceList,
          empEducationList,
          currencyList,
          countryList
        } from "../../../constants/job";

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

import axios from 'axios';

export default {
    props: ['jobId'],
    components: {
      'v-select': vSelect,
      'draggable': Draggable,
      'job-quiz-builder': JobQuizBuidler,
    },

    computed: {
        ...mapGetters(["currentUser", "_getRequestError", "_getCompanyProfile", "_getCurJob", ]),
    },

    data() {
        return {
          isLoad: false,

          curPage : 1,

          departmentList: departmentList,
          skillList: skillList,
          industryList: industryList,
          functionList: functionList,
          empTypeList: empTypeList,
          empExperienceList: empExperienceList,
          empEducationList: empEducationList,
          currencyList: currencyList,
          countryList: countryList,
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
      this.init();
    },

    methods: {
      ...mapActions(["__saveJob", "__initCurJob", "__getCurJob", "__publishJob", "__archieveJob", ]),

      scrollViewTo(top) {
        window.scrollTo({
          top:top,
          behavior: 'smooth'
        })
      },

      checkJobState() {
        if(this._getCurJob.title && this._getCurJob.department) {
          return true;
        } else {
          return false;
        }
      },

      init() {
        this.curPage = 1;

        if(!this.jobId) { // New Job Creation.
          this.__initCurJob();
        } else { // Exist Job Edition.
          this.__getCurJob(this.jobId);
        }
      },

      showJobBasic() {
        this.curPage = 1;
        this.scrollViewTo(0);
      },

      showApplicationForm() {
        this.curPage = 2;
        this.scrollViewTo(0);
      },

      showCandidates() {
        // this.curPage = 3;
        // this.scrollViewTo(0);
        this.$router.push(`/company/jobs/${this._getCurJob.id}/candidates/listview`);
      },

      createJob() {
        var self = this;
        this.$v.$touch();

        this.$v._getCurJob.$touch();
        if (!this.$v._getCurJob.$anyError) {

          this._getCurJob.status = 0;
          console.log("Create Job : ", this._getCurJob);

          this.__saveJob().then(
            function () {
              console.log("Created Job : ", self._getCurJob);
            },
            function (err) {
              console.log("ERR : ", err);
            }
          );
        } else {
          this.scrollViewTo(0);
        }
      },

      saveJob() {
        var self = this;
        this.$v.$touch();

        this.$v._getCurJob.$touch();
        if (!this.$v._getCurJob.$anyError) {

          this._getCurJob.status = this.checkJobState()? 1 : 0; // 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved

          this.__saveJob().then(
            function () {
              self.curPage = 2;
            },
            function (err) {
              console.log("ERR : ", err);
            }
          );
        } else {
          this.scrollViewTo(0);
        }
      },

      addJobQuiz() {

        this._getCurJob.application.questions.push(
          {
            order: this._getCurJob.application.questions.length,
            jobId: this._getCurJob.id,
            type: 0, // Text Input
            quiz: 'You must input Question',
            answers: [],
          }
        )
      },

      saveForm() {

        this._getCurJob.status = 2; // 0: job draft, 1 : job basic complete, 2 : job application complete, 3 : job published, 4 : job archieved

        this.__saveJob().then(
          function () {
            console.log("Save Form & Job : ", self._getCurJob);
            self.curPage = 2;
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );
      },

      publishCurJob() {
        console.log(this._getCurJob.id, this._getCurJob.title);
        var self = this;

        self.__publishJob(this._getCurJob.id).then(
          function (res) {
            self._getCurJob.status = 3; // Published Job
            console.log("Published Job : ", res);
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );
      },

      previewJob() {
        console.log("Preview Current Job : ", this._getCurJob.id);
      },

      editJob() {
        console.log("Edit Current Job : ", this._getCurJob.id);
      },

      archieveJob() {
        var self = this;

        if(!this._getCurJob.id) {
          self.$notify("error", "Company Job Error", "Sorry! You can not archieve this job before publish it", {
              duration: 5000,
              permanent: false
          });

          return;
        }

        console.log("Archieve Current Job : ", this._getCurJob.id);

        self.__archieveJob(this._getCurJob.id).then(
          function (res) {
            self._getCurJob.status = 4; // Archieve Job
            console.log("Archieved Job : ", res);
          },
          function (err) {
            console.log("ERR : ", err);
          }
        );

      },

      cloneJob(){
        console.log("Clone Current Job : ", this._getCurJob.id);
      },

      deleteJob() {
        console.log("Delete Current Job : ", this._getCurJob.id);
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
      }
    },


}
</script>
