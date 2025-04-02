import Fab from "@/components/Fab";
import { Colors } from "@/constants/Colors";
import { projects } from "@/db/schema";
import { useAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { eq } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, Button, TouchableOpacity, FlatList } from "react-native";
import * as ContextMenu from "zeego/context-menu";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useRevenueCat } from "@/providers/RevenueCat";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const Page = () => {
  const { signOut } = useAuth();
  const router = useRouter();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const { data } = useLiveQuery(drizzleDb.select().from(projects), []);
  const { isPro } = useRevenueCat();
  console.log("Page - data:", data);

  const onDeleteProject = async (id: number) => {
    await drizzleDb.delete(projects).where(eq(projects.id, id));
  };

  const onNewProject = async () => {
    console.log("isPro: ", isPro);

    if (data.length >= 5 && !isPro) {
      goPro();
    } else {
      router.push("/browse/new-project");
    }
  };

  const goPro = async () => {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
    });

    console.log(paywallResult);

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  };

  return (
    <>
      <View className="flex-1 p-[20px]">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold m-[10px]">My Projects</Text>
          <TouchableOpacity onPress={onNewProject}>
            <Ionicons name="add" size={24} color={Colors.dark} />
          </TouchableOpacity>
        </View>
        <Animated.FlatList
          data={data}
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item }) => (
            <ContextMenu.Root key={item.id}>
              <ContextMenu.Trigger>
                <TouchableOpacity className="flex-row items-center p-[14px] bg-white rounded-md gap-4">
                  <Text style={{ color: item.color }}>#</Text>
                  <Text className="text-base">{item.name}</Text>
                </TouchableOpacity>
              </ContextMenu.Trigger>
              <ContextMenu.Content>
                <ContextMenu.Item
                  key="delete"
                  onSelect={() => onDeleteProject(item.id)}
                >
                  <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
                  <ContextMenu.ItemIcon
                    ios={{ name: "trash", pointSize: 18 }}
                    androidIconName="ic_menu_delete"
                  />
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Root>
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-lightBorder" />
          )}
          ListFooterComponent={
            <TouchableOpacity className="p-[14px] bg-white rounded-md mt-[10px] items-center">
              <Text className="text-primary text-[18px]">Log Out</Text>
            </TouchableOpacity>
          }
        />
        <Button title="Sign Out" onPress={() => signOut()} />
      </View>
      <Fab />
    </>
  );
};

export default Page;
