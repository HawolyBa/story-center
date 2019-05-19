const isEmpty = (str) => {
  if (str.trim() === '') return true
  else return false
}

const isEmail = (email) => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true
  else return false
}

const validateWebsites = (data) => {
  if (isEmpty(data)) return data
  if (data.trim().substring(0, 4) !== 'http') {
    return`http://${data.trim()}`
  } else return data
}

export const validateSignUpData = (data, usernames) => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isEmpty(data.password)) {
    errors.password = 'Must not be empty'
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords must match'
  }

  if (isEmpty(data.username)) {
    errors.username = 'Must not be empty'
  }

  if (usernames.includes(data.username)) {
    errors.username = 'Username already taken'
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true: false
  }
}

export const validateLoginData = data => {
  let errors = {}

  if (isEmpty(data.email)) {
    errors.email = 'Must not be empty'
  } else if (!isEmail(data.email)) {
    errors.email = 'Must be a valid email address'
  }

  if (isEmpty(data.password)) errors.password = 'Must not be empty'
  
  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true: false
  }
}

export const reduceUserDetails = (data) => {
  let userDetails = {}

  if (data.biography) {
    if (!isEmpty(data.biography.trim())) userDetails.biography = data.biography
  }
  if (data.twitter) userDetails.twitter = validateWebsites(data.twitter)
  if (data.instagram) userDetails.instagram = validateWebsites(data.instagram)
  if (data.facebook) userDetails.facebook = validateWebsites(data.facebook)
  if (data.hasOwnProperty('nightMode')) userDetails.nightMode = data.nightMode
  if (data.hasOwnProperty('username')) userDetails.username = data.username

  return userDetails
}

export const isPostValid = data => {

  let errors = {}
  if (isEmpty(data.title)) errors.title = 'Must not be empty'
  if (isEmpty(data.category)) errors.category = 'Must not be empty'
  if (isEmpty(data.status)) errors.status = 'Must not be empty'
  if (isEmpty(data.language)) errors.language = 'Must not be empty'
  if (isEmpty(data.copyright)) errors.copyright = 'Must not be empty'
  if (data.banner && isEmpty(data.imageCopyright)) errors.imageCopyright = 'Must not be empty'

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true: false
  }
}

// exports.isLocationValid = data => {
//   let errors = {}
//   if(isEmpty(data.name)) errors.name = "Must not be empty"
//   if(isEmpty(data.storyId)) errors.storyId = "Must not be empty"

//   return {
//     errors,
//     valid: Object.keys(errors).length === 0 ? true: false
//   }
// }