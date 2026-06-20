# CarbonSense

## Making Carbon Visible, Actionable, and Habit-Forming

---

# 1. Project Vision

## Problem Statement

Most people know climate change exists, but they do not understand how their daily activities contribute to carbon emissions.

Existing carbon footprint calculators suffer from three major issues:

1. They provide a one-time score.
2. They present carbon values without context.
3. They fail to create behavioral change.

CarbonSense aims to solve this by transforming abstract carbon data into meaningful, personalized, and actionable experiences.

The objective is not to tell users they emit carbon.

The objective is to make users understand:

* Where emissions come from
* Why emissions matter
* What alternatives exist
* How small actions accumulate into meaningful impact

---

# 2. Core Philosophy

## IMPORTANT

This application is NOT:

* A carbon calculator
* A dashboard-only project
* A graph visualization project
* A sustainability blog

The application IS:

* An awareness platform
* A behavior change platform
* A personalized insight engine
* A gamified sustainability experience

Every feature must answer:

> "Will this help the user make a better future decision?"

If the answer is no, the feature should not be built.

---

# 3. Primary User Persona

## User Type

Urban college student or working professional.

### Typical Characteristics

* Uses food delivery apps
* Travels via bike/car/metro
* Uses electricity regularly
* Purchases products online
* Has little understanding of carbon emissions

### Pain Point

User cannot visualize how everyday decisions affect the environment.

---

# 4. Product Goals

### Goal 1

Increase awareness of personal carbon emissions.

### Goal 2

Provide context instead of raw numbers.

### Goal 3

Suggest realistic improvements.

### Goal 4

Create sustainable habits through gamification.

### Goal 5

Promote friendly social competition.

---

# 5. Key Metrics

Success should not be measured by logins.

Success should be measured by:

* Number of sustainable actions logged
* Weekly emission reduction percentage
* User engagement streak
* Challenge participation rate
* Team leaderboard activity

---

# 6. Core Features

---

## Feature 1: Carbon Footprint Assessment

### Purpose

Collect baseline emission data.

### Inputs

Transportation:

* Car
* Bike
* Metro
* Bus
* Train
* Flight

Food:

* Vegetarian
* Eggetarian
* Mixed
* Meat-heavy

Electricity:

* Monthly units consumed

Shopping:

* Approximate online purchases per month

### Output

Monthly carbon footprint estimate.

### Important

Do not only display a number.

Provide interpretation.

Example:

"You generated approximately 120 kg CO₂ this month."

Context:

"This is equivalent to:

* Driving 480 km in a petrol car
* Running a ceiling fan continuously for 2 months"

---

## Feature 2: Carbon Translator

### Purpose

Convert invisible carbon data into understandable examples.

Examples:

10 kg CO₂ =

* 40 km car travel

50 kg CO₂ =

* One short domestic flight meal impact

100 kg CO₂ =

* Electricity used by a small household for several weeks

Display these comparisons throughout the platform.

---

## Feature 3: Awareness Dashboard

### Sections

#### Carbon Score

Current footprint.

#### Trend Graph

Monthly trend.

#### Category Breakdown

* Transport
* Food
* Electricity
* Shopping

#### Improvement Opportunities

Biggest reduction opportunities.

Example:

"Transportation contributes 52% of your emissions."

---

## Feature 4: AI Sustainability Coach

### Purpose

Generate personalized recommendations.

### AI Inputs

* User profile
* Emission history
* Lifestyle preferences

### AI Outputs

Examples:

"Switching two weekly cab rides to metro could reduce emissions by approximately 15 kg CO₂ per month."

"Replacing one meat meal weekly may reduce annual emissions by approximately 30–50 kg CO₂."

### Constraints

Recommendations must:

* Be realistic
* Be achievable
* Be personalized

Never shame users.

Never use fear-based messaging.

---

## Feature 5: Daily Green Actions

Users can log actions.

Examples:

