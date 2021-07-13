// database
const db = require("../models");
const Entities = require('html-entities').XmlEntities;
const Quedb = db.question;
const Ansdb = db.questionAnswer;
const candb = db.candidateAnswer;

const entities = new Entities();

var answers = [
    `aIn a given class, constructors are always required to be defined, but destructors are not`, 
    `bNeither constructors nor destructors can take parameters`, 
    `cConstructors can take parameters, but destructors cannot`, 
    `dIt is illegal to define a destructor as virtual`,
    `eIt is illegal to define a constructor as virtual`,
    `fBoth explicitly declared constructors and explicitly declared destructors are required in a class`,
    'aIn Base In Base In Derived', 
    'bIn Base In Derived In Derived', 
    'cIn Derived In Derived In Derived', 
    'dIn Derived In Base In Derived',
    'f In Base In Derived',
    'aThe relation between Base and Derived can be described as: Base is a Derived', 
    'bThe relation between Base and Derived can be described as: Base has a Derived', 
    'cDerived can access private member functions of Base', 
    'dDerived can access public and protected member functions of Base',
    'a+=', 
    'b>>', 
    'c<', 
    'c<',
    'e::',
    'f&&',
    'g=',
    'h?:',
    `aThe compilation will fail with the error - '__LINE__' : undeclared identifier`, 
    `bThe compilation will fail with the error - '__LINE__' unresolved identifier`, 
    `cThe code will compile and run without errors`, 
    `dThe code will crash at runtime`,
    'aObject objShape of Shape class will be created', 
    `bA compile time error will be generated because you cannot declare Shape objects`, 
    `cA compile time error will be generated because you cannot call draw function of class 'Shape'`, 
    `dA compile time error will be generated because the derived class's draw() function cannot override the base class draw() function`,
    `aabort`, 
    `bset_terminate`, 
    `cterminate`, 
    `dclose`,
    `avoid fun(int, char *) 
    void fun(char *,int)
   `, 
    `bvoid x(int,char) 
    int *x(int,char)
   `, 
    `cint get(int) 
    int get(int,int)
   `, 
    `dvoid F(int *) 
    void F(float *)
   `,
   `eAll of the above are overloaded functions`,
   `avoid fun(int, char *) 
   void fun(char *,int)
   `, 
   `bvoid x(int,char) 
   int *x(int,char)
   `, 
   `cint get(int) 
   int get(int,int)
   `, 
   `dvoid F(int *) 
   void F(float *)
   `,
   `eAll of the above are overloaded functions`,
   `aTo make it impossible for this particular destructor to be overloaded`, 
   `bTo ensure that correct destructor is called when p is deleted`, 
   `cTo ensure that the destructors are called in proper order`, 
   `dTo improve the speed of class Person's destruction`,
   `aprivate`, 
   `bprotected`, 
   `cdefault`, 
   `dvirtual`,
   `epublic`,
   `aA constructor can return values but a member function cannot`, 
   `bA member function can declare local variables but a constructor cannot`, 
   `cA member function can return values but a constructor cannot`, 
   `dA constructor can declare local variables but a member function cannot`,
   `aWhen an object of MyClass is passed by value to a function`, 
   `bWhen an object of MyClass is returned by value from a function`, 
   `cMyClass object1;
       MyClass object2;
       object2 = object1;
       `, 
   `dMyClass object1;
   MyClass *object2  = new MyClass(object1);
   `,
   `aWhen an object of MyClass is passed by value to a function`, 
   `bWhen an object of MyClass is returned by value from a function`, 
   `eMyClass object1;
   MyClass object2 = object1;
   `,
   `dMyClass object1;
   MyClass *object2  = new MyClass(object1);
   `,
   `astd::err`, 
   `bstd::error`, 
   `cstd::cerror`, 
   `dstd::cerr`,
   `a<array>`, 
   `b<deque>`, 
   `c<queue>`, 
   `d<list>`,
   `aThe code will generate compilation errors`, 
   `bThe code will compile and run fine. "Animal speaking" will be printed to the output`, 
   `cThe code will compile and run fine. "Snake speaking" will be printed to the output`, 
   `dThe code will crash at runtime`,
   `aFunctions can be overloaded`, 
   `bFunctions can return the type void`, 
   `cInline functions are expanded during compile time to avoid invocation overhead`, 
   `dYou can create arrays of functions`,
   `eYou can pass values to functions by reference arguments`,
   `fYou can return values from functions by reference arguments`,
   `gA function can return a pointer`,
   `aequating it to 1`, 
   `bequating it to 0`, 
   `cequating it to NULL`, 
   `dthe 'pure' keyword`,
   `apublic access specifier`, 
   `bprivate access specifier`, 
   `cprotected access specifier`, 
   `dfriend access specifier`,
   'Hello world', 
   'bgcolor = bgackground', 
   'HTML validity and XSS attack prevention you.  can achieve from XmlEntities class', 
   'require("html-entities").XmlEntities html-entities").XmlEntitie',
   ` 18 {
       19 Car c(4);
       20 cout << "No of wheels:" << c.GetWheels();
       21 }`, 
   
   `14 return Wheels;
    15 }
    16 };
    17 main()
   `, 
   `6 public:
    7 Car(int wheels = 0)
    8 : Wheels(wheels)
   `, 
   `cout << "No of wheels:" << c.GetWheels`,
   `aextern "C"`, 
   `bextern C`, 
   `c_stdcall`, 
   `d_cdecl`,
   `a4`, 
   `b7`, 
   `c8`, 
   `d14`,
   `e19`,
   `a4`, 
   `d7`, 
   `e8`, 
   `gThe code will have compile time errors`,
   `aThe code will compile fine`, 
   `bThere will be errors because classes cannot be defined inside other classes`, 
   `cThere will be an error because Outer does not define a constructor`, 
   `dThere will be an error because in the declaration of innerObject the type Inner must be qualified by Outer`,
   `eThere will be no errors but a warning that Inner and Outer do not have destructors`,
   `aThe * operator can be overloaded to perform division`, 
   `bThe * operator can be overloaded to perform assignment`, 
   `c** can be overloaded to perform "to the power of"`, 
   `dOperators can be overloaded only in inside classes`,
   `eOperators can be overloaded globally`,
   `aPerson(string sName);`, 
   `bPerson(string sName, int nAge);`, 
   `cCopy(Person *p);`, 
   `dPerson(const Person &p);`,
   `aC++ and namespaces should be used to replace occurrences of function overloading`, 
   `bOverloaded functions may not be declared as "inline"`, 
   `cAlthough the return types and parameter types of overloaded functions can be different, the actual number of parameters cannot change`, 
   `cAlthough the return types and parameter types of overloaded functions can be different, the actual number of parameters cannot change`,
   `dFunction overloading is possible in both C and C++`,
   `eThe parameter lists and const keyword are used to distinguish functions of the same name declared in the same scope`,
   `avector::empty deletes all elements of the vector`, 
   `bvector::erase can be used to delete a single element and a range of elements of the vector`, 
   `cAfter calling, vector::erase causes some of the iterators referencing the vector to become invalid`, 
   `dvector::count returns the number of elements in the vector`,
   
   `aAutomatic assignment of data to objects during instantiation`, 
   `bAutomatic call of a function`, 
   `cDeclaration of a local variable`, 
   `dAutomatically erasing an object when it is no longer needed`,
   `eAutomatic handling of run-time errors in the program`,
   `fAutomatic termination of a program in case the user does not respond within a given time period`,
   `gAutomatic creation of variables`,
   
   `aAccessible derived type`, 
   `bAccess to derived type`, 
   `cAbstract data type`, 
   `dAbstract derived type`,
   `eAccessible data type`,
   
   `astd::sort`, 
   `bstd::qsort`, 
   `cstd::stable_sort`, 
   `dstd::partial_sort`,
   
   `a10`, 
   `b11`, 
   `test`, 
   `tefafaf ff ast`,
   
   `aBase Exception`, 
   `bDerived Exception`, 
   `cUnknown Exception Thrown`, 
   `dNo Output will be generated`,
   
   `aA can access all private data members of B`, 
   `bB can access all private data members of A`, 
   `cA cannot access the private members of B`, 
   `dB cannot access the private members of A`,
   `eBoth A and B can access each other's private data members`,
   
   `aIncorrect syntax. The body of the class declaration is missing`, 
   `bIncorrect syntax. {}; is missing`, 
   `cThe syntax is correct`, 
   `dIncorrect syntax. {} is missing`,
   `eIncorrect syntax. Requires a *`,
   
   `aBase Base`, 
   `bBase Derived`, 
   `cDerived Base`, 
   `dDerived Derived`,
   
   `aCode will Crash or Throw and Exception`, 
   `bCode will Execute, but there will be a memory leak`, 
   `cCode will execute properly`, 
   `dCode will exhibit undefined behavior`,
   
   `1. They have external linkage`, 
   `2. They do not have 'this' pointers`, 
   `3. They can be declared as virtual`, 
   `4. They can have the same name as a non-static function that has the same argument types`,

   `aA non-template member function`, 
   `bA template function definition`, 
   `cA template function declaration`, 
   `dA template class definition`,
   `eA template class declaration`,
   `aIn a given class, constructors are always required to be defined, but destructors are not`, 
   `bNeither constructors nor destructors can take parameters`, 
   `cConstructors can take parameters, but destructors cannot`, 
   `dIt is illegal to define a destructor as virtual`,
   `eIt is illegal to define a constructor as virtual`,
   `fBoth explicitly declared constructors and explicitly declared destructors are required in a class`,
   'aIn Base In Base In Derived', 
   'bIn Base In Derived In Derived', 
   'cIn Derived In Derived In Derived', 
   'dIn Derived In Base In Derived',
   'f In Base In Derived',
   'aThe relation between Base and Derived can be described as: Base is a Derived', 
   'bThe relation between Base and Derived can be described as: Base has a Derived', 
   'cDerived can access private member functions of Base', 
   'dDerived can access public and protected member functions of Base',
   'a+=', 
   'b>>', 
   'c<', 
   'c<',
   'e::',
   'f&&',
   'g=',
   'h?:',
   `aThe compilation will fail with the error - '__LINE__' : undeclared identifier`, 
   `bThe compilation will fail with the error - '__LINE__' unresolved identifier`, 
   `cThe code will compile and run without errors`, 
   `dThe code will crash at runtime`,
   'aObject objShape of Shape class will be created', 
   `bA compile time error will be generated because you cannot declare Shape objects`, 
   `cA compile time error will be generated because you cannot call draw function of class 'Shape'`, 
   `dA compile time error will be generated because the derived class's draw() function cannot override the base class draw() function`,
   `aabort`, 
   `bset_terminate`, 
   `cterminate`, 
   `dclose`,
   `avoid fun(int, char *) 
   void fun(char *,int)
  `, 
   `bvoid x(int,char) 
   int *x(int,char)
  `, 
   `cint get(int) 
   int get(int,int)
  `, 
   `dvoid F(int *) 
   void F(float *)
  `,
  `eAll of the above are overloaded functions`,
  `avoid fun(int, char *) 
  void fun(char *,int)
  `, 
  `bvoid x(int,char) 
  int *x(int,char)
  `, 
  `cint get(int) 
  int get(int,int)
  `, 
  `dvoid F(int *) 
  void F(float *)
  `,
  `eAll of the above are overloaded functions`,
  `aTo make it impossible for this particular destructor to be overloaded`, 
  `bTo ensure that correct destructor is called when p is deleted`, 
  `cTo ensure that the destructors are called in proper order`, 
  `dTo improve the speed of class Person's destruction`,
  `aprivate`, 
  `bprotected`, 
  `cdefault`, 
  `dvirtual`,
  `epublic`,
  `aA constructor can return values but a member function cannot`, 
  `bA member function can declare local variables but a constructor cannot`, 
  `cA member function can return values but a constructor cannot`, 
  `dA constructor can declare local variables but a member function cannot`,
  `aWhen an object of MyClass is passed by value to a function`, 
  `bWhen an object of MyClass is returned by value from a function`, 
  `cMyClass object1;
      MyClass object2;
      object2 = object1;
      `, 
  `dMyClass object1;
  MyClass *object2  = new MyClass(object1);
  `,
  `aWhen an object of MyClass is passed by value to a function`, 
  `bWhen an object of MyClass is returned by value from a function`, 
  `eMyClass object1;
  MyClass object2 = object1;
  `,
  `dMyClass object1;
  MyClass *object2  = new MyClass(object1);
  `,
  `astd::err`, 
  `bstd::error`, 
  `cstd::cerror`, 
  `dstd::cerr`,
  `a<array>`, 
  `b<deque>`, 
  `c<queue>`, 
  `d<list>`,
  `aThe code will generate compilation errors`, 
  `bThe code will compile and run fine. "Animal speaking" will be printed to the output`, 
  `cThe code will compile and run fine. "Snake speaking" will be printed to the output`, 
  `dThe code will crash at runtime`,
  `aFunctions can be overloaded`, 
  `bFunctions can return the type void`, 
  `cInline functions are expanded during compile time to avoid invocation overhead`, 
  `dYou can create arrays of functions`,
  `eYou can pass values to functions by reference arguments`,
  `fYou can return values from functions by reference arguments`,
  `gA function can return a pointer`,
  `aequating it to 1`, 
  `bequating it to 0`, 
  `cequating it to NULL`, 
  `dthe 'pure' keyword`,
  `apublic access specifier`, 
  `bprivate access specifier`, 
  `cprotected access specifier`, 
  `dfriend access specifier`,
  'Hello world', 
  'bgcolor = bgackground', 
  'HTML validity and XSS attack prevention you.  can achieve from XmlEntities class', 
  'require("html-entities").XmlEntities html-entities").XmlEntitie',
];


