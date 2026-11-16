import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL =
  'http://192.168.20.25/MiCredencial/miCredencial-Backend/api';

export interface UsuarioSession {
  id_usuario: string | number;
  tipo_documento?: string;
  nombres: string;
  apellidos: string;
  email?: string;
  estado?: string;
  foto?: string | null;
  tipo_usuario: string;
  roles?: string[];
  roles_base?: string[];
  programa?: string;
}

export const PROGRAMAS_ACADEMICOS = [
  'Ingeniería en Tecnologías de la Información y Comunicaciones',
  'Ingeniería Civil',
  'Ingeniería Ambiental',
  'Ingeniería Industrial',
  'Derecho',
  'Contaduría Pública',
  'Administración de Empresas',
];

export const STAFF_ROLES = [
  'administrador',
  'docente',
  'administrativo',
  'seguridad',
  'bienestar',
  'biblioteca',
  'admisiones_registro',
  'escaneador',
  'escaneador de bienestar',
  'escaneador de biblioteca',
  'generar carnet temporal',
];

export function getUserRoles(user: UsuarioSession | null): string[] {
  if (!user) return [];
  const roles = new Set<string>();
  if (user.tipo_usuario) {
    roles.add(user.tipo_usuario.toLowerCase().trim());
  }
  if (Array.isArray(user.roles)) {
    user.roles.forEach((r) => roles.add(String(r).toLowerCase().trim()));
  }
  if (Array.isArray(user.roles_base)) {
    user.roles_base.forEach((r) => roles.add(String(r).toLowerCase().trim()));
  }
  return Array.from(roles);
}

export function hasAnyRole(
  user: UsuarioSession | null,
  allowedRoles: string[]
): boolean {
  const userRoles = getUserRoles(user);
  return allowedRoles.some((r) => userRoles.includes(r.toLowerCase().trim()));
}

export function isStaffUser(user: UsuarioSession | null): boolean {
  return hasAnyRole(user, STAFF_ROLES);
}

export async function getStoredUsuario(): Promise<UsuarioSession | null> {
  const raw = await AsyncStorage.getItem('usuario');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UsuarioSession;
  } catch {
    return null;
  }
}
