import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// 模拟考核详情数据
const examDetail = {
  id: 1,
  bankName: 'React Native基础知识',
  date: '2026-01-25 14:30',
  score: 95,
  rank: '优秀',
  duration: '05:23',
  totalQuestions: 10,
  correctCount: 9,
  questions: [
    {
      id: 1,
      question: 'React Native使用什么语言开发？',
      options: ['Java', 'JavaScript', 'Python', 'C++'],
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    },
    {
      id: 2,
      question: '以下哪个不是React的核心概念？',
      options: ['组件', '状态', '路由', '生命周期'],
      userAnswer: 2,
      correctAnswer: 2,
      isCorrect: true
    },
    {
      id: 3,
      question: 'useState是什么类型的Hook？',
      options: ['Effect Hook', 'State Hook', 'Context Hook', 'Ref Hook'],
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    },
    {
      id: 4,
      question: 'JSX是什么的缩写？',
      options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
      userAnswer: 0,
      correctAnswer: 0,
      isCorrect: true
    },
    {
      id: 5,
      question: '以下哪个方法用于更新组件状态？',
      options: ['updateState', 'setState', 'changeState', 'modifyState'],
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    },
    {
      id: 6,
      question: 'React Native的样式使用什么单位？',
      options: ['px', 'em', 'rem', '无单位数字'],
      userAnswer: 2,
      correctAnswer: 3,
      isCorrect: false
    },
    {
      id: 7,
      question: '以下哪个组件用于显示文本？',
      options: ['View', 'Text', 'Label', 'Span'],
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    },
    {
      id: 8,
      question: 'useEffect的第二个参数是什么？',
      options: ['回调函数', '依赖数组', '初始值', '配置对象'],
      userAnswer: 1,
      correctAnswer: 1,
      isCorrect: true
    },
    {
      id: 9,
      question: '以下哪个不是React Native的核心组件？',
      options: ['View', 'Text', 'Image', 'Div'],
      userAnswer: 3,
      correctAnswer: 3,
      isCorrect: true
    },
    {
      id: 10,
      question: 'Props是什么的缩写？',
      options: ['Properties', 'Proposals', 'Protocols', 'Procedures'],
      userAnswer: 0,
      correctAnswer: 0,
      isCorrect: true
    },
  ]
};

