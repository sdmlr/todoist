import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { toast } from "sonner-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics'

const Fab = () => {
  const router = useRouter();

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push('/task/new')
  };

  return (
    <TouchableOpacity
      // className="absolute bottom-5 right-5 z-[1000] bg-primary p-2.5 rounded-full items-center justify-center"
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        height: 56,
        width: 56,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Ionicons name="add" size={28} color="white" />
    </TouchableOpacity>
  );
};

export default Fab;
