import { configureStore } from '@reduxjs/toolkit';
import testStore from '@/stores/testStore'; // 更新为你的 slice 路径

const store = configureStore({
    reducer: {
        test: testStore.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
