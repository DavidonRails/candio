// database
const db = require("../models");
const roles = require("../config/role.config");

const Quizdb = db.quiz;

exports.initial = () => {

    Quizdb.create({
        id: 1,
        assessment: "generalist",
        label: "Generalist Quiz",
        summary : "Full-stack and back-end web devs are in high demand at almost every company. This quiz covers general coding, algorithms, web development, low-level systems, and system design.",
        description : `General coding logic: we'll show you some code snippets and ask you to reason about them.
        Common iOS APIs and UI elements: appropriate use cases, performance tricks, and best practices.
        Algorithms: the use cases and performance of common textbook algorithms.
        Swift and Objective-C. We include questions on both, but don't worry if you're focused on one or the other.
        Mobile app design: architectural principles, architecture patterns like MVC, and additional layers you might consider for some purposes.`,
        category : null,
        ques_counts : 10
    });

    Quizdb.create({
        id: 2,
        assessment: "front-end",
        label: "Front-end Quiz",
        summary : "Front-end devs create attractive websites or complex single-page applications for end users. This quiz covers front-end coding, JavaScript, CSS, HTTP, web security, and full-stack system design.",
        description : `General coding logic: we'll show you some code snippets and ask you to reason about them.
        Common iOS APIs and UI elements: appropriate use cases, performance tricks, and best practices.
        Algorithms: the use cases and performance of common textbook algorithms.
        Swift and Objective-C. We include questions on both, but don't worry if you're focused on one or the other.
        Mobile app design: architectural principles, architecture patterns like MVC, and additional layers you might consider for some purposes.`,
        category : null,
        ques_counts : 10
    });

    Quizdb.create({
        id: 3,
        assessment: "android",
        label: "Mobile (Android) Quiz",
        summary : "From food delivery to social media, Android developers enable new kinds of business. This quiz covers native APIs and components, the Android platform itself, and UX optimization.",
        description : `General coding logic. We'll show you some code snippets and ask you to reason about them.
                        Common Android APIs and UI components: appropriate use cases, performance tricks, and best practices.
                        Algorithms: use cases and performance of common textbook algorithms.
                        Java and Kotlin. We include questions on both, but don't worry if you're focused on one or the other.
                        Mobile app design: architectural principles, patterns like MVVM, and additional layers you may want to consider for certain purposes.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 4,
        assessment: "ios",
        label: "Mobile (iOS) Quiz",
        summary : "From Angry Birds to rideshares, iOS developers make the next big app beautiful and performant. This quiz covers native APIs and components, the iOS platform itself, and UX optimization.",
        description : `Our iOS quiz covers native iOS application development. It covers the following areas:
                        General coding logic: we'll show you some code snippets and ask you to reason about them.
                        Common iOS APIs and UI elements: appropriate use cases, performance tricks, and best practices.
                        Algorithms: the use cases and performance of common textbook algorithms.
                        Swift and Objective-C. We include questions on both, but don't worry if you're focused on one or the other.
                        Mobile app design: architectural principles, architecture patterns like MVC, and additional layers you might consider for some purposes.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 5,
        assessment: "react native",
        label: "Mobile (Cross platform) Quiz",
        summary : "Every modern cloud deployment needs a DevOps engineer. This quiz covers automated resource management and configuration, cloud deployment, and Linux as a server OS.",
        description : `Our React Native Mobile quiz focuses on programming for infrastructure development and management, as opposed to application development. It covers the following areas:
                        General coding logic. We'll show you some code snippets and ask you to reason about them.
                        Cloud infrastructure: major cloud offerings and their advantages and disadvantages from both technical and business perspectives.
                        Practical Linux: Linux as an operating system, particularly for web servers Most of the questions apply to more general *nix operating systems as well.
                        Back-end development: databases and application servers, both from the perspective of someone who might build one and from the perspective of someone maintaining applications built by others.
                        The questions cover a broad range of topics across Cross platform Mobile Development and software en`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 6,
        assessment: "ml",
        label: "Machine Learning Quiz",
        summary : "ML developers catch fraud before it happens and make cars drive themselves. This quiz covers academic theory behind ML, common model failure modes, and deployment and maintenance.",
        description : `General coding logic. We'll show you some code snippets and ask you to reason about them.
                        ML theory: major concepts in machine learning like overfitting and bagged samples; the calculus and linear algebra that underlie many ML models.
                        Back-end development: databases, HTTP APIs, and other basics of back-end development as part of a larger application.
                        Model design: which models or approaches are appropriate in particular situations.`,
        category : null,
        ques_counts : 10
    });

    Quizdb.create({
        id: 7,
        assessment: "data",
        label: "Data Science Quiz",
        summary : "Data scientists guide business and government decision-making around the world. This quiz covers data model design and related engineering around maintenance and deployment.",
        description : `General coding logic. We'll show you some code snippets and ask you to reason about them.
                        Model design and tuning: which models are appropriate for which situations and how to tune the parameters of a model to avoid common failure-modes.
                        Deployment and maintenance: putting a model into production as part of a larger system and maintain it in real world conditions.
                        Mathematical theory: mathematical principles behind different models and how those principles affect design decisions.`,
        category : null,
        ques_counts : 10
    });

    Quizdb.create({
        id: 8,
        assessment: "python",
        label: "Python Quiz",
        summary : "Python is a favorite for ML, data, and mathematical applications. This quiz covers its syntax, distinguishing features, standard and widely-used libraries, and basic coding logic.",
        description : `We designed our entry-level quiz to evaluate the skills of early-career engineers, like current CS students and recent grads, bootcamp students and grads, and self-taught devs who haven’t worked as a professional engineer yet. Engineers who have already held a full-time role should take a non-entry-level quiz in their area of expertise.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 9,
        assessment: "javascript",
        label: "Javascript Quiz",
        summary : "JavaScript is used for almost all front-end web development, and is now widely used for back-ends too. This quiz covers its syntax, distinguishing features, standard and widely-used libraries, and basic coding logic.",
        description : `We designed our entry-level quiz to evaluate the skills of early-career engineers, like current CS students and recent grads, bootcamp students and grads, and self-taught devs who haven’t worked as a professional engineer yet. Engineers who have already held a full-time role should take a non-entry-level quiz in their area of expertise.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 10,
        assessment: "java",
        label: "Java Quiz",
        summary : "Java is popular for general-purpose portable development, especially at large companies. This quiz covers its syntax, distinguishing features, standard and widely-used libraries, and basic coding logic.",
        description : `Most of the entry-level quiz questions involve looking at snippets of code and figuring out what they do or how to fix them. The questions cover a broad range of topics, including basic JavaScript and CSS knowledge, and consuming simple HTTP APIs. Our entry-level quiz offers more time to complete each question and the specific questions are calibrated to evaluate the knowledge expected of a new dev, not a senior engineer. We don’t expect anyone to know the answer to every question. If something is unfamiliar, we recommend clicking “I don’t know” rather than guessing.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 11,
        assessment: "go",
        label: "Go Quiz",
        summary : "Go is a rising star for high-performance applications, especially cloud computing. This quiz covers its syntax, distinguishing features, standard and widely used libraries, and basic coding logic.",
        description : `Python is a general purpose language that sees a wide range of applications, but engineers interested in back-end web development (with Django or Flask) or in data science, machine learning, or mathematical computation (with libraries like NumPy or TensorFlow) will particularly benefit from showing mastery of Python.
                        This quiz covers the following topics:
                        Basic coding, including syntax, control flow, function definitions, etc.
                        Classes and objects, e.g. inheritance and scope.
                        Distinguishing features of Python like list comprehension and other syntactic sugar.
                        Basics of major Python libraries like Flask and Numpy.
                        Debugging and error handling with Python.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 12,
        assessment: "rust",
        label: "Rust Quiz",
        summary : "Rust is a dev favorite for low-level and resource-constrained programming. This quiz covers its syntax, distinguishing features, standard and widely-used libraries, and basic coding logic.",
        description : `JavaScript is the foundation of virtually all front-end web development, and any engineer interested in touching front-end or full-stack web development will benefit from demonstrating mastery of JS.
                        This quiz covers the following topics:
                        Basic coding, including syntax, control flow, and primitive data structures.
                        Container objects and object-oriented programming in JavaScript.
                        Distinguishing JavaScript features like Promises, higher-order functions, and DOM manipulation.
                        The JavaScript standard library and common libraries/frameworks like React and Express.
                        Debugging and error handling with JavaScript.`,
        category : "language",
        ques_counts : 10
    });

    Quizdb.create({
        id: 13,
        assessment: "junior",
        label: "Generalist (Entry-level) Quiz",
        summary : "Full-stack and back-end web devs are in high demand at almost every company. This quiz covers general coding, algorithms, web development, low-level systems, and system design and is meant for entry-level engineers.",
        description : `Java is used worldwide for numerous purposes, and engineers who are particularly interested in working with large, stable, well-estasblished companies will particularly benefit from showing their Java mastery.
                        This quiz covers the following topics:
                        Basic coding, including syntax, control flow, and primitive data structures.
                        Container objects, like ArrayLists and trees.
                        Object-oriented programming, including inheritance, polymorphism, inner classes, etc.
                        The Java standard library and other commonly used libraries.
                        Debugging and error handling with Java.`,
        category : "junior",
        ques_counts : 10
    });

    Quizdb.create({
        id: 14,
        assessment: "front-end-junior",
        label: "Front-end (Entry-level) Quiz",
        summary : "Front-end devs create attractive websites or complex single-page applications. This quiz covers front-end coding, JavaScript, CSS, HTTP, security, and full-stack system design, and is intended for entry-level engineers.",
        description : `Rust is very popular with low-level developers and often tops lists of engineers' favorite languages.
                        This quiz covers the following topics:
                        Basic coding, including syntax, primitive data structures, and control flow.
                        Container objects, classes, and structs.
                        Unique Rust language features like ownership, borrowing, and lifetimes.
                        Common packages and libraries and how to incorporate them into a Rust application.
                        Debugging and computing with Rust.`,
        category : "junior",
        ques_counts : 10
    });
};