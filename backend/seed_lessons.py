import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Course, CourseMaterial, FileType

def seed_lessons():
    db = SessionLocal()
    try:
        # Check if materials already exist
        if db.query(CourseMaterial).count() > 0:
            print("Course materials already exist. Skipping seed.")
            return

        print("Seeding course materials/lessons...")

        # 1. Machine Learning Basics
        ml_course = db.query(Course).filter(Course.title == "Machine Learning Basics").first()
        if ml_course:
            ml_lessons = [
                CourseMaterial(
                    course_id=ml_course.id,
                    title="Introduction to Machine Learning",
                    description="What is Machine Learning and why is it useful?",
                    content="""# Introduction to Machine Learning

Welcome to the Course! In this lesson, we will explore the foundation of Machine Learning (ML) and how it differs from traditional software engineering.

## What is Machine Learning?

Traditional programming relies on writing explicit rules (code) that take data and produce an output. In contrast, **Machine Learning** learns patterns from labeled or unlabeled data to generate its own algorithms and rules.

```
Traditional Programming:
Data + Rules ===> [Computer] ===> Output

Machine Learning:
Data + Output ===> [Computer] ===> Rules (Model)
```

## Key Paradigms of ML

1. **Supervised Learning**: The model is trained on labeled training data (e.g., predicting house prices based on historical sales).
2. **Unsupervised Learning**: The model finds hidden structures in unlabeled data (e.g., clustering users by shopping habits).
3. **Reinforcement Learning**: An agent learns to make decisions by performing actions in an environment and receiving rewards or penalties.

In the next lesson, we will delve into the simplest supervised learning algorithm: Linear Regression!""",
                    order=0
                ),
                CourseMaterial(
                    course_id=ml_course.id,
                    title="Linear Regression: The Foundation",
                    description="Understanding regression, cost functions, and gradient descent.",
                    content="""# Linear Regression

Linear Regression is the bedrock of supervised learning. It modeling the relationship between a dependent scalar variable $y$ and one or more explanatory variables $x$.

## Mathematical Representation

The simple linear regression model is:
$$y = wx + b$$

Where:
- $w$ is the **weight** (slope)
- $b$ is the **bias** (y-intercept)

## The Cost Function (Mean Squared Error)

To find the best values for $w$ and $b$, we define a **cost function** that measures how far off our predictions are:
$$J(w, b) = \\frac{1}{2m} \\sum_{i=1}^{m} (f_{w,b}(x^{(i)}) - y^{(i)})^2$$

Our goal is to **minimize** this cost function using an optimization algorithm called **Gradient Descent**.

## Gradient Descent

We update $w$ and $b$ iteratively in the direction of steepest descent:
$$w := w - \\alpha \\frac{\\partial J}{\\partial w}$$
$$b := b - \\alpha \\frac{\\partial J}{\\partial b}$$

Where $\\alpha$ is the **learning rate**.""",
                    order=1
                ),
                CourseMaterial(
                    course_id=ml_course.id,
                    title="Logistic Regression & Classification",
                    description="Moving from continuous outputs to binary classification.",
                    content="""# Logistic Regression

Despite its name, **Logistic Regression** is used for **classification** tasks, not regression. It predicts the probability that an input belongs to a certain class.

## The Sigmoid Function

To output a probability between 0 and 1, we pass our linear regression equation through the **Sigmoid (Logistic) Function**:
$$g(z) = \\frac{1}{1 + e^{-z}}$$

Where $z = wx + b$.

```
Probability Output:
f(x) = g(wx + b)
```

## Decision Boundary

If the output probability is $\\ge 0.5$, we predict class $1$. Otherwise, we predict class $0$.

## Cost Function (Cross-Entropy Loss)

We cannot use Mean Squared Error because it leads to a non-convex cost function for classification. Instead, we use **Log Loss**:
$$L(f(x), y) = -y \\log(f(x)) - (1 - y) \\log(1 - f(x))$$""",
                    order=2
                ),
                CourseMaterial(
                    course_id=ml_course.id,
                    title="Neural Networks: From Perceptrons to Deep Learning",
                    description="Introduction to feedforward neural networks and activation functions.",
                    content="""# Neural Networks

Artificial Neural Networks (ANNs) are inspired by the human brain. They consist of layers of interconnected nodes (neurons) that process information.

## Anatomy of a Neuron

A single neuron (Perceptron) performs a weighted sum of its inputs, adds a bias, and passes the result through an **activation function**:
$$a = f(\\sum w_i x_i + b)$$

## Activation Functions

1. **ReLU (Rectified Linear Unit)**: $f(z) = \\max(0, z)$ (Most popular for hidden layers).
2. **Sigmoid**: $f(z) = \\frac{1}{1 + e^{-z}}$ (Used for binary classification outputs).
3. **Softmax**: Normalizes outputs into a probability distribution (Used for multi-class outputs).

## Multi-Layer Perceptrons (MLP)

A typical feedforward neural network has:
1. **Input Layer**: Receives the raw features.
2. **Hidden Layer(s)**: Extracts abstract features.
3. **Output Layer**: Yields final predictions.

Training is performed using **Backpropagation** and Gradient Descent to adjust the weights throughout the network.""",
                    order=3
                )
            ]
            for lesson in ml_lessons:
                db.add(lesson)

        # 2. Advanced System Design
        sd_course = db.query(Course).filter(Course.title == "Advanced System Design").first()
        if sd_course:
            sd_lessons = [
                CourseMaterial(
                    course_id=sd_course.id,
                    title="Scalability & Load Balancing",
                    description="How to handle massive user traffic using scale-out architectures.",
                    content="""# Scalability & Load Balancing

When building systems for millions of users, scaling is the most critical constraint.

## Vertical vs. Horizontal Scaling

- **Vertical Scaling (Scale-Up)**: Adding more CPU/RAM to a single server. Limitation: Hard hardware ceiling and single point of failure (SPOF).
- **Horizontal Scaling (Scale-Out)**: Adding more standard servers to a pool. Highly flexible, requires load balancers.

## Load Balancers

A load balancer sits in front of the servers and routes incoming client requests to healthy backend nodes.

### Algorithms:
1. **Round Robin**: Distributes requests sequentially.
2. **Least Connections**: Routes to the server handling the fewest active sessions.
3. **IP Hash**: Computes server index based on client IP (useful for session persistence).

## Consistent Hashing

To route requests or cache keys in a distributed system, standard hashing ($key \\pmod N$) fails when $N$ changes (causing massive cache misses). **Consistent Hashing** map keys and servers to a circular ring, minimizing disruptions when scaling nodes up or down.""",
                    order=0
                ),
                CourseMaterial(
                    course_id=sd_course.id,
                    title="Caching Strategies & Redis",
                    description="Improving latency and reducing database loads with cache systems.",
                    content="""# Caching Strategies & Redis

A cache is a high-speed, temporary data storage layer (often in-memory) that serves data faster than a primary database.

## Caching Patterns

1. **Cache-Aside (Lazy Loading)**:
   - Application queries the cache.
   - If a miss occurs, query the DB, write to the cache, and return the data.
2. **Read-Through**: Cache handles database synchronization automatically.
3. **Write-Through**: Application writes to cache first, which immediately writes to the DB.
4. **Write-Behind (Write-Back)**: Application writes to cache, which updates the DB asynchronously (risk of data loss if cache crashes).

## Cache Eviction Policies

When memory runs full, the cache must evict entries:
- **LRU (Least Recently Used)**: Evicts keys that haven't been accessed for the longest time.
- **LFU (Least Frequently Used)**: Evicts keys with the lowest access count.
- **FIFO (First In First Out)**: Evicts the oldest keys.""",
                    order=1
                )
            ]
            for lesson in sd_lessons:
                db.add(lesson)

        # 3. Data Structures & Algorithms
        dsa_course = db.query(Course).filter(Course.title == "Data Structures & Algorithms").first()
        if dsa_course:
            dsa_lessons = [
                CourseMaterial(
                    course_id=dsa_course.id,
                    title="Arrays & Strings: Two Pointer Techniques",
                    description="Optimizing O(N^2) searches to O(N) using dual pointers.",
                    content="""# Two Pointer Technique

The Two Pointer technique is a common optimization tool for searching sorted arrays or linked lists.

## The Paradigm

Instead of using nested loops ($O(N^2)$ complexity), we maintain two indices (pointers) and move them toward each other or at different speeds ($O(N)$ complexity).

## Common Scenarios

1. **Opposite Directions**: Start one pointer at index 0 and the other at $N-1$. Adjust based on comparison (e.g., Two Sum on a sorted array).
2. **Fast & Slow (Floyd's Cycle Detection)**: Move one pointer 2 steps per iteration and the other 1 step (e.g., finding cycles in a linked list or finding the middle element).

## Example: Two Sum (Sorted Array)

```python
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []
```""",
                    order=0
                )
            ]
            for lesson in dsa_lessons:
                db.add(lesson)

        db.commit()
        print("Course lessons seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding lessons: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_lessons()
