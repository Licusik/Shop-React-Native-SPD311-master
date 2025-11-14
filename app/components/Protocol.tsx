import React, { ReactElement, useRef, useState } from 'react';
import {
    Alert,
    GestureResponderEvent,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Point {
  x: number;
  y: number;
}

interface ParticipantData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  carModel: string;
  carNumber: string;
}

interface DamageData {
  side: string;
  description: string;
}

interface ProtocolData {
  participantA: ParticipantData;
  participantB: ParticipantData;
  damage: DamageData;
  sketch: Point[][] | null;
}

interface Navigation {
  navigate: (screen: string) => void;
  goBack: () => void;
}

interface ScreenProps {
  navigation: Navigation;
  protocolData: ProtocolData;
  setProtocolData: React.Dispatch<React.SetStateAction<ProtocolData>>;
}

interface StackScreenProps {
  name: string;
  component: React.ComponentType<any>;
}

interface StackNavigatorProps {
  children: ReactElement<StackScreenProps>[];
  initialRouteName: string;
}

const Stack = {
  Navigator: ({ children, initialRouteName }: StackNavigatorProps) => {
    const [currentScreen, setCurrentScreen] = useState<string>(initialRouteName);
    const [protocolData, setProtocolData] = useState<ProtocolData>({
      participantA: {
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        carModel: '',
        carNumber: ''
      },
      participantB: {
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
        carModel: '',
        carNumber: ''
      },
      damage: { side: '', description: '' },
      sketch: null
    });

    const navigation: Navigation = {
      navigate: (screen: string) => setCurrentScreen(screen),
      goBack: () => {
        const screens = ['Home', 'ParticipantA', 'ParticipantB', 'Damage'];
        const currentIndex = screens.indexOf(currentScreen);
        if (currentIndex > 0) {
          setCurrentScreen(screens[currentIndex - 1]);
        }
      }
    };

    const childArray = React.Children.toArray(children) as ReactElement<StackScreenProps>[];
    const currentChild = childArray.find(
      (child) => child.props.name === currentScreen
    );

    if (!currentChild) return null;

    const Component = currentChild.props.component;
    return <Component navigation={navigation} protocolData={protocolData} setProtocolData={setProtocolData} />;
  },
  Screen: ({ name, component }: StackScreenProps) => null
};

