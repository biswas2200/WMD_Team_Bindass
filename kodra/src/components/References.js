import React, { useState } from 'react';
import './../global.css'; // Ensure we have access to global styles

const referencesData = [
    {
        id: 'dsa',
        title: 'Data Structures & Algorithms (DSA)',
        icon: '🧩',
        description: 'Master the fundamental building blocks of efficient software.',
        articles: [
            { title: 'GeeksforGeeks - DSA Tutorials', url: 'https://www.geeksforgeeks.org/data-structures/' },
            { title: 'Programiz - DSA Guide', url: 'https://www.programiz.com/dsa' },
            { title: 'Big-O Cheatsheet', url: 'https://www.bigocheatsheet.com/' }
        ],
        platforms: [
            { title: 'Coursera - Algorithms Specialization', url: 'https://www.coursera.org/specializations/algorithms' },
            { title: 'EdX - Algorithms & Data Structures', url: 'https://www.edx.org/learn/algorithms' },
            { title: 'LeetCode - Practice Problems', url: 'https://leetcode.com/' }
        ]
    },
    {
        id: 'dbms',
        title: 'Database Management Systems (DBMS)',
        icon: '💾',
        description: 'Learn how to store, manipulate, and define data.',
        articles: [
            { title: 'Guru99 - DBMS Tutorial', url: 'https://www.guru99.com/dbms-tutorial.html' },
            { title: 'Javatpoint - DBMS Tutorial', url: 'https://www.javatpoint.com/dbms-tutorial' },
            { title: 'W3Schools - SQL Tutorial', url: 'https://www.w3schools.com/sql/' }
        ],
        platforms: [
            { title: 'Coursera - Database Management', url: 'https://www.coursera.org/learn/database-management' },
            { title: 'Udemy - SQL Bootcamp', url: 'https://www.udemy.com/topic/sql/' },
            { title: 'MongoDB University', url: 'https://learn.mongodb.com/' }
        ]
    },
    {
        id: 'oops',
        title: 'Object-Oriented Programming (Java)',
        icon: '☕',
        description: 'Understand classes, objects, inheritance, and polymorphism.',
        articles: [
            { title: 'Oracle Java Documentation', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
            { title: 'Baeldung - Java OOP', url: 'https://www.baeldung.com/java-oop' },
            { title: 'GeeksforGeeks - Java OOPs', url: 'https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/' }
        ],
        platforms: [
            { title: 'Codecademy - Learn Java', url: 'https://www.codecademy.com/learn/learn-java' },
            { title: 'Udemy - Java Programming Masterclass', url: 'https://www.udemy.com/course/java-the-complete-java-developer-course/' },
            { title: 'Hyperskill (JetBrains Academy)', url: 'https://hyperskill.org/' }
        ]
    },
    {
        id: 'os',
        title: 'Operating Systems',
        icon: '🖥️',
        description: 'Explore the software that manages computer hardware and resources.',
        articles: [
            { title: 'GeeksforGeeks - OS Tutorials', url: 'https://www.geeksforgeeks.org/operating-systems/' },
            { title: 'TutorialsPoint - Operating System', url: 'https://www.tutorialspoint.com/operating_system/index.htm' },
            { title: 'OSDev Wiki', url: 'https://wiki.osdev.org/Main_Page' }
        ],
        platforms: [
            { title: 'Coursera - Operating Systems', url: 'https://www.coursera.org/learn/os-power-user' },
            { title: 'Udacity - Intro to OS', url: 'https://www.udacity.com/course/introduction-to-operating-systems--ud923' }
        ]
    },
    {
        id: 'cn',
        title: 'Computer Networking',
        icon: '🌐',
        description: 'Dive into the world of networks, protocols, and communication.',
        articles: [
            { title: 'GeeksforGeeks - Computer Network', url: 'https://www.geeksforgeeks.org/computer-network-tutorials/' },
            { title: 'Cisco Networking Basics', url: 'https://www.cisco.com/c/en/us/solutions/small-business/resource-center/networking/networking-basics.html' },
            { title: 'Cloudflare - What is the Internet?', url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-internet/' }
        ],
        platforms: [
            { title: 'Coursera - Computer Networking', url: 'https://www.coursera.org/specializations/computer-communications' },
            { title: 'EdX - Networking Courses', url: 'https://www.edx.org/learn/computer-networking' },
            { title: 'Cisco Networking Academy', url: 'https://www.netacad.com/' }
        ]
    },
    {
        id: 'ml',
        title: 'Machine Learning',
        icon: '🤖',
        description: 'Learn about algorithms that give computers the ability to learn.',
        articles: [
            { title: 'Towards Data Science', url: 'https://towardsdatascience.com/' },
            { title: 'Machine Learning Mastery', url: 'https://machinelearningmastery.com/' },
            { title: 'Google AI - ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' }
        ],
        platforms: [
            { title: 'Coursera - Machine Learning (Andrew Ng)', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
            { title: 'Kaggle - Learn', url: 'https://www.kaggle.com/learn' },
            { title: 'Fast.ai', url: 'https://www.fast.ai/' }
        ]
    }
];

const ReferenceCard = ({ data, isOpen, toggle }) => {
    return (
        <div className={`ka-card ${isOpen ? 'active' : ''}`} style={{ marginBottom: '1.5rem', transition: 'all 0.3s ease' }}>
            {/* Header - Always Visible */}
            <div
                className="ka-card-header"
                onClick={toggle}
                onKeyPress={(e) => e.key === 'Enter' && toggle()}
                role="button"
                tabIndex={0}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isOpen ? 'rgba(0, 180, 216, 0.1)' : 'transparent'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{data.icon}</span>
                    <div>
                        <h3 className="ka-text-xl ka-font-bold" style={{ margin: 0 }}>{data.title}</h3>
                        <p className="ka-text-sm ka-text-muted" style={{ margin: '0.25rem 0 0' }}>{data.description}</p>
                    </div>
                </div>
                <span style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    fontSize: '1.5rem',
                    color: 'var(--ka-primary-500)'
                }}>
                    ▼
                </span>
            </div>

            {/* Content - Slide Down */}
            {isOpen && (
                <div className="ka-card-body ka-slide-up" style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div className="ka-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>

                        {/* Articles Section */}
                        <div className="ka-card" style={{ background: 'var(--ka-primary-50)', border: 'none' }}>
                            <div className="ka-card-body">
                                <h4 className="ka-text-lg ka-font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    📄 Articles & Concepts
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {data.articles.map((article, idx) => (
                                        <a
                                            key={idx}
                                            href={article.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ka-btn ka-btn-ghost ka-text-left"
                                            style={{
                                                justifyContent: 'flex-start',
                                                background: 'rgba(255,255,255,0.6)',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                color: 'var(--ka-primary-800)'
                                            }}
                                        >
                                            🔗 {article.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Platforms Section */}
                        <div className="ka-card" style={{ background: 'var(--ka-secondary-50)', border: 'none' }}>
                            <div className="ka-card-body">
                                <h4 className="ka-text-lg ka-font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    🎓 Learning Platforms
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {data.platforms.map((platform, idx) => (
                                        <a
                                            key={idx}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ka-btn ka-btn-ghost ka-text-left"
                                            style={{
                                                justifyContent: 'flex-start',
                                                background: 'rgba(255,255,255,0.6)',
                                                border: '1px solid rgba(0,0,0,0.05)',
                                                color: 'var(--ka-secondary-800)'
                                            }}
                                        >
                                            ↗️ {platform.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default function References() {
    // State to track which accordion item is open. 
    // Using an ID ensures only one is open at a time (optional, can also use an array/set for multiple).
    // Let's allow multiple to be open for now as it's often more user-friendly, or just one? 
    // User asked for "slide down", let's keep it simple with independently toggleable items.
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="ka-container ka-fade-in" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            <div className="ka-text-center" style={{ marginBottom: '3rem' }}>
                <h1 className="ka-text-4xl ka-font-extrabold" style={{
                    background: 'linear-gradient(135deg, var(--ka-primary-600), var(--ka-secondary-500))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '1rem'
                }}>
                    Knowledge Hub
                </h1>
                <p className="ka-text-xl ka-text-muted">
                    Curated resources to master your engineering skills.
                </p>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {referencesData.map(topic => (
                    <ReferenceCard
                        key={topic.id}
                        data={topic}
                        isOpen={!!openItems[topic.id]}
                        toggle={() => toggleItem(topic.id)}
                    />
                ))}
            </div>
        </div>
    );
}
