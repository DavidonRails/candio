<template>
<div>
  <div v-if="isLoad" class="loading"></div>

  <div class="d-flex justify-content-between">
    <h3>Projects</h3>

    <div class="d-inline-block" @click="newProjectDlg()">
      <router-link to="#">
        <i class="iconsminds-add" style="font-size:2em;"></i>
      </router-link>
    </div>
  </div>

  <b-alert v-if="get_edit_company.projects && get_edit_company.projects.lenght==0" class="mt-3" variant="warning" fade show dismissible>
    <span class="glyph-icon simple-icon-info"></span> Tell us where you've and what projects you have contributed to in the past
  </b-alert>

  <b-alert v-if="!get_edit_company.pro_validate && get_edit_company.projects && get_edit_company.projects.length" class="mt-3" variant="danger" fade show dismissible>
    <span class="glyph-icon simple-icon-info"></span> Please fill out the essential fields for all projects.
  </b-alert>

  <b-colxx xxs="12" class="project_lists mb-4" v-if="get_edit_company.projects" >
    <!-- Loop Start -->
    <b-card v-for="(item, index) in get_edit_company.projects" no-body class="d-flex mb-3" :key="`pro_${index}`">

      <!-- tab header -->
      <div v-if="!item.removed" class="d-flex flex-grow-1 min-width-zero" style=" height:50px; background-color:#dfdfdf; " role="tab" @click="pIndex=index">
          <b-button href="#" class="card-body  btn-empty text-left text-one py-2" v-b-toggle="`pro_${index}`" variant="link">
            {{item.project_name}}
          </b-button>

          <div class="position-absolute card-top-buttons pt-2">
            <b-button variant="danger" class="icon-button"  @click="deleteProject(index)">
                <i class="simple-icon-trash" />
            </b-button>
          </div>
      </div>


      <!-- tab body -->
      <b-collapse v-if="!item.removed" :id="`pro_${index}`" :ref="`pro_${index}`" :visible="index===pIndex" accordion="com-accordion" role="tabpanel" style=" background-color:#efefef; ">
        <div class="card-body accordion-content pt-3">
                <b-row class="">
                  <b-colxx xxs="12">
                    <label class="color-strong required">Project Name :</label>
                    <b-form-input :id="`p_name_${index}`" v-model="item.project_name" :state=" item.project_name != '' " type="text" placeholder="Project Name" />
                    <b-form-invalid-feedback>Required</b-form-invalid-feedback>

                  </b-colxx>
                </b-row>

                <b-row class="mt-5">
                  <b-colxx xxs="12">
                    <label class="color-strong required">What did you build? What was impressive about it from a technology perspective?</label>
                    <div class="color-gray pl-3 mt-3">Your answer should include:</div>
                    <div class="color-gray pl-3">&#9679; What production or infrastructure did you build?</div>
                    <div class="color-gray pl-3">&#9679; What problem did you solve with it?</div>
                    <div class="color-gray pl-3 mb-3">&#9679; What was your role in the team? (e.g. As the Tech Lead, I led a team of 50+ Android engineers to build...)</div>

                    <b-form-textarea
                      :id="`p_summary_${index}`"
                      :state=" item.summary != '' "
                      v-model="item.summary"
                      placeholder=""
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <b-form-invalid-feedback>Required</b-form-invalid-feedback>
                  </b-colxx>
                </b-row>

                <b-row class="mt-5">
                  <b-colxx xxs="12">
                    <label class="color-strong required">What technologies (languages and frameworks), platform, and tools did you use?</label>

                    <b-alert v-if="item.skills.length == 0" variant="warning" fade show dismissible>
                      <span class="glyph-icon simple-icon-info"></span> Please select more than one skills for project</strong>
                    </b-alert>

                    <v-select :id="`p_skills_${index}`" multiple v-model="item.skills" :options="skill_list" />
                  </b-colxx>
                </b-row>

                <b-row class="mt-5">
                  <b-colxx xxs="12">
                    <label class="color-strong required">What was the outcomes of your project?</label>
                    <div class="color-gray pl-3 mt-3">Your answer should include:</div>
                    <div class="color-gray pl-3">&#9679; What metrics did you improve? (e.g. Reduced the Instagram scroll latency by 72%.)</div>
                    <div class="color-gray pl-3 mb-3">&#9679; Optional: What business impact did you make? (e.g. Increased user signup by 80%)</div>

                    <b-form-textarea
                      :id="`p_outcome_${index}`"
                      :state=" item.outcome != '' "
                      v-model="item.outcome"
                      placeholder=""
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <b-form-invalid-feedback>Required</b-form-invalid-feedback>
                  </b-colxx>
                </b-row>

                <b-row class="mt-5">
                  <b-colxx xxs="12">
                    <label class="color-strong">Link to an App, a GitHub Repo, or a Portfolio :</label>
                    <div class="color-gray pl-3 my-3">(this will help you get better opportunities)</div>
                    <b-form-input :id="`p_link_${index}`" v-model="item.url" type="url" placeholder="https://example.com" />
                  </b-colxx>
                </b-row>


                <b-row class="mt-5">
                  <b-colxx xxs="12">
                    <label class="color-strong">Please upload your portfolio screenshots if applicable</label>

                    <div class="d-flex justify-content-center">
                      <vue-upload-multiple-image
                        :key="`p_upload_${index}`"
                        :id="`p_upload_${index}`"
                        @upload-success="uploadImageSuccess"
                        @before-remove="beforeRemove"
                        @edit-image="editImage"
                        :data-images="item.images"
                        :idUpload="`p_idUpload_${index}`"
                        :editUpload="`p_editUpload_${index}`"
                        dragText="(Drug & Drop multi image files)"
                        browseText="Browse"
                        primaryText="Default"
                        markIsPrimaryText="Set as default"
                        popupText="This image will be displayed as default"

                        ></vue-upload-multiple-image>
                    </div>
                  </b-colxx>
                </b-row>

                <b-row class="mt-3">
                  <b-colxx xxs="12" class="d-flex justify-content-end">
                    <b-button :key="`p_del_${index}`" squared variant="danger" @click="deleteProject(index)">Delete</b-button>
                  </b-colxx>
                </b-row>

        </div>
      </b-collapse>
    </b-card>
    <!-- Loop End -->
  </b-colxx>

