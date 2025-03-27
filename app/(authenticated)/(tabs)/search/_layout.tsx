import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import MoreButton from "@/components/MoreButton"; // Example custom button

export default function SearchStackLayout() {
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
          title: "Search",
          headerLargeTitle: true,
          headerRight: () => <MoreButton />,
        }}
      />
      {/* If you had deeper routes like "details.tsx", you'd add them here too */}
    </Stack>
  );
}
