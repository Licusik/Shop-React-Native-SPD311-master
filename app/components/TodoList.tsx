import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const STORAGE_KEY = '@todolist_todos';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (!loading && todos.length >= 0) {
      saveTodos();
    }
  }, [todos, loading]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedTodos !== null) {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(parsedTodos);
      } else {
        await fetchTodosFromAPI();
      }
    } catch (err) {
      setError('Помилка завантаження завдань');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async () => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Помилка', 'Не вдалося зберегти завдання');
    }
  };

  const fetchTodosFromAPI = async () => {
    try {
      const response = await fetch('https://dummyjson.com/todos');
      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setError('Помилка завантаження завдань з API');
      console.error('API error:', err);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') {
      Alert.alert('Помилка', 'Введіть текст завдання');
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      todo: newTodoText.trim(),
      completed: false,
      userId: 1,
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    setNewTodoText('');
    setModalVisible(false);
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearAllTodos = () => {
    Alert.alert(
      'Очистити всі завдання',
      'Ви впевнені? Ця дія незворотна.',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Очистити',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setTodos([]);
            } catch (err) {
              console.error('Clear error:', err);
              Alert.alert('Помилка', 'Не вдалося очистити завдання');
            }
          }
        }
      ]
    );
  };

  const reloadFromAPI = () => {
    Alert.alert(
      'Перезавантажити дані',
      'Це замінить всі поточні завдання даними з API',
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Перезавантажити',
          onPress: async () => {
            try {
              setLoading(true);
              await fetchTodosFromAPI();
            } catch (err) {
              setError('Помилка завантаження');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItemContainer}>
      <TouchableOpacity
        style={styles.todoItem}
        onPress={() => toggleTodo(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.todoContent}>
          <View
            style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted,
            ]}
          >
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text
            style={[
              styles.todoText,
              item.completed && styles.todoTextCompleted,
            ]}
          >
            {item.todo}
          </Text>
        </View>
        <Text style={styles.todoId}>#{item.id}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>TODO List</Text>
      <Text style={styles.headerDate}>
        {new Date().toLocaleDateString('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
      <Text style={styles.headerStats}>
        Всього: {todos.length} | Виконано: {todos.filter(t => t.completed).length}
      </Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={reloadFromAPI}
        >
          <Text style={styles.headerButtonText}>🔄 Завантажити з API</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerButton, styles.headerButtonDanger]}
          onPress={clearAllTodos}
        >
          <Text style={styles.headerButtonText}>🗑️ Очистити все</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Немає завдань</Text>
      <Text style={styles.emptySubtext}>Натисніть + щоб додати нове</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5B7FFF" />
          <Text style={styles.loadingText}>Завантаження...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTodos}>
            <Text style={styles.retryButtonText}>Спробувати знову</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C2C2E" />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🕐</Text>
        </TouchableOpacity>
        <View style={styles.navButtonPlaceholder} />
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Нове завдання</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Введіть завдання..."
              placeholderTextColor="#8E8E93"
              value={newTodoText}
              onChangeText={setNewTodoText}
              multiline
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTodoText('');
                }}
              >
                <Text style={styles.modalButtonTextCancel}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonAdd]}
                onPress={addTodo}
              >
                <Text style={styles.modalButtonTextAdd}>Додати</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E',
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#2C2C2E',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerDate: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  headerStats: {
    fontSize: 14,
    color: '#5B7FFF',
    marginTop: 4,
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    flex: 1,
    backgroundColor: '#3A3A3C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  headerButtonDanger: {
    backgroundColor: '#5C1A1A',
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  todoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  todoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3A3A3C',
    padding: 16,
    borderRadius: 12,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5B7FFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#5B7FFF',
    borderColor: '#5B7FFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  todoId: {
    fontSize: 12,
    color: '#636366',
    marginLeft: 8,
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF453A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5B7FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B7FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  navButton: {
    padding: 8,
  },
  navButtonPlaceholder: {
    width: 56,
  },
  navIcon: {
    fontSize: 24,
    color: '#8E8E93',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FF453A',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#5B7FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#636366',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#3A3A3C',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#3A3A3C',
  },
  modalButtonAdd: {
    backgroundColor: '#5B7FFF',
  },
  modalButtonTextCancel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextAdd: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TodoList;