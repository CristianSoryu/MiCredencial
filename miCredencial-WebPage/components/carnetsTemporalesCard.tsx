import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_BASE_URL } from '@/constants/api';
import { styles as tabStyles } from '../constants/tabStyles';

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
                  {item.tipo === 'grupo' ? 'Grupo / Institución' : `Doc: ${item.documento}`} • {item.motivo}
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
          <View style={localStyles.modalCard}>
            <Text style={localStyles.modalTitle}>{selected?.nombre}</Text>
            <Text style={localStyles.modalSub}>
              {selected?.tipo === 'grupo'
                ? 'GRUPO / INSTITUCIÓN'
                : `Documento: ${selected?.documento}`}
            </Text>
            <View style={localStyles.qrWrap}>
              {selected?.codigo_qr_base64 ? (
                <QRCode value={selected.codigo_qr_base64} size={180} />
              ) : null}
            </View>
            <Text style={localStyles.modalDetail}>Motivo: {selected?.motivo}</Text>
            <Text style={localStyles.modalDetail}>
              Anfitrión: {selected?.anfitrion}
            </Text>
            <Text style={localStyles.modalDetail}>
              Expira: {selected?.fecha_expiracion}
            </Text>
            <TouchableOpacity
              style={localStyles.closeBtn}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a2a47', textAlign: 'center' },
  modalSub: { fontSize: 12, color: '#666', marginTop: 4 },
  qrWrap: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
  },
  modalDetail: { fontSize: 13, color: '#333', marginBottom: 4, textAlign: 'center' },
  closeBtn: {
    marginTop: 14,
    backgroundColor: '#1a2a47',
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default CarnetsTemporalesCard;
