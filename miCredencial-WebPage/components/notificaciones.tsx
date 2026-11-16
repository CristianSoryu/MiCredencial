import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_BASE_URL } from '@/constants/api';
import { styles as tabStyles } from '../constants/tabStyles';

export interface NotificacionItem {
  id_notificacion: number;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'alerta' | 'exito' | 'prestamo';
  leida: boolean;
  fecha: string;
}

interface NotificacionesProps {
  idUsuario: string;
  refreshTrigger?: number;
}

const Notificaciones = ({
  idUsuario,
  refreshTrigger = 0,
}: NotificacionesProps) => {
  const [items, setItems] = useState<NotificacionItem[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<NotificacionItem | null>(null);

  const cargarNotificaciones = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/notificaciones.php?id_usuario=${encodeURIComponent(idUsuario)}`
      );
      const data = await res.json();
      if (data.success) {
        setItems(data.notificaciones || []);
        setNoLeidas(data.no_leidas || 0);
      }
    } catch {
      // Silencioso en caso de desconexión temporal
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones, refreshTrigger]);

  const abrirNotificacion = async (item: NotificacionItem) => {
    setSelected(item);
    if (!item.leida) {
      setItems((prev) =>
        prev.map((n) =>
          n.id_notificacion === item.id_notificacion ? { ...n, leida: true } : n
        )
      );
      setNoLeidas((prev) => Math.max(0, prev - 1));
      try {
        await fetch(`${API_BASE_URL}/notificaciones.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_usuario: idUsuario,
            id_notificacion: item.id_notificacion,
            accion: 'leer',
          }),
        });
      } catch {
        // Ignore network error on read receipt
      }
    }
  };

  const marcarTodasLeidas = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    setNoLeidas(0);
    try {
      await fetch(`${API_BASE_URL}/notificaciones.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: idUsuario,
          accion: 'leer_todas',
        }),
      });
    } catch {
      // Ignore
    }
  };

  const getColors = (tipo: NotificacionItem['tipo']) => {
    switch (tipo) {
      case 'alerta':
        return {
          bg: '#ffecec',
          border: '#ff4d4d',
          icon: 'alert-circle' as const,
          color: '#d9534f',
        };
      case 'exito':
        return {
          bg: '#e8f5e9',
          border: '#66bb6a',
          icon: 'checkmark-circle' as const,
          color: '#2e7d32',
        };
      case 'prestamo':
        return {
          bg: '#fff8e1',
          border: '#ffb300',
          icon: 'cube' as const,
          color: '#e65100',
        };
      default:
        return {
          bg: '#e3f2fd',
          border: '#42a5f5',
          icon: 'information-circle' as const,
          color: '#1565c0',
        };
    }
  };

  return (
    <View style={tabStyles.card}>
      <View
        style={[
          tabStyles.topCard,
          { justifyContent: 'space-between', alignItems: 'center' },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="notifications" size={18} color="#d4af37" />
          <Text style={tabStyles.uniName}>Notificaciones</Text>
          {noLeidas > 0 && (
            <View style={localStyles.badge}>
              <Text style={localStyles.badgeText}>{noLeidas}</Text>
            </View>
          )}
        </View>
        {noLeidas > 0 && (
          <TouchableOpacity onPress={marcarTodasLeidas}>
            <Text style={{ color: '#d4af37', fontSize: 12, fontWeight: '600' }}>
              Leer todas
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={tabStyles.infoContainer}>
        {loading && items.length === 0 ? (
          <ActivityIndicator size="small" color="#1a2a47" />
        ) : items.length === 0 ? (
          <Text style={{ color: '#777', textAlign: 'center', paddingVertical: 10 }}>
            No tienes notificaciones nuevas.
          </Text>
        ) : (
          items.map((item) => {
            const c = getColors(item.tipo);
            return (
              <TouchableOpacity
                key={item.id_notificacion}
                onPress={() => abrirNotificacion(item)}
                style={[
                  localStyles.row,
                  {
                    backgroundColor: c.bg,
                    borderColor: c.border,
                    opacity: item.leida ? 0.72 : 1,
                  },
                ]}
              >
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {!item.leida && <View style={localStyles.unreadDot} />}
                    <Text style={localStyles.titulo} numberOfLines={1}>
                      {item.titulo}
                    </Text>
                  </View>
                  <Text style={localStyles.preview} numberOfLines={2}>
                    {item.mensaje}
                  </Text>
                  <Text style={localStyles.fecha}>{item.fecha}</Text>
                </View>
                <Ionicons name={c.icon} size={22} color={c.color} />
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={localStyles.modalBackdrop}>
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>{selected?.titulo}</Text>
            <Text style={localStyles.modalDate}>{selected?.fecha}</Text>
            <Text style={localStyles.modalBody}>{selected?.mensaje}</Text>
            <TouchableOpacity
              style={localStyles.modalBtn}
              onPress={() => setSelected(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  badge: {
    backgroundColor: '#d9534f',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d9534f',
  },
  titulo: { fontWeight: 'bold', color: '#1a2a47', fontSize: 14, flexShrink: 1 },
  preview: { color: '#444', fontSize: 12, marginTop: 3 },
  fecha: { color: '#888', fontSize: 10, marginTop: 4 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2a47' },
  modalDate: { fontSize: 11, color: '#888', marginTop: 4, marginBottom: 12 },
  modalBody: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 18 },
  modalBtn: {
    backgroundColor: '#1a2a47',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default Notificaciones;
