# Gym ERP - Member App Backend Integration Guide

## Overview

This document provides complete database schemas and integration details for the **Member App** . All data is managed by the Admin ERP and consumed by the Member App.

---

## Database Configuration

```dart
// Supabase Configuration
const supabaseUrl = 'https://wylqgcpsuhnxcllkwjdx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bHFnY3BzdWhueGNsbGt3amR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDYyMjcsImV4cCI6MjA4MDQyMjIyN30.oCODho9R5gv933vnxkToP8VszZBlW8p-QUVmVRpux64';
```

---

## Enums

```sql
-- Status values used across tables
member_status     = 'active' | 'expired' | 'trial'
assignment_status = 'active' | 'completed' | 'cancelled'
payment_status    = 'paid' | 'pending' | 'failed'
payment_type      = 'membership' | 'pt' | 'product'
task_step_status  = 'pending' | 'completed'
meal_time         = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'
body_part         = 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'full-body'
difficulty_level  = 'beginner' | 'intermediate' | 'advanced'
equipment_type    = 'free-weights' | 'machines' | 'bodyweight' | 'mixed'
diet_type         = 'vegetarian' | 'non-vegetarian' | 'vegan' | 'keto' | 'diabetic' | 'gluten-free'
diet_goal         = 'weight-loss' | 'muscle-gain' | 'maintenance' | 'fat-loss' | 'general-fitness'
```

---

## 1. GYM BRANDING

**Table:** `gym_branding`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Gym owner's auth ID |
| gym_name | TEXT | "FitZone Gym" |
| logo_url | TEXT | Logo image URL |
| primary_color | TEXT | "#3b82f6" |
| secondary_color | TEXT | "#1e40af" |
| address | TEXT | Gym location |
| contact_number | TEXT | Phone number |
| website_url | TEXT | Gym website |

**Member App Use:**
- Display gym logo in app header
- Apply theme colors across UI
- Show gym contact info in About/Contact page

**Supabase Query:**
```dart
// Fetch gym branding (for logged-in member)
final response = await supabase
  .from('gym_branding')
  .select()
  .limit(1)
  .single();
```

---

## 2. MEMBERS (Profile)

**Table:** `members`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Member's full name |
| email | TEXT | Email address |
| phone | TEXT | Phone number |
| address | TEXT | Home address |
| emergency_contact | TEXT | Emergency phone |
| photo | TEXT | Profile photo URL |
| plan | TEXT | "12 Month Premium" |
| status | ENUM | 'active' / 'expired' / 'trial' |
| start_date | DATE | Membership start |
| expiry_date | DATE | Membership end |
| payment_due | NUMERIC | Pending amount (₹) |

**Member App Use:**
- Profile screen
- Membership status badge (Active/Expired/Trial)
- Days remaining calculation
- Payment due alerts

**Supabase Query:**
```dart
// Fetch member profile by email
final response = await supabase
  .from('members')
  .select()
  .eq('email', userEmail)
  .single();
```

---

## 3. MEMBER PAYMENTS

**Table:** `member_payments`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| amount | NUMERIC | Payment amount (₹) |
| type | ENUM | 'membership' / 'pt' / 'product' |
| status | ENUM | 'paid' / 'pending' / 'failed' |
| date | DATE | Payment date |
| description | TEXT | "12 Month Premium Membership" |

**Member App Use:**
- Payment history screen
- Invoice/Receipt generation
- Pending payment reminders

**Supabase Query:**
```dart
// Fetch payment history
final response = await supabase
  .from('member_payments')
  .select()
  .eq('member_id', memberId)
  .order('date', ascending: false);
```

---

## 4. WORKOUT ASSIGNMENTS

**Table:** `workout_assignments`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| workout_id | UUID | FK to workouts |
| status | ENUM | 'active' / 'completed' / 'cancelled' |
| assigned_at | TIMESTAMP | When assigned |

**Member App Use:**
- Fetch active workout plans
- Daily workout screen

**Supabase Query:**
```dart
// Fetch assigned workouts with details
final response = await supabase
  .from('workout_assignments')
  .select('''
    *,
    workout:workouts(
      *,
      trainer:trainers(name, photo),
      exercises:workout_exercises(*)
    )
  ''')
  .eq('member_id', memberId)
  .eq('status', 'active');
```

---

## 5. WORKOUTS

**Table:** `workouts`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | "Chest Day Advanced" |
| description | TEXT | Workout description |
| difficulty | ENUM | 'beginner' / 'intermediate' / 'advanced' |
| duration | INTEGER | Duration in minutes |
| body_part | ENUM | Target body part |
| equipment | ENUM | Equipment type |
| thumbnail | TEXT | Image URL |
| video_url | TEXT | Tutorial video URL |
| trainer_id | UUID | FK to trainers |

**Member App Use:**
- Workout detail screen
- Video playback
- Filter by body part

---

## 6. WORKOUT EXERCISES

**Table:** `workout_exercises`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| workout_id | UUID | FK to workouts |
| name | TEXT | "Bench Press" |
| sets | INTEGER | Number of sets |
| reps | TEXT | "8-10" or "To failure" |
| rest | TEXT | "90s" |
| notes | TEXT | Trainer notes |
| order_index | INTEGER | Exercise order |
| animation_url | TEXT | Exercise animation GIF |

