import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function UploadBankScreen({ navigation }) {
  const [bankName, setBankName] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, title: '', type: 'single', options: ['', '', '', ''], correctAnswer: 0, correctAnswers: [] }
  ]);

  // 类别数据
  const categories = {
    '国家': ['政治', '法律', '历史', '地理', '文化'],
    '行业': ['互联网', '金融', '医疗', '教育', '制造业', '服务业'],
    '个人': ['兴趣爱好', '生活技能', '职业发展', '健康养生', '理财投资']
  };

  const questionTypes = [
    { value: 'judge', label: '判断题' },
    { value: 'single', label: '单选题' },
    { value: 'multiple', label: '多选题' }
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      title: '',
      type: 'single',
      options: ['', '', '', ''],
      correctAnswer: 0,
      correctAnswers: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      if (Platform.OS === 'web') {
        alert('至少需要保留一道题目');
      } else {
        Alert.alert('提示', '至少需要保留一道题目');
      }
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        // 切换题目类型时重置答案
        if (field === 'type') {
          return { 
            ...q, 
            [field]: value,
            correctAnswer: 0,
            correctAnswers: []
          };
        }
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  // 多选题答案切换
  const toggleMultipleAnswer = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.type === 'multiple') {
        const correctAnswers = q.correctAnswers || [];
        const index = correctAnswers.indexOf(optionIndex);
        const newAnswers = index > -1 
          ? correctAnswers.filter(i => i !== optionIndex)
          : [...correctAnswers, optionIndex];
        return { ...q, correctAnswers: newAnswers };
      }
      return q;
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length < 6) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.filter((_, index) => index !== optionIndex);
        return { 
          ...q, 
          options: newOptions,
          correctAnswer: q.correctAnswer >= optionIndex && q.correctAnswer > 0 ? q.correctAnswer - 1 : q.correctAnswer
        };
      }
      return q;
    }));
  };

  const handleSubmit = () => {
    if (!bankName.trim()) {
      if (Platform.OS === 'web') {
        alert('请输入题库名称');
      } else {
        Alert.alert('提示', '请输入题库名称');
      }
      return;
    }

    if (!selectedMainCategory || !selectedSubCategory) {
      if (Platform.OS === 'web') {
        alert('请选择题库类别');
      } else {
        Alert.alert('提示', '请选择题库类别');
      }
      return;
    }

    const invalidQuestions = questions.filter(q => !q.title.trim());
    if (invalidQuestions.length > 0) {
      if (Platform.OS === 'web') {
        alert('请完善所有题目的标题');
      } else {
        Alert.alert('提示', '请完善所有题目的标题');
      }
      return;
    }

    if (Platform.OS === 'web') {
      alert('题库上传成功！');
    } else {
      Alert.alert('成功', '题库上传成功！', [
        { text: '确定', onPress: () => navigation.goBack() }
      ]);
    }
  };

  const renderQuestion = (question, index) => (
    <View key={question.id} style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>题目 {index + 1}</Text>
        <TouchableOpacity 
          onPress={() => removeQuestion(question.id)}
          style={styles.removeQuestionBtn}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* 题目类型 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>题目类型</Text>
        <View style={styles.typeSelector}>
          {questionTypes.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeOption,
                question.type === type.value && styles.typeOptionActive
              ]}
              onPress={() => updateQuestion(question.id, 'type', type.value)}
            >
              <Text style={[
                styles.typeOptionText,
                question.type === type.value && styles.typeOptionTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 题目标题 */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>题目内容 <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.textArea}
          placeholder="请输入题目内容"
          placeholderTextColor="#9ca3af"
          value={question.title}
          onChangeText={(text) => updateQuestion(question.id, 'title', text)}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* 判断题选项 */}
      {question.type === 'judge' && (
        <View style={styles.formGroup}>
          <Text style={styles.label}>正确答案</Text>
          <View style={styles.judgeOptions}>
            <TouchableOpacity
              style={[
                styles.judgeOption,
                question.correctAnswer === 0 && styles.judgeOptionActive
              ]}
              onPress={() => updateQuestion(question.id, 'correctAnswer', 0)}
            >
              <Ionicons 
                name={question.correctAnswer === 0 ? 'checkmark-circle' : 'ellipse-outline'} 
                size={20} 
                color={question.correctAnswer === 0 ? '#22c55e' : '#9ca3af'} 
              />
              <Text style={[
                styles.judgeOptionText,
                question.correctAnswer === 0 && styles.judgeOptionTextActive
              ]}>
                正确
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.judgeOption,
                question.correctAnswer === 1 && styles.judgeOptionActive
              ]}
              onPress={() => updateQuestion(question.id, 'correctAnswer', 1)}
            >
              <Ionicons 
                name={question.correctAnswer === 1 ? 'checkmark-circle' : 'ellipse-outline'} 
                size={20} 
                color={question.correctAnswer === 1 ? '#22c55e' : '#9ca3af'} 
              />
              <Text style={[
                styles.judgeOptionText,
                question.correctAnswer === 1 && styles.judgeOptionTextActive
              ]}>
                错误
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 选择题选项 */}
      {(question.type === 'single' || question.type === 'multiple') && (
        <View style={styles.formGroup}>
          <View style={styles.optionsHeader}>
            <Text style={styles.label}>选项 {question.type === 'multiple' && <Text style={styles.multipleHint}>(可多选)</Text>}</Text>
            {question.options.length < 6 && (
              <TouchableOpacity 
                onPress={() => addOption(question.id)}
                style={styles.addOptionBtn}
              >
                <Ionicons name="add-circle-outline" size={16} color="#f59e0b" />
                <Text style={styles.addOptionText}>添加选项</Text>
              </TouchableOpacity>
            )}
          </View>
          {question.options.map((option, optionIndex) => (
            <View key={optionIndex} style={styles.optionRow}>
              <TouchableOpacity
                style={styles.optionRadio}
                onPress={() => {
                  if (question.type === 'multiple') {
                    toggleMultipleAnswer(question.id, optionIndex);
                  } else {
                    updateQuestion(question.id, 'correctAnswer', optionIndex);
                  }
                }}
              >
                <Ionicons 
                  name={
                    question.type === 'multiple'
                      ? (question.correctAnswers?.includes(optionIndex) ? 'checkbox' : 'square-outline')
                      : (question.correctAnswer === optionIndex ? 'checkmark-circle' : 'ellipse-outline')
                  }
                  size={20} 
                  color={
                    question.type === 'multiple'
                      ? (question.correctAnswers?.includes(optionIndex) ? '#22c55e' : '#9ca3af')
                      : (question.correctAnswer === optionIndex ? '#22c55e' : '#9ca3af')
                  }
                />
              </TouchableOpacity>
              <TextInput
                style={styles.optionInput}
                placeholder={`选项 ${String.fromCharCode(65 + optionIndex)}`}
                placeholderTextColor="#9ca3af"
                value={option}
                onChangeText={(text) => updateOption(question.id, optionIndex, text)}
              />
              {question.options.length > 2 && (
                <TouchableOpacity 
                  onPress={() => removeOption(question.id, optionIndex)}
                  style={styles.removeOptionBtn}
                >
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>上传题库</Text>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={styles.submitBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text style={styles.submitBtnText}>提交</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 题库信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>题库信息</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>题库名称 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="请输入题库名称"
              placeholderTextColor="#9ca3af"
              value={bankName}
              onChangeText={setBankName}
            />
          </View>

          {/* 题库类别 */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>题库类别 <Text style={styles.required}>*</Text></Text>
            
            {/* 主类别选择 */}
            <Text style={styles.subLabel}>主类别</Text>
            <View style={styles.categoryRow}>
              {Object.keys(categories).map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryBtn,
                    selectedMainCategory === category && styles.categoryBtnActive
                  ]}
                  onPress={() => {
                    setSelectedMainCategory(category);
                    setSelectedSubCategory('');
                  }}
                >
                  <Text style={[
                    styles.categoryBtnText,
                    selectedMainCategory === category && styles.categoryBtnTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 子类别选择 */}
            {selectedMainCategory && (
              <>
                <Text style={[styles.subLabel, { marginTop: 12 }]}>子类别</Text>
                <View style={styles.subCategoryRow}>
                  {categories[selectedMainCategory].map(subCategory => (
                    <TouchableOpacity
                      key={subCategory}
                      style={[
                        styles.subCategoryBtn,
                        selectedSubCategory === subCategory && styles.subCategoryBtnActive
                      ]}
                      onPress={() => setSelectedSubCategory(subCategory)}
                    >
                      <Text style={[
                        styles.subCategoryBtnText,
                        selectedSubCategory === subCategory && styles.subCategoryBtnTextActive
                      ]}>
                        {subCategory}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* 已选择的类别显示 */}
            {selectedMainCategory && selectedSubCategory && (
              <View style={styles.selectedCategoryCard}>
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text style={styles.selectedCategoryText}>
                  已选择：{selectedMainCategory} - {selectedSubCategory}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={18} color="#3b82f6" />
            <Text style={styles.infoText}>题目数量：{questions.length} 道</Text>
          </View>
        </View>

        {/* 题目列表 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>题目列表</Text>
            <TouchableOpacity onPress={addQuestion} style={styles.addQuestionBtn}>
              <Ionicons name="add-circle" size={20} color="#f59e0b" />
              <Text style={styles.addQuestionText}>添加题目</Text>
            </TouchableOpacity>
          </View>
          {questions.map((question, index) => renderQuestion(question, index))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  submitBtn: { paddingHorizontal: 16, paddingVertical: 6, backgroundColor: '#f59e0b', borderRadius: 8 },
  submitBtnText: { fontSize: 14, color: '#fff', fontWeight: '600' },

  content: { flex: 1 },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 },
  
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  required: { color: '#ef4444' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1f2937' },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#1f2937', minHeight: 80, textAlignVertical: 'top' },
  
  infoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  infoText: { fontSize: 13, color: '#1e40af' },

  addQuestionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addQuestionText: { fontSize: 13, color: '#f59e0b', fontWeight: '500' },

  questionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionNumber: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  removeQuestionBtn: { padding: 4 },

  typeSelector: { flexDirection: 'row', gap: 8 },
  typeOption: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', alignItems: 'center' },
  typeOptionActive: { borderColor: '#f59e0b', backgroundColor: '#fef3c7' },
  typeOptionText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  typeOptionTextActive: { color: '#f59e0b', fontWeight: '600' },

  judgeOptions: { flexDirection: 'row', gap: 12 },
  judgeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  judgeOptionActive: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  judgeOptionText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  judgeOptionTextActive: { color: '#22c55e', fontWeight: '600' },

  optionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addOptionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addOptionText: { fontSize: 12, color: '#f59e0b', fontWeight: '500' },
  multipleHint: { fontSize: 12, color: '#3b82f6', fontWeight: '400' },
  
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  optionRadio: { padding: 4 },
  optionInput: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: '#1f2937' },
  removeOptionBtn: { padding: 4 },

  // 类别选择
  subLabel: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  categoryBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', alignItems: 'center' },
  categoryBtnActive: { borderColor: '#f59e0b', backgroundColor: '#fef3c7' },
  categoryBtnText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  categoryBtnTextActive: { color: '#f59e0b', fontWeight: '600' },
  
  subCategoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subCategoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' },
  subCategoryBtnActive: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  subCategoryBtnText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  subCategoryBtnTextActive: { color: '#3b82f6', fontWeight: '600' },
  
  selectedCategoryCard: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 12 },
  selectedCategoryText: { fontSize: 13, color: '#166534', fontWeight: '500' },
});
