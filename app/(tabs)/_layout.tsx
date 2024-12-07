import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? "#1763AB" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="new-task"
        options={{
          title: "New",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="plus.square.fill"
              color={focused ? "#1763AB" : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="rick-and-morty-characters"
        options={{
          title: "Rick & Morty",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name="ant.circle.fill"
              color={focused ? "#1763AB" : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
