import { TypeServerRequest, TypeThemeServerAPIResult } from './../types';
import { DocEngine } from './../doc-engine';

export async function adminApiHandler(req: TypeServerRequest): Promise<TypeThemeServerAPIResult> {

  if (req.path === '/api/admin/sync-github') {
    
  }

  const result = {
    success: true,
    data: req.path,
    code: 'ADMIN_SUCCESS',
    message: 'success!',
  };
  return result;
}

export async function portalApiHandler(req: TypeServerRequest): Promise<TypeThemeServerAPIResult> {
  const result = {
    success: true,
    data: req.path,
    code: 'PORTAL_SUCCESS',
    message: 'success!',
  };
  return result;
}