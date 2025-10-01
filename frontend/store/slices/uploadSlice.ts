// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import api from '@/lib/api'

// export const uploadFile = createAsyncThunk('upload/file', async ({ file }: { file: File }, thunkAPI) => {
//     const fd = new FormData()
//     fd.append('file', file)
//     const res = await api.post('/api/upload', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (e) => {
//             if (e.total) {
//                 const pct = Math.round((e.loaded / e.total) * 100)
//                 thunkAPI.dispatch(setProgress(pct))
//             }
//         }
//     })
//     return res.data
// })

// const slice = createSlice({
//     name: 'upload',
//     initialState: { uploading: false, progress: 0, error: null as string | null, lastResult: null as any },
//     reducers: {
//         setProgress(state, action: PayloadAction<number>) { state.progress = action.payload },
//         reset(state) { state.uploading = false; state.progress = 0; state.error = null; state.lastResult = null }
//     },
//     extraReducers: (b) => {
//         b.addCase(uploadFile.pending, s => { s.uploading = true; s.error = null; s.progress = 0 })
//         b.addCase(uploadFile.fulfilled, (s, a) => { s.uploading = false; s.lastResult = a.payload; s.progress = 100 })
//         b.addCase(uploadFile.rejected, (s, a) => { s.uploading = false; s.error = a.error.message ?? 'Upload failed' })
//     }
// })

// export const { setProgress, reset } = slice.actions
// export default slice.reducer

// frontend/store/slices/uploadSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'
import type { AxiosError } from 'axios'

type UploadState = {
    uploading: boolean
    progress: number
    error: string | null
    lastResult: any | null
}

export const uploadFile = createAsyncThunk<any, { file: File }, { rejectValue: string }>(
    'upload/file',
    async ({ file }, thunkAPI) => {
        const fd = new FormData()
        fd.append('file', file)

        try {
            const res = await api.post('/api/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    if (e.total) {
                        const pct = Math.round((e.loaded / e.total) * 100)
                        thunkAPI.dispatch(setProgress(pct))
                    }
                },
            })
            return res.data
        } catch (err) {
            const error = err as AxiosError<any>
            // Prefer server-provided message if present
            const serverMessage =
                (error.response && (error.response.data?.message ?? error.response.data?.error)) ?? null
            const message = (serverMessage as string) ?? error.message ?? 'Upload failed'
            // pass the message as the rejected payload so reducer can read it via action.payload
            return thunkAPI.rejectWithValue(String(message))
        }
    }
)

const initialState: UploadState = {
    uploading: false,
    progress: 0,
    error: null,
    lastResult: null,
}

const slice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setProgress(state, action: PayloadAction<number>) {
            state.progress = action.payload
        },
        reset(state) {
            state.uploading = false
            state.progress = 0
            state.error = null
            state.lastResult = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadFile.pending, (s) => {
                s.uploading = true
                s.error = null
                s.progress = 0
            })
            .addCase(uploadFile.fulfilled, (s, a) => {
                s.uploading = false
                s.lastResult = a.payload
                s.progress = 100
            })
            .addCase(uploadFile.rejected, (s, a) => {
                s.uploading = false
                // action.payload is the value passed to rejectWithValue (preferred)
                s.error = (a.payload as string) ?? a.error?.message ?? 'Upload failed'
            })
    },
})

export const { setProgress, reset } = slice.actions
export default slice.reducer
