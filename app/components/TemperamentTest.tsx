import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const TemperamentTest = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    sanguine: 0,
    melancholic: 0,
    choleric: 0,
    phlegmatic: 0
  });
  const [result, setResult] = useState<string | null>(null);

  const questions = [
    {
      question: "Як ви реагуєте на нові знайомства?",
      answers: [
        { text: "Легко знайомлюся, люблю спілкування", type: "sanguine" },
        { text: "Обережно, потребую часу для адаптації", type: "melancholic" },
        { text: "Активно, беру ініціативу на себе", type: "choleric" },
        { text: "Спокійно, чекаю поки інші зроблять перший крок", type: "phlegmatic" }
      ]
    },
    {
      question: "Як ви поводитесь у стресовій ситуації?",
      answers: [
        { text: "Намагаюсь розрядити обстановку жартами", type: "sanguine" },
        { text: "Переживаю, аналізую всі можливі наслідки", type: "melancholic" },
        { text: "Діяю рішуче, беру контроль у свої руки", type: "choleric" },
        { text: "Зберігаю спокій, чекаю поки все саме вирішиться", type: "phlegmatic" }
      ]
    },
    {
      question: "Який ваш робочий стиль?",
      answers: [
        { text: "Творчий, часто змінюю підходи", type: "sanguine" },
        { text: "Детальний, ретельний, перфекціоніст", type: "melancholic" },
        { text: "Орієнтований на результат, швидкий", type: "choleric" },
        { text: "Систематичний, стабільний, послідовний", type: "phlegmatic" }
      ]
    },
    {
      question: "Як ви приймаєте рішення?",
      answers: [
        { text: "Швидко, інтуїтивно, за настроєм", type: "sanguine" },
        { text: "Довго зважую всі за і проти", type: "melancholic" },
        { text: "Швидко і рішуче, без вагань", type: "choleric" },
        { text: "Поступово, радячись з іншими", type: "phlegmatic" }
      ]
    },
    {
      question: "Що характеризує ваш емоційний стан?",
      answers: [
        { text: "Яскраві емоції, швидка зміна настрою", type: "sanguine" },
        { text: "Глибокі переживання, схильність до сумніву", type: "melancholic" },
        { text: "Сильні емоції, але швидко відпускаю", type: "choleric" },
        { text: "Стабільний, рівний настрій", type: "phlegmatic" }
      ]
    },
    {
      question: "Як ви відпочиваєте?",
      answers: [
        { text: "У компанії, на вечірках, активно", type: "sanguine" },
        { text: "Сам/сама, за улюбленим заняттям", type: "melancholic" },
        { text: "Займаюсь спортом або активними хобі", type: "choleric" },
        { text: "Вдома, у спокійній обстановці", type: "phlegmatic" }
      ]
    },
    {
      question: "Яка ваша реакція на критику?",
      answers: [
        { text: "Не беру близько до серця, швидко забуваю", type: "sanguine" },
        { text: "Сильно переживаю, довго думаю про це", type: "melancholic" },
        { text: "Можу образитись, але швидко переключаюсь", type: "choleric" },
        { text: "Спокійно приймаю, якщо вона конструктивна", type: "phlegmatic" }
      ]
    },
    {
      question: "Як ви ставитесь до змін?",
      answers: [
        { text: "Обожнюю новизну і зміни", type: "sanguine" },
        { text: "Важко адаптуюсь, потребую підготовки", type: "melancholic" },
        { text: "Сам/сама ініціюю зміни", type: "choleric" },
        { text: "Воліла б стабільність, але можу адаптуватись", type: "phlegmatic" }
      ]
    }
  ];

  const temperamentInfo: Record<string, any> = {
    sanguine: {
      name: "Сангвінік",
      emoji: "😄",
      description: "Ви життєрадісна, комунікабельна та оптимістична людина. Легко знайомитесь, любите веселощі та нові враження.",
      traits: ["Товариський", "Оптимістичний", "Активний", "Емоційний"],
      color: "#f59e0b"
    },
    melancholic: {
      name: "Меланхолік",
      emoji: "🤔",
      description: "Ви глибока, чутлива та вдумлива людина. Схильні до аналізу, перфекціонізму та глибоких переживань.",
      traits: ["Чутливий", "Аналітичний", "Творчий", "Відповідальний"],
      color: "#3b82f6"
    },
    choleric: {
      name: "Холерик",
      emoji: "💪",
      description: "Ви енергійна, цілеспрямована та лідерська людина. Любите брати відповідальність та досягати результатів.",
      traits: ["Енергійний", "Рішучий", "Амбітний", "Лідер"],
      color: "#ef4444"
    },
    phlegmatic: {
      name: "Флегматик",
      emoji: "😌",
      description: "Ви спокійна, врівноважена та надійна людина. Цінуєте стабільність, порядок та гармонію.",
      traits: ["Спокійний", "Терплячий", "Надійний", "Миролюбний"],
      color: "#10b981"
    }
  };

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setScores({ sanguine: 0, melancholic: 0, choleric: 0, phlegmatic: 0 });
    setResult(null);
  };

  const handleAnswer = (type: string) => {
    const newScores = { ...scores, [type]: scores[type as keyof typeof scores] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const maxScore = Math.max(...Object.values(newScores));
      const dominantType = Object.keys(newScores).find(
        key => newScores[key as keyof typeof newScores] === maxScore
      );
      setResult(dominantType || null);
      setStarted(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScores({ sanguine: 0, melancholic: 0, choleric: 0, phlegmatic: 0 });
    setResult(null);
  };

  if (result) {
    const temp = temperamentInfo[result];
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={[styles.emojiCircle, { backgroundColor: temp.color }]}>
                <Text style={styles.emojiLarge}>{temp.emoji}</Text>
              </View>
              <Text style={styles.resultTitle}>Ваш темперамент</Text>
              <Text style={[styles.resultName, { color: temp.color }]}>{temp.name}</Text>
            </View>

            <View style={styles.descriptionCard}>
              <Text style={styles.description}>{temp.description}</Text>
              
              <View style={styles.traitsGrid}>
                {temp.traits.map((trait: string, index: number) => (
                  <View key={index} style={styles.traitBox}>
                    <Text style={styles.traitText}>✓ {trait}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.scoresCard}>
              <Text style={styles.scoresTitle}>Розподіл балів:</Text>
              {Object.entries(scores).map(([type, score]) => (
                <View key={type} style={styles.scoreRow}>
                  <Text style={styles.scoreName}>{temperamentInfo[type].name}:</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          backgroundColor: temperamentInfo[type].color,
                          width: `${(score / questions.length) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scoreValue}>{score}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>🔄 Пройти тест заново</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (started) {
    const question = questions[currentQuestion];
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.progressSection}>
              <Text style={styles.progressText}>
                Питання {currentQuestion + 1} з {questions.length}
              </Text>
              <View style={styles.progressBarMain}>
                <View 
                  style={[
                    styles.progressFillMain, 
                    { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                  ]} 
                />
              </View>
            </View>

            <View style={styles.questionSection}>
              <Text style={styles.questionNumber}>❓</Text>
              <Text style={styles.questionText}>{question.question}</Text>
            </View>

            <View style={styles.answersSection}>
              {question.answers.map((answer, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.answerButton}
                  onPress={() => handleAnswer(answer.type)}
                >
                  <View style={styles.answerCircle}>
                    <Text style={styles.answerLetter}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={styles.answerText}>{answer.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.mainTitle}>🧠</Text>
          <Text style={styles.title}>Тест на визначення темпераменту</Text>
          <Text style={styles.subtitle}>Дізнайтесь, який у вас тип темпераменту</Text>

          <View style={styles.typesGrid}>
            {Object.entries(temperamentInfo).map(([key, temp]) => (
              <View 
                key={key} 
                style={[styles.typeCard, { borderColor: temp.color }]}
              >
                <Text style={styles.typeEmoji}>{temp.emoji}</Text>
                <Text style={styles.typeName}>{temp.name}</Text>
              </View>
            ))}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Що вас чекає:</Text>
            <Text style={styles.infoItem}>• {questions.length} питань про ваш характер</Text>
            <Text style={styles.infoItem}>• Детальний опис темпераменту</Text>
            <Text style={styles.infoItem}>• Розподіл балів за типами</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Розпочати тест</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7c3aed',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 24,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  infoCard: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581c87',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#4c1d95',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    color: '#7c3aed',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBarMain: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillMain: {
    height: '100%',
    backgroundColor: '#7c3aed',
  },
  questionSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  questionNumber: {
    fontSize: 32,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  answersSection: {
    gap: 12,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  answerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  answerLetter: {
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emojiLarge: {
    fontSize: 48,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  descriptionCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  traitBox: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  traitText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  scoresCard: {
    backgroundColor: '#f3e8ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#581c87',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreName: {
    width: 100,
    fontSize: 13,
    color: '#374151',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  scoreValue: {
    width: 24,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
  },
});

export default TemperamentTest;