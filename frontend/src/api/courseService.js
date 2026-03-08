import API from './axios'

export const getCourses = (filters = {}) => {
  const params = new URLSearchParams(filters).toString()
  return API.get(`/courses/?${params}`)
}

export const getCourseDetail = (slug) => API.get(`/courses/${slug}/`)