import {combineReducers} from 'redux';
import companies from './Companies.reducer';

const reducer = combineReducers({
    companies,
});

export default reducer;