const HomeScreen: React.FC<{ navigation: Navigation }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.mainTitle}>🚗 Європротокол</Text>
        <Text style={styles.subtitle}>Оформлення ДТП онлайн</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ParticipantA')}
        >
          <Text style={styles.buttonText}>Оформити протокол</Text>
        </TouchableOpacity>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📋 Європротокол дозволяє оформити ДТП без виклику поліції, 
            якщо немає постраждалих і сторони дійшли згоди
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ParticipantAScreen: React.FC<ScreenProps> = ({ navigation, protocolData, setProtocolData }) => {
  const [formData, setFormData] = useState<ParticipantData>(protocolData.participantA || {
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    carModel: '',
    carNumber: ''
  });

  const updateField = (field: keyof ParticipantData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Помилка', 'Заповніть обов\'язкові поля');
      return;
    }
    setProtocolData(prev => ({ ...prev, participantA: formData }));
    navigation.navigate('ParticipantB');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.screenTitle}>Учасник А</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Ім'я *</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            placeholder="Введіть ім'я"
          />

          <Text style={styles.label}>Прізвище *</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            placeholder="Введіть прізвище"
          />

          <Text style={styles.label}>Дата народження</Text>
          <TextInput
            style={styles.input}
            value={formData.birthDate}
            onChangeText={(text) => updateField('birthDate', text)}
            placeholder="ДД.ММ.РРРР"
          />

          <Text style={styles.label}>Телефон *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="+380"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Модель авто</Text>
          <TextInput
            style={styles.input}
            value={formData.carModel}
            onChangeText={(text) => updateField('carModel', text)}
            placeholder="Наприклад: Toyota Camry"
          />

          <Text style={styles.label}>Номер авто</Text>
          <TextInput
            style={styles.input}
            value={formData.carNumber}
            onChangeText={(text) => updateField('carNumber', text)}
            placeholder="AA 0000 BB"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Назад</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Далі</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ParticipantBScreen: React.FC<ScreenProps> = ({ navigation, protocolData, setProtocolData }) => {
  const [formData, setFormData] = useState<ParticipantData>(protocolData.participantB || {
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
    carModel: '',
    carNumber: ''
  });

  const updateField = (field: keyof ParticipantData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      Alert.alert('Помилка', 'Заповніть обов\'язкові поля');
      return;
    }
    setProtocolData(prev => ({ ...prev, participantB: formData }));
    navigation.navigate('Damage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.screenTitle}>Учасник Б</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Ім'я *</Text>
          <TextInput
            style={styles.input}
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            placeholder="Введіть ім'я"
          />

          <Text style={styles.label}>Прізвище *</Text>
          <TextInput
            style={styles.input}
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            placeholder="Введіть прізвище"
          />

          <Text style={styles.label}>Дата народження</Text>
          <TextInput
            style={styles.input}
            value={formData.birthDate}
            onChangeText={(text) => updateField('birthDate', text)}
            placeholder="ДД.ММ.РРРР"
          />

          <Text style={styles.label}>Телефон *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => updateField('phone', text)}
            placeholder="+380"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Модель авто</Text>
          <TextInput
            style={styles.input}
            value={formData.carModel}
            onChangeText={(text) => updateField('carModel', text)}
            placeholder="Наприклад: Toyota Camry"
          />

          <Text style={styles.label}>Номер авто</Text>
          <TextInput
            style={styles.input}
            value={formData.carNumber}
            onChangeText={(text) => updateField('carNumber', text)}
            placeholder="AA 0000 BB"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Назад</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>Далі</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface SketchCanvasProps {
  onPathsChange: (paths: Point[][]) => void;
}

const SketchCanvas: React.FC<SketchCanvasProps> = ({ onPathsChange }) => {
  const canvasRef = useRef<View>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  const handleStart = (e: GestureResponderEvent) => {
    const touch = e.nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: touch.locationX || 0, y: touch.locationY || 0 }]);
  };

  const handleMove = (e: GestureResponderEvent) => {
    if (!isDrawing) return;
    const touch = e.nativeEvent;
    setCurrentPath(prev => [...prev, { x: touch.locationX || 0, y: touch.locationY || 0 }]);
  };

  const handleEnd = () => {
    if (currentPath.length > 0) {
      const newPaths = [...paths, currentPath];
      setPaths(newPaths);
      onPathsChange(newPaths);
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
    onPathsChange([]);
  };

  const renderPath = (path: Point[], index: number | string) => {
    if (path.length < 2) return null;
    const d = path.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');
    
    return (
      <path
        key={String(index)}
        d={d}
        stroke="#2563eb"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  };

  return (
    <View style={styles.canvasContainer}>
      <View
        ref={canvasRef}
        style={styles.canvas}
        onStartShouldSetResponder={() => true}
        onResponderGrant={handleStart}
        onResponderMove={handleMove}
        onResponderRelease={handleEnd}
      >
        <svg width="100%" height="100%" viewBox="0 0 400 300">
          <rect width="400" height="300" fill="#f3f4f6" />
          {paths.map((path, index) => renderPath(path, index))}
          {currentPath.length > 0 && renderPath(currentPath, 'current')}
        </svg>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
        <Text style={styles.clearButtonText}>Очистити</Text>
      </TouchableOpacity>
    </View>
  );
};

const DamageScreen: React.FC<ScreenProps> = ({ navigation, protocolData, setProtocolData }) => {
  const [damageData, setDamageData] = useState<DamageData>(protocolData.damage || {
    side: '',
    description: ''
  });
  const [sketch, setSketch] = useState<Point[][]>(protocolData.sketch || []);

  const sides: string[] = ['Передня', 'Задня', 'Ліва', 'Права'];

  const handleFinish = () => {
    if (!damageData.side) {
      Alert.alert('Помилка', 'Оберіть сторону пошкодження');
      return;
    }
    setProtocolData(prev => ({ 
      ...prev, 
      damage: damageData,
      sketch: sketch
    }));
    Alert.alert(
      'Успіх', 
      'Європротокол успішно оформлено!',
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.screenTitle}>Вид пошкодження</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Сторона пошкодження *</Text>
          <View style={styles.chipContainer}>
            {sides.map((side) => (
              <TouchableOpacity
                key={side}
                style={[
                  styles.chip,
                  damageData.side === side && styles.chipSelected
                ]}
                onPress={() => setDamageData(prev => ({ ...prev, side }))}
              >
                <Text style={[
                  styles.chipText,
                  damageData.side === side && styles.chipTextSelected
                ]}>
                  {side}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Опис пошкодження</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={damageData.description}
            onChangeText={(text) => setDamageData(prev => ({ ...prev, description: text }))}
            placeholder="Опишіть характер пошкоджень"
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Ескіз ДТП</Text>
          <Text style={styles.helperText}>Намалюйте схему пригоди</Text>
          <SketchCanvas onPathsChange={setSketch} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>Назад</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>Завершити</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function Protocol() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ParticipantA" component={ParticipantAScreen} />
      <Stack.Screen name="ParticipantB" component={ParticipantBScreen} />
      <Stack.Screen name="Damage" component={DamageScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 40,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    color: '#1e40af',
    fontSize: 14,
    lineHeight: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  canvasContainer: {
    marginTop: 8,
  },
  canvas: {
    width: '100%',
    height: 300,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});