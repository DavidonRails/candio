<template>
<div>
    <div class="d-flex justify-content-between">
      <h3>{{title}}</h3>

      <div class="d-inline-block" @click="newProjectDlg()">
        <router-link to="#">
          <i class="iconsminds-add" style="font-size:2em;"></i>
        </router-link>
      </div>
    </div>

    <b-alert v-if="!sideProValidate && get_side_projects.length" class="mt-3" variant="danger" fade show dismissible>
      <span class="glyph-icon simple-icon-info"></span> Please fill out the essential fields for all projects.
    </b-alert>

    <b-alert v-if="!noSideProject" class="mt-3" variant="danger" fade show dismissible>
      <span class="glyph-icon simple-icon-info"></span> Please add more than one projects.
    </b-alert>


    <b-colxx xxs="12" class="project_lists my-4">
      <!-- Loop Start -->
      <b-card v-for="(item, index) in get_side_projects" no-body class="d-flex mb-3" :key="`pro_${index}`">

        <!-- tab header -->
        <div v-if="!item.removed" class="d-flex flex-grow-1 min-width-zero" style=" height:50px; background-color:#dfdfdf; " role="tab" @click="pIndex=index">
            <b-button href="#" class="card-body  btn-empty text-left text-one py-2" v-b-toggle="`pro_${index}`" variant="link">
              {{item.project_name}}
            </b-button>

            <div class="position-absolute card-top-buttons pt-2">
              <b-button variant="outline-danger" class="icon-button"  @click="deleteProject(index)">
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
                  <!--
                  <b-row class="my-5">
                    <b-colxx xxs="6">
                      <label class="color-gray required">Start Date :</label>
                      <v-date-picker mode="single"
                        v-model="item.start_date"
                        :input-props="{ class:'form-control', placeholder: 'Start Date' }"
                      ></v-date-picker>
                      <div :class="{'invalid-feedback':true ,'d-block': !item.start_date}">Date required</div>
                    </b-colxx>


                    <b-colxx xxs="6">
                      <label class="color-gray required">End Date :</label>
                      <v-date-picker mode="single"
                        v-model="item.end_date"
                        :input-props="{ class:'form-control', placeholder: 'End Date' }"
                      ></v-date-picker>
                      <div :class="{'invalid-feedback':true ,'d-block': !item.end_date}">Date required</div>

                    </b-colxx>
                  </b-row>

                  <b-colxx v-if="item.start_date > item.end_date" xxs="12" class="mt-2">
                    <b-alert variant="danger" fade show dismissible>
                      <span class="glyph-icon simple-icon-info mr-2"></span>The End date cannot be earlier than the Start date.
                    </b-alert>
                  </b-colxx>
                  -->

                  <b-row class="mt-5">
                    <b-colxx xxs="12">
                      <label class="color-strong required">Description</label>

                      <b-form-textarea
                        :id="`p_desc_${index}`"
                        :state="item.summary!=''"
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

                      <b-alert v-if="item.skills.length == 0" variant="danger" fade show dismissible>
                        <span class="glyph-icon simple-icon-info"></span> Please select more than one skills for project</strong>
                      </b-alert>

                      <v-select :id="`p_skills_${index}`" multiple v-model="item.skills" :options="skill_list" />
                    </b-colxx>
                  </b-row>

                  <b-row class="mt-5">
                    <b-colxx xxs="12">
                      <label class="color-strong">Link to an App, a GitHub Repo, or a Portfolio :</label>
                      <div class="color-gray pl-3 my-3">(this will help you get better opportunities)</div>
                      <b-form-input :id="`p_link_${index}`" v-model="item.url" type="url" placeholder="https://example.com" />
                    </b-colxx>
                  </b-row>


                  <b-row class="mt-3">
                    <b-colxx xxs="12" class="d-flex justify-content-end">
                      <b-button :key="`p_del_${index}`" squared variant="secondary" @click="deleteProject(index)">Delete</b-button>
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

import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { skillList } from "../../constants/skill";

export default {
  props: {
    title: { type: String, default: 'Side projects' },
  },

  components: {
    'v-select': vSelect,
  },

  data () {
    return {

      isLoad : false,
      sideProValidate : true,
      noSideProject : true,
      skill_list: skillList,

      pIndex: 0,

      project: {
        id: null,
        profileCompanyId: null,
        userId: null,

        project_name: null,
        // start_date : null,
        // end_date : null,
        summary: null,
        skills: [],
        url: null,
        images: [],
      },
    }
  },

  computed: {
      ...mapGetters(["currentUser", "get_side_projects",  ])
  },

  created() {
    this.init();
  },

  methods: {
    ...mapActions(["addSideProject", "removeSideProject", ]),

    init() {

    },

    newProjectDlg() {

      this.noSideProject = true;

      var p = {
        id: null, // New Side Project
        profileCompanyId: null, // Side Project
        userId: this.currentUser.id,

        project_name: "Side Project - React Native Mobile",
        // start_date : new Date("2018/10/01"),
        // end_date : new Date("2019/12/01"),
        summary: "CRM empowers small to large-sized organizations with a complete customer relationship lifecycle management solution for managing organization-wide Sales, Marketing, Customer Support & Service and Inventory Management in a single business system.",
        skills: [
          "A/B Testing",
          "Adobe Photoshop"
        ],
        removed: false,
        url: "https://candiodev.app/",
        images: [],
      };

      this.addSideProject(p);

      this.pIndex = this.get_side_projects.length - 1;

    },

    deleteProject(index) {
      console.log(index, this.get_side_projects[index]);
      this.get_side_projects[index].removed = true;
      this.pIndex = -1;
    },

    setSideProjectValidat(val) {
      this.sideProValidate = val;
    },

    setNoSideProjectError(val) {
      this.noSideProject = val;
    }
  }
}
</script>
