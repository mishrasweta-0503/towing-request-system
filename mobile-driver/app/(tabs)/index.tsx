import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, View, StyleSheet, ActivityIndicator,Button } from 'react-native';

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
      <Text style={styles.text}>Location: {item.location}</Text>
      <Text style={styles.text}>Note: {item.note || 'N/A'}</Text>
      <Text style={styles.text}>Status: {item.status || 'pending'}</Text>
      {item.status !== 'assigned' && (
      <Button
        title="Accept Request"
        onPress={() => acceptRequest(item.id)}
        color="#28a745"
      />
    )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </SafeAreaView>
    );
  }

  const acceptRequest = async (id: number) => {
    try {
      const res = await fetch(`http://192.168.1.80:8000/api/requests/${id}/accept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        alert('Request accepted!');
        // Refresh requests after accepting
        fetchRequests();
      } else {
        alert('Failed to accept request.');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error accepting request.');
    }
  };
  
  // Create reusable fetch
  const fetchRequests = () => {
    setLoading(true);
    fetch('http://192.168.1.80:8000/api/requests')
      .then((response) => response.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching towing requests:', error);
        setLoading(false);
      });
  };
  
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
      paddingHorizontal: 16,
      paddingTop: 40,
      backgroundColor: '#e0f7fa', // light teal background
  },
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#007BFF',
  },
  card: {
      backgroundColor: '#ffffff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      marginBottom: 4,
  },
  text: {
      fontSize: 16,
      color: '#555555',
      marginBottom: 2,
  }
});

