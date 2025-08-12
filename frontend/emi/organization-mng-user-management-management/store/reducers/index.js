import {combineReducers} from 'redux';
import users from './Users.reducer';

const reducer = combineReducers({
    users,
});

export default reducer;
