import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Href, router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carnet from '@/components/carnet';
import CarnetsTemporalesCard from '@/components/carnetsTemporalesCard';
import Logout from '@/components/logout';
import Notificaciones from '@/components/notificaciones';
import {
  getStoredUsuario,
  hasAnyRole,
  UsuarioSession,
} from '@/constants/api';
import { styles } from '../../constants/tabStyles';

export default function Index() {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(async () => {
    const user = await getStoredUsuario();
    setUsuario(user);
    setRefreshTick((t) => t + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargar();
    setRefreshing(false);
  };

  const puedeGenerarTemp = hasAnyRole(usuario, [
    'generar carnet temporal',
    'administrador',
    'docente',
    'administrativo',
    'seguridad',
  ]);

  const idUsuarioStr = usuario ? String(usuario.id_usuario) : '';
  const nombreCompleto = usuario
    ? `${usuario.nombres} ${usuario.apellidos}`
    : 'Cargando...';

  return (
    <SafeAreaProvider>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[styles.appBackGround, { marginBottom: 10 }]}>
          <Carnet
            nombre={nombreCompleto}
            id={idUsuarioStr}
            programa={usuario?.programa ?? ''}
            tipoUsuario={usuario?.tipo_usuario ?? ''}
            foto={usuario?.foto ?? null}
          />

          {puedeGenerarTemp && idUsuarioStr ? (
            <CarnetsTemporalesCard
              idUsuario={idUsuarioStr}
              refreshTrigger={refreshTick}
            />
          ) : null}

          {idUsuarioStr ? (
            <Notificaciones
              idUsuario={idUsuarioStr}
              refreshTrigger={refreshTick}
            />
          ) : null}
        </View>

        <View style={localStyles.actionsRow}>
          <TouchableOpacity
            style={localStyles.passwordBtn}
            onPress={() =>
              router.push('/herramientas/cambiarContrasena' as Href)
            }
          >
            <Ionicons name="key-outline" size={18} color="#1a2a47" />
            <Text style={localStyles.passwordText}>Cambiar Contraseña</Text>
          </TouchableOpacity>

          <View style={localStyles.logoutWrap}>
            <Logout />
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const localStyles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  passwordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a2a47',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  passwordText: {
    color: '#1a2a47',
    fontWeight: 'bold',
    fontSize: 13,
  },
  logoutWrap: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d9534f',
    paddingVertical: 8,
    paddingLeft: 12,
  },
});
