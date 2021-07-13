<template>

<nav class="navbar fixed-top candio-top-bar">
    <div>
      <b-navbar fixed="top" toggleable="lg" type="light" variant="white">
        <b-navbar-brand href="/">
          <router-link class="navbar-logo" tag="a" to="/">
              <span class="logo d-none d-xs-block"></span>
              <span class="logo-mobile d-block d-xs-none"></span>
          </router-link>
        </b-navbar-brand>

        <b-navbar-toggle target="mobile-popup-menu"></b-navbar-toggle>

        <b-collapse id="top-main-menu" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-for="(item, index) in candidateMenu" :class="{ 'active' : (selectedParentMenu === item.id && viewingParentMenu === '') || viewingParentMenu === item.id }" :key="`parent_${item.id}`" :data-flag="item.id">
                <a v-if="item.newWindow" :href="item.to" rel="noopener noreferrer" target="_blank">
                    <i :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
                <a v-else-if="item.subs && item.subs.length>0" @click.prevent="openSubMenu($event,item)" :href="`#${item.to}`">
                  <i :class="item.icon" />
                    <span>{{ item.label }}</span>
                </a>
                <router-link v-else @click.native="changeSelectedParentHasNoSubmenu(item.id)" :to="item.to">
                  <i :class="item.icon" />
                    <span>{{ item.label }}</span>
                </router-link>
            </b-nav-item>

          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                  <span class="name mr-1">{{currentUser.username}}</span>
                  <span>
                      <img :alt="currentUser.title" :src="currentUser.img" />
                  </span>
              </template>

              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item href="#">Role : {{currentUser.role}}</b-dropdown-item>
              <b-dropdown-item @click="logout">Sign out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>

      <!-- Mobile Menu -->
      <b-collapse  id="mobile-popup-menu">
        <b-navbar-nav>
          <b-nav-item v-for="(item, index) in candidateMenu" class="nav-item px-3 py-2 border-bottom bg-white" :class="{ 'active' : (selectedParentMenu === item.id && viewingParentMenu === '') || viewingParentMenu === item.id }" :key="`parent_${item.id}`" :data-flag="item.id" :href="item.to">
              <span>{{ item.label }}</span>
          </b-nav-item>

          <b-nav-item class="px-3 py-2 border-bottom bg-white" href="#">Profile</b-nav-item>
          <b-nav-item class="px-3 py-2 border-bottom bg-white" @click="logout">Sign out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </div>
</nav>
</template>

<script>
import Switches from 'vue-switches'
import notifications from '../data/notifications'

import {
    mapGetters,
    mapMutations,
    mapActions
} from 'vuex'
import {
    MenuIcon,
    MobileMenuIcon
} from '../components/Svg'
import {
    searchPath,
    menuHiddenBreakpoint,
    localeOptions,
    buyUrl,
    defaultColor
} from '../constants/config'

import candidateMenu from '../constants/candio-menu'

import {
    getDirection,
    setDirection
} from '../utils'
export default {
    components: {
        'menu-icon': MenuIcon,
        'mobile-menu-icon': MobileMenuIcon,
        'switches': Switches
    },
    data() {
        return {
            selectedParentMenu: '',
            searchKeyword: '',
            isMobileSearch: false,
            isSearchOver: false,
            fullScreen: false,
            menuHiddenBreakpoint,
            searchPath,
            localeOptions,
            buyUrl,
            notifications,
            isDarkActive: false,


            isMenuOver: false,
            candidateMenu,
            viewingParentMenu: ''

        }
    },

    mounted() {
        this.selectMenu()
    },

    methods: {
        ...mapMutations(['changeSideMenuStatus', 'changeSideMenuForMobile']),
        ...mapActions(['setLang', 'signOut']),

        selectMenu() {
            const currentParentUrl = this.$route.path.split('/').filter(x => x !== '')[1]

            if (currentParentUrl !== undefined || currentParentUrl !== null) {
                this.selectedParentMenu = currentParentUrl.toLowerCase()
            } else {
                this.selectedParentMenu = 'dashboards'
            }

            console.log('-------------------', this.selectedParentMenu);
        },

        search() {
            this.$router.push(`${this.searchPath}?search=${this.searchKeyword}`)
            this.searchKeyword = ''
        },
        searchClick() {
            if (window.innerWidth < this.menuHiddenBreakpoint) {
                if (!this.isMobileSearch) {
                    this.isMobileSearch = true
                } else {
                    this.search()
                    this.isMobileSearch = false
                }
            } else {
                this.search()
            }
        },
        handleDocumentforMobileSearch() {
            if (!this.isSearchOver) {
                this.isMobileSearch = false
                this.searchKeyword = ''
            }
        },

        changeLocale(locale, direction) {
            const currentDirection = getDirection().direction
            if (direction !== currentDirection) {
                setDirection(direction)
            }

            this.setLang(locale)
        },
        logout() {
            this.signOut().then(() => {
                this.$router.push('/user/login')
            })
        },

        toggleFullScreen() {
            const isInFullScreen = this.isInFullScreen()

            var docElm = document.documentElement
            if (!isInFullScreen) {
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen()
                } else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen()
                } else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen()
                } else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            }
            this.fullScreen = !isInFullScreen
        },
        getThemeColor() {
            return localStorage.getItem('themeColor') ?
                localStorage.getItem('themeColor') :
                defaultColor
        },
        isInFullScreen() {
            return (
                (document.fullscreenElement && document.fullscreenElement !== null) ||
                (document.webkitFullscreenElement &&
                    document.webkitFullscreenElement !== null) ||
                (document.mozFullScreenElement &&
                    document.mozFullScreenElement !== null) ||
                (document.msFullscreenElement && document.msFullscreenElement !== null)
            )
        }
    },
    computed: {
        ...mapGetters({
            currentUser: 'currentUser',
            menuType: 'getMenuType',
            menuClickCount: 'getMenuClickCount',
            selectedMenuHasSubItems: 'getSelectedMenuHasSubItems'
        })
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleDocumentforMobileSearch)
    },
    created() {
        const color = this.getThemeColor()
        this.isDarkActive = color.indexOf('dark') > -1
    },
    watch: {
        '$i18n.locale'(to, from) {
            if (from !== to) {
                this.$router.go(this.$route.path)
            }
        },
        isDarkActive(val) {
            let color = this.getThemeColor()
            let isChange = false
            if (val && color.indexOf('light') > -1) {
                isChange = true
                color = color.replace('light', 'dark')
            } else if (!val && color.indexOf('dark') > -1) {
                isChange = true
                color = color.replace('dark', 'light')
            }
            if (isChange) {
                localStorage.setItem('themeColor', color)
                setTimeout(() => {
                    window.location.reload()
                }, 500)
            }
        },
        isMobileSearch(val) {
            if (val) {
                document.addEventListener('click', this.handleDocumentforMobileSearch)
            } else {
                document.removeEventListener(
                    'click',
                    this.handleDocumentforMobileSearch
                )
            }
        }
    }
}
</script>
