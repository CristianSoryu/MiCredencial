import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export interface TemporalPassData {
  tipo: string;
  nombre: string;
  documento: string | null;
  motivo: string;
  fecha_expiracion: string;
  codigo_qr_base64: string;
  anfitrion: string;
}

interface Props {
  carnet: TemporalPassData;
}

const CarnetTemporalTicket = ({ carnet }: Props) => {
  const ticketRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);

  const docTexto =
    carnet.tipo === 'grupo'
      ? 'GRUPO / INSTITUCIÓN'
      : carnet.documento || 'N/A';

  const compartirWhatsAppPNG = async () => {
    if (!ticketRef.current) return;
    setSharing(true);
    try {
      if (Platform.OS === 'web') {
        const dataUri = await captureRef(ticketRef, {
          format: 'png',
          quality: 1,
          result: 'data-uri',
        });
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `carnet_temporal_${carnet.nombre.replace(/\s+/g, '_')}.png`;
        link.click();
        Alert.alert(
          'PNG descargado',
          'En navegador se descargó la imagen PNG para enviarla por WhatsApp Web.'
        );
        return;
      }

      const uri = await captureRef(ticketRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert(
          'No disponible',
          'El menú de compartir no está disponible en este dispositivo.'
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Compartir pase temporal de ${carnet.nombre} por WhatsApp`,
        UTI: 'public.png',
      });
    } catch {
      Alert.alert(
        'Error',
        'No se pudo generar o compartir la imagen PNG del carnet.'
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <View
        ref={ticketRef}
        collapsable={false}
        style={styles.ticketCard}
      >
        <View style={styles.ticketHeader}>
          <Image
            source={require('../assets/images/logoUniversidad.png')}
            style={styles.logo}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.uniTitle}>UNIVERSIDAD LIBRE</Text>
            <Text style={styles.uniSub}>SECCIONAL CÚCUTA</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>TEMPORAL</Text>
          </View>
        </View>

        <View style={styles.qrBox}>
          {carnet.codigo_qr_base64 ? (
            <QRCode
              value={carnet.codigo_qr_base64}
              size={175}
              color="#000"
              backgroundColor="#fff"
            />
          ) : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Visitante</Text>
            <Text style={styles.valName} numberOfLines={2}>
              {carnet.nombre}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Documento</Text>
            <Text style={styles.val}>{docTexto}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Motivo</Text>
            <Text style={styles.val} numberOfLines={2}>
              {carnet.motivo}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Anfitrión</Text>
            <Text style={styles.val} numberOfLines={1}>
              {carnet.anfitrion}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Expira</Text>
            <Text style={[styles.val, { color: '#c62828' }]}>
              {carnet.fecha_expiracion}
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>Control de Acceso Digital • miCredencial</Text>
      </View>

      <TouchableOpacity
        style={styles.whatsappBtn}
        onPress={compartirWhatsAppPNG}
        disabled={sharing}
        activeOpacity={0.85}
      >
        {sharing ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.whatsappText}>Compartir PNG por WhatsApp</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#d4af37',
    overflow: 'hidden',
    elevation: 4,
  },
  ticketHeader: {
    backgroundColor: '#1a2a47',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  logo: { width: 38, height: 38, resizeMode: 'contain' },
  uniTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  uniSub: { color: '#d4af37', fontSize: 10, fontWeight: '600' },
  badge: {
    backgroundColor: '#C00000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  infoBlock: { paddingHorizontal: 16, paddingVertical: 12, gap: 6 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  label: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  valName: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a2a47',
  },
  val: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
  },
  footer: {
    backgroundColor: '#f9fafb',
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  whatsappBtn: {
    marginTop: 14,
    width: '100%',
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  whatsappText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CarnetTemporalTicket;
