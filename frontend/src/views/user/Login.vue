<template>
<div class="loginView">
  <b-row class="h-100">
      <b-colxx xxs="12" md="10" class="mx-auto my-auto">
          <b-card class="auth-card" no-body>
              <div class="position-relative image-side">
                  <p class="text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
                  <p class="white mb-0">

                      Please use your credentials to login.
                      <br />
                      <br />
                      <br />

                      If you are not a member, please
                      <router-link tag="a" to="/user/regcandidate" class="color-theme-1 btn_link">
                          Register AS Candidate
                      </router-link>

                      <br />
                      <br />
                      <br />


                      If you own your company, please
                      <router-link tag="a" to="/user/regcompany" class="color-theme-1 btn_link">
                          Register AS Company
                      </router-link>

                  </p>
              </div>
              <div class="form-side">
                  <router-link tag="a" to="/">
                      <span class="logo-single" />
                  </router-link>
                  <h6 class="mb-4">{{ $t('user.login-title')}}</h6>

                  <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                      <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
                          <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" />
                          <b-form-invalid-feedback v-if="!$v.form.email.required">Please enter your email address</b-form-invalid-feedback>
                          <b-form-invalid-feedback v-else-if="!$v.form.email.email">Please enter a valid email address</b-form-invalid-feedback>
                          <b-form-invalid-feedback v-else-if="!$v.form.email.minLength">Your email must be minimum 4 characters</b-form-invalid-feedback>
                      </b-form-group>

                      <b-form-group :label="$t('user.password')" class="has-float-label mb-4">
                          <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error" />
                          <b-form-invalid-feedback v-if="!$v.form.password.required">Please enter your password</b-form-invalid-feedback>
                          <b-form-invalid-feedback v-else-if="!$v.form.password.minLength || !$v.form.password.maxLength">Your password must be between 4 and 16 characters</b-form-invalid-feedback>
                      </b-form-group>
                      <div class="d-flex justify-content-between align-items-center">
                          <router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>

                          <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                            'show-spinner': processing,
                            'show-success': !processing && loginError===false,
                            'show-fail': !processing && loginError }">
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
                              <span class="label">{{ $t('user.login-button') }}</span>
                          </b-button>


                          <div class="google-btn" @click="goGoogleSignin()">
                            <div class="google-icon-wrapper">
                              <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                            </div>
                            <p class="btn-text"><b>Sign in with google</b></p>
                          </div>

                      </div>

                  </b-form>
              </div>
          </b-card>
      </b-colxx>
  </b-row>
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

import { roles } from "../../constants/config";

const {
    required,
    maxLength,
    minLength,
    email
} = require("vuelidate/lib/validators");

export default {
    data() {
        return {
            form: {
                // Candidate
                // email: "wwang@candio.com",
                // password: "password"

                // Company
                email: "dev@exqsd.com",
                password: "password"

            },
        };
    },
    mixins: [validationMixin],
    validations: {
        form: {
            password: {
                required,
                maxLength: maxLength(16),
                minLength: minLength(4)
            },
            email: {
                required,
                email,
                minLength: minLength(4)
            }
        }
    },
    computed: {
        ...mapGetters(["currentUser", "processing", "loginError", "fbProvider"])
    },
    methods: {
        ...mapActions(["login", "googleSignin", ]),
        formSubmit() {
            var self = this;
            this.$v.$touch();
            var params = {
              email: this.form.email,
              password: this.form.password
            };

            this.$v.form.$touch();
            if (!this.$v.form.$anyError) {
              this.login(params).then(
                (res) => {

                  if (self.currentUser && self.currentUser.accessToken && self.currentUser.accessToken.length > 0) {
                    if(self.currentUser.role == roles.CANDIDATE) {
                        if(self.currentUser.completed) {
                          self.$router.push("/candidate/dashboards");
                        } else {
                          self.$router.push("/user/welcome");
                        }

                    }
                    else {
                      self.$router.push("/company/dashboards");
                    }
                  }
                },

                (err) => {
                  console.log("ERR : ", err);
                }
              );
            }
        },

        goGoogleSignin() {
            var self = this;

            this.googleSignin(this.fbProvider).then(
              (res) => {
                console.log(res);

                self.login(res).then(() => {
                    if (self.currentUser && self.currentUser.accessToken && self.currentUser.accessToken.length > 0) {
                      if(self.currentUser.role == roles.CANDIDATE) {
                          if(self.currentUser.completed) {
                            self.$router.push("/candidate/dashboards");
                          } else {
                            self.$router.push("/user/welcome");
                          }

                      }
                      else {
                        self.$router.push("/company/dashboards");
                      }
                    }
                });

              },
              (err) => {
                console.log("ERR : ", err);
              }
            );
        },
    },
    watch: {
        currentUser(val) {

            var self = this;

            // if (val && val.uid && val.uid.length > 0) {
            //     setTimeout(() => {
            //       if(val.role == roles.CANDIDATE) self.$router.push("/candidate/dashboards");
            //       else self.$router.push("/company/dashboards");
            //     }, 200);
            // }
        },
        loginError(val) {
            if (val != null) {
                this.$notify("error", "Login Error", val, {
                    duration: 10000,
                    permanent: false
                });

            }
        }
    },
    mounted () {

    }
};
</script>
