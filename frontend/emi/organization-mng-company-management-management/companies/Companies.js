import React, {useRef} from 'react';
import {FusePageCarded} from '@fuse';
import { useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import CompaniesTable from './CompaniesTable';
import CompaniesHeader from './CompaniesHeader';
import reducer from '../store/reducers';
import {FuseLoading} from '@fuse';

import CompaniesFilterHeader from './CompaniesFilterHeader';
import CompaniesFilterContent from './CompaniesFilterContent';

function Companies()
{
    const user = useSelector(({ auth }) => auth.user);
    const pageLayout = useRef(null);

    
    if(!user.selectedOrganization){
        return (<FuseLoading />);
    }

    return (
        <FusePageCarded
            classes={{
                content: "flex",
                //header : "min-h-72 h-72 sm:h-136 sm:min-h-136" // default tall/short header
                header: "min-h-72 h-72 sm:h-72 sm:min-h-72" // short header always
            }}
            header={
                <CompaniesHeader pageLayout={pageLayout} />
            }
            content={
                <CompaniesTable/>
            }

            leftSidebarHeader={
                <CompaniesFilterHeader/>
            }
            leftSidebarContent={
                <CompaniesFilterContent/>
            }
            ref={pageLayout}
            innerScroll            
        />
    );
}

export default withReducer('CompanyManagement', reducer)(Companies);
