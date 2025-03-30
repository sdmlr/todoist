import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";
import { View, Text } from "react-native";

const Layout = () => {
    const router = useRouter()
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTintColor: Colors.primary,
        contentStyle: { backgroundColor: Colors.backgroundAlt },
        headerTitleStyle: { color: "#000" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "New Project",
          headerTransparent: true,
          headerLeft: () => (
            <Button
              title="Cancel"
              color={Colors.primary}
              onPress={() => router.dismiss()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="color-select"
        options={{ title: "Color", headerTransparent: true }}
      />
    </Stack>
  );
};

export default Layout;
