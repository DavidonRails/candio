import { isDemo, roles  } from '../constants/config'

export const AuthRequired = (to, from, next) => {

  if (isDemo)
    next()

  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {

    var currentUser = JSON.parse(localStorage.getItem('user'));

    if(currentUser.role == roles.CANDIDATE) next('/candidate')
    else next();

  } else {
    localStorage.removeItem('user')
    next('/home')
  }
}

export const IsAuthed = (to, from, next) => {
  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
    next();
  } else {
    localStorage.removeItem('user')
    next('/home')
  }
}

export default {
  AuthRequired,
  IsAuthed
}
