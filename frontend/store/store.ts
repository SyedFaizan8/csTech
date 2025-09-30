import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import authReducer from '@/store/slices/authSlice'
import agentsReducer from '@/store/slices/agentsSlice'
import uploadReducer from '@/store/slices/uploadSlice'
import toastsReducer from '@/store/slices/notificationsSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        agents: agentsReducer,
        upload: uploadReducer,
        toasts: toastsReducer
    },
    middleware: (g) => g({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
