<template>
<div class="exp_list" ref="exp_list">


    <div class="d-flex justify-content-between">
      <h3>Work history</h3>
      <b-button squared variant="outline-primary" class="d-inline-block text-right" @click="newCompanyModal()" >
        <i class="simple-icon-plus"></i>
        Add Experience
      </b-button>
    </div>

    <b-alert v-if="!noExperiecne" class="mt-3" variant="danger" fade show dismissible>
      <span class="glyph-icon simple-icon-info"></span> Please add more than one your experience.
    </b-alert>

    <div class="company_history mt-3">
          <b-card class="py-0 px-0 mt-3" no-body  v-for="(item, index) in get_company_list" :key="`com_${index}`">
              <b-card-body class="py-3 px-3">
                <div class="d-flex justify-content-between">
                  <h3>{{item.company_name}}</h3>

                  <div class="d-inline-block" @click="editCompanyModal(index)">
                    <router-link to="#">
                      <i class="simple-icon-pencil" style="font-size:1.5em;"></i>
                    </router-link>
                  </div>

                </div>
                <div class="color-gray pl-3 mt-3">
                  <p>{{item.position}}</p>
                  <span>{{formatDate(item.start_date)}}</span> -
                  <span v-if="!item.still_work">{{formatDate(item.end_date)}}</span>
                  <span v-if="item.still_work">Present</span>
                </div>
              </b-card-body>
          </b-card>
    </div>

    <b-modal id="modalDeleteConfirm" ref="modalDeleteConfirm" title="Delete Confirm"
      :hide-backdrop="false"
      :no-close-on-backdrop="false">

        <strong>Are you sure to delete your experience ?</strong>

        <template slot="modal-footer">
            <b-button variant="primary" @click="removeExp()" class="mr-1">Yes</b-button>
            <b-button variant="secondary" @click="hideConfirm()">No</b-button>
        </template>
    </b-modal>


    <b-modal class="modalExp" size="lg" ref="modalExp" :no-close-on-backdrop="true" :title="modal_title">
      <b-row class="my-3">
        <b-colxx xxs="12">
          <label class="color-gray required">Company :</label>
          <b-form-input type="text" placeholder="Company Inc." v-model="$v.company.company_name.$model" :state="!$v.company.company_name.$error" />
          <b-form-invalid-feedback v-if="!$v.company.company_name.required">Required</b-form-invalid-feedback>
        </b-colxx>
      </b-row>

      <b-row class="my-3">
        <b-colxx xxs="12">
          <label class="color-gray required">Position :</label>
          <b-form-input type="text" placeholder="Your role eg Junior front-end engineer" v-model="$v.company.position.$model" :state="!$v.company.position.$error" />
          <b-form-invalid-feedback v-if="!$v.company.position.required">Required</b-form-invalid-feedback>
        </b-colxx>
      </b-row>

      <b-row class="my-3">

        <b-colxx xxs="6">
          <label class="color-gray required">Start Date :</label>
          <v-date-picker mode="single"
            v-model="$v.company.start_date.$model"
            :input-props="{ class:'form-control', placeholder: 'Start Date' }"
          ></v-date-picker>

          <div :class="{'invalid-feedback':true ,'d-block':$v.company.start_date.$error && !$v.company.start_date.required}">Date required</div>
        </b-colxx>

        <b-colxx v-if="!company.still_work" xxs="6">
          <label class="color-gray required">End Date :</label>
          <v-date-picker mode="single"
            v-model="$v.company.end_date.$model"
            :input-props="{ class:'form-control', placeholder: 'End Date' }"
          ></v-date-picker>

          <div :class="{'invalid-feedback':true ,'d-block':$v.company.end_date.$error && !$v.company.end_date.required}">Date required</div>
        </b-colxx>

        <b-colxx v-if="company.isPeriodValidate" xxs="12" class="mt-2">
          <b-alert variant="danger" fade show dismissible>
            <span class="glyph-icon simple-icon-info mr-2"></span>The End date cannot be earlier than the Start date.
          </b-alert>
        </b-colxx>

        <b-colxx v-if="company.isRequireEndDate" xxs="12" class="mt-2">
          <b-alert variant="danger" fade show dismissible>
            <span class="glyph-icon simple-icon-info mr-2"></span>Please select End date.
          </b-alert>
        </b-colxx>

      </b-row>

      <b-row class="my-3">
        <b-colxx xxs="12">
          <b-form-checkbox v-model="company.still_work" name="still_work">
            Still working here
          </b-form-checkbox>
        </b-colxx>
      </b-row>

      <div class="separator my-5"></div>

      <project-list ref="pro_list"></project-list>

      <template slot="modal-footer">
          <!-- Save Button -->
          <b-button v-if="modal_mode=='edit'" variant="primary"  class="mr-1"
            :disabled="isLoad || get_uploading"
            :class="{'btn-multiple-state btn-shadow': true,
                      'show-spinner': isLoad || isAdding || get_uploading,
                      'show-success': !isLoad && !isAdding && get_profileError===false,
                      'show-fail': !isLoad && !isAdding && get_profileError }"
            @click="saveExp()">

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
            <span class="label d-inline-block">Save</span>

          </b-button>

          <!-- Remove Button -->
          <b-button v-if="modal_mode=='edit'" variant="danger"  class="mr-1"
            :disabled="isLoad || get_uploading"
            :class="{'btn-multiple-state btn-shadow': true,
                      'show-spinner': isLoad || isRemoving,
                      'show-success': !isLoad && !isRemoving && get_profileError===false,
                      'show-fail': !isLoad && !isRemoving && get_profileError }"
            @click="showConfirm()">

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
            <span class="label d-inline-block">Remove</span>

          </b-button>

          <!-- Add Button -->
          <b-button v-if="modal_mode=='new'" variant="primary"  class="mr-1"
            :disabled="isLoad || get_uploading"
            :class="{'btn-multiple-state btn-shadow': true,
                      'show-spinner': isLoad || isAdding || get_uploading,
                      'show-success': !isLoad && !isAdding && get_profileError===false,
                      'show-fail': !isLoad && !isAdding && get_profileError }"
            @click="addExp()">

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
            <span class="label d-inline-block">Add</span>

          </b-button>

          <!-- Cancel Button -->
          <b-button v-if="modal_mode=='new'" variant="primary" @click="hideCompanyModal()">Cancel</b-button>

      </template>
    </b-modal>

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

