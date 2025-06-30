import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { Transaction } from '../types';

// Define the route params type
type EditTransactionParams = {
  id: string;
};

// Define navigation props for this screen
type Props = NativeStackScreenProps<{
  EditTransaction: EditTransactionParams;
}, 'EditTransaction'>;

export default function EditTransactionScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    const user = await AsyncStorage.getItem('loggedInUser');
    const data = await AsyncStorage.getItem(`transactions_${user}`);
    const txs: Transaction[] = data ? JSON.parse(data) : [];
    const tx = txs.find((t) => t.id === id);
    if (tx) {
      setAmount(tx.amount.toString());
      setDescription(tx.description);
    }
  };

  const saveEdit = async () => {
    const user = await AsyncStorage.getItem('loggedInUser');
    const data = await AsyncStorage.getItem(`transactions_${user}`);
    const txs: Transaction[] = data ? JSON.parse(data) : [];

    const updated = txs.map((tx) =>
      tx.id === id ? { ...tx, amount: parseFloat(amount), description } : tx
    );

    await AsyncStorage.setItem(`transactions_${user}`, JSON.stringify(updated));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Save Changes" onPress={saveEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