* Used metro
* Carpooled
* Avoided plastic bottle
* Walked instead of driving
* Used reusable bag

Each action grants:

* Eco Points
* Experience Points

---

## Feature 6: Streak System

Track:

* Daily activity streak
* Weekly streak
* Monthly streak

Reward consistency.

Do not reward one-time extreme actions.

---

## Feature 7: Challenges

Examples:

### No-Car Week

### Plastic-Free Weekend

### Green Commute Challenge

### Sustainable Shopping Challenge

Rewards:

* Points
* Badges
* Leaderboard boosts

---

## Feature 8: Team Competition

Users can create or join teams.

Examples:

* Hostel A

* Hostel B

* Engineering Team

* Design Team

Features:

* Team carbon score
* Team ranking
* Shared goals

---

## Feature 9: Leaderboards

Types:

### Individual

### Team

### Monthly

### All-Time

Ranking based on:

* Reduction percentage
* Actions completed
* Challenge participation

Not solely on carbon score.

---

## Feature 10: Gamified EcoWorld

Most important engagement feature.

### Concept

Every user owns a virtual ecosystem.

Initial State:

* Few trees
* Basic landscape

Positive actions:

* Grow trees
* Improve rivers
* Add wildlife
* Improve sky quality

Negative patterns:

* Dry land
* Pollution
* Smog

The environment visually reflects habits.

---

# 7. AI Features

## Gemini Integration

Purpose:

Generate personalized sustainability advice.

### Prompt Inputs

* Current emissions
* Top emission source
* Recent activities
* Goals

### Output

Short actionable suggestions.

Limit:

Maximum 100 words.

---

## AI Weekly Report

Generated every week.

Includes:

* Progress summary
* Best achievement
* Biggest emission source
* Improvement suggestion

---

# 8. Database Design

## Users

* id
* name
* email
* password
* created_at

---

## CarbonAssessments

* id
* user_id
* transport_score
* food_score
* electricity_score
* shopping_score
* total_score
* created_at

---

## DailyActions

* id
* user_id
* action_name
* carbon_saved
* xp_earned
* created_at

---

## Challenges

* id
* title
* description
* start_date
* end_date

---

## UserChallenges

* id
* user_id
* challenge_id
* progress
* completed

---

## Teams

* id
* name
* description

---

## TeamMembers

* id
* team_id
* user_id

---

## Leaderboards

Generated dynamically.

Do not store rankings.

---

# 9. Tech Stack

Frontend:

* React
* TypeScript
* Tailwind CSS
* Framer Motion

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Authentication:

* JWT

AI:

* Gemini API

Deployment:

* Vercel (Frontend)
* Render/Railway (Backend)
* MongoDB Atlas

Testing:

* Jest
* Playwright

---

# 10. Security Requirements

Mandatory:

* JWT Authentication
* Password Hashing (bcrypt)
* Rate Limiting
* Input Validation
* XSS Protection
* CORS Configuration
* Environment Variables

Never expose API keys.

---

# 11. Non-Functional Requirements

Performance:

* Dashboard load under 2 seconds
* API response under 500ms

Scalability:

* Modular architecture
* Reusable services

Maintainability:

* Clean folder structure
* Type-safe APIs

Accessibility:

* WCAG compliant
* Keyboard navigation support

---

# 12. Features Explicitly Out of Scope

Do NOT implement:

* Carbon credit trading
* Blockchain
* Cryptocurrency rewards
* Real bank integrations
* Real-time IoT tracking
* Government policy modules
* Carbon offset purchasing
* Complex scientific simulations

These add complexity without improving awareness.

---

# 13. Final Product Success Criteria

A successful CarbonSense user should leave the platform thinking:

"I finally understand where my carbon footprint comes from."

"I know exactly which habits matter most."

"I have realistic actions I can take this week."

"I want to come back tomorrow and continue improving."

If those outcomes are achieved, the project has succeeded.
