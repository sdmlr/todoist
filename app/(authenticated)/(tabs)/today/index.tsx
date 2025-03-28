import Fab from "@/components/Fab";
import { useSQLiteContext } from "expo-sqlite";
import { View } from "react-native";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { todos } from "@/db/schema";

const Page = () => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db)

  useDrizzleStudio(db);

  const { data } = useLiveQuery(drizzleDb.select().from(todos))

  return (
    <View className="flex-1">
      <Fab />
    </View>
  );
};

export default Page;
