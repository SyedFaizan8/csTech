import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import api from '@/lib/api'

export const uploadFile = createAsyncThunk('upload/file', async ({ file }: { file: File }, thunkAPI) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (e.total) {
                const pct = Math.round((e.loaded / e.total) * 100)
                thunkAPI.dispatch(setProgress(pct))
            }
        }
    })
    return res.data
})

const slice = createSlice({
    name: 'upload',
    initialState: { uploading: false, progress: 0, error: null as string | null, lastResult: null as any },
    reducers: {
        setProgress(state, action: PayloadAction<number>) { state.progress = action.payload },
        reset(state) { state.uploading = false; state.progress = 0; state.error = null; state.lastResult = null }
    },
    extraReducers: (b) => {
        b.addCase(uploadFile.pending, s => { s.uploading = true; s.error = null; s.progress = 0 })
        b.addCase(uploadFile.fulfilled, (s, a) => { s.uploading = false; s.lastResult = a.payload; s.progress = 100 })
        b.addCase(uploadFile.rejected, (s, a) => { s.uploading = false; s.error = a.error.message ?? 'Upload failed' })
    }
})

export const { setProgress, reset } = slice.actions
export default slice.reducer
