import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { Transaction } from '../types';


type Props = NativeStackScreenProps<any>;

export default function HomeScreen({ navigation }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [today, setToday] = useState('');

  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    setToday(todayDate);
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await AsyncStorage.getItem('transactions');
    if (data) {
      setTransactions(JSON.parse(data));
    }
  };

  const saveTransactions = async (newList: Transaction[]) => {
    setTransactions(newList);
    await AsyncStorage.setItem('transactions', JSON.stringify(newList));
  };

  const addTransaction = async () => {
    if (!amount || !description) return;
    const date = new Date().toISOString().split('T')[0];
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      date,
    };
    const newList = [newTransaction, ...transactions];
    saveTransactions(newList);
    setAmount('');
    setDescription('');
  };

  const deleteTransaction = async (id: string) => {
    const updatedList = transactions.filter((item) => item.id !== id);
    saveTransactions(updatedList);
  };

  const todaysTransactions = transactions.filter((t) => t.date === today);
  const totalToday = todaysTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <Text style={styles.dateText}>Today's Date: {today}</Text>
      <Text style={styles.totalText}>Total Expense Today: ₱{totalToday.toFixed(2)}</Text>

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <Button title="Add Expense" onPress={addTransaction} />

      <Text style={styles.sectionTitle}>Today's Transactions</Text>
      <FlatList
        data={todaysTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemText}>
              <Text>{item.description}</Text>
              <Text>₱{item.amount}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTransaction(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>No expenses today.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#e6f7ff',
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  dateText: { fontSize: 16, textAlign: 'center', marginBottom: 5 },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
  itemText: { flex: 1 },
  deleteButton: { padding: 5, backgroundColor: 'red', borderRadius: 4 },
  deleteText: { color: 'white' },
});