import ProfileProject from './ProfileProject'
import { getDateFromString } from '../../utils/index'

export default {
  props: {
    name: { type: String, default: 'experiene-modal' },
  },

  mixins: [validationMixin],

  validations: {
    company: {
      company_name: {
        required,
      },

      position: {
        required,
      },

      start_date: {
        required,
      },

      end_date: {
        // required,
      }
    },

  },

  components: {
      'project-list': ProfileProject,
  },

  computed: {
      ...mapGetters(["currentUser", "get_profile", "get_uploading", "get_company_list", "get_edit_company_index", "get_edit_company", "get_profileError", ])
  },

  data () {
    return {
      isLoad: false,
      isSaving : false,
      isAdding : false,
      isRemoving : false,

      noExperiecne : true,

      modal_title: "Add Experience",
      modal_mode: "new",

      still_work : false,
      isPeriodValidate : false,
      isRequireEndDate : false,

      company: {
        id: "",
        userId: null,
        profileId: null,
        company_name: "",
        position: "",
        start_date : null,
        end_date : null,

        projects: [],
        pro_validate: true,
        still_work : false,
        isRequireEndDate : false,
        isPeriodValidate : false,
      },

    }
  },

  created() {

  },

  methods: {
    ...mapActions(["addCompany", "updateCompany", "removeCompany", "setEditCompanyIndex", "setEditCompany", ]),

    hideConfirm() {
      this.$refs['modalDeleteConfirm'].hide()
    },

    showConfirm() {
      this.$refs['modalDeleteConfirm'].show()
    },

    init() {
      this.isLoad = false;
      this.isSaving = false;
      this.isAdding = false;
      this.isRemoving = false;

      this.noExperiecne = true;

      this.company = {
        id: "",
        userId: this.currentUser.id,
        profileId: this.get_profile.profileId,
        company_name: "EXQSD Company",
        position: "Web Developer",
        start_date : new Date("2018/10/01"),
        end_date : new Date("2019/12/01"),

        projects: [],
        pro_validate: true,
        still_work : false,
        isRequireEndDate : false,
        isPeriodValidate : false,

      };
    },

    newCompanyModal() {

      this.init();
      this.setEditCompanyIndex(null);
      console.log("Add => Index : ", this.get_edit_company_index);
      this.setEditCompany(this.company);
      this.modal_title = "Add Experience";
      this.modal_mode = "new";

      this.$refs['modalExp'].show();
    },

    editCompanyModal(cIndex) {

      this.company = {
        id: this.get_company_list[cIndex].id ? this.get_company_list[cIndex].id : "",
        userId: this.get_company_list[cIndex].userId,
        profileId: this.get_profile.profileId,
        company_name: this.get_company_list[cIndex].company_name,
        position: this.get_company_list[cIndex].position,
        start_date : this.get_company_list[cIndex].start_date,
        end_date : this.get_company_list[cIndex].end_date,

        projects: this.get_company_list[cIndex].projects,
        pro_validate: true,
        still_work : this.get_company_list[cIndex].still_work,
        isRequireEndDate : false,
        isPeriodValidate : false,

      };

      this.company.projects.forEach((e) => {
        e.removed = false;
      });

      console.log("Current Company Projects : ", this.company.projects);

      this.setEditCompany(this.get_company_list[cIndex]);
      this.setEditCompanyIndex(cIndex);
      console.log("Save => Index : ", this.get_edit_company_index);
      this.modal_title = "Edit Experience";
      this.modal_mode = "edit";

      this.$refs['modalExp'].show();

    },

    hideCompanyModal () {

      this.company = {
        id: null,
        userId: this.currentUser.id,
        profileId: this.get_profile.profileId,
        company_name: "",
        position: "",
        start_date : null,
        end_date : null,
        projects: [],
        pro_validate: true,
        still_work : false,
        isRequireEndDate : false,
        isPeriodValidate : false,
      }

      this.setEditCompanyIndex(null);
      console.log("Hide => Index : ", this.get_edit_company_index);
      this.setEditCompany(this.company);
      this.modal_title = "Add Experience";
      this.modal_mode = "new";

      this.$refs['modalExp'].hide()

    },

    formatDate(strDate) {
      return getDateFromString(strDate);
    },

    validateCompany() {
      var self = this;

      this.$v.$touch();
      this.$v.company.$touch();

      if(!this.$v.company.$anyError) {

        this.company.isRequireEndDate = false;
        this.company.isPeriodValidate = false;

        // Experience Date Validation
        if(this.company.still_work) {
          this.company.end_date = null;
        } else {
          if( this.company.end_date == null ) {
            this.company.isRequireEndDate = true;
            return false;
          }

          var d1 = Date.parse(this.company.start_date);
          var d2 = Date.parse(this.company.end_date);

          if (d1 > d2) {
            this.company.isPeriodValidate = true;
            return false;
          }
        }

        self.get_edit_company.pro_validate = true;

        // Check Projects Validation
        if(self.get_edit_company.projects) {
          self.get_edit_company.projects.forEach((e) => {

            if(!e.project_name || !e.skills.length || !e.summary || !e.outcome) {
              console.log('MISSING : ', e.project_name, e.skills.length, e.summary, e.outcome);
              self.get_edit_company.pro_validate = false;

              // console.log(self.$refs['modalExp']);

              self.$refs['exp_list'].scrollTo({
                top : 0,
                behavior : 'smooth'
              });

              return false;
            }

          });
        }

        if(!self.get_edit_company.pro_validate) {
          return false;
        }

        return true;
      } else {
        return false;
      }
    },

    addExp () {
      var self = this;

      if(this.validateCompany()) {
        self.isLoad = true;
        self.isAdding = true;

        var c = {
          id: this.company.id? this.company.id: "",
          userId: this.currentUser.id,
          profileId: this.company.profileId,
          company_name: this.company.company_name,
          position: this.company.position,
          start_date : this.company.start_date,
          end_date : this.company.still_work? null : this.company.end_date,

          projects: this.get_edit_company.projects,

          pro_validate: true,
          still_work : this.company.still_work,
          isRequireEndDate : false,
          isPeriodValidate : false,
        }

        this.addCompany(c).then(
          function (data) {
            console.log("Add Company Result: ", data);
            self.isLoad = false;
            self.isAdding = false;
            self.hideCompanyModal();
          },
          function (err) {
            console.log("ERR : ", err);
            self.isLoad = false;
            self.isAdding = false;
            self.hideCompanyModal();
          }
        );

      }
    },

    saveExp() {
      var self = this;

      if(this.validateCompany()) {
        self.isLoad = true;
        self.isSaving = true;

        var c = {
          id: this.company.id,
          userId: this.currentUser.id,
          profileId: this.get_profile.profileId,
          company_name: this.company.company_name,
          position: this.company.position,
          start_date : this.company.start_date,
          end_date : this.company.still_work? null : this.company.end_date,

          projects: this.get_edit_company.projects,

          pro_validate: true,
          still_work : this.company.still_work,
          isRequireEndDate : false,
          isPeriodValidate : false,
        }

        this.updateCompany(c).then(
          function (data) {
            console.log("Save Company Result: ", data);
            self.isLoad = false;
            self.isSaving = false;
            self.hideCompanyModal();
          },
          function (err) {
            console.log("ERR : ", err);
            self.isLoad = false;
            self.isSaving = false;
            self.hideCompanyModal();
          }
        );
      }
    },

    removeExp() {
      var self = this;
      self.hideConfirm();
      self.isLoad = true;
      self.isRemoving = true;

      this.removeCompany().then(
        function (data) {
          console.log("Remove Company : ", self.get_company_list);

          self.isLoad = false;
          self.isRemoving = false;

          self.hideCompanyModal();
        },
        function (err) {
          console.log("ERR : ", err);
          self.isLoad = false;
          self.isRemoving = false;
          self.hideCompanyModal();
        }
      );

    },

    setNoExperienceError(val) {
      this.noExperiecne = val;
    }


  // End Method

  },
}
</script>
