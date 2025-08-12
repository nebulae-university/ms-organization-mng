import * as Actions from '../actions';

const initialState = {
    data: [],
    errors: {},
    totalDataCount: 0,
    page: 0,
    rowsPerPage: 10,
    order: {
        direction: 'asc',
        id: null
    },
    filters: {
        name: '',
        active: true,
        organizationId: undefined,
        company: undefined,
        role: undefined
    }
};

const usersReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_USERS:
            {
                const { listing, queryTotalResultCount } = action.payload;
                return {
                    ...state,
                    data: listing,
                    errors: {},
                    totalDataCount: queryTotalResultCount != null ? queryTotalResultCount : (listing || []).length > 0 ? state.totalDataCount : 0,
                };
            }
        case Actions.SET_USERS_PAGE:
            {
                return {
                    ...state,
                    page: action.page
                };
            }
        case Actions.SET_USERS_ROWS_PER_PAGE:
            {
                return {
                    ...state,
                    rowsPerPage: action.rowsPerPage,
                    page: 0
                };
            }
        case Actions.SET_USERS_ORDER:
            {
                return {
                    ...state,
                    order: action.order
                };
            }
        case Actions.SET_USERS_GET_ERROR:
            {
                return {
                    ...state,
                    errors: action.payload,
                    data: [],
                    totalDataCount: 0,
                };
            }
        case Actions.SET_USERS_FILTERS_ORGANIZATION_ID:
            {
                return {
                    ...state,
                    filters: { ...state.filters, organizationId: action.organizationId }
                };
            }
        case Actions.SET_USERS_FILTERS_NAME:
            {
                return {
                    ...state,
                    filters: { ...state.filters, name: action.name },
                    page: 0
                };
            }
        case Actions.SET_USERS_FILTERS_ACTIVE:
            {
                return {
                    ...state,
                    filters: { ...state.filters, active: action.active },
                    page: 0
                };
            }
        case Actions.SET_USERS_FILTERS_COMPANY:
            {
                return {
                    ...state,
                    filters: { ...state.filters, company: action.company },
                    page: 0
                };
            }
        case Actions.SET_USERS_FILTERS_ROLE:
            {
                return {
                    ...state,
                    filters: { ...state.filters, role: action.role },
                    page: 0
                }
            }

        default:
            {
                return state;
            }
    }
};

export default usersReducer;
