<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" md="10" class="mx-auto my-auto">
              <b-card class="auth-card" no-body>
                <div class="position-relative image-side ">
                  <p class=" text-white h2">Welcome Candio!</p>
                  <p class="white mb-0">Please login with your credential!</p>
                </div>
                <div class="form-side">
                  <router-link tag="a" to="/">
                    <span class="logo-single" />
                  </router-link>
                  <h6 class="mb-4">Candio Landing Page</h6>

                  <div class="d-flex justify-content-center align-items-center">
                    <b-button variant="primary" size="lg" class="btn-shadow" @click="goLogin">
                        <span class="label">{{ $t('user.login-button') }}</span>
                    </b-button>
                  </div>
                  <br />

                  <div class="d-flex justify-content-center align-items-center">
                    <b-button variant="primary" size="lg" class="btn-shadow" @click="goRegisterCandidate">
                        <span class="label">Register As Candidate</span>
                    </b-button>
                  </div>
                  <br />

                  <div class="d-flex justify-content-center align-items-center">
                    <b-button variant="primary" size="lg" class="btn-shadow" @click="goRegisterCompany">
                        <span class="label">Register As Company</span>
                    </b-button>
                  </div>


                </div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.push("/");
    },
    goLogin() {
      this.$router.push("/user/login");
    },
    goRegisterCandidate() {
      this.$router.push("/user/regcandidate");
    },
    goRegisterCompany() {
      this.$router.push("/user/regCompany");
    },

  },
  mounted: function() {
    document.body.classList.add("background");
  },
  beforeDestroy() {
    document.body.classList.remove("background");
  }
};
</script>
