import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_BASE_URL } from '@/constants/api';
import { styles as tabStyles } from '../constants/tabStyles';
import CarnetTemporalTicket from './CarnetTemporalTicket';

interface CarnetTemporalItem {
  id_temporal: number;
  tipo: 'persona' | 'grupo';
  nombre: string;
  documento: string | null;
  motivo: string;
  hora_expiracion: string;
  fecha_expiracion: string;
  codigo_qr_base64: string;
  anfitrion: string;
}

interface Props {
  idUsuario: string;
  refreshTrigger?: number;
}

const CarnetsTemporalesCard = ({ idUsuario, refreshTrigger = 0 }: Props) => {
  const [carnets, setCarnets] = useState<CarnetTemporalItem[]>([]);
  const [selected, setSelected] = useState<CarnetTemporalItem | null>(null);

  const cargar = useCallback(async () => {
    if (!idUsuario) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/carnets_temporales.php?id_usuario=${encodeURIComponent(idUsuario)}`
      );
      const data = await res.json();
      if (data.success && data.permitido) {
        setCarnets(data.carnets || []);
      }
    } catch {
      // Ignore network hiccup
    }
  }, [idUsuario]);

  useEffect(() => {
    cargar();
  }, [cargar, refreshTrigger]);

  return (
    <View style={tabStyles.card}>
      <View style={[tabStyles.topCard, { alignItems: 'center', gap: 8 }]}>
        <Ionicons name="id-card" size={18} color="#d4af37" />
        <Text style={tabStyles.uniName}>Carnets Temporales Activos</Text>
      </View>
      <View style={tabStyles.infoContainer}>
        {carnets.length === 0 ? (
          <Text style={{ color: '#777', textAlign: 'center', paddingVertical: 8 }}>
            No hay carnets temporales vigentes.
          </Text>
        ) : (
          carnets.map((item) => (
            <TouchableOpacity
              key={item.id_temporal}
              style={localStyles.itemRow}
              onPress={() => setSelected(item)}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={localStyles.itemName} numberOfLines={1}>
                  {item.nombre}
                </Text>
                <Text style={localStyles.itemSub} numberOfLines={1}>
                  {item.tipo === 'grupo'
                    ? 'Grupo / Institución'
                    : `Doc: ${item.documento}`}{' '}
                  • {item.motivo}
                </Text>
              </View>
              <View style={localStyles.expBox}>
                <Text style={localStyles.expText}>{item.hora_expiracion}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={localStyles.backdrop}>
          <ScrollView
            contentContainerStyle={localStyles.modalScroll}
            style={{ width: '100%' }}
          >
            <View style={localStyles.modalCard}>
              {selected ? <CarnetTemporalTicket carnet={selected} /> : null}
              <TouchableOpacity
                style={localStyles.closeBtn}
                onPress={() => setSelected(null)}
              >
                <Text style={{ color: '#1a2a47', fontWeight: 'bold' }}>
                  Cerrar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4dd0e1',
    marginBottom: 10,
  },
  itemName: { fontWeight: 'bold', fontSize: 14, color: '#1a2a47' },
  itemSub: { fontSize: 11, color: '#555', marginTop: 2 },
  expBox: {
    backgroundColor: '#ceedf0',
    borderLeftWidth: 3,
    borderLeftColor: '#294a86',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  expText: { fontWeight: 'bold', fontSize: 12, color: '#1a2a47' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f4f6f9',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#e5e7eb',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CarnetsTemporalesCard;