</div>
</template>

<script>
import {
    mapGetters,
    mapActions
} from "vuex";

import {
    validationMixin
} from "vuelidate";

const {
    required,
    maxLength,
    minLength,
    email
} = require("vuelidate/lib/validators");

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { skillList } from "../../constants/skill";
import { getRandomeFileName, getFileExtension } from '../../utils/index'

import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
  props: {
    name: { type: String, default: 'project-modal' },
  },

  components: {
    'v-select': vSelect,
    VueUploadMultipleImage,
  },

  data () {
    return {

      isLoad: false,

      skill_list: skillList,

      pIndex: 0,

      project: {
        name: "",
        summary: "",
        skills: "",
        outcome: "",
        url: "",
        removed : false,
        images: [],
      },

    }
  },

  mixins: [validationMixin],

  validations: {
    project: {
      name: {
          required,
      },
      summary: {
          required,
      },
      skills: {
          required,
      },
      outcome: {
          required,
      },
      url: {},
      images: {},
    },
  },

  computed: {
      ...mapGetters(["currentUser", "get_company_list", "get_edit_company_index", "get_edit_company", "get_uploading",  ])
  },

  created() {
    this.init();
  },

  methods: {
    ...mapActions(["setUploadFlag", "addNewCompanyProject", "uploadPortfolioToFB", "removeExpProject", ]),

    init() {

    },

    newProjectDlg() {

      this.project = {
        id: null,
        profileCompanyId: this.get_edit_company.id,
        userId: this.currentUser.id,
        project_name: "Customer Relationship Management System",
        summary: "CRM empowers small to large-sized organizations with a complete customer relationship lifecycle management solution for managing organization-wide Sales, Marketing, Customer Support & Service and Inventory Management in a single business system.",
        skills: [
          "A/B Testing",
          "Adobe Photoshop"
        ],
        outcome: " CRM can be used by small, middle and large businesses. You can even build your own version of Zoho CRM. Sell smarter and faster with Zoho CRM.  Over 20,000 small businesses use our broader business commerce platform so they have everything they need to manage and grow their business in one place.",
        url: "https://candiodev.app/",
        removed: false,
        images: [
          // {"path":"https://firebasestorage.googleapis.com/v0/b/candio-24fb6.appspot.com/o/Portfolio%2Fl6arm7mavecocp54iakq6f.jpg?alt=media&token=721e3fbc-63cd-4fd4-8016-58655a8cecf9"},
          // {"path":"https://firebasestorage.googleapis.com/v0/b/candio-24fb6.appspot.com/o/Portfolio%2Fjt95jfd2uxy1hz28qktxs.jpg?alt=media&token=fb699dc2-abd9-41ad-9f7a-20f56df8e5a4"}
        ],
      };

      this.addNewCompanyProject(this.project);

      this.pIndex = this.get_edit_company.projects.length - 1;
    },

    async deleteProject(index) {
      var self = this;

      this.get_edit_company.projects[index].removed = true;
      this.pIndex = -1;
      /*
      self.setUploadFlag(false);

      var params = {
        id: this.get_edit_company.projects[this.pIndex].id,
        profileCompanyId: this.get_edit_company.projects[this.pIndex].profileCompanyId,
        userId: this.currentUser.id,
      };

      await this.removeExpProject(params);
      console.log("Remove Project : ", self.get_edit_company.projects);

      self.get_edit_company.projects.splice(index, 1);
      this.pIndex = this.get_edit_company.projects.length - 1;

      self.setUploadFlag(false);
      */
    },

    async uploadImageSuccess(formData, index, fileList) {

      var self = this;
      self.setUploadFlag(false);

      this.get_edit_company.projects[this.pIndex].images = fileList;

      if(fileList[index].path.indexOf("https://") == -1) { // If Path has not url, it mean base64
        self.setUploadFlag(true);

        var params = {
          name: getRandomeFileName(fileList[index].name),
          path: fileList[index].path,
          type: `image/${getFileExtension(fileList[index].name)}`
        }

        var fbURL = await this.uploadPortfolioToFB(params);
        fileList[index].path = fbURL;
        this.get_edit_company.projects[this.pIndex].images[index] = fileList[index];

        self.setUploadFlag(false);

        console.log("Add New Image : ", this.get_edit_company.projects[this.pIndex].images);
      }
    },

    beforeRemove (index, done, fileList) {
      var r = confirm("Are you sure to remove portfolio image ?")
      if (r == true) {
        this.get_edit_company.projects[this.pIndex].images = fileList;
        console.log('Remove Portfolio : ', this.get_edit_company.projects[this.pIndex].images)
        done()
      }
    },

    async editImage (formData, index, fileList) {
      var self = this;
      self.setUploadFlag(false);

      this.get_edit_company.projects[this.pIndex].images = fileList;

      if(fileList[index].path.indexOf("https://") == -1) { // If Path has not url, it mean base64
        self.setUploadFlag(true);

        var params = {
          name: getRandomeFileName(fileList[index].name),
          path: fileList[index].path,
          type: `image/${getFileExtension(fileList[index].name)}`
        }

        var fbURL = await this.uploadPortfolioToFB(params);
        fileList[index].path = fbURL;
        this.get_edit_company.projects[this.pIndex].images[index] = fileList[index];

        self.setUploadFlag(false);

        console.log("Change Other Image : ", this.get_edit_company.projects[this.pIndex].images);
      }

    },





    // End Methods

  }
}
</script>
