import { Todo } from '@/types/interfaces'
import { View, Text } from 'react-native'

interface TaskRowProps {
    task: Todo;
}
const TaskRow = ({ task }: TaskRowProps) => {
  return (
    <View>
      <Text>{task.name}</Text>
    </View>
  )
}

export default TaskRow