**Member App Use:**
- Exercise list in workout
- Animation playback
- Rep/set counters

---

## 7. DIET ASSIGNMENTS

**Table:** `diet_assignments`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| diet_plan_id | UUID | FK to diet_plans |
| status | ENUM | 'active' / 'completed' / 'cancelled' |
| start_date | DATE | Diet start |
| end_date | DATE | Diet end |

**Supabase Query:**
```dart
// Fetch assigned diet plan with meals
final response = await supabase
  .from('diet_assignments')
  .select('''
    *,
    diet_plan:diet_plans(
      *,
      meals:diet_meals(*)
    )
  ''')
  .eq('member_id', memberId)
  .eq('status', 'active')
  .single();
```

---

## 8. DIET PLANS

**Table:** `diet_plans`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | "Weight Loss Basic" |
| diet_type | ENUM | 'vegetarian' / 'non-vegetarian' / etc |
| diet_goal | ENUM | 'weight-loss' / 'muscle-gain' / etc |
| target_calories | INTEGER | 1800 |
| macros_protein | INTEGER | Grams |
| macros_carbs | INTEGER | Grams |
| macros_fat | INTEGER | Grams |
| water_intake | NUMERIC | Liters |
| supplements | TEXT[] | Array of supplements |
| special_instructions | TEXT | Trainer notes |

---

## 9. DIET MEALS

**Table:** `diet_meals`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| diet_plan_id | UUID | FK to diet_plans |
| meal_time | ENUM | 'Breakfast' / 'Lunch' / 'Dinner' / 'Snacks' |
| items | JSONB | Array of food items |

**JSONB items structure:**
```json
[
  {
    "name": "Oatmeal",
    "quantity": "1 cup",
    "calories": 300,
    "protein": 12,
    "carbs": 54,
    "fat": 6,
    "image": "https://..."
  }
]
```

---

## 10. MEMBER ATTENDANCE

**Table:** `member_attendance`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| date | DATE | Check-in date |
| check_in_time | TIME | Arrival time |
| check_out_time | TIME | Departure time (nullable) |

**Member App Use:**
- Attendance history calendar
- Streak tracking
- Self check-in (optional)

**Supabase Query:**
```dart
// Fetch attendance for current month
final response = await supabase
  .from('member_attendance')
  .select()
  .eq('member_id', memberId)
  .gte('date', startOfMonth)
  .lte('date', endOfMonth)
  .order('date', ascending: false);
```

---

## 11. MEMBER MEASUREMENTS

**Table:** `member_measurements`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| date | DATE | Measurement date |
| weight | NUMERIC | Weight in kg |
| height | NUMERIC | Height in cm |
| body_fat | NUMERIC | Body fat % |
| bmi | NUMERIC | Calculated BMI |

**Member App Use:**
- Progress tracking charts
- Weight/BMI trends
- Goal tracking

**Supabase Query:**
```dart
// Fetch measurement history
final response = await supabase
  .from('member_measurements')
  .select()
  .eq('member_id', memberId)
  .order('date', ascending: false)
  .limit(12); // Last 12 entries
```

---

## 12. MEMBER TASK STEPS (Punishment/Bonus)

**Table:** `member_task_steps`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| member_id | UUID | FK to members |
| step_count | INTEGER | Steps to complete (2000-10000) |
| status | ENUM | 'pending' / 'completed' |
| notes | TEXT | Reason from admin |
| assigned_at | TIMESTAMP | When assigned |
| completed_at | TIMESTAMP | When completed |

**Member App Use:**
- Pending tasks alert on home
- Step counter integration
- Mark as complete

**Supabase Query:**
```dart
// Fetch pending step tasks
final response = await supabase
  .from('member_task_steps')
  .select()
  .eq('member_id', memberId)
  .eq('status', 'pending')
  .order('assigned_at', ascending: false);

// Mark task as completed
await supabase
  .from('member_task_steps')
  .update({
    'status': 'completed',
    'completed_at': DateTime.now().toIso8601String()
  })
  .eq('id', taskId);
```

---

## 13. TRAINERS

**Table:** `trainers`

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Trainer's name |
| photo | TEXT | Profile photo URL |
| specialization | TEXT | "Strength Training" |

**Member App Use:**
- Display trainer info on workout/diet cards
- Trainer profiles

---

## Authentication Flow

```dart
// 1. Member Login (via email/password or OTP)
final response = await supabase.auth.signInWithPassword(
  email: email,
  password: password,
);

// 2. Get member profile
final member = await supabase
  .from('members')
  .select()
  .eq('email', response.user.email)
  .single();

// 3. Store member_id for all future queries
SharedPreferences prefs = await SharedPreferences.getInstance();
prefs.setString('member_id', member['id']);
```

---

## Error Handling

```dart
try {
  final response = await supabase.from('members').select()...
} on PostgrestException catch (e) {
  // Handle database errors
  print('Database error: ${e.message}');
} on AuthException catch (e) {
  // Handle auth errors
  print('Auth error: ${e.message}');
}
```

---

## Real-time Subscriptions (Optional)

```dart
// Listen for new task assignments
supabase
  .from('member_task_steps')
  .stream(primaryKey: ['id'])
  .eq('member_id', memberId)
  .listen((data) {
    // Update UI with new tasks
  });
```