var questions = [
    "Which of the following statements about constructors and destructors are true?",
    `class d : public b
    {
    int j;
    public:
    void vfoo()
    {
    cout<<"In Derived ";
    }
    };
    void main()
    {
    b *p, ob;
    d ob2;
    p = &ob;
    p->vfoo();
    p = &ob2;
    p->vfoo();
    ob2.vfoo();
    }
    `,

    `Consider the following class hierarchy:
    class Base
    {
    }
    class Derived : private Base
    {
    }`,


    `Which of the following operators cannot be overloaded?`,

    `Consider the following code:
    #include<iostream>
    using namespace std;
    int main()
    {
        cout << "The value of __LINE__ is " <<__LINE__;
        return 0;
        }
        What will be the result when the above code is compiled and executed?
    `,

    `Consider the sample code given below and answer the question that follows.
    class Shape
    {
    public:
    virtual void draw() = 0;
    };
    `,

    `If a matching catch handler (or ellipsis catch handler) cannot be found for the current exception, then the following predefined runtime function is called ______.`,

    `Which of the following sets of functions do not qualify as overloaded functions?`,

    `Consider the sample code given below and answer the question that follows.
    template <class T> Run(T process);
    Which one of the following is an example of the sample code given above?
    `,

    `Consider the sample code given below and answer the question that follows.
    class Person 
    {
    public:
    Person();
    virtual ~Person();
    };
    `,

    `What access specifier allows only the class or a derived class to access a data member`,


    `Which of the following are true about class member functions and constructors?`,
    `Suppose MyClass is a class that defines a copy constructor and overloads the assignment operator. In which of the following cases will the copy constructor of MyClass be called?`,

    `Which of the following is a predefined object in C++ and used to insert to the standard error output?`,


    `Which of the following is not a standard STL header?`,


    `Consider the following code:
    class Animal
    {
    private:
        int weight;
    public:
    `,



    `Which of the following statements regarding functions are false?`,



    `A pure virtual function can be declared by _______.`,



    `Base class members are made accessible to a derived class and inaccessible to rest of the program by _____.`,



    `Consider the sample code given below and answer the question that follows.`,

    `You want the data member of a class to be accessed only by itself and by the class derived from it. Which access specifier will you give to the data member?`,

    `What linkage specifier do you use in order to cause your C++ functions to have C linkage`,

    ` Which of the following lines from the sample code above are examples of data member definition?`,

    `Consider the following code:
    #include<stdio.h>`,

    ` What will be the result when the above code is compiled?`,

    `Which of the following statements are true for operator overloading in C++?`,

    `Consider the sample code given below and answer the question that follows.`,

    `Which of the following statements about function overloading, is true?`,

    `Which of the following statements are true about C++ vector class?`,

    `In C++, the keyword auto can be used for:`,

    `What does ADT stand for?`,

    `Which of the following is NOT a standard sorting algorithm:`,

    `Consider the following code:
    #define SQ(a) (a*a)
    `,

    `Consider the following code:
                    class BaseException
                    {
                        public:
                        virtual void Output()
                        {
                            cout << "Base Exception" << endl;
                        }
                    };
                    `,

    `Consider two classes A and B:
                class A
                {
                private:
                    int x;
                    float y;
                public:
                friend class B;
                };
                `,

    `Consider the line of code given below and answer the question that follows.`,

    `What will be the output of the following code?`,

    `Consider the following code:
    template<class T> void Kill(T *& objPtr)
    `,
    `Consider the following statements relating to static member functions and choose the appropriate options:`

];

exports.initial = async () => {

    for(let i = 0; i < answers.length; i++) {
        await Ansdb.create({
            question_id: parseInt(i / 4) + 1,
            answer:  entities.encode(answers[i]),
            isCorrect: (i % 4 == 0) ?  true : false,
        });
    }

    for(let i = 0; i < questions.length; i++) {
        await Quedb.create({
            quiz_id: 1,
            query:  entities.encode(questions[i])
        });
    }

/*
    Quedb.create({
        id: 40,
        quiz_id: 8,
        `Consider the following statements relating to static member functions and choose the appropriate options:`
        answers:  entities.encode(JSON.stringify(answers)
        correct: 1
    });
*/
};