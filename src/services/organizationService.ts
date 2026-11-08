import { api } from "../api/client";


export const getOrganizations = () =>
    api.get("/api/organizations/");

export const getOrganization = (orgId: number, token?: string | null, signal?: AbortSignal) =>
    api.get(`/api/organizations/${orgId}/`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });

export const getOrganizationTypes = () =>
    api.get("/api/organizations/types/");
