<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>

          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">
                Please use this form to register as Candidate.
                <br />
                <br />
                If you are a member, please
                <router-link tag="a" to="/user/login" class="color-theme-1">login</router-link>.

                <br />
                <br />
                If you own your company, please
                <router-link tag="a" to="/user/regcompany" class="color-theme-1">register as company</router-link>

              </p>
          </div>

          <div class="form-side">

            <router-link tag="a" to="/"><span class="logo-single"/></router-link>

            <h6 class="mb-4">Candidate Registration</h6>

              <b-form class="av-tooltip tooltip-label-bottom">
                <form-wizard color="#F26A21" @on-complete="formSubmit" title="Become a CANDIDATE!" subtitle="Please fill registration form">
                  <tab-content title="Personal details" :before-change="validatePersonalData">

                    <b-form-group label="First Name" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.first_name.$model" :state="!$v.personalForm.first_name.$error" />
                        <b-form-invalid-feedback v-if="!$v.personalForm.first_name.required">Please enter fist name</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.personalForm.first_name.minLength">First name must be minimum 2 characters</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group label="Last Name" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.last_name.$model" :state="!$v.personalForm.last_name.$error" />
                        <b-form-invalid-feedback v-if="!$v.personalForm.last_name.required">Please enter last name</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.personalForm.last_name.minLength">Last name must be minimum 2 characters</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.email.$model" :state="!$v.personalForm.email.$error" />
                        <b-form-invalid-feedback v-if="!$v.personalForm.email.required">Please enter your email address</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.personalForm.email.email">Please enter a valid email address</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.personalForm.email.minLength">Your email must be minimum 4 characters</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
                        <b-form-input type="password" v-model="$v.personalForm.password.$model" :state="!$v.personalForm.password.$error" />
                        <b-form-invalid-feedback v-if="!$v.personalForm.password.required">Please enter password</b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.personalForm.password.minLength || !$v.personalForm.password.maxLength">Your password must be between 4 and 16 characters</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group label="Phone" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.phone.$model" />
                    </b-form-group>

                    <b-form-group label="Title" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.title.$model" />
                    </b-form-group>

                    <b-form-group label="Headline" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.headline.$model" />
                    </b-form-group>

                    <b-form-group label="Department" class="has-float-label mb-4">
                        <b-form-input type="text" v-model="$v.personalForm.department.$model" />
                    </b-form-group>

                    <!--b-form-select
                      v-model="$v.personalForm.role.$model"
                      :options="roles"
                      class="mb-3"
                      value-field="value"
                      text-field="name"
                      v-on:change="onChangeRole($event)"
                    ></!--b-form-select-->

                  </tab-content>

                  <tab-content title="Additional Info" :before-change="validateAdditionalData">
                    <div class="form-group has-float-label">
                        <input-tag v-model="$v.additionalForm.skills.$model"></input-tag>
                        <span>Skills</span>
                        <div :class="{'invalid-feedback':true ,'d-block':$v.additionalForm.skills.$error && !$v.additionalForm.skills.required}">At least one tag is required</div>
                        <div :class="{'invalid-feedback':true ,'d-block':$v.additionalForm.skills.$error && !$v.additionalForm.skills.minLength}">Pick at least 3 skills</div>
                    </div>

                  </tab-content>

                  <tab-content title="Last step">
                    Thanks for your information!
                  </tab-content>

                  <b-button slot="prev" variant="primary" size="lg" :class="{'btn-multiple-state btn-shadow': true}">
                    <span class="label">Prev</span>
                  </b-button>
                  <b-button slot="next" variant="primary" size="lg" :class="{'btn-multiple-state btn-shadow': true}">
                    <span class="label">Next</span>
                  </b-button>

                  <b-button slot="finish" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true}">
                      <span class="label">{{ $t('user.register-button') }}</span>
                  </b-button>
                </form-wizard>
              </b-form>

        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>

import {
    mapGetters,
    mapActions
} from "vuex";

import {
    validationMixin
} from "vuelidate";

import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import InputTag from '../../components/Form/InputTag'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

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
      'input-tag': InputTag,
      'v-select': vSelect,
      'form-wizard': FormWizard,
      'tab-content': TabContent,
  },
  data () {
    return {
        personalForm: {
          first_name: "guo",
          last_name: "youlie",
          email: 'wang@candio.io',
          password: "password",
          phone: "",
          title: "",
          headline: '',
          department: '',
          role: 1,
        },

        additionalForm: {
            skills: [],
        },

        roles: [
          {
            value: 1,
            name: "Candidate"
          },
          {
            value: 2,
            name: "Company"
          },
          {
            value: 3,
            name: "Administrator"
          },
          {
            value: 4,
            name: "Super Administrator"
          }
        ]
    };
  },
  mixins: [validationMixin],
  computed: {
      ...mapGetters(["currentUser", "processing", "loginError",])
  },
  validations: {
      personalForm: {
        first_name: {
          required,
          minLength: minLength(2)
        },
        last_name: {
          required,
          minLength: minLength(2)
        },
        email: {
          required,
          email,
          minLength: minLength(4)
        },
        password: {
          required,
          maxLength: maxLength(16),
          minLength: minLength(4)
        },
        phone: {},
        title: {},
        headline: {},
        department: {},
        role: {},
      },
      additionalForm: {
          skills: {
              required,
              minLength: minLength(3),
          },
      },
  },

  methods: {
    ...mapActions(["register", "setPersonalData", "setSkillData"]),
    formSubmit() {
      var self = this;

      this.register(self.currentUser).then(
        function () {
          console.log(self.currentUser.accessToken);
          if (self.currentUser && self.currentUser.accessToken && self.currentUser.accessToken.length > 0) {
              setTimeout(() => {
                  self.$router.push("/");
              }, 200);
          }
        },
        function (err) {
          console.log("ERR : ", err);
        }
      );
    },
    validatePersonalData: function(){
      var self = this;

      this.$v.$touch();

      var params = {
        username: this.personalForm.first_name + ' ' +  this.personalForm.last_name,
        email: this.personalForm.email,
        password: this.personalForm.password,
        phone: this.personalForm.phone,
        title: this.personalForm.title,
        headline: this.personalForm.headline,
        department: this.personalForm.department,
        role: this.personalForm.role,
      };

      this.$v.personalForm.$touch();

      if (!this.$v.personalForm.$anyError) {

          this.setPersonalData(params);

          return true;
      } else {
          return false;
      }
    },

    validateAdditionalData: function(){
      var self = this;

      this.$v.$touch();
      this.$v.additionalForm.$touch();

      if (!this.$v.additionalForm.$anyError) {

          var params = {
            skill: this.additionalForm.skills.join('-')
          };

          this.setSkillData(params);

          return true;
      } else {
          return false;
      }
    },

    onChangeRole(e) {
      console.log(e);
    }
  },

  watch: {
      currentUser(val) {
          if (val && val.uid && val.uid.length > 0) {
              setTimeout(() => {
                  this.$router.push("/");
              }, 200);
          }
      },
      loginError(val) {
          if (val != null) {
              this.$notify("error", "Login Error", val, {
                  duration: 3000,
                  permanent: false
              });

          }
      }
  },
}
</script>
