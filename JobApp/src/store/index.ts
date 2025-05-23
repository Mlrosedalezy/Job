import {configureStore} from '@reduxjs/toolkit'
import reducer from './reducer'

const store = configureStore({
    reducer: {
        counter:reducer
    }
})

export default store