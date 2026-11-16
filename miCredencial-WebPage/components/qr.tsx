import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QrProps {
  cedula: string;
  size?: number;
}

const Qr = ({ cedula, size }: QrProps) => {
  const { width } = useWindowDimensions();
  const responsiveSize = size ?? Math.min(Math.round(width * 0.46), 190);
  const [qrValue, setQrValue] = useState('');
  const [segundos, setSegundos] = useState(60);

  const generarQR = () => {
    const fecha = new Date().toISOString().slice(0, 16);
    const raw = `${cedula}_${fecha}`;
    const encoded = btoa(unescape(encodeURIComponent(raw)));
    setQrValue(encoded);
    setSegundos(60);
  };

  useEffect(() => {
    if (!cedula) return;
    generarQR();
    const intervalo = setInterval(generarQR, 60000);
    return () => clearInterval(intervalo);
  }, [cedula]);

  useEffect(() => {
    const tick = setInterval(
      () => setSegundos((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(tick);
  }, []);

  const urgente = segundos <= 15;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, urgente && styles.urgente]}>
        {qrValue ? (
          <QRCode
            value={qrValue}
            size={responsiveSize}
            color="#000"
            backgroundColor="#fff"
          />
        ) : null}
      </View>
      <Text style={[styles.timer, urgente && styles.timerUrgente]}>
        {urgente ? '⚠ ' : ''}Válido por {segundos}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', marginTop: 4 },
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  urgente: { borderColor: '#cc0000' },
  timer: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#555' },
  timerUrgente: { color: '#cc0000' },
});

export default Qr;
