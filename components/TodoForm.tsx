import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Todo } from "@/types/interfaces";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { projects, todos } from "@/db/schema";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { eq } from "drizzle-orm";

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
    mode: "onChange",
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

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
    if (todo) {
      //UPDATE
      await drizzleDb
        .update(todos)
        .set({
          name: data.name,
          description: data.description,
          project_id: selectedProject.id,
          due_date: 0, // TODO
        })
        .where(eq(todos.id, todo.id));
    } else {
      //create
      await drizzleDb.insert(todos).values({
        name: data.name,
        description: data.description,
        project_id: selectedProject.id,
        priority: 0,
        date_added: Date.now(),
        completed: 0,
        due_date: 0, //TODO add due date
      });
    }
  };
  return (
    <View>
      <ScrollView
        keyboardShouldPersistTaps="always"
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
              style={{ fontSize: 18, paddingHorizontal: 16 }}
            />
          )}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          className="space-x-2"
          style={{ flexDirection: "row", paddingHorizontal: 16 }}
        >
          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md justify-center items-center flex-row mr-2"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons name="calendar-outline" size={24} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Date</Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={({ pressed }) => {
              return [
                {
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: Colors.lightBorder,
                  borderRadius: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 4,
                },
                {
                  backgroundColor: pressed ? Colors.lightBorder : "transparent",
                },
              ];
            }}
          >
            <Ionicons name="flag-outline" size={24} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Priority</Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons name="location-outline" size={20} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Location</Text>
          </Pressable>

          <Pressable
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={{ paddingHorizontal: 12, paddingVertical: 8, gap: 4 }}
          >
            <Ionicons name="pricetags-outline" size={20} color={Colors.dark} />
            <Text className="text-[14px] text-dark font-medium">Location</Text>
          </Pressable>
        </ScrollView>

        <View
          className="flex-row items-center border-t-[0.5px] border-lightBorder justify-between"
          style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
        >
          <Pressable
          onPress={() => console.log()}
          
            className="border-[0.5px] border-lightBorder rounded-md mr-2 justify-center items-center flex-row"
            style={[
              { paddingHorizontal: 12, paddingVertical: 8, gap: 4 },
              { opacity: errors.name ? 0.5 : 1 },
            ]}
          >
            <Ionicons
              name="pricetags-outline"
              size={20}
              color={Colors.primary}
            />
            <Text className="text-[14px] text-dark font-medium">Location</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="rounded-full"
            style={{ backgroundColor: Colors.dark, padding: 6, opacity: errors.name ? 0.5 : 1}}
          >
            <Ionicons name="arrow-up" size={24} color={"#fff"} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default TodoForm;