export default function ExamDetailScreen({ navigation, route }) {
  const { examId } = route.params;

  const getRankColor = (rank) => {
    switch (rank) {
      case '优秀': return '#22c55e';
      case '良好': return '#3b82f6';
      case '及格': return '#f59e0b';
      case '不及格': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>考核详情</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ExamHistory')} style={styles.historyBtn}>
          <Ionicons name="list" size={20} color="#f59e0b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 考核概览卡片 */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View style={styles.bankNameRow}>
              <Ionicons name="library" size={20} color="#8b5cf6" />
              <Text style={styles.bankName}>{examDetail.bankName}</Text>
            </View>
            <View style={[styles.rankBadge, { backgroundColor: `${getRankColor(examDetail.rank)}15` }]}>
              <Text style={[styles.rankText, { color: getRankColor(examDetail.rank) }]}>{examDetail.rank}</Text>
            </View>
          </View>

          <View style={styles.scoreSection}>
            <Text style={[styles.scoreValue, { color: getScoreColor(examDetail.score) }]}>{examDetail.score}分</Text>
            <Text style={styles.scoreLabel}>考核成绩</Text>
          </View>

          <View style={styles.overviewStats}>
            <View style={styles.overviewStatItem}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
              <Text style={styles.overviewStatValue}>{examDetail.correctCount}</Text>
              <Text style={styles.overviewStatLabel}>答对</Text>
            </View>
            <View style={styles.overviewStatItem}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={styles.overviewStatValue}>{examDetail.totalQuestions - examDetail.correctCount}</Text>
              <Text style={styles.overviewStatLabel}>答错</Text>
            </View>
            <View style={styles.overviewStatItem}>
              <Ionicons name="time" size={20} color="#3b82f6" />
              <Text style={styles.overviewStatValue}>{examDetail.duration}</Text>
              <Text style={styles.overviewStatLabel}>用时</Text>
            </View>
          </View>

          <View style={styles.examInfo}>
            <View style={styles.examInfoItem}>
              <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
              <Text style={styles.examInfoText}>考试时间：{examDetail.date}</Text>
            </View>
          </View>
        </View>

        {/* 答题详情 */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>答题详情</Text>
          
          {examDetail.questions.map((q, index) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>第 {index + 1} 题</Text>
                {q.isCorrect ? (
                  <View style={styles.correctBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                    <Text style={styles.correctText}>正确</Text>
                  </View>
                ) : (
                  <View style={styles.wrongBadge}>
                    <Ionicons name="close-circle" size={16} color="#ef4444" />
                    <Text style={styles.wrongText}>错误</Text>
                  </View>
                )}
              </View>

              <Text style={styles.questionText}>{q.question}</Text>

              <View style={styles.optionsContainer}>
                {q.options.map((option, optIndex) => {
                  const isUserAnswer = q.userAnswer === optIndex;
                  const isCorrectAnswer = q.correctAnswer === optIndex;
                  
                  let optionStyle = styles.option;
                  let optionTextStyle = styles.optionText;
                  let iconName = 'radio-button-off';
                  let iconColor = '#d1d5db';

                  if (isCorrectAnswer) {
                    optionStyle = styles.optionCorrect;
                    optionTextStyle = styles.optionTextCorrect;
                    iconName = 'checkmark-circle';
                    iconColor = '#22c55e';
                  } else if (isUserAnswer && !q.isCorrect) {
                    optionStyle = styles.optionWrong;
                    optionTextStyle = styles.optionTextWrong;
                    iconName = 'close-circle';
                    iconColor = '#ef4444';
                  }

                  return (
                    <View key={optIndex} style={optionStyle}>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                      <Text style={optionTextStyle}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {!q.isCorrect && (
                <View style={styles.answerNote}>
                  <Ionicons name="information-circle" size={16} color="#3b82f6" />
                  <Text style={styles.answerNoteText}>
                    您的答案：{String.fromCharCode(65 + q.userAnswer)} | 
                    正确答案：{String.fromCharCode(65 + q.correctAnswer)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  historyBtn: { padding: 4 },

  // 概览卡片
  overviewCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  bankNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  bankName: { fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1 },
  rankBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rankText: { fontSize: 13, fontWeight: '600' },
  scoreSection: { alignItems: 'center', marginBottom: 20 },
  scoreValue: { fontSize: 48, fontWeight: 'bold', marginBottom: 4 },
  scoreLabel: { fontSize: 14, color: '#9ca3af' },
  overviewStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingVertical: 16, backgroundColor: '#f9fafb', borderRadius: 12 },
  overviewStatItem: { alignItems: 'center', gap: 4 },
  overviewStatValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  overviewStatLabel: { fontSize: 12, color: '#9ca3af' },
  examInfo: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  examInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  examInfoText: { fontSize: 13, color: '#6b7280' },

  // 答题详情
  questionsSection: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  questionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionNumber: { fontSize: 14, fontWeight: '600', color: '#f59e0b' },
  correctBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  correctText: { fontSize: 12, color: '#22c55e', fontWeight: '600' },
  wrongBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  wrongText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  questionText: { fontSize: 15, color: '#1f2937', lineHeight: 22, marginBottom: 12 },
  optionsContainer: { gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#dcfce7', borderRadius: 8, borderWidth: 1, borderColor: '#86efac' },
  optionWrong: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5' },
  optionText: { fontSize: 14, color: '#374151', flex: 1 },
  optionTextCorrect: { fontSize: 14, color: '#166534', flex: 1, fontWeight: '500' },
  optionTextWrong: { fontSize: 14, color: '#991b1b', flex: 1, fontWeight: '500' },
  answerNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 10, backgroundColor: '#eff6ff', borderRadius: 8 },
  answerNoteText: { fontSize: 12, color: '#1e40af', flex: 1 },
});
