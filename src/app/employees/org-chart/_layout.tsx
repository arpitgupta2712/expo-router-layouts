import { Stack } from 'expo-router';

export default function OrgChartLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Organization Chart',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
