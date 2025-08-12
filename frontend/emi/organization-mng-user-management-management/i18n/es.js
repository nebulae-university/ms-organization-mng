export default {
  navigation: {
    'organization-mng': 'GESTIÓN DE OPERADORES',
    'organization-mng-user-management-management': 'Usuarios',
  },
  users: {
    newUser: 'Nuevo Usuario',
    users: 'Usuarios',
    search: 'Búsqueda rápida por nombre, documento o email',
    add_new_user: 'Agregar Nueva',
    add_new_user_short: 'Agregar',
    rows_per_page: 'Filas por página:',
    of: 'de',
    remove: 'Eliminar',
    table_colums: {
      firstName: 'Nombre',
      createdAt: 'Fecha de Creación',
      lastName: 'Apellido',
      emailAddress: 'E-Mail',
      active: 'Activo'
    },
    errors: {
      11000: 'El correo electrónico ya está registrado. Por favor, utiliza uno diferente.',
      11001: 'El documento de identidad ya está registrado. Por favor, utiliza uno diferente.',
      2: 'El usuario no tiene los roles necesarios para ejecutar este comando/consulta',
      404: "Usuario no encontrado",
      409: "El nombre de usuario ya está en uso. Por favor, elija otro.",
    },
    remove_dialog_title: "¿Desea eliminar los usuarios seleccionadas?",
    remove_dialog_description: "Esta acción no se puede deshacer",
    remove_dialog_no: "No",
    remove_dialog_yes: "Si",
    filters: {
      title: "Filtros",
      active: "Activo",
      company: "Operador de Transporte",
      all_company: "Todos",
      no_company: "Sin operador",
      role: "Rol",
      download_file: "Descargar"
    },
    internal_server_error: 'Error interno de servidor',
    reportDownloader: {
      questionMsg: "¿En qué formato deseas descargar tu informe?",
      progress_msg: "Estamos creando tu reporte en estos momentos",
      close: "Cerrar",
      cancel_and_close: "Cancelar y cerrar",
      cancel: "Cancelar proceso",
      fileNamePrefix: "Reporte_Usuarios",
      headers: {
        "id": "ID del Usuario",
        "active": "Activo",
        "documentId": "Número de Documento",
        "firstName": "Nombres",
        "lastName": "Apellidos",
        "emailAddress": "Email",
        "phoneNumber": "Teléfono",
        "lastLoginDate": "Último Inicio de Sesión",
        "roles": "Roles",
        "auth_username": "Nombre de Usuario",
        "regulatoryCompliance_driverLicenseNumber": "Licencia de Conducción",
        "regulatoryCompliance_driverLicenseCategory": "Categoría de Licencia",
        "regulatoryCompliance_driverLicenseExpeditionDate": "Expedición de Licencia de Conducción",
        "regulatoryCompliance_driverLicenseExpirationDate": "Expiración de Licencia de Conducción",
        "regulatoryCompliance_mandatoryHealthPlanNumber": "Número del POS",
        "regulatoryCompliance_mandatoryHealthPlanIssuer": "Emisor de POS",
        "regulatoryCompliance_mandatoryHealthPlanExpeditionDate": "Expedicion del POS ",
        "regulatoryCompliance_mandatoryHealthPlanExpirationDate": "Expiración del POS",
        "regulatoryCompliance_occupationalRiskAdministratorNumber": "Número de Administradora de Riesgos Laborales",
        "regulatoryCompliance_occupationalRiskAdministratorIssuer": "Emisor de Administradora de Riesgos Laborales",
        "regulatoryCompliance_occupationalRiskAdministratorExpeditionDate": "Expedicion de Administradora de Riesgos Laborales ",
        "regulatoryCompliance_occupationalRiskAdministratorExpirationDate": "Expiración de Administradora de Riesgos Laborales",
        "companyObj_name": "Compañia",
        "companyObj_authorityCode": "Código de Autorida de Compañía",

        "metadata_createdBy": "Creado Por",
        "metadata_createdAt": "Fecha Creación",
        "metadata_createdAtTime": "Hora Creación",
        "metadata_updatedBy": "Actualizado Por",
        "metadata_updatedAt": "Fecha Actualizado",
        "metadata_updatedAtTime": "Hora Actualizado"
      },
      values: {
        active: {
          true: "SI",
          false: "NO"
        },
      }
    }
  },
  user: {
    profilePicture: "Foto de Perfil",
    create_success: 'El usuario ha sido creado exitosamente',
    update_success: 'El usuario ha sido modificado exitosamente',
    emailDupKey: 'El correo electrónico ya está en uso',
    documentIdDupkey: 'El documento ya se encuentra registrado',
    company: 'Operador de Transporte',
    users: 'Usuarios',
    user_detail: 'Detalle del Usuario',
    save: 'GUARDAR',
    basic_info: 'Información Básica',
    documentId: 'Documento de Identidad',
    firstName: 'Nombre(s)',
    lastName: ' Apellido(s)',
    emailAddress: 'E-Mail',
    phoneNumber: 'Número de Teléfono',
    active: 'Activo',
    companies: 'Compañias',
    roles: 'Roles',
    auth_tab: 'Autenticación',
    metadata_tab: 'Metadatos',
    typesVehicle: {
      OTHER: "Otro",
      BUS: "Bus",
      BUSETA: "Buseta",
      "MICRO-BUS": "MicroBus",
      PADRON: "Padrón",
      BUSETON: "Busetón",
      ARTICULADO: "Articulado",
    },
    metadata: {
      createdBy: 'Creado por',
      createdAt: 'Creado el',
      updatedBy: 'Modificado por',
      updatedAt: 'Modificado el',
    },
    form_validations: {
      password: {
        
        required_field: "La contraseña es requerida",
        min_chars: "La contraseña requiere mínimo 4 caracteres",
        max_chars : "La contraseña  no coincide",
        invalid_format: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
      },
      phoneNumber: {
        invalid_format: 'El número del teléfono requiere cumplir con el siguiente formato +CodPais CodArea Teléfono, e. g. +57 111 1234567',
      },
      name: {
        required_field: "El campo nombre es requerido",
        min_chars: "El campo nombre requiere mínimo 3 caracteres",
        max_chars: "El campo nombre solo permite máximo 100 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para el nombre son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      lastname: {
        required_field: "El campo apellido es requerido",
        min_chars: "El campo apellido requiere mínimo 3 caracteres",
        max_chars: "El campo apellido solo permite máximo 100 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para el apellido son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      email: {
        invalid_format: 'El correo electrónico tiene un formato inválido, e. g.: user@mail.com',
        required_field: "El correo electrónico es requerido",
      },
      document: {
        required_field: "El campo documento es requerido",
        max_chars: "El campo documento solo permite máximo 100 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para el documento son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      licence_expedition: {
        invalid_format: "Formato de fecha inválido"
      },
      licence_expiration: {
        invalid_format: "Formato de fecha inválido",
        lower_than_expedition_date: "La fecha de expiración tiene que se mayor a la fecha de expedición"
      },
      driver_license: {
        max_chars: "El campo número de licencia solo permite máximo 30 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para la licencia son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      driver_license_category: {
        max_chars: "El campo categoría solo permite máximo 30 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para la categoría son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      driver_mandatory_plan_number: {
        max_chars: "El campo número de POS solo permite máximo 30 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para el número de POS son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      driver_mandatory_plan_issuer: {
        max_chars: "El campo emisor de POS solo permite máximo 30 caracteres",
        invalid_format: "Se ingresaron valores inválidos, los caracteres permitidos para el emisor de POS son de A a Z (Mayúsculas) y/o de 0 a 9."
      },
      occupational_risk: {
        max_chars: "El campo número solo permite máximo 30 caracteres",
        invalid_format: "Se ingresan valores inválidos, los caracteres permitidos son de A a Z (Mayúsculas) y/o de 0 a 9."
      }
    },
    regularExpresionDoesntExist: "No se ha configurado una expresión regular para el campo, por favor contacte un administrador",
    regulatoryCompliance_tab: 'Cumplimiento Normativo',
    regulatoryCompliance: {
      typeVehicle: "Tipo de Vehículos",
      driverLicense: "Licencia de Conducción",
      driverLicenseNumber: "Número",
      driverLicenseCategory: "Categoría",
      driverLicenseExpeditionDate: "Fecha de Expedición",
      driverLicenseExpirationDate: "Fecha de Expiración",
      mandatoryHealthPlan: "Plan Obligatorio de Salud (POS)",
      mandatoryHealthPlanNumber: "Número",
      mandatoryHealthPlanIssuer: "Emisor",
      mandatoryHealthPlanExpeditionDate: "Fecha de Expedición",
      mandatoryHealthPlanExpirationDate: "Fecha de Expiración",
      occupationalRiskAdministrator: "Administradora de Riesgos Laborales",
      occupationalRiskAdministratorNumber: "Número",
      occupationalRiskAdministratorIssuer: "Emisor",
      occupationalRiskAdministratorExpeditionDate: "Fecha de Expedición",
      occupationalRiskAdministratorExpirationDate: "Fecha de Expiración",
    },
    not_found: 'Lo sentimos pero no pudimos encontrar la entidad que busca',
    internal_server_error: 'Error interno de servidor',
    create_auth_dialog: {
      user_has_no_auth: "El usuario actual no tiene credenciales de inicio de sesión, puede crear una aquí",
      dialog_title: "Crear Credenciales",
      dialog_body: "Para crear credenciales para este sitio web, ingrese el nombre de usuario que usará aquí.",
      create_button: "Crear credenciales",
      username: "Nombre de usuario",
      cancel: "CANCELAR",
      create: "CREAR",
    },
    auth: {
      authId: "ID credencial",
      username: "Nombre de Usuario",
      resetPasswordText: "Nueva Contraseña",
      resetPasswordConfirmationText: "Confirmación Nueva Contraseña",
      resetPasswordButton: "Restablecer contraseña",
      deleteAuthButton: "Eliminar Credenciales",
      delete_credentail_desc: "Si estas credenciales de usuario ya no son necesarias, puede eliminarlas aquí"
    },
    role_groups: {
      "POINT-OF-SALE-MANAGER": "Gestor de Punto de Venta",
      "HSM": "HSM",
      "INVENTORY-BOX-MANAGER": "Administrador de Inventario POS",
      "POINT-OF-SALE-ADMIN": "Administrador de Punto de Ventas",
      "ALL": "Todos",
      "CASHIER": "Cajero",
      "POINT-OF-SALE-SUPPORT": "Soporte Puntos de Venta",
      "DEVICE": "Dispositivo",
      "PAYMENT_MEDIUM_EMITTER": "Emisor de Medios de Pago",
      "ORGANIZATION-ADMIN": "Administrador del Operador de Recaudo",
      "INVENTORY-BOX-MANAGER": "Administrador de Inventario",
      "VEHICLE-ADMINISTRATOR": "Administrador de Vehículos",
      "VEHICLE-DRIVER": "Conductor de Vehículos",
      "VEHICLE-OWNER": "Propietario de Vehículos",
      "SERVICE-SUPERVISOR": "Supervisor de Servicios",
      "SERVICE-DISPATCHER": "Gestor de Servicios",
      "CONTRACT-ADMIN": "Gestor de Contratos",
      "ORGANIZATION-VIEWER": "Visualizador del Operador de Recaudo",
      "NEBULAE_UNIVERSITY-ADMIN": "Administrador de Flota",
      "COMPANY-ADMIN": "Administrador de Operador de Transporte",
      "COMPANY-VIEWER": "Visualizador de Operador de Transporte",
      "ACCOUNT-ADMINISTRATOR": "Administrador de Cuenta",
      "ACCOUNT-VIEWER": "Visualizador de Cuentas",
      "COMPANY-ADMIN-TPE": "Coordinador TPE",
      "SERVICE-TPE-SUPERVISOR": "Supervisor TPE",
      "ACS-ADMIN": "Administrador de ACS",
      "ACS-CHANNEL-ADMIN": "Administrador de Canal ACS",
      "ACS-VIEWER": "Visualizador de ACS",
      "FARE-POLICY-MANAGER": "Administrador de Políticas Tarifarias",
      "ACSS-ADMIN": "Administrador ACSS",
      "ACSS-CHANNEL-ADMIN": "Administrador Canales ACSS",
      "ACSS-VIEWER": "Visualizador ACSS",
      "IT-SUPPORT": "Soporte TI",
      "COMPANY-B2B-API": "Interfaz B2B Operador de Transporte",
      "DEVICE-PARAMETER-MANAGER": "Administrador de Parametros de Dispositivo",
      "SERVICE-COORDINATOR": "Coordinador de Servicios",
      "SERVICE-OPERATOR": "Operador de Servicios",
      "PAC": "Puesto Atención al Cliente",
      "PAC-ADMIN": "Administrador de Puesto Atención al Cliente",
      "REPORT_VIEWER": "Visualizador de Reportes",
      "PAC-MOBILE": "Puesto Atención al Cliente Móvil",
      "REPORT_SALES_VIEWER": "Visualizador de Reportes de Ventas",
      "SHIFT_CLEARING_TELLER": "Recaudador de Efectivo SGCF",
      "SHIFT_CLEARING_CLEARER": "Liquidador de Pagos SGCF"
    },
    errors: {
      20010: "El usuario no se puede editar porque no eres el propietario"
    }
  }
};