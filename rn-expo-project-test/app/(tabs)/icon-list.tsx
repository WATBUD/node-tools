import { View, Text, StyleSheet, ScrollView } from 'react-native';
import iconSetComponents from '@/components/CustomIconSet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IconListScreen() {
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">IcoMoon Custom Icons Demo</ThemedText>
        {iconSetComponents.map(set => (
          <View key={set.key} style={{ marginBottom: 32 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>{set.key}</Text>
            <View style={styles.iconGrid}>
              {set.iconNames.map(name => (
                <View key={name} style={styles.iconItem}>
                  <set.IconSet name={name} size={32} color="#007AFF" />
                  <Text style={styles.iconName}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  iconItem: {
    alignItems: 'center',
    width: 72,
    marginBottom: 16,
  },
  iconName: {
    fontSize: 12,
    marginTop: 4,
  },
}); 