export default {
  navigation: {
    'organization-mng': 'OPERATORS MANAGEMENT',
    'organization-mng-user-management-management': 'Users',
  },
  users: {
    newUser: 'New User',
    users: 'Users',
    search: 'Quick search by name, document or email',
    add_new_user: 'ADD NEW',
    add_new_user_short: 'NEW',
    rows_per_page: 'Rows per page:',
    of: 'of',
    remove: 'Remove',
    table_colums: {
      firstName: 'First Name',
      createdAt: 'Created At',
      lastName: 'Last Name',
      emailAddress: 'E-Mail',
      active: 'Active'
    },
    errors: {
      2:'The user does not have the needed roles to execute this command/query'
    },
    remove_dialog_title: "Do you want to delete the selected Users??",
    remove_dialog_description: "This action can not be undone",
    remove_dialog_no: "No",
    remove_dialog_yes: "Yes",
    filters: {
      title: "Filters",
      active: "Active",
      company: "Transport Operator",
      all_company: "All",
      no_company: "Without Operator",
      role: "Role",
      download_file: "Download"
    },
    reportDownloader: {
      questionMsg: "¿In what format do you want to download your report?",
      progress_msg: "We're creating your report",
      close: "Close",
      cancel_and_close: "Cancel and close",
      cancel: "Cancel process",
      fileNamePrefix: "Users_Report",
      headers: {
        "id": "User ID",
        "active": "Active",
        "documentId": "Document ID",
        "firstName": "FirstName",
        "lastName": "Lastname",
        "emailAddress": "Email",
        "phoneNumber": "Phone",
        "lastLoginDate": "Last Login",
        "roles": "Roles",
        "auth_username": "Username",
        "regulatoryCompliance_driverLicenseNumber": "Driver License Number",
        "regulatoryCompliance_driverLicenseCategory": "Driver License Category",
        "regulatoryCompliance_driverLicenseExpeditionDate": "Driver License Expedition Date",
        "regulatoryCompliance_driverLicenseExpirationDate": "Driver License Expiration Date",
        "regulatoryCompliance_mandatoryHealthPlanNumber": "Health Plan Number",
        "regulatoryCompliance_mandatoryHealthPlanIssuer": "Health Plan Issuer",
        "regulatoryCompliance_mandatoryHealthPlanExpeditionDate": "Health Plan Expedition",
        "regulatoryCompliance_mandatoryHealthPlanExpirationDate": "Health Plan Expiration",
        "regulatoryCompliance_occupationalRiskAdministratorNumber": "Occupational Risk Administrator Number",
        "regulatoryCompliance_occupationalRiskAdministratorIssuer": "Occupational Risk Administrator Issuer",
        "regulatoryCompliance_occupationalRiskAdministratorExpeditionDate": "Occupational Risk Administrator Expedition",
        "regulatoryCompliance_occupationalRiskAdministratorExpirationDate": "Occupational Risk Administrator Expiration",

        "companyObj_name": "Company",
        "companyObj_authorityCode": "Authority Code Company",

        "metadata_createdBy": "Created By",
        "metadata_createdAt": "Created At",
        "metadata_updatedBy": "Updated By",
        "metadata_updatedAt": "Updated At"
      },
      values: {
        active: {
          true: "SI",
          false: "NO"
        }
      }
    },
    internal_server_error: 'Internal Server Error',
  },
  user: {
    profilePicture:"Profile Picture",
    create_success: 'User has been created',
    update_success: 'User has been updated',
    emailDupKey: 'Email already exists',
    company: 'Transport Operator',
    users: 'Users',
    user_detail: 'User detail',
    save: 'SAVE',
    basic_info: 'Basic Info',
    documentId: 'Identity Document',
    firstName: 'First Name',
    lastName: 'Last Name',
    emailAddress: 'E-Mail',
    phoneNumber: 'Phone Number',
    active: 'Active',
    companies: 'Companies',
    roles: 'Roles',
    auth_tab: 'Auth',
    metadata_tab: 'Metadata',
    metadata: {
      createdBy: 'Created by',
      createdAt: 'Created at',
      updatedBy: 'Modified by',
      updatedAt: 'Modified at',
    },
    typeVechile:{
        OTHER: "Otro",
        BUS: "Bus",
        BUSETA: "Buseta",
        "MICRO-BUS": "MicroBus",
        PADRON: "Padrón",
        BUSETON: "Busetón",
        ARTICULADO: "Articulado",      
    },
    form_validations: {
      password: {
        required_field: "Password is required",
        min_chars: "Password requires a minimum of 4 characters",
        max_chars : "Password does not match",
        invalid_format: "The password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
      },

      phoneNumber: {
        invalid_format: 'The telephone number requires to comply with the following format + CodPais CodArea Telephone, e. g. +57 111 1234567 ',
      },
      name: {
        required_field: "The field is required",
        min_chars: "The field requires at least 3 characters",
        max_chars: "The field only allows a maximum of 100 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the name are from A to Z (Uppercase) and / or from 0 to 9."
      },
      lastname: {
        required_field: "The field is required",
        min_chars: "The field requires at least 3 characters",
        max_chars: "The field only allows a maximum of 100 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the lastname are from A to Z (Uppercase) and / or from 0 to 9."
      },
      email: {
        invalid_format: 'The email has an invalid format, e. g .: user@mail.com ',
        required_field: "Email is required",
      },
      document: {
        required_field: "The field is required",
        max_chars: "The field only allows a maximum of 100 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the field are from A to Z (Uppercase) and / or from 0 to 9."
      },
      licence_expedition: {
        invalid_format: "Invalid date format"
      },
      licence_expiration: {
        invalid_format: "Invalid date format",
        lower_than_expedition_date: "The expiration date must be greater than the date of expedition"
      },
      driver_license: {
        max_chars: "The field only allows a maximum of 30 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the field are from A to Z (Uppercase) and / or from 0 to 9."
      },
      driver_license_category: {
        max_chars: "The field only allows a maximum of 30 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the field are from A to Z (Uppercase) and / or from 0 to 9."
      },
      driver_mandatory_plan_number: {
        max_chars: "The field only allows a maximum of 30 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the field are from A to Z (Uppercase) and / or from 0 to 9."
      },
      driver_mandatory_plan_issuer: {
        max_chars: "The field only allows a maximum of 30 characters",
        invalid_format: "Invalid values were entered, the characters allowed for the field are from A to Z (Uppercase) and / or from 0 to 9."
      },
      occupational_risk: {
        max_chars: "The field only allows a maximum of 30 characters",
        invalid_format: "Invalid values are entered, the allowed characters are from A to Z (Uppercase) and/or from 0 to 9."
      },
    },
    regularExpresionDoesntExist: "No regular expression has been configured for the field, please contact an administrator.",
    regulatoryCompliance_tab: 'Regulatory Compliance',
    regulatoryCompliance: {
      typeVehicle: "Type of Vehicles",
      driverLicense: "Driver License",
      driverLicenseNumber: "Number",
      driverLicenseCategory: "Category",
      driverLicenseExpeditionDate: "Expedition Date",
      driverLicenseExpirationDate: "Expiration Date",
      mandatoryHealthPlan: "Mandatory Health Plan",
      mandatoryHealthPlanNumber: "Number",
      mandatoryHealthPlanIssuer: "Issuer",
      mandatoryHealthPlanExpeditionDate: "Expedition Date",
      mandatoryHealthPlanExpirationDate: "Expiration Date",
      occupationalRiskAdministrator: "Occupational Risk Administrator",
      occupationalRiskAdministratorNumber: "Number",
      occupationalRiskAdministratorIssuer: "Issuer",
      occupationalRiskAdministratorExpeditionDate: "Expedition Date",
      occupationalRiskAdministratorExpirationDate: "Expiration Date",
    },
    not_found: 'Sorry but we could not find the entity you are looking for',
    internal_server_error: 'Internal Server Error',
    create_auth_dialog: {
      user_has_no_auth: "The current user does not has Login credentials, you can create one here",
      dialog_title: "Create Credentials",
      dialog_body: "To create credentials for this website, please enter the username you will use here.",
      create_button: "Create credentials",
      username: "User name",
      cancel: "CANCEL",
      create: "CREATE",
    },
    auth: {
      authId: "Auth user ID",
      username: "User Name",
      resetPasswordText: "New Password",
      resetPasswordConfirmationText: "New Password confirmation",
      resetPasswordButton: "Reset Password",
      deleteAuthButton: "Delete Credentials",
      delete_credentail_desc: "If this user credentials are no longer requiere, you can delete them here "
    },
    role_groups: {
      "HSM": "HSM",
      "INVENTORY-BOX-MANAGER": "Inventory Box Manager",
      "POINT-OF-SALE-ADMIN": "Point of Sale Admin",
      "ALL": "All",
      "CASHIER": "Cashier",
      "POINT-OF-SALE-SUPPORT": "Support POS",      
      "DEVICE": "Device",
      "PAYMENT_MEDIUM_EMITTER":"Payment Medium Emitter",
      "ORGANIZATION-ADMIN": "Org Admin",
      "INVENTORY-BOX-MANAGER":"Inventory box Admin",
      "VEHICLE-ADMINISTRATOR": "Vehicle Admin",
      "VEHICLE-DRIVER": "Vehicle Driver",
      "VEHICLE-OWNER": "Vehicle Owner",
      "SERVICE-SUPERVISOR": "Service Supervisor",
      "SERVICE-DISPATCHER": "Service Dispatcher",
      "CONTRACT-ADMIN": "Contract Administrator",
      "ORGANIZATION-VIEWER": "Organization Viewer",
      "NEBULAE_UNIVERSITY-ADMIN": "NebulaE Administrator",
      "COMPANY-ADMIN": "Company Administrator",
      "COMPANY-VIEWER": "Company Viewer",
      "ACCOUNT-ADMINISTRATOR": "Account Administrator",
      "ACCOUNT-VIEWER": "Account Viewer",
      "ACS-ADMIN": "ACS Admin",
      "ACS-CHANNEL-ADMIN": "ACS Channel Admin",
      "ACS-VIEWER": "ACS Viewer",
      "FARE-POLICY-MANAGER": "Fare Policy Manager",
      "ACSS-ADMIN": "ACSS Administrator",
      "ACSS-CHANNEL-ADMIN": "ACSS Channel Admin",
      "ACSS-VIEWER": "ACSS Viewer",
      "IT-SUPPORT": "IT Support",
      "COMPANY-B2B-API": "Transport Operator M2M Interface",
      "DEVICE-PARAMETER-MANAGER": "Device Parameter Manager",
      "SERVICE-COORDINATOR": "Service Coordinator",
      "SERVICE-OPERATOR": "Service Operator",
      "PAC":"Customer Service",
      "PAC-ADMIN":"Customer Service Admin",
      "REPORT_VIEWER": "Report Viewer",
      "PAC-MOBILE":"Mobile Customer Service",
      "REPORT_SALES_VIEWER": "Sales REport Viewer",
    }
  }
};