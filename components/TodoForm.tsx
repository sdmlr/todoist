import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Todo } from "@/types/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { projects } from "@/db/schema";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type TodoFormProps = {
  todo?: Todo & {
    project_name: string;
    project_color: string;
    project_id: number;
  };
};

type TodoFormData = {
  name: string;
  description: string;
};

const TodoForm = ({ todo }: TodoFormProps) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TodoFormData>({
    defaultValues: {
      name: todo?.name || "",
      description: todo?.description || "",
    },
  });

  const { data } = useLiveQuery(drizzleDb.select().from(projects));
  const [selectedProject, setSelectedProject] = useState(
    todo?.project_id
      ? {
          id: todo.project_id,
          name: todo.project_name,
          color: todo.project_color,
        }
      : {
          id: 1,
          name: "Inbox",
          color: "#000",
        }
  );

  const onSubmit: SubmitHandler<TodoFormData> = (data) => {
    console.log("SUBMIT");
  };
  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: "#fff",
          gap: 12,
          paddingTop: 16,
        }}
      >
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Task name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoFocus
              autoCorrect={false}
              style={{ fontSize: 20, paddingHorizontal: 16 }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              style={{ fontSize: 20, paddingHorizontal: 16 }}
            />
          )}
        />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ flexDirection: "row", paddingHorizontal: 16 }}
        >
          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row gap-1"
            style={{ paddingHorizontal: 12, paddingVertical: 8 }}
          >
            <Ionicons name="flag-outline" size={24} color={Colors.primary} />
            <Text>Priority</Text>
          </Pressable>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default TodoForm;
