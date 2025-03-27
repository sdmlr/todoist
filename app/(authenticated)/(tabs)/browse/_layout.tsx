import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import MoreButton from "@/components/MoreButton"; // Example custom button

export default function BrowseStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Browse",
          headerLargeTitle: true,
          headerRight: () => <MoreButton />,
        }}
      />
      {/* If you had deeper routes like "details.tsx", you'd add them here too */}
    </Stack>
  );
}
