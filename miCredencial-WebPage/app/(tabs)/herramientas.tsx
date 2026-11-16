import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Href, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AdminOptions from '@/components/adminOptions';
import {
  getStoredUsuario,
  hasAnyRole,
  UsuarioSession,
} from '@/constants/api';
import { herramientasStyles } from '../../constants/herramientasStyles';

interface ToolOption {
  id: string;
  icon: string;
  title: string;
  subTitle: string;
  ruta: Href;
  roles: string[];
}

const TOOL_OPTIONS: ToolOption[] = [
  {
    id: 'usuarios',
    icon: '👤',
    title: 'Gestionar Usuarios',
    subTitle: 'Roles y cuentas de acceso',
    ruta: '/herramientas/usuarios' as Href,
    roles: ['administrador'],
  },
  {
    id: 'csv',
    icon: '📃',
    title: 'Cargar CSV',
    subTitle: 'Importar preregistros',
    ruta: '/herramientas/cargarCsv' as Href,
    roles: ['administrador'],
  },
  {
    id: 'estado',
    icon: '🪪',
    title: 'Estado de Carnets',
    subTitle: 'Activar o desactivar credenciales',
    ruta: '/herramientas/estadoCarnets' as Href,
    roles: ['administrador'],
  },
  {
    id: 'egresados',
    icon: '🎓',
    title: 'Egresados NG',
    subTitle: 'Aprobar o rechazar solicitudes',
    ruta: '/herramientas/solicitudesEgresados' as Href,
    roles: ['administrador', 'admisiones_registro'],
  },
  {
    id: 'prestamos',
    icon: '🎾',
    title: 'Gestionar Préstamos',
    subTitle: 'Aprobar o rechazar préstamos',
    ruta: '/herramientas/prestamos' as Href,
    roles: ['administrador', 'bienestar', 'biblioteca'],
  },
  {
    id: 'escaner',
    icon: '📷',
    title: 'Escanear Carnets',
    subTitle: 'Escaneo y control de acceso',
    ruta: '/herramientas/escaner' as Href,
    roles: [
      'administrador',
      'seguridad',
      'escaneador',
      'bienestar',
      'biblioteca',
      'escaneador de bienestar',
      'escaneador de biblioteca',
    ],
  },
  {
    id: 'historial',
    icon: '📊',
    title: 'Consultar Historial',
    subTitle: 'Bitácora de entradas y salidas',
    ruta: '/herramientas/historial' as Href,
    roles: ['administrador', 'seguridad', 'escaneador'],
  },
  {
    id: 'qr_temporal',
    icon: '🔗',
    title: 'Generar QR',
    subTitle: 'Crear pases temporales',
    ruta: '/carnetTemporal/generarQr' as Href,
    roles: [
      'administrador',
      'docente',
      'administrativo',
      'seguridad',
      'generar carnet temporal',
    ],
  },
];

const Herramientas = () => {
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);

  useFocusEffect(
    useCallback(() => {
      getStoredUsuario().then(setUsuario);
    }, [])
  );

  const opcionesVisibles = TOOL_OPTIONS.filter((opt) =>
    hasAnyRole(usuario, opt.roles)
  );

  return (
    <ScrollView
      style={herramientasStyles.appBackGround}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 96 }}
    >
      <View style={herramientasStyles.topContainer}>
        <Text style={herramientasStyles.topText}>Herramientas de Gestión</Text>
        {usuario ? (
          <Text style={localStyles.roleBadge}>
            Perfil activo: {usuario.tipo_usuario?.toUpperCase()}
          </Text>
        ) : null}
      </View>

      {opcionesVisibles.length === 0 ? (
        <View style={localStyles.emptyBox}>
          <Text style={localStyles.emptyText}>
            Tu rol actual no tiene herramientas de gestión asignadas.
          </Text>
        </View>
      ) : (
        <View style={localStyles.grid}>
          {opcionesVisibles.map((item) => (
            <AdminOptions
              key={item.id}
              icon={item.icon}
              title={item.title}
              subTitle={item.subTitle}
              ruta={item.ruta}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  roleBadge: {
    textAlign: 'center',
    marginTop: 6,
    color: '#1a2a47',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  emptyBox: {
    margin: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default Herramientas;
