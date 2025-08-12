import React, {useRef} from 'react';
import {FusePageCarded} from '@fuse';
import withReducer from 'app/store/withReducer';
import OrganizationsTable from './OrganizationsTable';
import OrganizationsHeader from './OrganizationsHeader';
import OrganizationsFilterContent from './OrganizationsFilterContent';
import OrganizationsFilterHeader from './OrganizationsFilterHeader';
import reducer from '../store/reducers';
  
function Organizations()
{
    const pageLayout = useRef(null);

    return (
        <FusePageCarded
            classes={{
                content: "flex",
                header : "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                <OrganizationsHeader pageLayout={pageLayout} />
            }
            content={
                <OrganizationsTable/>
            }
            leftSidebarHeader={
                <OrganizationsFilterHeader/>
            }
            leftSidebarContent={
                <OrganizationsFilterContent/>
            }
            ref={pageLayout}
            innerScroll
        />
    );
}

export default withReducer('OrganizationManagement', reducer)(Organizations);
