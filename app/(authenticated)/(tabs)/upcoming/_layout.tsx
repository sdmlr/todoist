import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import MoreButton from "@/components/MoreButton"; // Example custom button

export default function UpcomingStackLayout() {
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
          title: "Upcoming",
          headerLargeTitle: true,
          headerRight: () => <MoreButton pageName="Upcoming" />,
        }}
      />
    </Stack>
  );
}
