import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/lib/api'

export const getCurrentUser = createAsyncThunk('auth/me', async () => {
    const r = await api.get('/api/auth/me')
    return r.data.user
})

type AuthState = {
    user: any | null
    loading: boolean
    checked: boolean
}

const initialState: AuthState = { user: null, loading: false, checked: false }

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null
            state.checked = true // mark checked so we don't re-request and cause loops
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrentUser.pending, (s) => { s.loading = true })
            .addCase(getCurrentUser.fulfilled, (s, a) => {
                s.user = a.payload
                s.loading = false
                s.checked = true
            })
            .addCase(getCurrentUser.rejected, (s) => {
                s.user = null
                s.loading = false
                s.checked = true // we tried and it failed — don't keep trying
            })
    }
})

export const { logout } = slice.actions
export default slice.reducer
