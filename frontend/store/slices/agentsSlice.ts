import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '../../lib/api'

export type Agent = { id: string; name: string; email: string; phone: string }

type AgentsState = {
    items: Agent[]
    loading: boolean
    error: string | null
}

const initialState: AgentsState = {
    items: [],
    loading: false,
    error: null
}

/** Fetch all agents */
export const fetchAgents = createAsyncThunk<Agent[]>(
    'agents/fetch',
    async (_, thunkAPI) => {
        const res = await api.get('/api/agents')
        // backend returns { ok:true, agents: Agent[] }
        return res.data.agents as Agent[]
    }
)

/** Create agent */
export const createAgent = createAsyncThunk<Agent, { name: string; email: string; phone: string; password: string }>(
    'agents/create',
    async (payload, thunkAPI) => {
        const res = await api.post('/api/agents', payload)
        return res.data.agent as Agent
    }
)

/** Delete agent */
export const deleteAgent = createAsyncThunk<string, string>(
    'agents/delete',
    async (agentId, thunkAPI) => {
        await api.delete(`/api/agents/${agentId}`)
        // return the id so reducers can remove it
        return agentId
    }
)

const agentsSlice = createSlice({
    name: 'agents',
    initialState,
    reducers: {
        // local reducers if needed
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchAgents.pending, (s) => { s.loading = true; s.error = null })
            .addCase(fetchAgents.fulfilled, (s, a: PayloadAction<Agent[]>) => { s.loading = false; s.items = a.payload })
            .addCase(fetchAgents.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Failed to load agents' })

            // create
            .addCase(createAgent.pending, (s) => { s.error = null })
            .addCase(createAgent.fulfilled, (s, a: PayloadAction<Agent>) => { s.items.unshift(a.payload) })
            .addCase(createAgent.rejected, (s, a) => { s.error = a.error.message ?? 'Failed to create agent' })

            // delete
            .addCase(deleteAgent.pending, (s) => { s.loading = true; s.error = null })
            .addCase(deleteAgent.fulfilled, (s, a: PayloadAction<string>) => {
                s.loading = false
                s.items = s.items.filter(it => it.id !== a.payload)
            })
            .addCase(deleteAgent.rejected, (s, a) => { s.loading = false; s.error = a.error.message ?? 'Failed to delete agent' })
    }
})

export default agentsSlice.reducer
