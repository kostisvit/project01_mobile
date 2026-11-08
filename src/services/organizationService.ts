import { api } from "../api/client";


export const getOrganizations = () =>
    api.get("/api/organizations/");

export const getOrganizationTypes = () =>
    api.get("/api/organizations/types/");
