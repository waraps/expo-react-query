import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 20 }}>Searching ...</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

export default Loading;
