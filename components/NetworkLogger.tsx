import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import NetworkLogger from "react-native-network-logger";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const NetworkLoggerComponent = () => {
  const [show, setShow] = useState<boolean>(false);

  const toggleNetworkLogger = () => setShow(!show);

  return (
    <SafeAreaView
      style={{ position: "absolute", zIndex: 10, right: 0 }}
      edges={["top"]}
    >
      <TouchableOpacity
        onPress={toggleNetworkLogger}
        style={{ alignSelf: "flex-end", marginRight: 10, marginTop: 10 }}
      >
        <Text className="text-lg">📡</Text>
      </TouchableOpacity>

      {show ? (
        <View
          style={{
            width: windowWidth,
            height: windowHeight,
          }}
        >
          <NetworkLogger theme="dark" />
        </View>
      ) : undefined}
    </SafeAreaView>
  );
};

export default NetworkLoggerComponent;
