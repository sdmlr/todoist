import { Colors } from "@/constants/Colors";
import { todos } from "@/db/schema";
import { Todo } from "@/types/interfaces";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

interface TaskRowProps {
  task: Todo;
}
const TaskRow = ({ task }: TaskRowProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const markAsCompleted = async () => {
    console.log("markAsCompleted");
    await drizzleDb
      .update(todos)
      .set({ completed: 1, date_completed: Date.now() })
      .where(eq(todos.id, task.id));
  };
  return (
    <View>
      <Link
        href={`/task/${task.id}`}
        className="p-[14px] bg-white border-b border-lightBorder"
        asChild
      >
        <TouchableOpacity>
          <View className="flex-row items-start gap-[10px]">
            <BouncyCheckbox
              textContainerStyle={{ display: "none" }}
              size={25}
              fillColor={task.project_color}
              unFillColor="#fff"
              isChecked={task.completed === 1}
              textStyle={{
                color: "#000",
                fontSize: 16,
                textDecorationLine: "none",
              }}
              onPress={markAsCompleted}
            />
            <Text className="text-base flex-1">{task.name}</Text>
          </View>
          {/* <View className="w-full"> */}
          <Text
            className="text-xs text-dark"
            style={{ marginTop: 4, alignSelf: "flex-end" }}
          >
            {task.project_name}
          </Text>
          {/* </View> */}
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default TaskRow;
