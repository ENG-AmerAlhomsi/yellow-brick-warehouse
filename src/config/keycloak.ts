import Keycloak from 'keycloak-js';

export const keycloakConfig = {
  url: 'http://localhost:8082',
  realm: 'amer-dev',
  clientId: 'WareHouse-frontend',
};

export const keycloak = new Keycloak(keycloakConfig);