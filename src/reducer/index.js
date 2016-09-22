import createReducer from '../library/createReducer';

import IndexConstant from '../constant/index';

const initialState = {
    welcome: '',
};

export const IndexState = createReducer(initialState, {
    [IndexConstant.SET_WELCOME]: (state, action) => {
        return Object.assign({}, state, {
            welcome: action.welcome
        });
    },
});
