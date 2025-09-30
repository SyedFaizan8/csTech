import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string }
const slice = createSlice({
    name: 'toasts',
    initialState: [] as Toast[],
    reducers: {
        push(state, action: PayloadAction<Toast>) { state.push(action.payload) },
        remove(state, action: PayloadAction<string>) { return state.filter(t => t.id !== action.payload) }
    }
})

export const { push, remove } = slice.actions
export default slice.reducer
