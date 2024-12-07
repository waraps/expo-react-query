import { Text, View } from "react-native";
import React from "react";
import { TaskStatus } from "@/constants";
import { getTaskBadgeStyles } from "@/helpers";

interface IBadgeStatusProps {
  status: TaskStatus;
}

const BadgeStatus = ({ status }: IBadgeStatusProps) => {
  const { title, backgroundColor, borderColor } = getTaskBadgeStyles(status);

  return (
    <View
      style={{
        justifyContent: "center",
        borderRadius: 5,
        borderWidth: 1.5,
        padding: 3,
        borderColor,
        backgroundColor,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: borderColor,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </View>
  );
};

export default BadgeStatus;
