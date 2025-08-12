"use strict";

const CITIES = [
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MEDELLIN",
    "cityCode": "05001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ABEJORRAL",
    "cityCode": "05002",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ABRIAQUI",
    "cityCode": "05004",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ALEJANDRIA",
    "cityCode": "05021",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "AMAGA",
    "cityCode": "05030",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "AMALFI",
    "cityCode": "05031",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ANDES",
    "cityCode": "05034",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ANGELOPOLIS",
    "cityCode": "05036",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ANGOSTURA",
    "cityCode": "05038",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ANORI",
    "cityCode": "05040",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SANTAFE DE ANTIOQUIA",
    "cityCode": "05042",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ANZA",
    "cityCode": "05044",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "APARTADO",
    "cityCode": "05045",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ARBOLETES",
    "cityCode": "05051",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ARGELIA",
    "cityCode": "05055",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ARMENIA",
    "cityCode": "05059",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BARBOSA",
    "cityCode": "05079",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BELMIRA",
    "cityCode": "05086",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BELLO",
    "cityCode": "05088",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BETANIA",
    "cityCode": "05091",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BETULIA",
    "cityCode": "05093",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CIUDAD BOLIVAR",
    "cityCode": "05101",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BRICEÑO",
    "cityCode": "05107",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "BURITICA",
    "cityCode": "05113",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CACERES",
    "cityCode": "05120",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAICEDO",
    "cityCode": "05125",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CALDAS",
    "cityCode": "05129",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAMPAMENTO",
    "cityCode": "05134",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAÑASGORDAS",
    "cityCode": "05138",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CARACOLI",
    "cityCode": "05142",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CARAMANTA",
    "cityCode": "05145",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAREPA",
    "cityCode": "05147",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "EL CARMEN DE VIBORAL",
    "cityCode": "05148",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAROLINA",
    "cityCode": "05150",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CAUCASIA",
    "cityCode": "05154",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CHIGORODO",
    "cityCode": "05172",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CISNEROS",
    "cityCode": "05190",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "COCORNA",
    "cityCode": "05197",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CONCEPCION",
    "cityCode": "05206",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "CONCORDIA",
    "cityCode": "05209",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "COPACABANA",
    "cityCode": "05212",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "DABEIBA",
    "cityCode": "05234",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "DON MATIAS",
    "cityCode": "05237",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "EBEJICO",
    "cityCode": "05240",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "EL BAGRE",
    "cityCode": "05250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ENTRERRIOS",
    "cityCode": "05264",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ENVIGADO",
    "cityCode": "05266",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "FREDONIA",
    "cityCode": "05282",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "FRONTINO",
    "cityCode": "05284",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GIRALDO",
    "cityCode": "05306",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GIRARDOTA",
    "cityCode": "05308",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GOMEZ PLATA",
    "cityCode": "05310",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GRANADA",
    "cityCode": "05313",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GUADALUPE",
    "cityCode": "05315",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GUARNE",
    "cityCode": "05318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "GUATAPE",
    "cityCode": "05321",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "HELICONIA",
    "cityCode": "05347",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "HISPANIA",
    "cityCode": "05353",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ITAGUI",
    "cityCode": "05360",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ITUANGO",
    "cityCode": "05361",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "JARDIN",
    "cityCode": "05364",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "JERICO",
    "cityCode": "05368",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "LA CEJA",
    "cityCode": "05376",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "LA ESTRELLA",
    "cityCode": "05380",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "LA PINTADA",
    "cityCode": "05390",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "LA UNION",
    "cityCode": "05400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "LIBORINA",
    "cityCode": "05411",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MACEO",
    "cityCode": "05425",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MARINILLA",
    "cityCode": "05440",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MONTEBELLO",
    "cityCode": "05467",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MURINDO",
    "cityCode": "05475",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "MUTATA",
    "cityCode": "05480",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "NARIÑO",
    "cityCode": "05483",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "NECOCLI",
    "cityCode": "05490",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "NECHI",
    "cityCode": "05495",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "OLAYA",
    "cityCode": "05501",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PEÐOL",
    "cityCode": "05541",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PEQUE",
    "cityCode": "05543",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PUEBLORRICO",
    "cityCode": "05576",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PUERTO BERRIO",
    "cityCode": "05579",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PUERTO NARE",
    "cityCode": "05585",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "PUERTO TRIUNFO",
    "cityCode": "05591",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "REMEDIOS",
    "cityCode": "05604",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "RETIRO",
    "cityCode": "05607",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "RIONEGRO",
    "cityCode": "05615",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SABANALARGA",
    "cityCode": "05628",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SABANETA",
    "cityCode": "05631",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SALGAR",
    "cityCode": "05642",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN ANDRES DE CUERQUIA",
    "cityCode": "05647",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN CARLOS",
    "cityCode": "05649",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN FRANCISCO",
    "cityCode": "05652",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN JERONIMO",
    "cityCode": "05656",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN JOSE DE LA MONTAÑA",
    "cityCode": "05658",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN JUAN DE URABA",
    "cityCode": "05659",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN LUIS",
    "cityCode": "05660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN PEDRO",
    "cityCode": "05664",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN PEDRO DE URABA",
    "cityCode": "05665",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN RAFAEL",
    "cityCode": "05667",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN ROQUE",
    "cityCode": "05670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SAN VICENTE",
    "cityCode": "05674",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SANTA BARBARA",
    "cityCode": "05679",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SANTA ROSA DE OSOS",
    "cityCode": "05686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SANTO DOMINGO",
    "cityCode": "05690",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "EL SANTUARIO",
    "cityCode": "05697",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SEGOVIA",
    "cityCode": "05736",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SONSON",
    "cityCode": "05756",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "SOPETRAN",
    "cityCode": "05761",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TAMESIS",
    "cityCode": "05789",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TARAZA",
    "cityCode": "05790",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TARSO",
    "cityCode": "05792",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TITIRIBI",
    "cityCode": "05809",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TOLEDO",
    "cityCode": "05819",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "TURBO",
    "cityCode": "05837",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "URAMITA",
    "cityCode": "05842",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "URRAO",
    "cityCode": "05847",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "VALDIVIA",
    "cityCode": "05854",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "VALPARAISO",
    "cityCode": "05856",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "VEGACHI",
    "cityCode": "05858",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "VENECIA",
    "cityCode": "05861",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "VIGIA DEL FUERTE",
    "cityCode": "05873",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "YALI",
    "cityCode": "05885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "YARUMAL",
    "cityCode": "05887",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "YOLOMBO",
    "cityCode": "05890",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "YONDO",
    "cityCode": "05893",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "05",
    "stateName": "ANTIOQUIA",
    "cityName": "ZARAGOZA",
    "cityCode": "05895",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "BARRANQUILLA",
    "cityCode": "08001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "BARANOA",
    "cityCode": "08078",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "CAMPO DE LA CRUZ",
    "cityCode": "08137",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "CANDELARIA",
    "cityCode": "08141",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "GALAPA",
    "cityCode": "08296",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "JUAN DE ACOSTA",
    "cityCode": "08372",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "LURUACO",
    "cityCode": "08421",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "MALAMBO",
    "cityCode": "08433",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "MANATI",
    "cityCode": "08436",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "PALMAR DE VARELA",
    "cityCode": "08520",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "PIOJO",
    "cityCode": "08549",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "POLONUEVO",
    "cityCode": "08558",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "PONEDERA",
    "cityCode": "08560",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "PUERTO COLOMBIA",
    "cityCode": "08573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "REPELON",
    "cityCode": "08606",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SABANAGRANDE",
    "cityCode": "08634",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SABANALARGA",
    "cityCode": "08638",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SANTA LUCIA",
    "cityCode": "08675",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SANTO TOMAS",
    "cityCode": "08685",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SOLEDAD",
    "cityCode": "08758",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "SUAN",
    "cityCode": "08770",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "TUBARA",
    "cityCode": "08832",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "08",
    "stateName": "ATLANTICO",
    "cityName": "USIACURI",
    "cityCode": "08849",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "11",
    "stateName": "BOGOTA",
    "cityName": "BOGOTA, D.C.",
    "cityCode": "11001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CARTAGENA",
    "cityCode": "13001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ACHI",
    "cityCode": "13006",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ALTOS DEL ROSARIO",
    "cityCode": "13030",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ARENAL",
    "cityCode": "13042",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ARJONA",
    "cityCode": "13052",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ARROYOHONDO",
    "cityCode": "13062",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "BARRANCO DE LOBA",
    "cityCode": "13074",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CALAMAR",
    "cityCode": "13140",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CANTAGALLO",
    "cityCode": "13160",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CICUCO",
    "cityCode": "13188",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CORDOBA",
    "cityCode": "13212",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "CLEMENCIA",
    "cityCode": "13222",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "EL CARMEN DE BOLIVAR",
    "cityCode": "13244",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "EL GUAMO",
    "cityCode": "13248",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "EL PEÑON",
    "cityCode": "13268",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "HATILLO DE LOBA",
    "cityCode": "13300",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MAGANGUE",
    "cityCode": "13430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MAHATES",
    "cityCode": "13433",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MARGARITA",
    "cityCode": "13440",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MARIA LA BAJA",
    "cityCode": "13442",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MONTECRISTO",
    "cityCode": "13458",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MOMPOS",
    "cityCode": "13468",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "NOROSI",
    "cityCode": "13490",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "MORALES",
    "cityCode": "13473",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "PINILLOS",
    "cityCode": "13549",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "REGIDOR",
    "cityCode": "13580",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "RIO VIEJO",
    "cityCode": "13600",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN CRISTOBAL",
    "cityCode": "13620",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN ESTANISLAO",
    "cityCode": "13647",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN FERNANDO",
    "cityCode": "13650",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN JACINTO",
    "cityCode": "13654",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN JACINTO DEL CAUCA",
    "cityCode": "13655",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN JUAN NEPOMUCENO",
    "cityCode": "13657",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN MARTIN DE LOBA",
    "cityCode": "13667",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SAN PABLO",
    "cityCode": "13670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SANTA CATALINA",
    "cityCode": "13673",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SANTA ROSA",
    "cityCode": "13683",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SANTA ROSA DEL SUR",
    "cityCode": "13688",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SIMITI",
    "cityCode": "13744",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "SOPLAVIENTO",
    "cityCode": "13760",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "TALAIGUA NUEVO",
    "cityCode": "13780",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "TIQUISIO",
    "cityCode": "13810",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "TURBACO",
    "cityCode": "13836",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "TURBANA",
    "cityCode": "13838",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "VILLANUEVA",
    "cityCode": "13873",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "13",
    "stateName": "BOLIVAR",
    "cityName": "ZAMBRANO",
    "cityCode": "13894",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TUNJA",
    "cityCode": "15001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "ALMEIDA",
    "cityCode": "15022",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "AQUITANIA",
    "cityCode": "15047",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "ARCABUCO",
    "cityCode": "15051",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BELEN",
    "cityCode": "15087",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BERBEO",
    "cityCode": "15090",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BETEITIVA",
    "cityCode": "15092",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BOAVITA",
    "cityCode": "15097",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BOYACA",
    "cityCode": "15104",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BRICEÑO",
    "cityCode": "15106",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BUENAVISTA",
    "cityCode": "15109",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "BUSBANZA",
    "cityCode": "15114",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CALDAS",
    "cityCode": "15131",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CAMPOHERMOSO",
    "cityCode": "15135",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CERINZA",
    "cityCode": "15162",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHINAVITA",
    "cityCode": "15172",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHIQUINQUIRA",
    "cityCode": "15176",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHISCAS",
    "cityCode": "15180",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHITA",
    "cityCode": "15183",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHITARAQUE",
    "cityCode": "15185",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHIVATA",
    "cityCode": "15187",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CIENEGA",
    "cityCode": "15189",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "COMBITA",
    "cityCode": "15204",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "COPER",
    "cityCode": "15212",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CORRALES",
    "cityCode": "15215",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "COVARACHIA",
    "cityCode": "15218",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CUBARA",
    "cityCode": "15223",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CUCAITA",
    "cityCode": "15224",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CUITIVA",
    "cityCode": "15226",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHIQUIZA",
    "cityCode": "15232",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "CHIVOR",
    "cityCode": "15236",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "DUITAMA",
    "cityCode": "15238",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "EL COCUY",
    "cityCode": "15244",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "EL ESPINO",
    "cityCode": "15248",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "FIRAVITOBA",
    "cityCode": "15272",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "FLORESTA",
    "cityCode": "15276",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GACHANTIVA",
    "cityCode": "15293",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GAMEZA",
    "cityCode": "15296",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GARAGOA",
    "cityCode": "15299",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GUACAMAYAS",
    "cityCode": "15317",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GUATEQUE",
    "cityCode": "15322",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GUAYATA",
    "cityCode": "15325",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "GsICAN",
    "cityCode": "15332",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "IZA",
    "cityCode": "15362",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "JENESANO",
    "cityCode": "15367",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "JERICO",
    "cityCode": "15368",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "LABRANZAGRANDE",
    "cityCode": "15377",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "LA CAPILLA",
    "cityCode": "15380",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "LA VICTORIA",
    "cityCode": "15401",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "LA UVITA",
    "cityCode": "15403",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "VILLA DE LEYVA",
    "cityCode": "15407",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MACANAL",
    "cityCode": "15425",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MARIPI",
    "cityCode": "15442",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MIRAFLORES",
    "cityCode": "15455",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MONGUA",
    "cityCode": "15464",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MONGUI",
    "cityCode": "15466",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MONIQUIRA",
    "cityCode": "15469",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MOTAVITA",
    "cityCode": "15476",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "MUZO",
    "cityCode": "15480",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "NOBSA",
    "cityCode": "15491",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "NUEVO COLON",
    "cityCode": "15494",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "OICATA",
    "cityCode": "15500",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "OTANCHE",
    "cityCode": "15507",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PACHAVITA",
    "cityCode": "15511",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAEZ",
    "cityCode": "15514",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAIPA",
    "cityCode": "15516",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAJARITO",
    "cityCode": "15518",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PANQUEBA",
    "cityCode": "15522",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAUNA",
    "cityCode": "15531",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAYA",
    "cityCode": "15533",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PAZ DE RIO",
    "cityCode": "15537",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PESCA",
    "cityCode": "15542",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PISBA",
    "cityCode": "15550",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "PUERTO BOYACA",
    "cityCode": "15572",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "QUIPAMA",
    "cityCode": "15580",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "RAMIRIQUI",
    "cityCode": "15599",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "RAQUIRA",
    "cityCode": "15600",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "RONDON",
    "cityCode": "15621",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SABOYA",
    "cityCode": "15632",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SACHICA",
    "cityCode": "15638",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAMACA",
    "cityCode": "15646",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN EDUARDO",
    "cityCode": "15660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN JOSE DE PARE",
    "cityCode": "15664",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN LUIS DE GACENO",
    "cityCode": "15667",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN MATEO",
    "cityCode": "15673",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN MIGUEL DE SEMA",
    "cityCode": "15676",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SAN PABLO DE BORBUR",
    "cityCode": "15681",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SANTANA",
    "cityCode": "15686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SANTA MARIA",
    "cityCode": "15690",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SANTA ROSA DE VITERBO",
    "cityCode": "15693",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SANTA SOFIA",
    "cityCode": "15696",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SATIVANORTE",
    "cityCode": "15720",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SATIVASUR",
    "cityCode": "15723",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SIACHOQUE",
    "cityCode": "15740",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOATA",
    "cityCode": "15753",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOCOTA",
    "cityCode": "15755",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOCHA",
    "cityCode": "15757",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOGAMOSO",
    "cityCode": "15759",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOMONDOCO",
    "cityCode": "15761",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SORA",
    "cityCode": "15762",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SOTAQUIRA",
    "cityCode": "15763",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SORACA",
    "cityCode": "15764",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SUSACON",
    "cityCode": "15774",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SUTAMARCHAN",
    "cityCode": "15776",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "SUTATENZA",
    "cityCode": "15778",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TASCO",
    "cityCode": "15790",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TENZA",
    "cityCode": "15798",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TIBANA",
    "cityCode": "15804",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TIBASOSA",
    "cityCode": "15806",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TINJACA",
    "cityCode": "15808",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TIPACOQUE",
    "cityCode": "15810",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TOCA",
    "cityCode": "15814",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TOGsI",
    "cityCode": "15816",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TOPAGA",
    "cityCode": "15820",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TOTA",
    "cityCode": "15822",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TUNUNGUA",
    "cityCode": "15832",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TURMEQUE",
    "cityCode": "15835",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TUTA",
    "cityCode": "15837",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "TUTAZA",
    "cityCode": "15839",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "UMBITA",
    "cityCode": "15842",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "VENTAQUEMADA",
    "cityCode": "15861",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "VIRACACHA",
    "cityCode": "15879",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "15",
    "stateName": "BOYACA",
    "cityName": "ZETAQUIRA",
    "cityCode": "15897",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "MANIZALES",
    "cityCode": "17001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "AGUADAS",
    "cityCode": "17013",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "ANSERMA",
    "cityCode": "17042",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "ARANZAZU",
    "cityCode": "17050",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "BELALCAZAR",
    "cityCode": "17088",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "CHINCHINA",
    "cityCode": "17174",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "FILADELFIA",
    "cityCode": "17272",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "LA DORADA",
    "cityCode": "17380",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "LA MERCED",
    "cityCode": "17388",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "MANZANARES",
    "cityCode": "17433",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "MARMATO",
    "cityCode": "17442",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "MARQUETALIA",
    "cityCode": "17444",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "MARULANDA",
    "cityCode": "17446",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "NEIRA",
    "cityCode": "17486",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "NORCASIA",
    "cityCode": "17495",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "PACORA",
    "cityCode": "17513",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "PALESTINA",
    "cityCode": "17524",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "PENSILVANIA",
    "cityCode": "17541",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "RIOSUCIO",
    "cityCode": "17614",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "RISARALDA",
    "cityCode": "17616",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "SALAMINA",
    "cityCode": "17653",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "SAMANA",
    "cityCode": "17662",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "SAN JOSE",
    "cityCode": "17665",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "SUPIA",
    "cityCode": "17777",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "VICTORIA",
    "cityCode": "17867",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "VILLAMARIA",
    "cityCode": "17873",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "17",
    "stateName": "CALDAS",
    "cityName": "VITERBO",
    "cityCode": "17877",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "FLORENCIA",
    "cityCode": "18001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "ALBANIA",
    "cityCode": "18029",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "BELEN DE LOS ANDAQUIES",
    "cityCode": "18094",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "CARTAGENA DEL CHAIRA",
    "cityCode": "18150",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "CURILLO",
    "cityCode": "18205",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "EL DONCELLO",
    "cityCode": "18247",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "EL PAUJIL",
    "cityCode": "18256",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "LA MONTAÑITA",
    "cityCode": "18410",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "MILAN",
    "cityCode": "18460",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "MORELIA",
    "cityCode": "18479",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "PUERTO RICO",
    "cityCode": "18592",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "SAN JOSE DEL FRAGUA",
    "cityCode": "18610",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "SAN VICENTE DEL CAGUAN",
    "cityCode": "18753",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "SOLANO",
    "cityCode": "18756",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "SOLITA",
    "cityCode": "18785",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "18",
    "stateName": "CAQUETA",
    "cityName": "VALPARAISO",
    "cityCode": "18860",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "POPAYAN",
    "cityCode": "19001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "ALMAGUER",
    "cityCode": "19022",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "ARGELIA",
    "cityCode": "19050",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "BALBOA",
    "cityCode": "19075",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "BOLIVAR",
    "cityCode": "19100",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "BUENOS AIRES",
    "cityCode": "19110",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "CAJIBIO",
    "cityCode": "19130",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "CALDONO",
    "cityCode": "19137",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "CALOTO",
    "cityCode": "19142",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "CORINTO",
    "cityCode": "19212",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "EL TAMBO",
    "cityCode": "19256",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "FLORENCIA",
    "cityCode": "19290",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "GUACHENE",
    "cityCode": "19300",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "GUAPI",
    "cityCode": "19318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "INZA",
    "cityCode": "19355",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "JAMBALO",
    "cityCode": "19364",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "LA SIERRA",
    "cityCode": "19392",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "LA VEGA",
    "cityCode": "19397",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "LOPEZ",
    "cityCode": "19418",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "MERCADERES",
    "cityCode": "19450",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "MIRANDA",
    "cityCode": "19455",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "MORALES",
    "cityCode": "19473",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PADILLA",
    "cityCode": "19513",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PAEZ",
    "cityCode": "19517",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PATIA",
    "cityCode": "19532",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PIAMONTE",
    "cityCode": "19533",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PIENDAMO",
    "cityCode": "19548",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PUERTO TEJADA",
    "cityCode": "19573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "PURACE",
    "cityCode": "19585",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "ROSAS",
    "cityCode": "19622",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SAN SEBASTIAN",
    "cityCode": "19693",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SANTANDER DE QUILICHAO",
    "cityCode": "19698",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SANTA ROSA",
    "cityCode": "19701",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SILVIA",
    "cityCode": "19743",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SOTARA",
    "cityCode": "19760",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SUAREZ",
    "cityCode": "19780",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "SUCRE",
    "cityCode": "19785",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "TIMBIO",
    "cityCode": "19807",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "TIMBIQUI",
    "cityCode": "19809",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "TORIBIO",
    "cityCode": "19821",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "TOTORO",
    "cityCode": "19824",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "19",
    "stateName": "CAUCA",
    "cityName": "VILLA RICA",
    "cityCode": "19845",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "VALLEDUPAR",
    "cityCode": "20001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "AGUACHICA",
    "cityCode": "20011",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "AGUSTIN CODAZZI",
    "cityCode": "20013",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "ASTREA",
    "cityCode": "20032",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "BECERRIL",
    "cityCode": "20045",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "BOSCONIA",
    "cityCode": "20060",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "CHIMICHAGUA",
    "cityCode": "20175",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "CHIRIGUANA",
    "cityCode": "20178",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "CURUMANI",
    "cityCode": "20228",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "EL COPEY",
    "cityCode": "20238",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "EL PASO",
    "cityCode": "20250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "GAMARRA",
    "cityCode": "20295",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "GONZALEZ",
    "cityCode": "20310",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "LA GLORIA",
    "cityCode": "20383",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "LA JAGUA DE IBIRICO",
    "cityCode": "20400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "MANAURE",
    "cityCode": "20443",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "PAILITAS",
    "cityCode": "20517",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "PELAYA",
    "cityCode": "20550",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "PUEBLO BELLO",
    "cityCode": "20570",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "RIO DE ORO",
    "cityCode": "20614",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "LA PAZ",
    "cityCode": "20621",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "SAN ALBERTO",
    "cityCode": "20710",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "SAN DIEGO",
    "cityCode": "20750",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "SAN MARTIN",
    "cityCode": "20770",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "20",
    "stateName": "CESAR",
    "cityName": "TAMALAMEQUE",
    "cityCode": "20787",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "MONTERIA",
    "cityCode": "23001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "AYAPEL",
    "cityCode": "23068",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "BUENAVISTA",
    "cityCode": "23079",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "CANALETE",
    "cityCode": "23090",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "CERETE",
    "cityCode": "23162",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "CHIMA",
    "cityCode": "23168",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "CHINU",
    "cityCode": "23182",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "CIENAGA DE ORO",
    "cityCode": "23189",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "COTORRA",
    "cityCode": "23300",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "LA APARTADA",
    "cityCode": "23350",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "LORICA",
    "cityCode": "23417",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "LOS CORDOBAS",
    "cityCode": "23419",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "MOMIL",
    "cityCode": "23464",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "MONTELIBANO",
    "cityCode": "23466",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "MOÑITOS",
    "cityCode": "23500",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "PLANETA RICA",
    "cityCode": "23555",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "PUEBLO NUEVO",
    "cityCode": "23570",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "PUERTO ESCONDIDO",
    "cityCode": "23574",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "PUERTO LIBERTADOR",
    "cityCode": "23580",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "PURISIMA",
    "cityCode": "23586",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAHAGUN",
    "cityCode": "23660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAN ANDRES SOTAVENTO",
    "cityCode": "23670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAN ANTERO",
    "cityCode": "23672",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAN BERNARDO DEL VIENTO",
    "cityCode": "23675",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAN CARLOS",
    "cityCode": "23678",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "SAN PELAYO",
    "cityCode": "23686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "TIERRALTA",
    "cityCode": "23807",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "23",
    "stateName": "CORDOBA",
    "cityName": "VALENCIA",
    "cityCode": "23855",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "AGUA DE DIOS",
    "cityCode": "25001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ALBAN",
    "cityCode": "25019",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ANAPOIMA",
    "cityCode": "25035",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ANOLAIMA",
    "cityCode": "25040",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ARBELAEZ",
    "cityCode": "25053",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "BELTRAN",
    "cityCode": "25086",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "BITUIMA",
    "cityCode": "25095",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "BOJACA",
    "cityCode": "25099",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CABRERA",
    "cityCode": "25120",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CACHIPAY",
    "cityCode": "25123",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CAJICA",
    "cityCode": "25126",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CAPARRAPI",
    "cityCode": "25148",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CAQUEZA",
    "cityCode": "25151",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CARMEN DE CARUPA",
    "cityCode": "25154",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CHAGUANI",
    "cityCode": "25168",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CHIA",
    "cityCode": "25175",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CHIPAQUE",
    "cityCode": "25178",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CHOACHI",
    "cityCode": "25181",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CHOCONTA",
    "cityCode": "25183",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "COGUA",
    "cityCode": "25200",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "COTA",
    "cityCode": "25214",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "CUCUNUBA",
    "cityCode": "25224",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "EL COLEGIO",
    "cityCode": "25245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "EL PEÑON",
    "cityCode": "25258",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "EL ROSAL",
    "cityCode": "25260",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FACATATIVA",
    "cityCode": "25269",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FOMEQUE",
    "cityCode": "25279",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FOSCA",
    "cityCode": "25281",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FUNZA",
    "cityCode": "25286",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FUQUENE",
    "cityCode": "25288",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "FUSAGASUGA",
    "cityCode": "25290",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GACHALA",
    "cityCode": "25293",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GACHANCIPA",
    "cityCode": "25295",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GACHETA",
    "cityCode": "25297",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GAMA",
    "cityCode": "25299",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GIRARDOT",
    "cityCode": "25307",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GRANADA",
    "cityCode": "25312",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUACHETA",
    "cityCode": "25317",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUADUAS",
    "cityCode": "25320",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUASCA",
    "cityCode": "25322",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUATAQUI",
    "cityCode": "25324",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUATAVITA",
    "cityCode": "25326",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUAYABAL DE SIQUIMA",
    "cityCode": "25328",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUAYABETAL",
    "cityCode": "25335",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "GUTIERREZ",
    "cityCode": "25339",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "JERUSALEN",
    "cityCode": "25368",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "JUNIN",
    "cityCode": "25372",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LA CALERA",
    "cityCode": "25377",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LA MESA",
    "cityCode": "25386",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LA PALMA",
    "cityCode": "25394",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LA PEÑA",
    "cityCode": "25398",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LA VEGA",
    "cityCode": "25402",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "LENGUAZAQUE",
    "cityCode": "25407",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "MACHETA",
    "cityCode": "25426",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "MADRID",
    "cityCode": "25430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "MANTA",
    "cityCode": "25436",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "MEDINA",
    "cityCode": "25438",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "MOSQUERA",
    "cityCode": "25473",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "NARIÑO",
    "cityCode": "25483",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "NEMOCON",
    "cityCode": "25486",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "NILO",
    "cityCode": "25488",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "NIMAIMA",
    "cityCode": "25489",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "NOCAIMA",
    "cityCode": "25491",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VENECIA",
    "cityCode": "25506",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PACHO",
    "cityCode": "25513",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PAIME",
    "cityCode": "25518",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PANDI",
    "cityCode": "25524",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PARATEBUENO",
    "cityCode": "25530",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PASCA",
    "cityCode": "25535",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PUERTO SALGAR",
    "cityCode": "25572",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "PULI",
    "cityCode": "25580",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "QUEBRADANEGRA",
    "cityCode": "25592",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "QUETAME",
    "cityCode": "25594",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "QUIPILE",
    "cityCode": "25596",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "APULO",
    "cityCode": "25599",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "RICAURTE",
    "cityCode": "25612",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SAN ANTONIO DEL TEQUENDAMA",
    "cityCode": "25645",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SAN BERNARDO",
    "cityCode": "25649",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SAN CAYETANO",
    "cityCode": "25653",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SAN FRANCISCO",
    "cityCode": "25658",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SAN JUAN DE RIO SECO",
    "cityCode": "25662",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SASAIMA",
    "cityCode": "25718",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SESQUILE",
    "cityCode": "25736",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SIBATE",
    "cityCode": "25740",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SILVANIA",
    "cityCode": "25743",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SIMIJACA",
    "cityCode": "25745",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SOACHA",
    "cityCode": "25754",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SOPO",
    "cityCode": "25758",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SUBACHOQUE",
    "cityCode": "25769",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SUESCA",
    "cityCode": "25772",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SUPATA",
    "cityCode": "25777",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SUSA",
    "cityCode": "25779",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "SUTATAUSA",
    "cityCode": "25781",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TABIO",
    "cityCode": "25785",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TAUSA",
    "cityCode": "25793",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TENA",
    "cityCode": "25797",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TENJO",
    "cityCode": "25799",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TIBACUY",
    "cityCode": "25805",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TIBIRITA",
    "cityCode": "25807",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TOCAIMA",
    "cityCode": "25815",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TOCANCIPA",
    "cityCode": "25817",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "TOPAIPI",
    "cityCode": "25823",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "UBALA",
    "cityCode": "25839",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "UBAQUE",
    "cityCode": "25841",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VILLA DE SAN DIEGO DE UBATE",
    "cityCode": "25843",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "UNE",
    "cityCode": "25845",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "UTICA",
    "cityCode": "25851",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VERGARA",
    "cityCode": "25862",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VIANI",
    "cityCode": "25867",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VILLAGOMEZ",
    "cityCode": "25871",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VILLAPINZON",
    "cityCode": "25873",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VILLETA",
    "cityCode": "25875",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "VIOTA",
    "cityCode": "25878",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "YACOPI",
    "cityCode": "25885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ZIPACON",
    "cityCode": "25898",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "25",
    "stateName": "CUNDINAMARCA",
    "cityName": "ZIPAQUIRA",
    "cityCode": "25899",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "QUIBDO",
    "cityCode": "27001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "ACANDI",
    "cityCode": "27006",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "ALTO BAUDO",
    "cityCode": "27025",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "ATRATO",
    "cityCode": "27050",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "BAGADO",
    "cityCode": "27073",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "BAHIA SOLANO",
    "cityCode": "27075",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "BAJO BAUDO",
    "cityCode": "27077",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "BOJAYA",
    "cityCode": "27099",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "EL CANTON DEL SAN PABLO",
    "cityCode": "27135",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "CARMEN DEL DARIEN",
    "cityCode": "27150",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "CERTEGUI",
    "cityCode": "27160",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "CONDOTO",
    "cityCode": "27205",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "EL CARMEN DE ATRATO",
    "cityCode": "27245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "EL LITORAL DEL SAN JUAN",
    "cityCode": "27250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "ISTMINA",
    "cityCode": "27361",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "JURADO",
    "cityCode": "27372",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "LLORO",
    "cityCode": "27413",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "MEDIO ATRATO",
    "cityCode": "27425",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "MEDIO BAUDO",
    "cityCode": "27430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "MEDIO SAN JUAN",
    "cityCode": "27450",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "NOVITA",
    "cityCode": "27491",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "NUQUI",
    "cityCode": "27495",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "RIO IRO",
    "cityCode": "27580",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "RIO QUITO",
    "cityCode": "27600",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "RIOSUCIO",
    "cityCode": "27615",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "SAN JOSE DEL PALMAR",
    "cityCode": "27660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "SIPI",
    "cityCode": "27745",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "TADO",
    "cityCode": "27787",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "UNGUIA",
    "cityCode": "27800",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "27",
    "stateName": "CHOCO",
    "cityName": "UNION PANAMERICANA",
    "cityCode": "27810",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "NEIVA",
    "cityCode": "41001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "ACEVEDO",
    "cityCode": "41006",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "AGRADO",
    "cityCode": "41013",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "AIPE",
    "cityCode": "41016",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "ALGECIRAS",
    "cityCode": "41020",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "ALTAMIRA",
    "cityCode": "41026",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "BARAYA",
    "cityCode": "41078",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "CAMPOALEGRE",
    "cityCode": "41132",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "COLOMBIA",
    "cityCode": "41206",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "ELIAS",
    "cityCode": "41244",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "GARZON",
    "cityCode": "41298",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "GIGANTE",
    "cityCode": "41306",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "GUADALUPE",
    "cityCode": "41319",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "HOBO",
    "cityCode": "41349",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "IQUIRA",
    "cityCode": "41357",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "ISNOS",
    "cityCode": "41359",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "LA ARGENTINA",
    "cityCode": "41378",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "LA PLATA",
    "cityCode": "41396",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "NATAGA",
    "cityCode": "41483",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "OPORAPA",
    "cityCode": "41503",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "PAICOL",
    "cityCode": "41518",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "PALERMO",
    "cityCode": "41524",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "PALESTINA",
    "cityCode": "41530",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "PITAL",
    "cityCode": "41548",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "PITALITO",
    "cityCode": "41551",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "RIVERA",
    "cityCode": "41615",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "SALADOBLANCO",
    "cityCode": "41660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "SAN AGUSTIN",
    "cityCode": "41668",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "SANTA MARIA",
    "cityCode": "41676",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "SUAZA",
    "cityCode": "41770",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "TARQUI",
    "cityCode": "41791",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "TESALIA",
    "cityCode": "41797",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "TELLO",
    "cityCode": "41799",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "TERUEL",
    "cityCode": "41801",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "TIMANA",
    "cityCode": "41807",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "VILLAVIEJA",
    "cityCode": "41872",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "41",
    "stateName": "HUILA",
    "cityName": "YAGUARA",
    "cityCode": "41885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "RIOHACHA",
    "cityCode": "44001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "ALBANIA",
    "cityCode": "44035",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "BARRANCAS",
    "cityCode": "44078",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "DIBULLA",
    "cityCode": "44090",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "DISTRACCION",
    "cityCode": "44098",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "EL MOLINO",
    "cityCode": "44110",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "FONSECA",
    "cityCode": "44279",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "HATONUEVO",
    "cityCode": "44378",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "LA JAGUA DEL PILAR",
    "cityCode": "44420",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "MAICAO",
    "cityCode": "44430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "MANAURE",
    "cityCode": "44560",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "SAN JUAN DEL CESAR",
    "cityCode": "44650",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "URIBIA",
    "cityCode": "44847",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "URUMITA",
    "cityCode": "44855",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "44",
    "stateName": "LA GUAJIRA",
    "cityName": "VILLANUEVA",
    "cityCode": "44874",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SANTA MARTA",
    "cityCode": "47001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "ALGARROBO",
    "cityCode": "47030",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "ARACATACA",
    "cityCode": "47053",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "ARIGUANI",
    "cityCode": "47058",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "CERRO SAN ANTONIO",
    "cityCode": "47161",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "CHIBOLO",
    "cityCode": "47170",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "CIENAGA",
    "cityCode": "47189",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "CONCORDIA",
    "cityCode": "47205",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "EL BANCO",
    "cityCode": "47245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "EL PIÑON",
    "cityCode": "47258",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "EL RETEN",
    "cityCode": "47268",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "FUNDACION",
    "cityCode": "47288",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "GUAMAL",
    "cityCode": "47318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "NUEVA GRANADA",
    "cityCode": "47460",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "PEDRAZA",
    "cityCode": "47541",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "PIJIÑO DEL CARMEN",
    "cityCode": "47545",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "PIVIJAY",
    "cityCode": "47551",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "PLATO",
    "cityCode": "47555",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "PUEBLOVIEJO",
    "cityCode": "47570",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "REMOLINO",
    "cityCode": "47605",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SABANAS DE SAN ANGEL",
    "cityCode": "47660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SALAMINA",
    "cityCode": "47675",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SAN SEBASTIAN DE BUENAVISTA",
    "cityCode": "47692",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SAN ZENON",
    "cityCode": "47703",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SANTA ANA",
    "cityCode": "47707",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SANTA BARBARA DE PINTO",
    "cityCode": "47720",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "SITIONUEVO",
    "cityCode": "47745",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "TENERIFE",
    "cityCode": "47798",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "ZAPAYAN",
    "cityCode": "47960",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "47",
    "stateName": "MAGDALENA",
    "cityName": "ZONA BANANERA",
    "cityCode": "47980",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "VILLAVICENCIO",
    "cityCode": "50001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "ACACIAS",
    "cityCode": "50006",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "BARRANCA DE UPIA",
    "cityCode": "50110",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "CABUYARO",
    "cityCode": "50124",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "CASTILLA LA NUEVA",
    "cityCode": "50150",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "CUBARRAL",
    "cityCode": "50223",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "CUMARAL",
    "cityCode": "50226",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "EL CALVARIO",
    "cityCode": "50245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "EL CASTILLO",
    "cityCode": "50251",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "EL DORADO",
    "cityCode": "50270",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "FUENTE DE ORO",
    "cityCode": "50287",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "GRANADA",
    "cityCode": "50313",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "GUAMAL",
    "cityCode": "50318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "MAPIRIPAN",
    "cityCode": "50325",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "MESETAS",
    "cityCode": "50330",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "LA MACARENA",
    "cityCode": "50350",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "URIBE",
    "cityCode": "50370",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "LEJANIAS",
    "cityCode": "50400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "PUERTO CONCORDIA",
    "cityCode": "50450",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "PUERTO GAITAN",
    "cityCode": "50568",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "PUERTO LOPEZ",
    "cityCode": "50573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "PUERTO LLERAS",
    "cityCode": "50577",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "PUERTO RICO",
    "cityCode": "50590",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "RESTREPO",
    "cityCode": "50606",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "SAN CARLOS DE GUAROA",
    "cityCode": "50680",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "SAN JUAN DE ARAMA",
    "cityCode": "50683",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "SAN JUANITO",
    "cityCode": "50686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "SAN MARTIN",
    "cityCode": "50689",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "50",
    "stateName": "META",
    "cityName": "VISTAHERMOSA",
    "cityCode": "50711",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "PASTO",
    "cityCode": "52001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ALBAN",
    "cityCode": "52019",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ALDANA",
    "cityCode": "52022",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ANCUYA",
    "cityCode": "52036",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ARBOLEDA",
    "cityCode": "52051",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "BARBACOAS",
    "cityCode": "52079",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "BELEN",
    "cityCode": "52083",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "BUESACO",
    "cityCode": "52110",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "COLON",
    "cityCode": "52203",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CONSACA",
    "cityCode": "52207",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CONTADERO",
    "cityCode": "52210",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CORDOBA",
    "cityCode": "52215",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CUASPUD",
    "cityCode": "52224",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CUMBAL",
    "cityCode": "52227",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CUMBITARA",
    "cityCode": "52233",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "CHACHAGsI",
    "cityCode": "52240",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "EL CHARCO",
    "cityCode": "52250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "EL PEÑOL",
    "cityCode": "52254",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "EL ROSARIO",
    "cityCode": "52256",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "EL TABLON DE GOMEZ",
    "cityCode": "52258",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "EL TAMBO",
    "cityCode": "52260",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "FUNES",
    "cityCode": "52287",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "GUACHUCAL",
    "cityCode": "52317",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "GUAITARILLA",
    "cityCode": "52320",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "GUALMATAN",
    "cityCode": "52323",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ILES",
    "cityCode": "52352",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "IMUES",
    "cityCode": "52354",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "IPIALES",
    "cityCode": "52356",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LA CRUZ",
    "cityCode": "52378",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LA FLORIDA",
    "cityCode": "52381",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LA LLANADA",
    "cityCode": "52385",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LA TOLA",
    "cityCode": "52390",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LA UNION",
    "cityCode": "52399",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LEIVA",
    "cityCode": "52405",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LINARES",
    "cityCode": "52411",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "LOS ANDES",
    "cityCode": "52418",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "MAGsI",
    "cityCode": "52427",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "MALLAMA",
    "cityCode": "52435",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "MOSQUERA",
    "cityCode": "52473",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "NARIÑO",
    "cityCode": "52480",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "OLAYA HERRERA",
    "cityCode": "52490",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "OSPINA",
    "cityCode": "52506",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "FRANCISCO PIZARRO",
    "cityCode": "52520",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "POLICARPA",
    "cityCode": "52540",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "POTOSI",
    "cityCode": "52560",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "PROVIDENCIA",
    "cityCode": "52565",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "PUERRES",
    "cityCode": "52573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "PUPIALES",
    "cityCode": "52585",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "RICAURTE",
    "cityCode": "52612",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "ROBERTO PAYAN",
    "cityCode": "52621",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAMANIEGO",
    "cityCode": "52678",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SANDONA",
    "cityCode": "52683",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAN BERNARDO",
    "cityCode": "52685",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAN LORENZO",
    "cityCode": "52687",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAN PABLO",
    "cityCode": "52693",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAN PEDRO DE CARTAGO",
    "cityCode": "52694",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SANTA BARBARA",
    "cityCode": "52696",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SANTACRUZ",
    "cityCode": "52699",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAPUYES",
    "cityCode": "52720",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "TAMINANGO",
    "cityCode": "52786",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "TANGUA",
    "cityCode": "52788",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "SAN ANDRES DE TUMACO",
    "cityCode": "52835",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "TUQUERRES",
    "cityCode": "52838",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "52",
    "stateName": "NARIÑO",
    "cityName": "YACUANQUER",
    "cityCode": "52885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CUCUTA",
    "cityCode": "54001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "ABREGO",
    "cityCode": "54003",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "ARBOLEDAS",
    "cityCode": "54051",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "BOCHALEMA",
    "cityCode": "54099",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "BUCARASICA",
    "cityCode": "54109",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CACOTA",
    "cityCode": "54125",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CACHIRA",
    "cityCode": "54128",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CHINACOTA",
    "cityCode": "54172",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CHITAGA",
    "cityCode": "54174",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CONVENCION",
    "cityCode": "54206",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "CUCUTILLA",
    "cityCode": "54223",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "DURANIA",
    "cityCode": "54239",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "EL CARMEN",
    "cityCode": "54245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "EL TARRA",
    "cityCode": "54250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "EL ZULIA",
    "cityCode": "54261",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "GRAMALOTE",
    "cityCode": "54313",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "HACARI",
    "cityCode": "54344",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "HERRAN",
    "cityCode": "54347",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "LABATECA",
    "cityCode": "54377",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "LA ESPERANZA",
    "cityCode": "54385",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "LA PLAYA",
    "cityCode": "54398",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "LOS PATIOS",
    "cityCode": "54405",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "LOURDES",
    "cityCode": "54418",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "MUTISCUA",
    "cityCode": "54480",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "OCAÑA",
    "cityCode": "54498",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "PAMPLONA",
    "cityCode": "54518",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "PAMPLONITA",
    "cityCode": "54520",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "PUERTO SANTANDER",
    "cityCode": "54553",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "RAGONVALIA",
    "cityCode": "54599",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SALAZAR",
    "cityCode": "54660",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SAN CALIXTO",
    "cityCode": "54670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SAN CAYETANO",
    "cityCode": "54673",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SANTIAGO",
    "cityCode": "54680",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SARDINATA",
    "cityCode": "54720",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "SILOS",
    "cityCode": "54743",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "TEORAMA",
    "cityCode": "54800",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "TIBU",
    "cityCode": "54810",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "TOLEDO",
    "cityCode": "54820",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "VILLA CARO",
    "cityCode": "54871",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "54",
    "stateName": "N. DE SANTANDER",
    "cityName": "VILLA DEL ROSARIO",
    "cityCode": "54874",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "ARMENIA",
    "cityCode": "63001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "BUENAVISTA",
    "cityCode": "63111",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "CALARCA",
    "cityCode": "63130",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "CIRCASIA",
    "cityCode": "63190",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "CORDOBA",
    "cityCode": "63212",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "FILANDIA",
    "cityCode": "63272",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "GENOVA",
    "cityCode": "63302",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "LA TEBAIDA",
    "cityCode": "63401",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "MONTENEGRO",
    "cityCode": "63470",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "PIJAO",
    "cityCode": "63548",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "QUIMBAYA",
    "cityCode": "63594",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "63",
    "stateName": "QUINDIO",
    "cityName": "SALENTO",
    "cityCode": "63690",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "PEREIRA",
    "cityCode": "66001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "APIA",
    "cityCode": "66045",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "BALBOA",
    "cityCode": "66075",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "BELEN DE UMBRIA",
    "cityCode": "66088",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "DOSQUEBRADAS",
    "cityCode": "66170",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "GUATICA",
    "cityCode": "66318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "LA CELIA",
    "cityCode": "66383",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "LA VIRGINIA",
    "cityCode": "66400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "MARSELLA",
    "cityCode": "66440",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "MISTRATO",
    "cityCode": "66456",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "PUEBLO RICO",
    "cityCode": "66572",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "QUINCHIA",
    "cityCode": "66594",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "SANTA ROSA DE CABAL",
    "cityCode": "66682",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "66",
    "stateName": "RISARALDA",
    "cityName": "SANTUARIO",
    "cityCode": "66687",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BUCARAMANGA",
    "cityCode": "68001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "AGUADA",
    "cityCode": "68013",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ALBANIA",
    "cityCode": "68020",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ARATOCA",
    "cityCode": "68051",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BARBOSA",
    "cityCode": "68077",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BARICHARA",
    "cityCode": "68079",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BARRANCABERMEJA",
    "cityCode": "68081",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BETULIA",
    "cityCode": "68092",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "BOLIVAR",
    "cityCode": "68101",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CABRERA",
    "cityCode": "68121",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CALIFORNIA",
    "cityCode": "68132",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CAPITANEJO",
    "cityCode": "68147",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CARCASI",
    "cityCode": "68152",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CEPITA",
    "cityCode": "68160",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CERRITO",
    "cityCode": "68162",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CHARALA",
    "cityCode": "68167",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CHARTA",
    "cityCode": "68169",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CHIMA",
    "cityCode": "68176",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CHIPATA",
    "cityCode": "68179",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CIMITARRA",
    "cityCode": "68190",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CONCEPCION",
    "cityCode": "68207",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CONFINES",
    "cityCode": "68209",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CONTRATACION",
    "cityCode": "68211",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "COROMORO",
    "cityCode": "68217",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "CURITI",
    "cityCode": "68229",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "EL CARMEN DE CHUCURI",
    "cityCode": "68235",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "EL GUACAMAYO",
    "cityCode": "68245",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "EL PEÑON",
    "cityCode": "68250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "EL PLAYON",
    "cityCode": "68255",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ENCINO",
    "cityCode": "68264",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ENCISO",
    "cityCode": "68266",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "FLORIAN",
    "cityCode": "68271",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "FLORIDABLANCA",
    "cityCode": "68276",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GALAN",
    "cityCode": "68296",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GAMBITA",
    "cityCode": "68298",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GIRON",
    "cityCode": "68307",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GUACA",
    "cityCode": "68318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GUADALUPE",
    "cityCode": "68320",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GUAPOTA",
    "cityCode": "68322",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GUAVATA",
    "cityCode": "68324",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "GsEPSA",
    "cityCode": "68327",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "HATO",
    "cityCode": "68344",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "JESUS MARIA",
    "cityCode": "68368",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "JORDAN",
    "cityCode": "68370",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "LA BELLEZA",
    "cityCode": "68377",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "LANDAZURI",
    "cityCode": "68385",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "LA PAZ",
    "cityCode": "68397",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "LEBRIJA",
    "cityCode": "68406",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "LOS SANTOS",
    "cityCode": "68418",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "MACARAVITA",
    "cityCode": "68425",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "MALAGA",
    "cityCode": "68432",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "MATANZA",
    "cityCode": "68444",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "MOGOTES",
    "cityCode": "68464",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "MOLAGAVITA",
    "cityCode": "68468",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "OCAMONTE",
    "cityCode": "68498",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "OIBA",
    "cityCode": "68500",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ONZAGA",
    "cityCode": "68502",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PALMAR",
    "cityCode": "68522",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PALMAS DEL SOCORRO",
    "cityCode": "68524",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PARAMO",
    "cityCode": "68533",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PIEDECUESTA",
    "cityCode": "68547",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PINCHOTE",
    "cityCode": "68549",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PUENTE NACIONAL",
    "cityCode": "68572",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PUERTO PARRA",
    "cityCode": "68573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "PUERTO WILCHES",
    "cityCode": "68575",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "RIONEGRO",
    "cityCode": "68615",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SABANA DE TORRES",
    "cityCode": "68655",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN ANDRES",
    "cityCode": "68669",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN BENITO",
    "cityCode": "68673",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN GIL",
    "cityCode": "68679",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN JOAQUIN",
    "cityCode": "68682",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN JOSE DE MIRANDA",
    "cityCode": "68684",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN MIGUEL",
    "cityCode": "68686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SAN VICENTE DE CHUCURI",
    "cityCode": "68689",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SANTA BARBARA",
    "cityCode": "68705",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SANTA HELENA DEL OPON",
    "cityCode": "68720",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SIMACOTA",
    "cityCode": "68745",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SOCORRO",
    "cityCode": "68755",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SUAITA",
    "cityCode": "68770",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SUCRE",
    "cityCode": "68773",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "SURATA",
    "cityCode": "68780",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "TONA",
    "cityCode": "68820",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "VALLE DE SAN JOSE",
    "cityCode": "68855",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "VELEZ",
    "cityCode": "68861",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "VETAS",
    "cityCode": "68867",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "VILLANUEVA",
    "cityCode": "68872",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "68",
    "stateName": "SANTANDER",
    "cityName": "ZAPATOCA",
    "cityCode": "68895",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SINCELEJO",
    "cityCode": "70001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "BUENAVISTA",
    "cityCode": "70110",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "CAIMITO",
    "cityCode": "70124",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "COLOSO",
    "cityCode": "70204",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "COROZAL",
    "cityCode": "70215",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "COVEÑAS",
    "cityCode": "70221",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "CHALAN",
    "cityCode": "70230",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "EL ROBLE",
    "cityCode": "70233",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "GALERAS",
    "cityCode": "70235",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "GUARANDA",
    "cityCode": "70265",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "LA UNION",
    "cityCode": "70400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "LOS PALMITOS",
    "cityCode": "70418",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "MAJAGUAL",
    "cityCode": "70429",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "MORROA",
    "cityCode": "70473",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "OVEJAS",
    "cityCode": "70508",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "PALMITO",
    "cityCode": "70523",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAMPUES",
    "cityCode": "70670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN BENITO ABAD",
    "cityCode": "70678",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN JUAN DE BETULIA",
    "cityCode": "70702",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN MARCOS",
    "cityCode": "70708",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN ONOFRE",
    "cityCode": "70713",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN PEDRO",
    "cityCode": "70717",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SAN LUIS DE SINCE",
    "cityCode": "70742",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SUCRE",
    "cityCode": "70771",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "SANTIAGO DE TOLU",
    "cityCode": "70820",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "70",
    "stateName": "SUCRE",
    "cityName": "TOLU VIEJO",
    "cityCode": "70823",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "IBAGUE",
    "cityCode": "73001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ALPUJARRA",
    "cityCode": "73024",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ALVARADO",
    "cityCode": "73026",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "AMBALEMA",
    "cityCode": "73030",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ANZOATEGUI",
    "cityCode": "73043",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ARMERO",
    "cityCode": "73055",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ATACO",
    "cityCode": "73067",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "CAJAMARCA",
    "cityCode": "73124",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "CARMEN DE APICALA",
    "cityCode": "73148",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "CASABIANCA",
    "cityCode": "73152",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "CHAPARRAL",
    "cityCode": "73168",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "COELLO",
    "cityCode": "73200",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "COYAIMA",
    "cityCode": "73217",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "CUNDAY",
    "cityCode": "73226",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "DOLORES",
    "cityCode": "73236",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ESPINAL",
    "cityCode": "73268",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "FALAN",
    "cityCode": "73270",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "FLANDES",
    "cityCode": "73275",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "FRESNO",
    "cityCode": "73283",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "GUAMO",
    "cityCode": "73319",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "HERVEO",
    "cityCode": "73347",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "HONDA",
    "cityCode": "73349",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ICONONZO",
    "cityCode": "73352",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "LERIDA",
    "cityCode": "73408",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "LIBANO",
    "cityCode": "73411",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "MARIQUITA",
    "cityCode": "73443",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "MELGAR",
    "cityCode": "73449",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "MURILLO",
    "cityCode": "73461",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "NATAGAIMA",
    "cityCode": "73483",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ORTEGA",
    "cityCode": "73504",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "PALOCABILDO",
    "cityCode": "73520",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "PIEDRAS",
    "cityCode": "73547",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "PLANADAS",
    "cityCode": "73555",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "PRADO",
    "cityCode": "73563",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "PURIFICACION",
    "cityCode": "73585",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "RIOBLANCO",
    "cityCode": "73616",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "RONCESVALLES",
    "cityCode": "73622",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "ROVIRA",
    "cityCode": "73624",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "SALDAÑA",
    "cityCode": "73671",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "SAN ANTONIO",
    "cityCode": "73675",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "SAN LUIS",
    "cityCode": "73678",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "SANTA ISABEL",
    "cityCode": "73686",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "SUAREZ",
    "cityCode": "73770",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "VALLE DE SAN JUAN",
    "cityCode": "73854",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "VENADILLO",
    "cityCode": "73861",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "VILLAHERMOSA",
    "cityCode": "73870",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "73",
    "stateName": "TOLIMA",
    "cityName": "VILLARRICA",
    "cityCode": "73873",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "CALI",
    "cityCode": "76001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ALCALA",
    "cityCode": "76020",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ANDALUCIA",
    "cityCode": "76036",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ANSERMANUEVO",
    "cityCode": "76041",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ARGELIA",
    "cityCode": "76054",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "BOLIVAR",
    "cityCode": "76100",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "BUENAVENTURA",
    "cityCode": "76109",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "GUADALAJARA DE BUGA",
    "cityCode": "76111",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "BUGALAGRANDE",
    "cityCode": "76113",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "CAICEDONIA",
    "cityCode": "76122",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "CALIMA",
    "cityCode": "76126",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "CANDELARIA",
    "cityCode": "76130",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "CARTAGO",
    "cityCode": "76147",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "DAGUA",
    "cityCode": "76233",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "EL AGUILA",
    "cityCode": "76243",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "EL CAIRO",
    "cityCode": "76246",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "EL CERRITO",
    "cityCode": "76248",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "EL DOVIO",
    "cityCode": "76250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "FLORIDA",
    "cityCode": "76275",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "GINEBRA",
    "cityCode": "76306",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "GUACARI",
    "cityCode": "76318",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "JAMUNDI",
    "cityCode": "76364",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "LA CUMBRE",
    "cityCode": "76377",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "LA UNION",
    "cityCode": "76400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "LA VICTORIA",
    "cityCode": "76403",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "OBANDO",
    "cityCode": "76497",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "PALMIRA",
    "cityCode": "76520",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "PRADERA",
    "cityCode": "76563",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "RESTREPO",
    "cityCode": "76606",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "RIOFRIO",
    "cityCode": "76616",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ROLDANILLO",
    "cityCode": "76622",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "SAN PEDRO",
    "cityCode": "76670",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "SEVILLA",
    "cityCode": "76736",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "TORO",
    "cityCode": "76823",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "TRUJILLO",
    "cityCode": "76828",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "TULUA",
    "cityCode": "76834",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ULLOA",
    "cityCode": "76845",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "VERSALLES",
    "cityCode": "76863",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "VIJES",
    "cityCode": "76869",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "YOTOCO",
    "cityCode": "76890",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "YUMBO",
    "cityCode": "76892",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "76",
    "stateName": "VALLE DEL CAUCA",
    "cityName": "ZARZAL",
    "cityCode": "76895",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "ARAUCA",
    "cityCode": "81001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "ARAUQUITA",
    "cityCode": "81065",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "CRAVO NORTE",
    "cityCode": "81220",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "FORTUL",
    "cityCode": "81300",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "PUERTO RONDON",
    "cityCode": "81591",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "SARAVENA",
    "cityCode": "81736",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "81",
    "stateName": "ARAUCA",
    "cityName": "TAME",
    "cityCode": "81794",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "YOPAL",
    "cityCode": "85001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "AGUAZUL",
    "cityCode": "85010",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "CHAMEZA",
    "cityCode": "85015",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "HATO COROZAL",
    "cityCode": "85125",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "LA SALINA",
    "cityCode": "85136",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "MANI",
    "cityCode": "85139",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "MONTERREY",
    "cityCode": "85162",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "NUNCHIA",
    "cityCode": "85225",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "OROCUE",
    "cityCode": "85230",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "PAZ DE ARIPORO",
    "cityCode": "85250",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "PORE",
    "cityCode": "85263",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "RECETOR",
    "cityCode": "85279",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "SABANALARGA",
    "cityCode": "85300",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "SACAMA",
    "cityCode": "85315",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "SAN LUIS DE PALENQUE",
    "cityCode": "85325",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "TAMARA",
    "cityCode": "85400",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "TAURAMENA",
    "cityCode": "85410",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "TRINIDAD",
    "cityCode": "85430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "85",
    "stateName": "CASANARE",
    "cityName": "VILLANUEVA",
    "cityCode": "85440",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "MOCOA",
    "cityCode": "86001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "COLON",
    "cityCode": "86219",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "ORITO",
    "cityCode": "86320",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "PUERTO ASIS",
    "cityCode": "86568",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "PUERTO CAICEDO",
    "cityCode": "86569",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "PUERTO GUZMAN",
    "cityCode": "86571",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "LEGUIZAMO",
    "cityCode": "86573",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "SIBUNDOY",
    "cityCode": "86749",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "SAN FRANCISCO",
    "cityCode": "86755",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "SAN MIGUEL",
    "cityCode": "86757",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "SANTIAGO",
    "cityCode": "86760",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "VALLE DEL GUAMUEZ",
    "cityCode": "86865",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "86",
    "stateName": "PUTUMAYO",
    "cityName": "VILLAGARZON",
    "cityCode": "86885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "88",
    "stateName": "SAN ANDRES",
    "cityName": "SAN ANDRES",
    "cityCode": "88001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "88",
    "stateName": "SAN ANDRES",
    "cityName": "PROVIDENCIA",
    "cityCode": "88564",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "LETICIA",
    "cityCode": "91001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "EL ENCANTO",
    "cityCode": "91263",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "LA CHORRERA",
    "cityCode": "91405",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "LA PEDRERA",
    "cityCode": "91407",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "LA VICTORIA",
    "cityCode": "91430",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "MIRITI - PARANA",
    "cityCode": "91460",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "PUERTO ALEGRIA",
    "cityCode": "91530",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "PUERTO ARICA",
    "cityCode": "91536",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "PUERTO NARIÑO",
    "cityCode": "91540",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "PUERTO SANTANDER",
    "cityCode": "91669",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "91",
    "stateName": "AMAZONAS",
    "cityName": "TARAPACA",
    "cityCode": "91798",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "INIRIDA",
    "cityCode": "94001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "BARRANCO MINAS",
    "cityCode": "94343",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "MAPIRIPANA",
    "cityCode": "94663",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "SAN FELIPE",
    "cityCode": "94883",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "PUERTO COLOMBIA",
    "cityCode": "94884",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "LA GUADALUPE",
    "cityCode": "94885",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "CACAHUAL",
    "cityCode": "94886",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "PANA PANA",
    "cityCode": "94887",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "94",
    "stateName": "GUAINIA",
    "cityName": "MORICHAL",
    "cityCode": "94888",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "95",
    "stateName": "GUAVIARE",
    "cityName": "SAN JOSE DEL GUAVIARE",
    "cityCode": "95001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "95",
    "stateName": "GUAVIARE",
    "cityName": "CALAMAR",
    "cityCode": "95015",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "95",
    "stateName": "GUAVIARE",
    "cityName": "EL RETORNO",
    "cityCode": "95025",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "95",
    "stateName": "GUAVIARE",
    "cityName": "MIRAFLORES",
    "cityCode": "95200",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "MITU",
    "cityCode": "97001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "CARURU",
    "cityCode": "97161",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "PACOA",
    "cityCode": "97511",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "TARAIRA",
    "cityCode": "97666",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "PAPUNAUA",
    "cityCode": "97777",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "97",
    "stateName": "VAUPES",
    "cityName": "YAVARATE",
    "cityCode": "97889",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "99",
    "stateName": "VICHADA",
    "cityName": "PUERTO CARREÑO",
    "cityCode": "99001",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "99",
    "stateName": "VICHADA",
    "cityName": "LA PRIMAVERA",
    "cityCode": "99524",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "99",
    "stateName": "VICHADA",
    "cityName": "SANTA ROSALIA",
    "cityCode": "99624",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  },
  {
    "stateCode": "99",
    "stateName": "VICHADA",
    "cityName": "CUMARIBO",
    "cityCode": "99773",
    "countryCode": "169",
    "countryName": "COLOMBIA",
    "countryIdentificationCode": "CO"
  }
];

module.exports = CITIES;