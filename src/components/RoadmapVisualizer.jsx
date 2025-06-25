import React, { useState, useEffect } from 'react';

const RoadmapVisualizer = () => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [completedTopics, setCompletedTopics] = useState({});
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Load progress from memory (in a real app, this would be from localStorage)
    const savedProgress = {};
    setCompletedTopics(savedProgress);
    
    // Check if user is already logged in
    const savedUser = JSON.parse(sessionStorage.getItem('roadmapUser') || 'null');
    if (savedUser) {
      setUser(savedUser);
      loadUserProgress(savedUser.email);
    }
  }, []);

  const roadmapData = [
    {
      week: 1,
      java: [
        "Flowcharts, Variables & Data Types in Java",
        "Operators, if-else Statements",
        "Flow Control (Loops)"
      ],
      android: [
        "Kotlin Basics",
        "Functions, Null Safety",
        "Hello World App in Android Studio"
      ]
    },
    {
      week: 2,
      java: [
        "Patterns",
        "Functions & Methods",
        "Arrays: Basics + Problems"
      ],
      android: [
        "UI Components",
        "Click Events",
        "Navigation with Intents"
      ]
    },
    {
      week: 3,
      java: [
        "2D Arrays",
        "Strings",
        "Sorting Algorithms"
      ],
      android: [
        "RecyclerView & Adapters",
        "Kotlin Lists",
        "Mini App: Todo List"
      ]
    },
    {
      week: 4,
      java: [
        "Bit Manipulation",
        "OOP Concepts",
        "Practice OOP Problems"
      ],
      android: [
        "Kotlin OOP",
        "Layouts: Linear, Constraint, Relative",
        "ScrollView"
      ]
    },
    {
      week: 5,
      java: [
        "ArrayList",
        "Recursion Basics",
        "Recursion Problems"
      ],
      android: [
        "Multi-screen Apps",
        "Login UI",
        "Mini App: Login/Register"
      ]
    },
    {
      week: 6,
      java: [
        "Divide & Conquer",
        "Time & Space Complexity"
      ],
      android: [
        "RecyclerView Advanced",
        "Task Manager App",
        "CardView UI Polish"
      ]
    },
    {
      week: 7,
      java: [
        "Linked Lists",
        "Linked List Operations"
      ],
      android: [
        "MVVM Basics",
        "ViewModel & LiveData"
      ]
    },
    {
      week: 8,
      java: [
        "Stack & Queue",
        "Stack/Queue Problems"
      ],
      android: [
        "Room Database Setup",
        "Entity, DAO, Database"
      ]
    },
    {
      week: 9,
      java: [
        "Binary Trees",
        "Binary Search Trees"
      ],
      android: [
        "CRUD in Room DB",
        "Notes App with Room + RecyclerView"
      ]
    },
    {
      week: 10,
      java: [
        "Heaps / Priority Queue",
        "Hashing"
      ],
      android: [
        "API Integration with Retrofit",
        "JSON Parsing",
        "RecyclerView"
      ]
    },
    {
      week: 11,
      java: [
        "Tries",
        "Graphs (BFS, DFS)"
      ],
      android: [
        "API + ViewModel + LiveData",
        "Image Loading (Glide/Picasso)",
        "App: News/User Profile"
      ]
    },
    {
      week: 12,
      java: [
        "Dynamic Programming",
        "Backtracking",
        "Segment Trees"
      ],
      android: [
        "Final Project",
        "MVVM + Room + Retrofit",
        "Login + Dashboard App"
      ]
    }
  ];

  const toggleTopicCompletion = (week, track, topicIndex) => {
    const key = `${week}-${track}-${topicIndex}`;
    const newCompletedTopics = {
      ...completedTopics,
      [key]: !completedTopics[key]
    };
    setCompletedTopics(newCompletedTopics);
    
    // Save progress if user is logged in
    if (user) {
      saveUserProgress(user.email, newCompletedTopics);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google login (in real app, use Google OAuth)
      const mockUser = {
        email: 'user@example.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/40x40?text=JD'
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(mockUser);
      sessionStorage.setItem('roadmapUser', JSON.stringify(mockUser));
      loadUserProgress(mockUser.email);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('roadmapUser');
    sessionStorage.removeItem('roadmapProgress');
    setCompletedTopics({});
  };

  const saveUserProgress = (email, progress) => {
    // In real app, this would be an API call
    sessionStorage.setItem('roadmapProgress', JSON.stringify(progress));
  };

  const loadUserProgress = (email) => {
    // In real app, this would be an API call
    const savedProgress = JSON.parse(sessionStorage.getItem('roadmapProgress') || '{}');
    setCompletedTopics(savedProgress);
  };

  const getWeekProgress = (week) => {
    const weekData = roadmapData.find(w => w.week === week);
    const totalTopics = weekData.java.length + weekData.android.length;
    let completedCount = 0;

    weekData.java.forEach((_, index) => {
      if (completedTopics[`${week}-java-${index}`]) completedCount++;
    });
    weekData.android.forEach((_, index) => {
      if (completedTopics[`${week}-android-${index}`]) completedCount++;
    });

    return (completedCount / totalTopics) * 100;
  };

  const getOverallProgress = () => {
    let totalCompleted = 0;
    let totalTopics = 0;

    roadmapData.forEach(week => {
      totalTopics += week.java.length + week.android.length;
      week.java.forEach((_, index) => {
        if (completedTopics[`${week.week}-java-${index}`]) totalCompleted++;
      });
      week.android.forEach((_, index) => {
        if (completedTopics[`${week.week}-android-${index}`]) totalCompleted++;
      });
    });

    return totalTopics > 0 ? (totalCompleted / totalTopics) * 100 : 0;
  };

  const getCompletedWeeks = () => {
    return roadmapData.filter(week => getWeekProgress(week.week) === 100).length;
  };

  const ProgressPanel = () => {
    const overallProgress = getOverallProgress();
    const completedWeeks = getCompletedWeeks();

    return (
      <>
        {/* Backdrop */}
        <div 
          className={`progress-backdrop ${showProgressPanel ? 'visible' : ''}`}
          onClick={() => setShowProgressPanel(false)}
        />
        
        <div className={`progress-panel ${showProgressPanel ? 'visible' : ''}`}>
          <div className="progress-header">
            <h3>📊 Progress Dashboard</h3>
            <button 
              className="close-btn"
              onClick={() => setShowProgressPanel(false)}
            >
              ✕
            </button>
          </div>

          {/* User Section */}
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <div className="user-avatar">
                  <img src={user.picture} alt={user.name} />
                </div>
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="login-section">
                <div className="login-message">
                  <span>🔐</span>
                  <p>Login to save your progress across devices</p>
                </div>
                <button 
                  className="google-login-btn"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner">⏳</span>
                  ) : (
                    <>
                      <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-value">{overallProgress.toFixed(1)}%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{completedWeeks}/12</div>
              <div className="stat-label">Weeks Completed</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{Math.round((12 - completedWeeks) * 7)}</div>
              <div className="stat-label">Days Remaining</div>
            </div>
          </div>

          <div className="overall-progress-bar">
            <div className="progress-label">Journey Progress</div>
            <div className="progress-track">
              <div 
                className="progress-fill-overall" 
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{overallProgress.toFixed(1)}%</div>
          </div>

          <div className="week-progress-list">
            <h4>Weekly Progress</h4>
            {roadmapData.map(week => {
              const progress = getWeekProgress(week.week);
              return (
                <div key={week.week} className="week-progress-item">
                  <span className="week-label">Week {week.week}</span>
                  <div className="mini-progress-bar">
                    <div 
                      className="mini-progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{progress.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const WeekCard = ({ weekData, index }) => {
    const isSelected = selectedWeek === weekData.week;
    const delay = index * 100;
    const weekProgress = getWeekProgress(weekData.week);

    return (
      <div
        className={`week-card ${isSelected ? 'selected' : ''}`}
        style={{
          animationDelay: `${delay}ms`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)'
        }}
        onClick={() => setSelectedWeek(isSelected ? null : weekData.week)}
      >
        <div className="week-header">
          <div className="week-number">
            <span className="week-text">Week</span>
            <span className="week-digit">{weekData.week}</span>
            {weekProgress === 100 && <span className="completion-badge">✓</span>}
          </div>
          <div className="week-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${weekProgress}%` }}></div>
            </div>
            <span className="progress-label">{weekProgress.toFixed(0)}% Complete</span>
          </div>
        </div>
        
        <div className="week-content">
          <div className="track java-track">
            <h4 className="track-title">
              <span className="track-icon">☕</span>
              Java + DSA
            </h4>
            <ul className="topic-list">
              {weekData.java.map((topic, idx) => {
                const isCompleted = completedTopics[`${weekData.week}-java-${idx}`];
                return (
                  <li 
                    key={idx} 
                    className={`topic-item ${isCompleted ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopicCompletion(weekData.week, 'java', idx);
                    }}
                  >
                    <span className="topic-checkbox">
                      {isCompleted ? '✓' : '○'}
                    </span>
                    <span className="topic-text">{topic}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="track android-track">
            <h4 className="track-title">
              <span className="track-icon">🤖</span>
              Android + Kotlin
            </h4>
            <ul className="topic-list">
              {weekData.android.map((topic, idx) => {
                const isCompleted = completedTopics[`${weekData.week}-android-${idx}`];
                return (
                  <li 
                    key={idx} 
                    className={`topic-item ${isCompleted ? 'completed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopicCompletion(weekData.week, 'android', idx);
                    }}
                  >
                    <span className="topic-checkbox">
                      {isCompleted ? '✓' : '○'}
                    </span>
                    <span className="topic-text">{topic}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="roadmap-container">
      <style jsx>{`
        .roadmap-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 2rem;
          position: relative;
          overflow-x: hidden;
        }

        .roadmap-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(0, 123, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(0, 123, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 40% 80%, rgba(0, 123, 255, 0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        .roadmap-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
        }

        .main-title {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #007bff 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          text-shadow: 0 0 30px rgba(0, 123, 255, 0.5);
        }

        .subtitle {
          font-size: 1.2rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
        }

        .progress-toggle {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 1000;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border: none;
          border-radius: 50px;
          padding: 1rem 1.5rem;
          color: white;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
          transition: all 0.3s ease;
        }

        .progress-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
        }

        .progress-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 998;
        }

        .progress-backdrop.visible {
          opacity: 1;
          visibility: visible;
        }

        .progress-panel {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(0, 123, 255, 0.3);
          z-index: 999;
          transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          padding: 2rem;
        }

        .progress-panel.visible {
          right: 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 123, 255, 0.3);
        }

        .progress-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #007bff;
        }

        .close-btn {
          background: none;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #007bff;
        }

        .user-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 123, 255, 0.2);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid rgba(0, 123, 255, 0.3);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .user-email {
          font-size: 0.8rem;
          color: #888;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ff6b6b;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(255, 107, 107, 0.1);
          border-color: #ff6b6b;
        }

        .login-section {
          text-align: center;
        }

        .login-message {
          margin-bottom: 1.5rem;
        }

        .login-message span {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .login-message p {
          color: #b0b0b0;
          font-size: 0.9rem;
          margin: 0;
        }

        .google-login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          width: 100%;
          background: #ffffff;
          color: #333;
          border: none;
          border-radius: 12px;
          padding: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .google-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .google-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .google-icon {
          flex-shrink: 0;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .progress-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(0, 123, 255, 0.1);
          border: 1px solid rgba(0, 123, 255, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 900;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #b0b0b0;
          font-size: 0.9rem;
        }

        .overall-progress-bar {
          margin-bottom: 2rem;
        }

        .progress-label {
          color: #b0b0b0;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .progress-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          height: 12px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill-overall {
          height: 100%;
          background: linear-gradient(90deg, #007bff 0%, #00d4ff 100%);
          border-radius: 10px;
          transition: width 0.8s ease;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
        }

        .progress-percentage {
          text-align: right;
          color: #007bff;
          font-weight: 600;
        }

        .week-progress-list h4 {
          color: #b0b0b0;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .week-progress-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .week-label {
          font-size: 0.9rem;
          min-width: 60px;
        }

        .mini-progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          margin: 0 1rem;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff 0%, #00d4ff 100%);
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.8rem;
          color: #007bff;
          min-width: 35px;
          text-align: right;
        }

        .roadmap-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .week-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 123, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          animation: slideInUp 0.8s ease-out forwards;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .week-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .week-card:hover {
          transform: translateY(-8px);
          border-color: rgba(0, 123, 255, 0.6);
          box-shadow: 0 20px 40px rgba(0, 123, 255, 0.2),
                      0 0 20px rgba(0, 123, 255, 0.3);
        }

        .week-card:hover::before {
          opacity: 1;
        }

        .week-card.selected {
          border-color: #007bff;
          box-shadow: 0 0 30px rgba(0, 123, 255, 0.4),
                      inset 0 0 20px rgba(0, 123, 255, 0.1);
          transform: scale(1.02);
        }

        .week-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0, 123, 255, 0.3);
        }

        .week-number {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .week-text {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .week-digit {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #007bff 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(0, 123, 255, 0.5);
        }

        .completion-badge {
          position: absolute;
          top: -5px;
          right: -15px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        }

        .week-progress {
          flex: 1;
          margin-left: 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff 0%, #00d4ff 100%);
          border-radius: 3px;
          transition: width 0.8s ease;
          box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
        }

        .week-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .java-track {
          border-left: 3px solid #f39c12;
        }

        .android-track {
          border-left: 3px solid #a4c639;
        }

        .track-title {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .track-icon {
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .topic-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .topic-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 0;
          color: #d0d0d0;
          font-size: 0.9rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 6px;
          margin-bottom: 0.2rem;
        }

        .topic-item:hover {
          background: rgba(0, 123, 255, 0.1);
          color: #ffffff;
        }

        .topic-item.completed {
          color: #28a745;
          background: rgba(40, 167, 69, 0.1);
        }

        .topic-item.completed .topic-text {
          text-decoration: line-through;
          opacity: 0.8;
        }

        .topic-checkbox {
          margin-right: 0.8rem;
          font-size: 1rem;
          color: #007bff;
          min-width: 20px;
        }

        .topic-item.completed .topic-checkbox {
          color: #28a745;
        }

        .topic-text {
          flex: 1;
        }

        .topic-item:last-child {
          border-bottom: none;
        }

        @media (max-width: 768px) {
          .roadmap-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .main-title {
            font-size: 2.5rem;
          }
          
          .week-content {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .roadmap-container {
            padding: 1rem;
          }

          .progress-panel {
            width: 100%;
            right: -100%;
          }

          .progress-toggle {
            top: 1rem;
            right: 1rem;
            padding: 0.8rem 1.2rem;
          }
        }
      `}</style>

      <button 
        className="progress-toggle"
        onClick={() => setShowProgressPanel(true)}
      >
        📊 Track Progress
      </button>

      <ProgressPanel />

      <div className="roadmap-header">
        <h1 className="main-title">12-Week Development Journey</h1>
        <p className="subtitle">Java + DSA + Android Development Roadmap</p>
      </div>

      <div className="roadmap-grid">
        {roadmapData.map((weekData, index) => (
          <WeekCard key={weekData.week} weekData={weekData} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RoadmapVisualizer;