import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const App = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizDuration, setQuizDuration] = useState(0);
  const [exportStatus, setExportStatus] = useState('');
  
  const resultRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const quizData = [
    // Technical Questions
    {
      id: 1,
      category: "Technology",
      question: "Which programming language is primarily used for Android app development?",
      options: ["Java", "Python", "C++", "Swift"],
      correctAnswer: "Java",
      explanation: "Java is the primary language for Android app development, though Kotlin is also used."
    },
    {
      id: 2,
      category: "Technology",
      question: "What is the name of the web browser developed by Google?",
      options: ["Firefox", "Edge", "Chrome", "Safari"],
      correctAnswer: "Chrome",
      explanation: "Chrome browser was developed by Google and first released in 2008."
    },
    {
      id: 3,
      category: "Technology",
      question: "What is the oldest operating system for personal computers?",
      options: ["Windows", "macOS", "Linux", "MS-DOS"],
      correctAnswer: "MS-DOS",
      explanation: "MS-DOS (Microsoft Disk Operating System) was released in 1981, predating the other listed operating systems."
    },
    {
      id: 4,
      category: "Technology",
      question: "Which markup language is used to create web pages?",
      options: ["HTML", "Java", "Python", "C#"],
      correctAnswer: "HTML",
      explanation: "HTML (HyperText Markup Language) is the standard language for creating web page structure."
    },
    {
      id: 5,
      category: "Technology",
      question: "Which technology is used for version control in software projects?",
      options: ["Git", "Docker", "Kubernetes", "Jenkins"],
      correctAnswer: "Git",
      explanation: "Git is a distributed version control system used to track changes in source code during software development."
    },
    // Science Questions
    {
      id: 6,
      category: "Science",
      question: "Which planet is closest to the Sun in our solar system?",
      options: ["Venus", "Mars", "Mercury", "Earth"],
      correctAnswer: "Mercury",
      explanation: "Mercury is the closest planet to the Sun, approximately 58 million kilometers away."
    },
    {
      id: 7,
      category: "Science",
      question: "What is the chemical element with the symbol 'O'?",
      options: ["Gold", "Oxygen", "Silver", "Iron"],
      correctAnswer: "Oxygen",
      explanation: "The symbol 'O' represents Oxygen, which is the 8th element in the periodic table."
    },
    {
      id: 8,
      category: "Science",
      question: "How many bones does an adult human body have?",
      options: ["206", "300", "150", "250"],
      correctAnswer: "206",
      explanation: "An adult human body has 206 bones, while babies are born with about 300 bones that fuse together over time."
    },
    // History Questions
    {
      id: 9,
      category: "History",
      question: "In which year did humans first land on the Moon?",
      options: ["1965", "1969", "1972", "1958"],
      correctAnswer: "1969",
      explanation: "Apollo 11 landed on the Moon on July 20, 1969, with Neil Armstrong becoming the first human to walk on the lunar surface."
    },
    {
      id: 10,
      category: "History",
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
      correctAnswer: "George Washington",
      explanation: "George Washington served as the first President of the United States from 1789 to 1797."
    },
    // Mathematics Questions
    {
      id: 11,
      category: "Mathematics",
      question: "What is the value of π (pi) rounded to two decimal places?",
      options: ["3.14", "3.16", "3.12", "3.18"],
      correctAnswer: "3.14",
      explanation: "The value of π is approximately 3.14159265359, which rounds to 3.14 to two decimal places."
    },
    {
      id: 12,
      category: "Mathematics",
      question: "What is the result of 7 × 8?",
      options: ["54", "56", "58", "60"],
      correctAnswer: "56",
      explanation: "7 × 8 = 56, a basic multiplication fact from the multiplication table."
    },
    // Geography Questions
    {
      id: 13,
      category: "Geography",
      question: "Which is the largest continent by area?",
      options: ["Africa", "Europe", "Asia", "North America"],
      correctAnswer: "Asia",
      explanation: "Asia is the largest continent with an area of approximately 44.58 million square kilometers."
    },
    {
      id: 14,
      category: "Geography",
      question: "Which is the longest river in the world?",
      options: ["Amazon River", "Nile River", "Mississippi River", "Yangtze River"],
      correctAnswer: "Nile River",
      explanation: "The Nile River is the world's longest river, stretching about 6,650 kilometers."
    },
    // Literature Questions
    {
      id: 15,
      category: "Literature",
      question: "Who wrote the novel 'Les Misérables'?",
      options: ["Victor Hugo", "Leo Tolstoy", "Charles Dickens", "Fyodor Dostoevsky"],
      correctAnswer: "Victor Hugo",
      explanation: "'Les Misérables' was written by French author Victor Hugo and published in 1862."
    },
    {
      id: 16,
      category: "Arts",
      question: "Who painted the famous 'Mona Lisa'?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: "Leonardo da Vinci",
      explanation: "The Mona Lisa was painted by Italian Renaissance artist Leonardo da Vinci in the 16th century."
    },
    // Sports Questions
    {
      id: 17,
      category: "Sports",
      question: "In which sport is the term 'eagle' used?",
      options: ["Soccer", "Golf", "Tennis", "Cricket"],
      correctAnswer: "Golf",
      explanation: "In golf, an 'eagle' refers to completing a hole in two strokes under par."
    },
    // Advanced Technology Questions
    {
      id: 18,
      category: "Technology",
      question: "Which protocol is used to transfer web pages?",
      options: ["FTP", "HTTP", "SMTP", "TCP"],
      correctAnswer: "HTTP",
      explanation: "HTTP (Hypertext Transfer Protocol) is the foundational protocol for transferring web pages."
    },
    {
      id: 19,
      category: "Technology",
      question: "Which programming language was developed by Microsoft for .NET applications?",
      options: ["Java", "Python", "C#", "Ruby"],
      correctAnswer: "C#",
      explanation: "C# (C Sharp) was developed by Microsoft and is the primary language for .NET framework applications."
    },
    {
      id: 20,
      category: "Technology",
      question: "Which mobile operating system is developed by Apple?",
      options: ["Android", "iOS", "Windows Phone", "Symbian"],
      correctAnswer: "iOS",
      explanation: "iOS is the mobile operating system developed by Apple for iPhone and iPad devices."
    }
  ];

  // Calculate quiz duration
  useEffect(() => {
    if (quizStarted && !showResult) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
    } else if (showResult && startTimeRef.current) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setQuizDuration(duration);
    }
  }, [quizStarted, showResult]);

  // Timer for each question
  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion();
    }
  }, [quizStarted, timeLeft, showResult]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === quizData[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        questionId: quizData[currentQuestion].id,
        question: quizData[currentQuestion].question,
        category: quizData[currentQuestion].category,
        selectedAnswer: answer,
        correctAnswer: quizData[currentQuestion].correctAnswer,
        isCorrect: isCorrect,
        timeSpent: 30 - timeLeft
      }
    ]);
  };

  // Move to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, quizData.length]);

  // Navigate to specific question
  const goToQuestion = (questionIndex) => {
    if (answeredQuestions.some(q => q.questionId === quizData[questionIndex].id)) {
      setCurrentQuestion(questionIndex);
      setSelectedAnswer(null);
      setTimeLeft(30);
    }
  };

  // Restart the quiz
  const restartQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredQuestions([]);
    setQuizDuration(0);
    startTimeRef.current = null;
    setExportStatus('');
  };

  // Calculate score percentage
  const scorePercentage = Math.round((score / quizData.length) * 100);

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    startTimeRef.current = Date.now();
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      totalQuestions: quizData.length,
      correctAnswers: score,
      incorrectAnswers: quizData.length - score,
      percentage: scorePercentage,
      timeSpent: quizDuration,
      averageTimePerQuestion: answeredQuestions.length > 0 
        ? Math.round(answeredQuestions.reduce((sum, q) => sum + q.timeSpent, 0) / answeredQuestions.length)
        : 0
    };
    
    // Calculate category-based results
    const categoryStats = {};
    quizData.forEach(q => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, correct: 0 };
      }
      categoryStats[q.category].total++;
      
      const userAnswer = answeredQuestions.find(a => a.questionId === q.id);
      if (userAnswer && userAnswer.isCorrect) {
        categoryStats[q.category].correct++;
      }
    });
    
    return { ...stats, categoryStats };
  };

  // Export to CSV
  const exportToCSV = () => {
    setExportStatus('Exporting to CSV...');
    
    const stats = calculateStats();
    const headers = [
      'Question Number', 'Question', 'Category', 'Your Answer', 'Correct Answer', 'Status', 'Time Spent (seconds)'
    ];
    
    const data = answeredQuestions.map((q, index) => [
      index + 1,
      q.question,
      quizData.find(item => item.id === q.questionId)?.category || 'Unknown',
      q.selectedAnswer,
      q.correctAnswer,
      q.isCorrect ? 'Correct' : 'Incorrect',
      q.timeSpent
    ]);
    
    // Add statistics
    data.push([]);
    data.push(['Statistics', '', '', '', '', '', '']);
    data.push(['Total Questions', stats.totalQuestions, '', '', '', '', '']);
    data.push(['Correct Answers', stats.correctAnswers, '', '', '', '', '']);
    data.push(['Incorrect Answers', stats.incorrectAnswers, '', '', '', '', '']);
    data.push(['Percentage', `${stats.percentage}%`, '', '', '', '', '']);
    data.push(['Total Time', `${stats.timeSpent} seconds`, '', '', '', '', '']);
    data.push(['Average Time per Question', `${stats.averageTimePerQuestion} seconds`, '', '', '', '', '']);
    
    // Add category results
    data.push([]);
    data.push(['Results by Category', '', '', '', '', '', '']);
    Object.keys(stats.categoryStats).forEach(category => {
      const catStats = stats.categoryStats[category];
      const percentage = Math.round((catStats.correct / catStats.total) * 100);
      data.push([category, `${catStats.correct}/${catStats.total}`, `${percentage}%`, '', '', '', '']);
    });
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Quiz_Results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setExportStatus('CSV exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Export to Excel (XLSX)
  const exportToExcel = () => {
    setExportStatus('Exporting to Excel...');
    
    const stats = calculateStats();
    
    // Questions data
    const questionsData = answeredQuestions.map((q, index) => ({
      'Question Number': index + 1,
      'Question': q.question,
      'Category': quizData.find(item => item.id === q.questionId)?.category || 'Unknown',
      'Your Answer': q.selectedAnswer,
      'Correct Answer': q.correctAnswer,
      'Status': q.isCorrect ? 'Correct' : 'Incorrect',
      'Time Spent (seconds)': q.timeSpent
    }));
    
    // Statistics data
    const statsData = [{
      'Statistics': 'Value',
      'Total Questions': stats.totalQuestions,
      'Correct Answers': stats.correctAnswers,
      'Incorrect Answers': stats.incorrectAnswers,
      'Percentage': `${stats.percentage}%`,
      'Total Time': `${stats.timeSpent} seconds`,
      'Average Time per Question': `${stats.averageTimePerQuestion} seconds`
    }];
    
    // Category data
    const categoryData = Object.keys(stats.categoryStats).map(category => {
      const catStats = stats.categoryStats[category];
      const percentage = Math.round((catStats.correct / catStats.total) * 100);
      return {
        'Category': category,
        'Correct Answers': catStats.correct,
        'Total Questions': catStats.total,
        'Percentage': `${percentage}%`
      };
    });
    
    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    
    // Add worksheets
    const ws1 = XLSX.utils.json_to_sheet(questionsData);
    XLSX.utils.book_append_sheet(wb, ws1, "Questions");
    
    const ws2 = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Statistics");
    
    const ws3 = XLSX.utils.json_to_sheet(categoryData);
    XLSX.utils.book_append_sheet(wb, ws3, "Results by Category");
    
    // Save file
    XLSX.writeFile(wb, `Quiz_Results_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setExportStatus('Excel exported successfully!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Export to PDF
  const exportToPDF = async () => {
    setExportStatus('Generating PDF...');
    
    if (!resultRef.current) {
      setExportStatus('Error: Results not found');
      return;
    }
    
    try {
      const canvas = await html2canvas(resultRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Quiz_Results_${new Date().toISOString().split('T')[0]}.pdf`);
      setExportStatus('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportStatus('Error generating PDF');
    }
    
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Export to Google Sheets (simulation)
  const exportToGoogleSheets = () => {
    setExportStatus('Preparing data for Google Sheets...');
    
    // In a real application, this would connect to Google Sheets API
    // We'll simulate by displaying data in a new window
    
    const stats = calculateStats();
    const data = answeredQuestions.map((q, index) => ({
      'Question Number': index + 1,
      'Question': q.question,
      'Category': quizData.find(item => item.id === q.questionId)?.category || 'Unknown',
      'Your Answer': q.selectedAnswer,
      'Correct Answer': q.correctAnswer,
      'Status': q.isCorrect ? 'Correct' : 'Incorrect',
      'Time Spent': `${q.timeSpent} seconds`
    }));
    
    // Create HTML content for display
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Quiz Results - Google Sheets</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
          th { background-color: #4e54c8; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .stats { background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .success { color: green; }
          .error { color: red; }
        </style>
      </head>
      <body>
        <h1>Quiz Results</h1>
        
        <div class="stats">
          <h3>General Statistics:</h3>
          <p>Total Questions: ${stats.totalQuestions}</p>
          <p>Correct Answers: ${stats.correctAnswers}</p>
          <p>Incorrect Answers: ${stats.incorrectAnswers}</p>
          <p>Percentage: ${stats.percentage}%</p>
          <p>Total Time: ${stats.timeSpent} seconds</p>
          <p>Average Time per Question: ${stats.averageTimePerQuestion} seconds</p>
        </div>
        
        <h3>Answer Details:</h3>
        <table>
          <thead>
            <tr>
              <th>Question Number</th>
              <th>Question</th>
              <th>Category</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Status</th>
              <th>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                <td>${row['Question Number']}</td>
                <td>${row['Question']}</td>
                <td>${row['Category']}</td>
                <td>${row['Your Answer']}</td>
                <td>${row['Correct Answer']}</td>
                <td class="${row['Status'] === 'Correct' ? 'success' : 'error'}">${row['Status']}</td>
                <td>${row['Time Spent']}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="stats">
          <h3>Results by Category:</h3>
          ${Object.keys(stats.categoryStats).map(category => {
            const catStats = stats.categoryStats[category];
            const percentage = Math.round((catStats.correct / catStats.total) * 100);
            return `<p>${category}: ${catStats.correct}/${catStats.total} (${percentage}%)</p>`;
          }).join('')}
        </div>
        
        <p><strong>Note:</strong> This is a simulation of data export to Google Sheets. In a real application, data would be uploaded directly to your Google Sheets account.</p>
      </body>
      </html>
    `;
    
    const newWindow = window.open();
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    
    setExportStatus('Data prepared for Google Sheets!');
    setTimeout(() => setExportStatus(''), 3000);
  };

  // Show report
  const showReport = () => {
    const stats = calculateStats();
    alert(`
Detailed Performance Report:

Total Questions: ${stats.totalQuestions}
Correct Answers: ${stats.correctAnswers}
Incorrect Answers: ${stats.incorrectAnswers}
Percentage: ${stats.percentage}%
Total Time: ${stats.timeSpent} seconds
Average Time per Question: ${stats.averageTimePerQuestion} seconds

Results by Category:
${Object.keys(stats.categoryStats).map(category => {
  const catStats = stats.categoryStats[category];
  const percentage = Math.round((catStats.correct / catStats.total) * 100);
  return `${category}: ${catStats.correct}/${catStats.total} (${percentage}%)`;
}).join('\n')}
    `);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Comprehensive Knowledge Quiz</h1>
        <p>Test your knowledge with 20 diverse questions across various fields</p>
      </header>

      <main className="quiz-container">
        {!quizStarted ? (
          <div className="start-screen">
            <div className="start-card">
              <h2>Welcome to the Comprehensive Quiz</h2>
              <div className="quiz-info">
                <div className="info-item">
                  <span className="info-icon">❓</span>
                  <div>
                    <h3>Number of Questions</h3>
                    <p>{quizData.length} Questions</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <div>
                    <h3>Time per Question</h3>
                    <p>30 Seconds</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏆</span>
                  <div>
                    <h3>Passing Score</h3>
                    <p>Minimum 60%</p>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">📊</span>
                  <div>
                    <h3>Question Categories</h3>
                    <p>Technology, Science, History</p>
                  </div>
                </div>
              </div>
              <button className="start-btn" onClick={startQuiz}>
                Start Quiz Now
              </button>
              <p className="note">You have 30 seconds for each question. You can export results after completion.</p>
            </div>
          </div>
        ) : !showResult ? (
          <div className="quiz-screen">
            <div className="quiz-header">
              <div className="progress-info">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                  ></div>
                </div>
                <div className="progress-text">
                  <span>Question {currentQuestion + 1} of {quizData.length}</span>
                  <span className="score">Score: {score}/{quizData.length}</span>
                  <span className="category">Category: {quizData[currentQuestion].category}</span>
                </div>
              </div>
              
              <div className="timer-container">
                <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                  <span className="timer-icon">⏱️</span>
                  <span className="timer-text">{timeLeft} seconds</span>
                </div>
              </div>
            </div>

            <div className="question-container">
              <div className="question-header">
                <span className="question-category">{quizData[currentQuestion].category}</span>
                <span className="question-number">Question #{currentQuestion + 1}</span>
              </div>
              
              <h2 className="question">{quizData[currentQuestion].question}</h2>
              
              <div className="options-container">
                {quizData[currentQuestion].options.map((option, index) => {
                  let optionClass = "option";
                  if (selectedAnswer === option) {
                    optionClass += option === quizData[currentQuestion].correctAnswer 
                      ? " correct" 
                      : " incorrect";
                  }
                  
                  return (
                    <button
                      key={index}
                      className={optionClass}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{option}</span>
                      {selectedAnswer === option && (
                        <span className="option-status">
                          {option === quizData[currentQuestion].correctAnswer ? "✓" : "✗"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {selectedAnswer !== null && (
                <div className="explanation">
                  <h3>Explanation:</h3>
                  <p>{quizData[currentQuestion].explanation}</p>
                  <button className="next-btn" onClick={handleNextQuestion}>
                    {currentQuestion < quizData.length - 1 ? "Next Question →" : "Show Results"}
                  </button>
                </div>
              )}
              
              <div className="questions-nav">
                <h3>Progress:</h3>
                <div className="question-dots">
                  {quizData.map((question, index) => {
                    const isAnswered = answeredQuestions.some(q => q.questionId === question.id);
                    const isCurrent = index === currentQuestion;
                    
                    return (
                      <button
                        key={index}
                        className={`question-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                        onClick={() => goToQuestion(index)}
                        title={`Question ${index + 1} - ${question.category}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="result-screen" ref={resultRef}>
            <div className="result-card">
              <h2>Quiz Results</h2>
              
              <div className="score-circle">
                <div className="circle-background">
                  <div className="circle-progress" style={{ '--percentage': `${scorePercentage}%` }}></div>
                  <div className="circle-text">
                    <span className="score-value">{scorePercentage}%</span>
                    <span className="score-label">{score} out of {quizData.length}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-message">
                <h3>
                  {scorePercentage >= 80 ? "Excellent! 🎉" : 
                   scorePercentage >= 60 ? "Very Good! 👍" : 
                   scorePercentage >= 40 ? "Not Bad! 😊" : 
                   "Needs More Learning 📚"}
                </h3>
                <p>
                  {scorePercentage >= 80 ? "Your comprehensive knowledge is excellent! You have great awareness of various concepts." : 
                   scorePercentage >= 60 ? "You have good knowledge in different fields. You can improve it further with study." : 
                   scorePercentage >= 40 ? "You have basic knowledge but need to expand it in different areas." : 
                   "It seems you need to review basic concepts. Remember, learning is a continuous process!"}
                </p>
              </div>
              
              <div className="result-stats">
                <div className="stat-item">
                  <span className="stat-label">Time Spent</span>
                  <span className="stat-value">{quizDuration} seconds</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Time per Question</span>
                  <span className="stat-value">{calculateStats().averageTimePerQuestion} seconds</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Difficulty Level</span>
                  <span className="stat-value">Medium</span>
                </div>
              </div>
              
              <div className="export-section">
                <h3>Export Results</h3>
                <div className="export-buttons">
                  <button className="export-btn csv" onClick={exportToCSV}>
                    <span className="export-icon">📊</span>
                    Export to CSV
                  </button>
                  <button className="export-btn excel" onClick={exportToExcel}>
                    <span className="export-icon">📈</span>
                    Export to Excel
                  </button>
                  <button className="export-btn pdf" onClick={exportToPDF}>
                    <span className="export-icon">📄</span>
                    Export to PDF
                  </button>
                  <button className="export-btn sheets" onClick={exportToGoogleSheets}>
                    <span className="export-icon">📋</span>
                    Google Sheets
                  </button>
                  <button className="export-btn report" onClick={showReport}>
                    <span className="export-icon">📑</span>
                    View Report
                  </button>
                </div>
                {exportStatus && <div className="export-status">{exportStatus}</div>}
              </div>
              
              <div className="result-details">
                <h3>Answer Details:</h3>
                <div className="answers-review">
                  {quizData.map((question, index) => {
                    const userAnswer = answeredQuestions.find(q => q.questionId === question.id);
                    const isCorrect = userAnswer?.isCorrect;
                    
                    return (
                      <div key={question.id} className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="answer-status">
                          {isCorrect ? "✓" : "✗"}
                        </div>
                        <div className="answer-details">
                          <div className="answer-header">
                            <span className="answer-question">Question {index + 1}: {question.question}</span>
                            <span className="answer-category">{question.category}</span>
                          </div>
                          <div className="answer-comparison">
                            <span className="user-answer">Your Answer: {userAnswer?.selectedAnswer || "Not answered"}</span>
                            <span className="correct-answer">Correct Answer: {question.correctAnswer}</span>
                            <span className="answer-time">Time: {userAnswer?.timeSpent || 0} seconds</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="result-actions">
                <button className="restart-btn" onClick={restartQuiz}>
                  Restart Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Developed with React.js | Interactive Quiz App © 2023 | {quizData.length} Questions</p>
      </footer>
    </div>
  );
};

export default App;