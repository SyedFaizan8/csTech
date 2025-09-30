import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'

export type Agent = { id: string; name: string; email: string; phone: string }

export const fetchAgents = createAsyncThunk('agents/fetch', async () => {
    const r = await api.get('/api/agents')
    return r.data.agents as Agent[]
})
export const createAgent = createAsyncThunk('agents/create', async (payload: { name: string; email: string; phone: string; password: string }) => {
    const r = await api.post('/api/agents', payload)
    return r.data.agent as Agent
})

const slice = createSlice({
    name: 'agents',
    initialState: { items: [] as Agent[], loading: false, error: null as string | null },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchAgents.pending, s => { s.loading = true })
        b.addCase(fetchAgents.fulfilled, (s, a: PayloadAction<Agent[]>) => { s.loading = false; s.items = a.payload })
        b.addCase(fetchAgents.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Failed' })

        b.addCase(createAgent.fulfilled, (s, a: PayloadAction<Agent>) => { s.items.unshift(a.payload) })
    }
})

export default slice.reducer
