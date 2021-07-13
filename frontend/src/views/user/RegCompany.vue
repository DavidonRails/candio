<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>

          <div class="position-relative image-side ">
            <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
              <p class="white mb-0">
                Please use this form to register as Company.
                <br />
                <br />
                If you are a member, please
                <router-link tag="a" to="/user/login" class="color-theme-1">login</router-link>.

                <br />
                <br />
                If you own your company, please
                <router-link tag="a" to="/user/regcandidate" class="color-theme-1">register as candidate</router-link>

              </p>
          </div>

          <div class="form-side">

            <router-link tag="a" to="/"><span class="logo-single"/></router-link>

            <h6 class="mb-4">Company Registration</h6>

            <b-form class="av-tooltip tooltip-label-bottom">
              <form-wizard color="#F26A21" @on-complete="formSubmit" title="" subtitle="">
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

                <tab-content title="Company Info">

                  <b-form-group label="Company Name" class="has-float-label mb-4">
                      <b-form-input type="text" v-model.trim="$v.additionalForm.name.$model" :state="!$v.additionalForm.name.$error"  />
                      <b-form-invalid-feedback v-if="!$v.additionalForm.name.required">Please enter company name</b-form-invalid-feedback>
                      <b-form-invalid-feedback v-else-if="!$v.additionalForm.name.minLength">Company name must be minimum 3 characters</b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group label="Street" class="has-float-label mb-4">
                      <b-form-input type="text" v-model.trim="$v.additionalForm.street.$model" />
                  </b-form-group>

                  <b-form-group label="City" class="has-float-label mb-4">
                      <b-form-input type="text" v-model.trim="$v.additionalForm.city.$model" />
                  </b-form-group>

                  <b-form-group label="State" class="has-float-label mb-4">
                      <b-form-input type="text" v-model.trim="$v.additionalForm.state.$model" />
                  </b-form-group>

                  <b-form-group label="EIN" class="has-float-label mb-4">
                      <b-form-input type="text" v-model.trim="$v.additionalForm.ein.$model" />
                  </b-form-group>

                  <b-form-group label="Description" class="has-float-label mb-4">
                      <b-textarea v-model.trim="$v.additionalForm.description.$model"></b-textarea>
                  </b-form-group>

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

            <br />

            <div class="d-flex justify-content-end align-items-center">
                <div class="d-flex justify-content-end align-items-center">
                    <div class="google-btn" @click="goGoogleSignup()">
                      <div class="google-icon-wrapper">
                        <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                      </div>
                      <p class="btn-text"><b>Sign up with google</b></p>
                    </div>
                </div>
            </div>


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

import { roles } from '../../constants/config'

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
          role: roles.ORG_ADMIN,
        },

        additionalForm: {
            name: "Exqsd Company",
            street: "",
            city: "",
            state: "",
            postal: "",
            ein: "",
            description: ""
        },

    };
  },
  mixins: [validationMixin],
  computed: {
      ...mapGetters(["currentUser", "processing", "loginError", "fbProvider" ])
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
          name: {
              required,
              minLength: minLength(3),
          },
          street: {},
          city: {},
          state: {},
          postal: {},
          ein: {},
          description: {}
      },
  },

  methods: {
    ...mapActions(["register", "setPersonalData", "setCompanyData", "googleSignup", ]),
    formSubmit() {
      var self = this;

      this.$v.$touch();
      this.$v.additionalForm.$touch();

      if (!this.$v.additionalForm.$anyError) {

          var params = {
            name: this.additionalForm.name,
            street: this.additionalForm.street,
            city: this.additionalForm.city,
            state: this.additionalForm.state,
            postal: this.additionalForm.postal,
            ein: this.additionalForm.ein,
            description: this.additionalForm.description
          };

          this.setCompanyData(params);

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


      }
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

    goGoogleSignup() {
      var self = this;

      this.googleSignup(this.fbProvider).then(
        (res) => {
          res.role = this.personalForm.role;
          console.log(res);

          self.register(res).then(() => {
              if (self.currentUser && self.currentUser.accessToken && self.currentUser.accessToken.length > 0) {
                  setTimeout(() => {
                      self.$router.push("/company/dashboards");
                  }, 200);
              }
          });

        },
        (err) => {
          console.log("ERR : ", err);
        }
      );

    },


    onChangeRole(e) {
      console.log(e);
    }
  },

  watch: {
      currentUser(val) {
          // if (val && val.uid && val.uid.length > 0) {
          //     setTimeout(() => {
          //         this.$router.push("/company/dashboards");
          //     }, 200);
          // }
      },
      loginError(val) {
          if (val != null) {
              this.$notify("error", "Register Error", val, {
                  duration: 10000,
                  permanent: false
              });

          }
      }
  },
}
</script>
