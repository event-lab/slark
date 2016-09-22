import IndexConstant from '../constant/index';

const IndexAction = {
    setWelcome: welcome => {
        return dispatch => {
            dispatch({
                welcome,
                type: IndexConstant.SET_WELCOME,
            });
        };
    },
};

export default IndexAction;