import { Link, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BrowseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.backgroundAlt },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Browse",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="new-project"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const HeaderLeft = () => {
  const { user } = useUser();
  return (
    <Image
      source={{ uri: user?.imageUrl }}
      style={{ width: 32, height: 32, borderRadius: 16 }}
    />
  );
};

const HeaderRight = () => {
  return (
    // <Link href="/browse/settings">
    <Ionicons name="settings-outline" size={24} color={Colors.primary} />
    // </Link>
  );
};
