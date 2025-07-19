import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet, ActivityIndicator } from 'react-native';

type TowingRequest = {
  id: number;
  customer_name: string;
  location: string;
  note?: string | null;
  status?: string | null;
};

export default function Index() {
  const [requests, setRequests] = useState<TowingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.1.80:8000/api/requests') // replace with your machine's local IP
      .then((response) => response.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching towing requests:', error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: TowingRequest }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.customer_name}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Note: {item.note || 'N/A'}</Text>
      <Text>Status: {item.status || 'pending'}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Towing Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
