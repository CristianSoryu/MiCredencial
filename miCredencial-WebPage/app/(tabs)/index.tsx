import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Href, router, useFocusEffect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Carnet from '@/components/carnet';
import CarnetsTemporalesCard from '@/components/carnetsTemporalesCard';
import Logout from '@/components/logout';
import Notificaciones from '@/components/notificaciones';
import {
  getStoredUsuario,
  isStaffUser,
  UsuarioSession,
} from '@/constants/api';
import { styles } from '../../constants/tabStyles';

export default function Index() {
  const insets = useSafeAreaInsets();
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

  const puedeVerTemporales = isStaffUser(usuario);

  const idUsuarioStr = usuario ? String(usuario.id_usuario) : '';
  const nombreCompleto = usuario
    ? `${usuario.nombres} ${usuario.apellidos}`
    : 'Cargando...';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f4f6f9' }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: Math.max(insets.bottom, 16) + 96,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.appBackGround}>
        <Carnet
          nombre={nombreCompleto}
          id={idUsuarioStr}
          programa={usuario?.programa ?? ''}
          tipoUsuario={usuario?.tipo_usuario ?? ''}
          foto={usuario?.foto ?? null}
        />

        {puedeVerTemporales && idUsuarioStr ? (
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
          <Text style={localStyles.passwordText} numberOfLines={1}>
            Cambiar Contraseña
          </Text>
        </TouchableOpacity>

        <View style={localStyles.logoutWrap}>
          <Logout showLabel />
        </View>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
    maxWidth: 520,
    alignSelf: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 12,
  },
  passwordBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a2a47',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
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
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
});
