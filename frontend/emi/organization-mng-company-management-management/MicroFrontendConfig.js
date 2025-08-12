import React from 'react';
import { Redirect } from 'react-router-dom';
import i18n from './i18n'

const auth = ["COMPANY_READ"];

export const MicroFrontendConfig = {
    settings: {
        layout: {}
    },
    auth,
    routes: [
        { 
            path: '/company-mng/companies/:companyId/:companyHandle?',
            component: React.lazy(() => import('./company/Company'))
        },
        {
            path: '/company-mng/companies',
            component: React.lazy(() => import('./companies/Companies'))
        },
        {
            path: '/company-mng',
            component: () => <Redirect to="/company-mng/companies" />
        }
    ],
    navigationConfig: [
        { 
            'id': 'organization-mng',
            'type': 'group',
            'icon': 'manage_accounts',
            'priority': 14000,
            children: [{
                'id': 'organization-mng-company-management-management',
                'type': 'item',
                'icon': 'business',
                'url': '/company-mng',
                'priority': 9000,
                auth
            }]
        }
    ],
    i18nLocales: i18n.locales
};

