import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>✳️</Text>
        <Text style={styles.header}>Register</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput style={styles.input} keyboardType="phone-pad" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} secureTextEntry={true} />

          <Text style={styles.label}>Again Password</Text>
          <TextInput style={styles.input} secureTextEntry={true} />
        </View>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>have an Account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/home')}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 60, color: '#10B981', marginBottom: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  inputGroup: { width: '100%' },
  label: { fontSize: 14, color: '#374151', marginBottom: 5 },
  input: { borderBottomWidth: 1, borderBottomColor: '#D1D5DB', paddingVertical: 10, marginBottom: 25, fontSize: 16 },
  linkText: { color: '#10B981', alignSelf: 'flex-end', marginBottom: 30, fontWeight: '600' },
  button: { backgroundColor: '#10B981', width: '100%', padding: 18, borderRadius: 35, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }
});