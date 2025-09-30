import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '@/lib/api'

export const getCurrentUser = createAsyncThunk('auth/me', async () => {
    const r = await api.get('/api/auth/me')
    return r.data.user
})

const slice = createSlice({
    name: 'auth',
    initialState: { user: null as any | null, loading: false },
    reducers: { logout(state) { state.user = null } },
    extraReducers: (b) => {
        b.addCase(getCurrentUser.pending, s => { s.loading = true })
        b.addCase(getCurrentUser.fulfilled, (s, a) => { s.user = a.payload; s.loading = false })
        b.addCase(getCurrentUser.rejected, s => { s.user = null; s.loading = false })
    }
})

export const { logout } = slice.actions
export default slice.reducer
