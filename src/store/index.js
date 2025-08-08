import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import usersReducer from './slices/usersSlice'
import projectsReducer from './slices/projectsSlice'
import issuesReducer from './slices/issuesSlice'
import dashboardReducer from './slices/dashboardSlice'
import tasksReducer from './slices/tasksSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    projects: projectsReducer,
    issues: issuesReducer,
    dashboard: dashboardReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store 