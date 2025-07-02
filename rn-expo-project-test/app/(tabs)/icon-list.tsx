import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomIconSet, { getIconNames } from '@/components/CustomIconSet';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function IconListScreen() {
  const iconNames = getIconNames();
  return (
    <ScrollView>
      <ThemedView style={styles.container}>
        <ThemedText type="title">IcoMoon Custom Icons Demo</ThemedText>
        <View style={styles.iconGrid}>
          {iconNames.map(name => (
            <View key={name} style={styles.iconItem}>
              <CustomIconSet name={name} size={32} color="#007AFF" />
              <Text style={styles.iconName}>{name}</Text>
            </View>
          ))}
        </View>
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