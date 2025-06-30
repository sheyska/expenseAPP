import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Transaction } from '../types';


type Props = NativeStackScreenProps<any>;

export default function AddTransactionScreen({ navigation }: Props) {
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');

  const saveTransaction = async () => {
    if (!note || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description: note,
      date,
    };

    const stored = await AsyncStorage.getItem('transactions');
    const txs: Transaction[] = stored ? JSON.parse(stored) : [];

    txs.push(newTx);
    await AsyncStorage.setItem('transactions', JSON.stringify(txs));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Note</Text>
      <TextInput value={note} onChangeText={setNote} style={styles.input} />

      <Text style={styles.label}>Amount (use - for expense)</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />

      <Button title="Save Transaction" onPress={saveTransaction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
